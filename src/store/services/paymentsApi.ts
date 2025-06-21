import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

// Define types for payment data
export interface PaymentLink {
  id: number;
  title: string;
  description: string;
  amount: number;
  collected: number;
  totalAmount: number;
  status: string;
  created: string;
  expires: string;
  url: string;
  allowPartialPayment: boolean;
  partialPayments: number;
  pendingAmount: number;
  completedPayments: number;
  maxPayments: number;
  minimumPayment?: number;
  createdBy: string;
  customFields: string[];
}

export interface Transaction {
  id: number;
  studentName: string;
  email: string;
  amount: number;
  paymentLink: string;
  paymentLinkId: number;
  status: string;
  date: string;
  method: string;
  reference: string;
  isPartial: boolean;
  remainingAmount: number;
  studentId: string;
  class: string;
  parentPhone: string;
}

export interface PartialPayment {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  paymentLink: string;
  paymentLinkId: number;
  amountPaid: number;
  remainingAmount: number;
  totalAmount: number;
  lastPaymentDate: string;
  dueDate: string;
  status: string;
  remindersSent: number;
  lastReminderDate: string;
  studentId: string;
  class: string;
  parentPhone: string;
}

export interface PaymentAnalytics {
  revenueData: Array<{
    month: string;
    revenue: number;
    transactions: number;
    students: number;
  }>;
  paymentMethodData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  paymentLinkPerformance: Array<{
    name: string;
    revenue: number;
    transactions: number;
    completion: number;
  }>;
  dailyTransactions: Array<{
    day: string;
    completed: number;
    partial: number;
    failed: number;
  }>;
}

export interface PaymentFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentLinkId?: number;
  page?: number;
  limit?: number;
}

export interface CreatePaymentLinkRequest {
  title: string;
  description: string;
  amount: string;
  allowPartialPayment: boolean;
  partialPercentage: number;
  expiryDate: string;
  maxPayments: string;
  collectStudentInfo: boolean;
  sendReceipt: boolean;
  customFields: string[];
}

export interface UpdatePaymentLinkRequest {
  id: number;
  title?: string;
  description?: string;
  amount?: string;
  allowPartialPayment?: boolean;
  partialPercentage?: number;
  expiryDate?: string;
  maxPayments?: string;
  status?: string;
  collectStudentInfo?: boolean;
  sendReceipt?: boolean;
  customFields?: string[];
}

export interface SendReminderRequest {
  recipients: number[];
  subject: string;
  message: string;
  channels: string[];
  includePaymentLink: boolean;
  scheduleType: string;
  scheduleDate?: string;
  scheduleTime?: string;
  recurrence?: string;
}

export interface PaymentSettingsRequest {
  generalSettings: {
    defaultCurrency: string;
    allowPartialPayments: boolean;
    minimumPartialPercentage: number;
    autoSendReceipts: boolean;
    autoSendReminders: boolean;
    reminderFrequency: string;
    reminderDays: number;
    paymentExpiryDays: number;
    overdueAfterDays: number;
  };
  notificationSettings: {
    newPaymentNotification: boolean;
    partialPaymentNotification: boolean;
    completedPaymentNotification: boolean;
    failedPaymentNotification: boolean;
    reminderSentNotification: boolean;
    notificationRecipients: string;
  };
  paymentMethods: {
    cardPayments: boolean;
    bankTransfer: boolean;
    ussd: boolean;
    mobileMoney: boolean;
    qrCode: boolean;
    processingFee: number;
    absorbFees: boolean;
  };
}

export interface SentReminder {
  id: number;
  title: string;
  recipients: number;
  sentDate: string;
  sentBy: string;
  channels: string[];
  openRate: number;
  clickRate: number;
  completionRate: number;
  status: string;
}

export interface ScheduledReminder {
  id: number;
  title: string;
  recipients: string;
  scheduledDate: string;
  createdBy: string;
  channels: string[];
  status: string;
  recurrence: string;
}

export interface ReminderRecipient {
  id: number;
  name: string;
  email: string;
  status: string;
  clicked: boolean;
  completed: boolean;
}

