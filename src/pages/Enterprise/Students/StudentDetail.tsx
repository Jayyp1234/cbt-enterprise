import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, Mail, Phone, Calendar, 
  MapPin, User, BookOpen, TrendingUp, Clock,
  CheckCircle, XCircle, AlertTriangle, MoreHorizontal,
  Download, Send, Ban, RefreshCw,Plus
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ProgressBar from '../../../components/ui/ProgressBar';
import { 
  useGetStudentByIdQuery, 
  useGetStudentPerformanceQuery,
  useGetStudentActivitiesQuery,
  useGetStudentPaymentsQuery
} from '../../../store/services/studentsApi';

const StudentDetail: React.FC = () => {
  const { id } = useParams();
  const studentId = parseInt(id || '1');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch student data using RTK Query
  const { 
    data: student, 
    isLoading: isLoadingStudent, 
    error: studentError 
  } = useGetStudentByIdQuery(studentId);

  // Fetch performance data
  const { 
    data: performanceData, 
    isLoading: isLoadingPerformance 
  } = useGetStudentPerformanceQuery(studentId, {
    skip: activeTab !== 'performance'
  });

  // Fetch activities
  const { 
    data: activities, 
    isLoading: isLoadingActivities 
  } = useGetStudentActivitiesQuery(studentId, {
    skip: activeTab !== 'activities'
  });

  // Fetch payments
  const { 
    data: payments, 
    isLoading: isLoadingPayments 
  } = useGetStudentPaymentsQuery(studentId, {
    skip: activeTab !== 'payments'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-yellow-600 bg-yellow-100';
      case 'Suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoadingStudent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (studentError || !student) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-red-500 text-3xl">⚠️</div>
          <div>
            <h3 className="font-bold text-red-700 text-lg">Error Loading Student Details</h3>
            <p className="text-red-600">
              There was a problem loading the student details. Please try again later.
            </p>
            <Button 
              variant="outline" 
              className="mt-3 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/students')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/students')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">{student.name}</h1>
            <p className="text-gray-600">Student ID: {student.studentId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" onClick={() => navigate(`/students/${id}/edit`)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Student
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{student.address}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Academic Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Class: {student.class}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Joined: {student.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Last Active: {student.lastActive}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Status</h3>
                <div className="space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(student.paymentStatus)}`}>
                    {student.paymentStatus}
                  </span>
                  <div className="text-sm text-gray-600">
                    Performance: {student.performance}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'performance', label: 'Performance' },
          { id: 'activities', label: 'Activities' },
          { id: 'payments', label: 'Payments' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-primary-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{student.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{student.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student ID:</span>
                <span className="font-medium">{student.studentId}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Parent/Guardian Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{student.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{student.parentEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{student.parentPhone}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {isLoadingPerformance ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading performance data...</p>
              </div>
            </div>
          ) : (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-dark mb-4">Subject Performance</h3>
              <div className="space-y-4">
                {performanceData?.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-dark">{subject.subject}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-dark">{subject.score}%</span>
                        <span className={`text-sm font-medium ${getTrendColor(subject.trend)}`}>
                          {subject.trend}
                        </span>
                      </div>
                    </div>
                    <ProgressBar progress={subject.score} color="primary" />
                    <div className="text-xs text-gray-500 mt-2">
                      Last test: {subject.lastTest}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-6">
          {isLoadingActivities ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading activity data...</p>
              </div>
            </div>
          ) : (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-dark mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {activities?.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-dark">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          {isLoadingPayments ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading payment data...</p>
              </div>
            </div>
          ) : payments && payments.length > 0 ? (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-dark mb-4">Payment History</h3>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-green-800">{payment.title}</h4>
                        <p className="text-sm text-green-600">Paid on {payment.date}</p>
                      </div>
                      <span className="font-bold text-green-800">₦{payment.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Payment Records</h3>
                <p className="text-gray-500 mb-4">
                  This student doesn't have any payment records yet.
                </p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDetail;