import React, { useState, useEffect, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// CUSTOM ALERTS SYSTEM
// Real-time monitoring with configurable thresholds and notifications
// ============================================================================

// Helper for safe number operations
const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value)
  return isNaN(num) ? fallback : num
}

const ALERT_TYPES = {
  FINANCIAL: 'financial',
  OPERATIONAL: 'operational',
  QUALITY: 'quality',
  COMPLIANCE: 'compliance',
  REVENUE: 'revenue',
}

const SEVERITY = {
  CRITICAL: { color: '#dc2626', bg: '#fef2f2', label: 'Critical', icon: '🚨' },
  HIGH: { color: '#f59e0b', bg: '#fffbeb', label: 'High', icon: '⚠️' },
  MEDIUM: { color: '#3b82f6', bg: '#eff6ff', label: 'Medium', icon: '📢' },
  LOW: { color: '#6b7280', bg: '#f9fafb', label: 'Low', icon: 'ℹ️' },
}

// Default alert rules configuration
const DEFAULT_ALERT_RULES = [
  {
    id: 'ncr_critical',
    name: 'Net Collection Rate Critical',
    type: ALERT_TYPES.FINANCIAL,
    metric: 'ncr',
    condition: 'below',
    threshold: 90,
    severity: 'CRITICAL',
    message: 'NCR has dropped below 90% - immediate attention required',
    enabled: true,
    notification: { email: true, sms: true, dashboard: true },
  },
  {
    id: 'ncr_warning',
    name: 'Net Collection Rate Warning',
    type: ALERT_TYPES.FINANCIAL,
    metric: 'ncr',
    condition: 'below',
    threshold: 94,
    severity: 'HIGH',
    message: 'NCR is below 94% target - review collection processes',
    enabled: true,
    notification: { email: true, sms: false, dashboard: true },
  },
  {
    id: 'dar_high',
    name: 'Days in A/R High',
    type: ALERT_TYPES.OPERATIONAL,
    metric: 'dar',
    condition: 'above',
    threshold: 35,
    severity: 'HIGH',
    message: 'Days in A/R exceeds 35 days - accelerate collections',
    enabled: true,
    notification: { email: true, sms: false, dashboard: true },
  },
  {
    id: 'denial_spike',
    name: 'Denial Rate Spike',
    type: ALERT_TYPES.REVENUE,
    metric: 'denial_rate',
    condition: 'above',
    threshold: 8,
    severity: 'CRITICAL',
    message: 'Denial rate exceeds 8% - review coding and documentation',
    enabled: true,
    notification: { email: true, sms: true, dashboard: true },
  },
  {
    id: 'ebitda_margin',
    name: 'EBITDA Margin Low',
    type: ALERT_TYPES.FINANCIAL,
    metric: 'ebitda_margin',
    condition: 'below',
    threshold: 25,
    severity: 'HIGH',
    message: 'EBITDA margin below 25% - review expense structure',
    enabled: true,
    notification: { email: true, sms: false, dashboard: true },
  },
  {
    id: 'revenue_decline',
    name: 'Revenue Decline',
    type: ALERT_TYPES.REVENUE,
    metric: 'revenue_change',
    condition: 'below',
    threshold: -5,
    severity: 'HIGH',
    message: 'Monthly revenue declined by more than 5%',
    enabled: true,
    notification: { email: true, sms: false, dashboard: true },
  },
  {
    id: 'mips_score',
    name: 'MIPS Score Warning',
    type: ALERT_TYPES.QUALITY,
    metric: 'mips_score',
    condition: 'below',
    threshold: 75,
    severity: 'MEDIUM',
    message: 'MIPS score below 75 - risk of neutral payment adjustment',
    enabled: true,
    notification: { email: true, sms: false, dashboard: true },
  },
  {
    id: 'patient_satisfaction',
    name: 'Patient Satisfaction Drop',
    type: ALERT_TYPES.QUALITY,
    metric: 'patient_satisfaction',
    condition: 'below',
    threshold: 4.0,
    severity: 'MEDIUM',
    message: 'Patient satisfaction score dropped below 4.0',
    enabled: true,
    notification: { email: true, sms: false, dashboard: true },
  },
  {
    id: 'compliance_deadline',
    name: 'Compliance Deadline',
    type: ALERT_TYPES.COMPLIANCE,
    metric: 'compliance_due_days',
    condition: 'below',
    threshold: 30,
    severity: 'HIGH',
    message: 'Compliance deadline approaching within 30 days',
    enabled: true,
    notification: { email: true, sms: true, dashboard: true },
  },
]

