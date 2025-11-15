<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Ajo (Group Savings) Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration settings for the Ajo (Group Savings)
    | feature of the application.
    |
    */

    'fees' => [
        'organizer_percentage' => env('AJO_ORGANIZER_FEE_PERCENTAGE', 2),
        'late_percentage' => env('AJO_LATE_FEE_PERCENTAGE', 5),
        'late_days_threshold' => env('AJO_LATE_DAYS_THRESHOLD', 7),
    ],

    'limits' => [
        'min_group_size' => env('AJO_MIN_GROUP_SIZE', 3),
        'max_group_size' => env('AJO_MAX_GROUP_SIZE', 50),
    ],

    'notifications' => [
        'enabled' => env('AJO_NOTIFICATIONS_ENABLED', true),
        'reminders_lead_time_hours' => env('AJO_REMINDERS_LEAD_TIME_HOURS', 24),
    ],

];
