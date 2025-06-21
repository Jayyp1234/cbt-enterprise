import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Users, CreditCard, BarChart3, Settings, 
  Plus, UserPlus, DollarSign, Calendar, 
  TrendingUp, Award, BookOpen, Shield, Globe,
  Crown, Link, Wallet, ArrowUpRight,
  ArrowDownLeft, Activity, Target, Zap
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { useGetDashboardDataQuery } from '../../store/services/dashboardApi';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showCreatePaymentLinkModal, setShowCreatePaymentLinkModal] = useState(false);

  // Fetch dashboard data using RTK Query
  const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery();

  // Mock data for the enterprise (fallback if API fails)
  const enterpriseData = dashboardData?.stats || {
    name: "Brightstars Tutorial Center",
    subdomain: "brightstars.cbtgrinder.com",
    plan: "Enterprise Pro",
    studentsLimit: 500,
    currentStudents: 342,
    staff: 12,
    revenue: 2450000, // in Naira
    walletBalance: 450000,
    pendingPayments: 125000,
  };

  const quickStats = [
    { 
      label: 'Total Students', 
      value: enterpriseData.currentStudents, 
      max: enterpriseData.studentsLimit,
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      trend: '+12%'
    },
    { 
      label: 'Active Staff', 
      value: enterpriseData.staff, 
      icon: Shield, 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      trend: '+2'
    },
    { 
      label: 'Monthly Revenue', 
      value: `₦${(enterpriseData.revenue / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100',
      trend: '+18%'
    },
    { 
      label: 'Wallet Balance', 
      value: `₦${(enterpriseData.walletBalance / 1000).toFixed(0)}K`, 
      icon: Wallet, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100',
      trend: '+5%'
    },
  ];

  const recentStudents = dashboardData?.recentStudents || [
    { id: 1, name: 'Adebayo Johnson', email: 'adebayo@email.com', class: 'SS3', status: 'Active', joinDate: '2024-01-15', lastActive: '2 hours ago' },
    { id: 2, name: 'Fatima Ibrahim', email: 'fatima@email.com', class: 'SS2', status: 'Active', joinDate: '2024-01-14', lastActive: '1 day ago' },
    { id: 3, name: 'Chidi Okafor', email: 'chidi@email.com', class: 'SS3', status: 'Inactive', joinDate: '2024-01-12', lastActive: '1 week ago' },
    { id: 4, name: 'Aisha Mohammed', email: 'aisha@email.com', class: 'SS1', status: 'Active', joinDate: '2024-01-10', lastActive: '3 hours ago' },
  ];

  const paymentLinks = dashboardData?.paymentLinks || [
    { 
      id: 1, 
      title: 'JAMB Preparation Course', 
      amount: 25000, 
      collected: 18, 
      totalAmount: 450000,
      status: 'Active',
      created: '2024-01-10',
      expires: '2024-03-10'
    },
    { 
      id: 2, 
      title: 'WAEC Tutorial Package', 
      amount: 35000, 
      collected: 12, 
      totalAmount: 420000,
      status: 'Active',
      created: '2024-01-08',
      expires: '2024-04-08'
    },
    { 
      id: 3, 
      title: 'Mathematics Intensive', 
      amount: 15000, 
      collected: 25, 
      totalAmount: 375000,
      status: 'Completed',
      created: '2023-12-15',
      expires: '2024-02-15'
    },
  ];

  const performanceData = dashboardData?.performanceData || [
    { subject: 'Mathematics', avgScore: 78, students: 156, improvement: '+5%' },
    { subject: 'English', avgScore: 82, students: 189, improvement: '+3%' },
    { subject: 'Physics', avgScore: 74, students: 134, improvement: '+8%' },
    { subject: 'Chemistry', avgScore: 71, students: 142, improvement: '+2%' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard data fetch error:', error);
    // Continue with mock data, already set as fallback
  }

  return (
    <div className="space-y-6">
      {/* Enterprise Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold mb-2">{enterpriseData.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-indigo-100">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{enterpriseData.subdomain}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span className="text-sm">{enterpriseData.plan}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{enterpriseData.currentStudents}/{enterpriseData.studentsLimit} Students</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowCreateStudentModal(true)}
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
            <Button 
              onClick={() => setShowCreatePaymentLinkModal(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30"
            >
              <Link className="w-4 h-4 mr-2" />
              Payment Link
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-dark">{stat.value}</div>
                <div className="text-sm text-green-600 font-medium">{stat.trend}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              {stat.max && (
                <ProgressBar 
                  progress={(typeof stat.value === 'number' ? stat.value : 0) / stat.max * 100} 
                  color="primary"
                />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Students', icon: Users, path: '/students', color: 'bg-blue-500' },
          { label: 'Staff', icon: Shield, path: '/staff', color: 'bg-green-500' },
          { label: 'Payments', icon: CreditCard, path: '/payments', color: 'bg-purple-500' },
          { label: 'Analytics', icon: BarChart3, path: '/analytics', color: 'bg-orange-500' },
          { label: 'Features', icon: Zap, path: '/features', color: 'bg-yellow-500' },
          { label: 'Settings', icon: Settings, path: '/settings', color: 'bg-gray-500' },
        ].map((item, index) => (
          <Card 
            key={index} 
            hover 
            onClick={() => navigate(item.path)}
            className="p-4 cursor-pointer text-center"
          >
            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-medium text-dark text-sm">{item.label}</h3>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark mb-4">Recent Students</h3>
          <div className="space-y-3">
            {recentStudents.slice(0, 4).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-dark">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.class} • {student.lastActive}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {student.status}
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/students')}>
            View All Students
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark mb-4">Performance Overview</h3>
          <div className="space-y-4">
            {performanceData.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{subject.subject}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-dark">{subject.avgScore}%</span>
                    <span className="text-xs text-green-600">{subject.improvement}</span>
                  </div>
                </div>
                <ProgressBar progress={subject.avgScore} color="primary" />
                <div className="text-xs text-gray-500 mt-1">{subject.students} students</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payment Links Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-dark">Active Payment Links</h3>
          <Button variant="outline" onClick={() => navigate('/payments')}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentLinks.filter(link => link.status === 'Active').map((link) => (
            <div key={link.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h4 className="font-bold text-dark mb-2">{link.title}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-green-600">₦{link.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collected:</span>
                  <span className="font-bold text-dark">{link.collected} payments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-green-600">₦{link.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;