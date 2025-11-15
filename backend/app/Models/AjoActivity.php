<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AjoActivity extends Model
{
    use HasFactory;

    // Disable updated_at since we only track created_at
    public $timestamps = false;

    protected $fillable = [
        'ajo_group_id',
        'user_id',
        'action',
        'description',
        'metadata',
        'created_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    protected $dates = ['created_at'];

    // Relationships
    public function ajoGroup()
    {
        return $this->belongsTo(AjoGroup::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Helper method to create activity log
    public static function log($groupId, $userId, $action, $description, $metadata = [])
    {
        return static::create([
            'ajo_group_id' => $groupId,
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }

    // Scopes
    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    public function scopeForAction($query, $action)
    {
        return $query->where('action', $action);
    }
}
