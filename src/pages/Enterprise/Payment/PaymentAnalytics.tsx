import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Calendar, Download, Filter, Eye, Target,
  Clock, Award, BookOpen, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import { 
  useGetPaymentAnalyticsQuery,
  useExportTransactionsMutation
} from '../../../store/services/paymentsApi';

const PaymentAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Fetch payment analytics using RTK Query
  const { 
    data: analytics, 
    isLoading, 
    error 
  } = useGetPaymentAnalyticsQuery({ period: selectedPeriod });

  // Export report mutation
  const [exportTransactions, { isLoading: isExporting }] = useExportTransactionsMutation();

  const handleExportReport = async () => {
    try {
      const result = await exportTransactions({
        format: 'csv',
        filters: {
          // Add any filters here
        }
      }).unwrap();
      
      // Open the exported file URL
      window.open(result.url, '_blank');
    } catch (error) {
      console.error('Failed to export report:', error);
      // Show error message
    }
  };

  // Key metrics for the dashboard
  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: '₦2.45M',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Transactions',
      value: '375',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Avg. Transaction',
      value: '₦25,500',
      change: '+5%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Completion Rate',
      value: '78%',
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton width={100} height={36} />
            <div>
              <Skeleton width={300} height={32} className="mb-2" />
              <Skeleton width={200} height={20} />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton width={150} height={36} />
            <Skeleton width={150} height={36} />
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
  if (error) {
    console.error('Payment Analytics API error:', error);
    // Continue with fallback data, already set in the API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/payments')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Payment Analytics</h1>
            <p className="text-gray-600">Insights and trends for your payment activities</p>
          </div>
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
        {keyMetrics.map((metric, index) => {
          const MetricIcon = metric.icon;
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
              <option value="transactions">Transactions</option>
              <option value="students">Students</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.revenueData}>
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

      {/* Payment Methods and Link Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark mb-6">Payment Methods Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {analytics?.paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily Transactions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark mb-6">Daily Transaction Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.dailyTransactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                <Bar dataKey="partial" stackId="a" fill="#F59E0B" name="Partial" />
                <Bar dataKey="failed" stackId="a" fill="#EF4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Partial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Failed</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Link Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Payment Link Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics?.paymentLinkPerformance.map((link, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{link.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">₦{link.revenue.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.transactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{link.completion}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            link.completion >= 80 ? 'bg-green-500' : 
                            link.completion >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${link.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index % 2 === 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${index % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {index % 2 === 0 ? '+' : '-'}{Math.floor(Math.random() * 10) + 1}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Partial Payments Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Partial Payments Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-yellow-800">Pending Amount</h4>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-700 mb-1">₦137,500</div>
            <div className="text-sm text-yellow-600">From 16 partial payments</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-800">Conversion Rate</h4>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">65%</div>
            <div className="text-sm text-blue-600">Of partial payments completed</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-800">Average Time to Complete</h4>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700 mb-1">5.2 days</div>
            <div className="text-sm text-green-600">From first payment to completion</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper function to get CheckCircle component
const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default PaymentAnalytics;