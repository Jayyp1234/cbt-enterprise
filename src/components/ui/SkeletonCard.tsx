import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonCardProps {
  hasImage?: boolean;
  hasFooter?: boolean;
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = false,
  hasFooter = false,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {hasImage && (
        <Skeleton height={200} className="w-full" />
      )}
      <div className="p-4">
        <Skeleton height={24} width="70%" className="mb-3" />
        <Skeleton height={16} className="mb-2" />
        <Skeleton height={16} width="90%" className="mb-2" />
        <Skeleton height={16} width="80%" className="mb-4" />
        
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton variant="circular" height={24} width={24} />
          <Skeleton height={16} width={100} />
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Skeleton height={24} width={60} className="rounded-full" />
          <Skeleton height={24} width={80} className="rounded-full" />
          <Skeleton height={24} width={70} className="rounded-full" />
        </div>
      </div>
      
      {hasFooter && (
        <div className="border-t border-gray-100 p-4">
          <div className="flex justify-between">
            <Skeleton height={36} width={100} />
            <Skeleton height={36} width={100} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkeletonCard;