import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, Users, CreditCard, BarChart3, Settings, 
  Shield, Zap, Target, BookOpen, Bell, User, 
  ChevronLeft, ChevronRight, LogOut, Crown,
  Globe, DollarSign, Activity, TrendingUp,
  UserCheck, Calendar, Award, MessageCircle,
  FileText, Wallet
} from 'lucide-react';

interface EnterpriseSidebarProps {
  onLogout: () => void;
}

const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock data for the enterprise
  const enterpriseData = {
    name: "Brightstars Tutorial Center",
    subdomain: "brightstars.cbtgrinder.com",
    plan: "Enterprise Pro",
    studentsLimit: 500,
    currentStudents: 342,
    logo: "🏛️"
  };

  const menuItems = [
    { 
      icon: Building2, 
      label: 'Dashboard', 
      path: '/', 
      badge: null,
      description: 'Overview and analytics'
    },
    { 
      icon: Users, 
      label: 'Students', 
      path: '/students', 
      badge: '342',
      description: 'Manage student accounts'
    },
    { 
      icon: Shield, 
      label: 'Staff', 
      path: '/staff', 
      badge: '12',
      description: 'Staff management & roles'
    },
    { 
      icon: User, 
      label: 'User Management', 
      path: '/users', 
      badge: null,
      description: 'Users, roles & permissions'
    },
    { 
      icon: CreditCard, 
      label: 'Payments', 
      path: '/payments', 
      badge: null,
      description: 'Payment links & transactions'
    },
    { 
      icon: Wallet, 
      label: 'Billing', 
      path: '/billing', 
      badge: null,
      description: 'Subscriptions & invoices'
    },
    { 
      icon: FileText, 
      label: 'Content', 
      path: '/content', 
      badge: 'New',
      description: 'Study materials & questions'
    },
    { 
      icon: MessageCircle, 
      label: 'Communication', 
      path: '/communication', 
      badge: '5',
      description: 'Messages & notifications'
    },
    { 
      icon: Zap, 
      label: 'Features', 
      path: '/features', 
      badge: 'New',
      description: 'Feature access control'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/analytics', 
      badge: null,
      description: 'Performance insights'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings', 
      badge: null,
      description: 'Institution configuration'
    },
  ];

  const quickStats = {
    studentsOnline: 89,
    monthlyRevenue: 2450000,
    activeStaff: 12,
    completionRate: 87
  };

  const isActive = (path: string) => {
    if (path === '') {
      return location.pathname === '';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-100 z-20 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 relative flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">{enterpriseData.logo}</span>
            </div>
            <div>
              <h1 className="font-bold text-dark text-lg">{enterpriseData.name}</h1>
              <div className="flex items-center space-x-2">
                <Crown className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-purple-600 font-medium">{enterpriseData.plan}</span>
              </div>
            </div>
          </div>
        ):(
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">{enterpriseData.logo}</span>
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

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-lg font-bold text-indigo-600">{quickStats.studentsOnline}</div>
              <div className="text-xs text-gray-600">Online Now</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-lg font-bold text-green-600">₦{(quickStats.monthlyRevenue / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-600">This Month</div>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Student Capacity</span>
              <span className="text-xs font-medium text-gray-700">
                {enterpriseData.currentStudents}/{enterpriseData.studentsLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(enterpriseData.currentStudents / enterpriseData.studentsLimit) * 100}%` }}
              ></div>
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
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
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
                        active ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full flex-shrink-0 ${
                        active 
                          ? 'bg-white text-indigo-500' 
                          : item.badge === 'New' 
                            ? 'bg-green-500 text-white'
                            : 'bg-indigo-500 text-white'
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
                    <div className="text-xs text-indigo-300 mt-1">
                      {item.badge === 'New' ? 'New Feature' : `${item.badge} items`}
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
        <div className={`${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed && (
            <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-1">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">System Status</span>
              </div>
              <div className="text-xs text-green-600">All systems operational</div>
            </div>
          )}
        </div>
        
        <button 
          className={`w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
          onClick={onLogout}
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

export default EnterpriseSidebar;