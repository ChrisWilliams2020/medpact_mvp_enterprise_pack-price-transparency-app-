import React, { useState, useRef, useEffect } from 'react';
import { METRIC_PACKAGES } from '../data/metrics';
import { CPT_CODES, CBSA_REGIONS, FEATURE_DESCRIPTIONS, getCBSAByZip, getRegionalCommercialRate } from '../data/cptCodes';
import { INNOVATIONS } from '../data/innovations';
import { COMPETITOR_PRACTICES, PATIENT_HEATMAP_DATA } from '../data/competitors';
import { REGISTRATION_STEPS } from '../data/registration';
import { styles } from '../styles/theme';
import { formatValue, getScoreColor, calculateScore, getProfitColor, searchKCN, exportToCSV } from '../utils/helpers';
import { 
  loadDemoMode, 
  isDemoMode, 
  exitDemoMode,
  demoPracticeProfile,
  demoMetricValues,
  demoRevenueOpportunities,
  demoCompetitors,
  demoChatHistory,
  demoAlerts
} from '../data/demoData';

const AI_INSIGHTS = {
  revenueOptimization: [
    { id: 1, title: 'Premium IOL Conversion', impact: '$145K/year', description: 'Your premium IOL rate is 22% vs benchmark 35%.' },
    { id: 2, title: 'Reduce A/R Over 90 Days', impact: '$89K recovery', description: 'Your A/R >90 days is 18% vs benchmark 12%.' },
    { id: 3, title: 'Denial Rate Reduction', impact: '$67K/year', description: 'Your denial rate is 7.8% vs benchmark 5%.' },
    { id: 4, title: 'Patient Retention', impact: '$52K/year', description: 'Retention at 82% vs benchmark 85%.' },
  ],
  topQuartile: [
    { metric: 'Patient Satisfaction', value: '94%', icon: '😊' },
    { metric: 'First Pass Rate', value: '96%', icon: '✅' },
    { metric: 'Clean Claim Rate', value: '97%', icon: '📋' },
    { metric: 'Collection Rate', value: '98%', icon: '💰' },
  ]
};

const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2', cpc: 1.72 },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F', cpc: 1.28 },
  { id: 'google', name: 'Google Ads', icon: '🔍', color: '#4285F4', cpc: 2.85 }
];

const STAFF_MEMBERS = [
  { id: 1, name: 'Dr. Sarah Chen', role: 'Lead Ophthalmologist', email: 'sarah.chen@eyecare.com', department: 'Clinical', icon: '👩‍⚕️' },
  { id: 2, name: 'Dr. Michael Torres', role: 'Retina Specialist', email: 'michael.torres@eyecare.com', department: 'Clinical', icon: '👨‍⚕️' },
  { id: 3, name: 'Dr. Emily Watson', role: 'Optometrist', email: 'emily.watson@eyecare.com', department: 'Clinical', icon: '👩‍⚕️' },
  { id: 4, name: 'Jessica Miller', role: 'Office Manager', email: 'jessica.miller@eyecare.com', department: 'Admin', icon: '👩‍💼' },
  { id: 5, name: 'Robert Kim', role: 'Billing Specialist', email: 'robert.kim@eyecare.com', department: 'Billing', icon: '👨‍💼' },
  { id: 6, name: 'Amanda Lopez', role: 'Technician Lead', email: 'amanda.lopez@eyecare.com', department: 'Technical', icon: '👩‍🔬' },
  { id: 7, name: 'David Park', role: 'Front Desk Lead', email: 'david.park@eyecare.com', department: 'Admin', icon: '👨‍💼' },
  { id: 8, name: 'Lisa Chang', role: 'Medical Assistant', email: 'lisa.chang@eyecare.com', department: 'Clinical', icon: '👩‍⚕️' },
  { id: 9, name: 'James Wilson', role: 'Insurance Coordinator', email: 'james.wilson@eyecare.com', department: 'Billing', icon: '👨‍💼' },
  { id: 10, name: 'Maria Garcia', role: 'Patient Coordinator', email: 'maria.garcia@eyecare.com', department: 'Admin', icon: '👩‍💼' }
};

