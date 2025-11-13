<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\SavingsPlansController;
use App\Http\Controllers\TransactionsController;
use App\Http\Controllers\WithdrawalsController;
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
});
