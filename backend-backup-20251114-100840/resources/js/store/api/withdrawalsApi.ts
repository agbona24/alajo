import { apiSlice } from './apiSlice';
import type { ApiResponse, Withdrawal } from '../../types';

export interface CreateWithdrawalRequest {
  savings_plan_id: number;
  amount: number;
  type: 'instant' | 'scheduled';
  bank_name: string;
  account_number: string;
  account_name: string;
  reason?: string;
}

export interface WithdrawalFilters {
  status?: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  savings_plan_id?: number;
  page?: number;
}

export interface ApproveWithdrawalRequest {
  admin_notes?: string;
}

export interface RejectWithdrawalRequest {
  admin_notes: string;
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

export const withdrawalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWithdrawals: builder.query<PaginatedResponse<Withdrawal>, WithdrawalFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, String(value));
            }
          });
        }
        return `/withdrawals?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Withdrawal' as const, id })),
              { type: 'Withdrawal', id: 'LIST' },
            ]
          : [{ type: 'Withdrawal', id: 'LIST' }],
    }),
    getWithdrawal: builder.query<ApiResponse<Withdrawal>, number>({
      query: (id) => `/withdrawals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Withdrawal', id }],
    }),
    createWithdrawal: builder.mutation<ApiResponse<Withdrawal>, CreateWithdrawalRequest>({
      query: (data) => ({
        url: '/withdrawals',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Withdrawal', id: 'LIST' }],
    }),
    cancelWithdrawal: builder.mutation<ApiResponse<Withdrawal>, number>({
      query: (id) => ({
        url: `/withdrawals/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Withdrawal', id },
        { type: 'Withdrawal', id: 'LIST' },
      ],
    }),
    approveWithdrawal: builder.mutation<
      ApiResponse<Withdrawal>,
      { id: number; data?: ApproveWithdrawalRequest }
    >({
      query: ({ id, data }) => ({
        url: `/withdrawals/${id}/approve`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Withdrawal', id },
        { type: 'Withdrawal', id: 'LIST' },
        { type: 'SavingsPlan', id: 'LIST' },
        { type: 'Transaction', id: 'LIST' },
      ],
    }),
    rejectWithdrawal: builder.mutation<
      ApiResponse<Withdrawal>,
      { id: number; data: RejectWithdrawalRequest }
    >({
      query: ({ id, data }) => ({
        url: `/withdrawals/${id}/reject`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Withdrawal', id },
        { type: 'Withdrawal', id: 'LIST' },
      ],
    }),
    getPendingWithdrawals: builder.query<PaginatedResponse<Withdrawal>, void>({
      query: () => '/withdrawals/pending',
      providesTags: [{ type: 'Withdrawal', id: 'PENDING' }],
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useGetWithdrawalQuery,
  useCreateWithdrawalMutation,
  useCancelWithdrawalMutation,
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
  useGetPendingWithdrawalsQuery,
} = withdrawalsApi;
