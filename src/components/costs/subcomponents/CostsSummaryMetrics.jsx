import React, { memo } from 'react';

/**
 * Costs Summary Metrics Component
 * Displays summary metrics for employee costs
 */
const CostsSummaryMetrics = ({ 
  calculationResults,
  selectedYear 
}) => {
  // Format currency values with commas and dollar sign
  const formatCurrency = (value) => {
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // Check if we have valid data to display
  if (!calculationResults || !calculationResults.employeeCountsByYear) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Employees</div>
            <div className="text-2xl font-bold">-</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Average Salary</div>
            <div className="text-2xl font-bold">-</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Cost</div>
            <div className="text-2xl font-bold">-</div>
          </div>
        </div>
      </div>
    );
  }

  // Get the metrics for the selected year
  const employeeCount = calculationResults.employeeCountsByYear[selectedYear] || 0;
  const averageSalary = calculationResults.averageSalaryByYear[selectedYear] || 0;
  const totalCost = calculationResults.totalCostsByYear[selectedYear] || 0;
  
  // Get the year-to-year change if available
  const prevYear = selectedYear > 2026 ? selectedYear - 1 : null;
  const prevEmployeeCount = prevYear ? (calculationResults.employeeCountsByYear[prevYear] || 0) : 0;
  const prevTotalCost = prevYear ? (calculationResults.totalCostsByYear[prevYear] || 0) : 0;
  
  // Calculate percentage changes
  const employeeCountChange = prevEmployeeCount > 0 
    ? ((employeeCount - prevEmployeeCount) / prevEmployeeCount * 100).toFixed(1) 
    : null;
  
  const totalCostChange = prevTotalCost > 0 
    ? ((totalCost - prevTotalCost) / prevTotalCost * 100).toFixed(1) 
    : null;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Total Employees</div>
          <div className="text-2xl font-bold">
            {employeeCount.toLocaleString()}
          </div>
          {employeeCountChange !== null && prevYear && (
            <div className="text-amber-600 font-medium">
              {employeeCountChange > 0 ? '+' : ''}{employeeCountChange}% from {prevYear}
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Average Salary</div>
          <div className="text-2xl font-bold">
            {formatCurrency(averageSalary)}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Total Cost</div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalCost)}
          </div>
          {totalCostChange !== null && prevYear && (
            <div className="text-amber-600 font-medium">
              {totalCostChange > 0 ? '+' : ''}{totalCostChange}% from {prevYear}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CostsSummaryMetrics); 