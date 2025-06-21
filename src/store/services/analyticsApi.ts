import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for analytics data
export interface KeyMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
  bg: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  students: number;
  payments: number;
}

export interface StudentPerformance {
  subject: string;
  avgScore: number;
  students: number;
  improvement: string;
}

export interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
}

export interface EngagementData {
  day: string;
  logins: number;
  sessions: number;
  avgTime: number;
}

export interface AnalyticsData {
  keyMetrics: KeyMetric[];
  revenueData: RevenueData[];
  studentPerformance: StudentPerformance[];
  paymentMethodData: PaymentMethodData[];
  engagementData: EngagementData[];
}

export interface AnalyticsFilters {
  period?: string;
  startDate?: string;
  endDate?: string;
  metric?: string;
}

// Fallback data for when API fails
export const fallbackAnalyticsData: AnalyticsData = {
  keyMetrics: [
    {
      title: 'Total Revenue',
      value: '₦2.45M',
      change: '+18%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Active Students',
      value: '342',
      change: '+12%',
      trend: 'up',
      icon: 'Users',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Avg. Performance',
      value: '78%',
      change: '+5%',
      trend: 'up',
      icon: 'Target',
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Engagement Rate',
      value: '85%',
      change: '+3%',
      trend: 'up',
      icon: 'Activity',
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ],
  revenueData: [
    { month: 'Jan', revenue: 180000, students: 45, payments: 67 },
    { month: 'Feb', revenue: 220000, students: 52, payments: 78 },
    { month: 'Mar', revenue: 280000, students: 68, payments: 89 },
    { month: 'Apr', revenue: 320000, students: 78, payments: 95 },
    { month: 'May', revenue: 380000, students: 89, payments: 112 },
    { month: 'Jun', revenue: 420000, students: 95, payments: 125 }
  ],
  studentPerformance: [
    { subject: 'Mathematics', avgScore: 78, students: 156, improvement: '+5%' },
    { subject: 'English', avgScore: 82, students: 189, improvement: '+3%' },
    { subject: 'Physics', avgScore: 74, students: 134, improvement: '+8%' },
    { subject: 'Chemistry', avgScore: 71, students: 142, improvement: '+2%' },
    { subject: 'Biology', avgScore: 85, students: 98, improvement: '+6%' }
  ],
  paymentMethodData: [
    { name: 'Card Payment', value: 65, color: '#0047FF' },
    { name: 'Bank Transfer', value: 25, color: '#10B981' },
    { name: 'Mobile Money', value: 10, color: '#F59E0B' }
  ],
  engagementData: [
    { day: 'Mon', logins: 245, sessions: 320, avgTime: 45 },
    { day: 'Tue', logins: 268, sessions: 350, avgTime: 52 },
    { day: 'Wed', logins: 289, sessions: 380, avgTime: 48 },
    { day: 'Thu', logins: 312, sessions: 420, avgTime: 55 },
    { day: 'Fri', logins: 298, sessions: 390, avgTime: 50 },
    { day: 'Sat', logins: 189, sessions: 250, avgTime: 38 },
    { day: 'Sun', logins: 156, sessions: 200, avgTime: 35 }
  ]
};

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
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
  tagTypes: ['Analytics', 'RevenueData', 'PerformanceData', 'EngagementData'],
  endpoints: (builder) => ({
    getAnalyticsData: builder.query<AnalyticsData, AnalyticsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.period) params.append('period', filters.period);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.metric) params.append('metric', filters.metric);
        
        return `/analytics?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: AnalyticsData) => response,
      transformErrorResponse: (error) => {
        console.error("Analytics API error:", error);
        // Return fallback data on error
        return fallbackAnalyticsData;
      },
      providesTags: ['Analytics'],
    }),
    
    getRevenueData: builder.query<RevenueData[], { period?: string }>({
      query: ({ period = '30days' }) => `/analytics/revenue?period=${period}`,
      // Provide fallback data if the query fails
      transformResponse: (response: RevenueData[]) => response,
      transformErrorResponse: (error) => {
        console.error("Revenue Data API error:", error);
        // Return fallback data on error
        return fallbackAnalyticsData.revenueData;
      },
      providesTags: ['RevenueData'],
    }),
    
    getStudentPerformance: builder.query<StudentPerformance[], void>({
      query: () => '/analytics/performance',
      // Provide fallback data if the query fails
      transformResponse: (response: StudentPerformance[]) => response,
      transformErrorResponse: (error) => {
        console.error("Performance Data API error:", error);
        // Return fallback data on error
        return fallbackAnalyticsData.studentPerformance;
      },
      providesTags: ['PerformanceData'],
    }),
    
    getEngagementData: builder.query<EngagementData[], { period?: string }>({
      query: ({ period = '7days' }) => `/analytics/engagement?period=${period}`,
      // Provide fallback data if the query fails
      transformResponse: (response: EngagementData[]) => response,
      transformErrorResponse: (error) => {
        console.error("Engagement Data API error:", error);
        // Return fallback data on error
        return fallbackAnalyticsData.engagementData;
      },
      providesTags: ['EngagementData'],
    }),
    
    getPaymentMethodData: builder.query<PaymentMethodData[], void>({
      query: () => '/analytics/payment-methods',
      // Provide fallback data if the query fails
      transformResponse: (response: PaymentMethodData[]) => response,
      transformErrorResponse: (error) => {
        console.error("Payment Method Data API error:", error);
        // Return fallback data on error
        return fallbackAnalyticsData.paymentMethodData;
      },
      providesTags: ['Analytics'],
    }),
    
    exportAnalyticsReport: builder.mutation<{ url: string }, { format: string; data: string; period: string }>({
      query: (data) => ({
        url: '/analytics/export',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAnalyticsDataQuery,
  useGetRevenueDataQuery,
  useGetStudentPerformanceQuery,
  useGetEngagementDataQuery,
  useGetPaymentMethodDataQuery,
  useExportAnalyticsReportMutation,
} = analyticsApi;