import React, { memo } from 'react';

/**
 * Reusable Slider Component
 * A slider control with label and current value display
 */
const Slider = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  valuePrefix = '',
  valueSuffix = '',
  disabled = false
}) => {
  // Format the displayed value
  const formattedValue = () => {
    let formatted = value;
    
    // Add thousands separators for large numbers
    if (typeof value === 'number' && value >= 1000) {
      formatted = value.toLocaleString('en-US');
    }
    
    return `${valuePrefix}${formatted}${valueSuffix}`;
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-gray-900">
          {formattedValue()}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{valuePrefix}{min}{valueSuffix}</span>
        <span>{valuePrefix}{max}{valueSuffix}</span>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(Slider); 