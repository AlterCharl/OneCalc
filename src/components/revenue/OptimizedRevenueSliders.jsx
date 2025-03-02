import React, { memo, useMemo } from 'react';
import OptimizedSlider from '../common/OptimizedSlider';

/**
 * OptimizedRevenueSliders - Enhanced component providing sliders for revenue items with optimized performance
 * 1. Revenue value slider
 * 2. Quantity slider (if applicable)
 * 3. Annual growth percentage slider
 */
const OptimizedRevenueSliders = ({
  itemId,
  yearData,
  selectedYear,
  metadata = {},
  onValueChange,
  onQuantityChange,
  onGrowthChange,
  formatCurrency
}) => {
  // Extract metadata with defaults for safety
  const {
    defaultValue = 0,
    valueLabel = 'Revenue',
    minValue = 0,
    maxValue = 1000000,
    valueStep = 100,
    quantityLabel = 'Quantity',
    defaultQuantity = 1,
    quantity = {},
    minQuantity = 1,
    maxQuantity = 100,
    quantityStep = 1,
    quantityUnit = 'units',
    growthPercentage = {},
    perUnitRevenue = null,
    description
  } = metadata;
  
  // Current values with fallbacks to defaults
  const currentValue = yearData?.value || defaultValue;
  
  const currentQuantity = useMemo(() => 
    quantity[selectedYear] || defaultQuantity, 
  [quantity, selectedYear, defaultQuantity]);
  
  const currentGrowthPercentage = useMemo(() => 
    growthPercentage[selectedYear] || 0, 
  [growthPercentage, selectedYear]);
  
  // Calculate appropriate step size based on value magnitude
  const getValueStep = useMemo(() => {
    if (currentValue >= 1000000) return 10000;
    if (currentValue >= 100000) return 1000;
    if (currentValue >= 10000) return 500;
    if (currentValue >= 1000) return 100;
    return valueStep;
  }, [currentValue, valueStep]);
  
  // Memoized callbacks to reduce re-renders
  const handleValueChange = useMemo(() => (value) => {
    onValueChange(itemId, selectedYear, parseInt(value, 10));
  }, [itemId, selectedYear, onValueChange]);
  
  const handleQuantityChange = useMemo(() => (value) => {
    onQuantityChange(itemId, selectedYear, parseInt(value, 10));
  }, [itemId, selectedYear, onQuantityChange]);
  
  const handleGrowthChange = useMemo(() => (value) => {
    onGrowthChange(itemId, selectedYear, parseInt(value, 10));
  }, [itemId, selectedYear, onGrowthChange]);
  
  // Description tooltip based on metadata
  const revenueTooltip = useMemo(() => {
    let tooltip = description || '';
    
    if (perUnitRevenue) {
      tooltip += ` (Per unit revenue: ${formatCurrency(perUnitRevenue)})`;
    }
    
    return tooltip;
  }, [description, perUnitRevenue, formatCurrency]);
  
  // Whether to show the quantity slider
  const showQuantitySlider = metadata.hasOwnProperty('quantity');
  
  return (
    <div className="space-y-6 p-3 bg-gray-50 rounded-lg">
      {description && (
        <div className="text-sm text-gray-600 italic border-l-4 border-green-200 pl-3 py-1">
          {description}
        </div>
      )}
      
      {/* Revenue Value Slider */}
      <div>
        <OptimizedSlider
          label={valueLabel}
          min={minValue}
          max={maxValue}
          step={getValueStep}
          value={currentValue}
          onChange={handleValueChange}
          valuePrefix="R"
          tooltip={revenueTooltip}
          className="revenue-slider"
        />
      </div>
      
      {/* Quantity Slider (if applicable) */}
      {showQuantitySlider && (
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
      )}
      
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
      {perUnitRevenue && showQuantitySlider && (
        <div className="text-xs bg-green-50 p-2 rounded-md">
          <div className="font-medium text-green-800">Per-unit Revenue Calculation</div>
          <div className="mt-1">
            <div className="flex justify-between">
              <span>{formatCurrency(perUnitRevenue)} × {currentQuantity} =</span>
              <span className="font-medium">{formatCurrency(perUnitRevenue * currentQuantity)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(OptimizedRevenueSliders); 