# Alajo API Testing Guide

Quick reference for testing the API endpoints with cURL or Postman.

## Base URL
```
http://localhost:8000/api
```

## 1. Authentication Flow

### Register New User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "08012345678",
    "address": "Lagos, Nigeria",
    "agreed_to_terms": true
  }'
```

Response:
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "account_tier": "basic"
  },
  "token": "1|abc123..."
}
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "user@alajo.com",
    "password": "password"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Logout
```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## 2. Savings Plans

### List All Savings Plans
```bash
curl -X GET http://localhost:8000/api/savings-plans \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Create Savings Plan
```bash
curl -X POST http://localhost:8000/api/savings-plans \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "New Phone Fund",
    "target_amount": 150000,
    "frequency": "daily",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "description": "Saving for iPhone 16",
    "auto_debit": false
  }'
```

### Get Single Savings Plan
```bash
curl -X GET http://localhost:8000/api/savings-plans/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Update Savings Plan
```bash
curl -X PUT http://localhost:8000/api/savings-plans/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Updated Name",
    "status": "paused"
  }'
```

### Delete Savings Plan
```bash
curl -X DELETE http://localhost:8000/api/savings-plans/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Get Savings Statistics
```bash
curl -X GET http://localhost:8000/api/savings-plans/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## 3. Transactions (Deposits)

### List Transactions
```bash
# All transactions
curl -X GET http://localhost:8000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"

# With filters
curl -X GET "http://localhost:8000/api/transactions?type=deposit&savings_plan_id=1&from_date=2025-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Create Deposit (Contribution)
```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "savings_plan_id": 1,
    "amount": 500,
    "payment_method": "bank_transfer",
    "payment_reference": "REF123456",
    "notes": "Daily contribution"
  }'
```

Response includes:
- Transaction record
- Contribution (passbook entry)
- Updated savings plan balance

### Get Single Transaction
```bash
curl -X GET http://localhost:8000/api/transactions/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Get Transaction Statistics
```bash
curl -X GET http://localhost:8000/api/transactions/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## 4. Withdrawals

### List Withdrawals
```bash
# All withdrawals
curl -X GET http://localhost:8000/api/withdrawals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"

# Filter by status
curl -X GET "http://localhost:8000/api/withdrawals?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Create Withdrawal Request
```bash
curl -X POST http://localhost:8000/api/withdrawals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "savings_plan_id": 1,
    "amount": 5000,
    "type": "instant",
    "bank_name": "GTBank",
    "account_number": "0123456789",
    "account_name": "John Doe",
    "reason": "Emergency expense"
  }'
```

### Get Single Withdrawal
```bash
curl -X GET http://localhost:8000/api/withdrawals/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Cancel Withdrawal (User)
```bash
curl -X POST http://localhost:8000/api/withdrawals/1/cancel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## 5. Admin Operations

### Get Pending Withdrawals (Admin Only)
```bash
curl -X GET http://localhost:8000/api/withdrawals/pending \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Approve Withdrawal (Admin Only)
```bash
curl -X POST http://localhost:8000/api/withdrawals/1/approve \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "admin_notes": "Verified and approved"
  }'
```

### Reject Withdrawal (Admin Only)
```bash
curl -X POST http://localhost:8000/api/withdrawals/1/reject \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "admin_notes": "Insufficient documentation provided"
  }'
```

## Test Accounts (After Seeding)

### Admin Account
- **Email:** admin@alajo.com
- **Password:** password
- **Role:** admin
- **Tier:** gold

### Test User Account
- **Email:** user@alajo.com
- **Password:** password
- **Role:** user
- **Tier:** basic
- **Has:** 3 sample savings plans

## Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Operation failed",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### Validation Error (422)
```json
{
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be at least 300."],
    "email": ["The email has already been taken."]
  }
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthenticated."
}
```

### Forbidden (403)
```json
{
  "message": "Unauthorized access to this resource"
}
```

## Postman Collection

You can import this cURL collection into Postman:

1. Open Postman
2. Click "Import"
3. Select "Raw text"
4. Paste any of the cURL commands above
5. Postman will create the request automatically

Or create an environment variable:
- Variable: `base_url` = `http://localhost:8000/api`
- Variable: `token` = Your auth token

Then use: `{{base_url}}/savings-plans`

## Testing Flow

1. **Register** a new user → Get token
2. **Login** with test account → Get token
3. **Create** a savings plan
4. **Make** a deposit (transaction)
5. **View** your updated balance
6. **Request** a withdrawal
7. **Login** as admin
8. **Approve** the withdrawal

## Common Business Rules

- Minimum deposit: **₦300**
- Withdrawal fee: **1%** of amount
- Account number: Must be **10 digits**
- Working days: **Monday-Saturday**
- Passbook serial: **1-31** (daily contributions)

## Debugging Tips

### Check if API is running
```bash
curl http://localhost:8000/api/user
# Should return 401 Unauthorized (not 404)
```

### Check database connection
```bash
php artisan db:show
```

### Clear caches
```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### View all routes
```bash
php artisan route:list
```
