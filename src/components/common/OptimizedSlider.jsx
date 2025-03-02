import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

/**
 * OptimizedSlider - A high-performance slider component
 * Provides smoother interactions, better touch support, and optimized rendering
 */
const OptimizedSlider = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  valuePrefix = '',
  valueSuffix = '',
  disabled = false,
  showTicks = false,
  tickCount = 5,
  className = '',
  tooltip,
  debounceTime = 50
}) => {
  // Local state for tracking interactions
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // Update local value when prop changes (except during dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);
  
  // Format the displayed value
  const formatDisplayValue = useCallback(() => {
    let formatted = localValue;
    
    // Add thousands separators for large numbers
    if (typeof localValue === 'number' && localValue >= 1000) {
      formatted = localValue.toLocaleString('en-US');
    }
    
    return `${valuePrefix}${formatted}${valueSuffix}`;
  }, [localValue, valuePrefix, valueSuffix]);
  
  // Calculate percentage for track visuals
  const percentage = ((localValue - min) / (max - min)) * 100;
  
  // Debounced onChange to avoid excessive updates
  const debouncedChange = useCallback((newValue) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceTime);
  }, [onChange, debounceTime]);
  
  // Handle mouse/touch movement during drag
  const handleMove = useCallback((event) => {
    if (!isDragging || !trackRef.current || disabled) return;
    
    // Get client position (works for both mouse and touch)
    const clientX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
    
    // Calculate the position relative to the track
    const trackRect = trackRef.current.getBoundingClientRect();
    let position = (clientX - trackRect.left) / trackRect.width;
    position = Math.max(0, Math.min(1, position)); // Clamp between 0 and 1
    
    // Convert position to value
    let newValue = min + position * (max - min);
    
    // Apply step
    newValue = Math.round(newValue / step) * step;
    
    // Handle floating point precision
    if (step < 1) {
      const decimals = String(step).split('.')[1]?.length || 0;
      newValue = parseFloat(newValue.toFixed(decimals));
    }
    
    setLocalValue(newValue);
    debouncedChange(newValue);
  }, [isDragging, disabled, min, max, step, debouncedChange]);
  
  // Handle end of drag operation
  const handleMoveEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      // Ensure final value is committed
      onChange(localValue);
      
      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
  }, [isDragging, localValue, onChange]);
  
  // Set up event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('mouseup', handleMoveEnd);
      window.addEventListener('touchend', handleMoveEnd);
      
      // Prevent scrolling during touch drag
      const preventDefault = (e) => {
        if (isDragging) e.preventDefault();
      };
      window.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('mouseup', handleMoveEnd);
        window.removeEventListener('touchend', handleMoveEnd);
        window.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [isDragging, handleMove, handleMoveEnd]);
  
  // Handle direct numeric input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // Handle empty input
    if (inputValue === '') {
      setLocalValue('');
      return;
    }
    
    const numValue = parseFloat(inputValue);
    
    // Validate input
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setLocalValue(numValue);
      onChange(numValue);
    }
  };
  
  // Handle track click for immediate jump
  const handleTrackClick = (e) => {
    if (disabled) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    let newValue = min + clickPosition * (max - min);
    
    // Apply step
    newValue = Math.round(newValue / step) * step;
    
    // Handle floating point precision
    if (step < 1) {
      const decimals = String(step).split('.')[1]?.length || 0;
      newValue = parseFloat(newValue.toFixed(decimals));
    }
    
    setLocalValue(newValue);
    onChange(newValue);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Generate tick marks if enabled
  const tickMarks = showTicks
    ? Array.from({ length: tickCount }, (_, i) => {
        // We don't use the tick value for rendering, just positioning
        return (
          <div
            key={i}
            className="absolute h-2 w-0.5 bg-gray-300"
            style={{
              left: `${(i / (tickCount - 1)) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          />
        );
      })
    : null;
  
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          {label}
          {tooltip && (
            <span className="ml-1 relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 w-48 hidden group-hover:block z-10">
                {tooltip}
              </div>
            </span>
          )}
        </label>
        <input
          type="number"
          className="w-20 p-1 text-xs border rounded text-right disabled:opacity-60"
          value={localValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </div>
      
      <div className="relative h-12">
        {/* Slider track */}
        <div
          ref={trackRef}
          className="absolute top-4 h-2 w-full bg-gray-200 rounded-full cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Fill track */}
          <div
            className="absolute h-full bg-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
          
          {/* Tick marks */}
          {tickMarks}
        </div>
        
        {/* Slider thumb */}
        <div
          className={`absolute top-2.5 w-8 h-8 rounded-full shadow-md bg-white border-2 ${
            disabled 
              ? 'border-gray-300 cursor-not-allowed' 
              : isDragging 
                ? 'border-blue-700 cursor-grabbing scale-110' 
                : 'border-blue-500 cursor-grab hover:border-blue-600 hover:scale-105'
          } transition-all duration-150 flex items-center justify-center -ml-4`}
          style={{ left: `${percentage}%` }}
          onMouseDown={() => !disabled && setIsDragging(true)}
          onTouchStart={() => !disabled && setIsDragging(true)}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localValue}
          aria-label={label}
          onKeyDown={(e) => {
            if (disabled) return;
            
            let newValue = localValue;
            const stepSize = e.shiftKey ? step * 10 : step;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              newValue = Math.min(localValue + stepSize, max);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              newValue = Math.max(localValue - stepSize, min);
            } else if (e.key === 'Home') {
              newValue = min;
            } else if (e.key === 'End') {
              newValue = max;
            }
            
            if (newValue !== localValue) {
              setLocalValue(newValue);
              onChange(newValue);
            }
          }}
        >
          <div className="text-xs font-medium text-gray-500">
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>
      
      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{valuePrefix}{min.toLocaleString()}{valueSuffix}</span>
        <span className="text-sm font-semibold text-gray-900">
          {formatDisplayValue()}
        </span>
        <span>{valuePrefix}{max.toLocaleString()}{valueSuffix}</span>
      </div>
    </div>
  );
};

export default memo(OptimizedSlider); 