// Check metrics against rules and generate alerts
export function evaluateAlerts(metrics, rules = DEFAULT_ALERT_RULES) {
  const activeAlerts = []
  const timestamp = new Date().toISOString()
  
  rules.filter(rule => rule.enabled).forEach(rule => {
    const metricValue = metrics[rule.metric]
    if (metricValue === undefined) return
    
    let isTriggered = false
    if (rule.condition === 'below' && metricValue < rule.threshold) {
      isTriggered = true
    } else if (rule.condition === 'above' && metricValue > rule.threshold) {
      isTriggered = true
    }
    
    if (isTriggered) {
      activeAlerts.push({
        id: `${rule.id}_${Date.now()}`,
        ruleId: rule.id,
        name: rule.name,
        type: rule.type,
        severity: rule.severity,
        message: rule.message,
        metric: rule.metric,
        currentValue: metricValue,
        threshold: rule.threshold,
        condition: rule.condition,
        timestamp,
        acknowledged: false,
        notification: rule.notification,
      })
    }
  })
  
  return activeAlerts.sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

// Alert Card Component
const AlertCard = memo(function AlertCard({ alert, onAcknowledge, onDismiss }) {
  const severity = SEVERITY[alert?.severity] || SEVERITY.LOW
  const alertName = alert?.name || 'Unknown Alert'
  const alertMessage = alert?.message || ''
  const alertTimestamp = alert?.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : ''
  
  const handleAcknowledge = useCallback(() => {
    if (onAcknowledge && alert?.id) {
      onAcknowledge(alert.id)
    }
  }, [onAcknowledge, alert?.id])
  
  const handleDismiss = useCallback(() => {
    if (onDismiss && alert?.id) {
      onDismiss(alert.id)
    }
  }, [onDismiss, alert?.id])
  
  return (
    <div 
      style={{
        background: severity.bg,
        border: `2px solid ${severity.color}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        animation: alert?.severity === 'CRITICAL' ? 'pulse 2s infinite' : 'none',
      }}
      role="alert"
      aria-live={alert?.severity === 'CRITICAL' ? 'assertive' : 'polite'}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{severity.icon}</span>
          <div>
            <span style={{ 
              fontSize: 10, 
              fontWeight: 600, 
              color: severity.color,
              background: `${severity.color}20`,
              padding: '2px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
            }}>
              {severity.label}
            </span>
            <h4 style={{ margin: '4px 0 0 0', color: '#1f2937', fontSize: 15 }}>{alert.name}</h4>
          </div>
        </div>
        
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          {new Date(alert.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <p style={{ margin: '0 0 12px 0', color: '#4b5563', fontSize: 14, lineHeight: 1.5 }}>
        {alert.message}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
          <span style={{ color: '#6b7280' }}>
            Current: <strong style={{ color: severity.color }}>{alert.currentValue?.toFixed?.(1) || alert.currentValue}</strong>
          </span>
          <span style={{ color: '#6b7280' }}>
            Threshold: <strong>{alert.threshold}</strong>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {!alert.acknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              style={{
                padding: '6px 12px',
                background: severity.color,
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Acknowledge
            </button>
          )}
          <button
            onClick={() => onDismiss(alert.id)}
            style={{
              padding: '6px 12px',
              background: '#e5e7eb',
              color: '#4b5563',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
})

AlertCard.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    message: PropTypes.string,
    severity: PropTypes.oneOf(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    timestamp: PropTypes.string,
    currentValue: PropTypes.number,
    threshold: PropTypes.number,
    acknowledged: PropTypes.bool,
  }),
  onAcknowledge: PropTypes.func,
  onDismiss: PropTypes.func,
}

// Alert Rules Editor
const AlertRulesEditor = memo(function AlertRulesEditor({ rules = [], onUpdateRule, onAddRule }) {
  const [editingRule, setEditingRule] = useState(null)
  
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, color: '#1e3c72' }}>⚙️ Alert Rules Configuration</h3>
        <button
          onClick={onAddRule}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Rule
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rules.map(rule => (
          <div
            key={rule.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              background: rule.enabled ? '#f9fafb' : '#f3f4f6',
              borderRadius: 10,
              opacity: rule.enabled ? 1 : 0.6,
            }}
          >
            <input
              type="checkbox"
              checked={rule.enabled}
              onChange={(e) => onUpdateRule(rule.id, { enabled: e.target.checked })}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{rule.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {rule.metric} {rule.condition} {rule.threshold}
              </div>
            </div>
            
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 4,
              background: SEVERITY[rule.severity].bg,
              color: SEVERITY[rule.severity].color,
            }}>
              {rule.severity}
            </span>
            
            <div style={{ display: 'flex', gap: 4 }}>
              {rule.notification.email && <span title="Email">📧</span>}
              {rule.notification.sms && <span title="SMS">📱</span>}
              {rule.notification.dashboard && <span title="Dashboard">🖥️</span>}
            </div>
            
            <button
              onClick={() => setEditingRule(rule)}
              style={{
                padding: '4px 8px',
                background: '#e5e7eb',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
})

AlertRulesEditor.propTypes = {
  rules: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    severity: PropTypes.string,
    enabled: PropTypes.bool,
    threshold: PropTypes.number,
  })),
  onUpdateRule: PropTypes.func,
  onAddRule: PropTypes.func,
}

// Alerts Summary Widget
export const AlertsSummary = memo(function AlertsSummary({ alerts = [] }) {
  const safeAlerts = Array.isArray(alerts) ? alerts : []
  const counts = {
    CRITICAL: safeAlerts.filter(a => a?.severity === 'CRITICAL').length,
    HIGH: safeAlerts.filter(a => a?.severity === 'HIGH').length,
    MEDIUM: safeAlerts.filter(a => a?.severity === 'MEDIUM').length,
    LOW: safeAlerts.filter(a => a?.severity === 'LOW').length,
  }
  
  const total = alerts.length
  
  return (
    <div style={{
      background: total > 0 ? 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      borderRadius: 16,
      padding: 20,
      border: total > 0 ? '2px solid #fca5a5' : '2px solid #86efac',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{total > 0 ? '🔔' : '✅'}</span>
        <div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: total > 0 ? '#dc2626' : '#059669' }}>
            {total} {total === 1 ? 'Alert' : 'Alerts'}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            {total > 0 ? 'Requires attention' : 'All systems normal'}
          </div>
        </div>
      </div>
      
      {total > 0 && (
        <div style={{ display: 'flex', gap: 12 }}>
          {Object.entries(SEVERITY).map(([key, value]) => (
            <div
              key={key}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: 8,
                background: counts[key] > 0 ? value.bg : 'white',
                borderRadius: 8,
                border: `1px solid ${counts[key] > 0 ? value.color : '#e5e7eb'}`,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 'bold', color: value.color }}>{counts[key]}</div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>{value.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

AlertsSummary.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    severity: PropTypes.oneOf(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  })),
}

// Main Alerts Dashboard
export function AlertsDashboard({ metrics = {} }) {
  const [rules, setRules] = useState(DEFAULT_ALERT_RULES)
  const [alerts, setAlerts] = useState([])
  const [view, setView] = useState('alerts') // 'alerts' | 'rules'
  const [filter, setFilter] = useState('all')
  
  // Demo metrics for testing
  const demoMetrics = {
    ncr: 93.2,
    dar: 38,
    denial_rate: 6.8,
    ebitda_margin: 27.5,
    revenue_change: -2.3,
    mips_score: 72,
    patient_satisfaction: 4.3,
    compliance_due_days: 45,
    ...metrics,
  }
  
  // Evaluate alerts on metrics change
  useEffect(() => {
    const newAlerts = evaluateAlerts(demoMetrics, rules)
    setAlerts(newAlerts)
  }, [metrics, rules])
  
  const handleAcknowledge = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ))
  }, [])
  
  const handleDismiss = useCallback((alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId))
  }, [])
  
  const handleUpdateRule = useCallback((ruleId, updates) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, ...updates } : r
    ))
  }, [])
  
  const handleAddRule = useCallback(() => {
    const newRule = {
      id: `custom_${Date.now()}`,
      name: 'New Custom Rule',
      type: ALERT_TYPES.FINANCIAL,
      metric: 'ncr',
      condition: 'below',
      threshold: 90,
      severity: 'MEDIUM',
      message: 'Custom alert message',
      enabled: false,
      notification: { email: true, sms: false, dashboard: true },
    }
    setRules(prev => [...prev, newRule])
  }, [])
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter)
  
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
          🔔 Alerts & Notifications
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Real-time monitoring with configurable thresholds
        </p>
      </div>
      
      {/* Alert Summary */}
      <div style={{ marginBottom: 24 }}>
        <AlertsSummary alerts={alerts} />
      </div>
      
      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'alerts', label: 'Active Alerts', count: alerts.length },
          { id: 'rules', label: 'Alert Rules', count: rules.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              padding: '10px 20px',
              background: view === tab.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
              color: view === tab.id ? 'white' : '#4b5563',
              border: view === tab.id ? 'none' : '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {/* Content */}
      {view === 'alerts' ? (
        <>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: ALERT_TYPES.FINANCIAL, label: '💰 Financial' },
              { id: ALERT_TYPES.OPERATIONAL, label: '⚙️ Operational' },
              { id: ALERT_TYPES.QUALITY, label: '⭐ Quality' },
              { id: ALERT_TYPES.REVENUE, label: '📈 Revenue' },
              { id: ALERT_TYPES.COMPLIANCE, label: '📋 Compliance' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 14px',
                  background: filter === f.id ? '#667eea' : 'white',
                  color: filter === f.id ? 'white' : '#4b5563',
                  border: filter === f.id ? 'none' : '1px solid #e5e7eb',
                  borderRadius: 20,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          
          {/* Alert List */}
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: 48,
              background: '#f9fafb',
              borderRadius: 16,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 18, color: '#374151', fontWeight: 600 }}>No Active Alerts</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>All monitored metrics are within acceptable ranges</div>
            </div>
          )}
        </>
      ) : (
        <AlertRulesEditor
          rules={rules}
          onUpdateRule={handleUpdateRule}
          onAddRule={handleAddRule}
        />
      )}
    </div>
  )
}

AlertsDashboard.propTypes = {
  metrics: PropTypes.object,
}

export default { AlertsDashboard, AlertsSummary, evaluateAlerts }
