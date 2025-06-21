import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Upload, Users, Mail, 
  MessageCircle, Ban, CheckCircle, AlertTriangle,
  FileText, Send, UserX, RefreshCw, Shield,
  DollarSign, Calendar, Award, Settings
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

const StaffBulkActions: React.FC = () => {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStaff] = useState([
    { id: 1, name: 'Dr. Sarah Adebayo', email: 'sarah@brightstars.com', role: 'Principal', department: 'Administration' },
    { id: 2, name: 'Mr. John Okafor', email: 'john@brightstars.com', role: 'Instructor', department: 'Academic' },
    { id: 3, name: 'Mrs. Fatima Hassan', email: 'fatima@brightstars.com', role: 'Supervisor', department: 'Academic' },
  ]);

  const bulkActions = [
    {
      id: 'send_message',
      title: 'Send Message',
      description: 'Send a message to selected staff members',
      icon: MessageCircle,
      color: 'bg-blue-500',
      action: () => setActiveAction('message')
    },
    {
      id: 'send_email',
      title: 'Send Email',
      description: 'Send an email to selected staff members',
      icon: Mail,
      color: 'bg-green-500',
      action: () => setActiveAction('email')
    },
    {
      id: 'export_data',
      title: 'Export Data',
      description: 'Export staff data to CSV/Excel',
      icon: Download,
      color: 'bg-purple-500',
      action: () => setActiveAction('export')
    },
    {
      id: 'update_department',
      title: 'Update Department',
      description: 'Move staff to a different department',
      icon: Users,
      color: 'bg-orange-500',
      action: () => setActiveAction('update_department')
    },
    {
      id: 'update_permissions',
      title: 'Update Permissions',
      description: 'Modify permissions for selected staff',
      icon: Shield,
      color: 'bg-indigo-500',
      action: () => setActiveAction('update_permissions')
    },
    {
      id: 'salary_adjustment',
      title: 'Salary Adjustment',
      description: 'Apply salary changes to selected staff',
      icon: DollarSign,
      color: 'bg-green-600',
      action: () => setActiveAction('salary_adjustment')
    },
    {
      id: 'schedule_leave',
      title: 'Schedule Leave',
      description: 'Set leave periods for selected staff',
      icon: Calendar,
      color: 'bg-yellow-500',
      action: () => setActiveAction('schedule_leave')
    },
    {
      id: 'suspend_staff',
      title: 'Suspend Staff',
      description: 'Temporarily suspend selected staff members',
      icon: Ban,
      color: 'bg-red-500',
      action: () => setActiveAction('suspend')
    },
    {
      id: 'activate_staff',
      title: 'Activate Staff',
      description: 'Activate suspended staff members',
      icon: CheckCircle,
      color: 'bg-green-500',
      action: () => setActiveAction('activate')
    }
  ];

  const handleActionConfirm = () => {
    // Perform the bulk action
    console.log(`Performing ${activeAction} on staff:`, selectedStaff);
    setShowConfirmModal(false);
    setActiveAction(null);
    // Show success message and redirect
    navigate('/staff');
  };

  const renderActionForm = () => {
    switch (activeAction) {
      case 'message':
        return <MessageForm staff={selectedStaff} onCancel={() => setActiveAction(null)} />;
      case 'email':
        return <EmailForm staff={selectedStaff} onCancel={() => setActiveAction(null)} />;
      case 'export':
        return <ExportForm staff={selectedStaff} onCancel={() => setActiveAction(null)} />;
      case 'update_department':
        return <UpdateDepartmentForm staff={selectedStaff} onCancel={() => setActiveAction(null)} />;
      case 'update_permissions':
        return <UpdatePermissionsForm staff={selectedStaff} onCancel={() => setActiveAction(null)} />;
      case 'salary_adjustment':
        return <SalaryAdjustmentForm staff={selectedStaff} onCancel={() => setActiveAction(null)} />;
      case 'schedule_leave':
        return <ScheduleLeaveForm staff={selectedStaff} onCancel={() => setActiveAction(null)} />;
      case 'suspend':
      case 'activate':
        return (
          <ConfirmActionForm 
            action={activeAction}
            staff={selectedStaff} 
            onConfirm={handleActionConfirm}
            onCancel={() => setActiveAction(null)} 
          />
        );
      default:
        return null;
    }
  };

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
            <h1 className="text-2xl font-bold text-dark">Staff Bulk Actions</h1>
            <p className="text-gray-600">{selectedStaff.length} staff members selected</p>
          </div>
        </div>
      </div>

      {/* Selected Staff */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-4">Selected Staff Members</h3>
        <div className="space-y-2">
          {selectedStaff.map((staff) => (
            <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-dark">{staff.name}</div>
                  <div className="text-sm text-gray-600">{staff.email} • {staff.role} • {staff.department}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Form or Action Grid */}
      {activeAction ? (
        renderActionForm()
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark mb-6">Available Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bulkActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-3 ${action.color} rounded-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-dark">{action.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// Message Form Component
const MessageForm: React.FC<{ staff: any[]; onCancel: () => void }> = ({ staff, onCancel }) => {
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Send Message to Staff</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={messageData.subject}
            onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Message subject"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={messageData.message}
            onChange={(e) => setMessageData({...messageData, message: e.target.value})}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Type your message here..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={messageData.priority}
            onChange={(e) => setMessageData({...messageData, priority: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Email Form Component
const EmailForm: React.FC<{ staff: any[]; onCancel: () => void }> = ({ staff, onCancel }) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    includeAttachment: false
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Send Email to Staff</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Email subject"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={emailData.message}
            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Type your email message here..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={emailData.includeAttachment}
            onChange={(e) => setEmailData({...emailData, includeAttachment: e.target.checked})}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Include attachment</span>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Export Form Component
const ExportForm: React.FC<{ staff: any[]; onCancel: () => void }> = ({ staff, onCancel }) => {
  const [exportData, setExportData] = useState({
    format: 'csv',
    includeFields: ['name', 'email', 'role', 'department']
  });

  const availableFields = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'role', label: 'Role' },
    { id: 'department', label: 'Department' },
    { id: 'salary', label: 'Salary' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'status', label: 'Status' }
  ];

  const handleFieldToggle = (fieldId: string) => {
    if (exportData.includeFields.includes(fieldId)) {
      setExportData({
        ...exportData,
        includeFields: exportData.includeFields.filter(f => f !== fieldId)
      });
    } else {
      setExportData({
        ...exportData,
        includeFields: [...exportData.includeFields, fieldId]
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Export Staff Data</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <select
            value={exportData.format}
            onChange={(e) => setExportData({...exportData, format: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Include Fields</label>
          <div className="grid grid-cols-2 gap-2">
            {availableFields.map((field) => (
              <label key={field.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportData.includeFields.includes(field.id)}
                  onChange={() => handleFieldToggle(field.id)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{field.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Update Department Form Component
const UpdateDepartmentForm: React.FC<{ staff: any[]; onCancel: () => void }> = ({ staff, onCancel }) => {
  const [newDepartment, setNewDepartment] = useState('');
  const departments = ['Administration', 'Academic', 'Finance', 'IT Support', 'Human Resources'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Update Staff Department</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Department</label>
          <select
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select new department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Important</p>
              <p className="text-yellow-700 text-sm">
                This will move all selected staff members to the new department. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1" disabled={!newDepartment}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Department
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Update Permissions Form Component
const UpdatePermissionsForm: React.FC<{ staff: any[]; onCancel: () => void }> = ({ staff, onCancel }) => {
  const [permissionAction, setPermissionAction] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const permissions = [
    'Manage Students',
    'Create Exams',
    'View Reports',
    'Manage Payments',
    'Send Notifications',
    'Manage Materials'
  ];

  const handlePermissionToggle = (permission: string) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(prev => prev.filter(p => p !== permission));
    } else {
      setSelectedPermissions(prev => [...prev, permission]);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Update Staff Permissions</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
          <select
            value={permissionAction}
            onChange={(e) => setPermissionAction(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select action</option>
            <option value="add">Add Permissions</option>
            <option value="remove">Remove Permissions</option>
            <option value="replace">Replace All Permissions</option>
          </select>
        </div>
        
        {permissionAction && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Permissions</label>
            <div className="space-y-2">
              {permissions.map(permission => (
                <label key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{permission}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1" disabled={!permissionAction || selectedPermissions.length === 0}>
            <Shield className="w-4 h-4 mr-2" />
            Update Permissions
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Salary Adjustment Form Component
const SalaryAdjustmentForm: React.FC<{ staff: any[]; onCancel: () => void }> = ({ staff, onCancel }) => {
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'percentage',
    amount: '',
    reason: '',
    effectiveDate: ''
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Salary Adjustment</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment Type</label>
            <select
              value={adjustmentData.type}
              onChange={(e) => setAdjustmentData({...adjustmentData, type: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="percentage">Percentage Increase</option>
              <option value="fixed">Fixed Amount</option>
              <option value="bonus">One-time Bonus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {adjustmentData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₦)'}
            </label>
            <input
              type="number"
              value={adjustmentData.amount}
              onChange={(e) => setAdjustmentData({...adjustmentData, amount: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder={adjustmentData.type === 'percentage' ? '10' : '50000'}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
          <input
            type="date"
            value={adjustmentData.effectiveDate}
            onChange={(e) => setAdjustmentData({...adjustmentData, effectiveDate: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
          <textarea
            value={adjustmentData.reason}
            onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Reason for salary adjustment..."
          />
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <DollarSign className="w-4 h-4 mr-2" />
            Apply Adjustment
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Schedule Leave Form Component
const ScheduleLeaveForm: React.FC<{ staff: any[]; onCancel: () => void }> = ({ staff, onCancel }) => {
  const [leaveData, setLeaveData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Schedule Leave</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
          <select
            value={leaveData.type}
            onChange={(e) => setLeaveData({...leaveData, type: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="annual">Annual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="maternity">Maternity Leave</option>
            <option value="emergency">Emergency Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={leaveData.startDate}
              onChange={(e) => setLeaveData({...leaveData, startDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={leaveData.endDate}
              onChange={(e) => setLeaveData({...leaveData, endDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
          <textarea
            value={leaveData.reason}
            onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Reason for leave..."
          />
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Leave
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Confirm Action Form Component
const ConfirmActionForm: React.FC<{ 
  action: string; 
  staff: any[]; 
  onConfirm: () => void; 
  onCancel: () => void; 
}> = ({ action, staff, onConfirm, onCancel }) => {
  const actionConfig = {
    suspend: {
      title: 'Suspend Staff Members',
      description: 'This will suspend the selected staff members and prevent them from accessing the platform.',
      icon: Ban,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    activate: {
      title: 'Activate Staff Members',
      description: 'This will activate the selected staff members and restore their access to the platform.',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  };

  const config = actionConfig[action as keyof typeof actionConfig];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">{config.title}</h3>
      <div className={`p-4 ${config.bgColor} border ${config.borderColor} rounded-lg mb-6`}>
        <div className="flex items-start space-x-3">
          <config.icon className={`w-5 h-5 ${config.color} mt-0.5`} />
          <div>
            <p className={`${config.color} font-medium`}>Confirm Action</p>
            <p className={`${config.color} text-sm mt-1`}>{config.description}</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Affected Staff Members:</h4>
        <div className="space-y-1">
          {staff.map((member) => (
            <div key={member.id} className="text-sm text-gray-600">
              • {member.name} ({member.role} - {member.department})
            </div>
          ))}
        </div>
      </div>
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          className={`flex-1 ${action === 'suspend' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          <config.icon className="w-4 h-4 mr-2" />
          Confirm {config.title}
        </Button>
      </div>
    </Card>
  );
};

export default StaffBulkActions;