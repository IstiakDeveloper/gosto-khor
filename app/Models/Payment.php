<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'somiti_id',
        'member_id',
        'amount',
        'payment_date',
        'collection_date',
        'status',
        'payment_method',
        'transaction_id',
        'notes',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
        'collection_date' => 'date',
    ];

    /**
     * Get the somiti that owns the payment.
     */
    public function somiti()
    {
        return $this->belongsTo(Somiti::class);
    }

    /**
     * Get the member that owns the payment.
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the user that created the payment.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include paid payments.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope a query to only include pending payments.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
