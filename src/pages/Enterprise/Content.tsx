import React, { useState } from 'react';
import { 
  Plus, Upload, Edit3, Trash2, Eye, Download,
  BookOpen, Video, FileText, Image, Headphones,
  Search, Filter, Calendar, User, Tag, Star,
  Copy, Share2, MoreHorizontal, FolderPlus,
  Archive, RefreshCw, CheckCircle, XCircle,
  BarChart3
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { 
  useGetContentListQuery, 
  useGetQuestionListQuery,
  useCreateContentMutation,
  useCreateFolderMutation,
  useDeleteContentMutation,
  useBulkUpdateContentMutation,
  ContentFilters,
  QuestionFilters,
  fallbackContentItems,
  fallbackExamQuestions
} from '../../store/services/contentApi';

const Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Create filters for content
  const contentFilters: ContentFilters = {
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    search: searchQuery || undefined
  };

  // Create filters for questions
  const questionFilters: QuestionFilters = {
    search: searchQuery || undefined
  };

  // Fetch content data using RTK Query
  const { 
    data: contentData, 
    isLoading: isLoadingContent, 
    error: contentError,
    isError: isContentError
  } = useGetContentListQuery(contentFilters, {
    skip: activeTab !== 'materials'
  });

  // Fetch questions data using RTK Query
  const { 
    data: questionsData, 
    isLoading: isLoadingQuestions, 
    error: questionsError,
    isError: isQuestionsError
  } = useGetQuestionListQuery(questionFilters, {
    skip: activeTab !== 'questions'
  });

  // Mutations
  const [createContent, { isLoading: isCreatingContent }] = useCreateContentMutation();
  const [createFolder, { isLoading: isCreatingFolder }] = useCreateFolderMutation();
  const [deleteContent, { isLoading: isDeleting }] = useDeleteContentMutation();
  const [bulkUpdateContent, { isLoading: isBulkUpdating }] = useBulkUpdateContentMutation();

  // Use data from API or fallback to static data if there's an error
  const contentItems = contentData?.items || fallbackContentItems;
  const examQuestions = questionsData?.questions || fallbackExamQuestions;

  const categories = ['All', 'Study Materials', 'Video Lectures', 'Audio Content', 'Practical Guides', 'Past Questions'];
  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Government'];

  const filteredContent = contentItems;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return FileText;
      case 'Video': return Video;
      case 'Audio': return Headphones;
      case 'Image': return Image;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'text-red-600 bg-red-100';
      case 'Video': return 'text-blue-600 bg-blue-100';
      case 'Audio': return 'text-green-600 bg-green-100';
      case 'Image': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'text-green-600 bg-green-100';
      case 'Draft': return 'text-yellow-600 bg-yellow-100';
      case 'Archived': return 'text-gray-600 bg-gray-100';
      case 'Pending Review': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(item => item !== id));
    } else {
      setSelectedItems(prev => [...prev, id]);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return;
    
    try {
      await bulkUpdateContent({
        ids: selectedItems,
        action
      }).unwrap();
      setSelectedItems([]);
      // Success notification would go here
    } catch (error) {
      console.error(`Failed to perform ${action}:`, error);
      // Error notification would go here
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteContent(id).unwrap();
        // Success notification would go here
      } catch (error) {
        console.error('Failed to delete item:', error);
        // Error notification would go here
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Content Management</h1>
          <p className="text-gray-600">Manage study materials, questions, and educational content</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowCreateFolderModal(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">{contentItems.length}</div>
              <div className="text-sm text-gray-600">Total Materials</div>
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
                {contentItems.filter(item => item.status === 'Published').length}
              </div>
              <div className="text-sm text-gray-600">Published</div>
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
                {contentItems.filter(item => item.status === 'Draft').length}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {contentItems.reduce((sum, item) => sum + item.downloads, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'materials', label: 'Study Materials', icon: BookOpen },
          { id: 'questions', label: 'Question Bank', icon: FileText },
          { id: 'media', label: 'Media Library', icon: Image },
          { id: 'analytics', label: 'Content Analytics', icon: BarChart3 },
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

      {/* Content based on active tab */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">
                    {selectedItems.length} item(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>
                      Publish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                      Archive
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
          {isLoadingContent && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} hasImage={true} hasFooter={true} />
              ))}
            </div>
          )}

          {/* Content Grid */}
          {!isLoadingContent && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.length > 0 ? (
                filteredContent.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gray-200">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          />
                          {item.featured && (
                            <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                          {item.premium && (
                            <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-dark text-sm mb-2 line-clamp-2">{item.title}</h3>
                        
                        <div className="flex items-center space-x-2 mb-2 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span>{item.author}</span>
                          <span>•</span>
                          <span>{item.subject}</span>
                        </div>

                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{item.size}</span>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Download className="w-3 h-3 mr-1" />
                              {item.downloads}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {item.views}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isDeleting}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-8">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Content Found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || selectedCategory !== 'All' 
                      ? 'No content matches your search criteria. Try adjusting your filters.'
                      : 'You haven\'t added any content yet.'}
                  </p>
                  <Button onClick={() => setShowUploadModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Question Bank</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            {/* Loading State */}
            {isLoadingQuestions && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Skeleton width={100} height={20} />
                          <Skeleton width={80} height={20} className="rounded-full" />
                        </div>
                        <Skeleton width="90%" height={24} className="mb-2" />
                        <div className="flex items-center space-x-4 text-sm">
                          <Skeleton width={120} height={16} />
                          <Skeleton width={80} height={16} />
                          <Skeleton width={100} height={16} />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton width={32} height={32} variant="circular" />
                        <Skeleton width={32} height={32} variant="circular" />
                        <Skeleton width={32} height={32} variant="circular" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Questions List */}
            {!isLoadingQuestions && (
              <div className="space-y-4">
                {examQuestions.length > 0 ? (
                  examQuestions.map((question) => (
                    <Card key={question.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-dark">{question.subject}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{question.topic}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                              {question.status}
                            </span>
                          </div>
                          <h4 className="font-medium text-dark mb-2">{question.question}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>By {question.createdBy}</span>
                            <span>Used {question.usageCount} times</span>
                            <span>{question.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-8">
                    <div className="text-4xl mb-4">❓</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Questions Found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery 
                        ? 'No questions match your search criteria. Try adjusting your search.'
                        : 'You haven\'t added any questions yet.'}
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Upload Modal */}
      <UploadContentModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onUpload={createContent}
        isLoading={isCreatingContent}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal 
        isOpen={showCreateFolderModal} 
        onClose={() => setShowCreateFolderModal(false)} 
        onCreateFolder={createFolder}
        isLoading={isCreatingFolder}
      />
    </div>
  );
};

// Upload Content Modal Component
const UploadContentModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onUpload: (data: FormData) => Promise<any>;
  isLoading: boolean;
}> = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [uploadType, setUploadType] = useState('file');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: '',
    tags: '',
    featured: false,
    premium: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    
    // Add form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        data.append(key, value ? '1' : '0');
      } else {
        data.append(key, value);
      }
    });
    
    // Add file if selected
    if (selectedFile) {
      data.append('file', selectedFile);
    }
    
    try {
      await onUpload(data);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        category: '',
        tags: '',
        featured: false,
        premium: false
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to upload content:', error);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Content" className="max-w-2xl">
      <div className="space-y-6">
        {/* Upload Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Upload Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'file', label: 'File Upload', icon: Upload },
              { id: 'url', label: 'From URL', icon: Share2 },
              { id: 'create', label: 'Create New', icon: Plus }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setUploadType(type.id)}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  uploadType === type.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <type.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Area */}
        {uploadType === 'file' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600">
                <span className="font-medium text-primary-500">Click to upload</span> or drag and drop
              </div>
              <div className="text-sm text-gray-500 mt-1">PDF, DOC, PPT, MP4, MP3 files up to 100MB</div>
              {selectedFile && (
                <div className="mt-3 p-2 bg-blue-50 text-blue-700 rounded-lg">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </label>
          </div>
        )}

        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Content title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select subject</option>
              {/* {subjects.filter(s => s !== 'All').map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))} */}
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe the content..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select category</option>
              {/* {categories.filter(c => c !== 'All').map(category => (
                <option key={category} value={category}>{category}</option>
              ))} */}
              <option value="Study Materials">Study Materials</option>
              <option value="Video Lectures">Video Lectures</option>
              <option value="Audio Content">Audio Content</option>  
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Comma-separated tags"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Featured Content</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.premium}
              onChange={(e) => setFormData({...formData, premium: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Premium Content</span>
          </label>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            disabled={isLoading || !formData.title}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Create Folder Modal Component
const CreateFolderModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onCreateFolder: (data: any) => Promise<any>;
  isLoading: boolean;
}> = ({ isOpen, onClose, onCreateFolder, isLoading }) => {
  const [folderData, setFolderData] = useState({
    name: '',
    description: '',
    parent: '',
    permissions: 'public'
  });

  const handleSubmit = async () => {
    try {
      await onCreateFolder(folderData);
      onClose();
      // Reset form
      setFolderData({
        name: '',
        description: '',
        parent: '',
        permissions: 'public'
      });
    } catch (error) {
      console.error('Failed to create folder:', error);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Folder">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
          <input
            type="text"
            value={folderData.name}
            onChange={(e) => setFolderData({...folderData, name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter folder name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={folderData.description}
            onChange={(e) => setFolderData({...folderData, description: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Folder description (optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parent Folder</label>
          <select
            value={folderData.parent}
            onChange={(e) => setFolderData({...folderData, parent: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Root Directory</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            disabled={isLoading || !folderData.name}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Folder
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Content;