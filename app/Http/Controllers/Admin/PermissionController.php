<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Permission::query();

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

        $permissions = $query->withCount('roles')->paginate(10)->withQueryString();

        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new permission.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('admin/permissions/create');
    }

    /**
     * Store a newly created permission in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:permissions',
            'description' => 'nullable|string',
        ]);

        // Create permission
        Permission::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified permission.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Inertia\Response
     */
    public function show(Permission $permission)
    {
        $permission->load('roles');

        return Inertia::render('admin/permissions/show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Inertia\Response
     */
    public function edit(Permission $permission)
    {
        return Inertia::render('admin/permissions/edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified permission in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions')->ignore($permission->id),
            ],
            'description' => 'nullable|string',
        ]);

        // Update permission
        $permission->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission from storage.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Permission $permission)
    {
        // Check if permission is assigned to roles
        if ($permission->roles()->exists()) {
            return back()->with('error', 'Cannot delete permission as it is assigned to roles.');
        }

        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }

    /**
     * Generate a slug from the permission name.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateSlug(Request $request)
    {
        $name = $request->input('name');
        $slug = Str::slug($name);

        // Check if slug exists
        $count = Permission::where('slug', $slug)->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        return response()->json(['slug' => $slug]);
    }
}
