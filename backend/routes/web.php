<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Web\CollectorController;
use App\Http\Controllers\Web\AdminController;

Route::get('/', function () {
    return view('welcome');
})->name('home');

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');

    // Collector Routes
    Route::prefix('collector')->name('collector.')->group(function () {
        Route::get('/dashboard', [CollectorController::class, 'dashboard'])->name('dashboard');
        Route::get('/group/{groupId}/cashbook', [CollectorController::class, 'cashbook'])->name('cashbook');
        Route::post('/group/{groupId}/mark-payment', [CollectorController::class, 'markPayment'])->name('mark-payment');
        Route::post('/group/{groupId}/send-reminders', [CollectorController::class, 'sendReminders'])->name('send-reminders');
    });

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::get('/groups', [AdminController::class, 'groups'])->name('groups');
        Route::get('/collectors', [AdminController::class, 'collectors'])->name('collectors');
        Route::get('/transactions', [AdminController::class, 'transactions'])->name('transactions');
    });
});

// Temporary route for viewing ajo groups (for now, just redirect to API)
Route::get('/ajo/{id}', function ($id) {
    return redirect()->route('home');
})->name('ajo.show');
