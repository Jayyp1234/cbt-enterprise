import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Send, Filter, Search, 
  Calendar, Clock, CheckCircle, AlertCircle,
  Mail, Phone, Download, RefreshCw, Eye,
  MoreHorizontal, Trash2, Edit3
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Skeleton from '../../../components/ui/Skeleton';
import { 
  useGetPartialPaymentsQuery,
  useGetSentRemindersQuery,
  useGetScheduledRemindersQuery,
  useGetReminderRecipientsQuery,
  useSendRemindersMutation,
  useResendReminderMutation,
  useCancelScheduledReminderMutation
} from '../../../store/services/paymentsApi';

const PaymentReminders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentLink, setSelectedPaymentLink] = useState('All');
  const [showCreateReminderModal, setShowCreateReminderModal] = useState(false);
  const [showReminderDetailModal, setShowReminderDetailModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Fetch partial payments using RTK Query
  const { 
    data: partialPayments = [], 
    isLoading: isLoadingPartial 
  } = useGetPartialPaymentsQuery({ 
    status: activeTab === 'overdue' ? 'Overdue' : undefined 
  });

  // Fetch sent reminders
  const { 
    data: sentReminders = [], 
    isLoading: isLoadingSent 
  } = useGetSentRemindersQuery(undefined, {
    skip: activeTab !== 'sent'
  });

  // Fetch scheduled reminders
  const { 
    data: scheduledReminders = [], 
    isLoading: isLoadingScheduled 
  } = useGetScheduledRemindersQuery(undefined, {
    skip: activeTab !== 'scheduled'
  });

  // Fetch reminder recipients when a reminder is selected
  const { 
    data: reminderRecipients = [], 
    isLoading: isLoadingRecipients 
  } = useGetReminderRecipientsQuery(selectedReminder?.id || 0, {
    skip: !selectedReminder
  });

  // Mutations
  const [sendReminders, { isLoading: isSendingReminders }] = useSendRemindersMutation();
  const [resendReminder, { isLoading: isResending }] = useResendReminderMutation();
  const [cancelScheduledReminder, { isLoading: isCancelling }] = useCancelScheduledReminderMutation();

  // Mock data for payment links (would come from API in real app)
  const paymentLinks = [
    { id: 1, title: 'JAMB Preparation Course' },
    { id: 2, title: 'WAEC Tutorial Package' },
    { id: 3, title: 'Mathematics Intensive' },
    { id: 4, title: 'Physics Masterclass' }
  ];

  const filteredPayments = partialPayments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPaymentLink = selectedPaymentLink === 'All' || payment.paymentLinkId.toString() === selectedPaymentLink;
    
    return matchesSearch && matchesPaymentLink;
  });

  const handleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(prev => prev.filter(studentId => studentId !== id));
    } else {
      setSelectedStudents(prev => [...prev, id]);
    }
  };

  const handleSendReminders = () => {
    if (selectedStudents.length > 0) {
      setShowCreateReminderModal(true);
    } else {
      // Show message to select students first
    }
  };

  const handleViewReminderDetail = (reminder: any) => {
    setSelectedReminder(reminder);
    setShowReminderDetailModal(true);
  };

  const handleResendReminder = async (id: number) => {
    try {
      await resendReminder(id).unwrap();
      // Success notification would go here
    } catch (error) {
      console.error('Failed to resend reminder:', error);
      // Error notification would go here
    }
  };

  const handleCancelScheduledReminder = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this scheduled reminder?')) {
      try {
        await cancelScheduledReminder(id).unwrap();
        // Success notification would go here
      } catch (error) {
        console.error('Failed to cancel scheduled reminder:', error);
        // Error notification would go here
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state for the active tab
  const isLoading = 
    (activeTab === 'pending' || activeTab === 'overdue') && isLoadingPartial ||
    activeTab === 'sent' && isLoadingSent ||
    activeTab === 'scheduled' && isLoadingScheduled;

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
            <h1 className="text-2xl font-bold text-dark">Payment Reminders</h1>
            <p className="text-gray-600">Manage and send reminders for partial payments</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateReminderModal(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Create Reminder
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {partialPayments.filter(p => p.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Payments</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {partialPayments.filter(p => p.status === 'Overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue Payments</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {sentReminders.reduce((sum, r) => sum + r.recipients, 0)}
              </div>
              <div className="text-sm text-gray-600">Reminders Sent</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'pending', label: 'Pending Payments' },
          { id: 'overdue', label: 'Overdue Payments' },
          { id: 'sent', label: 'Sent Reminders' },
          { id: 'scheduled', label: 'Scheduled Reminders' },
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

      {/* Pending/Overdue Payments Tabs */}
      {(activeTab === 'pending' || activeTab === 'overdue') && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={selectedPaymentLink}
                onChange={(e) => setSelectedPaymentLink(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="All">All Payment Links</option>
                {paymentLinks.map(link => (
                  <option key={link.id} value={link.id.toString()}>{link.title}</option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedStudents.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">
                    {selectedStudents.length} student(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={handleSendReminders}>
                      <Bell className="w-4 h-4 mr-2" />
                      Send Reminders
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedStudents([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Skeleton width={40} height={40} variant="circular" />
                      <div>
                        <Skeleton width={150} height={20} className="mb-1" />
                        <Skeleton width={200} height={16} className="mb-1" />
                        <Skeleton width={180} height={16} className="mb-2" />
                        <Skeleton width={250} height={16} />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton width={100} height={36} />
                      <Skeleton width={100} height={36} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Partial Payments List */}
          {!isLoading && (
            <div className="space-y-4">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <Card key={payment.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(payment.id)}
                          onChange={() => handleSelectStudent(payment.id)}
                          className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                          {payment.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-dark">{payment.studentName}</div>
                          <div className="text-sm text-gray-600">{payment.email}</div>
                          <div className="text-sm text-gray-600">
                            Student ID: {payment.studentId} • Class: {payment.class}
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">
                              Payment Link: <span className="font-medium">{payment.paymentLink}</span>
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-green-600 font-medium">
                              Paid: ₦{payment.amountPaid.toLocaleString()}
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-red-600 font-medium">
                              Remaining: ₦{payment.remainingAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            <span>Last Payment: {payment.lastPaymentDate}</span>
                            <span className="mx-2">•</span>
                            <span>Due Date: {payment.dueDate}</span>
                            <span className="mx-2">•</span>
                            <span>Reminders Sent: {payment.remindersSent}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Bell className="w-4 h-4 mr-2" />
                            Send Reminder
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No {activeTab === 'overdue' ? 'Overdue' : 'Pending'} Payments</h3>
                  <p className="text-gray-500">
                    There are no {activeTab === 'overdue' ? 'overdue' : 'pending'} partial payments at the moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sent Reminders Tab */}
      {activeTab === 'sent' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Sent Reminders</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={80} height={20} className="rounded-full" />
                        </div>
                        <Skeleton width={300} height={16} className="mb-2" />
                        <div className="flex items-center space-x-4">
                          <Skeleton width={100} height={16} />
                          <Skeleton width={100} height={16} />
                          <Skeleton width={100} height={16} />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton width={80} height={36} />
                        <Skeleton width={80} height={36} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Sent Reminders List */}
            {!isLoading && (
              <div className="space-y-4">
                {sentReminders.length > 0 ? (
                  sentReminders.map((reminder) => (
                    <Card key={reminder.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-bold text-dark">{reminder.title}</h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              {reminder.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Sent to {reminder.recipients} recipients on {reminder.sentDate} by {reminder.sentBy}
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Open Rate: {reminder.openRate}%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Click Rate: {reminder.clickRate}%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Completion: {reminder.completionRate}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewReminderDetail(reminder)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResendReminder(reminder.id)}
                            disabled={isResending}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Resend
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Reminders Sent</h3>
                    <p className="text-gray-500">
                      You haven't sent any payment reminders yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Scheduled Reminders Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Scheduled Reminders</h3>
              <Button onClick={() => setShowCreateReminderModal(true)}>
                <Bell className="w-4 h-4 mr-2" />
                Schedule New
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={80} height={20} className="rounded-full" />
                          <Skeleton width={80} height={20} className="rounded-full" />
                        </div>
                        <Skeleton width={300} height={16} className="mb-2" />
                        <Skeleton width={200} height={16} />
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton width={80} height={36} />
                        <Skeleton width={80} height={36} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Scheduled Reminders List */}
            {!isLoading && (
              <div className="space-y-4">
                {scheduledReminders.length > 0 ? (
                  scheduledReminders.map((reminder) => (
                    <Card key={reminder.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-bold text-dark">{reminder.title}</h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              {reminder.status}
                            </span>
                            {reminder.recurrence !== 'One-time' && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                {reminder.recurrence}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Scheduled for {reminder.scheduledDate} • Created by {reminder.createdBy}
                          </div>
                          <div className="text-sm text-gray-600">
                            Recipients: {reminder.recipients}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">Channels:</span>
                            {reminder.channels.map((channel, index) => (
                              <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {channel}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleCancelScheduledReminder(reminder.id)}
                            disabled={isCancelling}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Scheduled Reminders</h3>
                    <p className="text-gray-500">
                      You don't have any scheduled reminders at the moment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Create Reminder Modal */}
      <CreateReminderModal 
        isOpen={showCreateReminderModal} 
        onClose={() => setShowCreateReminderModal(false)}
        selectedStudents={selectedStudents}
        partialPayments={partialPayments}
        onSendReminders={sendReminders}
      />

      {/* Reminder Detail Modal */}
      <ReminderDetailModal 
        isOpen={showReminderDetailModal} 
        onClose={() => setShowReminderDetailModal(false)}
        reminder={selectedReminder}
        recipients={reminderRecipients}
        isLoadingRecipients={isLoadingRecipients}
        onResend={resendReminder}
      />
    </div>
  );
};

// Create Reminder Modal Component
const CreateReminderModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  selectedStudents: number[];
  partialPayments: any[];
  onSendReminders: any;
}> = ({ isOpen, onClose, selectedStudents, partialPayments, onSendReminders }) => {
  const [reminderData, setReminderData] = useState({
    title: 'Payment Completion Reminder',
    message: 'Dear student,\n\nThis is a friendly reminder to complete your payment for the course. Please click on the payment link to make the remaining payment.\n\nThank you,\nBrightstars Tutorial Center',
    recipients: 'selected',
    channels: ['email', 'sms'],
    includePaymentLink: true,
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: '',
    recurrence: 'one-time'
  });
  const [isSending, setIsSending] = useState(false);

  const filteredPayments = selectedStudents.length > 0
    ? partialPayments.filter(p => selectedStudents.includes(p.id))
    : partialPayments;

  const handleSendReminders = async () => {
    try {
      setIsSending(true);
      
      // Prepare recipient IDs based on selection
      let recipientIds: number[];
      if (reminderData.recipients === 'selected') {
        recipientIds = selectedStudents.length > 0 ? selectedStudents : [];
      } else if (reminderData.recipients === 'all_pending') {
        recipientIds = partialPayments.filter(p => p.status === 'Pending').map(p => p.id);
      } else if (reminderData.recipients === 'all_overdue') {
        recipientIds = partialPayments.filter(p => p.status === 'Overdue').map(p => p.id);
      } else {
        recipientIds = [];
      }
      
      if (recipientIds.length === 0) {
        alert('No recipients selected');
        setIsSending(false);
        return;
      }
      
      await onSendReminders({
        recipients: recipientIds,
        subject: reminderData.title,
        message: reminderData.message,
        channels: reminderData.channels,
        includePaymentLink: reminderData.includePaymentLink,
        scheduleType: reminderData.scheduleType,
        scheduleDate: reminderData.scheduleDate,
        scheduleTime: reminderData.scheduleTime,
        recurrence: reminderData.recurrence
      }).unwrap();
      
      onClose();
      // Success notification would go here
    } catch (error) {
      console.error('Failed to send/schedule reminders:', error);
      // Error notification would go here
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Payment Reminder" className="max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Title</label>
          <input
            type="text"
            value={reminderData.title}
            onChange={(e) => setReminderData({...reminderData, title: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
          <select
            value={reminderData.recipients}
            onChange={(e) => setReminderData({...reminderData, recipients: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="selected">Selected Students ({selectedStudents.length})</option>
            <option value="all_pending">All Pending Payments</option>
            <option value="all_overdue">All Overdue Payments</option>
          </select>
          
          {reminderData.recipients === 'selected' && selectedStudents.length > 0 && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
              <div className="space-y-2">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{payment.studentName}</span>
                    <span className="text-red-600">₦{payment.remainingAmount.toLocaleString()} remaining</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={reminderData.message}
            onChange={(e) => setReminderData({...reminderData, message: e.target.value})}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Send Via</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reminderData.channels.includes('email')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setReminderData({...reminderData, channels: [...reminderData.channels, 'email']});
                  } else {
                    setReminderData({...reminderData, channels: reminderData.channels.filter(c => c !== 'email')});
                  }
                }}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Email</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reminderData.channels.includes('sms')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setReminderData({...reminderData, channels: [...reminderData.channels, 'sms']});
                  } else {
                    setReminderData({...reminderData, channels: reminderData.channels.filter(c => c !== 'sms')});
                  }
                }}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">SMS</span>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={reminderData.includePaymentLink}
            onChange={(e) => setReminderData({...reminderData, includePaymentLink: e.target.checked})}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Include payment link in message</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Schedule</label>
          <div className="space-y-3">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="scheduleType"
                  value="now"
                  checked={reminderData.scheduleType === 'now'}
                  onChange={(e) => setReminderData({...reminderData, scheduleType: e.target.value})}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Send Now</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="scheduleType"
                  value="later"
                  checked={reminderData.scheduleType === 'later'}
                  onChange={(e) => setReminderData({...reminderData, scheduleType: e.target.value})}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Schedule for Later</span>
              </label>
            </div>

            {reminderData.scheduleType === 'later' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={reminderData.scheduleDate}
                    onChange={(e) => setReminderData({...reminderData, scheduleDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={reminderData.scheduleTime}
                    onChange={(e) => setReminderData({...reminderData, scheduleTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}

            {reminderData.scheduleType === 'later' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence</label>
                <select
                  value={reminderData.recurrence}
                  onChange={(e) => setReminderData({...reminderData, recurrence: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="one-time">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSending}>
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSendReminders}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {reminderData.scheduleType === 'now' ? 'Sending...' : 'Scheduling...'}
              </>
            ) : reminderData.scheduleType === 'now' ? (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Reminder
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Reminder Detail Modal Component
const ReminderDetailModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  reminder: any;
  recipients: any[];
  isLoadingRecipients: boolean;
  onResend: any;
}> = ({ isOpen, onClose, reminder, recipients, isLoadingRecipients, onResend }) => {
  if (!reminder) return null;
  
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await onResend(reminder.id).unwrap();
      // Success notification would go here
    } catch (error) {
      console.error('Failed to resend reminder:', error);
      // Error notification would go here
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reminder Details" className="max-w-3xl">
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-dark text-lg">{reminder.title}</h3>
              <p className="text-gray-600">Sent on {reminder.sentDate} by {reminder.sentBy}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-500">Channels:</span>
                {reminder.channels.map((channel: string, index: number) => (
                  <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">Recipients</div>
              <div className="text-2xl font-bold text-dark">{reminder.recipients}</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-sm font-medium text-green-700 mb-1">Open Rate</div>
              <div className="text-2xl font-bold text-green-800">{reminder.openRate}%</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${reminder.openRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-700 mb-1">Click Rate</div>
              <div className="text-2xl font-bold text-blue-800">{reminder.clickRate}%</div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${reminder.clickRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="text-sm font-medium text-purple-700 mb-1">Completion Rate</div>
              <div className="text-2xl font-bold text-purple-800">{reminder.completionRate}%</div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${reminder.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipients List */}
        <div>
          <h4 className="font-medium text-dark mb-3">Recipients</h4>
          
          {/* Loading State */}
          {isLoadingRecipients && (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton width={32} height={32} variant="circular" />
                    <div>
                      <Skeleton width={120} height={16} className="mb-1" />
                      <Skeleton width={150} height={12} />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Skeleton width={80} height={24} />
                    <Skeleton width={24} height={24} variant="circular" />
                    <Skeleton width={24} height={24} variant="circular" />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoadingRecipients && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recipients.map((recipient) => (
                    <tr key={recipient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {recipient.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                            <div className="text-xs text-gray-500">{recipient.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          recipient.status === 'Opened' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {recipient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {recipient.clicked ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {recipient.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Bell className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isResending}>
            Close
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Reminder
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentReminders;