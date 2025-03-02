import React, { useState, useCallback } from 'react';
import { useSchemaData } from '../../contexts/SchemaContext';
import { useModuleData } from '../../contexts/ModuleContext';

/**
 * SaveChangesButton
 * 
 * A component that saves all module changes to the schema and persists to localStorage
 */
const SaveChangesButton = ({ moduleType }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const { schemaData } = useSchemaData();
  const { getAllCalculationResults } = useModuleData();

  const handleSaveChanges = useCallback(() => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Get all calculation results from modules
      const calculationResults = getAllCalculationResults();
      console.log('Module calculation results:', calculationResults);
      
      // Save the current schema data to localStorage
      localStorage.setItem('oneCalcSchemaData', JSON.stringify(schemaData));
      
      // Show success message
      setSaveStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [schemaData, getAllCalculationResults]);

  return (
    <div className="save-changes-container flex items-center">
      <button
        className={`px-4 py-2 rounded-md font-semibold text-white ${
          isSaving ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={handleSaveChanges}
        disabled={isSaving}
      >
        {isSaving ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          'Save All Changes'
        )}
      </button>
      
      {saveStatus === 'success' && (
        <span className="ml-2 text-green-600 flex items-center">
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Changes saved successfully!
        </span>
      )}
      
      {saveStatus === 'error' && (
        <span className="ml-2 text-red-600 flex items-center">
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Error saving changes. Please try again.
        </span>
      )}
    </div>
  );
};

export default SaveChangesButton; 