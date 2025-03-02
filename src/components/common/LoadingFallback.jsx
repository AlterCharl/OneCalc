import React from 'react';

/**
 * Loading Fallback Component
 * Displays a loading indicator when components are being lazy-loaded
 */
const LoadingFallback = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default LoadingFallback; 