import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, Edit3, 
  Trash2, UserPlus, Users, Mail, Phone,
  Calendar, CheckCircle, XCircle, MoreHorizontal
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { 
  useGetStudentListQuery, 
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useBulkUpdateStudentsMutation,
  StudentFilters
} from '../../../store/services/studentsApi';

const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Create filters object for the query
  const filters: StudentFilters = {
    class: selectedClass !== 'All' ? selectedClass : undefined,
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
    search: searchQuery || undefined,
    page: currentPage,
    limit: itemsPerPage
  };

  // Fetch students data using RTK Query
  const { 
    data: studentData, 
    isLoading, 
    isFetching, 
    error 
  } = useGetStudentListQuery(filters);

  // Mutations
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [bulkUpdateStudents, { isLoading: isBulkUpdating }] = useBulkUpdateStudentsMutation();

  // Reset selected students when filters change
  useEffect(() => {
    setSelectedStudents([]);
  }, [selectedClass, selectedStatus, searchQuery, currentPage]);

  const classes = ['All', 'SS1', 'SS2', 'SS3', 'JSS1', 'JSS2', 'JSS3'];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  const students = studentData?.students || [];
  const totalStudents = studentData?.total || 0;
  const totalPages = studentData?.totalPages || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 80) return 'text-green-600';
    if (performance >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(prev => prev.filter(studentId => studentId !== id));
    } else {
      setSelectedStudents(prev => [...prev, id]);
    }
  };

  const handleBulkActions = () => {
    if (selectedStudents.length > 0) {
      navigate('/students/bulk-actions', { 
        state: { selectedStudents: selectedStudents.map(id => students.find(s => s.id === id)) }
      });
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id).unwrap();
        // Success notification would go here
      } catch (err) {
        console.error('Failed to delete student:', err);
        // Error notification would go here
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} students?`)) {
      try {
        await bulkUpdateStudents({
          ids: selectedStudents,
          action: 'delete'
        }).unwrap();
        setSelectedStudents([]);
        // Success notification would go here
      } catch (err) {
        console.error('Failed to delete students:', err);
        // Error notification would go here
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Student Management</h1>
          <p className="text-gray-600">{totalStudents} students found</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowBulkImportModal(true)}>
            <Download className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
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
              <div className="text-2xl font-bold text-dark">{totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
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
                {students.filter(s => s.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {students.filter(s => s.paymentStatus === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Payments</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {students.length > 0 
                  ? Math.round(students.reduce((acc, s) => acc + s.performance, 0) / students.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Performance</div>
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
              placeholder="Search students by name or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
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
        {selectedStudents.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedStudents.length} student(s) selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleBulkActions}>
                  Bulk Actions
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedStudents([])}>
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
            <p className="text-gray-600">Loading student data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 border border-red-200">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-3xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-700 text-lg">Error Loading Students</h3>
              <p className="text-red-600">
                There was a problem loading the student data. Please try again later.
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

      {/* Students Table */}
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
                          setSelectedStudents(students.map(s => s.id));
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class & Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                          <div className="text-sm text-gray-500">{student.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.class}</div>
                      <div className="text-sm text-gray-500">
                        {student.subjects.slice(0, 2).join(', ')}
                        {student.subjects.length > 2 && ` +${student.subjects.length - 2} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getPerformanceColor(student.performance)}`}>
                        {student.performance}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            student.performance >= 80 ? 'bg-green-500' : 
                            student.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.performance}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(student.paymentStatus)}`}>
                        {student.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/students/${student.id}/edit`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteStudent(student.id)}
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
                  {Math.min(currentPage * itemsPerPage, totalStudents)}
                </span>{' '}
                of <span className="font-medium">{totalStudents}</span> results
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

      {/* Create Student Modal */}
      <CreateStudentModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onAddStudent={createStudent}
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

// Create Student Modal Component
const CreateStudentModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onAddStudent: (data: any) => Promise<any>;
  isLoading: boolean;
}> = ({ isOpen, onClose, onAddStudent, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    subjects: [] as string[],
  });

  const classes = ['SS1', 'SS2', 'SS3', 'JSS1', 'JSS2', 'JSS3'];
  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government'];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async () => {
    try {
      await onAddStudent(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        class: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        subjects: [],
      });
    } catch (err) {
      console.error('Failed to add student:', err);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Student" className="max-w-2xl">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter student's full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="student@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Email</label>
            <input
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="parent@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Phone</label>
            <input
              type="tel"
              value={formData.parentPhone}
              onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter student's address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Subjects</label>
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
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
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
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Import Students" className="max-w-lg">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-dark mb-2">Import Multiple Students</h3>
          <p className="text-gray-600">Upload a CSV or Excel file with student information</p>
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
            <li>• Class</li>
            <li>• Parent Email</li>
            <li>• Parent Phone</li>
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

export default StudentList;