const SURVEY_TEMPLATES = {
  satisfaction: {
    name: 'Employee Satisfaction',
    icon: '😊',
    description: 'Measure overall job satisfaction and workplace happiness',
    questions: [
      { text: 'How satisfied are you with your current role?', type: 'scale', required: true },
      { text: 'Do you feel valued by your team and leadership?', type: 'scale', required: true },
      { text: 'How would you rate work-life balance at our practice?', type: 'scale', required: true },
      { text: 'Would you recommend this workplace to others?', type: 'nps', required: true },
      { text: 'What could we do to improve your work experience?', type: 'text', required: false }
    ]
  },
  workflow: {
    name: 'Workflow Efficiency',
    icon: '⚡',
    description: 'Identify bottlenecks and process improvement opportunities',
    questions: [
      { text: 'How efficient is your daily workflow?', type: 'scale', required: true },
      { text: 'Which processes slow you down the most?', type: 'multiselect', options: ['Patient check-in', 'Documentation', 'Billing/Coding', 'Communication', 'Equipment/Tech', 'Other'], required: true },
      { text: 'Do you have the tools needed to do your job effectively?', type: 'scale', required: true },
      { text: 'How much time do you spend on administrative tasks daily?', type: 'select', options: ['<1 hour', '1-2 hours', '2-3 hours', '3-4 hours', '4+ hours'], required: true },
      { text: 'What one change would most improve your efficiency?', type: 'text', required: false }
    ]
  },
  training: {
    name: 'Training Needs Assessment',
    icon: '📚',
    description: 'Identify skill gaps and professional development needs',
    questions: [
      { text: 'How confident do you feel in your current role?', type: 'scale', required: true },
      { text: 'Which areas would you like more training in?', type: 'multiselect', options: ['Clinical skills', 'Technology/EMR', 'Customer service', 'Billing/Coding', 'Leadership', 'Compliance', 'Communication'], required: true },
      { text: 'How often do you receive helpful feedback from supervisors?', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'], required: true },
      { text: 'Do you have clear career growth opportunities here?', type: 'scale', required: true },
      { text: 'What specific training would help you most?', type: 'text', required: false }
    ]
  },
  culture: {
    name: 'Workplace Culture',
    icon: '🏢',
    description: 'Assess team dynamics and organizational culture',
    questions: [
      { text: 'How well does leadership communicate with staff?', type: 'scale', required: true },
      { text: 'Do you feel comfortable sharing ideas and concerns?', type: 'scale', required: true },
      { text: 'How would you describe team collaboration?', type: 'scale', required: true },
      { text: 'Is diversity and inclusion valued at our practice?', type: 'scale', required: true },
      { text: 'What aspects of our culture should we preserve or change?', type: 'text', required: false }
    ]
  },
  technology: {
    name: 'Technology Assessment',
    icon: '💻',
    description: 'Evaluate technology tools and digital readiness',
    questions: [
      { text: 'How satisfied are you with our current EMR system?', type: 'scale', required: true },
      { text: 'Which technology tools cause the most frustration?', type: 'multiselect', options: ['EMR/EHR', 'Scheduling software', 'Billing system', 'Communication tools', 'Diagnostic equipment', 'Patient portal'], required: true },
      { text: 'How comfortable are you with new technology adoption?', type: 'scale', required: true },
      { text: 'Do you receive adequate tech support when needed?', type: 'scale', required: true },
      { text: 'What technology improvements would help you most?', type: 'text', required: false }
    ]
  },
  burnout: {
    name: 'Burnout & Wellbeing',
    icon: '🧘',
    description: 'Monitor staff wellbeing and prevent burnout',
    questions: [
      { text: 'How often do you feel overwhelmed by your workload?', type: 'select', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
      { text: 'Do you feel emotionally drained from work?', type: 'scale', required: true },
      { text: 'Are you able to take breaks during your workday?', type: 'select', options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'], required: true },
      { text: 'How supported do you feel by management?', type: 'scale', required: true },
      { text: 'What would help reduce stress in your role?', type: 'text', required: false }
    ]
  }
};

const SAVED_SURVEYS = [
  { id: 1, title: 'Q1 2026 Staff Satisfaction', category: 'satisfaction', status: 'completed', responses: 8, total: 10, date: 'Mar 15, 2026', score: 4.2 },
  { id: 2, title: 'Workflow Efficiency Audit', category: 'workflow', status: 'completed', responses: 10, total: 10, date: 'Feb 28, 2026', score: 3.8 },
  { id: 3, title: 'New EMR Feedback', category: 'technology', status: 'active', responses: 5, total: 10, date: 'Mar 20, 2026', score: null },
  { id: 4, title: 'Annual Training Needs', category: 'training', status: 'draft', responses: 0, total: 0, date: 'Mar 25, 2026', score: null }
];

const EMR_TEMPLATES = {
  patient_demographics: {
    name: 'Patient Demographics',
    icon: '👤',
    description: 'Basic patient information including contact details',
    fields: [
      { name: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { name: 'ssn', label: 'SSN (Last 4)', type: 'text', required: false },
      { name: 'phone', label: 'Phone', type: 'phone', required: true },
      { name: 'email', label: 'Email', type: 'email', required: false },
      { name: 'address', label: 'Street Address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true },
      { name: 'zip', label: 'ZIP Code', type: 'text', required: true },
      { name: 'insurance_id', label: 'Insurance ID', type: 'text', required: false },
      { name: 'insurance_name', label: 'Insurance Name', type: 'text', required: false }
    ],
    sampleData: [
      { patient_id: 'P001', first_name: 'John', last_name: 'Smith', dob: '1965-03-15', gender: 'Male', phone: '555-123-4567', email: 'john.smith@email.com', address: '123 Main St', city: 'Philadelphia', state: 'PA', zip: '19103' }
    ]
  },
  encounter_data: {
    name: 'Encounter/Visit Data',
    icon: '📋',
    description: 'Patient visit records with diagnoses and procedures',
    fields: [
      { name: 'encounter_id', label: 'Encounter ID', type: 'text', required: true },
      { name: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { name: 'visit_date', label: 'Visit Date', type: 'date', required: true },
      { name: 'provider_id', label: 'Provider ID', type: 'text', required: true },
      { name: 'provider_name', label: 'Provider Name', type: 'text', required: false },
      { name: 'visit_type', label: 'Visit Type', type: 'select', options: ['New Patient', 'Follow-up', 'Procedure', 'Emergency'], required: true },
      { name: 'chief_complaint', label: 'Chief Complaint', type: 'text', required: false },
      { name: 'icd10_primary', label: 'Primary ICD-10', type: 'text', required: true },
      { name: 'icd10_secondary', label: 'Secondary ICD-10', type: 'text', required: false },
      { name: 'cpt_codes', label: 'CPT Codes', type: 'text', required: true },
      { name: 'modifiers', label: 'Modifiers', type: 'text', required: false },
      { name: 'units', label: 'Units', type: 'number', required: false },
      { name: 'location', label: 'Service Location', type: 'select', options: ['Office', 'ASC', 'Hospital', 'Telehealth'], required: true }
    ],
    sampleData: [
      { encounter_id: 'E001', patient_id: 'P001', visit_date: '2026-03-15', provider_id: 'DR001', provider_name: 'Dr. Chen', visit_type: 'Procedure', chief_complaint: 'Cataract', icd10_primary: 'H25.11', cpt_codes: '66984', modifiers: 'RT', location: 'ASC' }
    ]
  },
  billing_claims: {
    name: 'Billing & Claims',
    icon: '💰',
    description: 'Insurance claims and payment information',
    fields: [
      { name: 'claim_id', label: 'Claim ID', type: 'text', required: true },
      { name: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { name: 'encounter_id', label: 'Encounter ID', type: 'text', required: true },
      { name: 'dos', label: 'Date of Service', type: 'date', required: true },
      { name: 'cpt_code', label: 'CPT Code', type: 'text', required: true },
      { name: 'icd10', label: 'ICD-10 Code', type: 'text', required: true },
      { name: 'billed_amount', label: 'Billed Amount', type: 'currency', required: true },
      { name: 'allowed_amount', label: 'Allowed Amount', type: 'currency', required: false },
      { name: 'paid_amount', label: 'Paid Amount', type: 'currency', required: false },
      { name: 'patient_responsibility', label: 'Patient Responsibility', type: 'currency', required: false },
      { name: 'payer_name', label: 'Payer Name', type: 'text', required: true },
      { name: 'payer_id', label: 'Payer ID', type: 'text', required: false },
      { name: 'claim_status', label: 'Claim Status', type: 'select', options: ['Submitted', 'Pending', 'Paid', 'Denied', 'Appealed'], required: true },
      { name: 'denial_reason', label: 'Denial Reason', type: 'text', required: false },
      { name: 'submission_date', label: 'Submission Date', type: 'date', required: false },
      { name: 'payment_date', label: 'Payment Date', type: 'date', required: false }
    ],
    sampleData: [
      { claim_id: 'CLM001', patient_id: 'P001', encounter_id: 'E001', dos: '2026-03-15', cpt_code: '66984', icd10: 'H25.11', billed_amount: '2500.00', allowed_amount: '1850.00', paid_amount: '1480.00', payer_name: 'Blue Cross', claim_status: 'Paid' }
    ]
  },
  provider_productivity: {
    name: 'Provider Productivity',
    icon: '👨‍⚕️',
    description: 'Provider metrics, wRVUs, and productivity data',
    fields: [
      { name: 'provider_id', label: 'Provider ID', type: 'text', required: true },
      { name: 'provider_name', label: 'Provider Name', type: 'text', required: true },
      { name: 'specialty', label: 'Specialty', type: 'text', required: true },
      { name: 'report_period', label: 'Report Period', type: 'text', required: true },
      { name: 'total_encounters', label: 'Total Encounters', type: 'number', required: true },
      { name: 'new_patients', label: 'New Patients', type: 'number', required: false },
      { name: 'total_wrvu', label: 'Total wRVU', type: 'number', required: true },
      { name: 'surgeries_performed', label: 'Surgeries Performed', type: 'number', required: false },
      { name: 'total_charges', label: 'Total Charges', type: 'currency', required: true },
      { name: 'total_collections', label: 'Total Collections', type: 'currency', required: true },
      { name: 'avg_patients_per_day', label: 'Avg Patients/Day', type: 'number', required: false },
      { name: 'no_show_rate', label: 'No-Show Rate %', type: 'percentage', required: false }
    ],
    sampleData: [
      { provider_id: 'DR001', provider_name: 'Dr. Sarah Chen', specialty: 'Ophthalmology', report_period: 'Mar 2026', total_encounters: 245, new_patients: 48, total_wrvu: 312.5, surgeries_performed: 32, total_charges: '425000', total_collections: '368000' }
    ]
  },
  inventory_supplies: {
    name: 'Inventory & Supplies',
    icon: '📦',
    description: 'Medical supplies, IOLs, and equipment tracking',
    fields: [
      { name: 'item_id', label: 'Item ID', type: 'text', required: true },
      { name: 'item_name', label: 'Item Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['IOL', 'Surgical Supply', 'Medication', 'Equipment', 'Office Supply'], required: true },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text', required: false },
      { name: 'model_number', label: 'Model/Part Number', type: 'text', required: false },
      { name: 'quantity_on_hand', label: 'Quantity on Hand', type: 'number', required: true },
      { name: 'reorder_level', label: 'Reorder Level', type: 'number', required: false },
      { name: 'unit_cost', label: 'Unit Cost', type: 'currency', required: true },
      { name: 'expiration_date', label: 'Expiration Date', type: 'date', required: false },
      { name: 'location', label: 'Storage Location', type: 'text', required: false },
      { name: 'last_ordered', label: 'Last Ordered', type: 'date', required: false }
    ],
    sampleData: [
      { item_id: 'IOL001', item_name: 'AcrySof IQ Toric', category: 'IOL', manufacturer: 'Alcon', model_number: 'SN6AT3', quantity_on_hand: 12, reorder_level: 5, unit_cost: '350.00' }
    ]
  },
  quality_metrics: {
    name: 'Quality Metrics & Outcomes',
    icon: '✅',
    description: 'Clinical outcomes, satisfaction scores, and quality measures',
    fields: [
      { name: 'metric_id', label: 'Metric ID', type: 'text', required: true },
      { name: 'metric_name', label: 'Metric Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Clinical Outcome', 'Patient Safety', 'Patient Experience', 'Efficiency', 'Cost'], required: true },
      { name: 'measurement_period', label: 'Measurement Period', type: 'text', required: true },
      { name: 'numerator', label: 'Numerator', type: 'number', required: true },
      { name: 'denominator', label: 'Denominator', type: 'number', required: true },
      { name: 'rate', label: 'Rate/Percentage', type: 'percentage', required: true },
      { name: 'benchmark', label: 'Benchmark', type: 'percentage', required: false },
      { name: 'target', label: 'Target', type: 'percentage', required: false },
      { name: 'trend', label: 'Trend', type: 'select', options: ['Improving', 'Stable', 'Declining'], required: false }
    ],
    sampleData: [
      { metric_id: 'QM001', metric_name: 'Cataract Surgery Success Rate', category: 'Clinical Outcome', measurement_period: 'Q1 2026', numerator: 148, denominator: 150, rate: '98.7', benchmark: '95.0', trend: 'Stable' }
    ]
  }
};

const FILE_FORMAT_SUPPORT = {
  csv: { name: 'CSV', icon: '📊', extensions: ['.csv'], description: 'Comma-separated values' },
  excel: { name: 'Excel', icon: '📗', extensions: ['.xlsx', '.xls'], description: 'Microsoft Excel workbooks' },
  text: { name: 'Text/TSV', icon: '📄', extensions: ['.txt', '.tsv'], description: 'Tab or delimiter-separated' },
  json: { name: 'JSON', icon: '🔧', extensions: ['.json'], description: 'JavaScript Object Notation' },
  xml: { name: 'XML/HL7', icon: '🏥', extensions: ['.xml', '.hl7'], description: 'Healthcare interchange formats' }
};

const COMMON_FIELD_MAPPINGS = {
  // Patient identifiers
  'patient_id': ['patientid', 'patient_id', 'pt_id', 'mrn', 'medical_record_number', 'id', 'patient_number', 'chart_number'],
  'first_name': ['firstname', 'first_name', 'fname', 'first', 'patient_first', 'given_name'],
  'last_name': ['lastname', 'last_name', 'lname', 'last', 'patient_last', 'family_name', 'surname'],
  'dob': ['dob', 'date_of_birth', 'dateofbirth', 'birth_date', 'birthdate', 'birthday'],
  'gender': ['gender', 'sex', 'patient_gender', 'patient_sex'],
  'phone': ['phone', 'telephone', 'phone_number', 'phonenumber', 'mobile', 'cell', 'contact_phone'],
  'email': ['email', 'email_address', 'emailaddress', 'e_mail', 'patient_email'],
  'address': ['address', 'street', 'street_address', 'address1', 'address_line_1', 'patient_address'],
  'city': ['city', 'patient_city', 'town'],
  'state': ['state', 'patient_state', 'province', 'st'],
  'zip': ['zip', 'zipcode', 'zip_code', 'postal_code', 'postalcode'],
  
  // Clinical data
  'visit_date': ['visit_date', 'visitdate', 'dos', 'date_of_service', 'service_date', 'encounter_date', 'appt_date'],
  'provider_name': ['provider_name', 'providername', 'physician', 'doctor', 'attending', 'provider'],
  'cpt_code': ['cpt_code', 'cptcode', 'cpt', 'procedure_code', 'proc_code', 'service_code'],
  'icd10': ['icd10', 'icd_10', 'icd10_code', 'diagnosis_code', 'dx_code', 'icd'],
  
  // Billing data
  'billed_amount': ['billed_amount', 'billedamount', 'charges', 'charge_amount', 'total_charges', 'billed'],
  'paid_amount': ['paid_amount', 'paidamount', 'payment', 'payment_amount', 'collected', 'reimbursement'],
  'payer_name': ['payer_name', 'payername', 'insurance', 'insurance_name', 'carrier', 'payer']
};

// Add this AI analysis function after the generateAIQuestions function:

const analyzeUploadedData = (data, headers) => {
  const suggestions = [];
  const detectedMappings = {};
  
  // Analyze each header
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Find matching template field
    for (const [templateField, aliases] of Object.entries(COMMON_FIELD_MAPPINGS)) {
      if (aliases.some(alias => normalizedHeader.includes(alias) || alias.includes(normalizedHeader))) {
        detectedMappings[header] = templateField;
        break;
      }
    }
  });
  
  // Generate suggestions based on data patterns
  if (data.length > 0) {
    const sampleRow = data[0];
    
    headers.forEach(header => {
      const value = sampleRow[header];
      if (!value) return;
      
      // Detect date patterns
      if (/^\d{4}-\d{2}-\d{2}/.test(value) || /^\d{2}\/\d{2}\/\d{4}/.test(value)) {
        if (!detectedMappings[header]) {
          suggestions.push({
            type: 'date_detected',
            field: header,
            message: `"${header}" appears to contain dates. Consider mapping to a date field.`,
            icon: '📅'
          });
        }
      }
      
      // Detect currency patterns
      if (/^\$?[\d,]+\.?\d{0,2}$/.test(value) && parseFloat(value.replace(/[$,]/g, '')) > 10) {
        if (!detectedMappings[header]) {
          suggestions.push({
            type: 'currency_detected',
            field: header,
            message: `"${header}" appears to contain currency values.`,
            icon: '💰'
          });
        }
      }
      
      // Detect CPT codes
      if (/^\d{5}$/.test(value)) {
        suggestions.push({
          type: 'cpt_detected',
          field: header,
          message: `"${header}" may contain CPT codes (5-digit format detected).`,
          icon: '🏥'
        });
      }
      
      // Detect ICD-10 codes
      if (/^[A-Z]\d{2}\.?\d{0,2}$/.test(value)) {
        suggestions.push({
          type: 'icd10_detected',
          field: header,
          message: `"${header}" appears to contain ICD-10 diagnosis codes.`,
          icon: '🩺'
        });
      }
    });
    
    // Check for missing required fields
    const hasPatientId = Object.values(detectedMappings).includes('patient_id');
    const hasDate = Object.values(detectedMappings).some(m => m.includes('date'));
    
    if (!hasPatientId) {
      suggestions.push({
        type: 'missing_field',
        message: 'No patient identifier detected. Consider adding a Patient ID column.',
        icon: '⚠️'
      });
    }
    
    if (!hasDate) {
      suggestions.push({
        type: 'missing_field',
        message: 'No date field detected. Dates are important for tracking and reporting.',
        icon: '⚠️'
      });
    }
  }
  
  // Suggest best matching template
  const templateScores = {};
  Object.entries(EMR_TEMPLATES).forEach(([templateId, template]) => {
    let score = 0;
    template.fields.forEach(field => {
      if (Object.values(detectedMappings).includes(field.name)) {
        score += field.required ? 2 : 1;
      }
    });
    templateScores[templateId] = score;
  });
  
  const bestTemplate = Object.entries(templateScores).sort((a, b) => b[1] - a[1])[0];
  if (bestTemplate && bestTemplate[1] > 0) {
    suggestions.unshift({
      type: 'template_match',
      templateId: bestTemplate[0],
      message: `Best match: ${EMR_TEMPLATES[bestTemplate[0]].name} template (${bestTemplate[1]} fields matched)`,
      icon: '✨'
    });
  }
  
  return { detectedMappings, suggestions };
};

const parseCSVContent = (content) => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return { headers: [], data: [] };
  
  // Detect delimiter
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const pipeCount = (firstLine.match(/\|/g) || []).length;
  
  let delimiter = ',';
  if (tabCount > commaCount && tabCount > pipeCount) delimiter = '\t';
  if (pipeCount > commaCount && pipeCount > tabCount) delimiter = '|';
  
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const data = lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i] || '';
      return obj;
    }, {});
  });
  
  return { headers, data, delimiter };
};

