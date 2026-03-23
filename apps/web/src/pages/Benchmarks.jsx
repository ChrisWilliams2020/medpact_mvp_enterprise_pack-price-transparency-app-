import React, { useState, useRef, useEffect } from 'react';

// MedPact Practice Intelligence v3.0.0 - Enhanced with Competitive Intelligence
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

const PE_10_METRICS = [
  { key: 'pe_revenue', title: 'Total Revenue', benchmark: 2500000, unit: 'USD', icon: '💰' },
  { key: 'pe_ebitda_margin', title: 'EBITDA Margin', benchmark: 25, unit: '%', icon: '📊' },
  { key: 'pe_revenue_per_provider', title: 'Revenue per Provider', benchmark: 625000, unit: 'USD', icon: '👨‍⚕️' },
  { key: 'pe_patients_per_clinic_day', title: 'Patients per Clinic Day', benchmark: 28, unit: 'patients', icon: '📅' },
  { key: 'pe_procedure_conversion', title: 'Procedure Conversion Rate', benchmark: 35, unit: '%', icon: '🔬' },
  { key: 'pe_net_collection_rate', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💵' },
  { key: 'pe_days_in_ar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '⏰' },
  { key: 'pe_staffing_ratio', title: 'Staffing Ratio', benchmark: 4.5, unit: 'staff:1', icon: '👥' },
  { key: 'pe_cost_per_encounter', title: 'Cost per Encounter', benchmark: 85, unit: 'USD', icon: '📋' },
  { key: 'pe_asc_utilization', title: 'ASC Utilization', benchmark: 78, unit: '%', icon: '🏥' }
];

const KPI_25_METRICS = [
  { key: 'kpi_total_revenue', title: 'Total Revenue', benchmark: 15000000, unit: 'USD', icon: '💵' },
  { key: 'kpi_ebitda', title: 'EBITDA', benchmark: 3750000, unit: 'USD', icon: '📈' },
  { key: 'kpi_ebitda_margin', title: 'EBITDA Margin', benchmark: 25, unit: '%', icon: '📊' },
  { key: 'kpi_revenue_per_provider', title: 'Revenue per Provider', benchmark: 750000, unit: 'USD', icon: '👨‍⚕️' },
  { key: 'kpi_ncr', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💵' },
  { key: 'kpi_dar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '📆' },
  { key: 'kpi_denial_rate', title: 'Denial Rate', benchmark: 5, unit: '%', icon: '❌' }
];

const ASC_25_METRICS = [
  { key: 'asc_cases_per_or', title: 'Cases per OR per Day', benchmark: 8, unit: 'cases', icon: '🔪' },
  { key: 'asc_turnover_time', title: 'Room Turnover Time', benchmark: 12, unit: 'min', icon: '⏱️' },
  { key: 'asc_cost_per_case', title: 'Total Cost per Case', benchmark: 850, unit: 'USD', icon: '💰' },
  { key: 'asc_revenue_per_case', title: 'Revenue per Case', benchmark: 1650, unit: 'USD', icon: '💵' },
  { key: 'asc_premium_iol_rate', title: 'Premium IOL Rate', benchmark: 35, unit: '%', icon: '💎' }
];

const PE_ASC_METRICS = [
  { key: 'pe_asc_ebitda_margin', title: 'EBITDA Margin', benchmark: 32, unit: '%', icon: '📊' },
  { key: 'pe_asc_ebitda_per_or', title: 'EBITDA per OR', benchmark: 850000, unit: 'USD', icon: '💰' },
  { key: 'pe_asc_revenue_per_case', title: 'Revenue per Case', benchmark: 1850, unit: 'USD', icon: '💰' },
  { key: 'pe_asc_or_utilization', title: 'OR Utilization Rate', benchmark: 82, unit: '%', icon: '🏥' }
];

const RETINA_12_METRICS = [
  { key: 'retina_injection_volume', title: 'Monthly Injection Volume', benchmark: 450, unit: 'injections/mo', icon: '💉' },
  { key: 'retina_drug_cost', title: 'Avg Drug Cost per Injection', benchmark: 1850, unit: 'USD', icon: '💊' },
  { key: 'retina_revenue_per_injection', title: 'Revenue per Injection', benchmark: 285, unit: 'USD', icon: '💵' },
  { key: 'retina_retention_rate', title: 'Patient Retention Rate', benchmark: 85, unit: '%', icon: '🔄' }
];

const METRIC_PACKAGES = {
  practice_9: { name: 'Private Practice 9', metrics: PRACTICE_9_METRICS, color: '#3B82F6' },
  pe_10: { name: 'PE Practice 10', metrics: PE_10_METRICS, color: '#8B5CF6' },
  kpi_25: { name: 'KPI 25', metrics: KPI_25_METRICS, color: '#10B981' },
  asc_25: { name: 'Private ASC 25', metrics: ASC_25_METRICS, color: '#F59E0B' },
  pe_asc_21: { name: 'PE ASC 21', metrics: PE_ASC_METRICS, color: '#EF4444' },
  retina_12: { name: 'Retina 12', metrics: RETINA_12_METRICS, color: '#EC4899' }
};

const CPT_CODES = [
  { code: '66984', description: 'Cataract Surgery (Standard)', medicareRate: 535.42, category: 'Cataract', wRVU: 10.36 },
  { code: '66982', description: 'Cataract Surgery (Complex)', medicareRate: 652.18, category: 'Cataract', wRVU: 12.62 },
  { code: '67028', description: 'Intravitreal Injection', medicareRate: 95.67, category: 'Retina', wRVU: 1.80 },
  { code: '67210', description: 'Retinal Laser (PRP)', medicareRate: 285.45, category: 'Retina', wRVU: 5.52 },
  { code: '67040', description: 'Vitrectomy (Posterior)', medicareRate: 1245.80, category: 'Retina', wRVU: 24.10 },
  { code: '65855', description: 'Trabeculoplasty (SLT/ALT)', medicareRate: 245.67, category: 'Glaucoma', wRVU: 4.75 },
  { code: '66170', description: 'Trabeculectomy', medicareRate: 985.45, category: 'Glaucoma', wRVU: 19.07 },
  { code: '66711', description: 'iStent Insert', medicareRate: 425.80, category: 'Glaucoma', wRVU: 8.24 },
  { code: '92014', description: 'Comprehensive Exam (Est)', medicareRate: 125.45, category: 'E&M', wRVU: 2.43 },
  { code: '92134', description: 'OCT Retina', medicareRate: 35.80, category: 'Diagnostic', wRVU: 0.69 }
];

const INNOVATIONS = [
  { id: '1', category: 'Cataract', name: 'Light Adjustable Lens (LAL)', manufacturer: 'RxSight', status: 'FDA Approved', year: 2017, adoptionRate: 15, clinicalImpact: 'High' },
  { id: '2', category: 'Retina', name: 'Faricimab (Vabysmo)', manufacturer: 'Genentech', status: 'FDA Approved', year: 2022, adoptionRate: 45, clinicalImpact: 'High' },
  { id: '3', category: 'Glaucoma', name: 'iStent Infinite', manufacturer: 'Glaukos', status: 'FDA Approved', year: 2022, adoptionRate: 25, clinicalImpact: 'High' },
  { id: '4', category: 'Diagnostics', name: 'OCT Angiography', manufacturer: 'Multiple', status: 'FDA Approved', year: 2016, adoptionRate: 65, clinicalImpact: 'High' }
];

// NEW: Competitor Practices Data
const COMPETITOR_PRACTICES = [
  {
    id: 'comp1',
    name: 'Vision Excellence Center',
    type: 'ophthalmology',
    address: '123 Market St, San Francisco, CA 94102',
    lat: 37.7849,
    lng: -122.4094,
    ratings: { google: 4.8, yelp: 4.5, healthgrades: 4.9 },
    reviewCount: 342,
    website: 'visionexcellence.com',
    intel: {
      providers: ['Dr. Sarah Chen - Harvard Medical School', 'Dr. Michael Park - Stanford Ophthalmology'],
      equipment: ['Zeiss OPMI Lumera', 'Alcon LenSx Femtosecond', 'Topcon Maestro OCT'],
      services: ['Cataract Surgery', 'LASIK', 'Glaucoma Treatment', 'Retina Care', 'Oculoplastics'],
      staff: 24,
      languages: ['English', 'Spanish', 'Mandarin'],
      telehealth: true,
      avgWaitTime: '12 min'
    }
  },
  {
    id: 'comp2',
    name: 'Bay Area Eye Associates',
    type: 'optometry',
    address: '456 Powell St, San Francisco, CA 94108',
    lat: 37.7879,
    lng: -122.4075,
    ratings: { google: 4.6, yelp: 4.3, healthgrades: 4.7 },
    reviewCount: 218,
    website: 'bayareaeye.com',
    intel: {
      providers: ['Dr. Jennifer Lee - UC Berkeley Optometry', 'Dr. David Wong - Pacific University'],
      equipment: ['Optos Daytona', 'Humphrey Visual Field', 'iCare Tonometer'],
      services: ['Comprehensive Eye Exams', 'Contact Lens Fitting', 'Dry Eye Treatment', 'Myopia Control'],
      staff: 12,
      languages: ['English', 'Cantonese', 'Vietnamese'],
      telehealth: true,
      avgWaitTime: '8 min'
    }
  },
  {
    id: 'comp3',
    name: 'Pacific Vision Institute',
    type: 'ophthalmology',
    address: '789 Geary St, San Francisco, CA 94109',
    lat: 37.7865,
    lng: -122.4145,
    ratings: { google: 4.9, yelp: 4.7, healthgrades: 4.8 },
    reviewCount: 567,
    website: 'pacificvision.com',
    intel: {
      providers: ['Dr. Robert Kim - Johns Hopkins', 'Dr. Lisa Zhang - Mayo Clinic Fellowship', 'Dr. James Miller - Wills Eye'],
      equipment: ['Zeiss VisuMax', 'Alcon Constellation', 'Heidelberg Spectralis', 'Lenstar LS 900'],
      services: ['LASIK', 'PRK', 'ICL', 'Cataract Surgery', 'Cornea Transplant', 'Keratoconus Treatment'],
      staff: 35,
      languages: ['English', 'Spanish', 'Korean', 'Tagalog'],
      telehealth: true,
      avgWaitTime: '15 min'
    }
  },
  {
    id: 'comp4',
    name: 'Golden Gate Ophthalmology',
    type: 'ophthalmology',
    address: '321 Sutter St, San Francisco, CA 94108',
    lat: 37.7895,
    lng: -122.4055,
    ratings: { google: 4.5, yelp: 4.2, healthgrades: 4.6 },
    reviewCount: 189,
    website: 'goldengateophth.com',
    intel: {
      providers: ['Dr. William Brown - UCSF Ophthalmology', 'Dr. Emily Davis - Duke Eye Center'],
      equipment: ['Zeiss IOLMaster 700', 'Alcon Centurion', 'Optovue Avanti'],
      services: ['Cataract Surgery', 'Glaucoma Surgery', 'Macular Degeneration', 'Diabetic Eye Care'],
      staff: 18,
      languages: ['English', 'Spanish', 'Russian'],
      telehealth: false,
      avgWaitTime: '20 min'
    }
  },
  {
    id: 'comp5',
    name: 'Silicon Valley Eye Center',
    type: 'ophthalmology',
    address: '555 Castro St, Mountain View, CA 94041',
    lat: 37.3894,
    lng: -122.0819,
    ratings: { google: 4.7, yelp: 4.4, healthgrades: 4.8 },
    reviewCount: 423,
    website: 'sveye.com',
    intel: {
      providers: ['Dr. Andrew Thompson - Stanford', 'Dr. Michelle Garcia - Bascom Palmer'],
      equipment: ['CATALYS Laser', 'Zeiss Cirrus OCT', 'Nidek Excimer Laser'],
      services: ['Premium Cataract Surgery', 'LASIK', 'Glaucoma', 'Pediatric Ophthalmology'],
      staff: 28,
      languages: ['English', 'Spanish', 'Hindi', 'Mandarin'],
      telehealth: true,
      avgWaitTime: '10 min'
    }
  },
  {
    id: 'comp6',
    name: 'Peninsula Eye Care',
    type: 'optometry',
    address: '888 El Camino Real, Palo Alto, CA 94301',
    lat: 37.4419,
    lng: -122.1430,
    ratings: { google: 4.4, yelp: 4.1, healthgrades: 4.5 },
    reviewCount: 156,
    website: 'peninsulaeyecare.com',
    intel: {
      providers: ['Dr. Nancy White - SCCO', 'Dr. Tom Richards - New England College of Optometry'],
      equipment: ['Topcon CT-1', 'Marco TRS-5100', 'Oculus Keratograph'],
      services: ['Eye Exams', 'Contact Lenses', 'Vision Therapy', 'Sports Vision'],
      staff: 8,
      languages: ['English', 'Spanish'],
      telehealth: true,
      avgWaitTime: '5 min'
    }
  },
  {
    id: 'comp7',
    name: 'South Bay Retina',
    type: 'ophthalmology',
    address: '1200 Scott Blvd, Santa Clara, CA 95050',
    lat: 37.3541,
    lng: -121.9552,
    ratings: { google: 4.8, yelp: 4.6, healthgrades: 4.9 },
    reviewCount: 287,
    website: 'southbayretina.com',
    intel: {
      providers: ['Dr. Richard Nguyen - Wilmer Eye Institute', 'Dr. Karen Patel - UCLA Jules Stein'],
      equipment: ['Zeiss PLEX Elite', 'Alcon Constellation', 'Optos California'],
      services: ['Retinal Detachment', 'Macular Degeneration', 'Diabetic Retinopathy', 'Vitrectomy', 'Injections'],
      staff: 22,
      languages: ['English', 'Spanish', 'Vietnamese', 'Hindi'],
      telehealth: true,
      avgWaitTime: '18 min'
    }
  },
  {
    id: 'comp8',
    name: 'East Bay Vision Center',
    type: 'general',
    address: '2400 Shattuck Ave, Berkeley, CA 94704',
    lat: 37.8660,
    lng: -122.2590,
    ratings: { google: 4.3, yelp: 4.0, healthgrades: 4.4 },
    reviewCount: 134,
    website: 'eastbayvision.com',
    intel: {
      providers: ['Dr. Laura Martinez - UC Berkeley', 'Dr. Chris Anderson - Illinois College of Optometry'],
      equipment: ['Nidek OPD-Scan III', 'Topcon 3D OCT', 'Reichert Tono-Pen'],
      services: ['Family Eye Care', 'Pediatric Exams', 'Geriatric Vision', 'Low Vision Aids'],
      staff: 10,
      languages: ['English', 'Spanish', 'Japanese'],
      telehealth: false,
      avgWaitTime: '15 min'
    }
  }
];

// NEW: Patient Heat Map ZIP Code Data
const PATIENT_HEATMAP_DATA = [
  { zip: '94102', name: 'Tenderloin/Civic Center', patients: 245, profitIndex: 72, lat: 37.7815, lng: -122.4117 },
  { zip: '94103', name: 'South of Market', patients: 312, profitIndex: 85, lat: 37.7726, lng: -122.4110 },
  { zip: '94104', name: 'Financial District', patients: 89, profitIndex: 99, lat: 37.7914, lng: -122.4020 },
  { zip: '94105', name: 'Rincon Hill', patients: 156, profitIndex: 94, lat: 37.7898, lng: -122.3925 },
  { zip: '94107', name: 'Potrero Hill', patients: 287, profitIndex: 88, lat: 37.7621, lng: -122.3971 },
  { zip: '94108', name: 'Chinatown', patients: 198, profitIndex: 76, lat: 37.7925, lng: -122.4074 },
  { zip: '94109', name: 'Russian Hill/Nob Hill', patients: 423, profitIndex: 96, lat: 37.7935, lng: -122.4213 },
  { zip: '94110', name: 'Mission District', patients: 534, profitIndex: 79, lat: 37.7485, lng: -122.4156 },
  { zip: '94111', name: 'Embarcadero', patients: 67, profitIndex: 98, lat: 37.7990, lng: -122.3985 },
  { zip: '94112', name: 'Ingleside', patients: 612, profitIndex: 74, lat: 37.7198, lng: -122.4426 },
  { zip: '94114', name: 'Castro', patients: 356, profitIndex: 91, lat: 37.7609, lng: -122.4350 },
  { zip: '94115', name: 'Pacific Heights', patients: 289, profitIndex: 97, lat: 37.7869, lng: -122.4377 },
  { zip: '94116', name: 'Sunset', patients: 478, profitIndex: 82, lat: 37.7439, lng: -122.4855 },
  { zip: '94117', name: 'Haight-Ashbury', patients: 267, profitIndex: 84, lat: 37.7699, lng: -122.4469 },
  { zip: '94118', name: 'Inner Richmond', patients: 345, profitIndex: 89, lat: 37.7825, lng: -122.4619 },
  { zip: '94121', name: 'Outer Richmond', patients: 398, profitIndex: 81, lat: 37.7785, lng: -122.4930 },
  { zip: '94122', name: 'Outer Sunset', patients: 567, profitIndex: 78, lat: 37.7588, lng: -122.4845 },
  { zip: '94123', name: 'Marina', patients: 234, profitIndex: 95, lat: 37.8005, lng: -122.4360 },
  { zip: '94124', name: 'Bayview', patients: 389, profitIndex: 68, lat: 37.7308, lng: -122.3883 },
  { zip: '94127', name: 'St. Francis Wood', patients: 178, profitIndex: 93, lat: 37.7352, lng: -122.4575 }
];

const REGISTRATION_STEPS = [
  { id: 'name', question: "What is your practice name?", type: 'text', placeholder: 'Enter practice name' },
  { id: 'type', question: "What type of practice?", type: 'select', options: ['Solo Practice', 'Small Group', 'Large Group', 'PE-Backed'] },
  { id: 'package', question: "Which metric package?", type: 'select', options: ['Private Practice 9', 'PE Practice 10', 'KPI 25', 'Private ASC 25', 'PE ASC 21', 'Retina 12'] }
];

const styles = {
  container: { fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', backgroundColor: '#0a0a0f', minHeight: '100vh', color: '#e0e0e0' },
  header: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px 32px', borderBottom: '1px solid rgba(99, 102, 241, 0.3)' },
  headerContent: { maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  logoText: { fontSize: '22px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  version: { fontSize: '11px', color: '#6366f1', padding: '2px 8px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '10px' },
  nav: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  navBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s' },
  navBtnActive: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' },
  navBtnInactive: { background: 'rgba(99, 102, 241, 0.1)', color: '#a0a0a0', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.2)' },
  main: { maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' },
  pageTitle: { fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#fff' },
  pageSubtitle: { color: '#888', fontSize: '14px', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' },
  card: { background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 35, 0.95) 100%)', borderRadius: '16px', padding: '24px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.2)' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.3)', backgroundColor: 'rgba(20, 20, 40, 0.8)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 16px', borderRadius: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.3)', backgroundColor: 'rgba(20, 20, 40, 0.8)', color: '#fff', fontSize: '14px' },
  button: { padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
  primaryBtn: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' },
  secondaryBtn: { background: 'rgba(99, 102, 241, 0.2)', color: '#a0a0ff', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.3)' },
  metricCard: { background: 'rgba(20, 20, 40, 0.6)', borderRadius: '12px', padding: '16px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.15)', marginBottom: '12px' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', color: '#a0a0a0', fontSize: '11px', textTransform: 'uppercase' },
  td: { padding: '12px', borderBottom: '1px solid rgba(99, 102, 241, 0.1)', fontSize: '13px' },
  chatContainer: { height: '400px', overflowY: 'auto', padding: '16px', background: 'rgba(10, 10, 20, 0.5)', borderRadius: '12px', marginBottom: '16px' },
  chatMessage: { marginBottom: '12px', padding: '12px 16px', borderRadius: '12px', maxWidth: '85%' },
  userMessage: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', marginLeft: 'auto', color: 'white' },
  botMessage: { background: 'rgba(40, 40, 60, 0.8)', color: '#e0e0e0' },
  progressBar: { height: '8px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  filterBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginRight: '8px', marginBottom: '8px', transition: 'all 0.2s' },
  competitorCard: { background: 'rgba(20, 20, 40, 0.6)', borderRadius: '12px', padding: '20px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.15)', marginBottom: '16px' },
  ratingBar: { height: '8px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '4px', overflow: 'hidden', flex: 1 },
  heatmapCell: { padding: '12px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }
};

const formatCurrency = (v) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`;
const formatValue = (v, u) => u === 'USD' ? formatCurrency(v) : u === '%' ? `${v}%` : `${v} ${u}`;
const getScoreColor = (s) => s >= 90 ? '#10b981' : s >= 70 ? '#f59e0b' : '#ef4444';
const calculateScore = (v, b) => v && b ? Math.min(100, Math.round((v/b)*100)) : null;
const getProfitColor = (index) => index >= 90 ? '#10b981' : index >= 80 ? '#3b82f6' : index >= 70 ? '#f59e0b' : '#ef4444';
const getTypeIcon = (type) => type === 'ophthalmology' ? '🔬' : type === 'optometry' ? '👓' : '🏥';
const getTypeColor = (type) => type === 'ophthalmology' ? '#8b5cf6' : type === 'optometry' ? '#3b82f6' : '#10b981';

export default function Benchmarks() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [practiceProfile, setPracticeProfile] = useState(() => { try { const s = localStorage.getItem('medpact_profile'); return s ? JSON.parse(s) : null; } catch { return null; } });
  const [regStep, setRegStep] = useState(0);
  const [regAnswers, setRegAnswers] = useState({});
  const [showRegistration, setShowRegistration] = useState(!practiceProfile);
  const [selectedPackage, setSelectedPackage] = useState('practice_9');
  const [metricValues, setMetricValues] = useState(() => { try { const s = localStorage.getItem('medpact_metrics'); return s ? JSON.parse(s) : {}; } catch { return {}; } });
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: "Welcome! Ask about metrics, CPT codes, competitors, or innovations." }]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  const [cptFilter, setCptFilter] = useState('all');
  const [innovationFilter, setInnovationFilter] = useState('all');
  
  // NEW: Competitor Intelligence State
  const [practiceTypeFilter, setPracticeTypeFilter] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showIntelModal, setShowIntelModal] = useState(false);

  useEffect(() => { if (practiceProfile) localStorage.setItem('medpact_profile', JSON.stringify(practiceProfile)); }, [practiceProfile]);
  useEffect(() => { localStorage.setItem('medpact_metrics', JSON.stringify(metricValues)); }, [metricValues]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleRegNext = () => {
    if (regStep < REGISTRATION_STEPS.length - 1) { setRegStep(regStep + 1); }
    else {
      const profile = { ...regAnswers, createdAt: new Date().toISOString() };
      setPracticeProfile(profile);
      setShowRegistration(false);
      const pkgMap = { 'Private Practice 9': 'practice_9', 'PE Practice 10': 'pe_10', 'KPI 25': 'kpi_25', 'Private ASC 25': 'asc_25', 'PE ASC 21': 'pe_asc_21', 'Retina 12': 'retina_12' };
      if (regAnswers.package && pkgMap[regAnswers.package]) setSelectedPackage(pkgMap[regAnswers.package]);
    }
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.toLowerCase();
    setChatMessages(p => [...p, { role: 'user', content: chatInput }]);
    setChatInput('');
    let resp = "Try asking about 'net collection rate', 'cataract CPT', 'competitors', or 'heat map'.";
    if (msg.includes('collection')) resp = "Net Collection Rate: Benchmark 98%+. Below 95% indicates billing issues.";
    else if (msg.includes('cataract')) resp = "Cataract CPT: 66984 (Standard) = $535.42, 66982 (Complex) = $652.18";
    else if (msg.includes('injection')) resp = "Intravitreal Injection CPT 67028: $95.67 Medicare rate.";
    else if (msg.includes('competitor')) resp = `You have ${COMPETITOR_PRACTICES.length} competitors mapped. Top rated: ${COMPETITOR_PRACTICES.sort((a,b) => b.ratings.google - a.ratings.google)[0].name} with ${COMPETITOR_PRACTICES.sort((a,b) => b.ratings.google - a.ratings.google)[0].ratings.google}⭐`;
    else if (msg.includes('heat') || msg.includes('zip')) resp = `Highest profit ZIP: 94104 (Financial District) with 99 profit index. Lowest: 94124 (Bayview) with 68 profit index.`;
    setTimeout(() => setChatMessages(p => [...p, { role: 'assistant', content: resp }]), 300);
  };

  const toggleCompare = (competitor) => {
    if (compareList.find(c => c.id === competitor.id)) {
      setCompareList(compareList.filter(c => c.id !== competitor.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, competitor]);
    }
  };

  const filteredCompetitors = practiceTypeFilter === 'all' 
    ? COMPETITOR_PRACTICES 
    : COMPETITOR_PRACTICES.filter(c => c.type === practiceTypeFilter);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'competitors', label: 'Competitors', icon: '🎯' },
    { id: 'heatmap', label: 'Heat Map', icon: '🗺️' },
    { id: 'cpt', label: 'CPT Codes', icon: '💰' },
    { id: 'innovations', label: 'OnPacePlus', icon: '🚀' },
    { id: 'chat', label: 'KCN Chat', icon: '💬' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  if (showRegistration) {
    const step = REGISTRATION_STEPS[regStep];
    return (
      <div style={styles.container}>
        <header style={styles.header}><div style={styles.headerContent}><div style={styles.logo}><div style={styles.logoIcon}>👁️</div><span style={styles.logoText}>MedPact</span><span style={styles.version}>v3.0</span></div></div></header>
        <div style={{ ...styles.main, maxWidth: '600px' }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div><h2 style={{ fontSize: '24px', fontWeight: '700' }}>Welcome to MedPact</h2></div>
            <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${((regStep+1)/REGISTRATION_STEPS.length)*100}%` }} /></div>
            <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 24px' }}>Step {regStep + 1} of {REGISTRATION_STEPS.length}</p>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>{step.question}</h3>
            {step.type === 'text' && <input type="text" style={styles.input} placeholder={step.placeholder} value={regAnswers[step.id] || ''} onChange={e => setRegAnswers(p => ({...p, [step.id]: e.target.value}))} />}
            {step.type === 'select' && <select style={styles.select} value={regAnswers[step.id] || ''} onChange={e => setRegAnswers(p => ({...p, [step.id]: e.target.value}))}><option value="">Select...</option>{step.options.map(o => <option key={o} value={o}>{o}</option>)}</select>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {regStep > 0 && <button onClick={() => setRegStep(regStep-1)} style={{...styles.button, ...styles.secondaryBtn, flex: 1}}>Back</button>}
              <button onClick={handleRegNext} style={{...styles.button, ...styles.primaryBtn, flex: 1}}>{regStep === REGISTRATION_STEPS.length - 1 ? 'Complete' : 'Continue'}</button>
            </div>
            <button onClick={() => { setShowRegistration(false); setPracticeProfile({ name: 'Demo Practice', type: 'Demo' }); }} style={{ width: '100%', marginTop: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Skip (Demo)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}><div style={styles.logoIcon}>👁️</div><span style={styles.logoText}>MedPact</span><span style={styles.version}>v3.0</span></div>
          <nav style={styles.nav}>{tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} style={{...styles.navBtn, ...(activeTab === t.id ? styles.navBtnActive : styles.navBtnInactive)}}><span style={{marginRight:'6px'}}>{t.icon}</span>{t.label}</button>)}</nav>
        </div>
      </header>

      {/* Intel Modal */}
      {showIntelModal && selectedCompetitor && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}} onClick={() => setShowIntelModal(false)}>
          <div style={{...styles.card,maxWidth:'800px',maxHeight:'90vh',overflow:'auto',width:'100%'}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h2 style={{fontSize:'24px',fontWeight:'700'}}><span style={{marginRight:'12px'}}>{getTypeIcon(selectedCompetitor.type)}</span>{selectedCompetitor.name}</h2>
              <button onClick={() => setShowIntelModal(false)} style={{background:'none',border:'none',color:'#888',fontSize:'24px',cursor:'pointer'}}>×</button>
            </div>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
              {/* Provider Training */}
              <div style={{...styles.metricCard}}>
                <h4 style={{color:'#6366f1',marginBottom:'12px'}}>👨‍⚕️ Provider Training</h4>
                {selectedCompetitor.intel.providers.map((p, i) => (
                  <div key={i} style={{padding:'8px 0',borderBottom:'1px solid rgba(99,102,241,0.1)'}}>{p}</div>
                ))}
              </div>

              {/* Equipment */}
              <div style={{...styles.metricCard}}>
                <h4 style={{color:'#10b981',marginBottom:'12px'}}>🔧 Equipment & Technology</h4>
                {selectedCompetitor.intel.equipment.map((e, i) => (
                  <div key={i} style={{padding:'8px 0',borderBottom:'1px solid rgba(99,102,241,0.1)'}}>{e}</div>
                ))}
              </div>

              {/* Services */}
              <div style={{...styles.metricCard}}>
                <h4 style={{color:'#f59e0b',marginBottom:'12px'}}>🩺 Services Offered</h4>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {selectedCompetitor.intel.services.map((s, i) => (
                    <span key={i} style={{...styles.badge,background:'rgba(245,158,11,0.2)',color:'#f59e0b'}}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Practice Details */}
              <div style={{...styles.metricCard}}>
                <h4 style={{color:'#ec4899',marginBottom:'12px'}}>📋 Practice Details</h4>
                <div style={{display:'grid',gap:'8px'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#888'}}>Staff Size:</span><span>{selectedCompetitor.intel.staff}</span></div>
                  <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#888'}}>Languages:</span><span>{selectedCompetitor.intel.languages.join(', ')}</span></div>
                  <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#888'}}>Telehealth:</span><span>{selectedCompetitor.intel.telehealth ? '✅ Yes' : '❌ No'}</span></div>
                  <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#888'}}>Avg Wait Time:</span><span>{selectedCompetitor.intel.avgWaitTime}</span></div>
                </div>
              </div>
            </div>

            <button style={{...styles.button,...styles.primaryBtn,width:'100%',marginTop:'24px'}}>🔄 Rescan Website for Latest Data</button>
          </div>
        </div>
      )}

      <main style={styles.main}>
        {activeTab === 'dashboard' && <>
          <h1 style={styles.pageTitle}>Practice Intelligence Dashboard</h1>
          <p style={styles.pageSubtitle}>{practiceProfile?.name || 'Demo'} • {METRIC_PACKAGES[selectedPackage].name}</p>
          <div style={{...styles.card, marginBottom: '24px'}}>
            <div style={styles.cardTitle}>📦 Select Package</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{Object.entries(METRIC_PACKAGES).map(([k,v]) => <button key={k} onClick={() => setSelectedPackage(k)} style={{...styles.button, ...(selectedPackage===k ? styles.primaryBtn : styles.secondaryBtn), borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: v.color}}>{v.name}</button>)}</div>
          </div>
          <div style={styles.grid}>{METRIC_PACKAGES[selectedPackage].metrics.map(m => {
            const val = metricValues[m.key], score = calculateScore(val, m.benchmark);
            return <div key={m.key} style={styles.metricCard}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><div><span style={{fontSize:'20px',marginRight:'8px'}}>{m.icon}</span><span style={{fontWeight:'600'}}>{m.title}</span></div>{score && <span style={{...styles.badge, background:`${getScoreColor(score)}22`, color:getScoreColor(score)}}>{score}%</span>}</div>
              <div style={{display:'flex',gap:'12px',alignItems:'center'}}><input type="number" placeholder="Value" value={val||''} onChange={e => setMetricValues(p => ({...p,[m.key]:parseFloat(e.target.value)||''}))} style={{...styles.input,flex:1}} /><div style={{textAlign:'right',minWidth:'80px'}}><div style={{fontSize:'12px',color:'#888'}}>Benchmark</div><div style={{fontWeight:'600',color:'#6366f1'}}>{formatValue(m.benchmark,m.unit)}</div></div></div>
            </div>;
          })}</div>
        </>}

        {activeTab === 'competitors' && <>
          <h1 style={styles.pageTitle}>Competitive Intelligence</h1>
          <p style={styles.pageSubtitle}>Monitor and analyze competitor practices</p>
          
          {/* Practice Type Filter */}
          <div style={{...styles.card, marginBottom: '24px'}}>
            <div style={styles.cardTitle}>🔍 Filter by Practice Type</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {[
                { key: 'all', label: 'All Practices', icon: '📍' },
                { key: 'ophthalmology', label: 'Ophthalmology', icon: '🔬' },
                { key: 'optometry', label: 'Optometry', icon: '👓' },
                { key: 'general', label: 'General Eye Care', icon: '🏥' }
              ].map(f => (
                <button key={f.key} onClick={() => setPracticeTypeFilter(f.key)} style={{...styles.filterBtn, background: practiceTypeFilter === f.key ? getTypeColor(f.key) : 'rgba(99,102,241,0.1)', color: practiceTypeFilter === f.key ? 'white' : '#a0a0a0'}}>
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Panel */}
          {compareList.length > 0 && (
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={styles.cardTitle}>📊 Side-by-Side Comparison ({compareList.length}/4)</div>
                <button onClick={() => setCompareList([])} style={{...styles.button,...styles.secondaryBtn,padding:'6px 12px',fontSize:'12px'}}>Clear All</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(compareList.length + 1, 5)}, 1fr)`,gap:'16px'}}>
                {/* Your Practice */}
                <div style={{...styles.metricCard,background:'rgba(99,102,241,0.1)'}}>
                  <h4 style={{fontWeight:'600',marginBottom:'12px',color:'#6366f1'}}>📍 Your Practice</h4>
                  <div style={{marginBottom:'8px'}}><span style={{color:'#888',fontSize:'12px'}}>Google</span><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={styles.ratingBar}><div style={{...styles.progressFill,width:'92%'}}/></div><span style={{fontWeight:'600'}}>4.6</span></div></div>
                  <div style={{marginBottom:'8px'}}><span style={{color:'#888',fontSize:'12px'}}>Yelp</span><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={styles.ratingBar}><div style={{...styles.progressFill,width:'86%'}}/></div><span style={{fontWeight:'600'}}>4.3</span></div></div>
                  <div><span style={{color:'#888',fontSize:'12px'}}>Healthgrades</span><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={styles.ratingBar}><div style={{...styles.progressFill,width:'94%'}}/></div><span style={{fontWeight:'600'}}>4.7</span></div></div>
                </div>
                {/* Compared Practices */}
                {compareList.map(comp => (
                  <div key={comp.id} style={styles.metricCard}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                      <h4 style={{fontWeight:'600',fontSize:'14px'}}>{comp.name}</h4>
                      <button onClick={() => toggleCompare(comp)} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'16px'}}>×</button>
                    </div>
                    <div style={{marginBottom:'8px'}}><span style={{color:'#888',fontSize:'12px'}}>Google</span><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={styles.ratingBar}><div style={{...styles.progressFill,width:`${comp.ratings.google*20}%`,background: comp.ratings.google > 4.6 ? '#10b981' : '#6366f1'}}/></div><span style={{fontWeight:'600'}}>{comp.ratings.google}</span></div></div>
                    <div style={{marginBottom:'8px'}}><span style={{color:'#888',fontSize:'12px'}}>Yelp</span><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={styles.ratingBar}><div style={{...styles.progressFill,width:`${comp.ratings.yelp*20}%`,background: comp.ratings.yelp > 4.3 ? '#10b981' : '#6366f1'}}/></div><span style={{fontWeight:'600'}}>{comp.ratings.yelp}</span></div></div>
                    <div><span style={{color:'#888',fontSize:'12px'}}>Healthgrades</span><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={styles.ratingBar}><div style={{...styles.progressFill,width:`${comp.ratings.healthgrades*20}%`,background: comp.ratings.healthgrades > 4.7 ? '#10b981' : '#6366f1'}}/></div><span style={{fontWeight:'600'}}>{comp.ratings.healthgrades}</span></div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitor Cards */}
          <div style={styles.grid}>
            {filteredCompetitors.map(comp => (
              <div key={comp.id} style={styles.competitorCard}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div>
                    <span style={{...styles.badge, background:`${getTypeColor(comp.type)}22`, color: getTypeColor(comp.type), marginBottom:'8px', display:'inline-block'}}>{getTypeIcon(comp.type)} {comp.type}</span>
                    <h3 style={{fontSize:'18px',fontWeight:'600'}}>{comp.name}</h3>
                    <p style={{color:'#888',fontSize:'12px',marginTop:'4px'}}>{comp.address}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'24px',fontWeight:'700',color:'#f59e0b'}}>{comp.ratings.google}⭐</div>
                    <div style={{color:'#888',fontSize:'11px'}}>{comp.reviewCount} reviews</div>
                  </div>
                </div>
                
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'16px'}}>
                  <div style={{textAlign:'center',padding:'8px',background:'rgba(20,20,40,0.5)',borderRadius:'8px'}}>
                    <div style={{fontSize:'11px',color:'#888'}}>Google</div>
                    <div style={{fontWeight:'600',color:'#f59e0b'}}>{comp.ratings.google}</div>
                  </div>
                  <div style={{textAlign:'center',padding:'8px',background:'rgba(20,20,40,0.5)',borderRadius:'8px'}}>
                    <div style={{fontSize:'11px',color:'#888'}}>Yelp</div>
                    <div style={{fontWeight:'600',color:'#ef4444'}}>{comp.ratings.yelp}</div>
                  </div>
                  <div style={{textAlign:'center',padding:'8px',background:'rgba(20,20,40,0.5)',borderRadius:'8px'}}>
                    <div style={{fontSize:'11px',color:'#888'}}>Healthgrades</div>
                    <div style={{fontWeight:'600',color:'#3b82f6'}}>{comp.ratings.healthgrades}</div>
                  </div>
                </div>

                <div style={{display:'flex',gap:'8px'}}>
                  <button onClick={() => toggleCompare(comp)} style={{...styles.button, ...(compareList.find(c => c.id === comp.id) ? {background:'#ef4444',color:'white'} : styles.secondaryBtn), flex:1, padding:'10px', fontSize:'13px'}}>
                    {compareList.find(c => c.id === comp.id) ? '✓ Comparing' : '+ Compare'}
                  </button>
                  <button onClick={() => {setSelectedCompetitor(comp); setShowIntelModal(true);}} style={{...styles.button,...styles.primaryBtn,flex:1,padding:'10px',fontSize:'13px'}}>
                    🔍 Website Intel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>}

        {activeTab === 'heatmap' && <>
          <h1 style={styles.pageTitle}>Patient Location Heat Map</h1>
          <p style={styles.pageSubtitle}>Identify high-profit patient areas by ZIP code</p>
          
          {/* Legend */}
          <div style={{...styles.card, marginBottom: '24px'}}>
            <div style={styles.cardTitle}>📊 Profit Index Legend</div>
            <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#10b981'}}/><span style={{fontSize:'13px'}}>High (90-100)</span></div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#3b82f6'}}/><span style={{fontSize:'13px'}}>Good (80-89)</span></div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#f59e0b'}}/><span style={{fontSize:'13px'}}>Medium (70-79)</span></div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#ef4444'}}/><span style={{fontSize:'13px'}}>Low (&lt;70)</span></div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'24px'}}>
            {/* Heat Map Grid */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>🗺️ ZIP Code Profit Map</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'8px'}}>
                {PATIENT_HEATMAP_DATA.sort((a,b) => b.profitIndex - a.profitIndex).map(zip => (
                  <div key={zip.zip} style={{...styles.heatmapCell, background: `${getProfitColor(zip.profitIndex)}22`, borderWidth: '1px', borderStyle: 'solid', borderColor: getProfitColor(zip.profitIndex)}}>
                    <div style={{fontWeight:'700',color:getProfitColor(zip.profitIndex),fontSize:'16px'}}>{zip.zip}</div>
                    <div style={{fontSize:'11px',color:'#888',marginTop:'4px'}}>{zip.name}</div>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px',fontSize:'11px'}}>
                      <span>👥 {zip.patients}</span>
                      <span style={{fontWeight:'600',color:getProfitColor(zip.profitIndex)}}>{zip.profitIndex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 10 Table */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>🏆 Top 10 High-Profit ZIPs</div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ZIP</th>
                    <th style={styles.th}>Area</th>
                    <th style={styles.th}>Index</th>
                  </tr>
                </thead>
                <tbody>
                  {PATIENT_HEATMAP_DATA.sort((a,b) => b.profitIndex - a.profitIndex).slice(0, 10).map((zip, i) => (
                    <tr key={zip.zip}>
                      <td style={{...styles.td,fontFamily:'monospace',fontWeight:'600'}}>{zip.zip}</td>
                      <td style={{...styles.td,fontSize:'12px'}}>{zip.name}</td>
                      <td style={{...styles.td,fontWeight:'700',color:getProfitColor(zip.profitIndex)}}>{zip.profitIndex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{...styles.card, marginTop: '24px'}}>
            <div style={styles.cardTitle}>📈 Patient Distribution Summary</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
              <div style={{textAlign:'center',padding:'16px',background:'rgba(16,185,129,0.1)',borderRadius:'12px'}}>
                <div style={{fontSize:'28px',fontWeight:'700',color:'#10b981'}}>{PATIENT_HEATMAP_DATA.filter(z => z.profitIndex >= 90).length}</div>
                <div style={{color:'#888',fontSize:'12px'}}>High Profit Areas</div>
              </div>
              <div style={{textAlign:'center',padding:'16px',background:'rgba(59,130,246,0.1)',borderRadius:'12px'}}>
                <div style={{fontSize:'28px',fontWeight:'700',color:'#3b82f6'}}>{PATIENT_HEATMAP_DATA.reduce((sum, z) => sum + z.patients, 0).toLocaleString()}</div>
                <div style={{color:'#888',fontSize:'12px'}}>Total Patients Mapped</div>
              </div>
              <div style={{textAlign:'center',padding:'16px',background:'rgba(245,158,11,0.1)',borderRadius:'12px'}}>
                <div style={{fontSize:'28px',fontWeight:'700',color:'#f59e0b'}}>{Math.round(PATIENT_HEATMAP_DATA.reduce((sum, z) => sum + z.profitIndex, 0) / PATIENT_HEATMAP_DATA.length)}</div>
                <div style={{color:'#888',fontSize:'12px'}}>Avg Profit Index</div>
              </div>
              <div style={{textAlign:'center',padding:'16px',background:'rgba(139,92,246,0.1)',borderRadius:'12px'}}>
                <div style={{fontSize:'28px',fontWeight:'700',color:'#8b5cf6'}}>{PATIENT_HEATMAP_DATA.length}</div>
                <div style={{color:'#888',fontSize:'12px'}}>ZIP Codes Covered</div>
              </div>
            </div>
          </div>
        </>}

        {activeTab === 'cpt' && <>
          <h1 style={styles.pageTitle}>Price Transparency</h1>
          <p style={styles.pageSubtitle}>2025 Medicare Rates</p>
          <div style={{...styles.card,marginBottom:'24px'}}><div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>{['all',...new Set(CPT_CODES.map(c=>c.category))].map(c => <button key={c} onClick={() => setCptFilter(c)} style={{...styles.button, ...(cptFilter===c ? styles.primaryBtn : styles.secondaryBtn), padding:'8px 16px', fontSize:'13px'}}>{c==='all'?'All':c}</button>)}</div></div>
          <div style={styles.card}><table style={styles.table}><thead><tr><th style={styles.th}>CPT</th><th style={styles.th}>Description</th><th style={styles.th}>Category</th><th style={styles.th}>Medicare</th><th style={styles.th}>wRVU</th></tr></thead><tbody>{(cptFilter==='all'?CPT_CODES:CPT_CODES.filter(c=>c.category===cptFilter)).map(c=><tr key={c.code}><td style={{...styles.td,fontFamily:'monospace',fontWeight:'600',color:'#6366f1'}}>{c.code}</td><td style={styles.td}>{c.description}</td><td style={styles.td}><span style={{...styles.badge,background:'rgba(99,102,241,0.2)',color:'#a0a0ff'}}>{c.category}</span></td><td style={{...styles.td,fontWeight:'600',color:'#10b981'}}>${c.medicareRate.toFixed(2)}</td><td style={styles.td}>{c.wRVU}</td></tr>)}</tbody></table></div>
        </>}

        {activeTab === 'innovations' && <>
          <h1 style={styles.pageTitle}>OnPacePlus Innovation Tracker</h1>
          <p style={styles.pageSubtitle}>Emerging technologies</p>
          <div style={{...styles.card,marginBottom:'24px'}}><div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>{['all',...new Set(INNOVATIONS.map(i=>i.category))].map(c => <button key={c} onClick={() => setInnovationFilter(c)} style={{...styles.button, ...(innovationFilter===c ? styles.primaryBtn : styles.secondaryBtn), padding:'8px 16px', fontSize:'13px'}}>{c==='all'?'All':c}</button>)}</div></div>
          <div style={styles.grid}>{(innovationFilter==='all'?INNOVATIONS:INNOVATIONS.filter(i=>i.category===innovationFilter)).map(i=><div key={i.id} style={styles.card}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><span style={{...styles.badge,background:'rgba(16,185,129,0.2)',color:'#10b981'}}>{i.status}</span><span style={{color:'#888',fontSize:'12px'}}>{i.year}</span></div><h3 style={{fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>{i.name}</h3><p style={{fontSize:'13px',color:'#888',marginBottom:'16px'}}>{i.manufacturer}</p><div style={{display:'flex',justifyContent:'space-between'}}><div><div style={{fontSize:'11px',color:'#888'}}>Adoption</div><div style={{fontWeight:'600',color:'#6366f1'}}>{i.adoptionRate}%</div></div><div><div style={{fontSize:'11px',color:'#888'}}>Impact</div><div style={{fontWeight:'600',color:'#10b981'}}>{i.clinicalImpact}</div></div></div></div>)}</div>
        </>}

        {activeTab === 'chat' && <>
          <h1 style={styles.pageTitle}>KCN Intelligence Chat</h1>
          <p style={styles.pageSubtitle}>Ask about metrics, CPT codes, competitors, innovations</p>
          <div style={{...styles.card,maxWidth:'800px'}}><div style={styles.chatContainer}>{chatMessages.map((m,i) => <div key={i} style={{...styles.chatMessage,...(m.role==='user'?styles.userMessage:styles.botMessage)}}>{m.content}</div>)}<div ref={chatEndRef}/></div><div style={{display:'flex',gap:'12px'}}><input type="text" style={{...styles.input,flex:1}} placeholder="Ask about metrics, competitors, heat map..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&handleChat()}/><button onClick={handleChat} style={{...styles.button,...styles.primaryBtn}}>Send</button></div></div>
        </>}

        {activeTab === 'profile' && <>
          <h1 style={styles.pageTitle}>Practice Profile</h1>
          <p style={styles.pageSubtitle}>Your settings</p>
          <div style={{...styles.card,maxWidth:'600px'}}><div style={{fontSize:'48px',textAlign:'center',marginBottom:'16px'}}>🏥</div><h2 style={{fontSize:'24px',fontWeight:'700',textAlign:'center',marginBottom:'24px'}}>{practiceProfile?.name||'Demo'}</h2>{practiceProfile&&Object.entries(practiceProfile).filter(([k])=>k!=='createdAt').map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'rgba(20,20,40,0.5)',borderRadius:'8px',marginBottom:'8px'}}><span style={{color:'#888',textTransform:'capitalize'}}>{k}</span><span style={{fontWeight:'500'}}>{Array.isArray(v)?v.join(', '):v}</span></div>)}<button onClick={()=>{setShowRegistration(true);setRegStep(0);setRegAnswers({});}} style={{...styles.button,...styles.secondaryBtn,width:'100%',marginTop:'16px'}}>Edit Profile</button><button onClick={()=>{localStorage.clear();setPracticeProfile(null);setMetricValues({});setShowRegistration(true);setRegStep(0);}} style={{width:'100%',marginTop:'12px',background:'none',border:'none',color:'#ef4444',cursor:'pointer'}}>Reset All</button></div>
        </>}
      </main>
      <footer style={{textAlign:'center',padding:'24px',color:'#666',fontSize:'12px',borderTop:'1px solid rgba(99,102,241,0.1)'}}><p>MedPact Practice Intelligence v3.0.0</p></footer>
    </div>
  );
}
