import React, { useState, useMemo, useEffect } from 'react';
import { useModuleData } from '../../contexts/ModuleContext';
import { useSchemaData } from '../../contexts/SchemaContext';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';
import useDeepEffect from '../../hooks/useDeepEffect';
import useDeepMemo from '../../hooks/useDeepMemo';
import { areObjectsEqual } from '../../utils/deepEqual';

// Import subcomponents
import EmployeeCountControls from './subcomponents/EmployeeCountControls';
import SalaryControls from './subcomponents/SalaryControls';
import BenefitsControl from './subcomponents/BenefitsControl';
import CostsSummaryMetrics from './subcomponents/CostsSummaryMetrics';
import CostsBreakdownChart from './subcomponents/CostsBreakdownChart';
import EmployeeCostDetailsTable from './subcomponents/EmployeeCostDetailsTable';
import ModuleControls from './subcomponents/ModuleControls';

// Default parameters for employee costs
const defaultEmployeeCostsParams = {
  executives: 1,
  managers: 2,
  developers: 5,
  supportStaff: 2,
  executiveSalary: 200000,
  managerSalary: 120000,
  developerSalary: 100000,
  supportStaffSalary: 55000,
  benefitsPercent: 20
};

/**
 * Employee Costs Module Component
 * Allows users to model employee costs based on various parameters
 */
