/**
 * AccountManagement.jsx
 * 
 * MedPact Admin interface for managing accounts, organizations, and practices.
 * Allows MedPact team members to:
 * - Register new practices (single or multi-location)
 * - Create organizations (PE groups, health systems)
 * - Manage user access and roles
 * - Review practice registration requests
 * 
 * @version 1.1.0
 */

import React, { useState, useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// CONSTANTS
// ============================================================================

const ORGANIZATION_TYPES = [
  { value: 'single_practice', label: 'Single Practice', description: 'Independent practice with one location' },
  { value: 'multi_location', label: 'Multi-Location Practice', description: 'Single practice with multiple offices' },
  { value: 'pe_portfolio', label: 'PE Portfolio', description: 'Private equity firm with multiple practices' },
  { value: 'health_system', label: 'Health System', description: 'Hospital or integrated health network' },
  { value: 'mso', label: 'MSO', description: 'Management Services Organization' },
]

const SUBSCRIPTION_TIERS = [
  { value: 'trial', label: 'Trial', maxPractices: 1, maxUsers: 2, features: ['Basic Metrics', '30-Day Trial'] },
  { value: 'standard', label: 'Standard', maxPractices: 1, maxUsers: 5, features: ['All Metrics', 'Peer Benchmarking', 'Email Support'] },
  { value: 'professional', label: 'Professional', maxPractices: 5, maxUsers: 20, features: ['Everything in Standard', 'API Access', 'Priority Support'] },
  { value: 'enterprise', label: 'Enterprise', maxPractices: 999, maxUsers: 999, features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'White-Label'] },
]

const PRACTICE_TYPES = [
  { value: 'solo', label: 'Solo Practice' },
  { value: 'group', label: 'Group Practice' },
  { value: 'hospital_based', label: 'Hospital-Based' },
  { value: 'asc', label: 'Ambulatory Surgery Center' },
  { value: 'retail', label: 'Retail/Vision Center' },
]

const SPECIALTIES = [
  'Comprehensive Ophthalmology',
  'Retina',
  'Glaucoma',
  'Cornea',
  'Oculoplastics',
  'Pediatric Ophthalmology',
  'Neuro-Ophthalmology',
  'Refractive Surgery',
  'Optometry',
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]

const COLORS = {
  primary: '#1e3c72',
  secondary: '#667eea',
  success: '#059669',
  warning: '#f59e0b',
  danger: '#dc2626',
  info: '#0891b2',
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const cardStyle = {
  background: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
  border: '1px solid #e5e7eb',
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '2px solid #e5e7eb',
  fontSize: '15px',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
}

const buttonStyle = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Form field with label and validation
 */
const FormField = memo(function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  required = false,
  placeholder = '',
  error = null,
  options = null,
  helpText = null,
}) {
  const handleChange = useCallback((e) => {
    onChange(name, e.target.value)
  }, [name, onChange])

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: COLORS.danger, marginLeft: '4px' }}>*</span>}
      </label>
      
      {options ? (
        <select
          value={value || ''}
          onChange={handleChange}
          style={{
            ...inputStyle,
            borderColor: error ? COLORS.danger : '#e5e7eb',
          }}
        >
          <option value="">Select {label}...</option>
          {options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          style={{
            ...inputStyle,
            borderColor: error ? COLORS.danger : '#e5e7eb',
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: error ? COLORS.danger : '#e5e7eb',
          }}
        />
      )}
      
      {helpText && (
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p style={{ fontSize: '12px', color: COLORS.danger, marginTop: '4px', marginBottom: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
})

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.array,
  helpText: PropTypes.string,
}

/**
 * Step indicator for multi-step forms
 */
const StepIndicator = memo(function StepIndicator({ steps, currentStep }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '32px',
      gap: '8px',
    }}>
      {steps.map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '14px',
            background: index <= currentStep ? COLORS.primary : '#e5e7eb',
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
          }}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div style={{
              width: '40px',
              height: '2px',
              background: index < currentStep ? COLORS.primary : '#e5e7eb',
              margin: '0 8px',
            }} />
          )}
        </div>
      ))}
    </div>
  )
})

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
}

/**
 * Subscription tier card
 */
const TierCard = memo(function TierCard({ tier, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(tier.value)}
      style={{
        ...cardStyle,
        cursor: 'pointer',
        borderColor: selected ? COLORS.primary : '#e5e7eb',
        borderWidth: selected ? '2px' : '1px',
        background: selected ? 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)' : 'white',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: COLORS.primary, fontSize: '18px' }}>
            {tier.label}
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            Up to {tier.maxPractices === 999 ? 'Unlimited' : tier.maxPractices} practice{tier.maxPractices !== 1 ? 's' : ''} • 
            {tier.maxUsers === 999 ? 'Unlimited' : tier.maxUsers} users
          </p>
        </div>
        {selected && (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: COLORS.success,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>
            ✓
          </div>
        )}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tier.features.map(feature => (
          <span key={feature} style={{
            background: '#f3f4f6',
            color: '#374151',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
          }}>
            {feature}
          </span>
        ))}
      </div>
    </div>
  )
})

TierCard.propTypes = {
  tier: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    maxPractices: PropTypes.number.isRequired,
    maxUsers: PropTypes.number.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
}

// ============================================================================
// MAIN COMPONENTS
// ============================================================================

/**
 * Create Organization Form
 */
export const CreateOrganizationForm = memo(function CreateOrganizationForm({ onSubmit, onCancel }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    // Organization details
    name: '',
    legalName: '',
    taxId: '',
    orgType: 'single_practice',
    
    // Contact
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    billingEmail: '',
    
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Subscription
    subscriptionTier: 'standard',
  })
  const [errors, setErrors] = useState({})

  const steps = ['Organization Info', 'Contact Details', 'Subscription']

  const handleFieldChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
  }, [])

  const validateStep = useCallback((stepIndex) => {
    const newErrors = {}
    
    if (stepIndex === 0) {
      if (!formData.name) newErrors.name = 'Organization name is required'
      if (!formData.orgType) newErrors.orgType = 'Organization type is required'
    } else if (stepIndex === 1) {
      if (!formData.primaryContactName) newErrors.primaryContactName = 'Contact name is required'
      if (!formData.primaryContactEmail) newErrors.primaryContactEmail = 'Contact email is required'
      if (formData.primaryContactEmail && !formData.primaryContactEmail.includes('@')) {
        newErrors.primaryContactEmail = 'Invalid email address'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleNext = useCallback(() => {
    if (validateStep(step)) {
      setStep(prev => prev + 1)
    }
  }, [step, validateStep])

  const handleBack = useCallback(() => {
    setStep(prev => prev - 1)
  }, [])

  const handleSubmit = useCallback(() => {
    if (validateStep(step)) {
      onSubmit(formData)
    }
  }, [step, validateStep, formData, onSubmit])

  return (
    <div style={{ ...cardStyle, maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px 0', color: COLORS.primary, fontSize: '24px' }}>
        🏢 Create New Organization
      </h2>
      <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
        Register a new organization to manage practices in MedPact
      </p>

      <StepIndicator steps={steps} currentStep={step} />

      {/* Step 0: Organization Info */}
      {step === 0 && (
        <div>
          <FormField
            label="Organization Name"
            name="name"
            value={formData.name}
            onChange={handleFieldChange}
            required
            placeholder="e.g., Acme Eye Care"
            error={errors.name}
          />
          
          <FormField
            label="Legal Name"
            name="legalName"
            value={formData.legalName}
            onChange={handleFieldChange}
            placeholder="e.g., Acme Eye Care, LLC"
            helpText="Legal entity name if different from display name"
          />
          
          <FormField
            label="Tax ID (EIN)"
            name="taxId"
            value={formData.taxId}
            onChange={handleFieldChange}
            placeholder="XX-XXXXXXX"
            helpText="Federal Employer Identification Number"
          />
          
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Organization Type <span style={{ color: COLORS.danger }}>*</span>
            </label>
            <div style={{ display: 'grid', gap: '12px' }}>
              {ORGANIZATION_TYPES.map(type => (
                <div
                  key={type.value}
                  onClick={() => handleFieldChange('orgType', type.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${formData.orgType === type.value ? COLORS.primary : '#e5e7eb'}`,
                    cursor: 'pointer',
                    background: formData.orgType === type.value ? '#f0f7ff' : 'white',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                    {type.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    {type.description}
                  </div>
                </div>
              ))}
            </div>
            {errors.orgType && (
              <p style={{ fontSize: '12px', color: COLORS.danger, marginTop: '4px' }}>
                {errors.orgType}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Contact Details */}
      {step === 1 && (
        <div>
          <FormField
            label="Primary Contact Name"
            name="primaryContactName"
            value={formData.primaryContactName}
            onChange={handleFieldChange}
            required
            placeholder="John Smith"
            error={errors.primaryContactName}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField
              label="Contact Email"
              name="primaryContactEmail"
              value={formData.primaryContactEmail}
              onChange={handleFieldChange}
              type="email"
              required
              placeholder="john@example.com"
              error={errors.primaryContactEmail}
            />
            
            <FormField
              label="Contact Phone"
              name="primaryContactPhone"
              value={formData.primaryContactPhone}
              onChange={handleFieldChange}
              type="tel"
              placeholder="(555) 555-5555"
            />
          </div>
          
          <FormField
            label="Billing Email"
            name="billingEmail"
            value={formData.billingEmail}
            onChange={handleFieldChange}
            type="email"
            placeholder="billing@example.com"
            helpText="Where to send invoices (defaults to contact email)"
          />
          
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '24px', paddingTop: '24px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '16px' }}>Address</h4>
            
            <FormField
              label="Street Address"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleFieldChange}
              placeholder="123 Main St"
            />
            
            <FormField
              label="Suite/Unit"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleFieldChange}
              placeholder="Suite 100"
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleFieldChange}
                placeholder="City"
              />
              
              <FormField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleFieldChange}
                options={US_STATES}
              />
              
              <FormField
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleFieldChange}
                placeholder="12345"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Subscription */}
      {step === 2 && (
        <div>
          <p style={{ marginBottom: '20px', color: '#6b7280', fontSize: '14px' }}>
            Select a subscription tier based on the organization's needs
          </p>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {SUBSCRIPTION_TIERS.map(tier => (
              <TierCard
                key={tier.value}
                tier={tier}
                selected={formData.subscriptionTier === tier.value}
                onSelect={(value) => handleFieldChange('subscriptionTier', value)}
              />
            ))}
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
          onClick={step === 0 ? onCancel : handleBack}
          style={{
            ...buttonStyle,
            background: '#f3f4f6',
            color: '#374151',
          }}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </button>
        
        <button
          onClick={step === steps.length - 1 ? handleSubmit : handleNext}
          style={{
            ...buttonStyle,
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            color: 'white',
          }}
        >
          {step === steps.length - 1 ? 'Create Organization' : 'Continue →'}
        </button>
      </div>
    </div>
  )
})

CreateOrganizationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

/**
 * Add Practice Form
 */
export const AddPracticeForm = memo(function AddPracticeForm({ 
  organizationId, 
  organizationName,
  onSubmit, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    name: '',
    npi: '',
    taxId: '',
    specialty: '',
    practiceType: 'group',
    providerCount: '',
    annualPatientVolume: '',
    
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    cbsaId: '',
    
    ehrSystem: '',
    pmSystem: '',
    
    notes: '',
  })
  const [errors, setErrors] = useState({})

  const handleFieldChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Practice name is required'
    if (!formData.specialty) newErrors.specialty = 'Specialty is required'
    if (!formData.state) newErrors.state = 'State is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit({ ...formData, organizationId })
    }
  }, [validateForm, formData, organizationId, onSubmit])

  return (
    <div style={{ ...cardStyle, maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px 0', color: COLORS.primary, fontSize: '24px' }}>
        🏥 Add New Practice
      </h2>
      {organizationName && (
        <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
          Adding practice to: <strong>{organizationName}</strong>
        </p>
      )}

      {/* Practice Info */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '16px' }}>
          Practice Information
        </h4>
        
        <FormField
          label="Practice Name"
          name="name"
          value={formData.name}
          onChange={handleFieldChange}
          required
          placeholder="e.g., Downtown Eye Clinic"
          error={errors.name}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField
            label="NPI"
            name="npi"
            value={formData.npi}
            onChange={handleFieldChange}
            placeholder="10-digit NPI"
            helpText="National Provider Identifier"
          />
          
          <FormField
            label="Tax ID"
            name="taxId"
            value={formData.taxId}
            onChange={handleFieldChange}
            placeholder="XX-XXXXXXX"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField
            label="Specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleFieldChange}
            required
            options={SPECIALTIES}
            error={errors.specialty}
          />
          
          <FormField
            label="Practice Type"
            name="practiceType"
            value={formData.practiceType}
            onChange={handleFieldChange}
            options={PRACTICE_TYPES}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField
            label="Provider Count"
            name="providerCount"
            value={formData.providerCount}
            onChange={handleFieldChange}
            type="number"
            placeholder="Number of providers"
          />
          
          <FormField
            label="Annual Patient Volume"
            name="annualPatientVolume"
            value={formData.annualPatientVolume}
            onChange={handleFieldChange}
            type="number"
            placeholder="Approx. patients/year"
          />
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '16px' }}>
          Location
        </h4>
        
        <FormField
          label="Street Address"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleFieldChange}
          placeholder="123 Main St"
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleFieldChange}
            placeholder="City"
          />
          
          <FormField
            label="State"
            name="state"
            value={formData.state}
            onChange={handleFieldChange}
            required
            options={US_STATES}
            error={errors.state}
          />
          
          <FormField
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleFieldChange}
            placeholder="12345"
          />
        </div>
      </div>

      {/* Systems */}
      <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '16px' }}>
          Systems (Optional)
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField
            label="EHR System"
            name="ehrSystem"
            value={formData.ehrSystem}
            onChange={handleFieldChange}
            placeholder="e.g., Epic, Modernizing Medicine"
          />
          
          <FormField
            label="Practice Management"
            name="pmSystem"
            value={formData.pmSystem}
            onChange={handleFieldChange}
            placeholder="e.g., Nextech, AdvancedMD"
          />
        </div>
      </div>

      {/* Notes */}
      <FormField
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleFieldChange}
        type="textarea"
        placeholder="Any additional information about this practice..."
      />

      {/* Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
      }}>
        <button onClick={onCancel} style={{ ...buttonStyle, background: '#f3f4f6', color: '#374151' }}>
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          style={{
            ...buttonStyle,
            background: `linear-gradient(135deg, ${COLORS.success} 0%, #10b981 100%)`,
            color: 'white',
          }}
        >
          Add Practice
        </button>
      </div>
    </div>
  )
})

AddPracticeForm.propTypes = {
  organizationId: PropTypes.string,
  organizationName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Account Management Dashboard
 * Main interface for MedPact team to manage accounts and practices
 */
export function AccountManagement() {
  const [view, setView] = useState('dashboard') // 'dashboard', 'create_org', 'add_practice', 'registration_requests'
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [toast, setToast] = useState(null)

  // Mock data for demonstration
  const [organizations] = useState([
    {
      id: 'org-1',
      name: 'Vision Partners PE',
      orgType: 'pe_portfolio',
      subscriptionTier: 'enterprise',
      practiceCount: 12,
      userCount: 45,
      status: 'active',
    },
    {
      id: 'org-2',
      name: 'Coastal Eye Associates',
      orgType: 'multi_location',
      subscriptionTier: 'professional',
      practiceCount: 3,
      userCount: 15,
      status: 'active',
    },
    {
      id: 'org-3',
      name: 'Downtown Eye Clinic',
      orgType: 'single_practice',
      subscriptionTier: 'standard',
      practiceCount: 1,
      userCount: 5,
      status: 'active',
    },
  ])

  const [registrationRequests] = useState([
    {
      id: 'req-1',
      practiceName: 'Valley Vision Center',
      requestorName: 'Dr. Sarah Johnson',
      requestorEmail: 'sjohnson@valleyvision.com',
      specialty: 'Comprehensive Ophthalmology',
      providerCount: 4,
      status: 'pending',
      createdAt: '2026-03-14T10:30:00Z',
    },
    {
      id: 'req-2',
      practiceName: 'Mountain Eye Group',
      requestorName: 'Michael Chen',
      requestorEmail: 'mchen@mountaineye.com',
      specialty: 'Retina',
      providerCount: 8,
      status: 'under_review',
      createdAt: '2026-03-12T14:15:00Z',
    },
  ])

  const handleCreateOrganization = useCallback((data) => {
    console.log('Creating organization:', data)
    setToast({ message: `Organization "${data.name}" created successfully!`, type: 'success' })
    setView('dashboard')
  }, [])

  const handleAddPractice = useCallback((data) => {
    console.log('Adding practice:', data)
    setToast({ message: `Practice "${data.name}" added successfully!`, type: 'success' })
    setView('dashboard')
    setSelectedOrg(null)
  }, [])

  // Toast notification
  const Toast = ({ message, type }) => (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      background: type === 'success' ? COLORS.success : type === 'error' ? COLORS.danger : COLORS.info,
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>{message}</span>
      <button
        onClick={() => setToast(null)}
        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', padding: '4px 8px' }}
      >
        ✕
      </button>
    </div>
  )

  // Create Organization View
  if (view === 'create_org') {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {toast && <Toast message={toast.message} type={toast.type} />}
        <CreateOrganizationForm
          onSubmit={handleCreateOrganization}
          onCancel={() => setView('dashboard')}
        />
      </div>
    )
  }

  // Add Practice View
  if (view === 'add_practice') {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {toast && <Toast message={toast.message} type={toast.type} />}
        <AddPracticeForm
          organizationId={selectedOrg?.id}
          organizationName={selectedOrg?.name}
          onSubmit={handleAddPractice}
          onCancel={() => { setView('dashboard'); setSelectedOrg(null) }}
        />
      </div>
    )
  }

  // Dashboard View
  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: COLORS.primary, fontSize: '28px' }}>
          🔐 Account Management
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
          Manage organizations, practices, and user access
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{organizations.length}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Organizations</div>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>
            {organizations.reduce((sum, org) => sum + org.practiceCount, 0)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Practices</div>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>
            {organizations.reduce((sum, org) => sum + org.userCount, 0)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Users</div>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #FF6600 0%, #FF9933 100%)', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>
            {registrationRequests.filter(r => r.status === 'pending').length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Pending Requests</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => setView('create_org')}
          style={{
            ...buttonStyle,
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🏢</span> Create Organization
        </button>
        <button
          onClick={() => setView('add_practice')}
          style={{
            ...buttonStyle,
            background: `linear-gradient(135deg, ${COLORS.success} 0%, #10b981 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🏥</span> Add Practice
        </button>
      </div>

      {/* Organizations List */}
      <div style={{ ...cardStyle, marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: COLORS.primary, fontSize: '18px' }}>
          🏢 Organizations
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: 600, fontSize: '13px' }}>Organization</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: 600, fontSize: '13px' }}>Type</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontWeight: 600, fontSize: '13px' }}>Practices</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontWeight: 600, fontSize: '13px' }}>Users</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: 600, fontSize: '13px' }}>Tier</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontWeight: 600, fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(org => (
                <tr key={org.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#374151' }}>{org.name}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}>
                      {ORGANIZATION_TYPES.find(t => t.value === org.orgType)?.label || org.orgType}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 600 }}>
                    {org.practiceCount}
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                    {org.userCount}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{
                      background: org.subscriptionTier === 'enterprise' ? COLORS.primary :
                                 org.subscriptionTier === 'professional' ? COLORS.secondary :
                                 '#6b7280',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      textTransform: 'capitalize',
                    }}>
                      {org.subscriptionTier}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                    <button
                      onClick={() => { setSelectedOrg(org); setView('add_practice') }}
                      style={{
                        padding: '6px 12px',
                        background: COLORS.success,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '8px',
                      }}
                    >
                      + Practice
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Requests */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: COLORS.primary, fontSize: '18px' }}>
            📝 Registration Requests
          </h3>
          <span style={{
            background: COLORS.warning,
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            {registrationRequests.filter(r => r.status === 'pending').length} Pending
          </span>
        </div>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {registrationRequests.map(req => (
            <div key={req.id} style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '16px' }}>
                    {req.practiceName}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '13px' }}>
                    {req.requestorName} • {req.requestorEmail}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      background: '#e5e7eb',
                      color: '#374151',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}>
                      {req.specialty}
                    </span>
                    <span style={{
                      background: '#e5e7eb',
                      color: '#374151',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}>
                      {req.providerCount} providers
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{
                    background: req.status === 'pending' ? COLORS.warning : COLORS.info,
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    textTransform: 'capitalize',
                  }}>
                    {req.status.replace('_', ' ')}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '6px 12px',
                      background: COLORS.success,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}>
                      Approve
                    </button>
                    <button style={{
                      padding: '6px 12px',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}>
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

AccountManagement.propTypes = {}

export default AccountManagement
