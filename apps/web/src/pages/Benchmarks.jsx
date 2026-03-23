import React, { useState, useRef, useEffect } from 'react';

// Import data
import { METRIC_PACKAGES } from '../data/metrics';
import { CPT_CODES } from '../data/cptCodes';
import { INNOVATIONS } from '../data/innovations';
import { COMPETITOR_PRACTICES, PATIENT_HEATMAP_DATA } from '../data/competitors';
import { REGISTRATION_STEPS } from '../data/registration';

// Import styles and utils
import { styles } from '../styles/theme';
import { formatValue, getScoreColor, calculateScore, getProfitColor, getTypeIcon, getTypeColor, searchKCN, exportToCSV } from '../utils/helpers';

export default function Benchmarks() {
  // State Management
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
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: "Welcome to KCN Intelligence! Ask about metrics, CPT codes, competitors, innovations, or market analysis." }]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  const [cptFilter, setCptFilter] = useState('all');
  const [innovationFilter, setInnovationFilter] = useState('all');
  const [practiceTypeFilter, setPracticeTypeFilter] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showIntelModal, setShowIntelModal] = useState(false);
  const [importedData, setImportedData] = useState(null);
  const fileInputRef = useRef(null);

  // Effects
  useEffect(() => {
    if (practiceProfile) localStorage.setItem('medpact_profile', JSON.stringify(practiceProfile));
  }, [practiceProfile]);
  
  useEffect(() => {
    localStorage.setItem('medpact_metrics', JSON.stringify(metricValues));
  }, [metricValues]);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handlers
  const handleRegNext = () => {
    if (regStep < REGISTRATION_STEPS.length - 1) {
      setRegStep(regStep + 1);
    } else {
      const profile = { ...regAnswers, createdAt: new Date().toISOString() };
      setPracticeProfile(profile);
      setShowRegistration(false);
      const pkgMap = { 'Private Practice 9': 'practice_9', 'PE Practice 10': 'pe_10', 'KPI 25': 'kpi_25', 'Private ASC 25': 'asc_25', 'PE ASC 21': 'pe_asc_21', 'Price Transparency': 'price_transparency' };
      if (regAnswers.package && pkgMap[regAnswers.package]) setSelectedPackage(pkgMap[regAnswers.package]);
    }
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { role: 'user', content: chatInput }]);
    const response = searchKCN(chatInput);
    setChatInput('');
    setTimeout(() => setChatMessages(p => [...p, { role: 'assistant', content: response }]), 300);
  };

  const toggleCompare = (competitor) => {
    if (compareList.find(c => c.id === competitor.id)) {
      setCompareList(compareList.filter(c => c.id !== competitor.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, competitor]);
    }
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim());
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
      unit: m.unit,
      score: calculateScore(metricValues[m.key], m.benchmark) || ''
    }));
    exportToCSV(data, `medpact_${selectedPackage}_metrics.csv`);
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
    { id: 'csv', label: 'CSV Hub', icon: '📁' },
    { id: 'profile', label: 'Profile', icon: '👤' }
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
              <span style={styles.version}>v3.1</span>
            </div>
          </div>
        </header>
        <div style={{ ...styles.main, maxWidth: '600px' }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>Welcome to MedPact</h2>
              <p style={{ color: '#888', marginTop: '8px' }}>Practice Intelligence Platform</p>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${((regStep + 1) / REGISTRATION_STEPS.length) * 100}%` }} />
            </div>
            <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 24px' }}>Step {regStep + 1} of {REGISTRATION_STEPS.length}</p>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#fff' }}>{step.question}</h3>
            
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
                      const current = regAnswers[step.id] || [];
                      const updated = current.includes(o) ? current.filter(x => x !== o) : [...current, o];
                      setRegAnswers(p => ({ ...p, [step.id]: updated }));
                    }}
                    style={{
                      ...styles.multiSelectOption,
                      background: (regAnswers[step.id] || []).includes(o) ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99, 102, 241, 0.1)',
                      color: (regAnswers[step.id] || []).includes(o) ? 'white' : '#a0a0a0',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
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
              onClick={() => { setShowRegistration(false); setPracticeProfile({ name: 'Demo Practice', type: 'Demo' }); }} 
              style={{ width: '100%', marginTop: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              Skip (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>👁️</div>
            <span style={styles.logoText}>MedPact</span>
            <span style={styles.version}>v3.1</span>
          </div>
          <nav style={styles.nav}>
            {tabs.map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)} 
                style={{...styles.navBtn, ...(activeTab === t.id ? styles.navBtnActive : styles.navBtnInactive)}}
              >
                <span style={{marginRight:'6px'}}>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Intel Modal */}
      {showIntelModal && selectedCompetitor && (
        <div 
          style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}} 
          onClick={() => setShowIntelModal(false)}
        >
          <div style={{...styles.card,maxWidth:'800px',maxHeight:'90vh',overflow:'auto',width:'100%'}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h2 style={{fontSize:'24px',fontWeight:'700'}}>
                <span style={{marginRight:'12px'}}>{getTypeIcon(selectedCompetitor.type)}</span>
                {selectedCompetitor.name}
              </h2>
              <button onClick={() => setShowIntelModal(false)} style={{background:'none',border:'none',color:'#888',fontSize:'24px',cursor:'pointer'}}>×</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
              <div style={styles.metricCard}>
                <h4 style={{color:'#6366f1',marginBottom:'12px'}}>👨‍⚕️ Provider Training</h4>
                {selectedCompetitor.intel?.providers?.map((p, i) => (
                  <div key={i} style={{padding:'8px 0',borderBottom:'1px solid rgba(99,102,241,0.1)'}}>{p}</div>
                ))}
              </div>
              <div style={styles.metricCard}>
                <h4 style={{color:'#10b981',marginBottom:'12px'}}>🔧 Equipment & Technology</h4>
                {selectedCompetitor.intel?.equipment?.map((e, i) => (
                  <div key={i} style={{padding:'8px 0',borderBottom:'1px solid rgba(99,102,241,0.1)'}}>{e}</div>
                ))}
              </div>
              <div style={styles.metricCard}>
                <h4 style={{color:'#f59e0b',marginBottom:'12px'}}>🩺 Services Offered</h4>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {selectedCompetitor.intel?.services?.map((s, i) => (
                    <span key={i} style={{...styles.badge,background:'rgba(245,158,11,0.2)',color:'#f59e0b'}}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={styles.metricCard}>
                <h4 style={{color:'#ec4899',marginBottom:'12px'}}>📋 Practice Details</h4>
                <div style={{display:'grid',gap:'8px'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'#888'}}>Staff Size:</span>
                    <span>{selectedCompetitor.intel?.staff}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'#888'}}>Languages:</span>
                    <span>{selectedCompetitor.intel?.languages?.join(', ')}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'#888'}}>Telehealth:</span>
                    <span>{selectedCompetitor.intel?.telehealth ? '✅ Yes' : '❌ No'}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'#888'}}>Avg Wait Time:</span>
                    <span>{selectedCompetitor.intel?.avgWaitTime}</span>
                  </div>
                </div>
              </div>
            </div>
            <button style={{...styles.button,...styles.primaryBtn,width:'100%',marginTop:'24px'}}>🔄 Rescan Website for Latest Data</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={styles.main}>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <h1 style={styles.pageTitle}>Practice Intelligence Dashboard</h1>
            <p style={styles.pageSubtitle}>{practiceProfile?.name || 'Demo'} • {METRIC_PACKAGES[selectedPackage]?.name}</p>
            
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>📦 Select Metric Package</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {Object.entries(METRIC_PACKAGES).map(([k, v]) => (
                  <button 
                    key={k} 
                    onClick={() => setSelectedPackage(k)} 
                    style={{
                      ...styles.button, 
                      ...(selectedPackage === k ? styles.primaryBtn : styles.secondaryBtn), 
                      borderLeft: `3px solid ${v.color}`
                    }}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={styles.grid}>
              {METRIC_PACKAGES[selectedPackage]?.metrics?.map(m => {
                const val = metricValues[m.key];
                const score = calculateScore(val, m.benchmark);
                return (
                  <div key={m.key} style={styles.metricCard}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                      <div>
                        <span style={{fontSize:'20px',marginRight:'8px'}}>{m.icon}</span>
                        <span style={{fontWeight:'600'}}>{m.title}</span>
                      </div>
                      {score && (
                        <span style={{...styles.badge, background:`${getScoreColor(score)}22`, color:getScoreColor(score)}}>
                          {score}%
                        </span>
                      )}
                    </div>
                    <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                      <input 
                        type="number" 
                        placeholder="Value" 
                        value={val || ''} 
                        onChange={e => setMetricValues(p => ({...p, [m.key]: parseFloat(e.target.value) || ''}))} 
                        style={{...styles.input, flex:1}} 
                      />
                      <div style={{textAlign:'right',minWidth:'80px'}}>
                        <div style={{fontSize:'12px',color:'#888'}}>Benchmark</div>
                        <div style={{fontWeight:'600',color:'#6366f1'}}>{formatValue(m.benchmark, m.unit)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <>
            <h1 style={styles.pageTitle}>Competitive Intelligence</h1>
            <p style={styles.pageSubtitle}>Monitor and analyze competitor practices</p>
            
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>🔍 Filter by Practice Type</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {[
                  { key: 'all', label: 'All Practices', icon: '📍' },
                  { key: 'ophthalmology', label: 'Ophthalmology', icon: '🔬' },
                  { key: 'optometry', label: 'Optometry', icon: '👓' },
                  { key: 'general', label: 'General Eye Care', icon: '🏥' }
                ].map(f => (
                  <button 
                    key={f.key} 
                    onClick={() => setPracticeTypeFilter(f.key)} 
                    style={{
                      ...styles.filterBtn, 
                      background: practiceTypeFilter === f.key ? getTypeColor(f.key) : 'rgba(99,102,241,0.1)', 
                      color: practiceTypeFilter === f.key ? 'white' : '#a0a0a0'
                    }}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            {compareList.length > 0 && (
              <div style={{...styles.card, marginBottom: '24px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                  <div style={styles.cardTitle}>📊 Side-by-Side Comparison ({compareList.length}/4)</div>
                  <button onClick={() => setCompareList([])} style={{...styles.button,...styles.secondaryBtn,padding:'6px 12px',fontSize:'12px'}}>Clear All</button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(compareList.length + 1, 5)}, 1fr)`,gap:'16px'}}>
                  <div style={{...styles.metricCard,background:'rgba(99,102,241,0.1)'}}>
                    <h4 style={{fontWeight:'600',marginBottom:'12px',color:'#6366f1'}}>📍 Your Practice</h4>
                    <div style={{marginBottom:'8px'}}>
                      <span style={{color:'#888',fontSize:'12px'}}>Google</span>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <div style={styles.ratingBar}><div style={{...styles.progressFill,width:'92%'}}/></div>
                        <span style={{fontWeight:'600'}}>4.6</span>
                      </div>
                    </div>
                    <div style={{marginBottom:'8px'}}>
                      <span style={{color:'#888',fontSize:'12px'}}>Yelp</span>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <div style={styles.ratingBar}><div style={{...styles.progressFill,width:'86%'}}/></div>
                        <span style={{fontWeight:'600'}}>4.3</span>
                      </div>
                    </div>
                    <div>
                      <span style={{color:'#888',fontSize:'12px'}}>Healthgrades</span>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <div style={styles.ratingBar}><div style={{...styles.progressFill,width:'94%'}}/></div>
                        <span style={{fontWeight:'600'}}>4.7</span>
                      </div>
                    </div>
                  </div>
                  {compareList.map(comp => (
                    <div key={comp.id} style={styles.metricCard}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                        <h4 style={{fontWeight:'600',fontSize:'14px'}}>{comp.name}</h4>
                        <button onClick={() => toggleCompare(comp)} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'16px'}}>×</button>
                      </div>
                      <div style={{marginBottom:'8px'}}>
                        <span style={{color:'#888',fontSize:'12px'}}>Google</span>
                        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <div style={styles.ratingBar}>
                            <div style={{...styles.progressFill,width:`${comp.ratings.google*20}%`,background: comp.ratings.google > 4.6 ? '#10b981' : '#6366f1'}}/>
                          </div>
                          <span style={{fontWeight:'600'}}>{comp.ratings.google}</span>
                        </div>
                      </div>
                      <div style={{marginBottom:'8px'}}>
                        <span style={{color:'#888',fontSize:'12px'}}>Yelp</span>
                        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <div style={styles.ratingBar}>
                            <div style={{...styles.progressFill,width:`${comp.ratings.yelp*20}%`,background: comp.ratings.yelp > 4.3 ? '#10b981' : '#6366f1'}}/>
                          </div>
                          <span style={{fontWeight:'600'}}>{comp.ratings.yelp}</span>
                        </div>
                      </div>
                      <div>
                        <span style={{color:'#888',fontSize:'12px'}}>Healthgrades</span>
                        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <div style={styles.ratingBar}>
                            <div style={{...styles.progressFill,width:`${comp.ratings.healthgrades*20}%`,background: comp.ratings.healthgrades > 4.7 ? '#10b981' : '#6366f1'}}/>
                          </div>
                          <span style={{fontWeight:'600'}}>{comp.ratings.healthgrades}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.grid}>
              {filteredCompetitors.map(comp => (
                <div key={comp.id} style={styles.competitorCard}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                    <div>
                      <span style={{...styles.badge, background:`${getTypeColor(comp.type)}22`, color: getTypeColor(comp.type), marginBottom:'8px', display:'inline-block'}}>
                        {getTypeIcon(comp.type)} {comp.type}
                      </span>
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
                    <button 
                      onClick={() => toggleCompare(comp)} 
                      style={{
                        ...styles.button, 
                        ...(compareList.find(c => c.id === comp.id) ? {background:'#ef4444',color:'white'} : styles.secondaryBtn), 
                        flex:1, padding:'10px', fontSize:'13px'
                      }}
                    >
                      {compareList.find(c => c.id === comp.id) ? '✓ Comparing' : '+ Compare'}
                    </button>
                    <button 
                      onClick={() => {setSelectedCompetitor(comp); setShowIntelModal(true);}} 
                      style={{...styles.button,...styles.primaryBtn,flex:1,padding:'10px',fontSize:'13px'}}
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
        {activeTab === 'heatmap' && (
          <>
            <h1 style={styles.pageTitle}>Patient Location Heat Map</h1>
            <p style={styles.pageSubtitle}>Identify high-profit patient areas by ZIP code</p>
            
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>📊 Profit Index Legend</div>
              <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#10b981'}}/>
                  <span style={{fontSize:'13px'}}>High (90-100)</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#3b82f6'}}/>
                  <span style={{fontSize:'13px'}}>Good (80-89)</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#f59e0b'}}/>
                  <span style={{fontSize:'13px'}}>Medium (70-79)</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'16px',height:'16px',borderRadius:'4px',background:'#ef4444'}}/>
                  <span style={{fontSize:'13px'}}>Low (&lt;70)</span>
                </div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'24px'}}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>🗺️ ZIP Code Profit Map</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'8px'}}>
                  {PATIENT_HEATMAP_DATA.sort((a,b) => b.profitIndex - a.profitIndex).map(zip => (
                    <div 
                      key={zip.zip} 
                      style={{
                        ...styles.heatmapCell, 
                        background: `${getProfitColor(zip.profitIndex)}22`, 
                        border: `1px solid ${getProfitColor(zip.profitIndex)}`
                      }}
                    >
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
                    {PATIENT_HEATMAP_DATA.sort((a,b) => b.profitIndex - a.profitIndex).slice(0, 10).map(zip => (
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
          </>
        )}

        {/* CPT Codes Tab */}
        {activeTab === 'cpt' && (
          <>
            <h1 style={styles.pageTitle}>Price Transparency</h1>
            <p style={styles.pageSubtitle}>2025 Medicare Rates</p>
            
            <div style={{...styles.card, marginBottom:'24px'}}>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {['all', ...new Set(CPT_CODES.map(c => c.category))].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCptFilter(c)} 
                    style={{
                      ...styles.button, 
                      ...(cptFilter === c ? styles.primaryBtn : styles.secondaryBtn), 
                      padding:'8px 16px', 
                      fontSize:'13px'
                    }}
                  >
                    {c === 'all' ? 'All' : c}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>CPT</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Medicare</th>
                    <th style={styles.th}>wRVU</th>
                  </tr>
                </thead>
                <tbody>
                  {(cptFilter === 'all' ? CPT_CODES : CPT_CODES.filter(c => c.category === cptFilter)).map(c => (
                    <tr key={c.code}>
                      <td style={{...styles.td,fontFamily:'monospace',fontWeight:'600',color:'#6366f1'}}>{c.code}</td>
                      <td style={styles.td}>{c.description}</td>
                      <td style={styles.td}>
                        <span style={{...styles.badge,background:'rgba(99,102,241,0.2)',color:'#a0a0ff'}}>{c.category}</span>
                      </td>
                      <td style={{...styles.td,fontWeight:'600',color:'#10b981'}}>${c.medicareRate.toFixed(2)}</td>
                      <td style={styles.td}>{c.wRVU}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Innovations Tab */}
        {activeTab === 'innovations' && (
          <>
            <h1 style={styles.pageTitle}>OnPacePlus Innovation Tracker</h1>
            <p style={styles.pageSubtitle}>Emerging technologies</p>
            
            <div style={{...styles.card, marginBottom:'24px'}}>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {['all', ...new Set(INNOVATIONS.map(i => i.category))].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setInnovationFilter(c)} 
                    style={{
                      ...styles.button, 
                      ...(innovationFilter === c ? styles.primaryBtn : styles.secondaryBtn), 
                      padding:'8px 16px', 
                      fontSize:'13px'
                    }}
                  >
                    {c === 'all' ? 'All' : c}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={styles.grid}>
              {(innovationFilter === 'all' ? INNOVATIONS : INNOVATIONS.filter(i => i.category === innovationFilter)).map(i => (
                <div key={i.id} style={styles.card}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                    <span style={{...styles.badge,background:'rgba(16,185,129,0.2)',color:'#10b981'}}>{i.status}</span>
                    <span style={{color:'#888',fontSize:'12px'}}>{i.year}</span>
                  </div>
                  <h3 style={{fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>{i.name}</h3>
                  <p style={{fontSize:'13px',color:'#888',marginBottom:'16px'}}>{i.manufacturer}</p>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>
                      <div style={{fontSize:'11px',color:'#888'}}>Adoption</div>
                      <div style={{fontWeight:'600',color:'#6366f1'}}>{i.adoptionRate}%</div>
                    </div>
                    <div>
                      <div style={{fontSize:'11px',color:'#888'}}>Impact</div>
                      <div style={{fontWeight:'600',color:'#10b981'}}>{i.clinicalImpact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <h1 style={styles.pageTitle}>KCN Intelligence Chat</h1>
            <p style={styles.pageSubtitle}>Ask about metrics, CPT codes, competitors, innovations</p>
            
            <div style={{...styles.card, maxWidth:'800px'}}>
              <div style={styles.chatContainer}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{...styles.chatMessage, ...(m.role === 'user' ? styles.userMessage : styles.botMessage)}}>
                    {m.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div style={{display:'flex',gap:'12px'}}>
                <input 
                  type="text" 
                  style={{...styles.input, flex:1}} 
                  placeholder="Ask about metrics, competitors, heat map..." 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && handleChat()} 
                />
                <button onClick={handleChat} style={{...styles.button,...styles.primaryBtn}}>Send</button>
              </div>
            </div>
          </>
        )}

        {/* CSV Hub Tab */}
        {activeTab === 'csv' && (
          <>
            <h1 style={styles.pageTitle}>CSV Data Hub</h1>
            <p style={styles.pageSubtitle}>Import and export practice data</p>
            
            <div style={{...styles.card, marginBottom: '24px'}}>
              <div style={styles.cardTitle}>📥 Import CSV Data</div>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleCSVImport} 
                ref={fileInputRef} 
                style={{display:'none'}} 
              />
              <button 
                onClick={() => fileInputRef.current.click()} 
                style={{...styles.button, flex: 1, padding:'12px 24px'}}
              >
                📂 Upload CSV File
              </button>
              {importedData && (
                <div style={{marginTop:'16px'}}>
                  <div style={{color:'#10b981',fontWeight:'600',marginBottom:'8px'}}>Imported Data:</div>
                  <pre style={{background:'rgba(255,255,255,0.1)',padding:'12px',borderRadius:'8px',fontSize:'13px',overflowX:'auto'}}>
                    {JSON.stringify(importedData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div style={styles.card}>
              <div style={styles.cardTitle}>📤 Export Metrics to CSV</div>
              <button onClick={exportMetrics} style={{...styles.button, flex: 1, padding:'12px 24px'}}>
                Download Metrics CSV
              </button>
            </div>
          </>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            <h1 style={styles.pageTitle}>Practice Profile</h1>
            <p style={styles.pageSubtitle}>Your settings</p>
            
            <div style={{...styles.card, maxWidth:'600px'}}>
              <div style={{fontSize:'48px',textAlign:'center',marginBottom:'16px'}}>🏥</div>
              <h2 style={{fontSize:'24px',fontWeight:'700',textAlign:'center',marginBottom:'24px'}}>{practiceProfile?.name || 'Demo'}</h2>
              
              {practiceProfile && Object.entries(practiceProfile).filter(([k]) => k !== 'createdAt').map(([k, v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'rgba(20,20,40,0.5)',borderRadius:'8px',marginBottom:'8px'}}>
                  <span style={{color:'#888',textTransform:'capitalize'}}>{k}</span>
                  <span style={{fontWeight:'500'}}>{Array.isArray(v) ? v.join(', ') : v}</span>
                </div>
              ))}
              
              <button 
                onClick={() => {setShowRegistration(true); setRegStep(0); setRegAnswers({});}} 
                style={{...styles.button,...styles.secondaryBtn,width:'100%',marginTop:'16px'}}
              >
                Edit Profile
              </button>
              
              <button 
                onClick={() => {localStorage.clear(); setPracticeProfile(null); setMetricValues({}); setShowRegistration(true); setRegStep(0);}} 
                style={{width:'100%',marginTop:'12px',background:'none',border:'none',color:'#ef4444',cursor:'pointer'}}
              >
                Reset All
              </button>
            </div>
          </>
        )}
      </main>

      <footer style={{textAlign:'center',padding:'24px',color:'#666',fontSize:'12px',borderTop:'1px solid rgba(99,102,241,0.1)'}}>
        <p>MedPact Practice Intelligence v3.1.0</p>
      </footer>
    </div>
  );
}