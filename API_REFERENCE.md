# Alajo API Complete Reference

Base URL: `http://localhost:8000/api`

## Authentication

All protected endpoints require the `Authorization: Bearer {token}` header.

---

## 📋 Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Savings Plans](#savings-plans-endpoints)
3. [Transactions](#transactions-endpoints)
4. [Withdrawals](#withdrawals-endpoints)
5. [Contributions (Digital Passbook)](#contributions-endpoints)
6. [Admin - Dashboard](#admin-dashboard-endpoints)
7. [Admin - User Management](#admin-user-management-endpoints)

---

## Authentication Endpoints

### Register
```
POST /api/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "08012345678",
  "address": "Lagos, Nigeria",
  "date_of_birth": "1990-01-01",
  "agreed_to_terms": true
}
```

**Response:** User object + auth token

---

### Login
```
POST /api/login
```

**Body:**
```json
{
  "email": "user@alajo.com",
  "password": "password"
}
```

**Response:** User object + auth token

---

### Logout
```
POST /api/logout
```

**Headers:** Requires authentication

---

### Get Current User
```
GET /api/user
```

**Headers:** Requires authentication

---

## Savings Plans Endpoints

### List All Savings Plans
```
GET /api/savings-plans
```

**Headers:** Requires authentication

**Response:** Array of savings plans with counts

---

### Get Savings Plan
```
GET /api/savings-plans/{id}
```

**Headers:** Requires authentication

**Response:** Single savings plan with recent transactions and contributions

---

### Create Savings Plan
```
POST /api/savings-plans
```

**Headers:** Requires authentication

**Body:**
```json
{
  "name": "Emergency Fund",
  "target_amount": 100000,
  "frequency": "daily",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "description": "For emergencies",
  "auto_debit": false
}
```

**Validation:**
- `name`: required, string
- `target_amount`: required, min 300
- `frequency`: required, one of: daily, weekly, monthly
- `start_date`: required, date, after or equal today
- `end_date`: optional, date, after start_date
- `auto_debit`: optional, boolean

---

### Update Savings Plan
```
PUT /api/savings-plans/{id}
```

**Headers:** Requires authentication

**Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "target_amount": 150000,
  "status": "paused"
}
```

---

### Delete Savings Plan
```
DELETE /api/savings-plans/{id}
```

**Headers:** Requires authentication

**Note:** Cannot delete plans with balance > 0

---

### Get Savings Statistics
```
GET /api/savings-plans/statistics
```

**Headers:** Requires authentication

**Response:**
```json
{
  "total_plans": 3,
  "active_plans": 2,
  "completed_plans": 1,
  "total_saved": 60000,
  "total_target": 250000,
  "total_transactions": 45,
  "total_contributions": 30
}
```

---

## Transactions Endpoints

### List Transactions
```
GET /api/transactions
```

**Headers:** Requires authentication

**Query Parameters:**
- `type`: deposit, withdrawal, fee, refund
- `savings_plan_id`: filter by plan
- `from_date`: start date (YYYY-MM-DD)
- `to_date`: end date (YYYY-MM-DD)
- `page`: pagination page number

**Response:** Paginated list of transactions

---

### Get Transaction
```
GET /api/transactions/{id}
```

**Headers:** Requires authentication

---

### Create Deposit
```
POST /api/transactions
```

**Headers:** Requires authentication

**Body:**
```json
{
  "savings_plan_id": 1,
  "amount": 500,
  "payment_method": "bank_transfer",
  "payment_reference": "REF123456",
  "notes": "Daily contribution"
}
```

**Validation:**
- `amount`: required, min 300
- `savings_plan_id`: required, must exist
- `payment_method`: required, string

**Response:** Transaction, Contribution, and updated Savings Plan

---

### Get Transaction Statistics
```
GET /api/transactions/statistics
```

**Headers:** Requires authentication

**Response:**
```json
{
  "total_transactions": 100,
  "total_deposits": 500000,
  "total_withdrawals": 100000,
  "total_fees": 1000,
  "this_month_deposits": 50000,
  "this_month_withdrawals": 10000,
  "pending_transactions": 0
}
```

---

## Withdrawals Endpoints

### List Withdrawals
```
GET /api/withdrawals
```

**Headers:** Requires authentication

**Query Parameters:**
- `status`: pending, approved, processing, completed, rejected, cancelled
- `savings_plan_id`: filter by plan
- `page`: pagination page number

---

### Get Withdrawal
```
GET /api/withdrawals/{id}
```

**Headers:** Requires authentication

---

### Create Withdrawal Request
```
POST /api/withdrawals
```

**Headers:** Requires authentication

**Body:**
```json
{
  "savings_plan_id": 1,
  "amount": 10000,
  "type": "instant",
  "bank_name": "GTBank",
  "account_number": "0123456789",
  "account_name": "John Doe",
  "reason": "Emergency"
}
```

**Validation:**
- `amount`: required, min 300, must not exceed plan balance
- `type`: required, one of: instant, scheduled
- `account_number`: required, must be 10 digits

**Note:** 1% fee is automatically calculated

---

### Cancel Withdrawal (User)
```
POST /api/withdrawals/{id}/cancel
```

**Headers:** Requires authentication

**Note:** Can only cancel pending withdrawals

---

### Get Pending Withdrawals (Admin Only)
```
GET /api/withdrawals/pending
```

**Headers:** Requires authentication + admin role

---

### Approve Withdrawal (Admin Only)
```
POST /api/withdrawals/{id}/approve
```

**Headers:** Requires authentication + admin role

**Body:** (optional)
```json
{
  "admin_notes": "Verified and approved"
}
```

**Effect:** Creates withdrawal transaction, deducts from savings plan

---

### Reject Withdrawal (Admin Only)
```
POST /api/withdrawals/{id}/reject
```

**Headers:** Requires authentication + admin role

**Body:**
```json
{
  "admin_notes": "Insufficient documentation"
}
```

---

## Contributions Endpoints

### List Contributions
```
GET /api/contributions
```

**Headers:** Requires authentication

**Query Parameters:**
- `savings_plan_id`: filter by plan
- `status`: pending, paid, missed, skipped
- `year`: filter by year (YYYY)
- `month`: filter by month (1-12)
- `page`: pagination page number

**Response:** Paginated list of contributions (max 31 per page)

---

### Get Passbook for Savings Plan
```
GET /api/contributions/passbook/{savingsPlanId}
```

**Headers:** Requires authentication

**Query Parameters:**
- `year`: optional, defaults to current year
- `month`: optional, defaults to current month

**Response:**
```json
{
  "savings_plan": { },
  "contributions": [
    {
      "id": 1,
      "serial_number": 1,
      "contribution_date": "2025-01-01",
      "amount": 500,
      "status": "paid"
    }
  ],
  "statistics": {
    "total_contributions": 15,
    "paid_contributions": 12,
    "missed_contributions": 2,
    "pending_contributions": 1,
    "total_amount": 6000,
    "average_amount": 500
  },
  "month": 1,
  "year": 2025
}
```

---

### Get Contribution Statistics
```
GET /api/contributions/statistics
```

**Headers:** Requires authentication

**Response:**
```json
{
  "total_contributions": 90,
  "paid_contributions": 75,
  "missed_contributions": 10,
  "pending_contributions": 5,
  "total_contributed": 37500,
  "this_month_contributions": 20,
  "this_month_amount": 10000,
  "current_streak": 15,
  "longest_streak": 30
}
```

---

### Mark Contribution as Missed (Admin Only)
```
POST /api/contributions/{id}/mark-missed
```

**Headers:** Requires authentication + admin role

**Body:** (optional)
```json
{
  "notes": "User confirmed missed payment"
}
```

---

## Admin Dashboard Endpoints

All admin endpoints require authentication + admin role.

### Get Dashboard Statistics
```
GET /api/admin/dashboard/statistics
```

**Response:** Comprehensive system statistics including:
- User statistics (total, active, verified, by tier)
- Savings statistics (total plans, value locked, targets)
- Transaction statistics (volume, fees, deposits vs withdrawals)
- Withdrawal requests (pending, approved, rejected)
- Contribution statistics (paid, missed, pending)
- Growth metrics (month-over-month rates)

---

### Get Recent Activity
```
GET /api/admin/dashboard/recent-activity
```

**Query Parameters:**
- `limit`: number of items to return (default: 20)

**Response:**
- Recent users
- Recent transactions
- Pending withdrawals

---

### Get Transaction Trends
```
GET /api/admin/dashboard/trends
```

**Query Parameters:**
- `days`: number of days to analyze (default: 30)

**Response:** Daily breakdown of:
- Transaction count
- Transaction volume
- Deposits vs withdrawals

---

## Admin User Management Endpoints

All endpoints require authentication + admin role.

### List All Users
```
GET /api/admin/users
```

**Query Parameters:**
- `role`: user, admin
- `account_tier`: basic, silver, gold
- `is_active`: true, false
- `search`: search by name, email, or phone
- `sort_by`: field to sort by (default: created_at)
- `sort_order`: asc, desc (default: desc)
- `page`: pagination page number

**Response:** Paginated list with counts

---

### Get User Details
```
GET /api/admin/users/{id}
```

**Response:** User with:
- Recent savings plans
- Recent transactions
- Statistics (total saved, deposited, withdrawn)

---

### Update User
```
PUT /api/admin/users/{id}
```

**Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "email": "new@email.com",
  "phone": "08012345678",
  "address": "New Address",
  "role": "admin",
  "account_tier": "gold",
  "is_active": true,
  "is_verified": true
}
```

---

### Toggle User Status (Activate/Suspend)
```
POST /api/admin/users/{id}/toggle-status
```

**Effect:** Switches user between active and suspended

---

### Verify User
```
POST /api/admin/users/{id}/verify
```

**Effect:** Sets is_verified = true

---

### Upgrade User Tier
```
POST /api/admin/users/{id}/upgrade-tier
```

**Body:**
```json
{
  "account_tier": "gold"
}
```

**Options:** basic, silver, gold

---

## Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "message": "Data retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [ ... ],
    "last_page": 5,
    "per_page": 20,
    "total": 95
  }
}
```

### Error Response
```json
{
  "message": "Operation failed",
  "error": "Error description"
}
```

### Validation Error (422)
```json
{
  "message": "Validation failed",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

---

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Business Rules

1. **Minimum Contribution:** ₦300
2. **Withdrawal Fee:** 1% of amount
3. **Account Number:** Must be exactly 10 digits
4. **Passbook Serial Numbers:** 1-31 for daily contributions
5. **Working Days:** Monday-Saturday
6. **Savings Plan Deletion:** Cannot delete plans with balance > 0

---

## Test Credentials

### Admin Account
- Email: `admin@alajo.com`
- Password: `password`
- Role: admin
- Tier: gold

### Test User
- Email: `user@alajo.com`
- Password: `password`
- Role: user
- Tier: basic
- Has 3 sample savings plans

---

## Complete Endpoint Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/register | No | - | Register new user |
| POST | /api/login | No | - | Login user |
| POST | /api/logout | Yes | - | Logout user |
| GET | /api/user | Yes | - | Get current user |
| GET | /api/savings-plans | Yes | - | List savings plans |
| POST | /api/savings-plans | Yes | - | Create savings plan |
| GET | /api/savings-plans/{id} | Yes | - | Get savings plan |
| PUT | /api/savings-plans/{id} | Yes | - | Update savings plan |
| DELETE | /api/savings-plans/{id} | Yes | - | Delete savings plan |
| GET | /api/savings-plans/statistics | Yes | - | Savings statistics |
| GET | /api/transactions | Yes | - | List transactions |
| POST | /api/transactions | Yes | - | Create deposit |
| GET | /api/transactions/{id} | Yes | - | Get transaction |
| GET | /api/transactions/statistics | Yes | - | Transaction statistics |
| GET | /api/withdrawals | Yes | - | List withdrawals |
| POST | /api/withdrawals | Yes | - | Request withdrawal |
| GET | /api/withdrawals/{id} | Yes | - | Get withdrawal |
| POST | /api/withdrawals/{id}/cancel | Yes | - | Cancel withdrawal |
| GET | /api/withdrawals/pending | Yes | Admin | Get pending withdrawals |
| POST | /api/withdrawals/{id}/approve | Yes | Admin | Approve withdrawal |
| POST | /api/withdrawals/{id}/reject | Yes | Admin | Reject withdrawal |
| GET | /api/contributions | Yes | - | List contributions |
| GET | /api/contributions/statistics | Yes | - | Contribution statistics |
| GET | /api/contributions/passbook/{id} | Yes | - | Get passbook |
| POST | /api/contributions/{id}/mark-missed | Yes | Admin | Mark as missed |
| GET | /api/admin/dashboard/statistics | Yes | Admin | Dashboard stats |
| GET | /api/admin/dashboard/recent-activity | Yes | Admin | Recent activity |
| GET | /api/admin/dashboard/trends | Yes | Admin | Transaction trends |
| GET | /api/admin/users | Yes | Admin | List all users |
| GET | /api/admin/users/{id} | Yes | Admin | Get user details |
| PUT | /api/admin/users/{id} | Yes | Admin | Update user |
| POST | /api/admin/users/{id}/toggle-status | Yes | Admin | Toggle user status |
| POST | /api/admin/users/{id}/verify | Yes | Admin | Verify user |
| POST | /api/admin/users/{id}/upgrade-tier | Yes | Admin | Upgrade tier |

**Total Endpoints:** 38

---

For cURL examples and detailed testing instructions, see [API_TESTING.md](./API_TESTING.md)
