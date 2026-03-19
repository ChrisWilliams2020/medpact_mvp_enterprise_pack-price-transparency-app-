import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// =============================================
// MARKET INTELLIGENCE - MedPact SaaS & Gold
// Comprehensive market analysis, competitor insights,
// regional benchmarking, and pricing intelligence
// =============================================

const COLORS = {
  primary: '#059669',
  primaryLight: '#10b981',
  secondary: '#0EA5E9',
  accent: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
  gold: '#D4AF37',
  goldLight: '#F4E4BA',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  background: '#F8FAFC',
  white: '#FFFFFF',
};

const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// =============================================
// MARKET DATA
// =============================================

const MARKET_REGIONS = [
  { id: 'northeast', name: 'Northeast', states: 'NY, NJ, PA, CT, MA', practices: 2847, avgRevenue: '$2.8M', growth: '+4.2%' },
  { id: 'southeast', name: 'Southeast', states: 'FL, GA, NC, SC, VA', practices: 3124, avgRevenue: '$2.4M', growth: '+5.8%' },
  { id: 'midwest', name: 'Midwest', states: 'IL, OH, MI, IN, WI', practices: 2156, avgRevenue: '$2.1M', growth: '+3.1%' },
  { id: 'southwest', name: 'Southwest', states: 'TX, AZ, NM, OK', practices: 2689, avgRevenue: '$2.6M', growth: '+6.4%' },
  { id: 'west', name: 'West', states: 'CA, WA, OR, CO, NV', practices: 3567, avgRevenue: '$3.2M', growth: '+4.9%' },
];

const COMPETITOR_DATA = [
  { 
    id: 1, 
    name: 'Regional Eye Associates', 
    type: 'Multi-Site', 
    locations: 12, 
    providers: 28,
    marketShare: '8.2%',
    strength: 'Strong surgical volume',
    threat: 'High',
    recentActivity: 'Opened 2 new locations in Q4',
  },
  { 
    id: 2, 
    name: 'Vision Partners PE', 
    type: 'PE-Backed', 
    locations: 45, 
    providers: 89,
    marketShare: '15.4%',
    strength: 'Aggressive acquisition strategy',
    threat: 'Critical',
    recentActivity: 'Acquired 3 practices this quarter',
  },
  { 
    id: 3, 
    name: 'Community Eye Center', 
    type: 'Single Practice', 
    locations: 2, 
    providers: 5,
    marketShare: '2.1%',
    strength: 'Strong patient loyalty',
    threat: 'Low',
    recentActivity: 'Added retina specialist',
  },
  { 
    id: 4, 
    name: 'EyeCare Network', 
    type: 'Multi-Site', 
    locations: 8, 
    providers: 18,
    marketShare: '5.7%',
    strength: 'Insurance partnerships',
    threat: 'Medium',
    recentActivity: 'Launched telehealth services',
  },
  { 
    id: 5, 
    name: 'Precision Vision Group', 
    type: 'PE-Backed', 
    locations: 22, 
    providers: 42,
    marketShare: '9.8%',
    strength: 'Premium IOL focus',
    threat: 'High',
    recentActivity: 'Building new ASC',
  },
];

const PRICING_INTELLIGENCE = [
  { cpt: '66984', description: 'Cataract with IOL', yourRate: '$1,847', marketAvg: '$1,723', percentile: '78th', opportunity: '+$124' },
  { cpt: '67028', description: 'Intravitreal Injection', yourRate: '$312', marketAvg: '$298', percentile: '71st', opportunity: '+$14' },
  { cpt: '92014', description: 'Comprehensive Eye Exam', yourRate: '$142', marketAvg: '$156', percentile: '42nd', opportunity: '-$14' },
  { cpt: '66982', description: 'Complex Cataract', yourRate: '$2,156', marketAvg: '$2,089', percentile: '69th', opportunity: '+$67' },
  { cpt: '67210', description: 'Retinal Laser', yourRate: '$478', marketAvg: '$512', percentile: '38th', opportunity: '-$34' },
  { cpt: '65855', description: 'YAG Capsulotomy', yourRate: '$389', marketAvg: '$367', percentile: '74th', opportunity: '+$22' },
];

