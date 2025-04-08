<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrganizationController extends Controller
{

    /**
     * Display a listing of the organizations.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Organization::query()->with('activeSubscription.plan');

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('domain', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        // Sort
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $organizations = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/organizations/index', [
            'organizations' => $organizations,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new organization.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $plans = SubscriptionPlan::active()->get();

        return Inertia::render('admin/organizations/create', [
            'plans' => $plans,
        ]);
    }

    /**
     * Store a newly created organization in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:organizations',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            // Upload logo if provided
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('organizations/logos', 'public');
                $validated['logo'] = $logoPath;
            }

            // Create organization
            $organization = Organization::create([
                'name' => $validated['name'],
                'domain' => $validated['domain'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'logo' => $validated['logo'] ?? null,
            ]);

            // Create subscription
            $plan = SubscriptionPlan::findOrFail($validated['plan_id']);

            Subscription::create([
                'organization_id' => $organization->id,
                'subscription_plan_id' => $plan->id,
                'start_date' => now(),
                'end_date' => now()->addMonths($plan->duration_in_months),
                'is_active' => true,
                'status' => 'active',
                'amount_paid' => $plan->price,
            ]);

            return redirect()->route('admin.organizations.index')
                ->with('success', 'Organization created successfully.');
        });
    }

    /**
     * Display the specified organization.
     *
     * @param  \App\Models\Organization  $organization
     * @return \Inertia\Response
     */
    public function show(Organization $organization)
    {
        $organization->load([
            'activeSubscription.plan',
            'subscriptions.plan',
            'somitis' => function ($query) {
                $query->withCount('members');
            },
            'users',
        ]);

        return Inertia::render('admin/organizations/show', [
            'organization' => $organization,
        ]);
    }

    /**
     * Show the form for editing the specified organization.
     *
     * @param  \App\Models\Organization  $organization
     * @return \Inertia\Response
     */
    public function edit(Organization $organization)
    {
        $plans = SubscriptionPlan::active()->get();

        $organization->load('activeSubscription');

        return Inertia::render('admin/organizations/edit', [
            'organization' => $organization,
            'plans' => $plans,
        ]);
    }

    /**
     * Update the specified organization in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Organization  $organization
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => [
                'required',
                'string',
                'max:255',
                Rule::unique('organizations')->ignore($organization->id),
            ],
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        // Upload logo if provided
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($organization->logo) {
                Storage::disk('public')->delete($organization->logo);
            }

            $logoPath = $request->file('logo')->store('organizations/logos', 'public');
            $validated['logo'] = $logoPath;
        }

        $organization->update($validated);

        return redirect()->route('admin.organizations.index')
            ->with('success', 'Organization updated successfully.');
    }

    /**
     * Remove the specified organization from storage.
     *
     * @param  \App\Models\Organization  $organization
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Organization $organization)
    {
        // Delete logo if exists
        if ($organization->logo) {
            Storage::disk('public')->delete($organization->logo);
        }

        $organization->delete();

        return redirect()->route('admin.organizations.index')
            ->with('success', 'Organization deleted successfully.');
    }
}
