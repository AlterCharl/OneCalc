// Debug helpers for specific OneCalc modules
import React from 'react';
import { debugComponent, debugContext, debugHook, logError, validateContext } from './debug';

// Debug helper for TransactionFeesModule
export const debugTransactionFeesModule = () => {
  console.group('%c DEBUG: TransactionFeesModule', 'color: blue; font-weight: bold');
  
  // Check if required hooks are properly functioning
  console.log('Checking module dependencies...');
  
  try {
    // Check React hooks
    if (typeof React === 'undefined') {
      console.error('React is not defined!');
    } else {
      console.log('✅ React is available');
      
      // Check hooks
      const hooks = ['useState', 'useEffect', 'useContext', 'useMemo', 'useCallback', 'useRef'];
      hooks.forEach(hook => {
        if (typeof React[hook] === 'function') {
          console.log(`✅ React.${hook} is available`);
        } else {
          console.error(`❌ React.${hook} is missing or not a function`);
        }
      });
    }
    
    // Check dashboard context
    console.log('Checking dashboard context...');
    try {
      const DashboardContext = require('./contexts/DashboardContext');
      if (DashboardContext) {
        console.log('✅ DashboardContext module is available');
        
        if (typeof DashboardContext.useDashboard === 'function') {
          console.log('✅ useDashboard hook is available');
        } else {
          console.error('❌ useDashboard hook is missing or not a function');
        }
      }
    } catch (error) {
      console.error('❌ Failed to import DashboardContext:', error.message);
    }
    
    // Check utilities
    console.log('Checking utility functions...');
    try {
      const transactionFeesCalculator = require('./utils/calculators/transactionFees');
      if (transactionFeesCalculator) {
        console.log('✅ transactionFees calculator module is available');
        
        if (typeof transactionFeesCalculator.calculateTransactionFees === 'function') {
          console.log('✅ calculateTransactionFees function is available');
        } else {
          console.error('❌ calculateTransactionFees function is missing or not a function');
        }
      }
    } catch (error) {
      console.error('❌ Failed to import transactionFees calculator:', error.message);
    }
    
  } catch (error) {
    console.error('Error during TransactionFeesModule dependency check:', error);
  }
  
  console.groupEnd();
  
  // Return a helper object with functions for runtime debugging
  return {
    inspectCalculationResults: (results) => {
      console.group('%c TransactionFees Calculation Results', 'color: green; font-weight: bold');
      console.log('Results object:', results);
      
      if (!results) {
        console.error('❌ Results object is null or undefined');
      } else {
        if (results.totalRevenueByYear) {
          console.log('✅ totalRevenueByYear is present');
          console.table(results.totalRevenueByYear);
        } else {
          console.error('❌ totalRevenueByYear is missing');
        }
        
        if (results.detailsByYear) {
          console.log('✅ detailsByYear is present');
          const years = Object.keys(results.detailsByYear);
          console.log('Years included:', years);
          
          if (years.length > 0) {
            const sampleYear = years[0];
            console.log(`Sample data for year ${sampleYear}:`, results.detailsByYear[sampleYear]);
          }
        } else {
          console.error('❌ detailsByYear is missing');
        }
      }
      
      console.groupEnd();
    },
    
    inspectDashboardContext: (dashboard) => {
      console.group('%c TransactionFees Dashboard Context', 'color: orange; font-weight: bold');
      
      validateContext(dashboard, [
        'registerModule',
        'unregisterModule',
        'compileResults',
        'compiledResults'
      ], 'TransactionFeesModule');
      
      if (dashboard) {
        console.log('Dashboard context value:', dashboard);
        
        // Check compiled results
        if (dashboard.compiledResults) {
          console.log('Compiled results:', dashboard.compiledResults);
        }
        
        // Check if module registration works
        if (typeof dashboard.registerModule === 'function') {
          console.log('✅ registerModule is a function');
        }
      }
      
      console.groupEnd();
    },
    
    monkeyPatch: () => {
      // This function can be called to temporarily patch functions at runtime for debugging
      console.warn('Applying TransactionFeesModule monkey patches for debugging...');
      
      // Store original functions to restore later
      let originalUseMemo = null;
      
      // Only patch if React is available
      if (React && typeof React.useMemo === 'function') {
        originalUseMemo = React.useMemo;
        React.useMemo = function(factory, deps) {
          console.log('useMemo called in TransactionFeesModule', { factory, deps });
          return originalUseMemo(factory, deps);
        };
      } else {
        console.error('Cannot monkey patch - React or React.useMemo not available');
      }
      
      // Add more patches as needed
      
      return () => {
        // Return a function that can be called to restore original functions
        if (originalUseMemo) {
          React.useMemo = originalUseMemo;
          console.warn('Removed TransactionFeesModule monkey patches');
        }
      };
    }
  };
};

// Debug helper for EmployeeCostsModule
export const debugEmployeeCostsModule = () => {
  console.group('%c DEBUG: EmployeeCostsModule', 'color: blue; font-weight: bold');
  
  // Similar checks as for TransactionFeesModule
  // ...
  
  console.groupEnd();
  
  return {
    // Similar helpers as for TransactionFeesModule
    // ...
  };
};

// Debug helper for DashboardSummary
export const debugDashboardSummary = () => {
  console.group('%c DEBUG: DashboardSummary', 'color: blue; font-weight: bold');
  
  // Similar checks as for other modules
  // ...
  
  console.groupEnd();
  
  return {
    // Similar helpers as for other modules
    // ...
  };
};

// Safely initialize and expose global debug functions
// Make sure we're in a browser environment before accessing window
const isWindowAvailable = typeof window !== 'undefined';

if (isWindowAvailable) {
  window._debugModules = {
    transactionFees: debugTransactionFeesModule(),
    employeeCosts: debugEmployeeCostsModule(),
    dashboardSummary: debugDashboardSummary()
  };
  
  console.log('%c Module-specific debug tools available via window._debugModules', 'color: purple; font-weight: bold');
} 