// Fallback data for when API fails
export const fallbackPaymentLinks: PaymentLink[] = [
  { 
    id: 1, 
    title: 'JAMB Preparation Course', 
    description: 'Comprehensive JAMB preparation course with mock exams and study materials',
    amount: 25000, 
    collected: 18, 
    totalAmount: 450000,
    status: 'Active',
    created: '2024-01-10',
    expires: '2024-03-10',
    url: 'https://pay.brightstars.com/jamb-prep',
    allowPartialPayment: true,
    partialPayments: 5,
    pendingAmount: 62500,
    completedPayments: 13,
    maxPayments: 50,
    minimumPayment: 12500,
    createdBy: 'Dr. Sarah Adebayo',
    customFields: ['Student ID', 'Class', 'Parent Phone']
  },
  { 
    id: 2, 
    title: 'WAEC Tutorial Package', 
    description: 'Complete WAEC tutorial package for all core subjects',
    amount: 35000, 
    collected: 12, 
    totalAmount: 420000,
    status: 'Active',
    created: '2024-01-08',
    expires: '2024-04-08',
    url: 'https://pay.brightstars.com/waec-tutorial',
    allowPartialPayment: false,
    partialPayments: 0,
    pendingAmount: 0,
    completedPayments: 12,
    maxPayments: 30,
    createdBy: 'Dr. Sarah Adebayo',
    customFields: ['Student ID', 'Class']
  },
  { 
    id: 3, 
    title: 'Mathematics Intensive', 
    description: 'Intensive mathematics course for SS3 students',
    amount: 15000, 
    collected: 25, 
    totalAmount: 375000,
    status: 'Completed',
    created: '2023-12-15',
    expires: '2024-02-15',
    url: 'https://pay.brightstars.com/math-intensive',
    allowPartialPayment: true,
    partialPayments: 8,
    pendingAmount: 45000,
    completedPayments: 17,
    maxPayments: 25,
    minimumPayment: 7500,
    createdBy: 'Mr. John Okafor',
    customFields: ['Student ID', 'Class']
  },
  { 
    id: 4, 
    title: 'Physics Masterclass', 
    description: 'Advanced physics course with practical experiments',
    amount: 20000, 
    collected: 8, 
    totalAmount: 160000,
    status: 'Paused',
    created: '2024-01-05',
    expires: '2024-05-05',
    url: 'https://pay.brightstars.com/physics-master',
    allowPartialPayment: true,
    partialPayments: 3,
    pendingAmount: 30000,
    completedPayments: 5,
    maxPayments: 20,
    minimumPayment: 10000,
    createdBy: 'Prof. Michael Chen',
    customFields: ['Student ID', 'Class', 'Parent Phone']
  }
];

export const fallbackTransactions: Transaction[] = [
  {
    id: 1,
    studentName: 'Adebayo Johnson',
    email: 'adebayo@email.com',
    amount: 25000,
    paymentLink: 'JAMB Preparation Course',
    paymentLinkId: 1,
    status: 'Completed',
    date: '2024-01-15 14:30',
    method: 'Card',
    reference: 'TXN_001234567',
    isPartial: false,
    remainingAmount: 0,
    studentId: 'STD001',
    class: 'SS3',
    parentPhone: '+234 801 234 5678'
  },
  {
    id: 2,
    studentName: 'Fatima Ibrahim',
    email: 'fatima@email.com',
    amount: 12500,
    paymentLink: 'JAMB Preparation Course',
    paymentLinkId: 1,
    status: 'Partial',
    date: '2024-01-14 09:15',
    method: 'Bank Transfer',
    reference: 'TXN_001234568',
    isPartial: true,
    remainingAmount: 12500,
    studentId: 'STD002',
    class: 'SS3',
    parentPhone: '+234 802 345 6789'
  },
  {
    id: 3,
    studentName: 'Chidi Okafor',
    email: 'chidi@email.com',
    amount: 15000,
    paymentLink: 'Mathematics Intensive',
    paymentLinkId: 3,
    status: 'Partial',
    date: '2024-01-13 16:45',
    method: 'Card',
    reference: 'TXN_001234569',
    isPartial: true,
    remainingAmount: 10000,
    studentId: 'STD003',
    class: 'SS2',
    parentPhone: '+234 803 456 7890'
  },
  {
    id: 4,
    studentName: 'Aisha Mohammed',
    email: 'aisha@email.com',
    amount: 25000,
    paymentLink: 'JAMB Preparation Course',
    paymentLinkId: 1,
    status: 'Completed',
    date: '2024-01-12 11:20',
    method: 'Card',
    reference: 'TXN_001234570',
    isPartial: false,
    remainingAmount: 0,
    studentId: 'STD004',
    class: 'SS3',
    parentPhone: '+234 804 567 8901'
  },
  {
    id: 5,
    studentName: 'Emeka Nwankwo',
    email: 'emeka@email.com',
    amount: 12500,
    paymentLink: 'Mathematics Intensive',
    paymentLinkId: 3,
    status: 'Partial',
    date: '2024-01-11 13:10',
    method: 'Bank Transfer',
    reference: 'TXN_001234571',
    isPartial: true,
    remainingAmount: 12500,
    studentId: 'STD005',
    class: 'SS2',
    parentPhone: '+234 805 678 9012'
  },
  {
    id: 6,
    studentName: 'Blessing Eze',
    email: 'blessing@email.com',
    amount: 35000,
    paymentLink: 'WAEC Tutorial Package',
    paymentLinkId: 2,
    status: 'Completed',
    date: '2024-01-10 10:05',
    method: 'Card',
    reference: 'TXN_001234572',
    isPartial: false,
    remainingAmount: 0,
    studentId: 'STD006',
    class: 'SS3',
    parentPhone: '+234 806 789 0123'
  },
  {
    id: 7,
    studentName: 'Tunde Bakare',
    email: 'tunde@email.com',
    amount: 20000,
    paymentLink: 'Physics Masterclass',
    paymentLinkId: 4,
    status: 'Failed',
    date: '2024-01-09 15:30',
    method: 'Card',
    reference: 'TXN_001234573',
    isPartial: false,
    remainingAmount: 0,
    studentId: 'STD007',
    class: 'SS2',
    parentPhone: '+234 807 890 1234'
  }
];

