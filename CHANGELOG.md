# Changelog

All notable changes to the Alajo Savings Application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta] - 2025-11-13

### 🎉 Initial Release - Full-Stack Application

This is the initial feature-complete beta release of the Alajo Savings Application.

---

## Added - Backend API

### Database Schema
- **users** table with extended fields:
  - Authentication fields (email, password)
  - Profile fields (name, phone, address, date_of_birth)
  - Role system (user, admin)
  - Account tiers (basic, silver, gold)
  - Terms acceptance tracking
  - Active/verified status flags

- **savings_plans** table:
  - Name, target amount, current balance
  - Frequency (daily, weekly, monthly)
  - Start and end dates
  - Status tracking (active, paused, completed)
  - Auto-debit support
  - Soft deletes enabled

- **transactions** table:
  - Auto-generated references (TXN prefix)
  - Types: deposit, withdrawal, fee, refund
  - Payment method and reference tracking
  - Fee and net amount calculations
  - Status tracking
  - Metadata JSON field

- **withdrawals** table:
  - Auto-generated references (WD prefix)
  - Types: instant, scheduled
  - Bank account details (name, number, bank_name)
  - Approval workflow (pending, approved, rejected)
  - Fee calculations (1%)
  - Admin notes

- **contributions** table (Digital Passbook):
  - Serial numbers (1-31 for daily tracking)
  - Contribution dates
  - Status tracking (pending, paid, missed, skipped)
  - Payment method
  - Collector signatures support
  - Unique constraint on plan + serial + date

### Authentication (Laravel Sanctum)
- POST `/api/register` - User registration with validation
  - Minimum ₦300 contribution enforcement
  - Terms acceptance required
  - Phone and address support
- POST `/api/login` - Email/password authentication
  - Account status validation
  - Terms acceptance check
  - Last login tracking
- POST `/api/logout` - Token revocation
- GET `/api/user` - Current user profile

### Savings Plans API
- GET `/api/savings-plans` - List all user's plans
  - Includes transaction/contribution counts
- POST `/api/savings-plans` - Create new plan
  - Validation: minimum ₦300, valid frequency
- GET `/api/savings-plans/{id}` - Get single plan
  - Includes recent transactions and contributions
- PUT `/api/savings-plans/{id}` - Update plan
- DELETE `/api/savings-plans/{id}` - Soft delete
  - Prevents deletion with balance > 0
- GET `/api/savings-plans/statistics` - User statistics
  - Total plans, saved amounts, targets

### Transactions API
- GET `/api/transactions` - List transactions
  - Filters: type, plan, date range
  - Pagination support
- POST `/api/transactions` - Create deposit
  - Auto-creates contribution record
  - Updates savings plan balance
  - Checks target completion
- GET `/api/transactions/{id}` - Get single transaction
- GET `/api/transactions/statistics` - User stats
  - Deposits, withdrawals, fees
  - This month summaries

### Withdrawals API
- GET `/api/withdrawals` - List user's withdrawals
  - Filters: status, plan
  - Pagination support
- POST `/api/withdrawals` - Request withdrawal
  - Balance validation
  - Auto fee calculation (1%)
  - Bank account validation (10 digits)
- GET `/api/withdrawals/{id}` - Get withdrawal details
- POST `/api/withdrawals/{id}/cancel` - Cancel request (user)
- GET `/api/withdrawals/pending` - List pending (admin)
- POST `/api/withdrawals/{id}/approve` - Approve request (admin)
  - Creates withdrawal transaction
  - Deducts from savings balance
- POST `/api/withdrawals/{id}/reject` - Reject request (admin)
  - Requires admin notes

### Contributions API (Digital Passbook)
- GET `/api/contributions` - List contributions
  - Filters: plan, status, month/year
- GET `/api/contributions/passbook/{id}` - Monthly passbook view
  - Serial numbers 1-31
  - Monthly statistics
- GET `/api/contributions/statistics` - User statistics
  - **Streak tracking**: current and longest streaks
  - Paid, missed, pending counts
  - This month summary
- POST `/api/contributions/{id}/mark-missed` - Mark as missed (admin)

### Admin Dashboard API
- GET `/api/admin/dashboard/statistics` - System-wide statistics
  - **Users**: total, active, verified, by tier, new this month
  - **Savings**: total plans, value locked, by frequency
  - **Transactions**: volume, fees, deposits vs withdrawals
  - **Withdrawals**: pending, approved, rejected counts
  - **Contributions**: paid, missed, pending
  - **Growth rates**: month-over-month for all metrics
