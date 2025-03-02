import React from 'react';

/**
 * CostRangeSlider - A custom slider component for cost ranges
 * Provides visual feedback for min-max ranges and updates the schema
 */
const CostRangeSlider = ({ 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange,
  minStep = 1000,
  maxStep = 1000,
  formatValue = (value) => value,
  disabled = false
}) => {
  // Calculate the lower and upper bounds for the sliders
  const minBound = 0;
  const maxBound = Math.max(maxValue * 3, minValue * 3, 1000000);
  
  // Calculate the percentage position for visual indicators
  const minPercent = ((minValue - minBound) / (maxBound - minBound)) * 100;
  const maxPercent = ((maxValue - minBound) / (maxBound - minBound)) * 100;
  
  return (
    <div className="space-y-4">
      <div className="relative pt-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cost Range
        </label>
        
        {/* Range track with colored segment */}
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{ 
              left: `${minPercent}%`, 
              width: `${maxPercent - minPercent}%` 
            }}
          ></div>
        </div>
        
        {/* Min value slider */}
        <div className="relative">
          <input
            type="range"
            className="absolute w-full h-2 opacity-0 cursor-pointer"
            min={minBound}
            max={maxBound}
            step={minStep}
            value={minValue}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              // Ensure min doesn't exceed max
              if (value <= maxValue) {
                onMinChange(value);
              }
            }}
            disabled={disabled}
          />
          
          {/* Min handle */}
          <div 
            className={`absolute w-5 h-5 rounded-full shadow border-2 border-white ${disabled ? 'bg-gray-400' : 'bg-blue-600'} -mt-1.5`}
            style={{ 
              left: `${minPercent}%`,
              transform: 'translateX(-50%)' 
            }}
          ></div>
        </div>
        
        {/* Max value slider */}
        <div className="relative">
          <input
            type="range"
            className="absolute w-full h-2 opacity-0 cursor-pointer"
            min={minBound}
            max={maxBound}
            step={maxStep}
            value={maxValue}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              // Ensure max doesn't go below min
              if (value >= minValue) {
                onMaxChange(value);
              }
            }}
            disabled={disabled}
          />
          
          {/* Max handle */}
          <div 
            className={`absolute w-5 h-5 rounded-full shadow border-2 border-white ${disabled ? 'bg-gray-400' : 'bg-blue-600'} -mt-1.5`}
            style={{ 
              left: `${maxPercent}%`,
              transform: 'translateX(-50%)' 
            }}
          ></div>
        </div>
      </div>
      
      {/* Value display */}
      <div className="flex justify-between">
        <div className="text-sm">
          <span className="text-gray-500">Min: </span>
          <span className="font-medium">{formatValue(minValue)}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Max: </span>
          <span className="font-medium">{formatValue(maxValue)}</span>
        </div>
      </div>
    </div>
  );
};

export default CostRangeSlider; 