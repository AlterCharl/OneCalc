import React, { Suspense, useState, useEffect } from 'react';
import { useSchemaData } from '../contexts/SchemaContext';
import './SchemaPage.css';

// Import components directly instead of using lazy loading initially
// This helps diagnose if the lazy loading is causing the issue
import SchemaTable from '../components/schema/SchemaTable';
import SchemaEditor from '../components/schema/SchemaEditor';

// Loading fallback
const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>Something went wrong in {this.props.componentName}</h3>
          <p>Please refresh the page or contact support if the issue persists.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
          >
            Try again
          </button>
          {this.state.error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-red-600">Error details</summary>
              <pre className="bg-gray-100 p-2 mt-1 text-sm overflow-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * SchemaPage - Manages the schema data structure
 */
const SchemaPage = () => {
  const [activeTab, setActiveTab] = useState('costs');
  const { schemaData, importBuyersPortalData } = useSchemaData();
  const [showImportPrompt, setShowImportPrompt] = useState(true);

  useEffect(() => {
    // Check if the user has seen the prompt before
    const hasSeenPrompt = localStorage.getItem('hasSeenBuyersPortalPrompt');
    
    if (!hasSeenPrompt) {
      setShowImportPrompt(true);
    } else {
      setShowImportPrompt(false);
    }
  }, []);

  const handleImportBuyersPortalData = () => {
    try {
      const success = importBuyersPortalData();
      if (success) {
        alert('Buyers Portal schema data imported successfully!');
        localStorage.setItem('hasSeenBuyersPortalPrompt', 'true');
        setShowImportPrompt(false);
      } else {
        alert('Failed to import Buyers Portal schema data.');
      }
    } catch (error) {
      console.error('Error importing Buyers Portal data:', error);
      alert('An error occurred while importing Buyers Portal data.');
    }
  };

  const dismissImportPrompt = () => {
    localStorage.setItem('hasSeenBuyersPortalPrompt', 'true');
    setShowImportPrompt(false);
  };

  return (
    <div className="schema-page">
      <div className="schema-header">
        <h1>Schema Editor</h1>
        <div className="schema-actions">
          <button 
            className="schema-import-button"
            onClick={handleImportBuyersPortalData}
          >
            Import Buyers Portal Data
          </button>
        </div>
      </div>

      {showImportPrompt && (
        <div className="import-prompt">
          <div className="import-prompt-content">
            <h3>Import OneWORLD Buyers Portal Schema</h3>
            <p>Would you like to import the comprehensive schema data for the OneWORLD Buyers Portal?</p>
            <p>This includes detailed cost and revenue projections from 2026 to 2029.</p>
            <div className="import-prompt-actions">
              <button className="import-button" onClick={handleImportBuyersPortalData}>
                Yes, Import Data
              </button>
              <button className="dismiss-button" onClick={dismissImportPrompt}>
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="schema-tabs">
        <button
          className={`tab-button ${activeTab === 'costs' ? 'active' : ''}`}
          onClick={() => setActiveTab('costs')}
        >
          Costs
        </button>
        <button
          className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
      </div>

      <div className="schema-content">
        <ErrorBoundary componentName="SchemaTable">
          <Suspense fallback={<LoadingFallback message="Loading schema table..." />}>
            <SchemaTable schemaType={activeTab} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="SchemaEditor">
          <Suspense fallback={<LoadingFallback message="Loading schema editor..." />}>
            <SchemaEditor schemaType={activeTab} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default SchemaPage; 