<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\SavingsPlansController;
use App\Http\Controllers\TransactionsController;
use App\Http\Controllers\WithdrawalsController;
use App\Http\Controllers\ContributionsController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\DashboardController;
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

    // Savings Plans
    Route::get('/savings-plans/statistics', [SavingsPlansController::class, 'statistics']);
    Route::apiResource('savings-plans', SavingsPlansController::class);

    // Transactions
    Route::get('/transactions/statistics', [TransactionsController::class, 'statistics']);
    Route::apiResource('transactions', TransactionsController::class)->only(['index', 'store', 'show']);

    // Withdrawals
    Route::get('/withdrawals/pending', [WithdrawalsController::class, 'pending']);
    Route::post('/withdrawals/{withdrawal}/approve', [WithdrawalsController::class, 'approve']);
    Route::post('/withdrawals/{withdrawal}/reject', [WithdrawalsController::class, 'reject']);
    Route::post('/withdrawals/{withdrawal}/cancel', [WithdrawalsController::class, 'cancel']);
    Route::apiResource('withdrawals', WithdrawalsController::class)->only(['index', 'store', 'show']);

    // Contributions (Digital Passbook)
    Route::get('/contributions/statistics', [ContributionsController::class, 'statistics']);
    Route::get('/contributions/passbook/{savingsPlan}', [ContributionsController::class, 'passbook']);
    Route::post('/contributions/{contribution}/mark-missed', [ContributionsController::class, 'markAsMissed']);
    Route::get('/contributions', [ContributionsController::class, 'index']);

    // Admin routes (protected with admin middleware)
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);
        Route::get('/dashboard/recent-activity', [DashboardController::class, 'recentActivity']);
        Route::get('/dashboard/trends', [DashboardController::class, 'trends']);

        // User Management
        Route::get('/users', [UsersController::class, 'index']);
        Route::get('/users/{user}', [UsersController::class, 'show']);
        Route::put('/users/{user}', [UsersController::class, 'update']);
        Route::post('/users/{user}/toggle-status', [UsersController::class, 'toggleStatus']);
        Route::post('/users/{user}/verify', [UsersController::class, 'verify']);
        Route::post('/users/{user}/upgrade-tier', [UsersController::class, 'upgradeTier']);
    });
});
