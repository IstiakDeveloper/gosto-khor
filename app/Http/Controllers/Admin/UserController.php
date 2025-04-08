<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{

    /**
     * Display a listing of the users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->with(['organization', 'roles']);

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by organization
        if ($request->has('organization_id') && $request->input('organization_id')) {
            $query->where('organization_id', $request->input('organization_id'));
        }

        // Filter by role
        if ($request->has('role') && $request->input('role')) {
            $role = $request->input('role');
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('slug', $role);
            });
        }

        // Sort
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(10)->withQueryString();
        $organizations = Organization::all();
        $roles = Role::all();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'organizations' => $organizations,
            'roles' => $roles,
            'filters' => $request->only(['search', 'organization_id', 'role', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $organizations = Organization::all();
        $roles = Role::all();

        return Inertia::render('admin/users/create', [
            'organizations' => $organizations,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'organization_id' => 'nullable|exists:organizations,id',
            'is_admin' => 'required|boolean',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        // Upload photo if provided
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('users/photos', 'public');
            $validated['photo'] = $photoPath;
        }

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'organization_id' => $validated['organization_id'] ?? null,
            'is_admin' => $validated['is_admin'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'photo' => $validated['photo'] ?? null,
        ]);

        // Assign roles
        if (isset($validated['roles'])) {
            $user->roles()->attach($validated['roles']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function show(User $user)
    {
        $user->load(['organization', 'roles']);

        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function edit(User $user)
    {
        $user->load('roles');
        $organizations = Organization::all();
        $roles = Role::all();

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'organizations' => $organizations,
            'roles' => $roles,
            'userRoles' => $user->roles->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'organization_id' => 'nullable|exists:organizations,id',
            'is_admin' => 'required|boolean',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
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

        // Update user
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'organization_id' => $validated['organization_id'] ?? null,
            'is_admin' => $validated['is_admin'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'photo' => $validated['photo'] ?? $user->photo,
        ]);

        // Update roles
        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        } else {
            $user->roles()->detach();
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user)
    {
        // Cannot delete yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Delete photo if exists
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Show the form for changing user's password.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function editPassword(User $user)
    {
        return Inertia::render('admin/users/password', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'Password updated successfully.');
    }
}
