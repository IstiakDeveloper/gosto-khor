<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Somiti;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        ]);

        // Create somiti
        Somiti::create([
            'organization_id' => $organization->id,
            'name' => $validated['name'],
            'type' => $validated['type'],
            'collection_day' => $validated['collection_day'] ?? null,
            'amount' => $validated['amount'],
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

        $somiti->load(['members' => function ($query) {
            $query->withPivot('due_amount', 'is_active');
        }]);

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

        // Get next collection date
        $nextCollectionDate = $this->getNextCollectionDate($somiti);

        return Inertia::render('organization/somitis/show', [
            'somiti' => $somiti,
            'latestPayments' => $latestPayments,
            'totalDue' => $totalDue,
            'totalPaid' => $totalPaid,
            'nextCollectionDate' => $nextCollectionDate ? $nextCollectionDate->format('Y-m-d') : null,
            'nextCollectionDay' => $nextCollectionDate ? $nextCollectionDate->format('l') : null,
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
            'is_active' => 'required|boolean',
        ]);

        $somiti->update($validated);

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
            $query->where(function($q) use ($searchTerm) {
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

        // Add members to somiti with zero due amount
        foreach ($validated['member_ids'] as $memberId) {
            $somiti->members()->attach($memberId, [
                'due_amount' => 0,
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

                // Update due amount if payment is pending
                if ($status === 'pending') {
                    $somitiMember = DB::table('somiti_members')
                        ->where('somiti_id', $somiti->id)
                        ->where('member_id', $memberId)
                        ->first();

                    if ($somitiMember) {
                        DB::table('somiti_members')
                            ->where('somiti_id', $somiti->id)
                            ->where('member_id', $memberId)
                            ->update([
                                'due_amount' => $somitiMember->due_amount + $amount,
                            ]);
                    }
                }
            }

            return redirect()->route('organization.somitis.payments', $somiti)
                ->with('success', 'Collection processed successfully.');
        });
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
}
