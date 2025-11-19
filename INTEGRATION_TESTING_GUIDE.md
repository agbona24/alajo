# 🧪 Integration Testing Guide

**Goal**: Verify that frontend and backend are properly connected and working together.

---

## 🚀 Pre-Test Setup

### 1. Start Backend Server

```bash
cd backend

# Make sure .env exists
cp .env.example .env

# Install dependencies (if not done)
composer install

# Generate app key (if not done)
php artisan key:generate

# Run migrations
php artisan migrate:fresh

# (Optional) Seed with test data
php artisan db:seed

# Start server
php artisan serve
```

**Backend should be running at:** `http://localhost:8000`

---

### 2. Start Frontend Server

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Environment is already configured (.env.local)

# Start dev server
npm run dev
```

**Frontend should be running at:** `http://localhost:3000`

---

## ✅ Test Checklist

### Test 1: Landing Page
- [ ] Visit http://localhost:3000
- [ ] See beautiful landing page
- [ ] Click "Get Started" button
- [ ] Should navigate to onboarding

**Expected**: Landing page loads without errors

---

### Test 2: Onboarding
- [ ] See 4-slide carousel
- [ ] Swipe through all slides
- [ ] Click "Get Started" on final slide
- [ ] Should navigate to register page

**Expected**: Smooth carousel experience

---

### Test 3: Registration (CRITICAL - Tests Backend Connection)

**Steps:**
1. Fill in registration form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`

2. Click "Create Account"

**Expected Results:**
- ✅ Loading spinner shows
- ✅ No CORS errors in console (F12 → Console)
- ✅ Success message or redirect to dashboard

**If you see CORS error:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/register'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Fix:**
1. Check backend `.env` has:
   ```
   SESSION_DOMAIN=localhost
   SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
   ```
2. Restart backend server
3. Clear browser cache
4. Try again

**If you see 500 error:**
- Check backend logs: `tail -f backend/storage/logs/laravel.log`
- Likely database issue

---

### Test 4: Login

**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"

**Expected:**
- ✅ Redirect to dashboard
- ✅ See welcome message with user name
- ✅ See stats (will be empty/zero initially)

---

### Test 5: Dashboard

**Checks:**
- [ ] User name displays correctly
- [ ] Stats cards show (even if zero)
- [ ] Quick actions visible
- [ ] Bottom navigation visible
- [ ] Can click profile icon

**Expected**: Dashboard renders without errors

---

### Test 6: Create Savings Plan

**Steps:**
1. From dashboard, click "Create Savings Plan"
2. **Step 1**:
   - Select "Personal Goal"
   - Enter name: `Emergency Fund`
   - Choose emoji: 💰
3. **Step 2**:
   - Target: `100000`
   - Frequency: `Monthly`
   - Duration: `12`
4. **Step 3**:
   - Description: `Saving for emergencies`
   - Click "Create Plan"

**Expected:**
- ✅ API call to `POST /api/savings-plans`
- ✅ Success message
- ✅ Redirect to `/savings`
- ✅ See new plan in list

**To verify backend:**
```bash
# In backend directory
php artisan tinker
>>> \App\Models\SavingsPlan::count()
# Should show: 1
>>> \App\Models\SavingsPlan::first()
# Should show your plan details
```

---

### Test 7: View Savings Plans

**Steps:**
1. Navigate to `/savings`
2. Should see your newly created plan

**Expected:**
- ✅ Plan card displays
- ✅ Shows name, emoji, target amount
- ✅ Shows progress (0%)
- ✅ Can click to view details

---

### Test 8: Savings Plan Details

**Steps:**
1. Click on your savings plan
2. View details page

**Expected:**
- ✅ Plan information displays
- ✅ Progress circle shows
- ✅ "Contribute" button visible
- ✅ "Withdraw" button visible
- ✅ Transactions section (empty initially)

---

### Test 9: Contribute to Savings (IMPORTANT)

**Steps:**
1. From plan details, click "Contribute"
2. Enter amount: `5000`
3. Select payment method: `Cash` (for testing)
4. Click "Contribute"

**Expected:**
- ✅ API call to `POST /api/savings-plans/{id}/contribute`
- ✅ Success message
- ✅ Redirect back to plan details
- ✅ Progress updates
- ✅ Transaction appears in list

**Verify in backend:**
```bash
php artisan tinker
>>> \App\Models\Contribution::count()
# Should show: 1
>>> \App\Models\Transaction::count()
# Should show: 1
```

**Note**: This uses mock payment for testing. Real Paystack integration needed for production.

---

### Test 10: View Transactions

**Steps:**
1. Click "Activity" tab in bottom nav
2. View transactions page

**Expected:**
- ✅ See your contribution transaction
- ✅ Shows amount, date, status
- ✅ Can filter by type
- ✅ Can search

---

### Test 11: Create Ajo Group

**Steps:**
1. From dashboard, navigate to Ajo section
2. Click "Create Group"
3. **Step 1**:
   - Name: `Family Savings`
   - Contribution: `10000`
   - Group Size: `5`
4. **Step 2**:
   - Rotation: `Monthly`
   - Selection: `Sequential`
   - Start Date: (today's date)
5. **Step 3**:
   - Review and click "Create Group"

**Expected:**
- ✅ API call to `POST /api/ajo-groups`
- ✅ Group created with unique code
- ✅ You are automatically member #1
- ✅ Can view group details

**Verify:**
```bash
php artisan tinker
>>> \App\Models\AjoGroup::count()
# Should show: 1
>>> \App\Models\AjoGroup::first()->code
# Shows group code (e.g., "AJO123")
```

---

### Test 12: Join Ajo Group (Need 2nd User)

**Setup:**
1. Register second user in incognito/private window
2. Get group code from first user

**Steps:**
1. As second user, click "Join Ajo"
2. Enter group code
3. Click "Search"
4. Click "Join Group"

**Expected:**
- ✅ Find group by code
- ✅ Join request sent (or auto-joined)
- ✅ See group in your list

---

### Test 13: Profile Management

**Steps:**
1. Click "Profile" in bottom nav
2. Try each section:
   - [ ] Click "Personal Information" → Edit profile
   - [ ] Update name, save
   - [ ] Click "Payment Methods" → View page
   - [ ] Click "Address" → View page
   - [ ] Click "Change Password" → Test validation
   - [ ] Click "Two-Factor Authentication" → View setup flow

**Expected:**
- ✅ All pages load without errors
- ✅ Forms have validation
- ✅ Can navigate back to profile

---

### Test 14: Passbook

**Steps:**
1. Navigate to `/passbook`
2. View passbook records

**Expected:**
- ✅ API call to `GET /api/passbook`
- ✅ Shows contribution history
- ✅ Can filter by plan

**Note**: Passbook records are created when contributions are made.

---

### Test 15: Withdrawal Request

**Steps:**
1. Go to a savings plan with balance
2. Click "Withdraw"
3. Enter amount: `2000`
4. Select bank account (or add one)
5. Click "Request Withdrawal"

**Expected:**
- ✅ API call to `POST /api/withdrawals`
- ✅ Withdrawal request created
- ✅ Status: "Pending"

**Verify:**
```bash
php artisan tinker
>>> \App\Models\Withdrawal::first()
# Should show pending withdrawal
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Network Error" or "CORS Error"

