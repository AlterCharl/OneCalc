import deepEqual from 'fast-deep-equal';

/**
 * Utility for deep equality comparison between objects
 * More efficient than JSON.stringify for comparing complex objects
 *
 * @param {any} obj1 - First object to compare
 * @param {any} obj2 - Second object to compare
 * @returns {boolean} - True if objects are deeply equal
 */
export const areObjectsEqual = (obj1, obj2) => {
  return deepEqual(obj1, obj2);
};

/**
 * Creates a memoization function that uses deep equality 
 * to determine if inputs have changed
 *
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function that uses deep equality
 */
export const memoizeWithDeepEqual = (fn) => {
  let lastArgs = null;
  let lastResult = null;

  return (...args) => {
    if (lastArgs === null || !deepEqual(lastArgs, args)) {
      lastArgs = args;
      lastResult = fn(...args);
    }
    return lastResult;
  };
};

/**
 * Creates a comparison key from an object that can be used
 * as a dependency in useEffect or useMemo hooks
 * 
 * @param {object} obj - Object to create a key from
 * @returns {string} - A string key representing the object state
 */
export const createComparisonKey = (obj) => {
  if (!obj) return '';
  
  // Use an incremental hash calculation instead of JSON.stringify
  // This is just one approach, simpler than what libraries like object-hash do
  // but still more efficient than JSON.stringify for large objects
  const keys = Object.keys(obj).sort();
  let hash = 0;
  
  for (const key of keys) {
    const value = obj[key];
    
    // Add to the hash based on the key
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Add to the hash based on the value type
    if (typeof value === 'number') {
      hash = ((hash << 5) - hash) + value;
      hash = hash & hash;
    } else if (typeof value === 'string') {
      for (let i = 0; i < Math.min(value.length, 50); i++) {
        hash = ((hash << 5) - hash) + value.charCodeAt(i);
        hash = hash & hash;
      }
    } else if (typeof value === 'boolean') {
      hash = ((hash << 5) - hash) + (value ? 1 : 0);
      hash = hash & hash;
    } else if (Array.isArray(value)) {
      // Add length to the hash
      hash = ((hash << 5) - hash) + value.length;
      hash = hash & hash;
      
      // Add first and last item if exists
      if (value.length > 0) {
        const firstItem = value[0];
        const lastItem = value[value.length - 1];
        
        if (typeof firstItem === 'number' || typeof firstItem === 'boolean') {
          hash = ((hash << 5) - hash) + Number(firstItem);
          hash = hash & hash;
        }
        
        if (typeof lastItem === 'number' || typeof lastItem === 'boolean') {
          hash = ((hash << 5) - hash) + Number(lastItem);
          hash = hash & hash;
        }
      }
    }
  }
  
  // Convert hash to a string
  return 'key:' + hash.toString(16);
}; 