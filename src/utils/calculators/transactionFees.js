/**
 * Transaction Fees Revenue Calculator
 * 
 * This calculator computes the revenue from transaction fees for the OneWORLD platform.
 * It accounts for transaction volume, average order value, and fee percentage for each year.
 * 
 * @param {Object} params - The parameters for the calculation
 * @param {Object} params.transactionVolume - Number of transactions per year
 * @param {Object} params.averageOrderValue - Average order value in dollars per year
 * @param {Object} params.feePercentage - Fee percentage charged on transactions per year
 * @returns {Object} The calculation results for each year
 */
export function calculateTransactionFees(params) {
  // Define the years to calculate
  const years = [2026, 2027, 2028, 2029];
  
  // Initialize results object
  const results = {
    totalRevenueByYear: {},
    transactionVolumeByYear: {},
    averageOrderValueByYear: {},
    effectiveFeePercentageByYear: {},
    revenuePerTransactionByYear: {},
    detailsByYear: {}
  };
  
  // Calculate for each year
  years.forEach(year => {
    // Extract year-specific parameters
    const transactionVolume = params.transactionVolume[year] || 0;
    const averageOrderValue = params.averageOrderValue[year] || 0;
    const feePercentage = params.feePercentage[year] || 0;
    
    // Calculate revenue
    const revenuePerTransaction = averageOrderValue * (feePercentage / 100);
    const totalRevenue = transactionVolume * revenuePerTransaction;
    
    // Store calculated values in results
    results.totalRevenueByYear[year] = totalRevenue;
    results.transactionVolumeByYear[year] = transactionVolume;
    results.averageOrderValueByYear[year] = averageOrderValue;
    results.effectiveFeePercentageByYear[year] = feePercentage;
    results.revenuePerTransactionByYear[year] = revenuePerTransaction;
    
    // Store detailed breakdown
    results.detailsByYear[year] = {
      transactionVolume: transactionVolume,
      averageOrderValue: averageOrderValue,
      feePercentage: feePercentage,
      revenuePerTransaction: revenuePerTransaction,
      totalRevenue: totalRevenue,
      totalTransactionValue: transactionVolume * averageOrderValue
    };
  });
  
  return results;
}

/**
 * Initial default parameters for the transaction fees calculator
 */
export const defaultTransactionFeesParams = {
  transactionVolume: {
    2026: 100000,
    2027: 250000,
    2028: 500000,
    2029: 1000000
  },
  averageOrderValue: {
    2026: 500,
    2027: 525,
    2028: 550,
    2029: 575
  },
  feePercentage: {
    2026: 2.5,
    2027: 2.5,
    2028: 2.5,
    2029: 2.5
  }
}; 