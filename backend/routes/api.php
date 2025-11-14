<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SavingsPlanController;
use App\Http\Controllers\Api\ContributionController;
use App\Http\Controllers\Api\WithdrawalController;
use App\Http\Controllers\Api\TransactionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Savings Plans
    Route::apiResource('savings-plans', SavingsPlanController::class);
    Route::post('/savings-plans/{plan}/contribute', [ContributionController::class, 'store']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);

    // Withdrawals
    Route::get('/withdrawals', [WithdrawalController::class, 'index']);
    Route::post('/withdrawals', [WithdrawalController::class, 'store']);
    Route::patch('/withdrawals/{withdrawal}/approve', [WithdrawalController::class, 'approve']);
    Route::patch('/withdrawals/{withdrawal}/reject', [WithdrawalController::class, 'reject']);
});
