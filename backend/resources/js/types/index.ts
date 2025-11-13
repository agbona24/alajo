// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'closed';
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Savings Plan types
export interface SavingsPlan {
  id: string;
  userId: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom' | 'goal_based' | 'group';
  amountPerCycle: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate?: string;
  targetAmount?: number;
  currentBalance: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  autoDebitEnabled: boolean;
  preferredDebitDay?: number;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  savingsPlanId?: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'refund' | 'fee';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'card' | 'bank_transfer' | 'wallet' | 'auto_debit';
  paymentGateway?: 'paystack' | 'flutterwave' | 'stripe';
  gatewayReference?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Withdrawal types
export interface Withdrawal {
  id: string;
  userId: string;
  savingsPlanId?: string;
  amount: number;
  fee: number;
  netAmount: number;
  withdrawalType: 'instant' | 'scheduled';
  destinationType: 'bank_account' | 'wallet';
  bankAccountId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reason?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'savings_reminder' | 'payment_success' | 'payment_failed' | 'withdrawal_complete' | 'goal_achieved' | 'system';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  sentAt?: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
