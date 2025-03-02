/**
 * Default Schema Data
 * 
 * Provides the initial structure and data for the financial schema
 */

export const defaultSchemaData = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  
  // Define the categories and subcategories
  categories: {
    cost: ['employee', 'tech_development', 'operational', 'marketing'],
    revenue: ['transaction_fees', 'subscriptions', 'logistics', 'other']
  },
  
  // Labels for subcategories
  subcategoryLabels: {
    'employee': 'Employee Costs',
    'tech_development': 'Tech Development',
    'operational': 'Operational Costs',
    'marketing': 'Marketing Costs',
    'transaction_fees': 'Transaction Fees',
    'subscriptions': 'Subscriptions',
    'logistics': 'Logistics',
    'other': 'Other Revenue'
  },
  
  // Schema items
  items: {
    // Employee Costs
    'cost.employee.executives': {
      id: 'cost.employee.executives',
      name: 'Executive Team',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 600000, max: 750000 },
        '2027': { min: 660000, max: 825000 },
        '2028': { min: 726000, max: 907500 },
        '2029': { min: 798600, max: 998250 }
      },
      metadata: {
        description: 'Salaries and benefits for executive team members',
        unit: 'currency',
        costType: 'fixed'
      }
    },
    'cost.employee.frontend_devs': {
      id: 'cost.employee.frontend_devs',
      name: 'Frontend Developers',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 400000, max: 550000 },
        '2027': { min: 480000, max: 660000 },
        '2028': { min: 576000, max: 792000 },
        '2029': { min: 691200, max: 950400 }
      },
      metadata: {
        description: 'Salaries and benefits for frontend development team',
        unit: 'currency',
        costType: 'semi-variable'
      }
    },
    'cost.employee.backend_devs': {
      id: 'cost.employee.backend_devs',
      name: 'Backend Developers',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 450000, max: 600000 },
        '2027': { min: 540000, max: 720000 },
        '2028': { min: 648000, max: 864000 },
        '2029': { min: 777600, max: 1036800 }
      },
      metadata: {
        description: 'Salaries and benefits for backend development team',
        unit: 'currency',
        costType: 'semi-variable'
      }
    },
    
    // Transaction Fees
    'revenue.transaction_fees.traditional_market': {
      id: 'revenue.transaction_fees.traditional_market',
      name: 'Traditional Market Fees',
      category: 'revenue',
      subcategory: 'transaction_fees',
      yearData: {
        '2026': { min: 800000, max: 1200000 },
        '2027': { min: 1600000, max: 2400000 },
        '2028': { min: 3200000, max: 4800000 },
        '2029': { min: 6400000, max: 9600000 }
      },
      metadata: {
        description: 'Transaction fees from traditional market segment',
        unit: 'currency',
        revenueType: 'variable'
      }
    },
    'revenue.transaction_fees.b2b': {
      id: 'revenue.transaction_fees.b2b',
      name: 'B2B Transaction Fees',
      category: 'revenue',
      subcategory: 'transaction_fees',
      yearData: {
        '2026': { min: 400000, max: 600000 },
        '2027': { min: 800000, max: 1200000 },
        '2028': { min: 1600000, max: 2400000 },
        '2029': { min: 3200000, max: 4800000 }
      },
      metadata: {
        description: 'Transaction fees from B2B market segment',
        unit: 'currency',
        revenueType: 'variable'
      }
    }
  }
};

export default defaultSchemaData; 