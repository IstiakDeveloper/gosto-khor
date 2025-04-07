<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'domain',
        'description',
        'logo',
        'address',
        'phone',
        'email',
    ];

    /**
     * Get the somitis for the organization.
     */
    public function somitis()
    {
        return $this->hasMany(Somiti::class);
    }

    /**
     * Get the members for the organization.
     */
    public function members()
    {
        return $this->hasMany(Member::class);
    }

    /**
     * Get the users for the organization.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the active subscription for the organization.
     */
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('is_active', true)
            ->where('end_date', '>=', now())
            ->latest();
    }

    /**
     * Get all subscriptions for the organization.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
