<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{

    /**
     * Display a listing of the subscriptions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Subscription::query()
            ->with(['organization', 'plan']);

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->whereHas('organization', function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('domain', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->where('is_active', true)
                    ->where('end_date', '>=', now());
            } elseif ($status === 'expired') {
                $query->where('end_date', '<', now());
            }
        }

        // Sort
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $subscriptions = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new subscription.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $organizations = Organization::all();
        $plans = SubscriptionPlan::active()->get();

        return Inertia::render('admin/subscriptions/create', [
            'organizations' => $organizations,
            'plans' => $plans,
        ]);
    }

    /**
     * Store a newly created subscription in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'start_date' => 'required|date',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|max:255',
            'transaction_id' => 'nullable|string|max:255',
        ]);

        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);

        // Calculate end date based on billing cycle
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = $startDate->copy()->addMonths($plan->duration_in_months);

        // Deactivate existing active subscriptions for this organization
        Subscription::where('organization_id', $validated['organization_id'])
            ->where('is_active', true)
            ->update(['is_active' => false]);

        // Create new subscription
        Subscription::create([
            'organization_id' => $validated['organization_id'],
            'subscription_plan_id' => $validated['subscription_plan_id'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_active' => true,
            'status' => 'active',
            'amount_paid' => $validated['amount_paid'],
            'payment_method' => $validated['payment_method'] ?? null,
            'transaction_id' => $validated['transaction_id'] ?? null,
        ]);

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription created successfully.');
    }

    /**
     * Display the specified subscription.
     *
     * @param  \App\Models\Subscription  $subscription
     * @return \Inertia\Response
     */
    public function show(Subscription $subscription)
    {
        $subscription->load(['organization', 'plan']);

        return Inertia::render('admin/subscriptions/show', [
            'subscription' => $subscription,
        ]);
    }

    /**
     * Show the form for editing the specified subscription.
     *
     * @param  \App\Models\Subscription  $subscription
     * @return \Inertia\Response
     */
    public function edit(Subscription $subscription)
    {
        $subscription->load(['organization', 'plan']);
        $plans = SubscriptionPlan::active()->get();

        return Inertia::render('admin/subscriptions/edit', [
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }

    /**
     * Update the specified subscription in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Subscription  $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Subscription $subscription)
    {
        $validated = $request->validate([
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'required|boolean',
            'status' => 'required|string',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|max:255',
            'transaction_id' => 'nullable|string|max:255',
        ]);

        // If making this subscription active, deactivate others
        if ($validated['is_active'] && !$subscription->is_active) {
            Subscription::where('organization_id', $subscription->organization_id)
                ->where('id', '!=', $subscription->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $subscription->update($validated);

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription updated successfully.');
    }

    /**
     * Remove the specified subscription from storage.
     *
     * @param  \App\Models\Subscription  $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription deleted successfully.');
    }

    /**
     * Display a listing of the subscription plans.
     *
     * @return \Inertia\Response
     */
    public function plans()
    {
        $plans = SubscriptionPlan::all();

        return Inertia::render('admin/subscriptions/plans/index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show the form for creating a new subscription plan.
     *
     * @return \Inertia\Response
     */
    public function createPlan()
    {
        return Inertia::render('admin/subscriptions/plans/create');
    }

    /**
     * Store a newly created subscription plan in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,quarterly,yearly',
            'max_organizations' => 'required|integer|min:1',
            'max_somitis' => 'required|integer|min:1',
            'max_members' => 'required|integer|min:1',
            'features' => 'nullable|array',
            'is_active' => 'required|boolean',
        ]);

        SubscriptionPlan::create($validated);

        return redirect()->route('admin.subscriptions.plans')
            ->with('success', 'Subscription plan created successfully.');
    }

    /**
     * Show the form for editing the specified subscription plan.
     *
     * @param  \App\Models\SubscriptionPlan  $plan
     * @return \Inertia\Response
     */
    public function editPlan(SubscriptionPlan $plan)
    {
        return Inertia::render('admin/subscriptions/plans/edit', [
            'plan' => $plan,
        ]);
    }

    /**
     * Update the specified subscription plan in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SubscriptionPlan  $plan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePlan(Request $request, SubscriptionPlan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,quarterly,yearly',
            'max_organizations' => 'required|integer|min:1',
            'max_somitis' => 'required|integer|min:1',
            'max_members' => 'required|integer|min:1',
            'features' => 'nullable|array',
            'is_active' => 'required|boolean',
        ]);

        $plan->update($validated);

        return redirect()->route('admin.subscriptions.plans')
            ->with('success', 'Subscription plan updated successfully.');
    }

    /**
     * Remove the specified subscription plan from storage.
     *
     * @param  \App\Models\SubscriptionPlan  $plan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroyPlan(SubscriptionPlan $plan)
    {
        // Check if there are subscriptions using this plan
        if ($plan->subscriptions()->exists()) {
            return back()->with('error', 'Cannot delete plan as it has active subscriptions.');
        }

        $plan->delete();

        return redirect()->route('admin.subscriptions.plans')
            ->with('success', 'Subscription plan deleted successfully.');
    }
}
