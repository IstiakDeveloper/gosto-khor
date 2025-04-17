<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Somiti extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'type',
        'collection_day',
        'amount',
        'start_date',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the organization that owns the somiti.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the members for the somiti.
     */
    public function members()
    {
        return $this->belongsToMany(Member::class, 'somiti_members')
            ->withPivot('due_amount', 'is_active')
            ->withTimestamps();
    }

    public function somitiMembers()
    {
        return $this->hasMany(SomitiMember::class);
    }
    /**
     * Get the payments for the somiti.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include active somitis.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the collection day name for weekly somitis.
     *
     * @return string|null
     */
    public function getCollectionDayNameAttribute()
    {
        if ($this->type === 'weekly' && $this->collection_day !== null) {
            $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return $days[$this->collection_day] ?? null;
        }

        return null;
    }
}
