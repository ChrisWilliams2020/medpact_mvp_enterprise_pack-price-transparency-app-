import React, { useState } from 'react';

// =============================================
// PRACTICE PROFILE COMPONENT
// Simulated Practice based on OSA folder data
// $3.1M Revenue | 5 Providers | 2 Locations
// =============================================

const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  secondary: '#0EA5E9',
  secondaryLight: '#38BDF8',
  accent: '#8B5CF6',
  accentLight: '#A78BFA',
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  danger: '#EF4444',
  dangerLight: '#F87171',
  dark: '#1E293B',
  darkLight: '#334155',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  background: '#F8FAFC',
  white: '#FFFFFF',
  gradientPrimary: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
  gradientSecondary: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  gradientWarning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  gradientDanger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  gradientOphthalmology: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
  gradientPremium: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
};

const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// =============================================
// SIMULATED PRACTICE DATA
// Based on Ophthalmic Surgical Associates, Inc
// Scaled to $3.1M with 5 providers, 2 locations
// =============================================

const PRACTICE_DATA = {
  name: 'Visionary Eye Care Associates',
  tagline: 'Excellence in Comprehensive Eye Care',
  established: 2015,
  taxId: '45-9876543',
  npi: '1234567890',
  website: 'www.visionaryeyecare.com',
  
  // Financial Overview - $3.1M Revenue
  financials: {
    totalRevenue: 3100000,
    yearOverYearGrowth: 8.5,
    collectionsRate: 94.2,
    avgDaysInAR: 32,
    breakdown: {
      professionalFees: 2480000, // 80%
      surgicalFees: 434000,      // 14%
      opticalSales: 155000,      // 5%
      otherIncome: 31000,        // 1%
    },
    monthlyRevenue: [
      { month: 'Jan', revenue: 245000, budget: 258000 },
      { month: 'Feb', revenue: 238000, budget: 258000 },
      { month: 'Mar', revenue: 268000, budget: 258000 },
      { month: 'Apr', revenue: 255000, budget: 258000 },
      { month: 'May', revenue: 262000, budget: 258000 },
      { month: 'Jun', revenue: 278000, budget: 258000 },
      { month: 'Jul', revenue: 248000, budget: 258000 },
      { month: 'Aug', revenue: 265000, budget: 258000 },
      { month: 'Sep', revenue: 272000, budget: 258000 },
      { month: 'Oct', revenue: 258000, budget: 258000 },
      { month: 'Nov', revenue: 252000, budget: 258000 },
      { month: 'Dec', revenue: 259000, budget: 258000 },
    ],
    expenses: {
      staffSalaries: 775000,
      physicianSalaries: 465000,
      rent: 372000,
      medicalSupplies: 248000,
      technology: 93000,
      insurance: 62000,
      marketing: 31000,
      administrative: 124000,
      payrollTaxes: 155000,
    },
  },
  
  // Providers - 2 MD Surgeons, 3 Optometrists
  providers: [
    {
      id: 'p1',
      name: 'Dr. Michael J. Harrison',
      credentials: 'MD, FACS',
      role: 'Managing Partner / Surgeon',
      specialty: 'Cataract & Refractive Surgery',
      subspecialty: 'Glaucoma',
      npi: '1234567891',
      education: 'Johns Hopkins University School of Medicine',
      residency: 'Wills Eye Hospital',
      fellowship: 'Glaucoma Fellowship, Bascom Palmer',
      yearsExperience: 18,
      surgicalVolume: {
        cataract: 480,
        glaucoma: 120,
        laser: 85,
        total: 685,
      },
      patientVolume: 3200,
      revenue: 1050000,
      avatar: '👨‍⚕️',
      color: COLORS.primary,
    },
    {
      id: 'p2',
      name: 'Dr. Sarah M. Chen',
      credentials: 'MD',
      role: 'Partner / Surgeon',
      specialty: 'Comprehensive Ophthalmology',
      subspecialty: 'Oculoplastics',
      npi: '1234567892',
      education: 'Stanford University School of Medicine',
      residency: 'Bascom Palmer Eye Institute',
      fellowship: 'Oculoplastics, UCLA Jules Stein',
      yearsExperience: 12,
      surgicalVolume: {
        cataract: 320,
        oculoplastic: 95,
        laser: 65,
        total: 480,
      },
      patientVolume: 2800,
      revenue: 820000,
      avatar: '👩‍⚕️',
      color: COLORS.secondary,
    },
    {
      id: 'p3',
      name: 'Dr. Robert K. Williams',
      credentials: 'OD, FAAO',
      role: 'Associate / Optometrist',
      specialty: 'Primary Eye Care',
      subspecialty: 'Contact Lenses',
      npi: '1234567893',
      education: 'Pennsylvania College of Optometry',
      residency: 'VA Medical Center',
      fellowship: null,
      yearsExperience: 15,
      surgicalVolume: null,
      patientVolume: 4200,
      revenue: 520000,
      avatar: '👨‍⚕️',
      color: COLORS.success,
    },
    {
      id: 'p4',
      name: 'Dr. Emily R. Thompson',
      credentials: 'OD',
      role: 'Associate / Optometrist',
      specialty: 'Primary Eye Care',
      subspecialty: 'Pediatric Vision',
      npi: '1234567894',
      education: 'Illinois College of Optometry',
      residency: 'Pediatric Optometry Residency',
      fellowship: null,
      yearsExperience: 8,
      surgicalVolume: null,
      patientVolume: 3800,
      revenue: 410000,
      avatar: '👩‍⚕️',
      color: COLORS.accent,
    },
    {
      id: 'p5',
      name: 'Dr. James D. Martinez',
      credentials: 'OD',
      role: 'Associate / Optometrist',
      specialty: 'Primary Eye Care',
      subspecialty: 'Dry Eye Disease',
      npi: '1234567895',
      education: 'Southern California College of Optometry',
      residency: 'Ocular Disease Residency',
      fellowship: null,
      yearsExperience: 6,
      surgicalVolume: null,
      patientVolume: 3500,
      revenue: 300000,
      avatar: '👨‍⚕️',
      color: COLORS.warning,
    },
  ],
  
  // Locations - 2 Practice Sites
  locations: [
    {
      id: 'loc1',
      name: 'Visionary Eye Care - Brinton Lake',
      type: 'Primary Office & Surgery Center',
      address: '411 Brinton Lake Road, Suite 200',
      city: 'Glen Mills',
      state: 'PA',
      zipCode: '19342',
      phone: '(610) 555-2020',
      fax: '(610) 555-2021',
      email: 'brintonlake@visionaryeyecare.com',
      squareFeet: 8500,
      examLanes: 8,
      hasSurgeryCenter: true,
      hasOpticalShop: true,
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '8:00 AM - 5:00 PM',
      saturdayHours: '8:00 AM - 12:00 PM',
      providers: ['p1', 'p2', 'p3', 'p4'],
      monthlyPatients: 850,
      monthlyRevenue: 195000,
      equipment: [
        'Zeiss IOLMaster 700',
        'Zeiss Cirrus HD-OCT 6000',
        'Heidelberg Spectralis OCT',
        'Topcon Maestro2',
        'Alcon LenSx Femtosecond Laser',
        'Alcon Centurion Vision System',
        'Zeiss Humphrey Field Analyzer 3',
        'Topcon CV-5000 Refraction System',
      ],
    },
    {
      id: 'loc2',
      name: 'Visionary Eye Care - Media',
      type: 'Satellite Office',
      address: '100 West State Street, Suite 310',
      city: 'Media',
      state: 'PA',
      zipCode: '19063',
      phone: '(610) 555-3030',
      fax: '(610) 555-3031',
      email: 'media@visionaryeyecare.com',
      squareFeet: 4200,
      examLanes: 5,
      hasSurgeryCenter: false,
      hasOpticalShop: true,
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '8:00 AM - 5:00 PM',
      saturdayHours: null,
      providers: ['p3', 'p4', 'p5'],
      monthlyPatients: 520,
      monthlyRevenue: 63000,
      equipment: [
        'Zeiss IOLMaster 500',
        'Optovue iVue OCT',
        'Zeiss Humphrey Field Analyzer 3',
        'Nidek Tonoref III',
        'Canon CR-2 Plus Fundus Camera',
      ],
    },
  ],
  
  // Payer Mix
  payerMix: [
    { name: 'Medicare', percentage: 42, revenue: 1302000, color: '#3B82F6' },
    { name: 'Blue Cross Blue Shield', percentage: 18, revenue: 558000, color: '#0EA5E9' },
    { name: 'Aetna', percentage: 12, revenue: 372000, color: '#8B5CF6' },
    { name: 'United Healthcare', percentage: 10, revenue: 310000, color: '#F59E0B' },
    { name: 'Cigna', percentage: 8, revenue: 248000, color: '#10B981' },
    { name: 'Medicaid', percentage: 5, revenue: 155000, color: '#6366F1' },
    { name: 'Self-Pay', percentage: 3, revenue: 93000, color: '#EC4899' },
    { name: 'Other', percentage: 2, revenue: 62000, color: '#64748B' },
  ],
  
  // Top Procedures (Based on OSA CPT Data)
  topProcedures: [
    { cpt: '66984', description: 'Cataract Surgery w/IOL', volume: 800, avgReimbursement: 1850, totalRevenue: 1480000 },
    { cpt: '92014', description: 'Comprehensive Eye Exam', volume: 4200, avgReimbursement: 125, totalRevenue: 525000 },
    { cpt: '92015', description: 'Refraction', volume: 8500, avgReimbursement: 35, totalRevenue: 297500 },
    { cpt: '92133', description: 'OCT Glaucoma', volume: 2800, avgReimbursement: 42, totalRevenue: 117600 },
    { cpt: '92134', description: 'OCT Retina', volume: 2400, avgReimbursement: 42, totalRevenue: 100800 },
    { cpt: '66821', description: 'YAG Laser Capsulotomy', volume: 320, avgReimbursement: 285, totalRevenue: 91200 },
    { cpt: '67028', description: 'Intravitreal Injection', volume: 450, avgReimbursement: 195, totalRevenue: 87750 },
    { cpt: '92083', description: 'Visual Field Exam', volume: 1800, avgReimbursement: 48, totalRevenue: 86400 },
    { cpt: '66761', description: 'Laser Iridotomy', volume: 180, avgReimbursement: 325, totalRevenue: 58500 },
    { cpt: '66170', description: 'Trabeculectomy', volume: 85, avgReimbursement: 650, totalRevenue: 55250 },
  ],
  
  // Staff
  staff: {
    total: 28,
    breakdown: [
      { role: 'Ophthalmic Technicians', count: 8 },
      { role: 'Front Desk/Scheduling', count: 5 },
      { role: 'Optical Staff', count: 4 },
      { role: 'Billing/Coding', count: 4 },
      { role: 'Medical Assistants', count: 3 },
      { role: 'Practice Manager', count: 1 },
      { role: 'Office Manager', count: 1 },
      { role: 'Surgical Coordinator', count: 1 },
      { role: 'Marketing Coordinator', count: 1 },
    ],
  },
  
  // Patient Demographics
  patientDemographics: {
    totalActive: 18500,
    newPatientsYTD: 2450,
    avgAge: 58,
    genderSplit: { male: 44, female: 56 },
    ageDistribution: [
      { range: '0-17', percentage: 8 },
      { range: '18-40', percentage: 15 },
      { range: '41-64', percentage: 32 },
      { range: '65+', percentage: 45 },
    ],
  },
  
  // Key Performance Indicators
  kpis: {
    patientSatisfaction: 4.8,
    noShowRate: 6.2,
    avgWaitTime: 12,
    surgicalOutcomes: 99.2,
    claimsFirstPassRate: 92.5,
    staffTurnover: 8.5,
  },
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

// =============================================
// SUB-COMPONENTS
// =============================================

const StatCard = ({ label, value, subtext, icon, color, trend }) => (
  <div style={{
    background: COLORS.white,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: SHADOWS.md,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100px',
      height: '100px',
      background: `${color}15`,
      borderRadius: '0 0 0 100px',
    }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '14px', color: COLORS.textSecondary, marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: COLORS.text }}>{value}</div>
        {subtext && <div style={{ fontSize: '13px', color: COLORS.textLight, marginTop: '4px' }}>{subtext}</div>}
      </div>
      {icon && (
        <div style={{
          width: '48px',
          height: '48px',
          background: `${color}20`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          {icon}
        </div>
      )}
    </div>
    {trend !== undefined && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '12px',
        fontSize: '13px',
        color: trend >= 0 ? COLORS.success : COLORS.danger,
      }}>
        <span>{trend >= 0 ? '↑' : '↓'}</span>
        <span>{Math.abs(trend)}% vs last year</span>
      </div>
    )}
  </div>
);

