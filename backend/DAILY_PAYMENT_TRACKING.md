# Daily Payment Tracking System

## Overview

The Daily Payment Tracking System is a comprehensive solution for managing and tracking daily contributions in Ajo (rotating savings) groups. It provides real-time payment monitoring, automated record-keeping, and detailed analytics for collectors and group members.

## Features

### Core Functionality
- ✅ Track daily payments for each member in an Ajo group
- ✅ Mark payments as paid, pending, missed, or late
- ✅ Record payment methods (cash, bank transfer, card, wallet)
- ✅ Bulk marking of payments for multiple days
- ✅ Payment calendar view with monthly overview
- ✅ Real-time statistics and analytics
- ✅ Automatic calculation of totals and balances
- ✅ Collector notes and payment tracking history

---

## Database Schema

### `daily_payments` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `ajo_group_id` | bigint | Foreign key to `ajo_groups` |
| `user_id` | bigint | Foreign key to `users` |
| `payment_date` | date | Date of the payment |
| `amount` | decimal(15,2) | Payment amount |
| `status` | enum | Payment status: `pending`, `paid`, `missed`, `late` |
| `payment_method` | enum | Method used: `cash`, `bank_transfer`, `card`, `wallet` |
| `reference` | string | Transaction reference (for electronic payments) |
| `recorded_by` | bigint | Collector who recorded the payment |
| `notes` | text | Additional notes about the payment |
| `paid_at` | timestamp | When the payment was marked as paid |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

### Indexes
- `(ajo_group_id, payment_date)` - Fast lookup by group and date
- `(user_id, payment_date)` - Fast lookup by user and date
- **Unique**: `(ajo_group_id, user_id, payment_date)` - One payment per user per day per group

---

## API Endpoints

### Authentication
All endpoints require authentication via Laravel Sanctum.

### 1. Get Payment Records

**Endpoint:** `GET /api/ajo-groups/{groupId}/payments`

**Description:** Retrieve payment records for a group with optional filtering

**Query Parameters:**
- `start_date` (optional) - Filter by start date (Y-m-d)
- `end_date` (optional) - Filter by end date (Y-m-d)
- `user_id` (optional) - Filter by specific user (admin only for other users)

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "ajo_group_id": 5,
      "user_id": 12,
      "payment_date": "2025-11-15",
      "amount": "500.00",
      "status": "paid",
      "payment_method": "cash",
      "recorded_by": 10,
      "notes": null,
      "paid_at": "2025-11-15T10:30:00.000000Z",
      "user": {
        "id": 12,
        "name": "John Doe"
      },
      "recordedBy": {
        "id": 10,
        "name": "Jane Collector"
      }
    }
  ],
  "total": 50,
  "per_page": 50
}
```

---

### 2. Mark Single Payment

**Endpoint:** `POST /api/ajo-groups/{groupId}/payments/mark`

**Description:** Mark a payment as paid, pending, or missed (Admin only)

**Request Body:**
```json
{
  "user_id": 12,
  "payment_date": "2025-11-15",
  "status": "paid",
  "payment_method": "cash",
  "notes": "Paid in full"
}
```

**Response:**
```json
{
  "message": "Payment marked successfully",
  "payment": {
    "id": 1,
    "ajo_group_id": 5,
    "user_id": 12,
    "payment_date": "2025-11-15",
    "amount": "500.00",
    "status": "paid",
    "payment_method": "cash",
    "recorded_by": 10,
    "notes": "Paid in full",
    "paid_at": "2025-11-15T10:30:00.000000Z"
  }
}
```

---

### 3. Bulk Mark Payments

**Endpoint:** `POST /api/ajo-groups/{groupId}/payments/bulk-mark`

**Description:** Mark multiple payments for a date range (Admin only)

**Request Body:**
```json
{
  "user_id": 12,
  "start_date": "2025-11-01",
  "end_date": "2025-11-15",
  "status": "paid",
  "payment_method": "cash"
}
```

**Response:**
```json
{
  "message": "Successfully marked 15 payment(s)",
  "count": 15
}
```

---

### 4. Get Payment Summary

**Endpoint:** `GET /api/ajo-groups/{groupId}/payments/summary`

**Description:** Get statistics for today and this month

**Response:**
```json
{
  "today": {
    "total_records": 10,
    "paid_count": 7,
    "total_collected": "3500.00"
  },
  "this_month": {
    "total_records": 150,
    "paid_count": 120,
    "total_collected": "60000.00"
  },
  "member_stats": [
    {
      "user_id": 12,
      "total_days": 15,
      "paid_days": 12,
      "total_paid": "6000.00",
      "user": {
        "id": 12,
        "name": "John Doe"
      }
    }
  ]
}
```

---

### 5. Get Payment Calendar

**Endpoint:** `GET /api/ajo-groups/{groupId}/payments/calendar`

**Description:** Get a month-by-month calendar view of payments

**Query Parameters:**
- `month` (optional) - Month in Y-m format (default: current month)

**Response:**
```json
{
  "group": {
    "id": 5,
    "name": "Weekend Savers",
    "contribution_amount": "500.00"
  },
  "month": "2025-11",
  "members": [...],
  "calendar": [
    {
      "date": "2025-11-01",
      "day": 1,
      "day_name": "Friday",
      "total_expected": "5000.00",
      "total_paid": "4000.00",
      "paid_count": 8,
      "pending_count": 2,
      "payments": [...]
    }
  ]
}
```

---

## Web Routes (For Collectors)

### 1. Collector Dashboard
**Route:** `GET /collector/dashboard`

Shows overview of all groups managed by the collector with today's statistics.

### 2. Cashbook View
**Route:** `GET /collector/group/{groupId}/cashbook`

Displays 30-day payment grid for all members.

### 3. Mark Payment
**Route:** `POST /collector/group/{groupId}/mark-payment`

Mark a single payment via web interface.

**Form Data:**
- `member_id`
- `day` (1-31)
- `is_paid` (true/false)
- `payment_method` (optional)
- `notes` (optional)

### 4. Bulk Mark Payments
**Route:** `POST /collector/group/{groupId}/bulk-mark-payments`

Mark all payments up to a specific day.

**Form Data:**
- `member_id`
- `up_to_day` (1-31)
- `payment_method` (optional)

### 5. Send Reminders
**Route:** `POST /collector/group/{groupId}/send-reminders`

Send payment reminders to unpaid members.

---

## Model Usage

### DailyPayment Model

#### Relationships
```php
$payment->ajoGroup;     // The Ajo group
$payment->user;         // The member who should pay
$payment->recordedBy;   // The collector who recorded it
```

#### Query Scopes
```php
// Get all paid payments for a group
DailyPayment::forGroup($groupId)->paid()->get();

