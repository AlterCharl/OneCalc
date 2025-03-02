/**
 * Schema Calculator Utility
 * 
 * Calculates financial totals based on a business model schema
 */

/**
 * Calculate totals from schema data
 * @param {Object} schemaData - The schema data containing nodes and connections
 * @param {boolean} useMaxValues - Whether to use maximum values for calculations
 * @returns {Object} Object containing totalCostsByYear, totalRevenueByYear, and netProfitByYear
 */
export const calculateSchemaTotals = (schemaData, useMaxValues = false) => {
  if (!schemaData || !schemaData.nodes || !schemaData.connections) {
    console.warn('Invalid schema data provided to calculator');
    return {
      totalCostsByYear: {},
      totalRevenueByYear: {},
      netProfitByYear: {}
    };
  }

  console.log('Calculating schema totals with', 
    schemaData.nodes.length, 'nodes and', 
    schemaData.connections.length, 'connections',
    useMaxValues ? '(using max values)' : '(using min values)'
  );

  // Define the years we're calculating for
  const years = [2026, 2027, 2028, 2029];
  
  // Initialize results
  const results = {
    totalCostsByYear: {},
    totalRevenueByYear: {},
    netProfitByYear: {},
    nodeResults: {}
  };
  
  // Initialize totals for each year
  years.forEach(year => {
    results.totalCostsByYear[year] = 0;
    results.totalRevenueByYear[year] = 0;
    results.netProfitByYear[year] = 0;
  });

  // Process each node
  schemaData.nodes.forEach(node => {
    // Skip nodes without financial data
    if (!node.data || !node.data.financials) {
      return;
    }

    const nodeResults = {};
    
    // Process financial data for each year
    years.forEach(year => {
      const yearData = node.data.financials[year];
      if (!yearData) return;
      
      // Determine if this is a cost or revenue node
      const isCost = node.type === 'cost' || (yearData.value < 0 && node.type !== 'revenue');
      const isRevenue = node.type === 'revenue' || (yearData.value > 0 && node.type !== 'cost');
      
      // Get the value to use (min, max, or exact)
      let value = yearData.value || 0;
      
      if (yearData.min !== undefined && yearData.max !== undefined) {
        value = useMaxValues ? yearData.max : yearData.min;
      }
      
      // Store the result for this node and year
      nodeResults[year] = {
        value: Math.abs(value),
        type: isCost ? 'cost' : (isRevenue ? 'revenue' : 'neutral')
      };
      
      // Add to the appropriate total
      if (isCost) {
        results.totalCostsByYear[year] += Math.abs(value);
      } else if (isRevenue) {
        results.totalRevenueByYear[year] += Math.abs(value);
      }
    });
    
    // Store the results for this node
    results.nodeResults[node.id] = nodeResults;
  });
  
  // Calculate net profit for each year
  years.forEach(year => {
    results.netProfitByYear[year] = results.totalRevenueByYear[year] - results.totalCostsByYear[year];
  });
  
  return results;
};

/**
 * Default schema data structure
 */
export const defaultSchemaData = {
  nodes: [],
  connections: []
}; 