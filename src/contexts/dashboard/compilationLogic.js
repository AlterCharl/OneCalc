/**
 * Compilation utilities for dashboard data
 */
import { areObjectsEqual } from '../../utils/deepEqual';

// Import schema data
import { useSchemaData } from '../SchemaContext';

// Cache for the compilation results
let compilationCache = {
  lastRegisteredModules: null,
  lastSchemaData: null,
  lastResults: null
};

// Helper function to get schema data
const getSchemaDataForCompilation = () => {
  try {
    // This is just for accessing the schema outside React components
    // In a real implementation, this should be provided to the compilation function
    const schemaContext = window.__SCHEMA_CONTEXT__;
    return schemaContext ? schemaContext.schemaData : null;
  } catch (error) {
    console.error('Error accessing schema data:', error);
    return null;
  }
};

/**
 * Processes results from calculator modules
 * 
 * @param {Object} registeredModules Object containing all registered calculator modules
 * @returns {Object} Object containing results from all calculator modules
 */
export const processCalculatorModules = (registeredModules) => {
  const schemaResults = {};
  
  if (registeredModules.calculator) {
    Object.keys(registeredModules.calculator).forEach(id => {
      try {
        const getResults = registeredModules.calculator[id];
        if (typeof getResults === 'function') {
          const moduleResults = getResults();
          // Comment out verbose logging in production
          // console.log(`Results from calculator module ${id}:`, moduleResults);
          
          if (moduleResults && moduleResults.isReady) {
            schemaResults[id] = moduleResults;
          }
        }
      } catch (error) {
        console.error(`Error getting results from calculator module ${id}:`, error);
      }
    });
  }
  
  return schemaResults;
};

/**
 * Processes results from cost modules
 * 
 * @param {Object} registeredModules Object containing all registered cost modules
 * @returns {Array} Array of results from cost modules
 */
export const processCostModules = (registeredModules) => {
  const costModuleResults = [];
  
  if (registeredModules.costs) {
    Object.keys(registeredModules.costs).forEach(id => {
      try {
        const getResults = registeredModules.costs[id];
        if (typeof getResults === 'function') {
          const moduleResults = getResults();
          if (moduleResults && moduleResults.isReady) {
            costModuleResults.push(moduleResults);
          }
        }
      } catch (error) {
        console.error(`Error getting results from cost module ${id}:`, error);
      }
    });
  }
  
  return costModuleResults;
};

/**
 * Processes results from revenue modules
 * 
 * @param {Object} registeredModules Object containing all registered revenue modules
 * @returns {Array} Array of results from revenue modules
 */
export const processRevenueModules = (registeredModules) => {
  const revenueModuleResults = [];
  
  if (registeredModules.revenue) {
    Object.keys(registeredModules.revenue).forEach(id => {
      try {
        const getResults = registeredModules.revenue[id];
        if (typeof getResults === 'function') {
          const moduleResults = getResults();
          if (moduleResults && moduleResults.isReady) {
            revenueModuleResults.push(moduleResults);
          }
        }
      } catch (error) {
        console.error(`Error getting results from revenue module ${id}:`, error);
      }
    });
  }
  
  return revenueModuleResults;
};

/**
 * Calculates financial totals by year
 * 
 * @param {Object} schemaResults Results from schema calculator modules
 * @param {Array} costModuleResults Results from cost modules
 * @param {Array} revenueModuleResults Results from revenue modules
 * @param {Object} schemaData Optional schema data to include in totals
 * @returns {Object} Object containing costs, revenues, and net profit by year
 */
