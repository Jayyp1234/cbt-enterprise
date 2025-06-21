import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Shield, Key, Users, BookOpen,
  Settings, DollarSign, BarChart3, Mail, Bell,
  CheckCircle, XCircle, AlertTriangle, Info
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const StaffPermissions: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock staff data
  const staff = {
    id: parseInt(id || '1'),
    name: 'Dr. Sarah Adebayo',
    role: 'Principal',
    email: 'sarah@brightstars.com'
  };

  const [permissions, setPermissions] = useState({
    // Student Management
    'view_students': true,
    'create_students': true,
    'edit_students': true,
    'delete_students': true,
    'export_students': true,
    
    // Staff Management
    'view_staff': true,
    'create_staff': true,
    'edit_staff': true,
    'delete_staff': false,
    'manage_staff_permissions': true,
    
    // Academic Management
    'view_content': true,
    'create_content': true,
    'edit_content': true,
    'delete_content': true,
    'manage_exams': true,
    'grade_exams': true,
    
    // Financial Management
    'view_payments': true,
    'create_payment_links': true,
    'process_payments': true,
    'view_financial_reports': true,
    'manage_billing': false,
    
    // Analytics & Reports
    'view_analytics': true,
    'export_reports': true,
    'view_performance_data': true,
    'access_detailed_analytics': true,
    
    // Communication
    'send_messages': true,
    'send_notifications': true,
    'manage_announcements': true,
    'access_communication_logs': true,
    
    // System Administration
    'system_settings': true,
    'user_management': true,
    'feature_management': true,
    'security_settings': false,
    'backup_restore': false
  });

  const [hasChanges, setHasChanges] = useState(false);

  const permissionCategories = [
    {
      id: 'students',
      name: 'Student Management',
      description: 'Permissions related to student accounts and data',
      icon: Users,
      color: 'bg-blue-500',
      permissions: [
        { id: 'view_students', name: 'View Students', description: 'View student profiles and information' },
        { id: 'create_students', name: 'Create Students', description: 'Add new student accounts' },
        { id: 'edit_students', name: 'Edit Students', description: 'Modify student information' },
        { id: 'delete_students', name: 'Delete Students', description: 'Remove student accounts' },
        { id: 'export_students', name: 'Export Student Data', description: 'Export student information to files' }
      ]
    },
    {
      id: 'staff',
      name: 'Staff Management',
      description: 'Permissions for managing staff members',
      icon: Shield,
      color: 'bg-green-500',
      permissions: [
        { id: 'view_staff', name: 'View Staff', description: 'View staff profiles and information' },
        { id: 'create_staff', name: 'Create Staff', description: 'Add new staff members' },
        { id: 'edit_staff', name: 'Edit Staff', description: 'Modify staff information' },
        { id: 'delete_staff', name: 'Delete Staff', description: 'Remove staff accounts' },
        { id: 'manage_staff_permissions', name: 'Manage Permissions', description: 'Assign and modify staff permissions' }
      ]
    },
    {
      id: 'academic',
      name: 'Academic Management',
      description: 'Content, exams, and academic operations',
      icon: BookOpen,
      color: 'bg-purple-500',
      permissions: [
        { id: 'view_content', name: 'View Content', description: 'Access study materials and content' },
        { id: 'create_content', name: 'Create Content', description: 'Upload and create new content' },
        { id: 'edit_content', name: 'Edit Content', description: 'Modify existing content' },
        { id: 'delete_content', name: 'Delete Content', description: 'Remove content from system' },
        { id: 'manage_exams', name: 'Manage Exams', description: 'Create and manage examinations' },
        { id: 'grade_exams', name: 'Grade Exams', description: 'Grade and review exam submissions' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Management',
      description: 'Payment processing and financial operations',
      icon: DollarSign,
      color: 'bg-yellow-500',
      permissions: [
        { id: 'view_payments', name: 'View Payments', description: 'View payment transactions and history' },
        { id: 'create_payment_links', name: 'Create Payment Links', description: 'Generate payment links for students' },
        { id: 'process_payments', name: 'Process Payments', description: 'Handle payment processing and confirmations' },
        { id: 'view_financial_reports', name: 'Financial Reports', description: 'Access financial reports and summaries' },
        { id: 'manage_billing', name: 'Manage Billing', description: 'Handle subscription and billing management' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics & Reports',
      description: 'Data analysis and reporting capabilities',
      icon: BarChart3,
      color: 'bg-indigo-500',
      permissions: [
        { id: 'view_analytics', name: 'View Analytics', description: 'Access basic analytics dashboard' },
        { id: 'export_reports', name: 'Export Reports', description: 'Export reports and data' },
        { id: 'view_performance_data', name: 'Performance Data', description: 'View student and staff performance metrics' },
        { id: 'access_detailed_analytics', name: 'Detailed Analytics', description: 'Access advanced analytics and insights' }
      ]
    },
    {
      id: 'communication',
      name: 'Communication',
      description: 'Messaging and notification permissions',
      icon: Mail,
      color: 'bg-orange-500',
      permissions: [
        { id: 'send_messages', name: 'Send Messages', description: 'Send direct messages to users' },
        { id: 'send_notifications', name: 'Send Notifications', description: 'Send system notifications' },
        { id: 'manage_announcements', name: 'Manage Announcements', description: 'Create and manage announcements' },
        { id: 'access_communication_logs', name: 'Communication Logs', description: 'View communication history and logs' }
      ]
    },
    {
      id: 'system',
      name: 'System Administration',
      description: 'System-level configuration and management',
      icon: Settings,
      color: 'bg-red-500',
      permissions: [
        { id: 'system_settings', name: 'System Settings', description: 'Modify system configuration' },
        { id: 'user_management', name: 'User Management', description: 'Manage user accounts and roles' },
        { id: 'feature_management', name: 'Feature Management', description: 'Enable/disable system features' },
        { id: 'security_settings', name: 'Security Settings', description: 'Manage security configurations' },
        { id: 'backup_restore', name: 'Backup & Restore', description: 'Perform system backup and restore operations' }
      ]
    }
  ];

  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId as keyof typeof prev]
    }));
    setHasChanges(true);
  };

  const handleCategoryToggle = (categoryPermissions: string[], enable: boolean) => {
    const updates: any = {};
    categoryPermissions.forEach(permId => {
      updates[permId] = enable;
    });
    
    setPermissions(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save permissions logic here
    console.log('Saving permissions for staff:', staff.id, permissions);
    setHasChanges(false);
    // Show success message
  };

  const getPermissionCount = (categoryPermissions: string[]) => {
    return categoryPermissions.filter(permId => permissions[permId as keyof typeof permissions]).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(`/staff/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Manage Permissions</h1>
            <p className="text-gray-600">{staff.name} • {staff.role}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/staff/${id}`)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={hasChanges ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Permissions
          </Button>
        </div>
      </div>

      {/* Staff Info */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {staff.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark">{staff.name}</h2>
            <p className="text-indigo-600 font-medium">{staff.role}</p>
            <p className="text-gray-600">{staff.email}</p>
          </div>
        </div>
      </Card>

      {/* Permission Categories */}
      <div className="space-y-6">
        {permissionCategories.map((category) => {
          const categoryPermissionIds = category.permissions.map(p => p.id);
          const enabledCount = getPermissionCount(categoryPermissionIds);
          const totalCount = categoryPermissionIds.length;
          
          return (
            <Card key={category.id} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${category.color} rounded-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {enabledCount} of {totalCount} permissions enabled
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCategoryToggle(categoryPermissionIds, true)}
                  >
                    Enable All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCategoryToggle(categoryPermissionIds, false)}
                  >
                    Disable All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.permissions.map((permission) => {
                  const isEnabled = permissions[permission.id as keyof typeof permissions];
                  
                  return (
                    <div 
                      key={permission.id}
                      className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                        isEnabled 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                      onClick={() => handlePermissionToggle(permission.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isEnabled ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {isEnabled ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className={`font-medium ${
                                isEnabled ? 'text-green-800' : 'text-gray-600'
                              }`}>
                                {permission.name}
                              </h4>
                              <p className={`text-sm ${
                                isEnabled ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isEnabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Permission Summary */}
      <Card className="p-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Permission Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {permissionCategories.map((category) => {
                const categoryPermissionIds = category.permissions.map(p => p.id);
                const enabledCount = getPermissionCount(categoryPermissionIds);
                const totalCount = categoryPermissionIds.length;
                
                return (
                  <div key={category.id} className="text-blue-700">
                    <div className="font-medium">{category.name}</div>
                    <div>{enabledCount}/{totalCount} enabled</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-blue-700">
              <strong>Total Permissions: </strong>
              {Object.values(permissions).filter(Boolean).length} of {Object.keys(permissions).length} enabled
            </div>
          </div>
        </div>
      </Card>

      {/* Warning for High-Risk Permissions */}
      {(permissions.delete_students || permissions.delete_staff || permissions.security_settings || permissions.backup_restore) && (
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">High-Risk Permissions Enabled</h4>
              <p className="text-yellow-700 text-sm">
                This staff member has been granted permissions that can significantly impact the system. 
                Please ensure they understand the responsibility that comes with these permissions.
              </p>
              <div className="mt-2 text-yellow-700 text-sm">
                <strong>High-risk permissions:</strong>
                <ul className="list-disc list-inside mt-1">
                  {permissions.delete_students && <li>Delete Students</li>}
                  {permissions.delete_staff && <li>Delete Staff</li>}
                  {permissions.security_settings && <li>Security Settings</li>}
                  {permissions.backup_restore && <li>Backup & Restore</li>}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StaffPermissions;