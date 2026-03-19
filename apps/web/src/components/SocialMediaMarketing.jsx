/**
 * MedPact Practice Intelligence v2.1.1
 * Social Media Marketing Campaign Manager
 * 
 * Features:
 * - Campaign builder for Facebook, Instagram, LinkedIn, Google Ads
 * - Geographic targeting by ZIP code
 * - Audience persona builder (seniors for cataract, young adults for LASIK)
 * - Budget calculator with reach estimates
 * - Pre-built ophthalmology ad templates
 * - Campaign scheduling calendar
 * - ROI tracking dashboard
 * - A/B test suggestions
 */

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// =============================================
// DESIGN SYSTEM
// =============================================

const COLORS = {
  primary: '#0066FF',
  secondary: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  facebook: '#1877F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  google: '#4285F4',
  text: '#1E293B',
  textSecondary: '#64748B',
  background: '#F8FAFC',
  white: '#FFFFFF',
  border: '#E2E8F0',
};

const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

// =============================================
// SOCIAL MEDIA PLATFORMS
// =============================================

const PLATFORMS = [
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: '📘', 
    color: COLORS.facebook,
    cpm: 12.50, // Cost per 1000 impressions
    ctr: 0.9,   // Click-through rate %
    audiences: ['Seniors 55+', 'Parents', 'Local Community']
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: '📸', 
    color: COLORS.instagram,
    cpm: 8.50,
    ctr: 1.2,
    audiences: ['Young Adults 25-44', 'Health Conscious', 'Fashion/Beauty']
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: '💼', 
    color: COLORS.linkedin,
    cpm: 35.00,
    ctr: 0.5,
    audiences: ['Professionals', 'Business Owners', 'Corporate Benefits']
  },
  { 
    id: 'google', 
    name: 'Google Ads', 
    icon: '🔍', 
    color: COLORS.google,
    cpm: 15.00,
    ctr: 3.5,
    audiences: ['Search Intent', 'Local Search', 'Remarketing']
  },
];

// =============================================
// AUDIENCE PERSONAS
// =============================================

const AUDIENCE_PERSONAS = [
  {
    id: 'cataract_seniors',
    name: 'Cataract Candidates',
    icon: '👴',
    ageRange: '55-85',
    interests: ['Health', 'Medicare', 'Retirement', 'Grandchildren'],
    targetServices: ['Cataract Surgery', 'Premium IOLs', 'Medicare Eye Exams'],
    platforms: ['facebook', 'google'],
    estimatedReach: 45000,
    conversionRate: 2.8,
  },
  {
    id: 'lasik_young',
    name: 'LASIK Candidates',
    icon: '👓',
    ageRange: '25-45',
    interests: ['Fitness', 'Travel', 'Sports', 'Technology'],
    targetServices: ['LASIK', 'PRK', 'ICL', 'Vision Correction'],
    platforms: ['instagram', 'facebook', 'google'],
    estimatedReach: 62000,
    conversionRate: 1.5,
  },
  {
    id: 'dry_eye',
    name: 'Dry Eye Sufferers',
    icon: '💧',
    ageRange: '35-65',
    interests: ['Computer Work', 'Contact Lenses', 'Allergies'],
    targetServices: ['Dry Eye Treatment', 'IPL', 'LipiFlow'],
    platforms: ['facebook', 'instagram', 'google'],
    estimatedReach: 38000,
    conversionRate: 3.2,
  },
  {
    id: 'pediatric',
    name: 'Parents - Pediatric',
    icon: '👶',
    ageRange: '28-45',
    interests: ['Parenting', 'Schools', 'Children Activities'],
    targetServices: ['Pediatric Eye Exams', 'Myopia Control', 'Vision Therapy'],
    platforms: ['facebook', 'instagram'],
    estimatedReach: 52000,
    conversionRate: 2.1,
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma Awareness',
    icon: '👁️',
    ageRange: '45-75',
    interests: ['Health Screening', 'Preventive Care', 'Family History'],
    targetServices: ['Glaucoma Screening', 'MIGS', 'Eye Pressure Treatment'],
    platforms: ['facebook', 'google'],
    estimatedReach: 28000,
    conversionRate: 2.4,
  },
  {
    id: 'cosmetic',
    name: 'Cosmetic/Aesthetics',
    icon: '✨',
    ageRange: '35-65',
    interests: ['Beauty', 'Anti-Aging', 'Skincare', 'Wellness'],
    targetServices: ['Botox', 'Eyelid Surgery', 'Fillers'],
    platforms: ['instagram', 'facebook'],
    estimatedReach: 41000,
    conversionRate: 1.8,
  },
];

// =============================================
// AD TEMPLATES
// =============================================

const AD_TEMPLATES = {
  cataract: [
    {
      id: 'cat1',
      title: 'See Clearly Again',
      headline: 'Life-Changing Cataract Surgery',
      body: 'Are cataracts affecting your daily life? Our board-certified surgeons use the latest technology for faster recovery. Medicare accepted. Book your free consultation today!',
      cta: 'Schedule Free Consultation',
      image: '🏥',
      bestFor: ['facebook', 'google'],
    },
    {
      id: 'cat2',
      title: 'Premium IOL Options',
      headline: 'Say Goodbye to Glasses After Cataract Surgery',
      body: 'Ask about our premium lens implants that can correct distance, near, and astigmatism - all in one surgery. Most patients achieve glasses-free vision!',
      cta: 'Learn About Premium Lenses',
      image: '👓',
      bestFor: ['facebook'],
    },
  ],
  lasik: [
    {
      id: 'lasik1',
      title: 'Freedom from Glasses',
      headline: 'Wake Up to Perfect Vision',
      body: 'LASIK takes just 15 minutes and most patients see 20/20 the next day. Financing as low as $99/month. Free consultation includes a $500 surgery credit!',
      cta: 'Claim Your Free Consultation',
      image: '🌅',
      bestFor: ['instagram', 'facebook'],
    },
    {
      id: 'lasik2',
      title: 'Active Lifestyle?',
      headline: 'LASIK for Athletes & Adventurers',
      body: "Stop worrying about contacts falling out or glasses fogging up. Join thousands of active patients who've chosen LASIK. Special pricing this month!",
      cta: 'Get Special Pricing',
      image: '🏃',
      bestFor: ['instagram'],
    },
  ],
  dryeye: [
    {
      id: 'dry1',
      title: 'Tired of Dry, Irritated Eyes?',
      headline: 'Advanced Dry Eye Treatment',
      body: "If eye drops aren't enough, we offer breakthrough treatments like IPL and LipiFlow that address the root cause. Get lasting relief - not just temporary comfort.",
      cta: 'Book Dry Eye Evaluation',
      image: '💧',
      bestFor: ['facebook', 'google'],
    },
  ],
  pediatric: [
    {
      id: 'ped1',
      title: "Your Child's Vision Matters",
      headline: 'Back-to-School Eye Exams',
      body: '80% of learning is visual. Make sure your child can see clearly this school year. We make eye exams fun and kid-friendly. Most insurance accepted!',
      cta: 'Schedule Kids Eye Exam',
      image: '📚',
      bestFor: ['facebook', 'instagram'],
    },
  ],
  general: [
    {
      id: 'gen1',
      title: 'Comprehensive Eye Care',
      headline: 'Your Vision. Our Priority.',
      body: 'From routine exams to advanced surgery, our team provides personalized eye care for the whole family. New patients welcome - same week appointments available!',
      cta: 'Book Appointment',
      image: '👁️',
      bestFor: ['facebook', 'google', 'instagram'],
    },
  ],
};

// =============================================
// ZIP CODE TARGETING DATA
// =============================================

