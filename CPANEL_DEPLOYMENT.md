# 🚀 Alajo - cPanel Deployment Optimized Plan

## 🎯 Revised Technology Stack (cPanel-Friendly)

### Why This Change?

**cPanel hosting** is optimized for PHP applications and serves static files excellently. Here's the perfect stack:

```
┌─────────────────────────────────────────────────────┐
│           REACT FRONTEND (Static Build)              │
│  Compiles to: HTML + CSS + JavaScript files         │
│  Served from: public_html/ or subdomain             │
│  ✅ Perfect for cPanel                               │
└─────────────────────────────────────────────────────┘
                         ↓ API Calls
┌─────────────────────────────────────────────────────┐
│              PHP BACKEND (Laravel 10)                │
│  RESTful API with Laravel                           │
│  Located in: api/ directory                         │
│  ✅ Native cPanel support                            │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              MySQL 8.0 Database                      │
│  Standard cPanel database                           │
│  ✅ Pre-installed on most cPanel hosts               │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Updated Technology Stack

### Frontend (Unchanged - Still React!)
```json
{
  "framework": "React 18 with TypeScript",
  "build": "Vite (outputs static files)",
  "stateManagement": "Redux Toolkit",
  "ui": "Tailwind CSS + Shadcn/ui",
  "deployment": "Builds to static HTML/CSS/JS"
}
```

### Backend (Changed to PHP for cPanel)
```json
{
  "framework": "Laravel 10",
  "language": "PHP 8.2+",
  "orm": "Eloquent ORM",
  "authentication": "Laravel Sanctum (SPA auth)",
  "validation": "Laravel Validation",
  "jobs": "Laravel Queue + Cron",
  "api": "RESTful API with Laravel Resources"
}
```

### Database (Changed to MySQL)
```json
{
  "database": "MySQL 8.0 / MariaDB 10.6+",
  "caching": "File/Database cache (no Redis needed)",
  "fileStorage": "Local storage or Cloudinary"
}
```

### Payment & Services (Same)
```json
{
  "payment": "Paystack, Flutterwave",
  "email": "PHPMailer / Laravel Mail",
  "sms": "Termii / Twilio"
}
```

---

## 📁 Optimized Project Structure for cPanel

```
alajo/
├── frontend/                      # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── utils/
│   ├── .env.production
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                       # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── SavingsController.php
│   │   │   │   ├── TransactionController.php
│   │   │   │   └── WithdrawalController.php
│   │   │   ├── Middleware/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── SavingsPlan.php
│   │   │   ├── Transaction.php
│   │   │   └── Withdrawal.php
│   │   ├── Services/
│   │   │   ├── PaymentService.php
│   │   │   ├── NotificationService.php
│   │   │   └── SavingsService.php
│   │   └── Jobs/
│   │       ├── ProcessDailySavings.php
│   │       └── SendReminders.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   ├── .env
│   ├── composer.json
│   └── artisan
│
└── deployment/                    # Deployment scripts
    ├── deploy.sh
    └── cpanel-setup.md
```

---

## 🚀 cPanel Deployment Structure

### Final cPanel Directory Layout

```
public_html/                       # Your domain root
│
├── index.html                     # React app entry (from build)
├── assets/                        # React compiled assets
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── images/
│
├── api/                           # Laravel backend
│   ├── public/                    # Laravel public folder
│   │   └── index.php             # API entry point
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env
│   └── artisan
│
└── .htaccess                      # Root htaccess (routing)
```

### URL Structure
```
https://yourdomain.com/              → React App
https://yourdomain.com/api/          → Laravel API
https://yourdomain.com/api/auth/login
https://yourdomain.com/api/savings
https://yourdomain.com/api/transactions
```

---

## 🔧 cPanel-Specific Configuration

### 1. Root .htaccess (public_html/.htaccess)

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # API Routes - Forward to Laravel
    RewriteRule ^api/(.*)$ api/public/index.php [L,QSA]

    # React App - Serve static files or index.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>
```

### 2. API .htaccess (public_html/api/public/.htaccess)

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/

    # Redirect Trailing Slashes If Not A Folder
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### 3. PHP Version Selection in cPanel

```
1. Login to cPanel
2. Go to "Select PHP Version" or "MultiPHP Manager"
3. Select PHP 8.2 or higher
4. Enable required extensions:
   ✅ mysqli
   ✅ pdo_mysql
   ✅ mbstring
   ✅ tokenizer
   ✅ json
   ✅ curl
   ✅ fileinfo
   ✅ openssl
```

---

## 📦 Laravel Backend Structure

### Database Migration Example

