<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{

    /**
     * Display a listing of the roles.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Role::query()->with('permissions');

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('slug', 'like', "%{$searchTerm}%");
            });
        }

        // Sort
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $roles = $query->withCount('users')->paginate(10)->withQueryString();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new role.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $permissions = Permission::all();

        return Inertia::render('admin/roles/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Create role
        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
        ]);

        // Assign permissions
        if (isset($validated['permissions'])) {
            $role->permissions()->attach($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     *
     * @param  \App\Models\Role  $role
     * @return \Inertia\Response
     */
    public function show(Role $role)
    {
        $role->load('permissions');
        $role->loadCount('users');

        return Inertia::render('admin/roles/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     *
     * @param  \App\Models\Role  $role
     * @return \Inertia\Response
     */
    public function edit(Role $role)
    {
        $role->load('permissions');
        $permissions = Permission::all();

        return Inertia::render('admin/roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $role->permissions->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified role in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->ignore($role->id),
            ],
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Update role
        $role->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
        ]);

        // Update permissions
        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        } else {
            $role->permissions()->detach();
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Role $role)
    {
        // Check if role has users
        if ($role->users()->exists()) {
            return back()->with('error', 'Cannot delete role as it has users assigned.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    /**
     * Generate a slug from the role name.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateSlug(Request $request)
    {
        $name = $request->input('name');
        $slug = Str::slug($name);

        // Check if slug exists
        $count = Role::where('slug', $slug)->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        return response()->json(['slug' => $slug]);
    }
}
