/**
 * PayerContractTracking.jsx
 * Medicare & Medicaid Contract Tracking Component
 * 
 * Tracks payer contracts, fee schedules, renewal dates, and reimbursement rates
 * for ophthalmology practices.
 */

import React, { useState, useCallback, memo, useMemo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// DESIGN CONSTANTS
// ============================================================================

const COLORS = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  medicare: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  medicaid: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  commercial: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
}

const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  glow: '0 4px 20px rgba(102, 126, 234, 0.25)',
}

// ============================================================================
// SAMPLE PAYER CONTRACTS DATA
// ============================================================================

const SAMPLE_PAYER_CONTRACTS = [
  {
    id: 'mc1',
    payerName: 'Medicare Part B',
    payerType: 'medicare',
    contractType: 'Fee Schedule',
    status: 'active',
    effectiveDate: '2026-01-01',
    expirationDate: '2026-12-31',
    renewalDate: '2026-10-01',
    autoRenew: true,
    reimbursementBasis: 'MPFS (Medicare Physician Fee Schedule)',
    feeScheduleYear: 2026,
    conversionFactor: 32.7442,
    averageReimbursement: 95,
    paymentTerms: 'Electronic - 14 days',
    notes: 'Standard Medicare Part B participation agreement',
    keyContacts: [
      { name: 'Medicare Administrative Contractor', role: 'MAC', phone: '1-800-MEDICARE' }
    ],
    topProcedures: [
      { cpt: '66984', description: 'Cataract surgery w/IOL', allowedAmount: 1789.23, volume: 245 },
      { cpt: '67028', description: 'Intravitreal injection', allowedAmount: 142.58, volume: 1280 },
      { cpt: '92014', description: 'Comprehensive eye exam', allowedAmount: 112.18, volume: 2150 },
      { cpt: '92134', description: 'OCT Retina', allowedAmount: 48.52, volume: 890 },
    ],
    performanceMetrics: {
      claimsSubmitted: 4565,
      claimsPaid: 4420,
      claimsDenied: 145,
      denialRate: 3.2,
      avgDaysToPayment: 12,
      totalReimbursement: 892450,
    }
  },
  {
    id: 'mc2',
    payerName: 'Medicare Advantage - UnitedHealthcare',
    payerType: 'medicare_advantage',
    contractType: 'Managed Care',
    status: 'active',
    effectiveDate: '2025-07-01',
    expirationDate: '2027-06-30',
    renewalDate: '2027-03-01',
    autoRenew: false,
    reimbursementBasis: '105% of MPFS',
    feeScheduleYear: 2026,
    conversionFactor: 34.38,
    averageReimbursement: 105,
    paymentTerms: 'Electronic - 21 days',
    notes: 'Negotiated 5% above standard Medicare rates',
    keyContacts: [
      { name: 'Provider Relations', role: 'Contract Manager', phone: '1-877-842-3210', email: 'providerrelations@uhc.com' }
    ],
    topProcedures: [
      { cpt: '66984', description: 'Cataract surgery w/IOL', allowedAmount: 1878.69, volume: 156 },
      { cpt: '67028', description: 'Intravitreal injection', allowedAmount: 149.71, volume: 645 },
      { cpt: '92014', description: 'Comprehensive eye exam', allowedAmount: 117.79, volume: 1890 },
    ],
    performanceMetrics: {
      claimsSubmitted: 2691,
      claimsPaid: 2545,
      claimsDenied: 146,
      denialRate: 5.4,
      avgDaysToPayment: 18,
      totalReimbursement: 542180,
    }
  },
  {
    id: 'md1',
    payerName: 'Medicaid - State Program',
    payerType: 'medicaid',
    contractType: 'Fee Schedule',
    status: 'active',
    effectiveDate: '2026-01-01',
    expirationDate: '2026-12-31',
    renewalDate: '2026-09-01',
    autoRenew: true,
    reimbursementBasis: '80% of MPFS',
    feeScheduleYear: 2026,
    conversionFactor: 26.20,
    averageReimbursement: 80,
    paymentTerms: 'Electronic - 30 days',
    notes: 'State Medicaid program - requires prior auth for surgical procedures',
    keyContacts: [
      { name: 'State Medicaid Office', role: 'Provider Enrollment', phone: '1-800-555-0199' }
    ],
    topProcedures: [
      { cpt: '66984', description: 'Cataract surgery w/IOL', allowedAmount: 1431.38, volume: 45 },
      { cpt: '67028', description: 'Intravitreal injection', allowedAmount: 114.06, volume: 220 },
      { cpt: '92014', description: 'Comprehensive eye exam', allowedAmount: 89.74, volume: 680 },
    ],
    performanceMetrics: {
      claimsSubmitted: 945,
      claimsPaid: 856,
      claimsDenied: 89,
      denialRate: 9.4,
      avgDaysToPayment: 28,
      totalReimbursement: 124560,
    }
  },
  {
    id: 'md2',
    payerName: 'Medicaid MCO - Molina Healthcare',
    payerType: 'medicaid_mco',
    contractType: 'Managed Care',
    status: 'pending_renewal',
    effectiveDate: '2024-01-01',
    expirationDate: '2026-03-31',
    renewalDate: '2026-02-01',
    autoRenew: false,
    reimbursementBasis: '85% of MPFS',
    feeScheduleYear: 2026,
    conversionFactor: 27.83,
    averageReimbursement: 85,
    paymentTerms: 'Electronic - 25 days',
    notes: 'Contract expiring soon - renewal negotiation in progress',
    keyContacts: [
      { name: 'Maria Rodriguez', role: 'Provider Relations Manager', phone: '1-855-665-4621', email: 'maria.rodriguez@molinahealthcare.com' }
    ],
    topProcedures: [
      { cpt: '66984', description: 'Cataract surgery w/IOL', allowedAmount: 1520.84, volume: 38 },
      { cpt: '92014', description: 'Comprehensive eye exam', allowedAmount: 95.35, volume: 412 },
    ],
    performanceMetrics: {
      claimsSubmitted: 450,
      claimsPaid: 398,
      claimsDenied: 52,
      denialRate: 11.6,
      avgDaysToPayment: 24,
      totalReimbursement: 67890,
    }
  },
  {
    id: 'cm1',
    payerName: 'Blue Cross Blue Shield',
    payerType: 'commercial',
    contractType: 'PPO Network',
    status: 'active',
    effectiveDate: '2025-01-01',
    expirationDate: '2027-12-31',
    renewalDate: '2027-09-01',
    autoRenew: true,
    reimbursementBasis: '125% of MPFS',
    feeScheduleYear: 2026,
    conversionFactor: 40.93,
    averageReimbursement: 125,
    paymentTerms: 'Electronic - 14 days',
    notes: 'Premier PPO contract with favorable rates',
    keyContacts: [
      { name: 'Jennifer Smith', role: 'Provider Network Manager', phone: '1-800-262-2583', email: 'jennifer.smith@bcbs.com' }
    ],
    topProcedures: [
      { cpt: '66984', description: 'Cataract surgery w/IOL', allowedAmount: 2236.54, volume: 312 },
      { cpt: '67028', description: 'Intravitreal injection', allowedAmount: 178.23, volume: 890 },
      { cpt: '92014', description: 'Comprehensive eye exam', allowedAmount: 140.23, volume: 3245 },
    ],
    performanceMetrics: {
      claimsSubmitted: 4447,
      claimsPaid: 4312,
      claimsDenied: 135,
      denialRate: 3.0,
      avgDaysToPayment: 11,
      totalReimbursement: 1245680,
    }
  },
  {
    id: 'cm2',
    payerName: 'Aetna',
    payerType: 'commercial',
    contractType: 'EPO Network',
    status: 'under_negotiation',
    effectiveDate: '2023-04-01',
    expirationDate: '2026-03-31',
    renewalDate: '2026-01-15',
    autoRenew: false,
    reimbursementBasis: '115% of MPFS',
    feeScheduleYear: 2025,
    conversionFactor: 37.46,
    averageReimbursement: 115,
    paymentTerms: 'Electronic - 21 days',
    notes: 'Negotiating 8% rate increase - current terms below market',
    keyContacts: [
      { name: 'Robert Chen', role: 'Network Development', phone: '1-800-872-3862', email: 'robert.chen@aetna.com' }
    ],
    topProcedures: [
      { cpt: '66984', description: 'Cataract surgery w/IOL', allowedAmount: 2057.62, volume: 189 },
      { cpt: '67028', description: 'Intravitreal injection', allowedAmount: 164.01, volume: 534 },
      { cpt: '92014', description: 'Comprehensive eye exam', allowedAmount: 129.01, volume: 1876 },
    ],
    performanceMetrics: {
      claimsSubmitted: 2599,
      claimsPaid: 2456,
      claimsDenied: 143,
      denialRate: 5.5,
      avgDaysToPayment: 19,
      totalReimbursement: 678450,
    }
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getDaysUntil = (dateString) => {
  const today = new Date()
  const targetDate = new Date(dateString)
  const diffTime = targetDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getStatusInfo = (status) => {
  const statusMap = {
    active: { label: 'Active', color: '#22c55e', bg: '#dcfce7', icon: '✓' },
    pending_renewal: { label: 'Pending Renewal', color: '#f59e0b', bg: '#fef3c7', icon: '⏳' },
    under_negotiation: { label: 'Under Negotiation', color: '#8b5cf6', bg: '#f3e8ff', icon: '📝' },
    expired: { label: 'Expired', color: '#ef4444', bg: '#fee2e2', icon: '⚠️' },
    terminated: { label: 'Terminated', color: '#6b7280', bg: '#f3f4f6', icon: '✕' },
  }
  return statusMap[status] || statusMap.active
}

const getPayerTypeInfo = (payerType) => {
  const typeMap = {
    medicare: { label: 'Medicare', gradient: COLORS.medicare, icon: '🏛️' },
    medicare_advantage: { label: 'Medicare Advantage', gradient: COLORS.medicare, icon: '🏛️' },
    medicaid: { label: 'Medicaid', gradient: COLORS.medicaid, icon: '🏥' },
    medicaid_mco: { label: 'Medicaid MCO', gradient: COLORS.medicaid, icon: '🏥' },
    commercial: { label: 'Commercial', gradient: COLORS.commercial, icon: '🏢' },
  }
  return typeMap[payerType] || typeMap.commercial
}

// ============================================================================
// CONTRACT CARD COMPONENT
// ============================================================================

const ContractCard = memo(function ContractCard({ contract, onViewDetails, onRenew }) {
  const statusInfo = getStatusInfo(contract.status)
  const payerInfo = getPayerTypeInfo(contract.payerType)
  const daysUntilExpiration = getDaysUntil(contract.expirationDate)
  const daysUntilRenewal = getDaysUntil(contract.renewalDate)
  const isExpiringSoon = daysUntilExpiration <= 90 && daysUntilExpiration > 0
  const isPastRenewal = daysUntilRenewal < 0
  
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: isExpiringSoon ? '2px solid #f59e0b' : '1px solid #e5e7eb',
      boxShadow: SHADOWS.md,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        background: payerInfo.gradient,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>{payerInfo.icon}</span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {payerInfo.label}
            </span>
          </div>
          <h3 style={{ margin: 0, color: 'white', fontSize: 18, fontWeight: 700 }}>
            {contract.payerName}
          </h3>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            {contract.contractType}
          </p>
        </div>
        <div style={{
          background: statusInfo.bg,
          color: statusInfo.color,
          padding: '6px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {statusInfo.icon} {statusInfo.label}
        </div>
      </div>
      
      {/* Expiration Warning */}
      {isExpiringSoon && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid #fcd34d',
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>
            Contract expires in {daysUntilExpiration} days
            {isPastRenewal ? ' - Renewal deadline passed!' : ` - Renewal deadline: ${formatDate(contract.renewalDate)}`}
          </span>
        </div>
      )}
      
      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* Key Dates */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 12,
          marginBottom: 20,
        }}>
          <div style={{
            background: '#f8fafc',
            padding: 12,
            borderRadius: 10,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginBottom: 4 }}>
              EFFECTIVE
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', fontWeight: 600 }}>
              {formatDate(contract.effectiveDate)}
            </div>
          </div>
          <div style={{
            background: daysUntilExpiration <= 90 ? '#fef3c7' : '#f8fafc',
            padding: 12,
            borderRadius: 10,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: daysUntilExpiration <= 90 ? '#92400e' : '#6b7280', fontWeight: 600, marginBottom: 4 }}>
              EXPIRES
            </div>
            <div style={{ fontSize: 14, color: daysUntilExpiration <= 90 ? '#92400e' : '#1f2937', fontWeight: 600 }}>
              {formatDate(contract.expirationDate)}
            </div>
          </div>
          <div style={{
            background: isPastRenewal ? '#fee2e2' : '#f8fafc',
            padding: 12,
            borderRadius: 10,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: isPastRenewal ? '#dc2626' : '#6b7280', fontWeight: 600, marginBottom: 4 }}>
              RENEWAL BY
            </div>
            <div style={{ fontSize: 14, color: isPastRenewal ? '#dc2626' : '#1f2937', fontWeight: 600 }}>
              {formatDate(contract.renewalDate)}
            </div>
          </div>
        </div>
        
        {/* Reimbursement Info */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: '1px solid #22c55e20',
        }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 8 }}>
            💰 REIMBURSEMENT TERMS
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 2 }}>
                {contract.reimbursementBasis}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Conversion Factor: ${contract.conversionFactor}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: 28, 
                fontWeight: 700, 
                color: contract.averageReimbursement >= 100 ? '#15803d' : '#dc2626',
              }}>
                {contract.averageReimbursement}%
              </div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>of Medicare</div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>
            📊 Performance Metrics
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Claims Paid</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>
                {((contract.performanceMetrics.claimsPaid / contract.performanceMetrics.claimsSubmitted) * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Denial Rate</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: contract.performanceMetrics.denialRate > 5 ? '#ef4444' : '#22c55e' }}>
                {contract.performanceMetrics.denialRate}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Avg Days to Pay</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                {contract.performanceMetrics.avgDaysToPayment} days
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Total Reimbursed</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                {formatCurrency(contract.performanceMetrics.totalReimbursement)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Top Procedures */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>
            🔝 Top Procedures
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {contract.topProcedures.slice(0, 3).map(proc => (
              <div key={proc.cpt} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: '#f8fafc',
                borderRadius: 8,
              }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#4f46e5', fontSize: 13 }}>{proc.cpt}</span>
                  <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 8 }}>{proc.description}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>
                    {formatCurrency(proc.allowedAmount)}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{proc.volume} claims</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={() => onViewDetails(contract)}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'white',
              color: '#4f46e5',
              border: '2px solid #4f46e5',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📋 View Details
          </button>
          {(contract.status === 'pending_renewal' || contract.status === 'under_negotiation' || isExpiringSoon) && (
            <button
              onClick={() => onRenew(contract)}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              🔄 Initiate Renewal
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

ContractCard.propTypes = {
  contract: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onRenew: PropTypes.func.isRequired,
}

// ============================================================================
// SUMMARY DASHBOARD COMPONENT
// ============================================================================

const ContractSummaryDashboard = memo(function ContractSummaryDashboard({ contracts }) {
  const stats = useMemo(() => {
    const active = contracts.filter(c => c.status === 'active').length
    const pendingRenewal = contracts.filter(c => c.status === 'pending_renewal' || c.status === 'under_negotiation').length
    const expiringSoon = contracts.filter(c => {
      const days = getDaysUntil(c.expirationDate)
      return days <= 90 && days > 0
    }).length
    const totalReimbursement = contracts.reduce((sum, c) => sum + (c.performanceMetrics?.totalReimbursement || 0), 0)
    const avgDenialRate = contracts.length > 0 
      ? contracts.reduce((sum, c) => sum + (c.performanceMetrics?.denialRate || 0), 0) / contracts.length 
      : 0
    
    const medicareContracts = contracts.filter(c => c.payerType === 'medicare' || c.payerType === 'medicare_advantage')
    const medicaidContracts = contracts.filter(c => c.payerType === 'medicaid' || c.payerType === 'medicaid_mco')
    const commercialContracts = contracts.filter(c => c.payerType === 'commercial')
    
    return { active, pendingRenewal, expiringSoon, totalReimbursement, avgDenialRate, medicareContracts, medicaidContracts, commercialContracts }
  }, [contracts])
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      color: 'white',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 24 }}>📄 Payer Contract Dashboard</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
            Track Medicare, Medicaid, and Commercial payer agreements
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '8px 16px',
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
        }}>
          {contracts.length} Total Contracts
        </div>
      </div>
      
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          borderRadius: 12,
          padding: 16,
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.active}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Active Contracts</div>
        </div>
        
        <div style={{
          background: stats.pendingRenewal > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          border: stats.pendingRenewal > 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.pendingRenewal}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Pending Renewal</div>
        </div>
        
        <div style={{
          background: stats.expiringSoon > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          border: stats.expiringSoon > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.expiringSoon}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Expiring (90 days)</div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{formatCurrency(stats.totalReimbursement)}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Total Reimbursement</div>
        </div>
        
        <div style={{
          background: stats.avgDenialRate > 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          border: stats.avgDenialRate > 5 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.avgDenialRate.toFixed(1)}%</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Avg Denial Rate</div>
        </div>
      </div>
      
      {/* Payer Mix */}
      <div style={{ marginTop: 20, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, background: 'rgba(37, 99, 235, 0.2)', borderRadius: 12, padding: 16, border: '1px solid rgba(37, 99, 235, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span>🏛️</span>
            <span style={{ fontWeight: 600 }}>Medicare</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.medicareContracts.length}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>contracts</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(5, 150, 105, 0.2)', borderRadius: 12, padding: 16, border: '1px solid rgba(5, 150, 105, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span>🏥</span>
            <span style={{ fontWeight: 600 }}>Medicaid</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.medicaidContracts.length}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>contracts</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.2)', borderRadius: 12, padding: 16, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span>🏢</span>
            <span style={{ fontWeight: 600 }}>Commercial</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.commercialContracts.length}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>contracts</div>
        </div>
      </div>
    </div>
  )
})

