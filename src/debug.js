// Debug helper for OneCalc application
// Import this file in components you want to debug

export const debugComponent = (componentName, props, state) => {
  console.group(`%c DEBUG: ${componentName}`, 'color: blue; font-weight: bold');
  console.log('Component props:', props);
  console.log('Component state:', state);
  console.groupEnd();
};

export const logError = (componentName, error) => {
  console.group(`%c ERROR: ${componentName}`, 'color: red; font-weight: bold');
  console.error('Error details:', error);
  console.trace('Stack trace:');
  console.groupEnd();
};

export const debugHook = (hookName, value) => {
  console.log(`%c HOOK: ${hookName}`, 'color: purple; font-weight: bold', value);
  return value;
};

export const debugContext = (contextName, value) => {
  console.log(`%c CONTEXT: ${contextName}`, 'color: green; font-weight: bold', value);
  return value;
};

// Function to help debug missing context values
export const validateContext = (context, requiredKeys = [], componentName = 'Unknown') => {
  if (!context) {
    console.error(`%c MISSING CONTEXT in ${componentName}`, 'color: red; font-weight: bold');
    return false;
  }
  
  const missingKeys = requiredKeys.filter(key => context[key] === undefined);
  if (missingKeys.length > 0) {
    console.error(
      `%c INVALID CONTEXT in ${componentName} - Missing keys: ${missingKeys.join(', ')}`, 
      'color: orange; font-weight: bold',
      context
    );
    return false;
  }
  
  return true;
};

// Helper to debug function execution
export const debugFunction = (fnName, args, result) => {
  console.group(`%c FUNCTION: ${fnName}`, 'color: teal; font-weight: bold');
  console.log('Arguments:', args);
  console.log('Result:', result);
  console.groupEnd();
  return result;
};

// Global debug toggle
export const DEBUG_ENABLED = true;

// Initialize debug mode
console.log('%c OneCalc Debug Mode Activated', 'color: white; background-color: blue; font-size: 16px; padding: 5px;'); 