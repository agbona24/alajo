<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'user_id',
        'savings_plan_id',
        'type',
        'amount',
        'fee',
        'net_amount',
        'status',
        'payment_method',
        'payment_reference',
        'description',
        'metadata',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'metadata' => 'array',
        'processed_at' => 'datetime',
    ];

    // Boot method to auto-generate reference
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (empty($transaction->reference)) {
                $transaction->reference = 'TXN' . strtoupper(Str::random(10));
            }
        });
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function savingsPlan(): BelongsTo
    {
        return $this->belongsTo(SavingsPlan::class);
    }

    // Helpers
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isDeposit(): bool
    {
        return $this->type === 'deposit';
    }

    public function isWithdrawal(): bool
    {
        return $this->type === 'withdrawal';
    }
}
