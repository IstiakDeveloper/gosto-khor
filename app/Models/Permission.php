<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Get the roles that belong to the permission.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Get the users that have this permission through their roles.
     */
    public function users()
    {
        return User::whereHas('roles', function ($query) {
            $query->whereHas('permissions', function ($query) {
                $query->where('permissions.id', $this->id);
            });
        })->get();
    }
}
