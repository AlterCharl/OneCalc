import React from 'react';
import { areObjectsEqual } from '../../utils/deepEqual';

/**
 * Higher Order Component that implements deep equality check for props
 * Use this for components that receive complex objects as props and
 * should only re-render when those objects actually change in value
 * 
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.MemoExoticComponent} - The memoized component
 */
const withDeepEqualProps = (Component) => {
  // Use React.memo with a custom equality function
  return React.memo(Component, (prevProps, nextProps) => {
    // Return true if props are deeply equal (meaning they should NOT re-render)
    return areObjectsEqual(prevProps, nextProps);
  });
};

export default withDeepEqualProps; 