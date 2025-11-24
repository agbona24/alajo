<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformBankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'bank_name',
        'account_name',
        'account_number',
        'bank_code',
        'is_active',
        'is_primary',
        'description',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_primary' => 'boolean',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pendingTransfers()
    {
        return $this->hasMany(PendingTransfer::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    // Get the primary active account
    public static function getPrimary()
    {
        return static::active()->primary()->first()
            ?? static::active()->first();
    }

    // Set this account as primary (and unset others)
    public function setAsPrimary(): void
    {
        static::where('id', '!=', $this->id)->update(['is_primary' => false]);
        $this->update(['is_primary' => true]);
    }
}
