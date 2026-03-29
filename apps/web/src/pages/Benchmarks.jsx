import React, { useState, useEffect, useCallback } from 'react';

// ============================================================================
// DATA IMPORTS
// ============================================================================
import { METRIC_PACKAGES } from '../data/metrics';
import { CPT_CODES, CBSA_REGIONS } from '../data/cptCodes';
import { CONSULTANTS, CONSULTANT_CATEGORIES, SERVICE_PACKAGES } from '../data/consultants';
import { STAFF_ROLES, SALARY_BENCHMARKS, TURNOVER_BENCHMARKS, SURVEY_TEMPLATES, DEMO_STAFF, SURVEY_DELIVERY_METHODS } from '../data/staffing';
import { MARKETING_CHANNELS, CAMPAIGN_TEMPLATES, MARKETING_METRICS, COMPETITOR_MARKETING, COMPETITOR_INTEL } from '../data/marketing';

// ============================================================================
// EMR TEMPLATES
// ============================================================================
const EMR_TEMPLATES = {
  patients: {
    name: 'Patient Demographics',
    icon: '👤',
    description: 'Core patient information and demographics',
    fields: [
      { name: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: false },
      { name: 'email', label: 'Email', type: 'text', required: false },
      { name: 'address', label: 'Address', type: 'text', required: false },
      { name: 'city', label: 'City', type: 'text', required: false },
      { name: 'state', label: 'State', type: 'text', required: false },
      { name: 'zip', label: 'ZIP Code', type: 'text', required: false },
      { name: 'insurance', label: 'Primary Insurance', type: 'text', required: false }
    ]
  },
  encounters: {
    name: 'Clinical Encounters',
    icon: '🩺',
    description: 'Visit and encounter data',
    fields: [
      { name: 'encounter_id', label: 'Encounter ID', type: 'text', required: true },
      { name: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { name: 'visit_date', label: 'Visit Date', type: 'date', required: true },
      { name: 'provider_name', label: 'Provider', type: 'text', required: true },
      { name: 'visit_type', label: 'Visit Type', type: 'select', options: ['New Patient', 'Established', 'Post-Op', 'Procedure'], required: true },
      { name: 'chief_complaint', label: 'Chief Complaint', type: 'text', required: false },
      { name: 'icd10_primary', label: 'Primary ICD-10', type: 'text', required: false },
      { name: 'icd10_secondary', label: 'Secondary ICD-10', type: 'text', required: false },
      { name: 'cpt_codes', label: 'CPT Codes', type: 'text', required: false },
      { name: 'notes', label: 'Notes', type: 'text', required: false }
    ]
  },
  billing: {
    name: 'Billing & Claims',
    icon: '💰',
    description: 'Financial and claims data',
    fields: [
      { name: 'claim_id', label: 'Claim ID', type: 'text', required: true },
      { name: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { name: 'service_date', label: 'Service Date', type: 'date', required: true },
      { name: 'cpt_code', label: 'CPT Code', type: 'text', required: true },
      { name: 'icd10', label: 'ICD-10', type: 'text', required: true },
      { name: 'billed_amount', label: 'Billed Amount', type: 'number', required: true },
      { name: 'allowed_amount', label: 'Allowed Amount', type: 'number', required: false },
      { name: 'paid_amount', label: 'Paid Amount', type: 'number', required: false },
      { name: 'patient_resp', label: 'Patient Responsibility', type: 'number', required: false },
      { name: 'payer_name', label: 'Payer Name', type: 'text', required: true },
      { name: 'claim_status', label: 'Claim Status', type: 'select', options: ['Submitted', 'Pending', 'Paid', 'Denied', 'Appealed'], required: false }
    ]
  },
  providers: {
    name: 'Provider Directory',
    icon: '👨‍⚕️',
    description: 'Provider information and credentials',
    fields: [
      { name: 'provider_id', label: 'Provider ID', type: 'text', required: true },
      { name: 'npi', label: 'NPI', type: 'text', required: true },
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      { name: 'credentials', label: 'Credentials', type: 'text', required: true },
      { name: 'specialty', label: 'Specialty', type: 'text', required: true },
      { name: 'subspecialty', label: 'Subspecialty', type: 'text', required: false },
      { name: 'hire_date', label: 'Hire Date', type: 'date', required: false },
      { name: 'fte', label: 'FTE', type: 'number', required: false },
      { name: 'location', label: 'Primary Location', type: 'text', required: false }
    ]
  },
  inventory: {
    name: 'Inventory & Supplies',
    icon: '📦',
    description: 'Medical supplies and inventory tracking',
    fields: [
      { name: 'item_id', label: 'Item ID', type: 'text', required: true },
      { name: 'item_name', label: 'Item Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['IOL', 'Medication', 'Supplies', 'Equipment'], required: true },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text', required: false },
      { name: 'unit_cost', label: 'Unit Cost', type: 'number', required: true },
      { name: 'quantity_on_hand', label: 'Quantity on Hand', type: 'number', required: true },
      { name: 'reorder_point', label: 'Reorder Point', type: 'number', required: false },
      { name: 'expiration_date', label: 'Expiration Date', type: 'date', required: false },
      { name: 'lot_number', label: 'Lot Number', type: 'text', required: false }
    ]
  },
  quality: {
    name: 'Quality Metrics',
    icon: '📊',
    description: 'Clinical quality and outcomes data',
    fields: [
      { name: 'measure_id', label: 'Measure ID', type: 'text', required: true },
      { name: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { name: 'measure_date', label: 'Measure Date', type: 'date', required: true },
      { name: 'measure_type', label: 'Measure Type', type: 'select', options: ['MIPS', 'HEDIS', 'Internal', 'IRIS'], required: true },
      { name: 'numerator', label: 'In Numerator', type: 'select', options: ['Yes', 'No'], required: true },
      { name: 'denominator', label: 'In Denominator', type: 'select', options: ['Yes', 'No'], required: true },
      { name: 'exclusion', label: 'Excluded', type: 'select', options: ['Yes', 'No'], required: false },
      { name: 'value', label: 'Value', type: 'number', required: false },
      { name: 'notes', label: 'Notes', type: 'text', required: false }
    ]
  }
};

const IMPORT_HISTORY = [
  { id: 1, file: 'patient_export_mar2026.csv', date: '2026-03-25', records: 1247, type: 'patients', status: 'completed' },
  { id: 2, file: 'billing_q1_2026.csv', date: '2026-03-20', records: 3892, type: 'billing', status: 'completed' },
  { id: 3, file: 'encounters_march.csv', date: '2026-03-15', records: 892, type: 'encounters', status: 'completed' },
  { id: 4, file: 'quality_metrics.csv', date: '2026-03-10', records: 456, type: 'quality', status: 'partial' }
];

// ============================================================================
// STYLES
// ============================================================================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    background: 'rgba(0,0,0,0.3)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  nav: {
    display: 'flex',
    gap: '0.25rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  navButton: (active) => ({
    padding: '0.4rem 0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '500',
    background: active ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.1)',
    color: 'white',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  }),
  main: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'white'
  },
  grid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '1rem'
  }),
  button: (variant = 'primary') => ({
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    background: variant === 'primary' 
      ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
      : variant === 'success'
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : variant === 'danger'
      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
      : 'rgba(255,255,255,0.1)',
    color: 'white',
    transition: 'all 0.2s'
  }),
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(30,41,59,0.8)',
    color: 'white',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  badge: (color) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: `${color}20`,
    color: color,
    border: `1px solid ${color}40`
  }),
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '2rem'
  },
  modalContent: {
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '2rem',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.3)',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  td: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '0.9rem'
  },
  pageTitle: {
    color: 'white'
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none'
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)'
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function Benchmarks() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRegistered, setIsRegistered] = useState(false);
  const [practiceData, setPracticeData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('practice_9');
  const [metrics, setMetrics] = useState({});

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'insights', label: '🤖 AI Insights' },
    { id: 'cpt', label: '💰 CPT Codes' },
    { id: 'competitors', label: '🎯 Competitors' },
    { id: 'consultants', label: '🤝 Consultants' },
    { id: 'staff', label: '👥 Staff' },
    { id: 'surveys', label: '📋 Surveys' },
    { id: 'marketing', label: '📢 Marketing' },
    { id: 'upload', label: '📁 Data Upload' },
    { id: 'chat', label: '💬 KCN Chat' }
  ];

  const launchDemoMode = () => {
    setPracticeData({
      name: 'Premier Eye Associates',
      npi: '1234567890',
      specialty: 'Ophthalmology - Comprehensive',
      location: 'Philadelphia, PA',
      providers: 6,
      region: 'philadelphia'
    });
    
    const demoMetrics = {};
    METRIC_PACKAGES[selectedPackage]?.metrics.forEach(m => {
      const variance = (Math.random() - 0.5) * 0.4;
      demoMetrics[m.key] = {
        value: Math.round(m.benchmark * (1 + variance) * 100) / 100,
        benchmark: m.benchmark
      };
    });
    setMetrics(demoMetrics);
    setIsRegistered(true);
  };

  // Registration Screen
  if (!isRegistered) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.main, maxWidth: '600px', paddingTop: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              <span style={styles.logo}>MedPact</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Practice Intelligence Platform v3.4</p>
          </div>
          
          <div style={styles.card}>
            <h2 style={{ marginBottom: '1.5rem' }}>🏥 Practice Registration</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input style={styles.input} placeholder="Practice Name" />
              <input style={styles.input} placeholder="NPI Number" />
              <select style={styles.select}>
                <option>Select Specialty</option>
                <option>Ophthalmology - Comprehensive</option>
                <option>Ophthalmology - Retina</option>
                <option>Ophthalmology - Glaucoma</option>
                <option>Ophthalmology - Cornea</option>
                <option>Optometry</option>
              </select>
              <select style={styles.select}>
                <option>Select Region</option>
                <option value="philadelphia">Philadelphia Metro</option>
                <option value="san_francisco">San Francisco Bay Area</option>
                <option value="national">National Average</option>
              </select>
              
              <button style={styles.button('primary')}>Register Practice</button>
              
              <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>— or —</span>
              </div>
              
              <button style={styles.button('success')} onClick={launchDemoMode}>
                🎭 Launch Demo Mode
              </button>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            <p>✅ Real Price Transparency Data (Mathematica)</p>
            <p>✅ Philadelphia & San Francisco CBSA Pricing</p>
            <p>✅ 84+ Benchmarking Metrics</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>MedPact v3.4</div>
        <nav style={styles.nav}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={styles.navButton(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
          {practiceData?.name}
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {activeTab === 'dashboard' && <DashboardTab metrics={metrics} selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} setMetrics={setMetrics} />}
        {activeTab === 'insights' && <InsightsTab metrics={metrics} />}
        {activeTab === 'cpt' && <CPTCodesTab region={practiceData?.region} />}
        {activeTab === 'competitors' && <CompetitorsTab />}
        {activeTab === 'consultants' && <ConsultantsTab />}
        {activeTab === 'staff' && <StaffTab />}
        {activeTab === 'surveys' && <SurveysTab />}
        {activeTab === 'marketing' && <MarketingTab />}
        {activeTab === 'upload' && <DataUploadTab />}
        {activeTab === 'chat' && <ChatTab />}
      </main>
    </div>
  );
}

