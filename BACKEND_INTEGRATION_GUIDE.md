# Backend Integration Guide - Laravel APIs

This guide shows all the Laravel API endpoints you need to create to connect with the Alajo frontend.

## Setup

### 1. Environment Configuration

In your Laravel `.env` file:
```env
FRONTEND_URL=http://localhost:3000
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### 2. CORS Configuration (`config/cors.php`)

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

---

## Required API Endpoints

### Authentication (`routes/api.php`)

```php
// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
```

**Expected Responses:**

```php
// POST /api/register
{
  "token": "1|xxxxx",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": null,
    "created_at": "2024-11-14T..."
  }
}

// POST /api/login
{
  "token": "2|xxxxx",
  "user": { ... }
}

// GET /api/user
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  ...
}
```

---

### Dashboard

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/activities', [DashboardController::class, 'activities']);
});
```

**Expected Response:**

```php
// GET /api/dashboard
{
  "total_savings": 500000,
  "active_plans": 3,
  "total_withdrawn": 50000,
  "savings_plans": [
    {
      "id": 1,
      "name": "iPhone 15 Fund",
      "emoji": "📱",
      "current_amount": 245000,
      "target_amount": 500000,
      "progress": 49,
      ...
    }
  ],
  "recent_transactions": [ ... ],
  "ajo_groups": [ ... ]
}
```

---

### Savings Plans

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/savings-plans', [SavingsPlanController::class, 'index']);
    Route::post('/savings-plans', [SavingsPlanController::class, 'store']);
    Route::get('/savings-plans/{id}', [SavingsPlanController::class, 'show']);
    Route::put('/savings-plans/{id}', [SavingsPlanController::class, 'update']);
    Route::delete('/savings-plans/{id}', [SavingsPlanController::class, 'destroy']);

    // Contributions
    Route::post('/savings-plans/{id}/contribute', [SavingsPlanController::class, 'contribute']);
    Route::get('/savings-plans/{id}/contributions', [SavingsPlanController::class, 'contributions']);
});
```

**Expected Request/Response:**

```php
// POST /api/savings-plans
Request:
{
  "name": "iPhone 15 Fund",
  "emoji": "📱",
  "target_amount": 500000,
  "frequency": "monthly",
  "duration": 12,
  "plan_type": "personal",
  "description": "Saving for new iPhone"
}

Response:
{
  "id": 1,
  "name": "iPhone 15 Fund",
  "emoji": "📱",
  "target_amount": 500000,
  "current_amount": 0,
  "frequency": "monthly",
  "duration": 12,
  "plan_type": "personal",
  "description": "Saving for new iPhone",
  "created_at": "2024-11-14T...",
  ...
}

// POST /api/savings-plans/1/contribute
Request:
{
  "amount": 25000,
  "payment_method": "Bank Transfer",
  "reference": "TRX-123456"
}

Response:
{
  "id": 1,
  "plan_id": 1,
  "amount": 25000,
  "payment_method": "Bank Transfer",
  "reference": "TRX-123456",
  "status": "completed",
  "created_at": "2024-11-14T..."
}
```

---

### Transactions

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
});
```

**Expected Response:**

```php
// GET /api/transactions?type=contribution&status=completed
{
  "data": [
    {
      "id": 1,
      "type": "contribution",
      "plan": {
        "id": 1,
        "name": "iPhone 15 Fund",
        "emoji": "📱"
      },
      "amount": 25000,
      "status": "completed",
      "payment_method": "Bank Transfer",
      "reference": "TRX-2024111401",
      "date": "2024-11-14",
      "time": "14:30"
    },
    ...
  ],
  "meta": {
    "total": 10,
    "per_page": 20,
    ...
  }
}
```

---

### Withdrawals

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/withdrawals', [WithdrawalController::class, 'index']);
    Route::post('/withdrawals', [WithdrawalController::class, 'store']);
    Route::get('/withdrawals/{id}', [WithdrawalController::class, 'show']);
    Route::delete('/withdrawals/{id}', [WithdrawalController::class, 'cancel']);
});
```

**Expected Request/Response:**

```php
// POST /api/withdrawals
Request:
{
  "plan_id": 1,
  "amount": 100000,
  "bank_account_id": 1,
  "reason": "Need money for emergency",
  "type": "partial"
}

Response:
{
  "id": 1,
  "plan_id": 1,
  "amount": 100000,
  "bank_account_id": 1,
  "reason": "Need money for emergency",
  "type": "partial",
  "status": "pending",
  "reference": "WD-1731599999",
  "created_at": "2024-11-14T..."
}
```

---

### Passbook

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/passbook', [PassbookController::class, 'index']);
    Route::get('/passbook/plan/{planId}', [PassbookController::class, 'planPassbook']);
});
```

**Expected Response:**

```php
// GET /api/passbook?month=11&year=2024
{
  "account_holder": "Chioma Adeyemi",
  "phone": "+234 803 456 7890",
  "account_number": "HJ-2024-001234",
  "member_since": "2024-01-15",
  "plan": {
    "name": "iPhone 15 Fund",
    "type": "Daily Contribution"
  },
  "current_month": "November 2024",
  "contributions": [
    {
      "day": 1,
      "date": "2024-11-01",
      "amount": 1000,
      "signature": "CA",
      "verified": true
    },
    ...
  ]
}
```

---

### Ajo Groups

```php
Route::middleware('auth:sanctum')->group(function () {
    // Group Management
    Route::get('/ajo-groups', [AjoGroupController::class, 'index']);
    Route::post('/ajo-groups', [AjoGroupController::class, 'store']);
    Route::get('/ajo-groups/{id}', [AjoGroupController::class, 'show']);
    Route::put('/ajo-groups/{id}', [AjoGroupController::class, 'update']);
    Route::delete('/ajo-groups/{id}', [AjoGroupController::class, 'destroy']);

    // Search & Join
    Route::get('/ajo-groups/search/{code}', [AjoGroupController::class, 'searchByCode']);
    Route::post('/ajo-groups/{id}/join', [AjoGroupController::class, 'join']);
    Route::post('/ajo-groups/{id}/leave', [AjoGroupController::class, 'leave']);

    // Members
    Route::get('/ajo-groups/{id}/members', [AjoGroupController::class, 'members']);
    Route::post('/ajo-groups/{id}/members/{memberId}/approve', [AjoGroupController::class, 'approveMember']);
    Route::delete('/ajo-groups/{id}/members/{memberId}', [AjoGroupController::class, 'removeMember']);

    // Schedule & Contributions
    Route::get('/ajo-groups/{id}/schedule', [AjoGroupController::class, 'schedule']);
    Route::post('/ajo-groups/{id}/contribute', [AjoGroupController::class, 'contribute']);
});
```

**Expected Request/Response:**

```php
// POST /api/ajo-groups
Request:
{
  "name": "Office Squad Savings",
  "description": "Monthly savings for office",
  "contribution_amount": 20000,
  "group_size": 10,
  "rotation_type": "monthly",
  "selection_method": "sequential",
  "start_date": "2024-12-01",
  "auto_reminders": true,
  "require_approval": true
}

Response:
{
  "id": 1,
  "code": "AJO-ABC123",
  "name": "Office Squad Savings",
  "description": "Monthly savings for office",
  "contribution_amount": 20000,
  "group_size": 10,
  "current_members": 1,
  "rotation_type": "monthly",
  "selection_method": "sequential",
  "start_date": "2024-12-01",
  "status": "pending",
  "created_at": "2024-11-14T...",
  ...
}

// GET /api/ajo-groups/1
Response:
{
  "id": 1,
  "code": "AJO-ABC123",
  "name": "Office Squad Savings",
  "total_pool": 200000,
  "next_payout_date": "2024-12-15",
  "members": [
    {
      "id": 1,
      "name": "Chioma Adeyemi",
      "avatar": "👩🏾",
      "position": 1,
      "has_paid": true,
      "collected_at": "2024-11-01",
      "role": "collector"
    },
    ...
  ],
  "payout_schedule": [
    {
      "position": 1,
      "name": "Chioma Adeyemi",
      "date": "2024-11-01",
      "status": "completed",
      "amount": 200000
    },
    ...
  ]
}
```

