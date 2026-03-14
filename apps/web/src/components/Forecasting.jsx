import React, { useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { LineChart, BarChart } from './Charts'

// ============================================================================
// FINANCIAL FORECASTING ENGINE
// ============================================================================

// Safe number helper
const safeNumber = (val, fallback = 0) => {
  const num = parseFloat(val)
  return isNaN(num) ? fallback : num
}

// Generate financial forecast based on historical data
export function generateForecast(historicalData, months = 12, scenarios = ['base', 'optimistic', 'pessimistic']) {
  if (!historicalData || !Array.isArray(historicalData) || historicalData.length < 3) {
    return null
  }
  
  // Calculate trend from historical data
  const n = historicalData.length
  const sumX = (n * (n - 1)) / 2
  const sumY = historicalData.reduce((a, b) => a + b, 0)
  const sumXY = historicalData.reduce((sum, y, x) => sum + x * y, 0)
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  // Calculate seasonality (simplified)
  const avgGrowthRate = slope / (sumY / n)
  
  // Generate forecasts for each scenario
  const forecasts = {}
  const lastValue = historicalData[historicalData.length - 1]
  
  const scenarioMultipliers = {
    optimistic: 1.15,
    base: 1.0,
    pessimistic: 0.85,
  }
  
  scenarios.forEach(scenario => {
    const multiplier = scenarioMultipliers[scenario] || 1.0
    forecasts[scenario] = []
    
    for (let i = 1; i <= months; i++) {
      // Project value with trend and scenario adjustment
      const baseProjection = lastValue * (1 + avgGrowthRate * multiplier) ** i
      
      // Add seasonal variation (simplified sin wave)
      const seasonalFactor = 1 + 0.05 * Math.sin((i / 12) * Math.PI * 2)
      
      // Add some controlled randomness for realism
      const randomFactor = 0.98 + Math.random() * 0.04
      
      forecasts[scenario].push(Math.round(baseProjection * seasonalFactor * randomFactor))
    }
  })
  
  // Calculate confidence intervals
  const stdDev = Math.sqrt(
    historicalData.reduce((sum, val) => sum + Math.pow(val - sumY / n, 2), 0) / n
  )
  
  return {
    historical: historicalData,
    forecasts,
    trend: slope > 0 ? 'upward' : slope < 0 ? 'downward' : 'stable',
    growthRate: avgGrowthRate * 100,
    confidence: Math.max(0.7 - (stdDev / (sumY / n)) * 0.5, 0.5) * 100,
    stdDev,
  }
}

// What-If Scenario Calculator
export function calculateWhatIf(baseMetrics, adjustments) {
  const results = { ...baseMetrics }
  
  // Apply adjustments
  if (adjustments.revenueChange) {
    results.revenue = baseMetrics.revenue * (1 + adjustments.revenueChange / 100)
    results.revenue_per_provider = results.revenue / (baseMetrics.providers || 1)
    results.revenue_per_encounter = results.revenue / (baseMetrics.encounters || 1)
  }
  
  if (adjustments.expenseChange) {
    results.expenses = baseMetrics.expenses * (1 + adjustments.expenseChange / 100)
    results.ebitda = results.revenue - results.expenses
    results.ebitda_margin = (results.ebitda / results.revenue) * 100
  }
  
  if (adjustments.volumeChange) {
    const volumeMultiplier = 1 + adjustments.volumeChange / 100
    results.encounters = baseMetrics.encounters * volumeMultiplier
    results.revenue = results.revenue * volumeMultiplier
    results.cost_per_encounter = results.expenses / results.encounters
  }
  
  if (adjustments.collectionChange) {
    results.net_collection_rate = Math.min(baseMetrics.net_collection_rate + adjustments.collectionChange, 100)
    results.collected_revenue = results.revenue * (results.net_collection_rate / 100)
  }
  
  if (adjustments.providerAdd) {
    results.providers = (baseMetrics.providers || 1) + adjustments.providerAdd
    results.revenue = results.revenue + (adjustments.providerAdd * 500000) // Assume $500K per new provider
    results.revenue_per_provider = results.revenue / results.providers
  }
  
  return results
}

// Financial Forecast Dashboard Component
export function ForecastDashboard({ historicalRevenue, historicalEbitda, currentMetrics }) {
  const [forecastMonths, setForecastMonths] = useState(12)
  const [selectedScenario, setSelectedScenario] = useState('base')
  const [whatIfAdjustments, setWhatIfAdjustments] = useState({
    revenueChange: 0,
    expenseChange: 0,
    volumeChange: 0,
    collectionChange: 0,
    providerAdd: 0,
  })
  
  // Generate forecasts
  const revenueForecast = useMemo(() => 
    generateForecast(historicalRevenue, forecastMonths), 
    [historicalRevenue, forecastMonths]
  )
  
  const ebitdaForecast = useMemo(() => 
    generateForecast(historicalEbitda, forecastMonths), 
    [historicalEbitda, forecastMonths]
  )
  
  // Calculate what-if results
  const whatIfResults = useMemo(() => 
    calculateWhatIf(currentMetrics, whatIfAdjustments),
    [currentMetrics, whatIfAdjustments]
  )
  
  const scenarioColors = {
    optimistic: '#059669',
    base: '#667eea',
    pessimistic: '#dc2626',
  }
  
  // Generate chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const forecastLabels = Array.from({ length: forecastMonths }, (_, i) => months[i % 12])
  
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
          🔮 Financial Forecasting
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          AI-powered revenue projections and scenario planning
        </p>
      </div>
      
      {/* Forecast Controls */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div>
          <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Forecast Period
          </label>
          <select
            value={forecastMonths}
            onChange={e => setForecastMonths(parseInt(e.target.value))}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: '2px solid #e5e7eb',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={24}>24 Months</option>
            <option value={36}>36 Months</option>
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Scenario
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['optimistic', 'base', 'pessimistic'].map(scenario => (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: selectedScenario === scenario ? `2px solid ${scenarioColors[scenario]}` : '2px solid #e5e7eb',
                  background: selectedScenario === scenario ? scenarioColors[scenario] + '15' : 'white',
                  color: selectedScenario === scenario ? scenarioColors[scenario] : '#6b7280',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: selectedScenario === scenario ? 600 : 400,
                  textTransform: 'capitalize',
                }}
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
        
        {revenueForecast && (
          <div style={{ 
            marginLeft: 'auto', 
            padding: '12px 20px', 
            background: '#f0f9ff', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Model Confidence</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#0891b2' }}>
                {revenueForecast.confidence.toFixed(0)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Trend Direction</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: revenueForecast.trend === 'upward' ? '#059669' : '#dc2626' }}>
                {revenueForecast.trend === 'upward' ? '📈 Upward' : revenueForecast.trend === 'downward' ? '📉 Downward' : '➡️ Stable'}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Forecast Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        {revenueForecast && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e3c72', fontSize: 18 }}>
              Revenue Forecast - {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)}
            </h3>
            <LineChart 
              data={revenueForecast.forecasts[selectedScenario]}
              labels={forecastLabels}
              color={scenarioColors[selectedScenario]}
              height={220}
            />
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <div>
                <span style={{ color: '#6b7280' }}>Starting: </span>
                <span style={{ fontWeight: 600 }}>${(revenueForecast.historical[revenueForecast.historical.length - 1] / 1000000).toFixed(2)}M</span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Projected End: </span>
                <span style={{ fontWeight: 600, color: scenarioColors[selectedScenario] }}>
                  ${(revenueForecast.forecasts[selectedScenario][forecastMonths - 1] / 1000000).toFixed(2)}M
                </span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Growth: </span>
                <span style={{ 
                  fontWeight: 600, 
                  color: revenueForecast.growthRate > 0 ? '#059669' : '#dc2626' 
                }}>
                  {revenueForecast.growthRate > 0 ? '+' : ''}{revenueForecast.growthRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {ebitdaForecast && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e3c72', fontSize: 18 }}>
              EBITDA Forecast - {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)}
            </h3>
            <LineChart 
              data={ebitdaForecast.forecasts[selectedScenario]}
              labels={forecastLabels}
              color={scenarioColors[selectedScenario]}
              height={220}
            />
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <div>
                <span style={{ color: '#6b7280' }}>Starting: </span>
                <span style={{ fontWeight: 600 }}>${(ebitdaForecast.historical[ebitdaForecast.historical.length - 1] / 1000000).toFixed(2)}M</span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Projected End: </span>
                <span style={{ fontWeight: 600, color: scenarioColors[selectedScenario] }}>
                  ${(ebitdaForecast.forecasts[selectedScenario][forecastMonths - 1] / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* What-If Scenario Planner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', 
        borderRadius: 16, 
        padding: 28,
        color: 'white',
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 20 }}>
          🎮 What-If Scenario Planner
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24 }}>
          {[
            { key: 'revenueChange', label: 'Revenue Change', unit: '%', range: [-30, 30] },
            { key: 'expenseChange', label: 'Expense Change', unit: '%', range: [-30, 30] },
            { key: 'volumeChange', label: 'Volume Change', unit: '%', range: [-50, 50] },
            { key: 'collectionChange', label: 'Collection Improvement', unit: 'pts', range: [0, 10] },
            { key: 'providerAdd', label: 'Add Providers', unit: 'FTE', range: [0, 5] },
          ].map(({ key, label, unit, range }) => (
            <div key={key}>
              <label style={{ fontSize: 13, opacity: 0.9, display: 'block', marginBottom: 8 }}>
                {label}: <strong>{whatIfAdjustments[key] >= 0 ? '+' : ''}{whatIfAdjustments[key]}{unit}</strong>
              </label>
              <input
                type="range"
                min={range[0]}
                max={range[1]}
                value={whatIfAdjustments[key]}
                onChange={e => setWhatIfAdjustments({...whatIfAdjustments, [key]: parseFloat(e.target.value)})}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
        
        {/* What-If Results */}
        <div style={{ 
          background: 'rgba(255,255,255,0.15)', 
          borderRadius: 12, 
          padding: 20,
          backdropFilter: 'blur(10px)',
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Projected Impact</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Projected Revenue</div>
              <div style={{ fontSize: 22, fontWeight: 'bold' }}>
                ${((whatIfResults.revenue || 0) / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Projected EBITDA</div>
              <div style={{ fontSize: 22, fontWeight: 'bold' }}>
                ${((whatIfResults.ebitda || 0) / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>EBITDA Margin</div>
              <div style={{ fontSize: 22, fontWeight: 'bold' }}>
                {(whatIfResults.ebitda_margin || 0).toFixed(1)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Revenue/Provider</div>
              <div style={{ fontSize: 22, fontWeight: 'bold' }}>
                ${((whatIfResults.revenue_per_provider || 0) / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setWhatIfAdjustments({ revenueChange: 0, expenseChange: 0, volumeChange: 0, collectionChange: 0, providerAdd: 0 })}
          style={{
            marginTop: 16,
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Reset Scenario
        </button>
      </div>
    </div>
  )
}

// Cash Flow Projection
export function CashFlowProjection({ currentCash, monthlyInflow, monthlyOutflow, months = 12 }) {
  const projections = []
  let runningBalance = currentCash
  
  for (let i = 0; i < months; i++) {
    runningBalance += monthlyInflow - monthlyOutflow
    projections.push({
      month: i + 1,
      inflow: monthlyInflow,
      outflow: monthlyOutflow,
      netCash: monthlyInflow - monthlyOutflow,
      balance: runningBalance,
    })
  }
  
  const minBalance = Math.min(...projections.map(p => p.balance))
  const lowCashWarning = minBalance < currentCash * 0.5
  
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24 }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1e3c72' }}>💸 Cash Flow Projection</h3>
      
      {lowCashWarning && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #dc2626', 
          borderRadius: 8, 
          padding: 12, 
          marginBottom: 16,
          color: '#dc2626',
          fontSize: 14,
        }}>
          ⚠️ Warning: Projected cash balance drops below 50% of current balance in month {
            projections.findIndex(p => p.balance < currentCash * 0.5) + 1
          }
        </div>
      )}
      
      <LineChart
        data={projections.map(p => p.balance)}
        labels={projections.map(p => `M${p.month}`)}
        title=""
        color={lowCashWarning ? '#dc2626' : '#059669'}
        height={180}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
        <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>End Balance</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#059669' }}>
            ${(projections[projections.length - 1].balance / 1000000).toFixed(2)}M
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, background: '#eff6ff', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total Inflow</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#2563eb' }}>
            ${((monthlyInflow * months) / 1000000).toFixed(2)}M
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, background: '#fef2f2', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total Outflow</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#dc2626' }}>
            ${((monthlyOutflow * months) / 1000000).toFixed(2)}M
          </div>
        </div>
      </div>
    </div>
  )
}

ForecastDashboard.propTypes = {
  historicalRevenue: PropTypes.arrayOf(PropTypes.number),
  historicalEbitda: PropTypes.arrayOf(PropTypes.number),
  currentMetrics: PropTypes.object,
}

CashFlowProjection.propTypes = {
  currentCash: PropTypes.number,
  monthlyInflow: PropTypes.number,
  monthlyOutflow: PropTypes.number,
  months: PropTypes.number,
}

export default { ForecastDashboard, CashFlowProjection, generateForecast, calculateWhatIf }