// Get pending payments for a user
DailyPayment::forUser($userId)->pending()->get();

// Get payments for a specific date
DailyPayment::forDate('2025-11-15')->get();

// Get payments for a date range
DailyPayment::forDateRange('2025-11-01', '2025-11-30')->get();
```

#### Helper Methods
```php
// Mark payment as paid
$payment->markAsPaid('cash', $collectorId, 'Payment received');

// Mark payment as missed
$payment->markAsMissed('Member was absent');
```

---

## Usage Examples

### Example 1: Mark Today's Payment
```php
use App\Models\DailyPayment;
use App\Models\AjoGroup;

$group = AjoGroup::find(5);
$userId = 12;
$today = now()->format('Y-m-d');

$payment = DailyPayment::updateOrCreate(
    [
        'ajo_group_id' => $group->id,
        'user_id' => $userId,
        'payment_date' => $today,
    ],
    [
        'amount' => $group->contribution_amount,
        'status' => 'paid',
        'payment_method' => 'cash',
        'recorded_by' => auth()->id(),
        'paid_at' => now(),
    ]
);
```

### Example 2: Get Monthly Report
```php
$groupId = 5;
$month = '2025-11';

$stats = DailyPayment::forGroup($groupId)
    ->whereYear('payment_date', 2025)
    ->whereMonth('payment_date', 11)
    ->selectRaw('
        COUNT(*) as total_records,
        SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as total_collected
    ')
    ->first();

echo "Collected: ₦{$stats->total_collected}";
echo "Paid: {$stats->paid_count}/{$stats->total_records}";
```

### Example 3: Find Unpaid Members Today
```php
$groupId = 5;
$today = now()->format('Y-m-d');

$group = AjoGroup::with('members')->find($groupId);
$unpaidMembers = [];

foreach ($group->members as $member) {
    $payment = DailyPayment::forGroup($groupId)
        ->forUser($member->id)
        ->forDate($today)
        ->first();

    if (!$payment || $payment->status !== 'paid') {
        $unpaidMembers[] = $member;
    }
}

// Send reminders to $unpaidMembers
```

---

## Integration with Frontend

### API Client Example (JavaScript/TypeScript)

```typescript
// Mark payment as paid
async function markPayment(groupId: number, userId: number, date: string) {
  const response = await fetch(`/api/ajo-groups/${groupId}/payments/mark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      user_id: userId,
      payment_date: date,
      status: 'paid',
      payment_method: 'cash'
    })
  });

  return response.json();
}

// Get payment calendar
async function getPaymentCalendar(groupId: number, month: string) {
  const response = await fetch(
    `/api/ajo-groups/${groupId}/payments/calendar?month=${month}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  return response.json();
}
```

---

## Security & Permissions

### Authorization Rules

1. **View Payments:**
   - Members can view their own payments
   - Admins can view all payments in their groups

2. **Mark Payments:**
   - Only group admins (collectors) can mark payments
   - Recorded by user is automatically set

3. **Bulk Operations:**
   - Only admins can perform bulk marking
   - All bulk operations are logged

---

## Best Practices

1. **Always use transactions** when updating payment records
2. **Validate dates** to prevent future-dated or invalid entries
3. **Log all payment changes** for audit trail
4. **Send confirmations** after successful payment recording
5. **Use bulk operations** for efficiency when marking multiple days
6. **Cache statistics** for frequently accessed summaries
7. **Index properly** to maintain query performance

---

## TODO / Future Enhancements

- [ ] Add SMS/Email reminder integration (Twilio, SendGrid)
- [ ] Implement payment verification via bank APIs
- [ ] Add payment receipt generation (PDF)
- [ ] Create payment analytics dashboard
- [ ] Add export functionality (Excel, CSV)
- [ ] Implement payment dispute resolution
- [ ] Add automated late fee calculation
- [ ] Create scheduled jobs for auto-reminders

---

## Troubleshooting

### Common Issues

**Issue:** Duplicate payment records
- **Solution:** The unique constraint prevents duplicates. Use `updateOrCreate` instead of `create`

**Issue:** Incorrect totals in statistics
- **Solution:** Ensure payment status is set correctly and dates are in Y-m-d format

**Issue:** Performance slow with large datasets
- **Solution:** Use pagination, add indexes, and cache frequently accessed data

---

## Support

For questions or issues with the payment tracking system:
1. Check this documentation first
2. Review the API endpoint examples
3. Check Laravel logs in `storage/logs/`
4. Verify database indexes are created
5. Contact the development team

---

**Last Updated:** 2025-11-15
**Version:** 1.0.0
