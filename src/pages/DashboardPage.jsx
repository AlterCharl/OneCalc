import React, { Suspense, lazy } from 'react';

// Lazy loaded components
const DashboardSummary = lazy(() => import('../components/dashboard/DashboardSummary'));
const ScenarioRecommendations = lazy(() => import('../components/dashboard/ScenarioRecommendations'));

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
 * DashboardPage - Main dashboard showing only compiled results and analytics
 */
const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Financial Dashboard</h1>
        <p className="text-gray-600 mb-6">
          View compiled financial projections and analytics from all modules.
        </p>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Financial Summary</h2>
        </div>
        <div className="p-6">
          <ErrorBoundary componentName="DashboardSummary">
            <Suspense fallback={<LoadingFallback message="Loading summary..." />}>
              <DashboardSummary />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Scenario Recommendations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Scenario Recommendations</h2>
        </div>
        <div className="p-6">
          <ErrorBoundary componentName="ScenarioRecommendations">
            <Suspense fallback={<LoadingFallback message="Loading recommendations..." />}>
              <ScenarioRecommendations />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Additional analytics sections could be added here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Revenue Breakdown</h2>
          </div>
          <div className="p-6 h-64 flex items-center justify-center">
            <p className="text-gray-500">Revenue breakdown charts will appear here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Cost Breakdown</h2>
          </div>
          <div className="p-6 h-64 flex items-center justify-center">
            <p className="text-gray-500">Cost breakdown charts will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 