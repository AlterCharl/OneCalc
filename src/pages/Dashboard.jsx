import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import ScenarioRecommendations from '../components/dashboard/ScenarioRecommendations';
import { DashboardProvider, useDashboard } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';
import EmployeeCostsModule from '../components/costs/EmployeeCostsModule';
import TransactionFeesModule from '../components/revenue/TransactionFeesModule';

/**
 * Dashboard - Main dashboard page
 * Compiles results from all modules in a read-only manner
 */
const DashboardContent = () => {
  // eslint-disable-next-line no-unused-vars
  const { registerModule, compileResults, saveScenario, loadScenario, createNewScenario,
          scenarioName, scenarioDescription, setScenarioName, setScenarioDescription,
          isSaving, error } = useDashboard();
  const { currentUser, logout } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // References to module components - using useRef to maintain reference across renders
  const employeeCostsRef = useRef(null);
  const transactionFeesRef = useRef(null);
  
  // Memoized getResults functions to prevent unnecessary recreations
  const getEmployeeResults = useCallback(() => {
    return employeeCostsRef.current?.getResults() || {
      moduleId: 'employeeCosts',
      totalCostsByYear: {},
      employeeCountsByYear: {},
      averageSalaryByYear: {},
      breakdownByYear: {},
      params: {}
    };
  }, []);
  
  const getTransactionResults = useCallback(() => {
    return transactionFeesRef.current?.getResults() || {
      moduleId: 'transactionFees',
      totalRevenueByYear: {},
      transactionVolumeByYear: {},
      averageOrderValueByYear: {},
      effectiveFeePercentageByYear: {},
      revenuePerTransactionByYear: {},
      detailsByYear: {},
      params: {}
    };
  }, []);
  
  // Register modules with the dashboard - only once on mount
  useEffect(() => {
    console.log("Registering modules with dashboard");
    
    // Register cost modules
    const unregisterEmployeeCosts = registerModule('employeeCosts', 'costs', getEmployeeResults);
    
    // Register revenue modules
    const unregisterTransactionFees = registerModule('transactionFees', 'revenue', getTransactionResults);
    
    // Compile results initially
    const timeoutId = setTimeout(() => {
      compileResults();
    }, 100);
    
    // Unregister modules on unmount
    return () => {
      console.log("Unregistering modules from dashboard");
      clearTimeout(timeoutId);
      unregisterEmployeeCosts();
      unregisterTransactionFees();
    };
  }, [registerModule, compileResults, getEmployeeResults, getTransactionResults]);
  
  // Handle save scenario - memoized to prevent recreation
  const handleSave = useCallback(async () => {
    try {
      setSaveError('');
      await saveScenario(scenarioName, scenarioDescription);
      setShowSaveModal(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to save scenario');
    }
  }, [saveScenario, scenarioName, scenarioDescription]);
  
  // Handle logout - memoized to prevent recreation
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  }, [logout]);
  
  // Memoized tab change handler to prevent recreation
  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);
  
  // Prevent expensive rerenders with useMemo for the UI structure
  const tabClassFn = useCallback((tab) => {
    return `whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
      ${activeTab === tab 
        ? 'border-blue-500 text-blue-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;
  }, [activeTab]);
  
  // Render the navigation tabs
  const renderTabs = useMemo(() => (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button 
            onClick={() => handleTabChange('dashboard')}
            className={tabClassFn('dashboard')}
          >
            Dashboard
          </button>
          <button 
            onClick={() => handleTabChange('costs')}
            className={tabClassFn('costs')}
          >
            Costs
          </button>
          <button 
            onClick={() => handleTabChange('revenue')}
            className={tabClassFn('revenue')}
          >
            Revenue
          </button>
          <button 
            onClick={() => handleTabChange('ai')}
            className={tabClassFn('ai')}
          >
            AI Insights
          </button>
        </nav>
      </div>
    </div>
  ), [handleTabChange, tabClassFn]);
  
  // Render the header with user info and actions
  const renderHeader = useMemo(() => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">OneWORLD Scenario Planner</h1>
      <div className="flex items-center space-x-4">
        {currentUser && (
          <>
            <span className="text-sm text-gray-600">
              {currentUser.displayName || currentUser.email}
            </span>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Scenario
            </button>
            <button
              onClick={createNewScenario}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              New Scenario
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  ), [currentUser, createNewScenario, handleLogout]);
  
  // Lazy render the tab content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardSummary />
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Available Modules</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-blue-800">Cost Modules</h4>
                      <p className="text-sm text-gray-600 mt-1">Configure employee costs and other expenses.</p>
                      <button
                        onClick={() => handleTabChange('costs')}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        View Costs
                      </button>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h4 className="font-semibold text-green-800">Revenue Modules</h4>
                      <p className="text-sm text-gray-600 mt-1">Configure transaction fees and other revenue streams.</p>
                      <button
                        onClick={() => handleTabChange('revenue')}
                        className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        View Revenue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ScenarioRecommendations />
              </div>
            </div>
          </div>
        );
      
      case 'ai':
        return (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Insights & Recommendations</h2>
              <p className="text-gray-600 mb-4">
                Our intelligent system analyzes your scenario and provides tailored 
                recommendations to optimize your business model.
              </p>
              <ScenarioRecommendations />
            </div>
          </div>
        );
      
      case 'costs':
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cost Modules</h2>
            <div className="mb-8">
              <EmployeeCostsModule ref={employeeCostsRef} />
              {/* Add more cost modules here */}
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Revenue Modules</h2>
            <div className="mb-8">
              <TransactionFeesModule ref={transactionFeesRef} />
              {/* Add more revenue modules here */}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {renderHeader}
      
      {/* Save Scenario Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Save Scenario</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scenario Name
              </label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter scenario name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={scenarioDescription}
                onChange={(e) => setScenarioDescription(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows="3"
                placeholder="Enter scenario description"
              />
            </div>
            
            {saveError && (
              <div className="text-red-500 text-sm mb-4">
                {saveError}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Dashboard Tabs */}
      {renderTabs}
      
      {/* Error message if any */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Tab Content - Only render the active tab */}
      {renderTabContent()}
    </div>
  );
};

/**
 * DashboardPage - Wrapper component that provides the dashboard context
 */
const DashboardPage = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default DashboardPage;