/**
 * Schema Importer Utility
 * 
 * This utility provides functions to import schema data from different sources,
 * including the new Buyers Portal schema data.
 */

import { buyersPortalSchema } from '../data/buyersPortalSchema';

/**
 * Imports the Buyers Portal schema data into the application's schema format
 * @returns {Object} Formatted schema data ready for the SchemaContext
 */
export const importBuyersPortalSchema = () => {
  return buyersPortalSchema;
};

/**
 * Merges the Buyers Portal schema with existing schema data
 * @param {Object} existingSchema - The current schema data in the application
 * @returns {Object} The merged schema data
 */
export const mergeBuyersPortalSchema = (existingSchema) => {
  if (!existingSchema) return buyersPortalSchema;

  // Create a deep clone of the existing schema
  const mergedSchema = JSON.parse(JSON.stringify(existingSchema));
  
  // Merge categories
  for (const category in buyersPortalSchema.categories) {
    if (!mergedSchema.categories[category]) {
      mergedSchema.categories[category] = [];
    }
    
    // Merge unique subcategories
    buyersPortalSchema.categories[category].forEach(subcategory => {
      if (!mergedSchema.categories[category].includes(subcategory)) {
        mergedSchema.categories[category].push(subcategory);
      }
    });
  }
  
  // Merge subcategory labels
  mergedSchema.subcategoryLabels = {
    ...mergedSchema.subcategoryLabels,
    ...buyersPortalSchema.subcategoryLabels
  };
  
  // Merge schema items
  mergedSchema.items = {
    ...mergedSchema.items,
    ...buyersPortalSchema.items
  };
  
  // Merge metrics if they exist
  if (buyersPortalSchema.metrics) {
    mergedSchema.metrics = {
      ...(mergedSchema.metrics || {}),
      ...buyersPortalSchema.metrics
    };
  }
  
  // Merge scenario parameters if they exist
  if (buyersPortalSchema.scenarioParameters) {
    mergedSchema.scenarioParameters = {
      ...(mergedSchema.scenarioParameters || {}),
      ...buyersPortalSchema.scenarioParameters
    };
  }
  
  return mergedSchema;
};

/**
 * Parses schema data from a JSON string
 * @param {string} jsonString - The JSON string containing schema data
 * @returns {Object|null} Parsed schema data or null if invalid
 */
export const parseSchemaFromJson = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse schema data:", error);
    return null;
  }
};

export default {
  importBuyersPortalSchema,
  mergeBuyersPortalSchema,
  parseSchemaFromJson
}; 