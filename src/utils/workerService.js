/**
 * Worker Service
 * 
 * Provides a simpler interface for working with the calculation web worker
 * Using a wrapper service allows for fallback to synchronous calculations if
 * web workers are not supported in the browser
 */
import { calculateSchemaTotals } from './calculators/schemaCalculator';
import { calculateEmployeeCosts } from './calculators/employeeCosts';
import { calculateTransactionFees } from './calculators/transactionFees';

// Create a simple cache for calculation results
const calculationCache = new Map();

// Check if Web Workers are supported
const isWorkerSupported = typeof Worker !== 'undefined';

// Worker instance
let worker = null;

// Pending requests map
const pendingRequests = new Map();

// Counter for request IDs
let requestIdCounter = 0;

/**
 * Initialize the worker if needed
 */
function initWorker() {
  if (!worker && isWorkerSupported) {
    try {
      // Create the worker
      worker = new Worker(new URL('./calculationWorker.js', import.meta.url), { type: 'module' });
      
      // Handle messages from the worker
      worker.onmessage = function(e) {
        const { id, success, result, error } = e.data;
        const pendingRequest = pendingRequests.get(id);
        
        if (pendingRequest) {
          pendingRequests.delete(id);
          
          if (success) {
            pendingRequest.resolve(result);
          } else {
            pendingRequest.reject(new Error(error));
          }
        }
      };
      
      // Handle worker errors
      worker.onerror = function(error) {
        console.error('Worker error:', error);
        
        // Reject all pending requests
        pendingRequests.forEach(request => {
          request.reject(new Error('Worker error'));
        });
        
        // Clear pending requests
        pendingRequests.clear();
        
        // Terminate and reset the worker
        worker.terminate();
        worker = null;
      };
    } catch (error) {
      console.error('Error initializing worker:', error);
      worker = null;
    }
  }
}

/**
 * Clean up the worker when it's no longer needed
 */
export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

/**
 * Run a calculation either in the worker or synchronously
 * 
 * @param {string} type - The type of calculation to run
 * @param {object} data - The calculation parameters
 * @param {boolean} useCache - Whether to use cached results if available
 * @returns {Promise<object>} - The calculation result
 */
export async function runCalculation(type, data, useCache = true) {
  // Generate a cache key
  const cacheKey = `${type}:${JSON.stringify(data)}`;
  
  // Check cache
  if (useCache && calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }
  
  // Try to use a worker
  if (isWorkerSupported) {
    try {
      initWorker();
      
      if (worker) {
        const result = await sendToWorker(type, data);
        
        // Cache the result
        if (useCache) {
          calculationCache.set(cacheKey, result);
        }
        
        return result;
      }
    } catch (error) {
      console.warn('Worker calculation failed, falling back to synchronous:', error);
      // Fall back to synchronous calculation
    }
  }
  
  // Synchronous calculation fallback
  try {
    const result = calculateSynchronously(type, data);
    
    // Cache the result
    if (useCache) {
      calculationCache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Calculation error:', error);
    throw error;
  }
}

/**
 * Send a calculation request to the worker
 * 
 * @param {string} type - The type of calculation to run
 * @param {object} data - The calculation parameters
 * @returns {Promise<object>} - The calculation result
 */
function sendToWorker(type, data) {
  return new Promise((resolve, reject) => {
    const id = requestIdCounter++;
    
    // Store the promise callbacks
    pendingRequests.set(id, { resolve, reject });
    
    // Send the calculation request to the worker
    worker.postMessage({ type, data, id });
  });
}

/**
 * Run a calculation synchronously
 * 
 * @param {string} type - The type of calculation to run
 * @param {object} data - The calculation parameters
 * @returns {object} - The calculation result
 */
function calculateSynchronously(type, data) {
  console.time(`Sync: ${type} calculation`);
  
  try {
    let result;
    
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
    
    return result;
  } finally {
    console.timeEnd(`Sync: ${type} calculation`);
  }
}

/**
 * Clear the calculation cache
 */
export function clearCalculationCache() {
  calculationCache.clear();
}

export default {
  runCalculation,
  terminateWorker,
  clearCalculationCache
}; 