- GET `/api/admin/dashboard/recent-activity` - Recent activity feed
  - Recent users, transactions, pending withdrawals
- GET `/api/admin/dashboard/trends` - Transaction trends
  - Daily breakdown over customizable period

### Admin User Management API
- GET `/api/admin/users` - List all users
  - Filters: role, tier, status, search
  - Sort by any field
  - Includes counts
- GET `/api/admin/users/{id}` - User details
  - Recent plans and transactions
  - Statistics (saved, deposited, withdrawn)
- PUT `/api/admin/users/{id}` - Update user
  - Profile, role, tier, status
- POST `/api/admin/users/{id}/toggle-status` - Activate/suspend
- POST `/api/admin/users/{id}/verify` - Verify user
- POST `/api/admin/users/{id}/upgrade-tier` - Upgrade tier

### Eloquent Models
- **User** model with relationships
  - savingsPlans, transactions, withdrawals, contributions
  - approvedWithdrawals (for admin)
  - Helper methods: isAdmin(), isActive(), isVerified()
  - Laravel Sanctum support (HasApiTokens trait)

- **SavingsPlan** model
  - Soft deletes enabled
  - Relationships: user, transactions, contributions, withdrawals
  - Calculated attributes: progress_percentage, remaining_amount
  - Helper methods for status checks

- **Transaction** model
  - Auto-generates reference with TXN prefix
  - Relationships: user, savingsPlan
  - Casts for amounts and metadata

- **Withdrawal** model
  - Auto-generates reference with WD prefix
  - Relationships: user, savingsPlan, transaction, approver
  - Helper methods: isPending(), isApproved(), isCompleted()

- **Contribution** model
  - Relationships: user, savingsPlan, transaction
  - Helper methods: isPaid(), isMissed(), isPending()
  - Scopes: forMonth(), paid(), pending()

### Middleware
- **EnsureUserIsAdmin** - Admin authorization
  - Registered as 'admin' alias
  - Returns 403 for non-admin users

### Database Seeders
- **UserSeeder**:
  - Admin account: admin@alajo.com / password (gold tier)
  - Test user: user@alajo.com / password (basic tier)

- **SavingsPlanSeeder**:
  - Emergency Fund (₦50k target, ₦15k saved, daily)
  - New Phone (₦100k target, ₦45k saved, weekly)
  - Vacation Fund (₦200k target, completed)

---

## Added - Frontend

### State Management (Redux Toolkit + RTK Query)
- **apiSlice** - Base API configuration
  - Auto token management
  - Accept JSON headers
  - Tag-based cache invalidation

- **authApi** - Authentication hooks
  - useLoginMutation
  - useRegisterMutation
  - useLogoutMutation
  - useGetCurrentUserQuery

- **savingsPlansApi** - Savings plans hooks
  - useGetSavingsPlansQuery
  - useGetSavingsPlanQuery
  - useCreateSavingsPlanMutation
  - useUpdateSavingsPlanMutation
  - useDeleteSavingsPlanMutation
  - useGetSavingsStatisticsQuery

- **transactionsApi** - Transactions hooks
  - useGetTransactionsQuery
  - useGetTransactionQuery
  - useCreateTransactionMutation
  - useGetTransactionStatisticsQuery

- **withdrawalsApi** - Withdrawals hooks
  - useGetWithdrawalsQuery
  - useGetWithdrawalQuery
  - useCreateWithdrawalMutation
  - useCancelWithdrawalMutation
  - useApproveWithdrawalMutation (admin)
  - useRejectWithdrawalMutation (admin)
  - useGetPendingWithdrawalsQuery (admin)

- **contributionsApi** - Contributions hooks
  - useGetContributionsQuery
  - useGetPassbookQuery
  - useGetContributionStatisticsQuery
  - useMarkContributionAsMissedMutation (admin)

- **adminApi** - Admin dashboard hooks
  - useGetDashboardStatisticsQuery
  - useGetRecentActivityQuery
  - useGetTrendsQuery
  - useGetUsersQuery
  - useGetUserDetailQuery
  - useUpdateUserMutation
  - useToggleUserStatusMutation
  - useVerifyUserMutation
  - useUpgradeUserTierMutation

### TypeScript Types
- Complete interfaces for all models
- API response and error types
- Request payload types
- Statistics types
- Pagination types

