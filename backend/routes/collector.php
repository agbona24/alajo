<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Collector\DashboardController;
use App\Http\Controllers\Collector\GroupController;
use App\Http\Controllers\Collector\PaymentController;
use App\Http\Controllers\Collector\MemberController;
use App\Http\Controllers\Collector\EarningsController;

/*
|--------------------------------------------------------------------------
| Collector Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and are protected
| by the 'auth' and 'collector' middleware.
|
*/

// Dashboard
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

// Groups
Route::prefix('groups')->name('groups.')->group(function () {
    Route::get('/', [GroupController::class, 'index'])->name('index');
    Route::post('/', [GroupController::class, 'store'])->name('store');
    Route::get('/{group}', [GroupController::class, 'show'])->name('show');
    Route::get('/{group}/cashbook', [GroupController::class, 'cashbook'])->name('cashbook');
    Route::get('/{group}/members', [GroupController::class, 'members'])->name('members');
});

// Payments
Route::prefix('groups/{group}/payments')->name('payments.')->group(function () {
    Route::get('/', [PaymentController::class, 'index'])->name('index');
    Route::get('/today', [PaymentController::class, 'todaySummary'])->name('today');
    Route::post('/mark-paid', [PaymentController::class, 'markPaid'])->name('mark-paid');
    Route::post('/mark-pending', [PaymentController::class, 'markPending'])->name('mark-pending');
    Route::post('/bulk-mark-paid', [PaymentController::class, 'bulkMarkPaid'])->name('bulk-mark-paid');
    Route::post('/send-reminders', [PaymentController::class, 'sendReminders'])->name('send-reminders');
});

// My Registered Members (users registered under this collector)
Route::prefix('members')->name('members.')->group(function () {
    Route::get('/', [MemberController::class, 'index'])->name('index');
    Route::get('/{user}', [MemberController::class, 'showRegisteredMember'])->name('show-registered');
});

// Group Members Management
Route::prefix('groups/{group}/members')->name('group-members.')->group(function () {
    Route::get('/{member}', [MemberController::class, 'show'])->name('show');
    Route::post('/{member}/status', [MemberController::class, 'updateStatus'])->name('update-status');
    Route::post('/{member}/position', [MemberController::class, 'updatePosition'])->name('update-position');
    Route::post('/{member}/make-admin', [MemberController::class, 'makeAdmin'])->name('make-admin');
    Route::post('/{member}/remove-admin', [MemberController::class, 'removeAdmin'])->name('remove-admin');
    Route::post('/{member}/approve', [MemberController::class, 'approve'])->name('approve');
    Route::post('/{member}/reject', [MemberController::class, 'reject'])->name('reject');
});

// Earnings
Route::prefix('earnings')->name('earnings.')->group(function () {
    Route::get('/', [EarningsController::class, 'index'])->name('index');
    Route::get('/{group}', [EarningsController::class, 'show'])->name('show');
});
