import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for user management data
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLogin: string;
  joinDate: string;
  avatar: string;
  permissions: string[];
  loginCount: number;
  department: string;
  location: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
  level: string;
}

export interface Permission {
  id: string;
  name: string;
  category: string;
}

export interface ActivityLog {
  id: number;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  type: string;
  ip: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  department?: string;
  page?: number;
  limit?: number;
}

export interface ActivityFilters {
  user?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ActivityLogResponse {
  logs: ActivityLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  sendInvite: boolean;
  permissions: string[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  level: string;
  permissions: string[];
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  location?: string;
  status?: string;
}

export interface UpdateUserPermissionsRequest {
  id: number;
  permissions: string[];
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  sessionTimeout: number;
  maxConcurrentSessions: number;
  twoFactorAuth: boolean;
  ipRestrictions: {
    enabled: boolean;
    allowedIps: string[];
  };
}

// Fallback data for when API fails
export const fallbackUsers: User[] = [
  {
    id: 1,
    name: 'Dr. Sarah Adebayo',
    email: 'sarah@brightstars.com',
    phone: '+234 801 234 5678',
    role: 'Principal',
    status: 'Active',
    lastLogin: '2 hours ago',
    joinDate: '2023-09-01',
    avatar: '👩‍💼',
    permissions: ['Manage Students', 'Manage Staff', 'View Reports', 'Manage Payments', 'System Settings'],
    loginCount: 245,
    department: 'Administration',
    location: 'Lagos Office'
  },
  {
    id: 2,
    name: 'Mr. John Okafor',
    email: 'john@brightstars.com',
    phone: '+234 802 345 6789',
    role: 'Instructor',
    status: 'Active',
    lastLogin: '1 day ago',
    joinDate: '2023-10-15',
    avatar: '👨‍🏫',
    permissions: ['Manage Students', 'Create Exams', 'View Reports'],
    loginCount: 189,
    department: 'Academic',
    location: 'Lagos Office'
  },
  {
    id: 3,
    name: 'Mrs. Fatima Hassan',
    email: 'fatima@brightstars.com',
    phone: '+234 803 456 7890',
    role: 'Supervisor',
    status: 'Active',
    lastLogin: '3 hours ago',
    joinDate: '2023-11-01',
    avatar: '👩‍🎓',
    permissions: ['Manage Students', 'View Reports'],
    loginCount: 156,
    department: 'Academic',
    location: 'Abuja Branch'
  },
  {
    id: 4,
    name: 'Mr. David Eze',
    email: 'david@brightstars.com',
    phone: '+234 804 567 8901',
    role: 'Instructor',
    status: 'Suspended',
    lastLogin: '1 week ago',
    joinDate: '2023-12-01',
    avatar: '👨‍💻',
    permissions: ['Manage Students', 'Create Exams'],
    loginCount: 89,
    department: 'Academic',
    location: 'Lagos Office'
  },
  {
    id: 5,
    name: 'Ms. Aisha Mohammed',
    email: 'aisha@brightstars.com',
    phone: '+234 805 678 9012',
    role: 'Admin Staff',
    status: 'Active',
    lastLogin: '5 hours ago',
    joinDate: '2024-01-05',
    avatar: '👩‍💼',
    permissions: ['Manage Students', 'Manage Payments'],
    loginCount: 45,
    department: 'Administration',
    location: 'Lagos Office'
  }
];

export const fallbackRoles: Role[] = [
  {
    id: 1,
    name: 'Principal',
    description: 'Full administrative access to all system features',
    permissions: ['Manage Students', 'Manage Staff', 'View Reports', 'Manage Payments', 'System Settings', 'User Management'],
    userCount: 1,
    color: 'bg-purple-500',
    level: 'Super Admin'
  },
  {
    id: 2,
    name: 'Vice Principal',
    description: 'Administrative access with limited financial controls',
    permissions: ['Manage Students', 'Manage Staff', 'View Reports', 'Limited Payments'],
    userCount: 1,
    color: 'bg-indigo-500',
    level: 'Admin'
  },
  {
    id: 3,
    name: 'Instructor',
    description: 'Teaching staff with student and content management access',
    permissions: ['Manage Students', 'Create Exams', 'View Reports', 'Upload Content'],
    userCount: 8,
    color: 'bg-blue-500',
    level: 'Staff'
  },
  {
    id: 4,
    name: 'Supervisor',
    description: 'Supervisory role with monitoring and reporting access',
    permissions: ['View Students', 'View Reports', 'Monitor Activities'],
    userCount: 3,
    color: 'bg-green-500',
    level: 'Staff'
  },
  {
    id: 5,
    name: 'Admin Staff',
    description: 'Administrative support with limited system access',
    permissions: ['Manage Students', 'Manage Payments', 'Basic Reports'],
    userCount: 2,
    color: 'bg-orange-500',
    level: 'Support'
  }
];

export const fallbackPermissions: Permission[] = [
  { id: 'manage_students', name: 'Manage Students', category: 'Academic' },
  { id: 'manage_staff', name: 'Manage Staff', category: 'Administration' },
  { id: 'view_reports', name: 'View Reports', category: 'Analytics' },
  { id: 'manage_payments', name: 'Manage Payments', category: 'Financial' },
  { id: 'create_exams', name: 'Create Exams', category: 'Academic' },
  { id: 'upload_content', name: 'Upload Content', category: 'Academic' },
  { id: 'system_settings', name: 'System Settings', category: 'Administration' },
  { id: 'user_management', name: 'User Management', category: 'Administration' },
  { id: 'send_notifications', name: 'Send Notifications', category: 'Communication' },
  { id: 'manage_features', name: 'Manage Features', category: 'Administration' }
];

export const fallbackActivityLogs: ActivityLog[] = [
  {
    id: 1,
    user: 'Dr. Sarah Adebayo',
    action: 'Created new student account',
    details: 'Added Chidi Okafor to SS3 Mathematics',
    timestamp: '2024-01-15 14:30:00',
    type: 'create',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    user: 'Mr. John Okafor',
    action: 'Updated exam questions',
    details: 'Modified Mathematics Quiz #15',
    timestamp: '2024-01-15 13:45:00',
    type: 'update',
    ip: '192.168.1.105'
  },
  {
    id: 3,
    user: 'Mrs. Fatima Hassan',
    action: 'Generated student report',
    details: 'Downloaded SS2 performance report',
    timestamp: '2024-01-15 12:20:00',
    type: 'view',
    ip: '192.168.1.110'
  },
  {
    id: 4,
    user: 'Ms. Aisha Mohammed',
    action: 'Processed payment',
    details: '₦25,000 payment from parent',
    timestamp: '2024-01-15 11:15:00',
    type: 'payment',
    ip: '192.168.1.115'
  }
];

export const userManagementApi = createApi({
  reducerPath: 'userManagementApi',
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
  tagTypes: ['Users', 'User', 'Roles', 'Role', 'Permissions', 'ActivityLogs', 'SecuritySettings'],
  endpoints: (builder) => ({
    getUserList: builder.query<UserListResponse, UserFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.role && filters.role !== 'All') params.append('role', filters.role);
        if (filters.status && filters.status !== 'All') params.append('status', filters.status);
        if (filters.department) params.append('department', filters.department);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/users?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: UserListResponse) => response,
      transformErrorResponse: (error) => {
        console.error("User Management API error:", error);
        // Return fallback data on error
        return { 
          users: fallbackUsers,
          total: fallbackUsers.length,
          page: 1,
          totalPages: 1
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.users.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      // Provide fallback data if the query fails
      transformResponse: (response: User) => response,
      transformErrorResponse: (error, { id }) => {
        console.error(`User ${id} API error:`, error);
        // Find user with matching ID or return first user
        return fallbackUsers.find(user => user.id === id) || fallbackUsers[0];
      },
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    getRoles: builder.query<Role[], void>({
      query: () => '/users/roles',
      // Provide fallback data if the query fails
      transformResponse: (response: Role[]) => response,
      transformErrorResponse: (error) => {
        console.error("Roles API error:", error);
        // Return fallback data on error
        return fallbackRoles;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Roles' as const, id })),
              { type: 'Roles', id: 'LIST' },
            ]
          : [{ type: 'Roles', id: 'LIST' }],
    }),
    
    getRoleById: builder.query<Role, number>({
      query: (id) => `/users/roles/${id}`,
      // Provide fallback data if the query fails
      transformResponse: (response: Role) => response,
      transformErrorResponse: (error, { id }) => {
        console.error(`Role ${id} API error:`, error);
        // Find role with matching ID or return first role
        return fallbackRoles.find(role => role.id === id) || fallbackRoles[0];
      },
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    
    getPermissions: builder.query<Permission[], void>({
      query: () => '/users/permissions',
      // Provide fallback data if the query fails
      transformResponse: (response: Permission[]) => response,
      transformErrorResponse: (error) => {
        console.error("Permissions API error:", error);
        // Return fallback data on error
        return fallbackPermissions;
      },
      providesTags: ['Permissions'],
    }),
    
    getActivityLogs: builder.query<ActivityLogResponse, ActivityFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.user) params.append('user', filters.user);
        if (filters.action) params.append('action', filters.action);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/users/activity?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: ActivityLogResponse) => response,
      transformErrorResponse: (error) => {
        console.error("Activity Logs API error:", error);
        // Return fallback data on error
        return { 
          logs: fallbackActivityLogs,
          total: fallbackActivityLogs.length,
          page: 1,
          totalPages: 1
        };
      },
      providesTags: ['ActivityLogs'],
    }),
    
    getSecuritySettings: builder.query<SecuritySettings, void>({
      query: () => '/users/security',
      providesTags: ['SecuritySettings'],
    }),
    
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    
    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: (data) => ({
        url: '/users/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),
    
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'User', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    
    updateUserPermissions: builder.mutation<{ success: boolean }, UpdateUserPermissionsRequest>({
      query: ({ id, permissions }) => ({
        url: `/users/${id}/permissions`,
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
      ],
    }),
    
    updateRole: builder.mutation<Role, { id: number; data: Partial<CreateRoleRequest> }>({
      query: ({ id, data }) => ({
        url: `/users/roles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Roles', id },
        { type: 'Roles', id: 'LIST' },
      ],
    }),
    
    updateSecuritySettings: builder.mutation<{ success: boolean }, Partial<SecuritySettings>>({
      query: (data) => ({
        url: '/users/security',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SecuritySettings'],
    }),
    
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    
    deleteRole: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/users/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),
    
    bulkUpdateUsers: builder.mutation<{ success: boolean }, { ids: number[]; action: string; data?: any }>({
      query: (data) => ({
        url: '/users/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetUserByIdQuery,
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useGetPermissionsQuery,
  useGetActivityLogsQuery,
  useGetSecuritySettingsQuery,
  useCreateUserMutation,
  useCreateRoleMutation,
  useUpdateUserMutation,
  useUpdateUserPermissionsMutation,
  useUpdateRoleMutation,
  useUpdateSecuritySettingsMutation,
  useDeleteUserMutation,
  useDeleteRoleMutation,
  useBulkUpdateUsersMutation,
} = userManagementApi;