<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'date_of_birth',
        'role',
        'account_tier',
        'is_active',
        'is_verified',
        'agreed_to_terms',
        'terms_agreed_at',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'agreed_to_terms' => 'boolean',
            'terms_agreed_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the savings plans for the user.
     */
    public function savingsPlans(): HasMany
    {
        return $this->hasMany(SavingsPlan::class);
    }

    /**
     * Get the transactions for the user.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the withdrawals for the user.
     */
    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }

    /**
     * Get the contributions for the user.
     */
    public function contributions(): HasMany
    {
        return $this->hasMany(Contribution::class);
    }

    /**
     * Get withdrawals approved by this user (for admins).
     */
    public function approvedWithdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class, 'approved_by');
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is active.
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Check if user is verified.
     */
    public function isVerified(): bool
    {
        return $this->is_verified;
    }

    /**
     * Check if user has agreed to terms.
     */
    public function hasAgreedToTerms(): bool
    {
        return $this->agreed_to_terms;
    }
}