const TARGET_ZIPS = [
  { zip: '94102', city: 'San Francisco', population: 45000, medianIncome: 85000, seniors: 12 },
  { zip: '94103', city: 'San Francisco', population: 52000, medianIncome: 92000, seniors: 8 },
  { zip: '94105', city: 'San Francisco', population: 38000, medianIncome: 125000, seniors: 6 },
  { zip: '94109', city: 'San Francisco', population: 67000, medianIncome: 78000, seniors: 15 },
  { zip: '94115', city: 'San Francisco', population: 44000, medianIncome: 115000, seniors: 18 },
  { zip: '94118', city: 'San Francisco', population: 41000, medianIncome: 98000, seniors: 14 },
  { zip: '94121', city: 'San Francisco', population: 38000, medianIncome: 82000, seniors: 22 },
  { zip: '94122', city: 'San Francisco', population: 53000, medianIncome: 76000, seniors: 20 },
];

// =============================================
// HELPER FUNCTIONS
// =============================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// =============================================
// SUB-COMPONENTS
// =============================================

// Platform Selection Card
const PlatformCard = ({ platform, isSelected, onClick, budget }) => {
  const estimatedReach = budget ? Math.round((budget / platform.cpm) * 1000) : 0;
  const estimatedClicks = Math.round(estimatedReach * (platform.ctr / 100));
  
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? `${platform.color}10` : COLORS.white,
        border: `2px solid ${isSelected ? platform.color : COLORS.border}`,
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '12px',
          background: platform.color,
          color: 'white',
          padding: '2px 10px',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: 600,
        }}>✓ SELECTED</div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '32px' }}>{platform.icon}</span>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', color: COLORS.text }}>{platform.name}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: COLORS.textSecondary }}>
            CPM: {formatCurrency(platform.cpm)} • CTR: {platform.ctr}%
          </p>
        </div>
      </div>
      
      {budget > 0 && (
        <div style={{ 
          background: COLORS.background, 
          borderRadius: '10px', 
          padding: '12px',
          marginTop: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>Est. Reach</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: platform.color }}>{formatNumber(estimatedReach)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>Est. Clicks</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.success }}>{formatNumber(estimatedClicks)}</span>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '12px' }}>
        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: COLORS.textSecondary }}>Best Audiences:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {platform.audiences.map(audience => (
            <span key={audience} style={{
              fontSize: '10px',
              padding: '3px 8px',
              background: `${platform.color}15`,
              color: platform.color,
              borderRadius: '10px',
            }}>{audience}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Audience Persona Card
const PersonaCard = ({ persona, isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: isSelected ? `${COLORS.primary}08` : COLORS.white,
      border: `2px solid ${isSelected ? COLORS.primary : COLORS.border}`,
      borderRadius: '16px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <span style={{ fontSize: '28px' }}>{persona.icon}</span>
      <div>
        <h4 style={{ margin: 0, fontSize: '14px', color: COLORS.text }}>{persona.name}</h4>
        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: COLORS.textSecondary }}>
          Ages {persona.ageRange}
        </p>
      </div>
    </div>
    
    <div style={{ marginBottom: '10px' }}>
      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: COLORS.textSecondary }}>Target Services:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {persona.targetServices.slice(0, 3).map(service => (
          <span key={service} style={{
            fontSize: '10px',
            padding: '2px 6px',
            background: `${COLORS.success}15`,
            color: COLORS.success,
            borderRadius: '8px',
          }}>{service}</span>
        ))}
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
      <span style={{ color: COLORS.textSecondary }}>Est. Reach: <strong style={{ color: COLORS.text }}>{formatNumber(persona.estimatedReach)}</strong></span>
      <span style={{ color: COLORS.textSecondary }}>Conv: <strong style={{ color: COLORS.success }}>{persona.conversionRate}%</strong></span>
    </div>
  </div>
);

