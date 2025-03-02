import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/dashboard/DashboardProvider';
import { ModuleDataProvider } from './contexts/ModuleContext';
import { SchemaProvider } from './contexts/SchemaContext';

// Lazy loaded page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
// Keep the lazy loading for SchemaPage but implement a fallback
const SchemaPage = lazy(() => import('./pages/SchemaPage'));
const CostsPage = lazy(() => import('./pages/CostsPage'));
const RevenuePage = lazy(() => import('./pages/RevenuePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));

// Simple fallback schema page component for when lazy loading fails
const FallbackSchemaPage = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Schema Editor (Fallback Mode)</h2>
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">
          Using Simple Schema Editor
        </h3>
        <p className="text-yellow-600">
          The full Schema Editor couldn't be loaded. We're using a simplified version instead.
          For full functionality, please try refreshing the page.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">
            Costs
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
            Revenue
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-center text-gray-500">
          Schema data is available but the full editor couldn't be loaded.
          Please go to the Costs or Revenue modules to make changes.
        </p>
      </div>
    </div>
  );
};

// Loading fallback component
const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="w-full p-4 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

// Special error boundary for chunk loading errors
class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasChunkError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if this is a chunk loading error
    if (error && (
      error.name === 'ChunkLoadError' || 
      (error.message && error.message.includes('Loading chunk')) ||
      (error.stack && error.stack.includes('chunk'))
    )) {
      console.error('Chunk loading error detected:', error);
      return { hasChunkError: true };
    }
    // For other errors, let the parent error boundary handle it
    return { hasChunkError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in ChunkErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasChunkError) {
      // If it's a chunk error, show the fallback component
      return this.props.fallback || <FallbackSchemaPage />;
    }
    
    // Otherwise, render children normally
    return this.props.children;
  }
}

// Regular Error Boundary Component
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
        <div style={{ padding: '20px', backgroundColor: '#ffebee', border: '1px solid #f44336', margin: '20px', borderRadius: '4px' }}>
          <h3>Something went wrong in {this.props.componentName || 'a component'}</h3>
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

// Main App component
const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(true);
  
  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'schema', label: 'Schema', icon: '📋' },
    { id: 'costs', label: 'Cost Modules', icon: '💰' },
    { id: 'revenue', label: 'Revenue Modules', icon: '💵' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'scenarios', label: 'Scenarios', icon: '📝' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];
  
  // Preload components when app starts
  useEffect(() => {
    // Preload critical components on startup
    const preloadComponents = async () => {
      // Start preloading the dashboard page
      const preloads = [
        import('./pages/DashboardPage')
      ];
      
      try {
        await Promise.all(preloads);
        console.log('Critical components preloaded');
      } catch (error) {
        console.error('Error preloading components:', error);
      }
    };
    
    preloadComponents();
  }, []);
  
  return (
    <div className="app-container flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <nav className={`bg-gray-800 text-white transition-all duration-300 ${isNavOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 flex items-center justify-between">
          {isNavOpen && <h1 className="text-xl font-bold">OneWORLD</h1>}
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-2 rounded hover:bg-gray-700"
          >
            {isNavOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <ul className="mt-6">
          {navigationItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left p-3 flex items-center transition-colors
                  ${activeView === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {isNavOpen && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {navigationItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Save
              </button>
              <div className="relative">
                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                  👤
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <ErrorBoundary componentName="AuthProvider">
            <AuthProvider>
              <ErrorBoundary componentName="SchemaProvider">
                <SchemaProvider>
                  <ErrorBoundary componentName="DashboardProvider">
                    <DashboardProvider>
                      <ModuleDataProvider>
                        {/* Render appropriate page based on activeView */}
                        {activeView === 'dashboard' && (
                          <ErrorBoundary componentName="DashboardPage">
                            <Suspense fallback={<LoadingFallback message="Loading dashboard..." />}>
                              <DashboardPage />
                            </Suspense>
                          </ErrorBoundary>
                        )}
                        
                        {activeView === 'schema' && (
                          <ErrorBoundary componentName="SchemaPage">
                            <ChunkErrorBoundary fallback={<FallbackSchemaPage />}>
                              <Suspense fallback={<LoadingFallback message="Loading schema editor..." />}>
                                <SchemaPage />
                              </Suspense>
                            </ChunkErrorBoundary>
                          </ErrorBoundary>
                        )}
                        
                        {activeView === 'costs' && (
                          <ErrorBoundary componentName="CostsPage">
                            <Suspense fallback={<LoadingFallback message="Loading costs modules..." />}>
                              <CostsPage />
                            </Suspense>
                          </ErrorBoundary>
                        )}
                        
                        {activeView === 'revenue' && (
                          <ErrorBoundary componentName="RevenuePage">
                            <Suspense fallback={<LoadingFallback message="Loading revenue modules..." />}>
                              <RevenuePage />
                            </Suspense>
                          </ErrorBoundary>
                        )}
                        
                        {activeView === 'reports' && (
                          <ErrorBoundary componentName="ReportsPage">
                            <Suspense fallback={<LoadingFallback message="Loading reports..." />}>
                              <ReportsPage />
                            </Suspense>
                          </ErrorBoundary>
                        )}
                        
                        {activeView === 'scenarios' && (
                          <div className="p-4 bg-white rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Scenarios</h2>
                            <p>Scenario management tools will appear here.</p>
                            {/* Scenario management UI would go here */}
                          </div>
                        )}
                        
                        {activeView === 'settings' && (
                          <ErrorBoundary componentName="SettingsPage">
                            <Suspense fallback={<LoadingFallback message="Loading settings..." />}>
                              <SettingsPage />
                            </Suspense>
                          </ErrorBoundary>
                        )}
                      </ModuleDataProvider>
                    </DashboardProvider>
                  </ErrorBoundary>
                </SchemaProvider>
              </ErrorBoundary>
            </AuthProvider>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default App; 