export const fallbackPartialPayments: PartialPayment[] = [
  {
    id: 1,
    studentName: 'Fatima Ibrahim',
    email: 'fatima@email.com',
    phone: '+234 802 345 6789',
    paymentLink: 'JAMB Preparation Course',
    paymentLinkId: 1,
    amountPaid: 12500,
    remainingAmount: 12500,
    totalAmount: 25000,
    lastPaymentDate: '2024-01-14',
    dueDate: '2024-01-28',
    status: 'Pending',
    remindersSent: 1,
    lastReminderDate: '2024-01-21',
    studentId: 'STD002',
    class: 'SS3',
    parentPhone: '+234 802 345 6789'
  },
  {
    id: 2,
    studentName: 'Chidi Okafor',
    email: 'chidi@email.com',
    phone: '+234 803 456 7890',
    paymentLink: 'Mathematics Intensive',
    paymentLinkId: 3,
    amountPaid: 15000,
    remainingAmount: 10000,
    totalAmount: 25000,
    lastPaymentDate: '2024-01-13',
    dueDate: '2024-01-27',
    status: 'Pending',
    remindersSent: 2,
    lastReminderDate: '2024-01-22',
    studentId: 'STD003',
    class: 'SS2',
    parentPhone: '+234 803 456 7890'
  },
  {
    id: 3,
    studentName: 'Emeka Nwankwo',
    email: 'emeka@email.com',
    phone: '+234 805 678 9012',
    paymentLink: 'Mathematics Intensive',
    paymentLinkId: 3,
    amountPaid: 12500,
    remainingAmount: 12500,
    totalAmount: 25000,
    lastPaymentDate: '2024-01-11',
    dueDate: '2024-01-25',
    status: 'Overdue',
    remindersSent: 3,
    lastReminderDate: '2024-01-23',
    studentId: 'STD005',
    class: 'SS2',
    parentPhone: '+234 805 678 9012'
  }
];

export const fallbackPaymentAnalytics: PaymentAnalytics = {
  revenueData: [
    { month: 'Jan', revenue: 180000, transactions: 45, students: 42 },
    { month: 'Feb', revenue: 220000, transactions: 52, students: 48 },
    { month: 'Mar', revenue: 280000, transactions: 68, students: 65 },
    { month: 'Apr', revenue: 320000, transactions: 78, students: 72 },
    { month: 'May', revenue: 380000, transactions: 89, students: 85 },
    { month: 'Jun', revenue: 420000, transactions: 95, students: 90 }
  ],
  paymentMethodData: [
    { name: 'Card Payment', value: 65, color: '#0047FF' },
    { name: 'Bank Transfer', value: 25, color: '#10B981' },
    { name: 'Mobile Money', value: 10, color: '#F59E0B' }
  ],
  paymentLinkPerformance: [
    { name: 'JAMB Preparation', revenue: 450000, transactions: 18, completion: 72 },
    { name: 'WAEC Tutorial', revenue: 420000, transactions: 12, completion: 100 },
    { name: 'Mathematics', revenue: 375000, transactions: 25, completion: 68 },
    { name: 'Physics', revenue: 160000, transactions: 8, completion: 62 }
  ],
  dailyTransactions: [
    { day: 'Mon', completed: 8, partial: 2, failed: 1 },
    { day: 'Tue', completed: 12, partial: 3, failed: 0 },
    { day: 'Wed', completed: 10, partial: 4, failed: 1 },
    { day: 'Thu', completed: 15, partial: 5, failed: 2 },
    { day: 'Fri', completed: 18, partial: 6, failed: 1 },
    { day: 'Sat', completed: 7, partial: 2, failed: 0 },
    { day: 'Sun', completed: 5, partial: 1, failed: 0 }
  ]
};

