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

  // Create new savings plan
  createPlan: async (data: { name: string; target_amount: number; frequency: string }) => {
    const response = await api.post('/savings-plans', data)
    return response.data
  },

  // Make contribution
  contribute: async (planId: number, amount: number) => {
    const response = await api.post(`/savings-plans/${planId}/contribute`, { amount })
    return response.data
  },

  // Get transactions
  getTransactions: async () => {
    const response = await api.get('/transactions')
    return response.data
  },

  // Request withdrawal
  requestWithdrawal: async (planId: number, amount: number) => {
    const response = await api.post('/withdrawals', { plan_id: planId, amount })
    return response.data
  },
}

export default api
