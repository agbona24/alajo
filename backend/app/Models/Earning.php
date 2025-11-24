<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Earning extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'savings_plan_id',
        'contribution_id',
        'collector_id',
        'amount',
        'type',
        'status',
        'reference',
        'description',
        'earning_date',
        'paid_out_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'earning_date' => 'date',
        'paid_out_at' => 'datetime',
    ];

    // Constants
    const TYPE_COMPANY_FEE = 'company_fee';
    const TYPE_COLLECTOR_COMMISSION = 'collector_commission';
    const TYPE_PLATFORM_FEE = 'platform_fee';

    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSED = 'processed';
    const STATUS_PAID_OUT = 'paid_out';
    const STATUS_CANCELLED = 'cancelled';

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function savingsPlan()
    {
        return $this->belongsTo(SavingsPlan::class);
    }

    public function contribution()
    {
        return $this->belongsTo(Contribution::class);
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }

    // Scopes
    public function scopeCompanyFees($query)
    {
        return $query->where('type', self::TYPE_COMPANY_FEE);
    }

    public function scopeCollectorCommissions($query)
    {
        return $query->where('type', self::TYPE_COLLECTOR_COMMISSION);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeForMonth($query, $month, $year)
    {
        return $query->whereMonth('earning_date', $month)
            ->whereYear('earning_date', $year);
    }

    // Static helper to generate reference
    public static function generateReference()
    {
        return 'ERN-' . now()->format('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }
}
