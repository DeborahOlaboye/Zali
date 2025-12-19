import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

interface LeaderboardSkeletonProps {
  count?: number;
}

export const LeaderboardSkeleton: React.FC<LeaderboardSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 bg-white"
        >
          <div className="flex items-center gap-4 flex-1">
            <BaseSkeleton width={48} height={48} rounded="full" />
            <div className="flex-1 space-y-2">
              <BaseSkeleton width="150px" height={20} />
              <BaseSkeleton width="120px" height={16} />
            </div>
          </div>
          <div className="space-y-2">
            <BaseSkeleton width="80px" height={24} />
            <BaseSkeleton width="80px" height={16} />
          </div>
        </div>
      ))}
    </div>
  );
};
