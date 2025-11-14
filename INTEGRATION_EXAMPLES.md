# Frontend-Backend Integration Examples

Step-by-step examples showing how to connect each page to your Laravel backend.

## Setup Checklist

Before integrating:

1. ✅ Backend running: `php artisan serve` (port 8000)
2. ✅ Frontend running: `npm run dev` (port 3000)
3. ✅ Environment set: Create `/frontend/.env.local` with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. ✅ CORS configured in Laravel
5. ✅ Database migrated and seeded

---

## Example 1: Create Savings Plan (Full Integration)

**File:** `/app/savings/create/page.tsx`

### Before (Mock Data)
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log('Creating plan:', formData)
  router.push('/savings')
}
```

### After (Real API)
```typescript
import { savingsAPI } from '@/lib/api'
import { useState } from 'react'

export default function CreateSavingsPlan() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    targetAmount: '',
    frequency: 'monthly',
    duration: '',
    planType: 'personal',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare data for API
      const apiData = {
        name: formData.name,
        emoji: formData.emoji,
        target_amount: parseInt(formData.targetAmount),
        frequency: formData.frequency,
        duration: parseInt(formData.duration),
        plan_type: formData.planType,
        description: formData.description,
      }

      // Call API
      const response = await savingsAPI.createPlan(apiData)

      // Success - redirect to the new plan
      router.push(`/savings/${response.id}`)
    } catch (err: any) {
      // Handle error
      const message = err.response?.data?.message || 'Failed to create savings plan'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // ... JSX
    <form onSubmit={handleSubmit}>
      {/* Show error if exists */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Form fields... */}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Plan'}
      </button>
    </form>
  )
}
```

---

## Example 2: Dashboard (Fetch Data on Load)

**File:** `/app/dashboard/page.tsx`

### Before (Mock Data)
```typescript
const [user, setUser] = useState<any>(null)

