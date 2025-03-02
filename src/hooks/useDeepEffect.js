import { useEffect, useRef } from 'react';
import { areObjectsEqual } from '../utils/deepEqual';

/**
 * Custom hook for useEffect with deep comparison of dependencies
 * Only runs the effect when dependencies have changed according to deep equality
 * 
 * @param {Function} effect - Effect function to run
 * @param {Array} dependencies - Array of dependencies
 */
const useDeepEffect = (effect, dependencies) => {
  const previousDependencies = useRef(null);
  
  // Run effect only if dependencies have changed by deep equality check
  useEffect(() => {
    if (
      previousDependencies.current === null || 
      !areObjectsEqual(dependencies, previousDependencies.current)
    ) {
      // Save the new dependencies
      previousDependencies.current = dependencies;
      
      // Run the effect
      return effect();
    }
  }, [effect, ...dependencies]); // Still include deps for React DevTools
};

export default useDeepEffect; 