import React, { lazy, Suspense } from 'react';
import LoadingFallback from '../components/common/LoadingFallback';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * Creates a lazy-loaded component with error boundary and loading fallback
 * 
 * @param {Function} importFunc - Dynamic import function for the component
 * @param {string} loadingMessage - Message to display during loading
 * @param {Function} customErrorFallback - Optional custom error fallback component
 * @returns {React.LazyExoticComponent} - Lazy-loaded component wrapped in Suspense and ErrorBoundary
 */
export const lazyLoadComponent = (importFunc, loadingMessage = 'Loading component...', customErrorFallback = null) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <ErrorBoundary fallback={customErrorFallback}>
      <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Creates a lazy-loaded page component with appropriate loading message
 * 
 * @param {Function} importFunc - Dynamic import function for the page component
 * @param {Function} customErrorFallback - Optional custom error fallback component
 * @returns {React.LazyExoticComponent} - Lazy-loaded page component
 */
export const lazyLoadPage = (importFunc, customErrorFallback = null) => {
  return lazyLoadComponent(importFunc, 'Loading page...', customErrorFallback);
};

/**
 * Creates a lazy-loaded module component with appropriate loading message
 * 
 * @param {Function} importFunc - Dynamic import function for the module component
 * @param {Function} customErrorFallback - Optional custom error fallback component
 * @returns {React.LazyExoticComponent} - Lazy-loaded module component
 */
export const lazyLoadModule = (importFunc, customErrorFallback = null) => {
  return lazyLoadComponent(importFunc, 'Loading module...', customErrorFallback);
}; 