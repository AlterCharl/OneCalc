import React, { useState } from 'react';
import { useSchemaData } from '../../contexts/SchemaContext';
import SchemaItemRow from './SchemaItemRow';
import './SchemaTable.css';

const SchemaTable = ({ schemaType = 'costs' }) => {
  const { schemaData, exportSchemaData } = useSchemaData();
  const [isSaved, setIsSaved] = useState(false);
  
  // Get items for the selected schema type (costs or revenue)
  const items = Object.values(schemaData?.items || {}).filter(
    item => item.category === (schemaType === 'costs' ? 'cost' : 'revenue')
  );
  
  if (!items || items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No {schemaType} data available. Use the schema editor below to add items.
      </div>
    );
  }
  
  const years = ['2026', '2027', '2028', '2029'];
  
  // Group items by subcategory
  const itemsBySubcategory = items.reduce((acc, item) => {
    if (!acc[item.subcategory]) {
      acc[item.subcategory] = [];
    }
    acc[item.subcategory].push(item);
    return acc;
  }, {});

  // Handle saving the schema data
  const handleSaveAll = () => {
    // Export schema data to save it
    const schemaJson = exportSchemaData();
    
    // In a real application, this would be saved to the server or local storage
    localStorage.setItem('oneCalcSchemaData', schemaJson);
    
    // Show feedback to the user
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };
  
  return (
    <div className="schema-tables">
      <div className="schema-actions">
        <button 
          className="save-all-button"
          onClick={handleSaveAll}
        >
          Save All Changes
        </button>
        {isSaved && (
          <div className="save-confirmation">
            All changes saved successfully!
          </div>
        )}
      </div>
      
      {Object.entries(itemsBySubcategory).map(([subcategory, subcategoryItems]) => (
        <div 
          key={subcategory}
          className={`schema-table ${schemaType === 'costs' ? 'costs-table' : 'revenue-table'}`}
        >
          <div className="table-header">
            <h2>{schemaData?.subcategoryLabels?.[subcategory] || subcategory}</h2>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  {years.map(year => (
                    <th key={year} colSpan="2">{year}</th>
                  ))}
                  <th>Actions</th>
                </tr>
                <tr>
                  <th></th>
                  {years.map(year => (
                    <React.Fragment key={year}>
                      <th>Min</th>
                      <th>Max</th>
                    </React.Fragment>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {subcategoryItems.map(item => (
                  <SchemaItemRow 
                    key={item.id} 
                    item={item} 
                    years={years}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchemaTable; 