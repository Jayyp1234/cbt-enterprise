import React, { useState, useEffect } from 'react';
import { 
  Zap, Users, BookOpen, Target, MessageCircle, 
  Trophy, BarChart3, CreditCard, Bell, Settings,
  Shield, Globe, Calculator, Microscope, Save,
  RefreshCw, Eye, EyeOff, Lock, Unlock, Crown
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import { 
  useGetFeatureCategoriesQuery, 
  useGetFeatureStatsQuery,
  useSaveFeatureChangesMutation,
  useUpdateCategoryFeaturesMutation,
  FeatureCategory,
  fallbackFeatureCategories,
  fallbackFeatureStats
} from '../../store/services/featuresApi';

const FeatureManagement: React.FC = () => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch feature data using RTK Query
  const { 
    data: featureCategories = fallbackFeatureCategories, 
    isLoading: isLoadingFeatures, 
    error: featuresError 
  } = useGetFeatureCategoriesQuery({});

  // Fetch feature stats
  const { 
    data: featureStats = fallbackFeatureStats, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useGetFeatureStatsQuery();

  // Mutations
  const [saveFeatureChanges, { isLoading: isSaving }] = useSaveFeatureChangesMutation();
  const [updateCategoryFeatures, { isLoading: isUpdatingCategory }] = useUpdateCategoryFeaturesMutation();

  // Local state for features
  const [features, setFeatures] = useState<FeatureCategory[]>(fallbackFeatureCategories);

  // Update local state when API data is loaded
  useEffect(() => {
    if (featureCategories) {
      setFeatures(featureCategories);
    }
  }, [featureCategories]);

  const toggleFeature = (categoryId: string, featureId: string) => {
    setFeatures(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          features: category.features.map(feature => {
            if (feature.id === featureId) {
              return { ...feature, enabled: !feature.enabled };
            }
            return feature;
          })
        };
      }
      return category;
    }));
    setHasChanges(true);
  };

  const enableAllInCategory = (categoryId: string) => {
    setFeatures(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          features: category.features.map(feature => ({ ...feature, enabled: true }))
        };
      }
      return category;
    }));
    setHasChanges(true);
  };

  const disableAllInCategory = (categoryId: string) => {
    setFeatures(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          features: category.features.map(feature => ({ ...feature, enabled: false }))
        };
      }
      return category;
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      await saveFeatureChanges(features).unwrap();
      setHasChanges(false);
      setShowSaveModal(false);
      // Show success message
    } catch (error) {
      console.error('Failed to save feature changes:', error);
      // Show error message
    }
  };

  const resetChanges = () => {
    if (featureCategories) {
      setFeatures(featureCategories);
    }
    setHasChanges(false);
  };

  const getTotalEnabledFeatures = () => {
    return features.reduce((total, category) => {
      return total + category.features.filter(feature => feature.enabled).length;
    }, 0);
  };

  const getTotalFeatures = () => {
    return features.reduce((total, category) => total + category.features.length, 0);
  };

  const getTotalPremiumEnabledFeatures = () => {
    return features.reduce((total, category) => {
      return total + category.features.filter(f => f.premium && f.enabled).length;
    }, 0);
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.FC<any>> = {
      Zap, Users, BookOpen, Target, MessageCircle, Trophy, BarChart3, 
      CreditCard, Bell, Settings, Shield, Globe, Calculator, Eye, EyeOff
    };
    return icons[iconName] || Settings;
  };

  // Loading state
  if (isLoadingFeatures || isLoadingStats) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton width={300} height={32} className="mb-2" />
            <Skeleton width={400} height={20} />
          </div>
          <Skeleton width={150} height={40} />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center space-x-3">
                <Skeleton width={48} height={48} variant="rectangular" className="rounded-lg" />
                <div>
                  <Skeleton width={80} height={32} className="mb-1" />
                  <Skeleton width={120} height={16} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Feature Categories Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Skeleton width={48} height={48} variant="rectangular" className="rounded-lg" />
                  <div>
                    <Skeleton width={200} height={24} className="mb-2" />
                    <Skeleton width={300} height={16} />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton width={100} height={36} />
                  <Skeleton width={100} height={36} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} height={120} className="rounded-lg" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state - use fallback data
  if (featuresError || statsError) {
    console.error('Features API error:', featuresError);
    console.error('Stats API error:', statsError);
    // Continue with fallback data, already set in the API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Feature Management</h1>
          <p className="text-gray-600">Control which features your students can access</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Button variant="outline" onClick={resetChanges}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Changes
            </Button>
          )}
          <Button 
            onClick={() => setShowSaveModal(true)}
            disabled={!hasChanges}
            className={hasChanges ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {getTotalEnabledFeatures()}
              </div>
              <div className="text-sm text-gray-600">Enabled Features</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {getTotalFeatures()}
              </div>
              <div className="text-sm text-gray-600">Total Features</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {getTotalPremiumEnabledFeatures()}
              </div>
              <div className="text-sm text-gray-600">Premium Features</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {featureStats.affectedStudents}
              </div>
              <div className="text-sm text-gray-600">Affected Students</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Feature Categories */}
      <div className="space-y-6">
        {features.map((category) => {
          const CategoryIcon = getIconComponent(category.icon);
          const enabledCount = category.features.filter(f => f.enabled).length;
          const totalCount = category.features.length;
          
          return (
            <Card key={category.id} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${category.color} rounded-lg`}>
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {enabledCount} of {totalCount} permissions enabled
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => enableAllInCategory(category.id)}
                    disabled={isUpdatingCategory}
                  >
                    Enable All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disableAllInCategory(category.id)}
                    disabled={isUpdatingCategory}
                  >
                    Disable All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.features.map((feature) => {
                  const FeatureIcon = getIconComponent(feature.icon);
                  
                  return (
                    <div 
                      key={feature.id}
                      className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                        feature.enabled 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                      onClick={() => toggleFeature(category.id, feature.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            feature.enabled ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <FeatureIcon className={`w-5 h-5 ${
                              feature.enabled ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-medium ${
                                feature.enabled ? 'text-green-800' : 'text-gray-600'
                              }`}>
                                {feature.name}
                              </h4>
                              {feature.premium && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${
                              feature.enabled ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFeature(category.id, feature.id);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            feature.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              feature.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Save Changes Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Feature Changes"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Changes Summary</h4>
            <p className="text-blue-700 text-sm">
              You are about to update feature access for all {getTotalEnabledFeatures()} enabled features 
              across your {featureStats.affectedStudents} students. This change will take effect immediately.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Important Note</h4>
            <p className="text-yellow-700 text-sm">
              Students currently using disabled features will lose access immediately. 
              Make sure to communicate these changes to your students beforehand.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowSaveModal(false)}
              className="flex-1"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
              className="flex-1 bg-green-500 hover:bg-green-600"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Confirm Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeatureManagement;