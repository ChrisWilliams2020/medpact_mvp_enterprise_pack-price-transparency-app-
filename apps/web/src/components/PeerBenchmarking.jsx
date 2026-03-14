import React, { useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { BarChart, DonutChart, GaugeChart } from './Charts'

// ============================================================================
// PEER BENCHMARKING & MULTI-PRACTICE ROLLUP
// ============================================================================

// Safe number helper
const safeNumber = (val, fallback = 0) => {
  const num = parseFloat(val)
  return isNaN(num) ? fallback : num
}

// Anonymized peer practice data (simulated)
const PEER_BENCHMARKS = {
  ophthalmology: {
    small: { // 1-3 providers
      revenue_per_provider: { p25: 520000, p50: 580000, p75: 650000, p90: 720000 },
      ebitda_margin: { p25: 18, p50: 22, p75: 26, p90: 30 },
      net_collection_rate: { p25: 94, p50: 96, p75: 98, p90: 99 },
      days_in_ar: { p25: 28, p50: 34, p75: 42, p90: 55 },
      patients_per_day: { p25: 22, p50: 26, p75: 30, p90: 35 },
      procedure_conversion: { p25: 25, p50: 32, p75: 38, p90: 45 },
    },
    medium: { // 4-10 providers
      revenue_per_provider: { p25: 550000, p50: 625000, p75: 700000, p90: 800000 },
      ebitda_margin: { p25: 20, p50: 25, p75: 28, p90: 32 },
      net_collection_rate: { p25: 95, p50: 97, p75: 98, p90: 99 },
      days_in_ar: { p25: 26, p50: 32, p75: 38, p90: 48 },
      patients_per_day: { p25: 24, p50: 28, p75: 32, p90: 38 },
      procedure_conversion: { p25: 28, p50: 35, p75: 42, p90: 50 },
    },
    large: { // 11+ providers
      revenue_per_provider: { p25: 580000, p50: 650000, p75: 750000, p90: 880000 },
      ebitda_margin: { p25: 22, p50: 27, p75: 30, p90: 35 },
      net_collection_rate: { p25: 96, p50: 98, p75: 99, p90: 99.5 },
      days_in_ar: { p25: 24, p50: 30, p75: 36, p90: 44 },
      patients_per_day: { p25: 26, p50: 30, p75: 35, p90: 42 },
      procedure_conversion: { p25: 30, p50: 38, p75: 45, p90: 52 },
    },
  },
}

// Calculate percentile ranking
export function calculatePercentile(value, benchmarks) {
  if (value <= benchmarks.p25) return 25 * (value / benchmarks.p25)
  if (value <= benchmarks.p50) return 25 + 25 * ((value - benchmarks.p25) / (benchmarks.p50 - benchmarks.p25))
  if (value <= benchmarks.p75) return 50 + 25 * ((value - benchmarks.p50) / (benchmarks.p75 - benchmarks.p50))
  if (value <= benchmarks.p90) return 75 + 15 * ((value - benchmarks.p75) / (benchmarks.p90 - benchmarks.p75))
  return Math.min(99, 90 + 10 * ((value - benchmarks.p90) / (benchmarks.p90 * 0.2)))
}

// Peer Comparison Card
export function PeerComparisonCard({ metricName, value, benchmarks, unit = '', reverse = false, icon = '📊' }) {
  // For reverse metrics (like Days in AR), lower is better
  const adjustedValue = reverse ? (benchmarks.p90 * 1.2) - value : value
  const adjustedBenchmarks = reverse ? {
    p25: (benchmarks.p90 * 1.2) - benchmarks.p90,
    p50: (benchmarks.p90 * 1.2) - benchmarks.p75,
    p75: (benchmarks.p90 * 1.2) - benchmarks.p50,
    p90: (benchmarks.p90 * 1.2) - benchmarks.p25,
  } : benchmarks
  
  const percentile = calculatePercentile(adjustedValue, adjustedBenchmarks)
  
  const getColor = (p) => {
    if (p >= 75) return '#059669'
    if (p >= 50) return '#0891b2'
    if (p >= 25) return '#f59e0b'
    return '#dc2626'
  }
  
  const color = getColor(percentile)
  
  const getLabel = (p) => {
    if (p >= 90) return 'Top 10%'
    if (p >= 75) return 'Top Quartile'
    if (p >= 50) return 'Above Median'
    if (p >= 25) return 'Below Median'
    return 'Bottom Quartile'
  }
  
  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 20, marginRight: 8 }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{metricName}</span>
        </div>
        <span style={{
          background: color + '20',
          color: color,
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {getLabel(percentile)}
        </span>
      </div>
      
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1e3c72', marginBottom: 8 }}>
        {unit === '$' ? `$${value.toLocaleString()}` : unit === '%' ? `${value.toFixed(1)}%` : value.toFixed(1)}{unit && !['$', '%'].includes(unit) ? ` ${unit}` : ''}
      </div>
      
      {/* Percentile Bar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div style={{
          width: '100%',
          height: 8,
          background: '#e5e7eb',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${percentile}%`,
            height: '100%',
            background: `linear-gradient(90deg, #dc2626 0%, #f59e0b 25%, #0891b2 50%, #059669 75%)`,
            borderRadius: 4,
            transition: 'width 0.5s ease',
          }} />
        </div>
        {/* Marker */}
        <div style={{
          position: 'absolute',
          left: `${percentile}%`,
          top: -2,
          transform: 'translateX(-50%)',
          width: 12,
          height: 12,
          background: color,
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      
      {/* Benchmark scale */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
        <span>P25: {unit === '$' ? `$${benchmarks.p25.toLocaleString()}` : benchmarks.p25}{unit === '%' ? '%' : ''}</span>
        <span>P50: {unit === '$' ? `$${benchmarks.p50.toLocaleString()}` : benchmarks.p50}{unit === '%' ? '%' : ''}</span>
        <span>P75: {unit === '$' ? `$${benchmarks.p75.toLocaleString()}` : benchmarks.p75}{unit === '%' ? '%' : ''}</span>
        <span>P90: {unit === '$' ? `$${benchmarks.p90.toLocaleString()}` : benchmarks.p90}{unit === '%' ? '%' : ''}</span>
      </div>
    </div>
  )
}

// Peer Benchmarking Dashboard
export function PeerBenchmarkingDashboard({ practiceMetrics, practiceSize = 'medium' }) {
  const benchmarks = PEER_BENCHMARKS.ophthalmology[practiceSize]
  
  const metrics = [
    { key: 'revenue_per_provider', name: 'Revenue per Provider', unit: '$', icon: '💰' },
    { key: 'ebitda_margin', name: 'EBITDA Margin', unit: '%', icon: '📊' },
    { key: 'net_collection_rate', name: 'Net Collection Rate', unit: '%', icon: '💳' },
    { key: 'days_in_ar', name: 'Days in AR', unit: 'days', icon: '⏱️', reverse: true },
    { key: 'patients_per_day', name: 'Patients per Day', unit: '', icon: '👥' },
    { key: 'procedure_conversion', name: 'Procedure Conversion', unit: '%', icon: '🔬' },
  ]
  
  // Calculate overall score
  const overallScore = useMemo(() => {
    let totalPercentile = 0
    let count = 0
    
    metrics.forEach(m => {
      if (practiceMetrics[m.key] !== undefined && benchmarks[m.key]) {
        const value = practiceMetrics[m.key]
        const bench = benchmarks[m.key]
        const p = m.reverse 
          ? calculatePercentile((bench.p90 * 1.2) - value, {
              p25: (bench.p90 * 1.2) - bench.p90,
              p50: (bench.p90 * 1.2) - bench.p75,
              p75: (bench.p90 * 1.2) - bench.p50,
              p90: (bench.p90 * 1.2) - bench.p25,
            })
          : calculatePercentile(value, bench)
        totalPercentile += p
        count++
      }
    })
    
    return count > 0 ? totalPercentile / count : 0
  }, [practiceMetrics, benchmarks, metrics])
  
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
          🎯 Peer Benchmarking
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Compare your performance against {practiceSize} ophthalmology practices (anonymized peer data)
        </p>
      </div>
      
      {/* Overall Score */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: 16,
        padding: 28,
        color: 'white',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}>
        <div style={{ position: 'relative' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              fill="none" 
              stroke="white" 
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(overallScore / 100) * 339.3} 339.3`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 'bold' }}>{overallScore.toFixed(0)}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Percentile</div>
          </div>
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 22 }}>
            Overall Performance Score
          </h3>
          <p style={{ margin: 0, opacity: 0.9, fontSize: 15 }}>
            {overallScore >= 75 ? "🏆 You're outperforming most peers!" :
             overallScore >= 50 ? "📈 Performing above average" :
             overallScore >= 25 ? "⚠️ Room for improvement" :
             "🔧 Significant optimization needed"}
          </p>
          <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}>
              Practice Size: {practiceSize.charAt(0).toUpperCase() + practiceSize.slice(1)}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}>
              Peer Group: 847 practices
            </div>
          </div>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {metrics.map(m => (
          practiceMetrics[m.key] !== undefined && benchmarks[m.key] && (
            <PeerComparisonCard
              key={m.key}
              metricName={m.name}
              value={practiceMetrics[m.key]}
              benchmarks={benchmarks[m.key]}
              unit={m.unit}
              reverse={m.reverse}
              icon={m.icon}
            />
          )
        ))}
      </div>
    </div>
  )
}

// Multi-Practice Rollup Dashboard
export function MultiPracticeRollup({ practices }) {
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  
  // Aggregate metrics
  const rollup = useMemo(() => {
    const totals = {
      revenue: 0,
      ebitda: 0,
      encounters: 0,
      providers: 0,
      practices: practices.length,
    }
    
    practices.forEach(p => {
      totals.revenue += p.revenue || 0
      totals.ebitda += p.ebitda || 0
      totals.encounters += p.encounters || 0
      totals.providers += p.providers || 0
    })
    
    totals.ebitda_margin = (totals.ebitda / totals.revenue) * 100
    totals.revenue_per_provider = totals.revenue / totals.providers
    totals.revenue_per_encounter = totals.revenue / totals.encounters
    
    return totals
  }, [practices])
  
  const metrics = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'ebitda', label: 'EBITDA' },
    { key: 'providers', label: 'Providers' },
    { key: 'encounters', label: 'Encounters' },
  ]
  
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 24px 0', color: '#1e3c72', fontSize: 24 }}>
        🏢 Multi-Practice Rollup
      </h2>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 16, padding: 24, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Total Revenue</div>
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>${(rollup.revenue / 1000000).toFixed(1)}M</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: 16, padding: 24, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Total EBITDA</div>
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>${(rollup.ebitda / 1000000).toFixed(1)}M</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 16, padding: 24, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>EBITDA Margin</div>
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{rollup.ebitda_margin.toFixed(1)}%</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #FF6600 0%, #FF9933 100%)', borderRadius: 16, padding: 24, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Total Practices</div>
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{rollup.practices}</div>
        </div>
      </div>
      
      {/* Practice Comparison */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#1e3c72' }}>Practice Comparison</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {metrics.map(m => (
              <button
                key={m.key}
                onClick={() => setSelectedMetric(m.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: selectedMetric === m.key ? '2px solid #667eea' : '2px solid #e5e7eb',
                  background: selectedMetric === m.key ? '#667eea15' : 'white',
                  color: selectedMetric === m.key ? '#667eea' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: selectedMetric === m.key ? 600 : 400,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        
        <BarChart
          data={practices.map(p => p[selectedMetric] || 0)}
          labels={practices.map(p => p.name || `Practice ${p.id}`)}
          colors={['#667eea', '#11998e', '#f5576c', '#FF6600', '#8b5cf6', '#0891b2']}
          height={280}
        />
        
        {/* Practice Table */}
        <div style={{ marginTop: 24, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: '#6b7280' }}>Practice</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 13, color: '#6b7280' }}>Revenue</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 13, color: '#6b7280' }}>EBITDA</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 13, color: '#6b7280' }}>Margin</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 13, color: '#6b7280' }}>Providers</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 13, color: '#6b7280' }}>Rev/Provider</th>
              </tr>
            </thead>
            <tbody>
              {practices.map((p, i) => (
                <tr key={p.id || i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: 12, fontWeight: 500 }}>{p.name || `Practice ${i + 1}`}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>${((p.revenue || 0) / 1000000).toFixed(2)}M</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>${((p.ebitda || 0) / 1000000).toFixed(2)}M</td>
                  <td style={{ padding: 12, textAlign: 'right', color: (p.ebitda / p.revenue * 100) >= 25 ? '#059669' : '#f59e0b' }}>
                    {((p.ebitda || 0) / (p.revenue || 1) * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: 12, textAlign: 'right' }}>{p.providers || 0}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>${((p.revenue || 0) / (p.providers || 1) / 1000).toFixed(0)}K</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f9fafb', fontWeight: 600 }}>
                <td style={{ padding: 12 }}>Total / Average</td>
                <td style={{ padding: 12, textAlign: 'right' }}>${(rollup.revenue / 1000000).toFixed(2)}M</td>
                <td style={{ padding: 12, textAlign: 'right' }}>${(rollup.ebitda / 1000000).toFixed(2)}M</td>
                <td style={{ padding: 12, textAlign: 'right' }}>{rollup.ebitda_margin.toFixed(1)}%</td>
                <td style={{ padding: 12, textAlign: 'right' }}>{rollup.providers}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>${(rollup.revenue_per_provider / 1000).toFixed(0)}K</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

PeerBenchmarkingDashboard.propTypes = {
  practiceMetrics: PropTypes.object,
  specialty: PropTypes.string,
  practiceSize: PropTypes.oneOf(['small', 'medium', 'large']),
}

MultiPracticeRollup.propTypes = {
  practices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    revenue: PropTypes.number,
    ebitda: PropTypes.number,
    providers: PropTypes.number,
  })),
}

export default { PeerBenchmarkingDashboard, MultiPracticeRollup, PeerComparisonCard, calculatePercentile }
