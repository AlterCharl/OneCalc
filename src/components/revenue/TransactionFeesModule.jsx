import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useSchemaData } from '../../contexts/SchemaContext';
import { calculateTransactionFees, defaultTransactionFeesParams } from '../../utils/calculators/transactionFees';
import YearSelector from '../common/YearSelector';
import Slider from '../common/Slider';
import ModuleCard from '../common/ModuleCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createComparisonKey } from '../../utils/deepEqual';

/**
 * TransactionFeesModule - Calculates transaction fee revenue
 */
const TransactionFeesModule = () => {
  // Get dashboard context
  const { registerModule, compileResults } = useDashboard();
  
  // Get schema data
  const { schemaData } = useSchemaData();
  
  // Local state
  const [params, setParams] = useState(defaultTransactionFeesParams);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isLocked, setIsLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [useSchemaAsBase, setUseSchemaAsBase] = useState(true);
  
  // Refs for tracking changes and debouncing updates
  const prevCalculationRef = useRef(null);
  const timeoutRef = useRef(null);
  const compilePendingRef = useRef(false);
  
  // Extract relevant schema items for transaction fees
  const schemaTransactionFees = useMemo(() => {
    const relevantItems = {
      traditional_market: schemaData.items['revenue.transaction_fees.traditional_market'],
      b2b: schemaData.items['revenue.transaction_fees.b2b']
    };
    return relevantItems;
  }, [schemaData]);
  
  // Helper to update a parameter for the selected year with debouncing
  const updateParamForYear = useCallback((paramName, value) => {
    if (isLocked) return; // Don't update if locked
    
    setParams(prevParams => ({
      ...prevParams,
      [paramName]: {
        ...prevParams[paramName],
        [selectedYear]: value
      }
    }));
    
    // Mark that compilation is needed
    compilePendingRef.current = true;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debouncing updates
    timeoutRef.current = setTimeout(() => {
      if (compilePendingRef.current) {
        compileResults();
        compilePendingRef.current = false;
      }
    }, 300); // 300ms debounce
  }, [isLocked, selectedYear, compileResults]);
  
  // Get derived parameters from schema when using schema as base
  const derivedParams = useMemo(() => {
    if (!useSchemaAsBase || !schemaTransactionFees.traditional_market || !schemaTransactionFees.b2b) {
      return params;
    }
    
    const years = [2026, 2027, 2028, 2029];
    const derivedParams = JSON.parse(JSON.stringify(params)); // Deep clone
    
    years.forEach(year => {
      const yearStr = year.toString();
      
      // Combine traditional market and B2B values for overall transactions
      const traditionalMin = schemaTransactionFees.traditional_market.yearData[yearStr]?.min || 0;
      const traditionalMax = schemaTransactionFees.traditional_market.yearData[yearStr]?.max || 0;
      const b2bMin = schemaTransactionFees.b2b.yearData[yearStr]?.min || 0;
      const b2bMax = schemaTransactionFees.b2b.yearData[yearStr]?.max || 0;
      
      // Use average of min and max for calculation
      const traditionalAvg = (traditionalMin + traditionalMax) / 2;
      const b2bAvg = (b2bMin + b2bMax) / 2;
      
      // Estimate transaction volume based on revenue
      // Assuming an average order value and fee percentage
      const estimatedTotalRevenue = traditionalAvg + b2bAvg;
      const avgOrderValue = params.averageOrderValue[year];
      const feePercentage = params.feePercentage[year];
      
      if (avgOrderValue && feePercentage) {
        // Revenue = Volume * AOV * (Fee/100)
        // So Volume = Revenue / (AOV * (Fee/100))
        const revenuePerTransaction = avgOrderValue * (feePercentage / 100);
        const estimatedVolume = revenuePerTransaction > 0 
          ? Math.round(estimatedTotalRevenue / revenuePerTransaction)
          : params.transactionVolume[year];
        
        // Update the derived parameters
        derivedParams.transactionVolume[year] = estimatedVolume;
      }
    });
    
    return derivedParams;
  }, [params, schemaTransactionFees, useSchemaAsBase]);
  
  // Memoize calculation results to prevent unnecessary recalculations
  const calculationResults = useMemo(() => {
    // Skip calculation if paused
    if (isPaused) return {};
    
    // Use derived params from schema if enabled
    const paramsToUse = useSchemaAsBase ? derivedParams : params;
    
    // Just calculate, don't trigger compileResults here
    return calculateTransactionFees(paramsToUse);
  }, [params, derivedParams, isPaused, useSchemaAsBase]); // Don't include compileResults in dependencies
  
  // Effect to handle compilation with debouncing
  useEffect(() => {
    // Skip if paused or no results
    if (isPaused || !calculationResults.totalRevenueByYear || 
        Object.keys(calculationResults.totalRevenueByYear).length === 0) {
      return;
    }
    
    // Replace the JSON.stringify line with our optimized approach
    const resultsHash = calculationResults ? createComparisonKey(calculationResults.totalRevenueByYear) : '';
    
    // Only trigger compilation if results have changed
    if (prevCalculationRef.current !== resultsHash) {
      prevCalculationRef.current = resultsHash;
      
      // Set a flag that compilation is needed but don't compile immediately
      compilePendingRef.current = true;
      
      // Don't call compileResults directly here - it will be called via the debounce in updateParamForYear
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [calculationResults, isPaused]);
  
  // Memoize the getResults function to avoid recreating it on every render
  const getResults = useCallback(() => {
    // Skip if paused or no results
    if (isPaused || !calculationResults.totalRevenueByYear) {
      return {
        moduleId: 'transactionFees',
        name: 'Transaction Fees',
        isReady: false
      };
    }
    
    return {
      moduleId: 'transactionFees',
      name: 'Transaction Fees',
      type: 'revenue',
      isReady: true,
      usingSchemaBase: useSchemaAsBase, // Indicate if using schema as base
      totalRevenueByYear: calculationResults.totalRevenueByYear,
      detailsByYear: calculationResults.detailsByYear
    };
  }, [calculationResults, isPaused, useSchemaAsBase]);
  
  // Register module with dashboard
  useEffect(() => {
    // Register this module with the dashboard
    const unregister = registerModule('transactionFees', getResults, 'revenue');
    
    // Return cleanup function
    return unregister;
  }, [registerModule, getResults]);
  
  // Create chart data for visualization
  const chartData = useMemo(() => {
    const years = [2026, 2027, 2028, 2029];
    const paramsToUse = useSchemaAsBase ? derivedParams : params;
    
    return years.map(year => {
      const volume = paramsToUse.transactionVolume[year] || 0;
      const aov = paramsToUse.averageOrderValue[year] || 0;
      const fee = paramsToUse.feePercentage[year] || 0;
      const revenue = aov * (fee / 100) * volume;
      
      // Include schema data in chart
      const traditionalMin = schemaTransactionFees.traditional_market?.yearData[year]?.min || 0;
      const traditionalMax = schemaTransactionFees.traditional_market?.yearData[year]?.max || 0;
      const b2bMin = schemaTransactionFees.b2b?.yearData[year]?.min || 0;
      const b2bMax = schemaTransactionFees.b2b?.yearData[year]?.max || 0;
      
      const schemaTraditional = (traditionalMin + traditionalMax) / 2;
      const schemaB2B = (b2bMin + b2bMax) / 2;
      
      return {
        year,
        revenue: Math.round(revenue),
        volume,
        aov,
        fee,
        schemaRevenue: useSchemaAsBase ? Math.round(schemaTraditional + schemaB2B) : 0,
        schemaTraditional: Math.round(schemaTraditional),
        schemaB2B: Math.round(schemaB2B)
      };
    });
  }, [params, derivedParams, useSchemaAsBase, schemaTransactionFees]);
  
  // Format currency values
  const formatCurrency = (value) => {
    return `R ${Number(value).toLocaleString()}`;
  };
  
  // Function to render results
  const renderResults = () => {
    if (!calculationResults.totalRevenueByYear) {
      return <div className="text-center py-4">No data available</div>;
    }
    
    const selectedYearStr = selectedYear.toString();
    const totalRevenue = calculationResults.totalRevenueByYear[selectedYearStr] || 0;
    const transactionVolume = calculationResults.transactionVolumeByYear?.[selectedYearStr] || 0;
    const avgOrderValue = calculationResults.averageOrderValueByYear?.[selectedYearStr] || 0;
    const feePercentage = calculationResults.effectiveFeePercentageByYear?.[selectedYearStr] || 0;
    
    return (
      <div className="space-y-6">
        {/* Revenue metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Revenue ({selectedYear})</div>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Revenue per Transaction</div>
            <div className="text-2xl font-bold">
              {formatCurrency(avgOrderValue * (feePercentage / 100))}
            </div>
          </div>
        </div>
        
        {/* Parameter info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500">Transaction Volume</div>
            <div className="font-semibold">{transactionVolume.toLocaleString()}</div>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500">Average Order Value</div>
            <div className="font-semibold">{formatCurrency(avgOrderValue)}</div>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500">Fee Percentage</div>
            <div className="font-semibold">{feePercentage}%</div>
          </div>
        </div>
        
        {/* Schema info (when using schema) */}
        {useSchemaAsBase && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-700 mb-2">Using Schema Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Traditional Market</div>
                <div className="font-medium">
                  {formatCurrency(
                    (schemaTransactionFees.traditional_market?.yearData[selectedYearStr]?.min || 0) +
                    (schemaTransactionFees.traditional_market?.yearData[selectedYearStr]?.max || 0)
                  ) / 2}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">B2B Market</div>
                <div className="font-medium">
                  {formatCurrency(
                    (schemaTransactionFees.b2b?.yearData[selectedYearStr]?.min || 0) +
                    (schemaTransactionFees.b2b?.yearData[selectedYearStr]?.max || 0)
                  ) / 2}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Revenue chart */}
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis 
                tickFormatter={(value) => `R${value/1000000}M`}
                width={60}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `R ${Number(value).toLocaleString()}`, 
                  name === 'revenue' ? 'Projected Revenue' : 
                  name === 'schemaRevenue' ? 'Schema Revenue' :
                  name === 'schemaTraditional' ? 'Traditional Market' :
                  name === 'schemaB2B' ? 'B2B Market' : name
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
                name="Projected Revenue"
              />
              {useSchemaAsBase && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="schemaTraditional" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    name="Traditional Market"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="schemaB2B" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    name="B2B Market"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Handle year selection with debouncing
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
  }, []);

  // Function to handle pause/resume
  const handlePauseToggle = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Function to handle lock/unlock
  const handleLockToggle = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);
  
  // Add schema toggle to controls section
  const renderControls = () => (
    <div className="p-4 space-y-4">
      {/* Add the schema toggle at the top */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useSchemaAsBase}
              onChange={() => setUseSchemaAsBase(!useSchemaAsBase)}
              className="sr-only peer"
              disabled={isLocked}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">Use Schema Data</span>
          </label>
        </div>
      </div>
      
      {/* Existing controls */}
      <YearSelector 
        years={[2026, 2027, 2028, 2029]} 
        selectedYear={selectedYear} 
        onChange={setSelectedYear}
        disabled={isLocked}
      />
      
      <div className="space-y-6">
        <Slider 
          label="Transaction Volume"
          value={params.transactionVolume[selectedYear]}
          min={0}
          max={2000000}
          step={10000}
          onChange={(value) => updateParamForYear('transactionVolume', value)}
          disabled={isLocked || useSchemaAsBase}
          formatter={(value) => `${Number(value).toLocaleString()} transactions`}
        />
        
        <Slider 
          label="Average Order Value"
          value={params.averageOrderValue[selectedYear]}
          min={0}
          max={2000}
          step={10}
          onChange={(value) => updateParamForYear('averageOrderValue', value)}
          disabled={isLocked}
          formatter={(value) => `R ${Number(value).toLocaleString()}`}
        />
        
        <Slider 
          label="Fee Percentage"
          value={params.feePercentage[selectedYear]}
          min={0}
          max={10}
          step={0.1}
          onChange={(value) => updateParamForYear('feePercentage', value)}
          disabled={isLocked}
          formatter={(value) => `${value}%`}
        />
      </div>
    </div>
  );
  
  return (
    <ModuleCard
      title="Transaction Fees"
      subtitle={useSchemaAsBase ? "Using schema data as baseline" : "Using custom parameters"}
      isPaused={isPaused}
      isLocked={isLocked}
      onPauseToggle={handlePauseToggle}
      onLockToggle={handleLockToggle}
    >
      {renderControls()}
      
      <div className="mt-6">
        {/* Results go here */}
        {!isPaused && calculationResults.totalRevenueByYear && (
          <div className="space-y-6">
            {/* Revenue metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Revenue ({selectedYear})</div>
                <div className="text-2xl font-bold">
                  R {(calculationResults.totalRevenueByYear[selectedYear] || 0).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 font-medium">Revenue per Transaction</div>
                <div className="text-2xl font-bold">
                  R {((calculationResults.averageOrderValueByYear?.[selectedYear] || 0) * 
                     (calculationResults.effectiveFeePercentageByYear?.[selectedYear] || 0) / 100).toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={Object.keys(calculationResults.totalRevenueByYear).map(year => ({
                  year,
                  revenue: calculationResults.totalRevenueByYear[year]
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    tickFormatter={(value) => `R${value/1000000}M`}
                  />
                  <Tooltip 
                    formatter={(value) => [`R ${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </ModuleCard>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(TransactionFeesModule); 