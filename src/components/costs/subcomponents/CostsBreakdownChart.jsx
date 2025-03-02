import React, { memo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

/**
 * Costs Breakdown Chart Component
 * Displays a chart showing the breakdown of employee costs by type
 */
const CostsBreakdownChart = ({ 
  calculationResults,
  selectedYear 
}) => {
  // Check if we have valid data to display
  if (!calculationResults || !calculationResults.costBreakdownByYear) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Cost Breakdown by Employee Type</h3>
        <div className="h-80 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Format the data for the chart
  const costBreakdown = calculationResults.costBreakdownByYear[selectedYear];
  const chartData = Object.keys(costBreakdown || {}).map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    costs: costBreakdown[type]
  }));

  // Custom tooltip formatter for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(payload[0].value);
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600">{formattedValue}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Cost Breakdown by Employee Type</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `$${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `$${(value / 1000).toFixed(0)}K`;
                }
                return `$${value}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="costs" fill="#4F46E5" name="Cost" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CostsBreakdownChart); 