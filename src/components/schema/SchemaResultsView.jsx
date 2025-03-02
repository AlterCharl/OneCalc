import React, { useMemo } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { formatCurrency } from '../../utils/calculators/schemaData';
import styles from './SchemaResultsView.module.css';

/**
 * SchemaResultsView
 * 
 * Displays the calculated results from the schema data
 */
const SchemaResultsView = () => {
  const { calculationResults } = useDashboard();
  
  // Get schema calculator results if available
  const schemaResults = useMemo(() => {
    if (!calculationResults?.schemaCalculator?.results) {
      return null;
    }
    return calculationResults.schemaCalculator.results;
  }, [calculationResults]);
  
  if (!schemaResults) {
    return (
      <div className={styles.noResults}>
        <p>No schema calculation results available.</p>
      </div>
    );
  }
  
  const { costTotals, revenueTotals, netProfitByYear, totalNetProfit } = schemaResults;
  const years = [2026, 2027, 2028, 2029];
  
  return (
    <div className={styles.resultsContainer}>
      <h2 className={styles.sectionTitle}>Schema Calculation Results</h2>
      
      {/* Summary Table */}
      <div className={styles.summaryTable}>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              {years.map(year => (
                <th key={year}>{year}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.costRow}>
              <td>Total Costs</td>
              {years.map(year => (
                <td key={year}>{formatCurrency(costTotals.byYear[year])}</td>
              ))}
              <td>{formatCurrency(costTotals.overall)}</td>
            </tr>
            <tr className={styles.revenueRow}>
              <td>Total Revenue</td>
              {years.map(year => (
                <td key={year}>{formatCurrency(revenueTotals.byYear[year])}</td>
              ))}
              <td>{formatCurrency(revenueTotals.overall)}</td>
            </tr>
            <tr className={styles.profitRow}>
              <td>Net Profit</td>
              {years.map(year => (
                <td key={year} className={netProfitByYear[year] >= 0 ? styles.positive : styles.negative}>
                  {formatCurrency(netProfitByYear[year])}
                </td>
              ))}
              <td className={totalNetProfit >= 0 ? styles.positive : styles.negative}>
                {formatCurrency(totalNetProfit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Cost Details */}
      <h3 className={styles.subsectionTitle}>Costs by Category</h3>
      <div className={styles.detailTable}>
        <table>
          <thead>
            <tr>
              <th>Cost Category</th>
              {years.map(year => (
                <th key={year}>{year}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(costTotals.byCategory).map(category => (
              <tr key={category}>
                <td>{costTotals.byCategory[category].name}</td>
                {years.map(year => (
                  <td key={year}>
                    {formatCurrency(costTotals.byCategory[category].byYear[year])}
                  </td>
                ))}
                <td>{formatCurrency(costTotals.byCategory[category].total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Revenue Details */}
      <h3 className={styles.subsectionTitle}>Revenue by Category</h3>
      <div className={styles.detailTable}>
        <table>
          <thead>
            <tr>
              <th>Revenue Category</th>
              {years.map(year => (
                <th key={year}>{year}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(revenueTotals.byCategory).map(category => (
              <tr key={category}>
                <td>{revenueTotals.byCategory[category].name}</td>
                {years.map(year => (
                  <td key={year}>
                    {formatCurrency(revenueTotals.byCategory[category].byYear[year])}
                  </td>
                ))}
                <td>{formatCurrency(revenueTotals.byCategory[category].total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchemaResultsView; 