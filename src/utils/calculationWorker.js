/* eslint-disable no-restricted-globals */
/**
 * Web Worker for offloading heavy calculations from the main thread
 * This worker handles financial calculations to prevent UI blocking
 */

// Import calculation functions
import { calculateSchemaTotals } from './calculators/schemaCalculator';
import { calculateEmployeeCosts } from './calculators/employeeCosts';
import { calculateTransactionFees } from './calculators/transactionFees';

// Message handler for worker
self.onmessage = function(e) {
  const { type, data, id } = e.data;
  let result;
  
  console.time(`Worker: ${type} calculation`);
  
  try {
    switch (type) {
      case 'schema':
        result = calculateSchemaTotals(data.schemaData, data.useMaxValues);
        break;
        
      case 'employeeCosts':
        result = calculateEmployeeCosts(data);
        break;
        
      case 'transactionFees':
        result = calculateTransactionFees(data);
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
    
    // Post the calculation result back to the main thread
    self.postMessage({
      id,
      success: true,
      result
    });
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      id,
      success: false,
      error: error.message
    });
  } finally {
    console.timeEnd(`Worker: ${type} calculation`);
  }
};

// Function to handle messages in worker scope
function runCalculation(type, data) {
  switch (type) {
    case 'schema':
      return calculateSchemaTotals(data.schemaData, data.useMaxValues);
      
    case 'employeeCosts':
      return calculateEmployeeCosts(data);
      
    case 'transactionFees':
      return calculateTransactionFees(data);
      
    default:
      throw new Error(`Unknown calculation type: ${type}`);
  }
} 