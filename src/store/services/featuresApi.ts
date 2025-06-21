import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for feature management data
export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  premium: boolean;
  icon: string;
}

export interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: Feature[];
}

export interface FeatureStats {
  totalFeatures: number;
  enabledFeatures: number;
  premiumFeatures: number;
  affectedStudents: number;
}

export interface FeatureFilters {
  category?: string;
  status?: string;
  search?: string;
}

export interface UpdateFeatureRequest {
  id: string;
  enabled: boolean;
}

export interface UpdateCategoryFeaturesRequest {
  categoryId: string;
  enabled: boolean;
}

// Fallback data for when API fails
export const fallbackFeatureCategories: FeatureCategory[] = [
  {
    id: 'core',
    name: 'Core Learning Features',
    description: 'Essential learning and practice features',
    icon: 'BookOpen',
    color: 'bg-blue-500',
    features: [
      {
        id: 'practice_mode',
        name: 'Practice Mode',
        description: 'Subject-based practice questions',
        enabled: true,
        premium: false,
        icon: 'Target'
      },
      {
        id: 'study_materials',
        name: 'Study Materials',
        description: 'Access to study resources and materials',
        enabled: true,
        premium: false,
        icon: 'BookOpen'
      },
      {
        id: 'mock_exams',
        name: 'Mock Examinations',
        description: 'Full exam simulation with timing',
        enabled: true,
        premium: true,
        icon: 'Shield'
      },
      {
        id: 'results_analytics',
        name: 'Results & Analytics',
        description: 'Performance tracking and detailed analytics',
        enabled: true,
        premium: false,
        icon: 'BarChart3'
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced Features',
    description: 'Premium features for enhanced learning',
    icon: 'Zap',
    color: 'bg-purple-500',
    features: [
      {
        id: 'ai_tutor',
        name: 'AI Tutor',
        description: 'AI-powered tutoring and instant help',
        enabled: true,
        premium: true,
        icon: 'MessageCircle'
      },
      {
        id: 'dictionary',
        name: 'Academic Dictionary',
        description: 'Comprehensive dictionary with definitions',
        enabled: true,
        premium: false,
        icon: 'Globe'
      },
      {
        id: 'university_guide',
        name: 'University Guide',
        description: 'University and course information',
        enabled: true,
        premium: true,
        icon: 'Users'
      },
      {
        id: 'calculator_tools',
        name: 'Calculator Tools',
        description: 'Scientific and basic calculators',
        enabled: true,
        premium: false,
        icon: 'Calculator'
      }
    ]
  },
  {
    id: 'gamification',
    name: 'Engagement & Gamification',
    description: 'Features to boost student engagement',
    icon: 'Trophy',
    color: 'bg-yellow-500',
    features: [
      {
        id: 'leaderboards',
        name: 'Leaderboards',
        description: 'Student rankings and competitions',
        enabled: true,
        premium: false,
        icon: 'Trophy'
      },
      {
        id: 'badges_achievements',
        name: 'Badges & Achievements',
        description: 'Reward system for student progress',
        enabled: true,
        premium: false,
        icon: 'Shield'
      },
      {
        id: 'points_wallet',
        name: 'Points & Wallet System',
        description: 'Point-based reward and redemption system',
        enabled: false,
        premium: true,
        icon: 'CreditCard'
      },
      {
        id: 'study_streaks',
        name: 'Study Streaks',
        description: 'Daily study streak tracking',
        enabled: true,
        premium: false,
        icon: 'Zap'
      }
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Support',
    description: 'Communication and support features',
    icon: 'MessageCircle',
    color: 'bg-green-500',
    features: [
      {
        id: 'notifications',
        name: 'Push Notifications',
        description: 'Real-time notifications and alerts',
        enabled: true,
        premium: false,
        icon: 'Bell'
      },
      {
        id: 'contact_support',
        name: 'Contact & Support',
        description: 'Help desk and support system',
        enabled: true,
        premium: false,
        icon: 'MessageCircle'
      },
      {
        id: 'parent_portal',
        name: 'Parent Portal Access',
        description: 'Parent access to student progress',
        enabled: false,
        premium: true,
        icon: 'Users'
      },
      {
        id: 'bulk_messaging',
        name: 'Bulk Messaging',
        description: 'Send messages to multiple students',
        enabled: false,
        premium: true,
        icon: 'Globe'
      }
    ]
  },
  {
    id: 'customization',
    name: 'Customization & Branding',
    description: 'Customize the platform appearance',
    icon: 'Settings',
    color: 'bg-indigo-500',
    features: [
      {
        id: 'custom_branding',
        name: 'Custom Branding',
        description: 'Institution logo and color customization',
        enabled: true,
        premium: true,
        icon: 'Settings'
      },
      {
        id: 'custom_domain',
        name: 'Custom Domain',
        description: 'Use your own domain name',
        enabled: false,
        premium: true,
        icon: 'Globe'
      },
      {
        id: 'white_labeling',
        name: 'Complete White Labeling',
        description: 'Remove all CBT Grinder branding',
        enabled: false,
        premium: true,
        icon: 'Eye'
      },
      {
        id: 'custom_themes',
        name: 'Custom Themes',
        description: 'Create custom color themes',
        enabled: false,
        premium: true,
        icon: 'Settings'
      }
    ]
  }
];

// Calculate stats from the feature categories
const calculateFeatureStats = (categories: FeatureCategory[]): FeatureStats => {
  let totalFeatures = 0;
  let enabledFeatures = 0;
  let premiumFeatures = 0;
  
  categories.forEach(category => {
    totalFeatures += category.features.length;
    enabledFeatures += category.features.filter(f => f.enabled).length;
    premiumFeatures += category.features.filter(f => f.premium && f.enabled).length;
  });
  
  return {
    totalFeatures,
    enabledFeatures,
    premiumFeatures,
    affectedStudents: 342 // Fixed number for demo
  };
};

export const fallbackFeatureStats: FeatureStats = calculateFeatureStats(fallbackFeatureCategories);

export const featuresApi = createApi({
  reducerPath: 'featuresApi',
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
  tagTypes: ['Features', 'FeatureStats'],
  endpoints: (builder) => ({
    getFeatureCategories: builder.query<FeatureCategory[], FeatureFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        
        return `/features?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: FeatureCategory[]) => response,
      transformErrorResponse: (error) => {
        console.error("Features API error:", error);
        // Return fallback data on error
        return fallbackFeatureCategories;
      },
      providesTags: ['Features'],
    }),
    
    getFeatureStats: builder.query<FeatureStats, void>({
      query: () => '/features/stats',
      // Provide fallback data if the query fails
      transformResponse: (response: FeatureStats) => response,
      transformErrorResponse: (error) => {
        console.error("Feature Stats API error:", error);
        // Return fallback data on error
        return fallbackFeatureStats;
      },
      providesTags: ['FeatureStats'],
    }),
    
    updateFeature: builder.mutation<Feature, UpdateFeatureRequest>({
      query: ({ id, enabled }) => ({
        url: `/features/${id}`,
        method: 'PUT',
        body: { enabled },
      }),
      invalidatesTags: ['Features', 'FeatureStats'],
    }),
    
    updateCategoryFeatures: builder.mutation<{ success: boolean }, UpdateCategoryFeaturesRequest>({
      query: ({ categoryId, enabled }) => ({
        url: `/features/categories/${categoryId}`,
        method: 'PUT',
        body: { enabled },
      }),
      invalidatesTags: ['Features', 'FeatureStats'],
    }),
    
    saveFeatureChanges: builder.mutation<{ success: boolean }, FeatureCategory[]>({
      query: (data) => ({
        url: '/features/save',
        method: 'POST',
        body: { categories: data },
      }),
      invalidatesTags: ['Features', 'FeatureStats'],
    }),
  }),
});

export const {
  useGetFeatureCategoriesQuery,
  useGetFeatureStatsQuery,
  useUpdateFeatureMutation,
  useUpdateCategoryFeaturesMutation,
  useSaveFeatureChangesMutation,
} = featuresApi;