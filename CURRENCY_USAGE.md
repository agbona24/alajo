# Currency Usage Guide

The currency settings from the admin panel are now used throughout the entire application (frontend and backend).

## Admin Configuration

Navigate to **Admin Panel → Settings → Currency** to configure:
- Currency Code (e.g., NGN, USD, GBP)
- Currency Symbol (e.g., ₦, $, £)
- Symbol Position (Before or After amount)
- Thousand Separator (e.g., ,)
- Decimal Separator (e.g., .)
- Decimal Places (0-4)

## Backend Usage (Laravel)

### Using Helper Functions

```php
// Format amount with currency symbol
{{ currency(1000) }}
// Output: ₦1,000.00 (based on admin settings)

// Format without symbol
{{ currency(1000, false) }}
// Output: 1,000.00

// Get currency symbol
{{ currency_symbol() }}
// Output: ₦

// Get currency code
{{ currency_code() }}
// Output: NGN

// Get all currency settings
$settings = currency_settings();
// Returns: ['symbol' => '₦', 'code' => 'NGN', 'position' => 'before', ...]
```

### Using CurrencyHelper Class

```php
use App\Helpers\CurrencyHelper;

// Format amount
$formatted = CurrencyHelper::format(5000);
// Output: ₦5,000.00

// Get currency info
$symbol = CurrencyHelper::symbol();
$code = CurrencyHelper::code();
$settings = CurrencyHelper::settings();
```

### Examples in Blade Views

```blade
<!-- Dashboard -->
<div>Total Balance: {{ currency($user->balance) }}</div>

<!-- Transactions -->
<span>Amount: {{ currency($transaction->amount) }}</span>

<!-- Reports -->
<h3>Revenue: {{ currency($totalRevenue) }}</h3>
```

## Frontend Usage (Next.js/React)

### Using the useCurrency Hook

```typescript
import { useCurrency } from '@/contexts/AppSettingsContext'

function MyComponent() {
  const { format, symbol, code } = useCurrency()

  return (
    <div>
      {/* Format amount with symbol */}
      <p>Balance: {format(5000)}</p>

      {/* Format without symbol */}
      <p>Amount: {format(5000, false)}</p>

      {/* Get currency symbol */}
      <span>{symbol()}</span>

      {/* Get currency code */}
      <span>{code()}</span>
    </div>
  )
}
```

### Direct Import

```typescript
import { formatCurrency, getCurrencySymbol, getCurrencyCode } from '@/lib/currency'

// Format amount
const formatted = formatCurrency(1000)
// Output: ₦1,000.00

// Format without symbol
const amount = formatCurrency(1000, false)
// Output: 1,000.00

// Get symbol
const symbol = getCurrencySymbol()

// Get code
const code = getCurrencyCode()
```

### Example Component

```typescript
'use client'

import { useCurrency } from '@/contexts/AppSettingsContext'

export default function BalanceCard({ balance }: { balance: number }) {
  const { format } = useCurrency()

  return (
    <div className="card">
      <h3>Available Balance</h3>
      <p className="text-2xl font-bold">{format(balance)}</p>
    </div>
  )
}
```

## How It Works

1. **Admin sets currency** in Settings → Currency
2. **Settings are stored** in the database (settings table)
3. **API endpoint** `/api/app-settings` returns currency settings
4. **Frontend** fetches settings on app load via AppSettingsProvider
5. **Currency utility** is initialized with the fetched settings
6. **All amounts** are formatted using the admin-configured settings

## Migration Guide

If you have hardcoded currency symbols (like ₦ or $), replace them with:

### Backend
```php
// Before
<span>₦{{ number_format($amount, 2) }}</span>

// After
<span>{{ currency($amount) }}</span>
```

### Frontend
```typescript
// Before
<span>₦{amount.toFixed(2)}</span>

// After
const { format } = useCurrency()
<span>{format(amount)}</span>
```

## Benefits

✅ Single source of truth for currency settings
✅ Easy to switch currencies (e.g., from NGN to USD)
✅ Consistent formatting across the entire app
✅ Support for international currencies
✅ Admin control without code changes
✅ Flexible decimal places and separators
