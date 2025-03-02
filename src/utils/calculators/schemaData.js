/**
 * Schema Data Calculator
 * 
 * Provides the initial schema data structure and calculation functions
 * for the OneWORLD Scenario Planner
 */

// Default schema data with min-max ranges for all years
export const defaultSchemaData = {
  costs: {
    employeeCosts: {
      name: "Employee Costs",
      categories: [
        {
          name: "Product Manager",
          notes: "Senior-level PM with marketplace experience",
          2026: { min: 720000, max: 900000 },
          2027: { min: 756000, max: 945000 },
          2028: { min: 794000, max: 992000 },
          2029: { min: 834000, max: 1042000 }
        },
        {
          name: "Frontend Developers",
          notes: "2-3 developers Y1, 3-4 in Y2/Y3",
          2026: { min: 1200000, max: 1800000 },
          2027: { min: 1680000, max: 2520000 },
          2028: { min: 1920000, max: 2880000 },
          2029: { min: 2100000, max: 3150000 }
        },
        {
          name: "Backend Developers",
          notes: "2-3 developers Y1, 3-4 in Y2/Y3",
          2026: { min: 1320000, max: 1980000 },
          2027: { min: 1848000, max: 2772000 },
          2028: { min: 2112000, max: 3168000 },
          2029: { min: 2310000, max: 3465000 }
        },
        {
          name: "UX/UI Designer",
          notes: "1-2 designers",
          2026: { min: 600000, max: 900000 },
          2027: { min: 630000, max: 945000 },
          2028: { min: 662000, max: 992000 },
          2029: { min: 695000, max: 1042000 }
        },
        {
          name: "QA Engineer",
          notes: "1 engineer Y1, 2 in Y2/Y3",
          2026: { min: 480000, max: 720000 },
          2027: { min: 744000, max: 1116000 },
          2028: { min: 864000, max: 1296000 },
          2029: { min: 945000, max: 1418000 }
        },
        {
          name: "DevOps Engineer",
          notes: "1 senior DevOps",
          2026: { min: 720000, max: 960000 },
          2027: { min: 756000, max: 1008000 },
          2028: { min: 794000, max: 1058000 },
          2029: { min: 834000, max: 1111000 }
        },
        {
          name: "Business Analyst",
          notes: "1 analyst",
          2026: { min: 600000, max: 840000 },
          2027: { min: 630000, max: 882000 },
          2028: { min: 662000, max: 926000 },
          2029: { min: 695000, max: 972000 }
        }
      ]
    },
    techDevelopment: {
      name: "Tech Development",
      categories: [
        {
          name: "Cloud Infrastructure",
          notes: "AWS/Azure/GCP services",
          2026: { min: 240000, max: 480000 },
          2027: { min: 360000, max: 720000 },
          2028: { min: 480000, max: 960000 },
          2029: { min: 600000, max: 1200000 }
        },
        {
          name: "Firebase Services",
          notes: "Auth, Firestore, Functions",
          2026: { min: 120000, max: 240000 },
          2027: { min: 180000, max: 360000 },
          2028: { min: 240000, max: 480000 },
          2029: { min: 300000, max: 600000 }
        },
        {
          name: "Vertex AI Implementation",
          notes: "ML model development and API usage",
          2026: { min: 180000, max: 360000 },
          2027: { min: 240000, max: 480000 },
          2028: { min: 300000, max: 600000 },
          2029: { min: 360000, max: 720000 }
        },
        {
          name: "Third-Party APIs/Services",
          notes: "Payment processing, mapping, etc.",
          2026: { min: 120000, max: 240000 },
          2027: { min: 180000, max: 360000 },
          2028: { min: 240000, max: 480000 },
          2029: { min: 300000, max: 600000 }
        },
        {
          name: "DevOps Tooling",
          notes: "CI/CD, monitoring, logging",
          2026: { min: 60000, max: 120000 },
          2027: { min: 72000, max: 144000 },
          2028: { min: 84000, max: 168000 },
          2029: { min: 96000, max: 192000 }
        },
        {
          name: "Security Implementation",
          notes: "Penetration testing, security audits",
          2026: { min: 120000, max: 240000 },
          2027: { min: 144000, max: 288000 },
          2028: { min: 168000, max: 336000 },
          2029: { min: 192000, max: 384000 }
        }
      ]
    },
    operationalCosts: {
      name: "Operational Costs",
      categories: [
        {
          name: "Office Space",
          notes: "Based on team size growth",
          2026: { min: 240000, max: 480000 },
          2027: { min: 252000, max: 504000 },
          2028: { min: 265000, max: 529000 },
          2029: { min: 278000, max: 555000 }
        },
        {
          name: "Equipment",
          notes: "Higher in Y1 for initial setup",
          2026: { min: 180000, max: 300000 },
          2027: { min: 120000, max: 240000 },
          2028: { min: 144000, max: 288000 },
          2029: { min: 168000, max: 336000 }
        },
        {
          name: "Software Licenses",
          notes: "Design tools, development tools, etc.",
          2026: { min: 120000, max: 240000 },
          2027: { min: 144000, max: 288000 },
          2028: { min: 168000, max: 336000 },
          2029: { min: 192000, max: 384000 }
        },
        {
          name: "Legal & Compliance",
          notes: "Higher in Y1 for initial setup",
          2026: { min: 180000, max: 360000 },
          2027: { min: 120000, max: 240000 },
          2028: { min: 144000, max: 288000 },
          2029: { min: 168000, max: 336000 }
        },
        {
          name: "Marketing & Sales",
          notes: "Increases as platform scales",
          2026: { min: 360000, max: 720000 },
          2027: { min: 540000, max: 1080000 },
          2028: { min: 720000, max: 1440000 },
          2029: { min: 900000, max: 1800000 }
        },
        {
          name: "Customer Support",
          notes: "Support team growth with user base",
          2026: { min: 240000, max: 480000 },
          2027: { min: 360000, max: 720000 },
          2028: { min: 480000, max: 960000 },
          2029: { min: 600000, max: 1200000 }
        },
        {
          name: "Travel & Entertainment",
          notes: "Client meetings, industry events",
          2026: { min: 120000, max: 240000 },
          2027: { min: 144000, max: 288000 },
          2028: { min: 168000, max: 336000 },
          2029: { min: 192000, max: 384000 }
        }
      ]
    }
  },
  revenue: {
    transactionFees: {
      name: "Transaction Fees",
      categories: [
        {
          name: "Traditional Market",
          notes: "0.5-1% of transaction volume",
          2026: { min: 0, max: 0 },
          2027: { min: 1800000, max: 3600000 },
          2028: { min: 3600000, max: 7200000 },
          2029: { min: 7200000, max: 14400000 }
        },
        {
          name: "B2B (Beyond)",
          notes: "0.3-0.6% of transaction volume",
          2026: { min: 0, max: 0 },
          2027: { min: 900000, max: 1800000 },
          2028: { min: 2700000, max: 5400000 },
          2029: { min: 5400000, max: 10800000 }
        },
        {
          name: "Financial Services",
          notes: "0.2-0.4% of transaction volume",
          2026: { min: 0, max: 0 },
          2027: { min: 600000, max: 1200000 },
          2028: { min: 1800000, max: 3600000 },
          2029: { min: 3600000, max: 7200000 }
        }
      ]
    },
    farmerSubscriptions: {
      name: "Farmer Subscriptions",
      categories: [
        {
          name: "Small Tier",
          notes: "R250-500/month, 120-240 farmers Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 360000, max: 720000 },
          2028: { min: 720000, max: 1440000 },
          2029: { min: 1440000, max: 2880000 }
        },
        {
          name: "Medium Tier",
          notes: "R1,000-2,000/month, 60-120 farmers Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 720000, max: 1440000 },
          2028: { min: 1440000, max: 2880000 },
          2029: { min: 2880000, max: 5760000 }
        },
        {
          name: "Large Tier",
          notes: "R3,000-6,000/month, 30-60 farmers Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 1080000, max: 2160000 },
          2028: { min: 2160000, max: 4320000 },
          2029: { min: 4320000, max: 8640000 }
        },
        {
          name: "Enterprise Tier",
          notes: "R12,000-24,000/month, 5-10 farms Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 720000, max: 1440000 },
          2028: { min: 1440000, max: 2880000 },
          2029: { min: 2880000, max: 5760000 }
        }
      ]
    },
    buyerSubscriptions: {
      name: "Buyer Subscriptions",
      categories: [
        {
          name: "Informal Tier",
          notes: "R100-200/month, 150-300 buyers Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 180000, max: 360000 },
          2028: { min: 360000, max: 720000 },
          2029: { min: 720000, max: 1440000 }
        },
        {
          name: "Formal Tier",
          notes: "R500-1,000/month, 90-180 buyers Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 540000, max: 1080000 },
          2028: { min: 1080000, max: 2160000 },
          2029: { min: 2160000, max: 4320000 }
        },
        {
          name: "Wholesale Tier",
          notes: "R2,500-5,000/month, 30-60 buyers Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 900000, max: 1800000 },
          2028: { min: 1800000, max: 3600000 },
          2029: { min: 3600000, max: 7200000 }
        },
        {
          name: "Retail Tier",
          notes: "R6,000-12,000/month, 10-20 retailers Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 720000, max: 1440000 },
          2028: { min: 1440000, max: 2880000 },
          2029: { min: 2880000, max: 5760000 }
        },
        {
          name: "QSR Tier",
          notes: "R9,000-18,000/month, 5-10 QSRs Y1, growing",
          2026: { min: 0, max: 0 },
          2027: { min: 540000, max: 1080000 },
          2028: { min: 1080000, max: 2160000 },
          2029: { min: 2160000, max: 4320000 }
        }
      ]
    },
    logistics: {
      name: "Logistics Revenue",
      categories: [
        {
          name: "LineBooker Commission",
          notes: "5-10% of logistics facilitated",
          2026: { min: 0, max: 0 },
          2027: { min: 360000, max: 720000 },
          2028: { min: 900000, max: 1800000 },
          2029: { min: 1800000, max: 3600000 }
        }
      ]
    },
    ancillary: {
      name: "Ancillary Income",
      categories: [
        {
          name: "Analytics Data",
          notes: "Data insights for third parties",
          2026: { min: 0, max: 0 },
          2027: { min: 240000, max: 480000 },
          2028: { min: 600000, max: 1200000 },
          2029: { min: 1200000, max: 2400000 }
        },
        {
          name: "Insurance Referrals",
          notes: "Commission on referred insurance",
          2026: { min: 0, max: 0 },
          2027: { min: 180000, max: 360000 },
          2028: { min: 450000, max: 900000 },
          2029: { min: 900000, max: 1800000 }
        },
        {
          name: "Financial Services",
          notes: "Loans, credit facilitation",
          2026: { min: 0, max: 0 },
          2027: { min: 360000, max: 720000 },
          2028: { min: 900000, max: 1800000 },
          2029: { min: 1800000, max: 3600000 }
        }
      ]
    }
  },
  metrics: {
    keyMetrics: {
      name: "Key Metrics and Ratios",
      categories: [
        {
          name: "Burn Rate",
          notes: "Monthly Cash Outflow",
          2026: { min: 660000, max: 1050000 },
          2027: { min: 825000, max: 1325000 },
          2028: { min: 950000, max: 1525000 },
          2029: { min: 1146000, max: 1824000 }
        },
        {
          name: "Revenue Growth",
          notes: "YoY Revenue Increase",
          2026: { min: 0, max: 0 },
          2027: { min: 0, max: 0 },
          2028: { min: 1.2, max: 1.4 },
          2029: { min: 1.0, max: 1.2 }
        },
        {
          name: "Gross Margin",
          notes: "(Revenue - COGS) / Revenue",
          2026: { min: 0, max: 0 },
          2027: { min: 0.7, max: 0.8 },
          2028: { min: 0.75, max: 0.85 },
          2029: { min: 0.8, max: 0.9 }
        },
        {
          name: "Customer Acquisition Cost",
          notes: "Marketing / New Customers",
          2026: { min: 0, max: 0 },
          2027: { min: 2000, max: 5000 },
          2028: { min: 1800, max: 4500 },
          2029: { min: 1500, max: 4000 }
        },
        {
          name: "Lifetime Value",
          notes: "Avg Revenue per Customer × Duration",
          2026: { min: 0, max: 0 },
          2027: { min: 50000, max: 150000 },
          2028: { min: 60000, max: 180000 },
          2029: { min: 72000, max: 216000 }
        }
      ]
    },
    parameters: {
      name: "Additional Parameters",
      categories: [
        {
          name: "User Adoption Rate",
          notes: "Speed of new user acquisition",
          value: { min: 0.05, max: 0.15 },
          impact: "Affects revenue ramp-up speed"
        },
        {
          name: "Churn Rate",
          notes: "% of users leaving monthly",
          value: { min: 0.01, max: 0.05 },
          impact: "Affects long-term revenue stability"
        },
        {
          name: "Transaction Fee Rate",
          notes: "% charged per transaction",
          value: { min: 0.002, max: 0.01 },
          impact: "Directly impacts transaction revenue"
        },
        {
          name: "Market Penetration",
          notes: "% of total addressable market",
          value: { min: 0.05, max: 0.3 },
          impact: "Ceiling for revenue projections"
        },
        {
          name: "Cost Inflation",
          notes: "Annual increase in costs",
          value: { min: 0.05, max: 0.1 },
          impact: "Affects long-term profitability"
        }
      ]
    }
  }
};

