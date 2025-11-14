// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  role: 'user' | 'admin';
  account_tier: 'basic' | 'silver' | 'gold';
  is_active: boolean;
  is_verified: boolean;
  agreed_to_terms: boolean;
  terms_agreed_at?: string;
  last_login_at?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Savings Plan types
export interface SavingsPlan {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_balance: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date?: string;
  description?: string;
  auto_debit: boolean;
  status: 'active' | 'paused' | 'completed';
  progress_percentage?: number;
  remaining_amount?: number;
  transactions_count?: number;
  contributions_count?: number;
  withdrawals_count?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Transaction types
export interface Transaction {
  id: number;
  user_id: number;
  savings_plan_id?: number;
  reference: string;
  type: 'deposit' | 'withdrawal' | 'fee' | 'refund';
  amount: number;
  fee: number;
  net_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: string;
  payment_reference?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  savings_plan?: SavingsPlan;
}

// Withdrawal types
export interface Withdrawal {
  id: number;
  user_id: number;
  savings_plan_id: number;
  transaction_id?: number;
  reference: string;
  amount: number;
  fee: number;
  net_amount: number;
  type: 'instant' | 'scheduled';
  bank_name: string;
  account_number: string;
  account_name: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  reason?: string;
  approved_by?: number;
  approved_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  savings_plan?: SavingsPlan;
  transaction?: Transaction;
  approver?: User;
  user?: User;
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

// Contribution types (Digital Passbook)
export interface Contribution {
  id: number;
  user_id: number;
  savings_plan_id: number;
  transaction_id?: number;
  serial_number: number;
  contribution_date: string;
  amount: number;
  status: 'pending' | 'paid' | 'missed' | 'skipped';
  payment_method: string;
  collector_signature?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data: T;
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
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  agreed_to_terms: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Statistics types
export interface SavingsStatistics {
  total_plans: number;
  active_plans: number;
  completed_plans: number;
  total_saved: number;
  total_target: number;
  total_transactions: number;
  total_contributions: number;
}

export interface TransactionStatistics {
  total_transactions: number;
  total_deposits: number;
  total_withdrawals: number;
  total_fees: number;
  this_month_deposits: number;
  this_month_withdrawals: number;
  pending_transactions: number;
}
