import React, { memo } from 'react';
import Slider from '../../common/Slider';

/**
 * Salary Controls Component
 * Handles the UI controls for setting salaries by employee type
 */
const SalaryControls = ({ 
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
        label="Executive Salary (average)"
        min={100000}
        max={500000}
        step={10000}
        value={params.executiveSalary}
        onChange={(value) => handleParamChange('executiveSalary', value)}
        valuePrefix="$"
        disabled={isLocked}
      />
      
      <Slider
        label="Manager Salary (average)"
        min={60000}
        max={250000}
        step={5000}
        value={params.managerSalary}
        onChange={(value) => handleParamChange('managerSalary', value)}
        valuePrefix="$"
        disabled={isLocked}
      />
      
      <Slider
        label="Developer Salary (average)"
        min={40000}
        max={200000}
        step={5000}
        value={params.developerSalary}
        onChange={(value) => handleParamChange('developerSalary', value)}
        valuePrefix="$"
        disabled={isLocked}
      />
      
      <Slider
        label="Support Staff Salary (average)"
        min={30000}
        max={150000}
        step={5000}
        value={params.supportStaffSalary}
        onChange={(value) => handleParamChange('supportStaffSalary', value)}
        valuePrefix="$"
        disabled={isLocked}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(SalaryControls); 