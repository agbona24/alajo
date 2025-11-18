# Backend Exploration Report: Alajo Savings App

## 1. Backend Framework & Setup

### Framework Used: Laravel 12.0 (PHP)
- **Language**: PHP 8.2+
- **Framework**: Laravel 12.0
- **Database**: SQLite (local), PostgreSQL (production)
- **Authentication**: Laravel Sanctum (API tokens)
- **Authorization**: Middleware-based role checking

### Configuration Files
- `.env.example`: Database, mail, and Ajo-specific configuration
- `composer.json`: PHP dependencies (minimal, only Laravel core + Sanctum)
- `phpunit.xml`: Test configuration with SQLite in-memory database

### Environment Variables (from .env.example)
```
AJO_ORGANIZER_FEE_PERCENTAGE=2
AJO_LATE_FEE_PERCENTAGE=5
AJO_LATE_DAYS_THRESHOLD=7
AJO_MIN_GROUP_SIZE=3
AJO_MAX_GROUP_SIZE=50
AJO_NOTIFICATIONS_ENABLED=true
AJO_REMINDERS_LEAD_TIME_HOURS=24
```

---

## 2. Implemented API Endpoints

### Authentication Endpoints (2/2) ✅
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout (Protected)
- `GET /api/user` - Get current user (Protected)

### Dashboard Endpoints (2/2) ✅
- `GET /api/dashboard/summary` - Get user savings & ajo summary (Protected)
- `GET /api/dashboard/stats` - Monthly trends and breakdown (Protected)

### Profile Endpoints (4/5) ✅ (partial)
- `GET /api/profile` - Get user profile (Protected)
- `PUT /api/profile` - Update profile (Protected)
- `POST /api/profile/password` - Change password (Protected)
- `POST /api/profile/settings` - Update settings (Protected)
- `GET /api/profile/bank-accounts` - Get bank accounts (Protected)
- **MISSING**: Delete bank account endpoint (DELETE route not registered despite controller support)

### Bank Accounts Endpoints (4/5) ✅ (partial)
- `GET /api/bank-accounts` - List bank accounts (Protected)
- `POST /api/bank-accounts` - Add bank account (Protected)
- `GET /api/bank-accounts/{id}` - Get single account (Protected)
- `PUT /api/bank-accounts/{id}` - Update account (Protected)
- `DELETE /api/bank-accounts/{id}` - Delete account (Protected) ✅

### Savings Plans Endpoints (6/6) ✅
- `GET /api/savings-plans` - List plans (Protected)
- `POST /api/savings-plans` - Create plan (Protected)
- `GET /api/savings-plans/{id}` - Get plan details (Protected)
- `PUT /api/savings-plans/{id}` - Update plan (Protected)
- `DELETE /api/savings-plans/{id}` - Delete plan (Protected)
- `POST /api/savings-plans/{id}/contribute` - Make contribution (Protected)

### Transactions Endpoints (2/2) ✅
- `GET /api/transactions` - List transactions (Protected)
- `GET /api/transactions/{id}` - Get transaction details (Protected)

### Withdrawals Endpoints (4/4) ✅
- `GET /api/withdrawals` - List withdrawals (Protected)
- `POST /api/withdrawals` - Request withdrawal (Protected)
- `GET /api/withdrawals/{id}` - Get withdrawal details (Protected)
- `POST /api/withdrawals/{id}/approve` - Approve withdrawal (Protected)
- `POST /api/withdrawals/{id}/complete` - Complete withdrawal (Protected)

### Ajo Groups Endpoints (8/11) ⚠️ (partial)
- `GET /api/ajo-groups` - List user's groups (Protected)
- `POST /api/ajo-groups` - Create group (Protected)
- `GET /api/ajo-groups/search` - Search by code (Protected)
- `GET /api/ajo-groups/{id}` - Get group details (Protected)
- `PUT /api/ajo-groups/{id}` - Update group (Protected)
- `POST /api/ajo-groups/{id}/join` - Join group (Protected)
- `GET /api/ajo-groups/{id}/members` - Get members (Protected)
- `GET /api/ajo-groups/{id}/schedule` - Get payout schedule (Protected)
- `POST /api/ajo-groups/{id}/contribute` - Make contribution (Protected)
- **MISSING**: `DELETE /api/ajo-groups/{id}` - Delete group (Frontend expects it)
- **MISSING**: `POST /api/ajo-groups/{id}/leave` - Leave group (Frontend expects it)
- **MISSING**: `DELETE /api/ajo-groups/{id}/members/{memberId}` - Remove member (Frontend expects it, but approveMember exists)

