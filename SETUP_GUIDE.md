# Alajo Savings App - Setup Guide

## 🎉 What Has Been Built

### Backend API (Laravel 12)
- ✅ Complete database schema with migrations
- ✅ Eloquent models with full relationships
- ✅ Laravel Sanctum authentication (register, login, logout)
- ✅ Savings Plans CRUD API
- ✅ Transactions management API
- ✅ Withdrawals request and approval API
- ✅ Admin endpoints for withdrawal approval/rejection

### Frontend (React 18 + TypeScript)
- ✅ Complete UI with mobile-native design
- ✅ Terms and regulations onboarding flow
- ✅ RTK Query API integration
- ✅ Type-safe TypeScript interfaces
- ✅ Authentication state management
- ✅ Responsive design with Tailwind CSS
- ✅ Professional animations with Framer Motion

### Features Implemented
- ✅ User registration with terms acceptance
- ✅ Minimum ₦300 contribution enforcement
- ✅ Digital passbook (contributions table)
- ✅ Savings plans with target tracking
- ✅ Auto-generated transaction references
- ✅ Withdrawal workflow with admin approval
- ✅ Account tiers (basic, silver, gold)
- ✅ Statistics and analytics endpoints

## 🚀 Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- Database (MySQL, PostgreSQL, or SQLite)

### 1. Database Setup

**Option A: PostgreSQL (Recommended for Production)**
```bash
# Install PostgreSQL if not already installed
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Create database
sudo -u postgres psql -c "CREATE DATABASE alajo;"

# Update backend/.env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=alajo
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

**Option B: MySQL**
```bash
# Install MySQL if not already installed
sudo apt-get install mysql-server

# Create database
mysql -u root -p -e "CREATE DATABASE alajo;"

# Update backend/.env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=alajo
DB_USERNAME=root
DB_PASSWORD=your_password
```

**Option C: SQLite (Development Only)**
```bash
# Install PHP SQLite extension
sudo apt-get install php-sqlite3

# Create database file
touch backend/database/database.sqlite

# Update backend/.env
DB_CONNECTION=sqlite
# Comment out other DB_ variables
```

### 2. Backend Installation

```bash
cd backend

# Install PHP dependencies
composer install

# Run database migrations
php artisan migrate

# Optional: Seed database with test data
php artisan db:seed

# Start Laravel development server
php artisan serve
```

The API will be available at `http://localhost:8000`

### 3. Frontend Installation

```bash
# Still in backend directory
npm install

# Start Vite development server
npm run dev
```

### 4. Development Workflow

**Using the helper script (Recommended):**
```bash
cd backend
./dev.sh
```

This script starts both Laravel and Vite servers automatically.

**Important:** Always visit `http://localhost:8000` in your browser, NOT `http://localhost:5173`
- Port 8000: Laravel server (serves your app)
- Port 5173: Vite server (hot-reload only, runs in background)

### 5. Build for Production

```bash
cd backend

# Build frontend assets
npm run build

# Assets will be in public/build/
# Upload entire backend/ folder to cPanel
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── Models/              # Eloquent models
│   │   ├── User.php
│   │   ├── SavingsPlan.php
│   │   ├── Transaction.php
│   │   ├── Withdrawal.php
│   │   └── Contribution.php
│   └── Http/Controllers/    # API controllers
│       ├── Auth/
│       ├── SavingsPlansController.php
│       ├── TransactionsController.php
│       └── WithdrawalsController.php
├── database/
│   └── migrations/          # Database schema
├── resources/
│   └── js/                  # React frontend
│       ├── components/
│       ├── pages/
│       ├── store/          # Redux + RTK Query
│       └── types/          # TypeScript types
└── routes/
    └── api.php             # API routes
```

## 🔐 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user

### Savings Plans
- `GET /api/savings-plans` - List all plans
- `POST /api/savings-plans` - Create new plan
- `GET /api/savings-plans/{id}` - Get single plan
- `PUT /api/savings-plans/{id}` - Update plan
- `DELETE /api/savings-plans/{id}` - Delete plan
- `GET /api/savings-plans/statistics` - Get statistics

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create deposit
- `GET /api/transactions/{id}` - Get transaction
- `GET /api/transactions/statistics` - Get statistics

### Withdrawals
- `GET /api/withdrawals` - List withdrawals
- `POST /api/withdrawals` - Request withdrawal
- `GET /api/withdrawals/{id}` - Get withdrawal
- `POST /api/withdrawals/{id}/cancel` - Cancel withdrawal (user)
- `GET /api/withdrawals/pending` - List pending (admin)
- `POST /api/withdrawals/{id}/approve` - Approve (admin)
- `POST /api/withdrawals/{id}/reject` - Reject (admin)

## 🎨 Frontend Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration with onboarding
- `/dashboard` - User dashboard
- `/savings` - Savings plans management
- `/transactions` - Transaction history
- `/withdrawals` - Withdrawal requests
- `/terms` - Terms and regulations
- `/admin/*` - Admin panel (if role === 'admin')

## 💻 cPanel Deployment

### Step 1: Prepare Database
1. Log into cPanel
2. Go to MySQL Databases or PostgreSQL Databases
3. Create new database: `yourusername_alajo`
4. Create database user with password
5. Assign user to database with ALL PRIVILEGES

### Step 2: Upload Files
1. Build frontend assets: `npm run build`
2. Upload entire `backend/` folder contents to your domain root (e.g., `public_html/alajo/`)
3. Make sure `.env` file is uploaded

### Step 3: Configure Environment
1. Edit `.env` file in cPanel File Manager:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=yourusername_alajo
DB_USERNAME=yourusername_dbuser
DB_PASSWORD=your_secure_password
```

### Step 4: Run Migrations
1. Access Terminal in cPanel (or use SSH)
2. Navigate to your app directory
3. Run: `php artisan migrate --force`

### Step 5: Set Permissions
```bash
chmod -R 755 storage bootstrap/cache
```

### Step 6: Setup .htaccess
Ensure `public/.htaccess` redirects correctly for SPA routing.

## 🔧 Troubleshooting

### "Vite + Laravel" Default Page
- You're visiting the wrong port!
- Visit `http://localhost:8000` NOT `http://localhost:5173`

### Database Connection Errors
- Check database service is running: `sudo service postgresql status` or `sudo service mysql status`
- Verify credentials in `.env` match your database setup
- Ensure database exists: Run the CREATE DATABASE command

### Migration Errors
- Clear config cache: `php artisan config:clear`
- Check database connection first: `php artisan db:show`
- Ensure migrations table doesn't exist from previous attempts

### Composer/npm Errors
- Delete `vendor/` and `node_modules/`
- Run `composer install` and `npm install` again
- Check PHP/Node version requirements

### Permission Errors on cPanel
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## 📝 Environment Variables Reference

```env
APP_NAME=Alajo
APP_ENV=local
APP_KEY=                    # Run: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=pgsql         # or mysql, sqlite
DB_HOST=127.0.0.1
DB_PORT=5432                # 3306 for MySQL
DB_DATABASE=alajo
DB_USERNAME=postgres
DB_PASSWORD=

SESSION_DRIVER=database
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8000,127.0.0.1,127.0.0.1:8000
```

## 🎯 Next Steps

1. **Set up your database** following Option A, B, or C above
2. **Run migrations**: `php artisan migrate`
3. **Start development servers**: `./dev.sh` or manually
4. **Visit** `http://localhost:8000`
5. **Register an account** and start testing!

## 📞 Support & Contact

- WhatsApp: 08035816788
- Phone: 09088435750
- "Savings Saves Life" - Y-DEE VENTURES

## ✨ Features Summary

### For Users:
- Create multiple savings plans
- Daily, weekly, or monthly contributions
- Track progress towards goals
- Request withdrawals with bank details
- View transaction history
- Digital passbook (contribution records)

### For Admins:
- View all pending withdrawals
- Approve/reject withdrawals with notes
- View user statistics
- Manage fees and charges
- Monitor all transactions

### Business Rules:
- Minimum ₦300 contribution
- ₦200 card replacement fee
- Working days: Monday-Saturday
- Monthly transaction deadline
- Passbook verification after payment
- One day's contribution may be deducted monthly

---

**Built with:** Laravel 12, React 18, TypeScript, RTK Query, Tailwind CSS, Framer Motion
**Deployment:** Single cPanel-friendly Laravel application
**Mobile-Ready:** Fully responsive design, ready for APK conversion
