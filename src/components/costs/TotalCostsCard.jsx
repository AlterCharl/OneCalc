import React from 'react';
import { useSchemaData } from '../../contexts/SchemaContext';
import { useModuleData } from '../../contexts/ModuleContext';

/**
 * TotalCostsCard - Displays total costs for all years in a card format
 */
const TotalCostsCard = () => {
  // Get schema data and module data
  const { schemaData } = useSchemaData();
  const { yearRange } = useModuleData();
  
  // Calculate totals for all years
  const yearTotals = React.useMemo(() => {
    if (!schemaData || !schemaData.items) return {};
    
    const totals = {};
    
    yearRange.forEach(year => {
      let minTotal = 0;
      let maxTotal = 0;
      
      Object.values(schemaData.items).forEach(item => {
        if (item.category === 'cost' && item.yearData && item.yearData[year]) {
          minTotal += item.yearData[year].min;
          maxTotal += item.yearData[year].max;
        }
      });
      
      totals[year] = { min: minTotal, max: maxTotal };
    });
    
    return totals;
  }, [schemaData, yearRange]);
  
  // Formatting function for currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Total Costs Projection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {yearRange.map(year => (
          <div key={year} className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{year}</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Projected Range:</p>
                <p className="text-lg font-bold text-gray-800">
                  {yearTotals[year] ? (
                    <>
                      {formatCurrency(yearTotals[year].min)} - {formatCurrency(yearTotals[year].max)}
                    </>
                  ) : (
                    'No data'
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalCostsCard; 