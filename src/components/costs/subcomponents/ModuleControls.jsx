import React, { memo } from 'react';

/**
 * Module Controls Component
 * Provides lock/unlock and pause/resume functionality for the module
 */
const ModuleControls = ({
  isLocked,
  isPaused,
  onToggleLock,
  onTogglePause
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        className={`px-3 py-1 rounded text-sm flex items-center ${
          isLocked
            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={onToggleLock}
      >
        <span className="material-symbols-outlined text-sm mr-1">
          {isLocked ? 'lock' : 'lock_open'}
        </span>
        {isLocked ? 'Unlock' : 'Lock'}
      </button>
      
      <button
        className={`px-3 py-1 rounded text-sm flex items-center ${
          isPaused
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
        onClick={onTogglePause}
      >
        <span className="material-symbols-outlined text-sm mr-1">
          {isPaused ? 'play_arrow' : 'pause'}
        </span>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ModuleControls); 