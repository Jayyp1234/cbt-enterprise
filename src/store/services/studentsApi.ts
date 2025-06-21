import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for student data
export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  class: string;
  subjects: string[];
  status: string;
  joinDate: string;
  lastActive: string;
  performance: number;
  paymentStatus: string;
}

export interface StudentDetail extends Student {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  studentId: string;
}

export interface SubjectPerformance {
  subject: string;
  score: number;
  trend: string;
  lastTest: string;
}

export interface StudentActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface Payment {
  id: number;
  title: string;
  amount: number;
  date: string;
  status: string;
}

export interface StudentFilters {
  class?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StudentListResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  phone: string;
  class: string;
  subjects: string[];
  parentEmail: string;
  parentPhone: string;
  address: string;
}

export interface UpdateStudentRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  class?: string;
  subjects?: string[];
  status?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  studentId?: string;
}

// Fallback data for when API fails
export const fallbackStudents: Student[] = [
  {
    id: 1,
    name: 'Adebayo Johnson',
    email: 'adebayo@email.com',
    phone: '+234 801 234 5678',
    class: 'SS3',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    status: 'Active',
    joinDate: '2023-09-15',
    lastActive: '2 hours ago',
    performance: 85,
    paymentStatus: 'Paid'
  },
  {
    id: 2,
    name: 'Fatima Ibrahim',
    email: 'fatima@email.com',
    phone: '+234 802 345 6789',
    class: 'SS2',
    subjects: ['Mathematics', 'Biology', 'Chemistry', 'English'],
    status: 'Active',
    joinDate: '2023-10-05',
    lastActive: '1 day ago',
    performance: 78,
    paymentStatus: 'Pending'
  },
  {
    id: 3,
    name: 'Chidi Okafor',
    email: 'chidi@email.com',
    phone: '+234 803 456 7890',
    class: 'SS3',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    status: 'Inactive',
    joinDate: '2023-08-20',
    lastActive: '1 week ago',
    performance: 62,
    paymentStatus: 'Overdue'
  },
  {
    id: 4,
    name: 'Aisha Mohammed',
    email: 'aisha@email.com',
    phone: '+234 804 567 8901',
    class: 'SS1',
    subjects: ['Mathematics', 'Biology', 'Chemistry', 'English'],
    status: 'Active',
    joinDate: '2023-11-10',
    lastActive: '3 hours ago',
    performance: 92,
    paymentStatus: 'Paid'
  },
  {
    id: 5,
    name: 'Emeka Nwankwo',
    email: 'emeka@email.com',
    phone: '+234 805 678 9012',
    class: 'SS2',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    status: 'Active',
    joinDate: '2023-09-25',
    lastActive: '5 hours ago',
    performance: 75,
    paymentStatus: 'Pending'
  }
];

export const fallbackStudentDetail: StudentDetail = {
  id: 1,
  name: 'Adebayo Johnson',
  email: 'adebayo@email.com',
  phone: '+234 801 234 5678',
  class: 'SS3',
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
  status: 'Active',
  joinDate: '2023-09-15',
  lastActive: '2 hours ago',
  performance: 85,
  paymentStatus: 'Paid',
  parentName: 'Mr. Johnson Adebayo',
  parentEmail: 'johnson.adebayo@email.com',
  parentPhone: '+234 803 123 4567',
  address: '123 Lagos Street, Victoria Island, Lagos',
  dateOfBirth: '2006-03-15',
  gender: 'Male',
  studentId: 'BS2024001'
};

export const fallbackPerformanceData: SubjectPerformance[] = [
  {
    subject: 'Mathematics',
    score: 85,
    trend: '+5%',
    lastTest: '2024-01-10'
  },
  {
    subject: 'Physics',
    score: 78,
    trend: '+3%',
    lastTest: '2024-01-08'
  },
  {
    subject: 'Chemistry',
    score: 92,
    trend: '+8%',
    lastTest: '2024-01-12'
  },
  {
    subject: 'English',
    score: 75,
    trend: '-2%',
    lastTest: '2024-01-05'
  }
];

