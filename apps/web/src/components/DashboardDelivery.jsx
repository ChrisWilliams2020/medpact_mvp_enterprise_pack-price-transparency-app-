import React, { useState, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// DASHBOARD DELIVERY - Email & SMS Scheduling for Role-Based Reports
// Hardened for production with validation and error handling
// ============================================================================

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Phone validation regex (US format)
const PHONE_REGEX = /^[\d\s\-\(\)]+$/

// Validation helpers
const validateEmail = (email) => !email || EMAIL_REGEX.test(email)
const validatePhone = (phone) => !phone || PHONE_REGEX.test(phone)
const formatPhone = (phone) => {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }
  return phone
}

const ROLES = [
  { id: 'cfo', title: 'Chief Financial Officer', icon: '💰', dashboards: ['Financial Summary', 'Revenue Analysis', 'EBITDA Trends'] },
  { id: 'cmo', title: 'Chief Medical Officer', icon: '⚕️', dashboards: ['Quality Metrics', 'MIPS Dashboard', 'Patient Outcomes'] },
  { id: 'coo', title: 'Chief Operating Officer', icon: '⚙️', dashboards: ['Operations Overview', 'Efficiency Metrics', 'Staff Productivity'] },
  { id: 'admin', title: 'Practice Administrator', icon: '📋', dashboards: ['Daily Operations', 'Scheduling', 'Staff Management'] },
  { id: 'provider', title: 'Provider', icon: '👨‍⚕️', dashboards: ['My Productivity', 'Patient Volume', 'Quality Scores'] },
  { id: 'billing', title: 'Billing Manager', icon: '💳', dashboards: ['Revenue Cycle', 'A/R Aging', 'Denial Management'] },
]

const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily', description: 'Every morning at 7:00 AM' },
  { id: 'weekly', label: 'Weekly', description: 'Every Monday morning' },
  { id: 'monthly', label: 'Monthly', description: 'First day of each month' },
  { id: 'quarterly', label: 'Quarterly', description: 'First day of each quarter' },
]

