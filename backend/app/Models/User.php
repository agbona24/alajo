<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
        ];
    }

    // Relationships
    public function savingsPlans()
    {
        return $this->hasMany(SavingsPlan::class);
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

    public function bankAccounts()
    {
        return $this->hasMany(BankAccount::class);
    }

    public function passbookRecords()
    {
        return $this->hasMany(PassbookRecord::class);
    }

    public function createdAjoGroups()
    {
        return $this->hasMany(AjoGroup::class, 'creator_id');
    }

    public function ajoGroups()
    {
        return $this->belongsToMany(AjoGroup::class, 'ajo_members')
            ->withPivot(['position', 'status', 'is_admin', 'joined_at', 'payout_date', 'has_received_payout', 'total_contributed', 'current_cycle_paid'])
            ->withTimestamps();
    }

    public function ajoMemberships()
    {
        return $this->hasMany(AjoMember::class);
    }

    public function dailyPayments()
    {
        return $this->hasMany(DailyPayment::class);
    }

    public function ajoContributions()
    {
        return $this->hasMany(AjoContribution::class);
    }

    public function ajoPayouts()
    {
        return $this->hasMany(AjoPayout::class);
    }

    public function ajoActivities()
    {
        return $this->hasMany(AjoActivity::class);
    }
}
