import React, { useState, useCallback, useEffect, useContext } from 'react';
import DashboardContext from './DashboardContext';
import { defaultCompiledResults, defaultRegisteredModules, mockCurrentUser } from './defaultValues';
import { registerModule as registerModuleUtil, unregisterModule as unregisterModuleUtil } from './moduleRegistration';
import { compileAllResults } from './compilationLogic';
import { saveScenario as saveScenarioUtil, loadScenario as loadScenarioUtil } from './scenarioManagement';
import { areObjectsEqual } from '../../utils/deepEqual';
import SchemaContext, { useSchemaData } from '../SchemaContext';

/**
 * Dashboard Provider Component
 * 
 * Provides dashboard functionality to child components
 */
export const DashboardProvider = ({ children }) => {
  // State for registered modules (organized by type)
  const [registeredModules, setRegisteredModules] = useState(defaultRegisteredModules);
  
  // State for compiled results
  const [compiledResults, setCompiledResults] = useState(defaultCompiledResults);
  
  // Get schema data from context
  const schemaContext = useContext(SchemaContext);
  
  // Make schema context available globally for non-React code
  useEffect(() => {
    if (schemaContext) {
      window.__SCHEMA_CONTEXT__ = schemaContext;
    }
    return () => {
      delete window.__SCHEMA_CONTEXT__;
    };
  }, [schemaContext]);
  
  // Register a module with the dashboard
  const registerModule = useCallback((id, getResults, type = 'calculator') => {
    console.log(`Registering module: ${id} of type ${type}`);
    
    // Validate parameters
    if (!id || typeof getResults !== 'function') {
      console.error('Invalid module registration: id and getResults are required');
      return;
    }
    
    setRegisteredModules(prev => registerModuleUtil(prev, id, getResults, type));
    
    // Trigger a compilation after registration
    setTimeout(() => {
      console.log(`Module registered: ${id}. Compiling results...`);
      compileResults();
    }, 0);
    
    // Return unregister function
    return () => {
      console.log(`Unregistering module: ${id}`);
      setRegisteredModules(prev => unregisterModuleUtil(prev, id, type));
      
      // Recompile after unregistering
      setTimeout(compileResults, 0);
    };
  }, []);
  
  // Unregister a module
  const unregisterModule = useCallback((id, type) => {
    console.log(`Unregistering module: ${id}`);
    setRegisteredModules(prev => unregisterModuleUtil(prev, id, type));
    
    // Recompile after unregistering
    setTimeout(compileResults, 0);
  }, []);
  
  // Compile results from all registered modules
  const compileResults = useCallback(() => {
    // Pass schema data to compilation logic
    const schemaData = schemaContext?.schemaData;
    const newResults = compileAllResults(registeredModules, compiledResults, schemaData);
    
    // Only update state if there's a meaningful change to avoid unnecessary renders
    const resultsChanged = !areObjectsEqual(newResults, compiledResults);
        
    if (resultsChanged) {
      console.log('Updated compiled results:', newResults);
      setCompiledResults(newResults);
    } else {
      console.log('No change in compiled results');
    }
  }, [registeredModules, compiledResults, schemaContext]);
  
  // Recompile when schema data changes
  useEffect(() => {
    if (schemaContext) {
      console.log('Schema data changed, recompiling results');
      compileResults();
    }
  }, [schemaContext?.schemaData, compileResults]);
  
  // Save current scenario
  const saveScenario = useCallback(() => {
    return saveScenarioUtil(compiledResults);
  }, [compiledResults]);
  
  // Load a scenario
  const loadScenario = useCallback((scenarioId) => {
    return loadScenarioUtil(scenarioId);
  }, []);
  
  // Initial setup
  useEffect(() => {
    console.log('DashboardProvider mounted');
    return () => console.log('DashboardProvider unmounted');
  }, []);
  
  // Context value
  const contextValue = {
    currentUser: mockCurrentUser,
    registeredModules,
    compiledResults,
    registerModule,
    unregisterModule,
    compileResults,
    saveScenario,
    loadScenario,
    schemaData: schemaContext?.schemaData,
    usingSchemaData: !!schemaContext?.schemaData
  };
  
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}; 