const ProviderCard = ({ provider, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      background: COLORS.white,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: SHADOWS.md,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: `2px solid transparent`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = SHADOWS.xl;
      e.currentTarget.style.borderColor = provider.color;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = SHADOWS.md;
      e.currentTarget.style.borderColor = 'transparent';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: `${provider.color}20`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
      }}>
        {provider.avatar}
      </div>
      <div>
        <div style={{ fontWeight: '600', fontSize: '16px', color: COLORS.text }}>{provider.name}</div>
        <div style={{ fontSize: '14px', color: provider.color, fontWeight: '500' }}>{provider.credentials}</div>
        <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{provider.role}</div>
      </div>
    </div>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      padding: '12px',
      background: COLORS.background,
      borderRadius: '12px',
    }}>
      <div>
        <div style={{ fontSize: '12px', color: COLORS.textLight }}>Patients/Year</div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text }}>
          {provider.patientVolume.toLocaleString()}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: COLORS.textLight }}>Revenue</div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: provider.color }}>
          {formatCurrency(provider.revenue)}
        </div>
      </div>
    </div>
    
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: '12px', color: COLORS.textLight, marginBottom: '4px' }}>Specialty</div>
      <div style={{ fontSize: '14px', color: COLORS.text }}>{provider.specialty}</div>
      {provider.subspecialty && (
        <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>Focus: {provider.subspecialty}</div>
      )}
    </div>
    
    {provider.surgicalVolume && (
      <div style={{
        marginTop: '12px',
        padding: '8px 12px',
        background: `${provider.color}10`,
        borderRadius: '8px',
        fontSize: '13px',
        color: provider.color,
        fontWeight: '500',
      }}>
        🏥 {provider.surgicalVolume.total} surgeries/year
      </div>
    )}
  </div>
);

