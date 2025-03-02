import React, { memo } from 'react';

/**
 * Employee Cost Details Table Component
 * Displays detailed breakdown of costs for each employee type
 */
const EmployeeCostDetailsTable = ({ 
  calculationResults,
  selectedYear,
  params 
}) => {
  // Format currency values with commas and dollar sign
  const formatCurrency = (value) => {
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // Check if we have valid data to display
  if (!calculationResults || !calculationResults.detailedCostsByYear) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Employee Costs Breakdown</h3>
        <div className="bg-gray-50 p-4 text-center rounded-lg">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Get the detailed costs for the selected year
  const detailedCosts = calculationResults.detailedCostsByYear[selectedYear] || {};
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Employee Costs Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b text-left">Employee Type</th>
              <th className="py-2 px-4 border-b text-left">Count</th>
              <th className="py-2 px-4 border-b text-left">Base Salary</th>
              <th className="py-2 px-4 border-b text-left">Benefits ({params.benefitsPercent}%)</th>
              <th className="py-2 px-4 border-b text-left">Total per Employee</th>
              <th className="py-2 px-4 border-b text-left">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(detailedCosts).map(([type, data]) => (
              <tr key={type} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                <td className="py-2 px-4 border-b">{data.count}</td>
                <td className="py-2 px-4 border-b">{formatCurrency(data.baseSalary)}</td>
                <td className="py-2 px-4 border-b">{formatCurrency(data.benefitsCost)}</td>
                <td className="py-2 px-4 border-b">{formatCurrency(data.totalPerEmployee)}</td>
                <td className="py-2 px-4 border-b">{formatCurrency(data.totalCost)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="py-2 px-4 border-b">Total</td>
              <td className="py-2 px-4 border-b">{calculationResults.employeeCountsByYear[selectedYear] || 0}</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{formatCurrency(calculationResults.totalCostsByYear[selectedYear] || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(EmployeeCostDetailsTable); 