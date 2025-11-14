import { apiSlice } from './apiSlice';
import type {
  ApiResponse,
  Transaction,
  TransactionStatistics,
  Contribution,
  SavingsPlan,
} from '../../types';

export interface CreateTransactionRequest {
  savings_plan_id: number;
  amount: number;
  payment_method: string;
  payment_reference?: string;
  notes?: string;
}

export interface TransactionFilters {
  type?: 'deposit' | 'withdrawal' | 'fee' | 'refund';
  savings_plan_id?: number;
  from_date?: string;
  to_date?: string;
  page?: number;
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

export interface TransactionResponse {
  message: string;
  data: {
    transaction: Transaction;
    contribution: Contribution;
    savings_plan: SavingsPlan;
  };
}

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<PaginatedResponse<Transaction>, TransactionFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, String(value));
            }
          });
        }
        return `/transactions?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Transaction' as const, id })),
              { type: 'Transaction', id: 'LIST' },
            ]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),
    getTransaction: builder.query<ApiResponse<Transaction>, number>({
      query: (id) => `/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transaction', id }],
    }),
    createTransaction: builder.mutation<TransactionResponse, CreateTransactionRequest>({
      query: (data) => ({
        url: '/transactions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Transaction', id: 'LIST' },
        { type: 'SavingsPlan', id: 'LIST' },
      ],
    }),
    getTransactionStatistics: builder.query<ApiResponse<TransactionStatistics>, void>({
      query: () => '/transactions/statistics',
      providesTags: ['Transaction'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useGetTransactionStatisticsQuery,
} = transactionsApi;
