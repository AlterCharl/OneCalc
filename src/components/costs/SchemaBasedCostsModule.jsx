import React, { useState, useMemo, useCallback } from 'react';
import { useSchemaData } from '../../contexts/SchemaContext';
import { useModuleData } from '../../contexts/ModuleContext';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';
import EnhancedCostSliders from './EnhancedCostSliders';

/**
 * SchemaBasedCostsModule
 * Displays cost items from the schema and allows adjusting them with sliders
 */
const SchemaBasedCostsModule = () => {
  // Get schema data
  const { schemaData, updateSchemaItem } = useSchemaData();
  
  // Get module data
  const { setModuleData, registerModuleCalculation, yearRange } = useModuleData();
  
  // State for selected year and category
  const [selectedYear, setSelectedYear] = useState(2026);
  const [expandedCategories, setExpandedCategories] = useState({
    employee: true,
    tech_development: true,
    operational: true,
    marketing: true
  });
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  
  // Get all cost items from the schema
  const costItems = useMemo(() => {
    if (!schemaData || !schemaData.items) return {};
    
    // Group cost items by subcategory
    const grouped = {};
    
    Object.values(schemaData.items).forEach(item => {
      if (item.category === 'cost') {
        if (!grouped[item.subcategory]) {
          grouped[item.subcategory] = [];
        }
        grouped[item.subcategory].push(item);
      }
    });
    
    return grouped;
  }, [schemaData]);
  
  // Store the default values from the schema for reset functionality
  const defaultCostValues = useMemo(() => {
    const defaults = {};
    
    if (schemaData && schemaData.items) {
      Object.values(schemaData.items).forEach(item => {
        if (item.category === 'cost' && item.yearData) {
          defaults[item.id] = { 
            yearData: { ...item.yearData },
            metadata: { ...item.metadata }
          };
        }
      });
    }
    
    return defaults;
  }, []);
  
  // Handle slider change for a cost item value (min/max)
  const handleCostValueChange = useCallback((itemId, yearKey, isMin, value) => {
    const item = schemaData.items[itemId];
    if (!item) return;
    
    const yearData = { ...item.yearData };
    
    if (isMin) {
      yearData[yearKey] = { 
        ...yearData[yearKey], 
        min: parseInt(value, 10) 
      };
    } else {
      yearData[yearKey] = { 
        ...yearData[yearKey], 
        max: parseInt(value, 10) 
      };
    }
    
    updateSchemaItem(itemId, { yearData });
  }, [schemaData, updateSchemaItem]);
  
  // Handle quantity change for a cost item
  const handleQuantityChange = useCallback((itemId, yearKey, quantity) => {
    const item = schemaData.items[itemId];
    if (!item) return;
    
    const metadata = { ...item.metadata };
    
    if (!metadata.quantity) {
      metadata.quantity = {};
    }
    
    metadata.quantity[yearKey] = quantity;
    
    // Also update the cost values based on the quantity and per-unit values
    if (metadata.perUnitCost) {
      const yearData = { ...item.yearData };
      const perUnitMin = metadata.perUnitCost.min || 0;
      const perUnitMax = metadata.perUnitCost.max || 0;
      
      yearData[yearKey] = {
        min: perUnitMin * quantity,
        max: perUnitMax * quantity
      };
      
      updateSchemaItem(itemId, { metadata, yearData });
    } else {
      updateSchemaItem(itemId, { metadata });
    }
  }, [schemaData, updateSchemaItem]);
  
  // Handle growth percentage change for a cost item
  const handleGrowthChange = useCallback((itemId, yearKey, growthPercentage) => {
    const item = schemaData.items[itemId];
    if (!item) return;
    
    const metadata = { ...item.metadata };
    
    if (!metadata.growthPercentage) {
      metadata.growthPercentage = {};
    }
    
    metadata.growthPercentage[yearKey] = growthPercentage;
    
    // Apply the growth to the next year if it exists
    const nextYear = parseInt(yearKey) + 1;
    if (item.yearData && item.yearData[yearKey] && item.yearData[nextYear]) {
      const yearData = { ...item.yearData };
      const growthFactor = 1 + (growthPercentage / 100);
      
      yearData[nextYear] = {
        min: Math.round(yearData[yearKey].min * growthFactor),
        max: Math.round(yearData[yearKey].max * growthFactor)
      };
      
      updateSchemaItem(itemId, { metadata, yearData });
    } else {
      updateSchemaItem(itemId, { metadata });
    }
  }, [schemaData, updateSchemaItem]);
  
  // Reset all cost values for the current year to their defaults
  const resetCostsForYear = useCallback(() => {
    if (!schemaData || !schemaData.items) return;
    
    Object.values(schemaData.items).forEach(item => {
      if (item.category === 'cost' && defaultCostValues[item.id]) {
        // Get default values for this item
        const defaultValues = defaultCostValues[item.id];
        
        // Only reset if we have default values for the selected year
        if (defaultValues.yearData[selectedYear]) {
          const yearData = { ...item.yearData };
          yearData[selectedYear] = { ...defaultValues.yearData[selectedYear] };
          
          const metadata = { ...item.metadata };
          if (defaultValues.metadata) {
            // Reset quantity and growth metadata for the selected year
            if (defaultValues.metadata.quantity && defaultValues.metadata.quantity[selectedYear]) {
              if (!metadata.quantity) metadata.quantity = {};
              metadata.quantity[selectedYear] = defaultValues.metadata.quantity[selectedYear];
            }
            
            if (defaultValues.metadata.growthPercentage && defaultValues.metadata.growthPercentage[selectedYear]) {
              if (!metadata.growthPercentage) metadata.growthPercentage = {};
              metadata.growthPercentage[selectedYear] = defaultValues.metadata.growthPercentage[selectedYear];
            }
          }
          
          updateSchemaItem(item.id, { yearData, metadata });
        }
      }
    });
    
    setResetConfirmOpen(false);
  }, [schemaData, defaultCostValues, selectedYear, updateSchemaItem]);
  
  // Debounced version of handlers
  const debouncedHandleCostValueChange = useDebouncedCallback(handleCostValueChange, 300);
  const debouncedHandleQuantityChange = useDebouncedCallback(handleQuantityChange, 300);
  const debouncedHandleGrowthChange = useDebouncedCallback(handleGrowthChange, 300);
  
  // Toggle a category's expanded state
  const toggleCategory = useCallback((category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);
  
  // Calculate totals for the current year
  const yearTotals = useMemo(() => {
    if (!schemaData || !schemaData.items) return { min: 0, max: 0 };
    
    let minTotal = 0;
    let maxTotal = 0;
    
    Object.values(schemaData.items).forEach(item => {
      if (item.category === 'cost' && item.yearData && item.yearData[selectedYear]) {
        minTotal += item.yearData[selectedYear].min;
        maxTotal += item.yearData[selectedYear].max;
      }
    });
    
    return { min: minTotal, max: maxTotal };
  }, [schemaData, selectedYear]);
  
  // Register calculation function with module context
  React.useEffect(() => {
    registerModuleCalculation('schemaCosts', () => {
      const costsByYear = {};
      
      yearRange.forEach(year => {
        let minTotal = 0;
        let maxTotal = 0;
        let costBreakdown = {};
        
        Object.values(schemaData.items).forEach(item => {
          if (item.category === 'cost' && item.yearData && item.yearData[year]) {
            minTotal += item.yearData[year].min;
            maxTotal += item.yearData[year].max;
            
            // Add to breakdown by subcategory
            if (!costBreakdown[item.subcategory]) {
              costBreakdown[item.subcategory] = { min: 0, max: 0 };
            }
            
            costBreakdown[item.subcategory].min += item.yearData[year].min;
            costBreakdown[item.subcategory].max += item.yearData[year].max;
          }
        });
        
        costsByYear[year] = {
          total: { min: minTotal, max: maxTotal },
          breakdown: costBreakdown
        };
      });
      
      return costsByYear;
    });
  }, [registerModuleCalculation, schemaData, yearRange]);
  
  // Formatting function for currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Cost Scenario Planner</h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
          >
            Reset Values
          </button>
          <div className="flex items-center space-x-2">
            <label htmlFor="yearSelector" className="text-sm font-medium text-gray-700">
              Year:
            </label>
            <select
              id="yearSelector"
              className="border border-gray-300 rounded-md p-2 bg-white text-gray-700"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            >
              {yearRange.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Reset confirmation modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Reset Cost Values</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reset all cost values for {selectedYear} to their defaults?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={resetCostsForYear}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Reset Values
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-4 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Costs ({selectedYear})
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-500">Range:</p>
            <p className="text-lg font-bold text-gray-800">
              {formatCurrency(yearTotals.min)} - {formatCurrency(yearTotals.max)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.keys(costItems).map(subcategory => {
          const items = costItems[subcategory];
          const isExpanded = expandedCategories[subcategory] || false;
          const subcategoryLabel = schemaData.subcategoryLabels[subcategory] || subcategory;
          
          // Calculate subcategory totals
          let subcategoryMinTotal = 0;
          let subcategoryMaxTotal = 0;
          
          items.forEach(item => {
            if (item.yearData && item.yearData[selectedYear]) {
              subcategoryMinTotal += item.yearData[selectedYear].min;
              subcategoryMaxTotal += item.yearData[selectedYear].max;
            }
          });
          
          return (
            <div key={subcategory} className="border border-gray-200 rounded-md overflow-hidden">
              <div 
                className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleCategory(subcategory)}
              >
                <h3 className="text-lg font-medium text-gray-800">{subcategoryLabel}</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total:</p>
                    <p className="font-semibold">
                      {formatCurrency(subcategoryMinTotal)} - {formatCurrency(subcategoryMaxTotal)}
                    </p>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    {isExpanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 space-y-6">
                  {items.map(item => {
                    const yearData = item.yearData?.[selectedYear] || { min: 0, max: 0 };
                    
                    return (
                      <div key={item.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.metadata?.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Current Value:</p>
                            <p className="font-semibold">
                              {formatCurrency(yearData.min)} - {formatCurrency(yearData.max)}
                            </p>
                          </div>
                        </div>
                        
                        <EnhancedCostSliders
                          itemId={item.id}
                          yearData={yearData}
                          selectedYear={selectedYear}
                          metadata={item.metadata}
                          onQuantityChange={debouncedHandleQuantityChange}
                          onValueChange={debouncedHandleCostValueChange}
                          onGrowthChange={debouncedHandleGrowthChange}
                          formatCurrency={formatCurrency}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchemaBasedCostsModule; 