---

## Added - Documentation

### Technical Documentation
- **SETUP_GUIDE.md** - Complete setup and deployment guide
  - Database setup (PostgreSQL, MySQL, SQLite)
  - Installation instructions
  - Development workflow
  - cPanel deployment guide
  - Troubleshooting tips

- **API_REFERENCE.md** - Complete API documentation
  - All 38 endpoints documented
  - Request/response examples
  - Validation rules
  - Query parameters
  - HTTP status codes
  - Quick reference table

- **API_TESTING.md** - Testing guide with cURL examples
  - Authentication flow
  - All endpoint examples
  - Contribution and passbook testing
  - Admin operations
  - Testing workflow
  - Test credentials

- **README.md** - Project overview
  - Features list
  - Technology stack
  - Installation guide
  - Project structure
  - Roadmap
  - Documentation links

---

## Features Summary

### Business Rules Implemented
- ✅ Minimum ₦300 contribution
- ✅ ₦200 card replacement fee (documented)
- ✅ Working days: Monday-Saturday (documented)
- ✅ Monthly transaction deadline (documented)
- ✅ Passbook verification after payment (via contributions)
- ✅ Digital passbook with serial numbers 1-31
- ✅ 1% withdrawal fee
- ✅ 10-digit account number validation

### Key Features
- ✅ User registration with terms acceptance
- ✅ Multiple savings plans per user
- ✅ Progress tracking with percentages
- ✅ Digital passbook (contribution records)
- ✅ Contribution streaks (gamification)
- ✅ Withdrawal approval workflow
- ✅ Admin dashboard with analytics
- ✅ User management system
- ✅ Account tier system (basic, silver, gold)
- ✅ Role-based access control
- ✅ Auto-generated transaction references
- ✅ Comprehensive statistics
- ✅ Growth rate tracking

---

## Technical Highlights

### Backend
- Laravel 12 with PHP 8.2+
- PostgreSQL/MySQL/SQLite support
- Laravel Sanctum for authentication
- RESTful API design
- Eloquent ORM with relationships
- Soft deletes support
- Auto-generated references
- Request validation
- Database seeders
- Middleware authorization

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- RTK Query for API calls
- Type-safe API hooks
- Automatic cache invalidation
- Optimistic updates
- Error handling
- Token management

### Developer Experience
- Comprehensive documentation
- cURL testing examples
- Test accounts with sample data
- Development helper script
- Clear troubleshooting guides
- API reference documentation

---

## Statistics

- **Total API Endpoints**: 38
- **Database Tables**: 5
- **Eloquent Models**: 5
- **API Services**: 6
- **RTK Query Hooks**: 30+
- **Middleware**: 1 custom (admin)
- **Database Seeders**: 2
- **Documentation Files**: 4
- **Lines of Backend Code**: ~3,500
- **Lines of Frontend Code**: ~1,500

---

## Test Credentials

### Admin Account
```
Email: admin@alajo.com
Password: password
Role: admin
Tier: gold
```

### Test User
```
Email: user@alajo.com
Password: password
Role: user
Tier: basic
Has: 3 sample savings plans
```

---

## Deployment

- ✅ Single Laravel application (no separate frontend)
- ✅ cPanel-friendly deployment
- ✅ Build frontend to `public/build/`
- ✅ Upload entire `backend/` folder
- ✅ Production-ready configuration

---

## Contact & Support

- **Y-DEE VENTURES**
- WhatsApp: 08035816788
- Phone: 09088435750
- Slogan: "Savings Saves Life"

---

## Upcoming Features (Planned)

### Version 1.1.0
- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] Email notifications (registration, deposits, withdrawals)
- [ ] SMS notifications for transactions
- [ ] Scheduled deposits (auto-debit)
- [ ] Bank account verification

### Version 1.2.0
- [ ] Group savings (Ajo/Esusu)
- [ ] Referral program
- [ ] Achievement badges
- [ ] Leaderboards
- [ ] Export transactions (PDF, Excel)

### Version 1.3.0
- [ ] Mobile app (PWA/APK)
- [ ] Push notifications
- [ ] Biometric authentication
- [ ] Offline mode support

### Version 2.0.0
- [ ] International expansion
- [ ] Multi-currency support
- [ ] Investment products
- [ ] Loan products

---

## License

Proprietary and Confidential

---

## Contributors

Built with ❤️ for financial inclusion in Africa

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0-beta
**Status**: Production Ready
