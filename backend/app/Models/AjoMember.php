<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AjoMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'ajo_group_id',
        'user_id',
        'position',
        'status',
        'is_admin',
        'joined_at',
        'payout_date',
        'has_received_payout',
        'total_contributed',
        'current_cycle_paid',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'joined_at' => 'date',
        'payout_date' => 'date',
        'has_received_payout' => 'boolean',
        'total_contributed' => 'decimal:2',
        'current_cycle_paid' => 'boolean',
    ];

    // Relationships
    public function ajoGroup()
    {
        return $this->belongsTo(AjoGroup::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contributions()
    {
        return $this->hasMany(AjoContribution::class);
    }

    public function payouts()
    {
        return $this->hasMany(AjoPayout::class);
    }

    // Helper methods
    public function isActive()
    {
        return $this->status === 'active';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isRemoved()
    {
        return $this->status === 'removed';
    }

    public function hasReceivedPayout()
    {
        return $this->has_received_payout;
    }

    public function isOrganizer()
    {
        return $this->is_admin;
    }
}
