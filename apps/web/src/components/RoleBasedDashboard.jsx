import React, { useState, useMemo, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// ROLE-BASED DASHBOARDS
// Customized views for CFO, CMO, COO, and Practice Administrator
// ============================================================================

// Helper for safe number formatting
const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value)
  return isNaN(num) ? fallback : num
}

// Helper for safe string
const safeStr = (value, fallback = '') => {
  return value != null ? String(value) : fallback
}

// Default widget configurations for each role
const DEFAULT_WIDGETS = {
  CFO: [
    { id: 'revenue', name: 'Revenue Overview', enabled: true },
    { id: 'cash', name: 'Cash Position', enabled: true },
    { id: 'expense', name: 'Expense Ratio', enabled: true },
    { id: 'sources', name: 'Revenue Sources', enabled: true },
    { id: 'ar_aging', name: 'A/R Aging', enabled: false },
    { id: 'payer_mix', name: 'Payer Mix', enabled: false },
  ],
  CMO: [
    { id: 'mips', name: 'MIPS Score', enabled: true },
    { id: 'quality', name: 'Quality Metrics', enabled: true },
    { id: 'satisfaction', name: 'Patient Satisfaction', enabled: true },
    { id: 'clinical', name: 'Clinical Outcomes', enabled: true },
    { id: 'complications', name: 'Complications Rate', enabled: false },
    { id: 'screenings', name: 'Preventive Screenings', enabled: false },
  ],
  COO: [
    { id: 'productivity', name: 'Provider Productivity', enabled: true },
    { id: 'utilization', name: 'Resource Utilization', enabled: true },
    { id: 'efficiency', name: 'Efficiency Metrics', enabled: true },
    { id: 'waittime', name: 'Wait Times', enabled: true },
    { id: 'noshow', name: 'No-Show Rates', enabled: false },
    { id: 'throughput', name: 'Patient Throughput', enabled: false },
  ],
  ADMIN: [
    { id: 'tasks', name: 'Task Management', enabled: true },
    { id: 'schedule', name: 'Schedule Overview', enabled: true },
    { id: 'staff', name: 'Staff Management', enabled: true },
    { id: 'communications', name: 'Communications', enabled: true },
    { id: 'compliance', name: 'Compliance Tasks', enabled: false },
    { id: 'inventory', name: 'Inventory Alerts', enabled: false },
  ],
}

