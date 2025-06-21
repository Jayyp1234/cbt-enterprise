import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for staff data
export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  subjects: string[];
  status: string;
  joinDate: string;
  lastLogin: string;
  employeeId: string;
  salary: number;
  avatar: string;
}

export interface StaffDetail extends StaffMember {
  address: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  qualifications: string[];
  certifications: string[];
  permissions: string[];
}

export interface PerformanceMetric {
  metric: string;
  score: number;
  trend: string;
  color: string;
}

export interface TeachingSchedule {
  day: string;
  time: string;
  subject: string;
  class: string;
}

export interface StaffActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface StaffFilters {
  role?: string;
  department?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StaffListResponse {
  staff: StaffMember[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  subjects: string[];
  salary: string;
  startDate: string;
  permissions: string[];
}

export interface UpdateStaffRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  subjects?: string[];
  status?: string;
  salary?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  qualifications?: string[];
  certifications?: string[];
}

export interface UpdatePermissionsRequest {
  id: number;
  permissions: Record<string, boolean>;
}

// Fallback data for when API fails
export const fallbackStaffMembers: StaffMember[] = [
  {
    id: 1,
    name: 'Dr. Sarah Adebayo',
    email: 'sarah@brightstars.com',
    phone: '+234 801 234 5678',
    role: 'Principal',
    department: 'Administration',
    subjects: ['Mathematics', 'Physics'],
    status: 'Active',
    joinDate: '2023-09-01',
    lastLogin: '2 hours ago',
    employeeId: 'EMP001',
    salary: 450000,
    avatar: '👩‍💼'
  },
  {
    id: 2,
    name: 'Mr. John Okafor',
    email: 'john@brightstars.com',
    phone: '+234 802 345 6789',
    role: 'Instructor',
    department: 'Academic',
    subjects: ['Mathematics', 'Chemistry'],
    status: 'Active',
    joinDate: '2023-10-15',
    lastLogin: '1 day ago',
    employeeId: 'EMP002',
    salary: 350000,
    avatar: '👨‍🏫'
  },
  {
    id: 3,
    name: 'Mrs. Fatima Hassan',
    email: 'fatima@brightstars.com',
    phone: '+234 803 456 7890',
    role: 'Supervisor',
    department: 'Academic',
    subjects: ['English', 'Literature'],
    status: 'Active',
    joinDate: '2023-11-01',
    lastLogin: '3 hours ago',
    employeeId: 'EMP003',
    salary: 380000,
    avatar: '👩‍🎓'
  },
  {
    id: 4,
    name: 'Mr. David Eze',
    email: 'david@brightstars.com',
    phone: '+234 804 567 8901',
    role: 'Instructor',
    department: 'Academic',
    subjects: ['Physics', 'Chemistry'],
    status: 'Suspended',
    joinDate: '2023-12-01',
    lastLogin: '1 week ago',
    employeeId: 'EMP004',
    salary: 320000,
    avatar: '👨‍💻'
  },
  {
    id: 5,
    name: 'Ms. Aisha Mohammed',
    email: 'aisha@brightstars.com',
    phone: '+234 805 678 9012',
    role: 'Admin Staff',
    department: 'Administration',
    subjects: [],
    status: 'Active',
    joinDate: '2024-01-05',
    lastLogin: '5 hours ago',
    employeeId: 'EMP005',
    salary: 280000,
    avatar: '👩‍💼'
  }
];

export const fallbackStaffDetail: StaffDetail = {
  id: 1,
  name: 'Dr. Sarah Adebayo',
  email: 'sarah@brightstars.com',
  phone: '+234 801 234 5678',
  role: 'Principal',
  department: 'Administration',
  subjects: ['Mathematics', 'Physics'],
  status: 'Active',
  joinDate: '2023-09-01',
  lastLogin: '2 hours ago',
  employeeId: 'EMP001',
  salary: 450000,
  avatar: '👩‍💼',
  address: '45 Victoria Island, Lagos, Nigeria',
  dateOfBirth: '1985-06-15',
  gender: 'Female',
  emergencyContact: {
    name: 'Mr. Adebayo Johnson',
    phone: '+234 803 123 4567',
    relationship: 'Spouse'
  },
  qualifications: [
    'Ph.D in Mathematics Education - University of Lagos (2015)',
    'M.Sc in Mathematics - University of Ibadan (2010)',
    'B.Sc in Mathematics - Obafemi Awolowo University (2008)'
  ],
  certifications: [
    'Certified Educational Administrator (2018)',
    'Leadership in Education Certificate (2020)',
    'Digital Learning Specialist (2022)'
  ],
  permissions: [
    'Manage Students',
    'Manage Staff',
    'View Reports',
    'Manage Payments',
    'System Settings'
  ]
};

export const fallbackPerformanceMetrics: PerformanceMetric[] = [
  {
    metric: 'Teaching Effectiveness',
    score: 92,
    trend: '+5%',
    color: 'text-green-600'
  },
  {
    metric: 'Student Satisfaction',
    score: 88,
    trend: '+3%',
    color: 'text-green-600'
  },
  {
    metric: 'Content Quality',
    score: 95,
    trend: '+7%',
    color: 'text-green-600'
  },
  {
    metric: 'Attendance Rate',
    score: 98,
    trend: '+2%',
    color: 'text-green-600'
  }
];

export const fallbackTeachingSchedule: TeachingSchedule[] = [
  {
    day: 'Monday',
    time: '9:00 AM - 11:00 AM',
    subject: 'Mathematics',
    class: 'SS3'
  },
  {
    day: 'Monday',
    time: '1:00 PM - 3:00 PM',
    subject: 'Physics',
    class: 'SS2'
  },
  {
    day: 'Tuesday',
    time: '10:00 AM - 12:00 PM',
    subject: 'Mathematics',
    class: 'SS2'
  },
  {
    day: 'Wednesday',
    time: '9:00 AM - 11:00 AM',
    subject: 'Physics',
    class: 'SS3'
  },
  {
    day: 'Thursday',
    time: '1:00 PM - 3:00 PM',
    subject: 'Mathematics',
    class: 'SS1'
  },
  {
    day: 'Friday',
    time: '10:00 AM - 12:00 PM',
    subject: 'Physics',
    class: 'SS1'
  }
];

export const fallbackStaffActivities: StaffActivity[] = [
  {
    id: 1,
    type: 'class',
    title: 'Conducted Mathematics Class',
    description: 'Taught Calculus to SS3 students',
    timestamp: '2024-01-15 10:30 AM',
    icon: '👨‍🏫'
  },
  {
    id: 2,
    type: 'exam',
    title: 'Created Physics Exam',
    description: 'Prepared mid-term examination for SS2',
    timestamp: '2024-01-14 2:45 PM',
    icon: '📝'
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Staff Meeting',
    description: 'Attended weekly academic staff meeting',
    timestamp: '2024-01-13 9:00 AM',
    icon: '👥'
  },
  {
    id: 4,
    type: 'content',
    title: 'Uploaded Study Materials',
    description: 'Added new Mathematics resources for SS3',
    timestamp: '2024-01-12 11:15 AM',
    icon: '📚'
  }
];

export const staffApi = createApi({
  reducerPath: 'staffApi',
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
  tagTypes: ['Staff', 'StaffDetail', 'StaffPerformance', 'StaffSchedule', 'StaffActivity'],
  endpoints: (builder) => ({
    getStaffList: builder.query<StaffListResponse, StaffFilters>({
      query: (filters) => {
        // Convert filters to query string
        const params = new URLSearchParams();
        if (filters.role && filters.role !== 'All') params.append('role', filters.role);
        if (filters.department) params.append('department', filters.department);
        if (filters.status && filters.status !== 'All') params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/staff?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: StaffListResponse) => response,
      transformErrorResponse: (error) => {
        console.error("Staff API error:", error);
        // Return fallback data on error
        return { 
          staff: fallbackStaffMembers,
          total: fallbackStaffMembers.length,
          page: 1,
          totalPages: 1
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.staff.map(({ id }) => ({ type: 'Staff' as const, id })),
              { type: 'Staff', id: 'LIST' },
            ]
          : [{ type: 'Staff', id: 'LIST' }],
    }),
    
    getStaffById: builder.query<StaffDetail, number>({
      query: (id) => `/staff/${id}`,
      // Provide fallback data if the query fails
      transformResponse: (response: StaffDetail) => response,
      transformErrorResponse: (error, { id }) => {
        console.error(`Staff ${id} API error:`, error);
        // Return fallback data with the requested ID
        return {
          ...fallbackStaffDetail,
          id
        };
      },
      providesTags: (result, error, id) => [{ type: 'StaffDetail', id }],
    }),
    
    getStaffPerformance: builder.query<PerformanceMetric[], number>({
      query: (id) => `/staff/${id}/performance`,
      // Provide fallback data if the query fails
      transformResponse: (response: PerformanceMetric[]) => response,
      transformErrorResponse: (error) => {
        console.error("Staff Performance API error:", error);
        // Return fallback data on error
        return fallbackPerformanceMetrics;
      },
      providesTags: (result, error, id) => [{ type: 'StaffPerformance', id }],
    }),
    
    getStaffSchedule: builder.query<TeachingSchedule[], number>({
      query: (id) => `/staff/${id}/schedule`,
      // Provide fallback data if the query fails
      transformResponse: (response: TeachingSchedule[]) => response,
      transformErrorResponse: (error) => {
        console.error("Staff Schedule API error:", error);
        // Return fallback data on error
        return fallbackTeachingSchedule;
      },
      providesTags: (result, error, id) => [{ type: 'StaffSchedule', id }],
    }),
    
    getStaffActivities: builder.query<StaffActivity[], number>({
      query: (id) => `/staff/${id}/activities`,
      // Provide fallback data if the query fails
      transformResponse: (response: StaffActivity[]) => response,
      transformErrorResponse: (error) => {
        console.error("Staff Activities API error:", error);
        // Return fallback data on error
        return fallbackStaffActivities;
      },
      providesTags: (result, error, id) => [{ type: 'StaffActivity', id }],
    }),
    
    createStaff: builder.mutation<StaffMember, CreateStaffRequest>({
      query: (data) => ({
        url: '/staff',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),
    
    updateStaff: builder.mutation<StaffDetail, UpdateStaffRequest>({
      query: ({ id, ...data }) => ({
        url: `/staff/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Staff', id },
        { type: 'StaffDetail', id },
        { type: 'Staff', id: 'LIST' },
      ],
    }),
    
    updateStaffPermissions: builder.mutation<{ success: boolean }, UpdatePermissionsRequest>({
      query: ({ id, permissions }) => ({
        url: `/staff/${id}/permissions`,
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'StaffDetail', id },
      ],
    }),
    
    deleteStaff: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),
    
    bulkUpdateStaff: builder.mutation<{ success: boolean }, { ids: number[]; action: string; data?: any }>({
      query: (data) => ({
        url: '/staff/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useGetStaffByIdQuery,
  useGetStaffPerformanceQuery,
  useGetStaffScheduleQuery,
  useGetStaffActivitiesQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useUpdateStaffPermissionsMutation,
  useDeleteStaffMutation,
  useBulkUpdateStaffMutation,
} = staffApi;