import React from 'react';

/**
 * ModuleCard Component
 * 
 * A reusable card component for calculator modules with consistent styling and controls
 */
const ModuleCard = ({ 
  title, 
  subtitle, 
  children, 
  isPaused = false, 
  isLocked = false,
  onPauseToggle,
  onLockToggle
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden mb-6 ${isPaused ? 'opacity-75' : ''}`}>
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex space-x-2">
          {onPauseToggle && (
            <button
              onClick={onPauseToggle}
              disabled={isLocked}
              className={`px-3 py-1 rounded text-sm font-medium ${
                isPaused 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              } disabled:opacity-50`}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          
          {onLockToggle && (
            <button
              onClick={onLockToggle}
              className={`px-3 py-1 rounded text-sm font-medium ${
                isLocked 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isLocked ? 'Unlock' : 'Lock'}
            </button>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        {isPaused && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
            This module is currently paused. Calculations are not being updated.
          </div>
        )}
        
        {isLocked && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded mb-4">
            This module is locked. Parameters cannot be changed.
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default ModuleCard; 