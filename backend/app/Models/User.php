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

    // Role constants
    public const ROLE_USER = 'user';
    public const ROLE_COLLECTOR = 'collector';
    public const ROLE_ADMIN = 'admin';

    // Status constants
    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_SUSPENDED = 'suspended';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'last_login_at',
        'collector_id',
        'two_factor_enabled',
        'two_factor_code',
        'two_factor_code_expires_at',
        'two_factor_verified_at',
        'contribution_reminder_enabled',
        'contribution_reminder_days',
        'email_notifications_contributions',
        'email_notifications_withdrawals',
        'email_verification_code',
        'email_verification_code_expires_at',
        'email_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_code',
        'two_factor_code_expires_at',
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
            'last_login_at' => 'datetime',
            'two_factor_enabled' => 'boolean',
            'two_factor_code_expires_at' => 'datetime',
            'two_factor_verified_at' => 'datetime',
            'contribution_reminder_enabled' => 'boolean',
            'contribution_reminder_days' => 'integer',
            'email_notifications_contributions' => 'boolean',
            'email_notifications_withdrawals' => 'boolean',
            'email_verification_code_expires_at' => 'datetime',
            'email_verified' => 'boolean',
        ];
    }

    // Role check methods
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isCollector(): bool
    {
        return $this->role === self::ROLE_COLLECTOR;
    }

    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isSuspended(): bool
    {
        return $this->status === self::STATUS_SUSPENDED;
    }

    // Check if user has any of the given roles
    public function hasRole(string|array $roles): bool
    {
        $roles = is_array($roles) ? $roles : [$roles];
        return in_array($this->role, $roles);
    }

    // Scope for filtering by role
    public function scopeRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    public function scopeCollectors($query)
    {
        return $query->where('role', self::ROLE_COLLECTOR);
    }

    public function scopeActiveUsers($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
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

    public function earnings()
    {
        return $this->hasMany(Earning::class);
    }

    public function collectorEarnings()
    {
        return $this->hasMany(Earning::class, 'collector_id');
    }

    /**
     * Get the collector that manages this user
     */
    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }

    /**
     * Get all members managed by this collector
     */
    public function members()
    {
        return $this->hasMany(User::class, 'collector_id');
    }
}
