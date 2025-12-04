# 📧 Email Notification System

## Overview
Users can now receive email notifications for contributions and withdrawals, with granular control over which emails they want to receive.

---

## ✅ What Was Implemented

### 1. User Notification Preferences (Database)
Added fields to the `users` table:
- `email_notifications_contributions` (boolean, default: **true**)
- `email_notifications_withdrawals` (boolean, default: **true**)

### 2. Frontend UI (Profile Page)
**Location:** [Profile Page - Notifications Section](frontend/app/profile/page.tsx#L330-L486)

Users can toggle:
- **Contribution Emails** - Get email when making contributions
- **Withdrawal Emails** - Get email updates on withdrawal status

Changes save automatically to the backend.

### 3. Backend Email Sending

#### Contribution Emails
**Two emails are sent for each contribution:**

1. **Contribution Received** (When user makes a contribution)
   - Sent immediately after contribution is created
   - Status: Pending Approval
   - Includes: Amount, Plan name, Reference, Payment method
   - User preference checked: `email_notifications_contributions`

2. **Payment Confirmation** (When admin approves contribution)
   - Sent after admin approves the payment
   - Status: Approved
   - Uses existing `PaymentConfirmation` Mailable
   - User preference checked: `email_notifications_contributions`

#### Withdrawal Emails
**Two emails are sent for each withdrawal:**

1. **Withdrawal Request** (When user requests withdrawal)
   - Sent when withdrawal is created
   - Status: Pending
   - Uses existing `WithdrawalRequest` Mailable
   - User preference checked: `email_notifications_withdrawals`

2. **Withdrawal Completed** (When admin processes withdrawal)
   - Sent when withdrawal is completed
   - Status: Completed
   - Uses existing `WithdrawalCompleted` Mailable
   - User preference checked: `email_notifications_withdrawals`

---

## 🔧 Technical Implementation

### Database Migration
**File:** `backend/database/migrations/2025_11_26_185748_add_email_notification_preferences_to_users_table.php`

```php
$table->boolean('email_notifications_contributions')->default(true);
$table->boolean('email_notifications_withdrawals')->default(true);
```

### User Model Updates
**File:** `backend/app/Models/User.php`

Added to `$fillable`:
- `email_notifications_contributions`
- `email_notifications_withdrawals`

Added to `casts()`:
- `'email_notifications_contributions' => 'boolean'`
- `'email_notifications_withdrawals' => 'boolean'`

### Profile Controller
**File:** `backend/app/Http/Controllers/Api/ProfileController.php`

Updated validation to accept notification preferences:
```php
'email_notifications_contributions' => 'sometimes|boolean',
'email_notifications_withdrawals' => 'sometimes|boolean',
```

### Notification Service Updates
**File:** `backend/app/Services/NotificationService.php`

**New Method:**
```php
public function sendContributionReceived(Contribution $contribution): bool
```
- Checks user's `email_notifications_contributions` preference
- Sends email immediately when contribution is created
- Informs user their contribution is pending approval

**Updated Methods:**
All email methods now check user preferences:
- `sendPaymentConfirmation()` - Checks `email_notifications_contributions`
- `sendWithdrawalRequest()` - Checks `email_notifications_withdrawals`
- `sendWithdrawalCompleted()` - Checks `email_notifications_withdrawals`

### SavingsPlanController
**File:** `backend/app/Http/Controllers/Api/SavingsPlanController.php`

Added email sending in `contribute()` method:
```php
DB::commit();

// Send email notification
try {
    $contribution->load(['user', 'savingsPlan']);
    $notificationService = app(NotificationService::class);
    $notificationService->sendContributionReceived($contribution);
} catch (\Exception $emailError) {
    \Log::error('Failed to send contribution received email: ' . $emailError->getMessage());
}
```

### Frontend Profile Page
**File:** `frontend/app/profile/page.tsx`

**New State Variables:**
```typescript
const [emailNotificationsContributions, setEmailNotificationsContributions] = useState(true)
const [emailNotificationsWithdrawals, setEmailNotificationsWithdrawals] = useState(true)
const [notificationsSaving, setNotificationsSaving] = useState(false)
```

**New Handler Functions:**
- `handleContributionEmailToggle()` - Toggle contribution emails
- `handleWithdrawalEmailToggle()` - Toggle withdrawal emails

**UI Components:**
- Contribution Emails toggle with save indicator
- Withdrawal Emails toggle with save indicator
- Shows "Saving..." while updating preferences

---

## 📊 Email Flow Diagram

### Contribution Flow:
```
User Makes Contribution
         ↓
Email 1: "Contribution Received - Awaiting Approval"
         ↓ (User preference: email_notifications_contributions)
  [User receives email]
         ↓
Admin Approves Contribution
         ↓
Email 2: "Payment Confirmation"
         ↓ (User preference: email_notifications_contributions)
  [User receives email]
```

### Withdrawal Flow:
```
User Requests Withdrawal
         ↓
Email 1: "Withdrawal Request Received"
         ↓ (User preference: email_notifications_withdrawals)
  [User receives email]
         ↓
Admin Processes Withdrawal
         ↓
Email 2: "Withdrawal Completed"
         ↓ (User preference: email_notifications_withdrawals)
  [User receives email]
```

---

## 🎯 User Experience

### Default Behavior
- **All email notifications are ENABLED by default**
- Users can opt-out by toggling OFF in Profile settings

### Toggling Notifications

1. Go to **Profile** → **Notifications** section
2. Toggle switches:
   - **Contribution Emails** - ON/OFF
   - **Withdrawal Emails** - ON/OFF
3. Changes save automatically
4. "Saving..." indicator shows during save

### Sample Email: Contribution Received
```
Subject: Contribution Received - Awaiting Approval

Hello [User Name],

Your contribution has been received and is awaiting approval.

Contribution Details:
Plan: Daily Savings
Amount: ₦1,000
Payment Method: Bank Transfer
Reference: TRX-1234567890-5678
Status: Pending Approval

You will receive another email once your contribution is approved.

Thank you for saving with Alajo!
- Alajo Team
```

---

## 🔐 Privacy & Control

### User Control
Users have complete control over their email notifications:
- Can disable contribution emails only
- Can disable withdrawal emails only
- Can disable all emails
- Can re-enable anytime

### Email Checks
Before sending any email, the system checks:
1. ✅ Email notifications enabled globally (admin setting)
2. ✅ SMTP is configured
3. ✅ User has valid email address
4. ✅ User's specific preference (contributions/withdrawals)

If any check fails, email is not sent (no error to user).

---

## 📝 Database Schema

```sql
-- users table
email_notifications_contributions BOOLEAN NOT NULL DEFAULT 1
email_notifications_withdrawals BOOLEAN NOT NULL DEFAULT 1
```

---

## 🧪 Testing Checklist

### Contribution Emails
- [ ] Create contribution → Verify "Contribution Received" email
- [ ] Admin approves → Verify "Payment Confirmation" email
- [ ] Toggle OFF contribution emails
- [ ] Create contribution → Verify NO email sent
- [ ] Toggle ON contribution emails
- [ ] Create contribution → Verify email sent again

### Withdrawal Emails
- [ ] Request withdrawal → Verify "Withdrawal Request" email
- [ ] Admin completes → Verify "Withdrawal Completed" email
- [ ] Toggle OFF withdrawal emails
- [ ] Request withdrawal → Verify NO email sent
- [ ] Toggle ON withdrawal emails
- [ ] Request withdrawal → Verify email sent again

### UI Testing
- [ ] Profile page loads notification preferences correctly
- [ ] Toggles save to database
- [ ] "Saving..." indicator shows during save
- [ ] Settings persist after page refresh

---

## 🚀 Benefits

1. **User Control** - Users decide what emails they receive
2. **Transparency** - Users get immediate confirmation of contributions
3. **Trust** - Two-step notification (received + approved) builds confidence
4. **Reduced Noise** - Users can disable unwanted emails
5. **Better Communication** - Keeps users informed of account activity

---

## 📞 Support

If users report not receiving emails:
1. Check their profile settings (toggles might be OFF)
2. Verify email address is valid
3. Check SMTP configuration in admin panel
4. Review server logs for email errors

---

## 🔄 Future Enhancements

Potential additions:
- Email digest (daily/weekly summary instead of per-transaction)
- Email templates with branding
- SMS notifications option
- Push notifications for mobile app
- Milestone achievement emails
- Contribution reminder emails (already implemented separately)

---

## ✅ Summary

The email notification system is now **fully functional** with:
- ✅ Database fields for user preferences
- ✅ Frontend UI for toggling preferences
- ✅ Backend checks before sending emails
- ✅ Two emails per contribution (received + approved)
- ✅ Two emails per withdrawal (requested + completed)
- ✅ Complete user control over email preferences
- ✅ Auto-save functionality
- ✅ Error handling and logging

Users now have complete control over their email notifications!
