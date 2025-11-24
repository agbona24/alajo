<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\GroupController;
use App\Http\Controllers\Admin\CollectorController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\BankAccountController;
use App\Http\Controllers\Admin\TransferApprovalController;
use App\Http\Controllers\Admin\PendingApprovalController;
use App\Http\Controllers\Admin\WithdrawalController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\CashbookController;
use App\Http\Controllers\Admin\EarningsController;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and are protected
| by the 'auth' and 'admin' middleware.
|
*/

// Dashboard
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

// Earnings Management
Route::prefix('earnings')->name('earnings.')->group(function () {
    Route::get('/', [EarningsController::class, 'index'])->name('index');
    Route::get('/by-collector', [EarningsController::class, 'byCollector'])->name('by-collector');
    Route::get('/collector/{collector}', [EarningsController::class, 'collectorDetail'])->name('collector-detail');
    Route::get('/export', [EarningsController::class, 'export'])->name('export');
    Route::post('/mark-processed', [EarningsController::class, 'markProcessed'])->name('mark-processed');
    Route::post('/mark-paid-out', [EarningsController::class, 'markPaidOut'])->name('mark-paid-out');
});

// Cashbook
Route::prefix('cashbook')->name('cashbook.')->group(function () {
    Route::get('/', [CashbookController::class, 'index'])->name('index');
    Route::get('/{user}', [CashbookController::class, 'show'])->name('show');
    Route::post('/{user}/mark-paid', [CashbookController::class, 'markPaid'])->name('mark-paid');
    Route::post('/{user}/mark-unpaid', [CashbookController::class, 'markUnpaid'])->name('mark-unpaid');
});

// User Management
Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::get('/create', [UserController::class, 'create'])->name('create');
    Route::post('/', [UserController::class, 'store'])->name('store');
    Route::get('/{user}', [UserController::class, 'show'])->name('show');
    Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
    Route::put('/{user}', [UserController::class, 'update'])->name('update');
    Route::post('/{user}/password', [UserController::class, 'updatePassword'])->name('update-password');
    Route::post('/{user}/activate', [UserController::class, 'activate'])->name('activate');
    Route::post('/{user}/suspend', [UserController::class, 'suspend'])->name('suspend');
    Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
});

// Collector Management
Route::prefix('collectors')->name('collectors.')->group(function () {
    Route::get('/', [CollectorController::class, 'index'])->name('index');
    Route::get('/create', [CollectorController::class, 'create'])->name('create');
    Route::post('/', [CollectorController::class, 'store'])->name('store');
    Route::get('/{collector}', [CollectorController::class, 'show'])->name('show');
    Route::get('/{collector}/edit', [CollectorController::class, 'edit'])->name('edit');
    Route::put('/{collector}', [CollectorController::class, 'update'])->name('update');
    Route::post('/{collector}/password', [CollectorController::class, 'updatePassword'])->name('update-password');
    Route::post('/{collector}/activate', [CollectorController::class, 'activate'])->name('activate');
    Route::post('/{collector}/suspend', [CollectorController::class, 'suspend'])->name('suspend');
    Route::delete('/{collector}', [CollectorController::class, 'destroy'])->name('destroy');
});

// Group Management
Route::prefix('groups')->name('groups.')->group(function () {
    Route::get('/', [GroupController::class, 'index'])->name('index');
    Route::get('/{group}', [GroupController::class, 'show'])->name('show');
    Route::post('/{group}/status', [GroupController::class, 'updateStatus'])->name('update-status');
    Route::post('/{group}/pause', [GroupController::class, 'pause'])->name('pause');
    Route::post('/{group}/suspend', [GroupController::class, 'suspend'])->name('suspend');
    Route::post('/{group}/activate', [GroupController::class, 'activate'])->name('activate');
    Route::post('/{group}/members/{member}/remove', [GroupController::class, 'removeMember'])->name('remove-member');
    Route::delete('/{group}', [GroupController::class, 'destroy'])->name('destroy');
});

// Transaction Management
Route::prefix('transactions')->name('transactions.')->group(function () {
    Route::get('/', [TransactionController::class, 'index'])->name('index');
    Route::get('/daily-payments', [TransactionController::class, 'dailyPayments'])->name('daily-payments');
    Route::get('/export', [TransactionController::class, 'export'])->name('export');
    Route::get('/{transaction}', [TransactionController::class, 'show'])->name('show');
    Route::post('/{transaction}/approve', [TransactionController::class, 'approve'])->name('approve');
    Route::post('/{transaction}/reject', [TransactionController::class, 'reject'])->name('reject');
});

