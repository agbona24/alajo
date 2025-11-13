import { apiSlice } from './apiSlice';
import type { ApiResponse, SavingsPlan, SavingsStatistics } from '../../types';

export interface CreateSavingsPlanRequest {
  name: string;
  target_amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date?: string;
  description?: string;
  auto_debit?: boolean;
}

export interface UpdateSavingsPlanRequest {
  name?: string;
  target_amount?: number;
  frequency?: 'daily' | 'weekly' | 'monthly';
  end_date?: string;
  description?: string;
  auto_debit?: boolean;
  status?: 'active' | 'paused' | 'completed';
}

export const savingsPlansApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavingsPlans: builder.query<ApiResponse<SavingsPlan[]>, void>({
      query: () => '/savings-plans',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'SavingsPlan' as const, id })),
              { type: 'SavingsPlan', id: 'LIST' },
            ]
          : [{ type: 'SavingsPlan', id: 'LIST' }],
    }),
    getSavingsPlan: builder.query<ApiResponse<SavingsPlan>, number>({
      query: (id) => `/savings-plans/${id}`,
      providesTags: (result, error, id) => [{ type: 'SavingsPlan', id }],
    }),
    createSavingsPlan: builder.mutation<ApiResponse<SavingsPlan>, CreateSavingsPlanRequest>({
      query: (data) => ({
        url: '/savings-plans',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'SavingsPlan', id: 'LIST' }],
    }),
    updateSavingsPlan: builder.mutation<
      ApiResponse<SavingsPlan>,
      { id: number; data: UpdateSavingsPlanRequest }
    >({
      query: ({ id, data }) => ({
        url: `/savings-plans/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SavingsPlan', id },
        { type: 'SavingsPlan', id: 'LIST' },
      ],
    }),
    deleteSavingsPlan: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/savings-plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'SavingsPlan', id },
        { type: 'SavingsPlan', id: 'LIST' },
      ],
    }),
    getSavingsStatistics: builder.query<ApiResponse<SavingsStatistics>, void>({
      query: () => '/savings-plans/statistics',
      providesTags: ['SavingsPlan'],
    }),
  }),
});

export const {
  useGetSavingsPlansQuery,
  useGetSavingsPlanQuery,
  useCreateSavingsPlanMutation,
  useUpdateSavingsPlanMutation,
  useDeleteSavingsPlanMutation,
  useGetSavingsStatisticsQuery,
} = savingsPlansApi;
