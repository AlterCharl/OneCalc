import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { defaultSchemaData } from './defaultSchemaData';
import { mergeBuyersPortalSchema, importBuyersPortalSchema } from '../utils/schemaImporter';

// Create the context
const SchemaContext = createContext();

// Additional schema items to ensure comprehensive coverage
const additionalSchemaItems = {
  // Additional Employee Costs
  'cost.employee.product_management': {
    id: 'cost.employee.product_management',
    name: 'Product Management',
    category: 'cost',
    subcategory: 'employee',
    yearData: {
      '2026': { min: 350000, max: 480000 },
      '2027': { min: 385000, max: 528000 },
      '2028': { min: 423500, max: 580800 },
      '2029': { min: 465850, max: 638880 }
    },
    metadata: {
      description: 'Salaries and benefits for product managers',
      unit: 'currency',
      costType: 'fixed'
    }
  },
  'cost.employee.qa_testing': {
    id: 'cost.employee.qa_testing',
    name: 'QA & Testing',
    category: 'cost',
    subcategory: 'employee',
    yearData: {
      '2026': { min: 300000, max: 420000 },
      '2027': { min: 330000, max: 462000 },
      '2028': { min: 363000, max: 508200 },
      '2029': { min: 399300, max: 559020 }
    },
    metadata: {
      description: 'Salaries and benefits for QA engineers and testers',
      unit: 'currency',
      costType: 'semi-variable'
    }
  },
  'cost.employee.customer_support': {
    id: 'cost.employee.customer_support',
    name: 'Customer Support',
    category: 'cost',
    subcategory: 'employee',
    yearData: {
      '2026': { min: 250000, max: 350000 },
      '2027': { min: 350000, max: 490000 },
      '2028': { min: 490000, max: 686000 },
      '2029': { min: 686000, max: 960400 }
    },
    metadata: {
      description: 'Salaries and benefits for customer support team',
      unit: 'currency',
      costType: 'variable'
    }
  },
  
  // Tech Development Costs
  'cost.tech_development.cloud_infrastructure': {
    id: 'cost.tech_development.cloud_infrastructure',
    name: 'Cloud Infrastructure',
    category: 'cost',
    subcategory: 'tech_development',
    yearData: {
      '2026': { min: 120000, max: 180000 },
      '2027': { min: 180000, max: 270000 },
      '2028': { min: 270000, max: 405000 },
      '2029': { min: 405000, max: 607500 }
    },
    metadata: {
      description: 'AWS/Azure/GCP hosting and services',
      unit: 'currency',
      costType: 'variable'
    }
  },
  'cost.tech_development.third_party_apis': {
    id: 'cost.tech_development.third_party_apis',
    name: 'Third-party APIs',
    category: 'cost',
    subcategory: 'tech_development',
    yearData: {
      '2026': { min: 80000, max: 120000 },
      '2027': { min: 96000, max: 144000 },
      '2028': { min: 115200, max: 172800 },
      '2029': { min: 138240, max: 207360 }
    },
    metadata: {
      description: 'Payment processors, mapping services, etc.',
      unit: 'currency',
      costType: 'variable'
    }
  },
  'cost.tech_development.software_licenses': {
    id: 'cost.tech_development.software_licenses',
    name: 'Software Licenses',
    category: 'cost',
    subcategory: 'tech_development',
    yearData: {
      '2026': { min: 50000, max: 75000 },
      '2027': { min: 60000, max: 90000 },
      '2028': { min: 72000, max: 108000 },
      '2029': { min: 86400, max: 129600 }
    },
    metadata: {
      description: 'Development tools, monitoring services, etc.',
      unit: 'currency',
      costType: 'fixed'
    }
  },
  
  // Operational Costs
  'cost.operational.office_rent': {
    id: 'cost.operational.office_rent',
    name: 'Office Rent',
    category: 'cost',
    subcategory: 'operational',
    yearData: {
      '2026': { min: 150000, max: 200000 },
      '2027': { min: 165000, max: 220000 },
      '2028': { min: 181500, max: 242000 },
      '2029': { min: 199650, max: 266200 }
    },
    metadata: {
      description: 'Office space and facilities',
      unit: 'currency',
      costType: 'fixed'
    }
  },
  'cost.operational.utilities': {
    id: 'cost.operational.utilities',
    name: 'Utilities',
    category: 'cost',
    subcategory: 'operational',
    yearData: {
      '2026': { min: 30000, max: 45000 },
      '2027': { min: 33000, max: 49500 },
      '2028': { min: 36300, max: 54450 },
      '2029': { min: 39930, max: 59895 }
    },
    metadata: {
      description: 'Electricity, water, internet, etc.',
      unit: 'currency',
      costType: 'semi-variable'
    }
  },
  'cost.operational.insurance': {
    id: 'cost.operational.insurance',
    name: 'Insurance',
    category: 'cost',
    subcategory: 'operational',
    yearData: {
      '2026': { min: 40000, max: 60000 },
      '2027': { min: 44000, max: 66000 },
      '2028': { min: 48400, max: 72600 },
      '2029': { min: 53240, max: 79860 }
    },
    metadata: {
      description: 'Business insurance policies',
      unit: 'currency',
      costType: 'fixed'
    }
  },
  
  // Marketing Costs
  'cost.marketing.digital_ads': {
    id: 'cost.marketing.digital_ads',
    name: 'Digital Advertising',
    category: 'cost',
    subcategory: 'marketing',
    yearData: {
      '2026': { min: 100000, max: 150000 },
      '2027': { min: 200000, max: 300000 },
      '2028': { min: 300000, max: 450000 },
      '2029': { min: 450000, max: 675000 }
    },
    metadata: {
      description: 'Google, Facebook, LinkedIn ads',
      unit: 'currency',
      costType: 'variable'
    }
  },
  'cost.marketing.content_creation': {
    id: 'cost.marketing.content_creation',
    name: 'Content Creation',
    category: 'cost',
    subcategory: 'marketing',
    yearData: {
      '2026': { min: 60000, max: 90000 },
      '2027': { min: 72000, max: 108000 },
      '2028': { min: 86400, max: 129600 },
      '2029': { min: 103680, max: 155520 }
    },
    metadata: {
      description: 'Blog posts, videos, social media',
      unit: 'currency',
      costType: 'semi-variable'
    }
  },
  
  // Transaction Fees Revenue
  'revenue.transaction_fees.financial_services': {
    id: 'revenue.transaction_fees.financial_services',
    name: 'Financial Services',
    category: 'revenue',
    subcategory: 'transaction_fees',
    yearData: {
      '2026': { min: 250000, max: 375000 },
      '2027': { min: 500000, max: 750000 },
      '2028': { min: 1000000, max: 1500000 },
      '2029': { min: 2000000, max: 3000000 }
    },
    metadata: {
      description: 'Transaction fees from financial services (loans, payments, etc.)',
      unit: 'currency',
      revenueType: 'variable'
    }
  },
  
  // Subscription Revenue Streams - Buyers
  'revenue.subscriptions.buyers_premium': {
    id: 'revenue.subscriptions.buyers_premium',
    name: 'Buyers Premium Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 180000, max: 270000 },
      '2027': { min: 360000, max: 540000 },
      '2028': { min: 720000, max: 1080000 },
      '2029': { min: 1440000, max: 2160000 }
    },
    metadata: {
      description: 'Premium tier subscription revenue from buyers (additional modules, priority access)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  'revenue.subscriptions.buyers_standard': {
    id: 'revenue.subscriptions.buyers_standard',
    name: 'Buyers Standard Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 90000, max: 135000 },
      '2027': { min: 180000, max: 270000 },
      '2028': { min: 360000, max: 540000 },
      '2029': { min: 720000, max: 1080000 }
    },
    metadata: {
      description: 'Standard tier subscription revenue from buyers (basic access)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  'revenue.subscriptions.buyers_basic': {
    id: 'revenue.subscriptions.buyers_basic',
    name: 'Buyers Basic Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 45000, max: 67500 },
      '2027': { min: 90000, max: 135000 },
      '2028': { min: 180000, max: 270000 },
      '2029': { min: 360000, max: 540000 }
    },
    metadata: {
      description: 'Basic tier subscription revenue from buyers (limited features, entry-level)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  'revenue.subscriptions.buyers_enterprise': {
    id: 'revenue.subscriptions.buyers_enterprise',
    name: 'Buyers Enterprise Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 360000, max: 540000 },
      '2027': { min: 720000, max: 1080000 },
      '2028': { min: 1440000, max: 2160000 },
      '2029': { min: 2880000, max: 4320000 }
    },
    metadata: {
      description: 'Enterprise tier subscription revenue from buyers (all features, advanced support, custom integrations)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  
  // Subscription Revenue Streams - Farmers
  'revenue.subscriptions.farmers_premium': {
    id: 'revenue.subscriptions.farmers_premium',
    name: 'Farmers Premium Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 120000, max: 180000 },
      '2027': { min: 240000, max: 360000 },
      '2028': { min: 480000, max: 720000 },
      '2029': { min: 960000, max: 1440000 }
    },
    metadata: {
      description: 'Premium tier subscription revenue from farmers (additional modules, analytics)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  'revenue.subscriptions.farmers_standard': {
    id: 'revenue.subscriptions.farmers_standard',
    name: 'Farmers Standard Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 60000, max: 90000 },
      '2027': { min: 120000, max: 180000 },
      '2028': { min: 240000, max: 360000 },
      '2029': { min: 480000, max: 720000 }
    },
    metadata: {
      description: 'Standard tier subscription revenue from farmers (basic access)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  'revenue.subscriptions.farmers_basic': {
    id: 'revenue.subscriptions.farmers_basic',
    name: 'Farmers Basic Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 30000, max: 45000 },
      '2027': { min: 60000, max: 90000 },
      '2028': { min: 120000, max: 180000 },
      '2029': { min: 240000, max: 360000 }
    },
    metadata: {
      description: 'Basic tier subscription revenue from farmers (limited features, entry-level)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  'revenue.subscriptions.farmers_enterprise': {
    id: 'revenue.subscriptions.farmers_enterprise',
    name: 'Farmers Enterprise Subscriptions',
    category: 'revenue',
    subcategory: 'subscriptions',
    yearData: {
      '2026': { min: 240000, max: 360000 },
      '2027': { min: 480000, max: 720000 },
      '2028': { min: 960000, max: 1440000 },
      '2029': { min: 1920000, max: 2880000 }
    },
    metadata: {
      description: 'Enterprise tier subscription revenue from farmers (all features, advanced analytics, specialized tools)',
      unit: 'currency',
      revenueType: 'recurring'
    }
  },
  
  'revenue.logistics.shipping': {
    id: 'revenue.logistics.shipping',
    name: 'Shipping Services',
    category: 'revenue',
    subcategory: 'logistics',
    yearData: {
      '2026': { min: 200000, max: 300000 },
      '2027': { min: 400000, max: 600000 },
      '2028': { min: 800000, max: 1200000 },
      '2029': { min: 1600000, max: 2400000 }
    },
    metadata: {
      description: 'Revenue from shipping services',
      unit: 'currency',
      revenueType: 'variable'
    }
  },
  'revenue.logistics.fulfillment': {
    id: 'revenue.logistics.fulfillment',
    name: 'Fulfillment Services',
    category: 'revenue',
    subcategory: 'logistics',
    yearData: {
      '2026': { min: 150000, max: 225000 },
      '2027': { min: 300000, max: 450000 },
      '2028': { min: 600000, max: 900000 },
      '2029': { min: 1200000, max: 1800000 }
    },
    metadata: {
      description: 'Revenue from fulfillment services',
      unit: 'currency',
      revenueType: 'variable'
    }
  },
  'revenue.other.data_insights': {
    id: 'revenue.other.data_insights',
    name: 'Data Insights',
    category: 'revenue',
    subcategory: 'other',
    yearData: {
      '2026': { min: 100000, max: 150000 },
      '2027': { min: 200000, max: 300000 },
      '2028': { min: 400000, max: 600000 },
      '2029': { min: 800000, max: 1200000 }
    },
    metadata: {
      description: 'Revenue from selling anonymized data insights',
      unit: 'currency',
      revenueType: 'variable'
    }
  },
  'revenue.other.api_access': {
    id: 'revenue.other.api_access',
    name: 'API Access',
    category: 'revenue',
    subcategory: 'other',
    yearData: {
      '2026': { min: 50000, max: 75000 },
      '2027': { min: 100000, max: 150000 },
      '2028': { min: 200000, max: 300000 },
      '2029': { min: 400000, max: 600000 }
    },
    metadata: {
      description: 'Revenue from API access for third-party integrations',
      unit: 'currency',
      revenueType: 'recurring'
    }
  }
};

// Custom hook for accessing the schema data
export const useSchemaData = () => {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchemaData must be used within a SchemaDataProvider');
  }
  return context;
};

// Schema provider component
export const SchemaProvider = ({ children }) => {
  // Function to add missing items to schema data
  const addMissingSchemaItems = (data) => {
    const newItems = { ...data.items };
    
    // Add each additional item if it doesn't already exist
    Object.entries(additionalSchemaItems).forEach(([id, item]) => {
      if (!newItems[id]) {
        newItems[id] = item;
      }
    });
    
    return {
      ...data,
      items: newItems,
      lastUpdated: new Date().toISOString()
    };
  };

  // Initialize state with data from localStorage if available
  const [schemaData, setSchemaData] = useState(() => {
    try {
      // Try to load from localStorage
      const savedData = localStorage.getItem('oneCalcSchemaData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Add missing items to loaded data
        return addMissingSchemaItems(parsedData);
      }
    } catch (error) {
      console.error('Error loading schema data from localStorage:', error);
    }
    // Fall back to default data with additional items
    return addMissingSchemaItems(defaultSchemaData);
  });
  
  // Make schema data available globally for non-React code
  useEffect(() => {
    window.__SCHEMA_DATA__ = schemaData;
    
    return () => {
      delete window.__SCHEMA_DATA__;
    };
  }, [schemaData]);
  
  // Function to update a schema item
  const updateSchemaItem = useCallback((itemId, updates) => {
    if (!itemId) {
      console.error('updateSchemaItem: No item ID provided');
      return;
    }
    
    setSchemaData(prevData => {
      const item = prevData.items[itemId];
      if (!item) {
        console.error(`updateSchemaItem: Item with ID ${itemId} not found`);
        return prevData;
      }
      
      return {
        ...prevData,
        lastUpdated: new Date().toISOString(),
        items: {
          ...prevData.items,
          [itemId]: {
            ...item,
            ...updates
          }
        }
      };
    });
  }, []);
  
  // Function to add a new schema item
  const addSchemaItem = useCallback((item) => {
    if (!item || !item.id) {
      console.error('addSchemaItem: Invalid item or missing ID');
      return;
    }
    
    setSchemaData(prevData => ({
      ...prevData,
      lastUpdated: new Date().toISOString(),
      items: {
        ...prevData.items,
        [item.id]: item
      }
    }));
  }, []);
  
  // Function to remove a schema item
  const removeSchemaItem = useCallback((itemId) => {
    if (!itemId) {
      console.error('removeSchemaItem: No item ID provided');
      return;
    }
    
    setSchemaData(prevData => {
      const { [itemId]: removedItem, ...remainingItems } = prevData.items;
      
      if (!removedItem) {
        console.error(`removeSchemaItem: Item with ID ${itemId} not found`);
        return prevData;
      }
      
      return {
        ...prevData,
        lastUpdated: new Date().toISOString(),
        items: remainingItems
      };
    });
  }, []);
  
  // Function to export schema data as JSON string
  const exportSchemaData = useCallback(() => {
    return JSON.stringify(schemaData, null, 2);
  }, [schemaData]);
  
  // Function to import schema data from JSON
  const importSchemaData = useCallback((jsonData) => {
    // If jsonData is null, reset to defaults
    if (jsonData === null) {
      setSchemaData(defaultSchemaData);
      return;
    }
    
    try {
      // Validate the incoming data structure
      if (!jsonData.version || !jsonData.categories || !jsonData.items) {
        throw new Error('Invalid schema data structure');
      }
      
      // Update the schema data
      setSchemaData({
        ...jsonData,
        lastUpdated: new Date().toISOString()
      });
      
      // Save to localStorage
      localStorage.setItem('oneCalcSchemaData', JSON.stringify(jsonData));
    } catch (error) {
      console.error('Error importing schema data:', error);
      alert('Failed to import schema data. Invalid data structure.');
    }
  }, []);
  
  // Import Buyers Portal schema data
  const importBuyersPortalData = useCallback(() => {
    try {
      const buyersPortalData = importBuyersPortalSchema();
      setSchemaData(currentData => mergeBuyersPortalSchema(currentData));
      return true;
    } catch (error) {
      console.error("Failed to import Buyers Portal schema data:", error);
      return false;
    }
  }, []);
  
  // Function to calculate totals from schema data
  const calculateTotals = useCallback(() => {
    const years = ['2026', '2027', '2028', '2029'];
    const items = Object.values(schemaData.items);
    
    // Initialize totals
    const totals = {
      costs: {},
      revenue: {},
      net: {}
    };
    
    years.forEach(year => {
      totals.costs[year] = { min: 0, max: 0 };
      totals.revenue[year] = { min: 0, max: 0 };
      totals.net[year] = { min: 0, max: 0 };
    });
    
    // Calculate totals for costs and revenue
    items.forEach(item => {
      years.forEach(year => {
        if (item.category === 'cost') {
          totals.costs[year].min += item.yearData[year].min;
          totals.costs[year].max += item.yearData[year].max;
        } else if (item.category === 'revenue') {
          totals.revenue[year].min += item.yearData[year].min;
          totals.revenue[year].max += item.yearData[year].max;
        }
      });
    });
    
    // Calculate net totals (revenue - costs)
    years.forEach(year => {
      totals.net[year].min = totals.revenue[year].min - totals.costs[year].max; // Worst case
      totals.net[year].max = totals.revenue[year].max - totals.costs[year].min; // Best case
    });
    
    return totals;
  }, [schemaData]);
  
  // Context value
  const value = {
    schemaData,
    updateSchemaItem,
    addSchemaItem,
    removeSchemaItem,
    exportSchemaData,
    importSchemaData,
    calculateTotals,
    importBuyersPortalData
  };
  
  return (
    <SchemaContext.Provider value={value}>
      {children}
    </SchemaContext.Provider>
  );
};

export default SchemaContext; 