const MARKET_TRENDS = [
  { trend: 'Premium IOL Adoption', direction: 'up', change: '+12%', impact: 'High', description: 'Increasing patient demand for premium lenses' },
  { trend: 'Telehealth Expansion', direction: 'up', change: '+28%', impact: 'Medium', description: 'Post-pandemic virtual care continues growing' },
  { trend: 'ASC Shift', direction: 'up', change: '+18%', impact: 'High', description: 'More procedures moving to outpatient settings' },
  { trend: 'Medicare Reimbursement', direction: 'down', change: '-2.3%', impact: 'Critical', description: 'Continued pressure on government rates' },
  { trend: 'PE Consolidation', direction: 'up', change: '+15%', impact: 'High', description: 'Private equity activity increasing in ophthalmology' },
  { trend: 'Staffing Costs', direction: 'up', change: '+8%', impact: 'Medium', description: 'Labor market pressures on practice margins' },
];

const GOLD_INSIGHTS = [
  {
    id: 1,
    title: 'Revenue Opportunity Identified',
    category: 'Pricing',
    priority: 'High',
    value: '$187,500',
    description: 'Your cataract rates are 7% below market median. Adjusting to 75th percentile would generate additional annual revenue.',
    action: 'Review fee schedule optimization',
    icon: '💰',
  },
  {
    id: 2,
    title: 'Competitive Threat Alert',
    category: 'Market',
    priority: 'Critical',
    value: 'Vision Partners PE',
    description: 'Major PE platform acquired practice 8 miles from your location. Expect increased marketing and recruitment activity.',
    action: 'Strengthen provider retention strategy',
    icon: '⚠️',
  },
  {
    id: 3,
    title: 'Payer Mix Optimization',
    category: 'Contracts',
    priority: 'Medium',
    value: '+$94,200',
    description: 'Your Aetna commercial volume is below market average. Targeted marketing could increase high-reimbursement patients.',
    action: 'Launch targeted patient acquisition',
    icon: '📊',
  },
  {
    id: 4,
    title: 'Service Line Expansion',
    category: 'Growth',
    priority: 'High',
    value: '$312,000',
    description: 'Market demand for dry eye services exceeds supply. Adding dedicated dry eye clinic could capture unmet demand.',
    action: 'Evaluate dry eye equipment ROI',
    icon: '🚀',
  },
  {
    id: 5,
    title: 'Benchmark Alert',
    category: 'Operations',
    priority: 'Medium',
    value: '18% gap',
    description: 'Your patient volume per provider is 18% below regional average. Workflow optimization could increase throughput.',
    action: 'Schedule operational assessment',
    icon: '📈',
  },
];

// =============================================
// SUB-COMPONENTS
// =============================================

const MetricCard = ({ label, value, change, color, icon }) => (
  <div style={{
    background: COLORS.white,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      {change && (
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: change.startsWith('+') ? '#10b981' : '#EF4444',
          padding: '4px 10px',
          background: change.startsWith('+') ? '#dcfce7' : '#fee2e2',
          borderRadius: '20px',
        }}>{change}</span>
      )}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 700, color: color || COLORS.text }}>{value}</div>
    <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{label}</div>
  </div>
);

