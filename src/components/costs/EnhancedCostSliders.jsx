import React from 'react';
import CostRangeSlider from './CostRangeSlider';

/**
 * EnhancedCostSliders - Component providing three sliders for each cost item
 * 1. Quantity slider (e.g., headcount for employees)
 * 2. Value range slider (min/max values)
 * 3. Annual growth percentage slider
 */
const EnhancedCostSliders = ({
  itemId,
  yearData,
  selectedYear,
  metadata,
  onQuantityChange,
  onValueChange,
  onGrowthChange,
  formatCurrency
}) => {
  // Default values if not in metadata
  const quantityLabel = metadata?.quantityLabel || 'Quantity';
  const defaultQuantity = metadata?.defaultQuantity || 1;
  const quantity = metadata?.quantity?.[selectedYear] || defaultQuantity;
  const minQuantity = metadata?.minQuantity || 1;
  const maxQuantity = metadata?.maxQuantity || 100;
  const quantityStep = metadata?.quantityStep || 1;
  
  // Growth percentage (default to 0% if not set)
  const growthPercentage = metadata?.growthPercentage?.[selectedYear] || 0;
  
  return (
    <div className="space-y-6">
      {/* Quantity Slider */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">{quantityLabel}</h5>
        <div className="relative pt-1">
          <input
            type="range"
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            min={minQuantity}
            max={maxQuantity}
            step={quantityStep}
            value={quantity}
            onChange={(e) => onQuantityChange(itemId, selectedYear, parseInt(e.target.value, 10))}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">{minQuantity}</span>
            <span className="text-sm font-medium">{quantity} {metadata?.quantityUnit || 'units'}</span>
            <span className="text-xs text-gray-500">{maxQuantity}</span>
          </div>
        </div>
      </div>
      
      {/* Value Range Slider (reusing existing CostRangeSlider) */}
      <div>
        <h5 className="text-sm font-medium text-gray-700">Cost Value Range</h5>
        <CostRangeSlider
          minValue={yearData.min}
          maxValue={yearData.max}
          onMinChange={(value) => onValueChange(itemId, selectedYear, true, value)}
          onMaxChange={(value) => onValueChange(itemId, selectedYear, false, value)}
          formatValue={formatCurrency}
          minStep={1000}
          maxStep={5000}
        />
      </div>
      
      {/* Annual Growth Percentage Slider */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Annual Growth Rate</h5>
        <div className="relative pt-1">
          <input
            type="range"
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            min={-20}
            max={50}
            step={1}
            value={growthPercentage}
            onChange={(e) => onGrowthChange(itemId, selectedYear, parseInt(e.target.value, 10))}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">-20%</span>
            <span className="text-sm font-medium text-center">
              {growthPercentage > 0 ? '+' : ''}{growthPercentage}%
            </span>
            <span className="text-xs text-gray-500">+50%</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This will affect the {parseInt(selectedYear) + 1} projection
        </p>
      </div>
    </div>
  );
};

export default EnhancedCostSliders; 