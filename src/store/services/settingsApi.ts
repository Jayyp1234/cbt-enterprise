import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for settings data
export interface GeneralSettings {
  institutionName: string;
  subdomain: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  establishedYear: string;
  registrationNumber: string;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  customCSS: string;
  fontFamily: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
  ipWhitelist: string;
  auditLogs: boolean;
  dataRetention: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  systemAlerts: boolean;
}

export interface BillingInfo {
  plan: string;
  nextPayment: string;
  amount: number;
  paymentMethod: string;
  usage: {
    students: {
      current: number;
      limit: number;
    };
    staff: {
      current: number;
      limit: string;
    };
    storage: {
      current: number;
      limit: number;
    };
  };
}

export interface SettingsData {
  general: GeneralSettings;
  branding: BrandingSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  billing: BillingInfo;
}

export interface UpdateSettingsRequest {
  section: 'general' | 'branding' | 'security' | 'notifications';
  data: any;
}

// Fallback data for when API fails
export const fallbackSettings: SettingsData = {
  general: {
    institutionName: "Brightstars Tutorial Center",
    subdomain: "brightstars",
    description: "Leading tutorial center for JAMB, WAEC, and Post-UTME preparation",
    email: "info@brightstars.com",
    phone: "+234 801 234 5678",
    address: "123 Education Street, Lagos, Nigeria",
    website: "https://brightstars.com",
    establishedYear: "2015",
    registrationNumber: "RC123456789"
  },
  branding: {
    primaryColor: "#0047FF",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    logoUrl: "",
    faviconUrl: "",
    customCSS: "",
    fontFamily: "Inter"
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    ipWhitelist: "",
    auditLogs: true,
    dataRetention: 365
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    systemAlerts: true
  },
  billing: {
    plan: "Enterprise Pro",
    nextPayment: "Feb 15, 2024",
    amount: 85000,
    paymentMethod: "**** 1234",
    usage: {
      students: {
        current: 342,
        limit: 500
      },
      staff: {
        current: 12,
        limit: "Unlimited"
      },
      storage: {
        current: 2.4,
        limit: 50
      }
    }
  }
};

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
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
  tagTypes: ['Settings', 'GeneralSettings', 'BrandingSettings', 'SecuritySettings', 'NotificationSettings', 'BillingInfo'],
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsData, void>({
      query: () => '/settings',
      // Provide fallback data if the query fails
      transformResponse: (response: SettingsData) => response,
      transformErrorResponse: (error) => {
        console.error("Settings API error:", error);
        // Return fallback data on error
        return fallbackSettings;
      },
      providesTags: ['Settings'],
    }),
    
    getGeneralSettings: builder.query<GeneralSettings, void>({
      query: () => '/settings/general',
      // Provide fallback data if the query fails
      transformResponse: (response: GeneralSettings) => response,
      transformErrorResponse: (error) => {
        console.error("General Settings API error:", error);
        // Return fallback data on error
        return fallbackSettings.general;
      },
      providesTags: ['GeneralSettings'],
    }),
    
    getBrandingSettings: builder.query<BrandingSettings, void>({
      query: () => '/settings/branding',
      // Provide fallback data if the query fails
      transformResponse: (response: BrandingSettings) => response,
      transformErrorResponse: (error) => {
        console.error("Branding Settings API error:", error);
        // Return fallback data on error
        return fallbackSettings.branding;
      },
      providesTags: ['BrandingSettings'],
    }),
    
    getSecuritySettings: builder.query<SecuritySettings, void>({
      query: () => '/settings/security',
      // Provide fallback data if the query fails
      transformResponse: (response: SecuritySettings) => response,
      transformErrorResponse: (error) => {
        console.error("Security Settings API error:", error);
        // Return fallback data on error
        return fallbackSettings.security;
      },
      providesTags: ['SecuritySettings'],
    }),
    
    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => '/settings/notifications',
      // Provide fallback data if the query fails
      transformResponse: (response: NotificationSettings) => response,
      transformErrorResponse: (error) => {
        console.error("Notification Settings API error:", error);
        // Return fallback data on error
        return fallbackSettings.notifications;
      },
      providesTags: ['NotificationSettings'],
    }),
    
    getBillingInfo: builder.query<BillingInfo, void>({
      query: () => '/settings/billing',
      // Provide fallback data if the query fails
      transformResponse: (response: BillingInfo) => response,
      transformErrorResponse: (error) => {
        console.error("Billing Info API error:", error);
        // Return fallback data on error
        return fallbackSettings.billing;
      },
      providesTags: ['BillingInfo'],
    }),
    
    updateSettings: builder.mutation<{ success: boolean }, UpdateSettingsRequest>({
      query: ({ section, data }) => ({
        url: `/settings/${section}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { section }) => {
        const tags = ['Settings'];
        switch (section) {
          case 'general':
            tags.push('GeneralSettings');
            break;
          case 'branding':
            tags.push('BrandingSettings');
            break;
          case 'security':
            tags.push('SecuritySettings');
            break;
          case 'notifications':
            tags.push('NotificationSettings');
            break;
        }
        return tags;
      },
    }),
    
    updateLogo: builder.mutation<{ logoUrl: string }, FormData>({
      query: (data) => ({
        url: '/settings/branding/logo',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BrandingSettings', 'Settings'],
    }),
    
    updateFavicon: builder.mutation<{ faviconUrl: string }, FormData>({
      query: (data) => ({
        url: '/settings/branding/favicon',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BrandingSettings', 'Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetGeneralSettingsQuery,
  useGetBrandingSettingsQuery,
  useGetSecuritySettingsQuery,
  useGetNotificationSettingsQuery,
  useGetBillingInfoQuery,
  useUpdateSettingsMutation,
  useUpdateLogoMutation,
  useUpdateFaviconMutation,
} = settingsApi;