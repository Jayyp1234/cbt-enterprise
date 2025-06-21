import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, Edit3, Trash2, 
  Shield, Users, Mail, Phone, BookOpen,
  Settings, UserCheck, UserX, MoreHorizontal,
  Download, Eye, Key, Ban, CheckCircle
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { 
  useGetStaffListQuery, 
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useBulkUpdateStaffMutation,
  StaffFilters
} from '../../../store/services/staffApi';

const StaffList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Create filters object for the query
  const filters: StaffFilters = {
    role: selectedRole !== 'All' ? selectedRole : undefined,
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
    search: searchQuery || undefined,
    page: currentPage,
    limit: itemsPerPage
  };

  // Fetch staff data using RTK Query
  const { 
    data: staffData, 
    isLoading, 
    isFetching, 
    error 
  } = useGetStaffListQuery(filters);

  // Mutations
  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [bulkUpdateStaff, { isLoading: isBulkUpdating }] = useBulkUpdateStaffMutation();

  // Reset selected staff when filters change
  useEffect(() => {
    setSelectedStaff([]);
  }, [selectedRole, selectedStatus, searchQuery, currentPage]);

  const roles = ['All', 'Principal', 'Vice Principal', 'Instructor', 'Supervisor', 'Admin Staff'];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended', 'On Leave'];

  const staffMembers = staffData?.staff || [];
  const totalStaff = staffData?.total || 0;
  const totalPages = staffData?.totalPages || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      case 'On Leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Principal': return 'bg-purple-100 text-purple-800';
      case 'Vice Principal': return 'bg-indigo-100 text-indigo-800';
      case 'Instructor': return 'bg-blue-100 text-blue-800';
      case 'Supervisor': return 'bg-green-100 text-green-800';
      case 'Admin Staff': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectStaff = (id: number) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(prev => prev.filter(staffId => staffId !== id));
    } else {
      setSelectedStaff(prev => [...prev, id]);
    }
  };

  const handleBulkActions = () => {
    if (selectedStaff.length > 0) {
      navigate('/staff/bulk-actions', { 
        state: { selectedStaff: selectedStaff.map(id => staffMembers.find(s => s.id === id)) }
      });
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaff(id).unwrap();
        // Success notification would go here
      } catch (err) {
        console.error('Failed to delete staff:', err);
        // Error notification would go here
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStaff.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedStaff.length} staff members?`)) {
      try {
        await bulkUpdateStaff({
          ids: selectedStaff,
          action: 'delete'
        }).unwrap();
        setSelectedStaff([]);
        // Success notification would go here
      } catch (err) {
        console.error('Failed to delete staff:', err);
        // Error notification would go here
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Staff Management</h1>
          <p className="text-gray-600">{totalStaff} staff members</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowBulkImportModal(true)}>
            <Download className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowAddStaffModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
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
              <div className="text-2xl font-bold text-dark">{totalStaff}</div>
              <div className="text-sm text-gray-600">Total Staff</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {staffMembers.filter(s => s.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Staff</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {staffMembers.filter(s => s.role === 'Instructor').length}
              </div>
              <div className="text-sm text-gray-600">Instructors</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {[...new Set(staffMembers.flatMap(s => s.subjects))].length}
              </div>
              <div className="text-sm text-gray-600">Subjects Covered</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
            ))}
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedStaff.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedStaff.length} staff member(s) selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleBulkActions}>
                  Bulk Actions
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedStaff([])}>
                  Clear Selection
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={handleBulkDelete}
                  disabled={isBulkUpdating}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600">Loading staff data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 border border-red-200">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-3xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-700 text-lg">Error Loading Staff</h3>
              <p className="text-red-600">
                There was a problem loading the staff data. Please try again later.
              </p>
              <Button 
                variant="outline" 
                className="mt-3 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Staff Table */}
      {!isLoading && !error && (
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
                          setSelectedStaff(staffMembers.map(s => s.id));
                        } else {
                          setSelectedStaff([]);
                        }
                      }}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
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
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(staff.id)}
                        onChange={() => handleSelectStaff(staff.id)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                          {staff.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.email}</div>
                          <div className="text-sm text-gray-500">{staff.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staff.role)}`}>
                          {staff.role}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{staff.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {staff.subjects.length > 0 ? (
                          <>
                            {staff.subjects.slice(0, 2).join(', ')}
                            {staff.subjects.length > 2 && ` +${staff.subjects.length - 2} more`}
                          </>
                        ) : (
                          <span className="text-gray-400">No subjects assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staff.lastLogin}
                      <div className="text-xs text-gray-500">Joined {staff.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/staff/${staff.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/staff/${staff.id}/edit`)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Staff"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/staff/${staff.id}/permissions`)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Manage Permissions"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteStaff(staff.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalStaff)}
                </span>{' '}
                of <span className="font-medium">{totalStaff}</span> results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isFetching}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Add Staff Modal */}
      <AddStaffModal 
        isOpen={showAddStaffModal} 
        onClose={() => setShowAddStaffModal(false)} 
        onAddStaff={createStaff}
        isLoading={isCreating}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal 
        isOpen={showBulkImportModal} 
        onClose={() => setShowBulkImportModal(false)} 
      />
    </div>
  );
};

// Add Staff Modal Component
const AddStaffModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onAddStaff: (data: any) => Promise<any>;
  isLoading: boolean;
}> = ({ isOpen, onClose, onAddStaff, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    subjects: [] as string[],
    permissions: [] as string[],
    salary: '',
    startDate: '',
  });

  const roles = ['Principal', 'Vice Principal', 'Instructor', 'Supervisor', 'Admin Staff'];
  const departments = ['Administration', 'Academic', 'Finance', 'IT Support'];
  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government'];
  const permissions = [
    'Manage Students',
    'Create Exams',
    'View Reports',
    'Manage Payments',
    'Send Notifications',
    'Manage Materials'
  ];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = async () => {
    try {
      await onAddStaff(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        subjects: [],
        permissions: [],
        salary: '',
        startDate: '',
      });
    } catch (err) {
      console.error('Failed to add staff:', err);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Staff Member" className="max-w-3xl">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter staff member's name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="staff@brightstars.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
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
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
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
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary (₦)</label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({...formData, salary: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="250000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Teaching Subjects</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map(subject => (
              <button
                key={subject}
                type="button"
                onClick={() => handleSubjectToggle(subject)}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                  formData.subjects.includes(subject)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {permissions.map(permission => (
              <label key={permission} className="flex items-center space-x-3 p-2">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{permission}</span>
              </label>
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Staff Member
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Bulk Import Modal Component
const BulkImportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Import Staff" className="max-w-lg">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-dark mb-2">Import Multiple Staff Members</h3>
          <p className="text-gray-600">Upload a CSV or Excel file with staff information</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input type="file" className="hidden" id="file-upload" accept=".csv,.xlsx,.xls" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-2">
              <div className="text-gray-400">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-gray-600">
                <span className="font-medium text-primary-500">Click to upload</span> or drag and drop
              </div>
              <div className="text-sm text-gray-500">CSV, XLSX files up to 10MB</div>
            </div>
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Required Columns</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Name (required)</li>
            <li>• Email (required)</li>
            <li>• Phone</li>
            <li>• Role</li>
            <li>• Department</li>
            <li>• Salary</li>
            <li>• Start Date</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StaffList;