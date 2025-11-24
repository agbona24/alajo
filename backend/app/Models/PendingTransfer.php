<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PendingTransfer extends Model
{
    use HasFactory;

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_AWAITING_APPROVAL = 'awaiting_approval';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'user_id',
        'ajo_group_id',
        'platform_bank_account_id',
        'amount',
        'reference',
        'status',
        'transfer_proof',
        'sender_account_details',
        'transfer_claimed_at',
        'approved_at',
        'rejected_at',
        'approved_by',
        'rejected_by',
        'rejection_reason',
        'admin_notes',
        'payment_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'sender_account_details' => 'array',
        'transfer_claimed_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'payment_date' => 'date',
    ];

    // Auto-generate reference on creation
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transfer) {
            if (empty($transfer->reference)) {
                $transfer->reference = 'TRF-' . strtoupper(Str::random(10));
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ajoGroup()
    {
        return $this->belongsTo(AjoGroup::class);
    }

    public function platformBankAccount()
    {
        return $this->belongsTo(PlatformBankAccount::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejector()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeAwaitingApproval($query)
    {
        return $query->where('status', self::STATUS_AWAITING_APPROVAL);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    // Status check methods
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isAwaitingApproval(): bool
    {
        return $this->status === self::STATUS_AWAITING_APPROVAL;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    // Mark as "I have sent" by user
    public function markAsSent(?string $transferProof = null, ?array $senderDetails = null): void
    {
        $this->update([
            'status' => self::STATUS_AWAITING_APPROVAL,
            'transfer_claimed_at' => now(),
            'transfer_proof' => $transferProof,
            'sender_account_details' => $senderDetails,
        ]);
    }

    // Approve the transfer
    public function approve(int $approvedBy, ?string $notes = null): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'approved_at' => now(),
            'approved_by' => $approvedBy,
            'admin_notes' => $notes,
        ]);

        // Create the actual daily payment record
        if ($this->ajo_group_id && $this->payment_date) {
            DailyPayment::updateOrCreate(
                [
                    'ajo_group_id' => $this->ajo_group_id,
                    'user_id' => $this->user_id,
                    'payment_date' => $this->payment_date,
                ],
                [
                    'amount' => $this->amount,
                    'status' => 'paid',
                    'payment_method' => 'transfer',
                    'recorded_by' => $approvedBy,
                    'paid_at' => now(),
                ]
            );
        }
    }

    // Reject the transfer
    public function reject(int $rejectedBy, string $reason): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'rejected_at' => now(),
            'rejected_by' => $rejectedBy,
            'rejection_reason' => $reason,
        ]);
    }
}