const EmployeeCostsModule = () => {
  // State for the module
  const [params, setParams] = useState(defaultEmployeeCostsParams);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isLocked, setIsLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [useSchemaAsBase, setUseSchemaAsBase] = useState(true);

  // Get module data from context
  const { setModuleData, registerModuleCalculation, yearRange } = useModuleData();
  
  // Get schema data
  const { schemaData } = useSchemaData();

  // Extract relevant schema items for employee costs
  const schemaEmployeeCosts = useMemo(() => {
    const relevantItems = {
      executives: schemaData.items['cost.employee.executives'],
      developers: {
        frontend: schemaData.items['cost.employee.frontend_devs'],
        backend: schemaData.items['cost.employee.backend_devs']
      },
      designer: schemaData.items['cost.employee.ux_designer'],
      qa: schemaData.items['cost.employee.qa_engineer'],
      devops: schemaData.items['cost.employee.devops'],
      analyst: schemaData.items['cost.employee.business_analyst']
    };
    return relevantItems;
  }, [schemaData]);

  // Handler for parameter changes with optimization for object creation
  const handleParamChange = useMemo(() => (paramName, value) => {
    if (isLocked) return;
    
    setParams(prevParams => {
      const newParams = {
        ...prevParams,
        [paramName]: value
      };
      
      // Only update if the value actually changed
      if (prevParams[paramName] === value) {
        return prevParams; // Return previous reference to avoid re-renders
      }
      
      return newParams;
    });
  }, [isLocked]);

  // Debounce the parameter changes to improve performance
  const debouncedSetModuleData = useDebouncedCallback((data) => {
    setModuleData('employeeCosts', data);
  }, 300);

  // Helper to get employee count from schema based on salary ranges
  const getEmployeeCountFromSalary = (salaryItem, avgSalary) => {
    if (!salaryItem || !salaryItem.yearData) return 0;
    
    // Estimate employees by dividing total salary budget by average salary
    const year = selectedYear.toString();
    const minBudget = salaryItem.yearData[year]?.min || 0;
    const maxBudget = salaryItem.yearData[year]?.max || 0;
    
    // Use average of min and max for estimation
    const avgBudget = (minBudget + maxBudget) / 2;
    return avgBudget > 0 ? Math.round(avgBudget / avgSalary) : 0;
  };

  // Calculate results based on parameters
  // Use Deep Memo for complex object comparison rather than shallow comparison
  const getResults = useDeepMemo(() => {
    // If calculations are paused, return null
    if (isPaused) return null;

    // Initialize data structures
    const employeeCountsByYear = {};
    const averageSalaryByYear = {};
    const totalCostsByYear = {};
    const costBreakdownByYear = {};
    const detailedCostsByYear = {};

    // Calculate values for each year in the range
    yearRange.forEach(year => {
      const yearStr = year.toString();
      
      // Yearly growth factors (more employees and higher salaries in future years)
      const yearsSince2026 = year - 2026;
      const growthFactor = 1 + (yearsSince2026 * 0.05); // 5% growth per year
      
      // If using schema as base, derive initial values from schema data
      let executives, managers, developers, supportStaff;
      let executiveSalary, managerSalary, developerSalary, supportStaffSalary;
      
      if (useSchemaAsBase && schemaEmployeeCosts.executives?.yearData?.[yearStr]) {
        // Executives
        executiveSalary = params.executiveSalary * growthFactor;
        const execMinMax = schemaEmployeeCosts.executives.yearData[yearStr];
        const execAvg = (execMinMax.min + execMinMax.max) / 2;
        executives = Math.max(1, Math.round(execAvg / executiveSalary));
        
        // Developers - combine frontend and backend
        developerSalary = params.developerSalary * growthFactor;
        let devBudget = 0;
        if (schemaEmployeeCosts.developers.frontend?.yearData?.[yearStr]) {
          const frontendMinMax = schemaEmployeeCosts.developers.frontend.yearData[yearStr];
          devBudget += (frontendMinMax.min + frontendMinMax.max) / 2;
        }
        if (schemaEmployeeCosts.developers.backend?.yearData?.[yearStr]) {
          const backendMinMax = schemaEmployeeCosts.developers.backend.yearData[yearStr];
          devBudget += (backendMinMax.min + backendMinMax.max) / 2;
        }
        developers = Math.max(1, Math.round(devBudget / developerSalary));
        
        // Managers - combine analyst and devops as managers
        managerSalary = params.managerSalary * growthFactor;
        let managerBudget = 0;
        if (schemaEmployeeCosts.analyst?.yearData?.[yearStr]) {
          const analystMinMax = schemaEmployeeCosts.analyst.yearData[yearStr];
          managerBudget += (analystMinMax.min + analystMinMax.max) / 2;
        }
        if (schemaEmployeeCosts.devops?.yearData?.[yearStr]) {
          const devopsMinMax = schemaEmployeeCosts.devops.yearData[yearStr];
          managerBudget += (devopsMinMax.min + devopsMinMax.max) / 2;
        }
        managers = Math.max(1, Math.round(managerBudget / managerSalary));
        
        // Support staff - combine designer and QA
        supportStaffSalary = params.supportStaffSalary * growthFactor;
        let supportBudget = 0;
        if (schemaEmployeeCosts.designer?.yearData?.[yearStr]) {
          const designerMinMax = schemaEmployeeCosts.designer.yearData[yearStr];
          supportBudget += (designerMinMax.min + designerMinMax.max) / 2;
        }
        if (schemaEmployeeCosts.qa?.yearData?.[yearStr]) {
          const qaMinMax = schemaEmployeeCosts.qa.yearData[yearStr];
          supportBudget += (qaMinMax.min + qaMinMax.max) / 2;
        }
        supportStaff = Math.max(1, Math.round(supportBudget / supportStaffSalary));
      } else {
        // Use default calculation from params
        executives = Math.round(params.executives * growthFactor);
        managers = Math.round(params.managers * growthFactor);
        developers = Math.round(params.developers * growthFactor);
        supportStaff = Math.round(params.supportStaff * growthFactor);
        
        // Calculate salaries with yearly increases
        executiveSalary = params.executiveSalary * growthFactor;
        managerSalary = params.managerSalary * growthFactor;
        developerSalary = params.developerSalary * growthFactor;
        supportStaffSalary = params.supportStaffSalary * growthFactor;
      }
      
      const totalEmployees = executives + managers + developers + supportStaff;
      
      // Calculate total and average salaries
      const totalSalary = (executives * executiveSalary) + 
                          (managers * managerSalary) + 
                          (developers * developerSalary) + 
                          (supportStaff * supportStaffSalary);
      const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
      
      // Calculate benefits cost
      const benefitsFactor = params.benefitsPercent / 100;
      const totalBenefitsCost = totalSalary * benefitsFactor;
      
      // Calculate total cost
      const totalCost = totalSalary + totalBenefitsCost;
      
      // Store the results for this year
      employeeCountsByYear[year] = totalEmployees;
      averageSalaryByYear[year] = averageSalary;
      totalCostsByYear[year] = totalCost;
      
      // Cost breakdown by employee type
      costBreakdownByYear[year] = {
        executives: executives * executiveSalary * (1 + benefitsFactor),
        managers: managers * managerSalary * (1 + benefitsFactor),
        developers: developers * developerSalary * (1 + benefitsFactor),
        supportStaff: supportStaff * supportStaffSalary * (1 + benefitsFactor)
      };
      
      // Detailed costs by employee type
      detailedCostsByYear[year] = {
        executives: {
          count: executives,
          baseSalary: executiveSalary,
          benefitsCost: executiveSalary * benefitsFactor,
          totalPerEmployee: executiveSalary * (1 + benefitsFactor),
          totalCost: executives * executiveSalary * (1 + benefitsFactor)
        },
        managers: {
          count: managers,
          baseSalary: managerSalary,
          benefitsCost: managerSalary * benefitsFactor,
          totalPerEmployee: managerSalary * (1 + benefitsFactor),
          totalCost: managers * managerSalary * (1 + benefitsFactor)
        },
        developers: {
          count: developers,
          baseSalary: developerSalary,
          benefitsCost: developerSalary * benefitsFactor,
          totalPerEmployee: developerSalary * (1 + benefitsFactor),
          totalCost: developers * developerSalary * (1 + benefitsFactor)
        },
        supportStaff: {
          count: supportStaff,
          baseSalary: supportStaffSalary,
          benefitsCost: supportStaffSalary * benefitsFactor,
          totalPerEmployee: supportStaffSalary * (1 + benefitsFactor),
          totalCost: supportStaff * supportStaffSalary * (1 + benefitsFactor)
        }
      };
    });
    
    return {
      employeeCountsByYear,
      averageSalaryByYear,
      totalCostsByYear,
      costBreakdownByYear,
      detailedCostsByYear,
      usingSchemaBase: useSchemaAsBase
    };
  }, [params, isPaused, yearRange, useSchemaAsBase, schemaEmployeeCosts, selectedYear]);

  // Use deep effect to prevent unnecessary updates when the object references change
  // but the actual data hasn't changed significantly
  useDeepEffect(() => {
    if (getResults) {
      const moduleData = {
        params,
        results: getResults,
        totalCostsByYear: getResults?.totalCostsByYear || {},
        usingSchemaBase: useSchemaAsBase
      };
      
      debouncedSetModuleData(moduleData);
    }
  }, [getResults, params, debouncedSetModuleData, useSchemaAsBase]);

  // Register module calculation with deep comparison
  useEffect(() => {
    const calculateData = () => ({
      params,
      results: getResults,
      totalCostsByYear: getResults?.totalCostsByYear || {},
      usingSchemaBase: useSchemaAsBase
    });
    
    registerModuleCalculation('employeeCosts', calculateData);
  }, [registerModuleCalculation, params, getResults, useSchemaAsBase]);

  // Handlers for lock and pause buttons
  const handleTogglePause = () => setIsPaused(prev => !prev);
  const handleToggleLock = () => setIsLocked(prev => !prev);
  const handleToggleSchemaBase = () => setUseSchemaAsBase(prev => !prev);

  // Memoize the year options to prevent re-creation on every render
  const yearOptions = useMemo(() => {
    return yearRange.map(year => (
      <option key={year} value={year}>{year}</option>
    ));
  }, [yearRange]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Employee Costs</h2>
      
      {/* Module Controls */}
      <ModuleControls 
        isLocked={isLocked} 
        isPaused={isPaused}
        onToggleLock={handleToggleLock}
        onTogglePause={handleTogglePause}
      />
      
      {/* Schema Controls */}
      <div className="mb-4 flex items-center">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={useSchemaAsBase}
            onChange={handleToggleSchemaBase}
            disabled={isLocked}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900">Use Schema as Base</span>
        </label>
        <span className="ml-2 text-xs text-gray-500">{useSchemaAsBase ? 'Using schema data for baseline calculations' : 'Using module parameters only'}</span>
      </div>
      
      {/* Year Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {yearOptions}
        </select>
      </div>

      {/* Employee Count Controls */}
      <EmployeeCountControls 
        params={params} 
        selectedYear={selectedYear} 
        onParamChange={handleParamChange} 
        isLocked={isLocked || useSchemaAsBase}
        isUsingSchema={useSchemaAsBase}
      />

      {/* Salary Controls */}
      <SalaryControls 
        params={params} 
        selectedYear={selectedYear} 
        onParamChange={handleParamChange} 
        isLocked={isLocked} 
      />

      {/* Benefits Control */}
      <BenefitsControl 
        params={params} 
        selectedYear={selectedYear} 
        onParamChange={handleParamChange} 
        isLocked={isLocked} 
      />

      {/* Summary Metrics */}
      <CostsSummaryMetrics 
        calculationResults={getResults} 
        selectedYear={selectedYear} 
      />

      {/* Cost Breakdown Chart */}
      <CostsBreakdownChart 
        calculationResults={getResults} 
        selectedYear={selectedYear} 
      />

      {/* Employee Cost Details Table */}
      <EmployeeCostDetailsTable 
        calculationResults={getResults} 
        selectedYear={selectedYear} 
        params={params}
      />
    </div>
  );
};

export default EmployeeCostsModule;
