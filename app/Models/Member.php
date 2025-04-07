<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'address',
        'phone',
        'photo',
        'email',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the organization that owns the member.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the somitis for the member.
     */
    public function somitis()
    {
        return $this->belongsToMany(Somiti::class, 'somiti_members')
            ->withPivot('due_amount', 'is_active')
            ->withTimestamps();
    }

    /**
     * Get the payments for the member.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include active members.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get member's total dues across all somitis.
     *
     * @return float
     */
    public function getTotalDueAttribute()
    {
        return $this->somitis()->sum('due_amount');
    }
}