**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
```bash
cd backend

# Check .env file
cat .env | grep SANCTUM
# Should show: SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173

# Restart backend
php artisan serve
```

---

### Issue 2: "401 Unauthorized"

**Symptoms:**
```
Request failed with status code 401
```

**Causes:**
- Token expired or invalid
- Not logged in

**Fix:**
1. Clear browser localStorage:
   - F12 → Application → Local Storage → Clear
2. Log in again
3. Check if token is being sent:
   - F12 → Network → Click request → Headers
   - Should see: `Authorization: Bearer {token}`

---

### Issue 3: "500 Internal Server Error"

**Symptoms:**
```
Request failed with status code 500
```

**Debug:**
```bash
# Check backend logs
cd backend
tail -f storage/logs/laravel.log

# Or check terminal where php artisan serve is running
```

**Common causes:**
- Database not migrated
- Missing columns in database
- Validation error in controller

**Fix:**
```bash
# Reset database
php artisan migrate:fresh
php artisan db:seed
```

---

### Issue 4: Frontend won't connect to backend

**Checklist:**
- [ ] Backend running on port 8000? (check terminal)
- [ ] Frontend running on port 3000? (check terminal)
- [ ] .env.local exists in frontend? (`ls frontend/.env.local`)
- [ ] NEXT_PUBLIC_API_URL correct? (`cat frontend/.env.local`)
- [ ] Both servers started? (check both terminals)

---

### Issue 5: "Module not found" in frontend

**Fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 API Testing with curl

If you want to test backend directly (without frontend):

### Register User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get User (with token from login)
```bash
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Create Savings Plan
```bash
curl -X POST http://localhost:8000/api/savings-plans \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Fund",
    "emoji": "💰",
    "target_amount": 100000,
    "frequency": "monthly",
    "duration": 12,
    "plan_type": "personal",
    "description": "Saving for emergencies"
  }'
```

---

## ✅ Success Criteria

**Your integration is working if:**
1. ✅ You can register a user
2. ✅ You can login
3. ✅ Dashboard loads with user data
4. ✅ You can create a savings plan
5. ✅ You can contribute to a plan
6. ✅ You can view transactions
7. ✅ You can create an Ajo group
8. ✅ All profile pages load

**If all 8 items work, your app is 90% complete!**

---

## 📝 Testing Notes Template

Use this to track your testing:

```
Date: ___________
Tester: ___________

TEST RESULTS:
[ ] Landing Page - Works / Failed / Notes: ___________
[ ] Onboarding - Works / Failed / Notes: ___________
[ ] Registration - Works / Failed / Notes: ___________
[ ] Login - Works / Failed / Notes: ___________
[ ] Dashboard - Works / Failed / Notes: ___________
[ ] Create Savings - Works / Failed / Notes: ___________
[ ] Contribute - Works / Failed / Notes: ___________
[ ] Transactions - Works / Failed / Notes: ___________
[ ] Create Ajo - Works / Failed / Notes: ___________
[ ] Profile Pages - Works / Failed / Notes: ___________

BUGS FOUND:
1. ___________
2. ___________
3. ___________

NEXT STEPS:
- ___________
- ___________
```

---

## 🎯 After Testing

**If everything works:**
1. Document any bugs you found
2. Start working on payment integration (Paystack)
3. Add email/SMS notifications
4. Plan beta testing

**If things don't work:**
1. Check the "Common Issues" section above
2. Review backend logs
3. Check browser console for errors
4. Test API directly with curl
5. Ask for help if stuck

---

**Good luck with testing! 🚀**

Last Updated: 2025-11-18
