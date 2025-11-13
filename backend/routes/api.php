<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/user', function (Illuminate\Http\Request $request) {
        return $request->user();
    });
});
