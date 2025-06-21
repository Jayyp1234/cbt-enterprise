import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, Mail, Phone, Calendar, 
  MapPin, User, BookOpen, TrendingUp, Clock,
  CheckCircle, XCircle, AlertTriangle, MoreHorizontal,
  Download, Send, Ban, RefreshCw, Shield, Key,
  DollarSign, Award, Activity, Users, Settings
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ProgressBar from '../../../components/ui/ProgressBar';
import { 
  useGetStaffByIdQuery, 
  useGetStaffPerformanceQuery,
  useGetStaffScheduleQuery,
  useGetStaffActivitiesQuery
} from '../../../store/services/staffApi';

const StaffDetail: React.FC = () => {
  const { id } = useParams();
  const staffId = parseInt(id || '1');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch staff data using RTK Query
  const { 
    data: staff, 
    isLoading: isLoadingStaff, 
    error: staffError 
  } = useGetStaffByIdQuery(staffId);

  // Fetch performance metrics
  const { 
    data: performanceMetrics, 
    isLoading: isLoadingPerformance 
  } = useGetStaffPerformanceQuery(staffId, {
    skip: activeTab !== 'performance'
  });

  // Fetch teaching schedule
  const { 
    data: teachingSchedule, 
    isLoading: isLoadingSchedule 
  } = useGetStaffScheduleQuery(staffId, {
    skip: activeTab !== 'schedule'
  });

  // Fetch activities
  const { 
    data: activities, 
    isLoading: isLoadingActivities 
  } = useGetStaffActivitiesQuery(staffId, {
    skip: activeTab !== 'activities'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-yellow-600 bg-yellow-100';
      case 'Suspended': return 'text-red-600 bg-red-100';
      case 'On Leave': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Principal': return 'text-purple-600 bg-purple-100';
      case 'Vice Principal': return 'text-indigo-600 bg-indigo-100';
      case 'Instructor': return 'text-blue-600 bg-blue-100';
      case 'Supervisor': return 'text-green-600 bg-green-100';
      case 'Admin Staff': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoadingStaff) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff details...</p>
        </div>
      </div>
    );
  }

  if (staffError || !staff) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-red-500 text-3xl">⚠️</div>
          <div>
            <h3 className="font-bold text-red-700 text-lg">Error Loading Staff Details</h3>
            <p className="text-red-600">
              There was a problem loading the staff details. Please try again later.
            </p>
            <Button 
              variant="outline" 
              className="mt-3 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/staff')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Staff List
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
          <Button variant="ghost" onClick={() => navigate('/staff')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">{staff.name}</h1>
            <p className="text-gray-600">Employee ID: {staff.employeeId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" onClick={() => navigate(`/staff/${id}/edit`)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Staff
          </Button>
          <Button variant="outline" onClick={() => navigate(`/staff/${id}/permissions`)}>
            <Key className="w-4 h-4 mr-2" />
            Permissions
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Staff Info Card */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
            {staff.avatar}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{staff.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{staff.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{staff.address}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Employment Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Department: {staff.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Joined: {staff.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Last Active: {staff.lastLogin}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Salary: ₦{staff.salary.toLocaleString()}/month</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Status & Role</h3>
                <div className="space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(staff.status)}`}>
                    {staff.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(staff.role)}`}>
                    {staff.role}
                  </span>
                  <div className="text-sm text-gray-600">
                    Subjects: {staff.subjects.join(', ')}
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
          { id: 'schedule', label: 'Schedule' },
          { id: 'activities', label: 'Activities' },
          { id: 'documents', label: 'Documents' },
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
                <span className="font-medium">{staff.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{staff.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{staff.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Employee ID:</span>
                <span className="font-medium">{staff.employeeId}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{staff.emergencyContact.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{staff.emergencyContact.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Relationship:</span>
                <span className="font-medium">{staff.emergencyContact.relationship}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Qualifications</h3>
            <div className="space-y-2">
              {staff.qualifications.map((qualification, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Award className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{qualification}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Certifications</h3>
            <div className="space-y-2">
              {staff.certifications.map((certification, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{certification}</span>
                </div>
              ))}
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
              <h3 className="text-lg font-bold text-dark mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceMetrics?.map((metric, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-dark">{metric.metric}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-dark">{metric.score}%</span>
                        <span className={`text-sm font-medium ${metric.color}`}>
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                    <ProgressBar progress={metric.score} color="primary" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Monthly Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">28</div>
                <div className="text-sm text-blue-600">Classes Taught</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-green-600">Students Managed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-purple-600">Reports Generated</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {isLoadingSchedule ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading schedule data...</p>
              </div>
            </div>
          ) : (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-dark mb-4">Teaching Schedule</h3>
              <div className="space-y-3">
                {teachingSchedule?.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 text-center">
                        <div className="font-medium text-dark">{schedule.day}</div>
                      </div>
                      <div>
                        <div className="font-medium text-dark">{schedule.subject}</div>
                        <div className="text-sm text-gray-600">{schedule.class}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{schedule.time}</div>
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

      {activeTab === 'documents' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Documents & Files</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-dark">Employment Contract</h4>
                    <p className="text-sm text-gray-600">Uploaded on {staff.joinDate}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-dark">Academic Certificates</h4>
                    <p className="text-sm text-gray-600">Last updated 2 months ago</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-dark">Performance Reviews</h4>
                    <p className="text-sm text-gray-600">Annual review documents</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffDetail;