import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import ModuleCard from '../common/ModuleCard';
import SchemaEditor from './SchemaEditor';
import { runCalculation } from '../../utils/workerService';

/**
 * Schema Calculator Module
 * 
 * Integrates with the DashboardContext to provide schema calculation results
 * This is a "headless" component that only handles calculation logic
 */
const SchemaCalculatorModule = () => {
  const { registerModule, unregisterModule } = useDashboard();
  const [schemaData, setSchemaData] = useState(null);
  const [useMaxValues, setUseMaxValues] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const calculationTimeoutRef = useRef(null);

  // Perform calculation with debouncing
  useEffect(() => {
    // Clear any pending calculation
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }

    // Skip calculation if paused or no data
    if (isPaused || !schemaData) {
      return;
    }

    // Set a debounce delay to avoid excessive calculations
    calculationTimeoutRef.current = setTimeout(async () => {
      try {
        setIsCalculating(true);
        
        const result = await runCalculation('schema', {
          schemaData,
          useMaxValues
        });
        
        setCalculationResults(result);
      } catch (error) {
        console.error('Error calculating schema totals:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 300); // 300ms debounce

    // Cleanup
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, [schemaData, useMaxValues, isPaused]);

  // Provide results to dashboard context
  const getResults = useCallback(() => {
    if (!calculationResults) {
      console.log('Schema calculator has no results to provide');
      return {
        moduleId: 'schemaCalculator',
        isReady: false
      };
    }

    return {
      moduleId: 'schemaCalculator',
      isReady: true,
      totalCostsByYear: calculationResults.totalCostsByYear,
      totalRevenueByYear: calculationResults.totalRevenueByYear,
      netProfitByYear: calculationResults.netProfitByYear,
      details: calculationResults
    };
  }, [calculationResults]);

  // Register with dashboard context
  useEffect(() => {
    if (!registerModule) {
      console.warn('Dashboard context not available for schema calculator registration');
      return;
    }

    console.log('Registering schema calculator module');
    const unregister = registerModule('schemaCalculator', getResults, 'calculator');

    return () => {
      console.log('Unregistering schema calculator module');
      unregister();
    };
  }, [registerModule, unregisterModule, getResults]);

  // Handle schema data changes
  const handleSchemaChange = useCallback((newSchemaData) => {
    setSchemaData(newSchemaData);
  }, []);

  // Toggle between min and max values
  const toggleUseMaxValues = useCallback(() => {
    setUseMaxValues(prev => !prev);
  }, []);

  // Toggle paused state
  const togglePaused = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Toggle locked state
  const toggleLocked = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

  return (
    <ModuleCard
      title="Schema Calculator"
      isLocked={isLocked}
      isPaused={isPaused}
      onLockToggle={toggleLocked}
      onPauseToggle={togglePaused}
    >
      <SchemaEditor 
        onChange={handleSchemaChange}
        isLocked={isLocked}
      />
      
      <div className="mt-4">
        <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={useMaxValues}
            onChange={toggleUseMaxValues}
            className="form-checkbox h-5 w-5 text-blue-600"
              disabled={isLocked}
            />
          <span className="ml-2 text-gray-700">Use maximum values</span>
          </label>
      </div>

      {isCalculating && (
        <div className="mt-2 text-sm text-gray-500">
          Calculating...
        </div>
      )}

      {calculationResults && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold text-gray-700">Calculation Summary</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(calculationResults.totalRevenueByYear).map(year => (
              <div key={year} className="p-2 border rounded">
                <div className="text-sm font-medium">{year}</div>
                <div className="text-green-600">Revenue: R{calculationResults.totalRevenueByYear[year].toLocaleString()}</div>
                <div className="text-red-600">Costs: R{calculationResults.totalCostsByYear[year].toLocaleString()}</div>
                <div className={calculationResults.netProfitByYear[year] >= 0 ? "text-green-700 font-bold" : "text-red-700 font-bold"}>
                  Net: R{calculationResults.netProfitByYear[year].toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModuleCard>
  );
};

export default SchemaCalculatorModule; 