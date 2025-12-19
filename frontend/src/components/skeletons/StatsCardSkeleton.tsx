import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

interface StatsCardSkeletonProps {
  count?: number;
}

export const StatsCardSkeleton: React.FC<StatsCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100"
        >
          <BaseSkeleton width="100px" height={36} className="mx-auto mb-2" />
          <BaseSkeleton width="120px" height={16} className="mx-auto" />
        </div>
      ))}
    </div>
  );
};