---

### Profile & Settings

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Bank Accounts
    Route::get('/profile/bank-accounts', [ProfileController::class, 'bankAccounts']);
    Route::post('/profile/bank-accounts', [ProfileController::class, 'addBankAccount']);
    Route::delete('/profile/bank-accounts/{id}', [ProfileController::class, 'deleteBankAccount']);

    // Settings
    Route::put('/profile/settings', [ProfileController::class, 'updateSettings']);
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword']);
});
```

---

## Database Models Needed

### Core Models

1. **User** - Already exists
2. **SavingsPlan** - Personal savings goals
3. **Contribution** - Payments to savings plans
4. **Transaction** - All financial transactions
5. **Withdrawal** - Withdrawal requests
6. **AjoGroup** - Group savings
7. **AjoMember** - Group membership
8. **AjoContribution** - Group contributions
9. **BankAccount** - User bank accounts
10. **Passbook** - Digital passbook records

### Relationships

```php
// User.php
public function savingsPlans() {
    return $this->hasMany(SavingsPlan::class);
}

public function ajoGroups() {
    return $this->belongsToMany(AjoGroup::class, 'ajo_members');
}

public function transactions() {
    return $this->hasMany(Transaction::class);
}

// SavingsPlan.php
public function user() {
    return $this->belongsTo(User::class);
}

public function contributions() {
    return $this->hasMany(Contribution::class);
}

// AjoGroup.php
public function members() {
    return $this->belongsToMany(User::class, 'ajo_members')
                ->withPivot('position', 'role', 'status', 'joined_at');
}

public function collector() {
    return $this->belongsTo(User::class, 'collector_id');
}
```

---

## Frontend Integration Steps

### 1. Set Environment Variables

Create `/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Test Authentication

The login page is already integrated. Test it:
- Start Laravel backend: `php artisan serve`
- Start Next.js: `npm run dev`
- Try logging in at http://localhost:3000/login

### 3. Remove DEV MODE

Once backend is ready, remove this from `/app/dashboard/page.tsx`:

```typescript
// Remove these lines:
// DEV MODE: Skip authentication for UI testing
const mockUser = { ... }
setUser(mockUser)

// Uncomment these lines:
const token = localStorage.getItem('auth_token')
const storedUser = localStorage.getItem('user')

if (!token || !storedUser) {
  router.push('/login')
  return
}

setUser(JSON.parse(storedUser))
```

### 4. Integrate Other Pages

Follow this pattern for all pages:

```typescript
// Example: Savings Plans Page
import { savingsAPI } from '@/lib/api'
import { useEffect, useState } from 'react'

const [plans, setPlans] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchPlans = async () => {
    try {
      const data = await savingsAPI.getPlans()
      setPlans(data)
    } catch (error) {
      console.error('Failed to load plans:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchPlans()
}, [])
```

---

## Error Handling

The API client automatically handles 401 errors (redirects to login). For other errors:

```typescript
try {
  await savingsAPI.createPlan(data)
  router.push('/savings')
} catch (error: any) {
  const message = error.response?.data?.message || 'Something went wrong'
  alert(message) // Or use a toast notification
}
```

---

## Next Steps

1. ✅ API service layer created (`/lib/api.ts`)
2. ✅ Environment variables set up (`.env.example`)
3. ✅ Custom hook for API calls (`/lib/hooks/useAPI.ts`)
4. ⏳ Build Laravel controllers
5. ⏳ Create database migrations
6. ⏳ Test each endpoint
7. ⏳ Remove mock data from pages
8. ⏳ Add loading states
9. ⏳ Add error notifications

---

## Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Create savings plan
- [ ] Make contribution
- [ ] View transactions
- [ ] Request withdrawal
- [ ] View passbook
- [ ] Create Ajo group
- [ ] Join Ajo group
- [ ] View group details
- [ ] Update profile
- [ ] Add bank account

---

Let me know if you need help with any specific Laravel controller implementation!