const LocationCard = ({ location }) => (
  <div style={{
    background: COLORS.white,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: SHADOWS.md,
    height: '100%',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div>
        <div style={{ fontWeight: '700', fontSize: '18px', color: COLORS.text }}>{location.name}</div>
        <div style={{
          display: 'inline-block',
          padding: '4px 10px',
          background: location.hasSurgeryCenter ? `${COLORS.success}15` : `${COLORS.primary}15`,
          color: location.hasSurgeryCenter ? COLORS.success : COLORS.primary,
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          marginTop: '8px',
        }}>
          {location.type}
        </div>
      </div>
      <div style={{ fontSize: '32px' }}>{location.hasSurgeryCenter ? '🏥' : '🏢'}</div>
    </div>
    
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '14px', color: COLORS.textSecondary }}>{location.address}</div>
      <div style={{ fontSize: '14px', color: COLORS.textSecondary }}>{location.city}, {location.state} {location.zipCode}</div>
      <div style={{ fontSize: '14px', color: COLORS.primary, marginTop: '8px' }}>📞 {location.phone}</div>
    </div>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px',
      padding: '16px',
      background: COLORS.background,
      borderRadius: '12px',
      marginBottom: '16px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{location.examLanes}</div>
        <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Exam Lanes</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.success }}>{location.monthlyPatients}</div>
        <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Patients/Mo</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: COLORS.accent }}>{formatCurrency(location.monthlyRevenue)}</div>
        <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Revenue/Mo</div>
      </div>
    </div>
    
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '8px' }}>Features</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {location.hasSurgeryCenter && (
          <span style={{
            padding: '4px 10px',
            background: `${COLORS.success}15`,
            color: COLORS.success,
            borderRadius: '8px',
            fontSize: '12px',
          }}>✓ Surgery Center</span>
        )}
        {location.hasOpticalShop && (
          <span style={{
            padding: '4px 10px',
            background: `${COLORS.primary}15`,
            color: COLORS.primary,
            borderRadius: '8px',
            fontSize: '12px',
          }}>✓ Optical Shop</span>
        )}
      </div>
    </div>
    
    <div>
      <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '8px' }}>Key Equipment</div>
      <div style={{ fontSize: '12px', color: COLORS.textSecondary, lineHeight: '1.6' }}>
        {location.equipment.slice(0, 4).join(' • ')}
        {location.equipment.length > 4 && ` • +${location.equipment.length - 4} more`}
      </div>
    </div>
  </div>
);

