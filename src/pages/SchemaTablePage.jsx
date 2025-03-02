import React from 'react';
import SchemaTable from '../components/schema/SchemaTable';
import SchemaCalculatorModule from '../components/schema/SchemaCalculatorModule';
import SchemaResultsView from '../components/schema/SchemaResultsView';
import { DashboardProvider } from '../contexts/DashboardContext';

/**
 * SchemaTablePage
 * 
 * Page component that displays the Schema Table and associated data
 */
const SchemaTablePage = () => {
  return (
    <DashboardProvider>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Schema Calculator Module (headless) */}
        <SchemaCalculatorModule />
        
        {/* Main content area */}
        <div style={{ 
          display: 'flex', 
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Schema Table - 70% width */}
          <div style={{
            flex: 0.7,
            overflow: 'auto',
            borderRight: '1px solid #e0e0e0',
          }}>
            <SchemaTable />
          </div>
          
          {/* Results Panel - 30% width */}
          <div style={{
            flex: 0.3,
            overflow: 'auto',
            padding: '16px',
          }}>
            <SchemaResultsView />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default SchemaTablePage; 