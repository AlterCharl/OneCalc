import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import YearSelector from '../common/YearSelector';

/**
 * DashboardSummary - Shows compiled results from all modules
 */
const DashboardSummary = () => {
  // Use optional chaining to safely access compiledResults
  const dashboard = useDashboard();
  const compiledResults = dashboard?.compiledResults;
  
  const [selectedYear, setSelectedYear] = useState('2026');
  const [isChartVisible, setIsChartVisible] = useState(false);
  const summaryRef = useRef(null);
  
  // Use intersection observer to lazy load charts
  useEffect(() => {
    if (!summaryRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsChartVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(summaryRef.current);
    
    return () => {
      if (summaryRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  // Safely handle year selection
  const handleYearChange = React.useCallback((year) => {
    setSelectedYear(year);
  }, []);
  
  // Safely prepare chart data
  const chartData = useMemo(() => {
    const years = ['2026', '2027', '2028', '2029'];
    
    return years.map(year => ({
      year,
      costs: compiledResults?.costsByYear?.[year] || 0,
      revenue: compiledResults?.revenuesByYear?.[year] || 0
    }));
  }, [compiledResults]);
  
  // Early return if we don't have compiled results
  if (!compiledResults) {
    return (
      <div className="p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-bold mb-4">Dashboard Summary</h2>
        <p className="text-gray-500">No data available yet. Please ensure all calculator modules are configured.</p>
      </div>
    );
  }
  
  // Get values with defaults (using nullish coalescing)
  const netProfitForYear = compiledResults?.netProfitByYear?.[selectedYear] ?? 0;
  const isProfit = netProfitForYear >= 0;
  
  const revenueForYear = compiledResults?.revenuesByYear?.[selectedYear] ?? 0;
  const costsForYear = compiledResults?.costsByYear?.[selectedYear] ?? 0;
  
  const breakEvenYear = compiledResults?.summaryMetrics?.breakEvenYear ?? 'Not calculated';
  
  // Safe access for summary metrics
  const totalThreeYearRevenue = compiledResults?.summaryMetrics?.totalThreeYearRevenue ?? 0;
  const totalThreeYearCosts = compiledResults?.summaryMetrics?.totalThreeYearCosts ?? 0;
  const totalThreeYearProfit = compiledResults?.summaryMetrics?.totalThreeYearProfit ?? 0;
  
  return (
    <div ref={summaryRef} className="p-4 bg-white rounded-md shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Financial Summary</h2>
        <YearSelector 
          years={['2026', '2027', '2028', '2029']}
          selectedYear={selectedYear}
          onChange={handleYearChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Net Profit/Loss Card */}
        <div className={`p-4 rounded-md ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="text-lg font-semibold mb-2">Net {isProfit ? 'Profit' : 'Loss'} ({selectedYear})</h3>
          <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            R {Math.abs(netProfitForYear).toLocaleString()}
          </p>
        </div>
        
        {/* Revenue Card */}
        <div className="p-4 rounded-md bg-blue-50">
          <h3 className="text-lg font-semibold mb-2">Revenue ({selectedYear})</h3>
          <p className="text-2xl font-bold text-blue-600">
            R {revenueForYear.toLocaleString()}
          </p>
        </div>
        
        {/* Costs Card */}
        <div className="p-4 rounded-md bg-orange-50">
          <h3 className="text-lg font-semibold mb-2">Costs ({selectedYear})</h3>
          <p className="text-2xl font-bold text-orange-600">
            R {costsForYear.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* Render chart only when visible in viewport for better performance */}
      {isChartVisible ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Revenue vs. Costs by Year</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis 
                  tickFormatter={(value) => value >= 1000000 
                    ? `${(value / 1000000).toFixed(1)}M` 
                    : value >= 1000 
                      ? `${(value / 1000).toFixed(0)}K` 
                      : value
                  }
                />
                <Tooltip 
                  formatter={(value) => [`R ${value.toLocaleString()}`, null]}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#3182ce" />
                <Bar dataKey="costs" name="Costs" fill="#ed8936" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mb-6 h-72 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      )}
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-3">Three-Year Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue:</span>
              <span className="font-medium">R {totalThreeYearRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Costs:</span>
              <span className="font-medium">R {totalThreeYearCosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Profit:</span>
              <span className={`font-bold ${totalThreeYearProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R {totalThreeYearProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Break-Even Year:</span>
              <span className="font-medium">{breakEvenYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue Growth Rate:</span>
              <span className="font-medium">
                {(compiledResults?.summaryMetrics?.revenueGrowthRate * 100 || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost Growth Rate:</span>
              <span className="font-medium">
                {(compiledResults?.summaryMetrics?.costGrowthRate * 100 || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-right">
        Last updated: {compiledResults?.lastUpdated 
          ? new Date(compiledResults.lastUpdated).toLocaleString() 
          : 'Unknown'
        }
      </div>
    </div>
  );
};

export default React.memo(DashboardSummary); 