export const fallbackPaymentSettings: PaymentSettingsRequest = {
  generalSettings: {
    defaultCurrency: 'NGN',
    allowPartialPayments: true,
    minimumPartialPercentage: 50,
    autoSendReceipts: true,
    autoSendReminders: true,
    reminderFrequency: 'weekly',
    reminderDays: 3,
    paymentExpiryDays: 30,
    overdueAfterDays: 7
  },
  notificationSettings: {
    newPaymentNotification: true,
    partialPaymentNotification: true,
    completedPaymentNotification: true,
    failedPaymentNotification: true,
    reminderSentNotification: true,
    notificationRecipients: 'admin@brightstars.com, finance@brightstars.com'
  },
  paymentMethods: {
    cardPayments: true,
    bankTransfer: true,
    ussd: true,
    mobileMoney: false,
    qrCode: false,
    processingFee: 1.5,
    absorbFees: false
  }
};

export const fallbackSentReminders: SentReminder[] = [
  {
    id: 1,
    title: 'Payment Completion Reminder',
    recipients: 5,
    sentDate: '2024-01-23 14:30',
    sentBy: 'Dr. Sarah Adebayo',
    channels: ['Email', 'SMS'],
    openRate: 80,
    clickRate: 60,
    completionRate: 40,
    status: 'Sent'
  },
  {
    id: 2,
    title: 'Final Payment Notice',
    recipients: 3,
    sentDate: '2024-01-22 10:15',
    sentBy: 'Dr. Sarah Adebayo',
    channels: ['Email'],
    openRate: 100,
    clickRate: 67,
    completionRate: 33,
    status: 'Sent'
  },
  {
    id: 3,
    title: 'Payment Due Reminder',
    recipients: 8,
    sentDate: '2024-01-20 09:45',
    sentBy: 'Mr. John Okafor',
    channels: ['Email', 'SMS'],
    openRate: 75,
    clickRate: 50,
    completionRate: 25,
    status: 'Sent'
  }
];

export const fallbackScheduledReminders: ScheduledReminder[] = [
  {
    id: 1,
    title: 'Weekly Payment Reminder',
    recipients: 'All Partial Payments',
    scheduledDate: '2024-01-28 09:00',
    createdBy: 'Dr. Sarah Adebayo',
    channels: ['Email', 'SMS'],
    status: 'Scheduled',
    recurrence: 'Weekly'
  },
  {
    id: 2,
    title: 'Final Notice Before Expiry',
    recipients: 'Overdue Payments',
    scheduledDate: '2024-01-30 10:00',
    createdBy: 'Dr. Sarah Adebayo',
    channels: ['Email', 'SMS', 'In-App'],
    status: 'Scheduled',
    recurrence: 'One-time'
  }
];