export const calculateFinancialTotals = (schemaResults, costModuleResults, revenueModuleResults, schemaData) => {
  const result = {
    costsByYear: { '2026': 0, '2027': 0, '2028': 0, '2029': 0 },
    revenuesByYear: { '2026': 0, '2027': 0, '2028': 0, '2029': 0 },
    netProfitByYear: { '2026': 0, '2027': 0, '2028': 0, '2029': 0 },
    costBreakdown: {},
    revenueBreakdown: {}
  };
  
  const years = ['2026', '2027', '2028', '2029'];
  
  // Initialize cost breakdown and revenue breakdown
  years.forEach(year => {
    result.costBreakdown[year] = {};
    result.revenueBreakdown[year] = {};
  });
  
  // First, include base schema data if available
  if (schemaData && schemaData.items) {
    // Create "schema" entries in the breakdowns
    years.forEach(year => {
      result.costBreakdown[year]['schema'] = 0;
      result.revenueBreakdown[year]['schema'] = 0;
    });
    
    Object.values(schemaData.items).forEach(item => {
      if (item.yearData) {
        years.forEach(year => {
          if (item.yearData[year]) {
            // Use average of min/max for financial projections
            const avgValue = (item.yearData[year].min + item.yearData[year].max) / 2;
            
            if (item.category === 'cost') {
              result.costsByYear[year] += avgValue;
              result.costBreakdown[year]['schema'] += avgValue;
            } else if (item.category === 'revenue') {
              result.revenuesByYear[year] += avgValue;
              result.revenueBreakdown[year]['schema'] += avgValue;
            }
          }
        });
      }
    });
  }
  
  years.forEach(year => {
    // Include schema results if available
    if (Object.keys(schemaResults).length > 0) {
      Object.keys(schemaResults).forEach(schemaId => {
        const schemaResult = schemaResults[schemaId];
        
        // Add to totals only if not using schema base
        // This prevents double-counting when a module is already using schema data
        const isUsingSchemaBase = schemaResult.usingSchemaBase === true;
        
        if (schemaResult.totalCostsByYear && schemaResult.totalCostsByYear[year]) {
          // Only add if not using schema base, or reduce by the schema base amount
          if (!isUsingSchemaBase) {
            result.costsByYear[year] += schemaResult.totalCostsByYear[year];
            
            // Add to breakdown
            result.costBreakdown[year][schemaId] = schemaResult.totalCostsByYear[year];
          }
        }
        
        if (schemaResult.totalRevenueByYear && schemaResult.totalRevenueByYear[year]) {
          // Only add if not using schema base
          if (!isUsingSchemaBase) {
            result.revenuesByYear[year] += schemaResult.totalRevenueByYear[year];
            
            // Add to breakdown
            result.revenueBreakdown[year][schemaId] = schemaResult.totalRevenueByYear[year];
          }
        }
      });
    }
    
    // Add costs from cost modules
    costModuleResults.forEach(moduleResult => {
      const moduleId = moduleResult.id || 'unknown';
      const isUsingSchemaBase = moduleResult.usingSchemaBase === true;
      
      if (moduleResult.totalCostsByYear && moduleResult.totalCostsByYear[year]) {
        // Only add if not using schema base
        if (!isUsingSchemaBase) {
          result.costsByYear[year] += moduleResult.totalCostsByYear[year];
          
          // Add to breakdown
          result.costBreakdown[year][moduleId] = moduleResult.totalCostsByYear[year];
        }
      }
    });
    
    // Add revenues from revenue modules
    revenueModuleResults.forEach(moduleResult => {
      const moduleId = moduleResult.id || 'unknown';
      const isUsingSchemaBase = moduleResult.usingSchemaBase === true;
      
      if (moduleResult.totalRevenueByYear && moduleResult.totalRevenueByYear[year]) {
        // Only add if not using schema base
        if (!isUsingSchemaBase) {
          result.revenuesByYear[year] += moduleResult.totalRevenueByYear[year];
          
          // Add to breakdown
          result.revenueBreakdown[year][moduleId] = moduleResult.totalRevenueByYear[year];
        }
      }
    });
    
    // Calculate net profit for each year
    result.netProfitByYear[year] = result.revenuesByYear[year] - result.costsByYear[year];
  });
  
  return result;
};

/**
 * Calculates summary metrics based on yearly financial totals
 * 
 * @param {Object} financialTotals Object containing costs, revenues, and net profit by year
 * @returns {Object} Object containing calculated summary metrics
 */
