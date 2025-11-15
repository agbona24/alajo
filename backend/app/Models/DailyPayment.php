<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ajo_group_id',
        'user_id',
        'payment_date',
        'amount',
        'status',
        'payment_method',
        'reference',
        'recorded_by',
        'notes',
        'paid_at',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function ajoGroup()
    {
        return $this->belongsTo(AjoGroup::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Scopes
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeForGroup($query, $groupId)
    {
        return $query->where('ajo_group_id', $groupId);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('payment_date', $date);
    }

    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('payment_date', [$startDate, $endDate]);
    }

    /**
     * Mark payment as paid
     */
    public function markAsPaid($paymentMethod = 'cash', $recordedBy = null, $notes = null)
    {
        $this->update([
            'status' => 'paid',
            'payment_method' => $paymentMethod,
            'recorded_by' => $recordedBy ?? auth()->id(),
            'notes' => $notes,
            'paid_at' => now(),
        ]);
    }

    /**
     * Mark payment as missed
     */
    public function markAsMissed($notes = null)
    {
        $this->update([
            'status' => 'missed',
            'notes' => $notes,
        ]);
    }
}