### Ajo Member Management (1/3) ⚠️
- `POST /api/ajo-groups/{groupId}/members/{memberId}/approve` - Approve member (Protected)
- **MISSING**: Leave group endpoint
- **MISSING**: Remove member endpoint

### Daily Payment Tracking (4/4) ✅
- `GET /api/ajo-groups/{groupId}/payments` - Get payment records (Protected)
- `POST /api/ajo-groups/{groupId}/payments/mark` - Mark single payment (Protected)
- `POST /api/ajo-groups/{groupId}/payments/bulk-mark` - Mark multiple payments (Protected)
- `GET /api/ajo-groups/{groupId}/payments/summary` - Get summary (Protected)
- `GET /api/ajo-groups/{groupId}/payments/calendar` - Get calendar view (Protected)

### Ajo Contributions (3/3) ✅
- `POST /api/ajo-groups/{groupId}/contributions` - Make contribution (Protected)
- `GET /api/ajo-groups/{groupId}/contributions` - List contributions (Protected)
- `GET /api/ajo-groups/{groupId}/contributions/my-contributions` - User's contributions (Protected)
- `GET /api/ajo-groups/{groupId}/contributions/statistics` - Contribution stats (Protected)

### Ajo Payouts (4/4) ✅
- `POST /api/ajo-groups/{groupId}/payouts` - Create payout (Protected)
- `GET /api/ajo-groups/{groupId}/payouts` - List payouts (Protected)
- `POST /api/ajo-groups/{groupId}/payouts/{payoutId}/complete` - Complete payout (Protected)
- `GET /api/ajo-groups/{groupId}/payouts/schedule` - Get schedule (Protected)
- `GET /api/ajo-groups/{groupId}/payouts/my-payout` - User's payout (Protected)

### Ajo Activities (1/1) ✅
- `GET /api/ajo-groups/{groupId}/activities` - Get group activities (Protected)

---

## 3. Database Models (13 Models)

### Core Models
1. **User** ✅
   - Relationships: savingsPlans, contributions, transactions, withdrawals, bankAccounts, passbookRecords, ajoGroups, ajoMemberships
   - Features: API token support via Sanctum

2. **SavingsPlan** ✅
   - Fields: name, emoji, target_amount, current_amount, frequency, duration, plan_type, status
   - Relationships: contributions, transactions, withdrawals, passbookRecords
   - Computed attributes: progress_percentage, remaining_amount

3. **Contribution** ✅
   - Fields: amount, payment_method, reference, status, completed_at
   - Relationships: user, savingsPlan, ajoGroup

4. **Withdrawal** ✅
   - Fields: amount, status, reason, rejection_reason, approved_at, completed_at
   - Relationships: user, savingsPlan, bankAccount, approvedBy

5. **Transaction** ✅
   - Fields: type, amount, balance_before, balance_after, payment_method, status
   - Relationships: user, savingsPlan, ajoGroup

6. **PassbookRecord** ✅
   - Fields: month, year, day_of_month, contribution_date, amount, status
   - Relationships: user, savingsPlan, contribution

7. **BankAccount** ✅
   - Fields: bank_name, bank_code, account_number, account_name, is_primary, is_verified
   - Relationships: user, withdrawals
   - Features: Soft deletes

### Ajo-Specific Models
8. **AjoGroup** ✅
   - Fields: name, code, contribution_amount, group_size, rotation_type, selection_method, status, current_cycle
   - Relationships: creator, members, ajoMembers, contributions, payouts, activities, dailyPayments
   - Helper methods: isRecruiting(), isActive(), isFull(), canStart(), generateJoinCode()
   - Features: Soft deletes

9. **AjoMember** ✅
   - Fields: position, status, is_admin, joined_at, total_contributed, current_cycle_paid, has_received_payout
   - Relationships: ajoGroup, user, contributions, payouts
   - Helper methods: isActive(), isPending(), isRemoved(), hasReceivedPayout(), isOrganizer()

10. **AjoContribution** ✅
    - Fields: cycle_number, amount, status, due_date, paid_date, is_late, late_fee
    - Relationships: ajoGroup, ajoMember, user, transaction
    - Scopes: forCycle(), paid(), pending(), missed()

