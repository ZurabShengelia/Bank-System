import React from 'react';
const SkeletonLoader = ({ count = 3, type = 'transaction' }) => {
  if (type === 'transaction') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-1/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'card') {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-12 bg-gray-300 rounded w-1/2 mb-6"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
      </div>
    );
  }
  return null;
};
export default SkeletonLoader;

