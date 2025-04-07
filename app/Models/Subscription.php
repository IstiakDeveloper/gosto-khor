<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'subscription_plan_id',
        'start_date',
        'end_date',
        'is_active',
        'status',
        'amount_paid',
        'payment_method',
        'transaction_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'amount_paid' => 'decimal:2',
    ];

    /**
     * Get the organization that owns the subscription.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the subscription plan for this subscription.
     */
    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    /**
     * Check if the subscription is active.
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->is_active && $this->end_date >= now();
    }

    /**
     * Check if the subscription is expired.
     *
     * @return bool
     */
    public function isExpired()
    {
        return $this->end_date < now();
    }

    /**
     * Get the remaining days for the subscription.
     *
     * @return int
     */
    public function getRemainingDaysAttribute()
    {
        if ($this->isExpired()) {
            return 0;
        }

        return now()->diffInDays($this->end_date);
    }
}
