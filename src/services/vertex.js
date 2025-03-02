/**
 * Google Cloud Vertex AI Service
 * 
 * This service handles interactions with Google Cloud Vertex AI for machine learning capabilities.
 */

// Import Firebase auth for authentication tokens
import { auth } from './firebase';
import { getIdToken } from 'firebase/auth';

// Import a more efficient way to stringify objects for logging
import { createComparisonKey } from '../utils/deepEqual';

// Get environment variables
const VERTEX_API_BASE_URL = 'https://us-central1-aiplatform.googleapis.com/v1';
const PROJECT_ID = process.env.REACT_APP_GCP_PROJECT_ID;
const LOCATION = process.env.REACT_APP_GCP_LOCATION;
const RECOMMENDATION_ENDPOINT_ID = process.env.REACT_APP_VERTEX_RECOMMENDATION_ENDPOINT_ID;
const FORECAST_ENDPOINT_ID = process.env.REACT_APP_VERTEX_FORECAST_ENDPOINT_ID;
const ANALYSIS_ENDPOINT_ID = process.env.REACT_APP_VERTEX_ANALYSIS_ENDPOINT_ID;

/**
 * Gets an authentication token for making Vertex API calls
 * @returns {Promise<string>} Firebase ID token
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to use Vertex AI services');
  }
  
  return await getIdToken(user);
};

/**
 * Makes an authenticated request to the Vertex AI API
 * 
 * @param {string} endpoint - API endpoint path 
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
const fetchFromVertex = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${VERTEX_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vertex API Error (${response.status}): ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    throw error;
  }
};

/**
 * Predicts financial metrics using a Vertex AI model
 * 
 * @param {Object} data - Input data for prediction
 * @returns {Promise<Object>} Prediction results
 */
