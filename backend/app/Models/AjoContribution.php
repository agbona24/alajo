<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AjoContribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'ajo_group_id',
        'ajo_member_id',
        'user_id',
        'cycle_number',
        'amount',
        'status',
        'due_date',
        'paid_date',
        'payment_method',
        'transaction_id',
        'is_late',
        'late_fee',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'late_fee' => 'decimal:2',
        'due_date' => 'date',
        'paid_date' => 'datetime',
        'is_late' => 'boolean',
    ];

    // Relationships
    public function ajoGroup()
    {
        return $this->belongsTo(AjoGroup::class);
    }

    public function ajoMember()
    {
        return $this->belongsTo(AjoMember::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    // Helper methods
    public function isPaid()
    {
        return $this->status === 'paid';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isMissed()
    {
        return $this->status === 'missed';
    }

    public function isLate()
    {
        return $this->is_late || $this->status === 'late';
    }

    // Scopes
    public function scopeForCycle($query, $cycleNumber)
    {
        return $query->where('cycle_number', $cycleNumber);
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeMissed($query)
    {
        return $query->where('status', 'missed');
    }
}
