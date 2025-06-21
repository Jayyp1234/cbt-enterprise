import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for content data
export interface ContentItem {
  id: number;
  title: string;
  type: string;
  category: string;
  subject: string;
  author: string;
  size: string;
  downloads: number;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  tags: string[];
  description: string;
  featured: boolean;
  premium: boolean;
}

export interface ExamQuestion {
  id: number;
  question: string;
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  createdBy: string;
  createdAt: string;
  status: string;
  usageCount: number;
}

export interface ContentFolder {
  id: number;
  name: string;
  description: string;
  parent: string;
  permissions: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFilters {
  category?: string;
  subject?: string;
  type?: string;
  status?: string;
  search?: string;
  featured?: boolean;
  premium?: boolean;
  page?: number;
  limit?: number;
}

export interface QuestionFilters {
  subject?: string;
  topic?: string;
  difficulty?: string;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ContentListResponse {
  items: ContentItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface QuestionListResponse {
  questions: ExamQuestion[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateContentRequest {
  title: string;
  description: string;
  subject: string;
  category: string;
  tags: string;
  featured: boolean;
  premium: boolean;
  file?: File;
  url?: string;
}

export interface CreateFolderRequest {
  name: string;
  description: string;
  parent: string;
  permissions: string;
}

export interface CreateQuestionRequest {
  question: string;
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Fallback data for when API fails
export const fallbackContentItems: ContentItem[] = [
  {
    id: 1,
    title: 'JAMB Mathematics Complete Guide 2024',
    type: 'PDF',
    category: 'Study Materials',
    subject: 'Mathematics',
    author: 'Dr. Sarah Adebayo',
    size: '15.2 MB',
    downloads: 245,
    views: 1250,
    status: 'Published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    thumbnail: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg',
    tags: ['JAMB', 'Mathematics', 'Algebra', 'Geometry'],
    description: 'Comprehensive mathematics guide covering all JAMB topics with solved examples.',
    featured: true,
    premium: false
  },
  {
    id: 2,
    title: 'Physics Mechanics Video Series',
    type: 'Video',
    category: 'Video Lectures',
    subject: 'Physics',
    author: 'Prof. Michael Chen',
    size: '2.1 GB',
    downloads: 189,
    views: 890,
    status: 'Published',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14',
    thumbnail: 'https://images.pexels.com/photos/8197543/pexels-photo-8197543.jpeg',
    tags: ['Physics', 'Mechanics', 'Motion', 'Forces'],
    description: 'Complete video series on mechanics covering motion, forces, and energy.',
    featured: true,
    premium: true
  },
  {
    id: 3,
    title: 'Chemistry Lab Practical Guide',
    type: 'PDF',
    category: 'Practical Guides',
    subject: 'Chemistry',
    author: 'Dr. James Okafor',
    size: '8.9 MB',
    downloads: 156,
    views: 780,
    status: 'Draft',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
    thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg',
    tags: ['Chemistry', 'Practical', 'Lab', 'Experiments'],
    description: 'Step-by-step guide for chemistry laboratory practicals.',
    featured: false,
    premium: false
  },
  {
    id: 4,
    title: 'English Grammar Audio Lessons',
    type: 'Audio',
    category: 'Audio Content',
    subject: 'English',
    author: 'Mrs. Fatima Hassan',
    size: '156 MB',
    downloads: 98,
    views: 450,
    status: 'Published',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-10',
    thumbnail: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
    tags: ['English', 'Grammar', 'Audio', 'Lessons'],
    description: 'Audio lessons covering English grammar rules and usage.',
    featured: false,
    premium: true
  }
];

export const fallbackExamQuestions: ExamQuestion[] = [
  {
    id: 1,
    question: 'What is the derivative of x²?',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    options: ['2x', 'x', '2', 'x²'],
    correctAnswer: '2x',
    explanation: 'The derivative of x² is 2x using the power rule.',
    createdBy: 'Dr. Sarah Adebayo',
    createdAt: '2024-01-15',
    status: 'Approved',
    usageCount: 45
  },
  {
    id: 2,
    question: 'Define photosynthesis and explain its importance.',
    subject: 'Biology',
    topic: 'Plant Biology',
    difficulty: 'Easy',
    type: 'Essay',
    options: [],
    correctAnswer: '',
    explanation: 'Photosynthesis is the process by which plants convert light energy into chemical energy.',
    createdBy: 'Dr. Aisha Mohammed',
    createdAt: '2024-01-12',
    status: 'Pending Review',
    usageCount: 23
  },
  {
    id: 3,
    question: 'Calculate the velocity of an object with mass 5kg and kinetic energy 100J.',
    subject: 'Physics',
    topic: 'Mechanics',
    difficulty: 'Hard',
    type: 'Calculation',
    options: [],
    correctAnswer: '6.32 m/s',
    explanation: 'Using KE = ½mv², solve for v: v = √(2KE/m) = √(200/5) = √40 ≈ 6.32 m/s',
    createdBy: 'Prof. Michael Chen',
    createdAt: '2024-01-10',
    status: 'Approved',
    usageCount: 67
  }
];

export const contentApi = createApi({
  reducerPath: 'contentApi',
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
  tagTypes: ['Content', 'Questions', 'Folders', 'ContentAnalytics'],
  endpoints: (builder) => ({
    getContentList: builder.query<ContentListResponse, ContentFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.subject) params.append('subject', filters.subject);
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
        if (filters.premium !== undefined) params.append('premium', filters.premium.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/content?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: ContentListResponse) => response,
      transformErrorResponse: (error) => {
        console.error("Content API error:", error);
        // Return fallback data on error
        return { 
          items: fallbackContentItems,
          total: fallbackContentItems.length,
          page: 1,
          totalPages: 1
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Content' as const, id })),
              { type: 'Content', id: 'LIST' },
            ]
          : [{ type: 'Content', id: 'LIST' }],
    }),
    
    getContentById: builder.query<ContentItem, number>({
      query: (id) => `/content/${id}`,
      providesTags: (result, error, id) => [{ type: 'Content', id }],
    }),
    
    getQuestionList: builder.query<QuestionListResponse, QuestionFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.subject) params.append('subject', filters.subject);
        if (filters.topic) params.append('topic', filters.topic);
        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/content/questions?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: QuestionListResponse) => response,
      transformErrorResponse: (error) => {
        console.error("Questions API error:", error);
        // Return fallback data on error
        return { 
          questions: fallbackExamQuestions,
          total: fallbackExamQuestions.length,
          page: 1,
          totalPages: 1
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.questions.map(({ id }) => ({ type: 'Questions' as const, id })),
              { type: 'Questions', id: 'LIST' },
            ]
          : [{ type: 'Questions', id: 'LIST' }],
    }),
    
    getFolders: builder.query<ContentFolder[], { parent?: string }>({
      query: ({ parent = '' }) => `/content/folders?parent=${parent}`,
      providesTags: [{ type: 'Folders', id: 'LIST' }],
    }),
    
    getContentAnalytics: builder.query<any, void>({
      query: () => '/content/analytics',
      providesTags: [{ type: 'ContentAnalytics', id: 'DATA' }],
    }),
    
    createContent: builder.mutation<ContentItem, FormData>({
      query: (data) => ({
        url: '/content',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Content', id: 'LIST' }],
    }),
    
    updateContent: builder.mutation<ContentItem, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/content/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Content', id },
        { type: 'Content', id: 'LIST' },
      ],
    }),
    
    deleteContent: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/content/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Content', id: 'LIST' }],
    }),
    
    createFolder: builder.mutation<ContentFolder, CreateFolderRequest>({
      query: (data) => ({
        url: '/content/folders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Folders', id: 'LIST' }],
    }),
    
    createQuestion: builder.mutation<ExamQuestion, CreateQuestionRequest>({
      query: (data) => ({
        url: '/content/questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Questions', id: 'LIST' }],
    }),
    
    updateQuestion: builder.mutation<ExamQuestion, { id: number; data: Partial<CreateQuestionRequest> }>({
      query: ({ id, data }) => ({
        url: `/content/questions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Questions', id },
        { type: 'Questions', id: 'LIST' },
      ],
    }),
    
    deleteQuestion: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/content/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Questions', id: 'LIST' }],
    }),
    
    bulkUpdateContent: builder.mutation<{ success: boolean }, { ids: number[]; action: string; data?: any }>({
      query: (data) => ({
        url: '/content/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Content', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetContentListQuery,
  useGetContentByIdQuery,
  useGetQuestionListQuery,
  useGetFoldersQuery,
  useGetContentAnalyticsQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useCreateFolderMutation,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useBulkUpdateContentMutation,
} = contentApi;