// Recipient Card Component - Memoized
const RecipientCard = memo(function RecipientCard({ recipient, onUpdate, onRemove }) {
  const [isEditing, setIsEditing] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const role = ROLES.find(r => r.id === recipient?.roleId) || { icon: '👤', title: 'Team Member' }
  
  // Safe update handler with validation
  const handleUpdate = useCallback((id, updates) => {
    const errors = {}
    if (updates.email !== undefined && !validateEmail(updates.email)) {
      errors.email = 'Invalid email format'
    }
    if (updates.phone !== undefined && !validatePhone(updates.phone)) {
      errors.phone = 'Invalid phone format'
    }
    setValidationErrors(errors)
    
    if (Object.keys(errors).length === 0 && typeof onUpdate === 'function') {
      onUpdate(id, updates)
    }
  }, [onUpdate])
  
  // Safe remove handler
  const handleRemove = useCallback(() => {
    if (typeof onRemove === 'function' && recipient?.id) {
      onRemove(recipient.id)
    }
  }, [onRemove, recipient?.id])
  
  if (!recipient) return null
  
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{role.icon}</span>
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>{recipient.name || 'Unknown'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{role.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            aria-label={isEditing ? 'Done editing' : 'Edit recipient'}
            style={{
              padding: '4px 10px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={handleRemove}
            aria-label="Remove recipient"
            style={{
              padding: '4px 10px',
              background: '#fef2f2',
              color: '#dc2626',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        </div>
      </div>
      
      {!isEditing ? (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <div>
            <span style={{ color: '#6b7280' }}>📧</span> {recipient.email || 'Not set'}
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>📱</span> {formatPhone(recipient.phone) || 'Not set'}
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>📅</span> {FREQUENCY_OPTIONS.find(f => f.id === recipient.frequency)?.label || 'Weekly'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Email</label>
            <input
              type="email"
              value={recipient.email || ''}
              onChange={e => handleUpdate(recipient.id, { email: e.target.value })}
              placeholder="email@practice.com"
              aria-label="Email address"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${validationErrors.email ? '#dc2626' : '#e5e7eb'}`,
                borderRadius: 6,
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Phone (SMS)</label>
            <input
              type="tel"
              value={recipient.phone || ''}
              onChange={e => handleUpdate(recipient.id, { phone: e.target.value })}
              placeholder="(555) 123-4567"
              aria-label="Phone number"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${validationErrors.phone ? '#dc2626' : '#e5e7eb'}`,
                borderRadius: 6,
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Delivery Frequency</label>
            <select
              value={recipient.frequency || 'weekly'}
              onChange={e => onUpdate(recipient.id, { frequency: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {FREQUENCY_OPTIONS.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Delivery Method</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={recipient.emailEnabled !== false}
                  onChange={e => onUpdate(recipient.id, { emailEnabled: e.target.checked })}
                />
                <span style={{ fontSize: 13 }}>Email</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={recipient.smsEnabled || false}
                  onChange={e => onUpdate(recipient.id, { smsEnabled: e.target.checked })}
                />
                <span style={{ fontSize: 13 }}>SMS</span>
              </label>
            </div>
          </div>
          
          {/* Dashboard Selection */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Dashboards to Include</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {role?.dashboards.map(dash => (
                <label
                  key={dash}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    background: (recipient.dashboards || []).includes(dash) ? '#eff6ff' : '#f9fafb',
                    border: `1px solid ${(recipient.dashboards || []).includes(dash) ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={(recipient.dashboards || []).includes(dash)}
                    onChange={e => {
                      const dashboards = recipient.dashboards || []
                      if (e.target.checked) {
                        onUpdate(recipient.id, { dashboards: [...dashboards, dash] })
                      } else {
                        onUpdate(recipient.id, { dashboards: dashboards.filter(d => d !== dash) })
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  {dash}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

RecipientCard.propTypes = {
  recipient: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

// Add Recipient Modal
function AddRecipientModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [roleId, setRoleId] = useState('admin')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  
  const handleAdd = () => {
    if (!name.trim() || !email.trim()) return
    onAdd({
      id: Date.now(),
      name,
      roleId,
      email,
      phone,
      frequency: 'weekly',
      emailEnabled: true,
      smsEnabled: !!phone,
      dashboards: ROLES.find(r => r.id === roleId)?.dashboards || [],
    })
    onClose()
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
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 480,
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1e3c72' }}>➕ Add Recipient</h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Smith"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
            }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Role</label>
          <select
            value={roleId}
            onChange={e => setRoleId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            {ROLES.map(role => (
              <option key={role.id} value={role.id}>{role.icon} {role.title}</option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@practice.com"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
            }}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone (Optional for SMS)</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e5e7eb',
              borderRadius: 8,
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
            onClick={handleAdd}
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
            Add Recipient
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Delivery Component
export function DashboardDelivery() {
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Sarah Johnson', roleId: 'cfo', email: 'sjohnson@practice.com', phone: '(555) 123-4567', frequency: 'weekly', emailEnabled: true, smsEnabled: true, dashboards: ['Financial Summary', 'Revenue Analysis'] },
    { id: 2, name: 'Dr. Michael Chen', roleId: 'cmo', email: 'mchen@practice.com', frequency: 'monthly', emailEnabled: true, smsEnabled: false, dashboards: ['Quality Metrics', 'MIPS Dashboard'] },
    { id: 3, name: 'Lisa Rodriguez', roleId: 'admin', email: 'lrodriguez@practice.com', frequency: 'daily', emailEnabled: true, smsEnabled: false, dashboards: ['Daily Operations'] },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  
  const handleUpdateRecipient = useCallback((id, updates) => {
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }, [])
  
  const handleRemoveRecipient = useCallback((id) => {
    setRecipients(prev => prev.filter(r => r.id !== id))
  }, [])
  
  const handleAddRecipient = useCallback((recipient) => {
    setRecipients(prev => [...prev, recipient])
  }, [])
  
  const handleSendNow = () => {
    setDeliveryStatus('sending')
    setTimeout(() => {
      setDeliveryStatus('sent')
      setTimeout(() => setDeliveryStatus(null), 3000)
    }, 2000)
  }
  
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
          📬 Dashboard Delivery
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Schedule automatic email and SMS delivery of dashboards to your team
        </p>
      </div>
      
      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: 16, 
        marginBottom: 24 
      }}>
        {[
          { label: 'Recipients', value: recipients.length, icon: '👥' },
          { label: 'Email Enabled', value: recipients.filter(r => r.emailEnabled).length, icon: '📧' },
          { label: 'SMS Enabled', value: recipients.filter(r => r.smsEnabled).length, icon: '📱' },
          { label: 'Daily Reports', value: recipients.filter(r => r.frequency === 'daily').length, icon: '📅' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: 24 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1e3c72' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setShowAddModal(true)}
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
          ➕ Add Recipient
        </button>
        <button
          onClick={handleSendNow}
          disabled={deliveryStatus === 'sending'}
          style={{
            padding: '10px 20px',
            background: deliveryStatus === 'sent' ? '#059669' : '#f3f4f6',
            color: deliveryStatus === 'sent' ? 'white' : '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {deliveryStatus === 'sending' ? '📤 Sending...' : 
           deliveryStatus === 'sent' ? '✅ Sent!' : 
           '📤 Send Now'}
        </button>
      </div>
      
      {/* Recipients List */}
      <div style={{ background: '#f9fafb', borderRadius: 16, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: 16 }}>
          📋 Delivery Recipients
        </h3>
        
        {recipients.length > 0 ? (
          recipients.map(recipient => (
            <RecipientCard
              key={recipient.id}
              recipient={recipient}
              onUpdate={handleUpdateRecipient}
              onRemove={handleRemoveRecipient}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div>No recipients configured yet</div>
            <div style={{ fontSize: 14 }}>Add recipients to start delivering dashboards</div>
          </div>
        )}
      </div>
      
      {showAddModal && (
        <AddRecipientModal
          onAdd={handleAddRecipient}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

export default DashboardDelivery
