/**
 * SliderSwitcher.js
 * 
 * This utility allows for easy switching between old and new slider implementations
 * throughout the application. Set USE_OPTIMIZED_SLIDERS to false to revert to original sliders.
 */

// Import the components directly
import Slider from './Slider';
import OptimizedSlider from './OptimizedSlider';
import SliderControl from './SliderControl';
import CostRangeSlider from '../costs/CostRangeSlider';
import OptimizedCostRangeSlider from '../costs/OptimizedCostRangeSlider';
import EnhancedCostSliders from '../costs/EnhancedCostSliders';
import OptimizedCostSliders from '../costs/OptimizedCostSliders';
import OptimizedRevenueSliders from '../revenue/OptimizedRevenueSliders';

// TOGGLE THIS FLAG TO SWITCH SLIDER IMPLEMENTATIONS
export const USE_OPTIMIZED_SLIDERS = true;

// Re-export the components
export { Slider, OptimizedSlider, SliderControl };
export { CostRangeSlider, OptimizedCostRangeSlider };
export { EnhancedCostSliders, OptimizedCostSliders };
export { OptimizedRevenueSliders };

/**
 * Get the appropriate slider component based on current configuration
 * @returns The slider component to use based on USE_OPTIMIZED_SLIDERS flag
 */
export function getSliderComponent() {
  return USE_OPTIMIZED_SLIDERS ? OptimizedSlider : Slider;
}

/**
 * Get the appropriate cost range slider component based on current configuration
 * @returns The cost range slider component to use based on USE_OPTIMIZED_SLIDERS flag
 */
export function getCostRangeSliderComponent() {
  return USE_OPTIMIZED_SLIDERS ? OptimizedCostRangeSlider : CostRangeSlider;
}

/**
 * Get the appropriate cost sliders component based on current configuration
 * @returns The enhanced cost sliders component to use based on USE_OPTIMIZED_SLIDERS flag
 */
export function getCostSlidersComponent() {
  return USE_OPTIMIZED_SLIDERS ? OptimizedCostSliders : EnhancedCostSliders;
}

/**
 * Get the appropriate revenue sliders component based on current configuration
 * @returns The revenue sliders component to use based on USE_OPTIMIZED_SLIDERS flag
 */
export function getRevenueSlidersComponent() {
  return OptimizedRevenueSliders;
}