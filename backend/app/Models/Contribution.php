<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'savings_plan_id',
        'ajo_group_id',
        'amount',
        'payment_method',
        'reference',
        'receipt_path',
        'status',
        'notes',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    protected $appends = ['receipt_url'];

    /**
     * Get the full URL for the receipt
     */
    public function getReceiptUrlAttribute()
    {
        if (!$this->receipt_path) {
            return null;
        }
        return url('storage/' . $this->receipt_path);
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function savingsPlan()
    {
        return $this->belongsTo(SavingsPlan::class);
    }

    public function ajoGroup()
    {
        return $this->belongsTo(AjoGroup::class);
    }
}
