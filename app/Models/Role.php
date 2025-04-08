<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Get the users that belong to the role.
     */
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Get the permissions that belong to the role.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * Give permissions to the role.
     *
     * @param mixed $permissions
     * @return void
     */
    public function givePermissionsTo($permissions)
    {
        $this->permissions()->syncWithoutDetaching($this->getPermissionIds($permissions));
    }

    /**
     * Remove permissions from the role.
     *
     * @param mixed $permissions
     * @return void
     */
    public function revokePermissionsTo($permissions)
    {
        $this->permissions()->detach($this->getPermissionIds($permissions));
    }

    /**
     * Get permission IDs from permission objects, IDs, or slugs.
     *
     * @param mixed $permissions
     * @return array
     */
    protected function getPermissionIds($permissions)
    {
        if (is_numeric($permissions) || is_string($permissions)) {
            $permissions = [$permissions];
        }

        if ($permissions instanceof Permission) {
            $permissions = [$permissions->id];
        }

        if (is_array($permissions)) {
            return array_map(function ($permission) {
                if ($permission instanceof Permission) {
                    return $permission->id;
                }

                if (is_numeric($permission)) {
                    return $permission;
                }

                if (is_string($permission)) {
                    $permissionObj = Permission::where('slug', $permission)->first();
                    return $permissionObj ? $permissionObj->id : null;
                }

                return null;
            }, $permissions);
        }

        return [];
    }
}
