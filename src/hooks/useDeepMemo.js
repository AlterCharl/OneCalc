import { useMemo } from 'react';
import { areObjectsEqual } from '../utils/deepEqual';

/**
 * Custom hook for deep memoization of values
 * Uses deep equality checking rather than reference equality
 * 
 * @param {Function} factory - Function that returns the memoized value
 * @param {Array} dependencies - Array of dependencies
 * @returns {any} - The memoized value
 */
const useDeepMemo = (factory, dependencies) => {
  // Use a wrapper object to hold the previous dependencies
  const dependencyWrapper = useMemo(() => ({
    deps: dependencies,
    value: factory()
  }), []);
  
  // Standard useMemo but with a single dependency that's always the same reference
  return useMemo(() => {
    // Check if any dependencies have changed using deep equality
    const depsChanged = !areObjectsEqual(dependencies, dependencyWrapper.deps);
    
    if (depsChanged) {
      // Update stored dependencies and value
      dependencyWrapper.deps = dependencies;
      dependencyWrapper.value = factory();
    }
    
    return dependencyWrapper.value;
  }, [factory, dependencies, dependencyWrapper]);
};

export default useDeepMemo; 