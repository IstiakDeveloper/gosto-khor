<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Somiti;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SomitiController extends Controller
{
    /**
     * Display a listing of the somitis.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Check if automatic processing should be run
        $this->processAllDueCollections();


        $organization = auth()->user()->organization;

        $query = Somiti::where('organization_id', $organization->id);

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', "%{$searchTerm}%");
        }

        // Filter by type
        if ($request->has('type') && $request->input('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filter by status
        if ($request->has('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Sort
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $somitis = $query->withCount('members')->paginate(10)->withQueryString();

        return Inertia::render('organization/somitis/index', [
            'somitis' => $somitis,
            'filters' => $request->only(['search', 'type', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Add a scheduled task to run daily and process all due collections
     * This would be in a separate command class
     */
    public function processAllDueCollections()
    {

        // Get all active somitis
        $somitis = Somiti::where('is_active', true)->get();

        $today = Carbon::now();

        foreach ($somitis as $somiti) {
            // Check if today is a collection day for this somiti
            $isCollectionDay = false;

            if ($somiti->type === 'daily') {
                $isCollectionDay = true;
            } elseif ($somiti->type === 'weekly' && $somiti->collection_day !== null) {
                $isCollectionDay = ($today->dayOfWeek == $somiti->collection_day);
            } elseif ($somiti->type === 'monthly' && $somiti->collection_day !== null) {
                $isCollectionDay = ($today->day == $somiti->collection_day);
            }

            // If it's a collection day, add due to all active members
            if ($isCollectionDay) {
                $this->addDueToActiveMembers($somiti, $today->format('Y-m-d'));

                // Create a system notification or log for the admin
                // You could implement a notification system for this
                Log::info("Automatic dues added for somiti: {$somiti->name} on {$today->format('Y-m-d')}");
            }
        }
    }
    /**
     * Show the form for creating a new somiti.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('organization/somitis/create');
    }

    /**
     * Store a newly created somiti in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $organization = auth()->user()->organization;

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('somitis')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization->id);
                }),
            ],
            'type' => 'required|in:monthly,weekly,daily',
            'collection_day' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->input('type') === 'monthly' && ($value < 1 || $value > 31)) {
                        $fail('The day of month must be between 1 and 31.');
                    }
                    if ($request->input('type') === 'weekly' && ($value < 0 || $value > 6)) {
                        $fail('The day of week must be between 0 (Sunday) and 6 (Saturday).');
                    }
                },
            ],
            'amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
        ]);

        // Create somiti
        Somiti::create([
            'organization_id' => $organization->id,
            'name' => $validated['name'],
            'type' => $validated['type'],
            'collection_day' => $validated['collection_day'] ?? null,
            'amount' => $validated['amount'],
            'start_date' => $validated['start_date'],
            'is_active' => true,
        ]);

        return redirect()->route('organization.somitis.index')
            ->with('success', 'Somiti created successfully.');
    }

    /**
     * Display the specified somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Inertia\Response
     */
    public function show(Somiti $somiti)
    {
        $this->checkSomitiAccess($somiti);

        $somiti->load([
            'members' => function ($query) {
                $query->withPivot('due_amount', 'is_active');
            }
        ]);

        // Get latest 5 payments
        $latestPayments = Payment::where('somiti_id', $somiti->id)
            ->with('member')
            ->latest('payment_date')
            ->take(5)
            ->get();

        // Get total due amount
        $totalDue = $somiti->members()->sum('due_amount');

        // Get total paid amount
        $totalPaid = Payment::where('somiti_id', $somiti->id)
            ->where('status', 'paid')
            ->sum('amount');

        // Count active members
        $activeMembers = $somiti->members()->wherePivot('is_active', true)->count();

        // Get next collection date
        $nextCollectionDate = $this->getNextCollectionDate($somiti);

        // Get collection history
        $collectionDates = $this->getPastCollectionDates($somiti);
        $totalCollections = count($collectionDates);

        // Calculate the CORRECT total expected amount
        $totalExpected = $somiti->amount * $activeMembers * max(1, $totalCollections);

        // The correct total is what was expected to be collected
        // NOT due + paid (which double counts)
        $totalAmount = $totalExpected;

        return Inertia::render('organization/somitis/show', [
            'somiti' => $somiti,
            'latestPayments' => $latestPayments,
            'totalDue' => $totalDue,
            'totalPaid' => $totalPaid,
            'totalAmount' => $totalAmount,
            'nextCollectionDate' => $nextCollectionDate ? $nextCollectionDate->format('Y-m-d') : null,
            'nextCollectionDay' => $nextCollectionDate ? $nextCollectionDate->format('l') : null,
            'totalCollections' => $totalCollections,
        ]);
    }

    /**
     * Show the form for editing the specified somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Inertia\Response
     */
    public function edit(Somiti $somiti)
    {
        $this->checkSomitiAccess($somiti);

        return Inertia::render('organization/somitis/edit', [
            'somiti' => $somiti,
        ]);
    }

    /**
     * Update the specified somiti in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Somiti  $somiti
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Somiti $somiti)
    {
        $this->checkSomitiAccess($somiti);

        $organization = auth()->user()->organization;

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('somitis')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization->id);
                })->ignore($somiti->id),
            ],
            'type' => 'required|in:monthly,weekly,daily',
            'collection_day' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->input('type') === 'monthly' && ($value < 1 || $value > 31)) {
                        $fail('The day of month must be between 1 and 31.');
                    }
                    if ($request->input('type') === 'weekly' && ($value < 0 || $value > 6)) {
                        $fail('The day of week must be between 0 (Sunday) and 6 (Saturday).');
                    }
                },
            ],
            'amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'is_active' => 'required|boolean',
        ]);

        // Special handling if amount has changed
        $amountChanged = $somiti->amount != $validated['amount'];

        $somiti->update($validated);

        // If amount has changed, we need to recalculate dues for all members
        if ($amountChanged && $request->input('recalculate_dues', false)) {
            $this->recalculateAllMemberDues($somiti);
        }

        return redirect()->route('organization.somitis.index')
            ->with('success', 'Somiti updated successfully.');
    }

    /**
     * Remove the specified somiti from storage.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Somiti $somiti)
    {
        $this->checkSomitiAccess($somiti);

        // Check if somiti has members
        if ($somiti->members()->exists()) {
            return back()->with('error', 'Cannot delete somiti as it has members.');
        }

        // Check if somiti has payments
        if ($somiti->payments()->exists()) {
            return back()->with('error', 'Cannot delete somiti as it has payments.');
        }

        $somiti->delete();

        return redirect()->route('organization.somitis.index')
            ->with('success', 'Somiti deleted successfully.');
    }

    /**
     * Display members for the specified somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function members(Somiti $somiti, Request $request)
    {
        $this->checkSomitiAccess($somiti);

        $query = $somiti->members();

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->wherePivot('is_active', true);
            } elseif ($status === 'inactive') {
                $query->wherePivot('is_active', false);
            }
        }

        // Sort
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');

        if ($sortField === 'due_amount') {
            $query->orderByPivot('due_amount', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        // Remove join_date from here
        $members = $query->withPivot('due_amount', 'is_active')->paginate(10)->withQueryString();

        return Inertia::render('organization/somitis/members', [
            'somiti' => $somiti,
            'members' => $members,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show form to add members to the somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Inertia\Response
     */
    public function addMembersForm(Somiti $somiti)
    {
        $this->checkSomitiAccess($somiti);

        $organization = auth()->user()->organization;

        // Get members not in this somiti
        $members = Member::where('organization_id', $organization->id)
            ->whereDoesntHave('somitis', function ($query) use ($somiti) {
                $query->where('somiti_id', $somiti->id);
            })
            ->get();

        return Inertia::render('organization/somitis/add-members', [
            'somiti' => $somiti,
            'availableMembers' => $members,
        ]);
    }

    /**
     * Add members to the somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addMembers(Somiti $somiti, Request $request)
    {
        $this->checkSomitiAccess($somiti);

        $validated = $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:members,id',
        ]);

        $currentDate = Carbon::now();

        // Add members to somiti with calculated initial due amount
        foreach ($validated['member_ids'] as $memberId) {
            // Calculate due amount based on somiti start date and somiti type
            $dueAmount = $this->calculateInitialDueAmount($somiti, Carbon::parse($somiti->start_date), $currentDate);

            $somiti->members()->attach($memberId, [
                'due_amount' => $dueAmount,
                'is_active' => true,
            ]);
        }

        return redirect()->route('organization.somitis.members', $somiti)
            ->with('success', 'Members added to somiti successfully.');
    }

    /**
     * Remove a member from the somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \App\Models\Member  $member
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeMember(Somiti $somiti, Member $member)
    {
        $this->checkSomitiAccess($somiti);

        // Check if member has payments in this somiti
        $hasPayments = Payment::where('somiti_id', $somiti->id)
            ->where('member_id', $member->id)
            ->exists();

        if ($hasPayments) {
            return back()->with('error', 'Cannot remove member as they have payments in this somiti.');
        }

        // Get due amount
        $somitiMember = DB::table('somiti_members')
            ->where('somiti_id', $somiti->id)
            ->where('member_id', $member->id)
            ->first();

        // Check if member has due
        if ($somitiMember && $somitiMember->due_amount > 0) {
            return back()->with('error', 'Cannot remove member as they have outstanding dues.');
        }

        // Remove member from somiti
        $somiti->members()->detach($member->id);

        return back()->with('success', 'Member removed from somiti successfully.');
    }

    /**
     * Update member status in the somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \App\Models\Member  $member
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateMemberStatus(Somiti $somiti, Member $member, Request $request)
    {
        $this->checkSomitiAccess($somiti);

        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        // Update pivot record
        $somiti->members()->updateExistingPivot($member->id, [
            'is_active' => $validated['is_active'],
        ]);

        return back()->with('success', 'Member status updated successfully.');
    }

    /**
     * Show payments for the specified somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function payments(Somiti $somiti, Request $request)
    {
        $this->checkSomitiAccess($somiti);

        $query = Payment::where('somiti_id', $somiti->id)->with('member');

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->whereHas('member', function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by date range
        if ($request->has('date_from') && $request->input('date_from')) {
            $query->where('payment_date', '>=', $request->input('date_from'));
        }

        if ($request->has('date_to') && $request->input('date_to')) {
            $query->where('payment_date', '<=', $request->input('date_to'));
        }

        // Filter by status
        if ($request->has('status') && $request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        // Sort
        $sortField = $request->input('sort_field', 'payment_date');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $payments = $query->paginate(10)->withQueryString();

        return Inertia::render('organization/somitis/payments', [
            'somiti' => $somiti,
            'payments' => $payments,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Process collection for the specified somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Inertia\Response
     */
    public function processCollection(Somiti $somiti)
    {
        $this->checkSomitiAccess($somiti);

        // Get active members
        $members = $somiti->members()
            ->wherePivot('is_active', true)
            ->withPivot('due_amount')
            ->get();

        // Get next collection date
        $collectionDate = $this->getNextCollectionDate($somiti);

        if (!$collectionDate) {
            return back()->with('error', 'Could not determine next collection date.');
        }

        // Add previous due to current amount for each member
        foreach ($members as $member) {
            $member->total_due = $member->pivot->due_amount + $somiti->amount;
        }

        return Inertia::render('organization/somitis/process-collection', [
            'somiti' => $somiti,
            'members' => $members,
            'collectionDate' => $collectionDate->format('Y-m-d'),
            'collectionDay' => $collectionDate->format('l'),
        ]);
    }

    /**
     * Save collection for the specified somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function saveCollection(Somiti $somiti, Request $request)
    {
        $this->checkSomitiAccess($somiti);

        $validated = $request->validate([
            'collection_date' => 'required|date',
            'payments' => 'required|array',
            'payments.*.member_id' => 'required|exists:members,id',
            'payments.*.amount' => 'required|numeric|min:0',
            'payments.*.status' => 'required|in:paid,pending',
        ]);

        return DB::transaction(function () use ($somiti, $validated) {
            $collectionDate = $validated['collection_date'];
            $paymentDate = now()->format('Y-m-d');
            $userId = auth()->id();

            // Add standard somiti amount to all active members' due
            $this->addDueToActiveMembers($somiti, $collectionDate);

            foreach ($validated['payments'] as $payment) {
                $memberId = $payment['member_id'];
                $amount = $payment['amount'];
                $status = $payment['status'];

                // Skip if amount is zero
                if ($amount == 0) {
                    continue;
                }

                // Create payment record
                Payment::create([
                    'somiti_id' => $somiti->id,
                    'member_id' => $memberId,
                    'amount' => $amount,
                    'payment_date' => $paymentDate,
                    'collection_date' => $collectionDate,
                    'status' => $status,
                    'created_by' => $userId,
                ]);

                // Update due amount
                $somitiMember = DB::table('somiti_members')
                    ->where('somiti_id', $somiti->id)
                    ->where('member_id', $memberId)
                    ->first();

                if ($somitiMember) {
                    // If paid, reduce the due amount by the payment
                    // If pending, due was already added by addDueToActiveMembers
                    if ($status === 'paid') {
                        DB::table('somiti_members')
                            ->where('somiti_id', $somiti->id)
                            ->where('member_id', $memberId)
                            ->update([
                                'due_amount' => max(0, $somitiMember->due_amount - $amount),
                            ]);
                    }
                }
            }

            return redirect()->route('organization.somitis.payments', $somiti)
                ->with('success', 'Collection processed successfully.');
        });
    }

    /**
     * Update payment status.
     *
     * @param  \App\Models\Payment  $payment
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePaymentStatus(Payment $payment, Request $request)
    {
        $somiti = Somiti::findOrFail($payment->somiti_id);
        $this->checkSomitiAccess($somiti);

        $validated = $request->validate([
            'status' => 'required|in:paid,pending,failed',
        ]);

        $oldStatus = $payment->status;
        $newStatus = $validated['status'];

        // Process status change
        DB::transaction(function () use ($payment, $somiti, $oldStatus, $newStatus) {
            // Update payment status
            $payment->status = $newStatus;
            $payment->save();

            // Get current member due
            $somitiMember = DB::table('somiti_members')
                ->where('somiti_id', $somiti->id)
                ->where('member_id', $payment->member_id)
                ->first();

            if ($somitiMember) {
                $dueAmount = $somitiMember->due_amount;

                // If changing from pending to paid, reduce due
                if ($oldStatus === 'pending' && $newStatus === 'paid') {
                    $dueAmount = max(0, $dueAmount - $payment->amount);
                }
                // If changing from paid to pending, add due
                elseif ($oldStatus === 'paid' && $newStatus === 'pending') {
                    $dueAmount = $dueAmount + $payment->amount;
                }
                // If changing to failed from paid, add due
                elseif ($oldStatus === 'paid' && $newStatus === 'failed') {
                    $dueAmount = $dueAmount + $payment->amount;
                }
                // If changing to failed from pending, no change in due (already counted)

                // Update due amount
                DB::table('somiti_members')
                    ->where('somiti_id', $somiti->id)
                    ->where('member_id', $payment->member_id)
                    ->update([
                        'due_amount' => $dueAmount,
                    ]);
            }
        });

        return back()->with('success', 'Payment status updated successfully.');
    }

    /**
     * Calculate initial due amount for a member joining a somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \Carbon\Carbon  $joinDate
     * @param  \Carbon\Carbon  $currentDate
     * @return float
     */
    private function calculateInitialDueAmount($somiti, $joinDate, $currentDate)
    {
        // If join date is today or in the future, no due amount
        if ($joinDate->greaterThanOrEqualTo($currentDate)) {
            return 0;
        }

        $startDate = max(Carbon::parse($somiti->start_date), $joinDate);
        $collectionDates = $this->getPastCollectionDates($somiti, $startDate, $currentDate);

        // Calculate due based on number of missed collections
        return count($collectionDates) * $somiti->amount;
    }

    /**
     * Get all past collection dates for a somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \Carbon\Carbon|null  $startDate
     * @param  \Carbon\Carbon|null  $endDate
     * @return array
     */
    private function getPastCollectionDates($somiti, $startDate = null, $endDate = null)
    {
        if (!$startDate) {
            $startDate = Carbon::parse($somiti->start_date);
        }

        if (!$endDate) {
            $endDate = Carbon::now();
        }

        $collectionDates = [];
        $currentDate = $startDate->copy();

        // Calculate all collection dates from start to current date
        while ($currentDate->lessThanOrEqualTo($endDate)) {
            if ($somiti->type === 'daily') {
                $collectionDates[] = $currentDate->copy();
                $currentDate->addDay();
            } elseif ($somiti->type === 'weekly' && $somiti->collection_day !== null) {
                if ($currentDate->dayOfWeek == $somiti->collection_day) {
                    $collectionDates[] = $currentDate->copy();
                }
                $currentDate->addDay();
            } elseif ($somiti->type === 'monthly' && $somiti->collection_day !== null) {
                // For monthly collections, add if it's the collection day of the month
                if ($currentDate->day == $somiti->collection_day) {
                    $collectionDates[] = $currentDate->copy();
                    $currentDate->addMonth()->day(1); // Jump to first day of next month
                } else {
                    // Move to the next day
                    $currentDate->addDay();
                }
            } else {
                // Invalid somiti configuration, break to avoid infinite loop
                break;
            }
        }

        return $collectionDates;
    }

    /**
     * Add due to all active members for a collection.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  string  $collectionDate
     * @return void
     */
    private function addDueToActiveMembers($somiti, $collectionDate)
    {
        // Get all active members
        $activeMembers = $somiti->members()
            ->wherePivot('is_active', true)
            ->withPivot('due_amount')
            ->get();

        // Begin transaction to ensure all updates are atomic
        DB::beginTransaction();

        try {
            foreach ($activeMembers as $member) {
                // Add somiti amount to the member's due
                DB::table('somiti_members')
                    ->where('somiti_id', $somiti->id)
                    ->where('member_id', $member->id)
                    ->update([
                        'due_amount' => $member->pivot->due_amount + $somiti->amount,
                    ]);
            }

            // If we want to log this collection
            DB::table('collection_logs')->insert([
                'somiti_id' => $somiti->id,
                'collection_date' => $collectionDate,
                'amount' => $somiti->amount,
                'active_members' => $activeMembers->count(),
                'total_expected' => $somiti->amount * $activeMembers->count(),
                'processed_at' => now(),
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Recalculate dues for all members in a somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return void
     */
    private function recalculateAllMemberDues($somiti)
    {
        $members = $somiti->members()->withPivot('join_date')->get();
        $currentDate = Carbon::now();

        foreach ($members as $member) {
            $joinDate = Carbon::parse($member->pivot->join_date ?? $somiti->start_date);

            // Calculate total expected payments
            $expectedAmount = $this->calculateInitialDueAmount($somiti, $joinDate, $currentDate);

            // Get total paid amount
            $paidAmount = Payment::where('somiti_id', $somiti->id)
                ->where('member_id', $member->id)
                ->where('status', 'paid')
                ->sum('amount');

            // Calculate new due amount
            $newDueAmount = max(0, $expectedAmount - $paidAmount);

            // Update member due
            DB::table('somiti_members')
                ->where('somiti_id', $somiti->id)
                ->where('member_id', $member->id)
                ->update([
                    'due_amount' => $newDueAmount,
                ]);
        }
    }

    /**
     * Get the next collection date for a somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Carbon\Carbon|null
     */
    private function getNextCollectionDate($somiti)
    {
        $today = now();

        if ($somiti->type === 'daily') {
            return $today->addDay();
        } elseif ($somiti->type === 'weekly' && $somiti->collection_day !== null) {
            $nextDate = $today->copy();
            $daysUntilNextCollection = ($somiti->collection_day - $today->dayOfWeek + 7) % 7;
            if ($daysUntilNextCollection === 0) {
                $daysUntilNextCollection = 7; // If today is the collection day, get next week
            }
            return $nextDate->addDays($daysUntilNextCollection);
        } elseif ($somiti->type === 'monthly' && $somiti->collection_day !== null) {
            $nextDate = $today->copy();
            if ($today->day > $somiti->collection_day) {
                $nextDate = $nextDate->addMonth();
            }

            // Handle months with fewer days
            $daysInMonth = $nextDate->daysInMonth;
            $collectionDay = min($somiti->collection_day, $daysInMonth);

            return $nextDate->day($collectionDay);
        }

        return null;
    }

    /**
     * Check if the authenticated user has access to the specified somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return void
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    private function checkSomitiAccess($somiti)
    {
        $organization = auth()->user()->organization;

        if ($somiti->organization_id !== $organization->id) {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Generate a summary report for the somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Inertia\Response
     */
    public function generateReport(Somiti $somiti, Request $request)
    {
        $this->checkSomitiAccess($somiti);

        $dateFrom = $request->input('date_from') ? Carbon::parse($request->input('date_from')) : Carbon::now()->subMonths(3);
        $dateTo = $request->input('date_to') ? Carbon::parse($request->input('date_to')) : Carbon::now();

        // Get all members with their dues
        $members = $somiti->members()
            ->withPivot('due_amount', 'is_active', 'join_date')
            ->get();

        // Get all payments within date range
        $payments = Payment::where('somiti_id', $somiti->id)
            ->whereBetween('payment_date', [$dateFrom->format('Y-m-d'), $dateTo->format('Y-m-d')])
            ->get()
            ->groupBy('member_id');

        // Calculate stats for each member
        foreach ($members as $member) {
            $memberPayments = $payments[$member->id] ?? collect();

            $member->total_paid = $memberPayments->where('status', 'paid')->sum('amount');
            $member->pending_payments = $memberPayments->where('status', 'pending')->sum('amount');
            $member->payment_count = $memberPayments->where('status', 'paid')->count();
        }

        // Calculate somiti stats
        $totalDue = $members->sum('pivot.due_amount');
        $totalPaid = Payment::where('somiti_id', $somiti->id)
            ->where('status', 'paid')
            ->sum('amount');
        $totalPending = Payment::where('somiti_id', $somiti->id)
            ->where('status', 'pending')
            ->sum('amount');

        // Get collection history grouped by month
        $monthlyStats = Payment::where('somiti_id', $somiti->id)
            ->whereBetween('payment_date', [$dateFrom->format('Y-m-d'), $dateTo->format('Y-m-d')])
            ->selectRaw('YEAR(payment_date) as year, MONTH(payment_date) as month, SUM(amount) as total_amount, COUNT(*) as payment_count')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        foreach ($monthlyStats as $stat) {
            $stat->month_name = Carbon::createFromDate($stat->year, $stat->month, 1)->format('F Y');
        }

        return Inertia::render('organization/somitis/report', [
            'somiti' => $somiti,
            'members' => $members,
            'totalDue' => $totalDue,
            'totalPaid' => $totalPaid,
            'totalPending' => $totalPending,
            'monthlySummary' => $monthlyStats,
            'dateRange' => [
                'from' => $dateFrom->format('Y-m-d'),
                'to' => $dateTo->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Show the collection calendar for a somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Inertia\Response
     */
    public function collectionCalendar(Somiti $somiti, Request $request)
    {
        $this->checkSomitiAccess($somiti);

        $year = $request->input('year', Carbon::now()->year);
        $month = $request->input('month', Carbon::now()->month);

        $startDate = Carbon::createFromDate($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        // Get all collection dates for the month
        $collectionDates = [];

        if ($somiti->type === 'daily') {
            // For daily collection, every day is a collection day
            $currentDate = $startDate->copy();
            while ($currentDate->lte($endDate)) {
                $collectionDates[] = [
                    'date' => $currentDate->format('Y-m-d'),
                    'day' => $currentDate->day,
                ];
                $currentDate->addDay();
            }
        } elseif ($somiti->type === 'weekly' && $somiti->collection_day !== null) {
            // For weekly collection, find all days matching the collection day of week
            $currentDate = $startDate->copy();
            while ($currentDate->lte($endDate)) {
                if ($currentDate->dayOfWeek == $somiti->collection_day) {
                    $collectionDates[] = [
                        'date' => $currentDate->format('Y-m-d'),
                        'day' => $currentDate->day,
                    ];
                }
                $currentDate->addDay();
            }
        } elseif ($somiti->type === 'monthly' && $somiti->collection_day !== null) {
            // For monthly collection, there's only one collection day per month
            if ($somiti->collection_day <= $endDate->daysInMonth) {
                $collectionDate = Carbon::createFromDate($year, $month, $somiti->collection_day);
                $collectionDates[] = [
                    'date' => $collectionDate->format('Y-m-d'),
                    'day' => $collectionDate->day,
                ];
            }
        }

        // Get payments for each collection date
        foreach ($collectionDates as &$collection) {
            $payments = Payment::where('somiti_id', $somiti->id)
                ->where('collection_date', $collection['date'])
                ->count();

            $collection['payment_count'] = $payments;
        }

        // Get previous 3 months and next 3 months for navigation
        $calendarMonths = [];
        $baseDate = Carbon::createFromDate($year, $month, 1);

        for ($i = -3; $i <= 3; $i++) {
            $calendarDate = $baseDate->copy()->addMonths($i);
            $calendarMonths[] = [
                'year' => $calendarDate->year,
                'month' => $calendarDate->month,
                'name' => $calendarDate->format('F Y'),
                'current' => $i === 0,
            ];
        }

        return Inertia::render('organization/somitis/calendar', [
            'somiti' => $somiti,
            'collectionDates' => $collectionDates,
            'calendarMonths' => $calendarMonths,
            'currentYear' => (int) $year,
            'currentMonth' => (int) $month,
            'monthName' => Carbon::createFromDate($year, $month, 1)->format('F Y'),
        ]);
    }
}
