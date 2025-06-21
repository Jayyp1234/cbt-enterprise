import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../slices/authSlice';

// Define base URL for API
const BASE_URL = 'https://api.cbtgrinder.com/enterprise/';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  institution?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  institutionName: string;
  institutionType: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as any).auth.token;
      
      // If token exists, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login.php',
        method: 'POST',
        body: credentials,
      }),
      // Transform the response to update auth state
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register.php',
        method: 'POST',
        body: data,
      }),
    }),

    resendVerification: builder.mutation<{ message: string }, ResendVerificationRequest>({
      query: (data) => ({
        url: '/auth/resend-verification.php',
        method: 'POST',
        body: data,
      }),
    }),

    
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password.php',
        method: 'POST',
        body: data,
      }),
    }),
    
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    verifyEmail: builder.mutation<{ message: string }, VerifyEmailRequest>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),
    
    refreshToken: builder.mutation<{ token: string; refreshToken: string }, string>({
      query: (refreshToken) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body: { refreshToken },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              token: data.token,
              refreshToken: data.refreshToken,
            })
          );
        } catch (error) {
          dispatch(logout());
        }
      },
    }),
    
    googleAuth: builder.mutation<AuthResponse, GoogleAuthRequest>({
      query: (data) => ({
        url: '/auth/google',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useResendVerificationMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useRefreshTokenMutation,
  useGoogleAuthMutation,
  useLogoutMutation,
} = authApi;