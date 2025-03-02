import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { generateScenarioRecommendations } from '../../services/vertex';

/**
 * ScenarioRecommendations - Component that leverages Vertex AI to provide
 * recommendations on how to optimize the current scenario
 */
const ScenarioRecommendations = () => {
  const { compiledResults } = useDashboard();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleGetRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare the current scenario data for the AI model
      const scenarioData = {
        costs: {
          totalByYear: compiledResults.totalCostsByYear,
          modules: compiledResults.costModules
        },
        revenues: {
          totalByYear: compiledResults.totalRevenueByYear,
          modules: compiledResults.revenueModules
        },
        netProfit: compiledResults.netProfitByYear,
        breakEvenYear: compiledResults.breakEvenYear,
        metrics: compiledResults.summaryMetrics
      };
      
      // Call Vertex AI for recommendations
      const response = await generateScenarioRecommendations(scenarioData);
      
      // Process and display recommendations
      if (response && response.predictions && response.predictions.length > 0) {
        setRecommendations(response.predictions[0].content);
      } else {
        setError('No recommendations were generated');
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">AI Scenario Recommendations</h3>
        <button
          onClick={handleGetRecommendations}
          disabled={loading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {recommendations ? (
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
            {recommendations}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 italic">
          Click "Get Recommendations" to have our AI analyze your scenario and provide suggestions for optimization.
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        Powered by Google Cloud Vertex AI
      </div>
    </div>
  );
};

export default ScenarioRecommendations; 