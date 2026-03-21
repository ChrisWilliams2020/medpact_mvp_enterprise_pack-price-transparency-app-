import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// MedPact Practice Intelligence v2.8.0
// Features: 6 Metric Packages, AI Registration, OnPacePlus, KCN Chat, CSV Hub
// ============================================================================

// ============================================================================
// 6 METRIC PACKAGES - Based on Richard Lindstrom's OSN lecture with John Pinto
// ============================================================================

// Package 1: PRIVATE PRACTICE 9 METRICS
const PRACTICE_9_METRICS = [
  { key: 'collection_rate', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💰' },
  { key: 'days_in_ar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '📅' },
  { key: 'denial_rate', title: 'Denial Rate', benchmark: 5, unit: '%', icon: '❌' },
  { key: 'first_pass_rate', title: 'First Pass Resolution', benchmark: 95, unit: '%', icon: '✅' },
  { key: 'charge_lag', title: 'Charge Lag', benchmark: 2, unit: 'days', icon: '⏱️' },
  { key: 'ar_over_90', title: 'A/R Over 90 Days', benchmark: 15, unit: '%', icon: '⚠️' },
  { key: 'patient_volume', title: 'Patient Volume', benchmark: 1200, unit: 'visits/mo', icon: '👥' },
  { key: 'revenue_per_visit', title: 'Revenue per Visit', benchmark: 185, unit: 'USD', icon: '💵' },
  { key: 'bad_debt_rate', title: 'Bad Debt Rate', benchmark: 3, unit: '%', icon: '📉' }
];

// Package 2: PE PRACTICE 10 METRICS
const PE_10_METRICS = [
  { key: 'pe_revenue', title: 'Total Revenue', benchmark: 2500000, unit: 'USD', icon: '💰' },
  { key: 'pe_ebitda_margin', title: 'EBITDA Margin', benchmark: 25, unit: '%', icon: '📊' },
  { key: 'pe_revenue_per_provider', title: 'Revenue per Provider', benchmark: 625000, unit: 'USD', icon: '👨‍⚕️' },
  { key: 'pe_patients_per_clinic_day', title: 'Patients per Clinic Day', benchmark: 28, unit: 'patients', icon: '📅' },
  { key: 'pe_procedure_conversion', title: 'Procedure Conversion Rate', benchmark: 35, unit: '%', icon: '🔬' },
  { key: 'pe_net_collection_rate', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💵' },
  { key: 'pe_days_in_ar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '⏰' },
  { key: 'pe_staffing_ratio', title: 'Staffing Ratio', benchmark: 4.5, unit: 'staff:1', icon: '��' },
  { key: 'pe_cost_per_encounter', title: 'Cost per Encounter', benchmark: 85, unit: 'USD', icon: '📋' },
  { key: 'pe_asc_utilization', title: 'ASC Utilization', benchmark: 78, unit: '%', icon: '🏥' }
];

// Package 3: KPI 25 METRICS
const KPI_25_METRICS = [
  { key: 'kpi_total_revenue', title: 'Total Revenue', benchmark: 15000000, unit: 'USD', icon: '💵', category: 'financial' },
  { key: 'kpi_ebitda', title: 'EBITDA', benchmark: 3750000, unit: 'USD', icon: '📈', category: 'financial' },
  { key: 'kpi_ebitda_margin', title: 'EBITDA Margin', benchmark: 25, unit: '%', icon: '📊', category: 'financial' },
  { key: 'kpi_revenue_per_provider', title: 'Revenue per Provider', benchmark: 750000, unit: 'USD', icon: '👨‍⚕️', category: 'financial' },
  { key: 'kpi_revenue_per_encounter', title: 'Revenue per Encounter', benchmark: 185, unit: 'USD', icon: '💰', category: 'financial' },
  { key: 'kpi_revenue_growth', title: 'Revenue Growth Rate', benchmark: 12, unit: '%', icon: '🚀', category: 'financial' },
  { key: 'kpi_wrvus', title: 'Work RVUs per Provider', benchmark: 8500, unit: 'wRVUs', icon: '⚡', category: 'productivity' },
  { key: 'kpi_patients_per_day', title: 'Patients per Provider Day', benchmark: 28, unit: 'patients', icon: '📅', category: 'productivity' },
  { key: 'kpi_surgical_cases', title: 'Surgical Cases per Surgeon', benchmark: 420, unit: 'cases/yr', icon: '🔪', category: 'productivity' },
  { key: 'kpi_procedure_conversion', title: 'Procedure Conversion Rate', benchmark: 35, unit: '%', icon: '🔬', category: 'productivity' },
  { key: 'kpi_injection_rate', title: 'Injection Rate', benchmark: 6.5, unit: 'per patient', icon: '💉', category: 'productivity' },
  { key: 'kpi_new_patient_rate', title: 'New Patient Rate', benchmark: 25, unit: '%', icon: '🆕', category: 'productivity' },
  { key: 'kpi_ncr', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💵', category: 'rcm' },
  { key: 'kpi_dar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '📆', category: 'rcm' },
  { key: 'kpi_denial_rate', title: 'Denial Rate', benchmark: 5, unit: '%', icon: '❌', category: 'rcm' },
  { key: 'kpi_first_pass', title: 'First Pass Resolution', benchmark: 95, unit: '%', icon: '✅', category: 'rcm' },
  { key: 'kpi_charge_lag', title: 'Charge Lag', benchmark: 2, unit: 'days', icon: '⏱️', category: 'rcm' },
  { key: 'kpi_bad_debt', title: 'Bad Debt Rate', benchmark: 3, unit: '%', icon: '📉', category: 'rcm' },
  { key: 'kpi_staffing_ratio', title: 'Staff per Provider', benchmark: 4.5, unit: 'ratio', icon: '👥', category: 'operations' },
  { key: 'kpi_cost_per_encounter', title: 'Cost per Encounter', benchmark: 85, unit: 'USD', icon: '📋', category: 'operations' },
  { key: 'kpi_expense_ratio', title: 'Operating Expense Ratio', benchmark: 65, unit: '%', icon: '⚙️', category: 'operations' },
  { key: 'kpi_optical_revenue', title: 'Optical Revenue per Patient', benchmark: 285, unit: 'USD', icon: '👓', category: 'operations' },
  { key: 'kpi_wait_time', title: 'Average Wait Time', benchmark: 15, unit: 'min', icon: '⏰', category: 'operations' },
  { key: 'kpi_asc_utilization', title: 'ASC Utilization', benchmark: 78, unit: '%', icon: '🏥', category: 'surgical' },
  { key: 'kpi_revenue_per_case', title: 'Avg Revenue per Surgical Case', benchmark: 2200, unit: 'USD', icon: '💎', category: 'surgical' }
];

// Package 4: PRIVATE ASC 25 METRICS
const ASC_25_METRICS = [
  { key: 'asc_cases_per_or', title: 'Cases per OR per Day', benchmark: 8, unit: 'cases', icon: '🔪', category: 'throughput' },
  { key: 'asc_turnover_time', title: 'Room Turnover Time', benchmark: 12, unit: 'min', icon: '⏱️', category: 'throughput' },
  { key: 'asc_first_case_ontime', title: 'First Case On-Time Start', benchmark: 90, unit: '%', icon: '🕐', category: 'throughput' },
  { key: 'asc_block_utilization', title: 'Block Utilization', benchmark: 85, unit: '%', icon: '📊', category: 'throughput' },
  { key: 'asc_cancellation_rate', title: 'Same-Day Cancellation Rate', benchmark: 3, unit: '%', icon: '❌' },
  { key: 'asc_cost_per_case', title: 'Total Cost per Case', benchmark: 850, unit: 'USD', icon: '💰', category: 'cost' },
  { key: 'asc_supply_cost', title: 'Supply Cost per Case', benchmark: 285, unit: 'USD', icon: '📦', category: 'cost' },
  { key: 'asc_labor_cost', title: 'Labor Cost per Case', benchmark: 425, unit: 'USD', icon: '👥', category: 'cost' },
  { key: 'asc_implant_cost', title: 'Implant/IOL Cost per Case', benchmark: 225, unit: 'USD', icon: '👁️', category: 'cost' },
  { key: 'asc_cataract_supply', title: 'Cataract Supply Cost', benchmark: 385, unit: 'USD', icon: '👁️', category: 'cost' },
  { key: 'asc_drug_cost', title: 'Drug Cost per Case', benchmark: 45, unit: 'USD', icon: '💊', category: 'cost' },
  { key: 'asc_disposable_cost', title: 'Disposable Instrument Cost', benchmark: 65, unit: 'USD', icon: '🔧', category: 'cost' },
  { key: 'asc_revenue_per_case', title: 'Revenue per Case', benchmark: 1650, unit: 'USD', icon: '💵', category: 'revenue' },
  { key: 'asc_contribution_margin', title: 'Contribution Margin', benchmark: 800, unit: 'USD', icon: '📈', category: 'revenue' },
  { key: 'asc_premium_iol_rate', title: 'Premium IOL Penetration', benchmark: 35, unit: '%', icon: '💎', category: 'revenue' },
  { key: 'asc_net_collection', title: 'Net Collection Rate', benchmark: 97, unit: '%', icon: '💰', category: 'revenue' },
  { key: 'asc_infection_rate', title: 'Surgical Site Infection Rate', benchmark: 0.5, unit: 'per 1000', icon: '🦠', category: 'quality' },
  { key: 'asc_endophthalmitis', title: 'Endophthalmitis Rate', benchmark: 0.05, unit: 'per 1000', icon: '🦠', category: 'quality' },
  { key: 'asc_unplanned_return', title: 'Unplanned Return to OR', benchmark: 0.5, unit: '%', icon: '🔄', category: 'quality' },
  { key: 'asc_patient_satisfaction', title: 'Patient Satisfaction', benchmark: 95, unit: '%', icon: '⭐', category: 'quality' },
  { key: 'asc_visual_outcome', title: 'Visual Outcome Achievement', benchmark: 98, unit: '%', icon: '👁️', category: 'quality' },
  { key: 'asc_cases_per_fte', title: 'Cases per Clinical FTE', benchmark: 450, unit: 'cases/FTE', icon: '👥', category: 'staff' },
  { key: 'asc_staff_cost_ratio', title: 'Staff Cost to Revenue', benchmark: 28, unit: '%', icon: '📊', category: 'staff' },
  { key: 'asc_overtime_rate', title: 'Overtime Percentage', benchmark: 5, unit: '%', icon: '⏰', category: 'staff' }
];

// Package 5: PE ASC 21 METRICS
const PE_ASC_METRICS = [
  { key: 'pe_asc_ebitda_margin', title: 'EBITDA Margin', benchmark: 32, unit: '%', icon: '📊', category: 'financial' },
  { key: 'pe_asc_ebitda_per_or', title: 'EBITDA per OR', benchmark: 850000, unit: 'USD', icon: '💰', category: 'financial' },
  { key: 'pe_asc_ebitda_per_case', title: 'EBITDA per Case', benchmark: 425, unit: 'USD', icon: '💵', category: 'financial' },
  { key: 'pe_asc_revenue_per_case', title: 'Revenue per Case', benchmark: 1850, unit: 'USD', icon: '💰', category: 'financial' },
  { key: 'pe_asc_net_margin', title: 'Net Operating Margin', benchmark: 18, unit: '%', icon: '📈', category: 'financial' },
  { key: 'pe_asc_volume_growth', title: 'Case Volume Growth', benchmark: 8, unit: '%', icon: '📈', category: 'growth' },
  { key: 'pe_asc_cataract_growth', title: 'Cataract Surgery Growth', benchmark: 6, unit: '%', icon: '👁️', category: 'growth' },
  { key: 'pe_asc_premium_iol', title: 'Premium IOL Penetration', benchmark: 35, unit: '%', icon: '💎', category: 'growth' },
  { key: 'pe_asc_market_share', title: 'Regional Market Share', benchmark: 25, unit: '%', icon: '🎯', category: 'growth' },
  { key: 'pe_asc_or_utilization', title: 'OR Utilization Rate', benchmark: 82, unit: '%', icon: '🏥', category: 'operations' },
  { key: 'pe_asc_revenue_per_or', title: 'Revenue per OR', benchmark: 2500000, unit: 'USD', icon: '💰', category: 'operations' },
  { key: 'pe_asc_cases_per_or', title: 'Annual Cases per OR', benchmark: 1200, unit: 'cases', icon: '🔪', category: 'operations' },
  { key: 'pe_asc_medicare_mix', title: 'Medicare vs Commercial', benchmark: 35, unit: '% commercial', icon: '📋', category: 'payer' },
  { key: 'pe_asc_avg_reimbursement', title: 'Avg Reimbursement', benchmark: 1650, unit: 'USD', icon: '💵', category: 'payer' },
  { key: 'pe_asc_oop_revenue', title: 'Out-of-Pocket Revenue', benchmark: 425, unit: 'USD', icon: '💳', category: 'payer' },
  { key: 'pe_asc_roic', title: 'Return on Invested Capital', benchmark: 22, unit: '%', icon: '📊', category: 'investment' },
  { key: 'pe_asc_physician_retention', title: 'Physician Retention', benchmark: 95, unit: '%', icon: '👨‍⚕️', category: 'investment' },
  { key: 'pe_asc_capex_ratio', title: 'CapEx to Revenue', benchmark: 5, unit: '%', icon: '🔧', category: 'investment' },
  { key: 'pe_asc_debt_ebitda', title: 'Debt to EBITDA', benchmark: 3.5, unit: 'x', icon: '📉', category: 'investment' },
  { key: 'pe_asc_pcr_rate', title: 'PCR Rate', benchmark: 1.5, unit: 'per 1000', icon: '⚠️', category: 'quality' },
  { key: 'pe_asc_endophthalmitis', title: 'Endophthalmitis Rate', benchmark: 0.4, unit: 'per 10000', icon: '🦠', category: 'quality' }
];

// Package 6: PRICE TRANSPARENCY DATA
const PRICE_TRANSPARENCY_DATA = [
  { cptCode: '99213', description: 'Office Visit - Est (Level 3)', commercial: 125, medicare: 79.17, medicaid: 55.42, volume: 450 },
  { cptCode: '99214', description: 'Office Visit - Est (Level 4)', commercial: 175, medicare: 117.46, medicaid: 82.22, volume: 380 },
  { cptCode: '92014', description: 'Eye Exam - Established', commercial: 135, medicare: 85.42, medicaid: 59.79, volume: 520 },
  { cptCode: '92134', description: 'OCT Retina', commercial: 75, medicare: 42.15, medicaid: 29.51, volume: 680 },
  { cptCode: '92250', description: 'Fundus Photography', commercial: 65, medicare: 38.24, medicaid: 26.77, volume: 420 },
  { cptCode: '92083', description: 'Visual Field Exam', commercial: 95, medicare: 55.18, medicaid: 38.63, volume: 310 },
  { cptCode: '65855', description: 'Laser Trabeculoplasty (SLT)', commercial: 850, medicare: 512.34, medicaid: 358.64, volume: 45 },
  { cptCode: '66821', description: 'YAG Capsulotomy', commercial: 650, medicare: 385.72, medicaid: 270.00, volume: 65 },
  { cptCode: '66984', description: 'Cataract Surgery with IOL', commercial: 3500, medicare: 2156.00, medicaid: 1509.20, volume: 85 },
  { cptCode: '67028', description: 'Intravitreal Injection', commercial: 285, medicare: 165.42, medicaid: 115.79, volume: 320 }
];

// Metric Package Definitions
const METRIC_PACKAGES = [
  { id: 'practice9', name: 'Private Practice 9', icon: '🏥', metrics: PRACTICE_9_METRICS, description: 'Standard RCM metrics for individual practices' },
  { id: 'pe10', name: 'PE Practice 10', icon: '📊', metrics: PE_10_METRICS, description: 'Private Equity investment evaluation' },
  { id: 'kpi25', name: 'KPI 25', icon: '📈', metrics: KPI_25_METRICS, description: 'Comprehensive practice operations' },
  { id: 'asc25', name: 'Private ASC 25', icon: '🔬', metrics: ASC_25_METRICS, description: 'Surgical center throughput & efficiency' },
  { id: 'peasc21', name: 'PE ASC 21', icon: '💼', metrics: PE_ASC_METRICS, description: 'PE ASC valuation metrics' },
  { id: 'pricing', name: 'Price Transparency', icon: '💰', metrics: PRICE_TRANSPARENCY_DATA, description: 'Reimbursement analysis by payer' }
];

// Admin Roles
const ADMIN_ROLES = {
  medpact_team: { id: 'medpact_team', name: 'MedPact Team', icon: '��', password: 'medpact2026', access: ['all'], description: 'Full platform access' },
  owner: { id: 'owner', name: 'Owner', icon: '👔', password: 'owner2026', access: ['payment', 'renewal', 'survey', 'metrics'], description: 'Payment & metrics access' },
  administrator: { id: 'administrator', name: 'Administrator', icon: '⚙️', password: 'admin2026', access: ['survey', 'metrics'], description: 'Survey & metrics access' }
};

// CSV Templates
const CSV_TEMPLATES = [
  { id: 'practice_registration', name: 'Practice Registration', icon: '🏥', fields: ['practice_name', 'npi', 'tax_id', 'address', 'city', 'state', 'zip', 'phone', 'email', 'specialty', 'provider_count'] },
  { id: 'claims_data', name: 'Claims Data', icon: '📋', fields: ['claim_id', 'patient_id', 'date_of_service', 'cpt_code', 'icd10_primary', 'provider_npi', 'payer_name', 'billed_amount', 'allowed_amount', 'paid_amount', 'claim_status'] },
  { id: 'charges_data', name: 'Charges Data', icon: '💰', fields: ['charge_id', 'patient_id', 'date_of_service', 'cpt_code', 'modifier', 'units', 'charge_amount', 'provider_npi', 'department'] },
  { id: 'payments_data', name: 'Payments Data', icon: '💳', fields: ['payment_id', 'claim_id', 'payment_date', 'payer_name', 'check_number', 'paid_amount', 'adjustment_amount', 'payment_method'] },
  { id: 'ar_aging_data', name: 'A/R Aging Data', icon: '📊', fields: ['account_id', 'patient_name', 'payer_name', 'total_balance', 'current_0_30', 'aging_31_60', 'aging_61_90', 'aging_over_90'] },
  { id: 'patient_demographics', name: 'Patient Demographics', icon: '👥', fields: ['patient_id', 'date_of_birth', 'gender', 'zip_code', 'primary_insurance', 'insurance_type', 'patient_status'] },
  { id: 'doctor_roster', name: 'Doctor Roster', icon: '👨‍⚕️', fields: ['provider_id', 'first_name', 'last_name', 'npi', 'specialty', 'license_number', 'dea_number', 'status'] },
  { id: 'employee_roster', name: 'Employee Roster', icon: '👥', fields: ['employee_id', 'first_name', 'last_name', 'role', 'department', 'hire_date', 'employment_type', 'status'] },
  { id: 'payer_contracts', name: 'Payer Contracts', icon: '📑', fields: ['contract_id', 'payer_name', 'contract_type', 'effective_date', 'termination_date', 'fee_schedule_type', 'percent_of_medicare'] }
];

// Innovation Phases for OnPacePlus
const INNOVATION_PHASES = [
  { id: 'discovery', name: 'Discovery', icon: '🔍', color: '#6366F1' },
  { id: 'ideation', name: 'Ideation', icon: '💡', color: '#8B5CF6' },
  { id: 'planning', name: 'Planning', icon: '📋', color: '#EC4899' },
  { id: 'development', name: 'Development', icon: '🛠️', color: '#F59E0B' },
  { id: 'implementation', name: 'Implementation', icon: '🚀', color: '#10B981' },
  { id: 'optimization', name: 'Optimization', icon: '📈', color: '#06B6D4' }
];

// Core Dashboard Metrics
const CORE_METRICS = [
  { id: 'revenue', name: 'Total Revenue', value: '$2,450,000', trend: '+5.2%', trendUp: true, percentile: 72, icon: '💰' },
  { id: 'patient-volume', name: 'Patient Volume', value: '1,250', trend: '+3.1%', trendUp: true, percentile: 68, icon: '👥' },
  { id: 'collections', name: 'Collections Rate', value: '94.5%', trend: '+1.8%', trendUp: true, percentile: 82, icon: '📊' },
  { id: 'wait-time', name: 'Avg Wait Time', value: '12 min', trend: '-8.5%', trendUp: true, percentile: 75, icon: '⏱️' },
  { id: 'no-show', name: 'No-Show Rate', value: '8.2%', trend: '-12.3%', trendUp: true, percentile: 78, icon: '📅' },
  { id: 'productivity', name: 'Provider Productivity', value: '32 pts/day', trend: '+4.2%', trendUp: true, percentile: 71, icon: '⚡' }
];

// Main Component
const Benchmarks = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetricPackage, setSelectedMetricPackage] = useState(null);
  
  // Admin State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);
  const [adminPanelTab, setAdminPanelTab] = useState('metrics');

  // KCN Chat State
  const [kcnMessages, setKcnMessages] = useState([
    { id: 1, user: 'Dr. Sarah Chen', avatar: '👩‍⚕️', message: 'Has anyone implemented the new OCT billing codes?', timestamp: '10:30 AM', channel: 'billing' },
    { id: 2, user: 'James Wilson', avatar: '👨‍💼', message: 'Yes! 15% increase in collections after the update.', timestamp: '10:32 AM', channel: 'billing' }
  ]);
  const [kcnInput, setKcnInput] = useState('');
  const [kcnChannel, setKcnChannel] = useState('general');

  const hasAccess = (feature) => {
    if (!currentAdminRole) return false;
    return currentAdminRole.access.includes('all') || currentAdminRole.access.includes(feature);
  };

  const handleAdminLogin = () => {
    const role = ADMIN_ROLES[selectedRole];
    if (role && passwordInput === role.password) {
      setIsAuthenticated(true);
      setCurrentAdminRole(role);
      setPasswordError('');
      setPasswordInput('');
      setShowAdminModal(false);
    } else {
      setPasswordError('Invalid password');
    }
  };

  const handleSendKcnMessage = () => {
    if (!kcnInput.trim()) return;
    setKcnMessages(prev => [...prev, {
      id: Date.now(),
      user: 'You',
      avatar: '👤',
      message: kcnInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: kcnChannel
    }]);
    setKcnInput('');
  };

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <nav className="px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏥</span>
              <div>
                <h1 className="text-2xl font-bold text-white">MedPact</h1>
                <p className="text-xs text-blue-300">Practice Intelligence v2.8.0</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAdminModal(true)} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold">
                🔐 Admin
              </button>
              <button onClick={() => setCurrentScreen('app')} className="px-6 py-2 bg-white text-indigo-900 rounded-full font-semibold">
                Launch Dashboard →
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-8 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Practice Intelligence <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Reimagined</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
            6 Metric Packages based on Richard Lindstrom & John Pinto's OSN methodology
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {METRIC_PACKAGES.map(pkg => (
              <div key={pkg.id} onClick={() => { setSelectedMetricPackage(pkg); setShowAdminModal(true); }} className="p-4 rounded-xl bg-white/10 backdrop-blur cursor-pointer hover:bg-white/20 transition-all">
                <div className="text-3xl mb-2">{pkg.icon}</div>
                <h3 className="text-sm font-bold text-white">{pkg.name}</h3>
                <p className="text-xs text-blue-200 mt-1">{pkg.metrics.length} metrics</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-12">
            {[
              { icon: '🤖', title: 'AI Registration', color: 'from-cyan-500 to-cyan-700' },
              { icon: '📊', title: 'OnPacePlus', color: 'from-emerald-500 to-emerald-700' },
              { icon: '💬', title: 'KCN Chat', color: 'from-violet-500 to-violet-700' },
              { icon: '📄', title: 'CSV Hub', color: 'from-orange-500 to-orange-700' }
            ].map((feature, idx) => (
              <div key={idx} onClick={() => setShowAdminModal(true)} className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} cursor-pointer hover:scale-105 transition-all`}>
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex justify-between">
                <h2 className="text-xl font-bold">🔐 Admin Access</h2>
                <button onClick={() => { setShowAdminModal(false); setSelectedRole(null); setPasswordError(''); }} className="hover:bg-white/20 rounded-full p-2">✕</button>
              </div>
              <div className="p-6">
                {!selectedRole ? (
                  <div className="space-y-3">
                    {Object.values(ADMIN_ROLES).map(role => (
                      <button key={role.id} onClick={() => setSelectedRole(role.id)} className="w-full p-4 rounded-xl border-2 text-left hover:border-purple-500 flex items-center gap-4">
                        <span className="text-3xl">{role.icon}</span>
                        <div>
                          <h3 className="font-semibold">{role.name}</h3>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button onClick={() => setSelectedRole(null)} className="text-blue-600 text-sm">← Back</button>
                    <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full p-3 border-2 rounded-xl" placeholder="Password" />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    <button onClick={handleAdminLogin} className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold">Login</button>
                    <p className="text-xs text-gray-400 text-center">Demo: medpact2026 | owner2026 | admin2026</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ADMIN PANEL
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{currentAdminRole?.icon}</span>
              <div>
                <h1 className="text-xl font-bold">Admin Panel - {currentAdminRole?.name}</h1>
                <p className="text-sm opacity-80">MedPact v2.8.0</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCurrentScreen('app')} className="px-4 py-2 bg-white/20 rounded-lg">📊 Dashboard</button>
              <button onClick={() => { setIsAuthenticated(false); setCurrentAdminRole(null); }} className="px-4 py-2 bg-red-500 rounded-lg">Logout</button>
            </div>
          </div>
        </div>

        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 flex gap-2 py-2 overflow-x-auto">
            {[
              { id: 'metrics', label: '📊 6 Metric Packages', access: 'metrics' },
              { id: 'kcn', label: '💬 KCN Chat', access: 'all' },
              { id: 'csv', label: '📄 CSV Hub', access: 'all' },
              { id: 'survey', label: '🤖 AI Surveys', access: 'survey' },
              { id: 'payment', label: '💳 Payment', access: 'payment' }
            ].filter(tab => hasAccess(tab.access)).map(tab => (
              <button key={tab.id} onClick={() => setAdminPanelTab(tab.id)} className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === tab.id ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* 6 METRIC PACKAGES */}
          {adminPanelTab === 'metrics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">📊 6 Metric Packages</h2>
              <p className="text-gray-500">Based on Richard Lindstrom & John Pinto's OSN lecture</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {METRIC_PACKAGES.map(pkg => (
                  <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{pkg.icon}</span>
                        <div>
                          <h3 className="font-bold">{pkg.name}</h3>
                          <p className="text-sm opacity-80">{pkg.metrics.length} metrics</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 max-h-64 overflow-y-auto">
                      {pkg.id === 'pricing' ? (
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-1">CPT</th>
                              <th className="text-right">Comm</th>
                              <th className="text-right">MCR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pkg.metrics.slice(0, 6).map(m => (
                              <tr key={m.cptCode} className="border-b">
                                <td className="py-1 font-mono">{m.cptCode}</td>
                                <td className="text-right text-blue-600">${m.commercial}</td>
                                <td className="text-right text-green-600">${m.medicare}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="space-y-2">
                          {pkg.metrics.slice(0, 6).map(m => (
                            <div key={m.key} className="flex items-center justify-between text-sm border-b pb-2">
                              <div className="flex items-center gap-2">
                                <span>{m.icon}</span>
                                <span>{m.title}</span>
                              </div>
                              <span className="font-semibold text-purple-600">{m.benchmark} {m.unit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                      <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">View All Metrics</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KCN CHAT */}
          {adminPanelTab === 'kcn' && (
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-semibold mb-3">💬 Channels</h3>
                {['general', 'billing', 'clinical', 'technology'].map(ch => (
                  <button key={ch} onClick={() => setKcnChannel(ch)} className={`w-full p-2 rounded-lg text-left mb-1 ${kcnChannel === ch ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}>
                    # {ch}
                  </button>
                ))}
              </div>
              <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: '500px' }}>
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white">
                  <h2 className="font-bold">Knowledge & Communication Network</h2>
                  <p className="text-sm opacity-80"># {kcnChannel}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {kcnMessages.filter(m => m.channel === kcnChannel).map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.user === 'You' ? 'justify-end' : ''}`}>
                      {msg.user !== 'You' && <span className="text-2xl">{msg.avatar}</span>}
                      <div className={`max-w-[70%] p-3 rounded-2xl ${msg.user === 'You' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                        {msg.user !== 'You' && <p className="text-sm font-semibold mb-1">{msg.user}</p>}
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.user === 'You' ? 'text-purple-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-4 flex gap-2">
                  <input type="text" value={kcnInput} onChange={(e) => setKcnInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendKcnMessage()} className="flex-1 p-3 border rounded-xl" placeholder={`Message #${kcnChannel}...`} />
                  <button onClick={handleSendKcnMessage} className="px-6 py-3 bg-purple-600 text-white rounded-xl">Send</button>
                </div>
              </div>
            </div>
          )}

          {/* CSV HUB */}
          {adminPanelTab === 'csv' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">📄 CSV Conversion Hub</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {CSV_TEMPLATES.map(template => (
                  <div key={template.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{template.icon}</span>
                      <h3 className="font-semibold">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{template.fields.length} fields</p>
                    <button className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">📥 Download Template</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI SURVEYS */}
          {adminPanelTab === 'survey' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🤖 AI Survey Generation</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {['Staff Satisfaction', 'Patient Experience', 'Efficiency Assessment'].map(type => (
                  <button key={type} className="p-6 border-2 rounded-xl hover:border-purple-500 text-center">
                    <span className="text-4xl block mb-3">{type === 'Staff Satisfaction' ? '👥' : type === 'Patient Experience' ? '🏥' : '⚡'}</span>
                    <h3 className="font-semibold">{type}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENT */}
          {adminPanelTab === 'payment' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">💳 Payment & Billing</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border-2 rounded-xl p-6 text-center">
                  <span className="text-4xl block mb-2">🏆</span>
                  <h3 className="text-xl font-bold text-purple-600">Professional</h3>
                  <p className="text-3xl font-bold mt-2">$299<span className="text-sm text-gray-500">/mo</span></p>
                </div>
                <div className="border-2 rounded-xl p-6">
                  <h4 className="font-semibold mb-4">Payment Method</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/27</p>
                  </div>
                </div>
                <div className="border-2 rounded-xl p-6">
                  <h4 className="font-semibold mb-4">Billing History</h4>
                  {['Mar 21', 'Feb 21', 'Jan 21'].map(date => (
                    <div key={date} className="flex justify-between py-2 border-b text-sm">
                      <span>{date}, 2026</span>
                      <span className="text-green-600">Paid</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentScreen('home')} className="p-2 hover:bg-gray-100 rounded-lg">🏠</button>
            <div>
              <h1 className="text-2xl font-bold">🏥 MedPact Practice Intelligence</h1>
              <p className="text-sm text-gray-500">v2.8.0 | Bay Area Eye Care</p>
            </div>
          </div>
          <button onClick={() => setShowAdminModal(true)} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">�� Admin</button>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 py-2 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'metrics', label: '📈 Metrics' },
            { id: 'pricing', label: '💰 Pricing' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CORE_METRICS.map(m => (
              <div key={m.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
                <div className="text-2xl">{m.icon}</div>
                <div className="text-xs text-gray-500">{m.name}</div>
                <div className="text-lg font-bold">{m.value}</div>
                <div className={`text-sm ${m.trendUp ? 'text-green-600' : 'text-red-600'}`}>{m.trend}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {METRIC_PACKAGES.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl" onClick={() => setShowAdminModal(true)}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{pkg.icon}</span>
                  <div>
                    <h3 className="font-bold">{pkg.name}</h3>
                    <p className="text-sm text-gray-500">{pkg.metrics.length} metrics</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">CPT Code</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-center py-3 px-4 text-blue-600">Commercial</th>
                  <th className="text-center py-3 px-4 text-green-600">Medicare</th>
                  <th className="text-center py-3 px-4 text-orange-600">Medicaid</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_TRANSPARENCY_DATA.map(p => (
                  <tr key={p.cptCode} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">{p.cptCode}</td>
                    <td className="py-3 px-4 text-sm">{p.description}</td>
                    <td className="py-3 px-4 text-center text-blue-600 font-medium">${p.commercial}</td>
                    <td className="py-3 px-4 text-center text-green-600">${p.medicare}</td>
                    <td className="py-3 px-4 text-center text-orange-600">${p.medicaid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex justify-between">
              <h2 className="text-xl font-bold">🔐 Admin Access</h2>
              <button onClick={() => { setShowAdminModal(false); setSelectedRole(null); }} className="hover:bg-white/20 rounded-full p-2">✕</button>
            </div>
            <div className="p-6">
              {!selectedRole ? (
                <div className="space-y-3">
                  {Object.values(ADMIN_ROLES).map(role => (
                    <button key={role.id} onClick={() => setSelectedRole(role.id)} className="w-full p-4 rounded-xl border-2 text-left hover:border-purple-500 flex items-center gap-4">
                      <span className="text-3xl">{role.icon}</span>
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => setSelectedRole(null)} className="text-blue-600 text-sm">← Back</button>
                  <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full p-3 border-2 rounded-xl" placeholder="Password" />
                  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  <button onClick={handleAdminLogin} className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold">Login</button>
                  <p className="text-xs text-gray-400 text-center">Demo: medpact2026 | owner2026 | admin2026</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benchmarks;
