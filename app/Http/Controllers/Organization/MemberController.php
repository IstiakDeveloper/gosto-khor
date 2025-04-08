<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the members.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $organization = auth()->user()->organization;

        $query = Member::where('organization_id', $organization->id);

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('phone', 'like', "%{$searchTerm}%")
                  ->orWhere('address', 'like', "%{$searchTerm}%");
            });
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
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $members = $query->withCount('somitis')->paginate(10)->withQueryString();

        return Inertia::render('organization/members/index', [
            'members' => $members,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new member.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('organization/members/create');
    }

    /**
     * Store a newly created member in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $organization = auth()->user()->organization;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('members')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization->id);
                }),
            ],
            'email' => 'nullable|email|max:255',
            'photo' => 'nullable|image|max:2048',
        ]);

        // Upload photo if provided
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('members/photos', 'public');
            $validated['photo'] = $photoPath;
        }

        // Create member
        Member::create([
            'organization_id' => $organization->id,
            'name' => $validated['name'],
            'address' => $validated['address'] ?? null,
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'photo' => $validated['photo'] ?? null,
            'is_active' => true,
        ]);

        return redirect()->route('organization.members.index')
            ->with('success', 'Member created successfully.');
    }

    /**
     * Display the specified member.
     *
     * @param  \App\Models\Member  $member
     * @return \Inertia\Response
     */
    public function show(Member $member)
    {
        $this->checkMemberAccess($member);

        $member->load(['somitis' => function ($query) {
            $query->withPivot('due_amount', 'is_active');
        }]);

        // Get latest 5 payments
        $latestPayments = Payment::where('member_id', $member->id)
            ->with('somiti')
            ->latest('payment_date')
            ->take(5)
            ->get();

        // Get total due amount
        $totalDue = $member->somitis()->sum('due_amount');

        // Get total paid amount
        $totalPaid = Payment::where('member_id', $member->id)
            ->where('status', 'paid')
            ->sum('amount');

        return Inertia::render('organization/members/show', [
            'member' => $member,
            'somitis' => $member->somitis,
            'latestPayments' => $latestPayments,
            'totalDue' => $totalDue,
            'totalPaid' => $totalPaid,
        ]);
    }

    /**
     * Show the form for editing the specified member.
     *
     * @param  \App\Models\Member  $member
     * @return \Inertia\Response
     */
    public function edit(Member $member)
    {
        $this->checkMemberAccess($member);

        return Inertia::render('organization/members/edit', [
            'member' => $member,
        ]);
    }

    /**
     * Update the specified member in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Member  $member
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Member $member)
    {
        $this->checkMemberAccess($member);

        $organization = auth()->user()->organization;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('members')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization->id);
                })->ignore($member->id),
            ],
            'email' => 'nullable|email|max:255',
            'photo' => 'nullable|image|max:2048',
            'is_active' => 'required|boolean',
        ]);

        // Upload photo if provided
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($member->photo) {
                Storage::disk('public')->delete($member->photo);
            }

            $photoPath = $request->file('photo')->store('members/photos', 'public');
            $validated['photo'] = $photoPath;
        }

        $member->update($validated);

        return redirect()->route('organization.members.index')
            ->with('success', 'Member updated successfully.');
    }

    /**
     * Remove the specified member from storage.
     *
     * @param  \App\Models\Member  $member
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Member $member)
    {
        $this->checkMemberAccess($member);

        // Check if member has somitis
        if ($member->somitis()->exists()) {
            return back()->with('error', 'Cannot delete member as they belong to somitis.');
        }

        // Check if member has payments
        if (Payment::where('member_id', $member->id)->exists()) {
            return back()->with('error', 'Cannot delete member as they have payments.');
        }

        // Delete photo if exists
        if ($member->photo) {
            Storage::disk('public')->delete($member->photo);
        }

        $member->delete();

        return redirect()->route('organization.members.index')
            ->with('success', 'Member deleted successfully.');
    }

    /**
     * Show payments for the specified member.
     *
     * @param  \App\Models\Member  $member
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function payments(Member $member, Request $request)
    {
        $this->checkMemberAccess($member);

        $query = Payment::where('member_id', $member->id)->with('somiti');

        // Filter by somiti
        if ($request->has('somiti_id') && $request->input('somiti_id')) {
            $query->where('somiti_id', $request->input('somiti_id'));
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

        // Get somitis for filter dropdown
        $somitis = $member->somitis;

        return Inertia::render('organization/members/payments', [
            'member' => $member,
            'payments' => $payments,
            'somitis' => $somitis,
            'filters' => $request->only(['somiti_id', 'date_from', 'date_to', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show form for making payment for the member.
     *
     * @param  \App\Models\Member  $member
     * @return \Inertia\Response
     */
    public function makePaymentForm(Member $member)
    {
        $this->checkMemberAccess($member);

        // Get somitis this member belongs to
        $somitis = $member->somitis()
            ->where('somiti_members.is_active', true)
            ->withPivot('due_amount')
            ->get();

        return Inertia::render('organization/members/make-payment', [
            'member' => $member,
            'somitis' => $somitis,
        ]);
    }

    /**
     * Process payment for the member.
     *
     * @param  \App\Models\Member  $member
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processPayment(Member $member, Request $request)
    {
        $this->checkMemberAccess($member);

        $validated = $request->validate([
            'somiti_id' => 'required|exists:somitis,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'nullable|string|max:255',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Check if somiti exists and belongs to organization
        $organization = auth()->user()->organization;
        $somiti = \App\Models\Somiti::where('id', $validated['somiti_id'])
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        // Check if member belongs to somiti
        $somitiMember = \App\Models\SomitiMember::where('somiti_id', $somiti->id)
            ->where('member_id', $member->id)
            ->first();

        if (!$somitiMember) {
            return back()->with('error', 'Member does not belong to this somiti.');
        }

        // Create payment
        $payment = Payment::create([
            'somiti_id' => $somiti->id,
            'member_id' => $member->id,
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'collection_date' => $validated['payment_date'], // Same as payment date for direct payments
            'status' => 'paid',
            'payment_method' => $validated['payment_method'] ?? null,
            'transaction_id' => $validated['transaction_id'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'created_by' => auth()->id(),
        ]);

        // Update due amount
        $newDueAmount = max(0, $somitiMember->due_amount - $validated['amount']);

        $somitiMember->update([
            'due_amount' => $newDueAmount,
        ]);

        return redirect()->route('organization.members.payments', $member)
            ->with('success', 'Payment processed successfully.');
    }

    /**
     * Check if the authenticated user has access to the specified member.
     *
     * @param  \App\Models\Member  $member
     * @return void
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    private function checkMemberAccess($member)
    {
        $organization = auth()->user()->organization;

        if ($member->organization_id !== $organization->id) {
            abort(403, 'Unauthorized action.');
        }
    }
}