export const calculateSummaryMetrics = (financialTotals) => {
  const metrics = {
    totalThreeYearRevenue: 0,
    totalThreeYearCosts: 0,
    totalThreeYearProfit: 0,
    averageYearlyRevenue: 0,
    averageYearlyCosts: 0,
    revenueGrowthRate: 0,
    costGrowthRate: 0,
    breakEvenYear: 'Not within forecast period'
  };
  
  // Calculate three-year totals
  metrics.totalThreeYearRevenue = 
    financialTotals.revenuesByYear['2026'] + 
    financialTotals.revenuesByYear['2027'] + 
    financialTotals.revenuesByYear['2028'];
    
  metrics.totalThreeYearCosts = 
    financialTotals.costsByYear['2026'] + 
    financialTotals.costsByYear['2027'] + 
    financialTotals.costsByYear['2028'];
    
  metrics.totalThreeYearProfit = 
    metrics.totalThreeYearRevenue - metrics.totalThreeYearCosts;
    
  // Calculate averages
  metrics.averageYearlyRevenue = metrics.totalThreeYearRevenue / 3;
  metrics.averageYearlyCosts = metrics.totalThreeYearCosts / 3;
  
  // Calculate growth rates
  if (financialTotals.revenuesByYear['2026'] > 0) {
    metrics.revenueGrowthRate = 
      (financialTotals.revenuesByYear['2028'] / financialTotals.revenuesByYear['2026']) ** (1/2) - 1;
  }
  
  if (financialTotals.costsByYear['2026'] > 0) {
    metrics.costGrowthRate = 
      (financialTotals.costsByYear['2028'] / financialTotals.costsByYear['2026']) ** (1/2) - 1;
  }
  
  // Determine break-even year
  const years = ['2026', '2027', '2028', '2029'];
  const breakEvenYear = years.find(year => financialTotals.netProfitByYear[year] > 0);
  if (breakEvenYear) {
    metrics.breakEvenYear = breakEvenYear;
  }
  
  return metrics;
};

/**
 * Compiles all results from registered modules
 * 
 * @param {Object} registeredModules Object containing all registered modules
 * @param {Object} prevResults Previous compilation results (for optimization)
 * @param {Object} schemaData Optional schema data to include in totals
 * @returns {Object} Compiled results
 */
export const compileAllResults = (registeredModules, prevResults, schemaData) => {
  // Get schema data if not provided
  const schemaDataToUse = schemaData || getSchemaDataForCompilation();
  
  // Check cache first - include schema data in the cache check
  if (compilationCache.lastRegisteredModules && 
      areObjectsEqual(registeredModules, compilationCache.lastRegisteredModules) &&
      compilationCache.lastSchemaData && 
      areObjectsEqual(schemaDataToUse, compilationCache.lastSchemaData)) {
    return compilationCache.lastResults;
  }
  
  console.time('Dashboard compilation');
  
  // Process all module types
  const schemaResults = processCalculatorModules(registeredModules);
  const costModuleResults = processCostModules(registeredModules);
  const revenueModuleResults = processRevenueModules(registeredModules);
  
  // Calculate financial totals, including schema data
  const financialTotals = calculateFinancialTotals(
    schemaResults, 
    costModuleResults, 
    revenueModuleResults,
    schemaDataToUse
  );
  
  // Calculate summary metrics
  const summaryMetrics = calculateSummaryMetrics(financialTotals);
  
  // Compile final results
  const compiledResults = {
    schemaResults,
    costModuleResults,
    revenueModuleResults,
    financialTotals,
    summaryMetrics,
    lastUpdated: new Date().toISOString(),
    usingSchemaData: !!schemaDataToUse
  };
  
  console.timeEnd('Dashboard compilation');
  
  // Update cache
  compilationCache.lastRegisteredModules = JSON.parse(JSON.stringify(registeredModules));
  compilationCache.lastSchemaData = schemaDataToUse ? JSON.parse(JSON.stringify(schemaDataToUse)) : null;
  compilationCache.lastResults = compiledResults;
  
  return compiledResults;
}; 