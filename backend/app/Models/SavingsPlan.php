<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SavingsPlan extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Default attribute values
     */
    protected $attributes = [
        'current_amount' => 0,
        'target_amount' => 0,
        'daily_amount' => 0,
        'company_fee_collected' => false,
    ];

    protected $fillable = [
        'user_id',
        'name',
        'emoji',
        'target_amount',
        'current_amount',
        'daily_amount',
        'frequency',
        'duration',
        'plan_type',
        'description',
        'status',
        'start_date',
        'first_contribution_date',
        'company_fee_collected',
        'target_date',
        'completed_at',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'daily_amount' => 'decimal:2',
        'start_date' => 'date',
        'first_contribution_date' => 'date',
        'company_fee_collected' => 'boolean',
        'target_date' => 'date',
        'completed_at' => 'date',
    ];

    protected $appends = ['progress_percentage', 'remaining_amount', 'daily_contribution', 'pending_withdrawals', 'available_balance', 'pending_contributions'];

    // Constants
    const MINIMUM_DAILY_CONTRIBUTION = 300;

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function passbookRecords()
    {
        return $this->hasMany(PassbookRecord::class);
    }

    // Computed attributes
    public function getProgressPercentageAttribute()
    {
        if ($this->target_amount <= 0) {
            return 0;
        }
        return min(100, ($this->current_amount / $this->target_amount) * 100);
    }

    public function getRemainingAmountAttribute()
    {
        return max(0, $this->target_amount - $this->current_amount);
    }

    /**
     * Get total pending withdrawals
     */
    public function getPendingWithdrawalsAttribute()
    {
        return $this->withdrawals()
            ->whereIn('status', ['pending', 'approved'])
            ->sum('amount');
    }

    /**
     * Get total pending contributions (awaiting confirmation)
     */
    public function getPendingContributionsAttribute()
    {
        return $this->contributions()
            ->where('status', 'pending')
            ->sum('amount');
    }

    /**
     * Get available balance (current - pending withdrawals)
     */
    public function getAvailableBalanceAttribute()
    {
        return max(0, $this->current_amount - $this->pending_withdrawals);
    }

    /**
     * Get the daily contribution amount
     * Uses stored daily_amount if available, otherwise calculates from target
     */
    public function getDailyContributionAttribute()
    {
        // If daily_amount is stored, use it directly
        if ($this->daily_amount && $this->daily_amount > 0) {
            return (float) $this->daily_amount;
        }

        // Fallback: calculate from target (for old plans without daily_amount)
        if ($this->frequency !== 'daily' || $this->duration <= 0) {
            return 0;
        }

        // Duration is in months, Ajo policy: 31 days = 1 month
        $totalDays = $this->duration * 31;
        $dailyAmount = ceil($this->target_amount / $totalDays);

        // Ensure minimum of 300 naira
        return max($dailyAmount, self::MINIMUM_DAILY_CONTRIBUTION);
    }

    /**
     * Get the next unpaid date for passbook records
     * This fills in missed days first before moving to current/future dates
     */
    public function getNextUnpaidDate()
    {
        try {
            // Ensure startDate is a Carbon instance
            $startDate = $this->start_date;
            if (!$startDate instanceof \Carbon\Carbon) {
                $startDate = $startDate ? \Carbon\Carbon::parse($startDate) : now()->startOfMonth();
            }

            $today = now()->endOfDay();

            // Get all dates that have any records (any status - to prevent duplicates)
            $recordedDates = $this->passbookRecords()
                ->pluck('contribution_date')
                ->filter()
                ->map(function($date) {
                    try {
                        if ($date instanceof \Carbon\Carbon) {
                            return $date->format('Y-m-d');
                        }
                        if (is_string($date)) {
                            return \Carbon\Carbon::parse($date)->format('Y-m-d');
                        }
                    } catch (\Exception $e) {
                        return null;
                    }
                    return null;
                })
                ->filter()
                ->toArray();

            // Start from the plan's start date and find the first date without a record
            $checkDate = $startDate->copy();
            $maxIterations = 365; // Safety limit
            $iterations = 0;

            // Check up to today + 1 day (to allow for current day contribution)
            while ($checkDate->lte($today) && $iterations < $maxIterations) {
                $iterations++;
                $dateString = $checkDate->format('Y-m-d');

                // If this date doesn't have a record, return it
                if (!in_array($dateString, $recordedDates)) {
                    return $checkDate->copy();
                }

                $checkDate->addDay();
            }

            // If all days up to today have records, return the next available date
            // But first check if target_date is reached
            if ($this->target_date) {
                $targetDate = $this->target_date instanceof \Carbon\Carbon
                    ? $this->target_date
                    : \Carbon\Carbon::parse($this->target_date);

                if ($checkDate->gt($targetDate)) {
                    return $targetDate->copy();
                }
            }

            return $checkDate->copy();
        } catch (\Exception $e) {
            \Log::error("getNextUnpaidDate failed for plan {$this->id}: " . $e->getMessage());
            // Return today as fallback
            return now()->startOfDay();
        }
    }

    /**
     * Get count of missed/unpaid days
     */
    public function getMissedDaysCount()
    {
        $startDate = $this->start_date ?? now()->startOfMonth();
        $today = now()->startOfDay();

        // Total days from start to today
        $totalDays = $startDate->diffInDays($today) + 1;

        // Days with paid records
        $paidDays = $this->passbookRecords()
            ->where('status', 'paid')
            ->whereBetween('contribution_date', [$startDate, $today])
            ->count();

        return max(0, $totalDays - $paidDays);
    }
}