ContractSummaryDashboard.propTypes = {
  contracts: PropTypes.array.isRequired,
}

// ============================================================================
// CONTRACT DETAIL MODAL
// ============================================================================

const ContractDetailModal = memo(function ContractDetailModal({ contract, onClose }) {
  if (!contract) return null
  
  const statusInfo = getStatusInfo(contract.status)
  const payerInfo = getPayerTypeInfo(contract.payerType)
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 20,
          width: '100%',
          maxWidth: 800,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          background: payerInfo.gradient,
          padding: 24,
          position: 'sticky',
          top: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{payerInfo.icon}</span>
                <span style={{
                  background: statusInfo.bg,
                  color: statusInfo.color,
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>
              <h2 style={{ margin: 0, color: 'white', fontSize: 24 }}>{contract.payerName}</h2>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)' }}>{contract.contractType}</p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 10,
                padding: '8px 16px',
                color: 'white',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Contract Details */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1f2937' }}>📋 Contract Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Effective Date</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>{formatDate(contract.effectiveDate)}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Expiration Date</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>{formatDate(contract.expirationDate)}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Renewal Deadline</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>{formatDate(contract.renewalDate)}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Auto-Renew</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: contract.autoRenew ? '#22c55e' : '#ef4444' }}>
                  {contract.autoRenew ? '✓ Yes' : '✕ No'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Reimbursement Terms */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1f2937' }}>💰 Reimbursement Terms</h3>
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: 16,
              padding: 20,
              border: '1px solid #22c55e20',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 4 }}>Reimbursement Basis</div>
                  <div style={{ fontSize: 16, color: '#1f2937' }}>{contract.reimbursementBasis}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 4 }}>Fee Schedule Year</div>
                  <div style={{ fontSize: 16, color: '#1f2937' }}>{contract.feeScheduleYear}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 4 }}>Conversion Factor</div>
                  <div style={{ fontSize: 16, color: '#1f2937' }}>${contract.conversionFactor}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 4 }}>% of Medicare</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: contract.averageReimbursement >= 100 ? '#15803d' : '#dc2626' }}>
                    {contract.averageReimbursement}%
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #22c55e30' }}>
                <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 4 }}>Payment Terms</div>
                <div style={{ fontSize: 14, color: '#1f2937' }}>{contract.paymentTerms}</div>
              </div>
            </div>
          </div>
          
          {/* Key Contacts */}
          {contract.keyContacts && contract.keyContacts.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1f2937' }}>👥 Key Contacts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {contract.keyContacts.map((contact, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{contact.name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{contact.role}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13 }}>
                      <div style={{ color: '#4f46e5' }}>{contact.phone}</div>
                      {contact.email && <div style={{ color: '#6b7280' }}>{contact.email}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* All Procedures */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1f2937' }}>📊 Procedure Fee Schedule</h3>
            <div style={{
              background: '#f8fafc',
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#e5e7eb' }}>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#4b5563' }}>CPT</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Description</th>
                    <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Allowed Amount</th>
                    <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.topProcedures.map(proc => (
                    <tr key={proc.cpt} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: 12, fontWeight: 600, color: '#4f46e5' }}>{proc.cpt}</td>
                      <td style={{ padding: 12, color: '#1f2937' }}>{proc.description}</td>
                      <td style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#15803d' }}>{formatCurrency(proc.allowedAmount)}</td>
                      <td style={{ padding: 12, textAlign: 'right', color: '#6b7280' }}>{proc.volume.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Notes */}
          {contract.notes && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1f2937' }}>📝 Notes</h3>
              <div style={{
                background: '#fef3c7',
                borderRadius: 12,
                padding: 16,
                border: '1px solid #fcd34d',
                color: '#92400e',
                fontSize: 14,
              }}>
                {contract.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

ContractDetailModal.propTypes = {
  contract: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PayerContractTracking({ onClose }) {
  const [contracts] = useState(SAMPLE_PAYER_CONTRACTS)
  const [selectedContract, setSelectedContract] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      if (filterType !== 'all') {
        if (filterType === 'medicare' && !['medicare', 'medicare_advantage'].includes(c.payerType)) return false
        if (filterType === 'medicaid' && !['medicaid', 'medicaid_mco'].includes(c.payerType)) return false
        if (filterType === 'commercial' && c.payerType !== 'commercial') return false
      }
      if (filterStatus !== 'all' && c.status !== filterStatus) return false
      return true
    })
  }, [contracts, filterType, filterStatus])
  
  const handleViewDetails = useCallback((contract) => {
    setSelectedContract(contract)
  }, [])
  
  const handleRenew = useCallback((contract) => {
    alert(`🔄 Initiating renewal process for:\n\n${contract.payerName}\n\nThis would:\n• Generate renewal request\n• Notify billing team\n• Track negotiation status\n• Update contract terms`)
  }, [])
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: 20,
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: '#f8fafc',
          borderRadius: 24,
          width: '100%',
          maxWidth: 1400,
          maxHeight: '95vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          padding: '20px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              📄 Medicare & Medicaid Contract Tracking
            </h1>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Monitor payer agreements, fee schedules, and renewal deadlines
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              color: 'white',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ✕ Close
          </button>
        </div>
        
        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Summary Dashboard */}
          <ContractSummaryDashboard contracts={contracts} />
          
          {/* Filters */}
          <div style={{ 
            display: 'flex', 
            gap: 16, 
            marginBottom: 24,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 600 }}>Payer Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Types</option>
                <option value="medicare">Medicare</option>
                <option value="medicaid">Medicaid</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 600 }}>Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending_renewal">Pending Renewal</option>
                <option value="under_negotiation">Under Negotiation</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <button
              onClick={() => alert('📤 Export Contract Report\n\nThis would generate a comprehensive report including:\n• All contract details\n• Fee schedules\n• Performance metrics\n• Renewal calendar')}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
            >
              📊 Export Report
            </button>
          </div>
          
          {/* Contract Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
            gap: 24,
          }}>
            {filteredContracts.map(contract => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onViewDetails={handleViewDetails}
                onRenew={handleRenew}
              />
            ))}
          </div>
          
          {filteredContracts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 60,
              color: '#6b7280',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No Contracts Found</div>
              <div style={{ fontSize: 14 }}>Try adjusting your filters</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Contract Detail Modal */}
      {selectedContract && (
        <ContractDetailModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  )
}

PayerContractTracking.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default PayerContractTracking
