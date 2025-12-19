import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const QuestionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <BaseSkeleton width="120px" height={16} />
          <BaseSkeleton width="80px" height={24} rounded="full" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>
      
      <div className="mb-6">
        <BaseSkeleton width="100%" height={32} className="mb-4" />
        <BaseSkeleton width="95%" height={24} />
      </div>
      
      <div className="space-y-3 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center p-3 rounded-lg border-2 border-gray-200">
            <BaseSkeleton width={40} height={40} rounded="full" className="mr-3 flex-shrink-0" />
            <BaseSkeleton width="200px" height={16} className="flex-1" />
          </div>
        ))}
      </div>
      
      <div className="flex gap-4">
        <BaseSkeleton width="100%" height={44} rounded="lg" />
      </div>
    </div>
  );
};
