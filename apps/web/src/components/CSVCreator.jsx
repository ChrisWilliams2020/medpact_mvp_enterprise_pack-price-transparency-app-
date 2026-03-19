/**
 * CSVCreator.jsx
 * 
 * Allows users to upload various file formats (CSV, TXT, Word, Excel) and
 * convert/map them to MedPact's required CSV format.
 * 
 * Features:
 * - Multi-format file upload (CSV, TXT, DOCX, XLSX, XLS)
 * - Column mapping interface
 * - Data preview and validation
 * - Review before final upload
 * - Download converted CSV
 * 
 * @version 1.1.0
 */

import React, { useState, useCallback, useMemo, memo, useRef } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// CONSTANTS
// ============================================================================

const COLORS = {
  primary: '#1e3c72',
  secondary: '#667eea',
  success: '#059669',
  warning: '#f59e0b',
  danger: '#dc2626',
  info: '#0891b2',
}

const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
}

// MedPact required CSV columns for different data types
const MEDPACT_SCHEMAS = {
  claims: {
    name: 'Claims Data',
    description: 'Patient claims and billing data',
    requiredColumns: [
      { key: 'claim_id', label: 'Claim ID', type: 'string', required: true },
      { key: 'patient_id', label: 'Patient ID', type: 'string', required: true },
      { key: 'date_of_service', label: 'Date of Service', type: 'date', required: true },
      { key: 'cpt_code', label: 'CPT Code', type: 'string', required: true },
      { key: 'icd10_code', label: 'ICD-10 Code', type: 'string', required: false },
      { key: 'modifier', label: 'Modifier', type: 'string', required: false },
      { key: 'units', label: 'Units', type: 'number', required: true },
      { key: 'charge_amount', label: 'Charge Amount', type: 'currency', required: true },
      { key: 'allowed_amount', label: 'Allowed Amount', type: 'currency', required: false },
      { key: 'paid_amount', label: 'Paid Amount', type: 'currency', required: true },
      { key: 'adjustment_amount', label: 'Adjustment Amount', type: 'currency', required: false },
      { key: 'payer_name', label: 'Payer Name', type: 'string', required: true },
      { key: 'payer_type', label: 'Payer Type', type: 'string', required: false },
      { key: 'provider_npi', label: 'Provider NPI', type: 'string', required: false },
      { key: 'place_of_service', label: 'Place of Service', type: 'string', required: false },
    ],
  },
  patients: {
    name: 'Patient Demographics',
    description: 'Patient demographic information',
    requiredColumns: [
      { key: 'patient_id', label: 'Patient ID', type: 'string', required: true },
      { key: 'first_name', label: 'First Name', type: 'string', required: false },
      { key: 'last_name', label: 'Last Name', type: 'string', required: false },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
      { key: 'gender', label: 'Gender', type: 'string', required: false },
      { key: 'zip_code', label: 'ZIP Code', type: 'string', required: false },
      { key: 'primary_insurance', label: 'Primary Insurance', type: 'string', required: false },
      { key: 'insurance_id', label: 'Insurance ID', type: 'string', required: false },
    ],
  },
  encounters: {
    name: 'Encounter Data',
    description: 'Patient visit and encounter records',
    requiredColumns: [
      { key: 'encounter_id', label: 'Encounter ID', type: 'string', required: true },
      { key: 'patient_id', label: 'Patient ID', type: 'string', required: true },
      { key: 'encounter_date', label: 'Encounter Date', type: 'date', required: true },
      { key: 'provider_id', label: 'Provider ID', type: 'string', required: false },
      { key: 'encounter_type', label: 'Encounter Type', type: 'string', required: false },
      { key: 'location', label: 'Location', type: 'string', required: false },
      { key: 'chief_complaint', label: 'Chief Complaint', type: 'string', required: false },
      { key: 'diagnosis_codes', label: 'Diagnosis Codes', type: 'string', required: false },
    ],
  },
  payments: {
    name: 'Payment/ERA Data',
    description: 'Electronic remittance and payment data',
    requiredColumns: [
      { key: 'payment_id', label: 'Payment ID', type: 'string', required: true },
      { key: 'claim_id', label: 'Claim ID', type: 'string', required: true },
      { key: 'payment_date', label: 'Payment Date', type: 'date', required: true },
      { key: 'payment_amount', label: 'Payment Amount', type: 'currency', required: true },
      { key: 'payer_name', label: 'Payer Name', type: 'string', required: true },
      { key: 'check_number', label: 'Check/EFT Number', type: 'string', required: false },
      { key: 'adjustment_reason', label: 'Adjustment Reason', type: 'string', required: false },
      { key: 'adjustment_amount', label: 'Adjustment Amount', type: 'currency', required: false },
    ],
  },
}

const ACCEPTED_FILE_TYPES = {
  'text/csv': '.csv',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/plain': '.txt',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Parse CSV string into array of objects
 */
function parseCSV(csvText, delimiter = ',') {
  const lines = csvText.trim().split(/\r?\n/)
  if (lines.length < 2) return { headers: [], rows: [] }
  
  // Parse header row
  const headers = parseCSVLine(lines[0], delimiter)
  
  // Parse data rows
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i], delimiter)
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }
  }
  
  return { headers, rows }
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line, delimiter = ',') {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

/**
 * Parse text file (tab-delimited or other formats)
 */
function parseTextFile(text) {
  // Try to detect delimiter
  const firstLine = text.split(/\r?\n/)[0]
  let delimiter = ','
  
  if (firstLine.includes('\t')) {
    delimiter = '\t'
  } else if (firstLine.includes('|')) {
    delimiter = '|'
  } else if (firstLine.includes(';')) {
    delimiter = ';'
  }
  
  return parseCSV(text, delimiter)
}

/**
 * Convert rows to CSV string
 */
function rowsToCSV(headers, rows) {
  const csvLines = []
  
  // Header row
  csvLines.push(headers.map(h => `"${h}"`).join(','))
  
  // Data rows
  rows.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || ''
      // Escape quotes and wrap in quotes if contains comma or quote
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csvLines.push(values.join(','))
  })
  
  return csvLines.join('\n')
}

/**
 * Validate a value against expected type
 */
function validateValue(value, type) {
  if (!value || value === '') return { valid: true, value: '' }
  
  switch (type) {
    case 'date':
      const datePattern = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$|^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/
      return { valid: datePattern.test(value), value }
    case 'number':
      const num = parseFloat(value.replace(/[,$]/g, ''))
      return { valid: !isNaN(num), value: isNaN(num) ? value : num.toString() }
    case 'currency':
      const currency = parseFloat(value.replace(/[$,]/g, ''))
      return { valid: !isNaN(currency), value: isNaN(currency) ? value : currency.toFixed(2) }
    default:
      return { valid: true, value }
  }
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * File upload dropzone
 */
const FileDropzone = memo(function FileDropzone({ onFileSelect, acceptedTypes }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }, [onFileSelect])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }, [onFileSelect])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{
        border: `2px dashed ${isDragging ? COLORS.primary : '#d1d5db'}`,
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragging ? '#f0f7ff' : '#f9fafb',
        transition: 'all 0.2s ease',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={Object.values(acceptedTypes).join(',')}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
      <h3 style={{ margin: '0 0 8px 0', color: COLORS.primary, fontSize: '18px' }}>
        Drop your file here or click to browse
      </h3>
      <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
        Supports CSV, Excel (.xlsx, .xls), Text (.txt), and Word (.docx)
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {Object.values(acceptedTypes).map(ext => (
          <span key={ext} style={{
            background: '#e5e7eb',
            color: '#374151',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
          }}>
            {ext}
          </span>
        ))}
      </div>
    </div>
  )
})

FileDropzone.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  acceptedTypes: PropTypes.object.isRequired,
}

/**
 * Schema selector
 */
const SchemaSelector = memo(function SchemaSelector({ schemas, selected, onSelect }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
        Select Data Type
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {Object.entries(schemas).map(([key, schema]) => (
          <div
            key={key}
            onClick={() => onSelect(key)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: `2px solid ${selected === key ? COLORS.primary : '#e5e7eb'}`,
              background: selected === key ? '#f0f7ff' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontWeight: 600, color: '#374151', fontSize: '14px', marginBottom: '4px' }}>
              {schema.name}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {schema.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

SchemaSelector.propTypes = {
  schemas: PropTypes.object.isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
}

/**
 * Column mapping interface
 */
const ColumnMapper = memo(function ColumnMapper({ 
  sourceColumns, 
  targetSchema, 
  mapping, 
  onMappingChange 
}) {
  const handleMappingChange = useCallback((targetKey, sourceColumn) => {
    onMappingChange(prev => ({
      ...prev,
      [targetKey]: sourceColumn,
    }))
  }, [onMappingChange])

  // Auto-suggest mappings based on column name similarity
  const suggestMapping = useCallback((targetKey, targetLabel) => {
    const targetLower = targetLabel.toLowerCase().replace(/[_\s]/g, '')
    const targetKeyLower = targetKey.toLowerCase().replace(/[_\s]/g, '')
    
    for (const source of sourceColumns) {
      const sourceLower = source.toLowerCase().replace(/[_\s]/g, '')
      if (sourceLower === targetLower || sourceLower === targetKeyLower) {
        return source
      }
      // Partial matches
      if (sourceLower.includes(targetKeyLower) || targetKeyLower.includes(sourceLower)) {
        return source
      }
    }
    return ''
  }, [sourceColumns])

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: COLORS.primary, fontSize: '18px' }}>
          Map Your Columns
        </h3>
        <button
          onClick={() => {
            const autoMapping = {}
            targetSchema.requiredColumns.forEach(col => {
              autoMapping[col.key] = suggestMapping(col.key, col.label)
            })
            onMappingChange(autoMapping)
          }}
          style={{
            padding: '8px 16px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          ✨ Auto-Map
        </button>
      </div>
      
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
        Match your file columns to MedPact's required format. Required fields are marked with *.
      </p>

      <div style={{ 
        background: '#f9fafb', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 40px 1fr',
          padding: '12px 16px',
          background: '#f3f4f6',
          fontWeight: 600,
          fontSize: '13px',
          color: '#374151',
        }}>
          <div>MedPact Field</div>
          <div></div>
          <div>Your Column</div>
        </div>
        
        {targetSchema.requiredColumns.map(col => (
          <div 
            key={col.key}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 40px 1fr',
              padding: '12px 16px',
              borderTop: '1px solid #e5e7eb',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontWeight: 500, color: '#374151' }}>
                {col.label}
                {col.required && <span style={{ color: COLORS.danger, marginLeft: '4px' }}>*</span>}
              </span>
              <span style={{ 
                fontSize: '11px', 
                color: '#9ca3af', 
                marginLeft: '8px',
                background: '#f3f4f6',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {col.type}
              </span>
            </div>
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>→</div>
            <select
              value={mapping[col.key] || ''}
              onChange={(e) => handleMappingChange(col.key, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: `2px solid ${col.required && !mapping[col.key] ? COLORS.warning : '#e5e7eb'}`,
                fontSize: '14px',
                background: 'white',
              }}
            >
              <option value="">-- Select column --</option>
              {sourceColumns.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
})

ColumnMapper.propTypes = {
  sourceColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  targetSchema: PropTypes.shape({
    requiredColumns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool,
    })).isRequired,
  }).isRequired,
  mapping: PropTypes.object.isRequired,
  onMappingChange: PropTypes.func.isRequired,
}

/**
 * Data preview table
 */
const DataPreview = memo(function DataPreview({ 
  headers, 
  rows, 
  schema, 
  validationErrors,
  maxRows = 10 
}) {
  const displayRows = rows.slice(0, maxRows)
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: COLORS.primary, fontSize: '18px' }}>
          Preview Converted Data
        </h3>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          Showing {displayRows.length} of {rows.length} rows
        </span>
      </div>

      {validationErrors.length > 0 && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontWeight: 600, color: COLORS.danger, marginBottom: '8px' }}>
            ⚠️ Validation Issues Found
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b', fontSize: '13px' }}>
            {validationErrors.slice(0, 5).map((error, i) => (
              <li key={i}>{error}</li>
            ))}
            {validationErrors.length > 5 && (
              <li>...and {validationErrors.length - 5} more issues</li>
            )}
          </ul>
        </div>
      )}

      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                #
              </th>
              {headers.map(header => {
                const colDef = schema.requiredColumns.find(c => c.key === header)
                return (
                  <th key={header} style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: 600, 
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                    whiteSpace: 'nowrap',
                  }}>
                    {colDef?.label || header}
                    {colDef?.required && <span style={{ color: COLORS.danger }}>*</span>}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ background: rowIndex % 2 === 0 ? 'white' : '#f9fafb' }}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: '#9ca3af' }}>
                  {rowIndex + 1}
                </td>
                {headers.map(header => {
                  const colDef = schema.requiredColumns.find(c => c.key === header)
                  const validation = validateValue(row[header], colDef?.type)
                  return (
                    <td 
                      key={header} 
                      style={{ 
                        padding: '10px 12px', 
                        borderBottom: '1px solid #e5e7eb',
                        color: validation.valid ? '#374151' : COLORS.danger,
                        background: validation.valid ? 'inherit' : '#fef2f2',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={row[header]}
                    >
                      {row[header] || <span style={{ color: '#d1d5db' }}>—</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

DataPreview.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  schema: PropTypes.object.isRequired,
  validationErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxRows: PropTypes.number,
}

/**
 * Step progress indicator
 */
const StepProgress = memo(function StepProgress({ steps, currentStep }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '32px',
      gap: '4px',
    }}>
      {steps.map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '14px',
            background: index < currentStep ? COLORS.success : 
                       index === currentStep ? COLORS.primary : '#e5e7eb',
            color: index <= currentStep ? 'white' : '#9ca3af',
            transition: 'all 0.3s ease',
          }}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span style={{ 
            marginLeft: '8px', 
            fontSize: '13px', 
            color: index <= currentStep ? COLORS.primary : '#9ca3af',
            fontWeight: index === currentStep ? 600 : 400,
            display: index < steps.length - 1 ? 'block' : 'none',
          }}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div style={{
              width: '60px',
              height: '2px',
              background: index < currentStep ? COLORS.success : '#e5e7eb',
              margin: '0 12px',
            }} />
          )}
        </div>
      ))}
    </div>
  )
})

StepProgress.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * CSVCreator - Main component for creating/converting CSV files
 */
export function CSVCreator({ onComplete, onCancel }) {
  const [step, setStep] = useState(0)
  const [selectedSchema, setSelectedSchema] = useState('claims')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [parsedData, setParsedData] = useState({ headers: [], rows: [] })
  const [columnMapping, setColumnMapping] = useState({})
  const [convertedData, setConvertedData] = useState({ headers: [], rows: [] })
  const [validationErrors, setValidationErrors] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const steps = ['Select Type', 'Upload File', 'Map Columns', 'Review & Download']
  const currentSchema = MEDPACT_SCHEMAS[selectedSchema]

  /**
   * Handle file selection and parsing
   */
  const handleFileSelect = useCallback(async (file) => {
    setIsProcessing(true)
    setError(null)
    setUploadedFile(file)

    try {
      const text = await file.text()
      let parsed

      // Determine file type and parse accordingly
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        parsed = parseTextFile(text)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // For Excel files, we'll use a simple CSV parsing approach
        // In production, you'd use a library like xlsx
        setError('Excel file support requires additional processing. Please export as CSV from Excel.')
        setIsProcessing(false)
        return
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        // For Word files, try to extract tabular data
        // This is a simplified approach - in production use mammoth.js or similar
        setError('Word file support requires additional processing. Please copy data to a spreadsheet and save as CSV.')
        setIsProcessing(false)
        return
      } else {
        // Try generic text parsing
        parsed = parseTextFile(text)
      }

      if (parsed.headers.length === 0) {
        setError('Could not detect any columns in the file. Please check the file format.')
      } else {
        setParsedData(parsed)
        setStep(2) // Move to mapping step
      }
    } catch (err) {
      setError(`Error reading file: ${err.message}`)
    }

    setIsProcessing(false)
  }, [])

  /**
   * Apply column mapping and convert data
   */
  const handleConvertData = useCallback(() => {
    const schema = MEDPACT_SCHEMAS[selectedSchema]
    const errors = []
    const newHeaders = schema.requiredColumns.map(col => col.key)
    
    // Check required fields are mapped
    schema.requiredColumns.forEach(col => {
      if (col.required && !columnMapping[col.key]) {
        errors.push(`Required field "${col.label}" is not mapped`)
      }
    })

    // Convert rows
    const newRows = parsedData.rows.map((sourceRow, rowIndex) => {
      const newRow = {}
      
      schema.requiredColumns.forEach(col => {
        const sourceColumn = columnMapping[col.key]
        const sourceValue = sourceColumn ? sourceRow[sourceColumn] : ''
        
        // Validate and transform value
        const validation = validateValue(sourceValue, col.type)
        newRow[col.key] = validation.value
        
        if (!validation.valid && sourceValue) {
          errors.push(`Row ${rowIndex + 1}, ${col.label}: Invalid ${col.type} value "${sourceValue}"`)
        }
        
        if (col.required && !sourceValue) {
          errors.push(`Row ${rowIndex + 1}, ${col.label}: Required value is missing`)
        }
      })
      
      return newRow
    })

    setValidationErrors(errors)
    setConvertedData({ headers: newHeaders, rows: newRows })
    setStep(3)
  }, [selectedSchema, columnMapping, parsedData])

  /**
   * Download converted CSV
   */
  const handleDownloadCSV = useCallback(() => {
    const csvContent = rowsToCSV(convertedData.headers, convertedData.rows)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `medpact_${selectedSchema}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [convertedData, selectedSchema])

  /**
   * Complete and upload to system
   */
  const handleUploadToSystem = useCallback(() => {
    const csvContent = rowsToCSV(convertedData.headers, convertedData.rows)
    onComplete({
      schema: selectedSchema,
      fileName: `medpact_${selectedSchema}_${new Date().toISOString().split('T')[0]}.csv`,
      csvContent,
      rowCount: convertedData.rows.length,
      originalFile: uploadedFile?.name,
    })
  }, [convertedData, selectedSchema, uploadedFile, onComplete])

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: SHADOWS.lg,
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: COLORS.primary, fontSize: '24px' }}>
          ✨ Create CSV from Your Data
        </h2>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
          Convert your data files to MedPact's required format
        </p>
      </div>

      {/* Step Progress */}
      <StepProgress steps={steps} currentStep={step} />

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: COLORS.danger, marginBottom: '4px' }}>Error</div>
            <div style={{ color: '#991b1b', fontSize: '14px' }}>{error}</div>
          </div>
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Step 0: Select Data Type */}
      {step === 0 && (
        <div>
          <SchemaSelector
            schemas={MEDPACT_SCHEMAS}
            selected={selectedSchema}
            onSelect={setSelectedSchema}
          />
          
          <div style={{ 
            background: '#f0f7ff', 
            borderRadius: '12px', 
            padding: '16px',
            marginBottom: '24px',
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: COLORS.primary, fontSize: '14px' }}>
              Required Fields for {currentSchema.name}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentSchema.requiredColumns.filter(c => c.required).map(col => (
                <span key={col.key} style={{
                  background: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                }}>
                  {col.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Upload File */}
      {step === 1 && (
        <div>
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={ACCEPTED_FILE_TYPES}
          />
          
          {isProcessing && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div style={{ color: '#6b7280' }}>Processing file...</div>
            </div>
          )}
          
          {uploadedFile && !isProcessing && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              background: '#f0fdf4', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '24px' }}>📄</span>
              <div>
                <div style={{ fontWeight: 600, color: '#374151' }}>{uploadedFile.name}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Map Columns */}
      {step === 2 && (
        <div>
          <div style={{ 
            background: '#f0fdf4', 
            borderRadius: '12px', 
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>✅</span>
            <div>
              <div style={{ fontWeight: 600, color: '#374151' }}>
                File parsed successfully!
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Found {parsedData.headers.length} columns and {parsedData.rows.length} rows
              </div>
            </div>
          </div>
          
          <ColumnMapper
            sourceColumns={parsedData.headers}
            targetSchema={currentSchema}
            mapping={columnMapping}
            onMappingChange={setColumnMapping}
          />
        </div>
      )}

      {/* Step 3: Review & Download */}
      {step === 3 && (
        <div>
          <DataPreview
            headers={convertedData.headers}
            rows={convertedData.rows}
            schema={currentSchema}
            validationErrors={validationErrors}
          />
          
          {/* Summary */}
          <div style={{
            background: validationErrors.length > 0 ? '#fffbeb' : '#f0fdf4',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              color: validationErrors.length > 0 ? COLORS.warning : COLORS.success,
              fontSize: '16px',
            }}>
              {validationErrors.length > 0 ? '⚠️ Review Required' : '✅ Ready to Upload'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#374151' }}>
                  {convertedData.rows.length}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Rows</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#374151' }}>
                  {convertedData.headers.length}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Columns</div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: validationErrors.length > 0 ? COLORS.warning : COLORS.success 
                }}>
                  {validationErrors.length}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Issues</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
      }}>
        <button
          onClick={() => {
            if (step === 0) {
              onCancel()
            } else {
              setStep(prev => prev - 1)
            }
          }}
          style={{
            padding: '12px 24px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </button>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {step === 3 && (
            <button
              onClick={handleDownloadCSV}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: COLORS.primary,
                border: `2px solid ${COLORS.primary}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              📥 Download CSV
            </button>
          )}
          
          <button
            onClick={() => {
              if (step === 0) {
                setStep(1)
              } else if (step === 1) {
                // File already uploaded, handled by handleFileSelect
              } else if (step === 2) {
                handleConvertData()
              } else if (step === 3) {
                handleUploadToSystem()
              }
            }}
            disabled={step === 1 && !uploadedFile}
            style={{
              padding: '12px 24px',
              background: step === 1 && !uploadedFile 
                ? '#e5e7eb' 
                : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: step === 1 && !uploadedFile ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            {step === 0 && 'Continue →'}
            {step === 1 && 'Upload File'}
            {step === 2 && 'Convert Data →'}
            {step === 3 && '✓ Upload to MedPact'}
          </button>
        </div>
      </div>
    </div>
  )
}

CSVCreator.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default CSVCreator