/**
 * Calculate totals for each cost and revenue category across all years
 * 
 * @param {Object} schemaData The schema data to calculate totals for
 * @param {boolean} useMaximum Whether to use maximum values
 * @returns {Object} Calculated totals
 */
export function calculateSchemaTotals(schemaData, useMaximum = false) {
  const valueKey = useMaximum ? 'max' : 'min';
  const years = [2026, 2027, 2028, 2029];
  const results = {
    costTotals: {
      byCategory: {},
      byYear: {},
      overall: 0
    },
    revenueTotals: {
      byCategory: {},
      byYear: {},
      overall: 0
    },
    netProfitByYear: {},
    totalNetProfit: 0
  };

  // Initialize year totals
  years.forEach(year => {
    results.costTotals.byYear[year] = 0;
    results.revenueTotals.byYear[year] = 0;
  });

  // Calculate cost totals
  Object.keys(schemaData.costs).forEach(costType => {
    const costCategory = schemaData.costs[costType];
    results.costTotals.byCategory[costType] = {
      name: costCategory.name,
      byYear: {},
      total: 0
    };

    years.forEach(year => {
      results.costTotals.byCategory[costType].byYear[year] = 0;
    });

    costCategory.categories.forEach(item => {
      years.forEach(year => {
        if (item[year] && typeof item[year][valueKey] === 'number') {
          results.costTotals.byCategory[costType].byYear[year] += item[year][valueKey];
          results.costTotals.byYear[year] += item[year][valueKey];
          results.costTotals.byCategory[costType].total += item[year][valueKey];
          results.costTotals.overall += item[year][valueKey];
        }
      });
    });
  });

  // Calculate revenue totals
  Object.keys(schemaData.revenue).forEach(revenueType => {
    const revenueCategory = schemaData.revenue[revenueType];
    results.revenueTotals.byCategory[revenueType] = {
      name: revenueCategory.name,
      byYear: {},
      total: 0
    };

    years.forEach(year => {
      results.revenueTotals.byCategory[revenueType].byYear[year] = 0;
    });

    revenueCategory.categories.forEach(item => {
      years.forEach(year => {
        if (item[year] && typeof item[year][valueKey] === 'number') {
          results.revenueTotals.byCategory[revenueType].byYear[year] += item[year][valueKey];
          results.revenueTotals.byYear[year] += item[year][valueKey];
          results.revenueTotals.byCategory[revenueType].total += item[year][valueKey];
          results.revenueTotals.overall += item[year][valueKey];
        }
      });
    });
  });

  // Calculate net profit by year and total
  years.forEach(year => {
    results.netProfitByYear[year] = results.revenueTotals.byYear[year] - results.costTotals.byYear[year];
    results.totalNetProfit += results.netProfitByYear[year];
  });

  return results;
}

/**
 * Format currency values for display
 * 
 * @param {number} value The value to format
 * @param {boolean} includeZAR Whether to include ZAR currency symbol
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, includeZAR = true) {
  if (value === undefined || value === null) return 'R0';
  
  // For percentage values (0-1 range)
  if (value >= 0 && value <= 1) {
    return `${(value * 100).toFixed(1)}%`;
  }
  
  // Handle negative values
  const prefix = value < 0 ? '-' : '';
  const absValue = Math.abs(value);
  
  // Format based on size
  let formatted;
  if (absValue >= 1000000000) {
    formatted = `${(absValue / 1000000000).toFixed(2)}B`;
  } else if (absValue >= 1000000) {
    formatted = `${(absValue / 1000000).toFixed(2)}M`;
  } else if (absValue >= 1000) {
    formatted = `${(absValue / 1000).toFixed(1)}K`;
  } else {
    formatted = absValue.toLocaleString();
  }
  
  return includeZAR ? `${prefix}R${formatted}` : `${prefix}${formatted}`;
} 