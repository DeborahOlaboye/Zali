import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export const PlayerInfoSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left flex-1">
          <BaseSkeleton width="120px" height={16} className="mb-2" />
          <BaseSkeleton width="250px" height={28} />
        </div>
        <div className="grid grid-cols-3 gap-6 w-full md:w-auto">
          <div className="text-center">
            <BaseSkeleton width="100px" height={16} className="mb-2" />
            <BaseSkeleton width="80px" height={24} />
          </div>
          <div className="text-center">
            <BaseSkeleton width="100px" height={16} className="mb-2" />
            <BaseSkeleton width="80px" height={24} />
          </div>
          <div className="text-center">
            <BaseSkeleton width="100px" height={16} className="mb-2" />
            <BaseSkeleton width="80px" height={24} />
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <BaseSkeleton width="200px" height={40} rounded="lg" className="mx-auto" />
      </div>
    </div>
  );
};
