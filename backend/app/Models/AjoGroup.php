<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AjoGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'creator_id',
        'name',
        'code',
        'description',
        'contribution_amount',
        'group_size',
        'current_members',
        'rotation_type',
        'selection_method',
        'status',
        'start_date',
        'end_date',
        'current_cycle',
        'auto_reminders',
        'require_approval',
        'settings',
    ];

    protected $casts = [
        'contribution_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'auto_reminders' => 'boolean',
        'require_approval' => 'boolean',
        'settings' => 'array',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'ajo_members')
            ->using(AjoMember::class)
            ->withPivot(['position', 'status', 'is_admin', 'joined_at', 'payout_date', 'has_received_payout', 'total_contributed', 'current_cycle_paid'])
            ->withTimestamps();
    }

    public function ajoMembers()
    {
        return $this->hasMany(AjoMember::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function dailyPayments()
    {
        return $this->hasMany(DailyPayment::class);
    }

    public function ajoContributions()
    {
        return $this->hasMany(AjoContribution::class);
    }

    public function payouts()
    {
        return $this->hasMany(AjoPayout::class);
    }

    public function activities()
    {
        return $this->hasMany(AjoActivity::class);
    }

    // Helper methods
    public function isRecruiting()
    {
        return $this->status === 'pending';
    }

    public function isActive()
    {
        return $this->status === 'active';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    public function isFull()
    {
        return $this->current_members >= $this->group_size;
    }

    public function canStart()
    {
        return $this->current_members >= 3 && $this->current_members === $this->group_size;
    }

    public function generateJoinCode()
    {
        $this->code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
        $this->save();
        return $this->code;
    }
}
