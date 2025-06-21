import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Upload, Users, Mail, 
  MessageCircle, Ban, CheckCircle, AlertTriangle,
  FileText, Send, UserX, RefreshCw
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

const StudentBulkActions: React.FC = () => {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudents] = useState([
    { id: 1, name: 'Adebayo Johnson', email: 'adebayo@email.com', class: 'SS3' },
    { id: 2, name: 'Fatima Ibrahim', email: 'fatima@email.com', class: 'SS2' },
    { id: 3, name: 'Chidi Okafor', email: 'chidi@email.com', class: 'SS3' },
  ]);

  const bulkActions = [
    {
      id: 'send_message',
      title: 'Send Message',
      description: 'Send a message to selected students',
      icon: MessageCircle,
      color: 'bg-blue-500',
      action: () => setActiveAction('message')
    },
    {
      id: 'send_email',
      title: 'Send Email',
      description: 'Send an email to selected students',
      icon: Mail,
      color: 'bg-green-500',
      action: () => setActiveAction('email')
    },
    {
      id: 'export_data',
      title: 'Export Data',
      description: 'Export student data to CSV/Excel',
      icon: Download,
      color: 'bg-purple-500',
      action: () => setActiveAction('export')
    },
    {
      id: 'update_class',
      title: 'Update Class',
      description: 'Move students to a different class',
      icon: Users,
      color: 'bg-orange-500',
      action: () => setActiveAction('update_class')
    },
    {
      id: 'suspend_students',
      title: 'Suspend Students',
      description: 'Temporarily suspend selected students',
      icon: Ban,
      color: 'bg-red-500',
      action: () => setActiveAction('suspend')
    },
    {
      id: 'activate_students',
      title: 'Activate Students',
      description: 'Activate suspended students',
      icon: CheckCircle,
      color: 'bg-green-600',
      action: () => setActiveAction('activate')
    }
  ];

  const handleActionConfirm = () => {
    // Perform the bulk action
    console.log(`Performing ${activeAction} on students:`, selectedStudents);
    setShowConfirmModal(false);
    setActiveAction(null);
    // Show success message and redirect
    navigate('/students');
  };

  const renderActionForm = () => {
    switch (activeAction) {
      case 'message':
        return <MessageForm students={selectedStudents} onCancel={() => setActiveAction(null)} />;
      case 'email':
        return <EmailForm students={selectedStudents} onCancel={() => setActiveAction(null)} />;
      case 'export':
        return <ExportForm students={selectedStudents} onCancel={() => setActiveAction(null)} />;
      case 'update_class':
        return <UpdateClassForm students={selectedStudents} onCancel={() => setActiveAction(null)} />;
      case 'suspend':
      case 'activate':
        return (
          <ConfirmActionForm 
            action={activeAction}
            students={selectedStudents} 
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
          <Button variant="ghost" onClick={() => navigate('/students')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Bulk Actions</h1>
            <p className="text-gray-600">{selectedStudents.length} students selected</p>
          </div>
        </div>
      </div>

      {/* Selected Students */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-4">Selected Students</h3>
        <div className="space-y-2">
          {selectedStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-dark">{student.name}</div>
                  <div className="text-sm text-gray-600">{student.email} • {student.class}</div>
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
const MessageForm: React.FC<{ students: any[]; onCancel: () => void }> = ({ students, onCancel }) => {
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Send Message to Students</h3>
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
const EmailForm: React.FC<{ students: any[]; onCancel: () => void }> = ({ students, onCancel }) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    includeParents: false
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Send Email to Students</h3>
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
            checked={emailData.includeParents}
            onChange={(e) => setEmailData({...emailData, includeParents: e.target.checked})}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Also send to parents/guardians</span>
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
const ExportForm: React.FC<{ students: any[]; onCancel: () => void }> = ({ students, onCancel }) => {
  const [exportData, setExportData] = useState({
    format: 'csv',
    includeFields: ['name', 'email', 'class', 'status']
  });

  const availableFields = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'class', label: 'Class' },
    { id: 'status', label: 'Status' },
    { id: 'parentName', label: 'Parent Name' },
    { id: 'parentEmail', label: 'Parent Email' },
    { id: 'address', label: 'Address' }
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
      <h3 className="text-lg font-bold text-dark mb-6">Export Student Data</h3>
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

// Update Class Form Component
const UpdateClassForm: React.FC<{ students: any[]; onCancel: () => void }> = ({ students, onCancel }) => {
  const [newClass, setNewClass] = useState('');
  const classes = ['SS1', 'SS2', 'SS3', 'JSS1', 'JSS2', 'JSS3'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dark mb-6">Update Student Class</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Class</label>
          <select
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select new class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Important</p>
              <p className="text-yellow-700 text-sm">
                This will move all selected students to the new class. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1" disabled={!newClass}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Class
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Confirm Action Form Component
const ConfirmActionForm: React.FC<{ 
  action: string; 
  students: any[]; 
  onConfirm: () => void; 
  onCancel: () => void; 
}> = ({ action, students, onConfirm, onCancel }) => {
  const actionConfig = {
    suspend: {
      title: 'Suspend Students',
      description: 'This will suspend the selected students and prevent them from accessing the platform.',
      icon: Ban,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    activate: {
      title: 'Activate Students',
      description: 'This will activate the selected students and restore their access to the platform.',
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
        <h4 className="font-medium text-gray-700 mb-2">Affected Students:</h4>
        <div className="space-y-1">
          {students.map((student) => (
            <div key={student.id} className="text-sm text-gray-600">
              • {student.name} ({student.class})
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

export default StudentBulkActions;