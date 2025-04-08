<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the user profile.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = auth()->user();
        $user->load('organization');

        return Inertia::render('organization/profile/index', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the user profile.
     *
     * @return \Inertia\Response
     */
    public function edit()
    {
        $user = auth()->user();

        return Inertia::render('organization/profile/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the user profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
        ]);

        // Upload photo if provided
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }

            $photoPath = $request->file('photo')->store('users/photos', 'public');
            $validated['photo'] = $photoPath;
        }

        $user->update($validated);

        return redirect()->route('organization.profile.index')
            ->with('success', 'Profile updated successfully.');
    }

    /**
     * Show the form for changing the password.
     *
     * @return \Inertia\Response
     */
    public function editPassword()
    {
        return Inertia::render('organization/profile/password');
    }

    /**
     * Update the user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.']);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('organization.profile.index')
            ->with('success', 'Password updated successfully.');
    }

    /**
     * Show organization details.
     *
     * @return \Inertia\Response
     */
    public function organization()
    {
        $user = auth()->user();
        $organization = $user->organization;
        $organization->load('activeSubscription.plan');

        return Inertia::render('organization/profile/organization', [
            'organization' => $organization,
        ]);
    }

    /**
     * Show the form for editing the organization.
     *
     * @return \Inertia\Response
     */
    public function editOrganization()
    {
        $user = auth()->user();
        $organization = $user->organization;

        return Inertia::render('organization/profile/edit-organization', [
            'organization' => $organization,
        ]);
    }

    /**
     * Update the organization.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateOrganization(Request $request)
    {
        $user = auth()->user();
        $organization = $user->organization;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
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

        return redirect()->route('organization.profile.organization')
            ->with('success', 'Organization updated successfully.');
    }

    /**
     * Show team members (users in organization).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function team(Request $request)
    {
        $user = auth()->user();
        $organization = $user->organization;

        $query = User::where('organization_id', $organization->id);

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // Sort
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $team = $query->with('roles')->paginate(10)->withQueryString();

        return Inertia::render('organization/profile/team', [
            'team' => $team,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new team member.
     *
     * @return \Inertia\Response
     */
    public function createTeamMember()
    {
        $organization = auth()->user()->organization;

        // Check if user can create more team members based on subscription
        $subscription = $organization->activeSubscription;
        if (!$subscription) {
            return back()->with('error', 'No active subscription found. Please contact administrator.');
        }

        $currentTeamCount = User::where('organization_id', $organization->id)->count();
        $maxTeamMembers = $subscription->plan->max_users ?? 5; // Default to 5 if not specified

        if ($currentTeamCount >= $maxTeamMembers) {
            return back()->with('error', "You have reached the maximum number of team members allowed in your subscription plan ({$maxTeamMembers}). Please upgrade your plan to add more team members.");
        }

        return Inertia::render('organization/profile/create-team-member');
    }

    /**
     * Store a newly created team member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeTeamMember(Request $request)
    {
        $organization = auth()->user()->organization;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'organization_id' => $organization->id,
            'is_admin' => false,
            'phone' => $validated['phone'] ?? null,
        ]);

        // Add staff role
        $staffRole = \App\Models\Role::where('slug', 'organization-staff')->first();
        if ($staffRole) {
            $user->roles()->attach($staffRole->id);
        }

        return redirect()->route('organization.profile.team')
            ->with('success', 'Team member added successfully.');
    }
}
