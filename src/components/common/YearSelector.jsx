import React from 'react';

/**
 * YearSelector component - Allows selecting a year from the provided options
 * 
 * @param {Object} props Component props
 * @param {Array} props.years Array of years to select from
 * @param {string|number} props.selectedYear Currently selected year
 * @param {Function} props.onChange Callback when year changes (preferred prop name)
 * @param {Function} props.onYearChange Alternative callback name for backward compatibility
 */
const YearSelector = ({ 
  years = ['2026', '2027', '2028', '2029'], 
  selectedYear = '2026',
  onChange,
  onYearChange
}) => {
  // For compatibility, use either onChange or onYearChange
  const handleYearChange = (year) => {
    // Call whichever function is provided, preferring onChange
    if (typeof onChange === 'function') {
      onChange(year);
    } else if (typeof onYearChange === 'function') {
      onYearChange(year);
    } else {
      console.warn('YearSelector: Neither onChange nor onYearChange prop provided');
    }
  };

  return (
    <div className="year-selector inline-flex rounded-md shadow-sm">
      {years.map(year => (
        <button
          key={year}
          type="button"
          onClick={() => handleYearChange(year)}
          className={`
            px-3 py-1 text-sm font-medium
            ${selectedYear === year 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
            }
            ${years.indexOf(year) === 0 ? 'rounded-l-md' : ''}
            ${years.indexOf(year) === years.length - 1 ? 'rounded-r-md' : ''}
            border border-gray-300
            focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500
          `}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

export default YearSelector; 