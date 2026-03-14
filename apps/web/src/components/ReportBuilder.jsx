import React, { useState, useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// REPORT BUILDER - Drag-and-drop report creation with export
// ============================================================================

// Safe string helper
const safeStr = (val, fallback = '') => val != null ? String(val) : fallback

const REPORT_WIDGETS = [
  { id: 'revenue_summary', name: 'Revenue Summary', icon: '💰', category: 'Financial', size: 'medium' },
  { id: 'ncr_gauge', name: 'NCR Gauge', icon: '📊', category: 'Financial', size: 'small' },
  { id: 'dar_trend', name: 'Days in A/R Trend', icon: '📈', category: 'Financial', size: 'large' },
  { id: 'ebitda_chart', name: 'EBITDA Analysis', icon: '📉', category: 'Financial', size: 'large' },
  { id: 'denial_breakdown', name: 'Denial Breakdown', icon: '❌', category: 'Revenue Cycle', size: 'medium' },
  { id: 'payer_mix', name: 'Payer Mix', icon: '🏥', category: 'Revenue Cycle', size: 'medium' },
  { id: 'collection_funnel', name: 'Collection Funnel', icon: '🎯', category: 'Revenue Cycle', size: 'large' },
  { id: 'provider_productivity', name: 'Provider Productivity', icon: '👨‍⚕️', category: 'Operational', size: 'large' },
  { id: 'patient_volume', name: 'Patient Volume', icon: '👥', category: 'Operational', size: 'medium' },
  { id: 'appointment_analysis', name: 'Appointment Analysis', icon: '📅', category: 'Operational', size: 'medium' },
  { id: 'mips_scorecard', name: 'MIPS Scorecard', icon: '⭐', category: 'Quality', size: 'large' },
  { id: 'patient_satisfaction', name: 'Patient Satisfaction', icon: '😊', category: 'Quality', size: 'medium' },
  { id: 'peer_comparison', name: 'Peer Comparison', icon: '📊', category: 'Benchmarking', size: 'large' },
  { id: 'trend_analysis', name: 'Trend Analysis', icon: '📈', category: 'Analytics', size: 'large' },
  { id: 'kpi_table', name: 'KPI Summary Table', icon: '📋', category: 'Summary', size: 'large' },
  { id: 'exec_summary', name: 'Executive Summary', icon: '📝', category: 'Summary', size: 'medium' },
]

const REPORT_TEMPLATES = [
  {
    id: 'monthly_financial',
    name: 'Monthly Financial Report',
    description: 'Comprehensive monthly financial performance summary',
    widgets: ['exec_summary', 'revenue_summary', 'ncr_gauge', 'ebitda_chart', 'payer_mix', 'dar_trend'],
    schedule: 'monthly',
  },
  {
    id: 'exec_dashboard',
    name: 'Executive Dashboard',
    description: 'High-level KPIs for leadership review',
    widgets: ['exec_summary', 'revenue_summary', 'ncr_gauge', 'patient_volume', 'mips_scorecard'],
    schedule: 'weekly',
  },
  {
    id: 'revenue_cycle',
    name: 'Revenue Cycle Analysis',
    description: 'Detailed revenue cycle performance metrics',
    widgets: ['collection_funnel', 'denial_breakdown', 'payer_mix', 'dar_trend'],
    schedule: 'weekly',
  },
  {
    id: 'quality_report',
    name: 'Quality & Compliance Report',
    description: 'MIPS scores and patient satisfaction metrics',
    widgets: ['mips_scorecard', 'patient_satisfaction', 'peer_comparison'],
    schedule: 'quarterly',
  },
  {
    id: 'provider_performance',
    name: 'Provider Performance Report',
    description: 'Individual provider productivity and metrics',
    widgets: ['provider_productivity', 'patient_volume', 'appointment_analysis', 'revenue_summary'],
    schedule: 'monthly',
  },
]

// Widget Component for report canvas
function ReportWidget({ widget, onRemove, onResize }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const sizeStyles = {
    small: { gridColumn: 'span 1', minHeight: 120 },
    medium: { gridColumn: 'span 2', minHeight: 160 },
    large: { gridColumn: 'span 3', minHeight: 200 },
  }
  
  return (
    <div
      style={{
        ...sizeStyles[widget.size],
        background: 'white',
        borderRadius: 12,
        padding: 16,
        border: isHovered ? '2px solid #667eea' : '2px solid #e5e7eb',
        cursor: 'move',
        position: 'relative',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
    >
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 4,
        }}>
          <button
            onClick={() => onRemove(widget.id)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              border: 'none',
              background: '#fef2f2',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      <div style={{ fontSize: 24, marginBottom: 8 }}>{widget.icon}</div>
      <div style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>{widget.name}</div>
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{widget.category}</div>
      
      {/* Placeholder content */}
      <div style={{
        marginTop: 12,
        height: widget.size === 'small' ? 40 : widget.size === 'medium' ? 60 : 100,
        background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 8,
      }} />
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// Draggable Widget Picker
function WidgetPicker({ widgets, onAddWidget }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = ['all', ...new Set(widgets.map(w => w.category))]
  
  const filteredWidgets = selectedCategory === 'all' 
    ? widgets 
    : widgets.filter(w => w.category === selectedCategory)
  
  return (
    <div style={{
      background: '#f9fafb',
      borderRadius: 12,
      padding: 16,
      height: '100%',
      overflowY: 'auto',
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>📦 Available Widgets</h4>
      
      {/* Category Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '4px 10px',
              background: selectedCategory === cat ? '#667eea' : 'white',
              color: selectedCategory === cat ? 'white' : '#4b5563',
              border: selectedCategory === cat ? 'none' : '1px solid #e5e7eb',
              borderRadius: 16,
              fontSize: 11,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Widget List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredWidgets.map(widget => (
          <div
            key={widget.id}
            onClick={() => onAddWidget(widget)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 10,
              background: 'white',
              borderRadius: 8,
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span style={{ fontSize: 20 }}>{widget.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>{widget.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{widget.category} · {widget.size}</div>
            </div>
            <span style={{ color: '#667eea', fontSize: 18 }}>+</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Template Selection
function TemplateSelector({ templates, onSelectTemplate }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: 16,
      marginBottom: 24,
    }}>
      {templates.map(template => (
        <div
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          style={{
            background: 'white',
            borderRadius: 12,
            padding: 20,
            border: '2px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#667eea'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#1e3c72' }}>{template.name}</h4>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>
            {template.description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ 
              fontSize: 11, 
              background: '#f3f4f6', 
              padding: '4px 8px', 
              borderRadius: 4,
              color: '#6b7280',
            }}>
              {template.widgets.length} widgets
            </span>
            <span style={{ 
              fontSize: 11, 
              background: '#eff6ff', 
              padding: '4px 8px', 
              borderRadius: 4,
              color: '#3b82f6',
              textTransform: 'capitalize',
            }}>
              {template.schedule}
            </span>
          </div>
        </div>
      ))}
      
      {/* Blank Template */}
      <div
        onClick={() => onSelectTemplate({ id: 'blank', name: 'Blank Report', widgets: [] })}
        style={{
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          borderRadius: 12,
          padding: 20,
          border: '2px dashed #d1d5db',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>➕</div>
        <h4 style={{ margin: '0 0 4px 0', color: '#374151' }}>Start from Scratch</h4>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>Create a custom report</p>
      </div>
    </div>
  )
}

// Report Export Options
function ExportOptions({ onExport }) {
  const exportFormats = [
    { id: 'pdf', name: 'PDF Report', icon: '📄', description: 'Print-ready document' },
    { id: 'excel', name: 'Excel Workbook', icon: '📊', description: 'Editable spreadsheet' },
    { id: 'pptx', name: 'PowerPoint', icon: '📽️', description: 'Presentation slides' },
    { id: 'csv', name: 'CSV Data', icon: '📋', description: 'Raw data export' },
  ]
  
  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: 20,
      border: '1px solid #e5e7eb',
    }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📤 Export Report</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {exportFormats.map(format => (
          <button
            key={format.id}
            onClick={() => onExport(format.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#eff6ff'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <span style={{ fontSize: 24 }}>{format.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{format.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{format.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Schedule Report Dialog
function ScheduleDialog({ onSchedule, onClose }) {
  const [frequency, setFrequency] = useState('weekly')
  const [recipients, setRecipients] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('monday')
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 480,
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1e3c72' }}>📅 Schedule Report</h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
            Frequency
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['daily', 'weekly', 'monthly', 'quarterly'].map(freq => (
              <button
                key={freq}
                onClick={() => setFrequency(freq)}
                style={{
                  padding: '8px 16px',
                  background: frequency === freq ? '#667eea' : 'white',
                  color: frequency === freq ? 'white' : '#4b5563',
                  border: frequency === freq ? 'none' : '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>
        
        {frequency === 'weekly' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
              Day of Week
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 14,
              }}
            >
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                <option key={day} value={day} style={{ textTransform: 'capitalize' }}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
            Recipients (comma-separated emails)
          </label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="cfo@practice.com, coo@practice.com"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 14,
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#e5e7eb',
              color: '#4b5563',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSchedule({ frequency, recipients: recipients.split(',').map(e => e.trim()), dayOfWeek })}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Report Builder Dashboard
export function ReportBuilder() {
  const [step, setStep] = useState('template') // 'template' | 'build' | 'preview'
  const [reportName, setReportName] = useState('Untitled Report')
  const [selectedWidgets, setSelectedWidgets] = useState([])
  const [showSchedule, setShowSchedule] = useState(false)
  
  const handleSelectTemplate = useCallback((template) => {
    setReportName(template.name)
    const widgets = template.widgets.map(id => 
      REPORT_WIDGETS.find(w => w.id === id)
    ).filter(Boolean)
    setSelectedWidgets(widgets)
    setStep('build')
  }, [])
  
  const handleAddWidget = useCallback((widget) => {
    setSelectedWidgets(prev => [...prev, { ...widget, instanceId: `${widget.id}_${Date.now()}` }])
  }, [])
  
  const handleRemoveWidget = useCallback((instanceId) => {
    setSelectedWidgets(prev => prev.filter(w => w.instanceId !== instanceId))
  }, [])
  
  const handleExport = useCallback((format) => {
    // In production, this would generate the actual export
    console.log(`Exporting report as ${format}`)
    alert(`Report "${reportName}" exported as ${format.toUpperCase()}`)
  }, [reportName])
  
  const handleSchedule = useCallback((scheduleConfig) => {
    console.log('Scheduling report:', scheduleConfig)
    setShowSchedule(false)
    alert(`Report scheduled ${scheduleConfig.frequency} to ${scheduleConfig.recipients.join(', ')}`)
  }, [])
  
  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
            📋 Report Builder
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Create custom reports with drag-and-drop widgets
          </p>
        </div>
        
        {step === 'build' && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setStep('template')}
              style={{
                padding: '10px 20px',
                background: '#e5e7eb',
                color: '#4b5563',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              ← Back to Templates
            </button>
            <button
              onClick={() => setShowSchedule(true)}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📅 Schedule
            </button>
            <button
              onClick={() => setStep('preview')}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Preview & Export
            </button>
          </div>
        )}
      </div>
      
      {/* Step Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        {['template', 'build', 'preview'].map((s, i) => (
          <React.Fragment key={s}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: step === s || ['template', 'build', 'preview'].indexOf(step) > i ? 1 : 0.4,
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: step === s ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb',
                color: step === s ? 'white' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 14,
              }}>
                {i + 1}
              </div>
              <span style={{ fontWeight: 600, color: step === s ? '#1e3c72' : '#6b7280', textTransform: 'capitalize' }}>
                {s === 'template' ? 'Choose Template' : s === 'build' ? 'Add Widgets' : 'Export'}
              </span>
            </div>
            {i < 2 && (
              <div style={{ 
                flex: 1, 
                height: 2, 
                background: ['template', 'build', 'preview'].indexOf(step) > i ? '#667eea' : '#e5e7eb',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Content */}
      {step === 'template' && (
        <TemplateSelector templates={REPORT_TEMPLATES} onSelectTemplate={handleSelectTemplate} />
      )}
      
      {step === 'build' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
          {/* Widget Picker */}
          <WidgetPicker widgets={REPORT_WIDGETS} onAddWidget={handleAddWidget} />
          
          {/* Report Canvas */}
          <div>
            {/* Report Name */}
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                fontSize: 18,
                fontWeight: 600,
                border: '2px solid #e5e7eb',
                borderRadius: 10,
                marginBottom: 20,
              }}
              placeholder="Report Name"
            />
            
            {/* Canvas */}
            <div style={{
              background: '#f9fafb',
              borderRadius: 12,
              padding: 20,
              minHeight: 400,
              border: '2px dashed #d1d5db',
            }}>
              {selectedWidgets.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                }}>
                  {selectedWidgets.map(widget => (
                    <ReportWidget
                      key={widget.instanceId}
                      widget={widget}
                      onRemove={() => handleRemoveWidget(widget.instanceId)}
                    />
                  ))}
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 300,
                  color: '#6b7280',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>No widgets added yet</div>
                  <div style={{ fontSize: 14 }}>Click widgets from the left panel to add them</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {step === 'preview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Preview */}
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #e5e7eb',
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e3c72' }}>📄 Report Preview</h3>
            
            <div style={{
              background: '#f9fafb',
              borderRadius: 8,
              padding: 20,
              minHeight: 500,
            }}>
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72' }}>{reportName}</h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
                  Generated on {new Date().toLocaleDateString()} • {selectedWidgets.length} widgets
                </p>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}>
                {selectedWidgets.map(widget => (
                  <div
                    key={widget.instanceId}
                    style={{
                      gridColumn: widget.size === 'small' ? 'span 1' : widget.size === 'medium' ? 'span 2' : 'span 3',
                      background: 'white',
                      borderRadius: 8,
                      padding: 16,
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span>{widget.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{widget.name}</span>
                    </div>
                    <div style={{
                      height: widget.size === 'small' ? 60 : widget.size === 'medium' ? 100 : 140,
                      background: '#f3f4f6',
                      borderRadius: 6,
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Export Options */}
          <div>
            <ExportOptions onExport={handleExport} />
            
            <button
              onClick={() => setStep('build')}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '12px 20px',
                background: '#e5e7eb',
                color: '#4b5563',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              ← Back to Editor
            </button>
          </div>
        </div>
      )}
      
      {/* Schedule Dialog */}
      {showSchedule && (
        <ScheduleDialog onSchedule={handleSchedule} onClose={() => setShowSchedule(false)} />
      )}
    </div>
  )
}

// PropTypes for internal components
ReportWidget.propTypes = {
  widget: PropTypes.shape({
    instanceId: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    category: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onResize: PropTypes.func,
}

WidgetPicker.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      category: PropTypes.string,
    })
  ).isRequired,
  onAddWidget: PropTypes.func.isRequired,
}

TemplateSelector.propTypes = {
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      widgets: PropTypes.arrayOf(PropTypes.string),
      schedule: PropTypes.string,
    })
  ).isRequired,
  onSelectTemplate: PropTypes.func.isRequired,
}

ExportOptions.propTypes = {
  onExport: PropTypes.func.isRequired,
}

ScheduleDialog.propTypes = {
  onSchedule: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default { ReportBuilder }
