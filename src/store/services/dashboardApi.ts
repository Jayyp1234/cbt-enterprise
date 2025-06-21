import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for dashboard data
export interface DashboardStats {
  totalStudents: number;
  activeStaff: number;
  monthlyRevenue: number;
  walletBalance: number;
}

export interface RecentStudent {
  id: number;
  name: string;
  email: string;
  class: string;
  status: string;
  joinDate: string;
  lastActive: string;
}

export interface PaymentLink {
  id: number;
  title: string;
  amount: number;
  collected: number;
  totalAmount: number;
  status: string;
  created: string;
  expires: string;
}

export interface PerformanceData {
  subject: string;
  avgScore: number;
  students: number;
  improvement: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentStudents: RecentStudent[];
  paymentLinks: PaymentLink[];
  performanceData: PerformanceData[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.cbtgrinder.com/enterprise/',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as RootState).auth.token;
      
      // If token exists, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
    
    getRecentStudents: builder.query<RecentStudent[], number>({
      query: (limit) => `/dashboard/recent-students?limit=${limit}`,
      providesTags: ['Dashboard'],
    }),
    
    getActivePaymentLinks: builder.query<PaymentLink[], void>({
      query: () => '/dashboard/payment-links',
      providesTags: ['Dashboard'],
    }),
    
    getPerformanceData: builder.query<PerformanceData[], void>({
      query: () => '/dashboard/performance',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetRecentStudentsQuery,
  useGetActivePaymentLinksQuery,
  useGetPerformanceDataQuery,
} = dashboardApi;