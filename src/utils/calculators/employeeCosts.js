/**
 * Employee Costs Calculator
 * 
 * This calculator computes the total cost of employees for the OneWORLD platform.
 * It considers different employee types, counts, and salary ranges for each year.
 * 
 * @param {Object} params - The parameters for the calculation
 * @param {Object} params.executiveCount - Number of executives per year
 * @param {Object} params.executiveSalary - Average executive salary per year
 * @param {Object} params.managersCount - Number of managers per year
 * @param {Object} params.managerSalary - Average manager salary per year
 * @param {Object} params.developersCount - Number of developers per year
 * @param {Object} params.developerSalary - Average developer salary per year
 * @param {Object} params.supportStaffCount - Number of support staff per year
 * @param {Object} params.supportStaffSalary - Average support staff salary per year
 * @param {Object} params.benefitsPercentage - Benefits percentage of base salary per year
 * @returns {Object} The calculation results for each year
 */
export function calculateEmployeeCosts(params) {
  // Define the years to calculate
  const years = [2026, 2027, 2028, 2029];
  
  // Initialize results object
  const results = {
    totalCostsByYear: {},
    employeeCountsByYear: {},
    averageSalaryByYear: {},
    breakdownByYear: {}
  };
  
  // Calculate for each year
  years.forEach(year => {
    // Extract year-specific parameters
    const executiveCount = params.executiveCount[year] || 0;
    const executiveSalary = params.executiveSalary[year] || 0;
    const managersCount = params.managersCount[year] || 0;
    const managerSalary = params.managerSalary[year] || 0;
    const developersCount = params.developersCount[year] || 0;
    const developerSalary = params.developerSalary[year] || 0;
    const supportStaffCount = params.supportStaffCount[year] || 0;
    const supportStaffSalary = params.supportStaffSalary[year] || 0;
    const benefitsPercentage = params.benefitsPercentage[year] || 0;
    
    // Calculate costs by employee type
    const executiveCost = executiveCount * executiveSalary * (1 + benefitsPercentage / 100);
    const managersCost = managersCount * managerSalary * (1 + benefitsPercentage / 100);
    const developersCost = developersCount * developerSalary * (1 + benefitsPercentage / 100);
    const supportStaffCost = supportStaffCount * supportStaffSalary * (1 + benefitsPercentage / 100);
    
    // Calculate total employees and costs
    const totalEmployees = executiveCount + managersCount + developersCount + supportStaffCount;
    const totalCosts = executiveCost + managersCost + developersCost + supportStaffCost;
    
    // Calculate average salary if there are employees
    const averageSalary = totalEmployees > 0 
      ? (executiveSalary * executiveCount + managerSalary * managersCount + 
         developerSalary * developersCount + supportStaffSalary * supportStaffCount) / totalEmployees 
      : 0;
    
    // Store calculated values in results
    results.totalCostsByYear[year] = totalCosts;
    results.employeeCountsByYear[year] = totalEmployees;
    results.averageSalaryByYear[year] = averageSalary;
    results.breakdownByYear[year] = {
      executives: {
        count: executiveCount,
        baseSalary: executiveSalary,
        totalCost: executiveCost
      },
      managers: {
        count: managersCount,
        baseSalary: managerSalary,
        totalCost: managersCost
      },
      developers: {
        count: developersCount,
        baseSalary: developerSalary,
        totalCost: developersCost
      },
      supportStaff: {
        count: supportStaffCount,
        baseSalary: supportStaffSalary,
        totalCost: supportStaffCost
      },
      benefits: {
        percentage: benefitsPercentage,
        totalCost: totalCosts - (executiveCount * executiveSalary + 
                               managersCount * managerSalary + 
                               developersCount * developerSalary + 
                               supportStaffCount * supportStaffSalary)
      }
    };
  });
  
  return results;
}

/**
 * Initial default parameters for the employee costs calculator
 */
export const defaultEmployeeCostsParams = {
  executiveCount: {
    2026: 3,
    2027: 4,
    2028: 5,
    2029: 5
  },
  executiveSalary: {
    2026: 200000,
    2027: 210000,
    2028: 220500,
    2029: 231525
  },
  managersCount: {
    2026: 5,
    2027: 8,
    2028: 12,
    2029: 15
  },
  managerSalary: {
    2026: 120000,
    2027: 126000,
    2028: 132300,
    2029: 138915
  },
  developersCount: {
    2026: 15,
    2027: 25,
    2028: 35,
    2029: 45
  },
  developerSalary: {
    2026: 100000,
    2027: 105000,
    2028: 110250,
    2029: 115763
  },
  supportStaffCount: {
    2026: 7,
    2027: 12,
    2028: 18,
    2029: 25
  },
  supportStaffSalary: {
    2026: 60000,
    2027: 63000,
    2028: 66150,
    2029: 69458
  },
  benefitsPercentage: {
    2026: 30,
    2027: 30,
    2028: 30,
    2029: 30
  }
}; 