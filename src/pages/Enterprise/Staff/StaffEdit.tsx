import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, X, Upload, User, Mail, 
  Phone, MapPin, Calendar, BookOpen, Shield,
  DollarSign, Award, Settings
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const StaffEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock staff data - in real app, fetch based on ID
  const [formData, setFormData] = useState({
    name: 'Dr. Sarah Adebayo',
    email: 'sarah@brightstars.com',
    phone: '+234 801 234 5678',
    role: 'Principal',
    department: 'Administration',
    subjects: ['Mathematics', 'Physics'],
    status: 'Active',
    employeeId: 'EMP001',
    salary: '450000',
    address: '45 Victoria Island, Lagos, Nigeria',
    dateOfBirth: '1985-06-15',
    gender: 'Female',
    startDate: '2023-09-01',
    emergencyContactName: 'Mr. Adebayo Johnson',
    emergencyContactPhone: '+234 803 123 4567',
    emergencyContactRelationship: 'Spouse',
    qualifications: [
      'Ph.D in Mathematics Education - University of Lagos (2015)',
      'M.Sc in Mathematics - University of Ibadan (2010)',
      'B.Sc in Mathematics - Obafemi Awolowo University (2008)'
    ],
    certifications: [
      'Certified Educational Administrator (2018)',
      'Leadership in Education Certificate (2020)',
      'Digital Learning Specialist (2022)'
    ]
  });

  const [hasChanges, setHasChanges] = useState(false);

  const roles = ['Principal', 'Vice Principal', 'Instructor', 'Supervisor', 'Admin Staff'];
  const departments = ['Administration', 'Academic', 'Finance', 'IT Support'];
  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government'];
  const statuses = ['Active', 'Inactive', 'Suspended', 'On Leave'];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubjectToggle = (subject: string) => {
    const updatedSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    
    handleChange('subjects', updatedSubjects);
  };

  const handleQualificationChange = (index: number, value: string) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index] = value;
    handleChange('qualifications', updatedQualifications);
  };

  const handleCertificationChange = (index: number, value: string) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = value;
    handleChange('certifications', updatedCertifications);
  };

  const addQualification = () => {
    handleChange('qualifications', [...formData.qualifications, '']);
  };

  const removeQualification = (index: number) => {
    const updatedQualifications = formData.qualifications.filter((_, i) => i !== index);
    handleChange('qualifications', updatedQualifications);
  };

  const addCertification = () => {
    handleChange('certifications', [...formData.certifications, '']);
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
    handleChange('certifications', updatedCertifications);
  };

  const handleSave = () => {
    // Save logic here
    console.log('Saving staff data:', formData);
    setHasChanges(false);
    navigate(`/staff/${id}`);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        navigate(`/staff/${id}`);
      }
    } else {
      navigate(`/staff/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Edit Staff Member</h1>
            <p className="text-gray-600">Employee ID: {formData.employeeId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={hasChanges ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleChange('employeeId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </Card>

      {/* Employment Information */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Employment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary (₦)</label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
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
      </Card>

      {/* Emergency Contact */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => handleChange('emergencyContactName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              value={formData.emergencyContactRelationship}
              onChange={(e) => handleChange('emergencyContactRelationship', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </Card>

      {/* Qualifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-dark">Qualifications</h3>
          <Button variant="outline" onClick={addQualification}>
            <Award className="w-4 h-4 mr-2" />
            Add Qualification
          </Button>
        </div>
        <div className="space-y-4">
          {formData.qualifications.map((qualification, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={qualification}
                onChange={(e) => handleQualificationChange(index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter qualification details"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeQualification(index)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Certifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-dark">Certifications</h3>
          <Button variant="outline" onClick={addCertification}>
            <Award className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
        <div className="space-y-4">
          {formData.certifications.map((certification, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={certification}
                onChange={(e) => handleCertificationChange(index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter certification details"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeCertification(index)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StaffEdit;