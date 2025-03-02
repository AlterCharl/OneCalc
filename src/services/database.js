/**
 * Mock Database Service
 * 
 * This provides simplified mock implementations of database operations.
 */

// In-memory store for scenarios
const scenariosStore = {};

/**
 * Save a scenario to the mock database
 * 
 * @param {string} userId - User ID
 * @param {string} scenarioId - Scenario ID (optional, will be generated if not provided)
 * @param {Object} data - Scenario data to save
 * @returns {Promise<Object>} - Saved scenario data with ID
 */
export const saveScenario = async (userId, scenarioId, data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Create a new ID if not provided
  const id = scenarioId || `scenario-${Date.now()}`;
  
  // Save to in-memory store
  if (!scenariosStore[userId]) {
    scenariosStore[userId] = {};
  }
  
  const scenarioData = {
    id,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  scenariosStore[userId][id] = scenarioData;
  
  console.log(`Saved scenario ${id} for user ${userId}`);
  return scenarioData;
};

/**
 * Load a scenario from the mock database
 * 
 * @param {string} userId - User ID
 * @param {string} scenarioId - Scenario ID
 * @returns {Promise<Object|null>} - Scenario data or null if not found
 */
export const loadScenario = async (userId, scenarioId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if the scenario exists
  if (!scenariosStore[userId] || !scenariosStore[userId][scenarioId]) {
    console.log(`Scenario ${scenarioId} not found for user ${userId}`);
    return null;
  }
  
  console.log(`Loaded scenario ${scenarioId} for user ${userId}`);
  return scenariosStore[userId][scenarioId];
};

/**
 * List all scenarios for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of scenario data
 */
export const listScenarios = async (userId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return empty array if no scenarios
  if (!scenariosStore[userId]) {
    return [];
  }
  
  // Convert to array
  return Object.values(scenariosStore[userId]);
};

/**
 * Delete a scenario
 * 
 * @param {string} userId - User ID
 * @param {string} scenarioId - Scenario ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteScenario = async (userId, scenarioId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if the scenario exists
  if (!scenariosStore[userId] || !scenariosStore[userId][scenarioId]) {
    console.log(`Scenario ${scenarioId} not found for user ${userId}`);
    return false;
  }
  
  // Delete the scenario
  delete scenariosStore[userId][scenarioId];
  console.log(`Deleted scenario ${scenarioId} for user ${userId}`);
  return true;
}; 