11. **AjoPayout** ✅
    - Fields: cycle_number, payout_amount, organizer_fee, net_amount, status, scheduled_date, completed_date
    - Relationships: ajoGroup, ajoMember, user, transaction
    - Features: Auto-generates reference, calculates net amount
    - Scopes: forCycle(), pending(), completed()

12. **AjoActivity** ✅
    - Fields: action, description, metadata (JSON)
    - Relationships: ajoGroup, user
    - Features: Static log() method for easy activity recording, only has created_at timestamp

13. **DailyPayment** ✅
    - Fields: payment_date, amount, status, payment_method, recorded_by, notes, paid_at
    - Relationships: ajoGroup, user, recordedBy
    - Scopes: paid(), pending(), forGroup(), forUser(), forDate(), forDateRange()
    - Methods: markAsPaid(), markAsMissed()

---

## 4. Authentication & Authorization

### Authentication Method
- **Type**: Laravel Sanctum (stateless API tokens)
- **Token Storage**: Client-side localStorage (frontend expects 'auth_token')
- **Flow**:
  1. User registers/logs in
  2. Server generates token via `$user->createToken('auth-token')->plainTextToken`
  3. Client stores token in localStorage
  4. Client sends token in Authorization header: `Bearer {token}`

### Authorization
- **Middleware**: `auth:sanctum` protects all API routes except register/login
- **Role-based checks**: 
  - Admin/organizer roles checked via `is_admin` field on AjoMember
  - Group ownership verified in controllers
  - User data isolation (users can only access their own resources)

### Security Issues
- ⚠️ Withdrawal approval allows any authenticated user to approve (see WithdrawalController line 65)
- ⚠️ No explicit role/permission system (only is_admin boolean on AjoMember)

---

## 5. Payment Integrations

### Status: NOT IMPLEMENTED ❌

The backend mentions payment methods in validation:
```php
'payment_method' => 'required|in:card,bank_transfer,wallet,cash,paystack,flutterwave'
```

But there are **NO actual payment gateway integrations**:
- ❌ No Paystack SDK/integration
- ❌ No Flutterwave SDK/integration
- ❌ No payment processing endpoints
- ❌ No webhook handlers for payment confirmations
- ❌ Payments are recorded as strings only, not processed

### What's Missing
1. Payment gateway SDKs in composer.json
2. Payment service classes
3. Webhook endpoints for payment confirmations
4. Payment status tracking (payment is marked as completed immediately)
5. Refund handling
6. Fee calculation per gateway

---

## 6. Controllers Summary (13 Controllers)

### API Controllers (12/12 implemented, but 1 missing)
1. **AuthController** - Register, login, logout, user info ✅
2. **SavingsPlanController** - Full CRUD + contributions ✅
3. **ContributionController** - Savings plan contributions ✅
4. **WithdrawalController** - Withdrawal requests & processing ✅
5. **TransactionController** - Transaction listing & filtering ✅
6. **BankAccountController** - Bank account CRUD ✅
7. **ProfileController** - Profile, password, settings, bank accounts ✅
8. **DashboardController** - Summary & statistics ✅
9. **AjoGroupController** - Group CRUD + member management (partial) ✅
10. **AjoContributionController** - Contribution tracking & statistics ✅
11. **AjoPayoutController** - Payout processing & scheduling ✅
12. **DailyPaymentController** - Daily payment tracking ✅
13. **AjoActivityController** - ❌ IMPORTED IN ROUTES BUT NOT IMPLEMENTED

### Web Controllers (2 basic stubs)
- CollectorController (incomplete)
- AdminController (incomplete)

---

## 7. Frontend vs Backend API Comparison

### Frontend API Expectations (from lib/api.ts)

| Feature | Frontend Endpoint | Backend Status |
|---------|------------------|-----------------|
| **Auth** | register, login, logout, getUser | ✅ All 4 implemented |
| **Savings Plans** | CRUD + contribute | ✅ All 6 implemented |
| **Transactions** | getAll, getById | ✅ Both implemented |
| **Withdrawals** | create, getAll, getById, cancel | ⚠️ cancel uses DELETE not implemented, approve/complete exist instead |
| **Passbook** | get(), getPlanPassbook() | ❌ NOT IMPLEMENTED - model exists but no controller/routes |
| **Ajo Groups** | getAll, getById, create, update, delete, searchByCode, join, leave, getMembers, getSchedule, contribute, approveMember, removeMember | ⚠️ 9/13 implemented (missing: delete, leave, removeMember) |
| **Profile** | get, update, getBankAccounts, addBankAccount, deleteBankAccount, updateSettings, changePassword | ⚠️ 6/7 implemented (missing: deleteBankAccount route registration) |
| **Dashboard** | getSummary, getActivities | ⚠️ 1.5/2 implemented (getActivities endpoint missing) |