// Ad Template Card
const AdTemplateCard = ({ template, isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: isSelected ? `${COLORS.secondary}08` : COLORS.white,
      border: `2px solid ${isSelected ? COLORS.secondary : COLORS.border}`,
      borderRadius: '16px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
      <span style={{ fontSize: '36px' }}>{template.image}</span>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: COLORS.text }}>{template.headline}</h4>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: COLORS.textSecondary, lineHeight: 1.4 }}>
          {template.body.substring(0, 100)}...
        </p>
        <button style={{
          padding: '6px 12px',
          background: COLORS.primary,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 600,
        }}>{template.cta}</button>
      </div>
    </div>
    
    <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
      {template.bestFor.map(platform => {
        const p = PLATFORMS.find(pl => pl.id === platform);
        return (
          <span key={platform} style={{
            fontSize: '10px',
            padding: '2px 8px',
            background: `${p?.color}15`,
            color: p?.color,
            borderRadius: '10px',
          }}>{p?.name}</span>
        );
      })}
    </div>
  </div>
);

// ZIP Code Target Row
const ZipTargetRow = ({ zip, isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      background: isSelected ? `${COLORS.primary}08` : COLORS.white,
      border: `1px solid ${isSelected ? COLORS.primary : COLORS.border}`,
      borderRadius: '10px',
      cursor: 'pointer',
      marginBottom: '8px',
    }}
  >
    <div style={{
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: `2px solid ${isSelected ? COLORS.primary : COLORS.border}`,
      background: isSelected ? COLORS.primary : 'transparent',
      marginRight: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
    }}>
      {isSelected && '✓'}
    </div>
    <div style={{ flex: 1 }}>
      <span style={{ fontWeight: 600, color: COLORS.text }}>{zip.zip}</span>
      <span style={{ color: COLORS.textSecondary, marginLeft: '8px' }}>{zip.city}</span>
    </div>
    <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
      <span style={{ color: COLORS.textSecondary }}>Pop: <strong>{formatNumber(zip.population)}</strong></span>
      <span style={{ color: COLORS.textSecondary }}>Income: <strong>{formatCurrency(zip.medianIncome)}</strong></span>
      <span style={{ color: COLORS.textSecondary }}>Seniors: <strong>{zip.seniors}%</strong></span>
    </div>
  </div>
);

// Campaign Summary Card
const CampaignSummary = ({ campaign }) => {
  if (!campaign.platforms?.length) return null;
  
  const totalBudget = campaign.budget || 0;
  const selectedPlatforms = PLATFORMS.filter(p => campaign.platforms?.includes(p.id));
  const budgetPerPlatform = totalBudget / selectedPlatforms.length;
  
  const totalReach = selectedPlatforms.reduce((sum, p) => 
    sum + Math.round((budgetPerPlatform / p.cpm) * 1000), 0);
  const totalClicks = selectedPlatforms.reduce((sum, p) => 
    sum + Math.round((budgetPerPlatform / p.cpm) * 1000 * (p.ctr / 100)), 0);
  
  const persona = AUDIENCE_PERSONAS.find(p => p.id === campaign.persona);
  const estimatedConversions = Math.round(totalClicks * ((persona?.conversionRate || 2) / 100));
  const costPerConversion = estimatedConversions > 0 ? totalBudget / estimatedConversions : 0;
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0066FF 0%, #6366F1 100%)',
      borderRadius: '20px',
      padding: '24px',
      color: 'white',
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>📊 Campaign Summary</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Budget', value: formatCurrency(totalBudget), icon: '💰' },
          { label: 'Est. Reach', value: formatNumber(totalReach), icon: '👥' },
          { label: 'Est. Clicks', value: formatNumber(totalClicks), icon: '🖱️' },
          { label: 'Est. Conversions', value: formatNumber(estimatedConversions), icon: '🎯' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <p style={{ margin: '8px 0 4px 0', fontSize: '20px', fontWeight: 700 }}>{stat.value}</p>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8 }}>Cost Per Conversion</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{formatCurrency(costPerConversion)}</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8 }}>ROI Estimate</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
            {((estimatedConversions * 2500) / totalBudget * 100 - 100).toFixed(0)}%
          </p>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8 }}>Avg Patient Value</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>$2,500</p>
        </div>
      </div>
    </div>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