// ============================================================================
// DASHBOARD TAB
// ============================================================================
function DashboardTab({ metrics, selectedPackage, setSelectedPackage, setMetrics }) {
  const currentPackage = METRIC_PACKAGES[selectedPackage];
  
  useEffect(() => {
    if (currentPackage?.metrics) {
      const newMetrics = {};
      currentPackage.metrics.forEach(m => {
        if (!metrics[m.key]) {
          const variance = (Math.random() - 0.5) * 0.4;
          newMetrics[m.key] = {
            value: Math.round(m.benchmark * (1 + variance) * 100) / 100,
            benchmark: m.benchmark
          };
        }
      });
      if (Object.keys(newMetrics).length > 0) {
        setMetrics(prev => ({ ...prev, ...newMetrics }));
      }
    }
  }, [selectedPackage]);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>📊 Practice Dashboard</h2>
        <select 
          style={{ ...styles.select, width: 'auto' }}
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
        >
          {Object.entries(METRIC_PACKAGES).map(([key, pkg]) => (
            <option key={key} value={key}>{pkg.name}</option>
          ))}
        </select>
      </div>

      <div style={{ ...styles.grid(3), marginBottom: '1.5rem' }}>
        {currentPackage?.metrics.slice(0, 9).map(metric => {
          const data = metrics[metric.key] || { value: metric.benchmark, benchmark: metric.benchmark };
          const percentage = (data.value / data.benchmark) * 100;
          const isGood = metric.lowerIsBetter ? percentage <= 100 : percentage >= 100;
          
          return (
            <div key={metric.key} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>{metric.icon}</span>
                <span style={styles.badge(isGood ? '#10b981' : '#ef4444')}>
                  {isGood ? '✓ On Track' : '⚠ Below'}
                </span>
              </div>
              <h3 style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                {metric.title}
              </h3>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                {metric.unit === 'currency' && '$'}
                {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
                {metric.unit === 'percent' && '%'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
                Benchmark: {metric.unit === 'currency' && '$'}{data.benchmark.toLocaleString()}{metric.unit === 'percent' && '%'}
              </div>
              <div style={{ 
                marginTop: '0.75rem', 
                height: '4px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(percentage, 150)}%`,
                  height: '100%',
                  background: isGood ? '#10b981' : '#ef4444',
                  borderRadius: '2px'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {currentPackage?.metrics.length > 9 && (
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem' }}>Additional Metrics</h3>
          <div style={styles.grid(4)}>
            {currentPackage.metrics.slice(9).map(metric => {
              const data = metrics[metric.key] || { value: metric.benchmark, benchmark: metric.benchmark };
              const percentage = (data.value / data.benchmark) * 100;
              const isGood = metric.lowerIsBetter ? percentage <= 100 : percentage >= 100;
              
              return (
                <div key={metric.key} style={{ 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '0.5rem',
                  borderLeft: `3px solid ${isGood ? '#10b981' : '#ef4444'}`
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{metric.title}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {metric.unit === 'currency' && '$'}{data.value.toLocaleString()}{metric.unit === 'percent' && '%'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// AI INSIGHTS TAB
// ============================================================================
function InsightsTab({ metrics }) {
  const insights = [
    {
      type: 'revenue',
      title: 'Revenue Optimization Opportunity',
      description: 'Increasing premium IOL conversion by 10% could generate $185,000 additional annual revenue',
      impact: '+$185,000/year',
      priority: 'high',
      actions: ['Review IOL counseling process', 'Train staff on premium options', 'Update patient materials']
    },
    {
      type: 'efficiency',
      title: 'Surgical Efficiency Gain',
      description: 'Reducing room turnover time by 2 minutes would allow 1 additional case per OR day',
      impact: '+$125,000/year',
      priority: 'medium',
      actions: ['Analyze current workflow', 'Implement parallel processing', 'Pre-stage supplies']
    },
    {
      type: 'rcm',
      title: 'Denial Rate Reduction',
      description: 'Your denial rate is 2% above benchmark. Reducing to benchmark would recover $45,000 annually',
      impact: '+$45,000/year',
      priority: 'high',
      actions: ['Audit top denial reasons', 'Implement pre-authorization checks', 'Staff training on coding']
    },
    {
      type: 'retention',
      title: 'Patient Retention Alert',
      description: 'Glaucoma patient follow-up compliance is at 82%, below the 88% benchmark',
      impact: 'Quality & Revenue',
      priority: 'medium',
      actions: ['Implement automated reminders', 'Review scheduling processes', 'Patient education initiative']
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>🤖 AI-Powered Insights</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ ...styles.card, flex: 1, textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>$355K</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Opportunity</div>
        </div>
        <div style={{ ...styles.card, flex: 1, textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>4</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Active Insights</div>
        </div>
        <div style={{ ...styles.card, flex: 1, textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>2</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>High Priority</div>
        </div>
      </div>

      {insights.map((insight, idx) => (
        <div key={idx} style={{ ...styles.card, marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <span style={styles.badge(insight.priority === 'high' ? '#ef4444' : '#f59e0b')}>
                {insight.priority.toUpperCase()} PRIORITY
              </span>
              <h3 style={{ margin: '0.5rem 0' }}>{insight.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>{insight.description}</p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              {insight.impact}
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <strong style={{ fontSize: '0.85rem' }}>Recommended Actions:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
              {insight.actions.map((action, i) => (
                <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CPT CODES TAB
// ============================================================================
function CPTCodesTab({ region = 'philadelphia' }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPayer, setSelectedPayer] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...new Set(CPT_CODES.map(c => c.category))];
  const payers = ['all', 'Medicare', 'Medicaid', 'Aetna', 'BlueCross', 'Cigna', 'United', 'Commercial'];

  const filteredCodes = CPT_CODES.filter(code => {
    const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory;
    const matchesSearch = code.code.includes(searchTerm) || 
                          code.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDisplayPrice = (code, payer) => {
    if (payer === 'all' || payer === 'Commercial') {
      return region === 'san_francisco' ? code.commercialSanFrancisco : code.commercialPhiladelphia;
    }
    switch(payer) {
      case 'Medicare': return region === 'san_francisco' ? code.medicareSanFrancisco : code.medicarePhiladelphia;
      case 'Medicaid': return code.medicaid;
      case 'Aetna': return code.aetna;
      case 'BlueCross': return code.blueCross;
      case 'Cigna': return code.cigna;
      case 'United': return code.united;
      default: return code.commercialPhiladelphia;
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>💰 CPT Code Price Transparency</h2>
      
      <div style={{ ...styles.card, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            style={{ ...styles.input, flex: 1, minWidth: '200px' }}
            placeholder="Search CPT code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            style={{ ...styles.select, width: 'auto', minWidth: '150px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select 
            style={{ ...styles.select, width: 'auto', minWidth: '150px' }}
            value={selectedPayer}
            onChange={(e) => setSelectedPayer(e.target.value)}
          >
            {payers.map(payer => (
              <option key={payer} value={payer}>{payer === 'all' ? 'All Payers' : payer}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>CPT</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Category</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Medicare</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Commercial</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Selected Payer</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodes.slice(0, 25).map(code => (
                <tr key={code.code}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', color: '#3b82f6' }}>{code.code}</td>
                  <td style={{ ...styles.td, fontSize: '0.85rem', maxWidth: '300px' }}>{code.description}</td>
                  <td style={styles.td}>
                    <span style={styles.badge('#6366f1')}>{code.category}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', color: '#10b981' }}>
                    ${(region === 'san_francisco' ? code.medicareSanFrancisco : code.medicarePhiladelphia).toFixed(2)}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', color: '#f59e0b' }}>
                    ${(region === 'san_francisco' ? code.commercialSanFrancisco : code.commercialPhiladelphia).toFixed(2)}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>
                    ${getDisplayPrice(code, selectedPayer).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
        📊 Showing {Math.min(filteredCodes.length, 25)} of {filteredCodes.length} codes | 
        Region: {region === 'san_francisco' ? 'San Francisco (CBSA 41860)' : 'Philadelphia (CBSA 37980)'} |
        Source: CMS Physician Fee Schedule 2024, Mathematica Price Transparency Data
      </div>
    </div>
  );
}

// ============================================================================
// COMPETITORS TAB - ENHANCED with Filtering, Comparison, Website Intel, Heat Map
// ============================================================================
function CompetitorsTab() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showWebsiteIntel, setShowWebsiteIntel] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('list');

  const practiceTypes = [
    { id: 'all', label: 'All Types', icon: '🏥' },
    { id: 'ophthalmology', label: 'Ophthalmology', icon: '🔬' },
    { id: 'optometry', label: 'Optometry', icon: '👓' },
    { id: 'general', label: 'General Eye Care', icon: '👁️' }
  ];

  const filteredCompetitors = typeFilter === 'all' 
    ? COMPETITOR_INTEL 
    : COMPETITOR_INTEL.filter(c => c.type === typeFilter);

  const toggleCompare = (competitor) => {
    if (compareList.find(c => c.id === competitor.id)) {
      setCompareList(compareList.filter(c => c.id !== competitor.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, competitor]);
    }
  };

  const RatingBar = ({ value, max = 5, color = '#f59e0b', label }) => (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${(value / max) * 100}%`, 
          height: '100%', 
          background: color,
          borderRadius: '4px'
        }} />
      </div>
    </div>
  );

  // Heat Map Data aggregation
  const allHeatMapData = COMPETITOR_INTEL.flatMap(c => 
    (c.heatMapData || []).map(h => ({ ...h, competitor: c.name }))
  );
  const uniqueZips = [...new Set(allHeatMapData.map(h => h.zip))];
  const aggregatedHeatMap = uniqueZips.map(zip => {
    const entries = allHeatMapData.filter(h => h.zip === zip);
    return {
      zip,
      totalPatients: entries.reduce((sum, e) => sum + e.patients, 0),
      avgProfitIndex: Math.round(entries.reduce((sum, e) => sum + e.profitIndex, 0) / entries.length),
      competitors: entries.map(e => e.competitor)
    };
  }).sort((a, b) => b.avgProfitIndex - a.avgProfitIndex);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>🎯 Competitive Intelligence</h2>
      
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'list', label: '📋 Competitor List' },
          { id: 'heatmap', label: '🗺️ Patient Heat Map' }
        ].map(tab => (
          <button
            key={tab.id}
            style={styles.navButton(activeSubTab === tab.id)}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'list' && (
        <>
          {/* Practice Type Filter */}
          <div style={{ ...styles.card, marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {practiceTypes.map(type => (
                  <button
                    key={type.id}
                    style={{
                      ...styles.navButton(typeFilter === type.id),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    onClick={() => setTypeFilter(type.id)}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
              
              {compareList.length > 0 && (
                <button 
                  style={styles.button('primary')}
                  onClick={() => setShowComparison(true)}
                >
                  📊 Compare ({compareList.length}/4)
                </button>
              )}
            </div>
          </div>

          {/* Market Overview */}
          <div style={{ ...styles.grid(4), marginBottom: '1.5rem' }}>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{filteredCompetitors.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Competitors</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {filteredCompetitors.reduce((sum, c) => sum + c.providers, 0)}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Providers</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {(filteredCompetitors.reduce((sum, c) => sum + c.googleRating, 0) / filteredCompetitors.length).toFixed(1)}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Avg Rating</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                ${(filteredCompetitors.reduce((sum, c) => sum + c.monthlyAdSpend, 0) / 1000).toFixed(0)}K
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Ad Spend/mo</div>
            </div>
          </div>

          {/* Competitor Cards */}
          <div style={styles.grid(2)}>
            {filteredCompetitors.map((comp) => (
              <div key={comp.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ margin: 0 }}>{comp.name}</h3>
                      <span style={styles.badge(
                        comp.type === 'ophthalmology' ? '#3b82f6' : 
                        comp.type === 'optometry' ? '#8b5cf6' : '#10b981'
                      )}>
                        {comp.type === 'ophthalmology' ? '🔬' : comp.type === 'optometry' ? '👓' : '🏥'} {comp.type}
                      </span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                      📍 {comp.distance} • {comp.providers} providers
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        ...styles.button(compareList.find(c => c.id === comp.id) ? 'success' : 'secondary'),
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.75rem'
                      }}
                      onClick={() => toggleCompare(comp)}
                    >
                      {compareList.find(c => c.id === comp.id) ? '✓ Added' : '+ Compare'}
                    </button>
                  </div>
                </div>

                {/* Ratings */}
                <div style={{ marginBottom: '1rem' }}>
                  <RatingBar value={comp.googleRating} label={`Google (${comp.googleReviews} reviews)`} color="#4285f4" />
                  <RatingBar value={comp.yelpRating} label={`Yelp (${comp.yelpReviews} reviews)`} color="#d32323" />
                  <RatingBar value={comp.healthgradesRating} label="Healthgrades" color="#00a5a5" />
                </div>

                {/* Services */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>Services</div>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {comp.services.slice(0, 4).map((s, i) => (
                      <span key={i} style={styles.badge('#3b82f6')}>{s}</span>
                    ))}
                    {comp.services.length > 4 && (
                      <span style={styles.badge('#6b7280')}>+{comp.services.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Strengths/Weaknesses */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '0.25rem' }}>💪 Strengths</div>
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      {comp.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '0.25rem' }}>⚠️ Weaknesses</div>
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      {comp.weaknesses.slice(0, 2).map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.1)', 
                  paddingTop: '0.75rem' 
                }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Market Share: </span>
                    <span style={{ fontWeight: 'bold' }}>{comp.marketShare}%</span>
                  </div>
                  <button
                    style={{
                      ...styles.button('primary'),
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.75rem'
                    }}
                    onClick={() => {
                      setSelectedCompetitor(comp);
                      setShowWebsiteIntel(true);
                    }}
                  >
                    🔍 Website Intel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Heat Map Tab */}
      {activeSubTab === 'heatmap' && (
        <div>
          <div style={{ ...styles.card, marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🗺️ Patient Distribution Heat Map</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
              ZIP codes color-coded by profit index (higher = more profitable patient base)
            </p>
            
            {/* Visual Heat Map Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {aggregatedHeatMap.map(zip => {
                const hue = ((zip.avgProfitIndex - 60) / 40) * 120;
                const bgColor = `hsl(${hue}, 70%, 35%)`;
                return (
                  <div 
                    key={zip.zip}
                    style={{
                      background: bgColor,
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    title={`Competitors: ${zip.competitors.join(', ')}`}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{zip.zip}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{zip.totalPatients} pts</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Index: {zip.avgProfitIndex}</div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Profit Index:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '20px', height: '20px', background: 'hsl(0, 70%, 35%)', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.75rem' }}>60</span>
              </div>
              <div style={{ width: '100px', height: '10px', background: 'linear-gradient(to right, hsl(0, 70%, 35%), hsl(60, 70%, 35%), hsl(120, 70%, 35%))', borderRadius: '5px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '20px', height: '20px', background: 'hsl(120, 70%, 35%)', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.75rem' }}>100</span>
              </div>
            </div>
          </div>

          {/* Top 10 Table */}
          <div style={styles.card}>
            <h4 style={{ marginBottom: '1rem' }}>📊 Top 10 High-Profit ZIP Codes</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Rank</th>
                    <th style={styles.th}>ZIP Code</th>
                    <th style={styles.th}>Profit Index</th>
                    <th style={styles.th}>Total Patients</th>
                    <th style={styles.th}>Competitors Present</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedHeatMap.slice(0, 10).map((zip, idx) => (
                    <tr key={zip.zip}>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge(idx < 3 ? '#f59e0b' : '#6b7280'),
                          minWidth: '24px',
                          textAlign: 'center'
                        }}>
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>{zip.zip}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(zip.avgProfitIndex >= 90 ? '#10b981' : zip.avgProfitIndex >= 80 ? '#3b82f6' : '#f59e0b')}>
                          {zip.avgProfitIndex}
                        </span>
                      </td>
                      <td style={styles.td}>{zip.totalPatients.toLocaleString()}</td>
                      <td style={{ ...styles.td, fontSize: '0.8rem' }}>{zip.competitors.slice(0, 2).join(', ')}{zip.competitors.length > 2 ? ` +${zip.competitors.length - 2}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{ ...styles.grid(3), marginTop: '1rem' }}>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{uniqueZips.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>ZIP Codes Tracked</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {aggregatedHeatMap.reduce((sum, z) => sum + z.totalPatients, 0).toLocaleString()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Patients Mapped</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {Math.round(aggregatedHeatMap.reduce((sum, z) => sum + z.avgProfitIndex, 0) / aggregatedHeatMap.length)}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Avg Profit Index</div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showComparison && compareList.length > 0 && (
        <div style={styles.modal} onClick={() => setShowComparison(false)}>
          <div style={{ ...styles.modalContent, maxWidth: '1200px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>📊 Side-by-Side Comparison</h2>
              <button style={styles.button('secondary')} onClick={() => setShowComparison(false)}>✕ Close</button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...styles.table, minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: '150px' }}>Metric</th>
                    {compareList.map(comp => (
                      <th key={comp.id} style={styles.th}>{comp.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Type</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={styles.td}>
                        <span style={styles.badge(comp.type === 'ophthalmology' ? '#3b82f6' : '#8b5cf6')}>
                          {comp.type}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Providers</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={styles.td}>{comp.providers}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Google Rating</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={styles.td}>
                        <RatingBar value={comp.googleRating} label="" color="#4285f4" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Yelp Rating</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={styles.td}>
                        <RatingBar value={comp.yelpRating} label="" color="#d32323" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Healthgrades</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={styles.td}>
                        <RatingBar value={comp.healthgradesRating} label="" color="#00a5a5" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Market Share</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={styles.td}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{comp.marketShare}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Monthly Ad Spend</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={styles.td}>${comp.monthlyAdSpend.toLocaleString()}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>Services</td>
                    {compareList.map(comp => (
                      <td key={comp.id} style={{ ...styles.td, fontSize: '0.8rem' }}>
                        {comp.services.join(', ')}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Website Intel Modal */}
      {showWebsiteIntel && selectedCompetitor && (
        <div style={styles.modal} onClick={() => setShowWebsiteIntel(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ fontSize: '5rem' }}>{selectedCompetitor.avatar}</div>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedCompetitor.name}</h2>
                  <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>{selectedCompetitor.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>{selectedCompetitor.company}</div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>⭐ {selectedCompetitor.rating} ({selectedCompetitor.reviews} reviews)</span>
                    <span>📍 {selectedCompetitor.location}</span>
                    <span>⏱️ Response: {selectedCompetitor.responseTime}</span>
                  </div>
                </div>
              </div>
              <button style={styles.button('secondary')} onClick={() => setShowWebsiteIntel(false)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Provider Credentials */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#3b82f6' }}>🎓 Provider Training & Credentials</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {selectedCompetitor.websiteIntel?.providerCredentials?.map((cred, i) => (
                    <span key={i} style={styles.badge('#3b82f6')}>{cred}</span>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#10b981' }}>🔧 Equipment & Technology</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {selectedCompetitor.websiteIntel?.equipment?.map((eq, i) => (
                    <span key={i} style={styles.badge('#10b981')}>{eq}</span>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#8b5cf6' }}>🩺 Services Offered</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {selectedCompetitor.websiteIntel?.services?.map((svc, i) => (
                    <span key={i} style={styles.badge('#8b5cf6')}>{svc}</span>
                  ))}
                </div>
              </div>

              {/* Practice Details */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#f59e0b' }}>🏢 Practice Details</h4>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Established:</span>
                    <span>{selectedCompetitor.websiteIntel?.practiceDetails?.yearEstablished}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Locations:</span>
                    <span>{selectedCompetitor.websiteIntel?.practiceDetails?.locations}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Languages:</span>
                    <span>{selectedCompetitor.websiteIntel?.practiceDetails?.languages?.join(', ')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Telehealth:</span>
                    <span>{selectedCompetitor.websiteIntel?.practiceDetails?.telehealth ? '✅ Yes' : '❌ No'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Avg Wait Time:</span>
                    <span>{selectedCompetitor.websiteIntel?.practiceDetails?.avgWaitTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Accepting New:</span>
                    <span>{selectedCompetitor.websiteIntel?.practiceDetails?.acceptingNew ? '✅ Yes' : '❌ No'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                <div>📍 {selectedCompetitor.address}</div>
                <div>📞 {selectedCompetitor.phone}</div>
                <div>🌐 {selectedCompetitor.website}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CONSULTANTS TAB - COMPLETE
// ============================================================================
function ConsultantsTab() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConsultants = CONSULTANTS.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>🤝 Consultant Marketplace</h2>
      
      {/* Search and Filter */}
      <div style={{ ...styles.card, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            style={{ ...styles.input, flex: 1 }}
            placeholder="Search consultants by name, title, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            style={styles.button(selectedCategory === 'all' ? 'primary' : 'secondary')}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {CONSULTANT_CATEGORIES.map(category => (
            <button
              key={category.id}
              style={styles.button(selectedCategory === category.id ? 'primary' : 'secondary')}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ ...styles.grid(4), marginBottom: '1.5rem' }}>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{filteredConsultants.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Consultants</div>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {Math.round(filteredConsultants.reduce((sum, c) => sum + c.rating, 0) / filteredConsultants.length * 10) / 10}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Avg Rating</div>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {Math.round(filteredConsultants.reduce((sum, c) => sum + c.experience, 0) / filteredConsultants.length)}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Avg Years Exp</div>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            {filteredConsultants.filter(c => c.availability === 'available').length}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Available Now</div>
        </div>
      </div>

      {/* Consultant Cards */}
      <div style={styles.grid(2)}>
        {filteredConsultants.map(consultant => {
          const category = CONSULTANT_CATEGORIES.find(c => c.id === consultant.category);
          return (
            <div key={consultant.id} style={styles.card}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '3rem' }}>{consultant.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{consultant.name}</h3>
                      <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>{consultant.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>{consultant.company}</div>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>⭐ {consultant.rating} ({consultant.reviews} reviews)</span>
                        <span>📍 {consultant.location}</span>
                        <span>⏱️ Response: {consultant.responseTime}</span>
                      </div>
                    </div>
                    <span style={styles.badge(consultant.availability === 'available' ? '#10b981' : '#f59e0b')}>
                      {consultant.availability === 'available' ? '🟢 Available' : '🟡 Limited'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#f59e0b' }}>⭐ {consultant.rating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}> ({consultant.reviews} reviews)</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>📍 {consultant.location}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{consultant.remote ? '🌐 Remote OK' : '📍 On-site'}</span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>Specialties</div>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {consultant.specialties.slice(0, 3).map((s, i) => (
                    <span key={i} style={styles.badge('#6366f1')}>{s}</span>
                  ))}
                  {consultant.specialties.length > 3 && (
                    <span style={styles.badge('#6b7280')}>+{consultant.specialties.length - 3}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{consultant.experience}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Years</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{consultant.projectsCompleted}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Projects</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{consultant.successRate}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Success</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Hourly Rate: </span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>${consultant.hourlyRate}/hr</span>
                </div>
                <button 
                  style={{ ...styles.button('primary'), padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => setSelectedConsultant(consultant)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Consultant Detail Modal */}
        {selectedConsultant && (
          <div style={styles.modal} onClick={() => setSelectedConsultant(null)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ fontSize: '5rem' }}>{selectedConsultant.avatar}</div>
                  <div>
                    <h2 style={{ margin: 0 }}>{selectedConsultant.name}</h2>
                    <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>{selectedConsultant.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>{selectedConsultant.company}</div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>⭐ {selectedConsultant.rating} ({selectedConsultant.reviews} reviews)</span>
                      <span>📍 {selectedConsultant.location}</span>
                      <span>⏱️ Response: {selectedConsultant.responseTime}</span>
                    </div>
                  </div>
                </div>
                <button style={styles.button('secondary')} onClick={() => setSelectedConsultant(null)}>✕</button>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>{selectedConsultant.bio}</p>

              <div style={styles.grid(3)}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedConsultant.experience} yrs</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Experience</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedConsultant.projectsCompleted}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Projects</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedConsultant.successRate}%</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Success Rate</div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h4>Specialties</h4>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {selectedConsultant.specialties.map((s, i) => (
                    <span key={i} style={styles.badge('#3b82f6')}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4>Certifications</h4>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {selectedConsultant.certifications.map((c, i) => (
                    <span key={i} style={styles.badge('#10b981')}>{c}</span>
                  ))}
                </div>
              </div>

              {selectedConsultant.caseStudies && selectedConsultant.caseStudies.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4>Case Studies</h4>
                  {selectedConsultant.caseStudies.map((cs, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{cs.title}</div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                        <span style={{ color: '#10b981' }}>📈 {cs.result}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Client: {cs.client}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedConsultant.packages && selectedConsultant.packages.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4>Service Packages</h4>
                  <div style={styles.grid(selectedConsultant.packages.length)}>
                    {selectedConsultant.packages.map((pkg, i) => (
                      <div key={i} style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        padding: '1rem', 
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{pkg.name}</div>
                        <div style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          ${pkg.price.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{pkg.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button style={{ ...styles.button('primary'), flex: 1 }}>💬 Message</button>
                <button style={{ ...styles.button('success'), flex: 1 }}>📅 Schedule Call</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

// ============================================================================
// STAFF TAB - COMPLETE
// ============================================================================
function StaffTab() {
  const [staff] = useState(DEMO_STAFF);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const getRoleInfo = (roleId) => STAFF_ROLES.find(r => r.id === roleId);
  
  const getSalaryBenchmark = (roleId, salary) => {
    const bench = SALARY_BENCHMARKS[roleId];
    if (!bench) return { text: 'N/A', color: '#6b7280' };
    if (salary >= bench.p75) return { text: 'Above 75th', color: '#10b981' };
    if (salary >= bench.p50) return { text: '50th-75th', color: '#3b82f6' };
    if (salary >= bench.p25) return { text: '25th-50th', color: '#f59e0b' };
    return { text: 'Below 25th', color: '#ef4444' };
  };

  const roleCategories = ['all', ...new Set(STAFF_ROLES.map(r => r.category))];
  
  const filteredStaff = staff.filter(s => {
    if (filterRole === 'all') return true;
    const role = getRoleInfo(s.role);
    return role?.category === filterRole;
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    switch (sortBy) {
      case 'salary': return b.salary - a.salary;
      case 'tenure': return new Date(a.hireDate) - new Date(b.hireDate);
      default: return a.name.localeCompare(b.name);
    }
  });

  const totalPayroll = staff.reduce((sum, s) => sum + s.salary, 0);
  const avgSalary = totalPayroll / staff.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>👥 Staff Directory & Intelligence</h2>
        <button style={styles.button('primary')} onClick={() => setShowAddModal(true)}>
          + Add Staff Member
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ ...styles.grid(4), marginBottom: '1.5rem' }}>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{staff.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Staff</div>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {staff.filter(s => ['physician', 'optometrist'].includes(s.role)).length}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Providers</div>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>${(totalPayroll / 1000000).toFixed(1)}M</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Annual Payroll</div>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>${Math.round(avgSalary / 1000)}K</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Avg Salary</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.card, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginRight: '0.5rem' }}>Category:</label>
            <select 
              style={{ ...styles.select, width: 'auto' }}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {roleCategories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginRight: '0.5rem' }}>Sort by:</label>
            <select 
              style={{ ...styles.select, width: 'auto' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="salary">Salary (High to Low)</option>
              <option value="tenure">Tenure (Longest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Department</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Salary</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Benchmark</th>
                <th style={styles.th}>Hire Date</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedStaff.map(member => {
                const role = getRoleInfo(member.role);
                const benchmark = getSalaryBenchmark(member.role, member.salary);
                const tenure = Math.floor((new Date() - new Date(member.hireDate)) / (365.25 * 24 * 60 * 60 * 1000));
                return (
                  <tr key={member.id}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: '500' }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{member.email}</div>
                    </td>
                    <td style={styles.td}>
                      <span>{role?.icon} {role?.name || member.role}</span>
                    </td>
                    <td style={styles.td}>{member.department}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>
                      ${member.salary.toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={styles.badge(benchmark.color)}>{benchmark.text}</span>
                    </td>
                    <td style={styles.td}>
                      <div>{new Date(member.hireDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{tenure} years</div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={styles.badge(member.status === 'active' ? '#10b981' : '#ef4444')}>
                        {member.status === 'active' ? '✓ Active' : '✕ Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Benchmarks Card */}
      <div style={{ ...styles.card, marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>📊 Salary Benchmark Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Role</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>25th Percentile</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>50th Percentile</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>75th Percentile</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>90th Percentile</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SALARY_BENCHMARKS).slice(0, 10).map(([roleId, bench]) => {
                const role = getRoleInfo(roleId);
                return (
                  <tr key={roleId}>
                    <td style={styles.td}>{role?.icon} {role?.name || roleId}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>${bench.p25.toLocaleString()}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>${bench.p50.toLocaleString()}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>${bench.p75.toLocaleString()}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>${bench.p90.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Staff Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>➕ Add Staff Member</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input style={styles.input} placeholder="First Name" />
                <input style={styles.input} placeholder="Last Name" />
              </div>
              <input style={styles.input} placeholder="Email" type="email" />
              <select style={styles.select}>
                <option value="">Select Role</option>
                {STAFF_ROLES.map(role => (
                  <option key={role.id} value={role.id}>{role.icon} {role.name}</option>
                ))}
              </select>
              <input style={styles.input} placeholder="Department" />
              <input style={styles.input} placeholder="Annual Salary" type="number" />
              <input style={styles.input} placeholder="Hire Date" type="date" />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button style={{ ...styles.button('primary'), flex: 1 }}>Save Staff Member</button>
                <button style={styles.button('secondary')} onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SURVEYS TAB - COMPLETE WITH FULL FUNCTIONALITY
// ============================================================================
function SurveysTab() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeView, setActiveView] = useState('templates');
  const [responses, setResponses] = useState({});
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySettings, setDeploySettings] = useState({
    recipients: 'all',
    method: 'email',
    anonymous: true,
    deadline: ''
  });

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const deploySurvey = () => {
    setIsDeploying(true);
    setTimeout(() => {
      alert(`✅ Survey "${SURVEY_TEMPLATES[selectedTemplate].name}" deployed successfully!\n\nSent to: ${deploySettings.recipients === 'all' ? 'All Staff (20)' : 'Selected Recipients'}\nMethod: ${deploySettings.method}\nAnonymous: ${deploySettings.anonymous ? 'Yes' : 'No'}`);
      setIsDeploying(false);
      setActiveView('templates');
    }, 1500);
  };

  const template = selectedTemplate ? SURVEY_TEMPLATES[selectedTemplate] : null;

  // Mock survey results
  const surveyResults = {
    engagement: { sent: 20, completed: 16, avgScore: 7.8, trend: '+0.3' },
    satisfaction: { sent: 20, completed: 18, avgScore: 8.1, trend: '+0.5' },
    pulse: { sent: 20, completed: 19, avgScore: 4.2, trend: '-0.1' }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>📋 Staff Surveys & Engagement</h2>

      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'templates', label: '📄 Survey Templates' },
          { id: 'deploy', label: '🚀 Deploy Survey', disabled: !selectedTemplate },
          { id: 'results', label: '📊 Results & Analytics' },
          { id: 'preview', label: '👁️ Preview', disabled: !selectedTemplate }
        ].map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.navButton(activeView === tab.id),
              opacity: tab.disabled ? 0.5 : 1,
              cursor: tab.disabled ? 'not-allowed' : 'pointer'
            }}
            onClick={() => !tab.disabled && setActiveView(tab.id)}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Templates View */}
      {activeView === 'templates' && (
        <div>
          <div style={styles.card}>
            <h3 style={{ marginBottom: '1rem' }}>📋 Select Data Template</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
              Choose the type of data you want to import. Our AI will help map your fields automatically.
            </p>
            
            <div style={styles.grid(3)}>
              {Object.entries(EMR_TEMPLATES).map(([key, template]) => (
                <div 
                  key={key}
                  style={{ 
                    ...styles.card,
                    cursor: 'pointer',
                    border: selectedTemplate === key ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                    marginBottom: 0
                  }}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{template.icon}</div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{template.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    {template.description}
                  </p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    {template.fields.length} fields
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button 
                style={styles.button('primary')}
                onClick={() => setUploadStep('upload')}
              >
                Continue with {EMR_TEMPLATES[selectedTemplate].name} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Deploy View */}
      {activeView === 'deploy' && template && (
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem' }}>🚀 Deploy: {template.name}</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                Recipients
              </label>
              <select 
                style={styles.select}
                value={deploySettings.recipients}
                onChange={(e) => setDeploySettings({...deploySettings, recipients: e.target.value})}
              >
                <option value="all">All Staff (20 members)</option>
                <option value="clinical">Clinical Staff Only (12 members)</option>
                <option value="admin">Administrative Staff Only (8 members)</option>
                <option value="providers">Providers Only (5 members)</option>
                <option value="custom">Custom Selection...</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                Delivery Method
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {SURVEY_DELIVERY_METHODS.map(method => (
                  <button
                    key={method.id}
                    style={styles.navButton(deploySettings.method === method.id)}
                    onClick={() => setDeploySettings({...deploySettings, method: method.id})}
                  >
                    {method.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                Response Deadline
              </label>
              <input 
                type="date" 
                style={styles.input}
                value={deploySettings.deadline}
                onChange={(e) => setDeploySettings({...deploySettings, deadline: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="anonymous"
                checked={deploySettings.anonymous}
                onChange={(e) => setDeploySettings({...deploySettings, anonymous: e.target.checked})}
              />
              <label htmlFor="anonymous" style={{ color: 'rgba(255,255,255,0.7)' }}>
                🔒 Keep responses anonymous
              </label>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>📋 Survey Summary</h4>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                <div>• {template.questions.length} questions</div>
                <div>• Estimated time: {template.estimatedTime}</div>
                <div>• Recipients: {deploySettings.recipients === 'all' ? '20 staff members' : 'Selected group'}</div>
                <div>• Delivery: {SURVEY_DELIVERY_METHODS.find(m => m.id === deploySettings.method)?.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                style={{ ...styles.button('success'), flex: 1 }}
                onClick={deploySurvey}
                disabled={isDeploying}
              >
                {isDeploying ? '⏳ Deploying...' : '🚀 Deploy Survey Now'}
              </button>
              <button style={styles.button('secondary')} onClick={() => setActiveView('templates')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {activeView === 'results' && (
        <div>
          <div style={{ ...styles.grid(3), marginBottom: '1.5rem' }}>
            {Object.entries(surveyResults).map(([key, data]) => (
              <div key={key} style={styles.card}>
                <h4 style={{ margin: '0 0 1rem 0' }}>{SURVEY_TEMPLATES[key]?.name || key}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{data.completed}/{data.sent}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Responses</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                      {data.avgScore}
                      <span style={{ fontSize: '0.8rem', color: data.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                        {' '}{data.trend}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Avg Score</div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ 
                      width: `${(data.completed / data.sent) * 100}%`, 
                      height: '100%', 
                      background: '#10b981', 
                      borderRadius: '2px' 
                    }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
                    {Math.round((data.completed / data.sent) * 100)}% response rate
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <h3 style={{ marginBottom: '1rem' }}>📈 Engagement Trends</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Overall engagement score trending upward. Staff satisfaction increased by 0.5 points compared to last quarter.
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>78%</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Would recommend workplace</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>82%</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Feel valued</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>71%</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>See growth opportunities</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview View */}
      {activeView === 'preview' && template && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>👁️ Preview: {template.name}</h3>
            <button style={styles.button('secondary')} onClick={() => setActiveView('templates')}>
              ← Back to Templates
            </button>
          </div>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>{template.description}</p>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {template.questions.map((question, idx) => (
              <div key={question.id} style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '0.5rem',
                borderLeft: '3px solid #3b82f6'
              }}>
                <div style={{ marginBottom: '0.75rem', fontWeight: '500' }}>
                  {idx + 1}. {question.text}
                </div>
                
                {question.type === 'scale' && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[...Array(question.scale)].map((_, i) => (
                      <button
                        key={i}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: responses[question.id] === i + 1 ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
                          background: responses[question.id] === i + 1 ? '#3b82f6' : 'transparent',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleResponseChange(question.id, i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                
                {question.type === 'text' && (
                  <textarea
                    style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Your response..."
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                )}
                
                {question.type === 'select' && (
                  <select
                    style={styles.select}
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  >
                    <option value="">Select an option...</option>
                    {question.options.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
                
                {question.type === 'emoji' && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {question.options.map((emoji, i) => (
                      <button
                        key={i}
                        style={{
                          fontSize: '2rem',
                          background: responses[question.id] === emoji ? 'rgba(59,130,246,0.2)' : 'transparent',
                          border: responses[question.id] === emoji ? '2px solid #3b82f6' : '1px solid transparent',
                          borderRadius: '0.5rem',
                          padding: '0.5rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleResponseChange(question.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MARKETING TAB - COMPLETE
// ============================================================================
function MarketingTab() {
  const [activeSubTab, setActiveSubTab] = useState('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  // Demo campaign data
  const campaigns = [
    {
      id: 1,
      name: 'Spring LASIK Promotion',
      status: 'active',
      channel: 'Google Ads',
      budget: 5000,
      spent: 3247,
      impressions: 45000,
      clicks: 892,
      conversions: 34,
      cpc: 3.64,
      cpa: 95.50,
      startDate: '2026-03-01',
      endDate: '2026-04-30'
    },
    {
      id: 2,
      name: 'Cataract Awareness Campaign',
      status: 'active',
      channel: 'Facebook',
      budget: 3000,
      spent: 1890,
      impressions: 67000,
      clicks: 1245,
      conversions: 28,
      cpc: 1.52,
      cpa: 67.50,
      startDate: '2026-03-15',
      endDate: '2026-05-15'
    },
    {
      id: 3,
      name: 'Dry Eye Treatment',
      status: 'paused',
      channel: 'Instagram',
      budget: 2000,
      spent: 2000,
      impressions: 34000,
      clicks: 567,
      conversions: 12,
      cpc: 3.53,
      cpa: 166.67,
      startDate: '2026-02-01',
      endDate: '2026-03-01'
    },
    {
      id: 4,
      name: 'Glaucoma Screening',
      status: 'scheduled',
      channel: 'Google Ads',
      budget: 4000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cpc: 0,
      cpa: 0,
      startDate: '2026-04-01',
      endDate: '2026-06-01'
    }
  ];

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>📢 Marketing Intelligence</h2>
        <button style={styles.button('primary')} onClick={() => setShowNewCampaign(true)}>
          + New Campaign
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'campaigns', label: '📊 Campaigns' },
          { id: 'competitors', label: '🎯 Competitor Ads' },
          { id: 'roi', label: '💰 ROI Calculator' }
        ].map(tab => (
          <button
            key={tab.id}
            style={styles.navButton(activeSubTab === tab.id)}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeSubTab === 'campaigns' && (
        <div>
          <div style={{ ...styles.grid(4), marginBottom: '1.5rem' }}>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{campaigns.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Campaigns</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>${totalSpend.toLocaleString()}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Spend</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {totalConversions}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Conversions</div>
            </div>
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>${avgCPA.toFixed(2)}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Avg CPA</div>
            </div>
          </div>

          <div style={styles.grid(2)}>
            {campaigns.map(campaign => (
              <div key={campaign.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{campaign.name}</h3>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                      {campaign.channel} • {campaign.startDate} to {campaign.endDate}
                    </div>
                  </div>
                  <span style={styles.badge(
                    campaign.status === 'active' ? '#10b981' : 
                    campaign.status === 'paused' ? '#f59e0b' : '#6b7280'
                  )}>
                    {campaign.status}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Budget</span>
                    <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                    <div style={{ 
                      width: `${(campaign.spent / campaign.budget) * 100}%`, 
                      height: '100%', 
                      background: '#10b981',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{(campaign.impressions / 1000).toFixed(1)}K</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Impressions</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{campaign.clicks}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Clicks</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{campaign.conversions}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Conversions</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>${campaign.cpa.toFixed(0)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>CPA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Ads Tab */}
      {activeSubTab === 'competitors' && (
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem' }}>🎯 Competitor Ad Intelligence</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Competitor</th>
                  <th style={styles.th}>Channels</th>
                  <th style={styles.th}>Est. Monthly Spend</th>
                  <th style={styles.th}>Activity</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_MARKETING.map((comp, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{comp.name}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {comp.channels.map((ch, i) => (
                          <span key={i} style={styles.badge('#3b82f6')}>{ch}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: '#10b981', fontWeight: 'bold' }}>
                      ${comp.monthlySpend.toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(comp.activityLevel === 'high' ? '#ef4444' : '#f59e0b')}>
                        {comp.activityLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROI Calculator Tab */}
      {activeSubTab === 'roi' && (
        <div style={styles.grid(2)}>
          <div style={styles.card}>
            <h3 style={{ marginBottom: '1rem' }}>💰 ROI Calculator</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Monthly Ad Spend ($)</label>
                <input style={styles.input} type="number" placeholder="5000" defaultValue="5000" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Cost Per Lead ($)</label>
                <input style={styles.input} type="number" placeholder="50" defaultValue="50" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Conversion Rate (%)</label>
                <input style={styles.input} type="number" placeholder="25" defaultValue="25" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Patient LTV ($)</label>
                <input style={styles.input} type="number" placeholder="3500" defaultValue="3500" />
              </div>
              <button style={styles.button('primary')}>Calculate ROI</button>
            </div>
          </div>
          <div style={styles.card}>
            <h3 style={{ marginBottom: '1rem' }}>📊 Projected Results</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Monthly Leads</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>100</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>New Patients</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>25</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.2)', borderRadius: '0.5rem', border: '1px solid #10b981' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Marketing ROI</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>1,650%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div style={styles.modal} onClick={() => setShowNewCampaign(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>➕ Create New Campaign</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input style={styles.input} placeholder="Campaign Name" />
              <select style={styles.select}>
                <option>Select Channel</option>
                <option>Google Ads</option>
                <option>Facebook</option>
                <option>Instagram</option>
              </select>
              <input style={styles.input} type="number" placeholder="Budget ($)" />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ ...styles.button('primary'), flex: 1 }}>Create</button>
                <button style={styles.button('secondary')} onClick={() => setShowNewCampaign(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DATA UPLOAD TAB
// ============================================================================
function DataUploadTab() {
  const [uploadStep, setUploadStep] = useState('select');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>📁 EMR Data Upload</h2>

      {uploadStep === 'select' && (
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem' }}>Select Data Template</h3>
          <div style={styles.grid(3)}>
            {Object.entries(EMR_TEMPLATES).map(([key, template]) => (
              <div 
                key={key}
                style={{ 
                  ...styles.card,
                  cursor: 'pointer',
                  border: selectedTemplate === key ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                  marginBottom: 0
                }}
                onClick={() => setSelectedTemplate(key)}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{template.icon}</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{template.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{template.description}</p>
              </div>
            ))}
          </div>
          {selectedTemplate && (
            <button style={{ ...styles.button('primary'), marginTop: '1rem' }} onClick={() => setUploadStep('upload')}>
              Continue →
            </button>
          )}
        </div>
      )}

      {uploadStep === 'upload' && (
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem' }}>Upload {EMR_TEMPLATES[selectedTemplate]?.name}</h3>
          <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '1rem', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
            <p>Drag and drop your file here, or</p>
            <label style={{ ...styles.button('primary'), cursor: 'pointer', display: 'inline-block' }}>
              Browse Files
              <input type="file" accept=".csv,.xlsx" style={{ display: 'none' }} onChange={(e) => { setUploadedFile(e.target.files[0]); setUploadStep('complete'); }} />
            </label>
          </div>
          <button style={{ ...styles.button('secondary'), marginTop: '1rem' }} onClick={() => setUploadStep('select')}>← Back</button>
        </div>
      )}

      {uploadStep === 'complete' && (
        <div style={styles.card}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2>Upload Complete!</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{uploadedFile?.name} uploaded successfully.</p>
            <button style={styles.button('primary')} onClick={() => { setUploadStep('select'); setSelectedTemplate(null); setUploadedFile(null); }}>Upload More</button>
          </div>
        </div>
      )}

      <div style={{ ...styles.card, marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>📜 Import History</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>File</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Records</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {IMPORT_HISTORY.map(item => (
              <tr key={item.id}>
                <td style={styles.td}>{item.file}</td>
                <td style={styles.td}>{EMR_TEMPLATES[item.type]?.name}</td>
                <td style={styles.td}>{item.date}</td>
                <td style={styles.td}>{item.records.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={styles.badge(item.status === 'completed' ? '#10b981' : '#f59e0b')}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// CHAT TAB
// ============================================================================
function ChatTab() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: "👋 Hello! I'm your KCN Practice Intelligence Assistant. How can I help you today?", timestamp: new Date().toISOString() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { id: prev.length + 1, role: 'user', content: inputValue, timestamp: new Date().toISOString() }]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: `I understand you're asking about "${inputValue}". Let me analyze that for you...`, timestamp: new Date().toISOString() }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      <h2 style={{ marginBottom: '1rem' }}>💬 KCN Assistant</h2>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', marginBottom: '1rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
            <div style={{ maxWidth: '80%', padding: '1rem', borderRadius: '1rem', background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)', border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', width: 'fit-content' }}>●●●</div>}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input style={{ ...styles.input, flex: 1 }} placeholder="Ask me anything..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
        <button style={styles.button('primary')} onClick={handleSend}>Send →</button>
      </div>
    </div>
  );
}