---

## 8. Testing Setup

### Test Framework
- **PHPUnit 11.5.3** configured
- **Test Database**: SQLite in-memory `:memory:`
- **Refresh Database**: Enabled for test isolation

### Existing Tests (Limited)
1. **AjoGroupTest** - 10 model tests covering:
   - Group creation
   - Relationships
   - Status checks (recruiting, active, full)
   - Code generation
   
2. **AjoContributionTest** - Empty stub

### Missing Tests
- ❌ API endpoint integration tests
- ❌ Authentication tests
- ❌ Authorization/permission tests
- ❌ Payment processing tests
- ❌ Contribution calculation tests
- ❌ Payout logic tests

---

## 9. What's Implemented vs Missing

### Fully Implemented ✅
1. User authentication with Sanctum
2. Savings plans (CRUD + contributions)
3. Basic transactions tracking
4. Bank accounts management
5. Ajo groups creation and management
6. Ajo member joining with approval system
7. Contribution tracking with late fees
8. Payout processing and scheduling
9. Daily payment tracking for cash collections
10. Activity logging for group actions
11. Dashboard summary and statistics

### Partially Implemented ⚠️
1. **Withdrawals** - Request/approval/completion exists but withdrawal cancellation not routed
2. **Ajo Groups** - Missing delete, leave group, and remove member endpoints
3. **Profile** - Missing deleteBankAccount route registration
4. **Dashboard** - Missing getActivities endpoint
5. **Passbook** - Model exists but no controller/routes

### Not Implemented ❌
1. **Payment Gateway Integration** - Paystack, Flutterwave mentioned but not integrated
2. **Passbook Endpoints** - Expected by frontend but not exposed via API
3. **AjoActivityController** - Imported in routes but file doesn't exist
4. **Real Payment Processing** - Payments marked as completed without actual processing
5. **Email/SMS Notifications** - Configured in .env but no service implementation
6. **Webhook Handling** - Payment confirmations not handled
7. **2FA/MFA** - Not implemented
8. **KYC Verification** - Not implemented
9. **Advanced Permissions** - Only admin boolean, no granular permissions

---

## 10. Key Architecture Decisions

### Database
- **Relationships**: Well-structured with proper foreign keys
- **Soft Deletes**: Implemented on SavingsPlan, AjoGroup, BankAccount
- **Activity Logging**: Integrated activity tracking on AjoActivity model

### API Design
- **RESTful**: Uses standard HTTP methods (GET, POST, PUT, DELETE)
- **Resource-based**: Organized around entities
- **Pagination**: Some endpoints paginate results (payouts, contributions)
- **Validation**: Input validation at controller level

### Error Handling
- **Exceptions**: Uses Laravel exception handling
- **Transaction Management**: DB::transaction() used for atomic operations
- **Soft rollbacks**: DB::rollBack() on exception

---

## 11. Deployment Readiness

### ✅ Strengths
- Clean separation of concerns
- Proper model relationships
- Transaction support for data consistency
- Input validation
- Activity logging

### ⚠️ Issues
- Payment processing incomplete
- Limited test coverage
- Missing rate limiting configuration
- No CORS headers specified in code
- Some security checks too loose (approval can be done by any user)
- No caching strategy
- No API versioning

### ❌ Not Production-Ready For
- Real payment processing
- High-volume concurrent operations
- Data privacy compliance (GDPR, etc.)
- Advanced reporting and analytics

---

## 12. Discrepancy with Tech Stack

**Important Note**: The TECH_STACK.md document specifies:
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL 15+

**But actual implementation is**:
- Backend: Laravel 12.0 + Eloquent
- Database: SQLite (local) / PostgreSQL (specified)

This is a significant architectural mismatch. The tech stack document appears to be aspirational/planned, but the actual implementation diverged to PHP/Laravel.

