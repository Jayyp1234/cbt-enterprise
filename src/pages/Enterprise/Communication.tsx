import React, { useState } from 'react';
import { 
  MessageCircle, Send, Users, Bell, Mail, 
  Phone, Calendar, Plus, Search, Filter,
  Eye, Edit3, Trash2, Archive, Star,
  Paperclip, Image, Smile, MoreHorizontal,
  CheckCircle, Clock, AlertCircle, Volume2, Settings
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const conversations = [
    {
      id: 1,
      type: 'individual',
      participant: {
        name: 'Adebayo Johnson',
        avatar: '👨‍🎓',
        role: 'Student',
        class: 'SS3',
        status: 'online'
      },
      lastMessage: 'Thank you for the explanation about quadratic equations!',
      timestamp: '2 min ago',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'student',
          content: 'Good morning sir, I need help with quadratic equations',
          timestamp: '10:30 AM',
          type: 'text'
        },
        {
          id: 2,
          sender: 'staff',
          content: 'Good morning Adebayo! I\'d be happy to help. Which specific part are you struggling with?',
          timestamp: '10:32 AM',
          type: 'text'
        },
        {
          id: 3,
          sender: 'student',
          content: 'I don\'t understand how to solve x² + 5x + 6 = 0',
          timestamp: '10:35 AM',
          type: 'text'
        },
        {
          id: 4,
          sender: 'staff',
          content: 'Let me break it down for you. We can solve this by factoring. We need two numbers that multiply to 6 and add to 5.',
          timestamp: '10:37 AM',
          type: 'text'
        },
        {
          id: 5,
          sender: 'student',
          content: 'Thank you for the explanation about quadratic equations!',
          timestamp: '10:45 AM',
          type: 'text'
        }
      ]
    },
    {
      id: 2,
      type: 'group',
      participant: {
        name: 'SS3 Mathematics Class',
        avatar: '👥',
        role: 'Group',
        class: 'SS3',
        status: 'active',
        memberCount: 45
      },
      lastMessage: 'Assignment due tomorrow at 9 AM',
      timestamp: '1 hour ago',
      unread: 3,
      messages: [
        {
          id: 1,
          sender: 'staff',
          content: 'Good morning class! Today we\'ll be covering calculus basics.',
          timestamp: '9:00 AM',
          type: 'text'
        },
        {
          id: 2,
          sender: 'staff',
          content: 'Please complete exercises 1-10 from chapter 5',
          timestamp: '9:05 AM',
          type: 'text'
        },
        {
          id: 3,
          sender: 'staff',
          content: 'Assignment due tomorrow at 9 AM',
          timestamp: '9:10 AM',
          type: 'text'
        }
      ]
    },
    {
      id: 3,
      type: 'parent',
      participant: {
        name: 'Mrs. Fatima Ibrahim',
        avatar: '👩‍💼',
        role: 'Parent',
        class: 'SS2',
        status: 'offline'
      },
      lastMessage: 'How is my daughter performing in Mathematics?',
      timestamp: '3 hours ago',
      unread: 1,
      messages: [
        {
          id: 1,
          sender: 'parent',
          content: 'Good afternoon, I wanted to check on my daughter\'s progress',
          timestamp: '2:00 PM',
          type: 'text'
        },
        {
          id: 2,
          sender: 'parent',
          content: 'How is my daughter performing in Mathematics?',
          timestamp: '2:05 PM',
          type: 'text'
        }
      ]
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Student Registration',
      message: 'Chidi Okafor has registered for SS3 Mathematics',
      type: 'student',
      timestamp: '5 min ago',
      read: false,
      priority: 'normal'
    },
    {
      id: 2,
      title: 'Payment Received',
      message: '₦25,000 payment from Aisha Mohammed',
      type: 'payment',
      timestamp: '15 min ago',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      title: 'Assignment Submitted',
      message: '12 students submitted Mathematics assignment',
      type: 'academic',
      timestamp: '1 hour ago',
      read: true,
      priority: 'normal'
    },
    {
      id: 4,
      title: 'Staff Login Alert',
      message: 'Dr. Sarah Adebayo logged in from new device',
      type: 'security',
      timestamp: '2 hours ago',
      read: true,
      priority: 'medium'
    }
  ];

  const broadcasts = [
    {
      id: 1,
      title: 'Mid-term Examination Schedule',
      content: 'Dear students and parents, the mid-term examinations will commence on February 15th, 2024...',
      recipients: 'All Students & Parents',
      sentBy: 'Principal',
      sentAt: '2024-01-15 10:00 AM',
      status: 'Sent',
      deliveryRate: 98,
      openRate: 85,
      channels: ['Email', 'SMS', 'In-App']
    },
    {
      id: 2,
      title: 'New Study Materials Available',
      content: 'We have uploaded new study materials for Physics and Chemistry...',
      recipients: 'SS3 Students',
      sentBy: 'Academic Coordinator',
      sentAt: '2024-01-14 2:30 PM',
      status: 'Sent',
      deliveryRate: 100,
      openRate: 92,
      channels: ['Email', 'In-App']
    },
    {
      id: 3,
      title: 'Payment Reminder',
      content: 'This is a friendly reminder that school fees for the second term are due...',
      recipients: 'Parents with Outstanding Fees',
      sentBy: 'Accounts Department',
      sentAt: '2024-01-13 9:00 AM',
      status: 'Scheduled',
      deliveryRate: 0,
      openRate: 0,
      channels: ['Email', 'SMS']
    }
  ];

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConv) {
      // Add message to conversation
      const newMessage = {
        id: selectedConv.messages.length + 1,
        sender: 'staff',
        content: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      
      // Update conversation (in real app, this would be handled by state management)
      setMessageText('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'active': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'student': return '👥';
      case 'payment': return '💰';
      case 'academic': return '📚';
      case 'security': return '🔒';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Communication Center</h1>
          <p className="text-gray-600">Manage messages, notifications, and broadcasts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowBroadcastModal(true)}>
            <Volume2 className="w-4 h-4 mr-2" />
            Broadcast
          </Button>
          <Button onClick={() => setShowComposeModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {conversations.reduce((sum, conv) => sum + conv.unread, 0)}
              </div>
              <div className="text-sm text-gray-600">Unread Messages</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">{conversations.length}</div>
              <div className="text-sm text-gray-600">Active Conversations</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {notifications.filter(n => !n.read).length}
              </div>
              <div className="text-sm text-gray-600">New Notifications</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Volume2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">{broadcasts.length}</div>
              <div className="text-sm text-gray-600">Broadcasts Sent</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'messages', label: 'Messages', icon: MessageCircle },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'broadcasts', label: 'Broadcasts', icon: Volume2 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-white text-primary-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark">Conversations</h3>
              <Button size="sm" variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                        {conversation.participant.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversation.participant.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-dark truncate">{conversation.participant.name}</h4>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{conversation.participant.role}</span>
                        {conversation.participant.class && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{conversation.participant.class}</span>
                          </>
                        )}
                        {conversation.participant.memberCount && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{conversation.participant.memberCount} members</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                        {selectedConv.participant.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(selectedConv.participant.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">{selectedConv.participant.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedConv.participant.role}
                        {selectedConv.participant.class && ` • ${selectedConv.participant.class}`}
                        {selectedConv.participant.memberCount && ` • ${selectedConv.participant.memberCount} members`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConv.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender === 'staff'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      } rounded-lg p-3`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'staff' ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Image className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Recent Notifications</h3>
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${!notification.read ? 'text-dark' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Broadcasts Tab */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Broadcast History</h3>
              <Button onClick={() => setShowBroadcastModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Broadcast
              </Button>
            </div>

            <div className="space-y-4">
              {broadcasts.map((broadcast) => (
                <Card key={broadcast.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-dark">{broadcast.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          broadcast.status === 'Sent' ? 'bg-green-100 text-green-700' :
                          broadcast.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {broadcast.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{broadcast.content}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Recipients:</span>
                          <div className="font-medium">{broadcast.recipients}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Sent by:</span>
                          <div className="font-medium">{broadcast.sentBy}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Delivery Rate:</span>
                          <div className="font-medium text-green-600">{broadcast.deliveryRate}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Open Rate:</span>
                          <div className="font-medium text-blue-600">{broadcast.openRate}%</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="text-xs text-gray-500">Channels:</span>
                        {broadcast.channels.map((channel, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Compose Message Modal */}
      <ComposeMessageModal 
        isOpen={showComposeModal} 
        onClose={() => setShowComposeModal(false)} 
      />

      {/* Broadcast Modal */}
      <BroadcastModal 
        isOpen={showBroadcastModal} 
        onClose={() => setShowBroadcastModal(false)} 
      />
    </div>
  );
};

// Compose Message Modal Component
const ComposeMessageModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messageData, setMessageData] = useState({
    recipient: '',
    subject: '',
    message: '',
    priority: 'normal',
    channels: ['in-app']
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose New Message" className="max-w-2xl">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
            <select
              value={messageData.recipient}
              onChange={(e) => setMessageData({...messageData, recipient: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select recipient</option>
              <option value="student">Individual Student</option>
              <option value="parent">Parent</option>
              <option value="staff">Staff Member</option>
              <option value="class">Entire Class</option>
            </select>
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
        </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Channels</label>
          <div className="space-y-2">
            {[
              { id: 'in-app', label: 'In-App Notification' },
              { id: 'email', label: 'Email' },
              { id: 'sms', label: 'SMS' },
              { id: 'push', label: 'Push Notification' }
            ].map((channel) => (
              <label key={channel.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={messageData.channels.includes(channel.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMessageData({
                        ...messageData,
                        channels: [...messageData.channels, channel.id]
                      });
                    } else {
                      setMessageData({
                        ...messageData,
                        channels: messageData.channels.filter(c => c !== channel.id)
                      });
                    }
                  }}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{channel.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Broadcast Modal Component
const BroadcastModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    content: '',
    audience: '',
    channels: ['email'],
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: ''
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Broadcast" className="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Broadcast Title</label>
          <input
            type="text"
            value={broadcastData.title}
            onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter broadcast title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
          <select
            value={broadcastData.audience}
            onChange={(e) => setBroadcastData({...broadcastData, audience: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select audience</option>
            <option value="all-students">All Students</option>
            <option value="all-parents">All Parents</option>
            <option value="all-staff">All Staff</option>
            <option value="ss3-students">SS3 Students</option>
            <option value="ss2-students">SS2 Students</option>
            <option value="ss1-students">SS1 Students</option>
            <option value="outstanding-fees">Parents with Outstanding Fees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
          <textarea
            value={broadcastData.content}
            onChange={(e) => setBroadcastData({...broadcastData, content: e.target.value})}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter your broadcast message..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Channels</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'email', label: 'Email' },
              { id: 'sms', label: 'SMS' },
              { id: 'in-app', label: 'In-App' },
              { id: 'push', label: 'Push Notification' }
            ].map((channel) => (
              <label key={channel.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={broadcastData.channels.includes(channel.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBroadcastData({
                        ...broadcastData,
                        channels: [...broadcastData.channels, channel.id]
                      });
                    } else {
                      setBroadcastData({
                        ...broadcastData,
                        channels: broadcastData.channels.filter(c => c !== channel.id)
                      });
                    }
                  }}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{channel.label}</span>
              </label>
            ))}
          </div>
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
                  checked={broadcastData.scheduleType === 'now'}
                  onChange={(e) => setBroadcastData({...broadcastData, scheduleType: e.target.value})}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Send Now</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="scheduleType"
                  value="later"
                  checked={broadcastData.scheduleType === 'later'}
                  onChange={(e) => setBroadcastData({...broadcastData, scheduleType: e.target.value})}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Schedule for Later</span>
              </label>
            </div>

            {broadcastData.scheduleType === 'later' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={broadcastData.scheduleDate}
                    onChange={(e) => setBroadcastData({...broadcastData, scheduleDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={broadcastData.scheduleTime}
                    onChange={(e) => setBroadcastData({...broadcastData, scheduleTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Volume2 className="w-4 h-4 mr-2" />
            {broadcastData.scheduleType === 'now' ? 'Send Broadcast' : 'Schedule Broadcast'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Communication;