import React from 'react';
import DashboardContext, { useDashboard } from '../../contexts/DashboardContext';
import DashboardSummary from './DashboardSummary';

// This wrapper ensures the DashboardSummary receives safe values
const DashboardSummaryWrapper = () => {
  // Get the dashboard context
  const dashboardContext = useDashboard();
  
  // Create a safe version of the context with default values where needed
  const safeContext = {
    compiledResults: dashboardContext?.compiledResults || {
      costsByYear: {},
      revenuesByYear: {},
      netProfitByYear: {},
      summaryMetrics: {
        totalThreeYearRevenue: 0,
        totalThreeYearCosts: 0,
        totalThreeYearProfit: 0,
        averageYearlyRevenue: 0,
        averageYearlyCosts: 0,
        revenueGrowthRate: 0,
        costGrowthRate: 0,
        breakEvenYear: 'Not calculated'
      }
    }
  };
  
  // Log what we're doing for debugging
  console.log('DashboardSummaryWrapper providing safe context:', safeContext);
  
  // Override the useDashboard hook for the DashboardSummary component
  return (
    <DashboardContext.Provider value={safeContext}>
      <DashboardSummary />
    </DashboardContext.Provider>
  );
};

export default DashboardSummaryWrapper; 