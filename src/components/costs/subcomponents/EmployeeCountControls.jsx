import React, { memo } from 'react';
import Slider from '../../common/Slider';

/**
 * Employee Count Controls Component
 * Handles the UI controls for setting employee counts by type
 */
const EmployeeCountControls = ({ 
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Slider
        label="Executives"
        min={0}
        max={10}
        step={1}
        value={params.executives}
        onChange={(value) => handleParamChange('executives', value)}
        disabled={isLocked}
      />
      
      <Slider
        label="Managers"
        min={0}
        max={50}
        step={1}
        value={params.managers}
        onChange={(value) => handleParamChange('managers', value)}
        disabled={isLocked}
      />
      
      <Slider
        label="Developers"
        min={0}
        max={200}
        step={5}
        value={params.developers}
        onChange={(value) => handleParamChange('developers', value)}
        disabled={isLocked}
      />
      
      <Slider
        label="Support Staff"
        min={0}
        max={100}
        step={5}
        value={params.supportStaff}
        onChange={(value) => handleParamChange('supportStaff', value)}
        disabled={isLocked}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(EmployeeCountControls); 