// Reports
Route::prefix('reports')->name('reports.')->group(function () {
    Route::get('/', [ReportController::class, 'index'])->name('index');
    Route::get('/export', [ReportController::class, 'export'])->name('export');
    Route::get('/user-growth', [ReportController::class, 'userGrowth'])->name('user-growth');
    Route::get('/collection-performance', [ReportController::class, 'collectionPerformance'])->name('collection-performance');
    Route::get('/financial-summary', [ReportController::class, 'financialSummary'])->name('financial-summary');
    Route::get('/group-performance', [ReportController::class, 'groupPerformance'])->name('group-performance');
});

// Platform Bank Accounts
Route::prefix('bank-accounts')->name('bank-accounts.')->group(function () {
    Route::get('/', [BankAccountController::class, 'index'])->name('index');
    Route::get('/create', [BankAccountController::class, 'create'])->name('create');
    Route::post('/', [BankAccountController::class, 'store'])->name('store');
    Route::get('/{account}/edit', [BankAccountController::class, 'edit'])->name('edit');
    Route::put('/{account}', [BankAccountController::class, 'update'])->name('update');
    Route::post('/{account}/set-primary', [BankAccountController::class, 'setPrimary'])->name('set-primary');
    Route::post('/{account}/toggle', [BankAccountController::class, 'toggle'])->name('toggle');
    Route::delete('/{account}', [BankAccountController::class, 'destroy'])->name('destroy');
});

// Pending Approvals (Member Payment Verification)
Route::prefix('approvals')->name('approvals.')->group(function () {
    Route::get('/', [PendingApprovalController::class, 'index'])->name('index');
    Route::get('/export', [PendingApprovalController::class, 'export'])->name('export');
    Route::get('/{contribution}', [PendingApprovalController::class, 'show'])->name('show');
    Route::post('/{contribution}/approve', [PendingApprovalController::class, 'approve'])->name('approve');
    Route::post('/{contribution}/reject', [PendingApprovalController::class, 'reject'])->name('reject');
    Route::post('/bulk-approve', [PendingApprovalController::class, 'bulkApprove'])->name('bulk-approve');
});

// Withdrawal Management
Route::prefix('withdrawals')->name('withdrawals.')->group(function () {
    Route::get('/', [WithdrawalController::class, 'index'])->name('index');
    Route::get('/export', [WithdrawalController::class, 'export'])->name('export');
    Route::get('/{withdrawal}', [WithdrawalController::class, 'show'])->name('show');
    Route::post('/{withdrawal}/approve', [WithdrawalController::class, 'approve'])->name('approve');
    Route::post('/{withdrawal}/mark-sent', [WithdrawalController::class, 'markSent'])->name('mark-sent');
    Route::post('/{withdrawal}/mark-completed', [WithdrawalController::class, 'markCompleted'])->name('mark-completed');
    Route::post('/{withdrawal}/reject', [WithdrawalController::class, 'reject'])->name('reject');
});

// Transfer Approvals (Legacy - for group transfers)
Route::prefix('transfers')->name('transfers.')->group(function () {
    Route::get('/', [TransferApprovalController::class, 'index'])->name('index');
    Route::get('/export', [TransferApprovalController::class, 'export'])->name('export');
    Route::get('/{transfer}', [TransferApprovalController::class, 'show'])->name('show');
    Route::post('/{transfer}/approve', [TransferApprovalController::class, 'approve'])->name('approve');
    Route::post('/{transfer}/reject', [TransferApprovalController::class, 'reject'])->name('reject');
    Route::post('/bulk-approve', [TransferApprovalController::class, 'bulkApprove'])->name('bulk-approve');
});

// Settings
Route::prefix('settings')->name('settings.')->group(function () {
    Route::get('/', [SettingsController::class, 'index'])->name('index');
    Route::get('/general', [SettingsController::class, 'general'])->name('general');
    Route::post('/general', [SettingsController::class, 'updateGeneral'])->name('general.update');
    Route::get('/smtp', [SettingsController::class, 'smtp'])->name('smtp');
    Route::post('/smtp', [SettingsController::class, 'updateSmtp'])->name('smtp.update');
    Route::post('/smtp/test', [SettingsController::class, 'testSmtp'])->name('smtp.test');
    Route::get('/currency', [SettingsController::class, 'currency'])->name('currency');
    Route::post('/currency', [SettingsController::class, 'updateCurrency'])->name('currency.update');
    Route::get('/notifications', [SettingsController::class, 'notifications'])->name('notifications');
    Route::post('/notifications', [SettingsController::class, 'updateNotifications'])->name('notifications.update');
    Route::get('/commissions', [SettingsController::class, 'commissions'])->name('commissions');
    Route::post('/commissions', [SettingsController::class, 'updateCommissions'])->name('commissions.update');
    Route::post('/clear-cache', [SettingsController::class, 'clearCache'])->name('clear-cache');
});
