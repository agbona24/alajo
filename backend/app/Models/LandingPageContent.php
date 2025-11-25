<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPageContent extends Model
{
    protected $fillable = [
        'section',
        'key',
        'value',
        'type',
        'order',
        'is_active',
        'meta',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'meta' => 'array',
        'order' => 'integer',
    ];

    /**
     * Get content by section
     */
    public static function getBySection(string $section)
    {
        return static::where('section', $section)
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->keyBy('key');
    }

    /**
     * Get a single content item
     */
    public static function getContent(string $section, string $key, $default = null)
    {
        $content = static::where('section', $section)
            ->where('key', $key)
            ->where('is_active', true)
            ->first();

        return $content ? $content->value : $default;
    }

    /**
     * Set or update content
     */
    public static function setContent(string $section, string $key, $value, string $type = 'text', array $meta = [])
    {
        return static::updateOrCreate(
            ['section' => $section, 'key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'meta' => $meta,
                'is_active' => true,
            ]
        );
    }
}
