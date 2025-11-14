import { apiSlice } from './apiSlice';
import type { ApiResponse, Contribution, SavingsPlan } from '../../types';

export interface ContributionFilters {
  savings_plan_id?: number;
  status?: 'pending' | 'paid' | 'missed' | 'skipped';
  year?: number;
  month?: number;
  page?: number;
}

export interface PassbookResponse {
  message: string;
  data: {
    savings_plan: SavingsPlan;
    contributions: Contribution[];
    statistics: {
      total_contributions: number;
      paid_contributions: number;
      missed_contributions: number;
      pending_contributions: number;
      total_amount: number;
      average_amount: number;
    };
    month: number;
    year: number;
  };
}

export interface ContributionStatistics {
  total_contributions: number;
  paid_contributions: number;
  missed_contributions: number;
  pending_contributions: number;
  total_contributed: number;
  this_month_contributions: number;
  this_month_amount: number;
  current_streak: number;
  longest_streak: number;
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

export const contributionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContributions: builder.query<PaginatedResponse<Contribution>, ContributionFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, String(value));
            }
          });
        }
        return `/contributions?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Contribution' as const, id })),
              { type: 'Contribution', id: 'LIST' },
            ]
          : [{ type: 'Contribution', id: 'LIST' }],
    }),
    getPassbook: builder.query<PassbookResponse, { savingsPlanId: number; year?: number; month?: number }>({
      query: ({ savingsPlanId, year, month }) => {
        const params = new URLSearchParams();
        if (year) params.append('year', String(year));
        if (month) params.append('month', String(month));
        return `/contributions/passbook/${savingsPlanId}?${params.toString()}`;
      },
      providesTags: (result, error, { savingsPlanId }) => [
        { type: 'Contribution', id: `PASSBOOK_${savingsPlanId}` },
      ],
    }),
    getContributionStatistics: builder.query<ApiResponse<ContributionStatistics>, void>({
      query: () => '/contributions/statistics',
      providesTags: ['Contribution'],
    }),
    markContributionAsMissed: builder.mutation<
      ApiResponse<Contribution>,
      { id: number; notes?: string }
    >({
      query: ({ id, notes }) => ({
        url: `/contributions/${id}/mark-missed`,
        method: 'POST',
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Contribution', id },
        { type: 'Contribution', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetContributionsQuery,
  useGetPassbookQuery,
  useGetContributionStatisticsQuery,
  useMarkContributionAsMissedMutation,
} = contributionsApi;
