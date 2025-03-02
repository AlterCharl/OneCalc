import React, { memo, useMemo } from 'react';
import OptimizedCostRangeSlider from './OptimizedCostRangeSlider';
import OptimizedSlider from '../common/OptimizedSlider';

/**
 * OptimizedCostSliders - Enhanced component providing sliders for cost items with optimized performance
 * 1. Quantity slider (e.g., headcount for employees)
 * 2. Value range slider (min/max values)
 * 3. Annual growth percentage slider
 */
const OptimizedCostSliders = ({
  itemId,
  yearData,
  selectedYear,
  metadata = {},
  onQuantityChange,
  onValueChange,
  onGrowthChange,
  formatCurrency
}) => {
  // Extract metadata with defaults for safety
  const {
    quantityLabel = 'Quantity',
    defaultQuantity = 1,
    quantity = {},
    minQuantity = 1,
    maxQuantity = 100,
    quantityStep = 1,
    quantityUnit = 'units',
    growthPercentage = {},
    perUnitCost = null,
    description
  } = metadata;
  
  // Current values with fallbacks to defaults
  const currentQuantity = useMemo(() => 
    quantity[selectedYear] || defaultQuantity, 
  [quantity, selectedYear, defaultQuantity]);
  
  const currentGrowthPercentage = useMemo(() => 
    growthPercentage[selectedYear] || 0, 
  [growthPercentage, selectedYear]);
  
  // Memoized callbacks to reduce re-renders
  const handleQuantityChange = useMemo(() => (value) => {
    onQuantityChange(itemId, selectedYear, parseInt(value, 10));
  }, [itemId, selectedYear, onQuantityChange]);
  
  const handleMinValueChange = useMemo(() => (value) => {
    onValueChange(itemId, selectedYear, true, value);
  }, [itemId, selectedYear, onValueChange]);
  
  const handleMaxValueChange = useMemo(() => (value) => {
    onValueChange(itemId, selectedYear, false, value);
  }, [itemId, selectedYear, onValueChange]);
  
  const handleGrowthChange = useMemo(() => (value) => {
    onGrowthChange(itemId, selectedYear, parseInt(value, 10));
  }, [itemId, selectedYear, onGrowthChange]);
  
  // Calculate appropriate step size based on value magnitude
  const getValueStep = useMemo(() => {
    const maxValue = yearData?.max || 1000000;
    if (maxValue >= 1000000) return 10000;
    if (maxValue >= 100000) return 1000;
    if (maxValue >= 10000) return 500;
    if (maxValue >= 1000) return 100;
    return 10;
  }, [yearData]);
  
  // Description tooltip based on metadata
  const costTooltip = useMemo(() => {
    let tooltip = description || '';
    
    if (perUnitCost) {
      tooltip += ` (Per unit cost: ${formatCurrency(perUnitCost.min)} - ${formatCurrency(perUnitCost.max)})`;
    }
    
    return tooltip;
  }, [description, perUnitCost, formatCurrency]);
  
  return (
    <div className="space-y-6 p-3 bg-gray-50 rounded-lg">
      {description && (
        <div className="text-sm text-gray-600 italic border-l-4 border-blue-200 pl-3 py-1">
          {description}
        </div>
      )}
      
      {/* Quantity Slider */}
      <div>
        <OptimizedSlider
          label={quantityLabel}
          min={minQuantity}
          max={maxQuantity}
          step={quantityStep}
          value={currentQuantity}
          onChange={handleQuantityChange}
          valueSuffix={` ${quantityUnit}`}
          tooltip={`Adjust the number of ${quantityUnit.toLowerCase()}`}
          showTicks={maxQuantity - minQuantity <= 20}
        />
      </div>
      
      {/* Value Range Slider */}
      <div>
        <OptimizedCostRangeSlider
          label="Cost Value Range"
          minValue={yearData.min}
          maxValue={yearData.max}
          onMinChange={handleMinValueChange}
          onMaxChange={handleMaxValueChange}
          formatValue={formatCurrency}
          minStep={getValueStep}
          maxStep={getValueStep}
          tooltip={costTooltip}
        />
      </div>
      
      {/* Annual Growth Percentage Slider */}
      <div>
        <OptimizedSlider
          label="Annual Growth Rate"
          min={-20}
          max={50}
          step={1}
          value={currentGrowthPercentage}
          onChange={handleGrowthChange}
          valueSuffix="%"
          tooltip={`Growth rate for ${parseInt(selectedYear) + 1} projection`}
          showTicks={true}
          tickCount={8}
        />
        <p className="text-xs text-gray-500 mt-1">
          {currentGrowthPercentage > 0 ? '+' : ''}{currentGrowthPercentage}% will affect the {parseInt(selectedYear) + 1} projection
        </p>
      </div>
      
      {/* Per-unit calculation display (if applicable) */}
      {perUnitCost && (
        <div className="text-xs bg-blue-50 p-2 rounded-md">
          <div className="font-medium text-blue-800">Per-unit Cost Calculation</div>
          <div className="mt-1">
            <div className="flex justify-between">
              <span>Min: {formatCurrency(perUnitCost.min)} × {currentQuantity} =</span>
              <span className="font-medium">{formatCurrency(perUnitCost.min * currentQuantity)}</span>
            </div>
            <div className="flex justify-between">
              <span>Max: {formatCurrency(perUnitCost.max)} × {currentQuantity} =</span>
              <span className="font-medium">{formatCurrency(perUnitCost.max * currentQuantity)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(OptimizedCostSliders); 