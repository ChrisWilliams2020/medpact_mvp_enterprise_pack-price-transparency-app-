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

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { role: 'user', content: chatInput }]);
    const response = searchKCN(chatInput);
    setChatInput('');
    setTimeout(() => setChatMessages(p => [...p, { role: 'assistant', content: response }]), 300);
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
                { label: '📈 Benchmarks', query: 'Explain my benchmark comparisons' },
                { label: '🔬 Research', query: 'What are the latest industry trends?' }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatInput(action.query);
                    setTimeout(() => handleChatSubmit(), 100);
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
                {chatMessages.map((m, i) => (
                  <div key={i} style={{...styles.chatMessage, ...(m.role === 'user' ? styles.userMessage : styles.botMessage)}}>
                    {m.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
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

            {/* Knowledge Base Quick Links */}
            <div style={{ ...styles.grid, marginTop: '24px' }}>
              {[
                { title: 'Coding Guides', icon: '📋', items: ['CPT 66984 Guide', 'Modifier Reference', 'E/M Documentation'] },
                { title: 'Revenue Optimization', icon: '💰', items: ['Premium IOL Strategy', 'Denial Reduction', 'Collection Tactics'] },
                { title: 'RCM Best Practices', icon: '🔄', items: ['A/R Management', 'Clean Claim Rate', 'Patient Collections'] },
                { title: 'Industry Research', icon: '📚', items: ['2025 Trends', 'Benchmark Data', 'Reimbursement Outlook'] }
              ].map((category, i) => (
                <div key={i} style={styles.metricCard}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{category.icon}</div>
                  <h3 style={{ fontWeight: '600', color: styles.pageTitle.color, marginBottom: '12px' }}>{category.title}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {category.items.map((item, j) => (
                      <button
                        key={j}
                        onClick={() => {
                          setChatInput(`Tell me about ${item}`);
                          setTimeout(() => handleChatSubmit(), 100);
                        }}
                        style={{
                          ...styles.button,
                          ...styles.secondaryBtn,
                          fontSize: '12px',
                          padding: '8px 12px',
                          textAlign: 'left',
                          justifyContent: 'flex-start'
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'staff' && (
          <>
            <h1 style={styles.pageTitle}>👥 Staff Intelligence</h1>
            <div style={styles.grid}>
              {[
                { name: 'Dr. Sarah Chen', role: 'Lead Ophthalmologist', patients: 847, satisfaction: 96, revenue: '$1.2M', icon: '👩‍⚕️' },
                { name: 'Dr. Michael Torres', role: 'Retina Specialist', patients: 623, satisfaction: 94, revenue: '$980K', icon: '👨‍⚕️' },
                { name: 'Dr. Emily Watson', role: 'Optometrist', patients: 1205, satisfaction: 98, revenue: '$650K', icon: '👩‍⚕️' },
                { name: 'Jessica Miller', role: 'Office Manager', patients: null, satisfaction: 95, revenue: null, icon: '👩‍💼' },
                { name: 'Robert Kim', role: 'Billing Specialist', patients: null, satisfaction: 92, revenue: null, icon: '👨‍💼' },
                { name: 'Amanda Lopez', role: 'Technician Lead', patients: 2100, satisfaction: 97, revenue: null, icon: '👩‍🔬' }
              ].map((staff, i) => (
                <div key={i} style={styles.metricCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '36px' }}>{staff.icon}</div>
                    <div>
                      <h3 style={{ fontWeight: '600', color: styles.pageTitle.color }}>{staff.name}</h3>
                      <p style={{ fontSize: '12px', color: '#888' }}>{staff.role}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {staff.patients && (
                      <div style={{ padding: '8px', background: 'rgba(99,102,241,0.1)', borderRadius: '6px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1' }}>{staff.patients}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>Patients/Year</div>
                      </div>
                    )}
                    <div style={{ padding: '8px', background: 'rgba(16,185,129,0.1)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>{staff.satisfaction}%</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Satisfaction</div>
                    </div>
                    {staff.revenue && (
                      <div style={{ padding: '8px', background: 'rgba(245,158,11,0.1)', borderRadius: '6px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>{staff.revenue}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>Revenue</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'forecasting' && (
          <>
            <h1 style={styles.pageTitle}>📈 Revenue Forecasting</h1>
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <div style={styles.cardTitle}>12-Month Revenue Projection</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '20px 0' }}>
                {[
                  { month: 'Apr', value: 285, projected: false },
                  { month: 'May', value: 312, projected: false },
                  { month: 'Jun', value: 298, projected: false },
                  { month: 'Jul', value: 345, projected: true },
                  { month: 'Aug', value: 358, projected: true },
                  { month: 'Sep', value: 372, projected: true },
                  { month: 'Oct', value: 385, projected: true },
                  { month: 'Nov', value: 368, projected: true },
                  { month: 'Dec', value: 342, projected: true },
                  { month: 'Jan', value: 395, projected: true },
                  { month: 'Feb', value: 412, projected: true },
                  { month: 'Mar', value: 428, projected: true }
                ].map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '100%',
                      height: `${m.value / 5}px`,
                      background: m.projected 
                        ? 'linear-gradient(180deg, rgba(99,102,241,0.3), rgba(99,102,241,0.6))' 
                        : 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                      borderRadius: '4px 4px 0 0',
                      border: m.projected ? '2px dashed #6366f1' : 'none'
                    }} />
                    <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{m.month}</div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: m.projected ? '#6366f1' : '#10b981' }}>${m.value}K</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.grid}>
              <div style={styles.metricCard}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>$4.2M</div>
                <div style={{ color: '#888', fontSize: '13px' }}>Projected Annual Revenue</div>
                <div style={{ color: '#10b981', fontSize: '12px', marginTop: '4px' }}>↑ 12% vs Last Year</div>
              </div>
              <div style={styles.metricCard}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>89%</div>
                <div style={{ color: '#888', fontSize: '13px' }}>Forecast Confidence</div>
                <div style={{ color: '#6366f1', fontSize: '12px', marginTop: '4px' }}>Based on 3yr history</div>
              </div>
              <div style={styles.metricCard}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>Q3</div>
                <div style={{ color: '#888', fontSize: '13px' }}>Peak Revenue Quarter</div>
                <div style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px' }}>Cataract season</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'quality' && (
          <>
            <h1 style={styles.pageTitle}>✅ Quality Metrics</h1>
            <div style={styles.grid}>
              {[
                { metric: 'Patient Safety Score', value: 98, benchmark: 95, icon: '🛡️', status: 'excellent' },
                { metric: 'Infection Rate', value: 0.02, benchmark: 0.05, icon: '🦠', unit: '%', status: 'excellent' },
                { metric: 'Readmission Rate', value: 1.8, benchmark: 2.5, icon: '🏥', unit: '%', status: 'good' },
                { metric: 'Documentation Accuracy', value: 96, benchmark: 95, icon: '📝', status: 'excellent' },
                { metric: 'MIPS Score', value: 92, benchmark: 85, icon: '🏆', status: 'excellent' },
                { metric: 'Patient Wait Time', value: 12, benchmark: 15, icon: '⏱️', unit: ' min', status: 'good' },
                { metric: 'Follow-up Compliance', value: 88, benchmark: 85, icon: '📅', status: 'good' },
                { metric: 'Surgical Success Rate', value: 99.2, benchmark: 98, icon: '✨', unit: '%', status: 'excellent' }
              ].map((item, i) => (
                <div key={i} style={{
                  ...styles.metricCard,
                  borderLeft: `4px solid ${item.status === 'excellent' ? '#10b981' : item.status === 'good' ? '#6366f1' : '#f59e0b'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                    <span style={{
                      ...styles.badge,
                      background: item.status === 'excellent' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)',
                      color: item.status === 'excellent' ? '#10b981' : '#6366f1'
                    }}>
                      {item.status === 'excellent' ? '★ Excellent' : '✓ Good'}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: '600', color: styles.pageTitle.color, marginBottom: '8px' }}>{item.metric}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                      {item.value}{item.unit || '%'}
                    </span>
                    <span style={{ color: '#888', fontSize: '12px' }}>
                      Benchmark: {item.benchmark}{item.unit || '%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'alerts' && (
          <>
            <h1 style={styles.pageTitle}>🔔 Alerts & Notifications</h1>
            <div style={{ ...styles.card, maxWidth: '800px' }}>
              {[
                { type: 'urgent', icon: '🚨', title: 'A/R Alert', message: '3 accounts over 120 days require immediate attention', time: '2 hours ago', amount: '$45,230' },
                { type: 'warning', icon: '⚠️', title: 'Claim Denial Spike', message: 'Denial rate increased 2.3% this week - review coding patterns', time: '5 hours ago' },
                { type: 'success', icon: '✅', title: 'Collection Goal Met', message: 'March collections exceeded target by 8%', time: '1 day ago', amount: '+$32,100' },
                { type: 'info', icon: 'ℹ️', title: 'Benchmark Update', message: 'Q1 2024 industry benchmarks now available', time: '2 days ago' },
                { type: 'warning', icon: '📊', title: 'Patient Volume Drop', message: 'New patient appointments down 15% vs last month', time: '3 days ago' },
                { type: 'success', icon: '🏆', title: 'Top Quartile Achievement', message: 'Your clean claim rate reached top 10% nationally', time: '1 week ago' }
              ].map((alert, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px',
                  borderBottom: '1px solid rgba(99,102,241,0.1)',
                  background: i === 0 ? 'rgba(239,68,68,0.05)' : 'transparent'
                }}>
                  <span style={{ fontSize: '24px' }}>{alert.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontWeight: '600', color: styles.pageTitle.color }}>{alert.title}</h3>
                      <span style={{ fontSize: '11px', color: '#888' }}>{alert.time}</span>
                    </div>
                    <p style={{ color: '#666', fontSize: '13px', margin: '4px 0' }}>{alert.message}</p>
                    {alert.amount && (
                      <span style={{
                        ...styles.badge,
                        background: alert.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                        color: alert.type === 'success' ? '#10b981' : '#ef4444'
                      }}>
                        {alert.amount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'export' && (
          <>
            <h1 style={styles.pageTitle}>📤 Data Export & Reports</h1>
            <div style={styles.grid}>
              {[
                { title: 'Executive Summary', icon: '📊', description: 'High-level KPIs and trends', format: 'PDF' },
                { title: 'Financial Report', icon: '💰', description: 'Revenue, collections, A/R aging', format: 'Excel' },
                { title: 'Quality Metrics', icon: '✅', description: 'MIPS scores and quality data', format: 'PDF' },
                { title: 'Competitor Analysis', icon: '🎯', description: 'Market positioning report', format: 'PDF' },
                { title: 'Staff Performance', icon: '👥', description: 'Provider productivity metrics', format: 'Excel' },
                { title: 'Raw Data Export', icon: '📁', description: 'All metrics in CSV format', format: 'CSV' }
              ].map((report, i) => (
                <div key={i} style={styles.metricCard}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{report.icon}</div>
                  <h3 style={{ fontWeight: '600', color: styles.pageTitle.color, marginBottom: '4px' }}>{report.title}</h3>
                  <p style={{ color: '#888', fontSize: '12px', marginBottom: '12px' }}>{report.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ ...styles.badge, background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}>{report.format}</span>
                    <button 
                      onClick={() => alert(`Exporting ${report.title}...`)}
                      style={{ ...styles.button, ...styles.primaryBtn, padding: '6px 12px', fontSize: '12px' }}
                    >
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...styles.card, marginTop: '24px' }}>
              <div style={styles.cardTitle}>📅 Scheduled Reports</div>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
                Set up automated report delivery to your inbox
              </p>
              <button style={{ ...styles.button, ...styles.primaryBtn }}>
                + Schedule New Report
              </button>
            </div>
          </>
        )}

        {activeTab === 'social' && (
          <>
            <h1 style={styles.pageTitle}>📱 Social Media Marketing</h1>
            <div style={styles.grid}>
              {SOCIAL_PLATFORMS.map(platform => (
                <div 
                  key={platform.id} 
                  style={{
                    ...styles.metricCard,
                    cursor: 'pointer',
                    border: selectedPlatform === platform.id ? `2px solid ${platform.color}` : '1px solid rgba(99,102,241,0.1)'
                  }}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{platform.icon}</div>
                  <h3 style={{ fontWeight: '600', color: platform.color }}>{platform.name}</h3>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#888', fontSize: '12px' }}>Avg CPC</span>
                      <span style={{ fontWeight: '600', color: styles.pageTitle.color }}>${platform.cpc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...styles.card, marginTop: '24px' }}>
              <div style={styles.cardTitle}>📊 Campaign Performance</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>2,847</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>New Leads (MTD)</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>4.2%</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>Conversion Rate</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>$12.50</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>Cost Per Lead</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(139,92,246,0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>$35,600</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>Ad Spend (MTD)</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h1 style={styles.pageTitle}>Practice Profile</h1>
            <div style={{...styles.card, maxWidth: '600px'}}>
              <div style={{fontSize: '48px', textAlign: 'center', marginBottom: '16px'}}>🏥</div>
              <h2 style={{fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '24px', color: styles.pageTitle.color}}>
                {practiceProfile?.name || 'Demo'}
              </h2>
              {practiceProfile && Object.entries(practiceProfile).filter(([k]) => k !== 'createdAt').map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '12px',
                  background: 'rgba(99,102,241,0.05)', borderRadius: '8px', marginBottom: '8px'
                }}>
                  <span style={{color: '#888', textTransform: 'capitalize'}}>{k}</span>
                  <span style={{fontWeight: '500', color: styles.pageTitle.color}}>
                    {Array.isArray(v) ? v.join(', ') : v}
                  </span>
                </div>
              ))}
              <button onClick={() => {setShowRegistration(true); setRegStep(0); setRegAnswers({});}} 
                style={{...styles.button, ...styles.secondaryBtn, width: '100%', marginTop: '16px'}}>
                Edit Profile
              </button>
              <button onClick={() => {
                localStorage.clear(); 
                setPracticeProfile(null); 
                setMetricValues({}); 
                setDemoMode(false);
                setShowRegistration(true); 
                setRegStep(0);
              }} style={{
                width: '100%', marginTop: '12px', padding: '12px', background: 'none',
                border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px'
              }}>
                Reset All
              </button>
            </div>
          </>
        )}

        {activeTab === 'upload' && (
          <>
            <h1 style={styles.pageTitle}>📁 Data Upload Center</h1>
            
            <div style={styles.grid}>
              <div style={{...styles.card, gridColumn: 'span 2'}}>
                <div style={styles.cardTitle}>📤 Upload Practice Data</div>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
                  Import your practice metrics from CSV, Excel, or connect directly to your EMR system.
                </p>
                
                <div style={{
                  border: '2px dashed #6366f1',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  background: 'rgba(99,102,241,0.05)',
                  cursor: 'pointer',
                  marginBottom: '24px'
                }} onClick={() => fileInputRef.current?.click()}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
                  <p style={{ fontWeight: '600', color: styles.pageTitle.color, marginBottom: '8px' }}>
                    Drag & drop files here or click to browse
                  </p>
                  <p style={{ color: '#888', fontSize: '12px' }}>
                    Supports CSV, XLSX, and JSON files up to 10MB
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleCSVImport}
                    accept=".csv,.xlsx,.json"
                    style={{ display: 'none' }}
                  />
                </div>

                {importedData && (
                  <div style={{
                    padding: '16px',
                    background: 'rgba(16,185,129,0.1)',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>✅</span>
                      <strong style={{ color: '#10b981' }}>File Uploaded Successfully</strong>
                    </div>
                    <p style={{ color: '#666', fontSize: '13px' }}>
                      {importedData.length} records imported and ready for analysis
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    style={{...styles.button, ...styles.primaryBtn, flex: 1}}
                  >
                    📤 Upload File
                  </button>
                  <button 
                    onClick={() => alert('EMR connection coming soon!')}
                    style={{...styles.button, ...styles.secondaryBtn, flex: 1}}
                  >
                    🔗 Connect EMR
                  </button>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>🔌 EMR Integrations</div>
                {[
                  { name: 'Modernizing Medicine', status: 'available', icon: '💊' },
                  { name: 'NextGen', status: 'available', icon: '🏥' },
                  { name: 'Epic', status: 'coming', icon: '📋' },
                  { name: 'Cerner', status: 'coming', icon: '🖥️' },
                  { name: 'athenahealth', status: 'available', icon: '☁️' }
                ].map((emr, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px', borderRadius: '8px', marginBottom: '8px',
                    background: 'rgba(99,102,241,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{emr.icon}</span>
                      <span style={{ fontWeight: '500', color: styles.pageTitle.color }}>{emr.name}</span>
                    </div>
                    <span style={{
                      ...styles.badge,
                      background: emr.status === 'available' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                      color: emr.status === 'available' ? '#10b981' : '#f59e0b'
                    }}>
                      {emr.status === 'available' ? '✓ Available' : 'Coming Soon'}
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>📊 Recent Uploads</div>
                {[
                  { name: 'March_Metrics.csv', date: 'Mar 15, 2026', records: 1247, status: 'processed' },
                  { name: 'Q1_Revenue.xlsx', date: 'Mar 10, 2026', records: 89, status: 'processed' },
                  { name: 'Patient_Data.csv', date: 'Mar 5, 2026', records: 3420, status: 'processed' }
                ].map((file, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px', borderRadius: '8px', marginBottom: '8px',
                    background: 'rgba(99,102,241,0.05)'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500', color: styles.pageTitle.color }}>{file.name}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{file.date} • {file.records} records</div>
                    </div>
                    <span style={{
                      ...styles.badge,
                      background: 'rgba(16,185,129,0.2)',
                      color: '#10b981'
                    }}>
                      ✓ Processed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{...styles.card, marginTop: '24px'}}>
              <div style={styles.cardTitle}>📋 Data Mapping</div>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
                Map your data columns to MedPact metrics for accurate benchmarking
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { source: 'Collection %', target: 'collection_rate' },
                  { source: 'Days in A/R', target: 'days_in_ar' },
                  { source: 'Denial %', target: 'denial_rate' },
                  { source: 'First Pass %', target: 'first_pass_rate' }
                ].map((mapping, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px', background: 'rgba(99,102,241,0.05)', borderRadius: '8px'
                  }}>
                    <span style={{ color: '#888', fontSize: '13px' }}>{mapping.source}</span>
                    <span style={{ color: '#6366f1' }}>→</span>
                    <span style={{ fontWeight: '500', color: '#6366f1', fontSize: '13px' }}>{mapping.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'consultant' && (
          <>
            <h1 style={styles.pageTitle}>🧑‍💼 Consultant Portal</h1>
            
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '36px'
                }}>
                  🧑‍💼
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: styles.pageTitle.color }}>
                    Your KCN Consultant
                  </h2>
                  <p style={{ color: '#888' }}>Dedicated practice optimization specialist</p>
                </div>
              </div>

              <div style={styles.grid}>
                <div style={styles.metricCard}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
                  <h3 style={{ fontWeight: '600', color: styles.pageTitle.color }}>Sarah Mitchell</h3>
                  <p style={{ color: '#888', fontSize: '12px' }}>Senior Practice Consultant</p>
                  <p style={{ color: '#6366f1', fontSize: '12px', marginTop: '8px' }}>15+ years ophthalmology experience</p>
                </div>
                <div style={styles.metricCard}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📞</div>
                  <h3 style={{ fontWeight: '600', color: styles.pageTitle.color }}>Contact</h3>
                  <p style={{ color: '#888', fontSize: '13px', marginTop: '8px' }}>sarah.mitchell@kcn.com</p>
                  <p style={{ color: '#888', fontSize: '13px' }}>(555) 123-4567</p>
                </div>
                <div style={styles.metricCard}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
                  <h3 style={{ fontWeight: '600', color: styles.pageTitle.color }}>Next Meeting</h3>
                  <p style={{ color: '#10b981', fontSize: '13px', marginTop: '8px', fontWeight: '600' }}>
                    April 2, 2026 at 2:00 PM
                  </p>
                  <p style={{ color: '#888', fontSize: '12px' }}>Quarterly Review</p>
                </div>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={{...styles.card, gridColumn: 'span 2'}}>
                <div style={styles.cardTitle}>📋 Action Items</div>
                {[
                  { task: 'Review denial patterns for CPT 66984', status: 'in-progress', priority: 'high', due: 'Mar 28' },
                  { task: 'Implement premium IOL conversion strategy', status: 'pending', priority: 'high', due: 'Apr 5' },
                  { task: 'Staff training on new billing codes', status: 'completed', priority: 'medium', due: 'Mar 20' },
                  { task: 'Optimize A/R follow-up workflow', status: 'in-progress', priority: 'medium', due: 'Apr 10' },
                  { task: 'Patient recall system audit', status: 'pending', priority: 'low', due: 'Apr 15' }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', borderRadius: '8px', marginBottom: '8px',
                    background: item.status === 'completed' ? 'rgba(16,185,129,0.05)' : 'rgba(99,102,241,0.05)',
                    borderLeft: `3px solid ${
                      item.status === 'completed' ? '#10b981' : 
                      item.priority === 'high' ? '#ef4444' : 
                      item.priority === 'medium' ? '#f59e0b' : '#6366f1'
                    }`
                  }}>
                    <input 
                      type="checkbox" 
                      checked={item.status === 'completed'}
                      readOnly
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '500', 
                        color: item.status === 'completed' ? '#888' : styles.pageTitle.color,
                        textDecoration: item.status === 'completed' ? 'line-through' : 'none'
                      }}>
                        {item.task}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Due: {item.due}</div>
                    </div>
                    <span style={{
                      ...styles.badge,
                      background: item.status === 'completed' ? 'rgba(16,185,129,0.2)' : 
                                 item.status === 'in-progress' ? 'rgba(99,102,241,0.2)' : 'rgba(245,158,11,0.2)',
                      color: item.status === 'completed' ? '#10b981' : 
                             item.status === 'in-progress' ? '#6366f1' : '#f59e0b'
                    }}>
                      {item.status === 'completed' ? '✓ Done' : 
                       item.status === 'in-progress' ? '⏳ In Progress' : '○ Pending'}
                    </span>
                  </div>
                ))}
                <button style={{...styles.button, ...styles.primaryBtn, marginTop: '12px'}}>
                  + Add Action Item
                </button>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>📊 Engagement Summary</div>
                <div style={{ marginBottom: '16px' }}>
                  {[
                    { label: 'Meetings This Quarter', value: '4', icon: '📅' },
                    { label: 'Action Items Completed', value: '12', icon: '✅' },
                    { label: 'Revenue Impact', value: '+$127K', icon: '💰' },
                    { label: 'Days to Next Review', value: '6', icon: '⏱️' }
                  ].map((stat, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px', background: 'rgba(99,102,241,0.05)', borderRadius: '8px', marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{stat.icon}</span>
                        <span style={{ color: '#888', fontSize: '13px' }}>{stat.label}</span>
                      </div>
                      <span style={{ fontWeight: '700', color: '#6366f1' }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                <button style={{...styles.button, ...styles.secondaryBtn, width: '100%'}}>
                  📅 Schedule Meeting
                </button>
              </div>
            </div>

            <div style={{...styles.card, marginTop: '24px'}}>
              <div style={styles.cardTitle}>💬 Recent Notes</div>
              {[
                { date: 'Mar 22, 2026', note: 'Discussed premium IOL strategy. Practice showing strong interest in expanding Symfony offering. Follow up on staff training needs.' },
                { date: 'Mar 15, 2026', note: 'Reviewed Q1 metrics. Collection rate improved 2.3%. Identified A/R aging as priority focus area for Q2.' },
                { date: 'Mar 8, 2026', note: 'Initial assessment complete. Key opportunities: denial reduction, premium IOL conversion, patient recall optimization.' }
              ].map((note, i) => (
                <div key={i} style={{
                  padding: '16px', background: 'rgba(99,102,241,0.05)', borderRadius: '8px', marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', marginBottom: '8px' }}>{note.date}</div>
                  <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{note.note}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer style={{textAlign: 'center', padding: '24px', color: '#666', fontSize: '12px'}}>
        <p>MedPact v3.2.0</p>
      </footer>
    </div>
  );
}