```php
// database/migrations/2024_01_01_000001_create_users_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('phone')->nullable()->unique();
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth')->nullable();
            $table->string('avatar_url')->nullable();
            $table->boolean('email_verified')->default(false);
            $table->boolean('phone_verified')->default(false);
            $table->enum('kyc_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->enum('role', ['user', 'admin', 'super_admin'])->default('user');
            $table->enum('status', ['active', 'suspended', 'closed'])->default('active');
            $table->boolean('two_factor_enabled')->default(false);
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

### Model Example

```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'email',
        'phone',
        'password',
        'first_name',
        'last_name',
        'date_of_birth',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified' => 'boolean',
        'phone_verified' => 'boolean',
        'two_factor_enabled' => 'boolean',
        'date_of_birth' => 'date',
        'last_login_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function savingsPlans()
    {
        return $this->hasMany(SavingsPlan::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
```

### Controller Example

```php
// app/Http/Controllers/AuthController.php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|unique:users',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### API Routes

```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SavingsController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WithdrawalController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Savings Plans
    Route::apiResource('savings', SavingsController::class);

    // Transactions
    Route::get('transactions', [TransactionController::class, 'index']);
    Route::get('transactions/{id}', [TransactionController::class, 'show']);

    // Withdrawals
    Route::post('withdrawals', [WithdrawalController::class, 'store']);
    Route::get('withdrawals', [WithdrawalController::class, 'index']);

    // Payment webhook (should be public but verified)
    Route::post('webhooks/paystack', [TransactionController::class, 'paystackWebhook'])
        ->withoutMiddleware('auth:sanctum');
});
```

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Prepare Your Application

#### Backend (Laravel)
```bash
cd backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Set production environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Run migrations
php artisan migrate --force

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link
php artisan storage:link
```

#### Frontend (React)
```bash
cd frontend

# Update API URL in .env.production
VITE_API_URL=https://yourdomain.com/api

# Build for production
npm run build

# This creates a 'dist' folder with optimized static files
```

### Step 2: Upload to cPanel

#### Using File Manager
```
1. Login to cPanel
2. Open File Manager
3. Navigate to public_html/
4. Upload frontend/dist/* to public_html/
5. Create 'api' folder in public_html/
6. Upload entire backend folder contents to public_html/api/
```

#### Using FTP
```bash
# Upload frontend build
cd frontend/dist
ftp yourdomain.com
> cd public_html
> mput *

# Upload backend
cd ../../backend
> cd public_html/api
> mput -r *
```

#### Using SSH (Recommended)
```bash
# Compress locally
tar -czf frontend-build.tar.gz -C frontend/dist .
tar -czf backend.tar.gz backend

# Upload via SCP
scp frontend-build.tar.gz user@yourdomain.com:~/
scp backend.tar.gz user@yourdomain.com:~/

# SSH into server
ssh user@yourdomain.com

# Extract
cd public_html
tar -xzf ~/frontend-build.tar.gz

mkdir -p api
cd api
tar -xzf ~/backend.tar.gz --strip-components=1
```

### Step 3: Configure cPanel

#### Create MySQL Database
```
1. cPanel → MySQL Databases
2. Create new database: username_alajo
3. Create new user: username_alajo_user
4. Add user to database with ALL PRIVILEGES
5. Update .env in api folder with credentials
```

#### Set Up Cron Jobs for Laravel Scheduler
```
1. cPanel → Cron Jobs
2. Add new cron job:

   Minute: */5 (every 5 minutes)
   Hour: *
   Day: *
   Month: *
   Weekday: *

   Command:
   cd /home/username/public_html/api && php artisan schedule:run >> /dev/null 2>&1
```

#### Set Folder Permissions
```bash
# Via SSH or Terminal in cPanel
cd public_html/api

chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Make sure .env is not publicly accessible
chmod 640 .env
```

### Step 4: Configure Laravel for cPanel

Update `api/.env`:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=username_alajo
DB_USERNAME=username_alajo_user
DB_PASSWORD=your_secure_password

SESSION_DRIVER=file
QUEUE_CONNECTION=database

# Important for cPanel
FILESYSTEM_DISK=local
```

Update `api/config/database.php` (if needed):
```php
'mysql' => [
    'driver' => 'mysql',
    'unix_socket' => env('DB_SOCKET', '/var/lib/mysql/mysql.sock'),
    // ... other config
],
```

---

## 🔒 Security Configuration

### SSL Certificate
```
1. cPanel → SSL/TLS Status
2. Enable AutoSSL or install Let's Encrypt
3. Force HTTPS redirect in .htaccess:

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### Protect Sensitive Files
```apache
# In public_html/.htaccess
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>

<FilesMatch "composer\.(json|lock)">
    Order allow,deny
    Deny from all
</FilesMatch>
```

---

## ✅ Post-Deployment Checklist

```
Frontend:
☐ Website loads at https://yourdomain.com
☐ All routes work (React Router)
☐ Static assets load correctly
☐ No console errors

Backend:
☐ API responds at https://yourdomain.com/api
☐ Database connection works
☐ Authentication endpoints work
☐ File uploads work (if applicable)

Database:
☐ All tables created
☐ Migrations ran successfully
☐ Database user has correct permissions

Security:
☐ SSL certificate active
☐ .env file not publicly accessible
☐ CORS configured correctly
☐ API rate limiting active

Performance:
☐ Caching configured
☐ Assets compressed (gzip)
☐ Images optimized

Cron Jobs:
☐ Laravel scheduler running
☐ Daily savings job works
☐ Email notifications work
```

---

## 📊 Performance Optimization for cPanel

### 1. Enable OPcache (PHP)
```ini
; In php.ini or via cPanel PHP Settings
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
```

### 2. Enable Gzip Compression
```apache
# In .htaccess
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 3. Browser Caching
```apache
# In .htaccess
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 🆘 Common cPanel Issues & Solutions

### Issue: 500 Internal Server Error

**Solution:**
```bash
# Check Laravel logs
cat api/storage/logs/laravel.log

# Check folder permissions
chmod -R 755 api/storage api/bootstrap/cache

# Clear cache
cd api
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Issue: API Returns 404

**Solution:**
```apache
# Make sure .htaccess exists in api/public/
# Verify mod_rewrite is enabled in cPanel → PHP Extensions
```

### Issue: Database Connection Failed

**Solution:**
```php
// Check if using correct socket
// In api/.env, try:
DB_HOST=localhost
DB_SOCKET=/var/lib/mysql/mysql.sock

// Or get correct socket path:
// Run in cPanel Terminal:
php -r "echo php_ini_loaded_file();"
// Check mysql.sock location in php.ini
```

---

## 💰 Cost Estimation (cPanel Hosting)

### Shared Hosting (Starter)
```
Namecheap/Bluehost/HostGator: $3-10/month
- Good for: 0-1,000 users
- Includes: MySQL, PHP, cPanel, SSL
- Storage: 10-50GB
- Bandwidth: Unmetered

Additional Costs:
- Domain: $12/year
- SMS (Termii): $10-50/month
- Email (if not using shared hosting email): $0-20/month

Total: ~$15-80/month
```

### VPS Hosting (Growth)
```
DigitalOcean/Linode/Vultr: $12-40/month
- Good for: 1,000-50,000 users
- Full control, better performance
- Can install custom software

Total: ~$50-150/month
```

---

## 🎯 Advantages of This Stack

### ✅ React + Laravel + cPanel

1. **Easy Deployment**: Upload files via FTP/File Manager
2. **No Node.js Hassles**: React compiles to static files
3. **Laravel Power**: Modern PHP framework with great features
4. **Cost-Effective**: Works on cheap shared hosting
5. **Familiar**: Laravel is well-documented and popular
6. **Scalable**: Can migrate to VPS/cloud later
7. **Full Control**: Own your code and infrastructure

### 📈 Growth Path

```
Phase 1: Shared cPanel hosting ($5-10/mo)
    ↓
Phase 2: VPS with cPanel ($20-40/mo)
    ↓
Phase 3: Cloud hosting (AWS/DigitalOcean) ($50-200/mo)
    ↓
Phase 4: Managed Kubernetes cluster ($200+/mo)
```

---

## 🚀 Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying Alajo to cPanel..."

# Build frontend
echo "📦 Building React app..."
cd frontend
npm run build

# Prepare backend
echo "⚙️ Optimizing Laravel..."
cd ../backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create deployment package
echo "📦 Creating deployment packages..."
cd ../frontend/dist
tar -czf ../../deploy-frontend.tar.gz .

cd ../../backend
tar -czf ../deploy-backend.tar.gz .

echo "✅ Deployment packages created!"
echo "📤 Upload to cPanel:"
echo "   - deploy-frontend.tar.gz → public_html/"
echo "   - deploy-backend.tar.gz → public_html/api/"
```

---

This setup gives you the **best of both worlds**:
- ✅ Modern React frontend
- ✅ Powerful Laravel backend
- ✅ Easy cPanel deployment
- ✅ Cost-effective hosting
- ✅ Room to scale

Ready to start building? 🎉