export const fallbackReminderRecipients: ReminderRecipient[] = [
  { id: 1, name: 'Fatima Ibrahim', email: 'fatima@email.com', status: 'Opened', clicked: true, completed: false },
  { id: 2, name: 'Chidi Okafor', email: 'chidi@email.com', status: 'Opened', clicked: true, completed: true },
  { id: 3, name: 'Emeka Nwankwo', email: 'emeka@email.com', status: 'Opened', clicked: false, completed: false },
  { id: 4, name: 'Blessing Eze', email: 'blessing@email.com', status: 'Not Opened', clicked: false, completed: false },
  { id: 5, name: 'Tunde Bakare', email: 'tunde@email.com', status: 'Opened', clicked: true, completed: false }
];

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
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
  tagTypes: [
    'PaymentLinks', 
    'PaymentLink', 
    'Transactions', 
    'PartialPayments', 
    'PaymentAnalytics', 
    'PaymentSettings',
    'SentReminders',
    'ScheduledReminders',
    'ReminderRecipients'
  ],
  endpoints: (builder) => ({
    // Payment Links
    getPaymentLinks: builder.query<PaymentLink[], PaymentFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/payments/links?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: PaymentLink[]) => response,
      transformErrorResponse: (error) => {
        console.error("Payment Links API error:", error);
        // Return fallback data on error
        return fallbackPaymentLinks;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PaymentLinks' as const, id })),
              { type: 'PaymentLinks', id: 'LIST' },
            ]
          : [{ type: 'PaymentLinks', id: 'LIST' }],
    }),
    
    getPaymentLinkById: builder.query<PaymentLink, number>({
      query: (id) => `/payments/links/${id}`,
      // Provide fallback data if the query fails
      transformResponse: (response: PaymentLink) => response,
      transformErrorResponse: (error, { id }) => {
        console.error(`Payment Link ${id} API error:`, error);
        // Return fallback data for this specific payment link
        return fallbackPaymentLinks.find(link => link.id === id) || fallbackPaymentLinks[0];
      },
      providesTags: (result, error, id) => [{ type: 'PaymentLink', id }],
    }),
    
    // Transactions
    getTransactions: builder.query<Transaction[], PaymentFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.paymentLinkId) params.append('paymentLinkId', filters.paymentLinkId.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        return `/payments/transactions?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: Transaction[]) => response,
      transformErrorResponse: (error) => {
        console.error("Transactions API error:", error);
        // Return fallback data on error
        return fallbackTransactions;
      },
      providesTags: [{ type: 'Transactions', id: 'LIST' }],
    }),
    
    getTransactionById: builder.query<Transaction, number>({
      query: (id) => `/payments/transactions/${id}`,
      // Provide fallback data if the query fails
      transformResponse: (response: Transaction) => response,
      transformErrorResponse: (error, { id }) => {
        console.error(`Transaction ${id} API error:`, error);
        // Return fallback data for this specific transaction
        return fallbackTransactions.find(txn => txn.id === id) || fallbackTransactions[0];
      },
      providesTags: (result, error, id) => [{ type: 'Transactions', id }],
    }),
    
    // Partial Payments
    getPartialPayments: builder.query<PartialPayment[], { status?: string; paymentLinkId?: number }>({
      query: ({ status, paymentLinkId }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (paymentLinkId) params.append('paymentLinkId', paymentLinkId.toString());
        
        return `/payments/partial?${params.toString()}`;
      },
      // Provide fallback data if the query fails
      transformResponse: (response: PartialPayment[]) => response,
      transformErrorResponse: (error) => {
        console.error("Partial Payments API error:", error);
        // Return fallback data on error
        return fallbackPartialPayments;
      },
      providesTags: [{ type: 'PartialPayments', id: 'LIST' }],
    }),
    
    // Analytics
    getPaymentAnalytics: builder.query<PaymentAnalytics, { period?: string }>({
      query: ({ period = '30days' }) => `/payments/analytics?period=${period}`,
      // Provide fallback data if the query fails
      transformResponse: (response: PaymentAnalytics) => response,
      transformErrorResponse: (error) => {
        console.error("Payment Analytics API error:", error);
        // Return fallback data on error
        return fallbackPaymentAnalytics;
      },
      providesTags: [{ type: 'PaymentAnalytics', id: 'DATA' }],
    }),
    
    // Settings
    getPaymentSettings: builder.query<PaymentSettingsRequest, void>({
      query: () => '/payments/settings',
      // Provide fallback data if the query fails
      transformResponse: (response: PaymentSettingsRequest) => response,
      transformErrorResponse: (error) => {
        console.error("Payment Settings API error:", error);
        // Return fallback data on error
        return fallbackPaymentSettings;
      },
      providesTags: [{ type: 'PaymentSettings', id: 'DATA' }],
    }),
    
    // Reminders
    getSentReminders: builder.query<SentReminder[], void>({
      query: () => '/payments/reminders/sent',
      // Provide fallback data if the query fails
      transformResponse: (response: SentReminder[]) => response,
      transformErrorResponse: (error) => {
        console.error("Sent Reminders API error:", error);
        // Return fallback data on error
        return fallbackSentReminders;
      },
      providesTags: [{ type: 'SentReminders', id: 'LIST' }],
    }),
    
    getScheduledReminders: builder.query<ScheduledReminder[], void>({
      query: () => '/payments/reminders/scheduled',
      // Provide fallback data if the query fails
      transformResponse: (response: ScheduledReminder[]) => response,
      transformErrorResponse: (error) => {
        console.error("Scheduled Reminders API error:", error);
        // Return fallback data on error
        return fallbackScheduledReminders;
      },
      providesTags: [{ type: 'ScheduledReminders', id: 'LIST' }],
    }),
    
    getReminderRecipients: builder.query<ReminderRecipient[], number>({
      query: (reminderId) => `/payments/reminders/${reminderId}/recipients`,
      // Provide fallback data if the query fails
      transformResponse: (response: ReminderRecipient[]) => response,
      transformErrorResponse: (error) => {
        console.error("Reminder Recipients API error:", error);
        // Return fallback data on error
        return fallbackReminderRecipients;
      },
      providesTags: (result, error, id) => [{ type: 'ReminderRecipients', id }],
    }),
    
    getReminderById: builder.query<SentReminder, number>({
      query: (id) => `/payments/reminders/${id}`,
      // Provide fallback data if the query fails
      transformResponse: (response: SentReminder) => response,
      transformErrorResponse: (error, { id }) => {
        console.error(`Reminder ${id} API error:`, error);
        // Return fallback data for this specific reminder
        return fallbackSentReminders.find(reminder => reminder.id === id) || fallbackSentReminders[0];
      },
      providesTags: (result, error, id) => [{ type: 'SentReminders', id }],
    }),
    
    // Mutations
    createPaymentLink: builder.mutation<PaymentLink, CreatePaymentLinkRequest>({
      query: (data) => ({
        url: '/payments/links',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'PaymentLinks', id: 'LIST' }],
    }),
    
    updatePaymentLink: builder.mutation<PaymentLink, UpdatePaymentLinkRequest>({
      query: ({ id, ...data }) => ({
        url: `/payments/links/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PaymentLinks', id: 'LIST' },
        { type: 'PaymentLink', id },
      ],
    }),
    
    deletePaymentLink: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/payments/links/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'PaymentLinks', id: 'LIST' }],
    }),
    
    togglePaymentLinkStatus: builder.mutation<{ success: boolean }, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/payments/links/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PaymentLinks', id: 'LIST' },
        { type: 'PaymentLink', id },
      ],
    }),
    
    sendReminders: builder.mutation<{ success: boolean }, SendReminderRequest>({
      query: (data) => ({
        url: '/payments/reminders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'SentReminders', id: 'LIST' },
        { type: 'PartialPayments', id: 'LIST' }
      ],
    }),
    
    updatePaymentSettings: builder.mutation<{ success: boolean }, PaymentSettingsRequest>({
      query: (data) => ({
        url: '/payments/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'PaymentSettings', id: 'DATA' }],
    }),
    
    resendReminder: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/payments/reminders/${id}/resend`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'SentReminders', id: 'LIST' }],
    }),
    
    cancelScheduledReminder: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/payments/reminders/scheduled/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ScheduledReminders', id: 'LIST' }],
    }),
    
    sendReceipt: builder.mutation<{ success: boolean }, { transactionId: number; email?: string; includeDetails?: boolean; message?: string }>({
      query: (data) => ({
        url: '/payments/transactions/send-receipt',
        method: 'POST',
        body: data,
      }),
    }),
    
    exportTransactions: builder.mutation<{ url: string }, { format: string; filters?: PaymentFilters }>({
      query: (data) => ({
        url: '/payments/transactions/export',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  // Queries
  useGetPaymentLinksQuery,
  useGetPaymentLinkByIdQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetPartialPaymentsQuery,
  useGetPaymentAnalyticsQuery,
  useGetPaymentSettingsQuery,
  useGetSentRemindersQuery,
  useGetScheduledRemindersQuery,
  useGetReminderRecipientsQuery,
  useGetReminderByIdQuery,
  
  // Mutations
  useCreatePaymentLinkMutation,
  useUpdatePaymentLinkMutation,
  useDeletePaymentLinkMutation,
  useTogglePaymentLinkStatusMutation,
  useSendRemindersMutation,
  useUpdatePaymentSettingsMutation,
  useResendReminderMutation,
  useCancelScheduledReminderMutation,
  useSendReceiptMutation,
  useExportTransactionsMutation,
} = paymentsApi;