import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, Menu, X, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { 
      id: 1, 
      title: 'New achievement unlocked!', 
      message: 'You earned the "Speed Demon" badge',
      time: '2 min ago', 
      unread: true,
      type: 'achievement'
    },
    { 
      id: 2, 
      title: 'Daily goal completed', 
      message: 'Great job! You completed 15 practice questions',
      time: '1 hour ago', 
      unread: true,
      type: 'goal'
    },
    { 
      id: 3, 
      title: 'Study reminder', 
      message: 'Time for your scheduled Physics session',
      time: '3 hours ago', 
      unread: false,
      type: 'reminder'
    },
    { 
      id: 4, 
      title: 'New study material', 
      message: 'JAMB Mathematics 2024 questions are now available',
      time: '5 hours ago', 
      unread: false,
      type: 'material'
    },
  ];

  const searchSuggestions = [
    { type: 'topic', title: 'Quadratic Equations', path: '/practice/mathematics' },
    { type: 'material', title: 'JAMB Past Questions 2023', path: '/materials' },
    { type: 'page', title: 'AI Tutor', path: '/ai-tutor' },
    { type: 'topic', title: 'Physics - Motion', path: '/practice/physics' },
    { type: 'page', title: 'Exam Mode', path: '/exam' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const menuItems = [
    { label: 'Dashboard', path: '/home', icon: '🏠', description: 'Overview and daily goals' },
    { label: 'Practice', path: '/practice', icon: '✏️', description: 'Practice questions by topic' },
    { label: 'Study', path: '/study', icon: '📚', description: 'Curated study materials' },
    { label: 'Exam Mode', path: '/exam', icon: '🎯', description: 'Full mock examinations' },
    { label: 'Materials', path: '/materials', icon: '📄', description: 'Study resources library' },
    { label: 'AI Tutor', path: '/ai-tutor', icon: '🤖', description: 'Get instant help from AI' },
    { label: 'Leaderboard', path: '/gamification', icon: '🏆', description: 'Rankings and achievements' },
    { label: 'Results', path: '/results', icon: '📊', description: 'Performance analytics' },
    { label: 'Wallet', path: '/wallet', icon: '💳', description: 'Points and rewards' },
    { label: 'Profile', path: '/profile', icon: '👤', description: 'Account settings' },
    { label: 'Contact', path: '/contact', icon: '📞', description: 'Support and help' },
  ];

  const userProfile = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '👨‍🎓',
    level: 12,
    xp: 2450,
    subscription: 'Premium',
    rank: 15
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const filteredSuggestions = searchSuggestions.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'goal': return '🎯';
      case 'reminder': return '⏰';
      case 'material': return '📚';
      default: return '📢';
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
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
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">CG</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-dark text-lg">CBT Grinder</h1>
                  <p className="text-xs text-gray-500 -mt-1">Your Path to Success</p>
                </div>
              </div>
            </div>

            {/* Search Bar - Enhanced */}
            <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search topics, questions, materials..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-64 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(suggestion.path)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                            suggestion.type === 'topic' ? 'bg-blue-100 text-blue-600' :
                            suggestion.type === 'material' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {suggestion.type === 'topic' ? '📝' : 
                             suggestion.type === 'material' ? '📚' : '🔗'}
                          </div>
                          <div>
                            <div className="font-medium text-dark">{suggestion.title}</div>
                            <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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

                {/* Enhanced Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-dark">Notifications</h3>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                              {unreadCount} new
                            </span>
                          )}
                          <button 
                            onClick={() => navigate('/notifications')}
                            className="text-primary-500 text-sm hover:text-primary-600 font-medium"
                          >
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 cursor-pointer ${
                            notification.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/notifications');
                          }}
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
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Profile Menu */}
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
                    <p className="text-xs text-gray-500">Level {userProfile.level} • #{userProfile.rank}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced Profile Dropdown */}
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
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full font-medium">
                              {userProfile.subscription}
                            </span>
                            <span className="text-xs text-gray-500">
                              {userProfile.xp.toLocaleString()} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          navigate('/profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-700 font-medium">View Profile</span>
                          <p className="text-xs text-gray-500">Manage your account</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-700 font-medium">Settings</span>
                          <p className="text-xs text-gray-500">Preferences and privacy</p>
                        </div>
                      </button>
                      <hr className="my-2" />
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600">
                        <LogOut className="w-4 h-4" />
                        <div>
                          <span className="text-sm font-medium">Sign Out</span>
                          <p className="text-xs text-red-500">Log out of your account</p>
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

      {/* Enhanced Mobile Menu Overlay */}
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CG</span>
                </div>
                <div>
                  <h1 className="font-bold text-dark text-xl">CBT Grinder</h1>
                  <p className="text-sm text-gray-500">Your Path to Success</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">{userProfile.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark">{userProfile.name}</p>
                  <p className="text-sm text-gray-600">Level {userProfile.level} • {userProfile.xp.toLocaleString()} XP</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">75%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Navigation Menu */}
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
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">{item.label}</div>
                      <div className={`text-xs truncate ${
                        isActive(item.path) ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive(item.path) && (
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2 flex-shrink-0">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-gray-500">Preferences and privacy</div>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs text-red-500">Log out of your account</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;