const generateCSVFromTemplate = (template, data) => {
  const headers = template.fields.map(f => f.name);
  const headerRow = headers.join(',');
  
  const dataRows = data.map(row => {
    return headers.map(h => {
      const value = row[h] || '';
      // Escape commas and quotes
      if (value.includes(',') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

export default function Benchmarks() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [practiceProfile, setPracticeProfile] = useState(() => {
    try { 
      const s = localStorage.getItem('medpact_profile'); 
      return s ? JSON.parse(s) : null; 
    } catch { 
      return null; 
    }
  });
  const [regStep, setRegStep] = useState(0);
  const [regAnswers, setRegAnswers] = useState({});
  const [showRegistration, setShowRegistration] = useState(!practiceProfile);
  const [selectedPackage, setSelectedPackage] = useState('practice_9');
  const [metricValues, setMetricValues] = useState(() => {
    try { 
      const s = localStorage.getItem('medpact_metrics'); 
      return s ? JSON.parse(s) : {}; 
    } catch { 
      return {}; 
    }
  });
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Welcome to KCN Intelligence! I can help you understand your practice metrics, identify opportunities, and answer questions about benchmarks. What would you like to know?' }
  ]);
  const [zipCode, setZipCode] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);
  const chatEndRef = useRef(null);
  const [cptFilter, setCptFilter] = useState('all');
  const [innovationFilter, setInnovationFilter] = useState('all');
  const [practiceTypeFilter, setPracticeTypeFilter] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showIntelModal, setShowIntelModal] = useState(false);
  const [importedData, setImportedData] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [demoMode, setDemoMode] = useState(isDemoMode());
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { 
      role: 'assistant', 
      content: `👋 Welcome to KCN Intelligence Assistant! I'm here to help you with:

**📊 Application Help**
• Navigate features and understand metrics
• Interpret your benchmark comparisons
• Export reports and data

**💰 Revenue Optimization**
• Identify revenue leakage opportunities
• Optimize payer mix strategies
• Premium service conversion tactics

**📋 Coding & Billing**
• CPT code selection guidance
• Modifier usage and compliance
• Documentation requirements

**🔄 Revenue Cycle Management**
• Reduce denial rates
• Improve collections
• A/R management strategies

What would you like to explore today?`
    }
  ]);
  const [surveyMode, setSurveyMode] = useState('list'); // 'list', 'create', 'preview', 'results'
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyCategory, setSurveyCategory] = useState('satisfaction');
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload', 'create', 'map', 'preview', 'templates'
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [fieldMappings, setFieldMappings] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [manualEntryData, setManualEntryData] = useState([]);
  const [csvPreview, setCsvPreview] = useState(null);

  useEffect(() => { 
    if (practiceProfile) localStorage.setItem('medpact_profile', JSON.stringify(practiceProfile)); 
  }, [practiceProfile]);
  
  useEffect(() => { 
    localStorage.setItem('medpact_metrics', JSON.stringify(metricValues)); 
  }, [metricValues]);
  
  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [chatMessages]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true' && !demoMode) {
      handleSkipDemo();
    }
  }, []);

  useEffect(() => {
    if (demoMode && chatMessages.length === 1) {
      setChatMessages(demoChatHistory);
    }
  }, [demoMode]);

  const handleRegNext = () => {
    if (regStep < REGISTRATION_STEPS.length - 1) {
      setRegStep(regStep + 1);
    } else { 
      setPracticeProfile({ ...regAnswers, createdAt: new Date().toISOString() }); 
      setShowRegistration(false); 
    }
  };

  const getKCNResponse = (question) => {
    const q = question.toLowerCase();
    
    // Application Help
    if (q.includes('how to') || q.includes('where') || q.includes('navigate') || q.includes('find') || q.includes('use')) {
      if (q.includes('dashboard')) {
        return `📊 **Dashboard Tab Guide**

The Dashboard displays your key practice metrics compared to industry benchmarks:

1. **Metric Cards** - Each card shows:
   • Your current value
   • Industry benchmark
   • Performance indicator (green = above, red = below)

2. **How to Use:**
   • Click any metric card to see detailed trends
   • Use the package selector to switch metric categories
   • Values are auto-saved to your profile

3. **Quick Actions:**
   • Export dashboard data via the Export tab
   • Set alerts for specific thresholds in Alerts tab

Would you like me to explain any specific metric?`;
      }
      if (q.includes('cpt') || q.includes('price') || q.includes('code')) {
        return `💰 **CPT Codes / Price Transparency Tab**

This feature helps you understand reimbursement rates:

1. **Regional Lookup:**
   • Enter your ZIP code to see local commercial rates
   • Rates are based on actual CMS Price Transparency data

2. **Three Rate Columns:**
   • 🟢 Medicare - CMS fee schedule rates
   • 🟡 Medicaid - ~80% of Medicare (varies by state)
   • 🟣 Commercial - Actual negotiated rates (NOT Medicare multipliers)

3. **Category Filters:**
   • Filter by procedure type (Cataract, Glaucoma, etc.)

4. **Blended Rate Calculator:**
   • See weighted average based on your payer mix

Try entering ZIP code 19103 (Philadelphia) or 94102 (San Francisco) to see regional differences!`;
      }
    }
    
    // Revenue Optimization
    if (q.includes('revenue') || q.includes('profit') || q.includes('money') || q.includes('increase') || q.includes('opportunity')) {
      if (q.includes('premium') || q.includes('iol') || q.includes('lens')) {
        return `💎 **Premium IOL Conversion Strategy**

**Current Benchmark:** Top practices achieve 35-45% premium IOL conversion

**Revenue Impact:**
• Each premium upgrade = $1,500-$2,500 additional revenue
• 100 cataract cases/month × 10% improvement = $150K-$250K annual increase

**Proven Tactics:**

1. **Patient Education**
   • Pre-surgery video explaining IOL options
   • Visual aids showing vision simulation
   • Patient testimonials from premium IOL recipients

2. **Staff Training**
   • Counselors trained in lifestyle assessment
   • Scripts for addressing cost objections
   • Financial options presentation

3. **Process Optimization**
   • Dedicated consultation time for IOL discussion
   • Follow-up call 48 hours before surgery
   • Post-op satisfaction surveys for testimonials

4. **Financial Accessibility**
   • CareCredit and Alphaeon financing
   • HSA/FSA payment education
   • Price transparency upfront

Would you like specific scripts for patient conversations?`;
      }
      if (q.includes('denial') || q.includes('rejected') || q.includes('claim')) {
        return `🚫 **Denial Reduction Strategy**

**Industry Benchmark:** <4% denial rate | **Top Performers:** <2%

**Common Denial Reasons in Ophthalmology:**

1. **Medical Necessity (35% of denials)**
   • Solution: Robust documentation templates
   • Include visual acuity, functional impairment
   • Use LCD/NCD compliant language

2. **Authorization Issues (25%)**
   • Implement real-time eligibility checks
   • Track prior auth requirements by payer
   • Automated auth status tracking

3. **Coding Errors (20%)**
   • Regular coder education on updates
   • Audit high-volume codes quarterly
   • Modifier usage review

4. **Timely Filing (10%)**
   • Daily charge entry monitoring
   • Automated filing deadline alerts
   • Same-day charge capture goals

**Quick Win:** Implement a pre-billing audit on your top 10 CPT codes - typically catches 60% of preventable denials.

Want me to analyze your specific denial patterns?`;
      }
      return `💰 **Revenue Optimization Overview**

Based on typical ophthalmology practices, here are the highest-impact opportunities:

**🔴 High Priority (Quick Wins)**
| Opportunity | Potential Impact |
|-------------|------------------|
| Premium IOL Conversion | +$150-300K/year |
| Denial Rate Reduction | +$50-100K/year |
| A/R Days Improvement | +$30-60K/year |

**🟡 Medium Priority**
| Opportunity | Potential Impact |
|-------------|------------------|
| Charge Capture | +$25-50K/year |
| Patient Recall Compliance | +$40-80K/year |
| Ancillary Service Expansion | +$50-100K/year |

**🟢 Long-term Strategy**
| Opportunity | Potential Impact |
|-------------|------------------|
| Payer Contract Negotiation | +5-15% rates |
| ASC Utilization | +$100-200K/year |
| Referral Network Expansion | +20% volume |

Which area would you like to explore in detail?`;
    }
    
    // Coding & Billing
    if (q.includes('code') || q.includes('coding') || q.includes('cpt') || q.includes('modifier') || q.includes('billing')) {
      if (q.includes('66984') || q.includes('cataract')) {
        return `👁️ **CPT 66984 - Cataract Surgery Coding Guide**

**Code:** 66984 - Extracapsular cataract removal with insertion of IOL, 1 stage

**2025 Medicare Rate:** $535.47 (national average)

**Documentation Requirements:**
✅ Pre-operative visual acuity
✅ Functional impairment documentation
✅ Lens opacity description (grading scale)
✅ Surgical technique details
✅ IOL power and model

**Common Modifier Usage:**
• -RT / -LT (Right/Left eye)
• -24 (Unrelated E/M during post-op)
• -25 (Significant, separate E/M same day)
• -59 (Distinct procedural service)

**Billing Tips:**
1. Bill 66984 with modifier RT or LT
2. IOL is included in facility fee
3. Premium IOL: Bill V2788 separately to patient
4. Post-op visits included in global period (90 days)

**Common Denials:**
• Missing medical necessity documentation
• Incorrect modifier usage
• Duplicate billing for global period services

Need guidance on complex cataract (66982) or MIGS add-ons?`;
      }
      if (q.includes('modifier')) {
        return `🏷️ **Ophthalmology Modifier Guide**

**Most Common Modifiers:**

| Modifier | Description | When to Use |
|----------|-------------|-------------|
| -RT/-LT | Right/Left eye | Every eye-specific procedure |
| -25 | Significant E/M | Same-day E/M before procedure |
| -24 | Unrelated E/M | E/M during global period |
| -59 | Distinct procedure | Separate services same session |
| -79 | Unrelated procedure | Surgery during global period |
| -XE | Separate encounter | Distinct encounter modifier |
| -XS | Separate structure | Different anatomical site |
| -76 | Repeat procedure | Same physician, same day |
| -77 | Repeat procedure | Different physician, same day |

**Common Mistakes:**
❌ Using -59 when -XE/XS is more appropriate
❌ Missing -25 on E/M with minor procedure
❌ Forgetting laterality modifiers

**Pro Tip:** CMS prefers X-modifiers (XE, XP, XS, XU) over -59 when applicable.

Want details on any specific modifier?`;
      }
      return `📋 **Coding & Billing Resources**

I can help with coding questions for ophthalmology procedures:

**Surgical Codes:**
• 66984 - Standard cataract surgery
• 66982 - Complex cataract surgery
• 67028 - Intravitreal injection
• 65855 - Laser trabeculoplasty
• 66170 - Trabeculectomy

**E/M Codes:**
• 92004/92014 - Comprehensive eye exams
• 92002/92012 - Intermediate eye exams

**Diagnostic Codes:**
• 92134 - OCT retina
• 92133 - OCT optic nerve
• 92083 - Visual field

**What I can help with:**
• Documentation requirements
• Modifier usage
• Medical necessity criteria
• Global period rules
• Bundling/unbundling guidance

What specific code or billing question do you have?`;
    }
    
    // Revenue Cycle Management
    if (q.includes('rcm') || q.includes('revenue cycle') || q.includes('collection') || q.includes('a/r') || q.includes('ar') || q.includes('aging')) {
      return `🔄 **Revenue Cycle Management Overview**

**Key RCM Metrics & Benchmarks:**

| Metric | Your Goal | Top Quartile |
|--------|-----------|--------------|
| Days in A/R | <35 | <28 |
| Clean Claim Rate | >95% | >98% |
| Denial Rate | <5% | <3% |
| Collection Rate | >96% | >98% |
| Cost to Collect | <4% | <3% |

**RCM Improvement Framework:**

1. **📥 Patient Access**
   • Insurance verification
   • Prior authorization
   • Financial counseling

2. **📝 Charge Capture**
   • Same-day charge entry
   • Coding accuracy
   • Documentation compliance

3. **📤 Claims Management**
   • Claim scrubbing
   • Timely submission
   • Rejection handling

4. **💵 Payment Posting**
   • ERA automation
   • Variance identification
   • Adjustment review

5. **📞 Follow-Up**
   • Denial management
   • Appeals process
   • Patient collections

Which area of your revenue cycle needs the most attention?`;
    }
    
    // Default response
    return `I'd be happy to help! I can assist with:

**📊 Application Help**
Ask me "How do I use the dashboard?" or "Where do I find CPT codes?"

**💰 Revenue Optimization**
Ask about "premium IOL strategies" or "reducing denials"

**📋 Coding & Billing**
Ask about specific CPT codes like "66984 documentation" or "modifier usage"

**🔄 Revenue Cycle**
Ask about "A/R management" or "collection strategies"

**📈 Benchmarks**
Ask "How do I compare to benchmarks?" or "What metrics should I focus on?"

What would you like to explore?`;
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    const assistantResponse = { role: 'assistant', content: getKCNResponse(chatInput) };
    
    setChatHistory(prev => [...prev, userMessage, assistantResponse]);
    setChatInput('');
  };

  const toggleCompare = (comp) => {
    if (compareList.find(c => c.id === comp.id)) {
      setCompareList(compareList.filter(c => c.id !== comp.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, comp]);
    }
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split('\n').filter(l => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return headers.reduce((obj, h, i) => ({ ...obj, [h]: values[i] || '' }), {});
      });
      setImportedData(data);
    };
    reader.readAsText(file);
  };

  const exportMetrics = () => {
    const pkg = METRIC_PACKAGES[selectedPackage];
    const data = pkg.metrics.map(m => ({ 
      metric: m.title, 
      value: metricValues[m.key] || '', 
      benchmark: m.benchmark, 
      unit: m.unit 
    }));
    exportToCSV(data, 'medpact_metrics.csv');
  };

  const handleSkipDemo = () => {
    const demoData = loadDemoMode();
    setPracticeProfile(demoData.profile);
    setMetricValues(demoData.metrics);
    setChatMessages(demoData.chatHistory);
    setDemoMode(true);
    setShowRegistration(false);
  };

  const handleExitDemo = () => {
    exitDemoMode();
    setDemoMode(false);
    setPracticeProfile(null);
    setMetricValues({});
    setChatMessages([{ role: 'assistant', content: 'Welcome to KCN Intelligence!' }]);
    setShowRegistration(true);
    setRegStep(0);
    setRegAnswers({});
  };

  const handleResetDemo = () => {
    const demoData = loadDemoMode();
    setPracticeProfile(demoData.profile);
    setMetricValues(demoData.metrics);
    setChatMessages(demoData.chatHistory);
    setActiveTab('dashboard');
  };

  const filteredCompetitors = practiceTypeFilter === 'all' 
    ? (demoMode ? demoCompetitors : COMPETITOR_PRACTICES)
    : (demoMode ? demoCompetitors : COMPETITOR_PRACTICES).filter(c => c.type === practiceTypeFilter);

  const currentInsights = demoMode ? {
    revenueOptimization: demoRevenueOpportunities.map(o => ({
      id: o.id,
      title: o.title,
      impact: '$' + (o.potentialRevenue / 1000).toFixed(0) + 'K/year',
      description: o.description,
      priority: o.priority
    })),
    topQuartile: AI_INSIGHTS.topQuartile
  } : AI_INSIGHTS;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'ai', label: 'AI Insights', icon: '🤖' },
    { id: 'competitors', label: 'Competitors', icon: '🎯' },
    { id: 'heatmap', label: 'Heat Map', icon: '🗺️' },
    { id: 'cpt', label: 'CPT Codes', icon: '💰' },
    { id: 'chat', label: 'KCN Chat', icon: '💬' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'forecasting', label: 'Forecasting', icon: '📈' },
    { id: 'quality', label: 'Quality', icon: '✅' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'upload', label: 'Data Upload', icon: '📁' },
    { id: 'consultant', label: 'Consultant', icon: '🧑‍💼' },
    { id: 'export', label: 'Export', icon: '📤' },
    { id: 'social', label: 'Marketing', icon: '📱' }
  ];

  // Registration Wizard
  if (showRegistration) {
    const step = REGISTRATION_STEPS[regStep];
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>👁️</div>
              <span style={styles.logoText}>MedPact</span>
              <span style={styles.version}>v3.2</span>
            </div>
          </div>
        </header>
        
        <div style={{ ...styles.main, maxWidth: '600px' }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: styles.pageTitle.color }}>
                Welcome to MedPact
              </h2>
            </div>
            
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: ((regStep + 1) / REGISTRATION_STEPS.length * 100) + '%' }} />
            </div>
            
            <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 24px' }}>
              Step {regStep + 1} of {REGISTRATION_STEPS.length}
            </p>
            
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: styles.pageTitle.color }}>
              {step.question}
            </h3>
            
            {step.type === 'text' && (
              <input 
                type="text" 
                style={styles.input} 
                placeholder={step.placeholder} 
                value={regAnswers[step.id] || ''} 
                onChange={e => setRegAnswers(p => ({ ...p, [step.id]: e.target.value }))} 
              />
            )}
            
            {step.type === 'number' && (
              <input 
                type="number" 
                style={styles.input} 
                placeholder={step.placeholder} 
                value={regAnswers[step.id] || ''} 
                onChange={e => setRegAnswers(p => ({ ...p, [step.id]: e.target.value }))} 
              />
            )}
            
            {step.type === 'select' && (
              <select 
                style={styles.select} 
                value={regAnswers[step.id] || ''} 
                onChange={e => setRegAnswers(p => ({ ...p, [step.id]: e.target.value }))}
              >
                <option value="">Select...</option>
                {step.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
            
            {step.type === 'multiselect' && (
              <div style={styles.multiSelect}>
                {step.options.map(o => (
                  <div 
                    key={o} 
                    onClick={() => { 
                      const curr = regAnswers[step.id] || []; 
                      setRegAnswers(p => ({ 
                        ...p, 
                        [step.id]: curr.includes(o) ? curr.filter(x => x !== o) : [...curr, o] 
                      })); 
                    }} 
                    style={{ 
                      ...styles.multiSelectOption, 
                      background: (regAnswers[step.id] || []).includes(o) 
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                        : 'rgba(99,102,241,0.1)', 
                      color: (regAnswers[step.id] || []).includes(o) ? 'white' : '#666' 
                    }}
                  >
                    {o}
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {regStep > 0 && (
                <button 
                  onClick={() => setRegStep(regStep - 1)} 
                  style={{...styles.button, ...styles.secondaryBtn, flex: 1}}
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleRegNext} 
                style={{...styles.button, ...styles.primaryBtn, flex: 1}}
              >
                {regStep === REGISTRATION_STEPS.length - 1 ? 'Complete' : 'Continue'}
              </button>
            </div>
            
            <button 
              onClick={handleSkipDemo}
              style={{ 
                width: '100%', 
                marginTop: '16px', 
                padding: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              🎭 Launch Demo Mode
            </button>
            
            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#888' }}>
              Perfect for sales presentations and exploring features
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>👁️</div>
            <span style={styles.logoText}>MedPact</span>
            <span style={styles.version}>v3.2</span>
          </div>
          <nav style={styles.nav}>
            {tabs.map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)} 
                style={{
                  ...styles.navBtn, 
                  ...(activeTab === t.id ? styles.navBtnActive : styles.navBtnInactive)
                }}
              >
                <span style={{marginRight:'6px'}}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {demoMode && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🎭</span>
            <div>
              <strong style={{ fontSize: '14px' }}>Demo Mode Active</strong>
              <span style={{ marginLeft: '12px', opacity: 0.9, fontSize: '13px' }}>
                Showing sample data for "{practiceProfile?.name}"
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleResetDemo} style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '13px'
            }}>
              🔄 Reset
            </button>
            <button onClick={handleExitDemo} style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '13px'
            }}>
              ✕ Exit Demo
            </button>
          </div>
        </div>
      )}

      {showIntelModal && selectedCompetitor && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowIntelModal(false)}>
          <div style={{...styles.card, maxWidth: '600px', width: '90%'}} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '24px'}}>
              <h2 style={{fontSize: '24px', fontWeight: '700', color: styles.pageTitle.color}}>
                {selectedCompetitor.name}
              </h2>
              <button onClick={() => setShowIntelModal(false)} 
                style={{background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer'}}>
                ×
              </button>
            </div>
            {selectedCompetitor.strengths && (
              <div style={{...styles.metricCard, marginBottom: '16px'}}>
                <h4 style={{color: '#10b981', marginBottom: '12px'}}>💪 Strengths</h4>
                {selectedCompetitor.strengths.map((s, i) => (
                  <div key={i} style={{padding: '4px 0', color: '#666'}}>• {s}</div>
                ))}
              </div>
            )}
            {selectedCompetitor.weaknesses && (
              <div style={styles.metricCard}>
                <h4 style={{color: '#ef4444', marginBottom: '12px'}}>⚠️ Weaknesses</h4>
                {selectedCompetitor.weaknesses.map((w, i) => (
                  <div key={i} style={{padding: '4px 0', color: '#666'}}>• {w}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <main style={styles.main}>
        {activeTab === 'dashboard' && (
          <>
            <h1 style={styles.pageTitle}>Practice Intelligence Dashboard</h1>
            <p style={styles.pageSubtitle}>
              {practiceProfile?.name || 'Demo'} • {METRIC_PACKAGES[selectedPackage]?.name}
            </p>
            
            {demoMode && (
              <div style={{ marginBottom: '24px' }}>
                {demoAlerts.slice(0, 2).map(alert => (
                  <div key={alert.id} style={{
                    padding: '12px 16px', marginBottom: '8px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: alert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                               alert.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102,241, 0.1)',
                    border: `1px solid ${alert.type === 'warning' ? '#f59e0b' : alert.type === 'success' ? '#10b981' : '#6366f1'}`
                  }}>
                    <span style={{ fontSize: '18px' }}>
                      {alert.type === 'warning' ? '⚠️' : alert.type === 'success' ? '✅' : 'ℹ️'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: styles.pageTitle.color }}>{alert.title}</strong>
                      <span style={{ marginLeft: '8px', color: '#666', fontSize: '13px' }}>{alert.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>📦 Select Metric Package</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {Object.entries(METRIC_PACKAGES).map(([k, v]) => (
                  <button key={k} onClick={() => setSelectedPackage(k)} style={{
                    ...styles.button, ...(selectedPackage === k ? styles.primaryBtn : styles.secondaryBtn)
                  }}>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={styles.grid}>
              {METRIC_PACKAGES[selectedPackage]?.metrics?.map(m => {
                const val = demoMode ? demoMetricValues[m.key] : metricValues[m.key];
                const score = calculateScore(val, m.benchmark);
                return (
                  <div key={m.key} style={styles.metricCard}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                      <div>
                        <span style={{fontSize: '20px', marginRight: '8px'}}>{m.icon}</span>
                        <span style={{fontWeight: '600', color: styles.pageTitle.color}}>{m.title}</span>
                      </div>
                      {score && (
                        <span style={{...styles.badge, background: getScoreColor(score) + '22', color: getScoreColor(score)}}>
                          {score}%
                        </span>
                      )}
                    </div>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                      <input 
                        type="number" 
                        placeholder="Value" 
                        value={val || ''} 
                        onChange={e => setMetricValues(p => ({...p, [m.key]: parseFloat(e.target.value) || ''}))} 
                        style={{...styles.input, flex: 1}}
                        disabled={demoMode}
                      />
                      <div style={{textAlign: 'right', minWidth: '80px'}}>
                        <div style={{fontSize: '12px', color: '#888'}}>Benchmark</div>
                        <div style={{fontWeight: '600', color: '#6366f1'}}>{formatValue(m.benchmark, m.unit)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'ai' && (
          <>
            <h1 style={styles.pageTitle}>🤖 AI-Powered Insights</h1>
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>🏆 Top Quartile Performance</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px'}}>
                {currentInsights.topQuartile.map((item, i) => (
                  <div key={i} style={{textAlign: 'center', padding: '20px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px'}}>
                    <div style={{fontSize: '32px', marginBottom: '8px'}}>{item.icon}</div>
                    <div style={{fontSize: '24px', fontWeight: '700', color: '#10b981'}}>{item.value}</div>
                    <div style={{fontSize: '13px', color: '#666'}}>{item.metric}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>💰 Revenue Opportunities</div>
              <div style={{marginBottom: '16px', padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px'}}>
                <span style={{fontSize: '24px', fontWeight: '700', color: '#10b981'}}>
                  ${demoMode ? '391,000' : '301,000'}
                </span>
                <span style={{marginLeft: '8px', color: '#666'}}>Total Annual Opportunity</span>
              </div>
              {currentInsights.revenueOptimization.map(item => (
                <div key={item.id} style={{...styles.metricCard, marginBottom: '12px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <h4 style={{fontWeight: '600', color: styles.pageTitle.color}}>{item.title}</h4>
                    <span style={{...styles.badge, background: 'rgba(16,185,129,0.2)', color: '#10b981'}}>{item.impact}</span>
                  </div>
                  <p style={{fontSize: '13px', color: '#666'}}>{item.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'competitors' && (
          <>
            <h1 style={styles.pageTitle}>Competitive Intelligence</h1>
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>🔍 Filter</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {['all', 'ophthalmology', 'optometry', 'retina'].map(f => (
                  <button key={f} onClick={() => setPracticeTypeFilter(f)} style={{
                    ...styles.button, ...(practiceTypeFilter === f ? styles.primaryBtn : styles.secondaryBtn)
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.grid}>
              {filteredCompetitors.map(comp => (
                <div key={comp.id} style={styles.competitorCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                    <div>
                      <span style={{...styles.badge, background: 'rgba(99,102,241,0.2)', color: '#6366f1', marginBottom: '8px', display: 'inline-block'}}>
                        {comp.type}
                      </span>
                      <h3 style={{fontSize: '18px', fontWeight: '600', color: styles.pageTitle.color}}>{comp.name}</h3>
                      <p style={{color: '#888', fontSize: '12px'}}>{comp.distance} miles away</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '24px', fontWeight: '700', color: '#f59e0b'}}>{comp.rating}⭐</div>
                      <div style={{color: '#888', fontSize: '11px'}}>{comp.reviews} reviews</div>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button onClick={() => toggleCompare(comp)} style={{
                      ...styles.button, 
                      ...(compareList.find(c => c.id === comp.id) ? {background: '#ef4444', color: 'white', border: 'none'} : styles.secondaryBtn), 
                      flex: 1
                    }}>
                      {compareList.find(c => c.id === comp.id) ? '✓ Comparing' : '+ Compare'}
                    </button>
                    <button onClick={() => {setSelectedCompetitor(comp); setShowIntelModal(true);}} 
                      style={{...styles.button, ...styles.primaryBtn, flex: 1}}>
                      🔍 Intel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'heatmap' && (
          <>
            <h1 style={styles.pageTitle}>Patient Location Heat Map</h1>
            <div style={styles.card}>
              <div style={styles.cardTitle}>🗺️ ZIP Code Profit Map</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px'}}>
                {PATIENT_HEATMAP_DATA.sort((a, b) => b.profitIndex - a.profitIndex).map(zip => (
                  <div key={zip.zip} style={{
                    background: getProfitColor(zip.profitIndex) + '22',
                    border: '1px solid ' + getProfitColor(zip.profitIndex),
                    padding: '12px', borderRadius: '8px'
                  }}>
                    <div style={{fontWeight: '700', color: getProfitColor(zip.profitIndex), fontSize: '16px'}}>{zip.zip}</div>
                    <div style={{fontSize: '11px', color: '#888'}}>{zip.name}</div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px'}}>
                      <span>👥 {zip.patients}</span>
                      <span style={{fontWeight: '600', color: getProfitColor(zip.profitIndex)}}>{zip.profitIndex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'cpt' && (
          <>
            <h1 style={styles.pageTitle}>💰 Price Transparency</h1>
            <p style={styles.pageSubtitle}>Compare Medicare, Medicaid, and Commercial reimbursement rates by region</p>
            
            {/* ZIP Code Lookup */}
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>📍 Regional Rate Lookup</div>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
                Enter your ZIP code to see commercial rates specific to your area (powered by Mathematica Price Transparency data)
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <input
                    type="text"
                    placeholder="Enter ZIP code (e.g., 19103, 94102)"
                    value={zipCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                      setZipCode(value);
                      if (value.length === 5) {
                        setSelectedRegion(getCBSAByZip(value));
                      } else {
                        setSelectedRegion(null);
                      }
                    }}
                    style={{
                      ...styles.input,
                      width: '100%',
                      fontSize: '16px',
                      padding: '12px 16px'
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (zipCode.length === 5) {
                      setSelectedRegion(getCBSAByZip(zipCode));
                    }
                  }}
                  style={{...styles.button, ...styles.primaryBtn, padding: '12px 24px'}}
                >
                  🔍 Look Up Rates
                </button>
              </div>
              
              {selectedRegion && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                  borderRadius: '12px',
                  border: '1px solid rgba(99,102,241,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: styles.pageTitle.color }}>
                        📍 {selectedRegion.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>
                        {selectedRegion.state} • CBSA {selectedRegion.cbsaCode || 'National'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#6366f1' }}>
                          {selectedRegion.commercialMultiplier}x
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>Commercial/Medicare</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                          {selectedRegion.gpciWork?.toFixed(3) || '1.000'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>GPCI Work</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                          {selectedRegion.gpciPE?.toFixed(3) || '1.000'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>GPCI PE</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                {['all', ...new Set(CPT_CODES.map(c => c.category))].map(c => (
                  <button key={c} onClick={() => setCptFilter(c)} style={{
                    ...styles.button, ...(cptFilter === c ? styles.primaryBtn : styles.secondaryBtn)
                  }}>
                    {c === 'all' ? 'All Categories' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Rate Legend with Tooltips */}
            <div style={{...styles.card, marginBottom: '24px', padding: '16px'}}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { color: '#10b981', label: 'Medicare', tooltip: FEATURE_DESCRIPTIONS.medicareRate },
                  { color: '#f59e0b', label: 'Medicaid (~80% of Medicare)', tooltip: FEATURE_DESCRIPTIONS.medicaidRate },
                  { color: '#6366f1', label: selectedRegion ? `Commercial (${selectedRegion.name.split('-')[0]})` : 'Commercial (National Avg)', tooltip: FEATURE_DESCRIPTIONS.commercialRate }
                ].map((item, i) => (
                  <div 
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'help', position: 'relative' }}
                    onMouseEnter={() => setHoveredTooltip(`legend-${i}`)}
                    onMouseLeave={() => setHoveredTooltip(null)}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: item.color }}></div>
                    <span style={{ fontSize: '13px', color: '#666' }}>{item.label}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>ℹ️</span>
                    
                    {hoveredTooltip === `legend-${i}` && (
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#1a1a2e',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        width: '280px',
                        zIndex: 1000,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        marginBottom: '8px'
                      }}>
                        {item.tooltip}
                        <div style={{
                          position: 'absolute',
                          bottom: '-6px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: '6px solid #1a1a2e'
                        }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CPT Codes Table */}
            <div style={styles.card}>
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th 
                        style={{...styles.th, cursor: 'help', position: 'relative'}}
                        onMouseEnter={() => setHoveredTooltip('header-cpt')}
                        onMouseLeave={() => setHoveredTooltip(null)}
                      >
                        CPT Code ℹ️
                        {hoveredTooltip === 'header-cpt' && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            background: '#1a1a2e',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            width: '250px',
                            zIndex: 1000,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            marginTop: '8px',
                            fontWeight: 'normal',
                            textAlign: 'left'
                          }}>
                            {FEATURE_DESCRIPTIONS.cptCode}
                          </div>
                        )}
                      </th>
                      <th style={styles.th}>Description</th>
                      <th 
                        style={{...styles.th, cursor: 'help', position: 'relative'}}
                        onMouseEnter={() => setHoveredTooltip('header-category')}
                        onMouseLeave={() => setHoveredTooltip(null)}
                      >
                        Category ℹ️
                        {hoveredTooltip === 'header-category' && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            background: '#1a1a2e',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            width: '220px',
                            zIndex: 1000,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            marginTop: '8px',
                            fontWeight: 'normal',
                            textAlign: 'left'
                          }}>
                            {FEATURE_DESCRIPTIONS.category}
                          </div>
                        )}
                      </th>
                      <th 
                        style={{...styles.th, background: 'rgba(16,185,129,0.1)', color: '#10b981', cursor: 'help', position: 'relative'}}
                        onMouseEnter={() => setHoveredTooltip('header-medicare')}
                        onMouseLeave={() => setHoveredTooltip(null)}
                      >
                        Medicare ℹ️
                        {hoveredTooltip === 'header-medicare' && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            background: '#1a1a2e',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            width: '280px',
                            zIndex: 1000,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            marginTop: '8px',
                            fontWeight: 'normal',
                            textAlign: 'left'
                          }}>
                            {FEATURE_DESCRIPTIONS.medicareRate}
                          </div>
                        )}
                      </th>
                      <th 
                        style={{...styles.th, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', cursor: 'help', position: 'relative'}}
                        onMouseEnter={() => setHoveredTooltip('header-medicaid')}
                        onMouseLeave={() => setHoveredTooltip(null)}
                      >
                        Medicaid ℹ️
                        {hoveredTooltip === 'header-medicaid' && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            background: '#1a1a2e',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            width: '260px',
                            zIndex: 1000,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            marginTop: '8px',
                            fontWeight: 'normal',
                            textAlign: 'left'
                          }}>
                            {FEATURE_DESCRIPTIONS.medicaidRate}
                          </div>
                        )}
                      </th>
                      <th 
                        style={{...styles.th, background: 'rgba(99,102,241,0.1)', color: '#6366f1', cursor: 'help', position: 'relative'}}
                        onMouseEnter={() => setHoveredTooltip('header-commercial')}
                        onMouseLeave={() => setHoveredTooltip(null)}
                      >
                        {selectedRegion && selectedRegion.name !== 'National Average' ? `Commercial (${selectedRegion.name.split('-')[0]})` : 'Commercial'} ℹ️
                        {hoveredTooltip === 'header-commercial' && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            background: '#1a1a2e',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            width: '280px',
                            zIndex: 1000,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            marginTop: '8px',
                            fontWeight: 'normal',
                            textAlign: 'left'
                          }}>
                            {FEATURE_DESCRIPTIONS.commercialRate}
                            {selectedRegion && selectedRegion.name !== 'National Average' && (
                              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                <strong>Regional Multiplier:</strong> {selectedRegion.commercialMultiplier}x Medicare
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                      <th 
                        style={{...styles.th, cursor: 'help', position: 'relative'}}
                        onMouseEnter={() => setHoveredTooltip('header-wrvu')}
                        onMouseLeave={() => setHoveredTooltip(null)}
                      >
                        wRVU ℹ️
                        {hoveredTooltip === 'header-wrvu' && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            background: '#1a1a2e',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            width: '280px',
                            zIndex: 1000,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            marginTop: '8px',
                            fontWeight: 'normal',
                            textAlign: 'left'
                          }}>
                            {FEATURE_DESCRIPTIONS.wRVU}
                          </div>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(cptFilter === 'all' ? CPT_CODES : CPT_CODES.filter(c => c.category === cptFilter)).map(c => {
                      const regionalRate = selectedRegion && selectedRegion.name !== 'National Average' && c.medicareRate > 0 
                        ? (c.medicareRate * selectedRegion.commercialMultiplier).toFixed(2)
                        : c.commercialRate.toFixed(2);
                      
                      return (
                        <tr key={c.code} style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                          <td style={{...styles.td, fontFamily: 'monospace', fontWeight: '600', color: '#6366f1'}}>{c.code}</td>
                          <td 
                            style={{...styles.td, maxWidth: '250px', cursor: 'help', position: 'relative'}}
                            onMouseEnter={() => setHoveredTooltip(`desc-${c.code}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                          >
                            {c.description}
                            {hoveredTooltip === `desc-${c.code}` && (
                              <div style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '0',
                                background: '#1a1a2e',
                                color: 'white',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                width: '300px',
                                zIndex: 1000,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                marginBottom: '8px'
                              }}>
                                <strong>{c.code}</strong>: {c.description}
                                <div style={{ marginTop: '8px', color: '#888' }}>
                                  Category: {c.category} | wRVU: {c.wRVU}
                                </div>
                              </div>
                            )}
                          </td>
                          <td style={styles.td}>
                            <span style={{...styles.badge, background: 'rgba(99,102,241,0.2)', color: '#6366f1'}}>{c.category}</span>
                          </td>
                          <td style={{...styles.td, fontWeight: '600', color: '#10b981', background: 'rgba(16,185,129,0.05)'}}>
                            {c.medicareRate > 0 ? `$${c.medicareRate.toFixed(2)}` : '—'}
                          </td>
                          <td style={{...styles.td, fontWeight: '600', color: '#f59e0b', background: 'rgba(245,158,11,0.05)'}}>
                            {c.medicaidRate > 0 ? `$${c.medicaidRate.toFixed(2)}` : '—'}
                          </td>
                          <td style={{...styles.td, fontWeight: '600', color: '#6366f1', background: 'rgba(99,102,241,0.05)'}}>
                            {selectedRegion && selectedRegion.name !== 'National Average' && c.medicareRate > 0 ? (
                              <div>
                                <div>${regionalRate}</div>
                                <div style={{ fontSize: '10px', color: '#888' }}>
                                  (Nat'l: ${c.commercialRate.toFixed(2)})
                                </div>
                              </div>
                            ) : (
                              c.commercialRate > 0 ? `$${c.commercialRate.toFixed(2)}` : '—'
                            )}
                          </td>
                          <td style={styles.td}>{c.wRVU > 0 ? c.wRVU : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regional Comparison */}
            <div style={{...styles.card, marginTop: '24px'}}>
              <div style={styles.cardTitle}>🗺️ Regional Rate Comparison</div>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
                Compare commercial rate multipliers across major metro areas (click to view rates)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {Object.entries(CBSA_REGIONS)
                  .filter(([code]) => code !== '00000')
                  .sort((a, b) => b[1].commercialMultiplier - a[1].commercialMultiplier)
                  .map(([code, region]) => (
                    <div 
                      key={code}
                      onClick={() => {
                        if (region.zipCodes[0]) {
                          setZipCode(region.zipCodes[0]);
                          setSelectedRegion({ ...region, cbsaCode: code });
                        }
                      }}
                      style={{
                        padding: '16px',
                        background: selectedRegion?.cbsaCode === code 
                          ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))'
                          : 'rgba(99,102,241,0.05)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        border: selectedRegion?.cbsaCode === code 
                          ? '2px solid #6366f1'
                          : '1px solid rgba(99,102,241,0.1)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: styles.pageTitle.color, marginBottom: '4px' }}>
                        {region.name.split('-')[0]}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{region.state}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#6366f1' }}>
                          {region.commercialMultiplier}x
                        </span>
                        <span style={{
                          ...styles.badge,
                          background: region.commercialMultiplier >= 3 ? 'rgba(239,68,68,0.2)' : 
                                     region.commercialMultiplier >= 2.5 ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                          color: region.commercialMultiplier >= 3 ? '#ef4444' : 
                                region.commercialMultiplier >= 2.5 ? '#f59e0b' : '#10b981',
                          fontSize: '10px'
                        }}>
                          {region.commercialMultiplier >= 3 ? 'High Cost' : 
                           region.commercialMultiplier >= 2.5 ? 'Above Avg' : 'Average'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'chat' && (
          <>
            <h1 style={styles.pageTitle}>💬 KCN Intelligence Assistant</h1>
            <p style={styles.pageSubtitle}>
              AI-powered guidance for practice optimization, coding, billing, and revenue cycle management
            </p>
            
            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { label: '📊 App Help', query: 'How do I use the dashboard?' },
                { label: '💰 Revenue Tips', query: 'What are my revenue opportunities?' },
                { label: '📋 Coding Help', query: 'Help me with CPT coding' },
                { label: '🔄 RCM Guide', query: 'How can I improve my revenue cycle?' },
                { label: '📈 Benchmarks', query: 'Explain my benchmark comparisons' }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatInput(action.query);
                    setTimeout(() => {
                      const userMessage = { role: 'user', content: action.query };
                      const assistantResponse = { role: 'assistant', content: getKCNResponse(action.query) };
                      setChatHistory(prev => [...prev, userMessage, assistantResponse]);
                      setChatInput('');
                    }, 100);
                  }}
                  style={{
                    ...styles.button,
                    ...styles.secondaryBtn,
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div style={{
              ...styles.card,
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden'
            }}>
              {/* Chat Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      gap: '12px'
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0
                      }}>
                        🤖
                      </div>
                    )}
                    <div style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(99,102,241,0.1)',
                      color: msg.role === 'user' ? 'white' : styles.pageTitle.color,
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(99,102,241,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0
                      }}>
                        👤
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(99,102,241,0.2)',
                display: 'flex',
                gap: '12px'
              }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder="Ask about coding, billing, benchmarks, or app features..."
                  style={{
                    ...styles.input,
                    flex: 1,
                    padding: '12px 16px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={handleChatSubmit}
                  style={{
                    ...styles.button,
                    ...styles.primaryBtn,
                    padding: '12px 24px'
                  }}
                >
                  Send 📤
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'staff' && (
          <>
            <h1 style={styles.pageTitle}>👥 Staff Intelligence & Surveys</h1>
            
            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {[
                { id: 'overview', label: '📊 Overview', active: surveyMode === 'list' && !currentSurvey },
                { id: 'create', label: '➕ Create Survey', active: surveyMode === 'create' },
                { id: 'results', label: '📈 Results', active: surveyMode === 'results' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'overview') { setSurveyMode('list'); setCurrentSurvey(null); }
                    else if (tab.id === 'create') { 
                      setSurveyMode('create'); 
                      setCurrentSurvey(null);
                      setSurveyQuestions([]);
                      setSelectedStaff([]);
                      setSurveyTitle('');
                      setSurveyCategory('satisfaction');
                    }
                    else if (tab.id === 'results') { setSurveyMode('results'); }
                  }}
                  style={{
                    ...styles.button,
                    ...(tab.active ? styles.primaryBtn : styles.secondaryBtn)
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Survey List View */}
            {surveyMode === 'list' && !currentSurvey && (
              <>
                {/* Staff Overview Cards */}
                <div style={styles.grid}>
                  {STAFF_MEMBERS.slice(0, 6).map((staff, i) => (
                    <div key={i} style={styles.metricCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '36px' }}>{staff.icon}</div>
                        <div>
                          <h3 style={{ fontWeight: '600', color: styles.pageTitle.color }}>{staff.name}</h3>
                          <p style={{ fontSize: '12px', color: '#888' }}>{staff.role}</p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ padding: '8px', background: 'rgba(16,185,129,0.1)', borderRadius: '6px' }}>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                            {Math.floor(Math.random() * 10) + 90}%
                          </div>
                          <div style={{ fontSize: '11px', color: '#888' }}>Satisfaction</div>
                        </div>
                        <div style={{ padding: '8px', background: 'rgba(99,102,241,0.1)', borderRadius: '6px' }}>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1' }}>
                            {Math.floor(Math.random() * 3) + 1}/{3}
                          </div>
                          <div style={{ fontSize: '11px', color: '#888' }}>Surveys</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Surveys */}
                <div style={{ ...styles.card, marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={styles.cardTitle}>📋 Recent Surveys</div>
                    <button 
                      onClick={() => {
                        setSurveyMode('create');
                        setSurveyQuestions([]);
                        setSelectedStaff([]);
                        setSurveyTitle('');
                      }}
                      style={{ ...styles.button, ...styles.primaryBtn }}
                    >
                      ➕ Create New Survey
                    </button>
                  </div>
                  
                  {SAVED_SURVEYS.map(survey => (
                    <div 
                      key={survey.id}
                      onClick={() => setCurrentSurvey(survey)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: 'rgba(99,102,241,0.05)',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        cursor: 'pointer',
                        border: '1px solid rgba(99,102,241,0.1)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '32px' }}>{SURVEY_TEMPLATES[survey.category]?.icon}</div>
                        <div>
                          <h3 style={{ fontWeight: '600', color: styles.pageTitle.color }}>{survey.title}</h3>
                          <p style={{ fontSize: '12px', color: '#888' }}>
                            {survey.date} • {SURVEY_TEMPLATES[survey.category]?.name}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: styles.pageTitle.color }}>
                            {survey.responses}/{survey.total} responses
                          </div>
                          {survey.score && (
                            <div style={{ fontSize: '12px', color: '#10b981' }}>
                              Avg Score: {survey.score}/5
                            </div>
                          )}
                        </div>
                        <span style={{
                          ...styles.badge,
                          background: survey.status === 'completed' ? 'rgba(16,185,129,0.2)' :
                                     survey.status === 'active' ? 'rgba(99,102,241,0.2)' : 'rgba(245,158,11,0.2)',
                          color: survey.status === 'completed' ? '#10b981' :
                                 survey.status === 'active' ? '#6366f1' : '#f59e0b'
                        }}>
                          {survey.status === 'completed' ? '✓ Completed' :
                           survey.status === 'active' ? '● Active' : '○ Draft'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Survey Detail View */}
            {surveyMode === 'list' && currentSurvey && (
              <div style={styles.card}>
                <button 
                  onClick={() => setCurrentSurvey(null)}
                  style={{ ...styles.button, ...styles.secondaryBtn, marginBottom: '16px' }}
                >
                  ← Back to Surveys
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '48px' }}>{SURVEY_TEMPLATES[currentSurvey.category]?.icon}</div>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: styles.pageTitle.color }}>
                      {currentSurvey.title}
                    </h2>
                    <p style={{ color: '#888' }}>{currentSurvey.date} • {currentSurvey.responses} responses</p>
                  </div>
                </div>

                {currentSurvey.score && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>{currentSurvey.score}</div>
                      <div style={{ color: '#888', fontSize: '13px' }}>Average Score</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#6366f1' }}>
                        {Math.round(currentSurvey.responses / currentSurvey.total * 100)}%
                      </div>
                      <div style={{ color: '#888', fontSize: '13px' }}>Response Rate</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}>+12%</div>
                      <div style={{ color: '#888', fontSize: '13px' }}>vs Last Survey</div>
                    </div>
                  </div>
                )}

                <div style={styles.cardTitle}>📊 Question Results</div>
                {SURVEY_TEMPLATES[currentSurvey.category]?.questions.map((q, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    background: 'rgba(99,102,241,0.05)',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: styles.pageTitle.color, 
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}>
                      {i + 1}. {q.text}
                      {q.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                    </div>
                    
                    {q.type === 'scale' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(99,102,241,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${(Math.random() * 30 + 60)}%`, 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #6366f1, #10b981)',
                            borderRadius: '4px'
                          }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>
                          {(Math.random() * 1.5 + 3.5).toFixed(1)}/5
                        </span>
                      </div>
                    )}
                    
                    {q.type === 'nps' && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>Promoters: 60%</span>
                        <span style={{ color: '#f59e0b', fontWeight: '600' }}>Passive: 30%</span>
                        <span style={{ color: '#ef4444', fontWeight: '600' }}>Detractors: 10%</span>
                        <span style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '700', color: '#10b981' }}>NPS: +50</span>
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button style={{ ...styles.button, ...styles.primaryBtn }}>📤 Export Results</button>
                  <button style={{ ...styles.button, ...styles.secondaryBtn }}>📧 Send Reminder</button>
                  <button style={{ ...styles.button, ...styles.secondaryBtn }}>🔄 Clone Survey</button>
                </div>
              </div>
            )}

            {/* Survey Creation View */}
            {surveyMode === 'create' && (
              <>
                <div style={styles.grid}>
                  {/* Left Column - Survey Builder */}
                  <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <div style={styles.cardTitle}>🤖 AI-Guided Survey Builder</div>
                    
                    {/* Survey Title */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontWeight: '600', color: styles.pageTitle.color, marginBottom: '8px' }}>
                        Survey Title
                      </label>
                      <input
                        type="text"
                        value={surveyTitle}
                        onChange={(e) => setSurveyTitle(e.target.value)}
                        placeholder="e.g., Q2 2026 Staff Satisfaction Survey"
                        style={{ ...styles.input, width: '100%', fontSize: '16px', padding: '12px 16px' }}
                      />
                        onClick={() => {
                          if (!surveyTitle || surveyQuestions.length === 0 || selectedStaff.length === 0) {
                            alert('Please complete all required fields:\n- Survey title\n- At least one question\n- At least one recipient');
                            return;
                          }
                          const confirmed = window.confirm(
                            `Send "${surveyTitle}" to ${selectedStaff.length} staff members?\n\n` +
                            `Questions: ${surveyQuestions.length}\n` +
                            `Delivery: Email`
                          );
                          if (confirmed) {
                            alert(`✅ Survey sent successfully!\n\n` +
                              `"${surveyTitle}" has been sent to ${selectedStaff.length} staff members.\n\n` +
                              `They will receive an email with the survey link.`
                            );
                            setSurveyMode('list');
                            setCurrentSurvey(null);
                            setSurveyQuestions([]);
                            setSelectedStaff([]);
                            setSurveyTitle('');
                          }
                        }}
                        style={{
                          ...styles.button,
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          padding: '16px',
                          fontSize: '16px',
                          fontWeight: '700'
                        }}
                      >
                        📤 Send Survey Now
                      </button>
                      <button
                        onClick={() => {
                          alert('Survey saved as draft!');
                          setSurveyMode('list');
                        }}
                        style={{ ...styles.button, ...styles.secondaryBtn }}
                      >
                        💾 Save as Draft
                      </button>
                      <button
                        onClick={() => {
                          setSurveyMode('preview');
                        }}
                        style={{ ...styles.button, ...styles.secondaryBtn }}
                      >
                        👁️ Preview Survey
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Survey Preview Mode */}
            {surveyMode === 'preview' && (
              <div style={{ ...styles.card, maxWidth: '700px', margin: '0 auto' }}>
                <button
                  onClick={() => setSurveyMode('create')}
                  style={{ ...styles.button, ...styles.secondaryBtn, marginBottom: '24px' }}
                >
                  ← Back to Editor
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    {SURVEY_TEMPLATES[surveyCategory]?.icon}
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: styles.pageTitle.color }}>
                    {surveyTitle || 'Untitled Survey'}
                  </h2>
                  <p style={{ color: '#888' }}>
                    {SURVEY_TEMPLATES[surveyCategory]?.description}
                  </p>
                </div>

                {surveyQuestions.map((q, i) => (
                  <div key={q.id || i} style={{
                    padding: '24px',
                    background: 'rgba(99,102,241,0.05)',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ 