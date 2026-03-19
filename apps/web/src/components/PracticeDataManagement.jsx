import React, { useState, useEffect, useCallback, memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { usePracticeData, DataIsolationBadge } from '../context/PracticeDataContext'
import { CSVCreator } from './CSVCreator'

// ============================================================================
// PRACTICE DATA MANAGEMENT DASHBOARD
// Manages uploads, historical data, and data isolation visibility
// ============================================================================

// Safe helpers
const safeNumber = (val, fallback = 0) => {
  const num = parseFloat(val)
  return isNaN(num) ? fallback : num
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const formatBytes = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ============================================================================
// UPLOAD HISTORY TABLE
// ============================================================================

const UploadHistoryTable = memo(function UploadHistoryTable({ uploads, onViewDetails }) {
  if (!uploads || uploads.length === 0) {
    return (
      <div style={{
        padding: 40,
        textAlign: 'center',
        color: '#6B7280',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
      }}>
        <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📁</span>
        <p style={{ margin: 0, fontSize: 16 }}>No data uploads yet</p>
        <p style={{ margin: '8px 0 0', fontSize: 14 }}>
          Upload your first file to start building your practice's historical data
        </p>
      </div>
    )
  }

  const statusColors = {
    completed: { bg: '#D1FAE5', text: '#065F46' },
    processing: { bg: '#FEF3C7', text: '#92400E' },
    pending: { bg: '#E0E7FF', text: '#3730A3' },
    error: { bg: '#FEE2E2', text: '#991B1B' },
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ backgroundColor: '#F3F4F6' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Upload Date</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>File Name</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Type</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Period</th>
            <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Records</th>
            <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Status</th>
            <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload, idx) => {
            const status = upload.status || 'pending'
            const statusStyle = statusColors[status] || statusColors.pending
            
            return (
              <tr
                key={upload.upload_id || idx}
                style={{
                  borderBottom: '1px solid #E5E7EB',
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                }}
              >
                <td style={{ padding: '12px 16px' }}>
                  {formatDate(upload.created_at)}
                </td>
                <td style={{ padding: '12px 16px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {upload.filename || 'Unknown'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: '#E0E7FF',
                    color: '#3730A3',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    {upload.file_type || 'claims'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  {upload.period_start && upload.period_end
                    ? `${formatDate(upload.period_start)} - ${formatDate(upload.period_end)}`
                    : 'Not specified'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'monospace' }}>
                  {safeNumber(upload.row_count, 0).toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => onViewDetails?.(upload)}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: 'transparent',
                      border: '1px solid #D1D5DB',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})

UploadHistoryTable.propTypes = {
  uploads: PropTypes.array,
  onViewDetails: PropTypes.func,
}

// ============================================================================
// DATA UPLOAD FORM
// ============================================================================

const DataUploadForm = memo(function DataUploadForm({ onUpload, activeUpload }) {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('claims')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [hoveredType, setHoveredType] = useState(null)
  
  const fileTypes = [
    { 
      id: 'claims', 
      name: 'Claims Data', 
      icon: '📋',
      tooltip: {
        title: 'Claims Data Upload',
        description: 'Submit your practice claims data for comprehensive revenue analysis.',
        preferredFields: [
          'Claim ID / Claim Number',
          'Date of Service (DOS)',
          'Patient ID (de-identified OK)',
          'CPT/HCPCS Procedure Code',
          'ICD-10 Diagnosis Code(s)',
          'Provider NPI',
          'Payer Name / Payer ID',
          'Billed Amount',
          'Allowed Amount',
          'Paid Amount',
          'Patient Responsibility',
          'Claim Status (Paid/Denied/Pending)',
          'Denial Code (if applicable)',
          'Place of Service',
          'Modifier(s)',
        ],
        format: 'CSV with headers',
        example: 'claim_id,dos,patient_id,cpt_code,icd10,npi,payer,billed,allowed,paid',
      }
    },
    { 
      id: 'charges', 
      name: 'Charge Master', 
      icon: '💰',
      tooltip: {
        title: 'Charge Master Upload',
        description: 'Upload your fee schedule and charge master for pricing analysis.',
        preferredFields: [
          'CPT/HCPCS Code',
          'Procedure Description',
          'Standard Charge Amount',
          'Medicare Rate (if applicable)',
          'Medicaid Rate (if applicable)',
          'Commercial Contracted Rate',
          'Effective Date',
          'Expiration Date',
          'Facility Fee (ASC/HOPD)',
          'Professional Fee',
          'Modifier Adjustments',
          'Revenue Code',
        ],
        format: 'CSV with headers',
        example: 'cpt_code,description,standard_charge,medicare_rate,effective_date',
      }
    },
    { 
      id: 'payments', 
      name: 'Payment Posting', 
      icon: '💵',
      tooltip: {
        title: 'Payment Posting Upload',
        description: 'Upload payment posting data for collection rate analysis.',
        preferredFields: [
          'Payment ID / Transaction ID',
          'Claim ID (linked to claims)',
          'Payment Date',
          'Payment Amount',
          'Payment Source (Insurance/Patient/Other)',
          'Payer Name',
          'Check/EFT Number',
          'Adjustment Amount',
          'Adjustment Reason Code',
          'Write-off Amount',
          'Patient Account Number',
          'Applied to DOS',
          'Remaining Balance',
        ],
        format: 'CSV with headers',
        example: 'payment_id,claim_id,payment_date,amount,source,payer,check_number',
      }
    },
    { 
      id: 'ar', 
      name: 'A/R Aging', 
      icon: '📊',
      tooltip: {
        title: 'A/R Aging Report Upload',
        description: 'Upload accounts receivable aging for cash flow analysis.',
        preferredFields: [
          'Account Number / Claim ID',
          'Patient ID',
          'Original DOS',
          'Payer Category',
          'Total Charges',
          'Total Payments',
          'Current Balance',
          '0-30 Days Amount',
          '31-60 Days Amount',
          '61-90 Days Amount',
          '91-120 Days Amount',
          '120+ Days Amount',
          'Last Payment Date',
          'Last Activity Date',
          'Collection Status',
        ],
        format: 'CSV with headers',
        example: 'account,patient_id,dos,payer,total_charges,balance,days_0_30,days_31_60',
      }
    },
    { 
      id: 'patients', 
      name: 'Patient Demographics', 
      icon: '👥',
      tooltip: {
        title: 'Patient Demographics Upload',
        description: 'Upload patient demographic data for population analytics.',
        preferredFields: [
          'Patient ID (de-identified OK)',
          'Date of Birth / Age',
          'Gender',
          'ZIP Code (5-digit)',
          'Primary Insurance',
          'Secondary Insurance',
          'Primary Diagnosis (ICD-10)',
          'New vs Established',
          'Last Visit Date',
          'Provider Assigned',
          'Referral Source',
          'Patient Status (Active/Inactive)',
        ],
        format: 'CSV with headers - PHI can be de-identified',
        example: 'patient_id,dob,gender,zip,primary_insurance,primary_dx,last_visit',
      }
    },
  ]
  
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile)
    }
  }, [])
  
  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }, [])
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!file) return
    
    onUpload?.(file, {
      fileType,
      periodStart: periodStart || undefined,
      periodEnd: periodEnd || undefined,
    })
  }, [file, fileType, periodStart, periodEnd, onUpload])
  
  const isUploading = activeUpload?.status === 'uploading'
  
  return (
    <form onSubmit={handleSubmit}>
      {/* File Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        style={{
          padding: 32,
          border: `2px dashed ${dragOver ? '#3B82F6' : '#D1D5DB'}`,
          borderRadius: 8,
          backgroundColor: dragOver ? '#EFF6FF' : '#F9FAFB',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: 20,
        }}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {file ? (
          <div>
            <span style={{ fontSize: 32 }}>✅</span>
            <p style={{ margin: '12px 0 0', fontWeight: 600, color: '#065F46' }}>
              {file.name}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
              {formatBytes(file.size)}
            </p>
          </div>
        ) : (
          <div>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>📤</span>
            <p style={{ margin: 0, fontWeight: 600, color: '#374151' }}>
              Drop your CSV file here
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6B7280' }}>
              or click to browse
            </p>
          </div>
        )}
      </div>
      
      {/* File Type Selection */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
          Data Type <span style={{ fontWeight: 400, color: '#6B7280', fontSize: 13 }}>(hover ℹ️ for required fields)</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {fileTypes.map(type => (
            <div key={type.id} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setFileType(type.id)}
                style={{
                  padding: '8px 16px',
                  border: `2px solid ${fileType === type.id ? '#3B82F6' : '#E5E7EB'}`,
                  borderRadius: 8,
                  backgroundColor: fileType === type.id ? '#EFF6FF' : '#FFFFFF',
                  color: fileType === type.id ? '#1D4ED8' : '#374151',
                  cursor: 'pointer',
                  fontWeight: fileType === type.id ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{type.icon}</span>
                <span>{type.name}</span>
                <span 
                  onMouseEnter={() => setHoveredType(type.id)}
                  onMouseLeave={() => setHoveredType(null)}
                  style={{ 
                    marginLeft: 4, 
                    cursor: 'help',
                    fontSize: 14,
                    opacity: 0.7,
                  }}
                >
                  ℹ️
                </span>
              </button>
              
              {/* Tooltip */}
              {hoveredType === type.id && type.tooltip && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 8,
                  width: 380,
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                  zIndex: 1000,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}>
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    left: 24,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #1F2937',
                  }} />
                  
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 600, color: '#60A5FA' }}>
                    {type.tooltip.title}
                  </h4>
                  <p style={{ margin: '0 0 12px 0', color: '#D1D5DB' }}>
                    {type.tooltip.description}
                  </p>
                  
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#34D399', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      ✓ Preferred Fields
                    </p>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '4px 12px',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}>
                      {type.tooltip.preferredFields.map((field, idx) => (
                        <span key={idx} style={{ 
                          color: '#E5E7EB', 
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <span style={{ color: '#34D399' }}>•</span> {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: 10, 
                    backgroundColor: '#374151', 
                    borderRadius: 6,
                    marginTop: 8,
                  }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#FBBF24', fontSize: 11, textTransform: 'uppercase' }}>
                      📁 Format: {type.tooltip.format}
                    </p>
                    <code style={{ 
                      display: 'block',
                      fontSize: 11, 
                      color: '#9CA3AF',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}>
                      {type.tooltip.example}
                    </code>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Period Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151', fontSize: 14 }}>
            Period Start (Optional)
          </label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              fontSize: 14,
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151', fontSize: 14 }}>
            Period End (Optional)
          </label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              fontSize: 14,
            }}
          />
        </div>
      </div>
      
      {/* Data Isolation Notice */}
      <div style={{
        padding: 16,
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>🔒</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600, color: '#92400E', fontSize: 14 }}>
            Your Data is Confidential
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#92400E' }}>
            All identified data (patient names, claim IDs, etc.) remains within your practice's
            secure boundary. Only de-identified aggregate metrics contribute to MedPact's
            normative benchmarks.
          </p>
        </div>
      </div>
      
      {/* Upload Progress */}
      {isUploading && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            height: 8,
            backgroundColor: '#E5E7EB',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div
              style={{
                width: `${activeUpload.progress || 0}%`,
                height: '100%',
                backgroundColor: '#3B82F6',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
            Uploading... {activeUpload.progress || 0}%
          </p>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || isUploading}
        style={{
          width: '100%',
          padding: '14px 24px',
          backgroundColor: !file || isUploading ? '#D1D5DB' : '#1e3c72',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          cursor: !file || isUploading ? 'not-allowed' : 'pointer',
        }}
      >
        {isUploading ? 'Uploading...' : 'Upload Practice Data'}
      </button>
    </form>
  )
})

DataUploadForm.propTypes = {
  onUpload: PropTypes.func,
  activeUpload: PropTypes.object,
}

// ============================================================================
// DATA ISOLATION EXPLAINER
// ============================================================================

const DataIsolationExplainer = memo(function DataIsolationExplainer() {
  return (
    <div style={{
      padding: 24,
      backgroundColor: '#F0F9FF',
      borderRadius: 12,
      border: '1px solid #BAE6FD',
    }}>
      <h4 style={{ margin: '0 0 16px', color: '#0C4A6E', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>🛡️</span>
        How Your Data is Protected
      </h4>
      
      <div style={{ display: 'grid', gap: 16 }}>
        {/* Identified Data */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            backgroundColor: '#FEE2E2',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            🔒
          </div>
          <div>
            <h5 style={{ margin: '0 0 4px', color: '#991B1B', fontSize: 14 }}>
              Identified Data (Practice Only)
            </h5>
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
              Patient names, claim IDs, MRNs, and all identifiable information stays within
              your practice's secure data boundary. Only your team can access this data.
            </p>
            <div style={{ marginTop: 8 }}>
              <DataIsolationBadge dataType="patients" />
            </div>
          </div>
        </div>
        
        {/* Practice Metrics */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            backgroundColor: '#FEF3C7',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            📊
          </div>
          <div>
            <h5 style={{ margin: '0 0 4px', color: '#92400E', fontSize: 14 }}>
              Practice Metrics (Aggregated)
            </h5>
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
              Aggregated metrics like NCR, Days in A/R, and denial rates are calculated from
              your data. These are stored for your historical trending and analysis.
            </p>
            <div style={{ marginTop: 8 }}>
              <DataIsolationBadge dataType="metrics_snapshots" />
            </div>
          </div>
        </div>
        
        {/* Normative Data */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            backgroundColor: '#D1FAE5',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            🌐
          </div>
          <div>
            <h5 style={{ margin: '0 0 4px', color: '#065F46', fontSize: 14 }}>
              Normative Benchmarks (De-identified)
            </h5>
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
              With your consent, only de-identified aggregate statistics (means, medians, percentiles)
              contribute to MedPact's normative database. No practice can be identified from this data.
            </p>
            <div style={{ marginTop: 8 }}>
              <DataIsolationBadge dataType="benchmarks" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PracticeDataManagement = memo(function PracticeDataManagement({ onClose }) {
  const {
    practiceId,
    currentPractice,
    uploads,
    activeUpload,
    uploadPracticeData,
    fetchUploadHistory,
    loading,
  } = usePracticeData()
  
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedUpload, setSelectedUpload] = useState(null)
  const [showCSVCreator, setShowCSVCreator] = useState(false)
  const [csvPreview, setCsvPreview] = useState(null)
  
  // Fetch upload history on mount
  useEffect(() => {
    fetchUploadHistory()
  }, [fetchUploadHistory])
  
  const tabs = [
    { id: 'upload', name: 'Upload CSV', icon: '📤' },
    { id: 'create', name: 'Create CSV', icon: '✨' },
    { id: 'history', name: 'History', icon: '📁' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
  ]
  
  // Handle CSV creation completion
  const handleCSVCreated = useCallback((result) => {
    setCsvPreview(result)
    setShowCSVCreator(false)
    setActiveTab('preview')
  }, [])
  
  // Handle upload of created CSV
  const handleUploadCreatedCSV = useCallback(() => {
    if (!csvPreview) return
    
    // Create a File object from the CSV content
    const blob = new Blob([csvPreview.csvContent], { type: 'text/csv' })
    const file = new File([blob], csvPreview.fileName, { type: 'text/csv' })
    
    uploadPracticeData(file, {
      fileType: csvPreview.schema,
      source: 'csv_creator',
      originalFile: csvPreview.originalFile,
    })
    
    setCsvPreview(null)
    setActiveTab('history')
  }, [csvPreview, uploadPracticeData])
  
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
        maxWidth: 800,
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
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: 20 }}>
              📊 Practice Data Management
            </h2>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              {currentPractice?.name || `Practice: ${practiceId}`}
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
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid #1e3c72' : '2px solid transparent',
                color: activeTab === tab.id ? '#1e3c72' : '#6B7280',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
        }}>
          {activeTab === 'upload' && (
            <DataUploadForm
              onUpload={uploadPracticeData}
              activeUpload={activeUpload}
            />
          )}
          
          {activeTab === 'create' && (
            <div>
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                border: '2px dashed #D1D5DB',
              }}>
                <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>✨</span>
                <h3 style={{ margin: '0 0 8px', color: '#374151' }}>
                  Create CSV from Your Files
                </h3>
                <p style={{ margin: '0 0 24px', color: '#6B7280', fontSize: 14, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
                  Don't have a CSV? Upload your data in any format (Excel, Word, Text) and we'll 
                  help you convert it to MedPact's required format. Review before uploading!
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                  <span style={{ background: '#E5E7EB', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}>📊 Excel (.xlsx, .xls)</span>
                  <span style={{ background: '#E5E7EB', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}>📝 Text (.txt)</span>
                  <span style={{ background: '#E5E7EB', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}>📄 Word (.docx)</span>
                  <span style={{ background: '#E5E7EB', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}>📋 CSV (.csv)</span>
                </div>
                <button
                  onClick={() => setShowCSVCreator(true)}
                  style={{
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #667eea 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>✨</span> Start CSV Creator
                </button>
              </div>
              
              {/* Recent Created CSVs */}
              <div style={{ marginTop: 24 }}>
                <h4 style={{ margin: '0 0 12px', color: '#374151', fontSize: 14 }}>
                  How it works:
                </h4>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#E0E7FF',
                      color: '#3730A3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                    }}>1</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, color: '#374151', fontSize: 14 }}>Upload any file format</p>
                      <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 13 }}>CSV, Excel, Text, or Word documents</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#E0E7FF',
                      color: '#3730A3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                    }}>2</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, color: '#374151', fontSize: 14 }}>Map your columns</p>
                      <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 13 }}>Match your data to MedPact's required fields</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#E0E7FF',
                      color: '#3730A3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                    }}>3</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, color: '#374151', fontSize: 14 }}>Review & approve</p>
                      <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 13 }}>Preview the converted data before uploading</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'preview' && csvPreview && (
            <div>
              <div style={{
                padding: 20,
                backgroundColor: '#F0FDF4',
                borderRadius: 12,
                border: '1px solid #86EFAC',
                marginBottom: 24,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 32 }}>✅</span>
                  <div>
                    <h3 style={{ margin: 0, color: '#065F46', fontSize: 18 }}>
                      CSV Created Successfully!
                    </h3>
                    <p style={{ margin: '4px 0 0', color: '#047857', fontSize: 14 }}>
                      Review your data below before uploading to MedPact
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Preview Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 16,
                marginBottom: 24,
              }}>
                <div style={{
                  padding: 16,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 8,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#374151' }}>
                    {csvPreview.rowCount}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>Total Rows</div>
                </div>
                <div style={{
                  padding: 16,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 8,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#374151', textTransform: 'capitalize' }}>
                    {csvPreview.schema}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>Data Type</div>
                </div>
                <div style={{
                  padding: 16,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 8,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', wordBreak: 'break-all' }}>
                    {csvPreview.originalFile || 'N/A'}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>Source File</div>
                </div>
              </div>
              
              {/* CSV Preview */}
              <div style={{
                marginBottom: 24,
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#F3F4F6',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: 14,
                }}>
                  📄 {csvPreview.fileName}
                </div>
                <div style={{
                  maxHeight: 300,
                  overflow: 'auto',
                  padding: 16,
                  backgroundColor: '#FAFAFA',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}>
                  {csvPreview.csvContent.split('\n').slice(0, 20).join('\n')}
                  {csvPreview.rowCount > 20 && (
                    <div style={{ color: '#9CA3AF', marginTop: 8 }}>
                      ... and {csvPreview.rowCount - 20} more rows
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    // Download the CSV
                    const blob = new Blob([csvPreview.csvContent], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = csvPreview.fileName
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  📥 Download CSV
                </button>
                <button
                  onClick={() => {
                    setCsvPreview(null)
                    setActiveTab('create')
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  ✕ Discard
                </button>
                <button
                  onClick={handleUploadCreatedCSV}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ✓ Upload to MedPact
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#374151' }}>
                  Upload History ({uploads.length} uploads)
                </h3>
                <button
                  onClick={fetchUploadHistory}
                  disabled={loading.uploads}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  {loading.uploads ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>
              <UploadHistoryTable
                uploads={uploads}
                onViewDetails={setSelectedUpload}
              />
            </div>
          )}
          
          {activeTab === 'privacy' && (
            <DataIsolationExplainer />
          )}
        </div>
        
        {/* CSV Creator Modal */}
        {showCSVCreator && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 20,
          }}>
            <div style={{
              width: '100%',
              maxWidth: 1000,
              maxHeight: '95vh',
              overflow: 'auto',
            }}>
              <CSVCreator
                onComplete={handleCSVCreated}
                onCancel={() => setShowCSVCreator(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

PracticeDataManagement.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default PracticeDataManagement