const PayerMixChart = ({ data }) => (
  <div style={{
    background: COLORS.white,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: SHADOWS.md,
  }}>
    <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '20px' }}>
      Payer Mix Distribution
    </h3>
    
    {/* Horizontal bar chart */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((payer, index) => (
        <div key={index}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', color: COLORS.text }}>{payer.name}</span>
            <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>
              {payer.percentage}% • {formatCurrency(payer.revenue)}
            </span>
          </div>
          <div style={{
            height: '24px',
            background: COLORS.background,
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${payer.percentage}%`,
              height: '100%',
              background: payer.color,
              borderRadius: '12px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopProceduresTable = ({ procedures }) => (
  <div style={{
    background: COLORS.white,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: SHADOWS.md,
  }}>
    <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '20px' }}>
      Top Procedures by Revenue
    </h3>
    
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: COLORS.textSecondary, fontWeight: '600' }}>CPT</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: COLORS.textSecondary, fontWeight: '600' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: COLORS.textSecondary, fontWeight: '600' }}>Volume</th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: COLORS.textSecondary, fontWeight: '600' }}>Avg Reimb</th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: COLORS.textSecondary, fontWeight: '600' }}>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {procedures.map((proc, index) => (
            <tr key={index} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: COLORS.primary }}>{proc.cpt}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: COLORS.text }}>{proc.description}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: COLORS.text, textAlign: 'right' }}>{proc.volume.toLocaleString()}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: COLORS.text, textAlign: 'right' }}>{formatCurrency(proc.avgReimbursement)}</td>
              <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: COLORS.success, textAlign: 'right' }}>{formatCurrency(proc.totalRevenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProviderDetailModal = ({ provider, onClose }) => {
  if (!provider) return null;
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: '24px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Hero Section */}
        <div style={{
          background: provider.color,
          padding: '32px',
          color: COLORS.white,
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              fontSize: '18px',
              color: COLORS.white,
            }}
          >
            ✕
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}>
              {provider.avatar}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{provider.name}</h2>
              <div style={{ fontSize: '16px', opacity: 0.9 }}>{provider.credentials}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>{provider.role}</div>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '24px' }}>
          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              background: COLORS.background,
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: provider.color }}>
                {provider.yearsExperience}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Years Experience</div>
            </div>
            <div style={{
              background: COLORS.background,
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.success }}>
                {provider.patientVolume.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Patients/Year</div>
            </div>
            <div style={{
              background: COLORS.background,
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: COLORS.primary }}>
                {formatCurrency(provider.revenue)}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Annual Revenue</div>
            </div>
          </div>
          
          {/* Details */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '12px' }}>
              Specialization
            </h4>
            <div style={{
              padding: '16px',
              background: COLORS.background,
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '15px', color: COLORS.text, marginBottom: '4px' }}>
                <strong>Primary:</strong> {provider.specialty}
              </div>
              {provider.subspecialty && (
                <div style={{ fontSize: '14px', color: COLORS.textSecondary }}>
                  <strong>Focus Area:</strong> {provider.subspecialty}
                </div>
              )}
            </div>
          </div>
          
          {/* Education */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '12px' }}>
              Education & Training
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                padding: '12px 16px',
                background: COLORS.background,
                borderRadius: '10px',
                borderLeft: `4px solid ${provider.color}`,
              }}>
                <div style={{ fontSize: '12px', color: COLORS.textLight }}>Medical School</div>
                <div style={{ fontSize: '14px', color: COLORS.text }}>{provider.education}</div>
              </div>
              <div style={{
                padding: '12px 16px',
                background: COLORS.background,
                borderRadius: '10px',
                borderLeft: `4px solid ${COLORS.success}`,
              }}>
                <div style={{ fontSize: '12px', color: COLORS.textLight }}>Residency</div>
                <div style={{ fontSize: '14px', color: COLORS.text }}>{provider.residency}</div>
              </div>
              {provider.fellowship && (
                <div style={{
                  padding: '12px 16px',
                  background: COLORS.background,
                  borderRadius: '10px',
                  borderLeft: `4px solid ${COLORS.accent}`,
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.textLight }}>Fellowship</div>
                  <div style={{ fontSize: '14px', color: COLORS.text }}>{provider.fellowship}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Surgical Volume */}
          {provider.surgicalVolume && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '12px' }}>
                Surgical Volume (Annual)
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}>
                <div style={{
                  padding: '16px',
                  background: `${COLORS.primary}10`,
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>
                    {provider.surgicalVolume.cataract}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Cataract</div>
                </div>
                <div style={{
                  padding: '16px',
                  background: `${COLORS.success}10`,
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.success }}>
                    {provider.surgicalVolume.glaucoma || provider.surgicalVolume.oculoplastic || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>
                    {provider.surgicalVolume.glaucoma ? 'Glaucoma' : 'Oculoplastic'}
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  background: `${COLORS.accent}10`,
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.accent }}>
                    {provider.surgicalVolume.laser}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Laser</div>
                </div>
                <div style={{
                  padding: '16px',
                  background: `${COLORS.warning}10`,
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.warning }}>
                    {provider.surgicalVolume.total}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Total</div>
                </div>
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '24px', fontSize: '12px', color: COLORS.textLight, textAlign: 'center' }}>
            NPI: {provider.npi}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

const PracticeProfile = ({ onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const data = PRACTICE_DATA;
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'providers', label: 'Providers', icon: '👨‍⚕️' },
    { id: 'locations', label: 'Locations', icon: '📍' },
    { id: 'financials', label: 'Financials', icon: '💰' },
    { id: 'operations', label: 'Operations', icon: '⚙️' },
  ];
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: COLORS.background,
          borderRadius: '24px',
          width: '100%',
          maxWidth: '1400px',
          maxHeight: '95vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Hero Header */}
        <div style={{
          background: COLORS.gradientOphthalmology,
          padding: '32px',
          color: COLORS.white,
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '20px',
              color: COLORS.white,
            }}
          >
            ✕
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}>
              👁️
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>{data.name}</h1>
              <div style={{ fontSize: '16px', opacity: 0.9, marginTop: '4px' }}>{data.tagline}</div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
                Est. {data.established} • {data.providers.length} Providers • {data.locations.length} Locations
              </div>
            </div>
          </div>
          
          {/* Quick Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: '24px',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(data.financials.totalRevenue)}</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Annual Revenue</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{data.patientDemographics.totalActive.toLocaleString()}</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Active Patients</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{data.staff.total}</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Staff Members</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{data.kpis.patientSatisfaction}⭐</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Patient Rating</div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{
          background: COLORS.white,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: '0 24px',
          display: 'flex',
          gap: '8px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                borderBottom: `3px solid ${activeTab === tab.id ? COLORS.primary : 'transparent'}`,
                color: activeTab === tab.id ? COLORS.primary : COLORS.textSecondary,
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div style={{
          padding: '24px',
          overflow: 'auto',
          flex: 1,
        }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '24px',
              }}>
                <StatCard
                  label="YoY Growth"
                  value={`+${data.financials.yearOverYearGrowth}%`}
                  icon="📈"
                  color={COLORS.success}
                  trend={data.financials.yearOverYearGrowth}
                />
                <StatCard
                  label="Collections Rate"
                  value={`${data.financials.collectionsRate}%`}
                  icon="💵"
                  color={COLORS.primary}
                />
                <StatCard
                  label="Days in AR"
                  value={data.financials.avgDaysInAR}
                  icon="📅"
                  color={COLORS.warning}
                />
                <StatCard
                  label="New Patients YTD"
                  value={data.patientDemographics.newPatientsYTD.toLocaleString()}
                  icon="👥"
                  color={COLORS.accent}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <PayerMixChart data={data.payerMix} />
                <TopProceduresTable procedures={data.topProcedures.slice(0, 5)} />
              </div>
            </div>
          )}
          
          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: COLORS.text, marginBottom: '8px' }}>
                  Medical Staff ({data.providers.length} Providers)
                </h3>
                <p style={{ color: COLORS.textSecondary, margin: 0 }}>
                  2 MD Ophthalmologists • 3 OD Optometrists
                </p>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
              }}>
                {data.providers.map(provider => (
                  <ProviderCard 
                    key={provider.id} 
                    provider={provider}
                    onClick={() => setSelectedProvider(provider)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: COLORS.text, marginBottom: '8px' }}>
                  Practice Locations ({data.locations.length} Sites)
                </h3>
                <p style={{ color: COLORS.textSecondary, margin: 0 }}>
                  Delaware County, Pennsylvania Service Area
                </p>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
                gap: '24px',
              }}>
                {data.locations.map(location => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            </div>
          )}
          
          {/* Financials Tab */}
          {activeTab === 'financials' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '24px',
              }}>
                <StatCard
                  label="Professional Fees"
                  value={formatCurrency(data.financials.breakdown.professionalFees)}
                  subtext="80% of revenue"
                  icon="🩺"
                  color={COLORS.primary}
                />
                <StatCard
                  label="Surgical Revenue"
                  value={formatCurrency(data.financials.breakdown.surgicalFees)}
                  subtext="14% of revenue"
                  icon="🏥"
                  color={COLORS.success}
                />
                <StatCard
                  label="Optical Sales"
                  value={formatCurrency(data.financials.breakdown.opticalSales)}
                  subtext="5% of revenue"
                  icon="👓"
                  color={COLORS.accent}
                />
                <StatCard
                  label="Other Income"
                  value={formatCurrency(data.financials.breakdown.otherIncome)}
                  subtext="1% of revenue"
                  icon="💎"
                  color={COLORS.warning}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Monthly Revenue Chart */}
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: SHADOWS.md,
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '20px' }}>
                    Monthly Revenue Trend
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.financials.monthlyRevenue.map((month, index) => {
                      const percentage = (month.revenue / 280000) * 100;
                      const onTarget = month.revenue >= month.budget;
                      return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', fontSize: '13px', color: COLORS.textSecondary }}>{month.month}</div>
                          <div style={{ flex: 1, height: '24px', background: COLORS.background, borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background: onTarget ? COLORS.gradientSuccess : COLORS.gradientWarning,
                              borderRadius: '12px',
                            }} />
                          </div>
                          <div style={{ width: '80px', fontSize: '13px', fontWeight: '500', color: onTarget ? COLORS.success : COLORS.warning, textAlign: 'right' }}>
                            {formatCurrency(month.revenue)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Expense Breakdown */}
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: SHADOWS.md,
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '20px' }}>
                    Major Expenses
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(data.financials.expenses).slice(0, 6).map(([key, value], index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: COLORS.text, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.danger }}>
                          {formatCurrency(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: '600', color: COLORS.text }}>Total Expenses</span>
                    <span style={{ fontWeight: '700', color: COLORS.danger }}>
                      {formatCurrency(Object.values(data.financials.expenses).reduce((a, b) => a + b, 0))}
                    </span>
                  </div>
                </div>
              </div>
              
              <TopProceduresTable procedures={data.topProcedures} />
            </div>
          )}
          
          {/* Operations Tab */}
          {activeTab === 'operations' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '24px',
              }}>
                <StatCard
                  label="No-Show Rate"
                  value={`${data.kpis.noShowRate}%`}
                  icon="📉"
                  color={COLORS.success}
                />
                <StatCard
                  label="Avg Wait Time"
                  value={`${data.kpis.avgWaitTime} min`}
                  icon="⏱️"
                  color={COLORS.primary}
                />
                <StatCard
                  label="Claims 1st Pass"
                  value={`${data.kpis.claimsFirstPassRate}%`}
                  icon="✅"
                  color={COLORS.accent}
                />
                <StatCard
                  label="Surgical Success"
                  value={`${data.kpis.surgicalOutcomes}%`}
                  icon="🎯"
                  color={COLORS.success}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Staff Breakdown */}
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: SHADOWS.md,
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '20px' }}>
                    Staff Composition ({data.staff.total} Total)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.staff.breakdown.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: COLORS.text }}>{item.role}</span>
                        <span style={{
                          padding: '4px 12px',
                          background: `${COLORS.primary}15`,
                          color: COLORS.primary,
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: COLORS.background,
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: COLORS.textSecondary,
                  }}>
                    Staff Turnover Rate: <strong style={{ color: COLORS.success }}>{data.kpis.staffTurnover}%</strong>
                  </div>
                </div>
                
                {/* Patient Demographics */}
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: SHADOWS.md,
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '20px' }}>
                    Patient Demographics
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14px', color: COLORS.textSecondary, marginBottom: '8px' }}>Age Distribution</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {data.patientDemographics.ageDistribution.map((item, index) => (
                        <div key={index} style={{
                          flex: item.percentage,
                          background: index === 3 ? COLORS.primary : index === 2 ? COLORS.secondary : index === 1 ? COLORS.accent : COLORS.success,
                          height: '40px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: COLORS.white,
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {item.range}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: COLORS.textLight }}>
                      {data.patientDemographics.ageDistribution.map((item, index) => (
                        <span key={index}>{item.percentage}%</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}>
                    <div style={{
                      padding: '16px',
                      background: COLORS.background,
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>
                        {data.patientDemographics.avgAge}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Average Age</div>
                    </div>
                    <div style={{
                      padding: '16px',
                      background: COLORS.background,
                      borderRadius: '12px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px' }}>♂️ {data.patientDemographics.genderSplit.male}%</span>
                        <span style={{ fontSize: '14px' }}>♀️ {data.patientDemographics.genderSplit.female}%</span>
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textSecondary, textAlign: 'center' }}>Gender Split</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${COLORS.border}`,
          background: COLORS.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '13px', color: COLORS.textLight }}>
            Practice Profile • Simulated Data Based on OSA Model • {data.website}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '10px 20px',
              background: COLORS.background,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              fontSize: '14px',
              color: COLORS.text,
              cursor: 'pointer',
            }}>
              Export Report
            </button>
            <button style={{
              padding: '10px 20px',
              background: COLORS.gradientPrimary,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              color: COLORS.white,
              cursor: 'pointer',
              fontWeight: '500',
            }}>
              Run Analysis
            </button>
          </div>
        </div>
      </div>
      
      {/* Provider Detail Modal */}
      {selectedProvider && (
        <ProviderDetailModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
};

export default PracticeProfile;
