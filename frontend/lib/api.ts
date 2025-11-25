import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Note: withCredentials is not needed for Bearer token auth
  // Only needed for cookie-based Sanctum SPA authentication
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  // Get list of collectors for registration
  getCollectors: async () => {
    const response = await api.get('/collectors')
    return response.data
  },

  // Register new user
  register: async (data: { name: string; phone: string; email?: string; password: string; password_confirmation: string; collector_id?: number }) => {
    const response = await api.post('/register', data)
    return response.data
  },

  // Login user
  login: async (data: { phone: string; password: string }) => {
    const response = await api.post('/login', data)
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/logout')
    return response.data
  },

  // Get authenticated user
  getUser: async () => {
    const response = await api.get('/user')
    return response.data
  },

  // Biometric login
  biometricLogin: async (data: { phone: string; biometric_token: string }) => {
    const response = await api.post('/biometric-login', data)
    return response.data
  },
}

export const savingsAPI = {
  // Get all savings plans
  getPlans: async () => {
    const response = await api.get('/savings-plans')
    return response.data
  },

  // Get single savings plan
  getPlan: async (planId: number) => {
    const response = await api.get(`/savings-plans/${planId}`)
    return response.data
  },

  // Create new savings plan
  createPlan: async (data: {
    name: string
    emoji: string
    daily_amount: number
    target_amount: number
    frequency: string
    duration: number
    plan_type: string
    description?: string
  }) => {
    const response = await api.post('/savings-plans', data)
    return response.data
  },

  // Update savings plan
  updatePlan: async (planId: number, data: any) => {
    const response = await api.put(`/savings-plans/${planId}`, data)
    return response.data
  },

  // Delete savings plan
  deletePlan: async (planId: number) => {
    const response = await api.delete(`/savings-plans/${planId}`)
    return response.data
  },

  // Make contribution (supports file upload)
  contribute: async (planId: number, data: {
    amount: number
    payment_method: string
    reference?: string
    receipt?: File | null
  }) => {
    // Use FormData if there's a receipt file
    if (data.receipt) {
      const formData = new FormData()
      formData.append('amount', data.amount.toString())
      formData.append('payment_method', data.payment_method)
      if (data.reference) {
        formData.append('reference', data.reference)
      }
      formData.append('receipt', data.receipt)

      const response = await api.post(`/savings-plans/${planId}/contribute`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    }

    // Regular JSON request if no receipt
    const response = await api.post(`/savings-plans/${planId}/contribute`, {
      amount: data.amount,
      payment_method: data.payment_method,
      reference: data.reference,
    })
    return response.data
  },

  // Get plan contributions
  getContributions: async (planId: number) => {
    const response = await api.get(`/savings-plans/${planId}/contributions`)
    return response.data
  },
}

export const transactionsAPI = {
  // Get all transactions
  getAll: async (params?: {
    type?: string
    status?: string
    search?: string
  }) => {
    const response = await api.get('/transactions', { params })
    return response.data
  },

  // Get single transaction
  getById: async (transactionId: number) => {
    const response = await api.get(`/transactions/${transactionId}`)
    return response.data
  },
}

export const withdrawalsAPI = {
  // Request withdrawal
  create: async (data: {
    plan_id: number
    amount: number
    bank_account_id: number
    reason?: string
    type: string
  }) => {
    // Backend expects savings_plan_id
    const payload = {
      savings_plan_id: data.plan_id,
      bank_account_id: data.bank_account_id,
      amount: data.amount,
      reason: data.reason,
    }
    const response = await api.post('/withdrawals', payload)
    return response.data
  },

  // Get all withdrawals
  getAll: async () => {
    const response = await api.get('/withdrawals')
    return response.data
  },

  // Get withdrawal by ID
  getById: async (withdrawalId: number) => {
    const response = await api.get(`/withdrawals/${withdrawalId}`)
    return response.data
  },

  // Cancel withdrawal
  cancel: async (withdrawalId: number) => {
    const response = await api.delete(`/withdrawals/${withdrawalId}`)
    return response.data
  },
}

export const passbookAPI = {
  // Get passbook for specific plan
  getPlanPassbook: async (planId: number, month?: number, year?: number) => {
    const response = await api.get(`/savings-plans/${planId}/passbook`, {
      params: { month, year }
    })
    return response.data
  },
}

export const ajoGroupsAPI = {
  // Get all user's Ajo groups
  getAll: async () => {
    const response = await api.get('/ajo-groups')
    return response.data
  },

  // Get single Ajo group
  getById: async (groupId: number) => {
    const response = await api.get(`/ajo-groups/${groupId}`)
    return response.data
  },

  // Create new Ajo group
  create: async (data: {
    name: string
    description?: string
    contribution_amount: number
    group_size: number
    rotation_type: string
    selection_method: string
    start_date: string
    auto_reminders: boolean
    require_approval: boolean
  }) => {
    const response = await api.post('/ajo-groups', data)
    return response.data
  },

  // Update Ajo group
  update: async (groupId: number, data: any) => {
    const response = await api.put(`/ajo-groups/${groupId}`, data)
    return response.data
  },

  // Delete Ajo group
  delete: async (groupId: number) => {
    const response = await api.delete(`/ajo-groups/${groupId}`)
    return response.data
  },

  // Search group by code
  searchByCode: async (code: string) => {
    const response = await api.get(`/ajo-groups/search/${code}`)
    return response.data
  },

  // Join group
  join: async (groupId: number) => {
    const response = await api.post(`/ajo-groups/${groupId}/join`)
    return response.data
  },

  // Leave group
  leave: async (groupId: number) => {
    const response = await api.post(`/ajo-groups/${groupId}/leave`)
    return response.data
  },

  // Get group members
  getMembers: async (groupId: number) => {
    const response = await api.get(`/ajo-groups/${groupId}/members`)
    return response.data
  },

  // Get payout schedule
  getSchedule: async (groupId: number) => {
    const response = await api.get(`/ajo-groups/${groupId}/schedule`)
    return response.data
  },

  // Make contribution to group
  contribute: async (groupId: number, data: {
    amount: number
    payment_method: string
  }) => {
    const response = await api.post(`/ajo-groups/${groupId}/contribute`, data)
    return response.data
  },

  // Approve member (collector only)
  approveMember: async (groupId: number, memberId: number) => {
    const response = await api.post(`/ajo-groups/${groupId}/members/${memberId}/approve`)
    return response.data
  },

  // Remove member (collector only)
  removeMember: async (groupId: number, memberId: number) => {
    const response = await api.delete(`/ajo-groups/${groupId}/members/${memberId}`)
    return response.data
  },
}


export const profileAPI = {
  // Get user profile
  get: async () => {
    const response = await api.get('/profile')
    return response.data
  },

  // Update profile (now accepts address fields too)
  update: async (data: {
    name?: string
    email?: string
    phone?: string
    avatar?: string
    address?: string
    city?: string
    state?: string
    postal_code?: string
  }) => {
    const response = await api.put('/profile', data)
    return response.data
  },

  // Get bank accounts
  getBankAccounts: async () => {
    const response = await api.get('/profile/bank-accounts')
    return response.data
  },

  // Add bank account
  addBankAccount: async (data: {
    bank: string
    account_number: string
    account_name: string
  }) => {
    const response = await api.post('/profile/bank-accounts', data)
    return response.data
  },

  // Delete bank account
  deleteBankAccount: async (accountId: number) => {
    const response = await api.delete(`/profile/bank-accounts/${accountId}`)
    return response.data
  },

  // Set bank account as primary
  setBankAccountPrimary: async (accountId: number) => {
    const response = await api.post(`/profile/bank-accounts/${accountId}/set-primary`)
    return response.data
  },

  // Update settings
  updateSettings: async (data: {
    notifications?: any
    security?: any
    preferences?: any
  }) => {
    const response = await api.put('/profile/settings', data)
    return response.data
  },

  // Change password
  changePassword: async (data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) => {
    const response = await api.post('/profile/change-password', data)
    return response.data
  },
}


export const twoFactorAPI = {
  // Get 2FA status
  getStatus: async () => {
    const response = await api.get('/2fa/status')
    return response.data
  },

  // Enable 2FA (step 1 - sends verification code)
  enable: async (password: string) => {
    const response = await api.post('/2fa/enable', { password })
    return response.data
  },

  // Verify code to complete 2FA enablement
  verifyEnable: async (code: string) => {
    const response = await api.post('/2fa/verify-enable', { code })
    return response.data
  },

  // Disable 2FA
  disable: async (password: string) => {
    const response = await api.post('/2fa/disable', { password })
    return response.data
  },

  // Resend verification code
  resendCode: async () => {
    const response = await api.post('/2fa/resend-code')
    return response.data
  },

  // Verify 2FA code during login
  verifyLogin: async (phone: string, code: string) => {
    const response = await api.post('/2fa/verify-login', { phone, code })
    return response.data
  },

  // Resend login code
  resendLoginCode: async (phone: string) => {
    const response = await api.post('/2fa/send-login-code', { phone })
    return response.data
  },
}

export const dashboardAPI = {
  // Get dashboard summary
  getSummary: async () => {
    const response = await api.get('/dashboard')
    return response.data
  },

  // Get recent activities
  getActivities: async (limit?: number) => {
    const response = await api.get('/dashboard/activities', {
      params: { limit }
    })
    return response.data
  },
}

export const appSettingsAPI = {
  // Get all app settings (logo, favicon, app name, etc.)
  getSettings: async () => {
    const response = await api.get('/app-settings')
    return response.data
  },

  // Get app logo
  getLogo: async () => {
    const response = await api.get('/app-settings/logo')
    return response.data
  },

  // Get app favicon
  getFavicon: async () => {
    const response = await api.get('/app-settings/favicon')
    return response.data
  },
}

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