export const fallbackActivities: StudentActivity[] = [
  {
    id: 1,
    type: 'exam',
    title: 'Completed Mathematics Test',
    description: 'Scored 85% on Advanced Algebra',
    timestamp: '2024-01-15 14:30',
    icon: '📝'
  },
  {
    id: 2,
    type: 'login',
    title: 'Logged into Platform',
    description: 'Session started on mobile device',
    timestamp: '2024-01-15 10:15',
    icon: '🔑'
  },
  {
    id: 3,
    type: 'material',
    title: 'Downloaded Study Material',
    description: 'Physics Mechanics PDF',
    timestamp: '2024-01-14 16:45',
    icon: '📚'
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment Received',
    description: '₦25,000 for JAMB Preparation Course',
    timestamp: '2024-01-12 09:30',
    icon: '💰'
  }
];

export const fallbackPayments: Payment[] = [
  {
    id: 1,
    title: 'JAMB Preparation Course',
    amount: 25000,
    date: '2024-01-12',
    status: 'Paid'
  },
  {
    id: 2,
    title: 'Physics Masterclass',
    amount: 15000,
    date: '2023-12-05',
    status: 'Paid'
  },
  {
    id: 3,
    title: 'Mathematics Intensive',
    amount: 20000,
    date: '2023-11-15',
    status: 'Paid'
  }
];

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
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
  tagTypes: ['Students', 'StudentDetail', 'StudentPerformance', 'StudentActivity', 'StudentPayment'],
  endpoints: (builder) => ({
    getStudentList: builder.query<StudentListResponse, StudentFilters>({
      query: (filters) => {
        // Convert filters to query string
        const params = new URLSearchParams();
        if (filters.class && filters.class !== 'All') params.append('class', filters.class);
        if (filters.status && filters.status !== 'All') params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/students?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: StudentListResponse) => response,
      transformErrorResponse: (error) => {
        console.error("Students API error:", error);
        // Return fallback data on error
        return { 
          students: fallbackStudents,
          total: fallbackStudents.length,
          page: 1,
          totalPages: 1
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.students.map(({ id }) => ({ type: 'Students' as const, id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),
    
    getStudentById: builder.query<StudentDetail, number>({
      query: (id) => `/students/${id}`,
      // Provide fallback data if the query fails
      transformResponse: (response: StudentDetail) => response,
      transformErrorResponse: (error, { id }) => {
        console.error(`Student ${id} API error:`, error);
        // Return fallback data with the requested ID
        return {
          ...fallbackStudentDetail,
          id
        };
      },
      providesTags: (result, error, id) => [{ type: 'StudentDetail', id }],
    }),
    
    getStudentPerformance: builder.query<SubjectPerformance[], number>({
      query: (id) => `/students/${id}/performance`,
      // Provide fallback data if the query fails
      transformResponse: (response: SubjectPerformance[]) => response,
      transformErrorResponse: (error) => {
        console.error("Student Performance API error:", error);
        // Return fallback data on error
        return fallbackPerformanceData;
      },
      providesTags: (result, error, id) => [{ type: 'StudentPerformance', id }],
    }),
    
    getStudentActivities: builder.query<StudentActivity[], number>({
      query: (id) => `/students/${id}/activities`,
      // Provide fallback data if the query fails
      transformResponse: (response: StudentActivity[]) => response,
      transformErrorResponse: (error) => {
        console.error("Student Activities API error:", error);
        // Return fallback data on error
        return fallbackActivities;
      },
      providesTags: (result, error, id) => [{ type: 'StudentActivity', id }],
    }),
    
    getStudentPayments: builder.query<Payment[], number>({
      query: (id) => `/students/${id}/payments`,
      // Provide fallback data if the query fails
      transformResponse: (response: Payment[]) => response,
      transformErrorResponse: (error) => {
        console.error("Student Payments API error:", error);
        // Return fallback data on error
        return fallbackPayments;
      },
      providesTags: (result, error, id) => [{ type: 'StudentPayment', id }],
    }),
    
    createStudent: builder.mutation<Student, CreateStudentRequest>({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),
    
    updateStudent: builder.mutation<StudentDetail, UpdateStudentRequest>({
      query: ({ id, ...data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Students', id },
        { type: 'StudentDetail', id },
        { type: 'Students', id: 'LIST' },
      ],
    }),
    
    deleteStudent: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),
    
    bulkUpdateStudents: builder.mutation<{ success: boolean }, { ids: number[]; action: string; data?: any }>({
      query: (data) => ({
        url: '/students/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetStudentListQuery,
  useGetStudentByIdQuery,
  useGetStudentPerformanceQuery,
  useGetStudentActivitiesQuery,
  useGetStudentPaymentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useBulkUpdateStudentsMutation,
} = studentsApi;