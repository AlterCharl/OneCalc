import React from 'react';
import { useSchemaData } from '../../contexts/SchemaContext';

const SchemaPage = () => {
  const { schemaData, calculateTotals } = useSchemaData();
  const totals = calculateTotals();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Financial Schema</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Schema Overview</h2>
        <p className="mb-4">
          Set your base financial projections here. These values will be used as defaults by all calculator modules.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <h3 className="font-medium mb-2">Net Revenue</h3>
            {Object.keys(totals.net).map(year => (
              <p key={year} className="text-sm mb-1">
                {year}: R {totals.net[year].min.toLocaleString()} to R {totals.net[year].max.toLocaleString()}
              </p>
            ))}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Total Costs</h3>
            {Object.keys(totals.costs).map(year => (
              <p key={year} className="text-sm mb-1">
                {year}: R {totals.costs[year].min.toLocaleString()} to R {totals.costs[year].max.toLocaleString()}
              </p>
            ))}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Total Revenue</h3>
            {Object.keys(totals.revenue).map(year => (
              <p key={year} className="text-sm mb-1">
                {year}: R {totals.revenue[year].min.toLocaleString()} to R {totals.revenue[year].max.toLocaleString()}
              </p>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Schema Items</h2>
        <p>
          {Object.keys(schemaData.items).length} items defined in the schema.
        </p>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Cost Categories</h3>
          <ul className="list-disc pl-5">
            {schemaData.categories.cost.map(category => (
              <li key={category}>{schemaData.subcategoryLabels[category]}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Revenue Categories</h3>
          <ul className="list-disc pl-5">
            {schemaData.categories.revenue.map(category => (
              <li key={category}>{schemaData.subcategoryLabels[category]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchemaPage; 