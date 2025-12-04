<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// APK Download Route (bypass symlink issues)
Route::get('/storage/downloads/alajo-app.apk', function () {
    $filePath = storage_path('app/public/downloads/alajo-app.apk');

    if (!file_exists($filePath)) {
        abort(404, 'APK file not found');
    }

    return response()->download($filePath, 'alajo-app.apk', [
        'Content-Type' => 'application/vnd.android.package-archive',
        'Content-Disposition' => 'attachment; filename="alajo-app.apk"'
    ]);
})->name('download.apk');

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes (for regular users)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
});

// Note: Admin routes are in routes/admin.php (prefix: /admin)
// Note: Collector routes are in routes/collector.php (prefix: /collector)
