<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'billing_cycle',
        'max_organizations',
        'max_somitis',
        'max_members',
        'features',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'features' => 'array',
    ];

    /**
     * Get all subscriptions for this plan.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Scope a query to only include active plans.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the formatted price.
     *
     * @return string
     */
    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 2) . ' ৳';
    }

    /**
     * Get billing cycle duration in months.
     *
     * @return int
     */
    public function getDurationInMonthsAttribute()
    {
        return [
            'monthly' => 1,
            'quarterly' => 3,
            'yearly' => 12,
        ][$this->billing_cycle] ?? 1;
    }
}
