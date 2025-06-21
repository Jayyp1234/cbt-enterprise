import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Calendar, Download, Filter, Eye, Target,
  Clock, Award, BookOpen, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { 
  useGetAnalyticsDataQuery,
  useGetRevenueDataQuery,
  useGetStudentPerformanceQuery,
  useGetPaymentMethodDataQuery,
  useExportAnalyticsReportMutation,
  fallbackAnalyticsData
} from '../../store/services/analyticsApi';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Fetch analytics data using RTK Query
  const { 
    data: analyticsData = fallbackAnalyticsData, 
    isLoading: isLoadingAnalytics, 
    error: analyticsError 
  } = useGetAnalyticsDataQuery({ period: selectedPeriod });

  // Fetch revenue data
  const { 
    data: revenueData = fallbackAnalyticsData.revenueData, 
    isLoading: isLoadingRevenue 
  } = useGetRevenueDataQuery({ period: selectedPeriod });

  // Fetch student performance data
  const { 
    data: studentPerformance = fallbackAnalyticsData.studentPerformance, 
    isLoading: isLoadingPerformance 
  } = useGetStudentPerformanceQuery();

  // Fetch payment method data
  const { 
    data: paymentMethodData = fallbackAnalyticsData.paymentMethodData, 
    isLoading: isLoadingPaymentMethods 
  } = useGetPaymentMethodDataQuery();

  // Export report mutation
  const [exportReport, { isLoading: isExporting }] = useExportAnalyticsReportMutation();

  const handleExportReport = async () => {
    try {
      const result = await exportReport({
        format: 'pdf',
        data: 'all',
        period: selectedPeriod
      }).unwrap();
      
      // Open the exported report URL
      window.open(result.url, '_blank');
    } catch (error) {
      console.error('Failed to export report:', error);
      // Show error message
    }
  };

  // Loading state
  if (isLoadingAnalytics && isLoadingRevenue && isLoadingPerformance && isLoadingPaymentMethods) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton width={300} height={32} className="mb-2" />
            <Skeleton width={400} height={20} />
          </div>
          <div className="flex space-x-2">
            <Skeleton width={150} height={40} />
            <Skeleton width={150} height={40} />
          </div>
        </div>

        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton width={48} height={48} variant="rectangular" className="rounded-lg" />
                  <div>
                    <Skeleton width={80} height={32} className="mb-1" />
                    <Skeleton width={60} height={16} />
                  </div>
                </div>
                <Skeleton width={60} height={24} />
              </div>
              <Skeleton width={100} height={16} className="mt-4" />
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton width={200} height={24} />
            <Skeleton width={150} height={36} />
          </div>
          <Skeleton height={320} className="rounded-lg" />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton width={200} height={24} className="mb-6" />
            <Skeleton height={256} className="rounded-lg" />
          </Card>
          <Card className="p-6">
            <Skeleton width={200} height={24} className="mb-6" />
            <Skeleton height={256} className="rounded-lg" />
          </Card>
        </div>
      </div>
    );
  }

  // Error state - use fallback data
  if (analyticsError) {
    console.error('Analytics API error:', analyticsError);
    // Continue with fallback data, already set in the API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your institution's performance</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.keyMetrics.map((metric, index) => {
          const MetricIcon = getIconComponent(metric.icon);
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${metric.bg}`}>
                  <MetricIcon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-dark">{metric.value}</div>
                  <div className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revenue Analytics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-dark">Revenue Analytics</h3>
          <div className="flex space-x-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="revenue">Revenue</option>
              <option value="students">New Students</option>
              <option value="payments">Payments</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  selectedMetric === 'revenue' ? `₦${value.toLocaleString()}` : value,
                  name
                ]}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#0047FF" 
                strokeWidth={3}
                dot={{ fill: '#0047FF', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Performance and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark mb-6">Student Performance by Subject</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#0047FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark mb-6">Payment Methods Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Engagement Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Student Engagement</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="logins" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" fill="#0047FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Daily Logins</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Study Sessions</span>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics Table */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Detailed Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Improvement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformance.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subject.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{subject.avgScore}%</span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            subject.avgScore >= 80 ? 'bg-green-500' : 
                            subject.avgScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${subject.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.round(Math.random() * 20 + 75)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      {subject.improvement}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Helper function to get icon component by name
const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.FC<any>> = {
    DollarSign, Users, Target, Activity, BarChart3, TrendingUp, Clock, Award
  };
  return icons[iconName] || Activity;
};

export default Analytics;