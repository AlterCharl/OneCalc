/**
 * OneWORLD Buyers Portal Schema Data
 * 
 * Comprehensive schema data for the OneWORLD Buyers Portal project,
 * including costs, revenue streams, and key metrics.
 */

export const buyersPortalSchema = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  
  // Define the categories and subcategories
  categories: {
    cost: ['employee', 'tech_development', 'operational'],
    revenue: ['transaction_fees', 'farmer_subscriptions', 'buyer_subscriptions', 'logistics', 'ancillary']
  },
  
  // Labels for subcategories
  subcategoryLabels: {
    'employee': 'Employee Costs',
    'tech_development': 'Tech Development',
    'operational': 'Operational Costs',
    'transaction_fees': 'Transaction Fees',
    'farmer_subscriptions': 'Farmer Subscriptions',
    'buyer_subscriptions': 'Buyer Subscriptions',
    'logistics': 'Logistics Revenue',
    'ancillary': 'Ancillary Income'
  },
  
  // Schema items
  items: {
    // Employee Costs
    'cost.employee.product_manager': {
      id: 'cost.employee.product_manager',
      name: 'Product Manager',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 720000, max: 900000 },
        '2027': { min: 756000, max: 945000 },
        '2028': { min: 794000, max: 992000 },
        '2029': { min: 834000, max: 1042000 }
      },
      metadata: {
        description: 'Senior-level PM with marketplace experience',
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
        '2026': { min: 1200000, max: 1800000 },
        '2027': { min: 1680000, max: 2520000 },
        '2028': { min: 1920000, max: 2880000 },
        '2029': { min: 2100000, max: 3150000 }
      },
      metadata: {
        description: '2-3 developers Y1, 3-4 in Y2/Y3',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.employee.backend_devs': {
      id: 'cost.employee.backend_devs',
      name: 'Backend Developers',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 1320000, max: 1980000 },
        '2027': { min: 1848000, max: 2772000 },
        '2028': { min: 2112000, max: 3168000 },
        '2029': { min: 2310000, max: 3465000 }
      },
      metadata: {
        description: '2-3 developers Y1, 3-4 in Y2/Y3',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.employee.ui_designer': {
      id: 'cost.employee.ui_designer',
      name: 'UX/UI Designer',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 600000, max: 900000 },
        '2027': { min: 630000, max: 945000 },
        '2028': { min: 662000, max: 992000 },
        '2029': { min: 695000, max: 1042000 }
      },
      metadata: {
        description: '1-2 designers',
        unit: 'currency',
        costType: 'semi-variable'
      }
    },
    'cost.employee.qa_engineer': {
      id: 'cost.employee.qa_engineer',
      name: 'QA Engineer',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 480000, max: 720000 },
        '2027': { min: 744000, max: 1116000 },
        '2028': { min: 864000, max: 1296000 },
        '2029': { min: 945000, max: 1418000 }
      },
      metadata: {
        description: '1 engineer Y1, 2 in Y2/Y3',
        unit: 'currency',
        costType: 'semi-variable'
      }
    },
    'cost.employee.devops_engineer': {
      id: 'cost.employee.devops_engineer',
      name: 'DevOps Engineer',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 720000, max: 960000 },
        '2027': { min: 756000, max: 1008000 },
        '2028': { min: 794000, max: 1058000 },
        '2029': { min: 834000, max: 1111000 }
      },
      metadata: {
        description: '1 senior DevOps',
        unit: 'currency',
        costType: 'fixed'
      }
    },
    'cost.employee.business_analyst': {
      id: 'cost.employee.business_analyst',
      name: 'Business Analyst',
      category: 'cost',
      subcategory: 'employee',
      yearData: {
        '2026': { min: 600000, max: 840000 },
        '2027': { min: 630000, max: 882000 },
        '2028': { min: 662000, max: 926000 },
        '2029': { min: 695000, max: 972000 }
      },
      metadata: {
        description: '1 analyst',
        unit: 'currency',
        costType: 'fixed'
      }
    },
    
    // Tech Development Costs
    'cost.tech_development.cloud_infrastructure': {
      id: 'cost.tech_development.cloud_infrastructure',
      name: 'Cloud Infrastructure',
      category: 'cost',
      subcategory: 'tech_development',
      yearData: {
        '2026': { min: 240000, max: 480000 },
        '2027': { min: 360000, max: 720000 },
        '2028': { min: 480000, max: 960000 },
        '2029': { min: 600000, max: 1200000 }
      },
      metadata: {
        description: 'AWS/Azure/GCP services',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.tech_development.firebase_services': {
      id: 'cost.tech_development.firebase_services',
      name: 'Firebase Services',
      category: 'cost',
      subcategory: 'tech_development',
      yearData: {
        '2026': { min: 120000, max: 240000 },
        '2027': { min: 180000, max: 360000 },
        '2028': { min: 240000, max: 480000 },
        '2029': { min: 300000, max: 600000 }
      },
      metadata: {
        description: 'Auth, Firestore, Functions',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.tech_development.vertex_ai': {
      id: 'cost.tech_development.vertex_ai',
      name: 'Vertex AI Implementation',
      category: 'cost',
      subcategory: 'tech_development',
      yearData: {
        '2026': { min: 180000, max: 360000 },
        '2027': { min: 240000, max: 480000 },
        '2028': { min: 300000, max: 600000 },
        '2029': { min: 360000, max: 720000 }
      },
      metadata: {
        description: 'ML model development and API usage',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.tech_development.third_party_apis': {
      id: 'cost.tech_development.third_party_apis',
      name: 'Third-Party APIs/Services',
      category: 'cost',
      subcategory: 'tech_development',
      yearData: {
        '2026': { min: 120000, max: 240000 },
        '2027': { min: 180000, max: 360000 },
        '2028': { min: 240000, max: 480000 },
        '2029': { min: 300000, max: 600000 }
      },
      metadata: {
        description: 'Payment processing, mapping, etc.',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.tech_development.devops_tooling': {
      id: 'cost.tech_development.devops_tooling',
      name: 'DevOps Tooling',
      category: 'cost',
      subcategory: 'tech_development',
      yearData: {
        '2026': { min: 60000, max: 120000 },
        '2027': { min: 72000, max: 144000 },
        '2028': { min: 84000, max: 168000 },
        '2029': { min: 96000, max: 192000 }
      },
      metadata: {
        description: 'CI/CD, monitoring, logging',
        unit: 'currency',
        costType: 'semi-fixed'
      }
    },
    'cost.tech_development.security_implementation': {
      id: 'cost.tech_development.security_implementation',
      name: 'Security Implementation',
      category: 'cost',
      subcategory: 'tech_development',
      yearData: {
        '2026': { min: 120000, max: 240000 },
        '2027': { min: 144000, max: 288000 },
        '2028': { min: 168000, max: 336000 },
        '2029': { min: 192000, max: 384000 }
      },
      metadata: {
        description: 'Penetration testing, security audits',
        unit: 'currency',
        costType: 'fixed'
      }
    },
    
    // Operational Costs
    'cost.operational.office_space': {
      id: 'cost.operational.office_space',
      name: 'Office Space',
      category: 'cost',
      subcategory: 'operational',
      yearData: {
        '2026': { min: 240000, max: 480000 },
        '2027': { min: 252000, max: 504000 },
        '2028': { min: 265000, max: 529000 },
        '2029': { min: 278000, max: 555000 }
      },
      metadata: {
        description: 'Based on team size growth',
        unit: 'currency',
        costType: 'semi-fixed'
      }
    },
    'cost.operational.equipment': {
      id: 'cost.operational.equipment',
      name: 'Equipment',
      category: 'cost',
      subcategory: 'operational',
      yearData: {
        '2026': { min: 180000, max: 300000 },
        '2027': { min: 120000, max: 240000 },
        '2028': { min: 144000, max: 288000 },
        '2029': { min: 168000, max: 336000 }
      },
      metadata: {
        description: 'Higher in Y1 for initial setup',
        unit: 'currency',
        costType: 'semi-variable'
      }
    },
    'cost.operational.software_licenses': {
      id: 'cost.operational.software_licenses',
      name: 'Software Licenses',
      category: 'cost',
      subcategory: 'operational',
      yearData: {
        '2026': { min: 120000, max: 240000 },
        '2027': { min: 144000, max: 288000 },
        '2028': { min: 168000, max: 336000 },
        '2029': { min: 192000, max: 384000 }
      },
      metadata: {
        description: 'Design tools, development tools, etc.',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.operational.legal_compliance': {
      id: 'cost.operational.legal_compliance',
      name: 'Legal & Compliance',
      category: 'cost',
      subcategory: 'operational',
      yearData: {
        '2026': { min: 180000, max: 360000 },
        '2027': { min: 120000, max: 240000 },
        '2028': { min: 144000, max: 288000 },
        '2029': { min: 168000, max: 336000 }
      },
      metadata: {
        description: 'Higher in Y1 for initial setup',
        unit: 'currency',
        costType: 'fixed'
      }
    },
    'cost.operational.marketing_sales': {
      id: 'cost.operational.marketing_sales',
      name: 'Marketing & Sales',
      category: 'cost',
      subcategory: 'operational',
      yearData: {
        '2026': { min: 360000, max: 720000 },
        '2027': { min: 540000, max: 1080000 },
        '2028': { min: 720000, max: 1440000 },
        '2029': { min: 900000, max: 1800000 }
      },
      metadata: {
        description: 'Increases as platform scales',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.operational.customer_support': {
      id: 'cost.operational.customer_support',
      name: 'Customer Support',
      category: 'cost',
      subcategory: 'operational',
      yearData: {
        '2026': { min: 240000, max: 480000 },
        '2027': { min: 360000, max: 720000 },
        '2028': { min: 480000, max: 960000 },
        '2029': { min: 600000, max: 1200000 }
      },
      metadata: {
        description: 'Support team growth with user base',
        unit: 'currency',
        costType: 'variable'
      }
    },
    'cost.operational.travel_entertainment': {
      id: 'cost.operational.travel_entertainment',
      name: 'Travel & Entertainment',
      category: 'cost',
      subcategory: 'operational',
      yearData: {
        '2026': { min: 120000, max: 240000 },
        '2027': { min: 144000, max: 288000 },
        '2028': { min: 168000, max: 336000 },
        '2029': { min: 192000, max: 384000 }
      },
      metadata: {
        description: 'Client meetings, industry events',
        unit: 'currency',
        costType: 'variable'
      }
    },
    
    // Revenue - Transaction Fees
    'revenue.transaction_fees.traditional_market': {
      id: 'revenue.transaction_fees.traditional_market',
      name: 'Traditional Market',
      category: 'revenue',
      subcategory: 'transaction_fees',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 1800000, max: 3600000 },
        '2028': { min: 3600000, max: 7200000 },
        '2029': { min: 7200000, max: 14400000 }
      },
      metadata: {
        description: '0.5-1% of transaction volume',
        unit: 'currency',
        revenueType: 'variable'
      }
    },
    'revenue.transaction_fees.b2b_beyond': {
      id: 'revenue.transaction_fees.b2b_beyond',
      name: 'B2B (Beyond)',
      category: 'revenue',
      subcategory: 'transaction_fees',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 900000, max: 1800000 },
        '2028': { min: 2700000, max: 5400000 },
        '2029': { min: 5400000, max: 10800000 }
      },
      metadata: {
        description: '0.3-0.6% of transaction volume',
        unit: 'currency',
        revenueType: 'variable'
      }
    },
    'revenue.transaction_fees.financial_services': {
      id: 'revenue.transaction_fees.financial_services',
      name: 'Financial Services',
      category: 'revenue',
      subcategory: 'transaction_fees',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 600000, max: 1200000 },
        '2028': { min: 1800000, max: 3600000 },
        '2029': { min: 3600000, max: 7200000 }
      },
      metadata: {
        description: '0.2-0.4% of transaction volume',
        unit: 'currency',
        revenueType: 'variable'
      }
    },
    
    // Revenue - Farmer Subscriptions
    'revenue.farmer_subscriptions.small_tier': {
      id: 'revenue.farmer_subscriptions.small_tier',
      name: 'Small Tier',
      category: 'revenue',
      subcategory: 'farmer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 360000, max: 720000 },
        '2028': { min: 720000, max: 1440000 },
        '2029': { min: 1440000, max: 2880000 }
      },
      metadata: {
        description: 'R250-500/month, 120-240 farmers Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    'revenue.farmer_subscriptions.medium_tier': {
      id: 'revenue.farmer_subscriptions.medium_tier',
      name: 'Medium Tier',
      category: 'revenue',
      subcategory: 'farmer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 720000, max: 1440000 },
        '2028': { min: 1440000, max: 2880000 },
        '2029': { min: 2880000, max: 5760000 }
      },
      metadata: {
        description: 'R1,000-2,000/month, 60-120 farmers Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    'revenue.farmer_subscriptions.large_tier': {
      id: 'revenue.farmer_subscriptions.large_tier',
      name: 'Large Tier',
      category: 'revenue',
      subcategory: 'farmer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 1080000, max: 2160000 },
        '2028': { min: 2160000, max: 4320000 },
        '2029': { min: 4320000, max: 8640000 }
      },
      metadata: {
        description: 'R3,000-6,000/month, 30-60 farmers Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    'revenue.farmer_subscriptions.enterprise_tier': {
      id: 'revenue.farmer_subscriptions.enterprise_tier',
      name: 'Enterprise Tier',
      category: 'revenue',
      subcategory: 'farmer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 720000, max: 1440000 },
        '2028': { min: 1440000, max: 2880000 },
        '2029': { min: 2880000, max: 5760000 }
      },
      metadata: {
        description: 'R12,000-24,000/month, 5-10 farms Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    
    // Revenue - Buyer Subscriptions
    'revenue.buyer_subscriptions.informal_tier': {
      id: 'revenue.buyer_subscriptions.informal_tier',
      name: 'Informal Tier',
      category: 'revenue',
      subcategory: 'buyer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 180000, max: 360000 },
        '2028': { min: 360000, max: 720000 },
        '2029': { min: 720000, max: 1440000 }
      },
      metadata: {
        description: 'R100-200/month, 150-300 buyers Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    'revenue.buyer_subscriptions.formal_tier': {
      id: 'revenue.buyer_subscriptions.formal_tier',
      name: 'Formal Tier',
      category: 'revenue',
      subcategory: 'buyer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 540000, max: 1080000 },
        '2028': { min: 1080000, max: 2160000 },
        '2029': { min: 2160000, max: 4320000 }
      },
      metadata: {
        description: 'R500-1,000/month, 90-180 buyers Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    'revenue.buyer_subscriptions.wholesale_tier': {
      id: 'revenue.buyer_subscriptions.wholesale_tier',
      name: 'Wholesale Tier',
      category: 'revenue',
      subcategory: 'buyer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 900000, max: 1800000 },
        '2028': { min: 1800000, max: 3600000 },
        '2029': { min: 3600000, max: 7200000 }
      },
      metadata: {
        description: 'R2,500-5,000/month, 30-60 buyers Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    'revenue.buyer_subscriptions.retail_tier': {
      id: 'revenue.buyer_subscriptions.retail_tier',
      name: 'Retail Tier',
      category: 'revenue',
      subcategory: 'buyer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 720000, max: 1440000 },
        '2028': { min: 1440000, max: 2880000 },
        '2029': { min: 2880000, max: 5760000 }
      },
      metadata: {
        description: 'R6,000-12,000/month, 10-20 retailers Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    'revenue.buyer_subscriptions.qsr_tier': {
      id: 'revenue.buyer_subscriptions.qsr_tier',
      name: 'QSR Tier',
      category: 'revenue',
      subcategory: 'buyer_subscriptions',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 540000, max: 1080000 },
        '2028': { min: 1080000, max: 2160000 },
        '2029': { min: 2160000, max: 4320000 }
      },
      metadata: {
        description: 'R9,000-18,000/month, 5-10 QSRs Y1, growing',
        unit: 'currency',
        revenueType: 'subscription'
      }
    },
    
    // Logistics Revenue
    'revenue.logistics.linebooker_commission': {
      id: 'revenue.logistics.linebooker_commission',
      name: 'LineBooker Commission',
      category: 'revenue',
      subcategory: 'logistics',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 360000, max: 720000 },
        '2028': { min: 900000, max: 1800000 },
        '2029': { min: 1800000, max: 3600000 }
      },
      metadata: {
        description: '5-10% of logistics facilitated',
        unit: 'currency',
        revenueType: 'commission'
      }
    },
    
    // Ancillary Income
    'revenue.ancillary.analytics_data': {
      id: 'revenue.ancillary.analytics_data',
      name: 'Analytics Data',
      category: 'revenue',
      subcategory: 'ancillary',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 240000, max: 480000 },
        '2028': { min: 600000, max: 1200000 },
        '2029': { min: 1200000, max: 2400000 }
      },
      metadata: {
        description: 'Data insights for third parties',
        unit: 'currency',
        revenueType: 'data'
      }
    },
    'revenue.ancillary.insurance_referrals': {
      id: 'revenue.ancillary.insurance_referrals',
      name: 'Insurance Referrals',
      category: 'revenue',
      subcategory: 'ancillary',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 180000, max: 360000 },
        '2028': { min: 450000, max: 900000 },
        '2029': { min: 900000, max: 1800000 }
      },
      metadata: {
        description: 'Commission on referred insurance',
        unit: 'currency',
        revenueType: 'referral'
      }
    },
    'revenue.ancillary.financial_services': {
      id: 'revenue.ancillary.financial_services',
      name: 'Financial Services',
      category: 'revenue',
      subcategory: 'ancillary',
      yearData: {
        '2026': { min: 0, max: 0 },
        '2027': { min: 360000, max: 720000 },
        '2028': { min: 900000, max: 1800000 },
        '2029': { min: 1800000, max: 3600000 }
      },
      metadata: {
        description: 'Loans, credit facilitation',
        unit: 'currency',
        revenueType: 'financial'
      }
    }
  },
  
  // Key metrics and parameters
  metrics: {
    burnRate: {
      '2026': { min: 660000, max: 1050000 },
      '2027': { min: 825000, max: 1325000 },
      '2028': { min: 950000, max: 1525000 },
      '2029': { min: 1146000, max: 1824000 }
    },
    grossMargin: {
      '2026': { min: 0, max: 0 },
      '2027': { min: 0.7, max: 0.8 },
      '2028': { min: 0.75, max: 0.85 },
      '2029': { min: 0.8, max: 0.9 }
    },
    customerAcquisitionCost: {
      '2026': { min: 0, max: 0 },
      '2027': { min: 2000, max: 5000 },
      '2028': { min: 1800, max: 4500 },
      '2029': { min: 1500, max: 4000 }
    },
    lifetimeValue: {
      '2026': { min: 0, max: 0 },
      '2027': { min: 50000, max: 150000 },
      '2028': { min: 60000, max: 180000 },
      '2029': { min: 72000, max: 216000 }
    },
    platformUsers: {
      '2026': { min: 0, max: 0 },
      '2027': { min: 500, max: 1000 },
      '2028': { min: 1200, max: 2400 },
      '2029': { min: 2400, max: 4800 }
    },
    transactionVolume: {
      '2026': { min: 0, max: 0 },
      '2027': { min: 300000000, max: 600000000 },
      '2028': { min: 900000000, max: 1800000000 },
      '2029': { min: 1800000000, max: 3600000000 }
    }
  },
  
  // Scenario planning parameters
  scenarioParameters: {
    userAdoptionRate: { min: 0.05, max: 0.15, default: 0.1 },
    churnRate: { min: 0.01, max: 0.05, default: 0.02 },
    transactionFeeRate: { min: 0.002, max: 0.01, default: 0.005 },
    marketPenetration: { min: 0.05, max: 0.3, default: 0.15 },
    costInflation: { min: 0.05, max: 0.1, default: 0.075 },
    developmentTimeline: { min: 6, max: 12, default: 9 },
    marketingEffectiveness: { min: 0.7, max: 1.5, default: 1.0 },
    featureDevelopmentSpeed: { min: 0.8, max: 1.2, default: 1.0 },
    integrationComplexity: { min: 1.0, max: 2.0, default: 1.5 },
    competitivePressure: { options: ['Low', 'Medium', 'High'], default: 'Medium' }
  }
};

export default buyersPortalSchema; 