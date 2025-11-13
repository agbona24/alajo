<?php

use Illuminate\Support\Facades\Route;

// Serve the React app for all web routes
// API routes are handled separately in routes/api.php
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
