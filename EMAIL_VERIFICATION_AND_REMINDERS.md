# 📧 Email Verification & Contribution Reminders

## ✅ What Was Implemented (Backend)

### 1. Email Now Compulsory ✓
- Email is **required** during registration
- Validation updated to enforce email
- Database schema updated

### 2. Email Verification Flow ✓
**Registration Process:**
1. User registers with email
2. 6-digit verification code sent to email
3. User enters code in app
4. Email verified → Account activated

**Backend Endpoints Added:**
- `POST /api/verify-email` - Verify email with code
- `POST /api/resend-verification` - Resend verification code

**Features:**
- ✅ 6-digit verification codes
- ✅ 15-minute expiry
- ✅ Email masking for privacy
- ✅ Resend code functionality
- ✅ Token only issued after verification

### 3. Contribution Reminder Settings ✓
**Database Fields Added:**
- `contribution_reminder_enabled` (boolean) - Toggle on/off
- `contribution_reminder_days` (integer) - Number of days (default: 3)

**How It Works:**
- User sets number of days (e.g., 3 days)
- System checks for missed contributions
- Sends reminder when X days have passed
- User can toggle reminders on/off

---

## 📱 Frontend Implementation Needed

### 1. Update Registration Page

**File:** `frontend/app/register/page.tsx`

**Changes Needed:**
1. Make email field **required** (add validation)
2. After successful registration, redirect to email verification page
3. Show masked email address

**Example Response from Backend:**
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {...},
  "requires_verification": true,
  "email_masked": "jo***@example.com"
}
```

---

### 2. Create Email Verification Page

**Create:** `frontend/app/verify-email/page.tsx`

**Features:**
- Display "Check your email" message
- Show masked email
- 6-digit code input field
- "Resend Code" button
- 15-minute countdown timer
- Verify button

**API Endpoints:**
```typescript
// Verify email
POST /api/verify-email
Body: {
  phone: string,
  verification_code: string  // 6 digits
}

// Resend code
POST /api/resend-verification
Body: {
  phone: string
}
```

**UI Example:**
```
📧 Verify Your Email

We sent a 6-digit code to:
jo***@example.com

Enter Code:
[ ] [ ] [ ] [ ] [ ] [ ]

Didn't receive it? Resend Code

Code expires in: 14:32
```

---

### 3. Add Contribution Reminder Settings

**File:** `frontend/app/profile/settings/page.tsx` or similar

**Features:**
- Toggle switch for "Contribution Reminders"
- Number input for days (1-30 days)
- Save button

**API Endpoint (Update Profile):**
```typescript
PUT /api/profile
Body: {
  contribution_reminder_enabled: boolean,
  contribution_reminder_days: number
}
```

**UI Example:**
```
⏰ Contribution Reminders

Get notified when you haven't contributed for:

○ Off
● On  [  3  ] days

When enabled, you'll receive a reminder email if you miss
contributions for the selected number of days.

[Save Settings]
```

---

## 🔧 Frontend API Integration

### Update API Client

**File:** `frontend/lib/api.ts`

Add these methods to `authAPI`:

```typescript
export const authAPI = {
  // ... existing methods ...

  // Verify email
  verifyEmail: async (data: { phone: string; verification_code: string }) => {
    const response = await api.post('/verify-email', data)
    return response.data
  },

  // Resend verification code
  resendVerification: async (data: { phone: string }) => {
    const response = await api.post('/resend-verification', data)
    return response.data
  },
}

export const profileAPI = {
  // ... existing methods ...

  // Update reminder settings
  updateReminderSettings: async (data: {
    contribution_reminder_enabled: boolean;
    contribution_reminder_days: number;
  }) => {
    const response = await api.put('/profile', data)
    return response.data
  },
}
```

---

## 📋 Implementation Checklist

### Backend (✅ DONE)
- [x] Make email required in registration
- [x] Add email verification fields to database
- [x] Create verification code generation
- [x] Send verification email
- [x] Create verify-email endpoint
- [x] Create resend-verification endpoint
- [x] Add contribution reminder fields
- [x] Update API routes

### Frontend (✅ DONE)
- [x] Update registration page (make email required)
- [x] Create email verification page
- [x] Add verification code input UI (6-digit code input with auto-focus)
- [x] Add resend code functionality
- [x] Add countdown timer for code expiry (15 minutes)
- [x] Create contribution reminder settings UI
- [x] Add toggle for reminders
- [x] Add days selector (1-30)
- [x] Update API client with new methods
- [x] Handle verification in registration flow (redirects to /verify-email)

### Cron Job (TODO)
- [ ] Create command to check missed contributions
- [ ] Send reminder emails
- [ ] Schedule daily cron job

---

## 🎨 UI/UX Recommendations

### Email Verification Page Design
```
┌─────────────────────────────┐
│     📧                      │
│  Verify Your Email          │
│                             │
│  We sent a code to:         │
│  jo***@example.com          │
│                             │
│  ┌──┬──┬──┬──┬──┬──┐       │
│  │1 │2 │3 │4 │5 │6 │       │
│  └──┴──┴──┴──┴──┴──┘       │
│                             │
│  Code expires in: ⏱️ 14:32  │
│                             │
│  ┌───────────────────────┐ │
│  │   Verify Email  ✓     │ │
│  └───────────────────────┘ │
│                             │
│  Didn't receive it?         │
│  [Resend Code]              │
└─────────────────────────────┘
```

### Reminder Settings Design
```
┌─────────────────────────────┐
│  ⏰ Contribution Reminders   │
│                             │
│  [✓] Enable Reminders       │
│                             │
│  Send reminder after:       │
│  ┌─────┐                    │
│  │  3  │ days               │
│  └─────┘                    │
│  (1-30 days)                │
│                             │
│  ℹ️ Get notified via email  │
│  when you miss contributions│
│                             │
│  ┌───────────────────────┐ │
│  │   Save Settings       │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

---

## 🔄 Registration Flow

**Before (Old Flow):**
```
Register → Login → Dashboard
```

**After (New Flow):**
```
Register → Verify Email → Dashboard
         ↓ (email sent)
    Enter 6-digit code
```

---

## 📨 Email Templates

### Verification Email
```
Subject: Alajo - Verify Your Email

Welcome to Alajo!

Your email verification code is: 123456

This code will expire in 15 minutes.

If you didn't create this account, please ignore this email.

- Alajo Team
```

### Reminder Email
```
Subject: Alajo - Contribution Reminder

Hi [Name],

You haven't made a contribution in the last 3 days.

Don't let your savings streak break! Make a contribution today.

[Make Contribution]

Best regards,
Alajo Team
```

---

## 🧪 Testing

### Test Email Verification:
1. Register with valid email
2. Check email for code
3. Enter code in app
4. Verify success message
5. Test resend functionality
6. Test expired code (wait 15+ minutes)

### Test Reminders:
1. Enable reminders in settings
2. Set days to 1
3. Wait 24 hours without contributing
4. Check email for reminder

---

## 🚀 Next Steps

1. **Implement frontend pages:**
   - Create `verify-email/page.tsx`
   - Update `register/page.tsx`
   - Add reminder settings to profile

2. **Test the flow:**
   - Register new user
   - Verify email works
   - Test resend code

3. **Create cron job:**
   - Check missed contributions daily
   - Send reminder emails
   - Schedule at 9 AM daily

---

## 📞 Support

Need help implementing the frontend?
- Backend API is ready and tested
- All routes are configured
- Email sending is working

Just implement the UI and connect to the API endpoints! 🚀
