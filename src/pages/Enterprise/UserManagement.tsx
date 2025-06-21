import React, { useState } from 'react';
import { 
  Users, UserPlus, Shield, Key, Settings, 
  Search, Filter, Edit3, Trash2, Eye,
  CheckCircle, XCircle, Clock, Crown,
  Mail, Phone, Calendar, MoreHorizontal,
  Lock, Unlock, RefreshCw, Download,
  AlertTriangle, Award, Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import SkeletonTable from '../../components/ui/SkeletonTable';
import { 
  useGetUserListQuery, 
  useGetRolesQuery,
  useGetPermissionsQuery,
  useGetActivityLogsQuery,
  useCreateUserMutation,
  useCreateRoleMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkUpdateUsersMutation,
  UserFilters,
  ActivityFilters
} from '../../store/services/userManagementApi';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Create filters for users
  const userFilters: UserFilters = {
    role: selectedRole !== 'All' ? selectedRole : undefined,
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
    search: searchQuery || undefined
  };

  // Create filters for activity logs
  const activityFilters: ActivityFilters = {
    // No filters for now
  };

  // Fetch users data using RTK Query
  const { 
    data: userData, 
    isLoading: isLoadingUsers, 
    error: userError 
  } = useGetUserListQuery(userFilters, {
    skip: activeTab !== 'users'
  });

  // Fetch roles data using RTK Query
  const { 
    data: rolesData, 
    isLoading: isLoadingRoles, 
    error: rolesError 
  } = useGetRolesQuery(undefined, {
    skip: activeTab !== 'roles'
  });

  // Fetch permissions data using RTK Query
  const { 
    data: permissionsData, 
    isLoading: isLoadingPermissions 
  } = useGetPermissionsQuery(undefined, {
    skip: activeTab !== 'roles'
  });

  // Fetch activity logs using RTK Query
  const { 
    data: activityLogsData, 
    isLoading: isLoadingActivityLogs, 
    error: activityLogsError 
  } = useGetActivityLogsQuery(activityFilters, {
    skip: activeTab !== 'activity'
  });

  // Mutations
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [bulkUpdateUsers, { isLoading: isBulkUpdating }] = useBulkUpdateUsersMutation();

  const users = userData?.users || [];
  const roles = rolesData || [];
  const permissions = permissionsData || [];
  const activityLogs = activityLogsData?.logs || [];

  const roleOptions = ['All', 'Principal', 'Vice Principal', 'Instructor', 'Supervisor', 'Admin Staff'];
  const statusOptions = ['All', 'Active', 'Inactive', 'Suspended', 'Pending'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      case 'Suspended': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
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

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'view': return '👁️';
      case 'payment': return '💰';
      default: return '📝';
    }
  };

  const handleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(prev => prev.filter(userId => userId !== id));
    } else {
      setSelectedUsers(prev => [...prev, id]);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    try {
      await bulkUpdateUsers({
        ids: selectedUsers,
        action
      }).unwrap();
      setSelectedUsers([]);
      // Success notification would go here
    } catch (error) {
      console.error(`Failed to perform ${action}:`, error);
      // Error notification would go here
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        // Success notification would go here
      } catch (error) {
        console.error('Failed to delete user:', error);
        // Error notification would go here
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowRoleModal(true)}>
            <Shield className="w-4 h-4 mr-2" />
            Manage Roles
          </Button>
          <Button onClick={() => setShowAddUserModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {users.filter(u => u.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">{roles.length}</div>
              <div className="text-sm text-gray-600">User Roles</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {users.filter(u => u.lastLogin.includes('hour')).length}
              </div>
              <div className="text-sm text-gray-600">Online Today</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'roles', label: 'Roles & Permissions', icon: Shield },
          { id: 'activity', label: 'Activity Logs', icon: Activity },
          { id: 'security', label: 'Security', icon: Lock },
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

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">
                    {selectedUsers.length} user(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                      Activate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                      Suspend
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Loading State */}
          {isLoadingUsers && (
            <SkeletonTable rows={5} columns={6} />
          )}

          {/* Users Table */}
          {!isLoadingUsers && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(users.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role & Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                              {user.avatar}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{user.department}</div>
                          <div className="text-sm text-gray-500">{user.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{user.loginCount} logins</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.lastLogin}
                          <div className="text-xs text-gray-500">Joined {user.joinDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <Key className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">User Roles</h3>
              <Button onClick={() => setShowRoleModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </div>

            {/* Loading State */}
            {isLoadingRoles && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Skeleton width={120} height={24} className="mb-1" />
                        <Skeleton width={80} height={20} className="rounded-full" />
                      </div>
                      <Skeleton width={40} height={24} />
                    </div>
                    <Skeleton width="90%" height={16} className="mb-3" />
                    <div className="space-y-2">
                      <Skeleton width={100} height={16} />
                      <div className="flex flex-wrap gap-1">
                        <Skeleton width={60} height={24} className="rounded-full" />
                        <Skeleton width={80} height={24} className="rounded-full" />
                        <Skeleton width={70} height={24} className="rounded-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Roles Grid */}
            {!isLoadingRoles && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <Card key={role.id} className="p-4 border-l-4" style={{ borderLeftColor: role.color.replace('bg-', '#') }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-dark">{role.name}</h4>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {role.level}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{role.userCount}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700">Permissions:</h5>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Permissions Matrix */}
          {!isLoadingRoles && !isLoadingPermissions && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-dark mb-4">Permissions Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Permission</th>
                      {roles.map((role) => (
                        <th key={role.id} className="text-center py-3 px-4 font-medium text-gray-700">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission) => (
                      <tr key={permission.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{permission.name}</div>
                            <div className="text-sm text-gray-500">{permission.category}</div>
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={role.id} className="text-center py-3 px-4">
                            {role.permissions.includes(permission.name) ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">User Activity Logs</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingActivityLogs && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Skeleton width={40} height={40} variant="circular" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Skeleton width={120} height={20} />
                          <Skeleton width={100} height={16} />
                        </div>
                        <Skeleton width="90%" height={16} className="mb-2" />
                        <Skeleton width={200} height={12} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activity Logs */}
            {!isLoadingActivityLogs && (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getActionIcon(log.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-dark">{log.user}</h4>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{log.action}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{log.timestamp}</span>
                            <span>IP: {log.ip}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Security Settings</h3>
            
            <div className="space-y-6">
              {/* Password Policy */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-dark mb-3">Password Policy</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Minimum 8 characters', enabled: true },
                    { label: 'Require uppercase letters', enabled: true },
                    { label: 'Require lowercase letters', enabled: true },
                    { label: 'Require numbers', enabled: true },
                    { label: 'Require special characters', enabled: false },
                    { label: 'Password expiry (90 days)', enabled: true }
                  ].map((policy, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{policy.label}</span>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          policy.enabled ? 'bg-primary-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            policy.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Management */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-dark mb-3">Session Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Concurrent Sessions</label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-dark">Two-Factor Authentication</h4>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
                  </button>
                </div>
                <p className="text-sm text-gray-600">Require 2FA for all administrative accounts</p>
              </div>

              {/* IP Restrictions */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-dark mb-3">IP Access Control</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allowed IP Addresses</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter IP addresses or ranges, one per line"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Enable IP restrictions</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)} 
        onAddUser={createUser}
        isLoading={isCreatingUser}
      />

      {/* Role Management Modal */}
      <RoleManagementModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)} 
        onCreateRole={createRole}
        isLoading={isCreatingRole}
        permissions={permissions}
      />
    </div>
  );
};

// Add User Modal Component
const AddUserModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onAddUser: (data: any) => Promise<any>;
  isLoading: boolean;
}> = ({ isOpen, onClose, onAddUser, isLoading }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    location: '',
    sendInvite: true,
    permissions: [] as string[]
  });

  const roles = ['Principal', 'Vice Principal', 'Instructor', 'Supervisor', 'Admin Staff'];
  const departments = ['Administration', 'Academic', 'Finance', 'IT Support'];
  const locations = ['Lagos Office', 'Abuja Branch', 'Port Harcourt Branch'];

  const handleSubmit = async () => {
    try {
      await onAddUser(userData);
      onClose();
      // Reset form
      setUserData({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        location: '',
        sendInvite: true,
        permissions: []
      });
    } catch (error) {
      console.error('Failed to add user:', error);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" className="max-w-3xl">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="user@brightstars.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={userData.role}
              onChange={(e) => setUserData({...userData, role: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={userData.department}
              onChange={(e) => setUserData({...userData, department: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={userData.location}
              onChange={(e) => setUserData({...userData, location: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={userData.sendInvite}
            onChange={(e) => setUserData({...userData, sendInvite: e.target.checked})}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Send invitation email to user</span>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            disabled={isLoading || !userData.name || !userData.email || !userData.role}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Role Management Modal Component
const RoleManagementModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onCreateRole: (data: any) => Promise<any>;
  isLoading: boolean;
  permissions: Permission[];
}> = ({ isOpen, onClose, onCreateRole, isLoading, permissions }) => {
  const [roleData, setRoleData] = useState({
    name: '',
    description: '',
    level: 'Staff',
    permissions: [] as string[]
  });

  const levels = ['Super Admin', 'Admin', 'Staff', 'Support'];

  const handlePermissionToggle = (permissionId: string) => {
    if (roleData.permissions.includes(permissionId)) {
      setRoleData({
        ...roleData,
        permissions: roleData.permissions.filter(p => p !== permissionId)
      });
    } else {
      setRoleData({
        ...roleData,
        permissions: [...roleData.permissions, permissionId]
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await onCreateRole(roleData);
      onClose();
      // Reset form
      setRoleData({
        name: '',
        description: '',
        level: 'Staff',
        permissions: []
      });
    } catch (error) {
      console.error('Failed to create role:', error);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Role" className="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
          <input
            type="text"
            value={roleData.name}
            onChange={(e) => setRoleData({...roleData, name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter role name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={roleData.description}
            onChange={(e) => setRoleData({...roleData, description: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe the role and its responsibilities"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
          <select
            value={roleData.level}
            onChange={(e) => setRoleData({...roleData, level: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{permission.name}</div>
                  <div className="text-sm text-gray-500">{permission.category}</div>
                </div>
                <input
                  type="checkbox"
                  checked={roleData.permissions.includes(permission.id)}
                  onChange={() => handlePermissionToggle(permission.id)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            disabled={isLoading || !roleData.name}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Create Role
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserManagement;