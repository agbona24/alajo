<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SavingsPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'frequency',
        'amount_per_cycle',
        'target_amount',
        'current_balance',
        'start_date',
        'end_date',
        'auto_debit',
        'status',
        'description',
    ];

    protected $casts = [
        'amount_per_cycle' => 'decimal:2',
        'target_amount' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'auto_debit' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(Contribution::class);
    }

    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }

    // Accessors & Helpers
    public function getProgressPercentageAttribute(): float
    {
        if (!$this->target_amount || $this->target_amount == 0) {
            return 0;
        }

        return round(($this->current_balance / $this->target_amount) * 100, 2);
    }

    public function getRemainingAmountAttribute(): float
    {
        if (!$this->target_amount) {
            return 0;
        }

        return max(0, $this->target_amount - $this->current_balance);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
