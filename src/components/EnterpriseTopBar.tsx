import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, Search, User, Menu, X, Settings, LogOut, 
  ChevronDown, Building2, FileText, MessageCircle,
  Users, CreditCard, BarChart3, Zap, Shield
} from 'lucide-react';

interface EnterpriseTopBarProps {
  onLogout: () => void;
}

const EnterpriseTopBar: React.FC<EnterpriseTopBarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const enterpriseData = {
    name: "Brightstars Tutorial Center",
    plan: "Enterprise Pro",
    logo: "🏛️"
  };

  const notifications = [
    { 
      id: 1, 
      title: 'New student registration', 
      message: 'Adebayo Johnson has registered for JAMB prep',
      time: '5 min ago', 
      unread: true,
      type: 'student'
    },
    { 
      id: 2, 
      title: 'Payment received', 
      message: '₦25,000 payment from Fatima Ibrahim',
      time: '1 hour ago', 
      unread: true,
      type: 'payment'
    },
    { 
      id: 3, 
      title: 'Staff login alert', 
      message: 'Dr. Sarah Adebayo logged in from new device',
      time: '2 hours ago', 
      unread: false,
      type: 'security'
    },
  ];

  const userProfile = {
    name: 'Admin User',
    email: 'admin@brightstars.com',
    avatar: '👨‍💼',
    role: 'Institution Admin'
  };

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '🏠' },
    { label: 'Students', path: '/students', icon: '👥' },
    { label: 'Staff', path: '/staff', icon: '🛡️' },
    { label: 'User Management', path: '/users', icon: '👤' },
    { label: 'Payments', path: '/payments', icon: '💳' },
    { label: 'Content', path: '/content', icon: '📄' },
    { label: 'Communication', path: '/communication', icon: '💬' },
    { label: 'Features', path: '/features', icon: '⚡' },
    { label: 'Analytics', path: '/analytics', icon: '📊' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'student': return '👥';
      case 'payment': return '💰';
      case 'security': return '🔒';
      default: return '📢';
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/students')) return 'Student Management';
    if (path.startsWith('/staff')) return 'Staff Management';
    if (path.startsWith('/users')) return 'User Management';
    if (path.startsWith('/payments')) return 'Payment Management';
    if (path.startsWith('/content')) return 'Content Management';
    if (path.startsWith('/communication')) return 'Communication Center';
    if (path.startsWith('/features')) return 'Feature Management';
    if (path.startsWith('/analytics')) return 'Analytics Dashboard';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/billing')) return 'Billing & Subscription';
    return 'Enterprise Portal';
  };

  return (
    <>
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">{enterpriseData.logo}</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-dark text-lg">{enterpriseData.name}</h1>
                  <p className="text-xs text-gray-500 -mt-1">{enterpriseData.plan}</p>
                </div>
              </div>
            </div>

            {/* Page Title - Mobile Only */}
            <div className="lg:hidden text-center">
              <h1 className="font-bold text-dark">{getPageTitle()}</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students, staff, payments..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search */}
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-dark">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 cursor-pointer ${
                            notification.unread ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${notification.unread ? 'text-dark' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </p>
                                  <p className={`text-sm mt-1 ${notification.unread ? 'text-gray-700' : 'text-gray-600'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                                </div>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100 text-center">
                      <button 
                        onClick={() => navigate('/communication')}
                        className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{userProfile.avatar}</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-dark">{userProfile.name}</p>
                    <p className="text-xs text-gray-500">{userProfile.role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">{userProfile.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-dark">{userProfile.name}</p>
                          <p className="text-sm text-gray-600">{userProfile.email}</p>
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium mt-1 inline-block">
                            {userProfile.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          navigate('/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-700 font-medium">Institution Settings</span>
                          <p className="text-xs text-gray-500">Manage your institution</p>
                        </div>
                      </button>
                      <hr className="my-2" />
                      <button 
                        onClick={() => {
                          onLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <div>
                          <span className="text-sm font-medium">Sign Out</span>
                          <p className="text-xs text-red-500">Log out of admin panel</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{enterpriseData.logo}</span>
                </div>
                <div>
                  <h1 className="font-bold text-dark text-xl">{enterpriseData.name}</h1>
                  <p className="text-sm text-gray-500">{enterpriseData.plan}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">{item.label}</div>
                    </div>
                    {isActive(item.path) && (
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100">
              <button 
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                onClick={onLogout}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnterpriseTopBar;