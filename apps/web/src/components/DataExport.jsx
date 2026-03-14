import React, { useState, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// DATA EXPORT SUITE
// Comprehensive export capabilities: PDF, Excel, CSV, PowerPoint
// ============================================================================

// Safe string helper
const safeStr = (value, fallback = '') => value != null ? String(value) : fallback

const EXPORT_FORMATS = [
  { 
    id: 'pdf', 
    name: 'PDF Document', 
    icon: '📄', 
    extension: '.pdf',
    description: 'Professional print-ready reports',
    color: '#dc2626',
  },
  { 
    id: 'excel', 
    name: 'Excel Workbook', 
    icon: '📊', 
    extension: '.xlsx',
    description: 'Editable spreadsheets with formulas',
    color: '#059669',
  },
  { 
    id: 'csv', 
    name: 'CSV Data', 
    icon: '📋', 
    extension: '.csv',
    description: 'Raw data for analysis',
    color: '#6b7280',
  },
  { 
    id: 'pptx', 
    name: 'PowerPoint', 
    icon: '📽️', 
    extension: '.pptx',
    description: 'Presentation-ready slides',
    color: '#f59e0b',
  },
  { 
    id: 'json', 
    name: 'JSON Data', 
    icon: '🔧', 
    extension: '.json',
    description: 'API-compatible data format',
    color: '#7c3aed',
  },
]

const DATA_CATEGORIES = [
  {
    id: 'financial',
    name: 'Financial Metrics',
    icon: '💰',
    datasets: [
      { id: 'revenue_summary', name: 'Revenue Summary', rows: 12 },
      { id: 'collections_detail', name: 'Collections Detail', rows: 365 },
      { id: 'ar_aging', name: 'A/R Aging Report', rows: 847 },
      { id: 'payment_posting', name: 'Payment Posting Log', rows: 2341 },
      { id: 'adjustments', name: 'Adjustments Report', rows: 156 },
    ],
  },
  {
    id: 'operational',
    name: 'Operational Data',
    icon: '⚙️',
    datasets: [
      { id: 'appointments', name: 'Appointment History', rows: 4521 },
      { id: 'no_shows', name: 'No-Show Analysis', rows: 312 },
      { id: 'provider_productivity', name: 'Provider Productivity', rows: 84 },
      { id: 'patient_flow', name: 'Patient Flow Analysis', rows: 365 },
      { id: 'scheduling', name: 'Scheduling Report', rows: 1205 },
    ],
  },
  {
    id: 'clinical',
    name: 'Clinical Quality',
    icon: '⚕️',
    datasets: [
      { id: 'mips_measures', name: 'MIPS Measures', rows: 24 },
      { id: 'patient_outcomes', name: 'Patient Outcomes', rows: 1847 },
      { id: 'quality_scores', name: 'Quality Scores', rows: 36 },
      { id: 'hedis_measures', name: 'HEDIS Measures', rows: 18 },
    ],
  },
  {
    id: 'revenue_cycle',
    name: 'Revenue Cycle',
    icon: '🔄',
    datasets: [
      { id: 'claim_status', name: 'Claim Status Report', rows: 3241 },
      { id: 'denials', name: 'Denial Analysis', rows: 421 },
      { id: 'payer_mix', name: 'Payer Mix Analysis', rows: 12 },
      { id: 'procedure_volume', name: 'Procedure Volume', rows: 156 },
      { id: 'cpt_analysis', name: 'CPT Code Analysis', rows: 847 },
    ],
  },
  {
    id: 'benchmarking',
    name: 'Benchmarking',
    icon: '📊',
    datasets: [
      { id: 'peer_comparison', name: 'Peer Comparison', rows: 48 },
      { id: 'industry_benchmarks', name: 'Industry Benchmarks', rows: 96 },
      { id: 'trend_analysis', name: 'Trend Analysis', rows: 156 },
    ],
  },
]

// Date Range Presets
const DATE_PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7_days', label: 'Last 7 Days' },
  { id: 'last_30_days', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'this_quarter', label: 'This Quarter' },
  { id: 'last_quarter', label: 'Last Quarter' },
  { id: 'this_year', label: 'This Year' },
  { id: 'last_year', label: 'Last Year' },
  { id: 'custom', label: 'Custom Range' },
]

// Export Progress Component
const ExportProgress = memo(function ExportProgress({ progress = 0, status = 'preparing', fileName = '' }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      background: 'white',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      width: 320,
      zIndex: 1000,
    }}
    role="status"
    aria-live="polite"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {status === 'complete' ? (
          <span style={{ fontSize: 24 }}>✅</span>
        ) : (
          <div style={{
            width: 24,
            height: 24,
            border: '3px solid #e5e7eb',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        )}
        <div>
          <div style={{ fontWeight: 600, color: '#374151' }}>
            {status === 'complete' ? 'Export Complete' : 'Exporting...'}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{fileName}</div>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: status === 'complete' ? '#059669' : 'linear-gradient(90deg, #667eea, #764ba2)',
          transition: 'width 0.3s ease',
        }} />
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
})

ExportProgress.propTypes = {
  progress: PropTypes.number,
  status: PropTypes.oneOf(['preparing', 'exporting', 'complete', 'error']),
  fileName: PropTypes.string,
}

// Export Card for individual format
const ExportFormatCard = memo(function ExportFormatCard({ format, selected, onSelect }) {
  const formatColor = format?.color || '#6b7280'
  const formatId = format?.id || ''
  const formatName = safeStr(format?.name, 'Unknown Format')
  const formatExtension = safeStr(format?.extension, '')
  const formatDescription = safeStr(format?.description, '')
  
  const handleSelect = useCallback(() => {
    if (onSelect && formatId) {
      onSelect(formatId)
    }
  }, [onSelect, formatId])
  
  return (
    <div
      onClick={handleSelect}
      style={{
        padding: 20,
        background: selected ? `${formatColor}10` : 'white',
        border: `2px solid ${selected ? formatColor : '#e5e7eb'}`,
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}>{format?.icon || '📄'}</span>
        <div>
          <div style={{ fontWeight: 600, color: '#374151' }}>{formatName}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{formatExtension}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#6b7280' }}>{formatDescription}</div>
    </div>
  )
})

ExportFormatCard.propTypes = {
  format: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    extension: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
}

// Dataset Selector
const DatasetSelector = memo(function DatasetSelector({ categories = [], selectedDatasets = [], onToggle }) {
  const [expandedCategory, setExpandedCategory] = useState(categories[0]?.id)
  
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📁 Select Data to Export</h4>
      
      {categories.map(category => (
        <div key={category.id || Math.random()} style={{ marginBottom: 8 }}>
          <button
            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              background: expandedCategory === category.id ? '#f3f4f6' : 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{category.icon}</span>
              <span style={{ fontWeight: 600, color: '#374151' }}>{category.name}</span>
            </div>
            <span style={{ 
              fontSize: 12, 
              color: '#6b7280',
              transform: expandedCategory === category.id ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
            }}>
              ▼
            </span>
          </button>
          
          {expandedCategory === category.id && (
            <div style={{ padding: '8px 0 8px 44px' }}>
              {category.datasets.map(dataset => (
                <label
                  key={dataset.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: 6,
                    background: selectedDatasets.includes(dataset.id) ? '#eff6ff' : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDatasets.includes(dataset.id)}
                    onChange={() => onToggle(dataset.id)}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ flex: 1, fontSize: 14, color: '#374151' }}>{dataset.name}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{(dataset.rows || 0).toLocaleString()} rows</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
})

DatasetSelector.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    datasets: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      rows: PropTypes.number,
    })),
  })),
  selectedDatasets: PropTypes.arrayOf(PropTypes.string),
  onToggle: PropTypes.func,
}

// Main Data Export Component
export function DataExportSuite() {
  const [selectedFormat, setSelectedFormat] = useState('excel')
  const [selectedDatasets, setSelectedDatasets] = useState(['revenue_summary', 'collections_detail'])
  const [datePreset, setDatePreset] = useState('last_30_days')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeFormulas, setIncludeFormulas] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState('idle')
  
  const handleToggleDataset = useCallback((datasetId) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    )
  }, [])
  
  const handleExport = useCallback(async () => {
    setExporting(true)
    setExportProgress(0)
    setExportStatus('exporting')
    
    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setExportProgress(i)
    }
    
    setExportStatus('complete')
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setExporting(false)
      setExportProgress(0)
      setExportStatus('idle')
    }, 3000)
  }, [])
  
  const totalRows = selectedDatasets.reduce((sum, id) => {
    for (const cat of DATA_CATEGORIES) {
      const dataset = cat.datasets.find(d => d.id === id)
      if (dataset) return sum + dataset.rows
    }
    return sum
  }, 0)
  
  const format = EXPORT_FORMATS.find(f => f.id === selectedFormat)
  
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
          📤 Data Export Suite
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Export your data in multiple formats for analysis and reporting
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
        {/* Left Column - Format & Data Selection */}
        <div>
          {/* Format Selection */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>📁 Export Format</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {EXPORT_FORMATS.map(format => (
                <ExportFormatCard
                  key={format.id}
                  format={format}
                  selected={selectedFormat === format.id}
                  onSelect={setSelectedFormat}
                />
              ))}
            </div>
          </div>
          
          {/* Dataset Selection */}
          <DatasetSelector
            categories={DATA_CATEGORIES}
            selectedDatasets={selectedDatasets}
            onToggle={handleToggleDataset}
          />
        </div>
        
        {/* Right Column - Options & Export */}
        <div>
          {/* Date Range */}
          <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>📅 Date Range</h4>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 14,
              }}
            >
              {DATE_PRESETS.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.label}</option>
              ))}
            </select>
          </div>
          
          {/* Export Options */}
          <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>⚙️ Export Options</h4>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontSize: 14, color: '#374151' }}>Include Charts & Visualizations</span>
            </label>
            
            {selectedFormat === 'excel' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeFormulas}
                  onChange={(e) => setIncludeFormulas(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontSize: 14, color: '#374151' }}>Include Excel Formulas</span>
              </label>
            )}
          </div>
          
          {/* Export Summary */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 
            borderRadius: 16, 
            padding: 24, 
            color: 'white',
          }}>
            <h4 style={{ margin: '0 0 16px 0', opacity: 0.9 }}>Export Summary</h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ opacity: 0.8 }}>Format</span>
              <span style={{ fontWeight: 600 }}>{format?.name} ({format?.extension})</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ opacity: 0.8 }}>Datasets</span>
              <span style={{ fontWeight: 600 }}>{selectedDatasets.length} selected</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ opacity: 0.8 }}>Total Records</span>
              <span style={{ fontWeight: 600 }}>{totalRows.toLocaleString()} rows</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ opacity: 0.8 }}>Date Range</span>
              <span style={{ fontWeight: 600 }}>
                {DATE_PRESETS.find(p => p.id === datePreset)?.label}
              </span>
            </div>
            
            <button
              onClick={handleExport}
              disabled={selectedDatasets.length === 0}
              style={{
                width: '100%',
                padding: 14,
                background: selectedDatasets.length === 0 ? '#6b7280' : 'white',
                color: selectedDatasets.length === 0 ? 'white' : '#1e3c72',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: selectedDatasets.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedDatasets.length > 0) e.target.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              📤 Export Data
            </button>
          </div>
        </div>
      </div>
      
      {/* Export Progress */}
      {exporting && (
        <ExportProgress
          progress={exportProgress}
          status={exportStatus}
          fileName={`practice_data_export${format?.extension}`}
        />
      )}
    </div>
  )
}

export default { DataExportSuite }
