import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

interface RewardCardSkeletonProps {
  count?: number;
}

export const RewardCardSkeleton: React.FC<RewardCardSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <BaseSkeleton width={40} height={40} rounded="lg" />
            <BaseSkeleton width={60} height={24} rounded="full" />
          </div>
          <BaseSkeleton width="150px" height={20} className="mb-2" />
          <BaseSkeleton width="200px" height={28} className="mb-4" />
          <BaseSkeleton width="100%" height={36} rounded="lg" />
        </div>
      ))}
    </div>
  );
};
