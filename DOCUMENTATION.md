# Alajo Savings Application - Complete Documentation

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Frontend Structure](#frontend-structure)
- [Key Features](#key-features)
- [User Workflows](#user-workflows)
- [Admin Features](#admin-features)
- [Security](#security)

---

## Overview

**Alajo** is a modern digital savings management application that helps users create and manage savings plans, make deposits, request withdrawals, and track their contributions through a digital passbook system. The name "Alajo" is derived from the Yoruba word for "savings."

### Core Features
- Multiple savings plans with different frequencies (daily, weekly, monthly)
- Goal-based savings with target amounts
- Digital passbook tracking (like traditional contribution books)
- Withdrawal request and approval system
- Real-time statistics and analytics
- Admin dashboard for user and transaction management
- Mobile-responsive design

---

## Technology Stack

### Backend
- **Laravel 11** - PHP framework
- **MySQL/SQLite** - Database
- **Laravel Sanctum** - API authentication
- **PHP 8.2+** - Programming language

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit (RTK Query)** - State management and API calls
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Development Tools
- **Vite** - Build tool and dev server
- **Composer** - PHP dependency management
- **npm** - JavaScript package management

---

## Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL or SQLite

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alajo
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   composer install
   ```

3. **Install frontend dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database** (SQLite for development)

   Edit `.env`:
   ```env
   DB_CONNECTION=sqlite
   # Comment out MySQL settings
   ```

   Create database file:
   ```bash
   touch database/database.sqlite
   ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Start development servers**

   Option 1 - Two terminals:
   ```bash
   # Terminal 1
   php artisan serve

   # Terminal 2
   npm run dev
   ```

   Option 2 - Helper script:
   ```bash
   ./dev.sh
   ```

8. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Test Credentials

**Admin Account:**
- Email: `admin@alajo.com`
- Password: `password`

**Regular User:**
- Email: `user@alajo.com`
- Password: `password`

---

## Architecture

### Application Structure

```
alajo/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # API controllers
│   │   │   └── Middleware/      # Custom middleware
│   │   └── Models/              # Eloquent models
│   ├── database/
│   │   ├── migrations/          # Database schema
│   │   └── seeders/             # Test data
│   ├── resources/
│   │   └── js/                  # React frontend
│   │       ├── components/      # UI components
│   │       ├── pages/           # Page components
│   │       ├── store/           # Redux store
│   │       └── types/           # TypeScript types
│   ├── routes/
│   │   └── api.php              # API routes
│   └── vite.config.ts           # Vite configuration
└── README.md
```

### Request Flow

```
User Browser
    ↓
React Frontend (Port 5173) → Hot Module Replacement
    ↓
Laravel Backend (Port 8000)
    ↓
Sanctum Authentication Middleware
    ↓
Controller → Model → Database
    ↓
JSON Response
    ↓
Redux Store Update
    ↓
React Component Re-render
```

---

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user |

**Register Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "08012345678",
  "agreed_to_terms": true
}
```

**Login Payload:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "sanctum_token_here"
  }
}
```

### User Management (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get authenticated user |
| POST | `/api/logout` | Logout user |

### Savings Plans (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/savings-plans` | List user's savings plans |
| POST | `/api/savings-plans` | Create new savings plan |
| GET | `/api/savings-plans/{id}` | Get specific savings plan |
| PUT | `/api/savings-plans/{id}` | Update savings plan |
| DELETE | `/api/savings-plans/{id}` | Delete savings plan |
| GET | `/api/savings-plans/statistics` | Get savings statistics |

**Create Savings Plan Payload:**
```json
{
  "name": "Emergency Fund",
  "type": "goal_based",
  "frequency": "daily",
  "amount_per_cycle": 500,
  "target_amount": 50000,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "description": "Building emergency fund",
  "auto_debit": true
}
```

### Transactions (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions (with filters) |
| POST | `/api/transactions` | Create deposit |
| GET | `/api/transactions/{id}` | Get transaction details |
| GET | `/api/transactions/statistics` | Get transaction statistics |

**Create Deposit Payload:**
```json
{
  "savings_plan_id": 1,
  "amount": 500,
  "payment_method": "bank_transfer",
  "description": "Daily contribution"
}
```

### Withdrawals (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/withdrawals` | List withdrawals |
| POST | `/api/withdrawals` | Request withdrawal |
| GET | `/api/withdrawals/{id}` | Get withdrawal details |
| POST | `/api/withdrawals/{id}/cancel` | Cancel pending withdrawal |

**Request Withdrawal Payload:**
```json
{
  "savings_plan_id": 1,
  "amount": 5000,
  "bank_name": "First Bank",
  "account_number": "0123456789",
  "account_name": "John Doe",
  "reason": "Emergency medical expenses"
}
```

### Contributions (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contributions` | List contributions |
| GET | `/api/contributions/passbook/{id}` | Get passbook for savings plan |
| GET | `/api/contributions/statistics` | Get contribution statistics |

### Admin Endpoints (Admin Only)

**Dashboard:**
- `GET /api/admin/dashboard/statistics` - Dashboard statistics
- `GET /api/admin/dashboard/recent-activity` - Recent activity
- `GET /api/admin/dashboard/trends` - Transaction trends

**User Management:**
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{id}` - Get user details
- `PUT /api/admin/users/{id}` - Update user
- `POST /api/admin/users/{id}/toggle-status` - Activate/suspend user
- `POST /api/admin/users/{id}/verify` - Verify user
- `POST /api/admin/users/{id}/upgrade-tier` - Upgrade account tier

**Withdrawal Management:**
- `GET /api/withdrawals/pending` - List pending withdrawals
- `POST /api/withdrawals/{id}/approve` - Approve withdrawal
- `POST /api/withdrawals/{id}/reject` - Reject withdrawal

---

## Database Schema

### Users Table
```sql
id                  BIGINT PRIMARY KEY
name                VARCHAR(255)
email               VARCHAR(255) UNIQUE
password            VARCHAR(255)
phone               VARCHAR(20) NULLABLE
address             TEXT NULLABLE
date_of_birth       DATE NULLABLE
role                ENUM('user', 'admin') DEFAULT 'user'
account_tier        ENUM('basic', 'silver', 'gold') DEFAULT 'basic'
is_active           BOOLEAN DEFAULT true
is_verified         BOOLEAN DEFAULT false
agreed_to_terms     BOOLEAN DEFAULT false
terms_agreed_at     TIMESTAMP NULLABLE
last_login_at       TIMESTAMP NULLABLE
email_verified_at   TIMESTAMP NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Savings Plans Table
```sql
id                  BIGINT PRIMARY KEY
user_id             BIGINT FOREIGN KEY → users.id
name                VARCHAR(255)
type                ENUM('daily', 'weekly', 'monthly', 'goal_based')
frequency           ENUM('daily', 'weekly', 'monthly')
amount_per_cycle    DECIMAL(10, 2)
target_amount       DECIMAL(10, 2)
current_balance     DECIMAL(10, 2) DEFAULT 0
start_date          DATE
end_date            DATE NULLABLE
auto_debit          BOOLEAN DEFAULT false
status              ENUM('active', 'paused', 'completed', 'cancelled')
description         TEXT NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE (soft deletes)
```

### Transactions Table
```sql
id                  BIGINT PRIMARY KEY
reference           VARCHAR(255) UNIQUE
user_id             BIGINT FOREIGN KEY → users.id
savings_plan_id     BIGINT FOREIGN KEY → savings_plans.id
type                ENUM('deposit', 'withdrawal', 'fee', 'refund')
amount              DECIMAL(10, 2)
fee                 DECIMAL(10, 2) DEFAULT 0
net_amount          DECIMAL(10, 2)
status              ENUM('pending', 'processing', 'completed', 'failed', 'cancelled')
payment_method      ENUM('card', 'bank_transfer', 'ussd', 'pos', 'cash')
payment_reference   VARCHAR(255) NULLABLE
description         TEXT NULLABLE
metadata            JSON NULLABLE
processed_at        TIMESTAMP NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Withdrawals Table
```sql
id                  BIGINT PRIMARY KEY
reference           VARCHAR(255) UNIQUE
user_id             BIGINT FOREIGN KEY → users.id
savings_plan_id     BIGINT FOREIGN KEY → savings_plans.id
transaction_id      BIGINT FOREIGN KEY → transactions.id NULLABLE
amount              DECIMAL(10, 2)
fee                 DECIMAL(10, 2)
net_amount          DECIMAL(10, 2)
type                ENUM('instant', 'scheduled')
status              ENUM('pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled')
bank_name           VARCHAR(255)
account_number      VARCHAR(20)
account_name        VARCHAR(255)
reason              TEXT NULLABLE
rejection_reason    TEXT NULLABLE
approved_by         BIGINT FOREIGN KEY → users.id NULLABLE
approved_at         TIMESTAMP NULLABLE
completed_at        TIMESTAMP NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Contributions Table
```sql
id                  BIGINT PRIMARY KEY
user_id             BIGINT FOREIGN KEY → users.id
savings_plan_id     BIGINT FOREIGN KEY → savings_plans.id
transaction_id      BIGINT FOREIGN KEY → transactions.id NULLABLE
serial_number       INTEGER (1-31 for daily)
contribution_date   DATE
amount              DECIMAL(10, 2)
status              ENUM('pending', 'paid', 'missed', 'skipped')
payment_method      VARCHAR(50) NULLABLE
notes               TEXT NULLABLE
collector_signature VARCHAR(255) NULLABLE
metadata            JSON NULLABLE
paid_at             TIMESTAMP NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP

UNIQUE(savings_plan_id, serial_number, contribution_date)
```

---

## Frontend Structure

### Pages

**Public Pages:**
- `/` - Landing page with app features
- `/login` - User login
- `/register` - User registration
- `/terms` - Terms and conditions

**User Dashboard:**
- `/dashboard` - Main dashboard with statistics
- `/dashboard/savings` - Manage savings plans
- `/dashboard/transactions` - Transaction history
- `/dashboard/withdrawals` - Withdrawal requests
- `/dashboard/analytics` - Charts and analytics
- `/dashboard/profile` - User profile
- `/dashboard/settings` - Account settings

**Admin Dashboard:**
- `/admin` - Admin overview
- `/admin/users` - User management
- `/admin/transactions` - All transactions
- `/admin/withdrawals` - Approve/reject withdrawals

### State Management (Redux)

**Auth Slice:**
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**RTK Query API Slices:**
- `authApi` - Authentication endpoints
- `savingsPlansApi` - Savings plans CRUD
- `transactionsApi` - Transaction management
- `withdrawalsApi` - Withdrawal management
- `contributionsApi` - Contribution tracking
- `adminApi` - Admin operations

### Key Components

**Common Components:**
- `Button` - Reusable button with variants
- `Card` - Container with shadow and padding
- `Input` - Form input with validation
- `Select` - Dropdown select
- `Table` - Data table with sorting
- `Modal` - Overlay modal dialog
- `Badge` - Status badges
- `Toast` - Notification system
- `EmptyState` - Empty state illustrations

**Layout Components:**
- `DashboardLayout` - Sidebar navigation layout
- `OnboardingModal` - First-time user guide

---

## Key Features

### 1. Savings Plans

**Plan Types:**
- **Daily** - Save every day
- **Weekly** - Save every week
- **Monthly** - Save every month
- **Goal-based** - Flexible savings toward a target

**Plan Features:**
- Minimum target: ₦300
- Progress tracking (percentage completed)
- Auto-debit option
- Pause/resume plans
- Multiple plans per user
- Soft delete (retain history)

### 2. Digital Passbook

The passbook replicates traditional contribution books used in savings groups:

**Features:**
- Serial numbers (1-31 for daily contributions)
- Monthly views
- Status tracking: pending, paid, missed, skipped
- Contribution streaks
- Historical records

**Statistics:**
- Total contributions
- Paid vs missed count
- Total amount saved
- Current streak
- Longest streak

### 3. Transactions

**Transaction Types:**
- **Deposit** - Add money to savings plan
- **Withdrawal** - Remove money (requires approval)
- **Fee** - Transaction fees
- **Refund** - Returned funds

**Features:**
- Unique reference numbers (e.g., TXN123ABC)
- Multiple payment methods
- Fee calculation (1% for withdrawals)
- Transaction history with filters
- Real-time status updates

### 4. Withdrawal System

**User Flow:**
1. User requests withdrawal
2. Enters bank details and reason
3. Withdrawal created with status "pending"
4. Admin reviews request
5. Admin approves/rejects
6. On approval: balance deducted, transaction created
7. User notified of status

**Business Rules:**
- 1% withdrawal fee
- Cannot withdraw more than current balance
- Pending withdrawals can be cancelled by user
- Only admins can approve/reject

### 5. Statistics & Analytics

**User Statistics:**
- Total savings across all plans
- Active vs completed plans
- Total deposits and withdrawals
- Monthly contribution trends
- Savings goal progress

**Admin Statistics:**
- Total users (active, verified, by tier)
- Total savings value locked
- Transaction volume and fees
- Pending withdrawal count
- User growth trends
- Revenue analytics

---

## User Workflows

### Creating a Savings Plan

1. Navigate to Dashboard → Savings Plans
2. Click "Create New Plan"
3. Fill in details:
   - Plan name
   - Target amount (minimum ₦300)
   - Frequency (daily/weekly/monthly)
   - Amount per cycle
   - Start and end dates
   - Description (optional)
4. Submit form
5. Plan created with status "active"

### Making a Deposit

1. Navigate to Dashboard → Transactions
2. Click "Make Deposit"
3. Select savings plan
4. Enter amount (minimum ₦300)
5. Choose payment method
6. Submit
7. Transaction created, balance updated
8. Contribution recorded in passbook

### Requesting a Withdrawal

1. Navigate to Dashboard → Withdrawals
2. Click "Request Withdrawal"
3. Select savings plan
4. Enter amount (max: current balance)
5. Provide bank details:
   - Bank name
   - Account number (10 digits)
   - Account name
6. Add reason (optional)
7. Submit request
8. Withdrawal created with status "pending"
9. Wait for admin approval

### Viewing Digital Passbook

1. Navigate to Dashboard → Savings Plans
2. Click on a specific plan
3. View passbook tab
4. See contributions by month:
   - Serial number (1-31)
   - Date
   - Amount
   - Status (paid/missed/pending)
5. View statistics:
   - Current streak
   - Longest streak
   - Total contributions

---

## Admin Features

### User Management

**Capabilities:**
- View all users with filters
- Search by name, email, phone
- View user details and activity
- Activate/suspend accounts
- Verify users
- Upgrade account tiers (basic → silver → gold)
- View user's savings plans and transactions

### Withdrawal Management

**Admin Dashboard → Withdrawals:**
1. View all pending withdrawals
2. Click on withdrawal to review:
   - User details
   - Savings plan info
   - Withdrawal amount and fee
   - Bank details
   - User's reason
3. Take action:
   - **Approve:** Deducts balance, creates transaction
   - **Reject:** Provide rejection reason, no balance change
4. User notified of decision

### Transaction Monitoring

- View all transactions across all users
- Filter by type, status, date range
- Search by reference number
- Monitor failed transactions
- Track fee revenue

### Dashboard Analytics

- User growth trends
- Transaction volume charts
- Revenue from fees
- Savings distribution by frequency
- Active vs inactive users
- Top savers leaderboard

---

## Security

### Authentication
- **Laravel Sanctum** - Token-based authentication
- Tokens stored in localStorage
- Bearer token sent in Authorization header
- Token validation on every protected request

### Authorization
- **Middleware:**
  - `auth:sanctum` - Validates authentication
  - `admin` - Validates admin role
- **Resource Ownership:**
  - Users can only access their own data
  - Admins can access all data

### Validation
- Server-side validation for all inputs
- Minimum/maximum value constraints
- Unique email enforcement
- Strong password requirements (min 8 characters)
- Account number format validation (10 digits)

### Data Protection
- Password hashing with bcrypt
- SQL injection protection via Eloquent ORM
- Mass assignment protection (fillable attributes)
- CORS configuration for API access
- Input sanitization

### Business Logic Security
- Balance checks before withdrawals
- Cannot delete plans with balance > 0
- Transaction integrity via database transactions
- Audit trails (created_at, updated_at)
- Soft deletes for data retention

---

## API Response Format

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

**Error Response (Validation):**
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Error Response (Unauthorized):**
```json
{
  "message": "Unauthenticated"
}
```

**Error Response (Forbidden):**
```json
{
  "message": "Access denied. Admin privileges required."
}
```

---

## HTTP Status Codes

- `200` - OK (successful GET, PUT, DELETE)
- `201` - Created (successful POST)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error (server exception)

---

## Environment Configuration

### Required Environment Variables

```env
# Application
APP_NAME=Alajo
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite for development)
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

# Laravel Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:8000

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache
CACHE_DRIVER=file

# Queue
QUEUE_CONNECTION=sync
```

---

## Deployment Checklist

### Backend Deployment
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate new `APP_KEY`
- [ ] Configure production database (MySQL)
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Seed admin user: `php artisan db:seed --class=UserSeeder`
- [ ] Configure CORS for frontend domain
- [ ] Set up queue workers for background jobs
- [ ] Configure caching (Redis recommended)
- [ ] Set up SSL certificate
- [ ] Configure backup strategy

### Frontend Deployment
- [ ] Update API base URL in frontend
- [ ] Build production assets: `npm run build`
- [ ] Test production build locally
- [ ] Deploy static assets to CDN (optional)
- [ ] Configure environment-specific settings

### Security Hardening
- [ ] Enable rate limiting
- [ ] Configure CSP headers
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement API request logging
- [ ] Set up monitoring and alerts

---

## Troubleshooting

### Common Issues

**"Vite manifest not found" error:**
- Solution: Run both `php artisan serve` AND `npm run dev`
- Or use: `./dev.sh`

**"NOT NULL constraint failed" during seeding:**
- Solution: Migrations and seeders out of sync
- Fix: Update seeders to match migration schema

**"Unauthenticated" errors:**
- Solution: Token not being sent or expired
- Check localStorage has valid token
- Verify Authorization header: `Bearer {token}`

**React preamble detection error:**
- Solution: React version incompatibility
- Use React 18.3.1 (not React 19)

**Login redirects to wrong page:**
- Solution: Check user role
- Admin users → `/admin`
- Regular users → `/dashboard`

**Withdrawal approval not working:**
- Solution: Ensure admin middleware is active
- Check user has `role='admin'`

---

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test thoroughly (manual + automated)
4. Create pull request
5. Wait for review and approval
6. Merge to main

### Code Style
- **PHP:** Follow PSR-12 coding standards
- **JavaScript/TypeScript:** Use Prettier + ESLint
- **Commits:** Use conventional commit format

---

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoint documentation
- Test with seeded credentials first

---

## License

This project is proprietary software. All rights reserved.

---

**Last Updated:** November 2024
**Version:** 1.0.0
**Author:** Alajo Development Team
