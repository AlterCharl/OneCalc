import React from 'react';

/**
 * LockToggle - A toggle component to include/exclude a module from dashboard calculations
 * 
 * @param {Object} props
 * @param {boolean} props.isLocked - Whether the module is locked (excluded from calculations)
 * @param {function} props.onToggle - Function to call when toggle is clicked
 */
const LockToggle = ({ isLocked, onToggle }) => {
  return (
    <div className="flex items-center">
      <button
        onClick={onToggle}
        className="flex items-center text-sm font-medium"
        aria-label={isLocked ? "Unlock module" : "Lock module"}
      >
        <span className={`mr-2 ${isLocked ? 'text-red-500' : 'text-green-500'}`}>
          {isLocked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
          )}
        </span>
        <span className={isLocked ? 'text-red-500' : 'text-green-500'}>
          {isLocked ? 'Excluded from Dashboard' : 'Included in Dashboard'}
        </span>
      </button>
    </div>
  );
};

export default LockToggle; 