// Customization Modal Component
const CustomizeDashboardModal = memo(function CustomizeDashboardModal({ role, widgets, onSave, onClose }) {
  const [localWidgets, setLocalWidgets] = useState(widgets || [])
  const roleInfo = ROLES[role] || ROLES.CFO
  
  const handleToggle = (widgetId) => {
    setLocalWidgets(prev => 
      prev.map(w => w.id === widgetId ? { ...w, enabled: !w.enabled } : w)
    )
  }
  
  const handleMoveUp = (index) => {
    if (index === 0) return
    setLocalWidgets(prev => {
      const newWidgets = [...prev]
      const temp = newWidgets[index]
      newWidgets[index] = newWidgets[index - 1]
      newWidgets[index - 1] = temp
      return newWidgets
    })
  }
  
  const handleMoveDown = (index) => {
    if (index === localWidgets.length - 1) return
    setLocalWidgets(prev => {
      const newWidgets = [...prev]
      const temp = newWidgets[index]
      newWidgets[index] = newWidgets[index + 1]
      newWidgets[index + 1] = temp
      return newWidgets
    })
  }
  
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
        borderRadius: 20,
        width: '100%',
        maxWidth: 520,
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${roleInfo.color} 0%, ${roleInfo.color}dd 100%)`,
          padding: 24,
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>{roleInfo.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 20 }}>Customize Dashboard</h3>
              <div style={{ opacity: 0.9, fontSize: 14 }}>{roleInfo.title}</div>
            </div>
          </div>
        </div>
        
        {/* Widget List */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 16px 0' }}>
            Toggle widgets on/off and drag to reorder your dashboard view
          </p>
          
          {localWidgets.map((widget, index) => (
            <div
              key={widget.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                background: widget.enabled ? '#f0fdf4' : '#f9fafb',
                border: `2px solid ${widget.enabled ? roleInfo.color + '40' : '#e5e7eb'}`,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              {/* Reorder Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  style={{
                    width: 24,
                    height: 20,
                    border: 'none',
                    background: index === 0 ? '#e5e7eb' : '#dbeafe',
                    color: index === 0 ? '#9ca3af' : '#3b82f6',
                    borderRadius: 4,
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    fontSize: 10,
                  }}
                >▲</button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === localWidgets.length - 1}
                  style={{
                    width: 24,
                    height: 20,
                    border: 'none',
                    background: index === localWidgets.length - 1 ? '#e5e7eb' : '#dbeafe',
                    color: index === localWidgets.length - 1 ? '#9ca3af' : '#3b82f6',
                    borderRadius: 4,
                    cursor: index === localWidgets.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: 10,
                  }}
                >▼</button>
              </div>
              
              {/* Widget Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#1f2937' }}>{widget.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {widget.enabled ? '✓ Visible on dashboard' : 'Hidden from dashboard'}
                </div>
              </div>
              
              {/* Toggle */}
              <button
                onClick={() => handleToggle(widget.id)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: 'none',
                  background: widget.enabled ? roleInfo.color : '#d1d5db',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: 2,
                  left: widget.enabled ? 24 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          padding: 16,
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#f3f4f6',
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
            onClick={() => { onSave(localWidgets); onClose() }}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${roleInfo.color} 0%, ${roleInfo.color}dd 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
})

CustomizeDashboardModal.propTypes = {
  role: PropTypes.oneOf(['CFO', 'CMO', 'COO', 'ADMIN']),
  widgets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
  })),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

const ROLES = {
  CFO: {
    id: 'cfo',
    title: 'Chief Financial Officer',
    icon: '💰',
    color: '#059669',
    focus: 'Financial Performance',
    description: 'Revenue, profitability, and financial health metrics',
  },
  CMO: {
    id: 'cmo',
    title: 'Chief Medical Officer',
    icon: '⚕️',
    color: '#0891b2',
    focus: 'Clinical Quality',
    description: 'Quality metrics, MIPS scores, and patient outcomes',
  },
  COO: {
    id: 'coo',
    title: 'Chief Operating Officer',
    icon: '⚙️',
    color: '#7c3aed',
    focus: 'Operations',
    description: 'Efficiency, productivity, and operational excellence',
  },
  ADMIN: {
    id: 'admin',
    title: 'Practice Administrator',
    icon: '📋',
    color: '#dc2626',
    focus: 'Day-to-Day Management',
    description: 'Staff, scheduling, and practice management',
  },
}

// CFO Dashboard
const CFODashboard = memo(function CFODashboard({ data }) {
  const metrics = data || {
    totalRevenue: 2847500,
    revenueGrowth: 8.3,
    netCollectionRate: 96.2,
    daysInAR: 28,
    ebitda: 712000,
    ebitdaMargin: 25.0,
    cashOnHand: 425000,
    accountsReceivable: 890000,
    operatingExpenses: 2135500,
    payrollRatio: 42,
    denialRate: 5.8,
    patientServiceRevenue: 2650000,
    otherRevenue: 197500,
  }
  
  return (
    <div style={{ padding: 24 }}>
      {/* Revenue Overview */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        borderRadius: 20,
        padding: 28,
        color: 'white',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 16, opacity: 0.9 }}>Total Revenue (YTD)</h3>
            <div style={{ fontSize: 42, fontWeight: 'bold' }}>${(metrics.totalRevenue / 1000000).toFixed(2)}M</div>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '4px 12px', 
              borderRadius: 20,
              fontSize: 14,
            }}>
              {metrics.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.revenueGrowth)}% YoY
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { label: 'NCR', value: `${metrics.netCollectionRate}%`, target: '≥95%' },
              { label: 'Days in A/R', value: metrics.daysInAR, target: '≤30' },
              { label: 'EBITDA', value: `$${(metrics.ebitda / 1000).toFixed(0)}K`, target: null },
              { label: 'EBITDA Margin', value: `${metrics.ebitdaMargin}%`, target: '≥25%' },
            ].map(m => (
              <div key={m.label} style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: 14, 
                borderRadius: 10,
                textAlign: 'center',
                minWidth: 100,
              }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 'bold' }}>{m.value}</div>
                {m.target && <div style={{ fontSize: 10, opacity: 0.7 }}>Target: {m.target}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Financial Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Cash Position */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>💵 Cash Position</h4>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#059669', marginBottom: 16 }}>
            ${(metrics.cashOnHand / 1000).toFixed(0)}K
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
            <span>A/R Outstanding</span>
            <span style={{ fontWeight: 600 }}>${(metrics.accountsReceivable / 1000).toFixed(0)}K</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
            <span>Operating Runway</span>
            <span style={{ fontWeight: 600 }}>~{Math.round(metrics.cashOnHand / (metrics.operatingExpenses / 12))} months</span>
          </div>
        </div>
        
        {/* Expense Breakdown */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📊 Expense Ratio</h4>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>Payroll</span>
              <span style={{ fontWeight: 600, color: '#374151' }}>{metrics.payrollRatio}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4 }}>
              <div style={{ width: `${metrics.payrollRatio}%`, height: '100%', background: '#059669', borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>Supplies & Equipment</span>
              <span style={{ fontWeight: 600, color: '#374151' }}>18%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4 }}>
              <div style={{ width: '18%', height: '100%', background: '#0891b2', borderRadius: 4 }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>Overhead</span>
              <span style={{ fontWeight: 600, color: '#374151' }}>15%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4 }}>
              <div style={{ width: '15%', height: '100%', background: '#f59e0b', borderRadius: 4 }} />
            </div>
          </div>
        </div>
        
        {/* Revenue Sources */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>🏥 Revenue Sources</h4>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#6b7280' }}>Patient Services</span>
              <span style={{ fontWeight: 600 }}>${(metrics.patientServiceRevenue / 1000000).toFixed(2)}M</span>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#6b7280' }}>Optical Revenue</span>
              <span style={{ fontWeight: 600 }}>${(metrics.otherRevenue / 1000).toFixed(0)}K</span>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#6b7280' }}>Ancillary Services</span>
              <span style={{ fontWeight: 600 }}>$42K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

CFODashboard.propTypes = {
  data: PropTypes.object,
}

// CMO Dashboard
const CMODashboard = memo(function CMODashboard({ data }) {
  const metrics = data || {
    mipsScore: 87,
    qualityScore: 92,
    patientSatisfaction: 4.4,
    clinicalOutcomes: 94,
    readmissionRate: 1.2,
    complicationRate: 0.8,
    preventiveScreening: 88,
    diabeticExamRate: 72,
    glaucomaFollowUp: 85,
  }
  
  return (
    <div style={{ padding: 24 }}>
      {/* Quality Overview */}
      <div style={{
        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        borderRadius: 20,
        padding: 28,
        color: 'white',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 16, opacity: 0.9 }}>MIPS Composite Score</h3>
            <div style={{ fontSize: 64, fontWeight: 'bold' }}>{metrics.mipsScore}</div>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '4px 12px', 
              borderRadius: 20,
              fontSize: 14,
            }}>
              {metrics.mipsScore >= 89 ? '🏆 Exceptional' : metrics.mipsScore >= 75 ? '✅ Good' : '⚠️ Needs Work'}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>{metrics.patientSatisfaction}</div>
              <div style={{ fontSize: 20 }}>{'★'.repeat(Math.round(metrics.patientSatisfaction))}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Patient Satisfaction</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>{metrics.clinicalOutcomes}%</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Clinical Outcomes</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quality Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Ophthalmology Measures */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>👁️ Ophthalmology Quality</h4>
          {[
            { label: 'Diabetic Eye Exam Rate', value: metrics.diabeticExamRate, target: 60 },
            { label: 'Glaucoma Follow-up', value: metrics.glaucomaFollowUp, target: 80 },
            { label: 'AMD Counseling', value: 91, target: 80 },
          ].map(m => (
            <div key={m.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{m.label}</span>
                <span style={{ fontWeight: 600, color: m.value >= m.target ? '#059669' : '#f59e0b' }}>
                  {m.value}% (Target: {m.target}%)
                </span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4 }}>
                <div style={{ 
                  width: `${m.value}%`, 
                  height: '100%', 
                  background: m.value >= m.target ? '#059669' : '#f59e0b', 
                  borderRadius: 4 
                }} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Safety Metrics */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>🛡️ Patient Safety</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#059669' }}>{metrics.readmissionRate}%</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Readmission Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#059669' }}>{metrics.complicationRate}%</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Complication Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: '#eff6ff', borderRadius: 12, gridColumn: 'span 2' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#0891b2' }}>{metrics.preventiveScreening}%</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Preventive Screening Compliance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

CMODashboard.propTypes = {
  data: PropTypes.object,
}

// COO Dashboard
const COODashboard = memo(function COODashboard({ data }) {
  const metrics = data || {
    appointmentsToday: 127,
    showRate: 92,
    avgWaitTime: 12,
    providerUtilization: 85,
    roomTurnover: 8,
    staffProductivity: 94,
    patientThroughput: 4.2,
    scheduleEfficiency: 88,
  }
  
  return (
    <div style={{ padding: 24 }}>
      {/* Operations Overview */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
        borderRadius: 20,
        padding: 28,
        color: 'white',
        marginBottom: 24,
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 18, opacity: 0.9 }}>Today's Operations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {[
            { label: 'Appointments', value: metrics.appointmentsToday, icon: '📅' },
            { label: 'Show Rate', value: `${metrics.showRate}%`, icon: '✅' },
            { label: 'Avg Wait', value: `${metrics.avgWaitTime} min`, icon: '⏱️' },
            { label: 'Provider Util.', value: `${metrics.providerUtilization}%`, icon: '👨‍⚕️' },
          ].map(m => (
            <div key={m.label} style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: 16, 
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24 }}>{m.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>{m.value}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Operational Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Efficiency Metrics */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>⚡ Efficiency Metrics</h4>
          {[
            { label: 'Room Turnover', value: `${metrics.roomTurnover} min`, progress: 80, color: '#059669' },
            { label: 'Staff Productivity', value: `${metrics.staffProductivity}%`, progress: metrics.staffProductivity, color: '#0891b2' },
            { label: 'Schedule Efficiency', value: `${metrics.scheduleEfficiency}%`, progress: metrics.scheduleEfficiency, color: '#7c3aed' },
          ].map(m => (
            <div key={m.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: '#6b7280' }}>{m.label}</span>
                <span style={{ fontWeight: 600, color: '#374151' }}>{m.value}</span>
              </div>
              <div style={{ width: '100%', height: 10, background: '#e5e7eb', borderRadius: 5 }}>
                <div style={{ 
                  width: `${m.progress}%`, 
                  height: '100%', 
                  background: m.color, 
                  borderRadius: 5,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Throughput */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📊 Patient Throughput</h4>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 56, fontWeight: 'bold', color: '#7c3aed' }}>{metrics.patientThroughput}</div>
            <div style={{ fontSize: 14, color: '#6b7280' }}>Patients per Provider per Hour</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#059669' }}>+12%</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>vs Last Month</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#0891b2' }}>+8%</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>vs Benchmark</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

COODashboard.propTypes = {
  data: PropTypes.object,
}

// Practice Administrator Dashboard
const AdminDashboard = memo(function AdminDashboard({ data }) {
  const metrics = data || {
    staffCount: 24,
    openPositions: 2,
    scheduledToday: 127,
    noShows: 8,
    callVolume: 245,
    avgHoldTime: '2:15',
    pendingAuth: 18,
    pendingRefunds: 12,
  }
  
  return (
    <div style={{ padding: 24 }}>
      {/* Admin Overview */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
        borderRadius: 20,
        padding: 28,
        color: 'white',
        marginBottom: 24,
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 18, opacity: 0.9 }}>Practice Operations Today</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { label: 'Scheduled', value: metrics.scheduledToday, icon: '📅' },
            { label: 'No-Shows', value: metrics.noShows, icon: '❌' },
            { label: 'Call Volume', value: metrics.callVolume, icon: '📞' },
            { label: 'Avg Hold', value: metrics.avgHoldTime, icon: '⏱️' },
            { label: 'Pending Auth', value: metrics.pendingAuth, icon: '📋' },
            { label: 'Pending Refunds', value: metrics.pendingRefunds, icon: '💳' },
          ].map(m => (
            <div key={m.label} style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: 12, 
              borderRadius: 10,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 20 }}>{m.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 'bold', marginTop: 2 }}>{m.value}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Staff & Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Staff Summary */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>👥 Staff Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#374151' }}>{metrics.staffCount}</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Total Staff</div>
            </div>
            <div style={{ 
              background: metrics.openPositions > 0 ? '#fef2f2' : '#f0fdf4', 
              padding: '8px 16px', 
              borderRadius: 8,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: metrics.openPositions > 0 ? '#dc2626' : '#059669' }}>
                {metrics.openPositions}
              </div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Open Positions</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { role: 'Physicians', count: 4, color: '#059669' },
              { role: 'Optometrists', count: 3, color: '#0891b2' },
              { role: 'Technicians', count: 8, color: '#7c3aed' },
              { role: 'Admin Staff', count: 6, color: '#f59e0b' },
              { role: 'Front Desk', count: 3, color: '#dc2626' },
            ].map(s => (
              <div key={s.role} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
                <span style={{ flex: 1, fontSize: 14, color: '#6b7280' }}>{s.role}</span>
                <span style={{ fontWeight: 600, color: '#374151' }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pending Tasks */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📝 Action Items</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { task: 'Prior authorizations pending', count: 18, priority: 'high' },
              { task: 'Patient refunds to process', count: 12, priority: 'medium' },
              { task: 'Insurance verifications', count: 45, priority: 'medium' },
              { task: 'Recall appointments to schedule', count: 67, priority: 'low' },
              { task: 'Documents awaiting signature', count: 8, priority: 'high' },
            ].map(t => (
              <div 
                key={t.task} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: 12,
                  background: t.priority === 'high' ? '#fef2f2' : t.priority === 'medium' ? '#fffbeb' : '#f9fafb',
                  borderRadius: 8,
                  borderLeft: `4px solid ${t.priority === 'high' ? '#dc2626' : t.priority === 'medium' ? '#f59e0b' : '#6b7280'}`,
                }}
              >
                <span style={{ fontSize: 14, color: '#374151' }}>{t.task}</span>
                <span style={{ 
                  fontWeight: 600, 
                  fontSize: 14,
                  color: t.priority === 'high' ? '#dc2626' : t.priority === 'medium' ? '#f59e0b' : '#6b7280',
                }}>
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

AdminDashboard.propTypes = {
  data: PropTypes.object,
}

// Main Role-Based Dashboard Component
export function RoleBasedDashboard({ initialRole = 'CFO', data = {} }) {
  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [showCustomize, setShowCustomize] = useState(false)
  const [widgetConfigs, setWidgetConfigs] = useState(DEFAULT_WIDGETS)
  
  const handleSaveWidgets = useCallback((newWidgets) => {
    setWidgetConfigs(prev => ({
      ...prev,
      [selectedRole]: newWidgets,
    }))
  }, [selectedRole])
  
  const renderDashboard = () => {
    switch (selectedRole) {
      case 'CFO': return <CFODashboard data={data.cfo} />
      case 'CMO': return <CMODashboard data={data.cmo} />
      case 'COO': return <COODashboard data={data.coo} />
      case 'ADMIN': return <AdminDashboard data={data.admin} />
      default: return <CFODashboard data={data.cfo} />
    }
  }
  
  const currentRole = ROLES[selectedRole]
  
  return (
    <div>
      {/* Role Header */}
      <div style={{ 
        padding: '24px 24px 0 24px',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
              🎯 Role-Based Dashboard
            </h2>
            <p style={{ color: '#6b7280', margin: '0 0 20px 0' }}>
              Customized views for different executive roles
            </p>
          </div>
          
          {/* Customize Button */}
          <button
            onClick={() => setShowCustomize(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              background: `linear-gradient(135deg, ${currentRole.color} 0%, ${currentRole.color}dd 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            ⚙️ Customize My Dashboard
          </button>
        </div>
        
        {/* Role Selector */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(ROLES).map(([key, role]) => (
            <button
              key={key}
              onClick={() => setSelectedRole(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 20px',
                background: selectedRole === key 
                  ? `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)` 
                  : 'white',
                color: selectedRole === key ? 'white' : '#374151',
                border: selectedRole === key ? 'none' : '2px solid #e5e7eb',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 20 }}>{role.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{role.title}</div>
                <div style={{ fontSize: 11, opacity: selectedRole === key ? 0.9 : 0.6 }}>{role.focus}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Dashboard Content */}
      {renderDashboard()}
      
      {/* Customization Modal */}
      {showCustomize && (
        <CustomizeDashboardModal
          role={selectedRole}
          widgets={widgetConfigs[selectedRole]}
          onSave={handleSaveWidgets}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </div>
  )
}

RoleBasedDashboard.propTypes = {
  initialRole: PropTypes.oneOf(['CFO', 'CMO', 'COO', 'ADMIN']),
  data: PropTypes.object,
}

export default { RoleBasedDashboard }
