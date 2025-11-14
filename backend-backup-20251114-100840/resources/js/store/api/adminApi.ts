import { apiSlice } from './apiSlice';
import type { ApiResponse, User } from '../../types';

export interface UserFilters {
  role?: 'user' | 'admin';
  account_tier?: 'basic' | 'silver' | 'gold';
  is_active?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'admin';
  account_tier?: 'basic' | 'silver' | 'gold';
  is_active?: boolean;
  is_verified?: boolean;
}

export interface UserWithStats extends User {
  savings_plans_count?: number;
  transactions_count?: number;
  contributions_count?: number;
  withdrawals_count?: number;
}

export interface UserDetailResponse {
  message: string;
  data: {
    user: UserWithStats;
    statistics: {
      total_saved: number;
      total_target: number;
      total_deposited: number;
      total_withdrawn: number;
      pending_withdrawals: number;
    };
  };
}

export interface DashboardStatistics {
  users: {
    total: number;
    active: number;
    verified: number;
    admins: number;
    new_this_month: number;
    by_tier: {
      basic: number;
      silver: number;
      gold: number;
    };
  };
  savings: {
    total_plans: number;
    active_plans: number;
    completed_plans: number;
    paused_plans: number;
    total_value_locked: number;
    total_target: number;
    average_balance: number;
    by_frequency: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  transactions: {
    total: number;
    total_volume: number;
    total_fees: number;
    deposits: {
      count: number;
      volume: number;
    };
    withdrawals: {
      count: number;
      volume: number;
    };
    this_month: {
      count: number;
      volume: number;
    };
  };
  withdrawal_requests: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
    pending_amount: number;
  };
  contributions: {
    total: number;
    paid: number;
    missed: number;
    pending: number;
    total_contributed: number;
    this_month: number;
  };
  growth: {
    user_growth_rate: number;
    savings_growth_rate: number;
    transaction_growth_rate: number;
  };
}

export interface PaginatedResponse<T> {
  message: string;
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getDashboardStatistics: builder.query<ApiResponse<DashboardStatistics>, void>({
      query: () => '/admin/dashboard/statistics',
      providesTags: ['SavingsPlan', 'Transaction', 'Withdrawal', 'User'],
    }),
    getRecentActivity: builder.query<ApiResponse<any>, number | void>({
      query: (limit) => `/admin/dashboard/recent-activity${limit ? `?limit=${limit}` : ''}`,
      providesTags: ['Transaction', 'Withdrawal', 'User'],
    }),
    getTrends: builder.query<ApiResponse<any>, number | void>({
      query: (days) => `/admin/dashboard/trends${days ? `?days=${days}` : ''}`,
      providesTags: ['Transaction'],
    }),

    // User Management
    getUsers: builder.query<PaginatedResponse<UserWithStats>, UserFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, String(value));
            }
          });
        }
        return `/admin/users?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserDetail: builder.query<UserDetailResponse, number>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: number; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    toggleUserStatus: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/admin/users/${id}/toggle-status`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    verifyUser: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/admin/users/${id}/verify`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    upgradeUserTier: builder.mutation<
      ApiResponse<User>,
      { id: number; account_tier: 'basic' | 'silver' | 'gold' }
    >({
      query: ({ id, account_tier }) => ({
        url: `/admin/users/${id}/upgrade-tier`,
        method: 'POST',
        body: { account_tier },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetDashboardStatisticsQuery,
  useGetRecentActivityQuery,
  useGetTrendsQuery,
  useGetUsersQuery,
  useGetUserDetailQuery,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useVerifyUserMutation,
  useUpgradeUserTierMutation,
} = adminApi;
