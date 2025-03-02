import { createContext, useContext } from 'react';

// Create the context
const DashboardContext = createContext();

// Custom hook for using dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext; 