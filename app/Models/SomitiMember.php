<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SomitiMember extends Pivot
{
    use HasFactory;

    protected $table = 'somiti_members';

    protected $fillable = [
        'somiti_id',
        'member_id',
        'due_amount',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'due_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the somiti that the record belongs to.
     */
    public function somiti()
    {
        return $this->belongsTo(Somiti::class);
    }

    /**
     * Get the member that the record belongs to.
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get recent payments for this somiti member.
     */
    public function recentPayments($limit = 5)
    {
        return Payment::where('somiti_id', $this->somiti_id)
            ->where('member_id', $this->member_id)
            ->orderByDesc('payment_date')
            ->limit($limit)
            ->get();
    }
}