export const predictFinancialMetrics = async (data) => {
  if (!FORECAST_ENDPOINT_ID) {
    console.warn('FORECAST_ENDPOINT_ID not configured in environment variables');
    return mockForecastResponse(data);
  }
  
  const endpoint = `/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${FORECAST_ENDPOINT_ID}:predict`;
  
  const payload = {
    instances: [
      {
        ...data
      }
    ]
  };
  
  return await fetchFromVertex(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

/**
 * Generates scenario recommendations based on current inputs
 * 
 * @param {Object} currentScenario - Current scenario data
 * @returns {Promise<Object>} Recommendation results
 */
export const generateScenarioRecommendations = async (currentScenario) => {
  // For development, we'll use a mock if the endpoint ID isn't configured
  if (!RECOMMENDATION_ENDPOINT_ID) {
    console.warn('RECOMMENDATION_ENDPOINT_ID not configured in environment variables');
    return mockRecommendationResponse(currentScenario);
  }
  
  // This would call a specific Vertex AI endpoint or model
  const endpoint = `/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/text-bison:predict`;
  
  // Format the prompt based on your specific use case
  const prompt = `
    Based on the following financial scenario for OneWORLD marketplace:
    
    Costs: ${JSON.stringify(currentScenario.costs)}
    Revenues: ${JSON.stringify(currentScenario.revenues)}
    
    Suggest optimizations to improve profitability and achieve break-even faster.
  `;
  
  const payload = {
    instances: [
      {
        prompt: prompt
      }
    ],
    parameters: {
      temperature: 0.2,
      maxOutputTokens: 1024,
      topK: 40,
      topP: 0.95
    }
  };
  
  return await fetchFromVertex(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

/**
 * Analyzes a scenario and detects potential issues or inconsistencies
 * 
 * @param {Object} scenarioData - Complete scenario data
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeScenario = async (scenarioData) => {
  if (!ANALYSIS_ENDPOINT_ID) {
    console.warn('ANALYSIS_ENDPOINT_ID not configured in environment variables');
    return mockAnalysisResponse(scenarioData);
  }
  
  // Example endpoint for a custom model
  const endpoint = `/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ANALYSIS_ENDPOINT_ID}:predict`;
  
  return await fetchFromVertex(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      instances: [scenarioData]
    })
  });
};

/**
 * Forecasts future performance based on current scenario parameters
 * 
 * @param {Object} parameters - Scenario parameters
 * @param {number} years - Number of years to forecast
 * @returns {Promise<Object>} Forecast results
 */
export const forecastPerformance = async (parameters, years = 5) => {
  if (!FORECAST_ENDPOINT_ID) {
    console.warn('FORECAST_ENDPOINT_ID not configured in environment variables');
    return mockForecastResponse(parameters);
  }
  
  // Example endpoint for forecast model
  const endpoint = `/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${FORECAST_ENDPOINT_ID}:predict`;
  
  return await fetchFromVertex(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      instances: [{
        parameters,
        forecastYears: years
      }]
    })
  });
};

// Mock responses for development and testing
const mockRecommendationResponse = (scenarioData) => {
  // Calculate some metrics to provide realistic recommendations
  const hasBreakEven = scenarioData.breakEvenYear !== null;
  const years = Object.keys(scenarioData.costs.totalByYear || {});
  const lastYear = years.length > 0 ? Math.max(...years.map(Number)) : 2029;
  
  return Promise.resolve({
    predictions: [
      {
        content: `## OneWORLD Scenario Optimization Recommendations

Based on the analysis of your current scenario, here are key recommendations to improve profitability:

${hasBreakEven ? 
`✅ Your scenario achieves break-even in ${scenarioData.breakEvenYear}. To accelerate this:` :
`❌ Your scenario doesn't achieve break-even within the projected timeframe. To address this:`}

1. **Revenue Optimization:**
   - Consider increasing transaction fee percentage by 0.5-1% in the early years
   - Focus on boosting transaction volume through targeted marketing efforts
   - Explore additional revenue streams like premium subscriptions or value-added services

2. **Cost Management:**
   - Optimize employee headcount by focusing on essential roles first
   - Consider a phased hiring approach aligned with revenue growth
   - Evaluate outsourcing options for non-core functions

3. **Break-Even Acceleration:**
   - Balance the fee structure to be competitive while covering costs
   - Prioritize high-margin revenue streams in the early years
   - Consider a tiered pricing model based on transaction value

4. **Long-Term Growth:**
   - Once break-even is achieved, reinvest a portion of profits into marketing
   - Expand your service offerings to create additional revenue streams
   - Consider strategic partnerships to reduce customer acquisition costs

These recommendations aim to optimize your business model while maintaining a realistic growth trajectory.`
      }
    ]
  });
};

const mockAnalysisResponse = (scenarioData) => {
  return Promise.resolve({
    predictions: [
      {
        issues: [
          {
            severity: "warning",
            message: "Employee costs growing faster than revenue in 2027-2028"
          },
          {
            severity: "info",
            message: "Transaction volume projections may be optimistic compared to industry averages"
          }
        ],
        healthScore: 68,
        confidenceScore: 0.82
      }
    ]
  });
};

const mockForecastResponse = (parameters) => {
  const forecastYears = [2026, 2027, 2028, 2029, 2030];
  const baseRevenue = 1000000;
  const growthRate = 1.35;
  
  const revenueForecast = {};
  const costForecast = {};
  
  forecastYears.forEach((year, index) => {
    revenueForecast[year] = Math.round(baseRevenue * Math.pow(growthRate, index));
    costForecast[year] = Math.round(baseRevenue * 0.8 * Math.pow(growthRate - 0.15, index));
  });
  
  return Promise.resolve({
    predictions: [
      {
        revenueForecast,
        costForecast,
        confidenceInterval: {
          p90: {
            upperBound: Object.fromEntries(
              Object.entries(revenueForecast).map(([year, val]) => [year, Math.round(val * 1.15)])
            ),
            lowerBound: Object.fromEntries(
              Object.entries(revenueForecast).map(([year, val]) => [year, Math.round(val * 0.85)])
            )
          }
        }
      }
    ]
  });
};

export default {
  predictFinancialMetrics,
  generateScenarioRecommendations,
  analyzeScenario,
  forecastPerformance
}; 