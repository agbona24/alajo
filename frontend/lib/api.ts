import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Laravel Sanctum
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
  // Register new user
  register: async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    const response = await api.post('/register', data)
    return response.data
  },

  // Login user
  login: async (data: { email: string; password: string }) => {
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

  // Make contribution
  contribute: async (planId: number, data: {
    amount: number
    payment_method: string
    reference?: string
  }) => {
    const response = await api.post(`/savings-plans/${planId}/contribute`, data)
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
    const response = await api.post('/withdrawals', data)
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
  // Get passbook for user
  get: async (month?: string, year?: string) => {
    const response = await api.get('/passbook', {
      params: { month, year }
    })
    return response.data
  },

  // Get passbook for specific plan
  getPlanPassbook: async (planId: number, month?: string, year?: string) => {
    const response = await api.get(`/passbook/plan/${planId}`, {
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

  // Update profile
  update: async (data: {
    name?: string
    email?: string
    phone?: string
    avatar?: string
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

export const dashboardAPI = {
  // Get dashboard summary
  getSummary: async () => {
    const response = await api.get('/dashboard/summary')
    return response.data
  },

  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
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