const InsightCard = ({ insight, onAction }) => (
  <div style={{
    background: insight.priority === 'Critical' ? '#fef2f2' : insight.priority === 'High' ? '#fffbeb' : COLORS.white,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${insight.priority === 'Critical' ? '#fecaca' : insight.priority === 'High' ? '#fde68a' : COLORS.border}`,
    transition: 'all 0.2s ease',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '32px' }}>{insight.icon}</span>
        <div>
          <h4 style={{ margin: 0, color: COLORS.text, fontSize: '16px', fontWeight: 600 }}>{insight.title}</h4>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: insight.priority === 'Critical' ? '#dc2626' : insight.priority === 'High' ? '#d97706' : '#059669',
            textTransform: 'uppercase',
          }}>{insight.priority} Priority • {insight.category}</span>
        </div>
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 100%)',
        color: '#78350f',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
      }}>GOLD</div>
    </div>
    <p style={{ margin: '0 0 12px 0', color: COLORS.textSecondary, fontSize: '14px', lineHeight: 1.6 }}>
      {insight.description}
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '18px', fontWeight: 700, color: COLORS.primary }}>{insight.value}</span>
      <button
        onClick={() => onAction(insight)}
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >{insight.action} →</button>
    </div>
  </div>
);

// =============================================
// MAIN COMPONENT
// =============================================

export default function MarketIntelligence({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, competitors, pricing, trends, gold
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(new Date());
    }, 2000);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '40px 20px 20px 20px',
        overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: COLORS.white,
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1400px',
        maxHeight: 'calc(100vh - 60px)',
        overflow: 'hidden',
        boxShadow: SHADOWS.xl,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #D4AF37 100%)',
          padding: '24px 32px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          minHeight: '90px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
                🌐 Market Intelligence
              </h2>
              <span style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 100%)',
                color: '#78350f',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
              }}>MedPact SaaS + GOLD</span>
            </div>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
              Real-time market analysis, competitive intelligence & pricing optimization
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={refreshData}
              disabled={refreshing}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                color: 'white',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>🔄</span>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >×</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.background,
          overflowX: 'auto',
          flexShrink: 0,
        }}>
          {[
            { id: 'overview', label: '📊 Market Overview' },
            { id: 'competitors', label: '🏢 Competitor Analysis' },
            { id: 'pricing', label: '💰 Pricing Intelligence' },
            { id: 'trends', label: '📈 Market Trends' },
            { id: 'gold', label: '⭐ Gold Insights' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: '1 0 auto',
                padding: '16px 24px',
                border: 'none',
                background: activeTab === tab.id ? COLORS.white : 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #D4AF37' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#D4AF37' : COLORS.textSecondary,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px 32px',
        }}>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Key Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <MetricCard label="Total Market Size" value="$4.2B" change="+5.7%" color="#059669" icon="🌐" />
                <MetricCard label="Your Market Share" value="3.8%" change="+0.4%" color="#0EA5E9" icon="📊" />
                <MetricCard label="Active Competitors" value="47" change="+3" color="#8B5CF6" icon="🏢" />
                <MetricCard label="Market Rank" value="#12" change="+2" color="#D4AF37" icon="🏆" />
              </div>

              {/* Regional Performance */}
              <h3 style={{ margin: '0 0 16px 0', color: COLORS.text, fontSize: '18px' }}>Regional Market Analysis</h3>
              <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${COLORS.border}`,
                marginBottom: '24px',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.background }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Region</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>States</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Practices</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Avg Revenue</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MARKET_REGIONS.map(region => (
                      <tr key={region.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '14px 16px', fontWeight: 500, color: COLORS.text }}>{region.name}</td>
                        <td style={{ padding: '14px 16px', color: COLORS.textSecondary, fontSize: '13px' }}>{region.states}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', color: COLORS.text }}>{region.practices.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: COLORS.text }}>{region.avgRevenue}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span style={{
                            color: '#10b981',
                            fontWeight: 600,
                            padding: '4px 10px',
                            background: '#dcfce7',
                            borderRadius: '20px',
                            fontSize: '13px',
                          }}>{region.growth}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Market Summary */}
              <div style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>📈 Market Intelligence Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>Ophthalmology Market CAGR</div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>4.8%</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>2024-2030 projected growth</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>PE Transaction Volume</div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>$2.1B</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>YTD acquisition activity</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>Average Practice Valuation</div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>7.2x</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>EBITDA multiple</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Competitors Tab */}
          {activeTab === 'competitors' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: COLORS.text, fontSize: '20px' }}>Competitor Analysis</h3>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.border}`,
                    fontSize: '14px',
                    color: COLORS.text,
                    background: COLORS.white,
                  }}
                >
                  <option value="all">All Regions</option>
                  <option value="local">Within 25 miles</option>
                  <option value="regional">Within 100 miles</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {COMPETITOR_DATA.map(competitor => (
                  <div key={competitor.id} style={{
                    background: COLORS.white,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${competitor.threat === 'Critical' ? '#fecaca' : competitor.threat === 'High' ? '#fde68a' : COLORS.border}`,
                    borderLeft: `4px solid ${competitor.threat === 'Critical' ? '#dc2626' : competitor.threat === 'High' ? '#d97706' : '#10b981'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, color: COLORS.text, fontSize: '18px' }}>{competitor.name}</h4>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: competitor.type === 'PE-Backed' ? '#fee2e2' : '#e0f2fe',
                            color: competitor.type === 'PE-Backed' ? '#dc2626' : '#0369a1',
                          }}>{competitor.type}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>
                            <strong style={{ color: COLORS.text }}>{competitor.locations}</strong> Locations
                          </span>
                          <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>
                            <strong style={{ color: COLORS.text }}>{competitor.providers}</strong> Providers
                          </span>
                          <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>
                            <strong style={{ color: COLORS.text }}>{competitor.marketShare}</strong> Market Share
                          </span>
                        </div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: COLORS.textSecondary }}>
                          <strong>Strength:</strong> {competitor.strength}
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary, fontStyle: 'italic' }}>
                          📰 Recent: {competitor.recentActivity}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>Threat Level</div>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          background: competitor.threat === 'Critical' ? '#dc2626' : competitor.threat === 'High' ? '#d97706' : competitor.threat === 'Medium' ? '#0ea5e9' : '#10b981',
                          color: 'white',
                        }}>{competitor.threat}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <>
              <h3 style={{ margin: '0 0 16px 0', color: COLORS.text, fontSize: '20px' }}>Pricing Intelligence vs Market</h3>
              <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${COLORS.border}`,
                marginBottom: '24px',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.background }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>CPT Code</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Description</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Your Rate</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Market Avg</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Percentile</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Opportunity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICING_INTELLIGENCE.map(item => (
                      <tr key={item.cpt} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: COLORS.primary }}>{item.cpt}</td>
                        <td style={{ padding: '14px 16px', color: COLORS.text }}>{item.description}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: COLORS.text }}>{item.yourRate}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', color: COLORS.textSecondary }}>{item.marketAvg}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: parseInt(item.percentile) >= 70 ? '#dcfce7' : parseInt(item.percentile) >= 50 ? '#fef3c7' : '#fee2e2',
                            color: parseInt(item.percentile) >= 70 ? '#16a34a' : parseInt(item.percentile) >= 50 ? '#d97706' : '#dc2626',
                          }}>{item.percentile}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span style={{
                            fontWeight: 600,
                            color: item.opportunity.startsWith('+') ? '#10b981' : '#dc2626',
                          }}>{item.opportunity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Above Market Average</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>4</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>CPT codes performing well</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #dc2626 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Below Market Average</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>2</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>CPT codes need attention</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Revenue Opportunity</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>$179K</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Potential annual increase</div>
                </div>
              </div>
            </>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <>
              <h3 style={{ margin: '0 0 16px 0', color: COLORS.text, fontSize: '20px' }}>Market Trends & Industry Signals</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                {MARKET_TRENDS.map((trend, idx) => (
                  <div key={idx} style={{
                    background: COLORS.white,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${COLORS.border}`,
                    borderLeft: `4px solid ${trend.direction === 'up' ? '#10b981' : '#EF4444'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, color: COLORS.text, fontSize: '16px' }}>{trend.trend}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '18px',
                          color: trend.direction === 'up' ? '#10b981' : '#EF4444',
                        }}>{trend.direction === 'up' ? '📈' : '📉'}</span>
                        <span style={{
                          fontWeight: 700,
                          color: trend.direction === 'up' ? '#10b981' : '#EF4444',
                        }}>{trend.change}</span>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 12px 0', color: COLORS.textSecondary, fontSize: '14px', lineHeight: 1.5 }}>
                      {trend.description}
                    </p>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: trend.impact === 'Critical' ? '#fee2e2' : trend.impact === 'High' ? '#fef3c7' : '#e0f2fe',
                      color: trend.impact === 'Critical' ? '#dc2626' : trend.impact === 'High' ? '#d97706' : '#0369a1',
                    }}>{trend.impact} Impact</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gold Insights Tab */}
          {activeTab === 'gold' && (
            <>
              <div style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                color: '#78350f',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>⭐</span>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>MedPact Gold Insights</h3>
                </div>
                <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>
                  AI-powered recommendations tailored to your practice. These actionable insights are generated by analyzing 
                  your data against market benchmarks, competitive landscape, and industry trends.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {GOLD_INSIGHTS.map(insight => (
                  <InsightCard 
                    key={insight.id} 
                    insight={insight} 
                    onAction={(i) => console.log('Action:', i.action)}
                  />
                ))}
              </div>

              {/* Gold Benefits */}
              <div style={{
                marginTop: '24px',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>🏆 MedPact Gold Benefits</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { icon: '🎯', title: 'Personalized Insights', desc: 'AI recommendations for your practice' },
                    { icon: '📊', title: 'Real-time Data', desc: 'Live market & competitor updates' },
                    { icon: '💰', title: 'Revenue Optimization', desc: 'Identify pricing opportunities' },
                    { icon: '🔔', title: 'Proactive Alerts', desc: 'Competitive threats & market changes' },
                    { icon: '📈', title: 'Growth Strategies', desc: 'Expansion & acquisition guidance' },
                    { icon: '🤝', title: 'Expert Support', desc: 'Dedicated consultant access' },
                  ].map((benefit, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '16px',
                      borderRadius: '10px',
                    }}>
                      <span style={{ fontSize: '24px' }}>{benefit.icon}</span>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px' }}>{benefit.title}</h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 32px',
          background: COLORS.background,
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', color: COLORS.textSecondary }}>
            Last updated: {lastUpdate.toLocaleTimeString()} • Data refreshes every 15 minutes
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: COLORS.textSecondary }}>Powered by</span>
            <span style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 100%)',
              color: '#78350f',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
            }}>MedPact Intelligence Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}

MarketIntelligence.propTypes = {
  onClose: PropTypes.func.isRequired,
};
