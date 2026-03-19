import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

/**
 * Practice Data Context - Multi-tenant Data Isolation
 * 
 * This context manages the separation between:
 * 1. IDENTIFIED DATA - Practice-specific confidential data (claims, patients, etc.)
 * 2. NORMATIVE DATA - De-identified benchmarks from all practices
 * 
 * Key Security Principles:
 * - All identified data is scoped to the current practice_id
 * - Normative data contains NO practice-identifiable information
 * - Data access is audited for compliance
 * - Historical uploads are preserved for longitudinal analysis
 */

const PracticeDataContext = createContext(null)

// ============================================================================
// DATA ISOLATION BOUNDARIES
// ============================================================================

const DATA_BOUNDARIES = {
  // Data that NEVER leaves the practice boundary
  IDENTIFIED: {
    types: ['patients', 'claims', 'encounters', 'payments', 'ar_detail'],
    description: 'Practice-specific identified data - confidential',
    accessLevel: 'practice_only',
  },
  
  // Aggregated metrics for the practice (can be compared to normative)
  PRACTICE_METRICS: {
    types: ['metrics_snapshots', 'financial_summary', 'denial_summary', 'payer_mix'],
    description: 'Practice metrics - aggregated from identified data',
    accessLevel: 'practice_only',
  },
  
  // De-identified benchmarks from all practices
  NORMATIVE: {
    types: ['benchmarks', 'cpt_benchmarks', 'industry_trends'],
    description: 'De-identified normative database - all practices',
    accessLevel: 'all_practices',
  },
}

// ============================================================================
// PRACTICE DATA PROVIDER
// ============================================================================

export function PracticeDataProvider({ children, practiceId }) {
  // Current practice context
  const [currentPractice, setCurrentPractice] = useState({
    id: practiceId,
    name: null,
    specialty: null,
    region: null,
    sizeCategory: null,
    dataSharingConsent: true,
    subscriptionTier: 'basic',
  })
  
  // Data upload tracking
  const [uploads, setUploads] = useState([])
  const [activeUpload, setActiveUpload] = useState(null)
  
  // Metrics cache
  const [practiceMetrics, setPracticeMetrics] = useState(null)
  const [normativeBenchmarks, setNormativeBenchmarks] = useState(null)
  
  // Loading states
  const [loading, setLoading] = useState({
    practice: false,
    uploads: false,
    metrics: false,
    normative: false,
  })
  
  // Error state
  const [error, setError] = useState(null)

  // =========================================================================
  // PRACTICE PROFILE OPERATIONS
  // =========================================================================
  
  const fetchPracticeProfile = useCallback(async () => {
    if (!practiceId) return null
    
    setLoading(prev => ({ ...prev, practice: true }))
    setError(null)
    
    try {
      const response = await fetch(`/api/practices/${practiceId}`, {
        headers: { 'X-Practice-ID': practiceId },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch practice: ${response.status}`)
      }
      
      const data = await response.json()
      setCurrentPractice(data)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching practice profile:', err)
      return null
    } finally {
      setLoading(prev => ({ ...prev, practice: false }))
    }
  }, [practiceId])

  // =========================================================================
  // DATA UPLOAD OPERATIONS
  // =========================================================================
  
  const fetchUploadHistory = useCallback(async () => {
    if (!practiceId) return []
    
    setLoading(prev => ({ ...prev, uploads: true }))
    
    try {
      const response = await fetch(`/api/practices/${practiceId}/uploads`, {
        headers: { 'X-Practice-ID': practiceId },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch uploads: ${response.status}`)
      }
      
      const data = await response.json()
      setUploads(data.uploads || [])
      return data.uploads
    } catch (err) {
      console.error('Error fetching upload history:', err)
      return []
    } finally {
      setLoading(prev => ({ ...prev, uploads: false }))
    }
  }, [practiceId])

  const uploadPracticeData = useCallback(async (file, options = {}) => {
    if (!practiceId) {
      throw new Error('No practice ID - cannot upload data')
    }
    
    const { fileType = 'claims', periodStart, periodEnd } = options
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('practice_id', practiceId)
    formData.append('file_type', fileType)
    if (periodStart) formData.append('period_start', periodStart)
    if (periodEnd) formData.append('period_end', periodEnd)
    
    setActiveUpload({
      filename: file.name,
      fileType,
      status: 'uploading',
      progress: 0,
      startedAt: new Date().toISOString(),
    })
    
    try {
      const response = await fetch(`/api/practices/${practiceId}/uploads`, {
        method: 'POST',
        headers: { 'X-Practice-ID': practiceId },
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }
      
      const result = await response.json()
      
      setActiveUpload(prev => ({
        ...prev,
        status: 'completed',
        progress: 100,
        uploadId: result.upload_id,
      }))
      
      // Refresh upload history
      await fetchUploadHistory()
      
      return result
    } catch (err) {
      setActiveUpload(prev => ({
        ...prev,
        status: 'error',
        error: err.message,
      }))
      throw err
    }
  }, [practiceId, fetchUploadHistory])

  // =========================================================================
  // PRACTICE METRICS (IDENTIFIED - Practice-specific)
  // =========================================================================
  
  const fetchPracticeMetrics = useCallback(async (options = {}) => {
    if (!practiceId) return null
    
    const { periodStart, periodEnd, periodType = 'monthly' } = options
    
    setLoading(prev => ({ ...prev, metrics: true }))
    
    try {
      const params = new URLSearchParams({ period_type: periodType })
      if (periodStart) params.append('period_start', periodStart)
      if (periodEnd) params.append('period_end', periodEnd)
      
      const response = await fetch(
        `/api/practices/${practiceId}/metrics?${params}`,
        { headers: { 'X-Practice-ID': practiceId } }
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`)
      }
      
      const data = await response.json()
      setPracticeMetrics(data)
      return data
    } catch (err) {
      console.error('Error fetching practice metrics:', err)
      return null
    } finally {
      setLoading(prev => ({ ...prev, metrics: false }))
    }
  }, [practiceId])

  // =========================================================================
  // NORMATIVE BENCHMARKS (DE-IDENTIFIED - All practices)
  // =========================================================================
  
  const fetchNormativeBenchmarks = useCallback(async (options = {}) => {
    const { specialty, region, sizeCategory, periodType = 'monthly' } = options
    
    setLoading(prev => ({ ...prev, normative: true }))
    
    try {
      const params = new URLSearchParams({ period_type: periodType })
      if (specialty) params.append('specialty', specialty)
      if (region) params.append('region', region)
      if (sizeCategory) params.append('size_category', sizeCategory)
      
      const response = await fetch(`/api/normative/benchmarks?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch benchmarks: ${response.status}`)
      }
      
      const data = await response.json()
      setNormativeBenchmarks(data)
      return data
    } catch (err) {
      console.error('Error fetching normative benchmarks:', err)
      return null
    } finally {
      setLoading(prev => ({ ...prev, normative: false }))
    }
  }, [])

  const fetchCPTBenchmarks = useCallback(async (cptCode, options = {}) => {
    const { payerType, region } = options
    
    try {
      const params = new URLSearchParams()
      if (payerType) params.append('payer_type', payerType)
      if (region) params.append('region', region)
      
      const response = await fetch(`/api/normative/cpt/${cptCode}?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CPT benchmarks: ${response.status}`)
      }
      
      return await response.json()
    } catch (err) {
      console.error('Error fetching CPT benchmarks:', err)
      return null
    }
  }, [])

  // =========================================================================
  // COMPARISON HELPER - Compare practice to normative
  // =========================================================================
  
  const compareToNormative = useCallback((practiceValue, benchmarkData, metric) => {
    if (!practiceValue || !benchmarkData) return null
    
    const p25 = benchmarkData[`${metric}_p25`]
    const median = benchmarkData[`${metric}_median`]
    const p75 = benchmarkData[`${metric}_p75`]
    const p90 = benchmarkData[`${metric}_p90`]
    
    let percentile = 50
    let status = 'average'
    
    if (practiceValue <= p25) {
      percentile = 25
      status = metric.includes('denial') || metric.includes('dar') ? 'excellent' : 'below_average'
    } else if (practiceValue <= median) {
      percentile = 50
      status = 'average'
    } else if (practiceValue <= p75) {
      percentile = 75
      status = metric.includes('denial') || metric.includes('dar') ? 'below_average' : 'good'
    } else if (p90 && practiceValue <= p90) {
      percentile = 90
      status = metric.includes('denial') || metric.includes('dar') ? 'poor' : 'excellent'
    } else {
      percentile = 95
      status = metric.includes('denial') || metric.includes('dar') ? 'critical' : 'top_performer'
    }
    
    return {
      practiceValue,
      benchmarkMedian: median,
      percentile,
      status,
      variance: practiceValue - median,
      variancePercent: median ? ((practiceValue - median) / median) * 100 : 0,
    }
  }, [])

  // =========================================================================
  // DATA ACCESS AUDIT
  // =========================================================================
  
  const logDataAccess = useCallback(async (action, resourceType, resourceId = null, details = null) => {
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Practice-ID': practiceId,
        },
        body: JSON.stringify({
          practice_id: practiceId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
        }),
      })
    } catch (err) {
      // Audit logging should not break the app
      console.warn('Audit log failed:', err)
    }
  }, [practiceId])

  // =========================================================================
  // CONTEXT VALUE
  // =========================================================================
  
  const contextValue = useMemo(() => ({
    // Practice info
    practiceId,
    currentPractice,
    
    // Data boundaries (for UI decisions)
    dataBoundaries: DATA_BOUNDARIES,
    
    // Upload management
    uploads,
    activeUpload,
    uploadPracticeData,
    fetchUploadHistory,
    
    // Practice data (identified)
    practiceMetrics,
    fetchPracticeMetrics,
    
    // Normative data (de-identified)
    normativeBenchmarks,
    fetchNormativeBenchmarks,
    fetchCPTBenchmarks,
    
    // Comparison
    compareToNormative,
    
    // Practice profile
    fetchPracticeProfile,
    
    // Loading & error states
    loading,
    error,
    
    // Audit
    logDataAccess,
    
    // Consent status
    dataSharingConsent: currentPractice.dataSharingConsent,
  }), [
    practiceId,
    currentPractice,
    uploads,
    activeUpload,
    uploadPracticeData,
    fetchUploadHistory,
    practiceMetrics,
    fetchPracticeMetrics,
    normativeBenchmarks,
    fetchNormativeBenchmarks,
    fetchCPTBenchmarks,
    compareToNormative,
    fetchPracticeProfile,
    loading,
    error,
    logDataAccess,
  ])

  return (
    <PracticeDataContext.Provider value={contextValue}>
      {children}
    </PracticeDataContext.Provider>
  )
}

PracticeDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
  practiceId: PropTypes.string,
}

// ============================================================================
// HOOK
// ============================================================================

export function usePracticeData() {
  const context = useContext(PracticeDataContext)
  if (!context) {
    throw new Error('usePracticeData must be used within a PracticeDataProvider')
  }
  return context
}

// ============================================================================
// DATA ISOLATION INDICATOR COMPONENT
// ============================================================================

export function DataIsolationBadge({ dataType, showDescription = false }) {
  const getBoundary = () => {
    for (const [key, boundary] of Object.entries(DATA_BOUNDARIES)) {
      if (boundary.types.includes(dataType)) {
        return { key, ...boundary }
      }
    }
    return null
  }
  
  const boundary = getBoundary()
  
  if (!boundary) return null
  
  const colors = {
    IDENTIFIED: { bg: '#FEE2E2', text: '#991B1B', border: '#F87171' },
    PRACTICE_METRICS: { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },
    NORMATIVE: { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },
  }
  
  const icons = {
    IDENTIFIED: '🔒',
    PRACTICE_METRICS: '📊',
    NORMATIVE: '🌐',
  }
  
  const style = colors[boundary.key]
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 4,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
      title={boundary.description}
    >
      <span>{icons[boundary.key]}</span>
      <span>{boundary.accessLevel === 'practice_only' ? 'Practice Only' : 'Normative'}</span>
      {showDescription && (
        <span style={{ fontWeight: 400, marginLeft: 4 }}>
          - {boundary.description}
        </span>
      )}
    </span>
  )
}

DataIsolationBadge.propTypes = {
  dataType: PropTypes.string.isRequired,
  showDescription: PropTypes.bool,
}

export default PracticeDataContext
