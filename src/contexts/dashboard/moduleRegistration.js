/**
 * Module registration utility functions
 */

/**
 * Registers a module with the dashboard
 * 
 * @param {Object} registeredModules Current registered modules state
 * @param {string} id Module identifier
 * @param {Function} getResults Function to get module results
 * @param {string} type Module type (costs, revenue, or calculator)
 * @returns {Object} Updated registered modules state
 */
export const registerModule = (registeredModules, id, getResults, type = 'calculator') => {
  console.log(`Registering module: ${id} of type ${type}`);
  
  // Validate parameters
  if (!id || typeof getResults !== 'function') {
    console.error('Invalid module registration: id and getResults are required');
    return registeredModules;
  }
  
  // Determine module type category if not specified
  if (!type) {
    if (id.toLowerCase().includes('cost')) {
      type = 'costs';
    } else if (id.toLowerCase().includes('revenue') || id.toLowerCase().includes('fees')) {
      type = 'revenue';
    } else {
      type = 'calculator';
    }
  }
  
  // Create updated state
  const updated = { ...registeredModules };
  
  // Ensure category exists
  if (!updated[type]) {
    updated[type] = {};
  }
  
  // Add the module to its category
  updated[type][id] = getResults;
  
  return updated;
};

/**
 * Unregisters a module from the dashboard
 * 
 * @param {Object} registeredModules Current registered modules state
 * @param {string} id Module identifier
 * @param {string} type Module type (optional)
 * @returns {Object} Updated registered modules state
 */
export const unregisterModule = (registeredModules, id, type) => {
  console.log(`Unregistering module: ${id}`);
  
  // Create updated state
  const updated = { ...registeredModules };
  
  // Remove the module from its category
  if (type && updated[type] && updated[type][id]) {
    delete updated[type][id];
  } else {
    // If type not specified, search all categories
    Object.keys(updated).forEach(category => {
      if (updated[category][id]) {
        delete updated[category][id];
      }
    });
  }
  
  return updated;
}; 