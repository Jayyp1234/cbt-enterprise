import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, PenTool, FileText, Trophy, 
  CreditCard, Bell, User, MessageCircle, Phone,
  Target, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap, Star, BarChart3, Calendar, HelpCircle
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/home', 
      badge: null,
      description: 'Overview and daily goals'
    },
    { 
      icon: PenTool, 
      label: 'Practice', 
      path: '/practice', 
      badge: null,
      description: 'Practice questions by topic'
    },
    { 
      icon: BookOpen, 
      label: 'Study', 
      path: '/study', 
      badge: 'New',
      description: 'Curated study materials'
    },
    { 
      icon: Target, 
      label: 'Exam Mode', 
      path: '/exam', 
      badge: null,
      description: 'Full mock examinations'
    },
    { 
      icon: FileText, 
      label: 'Materials', 
      path: '/materials', 
      badge: null,
      description: 'Study resources library'
    },
    { 
      icon: MessageCircle, 
      label: 'AI Tutor', 
      path: '/ai-tutor', 
      badge: '3',
      description: 'Get instant help from AI'
    },
    { 
      icon: Trophy, 
      label: 'Leaderboard', 
      path: '/gamification', 
      badge: null,
      description: 'Rankings and achievements'
    },
    { 
      icon: BarChart3, 
      label: 'Results', 
      path: '/results', 
      badge: null,
      description: 'Performance analytics'
    },
    { 
      icon: CreditCard, 
      label: 'Wallet', 
      path: '/wallet', 
      badge: null,
      description: 'Points and rewards'
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/notifications', 
      badge: '5',
      description: 'Updates and alerts'
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/profile', 
      badge: null,
      description: 'Account settings'
    },
    { 
      icon: Phone, 
      label: 'Contact', 
      path: '/contact', 
      badge: null,
      description: 'Support and help'
    },
  ];

  const userStats = {
    name: 'Alex Johnson',
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 7,
    rank: 15,
    avatar: '👨‍🎓'
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const progressPercentage = (userStats.xp / userStats.nextLevelXp) * 100;

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-100 z-20 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 relative flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">CG</span>
            </div>
            <div>
              <h1 className="font-bold text-dark text-xl">CBT Grinder</h1>
              <p className="text-sm text-gray-500">Your Path to Success</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">CG</span>
            </div>
          </div>
        )}
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Stats */}
      {!isCollapsed && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">{userStats.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-dark truncate">{userStats.name}</p>
              <p className="text-sm text-gray-600">Level {userStats.level}</p>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>XP Progress</span>
              <span>{userStats.xp}/{userStats.nextLevelXp}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary-200">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{userStats.streak} day streak</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">#{userStats.rank}</span>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${
                  active ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">{item.label}</div>
                      <div className={`text-xs truncate ${
                        active ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full flex-shrink-0 ${
                        active 
                          ? 'bg-white text-primary-500' 
                          : item.badge === 'New' 
                            ? 'bg-green-500 text-white'
                            : 'bg-primary-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
              
              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-300">{item.description}</div>
                  {item.badge && (
                    <div className="text-xs text-primary-300 mt-1">
                      {item.badge === 'New' ? 'New Feature' : `${item.badge} notifications`}
                    </div>
                  )}
                  {/* Arrow */}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2 flex-shrink-0">
        <button 
          className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
              Settings
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </button>
        <button 
          className={`w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
              Logout
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;