# 🚀 Full Stack Quick Start Guide

## Prerequisites

- PHP 8.2+ with Composer
- Node.js 18+
- SQLite (or PostgreSQL/MySQL)

---

## 🎯 One-Command Setup

### Backend Setup (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# (Optional) Seed database with test data
php artisan db:seed

# Start Laravel server
php artisan serve
# Backend now running at: http://localhost:8000
```

### Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Environment file already created (.env.local)
# Start Next.js dev server
npm run dev
# Frontend now running at: http://localhost:3000
```

---

## 🌐 Access the Application

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:8000/api

---

## ✅ Testing the Connection

### 1. Open your browser to http://localhost:3000

### 2. Try to register a new account:
- Name: Test User
- Email: test@example.com
- Password: password123

### 3. If registration works, you're connected! 🎉

---

## 🛠️ Development Workflow

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend && php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### Watching Logs

**Backend logs:**
```bash
tail -f backend/storage/logs/laravel.log
```

**Frontend logs:**
Check the terminal where `npm run dev` is running

---

## 🔑 Important Environment Variables

### Backend (.env)
```env
APP_URL=http://localhost:8000
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173

DB_CONNECTION=sqlite
# Or use MySQL/PostgreSQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=alajo
# DB_USERNAME=root
# DB_PASSWORD=
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Issue: "CORS Error" or "Network Error"

**Solution:**
1. Make sure backend is running on port 8000
2. Check that CORS config allows localhost:3000
3. Verify `.env` has correct `SANCTUM_STATEFUL_DOMAINS`

### Issue: "401 Unauthorized"

**Solution:**
1. Clear your browser localStorage
2. Try logging in again
3. Check that auth token is being sent in requests

### Issue: "Database not found"

**Solution:**
```bash
cd backend
php artisan migrate:fresh
php artisan db:seed
```

### Issue: "Module not found" in frontend

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Testing API Endpoints

### Using curl:

```bash
# Register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user (with token from login)
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 What's Connected Now

✅ **Backend APIs (100% Complete):**
- Authentication (register, login, logout)
- Savings Plans (CRUD + contribute)
- Ajo Groups (CRUD + join/leave/contribute)
- Transactions
- Withdrawals
- Bank Accounts
- Passbook
- Dashboard stats
- Profile management

✅ **Frontend Pages (95% Complete):**
- Landing & Onboarding
- Login & Register
- Dashboard
- Savings (list, create, details, contribute, withdraw)
- Ajo Groups (list, create, join, details, cashbook)
- Transactions
- Passbook
- Profile

⚠️ **Missing (Nice-to-have):**
- Profile edit pages (5 sub-pages)
- Payment gateway integration (Paystack/Flutterwave)
- Email/SMS notifications

---

## 🚀 Next Steps

1. **Test the full user flow:**
   - Register → Login → Create Savings Plan → Contribute → View Transactions

2. **Build missing profile pages:**
   - Edit personal info
   - Manage payment methods
   - Change password
   - Two-factor auth

3. **Integrate Paystack:**
   - For real money contributions
   - See: https://paystack.com/docs

4. **Add notifications:**
   - Email confirmations
   - SMS reminders

---

## 📚 Additional Resources

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Laravel Docs**: https://laravel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Sanctum Auth**: https://laravel.com/docs/sanctum

---

**Happy Coding! 🎉**

Last Updated: 2025-11-18
