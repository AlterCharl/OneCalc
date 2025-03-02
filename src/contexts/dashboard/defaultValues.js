// Mock current user for demo purposes
export const mockCurrentUser = {
  id: 'user123',
  name: 'Demo User',
  email: 'demo@example.com'
};

// Define default values for compiled results to avoid undefined errors
export const defaultCompiledResults = {
  costsByYear: {
    '2026': 0,
    '2027': 0,
    '2028': 0,
    '2029': 0
  },
  revenuesByYear: {
    '2026': 0,
    '2027': 0,
    '2028': 0,
    '2029': 0
  },
  netProfitByYear: {
    '2026': 0,
    '2027': 0,
    '2028': 0,
    '2029': 0
  },
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
};

// Default structure for registered modules
export const defaultRegisteredModules = {
  costs: {},
  revenue: {},
  calculator: {}
}; 