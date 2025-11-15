<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AjoPayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'ajo_group_id',
        'ajo_member_id',
        'user_id',
        'cycle_number',
        'payout_amount',
        'organizer_fee',
        'net_amount',
        'status',
        'scheduled_date',
        'completed_date',
        'transaction_id',
        'notes',
        'reference',
    ];

    protected $casts = [
        'payout_amount' => 'decimal:2',
        'organizer_fee' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'scheduled_date' => 'date',
        'completed_date' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payout) {
            if (!$payout->reference) {
                $payout->reference = 'PO-' . strtoupper(Str::random(10));
            }
        });
    }

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
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isProcessing()
    {
        return $this->status === 'processing';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isFailed()
    {
        return $this->status === 'failed';
    }

    // Calculate net amount after organizer fee
    public function calculateNetAmount()
    {
        $this->net_amount = $this->payout_amount - $this->organizer_fee;
        return $this->net_amount;
    }

    // Scopes
    public function scopeForCycle($query, $cycleNumber)
    {
        return $query->where('cycle_number', $cycleNumber);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
