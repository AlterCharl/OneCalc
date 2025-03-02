import React, { useState, useEffect, useCallback, useRef, memo } from 'react';

/**
 * SliderControl - A standardized component for financial inputs
 * 
 * @param {Object} props
 * @param {string} props.label - The label for the slider
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {number} props.value - Current value
 * @param {function} props.onChange - Function to call when value changes
 * @param {string} props.unit - Unit of measurement (e.g. 'R', '%')
 * @param {string} props.tooltip - Tooltip text explaining the parameter
 * @param {boolean} props.disabled - Whether the control is disabled
 */
const SliderControl = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = '',
  tooltip,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debounceTimerRef = useRef(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce function to prevent excessive updates
  const debounceChange = useCallback((newValue) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 50); // 50ms debounce
  }, [onChange]);

  // Handle slider change with debounce
  const handleSliderChange = useCallback((e) => {
    const newValue = parseFloat(e.target.value);
    setInputValue(newValue);
    debounceChange(newValue);
  }, [debounceChange]);

  // Handle input field change with validation and debounce
  const handleInputChange = useCallback((e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setInputValue(newValue);
      debounceChange(newValue);
    }
  }, [min, max, debounceChange]);

  // Memoize the format function to prevent unnecessary recalculations
  const formatValue = useCallback((val) => {
    return unit === 'R' 
      ? `${unit}${val.toLocaleString()}`
      : `${val.toLocaleString()}${unit}`;
  }, [unit]);

  // Clean up any pending timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          {label}
          {tooltip && (
            <span className="ml-1 relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 w-48 hidden group-hover:block z-10">
                {tooltip}
              </div>
            </span>
          )}
        </label>
        <div className="w-24">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full text-right p-1 border rounded"
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-xs mr-2">{formatValue(min)}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={inputValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={disabled}
        />
        <span className="text-xs ml-2">{formatValue(max)}</span>
      </div>
      <div className="text-center text-sm mt-1 font-medium text-blue-600">
        {formatValue(inputValue)}
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(SliderControl); 