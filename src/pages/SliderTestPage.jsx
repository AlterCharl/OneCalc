import React, { useState } from 'react';
import { Slider, OptimizedSlider } from '../components/common/SliderSwitcher';
import { CostRangeSlider } from '../components/common/SliderSwitcher';
import { OptimizedCostRangeSlider } from '../components/common/SliderSwitcher';
import { EnhancedCostSliders } from '../components/common/SliderSwitcher';
import { OptimizedCostSliders } from '../components/common/SliderSwitcher';
import { OptimizedRevenueSliders } from '../components/common/SliderSwitcher';

/**
 * SliderTestPage - A page to test and compare different slider implementations
 */
const SliderTestPage = () => {
  // State for basic sliders
  const [basicValue, setBasicValue] = useState(50);
  const [optimizedValue, setOptimizedValue] = useState(50);
  
  // State for range sliders
  const [rangeMin, setRangeMin] = useState(25);
  const [rangeMax, setRangeMax] = useState(75);
  const [optimizedRangeMin, setOptimizedRangeMin] = useState(25);
  const [optimizedRangeMax, setOptimizedRangeMax] = useState(75);
  
  // State for enhanced sliders
  const [selectedYear, setSelectedYear] = useState(2023);
  const yearRange = [2023, 2024, 2025, 2026, 2027];
  
  // Mock data for cost sliders
  const mockCostItem = {
    id: 'test-cost-1',
    yearData: {
      [selectedYear]: { min: 5000, max: 15000 }
    },
    metadata: {
      quantityLabel: 'Number of Employees',
      defaultQuantity: 5,
      quantity: { [selectedYear]: 5 },
      minQuantity: 1,
      maxQuantity: 50,
      quantityStep: 1,
      quantityUnit: 'employees',
      growthPercentage: { [selectedYear]: 10 },
      perUnitCost: { min: 1000, max: 3000 },
      description: 'Test cost item for slider comparison'
    }
  };
  
  // Mock data for revenue sliders
  const mockRevenueItem = {
    id: 'test-revenue-1',
    yearData: {
      [selectedYear]: { value: 20000 }
    },
    metadata: {
      valueLabel: 'Product Revenue',
      defaultValue: 20000,
      minValue: 0,
      maxValue: 100000,
      valueStep: 1000,
      quantityLabel: 'Units Sold',
      defaultQuantity: 100,
      quantity: { [selectedYear]: 100 },
      minQuantity: 10,
      maxQuantity: 1000,
      quantityStep: 10,
      quantityUnit: 'units',
      growthPercentage: { [selectedYear]: 15 },
      perUnitRevenue: 200,
      description: 'Test revenue item for slider comparison'
    }
  };
  
  // Currency formatter
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Handler for cost sliders
  const handleCostQuantityChange = (itemId, year, value) => {
    console.log(`Cost quantity changed for ${itemId} in year ${year}: ${value}`);
  };
  
  const handleCostValueChange = (itemId, year, isMin, value) => {
    console.log(`Cost ${isMin ? 'min' : 'max'} value changed for ${itemId} in year ${year}: ${value}`);
  };
  
  const handleCostGrowthChange = (itemId, year, value) => {
    console.log(`Cost growth changed for ${itemId} in year ${year}: ${value}%`);
  };
  
  // Handler for revenue sliders
  const handleRevenueValueChange = (itemId, year, value) => {
    console.log(`Revenue value changed for ${itemId} in year ${year}: ${value}`);
  };
  
  const handleRevenueQuantityChange = (itemId, year, value) => {
    console.log(`Revenue quantity changed for ${itemId} in year ${year}: ${value}`);
  };
  
  const handleRevenueGrowthChange = (itemId, year, value) => {
    console.log(`Revenue growth changed for ${itemId} in year ${year}: ${value}%`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Slider Components Test Page</h1>
        <p className="text-gray-600">Compare and test different slider implementations</p>
        
        <div className="mt-4 flex items-center space-x-4">
          <label htmlFor="yearSelector" className="text-sm font-medium text-gray-700">
            Test Year:
          </label>
          <select
            id="yearSelector"
            className="border border-gray-300 rounded-md p-2 bg-white text-gray-700"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          >
            {yearRange.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Sliders */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Sliders</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Original Slider</h3>
              <Slider
                label="Basic Value"
                min={0}
                max={100}
                step={1}
                value={basicValue}
                onChange={setBasicValue}
                formatter={(value) => `${value}%`}
              />
              <div className="mt-2 text-sm text-gray-500">
                Current value: {basicValue}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Optimized Slider</h3>
              <OptimizedSlider
                label="Basic Value"
                min={0}
                max={100}
                step={1}
                value={optimizedValue}
                onChange={setOptimizedValue}
                valueSuffix="%"
                showTicks={true}
                tickCount={5}
                tooltip="Drag to adjust the value between 0% and 100%"
              />
              <div className="mt-2 text-sm text-gray-500">
                Current value: {optimizedValue}
              </div>
            </div>
          </div>
        </section>
        
        {/* Range Sliders */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Range Sliders</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Original Cost Range Slider</h3>
              <CostRangeSlider
                label="Value Range"
                minValue={rangeMin}
                maxValue={rangeMax}
                onMinChange={setRangeMin}
                onMaxChange={setRangeMax}
                formatValue={(value) => `$${value}`}
                minStep={5}
                maxStep={5}
              />
              <div className="mt-2 text-sm text-gray-500">
                Current range: ${rangeMin} - ${rangeMax}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Optimized Cost Range Slider</h3>
              <OptimizedCostRangeSlider
                label="Value Range"
                minValue={optimizedRangeMin}
                maxValue={optimizedRangeMax}
                onMinChange={setOptimizedRangeMin}
                onMaxChange={setOptimizedRangeMax}
                formatValue={(value) => `$${value}`}
                minStep={5}
                maxStep={5}
                tooltip="Drag to adjust the minimum and maximum values"
              />
              <div className="mt-2 text-sm text-gray-500">
                Current range: ${optimizedRangeMin} - ${optimizedRangeMax}
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Cost Sliders */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Cost Sliders</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Original Enhanced Cost Sliders</h3>
              <EnhancedCostSliders
                itemId={mockCostItem.id}
                yearData={mockCostItem.yearData[selectedYear]}
                selectedYear={selectedYear}
                metadata={mockCostItem.metadata}
                onQuantityChange={handleCostQuantityChange}
                onValueChange={handleCostValueChange}
                onGrowthChange={handleCostGrowthChange}
                formatCurrency={formatCurrency}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Optimized Cost Sliders</h3>
              <OptimizedCostSliders
                itemId={mockCostItem.id}
                yearData={mockCostItem.yearData[selectedYear]}
                selectedYear={selectedYear}
                metadata={mockCostItem.metadata}
                onQuantityChange={handleCostQuantityChange}
                onValueChange={handleCostValueChange}
                onGrowthChange={handleCostGrowthChange}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>
        </section>
        
        {/* Revenue Sliders */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Sliders</h2>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Optimized Revenue Sliders</h3>
            <OptimizedRevenueSliders
              itemId={mockRevenueItem.id}
              yearData={mockRevenueItem.yearData[selectedYear]}
              selectedYear={selectedYear}
              metadata={mockRevenueItem.metadata}
              onValueChange={handleRevenueValueChange}
              onQuantityChange={handleRevenueQuantityChange}
              onGrowthChange={handleRevenueGrowthChange}
              formatCurrency={formatCurrency}
            />
          </div>
        </section>
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Technical Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-blue-900">
          <li>Optimized sliders use more memory-efficient memoization to prevent unnecessary re-renders</li>
          <li>Touch support is improved in optimized versions for better mobile experience</li>
          <li>The optimized sliders have better handling of direct number input</li>
          <li>Improved ARIA attributes for accessibility in the optimized versions</li>
          <li>Debounced updates to reduce state changes when dragging</li>
          <li>Fixed positioning issues with the slider thumbs during window resize</li>
        </ul>
      </div>
    </div>
  );
};

export default SliderTestPage; 