export default function SocialMediaMarketing({ onClose }) {
  const [activeStep, setActiveStep] = useState(1);
  const [campaign, setCampaign] = useState({
    name: '',
    platforms: [],
    persona: null,
    template: null,
    budget: 1000,
    duration: 30,
    targetZips: [],
    schedule: 'immediate',
  });
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { id: 1, label: 'Platforms', icon: '📱' },
    { id: 2, label: 'Audience', icon: '👥' },
    { id: 3, label: 'Creative', icon: '🎨' },
    { id: 4, label: 'Targeting', icon: '📍' },
    { id: 5, label: 'Budget', icon: '💰' },
    { id: 6, label: 'Review', icon: '✅' },
  ];

  const handlePlatformToggle = (platformId) => {
    setCampaign(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleZipToggle = (zipCode) => {
    setCampaign(prev => ({
      ...prev,
      targetZips: prev.targetZips.includes(zipCode)
        ? prev.targetZips.filter(z => z !== zipCode)
        : [...prev.targetZips, zipCode]
    }));
  };

  const selectedPersona = AUDIENCE_PERSONAS.find(p => p.id === campaign.persona);
  const selectedTemplate = Object.values(AD_TEMPLATES).flat().find(t => t.id === campaign.template);

  const canProceed = useMemo(() => {
    switch (activeStep) {
      case 1: return campaign.platforms.length > 0;
      case 2: return campaign.persona !== null;
      case 3: return campaign.template !== null;
      case 4: return campaign.targetZips.length > 0;
      case 5: return campaign.budget >= 100;
      default: return true;
    }
  }, [activeStep, campaign]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 10001,
      padding: '40px 20px 20px 20px',
      overflowY: 'auto',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: COLORS.background,
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: SHADOWS.lg,
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          background: 'linear-gradient(135deg, #E4405F 0%, #1877F2 50%, #0A66C2 100%)',
          color: 'white',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <span style={{ fontSize: '28px' }}>📣</span>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Social Media Marketing</h2>
              </div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>
                Create targeted campaigns for your eye care practice
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: activeStep === step.id 
                    ? 'white' 
                    : activeStep > step.id 
                      ? 'rgba(255,255,255,0.3)' 
                      : 'rgba(255,255,255,0.1)',
                  color: activeStep === step.id ? COLORS.primary : 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>{step.icon}</span>
                <span style={{ display: idx < 4 ? 'none' : 'inline' }}>{step.label}</span>
                {activeStep > step.id && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          {/* Step 1: Platform Selection */}
          {activeStep === 1 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                📱 Select Advertising Platforms
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: COLORS.textSecondary }}>
                Choose where you want to run your ads. You can select multiple platforms.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {PLATFORMS.map(platform => (
                  <PlatformCard
                    key={platform.id}
                    platform={platform}
                    isSelected={campaign.platforms.includes(platform.id)}
                    onClick={() => handlePlatformToggle(platform.id)}
                    budget={campaign.budget / Math.max(campaign.platforms.length, 1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Audience Persona */}
          {activeStep === 2 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                👥 Select Target Audience
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: COLORS.textSecondary }}>
                Choose the patient persona that best matches your campaign goals.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {AUDIENCE_PERSONAS.map(persona => (
                  <PersonaCard
                    key={persona.id}
                    persona={persona}
                    isSelected={campaign.persona === persona.id}
                    onClick={() => setCampaign(prev => ({ ...prev, persona: persona.id }))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Ad Creative */}
          {activeStep === 3 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                🎨 Choose Ad Template
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: COLORS.textSecondary }}>
                Select a pre-built ad template or customize your own.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {Object.entries(AD_TEMPLATES).map(([category, templates]) => (
                  templates.map(template => (
                    <AdTemplateCard
                      key={template.id}
                      template={template}
                      isSelected={campaign.template === template.id}
                      onClick={() => setCampaign(prev => ({ ...prev, template: template.id }))}
                    />
                  ))
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Geographic Targeting */}
          {activeStep === 4 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                📍 Geographic Targeting
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: COLORS.textSecondary }}>
                Select ZIP codes to target. Higher senior populations are ideal for cataract campaigns.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                  onClick={() => setCampaign(prev => ({ ...prev, targetZips: TARGET_ZIPS.map(z => z.zip) }))}
                  style={{
                    padding: '10px 20px',
                    background: COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  Select All
                </button>
                <button
                  onClick={() => setCampaign(prev => ({ ...prev, targetZips: [] }))}
                  style={{
                    padding: '10px 20px',
                    background: COLORS.background,
                    color: COLORS.text,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setCampaign(prev => ({ 
                    ...prev, 
                    targetZips: TARGET_ZIPS.filter(z => z.seniors >= 15).map(z => z.zip) 
                  }))}
                  style={{
                    padding: '10px 20px',
                    background: COLORS.warning,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  High Senior Areas (15%+)
                </button>
              </div>
              
              <div style={{ 
                background: COLORS.white, 
                borderRadius: '16px', 
                padding: '16px',
                border: `1px solid ${COLORS.border}`,
              }}>
                {TARGET_ZIPS.map(zip => (
                  <ZipTargetRow
                    key={zip.zip}
                    zip={zip}
                    isSelected={campaign.targetZips.includes(zip.zip)}
                    onClick={() => handleZipToggle(zip.zip)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Budget & Schedule */}
          {activeStep === 5 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                💰 Budget & Schedule
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: COLORS.textSecondary }}>
                Set your campaign budget and duration.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: COLORS.text }}>Campaign Budget</h4>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: COLORS.textSecondary }}>
                      Total Budget
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={campaign.budget}
                      onChange={(e) => setCampaign(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      style={{ width: '100%', marginBottom: '8px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>$100</span>
                      <span style={{ fontSize: '20px', fontWeight: 700, color: COLORS.primary }}>
                        {formatCurrency(campaign.budget)}
                      </span>
                      <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>$10,000</span>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: COLORS.textSecondary }}>
                      Campaign Duration
                    </label>
                    <select
                      value={campaign.duration}
                      onChange={(e) => setCampaign(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                      }}
                    >
                      <option value={7}>1 Week</option>
                      <option value={14}>2 Weeks</option>
                      <option value={30}>1 Month</option>
                      <option value={60}>2 Months</option>
                      <option value={90}>3 Months</option>
                    </select>
                  </div>
                  
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '16px', 
                    background: COLORS.background, 
                    borderRadius: '12px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: COLORS.textSecondary }}>Daily Budget</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.text }}>
                        {formatCurrency(campaign.budget / campaign.duration)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: COLORS.textSecondary }}>Per Platform</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.text }}>
                        {formatCurrency(campaign.budget / Math.max(campaign.platforms.length, 1))}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: COLORS.text }}>Quick Budget Options</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Starter', amount: 500, description: 'Test the waters' },
                      { label: 'Growth', amount: 1500, description: 'Recommended for new campaigns' },
                      { label: 'Scale', amount: 3000, description: 'Maximize reach' },
                      { label: 'Enterprise', amount: 5000, description: 'Full market coverage' },
                    ].map(option => (
                      <button
                        key={option.label}
                        onClick={() => setCampaign(prev => ({ ...prev, budget: option.amount }))}
                        style={{
                          padding: '16px',
                          background: campaign.budget === option.amount ? `${COLORS.primary}10` : COLORS.background,
                          border: `2px solid ${campaign.budget === option.amount ? COLORS.primary : COLORS.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: COLORS.text }}>
                              {option.label}
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: COLORS.textSecondary }}>
                              {option.description}
                            </p>
                          </div>
                          <span style={{ fontSize: '18px', fontWeight: 700, color: COLORS.primary }}>
                            {formatCurrency(option.amount)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Launch */}
          {activeStep === 6 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                ✅ Review & Launch Campaign
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: COLORS.textSecondary }}>
                Review your campaign settings before launching.
              </p>
              
              <CampaignSummary campaign={campaign} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: COLORS.textSecondary }}>📱 Platforms</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {campaign.platforms.map(p => {
                      const platform = PLATFORMS.find(pl => pl.id === p);
                      return (
                        <span key={p} style={{
                          padding: '6px 12px',
                          background: `${platform?.color}15`,
                          color: platform?.color,
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}>
                          {platform?.icon} {platform?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: COLORS.textSecondary }}>👥 Target Audience</h4>
                  {selectedPersona && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '28px' }}>{selectedPersona.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: COLORS.text }}>{selectedPersona.name}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: COLORS.textSecondary }}>
                          Ages {selectedPersona.ageRange}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: COLORS.textSecondary }}>📍 Targeting</h4>
                  <p style={{ margin: 0, fontWeight: 600, color: COLORS.text }}>
                    {campaign.targetZips.length} ZIP codes selected
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: COLORS.textSecondary }}>
                    {campaign.targetZips.slice(0, 3).join(', ')}{campaign.targetZips.length > 3 && '...'}
                  </p>
                </div>
              </div>
              
              {selectedTemplate && (
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${COLORS.border}`,
                  marginTop: '16px',
                }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: COLORS.textSecondary }}>🎨 Ad Preview</h4>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{
                      width: '300px',
                      background: COLORS.background,
                      borderRadius: '12px',
                      padding: '20px',
                      border: `1px solid ${COLORS.border}`,
                    }}>
                      <div style={{
                        width: '100%',
                        height: '150px',
                        background: `linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.secondary}20 100%)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                      }}>
                        <span style={{ fontSize: '48px' }}>{selectedTemplate.image}</span>
                      </div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '16px', color: COLORS.text }}>
                        {selectedTemplate.headline}
                      </h5>
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: COLORS.textSecondary, lineHeight: 1.5 }}>
                        {selectedTemplate.body}
                      </p>
                      <button style={{
                        width: '100%',
                        padding: '10px',
                        background: COLORS.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}>
                        {selectedTemplate.cta}
                      </button>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', color: COLORS.text }}>💡 A/B Test Suggestions</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          'Try a patient testimonial image instead of graphics',
                          'Test "Book Now" vs "Schedule Free Consultation" CTA',
                          'Add urgency with "Limited Time Offer"',
                          'Include a specific price point or financing option',
                        ].map((suggestion, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: COLORS.background,
                            borderRadius: '8px',
                          }}>
                            <span style={{ color: COLORS.warning }}>💡</span>
                            <span style={{ fontSize: '13px', color: COLORS.text }}>{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          background: COLORS.white,
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            style={{
              padding: '12px 24px',
              background: activeStep === 1 ? COLORS.background : COLORS.white,
              color: activeStep === 1 ? COLORS.textLight : COLORS.text,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              cursor: activeStep === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            ← Back
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowPreview(true)}
              style={{
                padding: '12px 24px',
                background: COLORS.background,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              👁️ Preview
            </button>
            
            {activeStep < 6 ? (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                disabled={!canProceed}
                style={{
                  padding: '12px 32px',
                  background: canProceed ? COLORS.primary : COLORS.background,
                  color: canProceed ? 'white' : COLORS.textLight,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: canProceed ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🚀 Launch Campaign
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

SocialMediaMarketing.propTypes = {
  onClose: PropTypes.func.isRequired,
};