import React, { Suspense, lazy } from 'react';
import SaveChangesButton from '../components/common/SaveChangesButton';

// Lazy loaded components
const TransactionFeesModule = lazy(() => import('../components/revenue/TransactionFeesModule'));
const SchemaBasedRevenueModule = lazy(() => import('../components/revenue/SchemaBasedRevenueModule'));
const TotalRevenueCard = lazy(() => import('../components/revenue/TotalRevenueCard'));

// Loading fallback component
const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="w-full p-4 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 bg-red-50 border border-red-200 rounded-md m-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong in {this.props.componentName || 'a component'}</h3>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * RevenuePage - Manages all revenue calculator modules
 */
const RevenuePage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Revenue Calculators</h1>
        <p className="text-gray-600 mb-6">
          Configure and manage all revenue-related projections for your business model.
        </p>
        <SaveChangesButton moduleType="revenue" />
      </div>

      {/* Total Revenue Card for all years */}
      <ErrorBoundary componentName="TotalRevenueCard">
        <Suspense fallback={<LoadingFallback message="Loading revenue projections..." />}>
          <TotalRevenueCard />
        </Suspense>
      </ErrorBoundary>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 000-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">How to use the Revenue Scenario Planner</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>The <strong>Revenue Scenario Planner</strong> allows you to adjust revenue projections for each item in your financial model.</li>
                <li>Use the <strong>year selector</strong> to switch between different projection years.</li>
                <li>Each revenue item has three sliders:
                  <ul className="list-circle pl-5 space-y-1 mt-1">
                    <li><strong>Quantity</strong> - Adjust the number of units</li>
                    <li><strong>Value Range</strong> - Set the minimum and maximum revenue values</li>
                    <li><strong>Annual Growth Rate</strong> - Set the growth percentage for future years</li>
                  </ul>
                </li>
                <li>The <strong>Total Revenue Card</strong> at the top shows projections for all years.</li>
                <li>Click on a category name to expand/collapse that section.</li>
                <li>The <strong>Reset Values</strong> button restores default values for the selected year.</li>
                <li>All changes are automatically saved to your schema.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ErrorBoundary componentName="SchemaBasedRevenueModule">
          <Suspense fallback={<LoadingFallback message="Loading revenue scenario planner..." />}>
            <SchemaBasedRevenueModule />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary componentName="TransactionFeesModule">
          <Suspense fallback={<LoadingFallback message="Loading transaction fees..." />}>
            <TransactionFeesModule />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default RevenuePage; 