useEffect(() => {
  const mockUser = { id: 1, name: 'Chioma Adeyemi', ... }
  setUser(mockUser)
}, [router])
```

### After (Real API)
```typescript
import { dashboardAPI, authAPI } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('auth_token')

      if (!token) {
        router.push('/login')
        return
      }

      try {
        // Fetch user and dashboard data in parallel
        const [userData, dashboard] = await Promise.all([
          authAPI.getUser(),
          dashboardAPI.getSummary()
        ])

        setUser(userData)
        setDashboardData(dashboard)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
        // Token might be invalid
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon="💰"
          label="Total Savings"
          value={formatCurrency(dashboardData?.total_savings || 0)}
        />
        <StatCard
          icon="📊"
          label="Active Plans"
          value={dashboardData?.active_plans || 0}
        />
        <StatCard
          icon="💸"
          label="Withdrawn"
          value={formatCurrency(dashboardData?.total_withdrawn || 0)}
        />
      </div>

      {/* Savings Plans */}
      <div className="mt-6">
        {dashboardData?.savings_plans?.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}
```

---

## Example 3: Savings List (With Refresh)

**File:** `/app/savings/page.tsx`

### After (Real API)
```typescript
import { savingsAPI } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function SavingsPage() {
  const router = useRouter()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPlans = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    else setRefreshing(true)

    try {
      const data = await savingsAPI.getPlans()
      setPlans(data)
    } catch (error) {
      console.error('Failed to load plans:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleRefresh = () => {
    fetchPlans(false) // Refresh without showing loader
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div>
      {/* Pull to refresh or button */}
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>

      {/* Plans list */}
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}
```

---

## Example 4: Make Contribution (With Payment)

**File:** `/app/savings/[id]/contribute/page.tsx`

### After (Real API)
```typescript
import { savingsAPI } from '@/lib/api'
import { useState } from 'react'

export default function ContributePage() {
  const router = useRouter()
  const params = useParams()
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [transactionRef, setTransactionRef] = useState('')

  const handleConfirm = async () => {
    setLoading(true)

    try {
      // Make contribution
      const response = await savingsAPI.contribute(
        Number(params.id),
        {
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          reference: `TRX-${Date.now()}`,
        }
      )

      setTransactionRef(response.reference)
      setStep('success')

      // Show confetti animation
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Contribution failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    // ... JSX with steps
  )
}
```

---

## Example 5: Transaction History (With Filters)

**File:** `/app/transactions/page.tsx`

### After (Real API)
```typescript
import { transactionsAPI } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'contribution' | 'withdrawal'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchTransactions = async () => {
    setLoading(true)

    try {
      const params: any = {}

      if (filterType !== 'all') params.type = filterType
      if (filterStatus !== 'all') params.status = filterStatus
      if (searchQuery) params.search = searchQuery

      const data = await transactionsAPI.getAll(params)
      setTransactions(data.data || data) // Handle pagination
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchTransactions()
  }, [filterType, filterStatus, searchQuery])

  return (
    // ... JSX
  )
}
```

---

## Example 6: Ajo Group Details (Complex Data)

**File:** `/app/ajo/[id]/page.tsx`

### After (Real API)
```typescript
import { ajoGroupsAPI } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function AjoGroupDetailsPage() {
  const params = useParams()
  const [group, setGroup] = useState<any>(null)
  const [members, setMembers] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'members' | 'schedule'>('members')

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true)

      try {
        // Fetch all group data
        const [groupData, membersData, scheduleData] = await Promise.all([
          ajoGroupsAPI.getById(Number(params.id)),
          ajoGroupsAPI.getMembers(Number(params.id)),
          ajoGroupsAPI.getSchedule(Number(params.id)),
        ])

        setGroup(groupData)
        setMembers(membersData)
        setSchedule(scheduleData)
      } catch (error) {
        console.error('Failed to load group:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroupData()
  }, [params.id])

  const handleContribute = async () => {
    try {
      await ajoGroupsAPI.contribute(Number(params.id), {
        amount: group.contribution_amount,
        payment_method: 'card',
      })

      // Refresh data
      window.location.reload()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Contribution failed')
    }
  }

  if (loading) return <LoadingScreen />

  return (
    // ... JSX
  )
}
```

---

## Example 7: Profile Updates

**File:** `/app/profile/page.tsx`

### After (Real API)
```typescript
import { profileAPI } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [bankAccounts, setBankAccounts] = useState([])
  const [notifications, setNotifications] = useState({
    contributions: true,
    withdrawals: true,
    milestones: true,
    groupActivity: false,
    marketing: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, accounts] = await Promise.all([
          profileAPI.get(),
          profileAPI.getBankAccounts(),
        ])

        setProfile(profileData)
        setBankAccounts(accounts)
        setNotifications(profileData.settings?.notifications || notifications)
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleToggleNotification = async (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)

    try {
      await profileAPI.updateSettings({
        notifications: updated,
      })
    } catch (error) {
      // Revert on error
      setNotifications(notifications)
      alert('Failed to update settings')
    }
  }

  const handleUpdateProfile = async (data: any) => {
    setSaving(true)

    try {
      const updated = await profileAPI.update(data)
      setProfile(updated)
      alert('Profile updated successfully')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    // ... JSX
  )
}
```

---

## Common Patterns

### 1. Loading States
```typescript
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">💰</div>
        <div className="text-gray-600">Loading...</div>
      </div>
    </div>
  )
}
```

### 2. Error Handling
```typescript
try {
  const data = await savingsAPI.getPlans()
  setPlans(data)
} catch (error: any) {
  const message = error.response?.data?.message || 'Something went wrong'
  setError(message)
  // Or use toast notification
}
```

### 3. Optimistic Updates
```typescript
const handleToggle = async (id: number) => {
  // Update UI immediately
  setItems(items.map(item =>
    item.id === id ? { ...item, active: !item.active } : item
  ))

  try {
    await api.update(id, { active: !item.active })
  } catch (error) {
    // Revert on error
    setItems(originalItems)
    alert('Update failed')
  }
}
```

### 4. Debounced Search
```typescript
import { useEffect, useState } from 'react'

const [searchQuery, setSearchQuery] = useState('')
const [debouncedQuery, setDebouncedQuery] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery)
  }, 500)

  return () => clearTimeout(timer)
}, [searchQuery])

useEffect(() => {
  if (debouncedQuery) {
    fetchResults(debouncedQuery)
  }
}, [debouncedQuery])
```

---

## Next Steps

1. ✅ Copy patterns above for each page
2. ⏳ Replace all mock data with API calls
3. ⏳ Add loading states
4. ⏳ Add error handling
5. ⏳ Test each flow end-to-end
6. ⏳ Add toast notifications (optional)
7. ⏳ Add retry logic (optional)

---

## Testing Workflow

For each integrated page:

1. **Check API endpoint exists** in Laravel
2. **Test with Postman** first
3. **Integrate frontend** using patterns above
4. **Test in browser**:
   - Success case
   - Error case (wrong data)
   - Loading state
   - Network error (turn off backend)
5. **Fix bugs** and repeat

---

## Debugging Tips

**Backend not responding?**
```bash
# Check Laravel is running
php artisan serve

# Check logs
tail -f storage/logs/laravel.log
```

**CORS errors?**
- Check `config/cors.php`
- Verify `FRONTEND_URL` in `.env`
- Clear Laravel config: `php artisan config:clear`

**401 Errors?**
- Token expired - logout and login again
- Token not sent - check API interceptor
- Endpoint requires auth - add `auth:sanctum` middleware

**Can't see data?**
- Check network tab in browser DevTools
- Verify API response structure matches frontend expectations
- Console.log the response to debug

---

Need help integrating a specific page? Let me know!
