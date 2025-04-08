<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // Create default roles
        $adminRole = Role::create([
            'name' => 'Super Admin',
            'slug' => 'super-admin',
            'description' => 'Super Administrator with all permissions',
        ]);

        $orgAdminRole = Role::create([
            'name' => 'Organization Admin',
            'slug' => 'organization-admin',
            'description' => 'Organization administrator',
        ]);

        $staffRole = Role::create([
            'name' => 'Organization Staff',
            'slug' => 'organization-staff',
            'description' => 'Organization staff member',
        ]);

        // Assign role to admin
        $admin->roles()->attach($adminRole->id);

        // Create some basic permissions
        $permissions = [
            ['name' => 'View Dashboard', 'slug' => 'view-dashboard'],
            ['name' => 'Manage Members', 'slug' => 'manage-members'],
            ['name' => 'Manage Somitis', 'slug' => 'manage-somitis'],
            ['name' => 'Manage Payments', 'slug' => 'manage-payments'],
            ['name' => 'View Reports', 'slug' => 'view-reports'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
