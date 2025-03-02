import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

/**
 * OptimizedCostRangeSlider - An improved slider component for cost ranges
 * Resolves issues with thumb positioning, touch events, and provides better user feedback
 */
const OptimizedCostRangeSlider = ({ 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange,
  minStep = 1000,
  maxStep = 1000,
  formatValue = (value) => value,
  disabled = false,
  label = "Cost Range"
}) => {
  // Refs for the range track and thumbs
  const trackRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  
  // State for tracking user interactions
  const [isDragging, setIsDragging] = useState(null); // 'min', 'max', or null
  const [localMinValue, setLocalMinValue] = useState(minValue);
  const [localMaxValue, setLocalMaxValue] = useState(maxValue);
  
  // Calculate the lower and upper bounds for the sliders with some buffer
  const minBound = 0;
  const maxBound = Math.max(maxValue * 2, minValue * 2, 1000000); 
  
  // Update local values when props change
  useEffect(() => {
    setLocalMinValue(minValue);
    setLocalMaxValue(maxValue);
  }, [minValue, maxValue]);
  
  // Calculate the percentage position for visual indicators
  const getPercentage = useCallback((value) => {
    return ((value - minBound) / (maxBound - minBound)) * 100;
  }, [minBound, maxBound]);
  
  const minPercent = getPercentage(localMinValue);
  const maxPercent = getPercentage(localMaxValue);
  
  // Handle mouse movement during drag
  const handleMouseMove = useCallback((event) => {
    if (!isDragging || !trackRef.current) return;
    
    // Calculate the position relative to the track element
    const trackRect = trackRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;
    
    // Get position (handle both mouse and touch events)
    const clientX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
    
    // Calculate position as a percentage of track width
    let position = (clientX - trackRect.left) / trackWidth;
    position = Math.max(0, Math.min(1, position)); // Clamp between 0 and 1
    
    // Convert to value
    const newValue = Math.round((position * (maxBound - minBound) + minBound) / 
      (isDragging === 'min' ? minStep : maxStep)) * 
      (isDragging === 'min' ? minStep : maxStep);
    
    if (isDragging === 'min') {
      // Ensure min doesn't exceed max
      const updatedValue = Math.min(newValue, localMaxValue - minStep);
      setLocalMinValue(updatedValue);
    } else if (isDragging === 'max') {
      // Ensure max doesn't go below min
      const updatedValue = Math.max(newValue, localMinValue + maxStep);
      setLocalMaxValue(updatedValue);
    }
  }, [isDragging, minBound, maxBound, localMinValue, localMaxValue, minStep, maxStep]);
  
  // Handle end of drag
  const handleMouseUp = useCallback(() => {
    if (isDragging === 'min') {
      onMinChange(localMinValue);
    } else if (isDragging === 'max') {
      onMaxChange(localMaxValue);
    }
    setIsDragging(null);
  }, [isDragging, localMinValue, localMaxValue, onMinChange, onMaxChange]);
  
  // Set up event listeners for drag operations
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
      
      // Prevent default behavior to avoid page scrolling during touch drags
      const preventDefault = (e) => {
        if (isDragging) e.preventDefault();
      };
      window.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleMouseUp);
        window.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Handle direct input change for min/max values
  const handleInputChange = (isMin, value) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    
    if (isMin) {
      if (numValue < localMaxValue) {
        setLocalMinValue(numValue);
        onMinChange(numValue);
      }
    } else {
      if (numValue > localMinValue) {
        setLocalMaxValue(numValue);
        onMaxChange(numValue);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative pt-1" aria-label={label}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        {/* Range track with colored segment */}
        <div 
          ref={trackRef}
          className="h-2 bg-gray-200 rounded-full relative" 
          onClick={(e) => {
            if (disabled) return;
            // Calculate position relative to track
            const rect = e.currentTarget.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const value = Math.round(position * (maxBound - minBound) + minBound);
            
            // Determine if click is closer to min or max handle
            const midpoint = (localMinValue + localMaxValue) / 2;
            if (value <= midpoint) {
              setLocalMinValue(value);
              onMinChange(value);
            } else {
              setLocalMaxValue(value);
              onMaxChange(value);
            }
          }}
        >
          <div 
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{ 
              left: `${minPercent}%`, 
              width: `${maxPercent - minPercent}%` 
            }}
          ></div>
        </div>
        
        {/* Min handle */}
        <div 
          ref={minThumbRef}
          className={`absolute w-6 h-6 rounded-full shadow border-2 border-white ${
            disabled ? 'bg-gray-400' : isDragging === 'min' ? 'bg-blue-700 scale-110' : 'bg-blue-600'
          } -mt-2 cursor-grab ${isDragging === 'min' ? 'cursor-grabbing z-30' : 'z-20'} transition-all`}
          style={{ 
            left: `${minPercent}%`,
            transform: 'translateX(-50%)'
          }}
          onMouseDown={() => !disabled && setIsDragging('min')}
          onTouchStart={() => !disabled && setIsDragging('min')}
          tabIndex={0}
          role="slider"
          aria-valuemin={minBound}
          aria-valuemax={maxBound}
          aria-valuenow={localMinValue}
          aria-label="Minimum value"
          onKeyDown={(e) => {
            if (disabled) return;
            let newValue = localMinValue;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              newValue = Math.min(localMinValue + minStep, localMaxValue - minStep);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              newValue = Math.max(localMinValue - minStep, minBound);
            }
            
            if (newValue !== localMinValue) {
              setLocalMinValue(newValue);
              onMinChange(newValue);
            }
          }}
        ></div>
        
        {/* Max handle */}
        <div 
          ref={maxThumbRef}
          className={`absolute w-6 h-6 rounded-full shadow border-2 border-white ${
            disabled ? 'bg-gray-400' : isDragging === 'max' ? 'bg-blue-700 scale-110' : 'bg-blue-600'
          } -mt-2 cursor-grab ${isDragging === 'max' ? 'cursor-grabbing z-30' : 'z-20'} transition-all`}
          style={{ 
            left: `${maxPercent}%`,
            transform: 'translateX(-50%)'
          }}
          onMouseDown={() => !disabled && setIsDragging('max')}
          onTouchStart={() => !disabled && setIsDragging('max')}
          tabIndex={0}
          role="slider"
          aria-valuemin={minBound}
          aria-valuemax={maxBound}
          aria-valuenow={localMaxValue}
          aria-label="Maximum value"
          onKeyDown={(e) => {
            if (disabled) return;
            let newValue = localMaxValue;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              newValue = Math.min(localMaxValue + maxStep, maxBound);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              newValue = Math.max(localMaxValue - maxStep, localMinValue + maxStep);
            }
            
            if (newValue !== localMaxValue) {
              setLocalMaxValue(newValue);
              onMaxChange(newValue);
            }
          }}
        ></div>
      </div>
      
      {/* Value display with direct input */}
      <div className="flex justify-between">
        <div className="text-sm">
          <span className="text-gray-500">Min: </span>
          <input
            type="number"
            className="w-20 p-1 text-xs border rounded font-medium disabled:opacity-60"
            value={localMinValue}
            onChange={(e) => handleInputChange(true, e.target.value)}
            min={minBound}
            max={localMaxValue - minStep}
            step={minStep}
            disabled={disabled}
          />
          <span className="ml-1 text-xs">{formatValue(localMinValue).replace(/[0-9]/g, '')}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Max: </span>
          <input
            type="number"
            className="w-20 p-1 text-xs border rounded font-medium disabled:opacity-60"
            value={localMaxValue}
            onChange={(e) => handleInputChange(false, e.target.value)}
            min={localMinValue + maxStep}
            max={maxBound}
            step={maxStep}
            disabled={disabled}
          />
          <span className="ml-1 text-xs">{formatValue(localMaxValue).replace(/[0-9]/g, '')}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(OptimizedCostRangeSlider); 