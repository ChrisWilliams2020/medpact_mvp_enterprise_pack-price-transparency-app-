import React, { useState, useEffect, useCallback, memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { usePracticeData, DataIsolationBadge } from '../context/PracticeDataContext'

// ============================================================================
// NORMATIVE BENCHMARKING DASHBOARD
// Compare practice metrics against de-identified normative data
// ============================================================================

// Safe helpers
const safeNumber = (val, fallback = 0) => {
  const num = parseFloat(val)
  return isNaN(num) ? fallback : num
}

const formatPercent = (val, decimals = 1) => {
  const num = safeNumber(val)
  return (num * 100).toFixed(decimals) + '%'
}

const formatCurrency = (val) => {
  const num = safeNumber(val)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

const formatDays = (val) => {
  return safeNumber(val).toFixed(1) + ' days'
}

// ============================================================================
// PERCENTILE GAUGE - Visual indicator of practice vs benchmark
// ============================================================================

const PercentileGauge = memo(function PercentileGauge({ 
  value, 
  p25, 
  median, 
  p75, 
  p90,
  label,
  formatter = (v) => v,
  invertColors = false, // For metrics where lower is better (denials, DAR)
}) {
  // Calculate position on gauge (0-100)
  const getPosition = useCallback(() => {
    if (value <= p25) return (value / p25) * 25
    if (value <= median) return 25 + ((value - p25) / (median - p25)) * 25
    if (value <= p75) return 50 + ((value - median) / (p75 - median)) * 25
    if (p90 && value <= p90) return 75 + ((value - p75) / (p90 - p75)) * 15
    return 95
  }, [value, p25, median, p75, p90])
  
  const position = getPosition()
  
  // Color based on position (or inverted)
  const getColor = () => {
    if (invertColors) {
      if (position <= 25) return '#10B981' // Green - low is good
      if (position <= 50) return '#34D399'
      if (position <= 75) return '#FBBF24' // Yellow
      return '#EF4444' // Red - high is bad
    } else {
      if (position <= 25) return '#EF4444' // Red - low is bad
      if (position <= 50) return '#FBBF24'
      if (position <= 75) return '#34D399'
      return '#10B981' // Green - high is good
    }
  }
  
  const getStatusText = () => {
    if (invertColors) {
      if (position <= 25) return 'Excellent'
      if (position <= 50) return 'Good'
      if (position <= 75) return 'Below Average'
      return 'Needs Attention'
    } else {
      if (position <= 25) return 'Below Average'
      if (position <= 50) return 'Average'
      if (position <= 75) return 'Good'
      return 'Excellent'
    }
  }
  
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, color: '#374151' }}>{label}</span>
        <span style={{ 
          fontWeight: 700, 
          color: getColor(),
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {formatter(value)}
          <span style={{
            fontSize: 11,
            padding: '2px 8px',
            backgroundColor: getColor() + '20',
            borderRadius: 4,
          }}>
            {getStatusText()}
          </span>
        </span>
      </div>
      
      {/* Gauge Track */}
      <div style={{
        position: 'relative',
        height: 24,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
      }}>
        {/* Percentile zones */}
        <div style={{
          position: 'absolute',
          left: 0,
          width: '25%',
          height: '100%',
          backgroundColor: invertColors ? '#D1FAE5' : '#FEE2E2',
          borderRight: '1px solid #E5E7EB',
        }} />
        <div style={{
          position: 'absolute',
          left: '25%',
          width: '25%',
          height: '100%',
          backgroundColor: invertColors ? '#ECFDF5' : '#FEF3C7',
          borderRight: '1px solid #E5E7EB',
        }} />
        <div style={{
          position: 'absolute',
          left: '50%',
          width: '25%',
          height: '100%',
          backgroundColor: invertColors ? '#FEF3C7' : '#ECFDF5',
          borderRight: '1px solid #E5E7EB',
        }} />
        <div style={{
          position: 'absolute',
          left: '75%',
          width: '25%',
          height: '100%',
          backgroundColor: invertColors ? '#FEE2E2' : '#D1FAE5',
        }} />
        
        {/* Value indicator */}
        <div style={{
          position: 'absolute',
          left: `${position}%`,
          top: 2,
          bottom: 2,
          width: 4,
          backgroundColor: getColor(),
          borderRadius: 2,
          transform: 'translateX(-50%)',
          boxShadow: '0 0 4px rgba(0,0,0,0.3)',
        }} />
        
        {/* Median marker */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#6B7280',
        }} />
      </div>
      
      {/* Labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: 4,
        fontSize: 11,
        color: '#6B7280',
      }}>
        <span>P25: {formatter(p25)}</span>
        <span>Median: {formatter(median)}</span>
        <span>P75: {formatter(p75)}</span>
        {p90 && <span>P90: {formatter(p90)}</span>}
      </div>
    </div>
  )
})

PercentileGauge.propTypes = {
  value: PropTypes.number.isRequired,
  p25: PropTypes.number.isRequired,
  median: PropTypes.number.isRequired,
  p75: PropTypes.number.isRequired,
  p90: PropTypes.number,
  label: PropTypes.string.isRequired,
  formatter: PropTypes.func,
  invertColors: PropTypes.bool,
}

// ============================================================================
// BENCHMARK COMPARISON CARD
// ============================================================================

const BenchmarkCard = memo(function BenchmarkCard({ 
  title, 
  icon,
  practiceValue, 
  benchmark,
  formatter,
  invertColors,
  description,
}) {
  if (!benchmark || !practiceValue) {
    return (
      <div style={{
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          <span style={{ fontWeight: 600, color: '#374151' }}>{title}</span>
        </div>
        <p style={{ margin: 0, color: '#9CA3AF', fontSize: 14 }}>
          Insufficient data for comparison
        </p>
      </div>
    )
  }
  
  const variance = practiceValue - benchmark.median
  const variancePercent = benchmark.median ? (variance / benchmark.median) * 100 : 0
  const isPositiveVariance = invertColors ? variance < 0 : variance > 0
  
  return (
    <div style={{
      padding: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          <span style={{ fontWeight: 600, color: '#374151' }}>{title}</span>
        </div>
        <DataIsolationBadge dataType="benchmarks" />
      </div>
      
      <PercentileGauge
        value={practiceValue}
        p25={benchmark.p25}
        median={benchmark.median}
        p75={benchmark.p75}
        p90={benchmark.p90}
        label="Your Practice"
        formatter={formatter}
        invertColors={invertColors}
      />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>Your Practice</p>
          <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
            {formatter(practiceValue)}
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>Peer Median</p>
          <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 600, color: '#6B7280' }}>
            {formatter(benchmark.median)}
          </p>
        </div>
      </div>
      
      <div style={{
        marginTop: 12,
        padding: '8px 12px',
        backgroundColor: isPositiveVariance ? '#D1FAE5' : '#FEE2E2',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>{isPositiveVariance ? '📈' : '📉'}</span>
        <span style={{ 
          fontSize: 13, 
          color: isPositiveVariance ? '#065F46' : '#991B1B',
          fontWeight: 500,
        }}>
          {Math.abs(variancePercent).toFixed(1)}% {variance >= 0 ? 'above' : 'below'} median
        </span>
      </div>
      
      {description && (
        <p style={{ margin: '12px 0 0', fontSize: 13, color: '#6B7280' }}>
          {description}
        </p>
      )}
    </div>
  )
})

BenchmarkCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  practiceValue: PropTypes.number,
  benchmark: PropTypes.shape({
    p25: PropTypes.number,
    median: PropTypes.number,
    p75: PropTypes.number,
    p90: PropTypes.number,
  }),
  formatter: PropTypes.func,
  invertColors: PropTypes.bool,
  description: PropTypes.string,
}

// ============================================================================
// COHORT SELECTOR
// ============================================================================

const CohortSelector = memo(function CohortSelector({ 
  specialty, 
  region, 
  sizeCategory,
  onSpecialtyChange,
  onRegionChange,
  onSizeChange,
  practiceCount,
}) {
  const specialties = [
    { value: '', label: 'All Specialties' },
    { value: 'family_medicine', label: 'Family Medicine' },
    { value: 'internal_medicine', label: 'Internal Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'obgyn', label: 'OB/GYN' },
    { value: 'oncology', label: 'Oncology' },
  ]
  
  const regions = [
    { value: '', label: 'National' },
    { value: 'northeast', label: 'Northeast' },
    { value: 'southeast', label: 'Southeast' },
    { value: 'midwest', label: 'Midwest' },
    { value: 'southwest', label: 'Southwest' },
    { value: 'west', label: 'West' },
  ]
  
  const sizes = [
    { value: '', label: 'All Sizes' },
    { value: 'small', label: 'Small (1-5 providers)' },
    { value: 'medium', label: 'Medium (6-20 providers)' },
    { value: 'large', label: 'Large (21+ providers)' },
  ]
  
  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    minWidth: 160,
  }
  
  return (
    <div style={{
      padding: 16,
      backgroundColor: '#F0F9FF',
      borderRadius: 8,
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ margin: 0, color: '#0C4A6E', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🎯</span>
          Benchmark Cohort
        </h4>
        {practiceCount && (
          <span style={{ 
            padding: '4px 12px', 
            backgroundColor: '#DBEAFE', 
            borderRadius: 12,
            fontSize: 13,
            color: '#1E40AF',
            fontWeight: 500,
          }}>
            {practiceCount} practices in cohort
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select value={specialty} onChange={(e) => onSpecialtyChange(e.target.value)} style={selectStyle}>
          {specialties.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        
        <select value={region} onChange={(e) => onRegionChange(e.target.value)} style={selectStyle}>
          {regions.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        
        <select value={sizeCategory} onChange={(e) => onSizeChange(e.target.value)} style={selectStyle}>
          {sizes.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      
      <p style={{ margin: '12px 0 0', fontSize: 12, color: '#0369A1' }}>
        🔒 Benchmarks are calculated from de-identified, aggregate data. No individual practice can be identified.
      </p>
    </div>
  )
})

CohortSelector.propTypes = {
  specialty: PropTypes.string,
  region: PropTypes.string,
  sizeCategory: PropTypes.string,
  onSpecialtyChange: PropTypes.func.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  practiceCount: PropTypes.number,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const NormativeBenchmarking = memo(function NormativeBenchmarking({ 
  practiceMetrics,
  onClose 
}) {
  const { fetchNormativeBenchmarks, normativeBenchmarks, loading } = usePracticeData()
  
  const [specialty, setSpecialty] = useState('')
  const [region, setRegion] = useState('')
  const [sizeCategory, setSizeCategory] = useState('')
  
  // Fetch benchmarks when filters change
  useEffect(() => {
    fetchNormativeBenchmarks({ specialty, region, sizeCategory })
  }, [specialty, region, sizeCategory, fetchNormativeBenchmarks])
  
  // Mock practice metrics if not provided
  const metrics = practiceMetrics || {
    ncr: 0.923,
    dar: 38.5,
    denialRate: 0.082,
    arOver90: 125000,
  }
  
  // Mock normative benchmarks if not loaded
  const benchmarks = normativeBenchmarks || {
    ncr: { p25: 0.88, median: 0.92, p75: 0.95, p90: 0.97 },
    dar: { p25: 28, median: 35, p75: 45, p90: 55 },
    denialRate: { p25: 0.05, median: 0.08, p75: 0.12, p90: 0.18 },
    practiceCount: 247,
  }
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🌐</span>
              Normative Benchmarking
            </h2>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              Compare your practice to de-identified peer benchmarks
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontSize: 18,
              cursor: 'pointer',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {/* Cohort Selector */}
          <CohortSelector
            specialty={specialty}
            region={region}
            sizeCategory={sizeCategory}
            onSpecialtyChange={setSpecialty}
            onRegionChange={setRegion}
            onSizeChange={setSizeCategory}
            practiceCount={benchmarks.practiceCount}
          />
          
          {/* Data Source Badge */}
          <div style={{ 
            marginBottom: 24, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: 12,
            backgroundColor: '#D1FAE5',
            borderRadius: 8,
          }}>
            <DataIsolationBadge dataType="benchmarks" showDescription />
            <span style={{ fontSize: 13, color: '#065F46' }}>
              All benchmarks derived from {benchmarks.practiceCount || 0}+ practices. Minimum 5 practices required for statistical validity.
            </span>
          </div>
          
          {/* Benchmark Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <BenchmarkCard
              title="Net Collection Rate"
              icon="💰"
              practiceValue={metrics.ncr}
              benchmark={benchmarks.ncr}
              formatter={formatPercent}
              invertColors={false}
              description="Higher is better. Measures collection efficiency."
            />
            
            <BenchmarkCard
              title="Days in A/R"
              icon="📅"
              practiceValue={metrics.dar}
              benchmark={benchmarks.dar}
              formatter={formatDays}
              invertColors={true}
              description="Lower is better. Measures payment velocity."
            />
            
            <BenchmarkCard
              title="Denial Rate"
              icon="❌"
              practiceValue={metrics.denialRate}
              benchmark={benchmarks.denialRate}
              formatter={formatPercent}
              invertColors={true}
              description="Lower is better. Measures clean claim rate."
            />
          </div>
          
          {/* Privacy Notice */}
          <div style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#F0F9FF',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
            <div>
              <h4 style={{ margin: '0 0 8px', color: '#0C4A6E', fontSize: 14 }}>
                Data Privacy Assurance
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: '#0369A1' }}>
                These benchmarks are derived from de-identified, aggregate statistics only. 
                No individual practice's data is identifiable. Your practice's identified data 
                (patient names, claim IDs, etc.) never leaves your secure data boundary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

NormativeBenchmarking.propTypes = {
  practiceMetrics: PropTypes.shape({
    ncr: PropTypes.number,
    dar: PropTypes.number,
    denialRate: PropTypes.number,
    arOver90: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
}

export default NormativeBenchmarking
