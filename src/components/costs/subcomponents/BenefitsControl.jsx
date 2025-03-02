import React, { memo } from 'react';
import Slider from '../../common/Slider';

/**
 * Benefits Control Component
 * Handles the UI control for setting benefits percentage
 */
const BenefitsControl = ({ 
  params, 
  selectedYear, 
  onParamChange,
  isLocked 
}) => {
  // Handler for parameter changes
  const handleParamChange = (paramName, value) => {
    if (!isLocked) {
      onParamChange(paramName, value);
    }
  };

  return (
    <div className="mb-6">
      <Slider
        label="Benefits (% of base salary)"
        min={0}
        max={50}
        step={1}
        value={params.benefitsPercent}
        onChange={(value) => handleParamChange('benefitsPercent', value)}
        valueSuffix="%"
        disabled={isLocked}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(BenefitsControl); 