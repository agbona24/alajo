<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contribution extends Model
{
    protected $fillable = [
        'user_id',
        'savings_plan_id',
        'transaction_id',
        'serial_number',
        'contribution_date',
        'amount',
        'status',
        'payment_method',
        'collector_signature',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'contribution_date' => 'date',
        'amount' => 'decimal:2',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns this contribution.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the savings plan this contribution belongs to.
     */
    public function savingsPlan(): BelongsTo
    {
        return $this->belongsTo(SavingsPlan::class);
    }

    /**
     * Get the transaction associated with this contribution.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Check if contribution is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if contribution is paid.
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Check if contribution is missed.
     */
    public function isMissed(): bool
    {
        return $this->status === 'missed';
    }

    /**
     * Check if contribution is skipped.
     */
    public function isSkipped(): bool
    {
        return $this->status === 'skipped';
    }

    /**
     * Scope to get contributions for a specific month.
     */
    public function scopeForMonth($query, int $year, int $month)
    {
        return $query->whereYear('contribution_date', $year)
                     ->whereMonth('contribution_date', $month);
    }

    /**
     * Scope to get paid contributions only.
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope to get pending contributions only.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
