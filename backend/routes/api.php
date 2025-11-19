<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SavingsPlanController;
use App\Http\Controllers\Api\ContributionController;
use App\Http\Controllers\Api\WithdrawalController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\AjoGroupController;
use App\Http\Controllers\Api\AjoContributionController;
use App\Http\Controllers\Api\AjoPayoutController;
use App\Http\Controllers\Api\AjoActivityController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\BankAccountController;
use App\Http\Controllers\Api\DailyPaymentController;
use App\Http\Controllers\Api\PassbookController;
use App\Http\Controllers\Api\CollectorDashboardController;
use App\Http\Controllers\Api\AdminDashboardController;

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

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activities', [AjoActivityController::class, 'recentActivities']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/settings', [ProfileController::class, 'updateSettings']);
    Route::get('/profile/bank-accounts', [ProfileController::class, 'getBankAccounts']);

    // Savings Plans
    Route::apiResource('savings-plans', SavingsPlanController::class);
    Route::post('/savings-plans/{id}/contribute', [SavingsPlanController::class, 'contribute']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);

    // Withdrawals
    Route::get('/withdrawals', [WithdrawalController::class, 'index']);
    Route::post('/withdrawals', [WithdrawalController::class, 'store']);
    Route::get('/withdrawals/{id}', [WithdrawalController::class, 'show']);
    Route::post('/withdrawals/{id}/approve', [WithdrawalController::class, 'approve']);
    Route::post('/withdrawals/{id}/complete', [WithdrawalController::class, 'complete']);

    // Bank Accounts
    Route::apiResource('bank-accounts', BankAccountController::class);

    // Ajo Groups
    Route::get('/ajo-groups', [AjoGroupController::class, 'index']);
    Route::post('/ajo-groups', [AjoGroupController::class, 'store']);
    Route::get('/ajo-groups/search', [AjoGroupController::class, 'searchByCode']);
    Route::get('/ajo-groups/{id}', [AjoGroupController::class, 'show']);
    Route::put('/ajo-groups/{id}', [AjoGroupController::class, 'update']);
    Route::delete('/ajo-groups/{id}', [AjoGroupController::class, 'destroy']);
    Route::post('/ajo-groups/{id}/join', [AjoGroupController::class, 'join']);
    Route::post('/ajo-groups/{id}/leave', [AjoGroupController::class, 'leave']);
    Route::post('/ajo-groups/{groupId}/members/{memberId}/approve', [AjoGroupController::class, 'approveMember']);
    Route::delete('/ajo-groups/{groupId}/members/{userId}', [AjoGroupController::class, 'removeMember']);
    Route::get('/ajo-groups/{id}/members', [AjoGroupController::class, 'getMembers']);
    Route::get('/ajo-groups/{id}/schedule', [AjoGroupController::class, 'getSchedule']);
    Route::post('/ajo-groups/{id}/contribute', [AjoGroupController::class, 'contribute']);

    // Daily Payment Tracking
    Route::prefix('ajo-groups/{groupId}/payments')->group(function () {
        Route::get('/', [DailyPaymentController::class, 'index']);
        Route::post('/mark', [DailyPaymentController::class, 'markPayment']);
        Route::post('/bulk-mark', [DailyPaymentController::class, 'bulkMark']);
        Route::get('/summary', [DailyPaymentController::class, 'summary']);
        Route::get('/calendar', [DailyPaymentController::class, 'calendar']);
    });

    // Ajo Contributions
    Route::prefix('ajo-groups/{groupId}/contributions')->group(function () {
        Route::post('/', [AjoContributionController::class, 'store']);
        Route::get('/', [AjoContributionController::class, 'index']);
        Route::get('/my-contributions', [AjoContributionController::class, 'myContributions']);
        Route::get('/statistics', [AjoContributionController::class, 'statistics']);
    });

    // Ajo Payouts
    Route::prefix('ajo-groups/{groupId}/payouts')->group(function () {
        Route::post('/', [AjoPayoutController::class, 'store']);
        Route::get('/', [AjoPayoutController::class, 'index']);
        Route::post('/{payoutId}/complete', [AjoPayoutController::class, 'complete']);
        Route::get('/schedule', [AjoPayoutController::class, 'schedule']);
        Route::get('/my-payout', [AjoPayoutController::class, 'myPayout']);
    });

    // Ajo Activities
    Route::get('/ajo-groups/{groupId}/activities', [AjoActivityController::class, 'index']);

    // Passbook
    Route::get('/passbook', [PassbookController::class, 'index']);
    Route::get('/passbook/plan/{planId}', [PassbookController::class, 'byPlan']);
    Route::get('/passbook/summary', [PassbookController::class, 'summary']);

    // Collector Dashboard
    Route::get('/collector/stats', [CollectorDashboardController::class, 'stats']);

    // Admin Dashboard
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/recent-users', [AdminDashboardController::class, 'recentUsers']);
        Route::get('/recent-groups', [AdminDashboardController::class, 'recentGroups']);
        Route::get('/top-collectors', [AdminDashboardController::class, 'topCollectors']);
        Route::get('/monthly-growth', [AdminDashboardController::class, 'monthlyGrowth']);
        Route::get('/users', [AdminDashboardController::class, 'users']);
        Route::get('/groups', [AdminDashboardController::class, 'groups']);
        Route::get('/collectors', [AdminDashboardController::class, 'collectors']);
        Route::get('/transactions', [AdminDashboardController::class, 'transactions']);
    });
});
