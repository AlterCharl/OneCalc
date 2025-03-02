import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const ModuleContext = createContext();

// Default years range for the application
const DEFAULT_YEAR_RANGE = [2026, 2027, 2028, 2029, 2030];

/**
 * Provider component for module data
 */
export const ModuleDataProvider = ({ children }) => {
  // State for module data
  const [moduleData, setModuleDataState] = useState({});
  
  // Registry for module calculations
  const [moduleCalculations, setModuleCalculations] = useState({});

  // Set data for a specific module
  const setModuleData = useCallback((moduleId, data) => {
    setModuleDataState(prevData => ({
      ...prevData,
      [moduleId]: data
    }));
  }, []);

  // Register a calculation function for a module
  const registerModuleCalculation = useCallback((moduleId, calculateFn) => {
    setModuleCalculations(prev => ({
      ...prev,
      [moduleId]: calculateFn
    }));
  }, []);

  // Get calculation results from all modules
  const getAllCalculationResults = useCallback(() => {
    const results = {};
    
    Object.keys(moduleCalculations).forEach(moduleId => {
      if (typeof moduleCalculations[moduleId] === 'function') {
        results[moduleId] = moduleCalculations[moduleId]();
      }
    });
    
    return results;
  }, [moduleCalculations]);

  // Context value
  const value = {
    moduleData,
    setModuleData,
    registerModuleCalculation,
    getAllCalculationResults,
    yearRange: DEFAULT_YEAR_RANGE
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};

/**
 * Custom hook to use module data
 */
export const useModuleData = () => {
  const context = useContext(ModuleContext);
  
  if (!context) {
    throw new Error('useModuleData must be used within a ModuleDataProvider');
  }
  
  return context;
};

export default ModuleContext; 