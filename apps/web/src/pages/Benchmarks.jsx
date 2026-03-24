import React, { useState, useRef, useEffect } from 'react';
import { METRIC_PACKAGES } from '../data/metrics';
import { CPT_CODES } from '../data/cptCodes';
import { INNOVATIONS } from '../data/innovations';
import { COMPETITOR_PRACTICES, PATIENT_HEATMAP_DATA } from '../data/competitors';
import { REGISTRATION_STEPS } from '../data/registration';
import { styles } from '../styles/theme';
import { formatValue, getScoreColor, calculateScore, getProfitColor, getTypeIcon, getTypeColor, searchKCN, exportToCSV } from '../utils/helpers';

const AI_INSIGHTS = {
  revenueOptimization: [
    { id: 1, title: 'Premium IOL Conversion', impact: '$145K/year', description: 'Your premium IOL rate is 22% vs benchmark 35%.' },
    { id: 2, title: 'Reduce A/R Over 90 Days', impact: '$89K recovery', description: 'Your A/R >90 days is 18% vs benchmark 12%.' },
  ],
  topQuartile: [
    { metric: 'Patient Satisfaction', value: '94%', icon: '😊' },
    { metric: 'First Pass Rate', value: '96%', icon: '✅' },
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
    try { const s = localStorage.getItem('medpact_profile'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [regStep, setRegStep] = useState(0);
  const [regAnswers, setRegAnswers] = useState({});
  const [showRegistration, setShowRegistration] = useState(!practiceProfile);
  const [selectedPackage, setSelectedPackage] = useState('practice_9');
  const [metricValues, setMetricValues] = useState(() => {
    try { const s = localStorage.getItem('medpact_metrics'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: 'Welcome to KCN Intelligence!' }]);
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
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  useEffect(() => { if (practiceProfile) localStorage.setItem('medpact_profile', JSON.stringify(practiceProfile)); }, [practiceProfile]);
  useEffect(() => { localStorage.setItem('medpact_metrics', JSON.stringify(metricValues)); }, [metricValues]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleRegNext = () => {
    if (regStep < REGISTRATION_STEPS.length - 1) setRegStep(regStep + 1);
    else { setPracticeProfile({ ...regAnswers, createdAt: new Date().toISOString() }); setShowRegistration(false); }
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { role: 'user', content: chatInput }]);
    const response = searchKCN(chatInput);
    setChatInput('');
    setTimeout(() => setChatMessages(p => [...p, { role: 'assistant', content: response }]), 300);
  };

  const toggleCompare = (comp) => {
    if (compareList.find(c => c.id === comp.id)) setCompareList(compareList.filter(c => c.id !== comp.id));
    else if (compareList.length < 4) setCompareList([...compareList, comp]);
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
    const data = pkg.metrics.map(m => ({ metric: m.title, value: metricValues[m.key] || '', benchmark: m.benchmark, unit: m.unit }));
    exportToCSV(data, 'medpact_metrics.csv');
  };

  const filteredCompetitors = practiceTypeFilter === 'all' ? COMPETITOR_PRACTICES : COMPETITOR_PRACTICES.filter(c => c.type === practiceTypeFilter);
  const compareGridCols = 'repeat(' + (compareList.length + 1) + ', 1fr)';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'ai', label: 'AI Insights', icon: '🤖' },
    { id: 'campaigns', label: 'Campaigns', icon: '📣' },
    { id: 'competitors', label: 'Competitors', icon: '🎯' },
    { id: 'heatmap', label: 'Heat Map', icon: '🗺️' },
    { id: 'cpt', label: 'CPT Codes', icon: '💰' },
    { id: 'innovations', label: 'OnPacePlus', icon: '🚀' },
    { id: 'chat', label: 'KCN Chat', icon: '💬' },
    { id: 'csv', label: 'CSV Hub', icon: '📁' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  if (showRegistration) {
    const step = REGISTRATION_STEPS[regStep];
    return (
      <div style={styles.container}>
        <header style={styles.header}><div style={styles.headerContent}><div style={styles.logo}><div style={styles.logoIcon}>👁️</div><span style={styles.logoText}>MedPact</span><span style={styles.version}>v3.2</span></div></div></header>
        <div style={{ ...styles.main, maxWidth: '600px' }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</div><h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>Welcome to MedPact</h2></div>
            <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: ((regStep + 1) / REGISTRATION_STEPS.length * 100) + '%' }} /></div>
            <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 24px' }}>Step {regStep + 1} of {REGISTRATION_STEPS.length}</p>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#fff' }}>{step.question}</h3>
            {step.type === 'text' && <input type="text" style={styles.input} placeholder={step.placeholder} value={regAnswers[step.id] || ''} onChange={e => setRegAnswers(p => ({ ...p, [step.id]: e.target.value }))} />}
            {step.type === 'number' && <input type="number" style={styles.input} placeholder={step.placeholder} value={regAnswers[step.id] || ''} onChange={e => setRegAnswers(p => ({ ...p, [step.id]: e.target.value }))} />}
            {step.type === 'select' && <select style={styles.select} value={regAnswers[step.id] || ''} onChange={e => setRegAnswers(p => ({ ...p, [step.id]: e.target.value }))}><option value="">Select...</option>{step.options.map(o => <option key={o} value={o}>{o}</option>)}</select>}
            {step.type === 'multiselect' && <div style={styles.multiSelect}>{step.options.map(o => <div key={o} onClick={() => { const curr = regAnswers[step.id] || []; setRegAnswers(p => ({ ...p, [step.id]: curr.includes(o) ? curr.filter(x => x !== o) : [...curr, o] })); }} style={{ ...styles.multiSelectOption, background: (regAnswers[step.id] || []).includes(o) ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.1)', color: (regAnswers[step.id] || []).includes(o) ? 'white' : '#a0a0a0' }}>{o}</div>)}</div>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {regStep > 0 && <button onClick={() => setRegStep(regStep - 1)} style={{...styles.button, ...styles.secondaryBtn, flex: 1}}>Back</button>}
              <button onClick={handleRegNext} style={{...styles.button, ...styles.primaryBtn, flex: 1}}>{regStep === REGISTRATION_STEPS.length - 1 ? 'Complete' : 'Continue'}</button>
            </div>
            <button onClick={() => { setShowRegistration(false); setPracticeProfile({ name: 'Demo Practice' }); }} style={{ width: '100%', marginTop: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Skip (Demo)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}><div style={styles.headerContent}><div style={styles.logo}><div style={styles.logoIcon}>👁️</div><span style={styles.logoText}>MedPact</span><span style={styles.version}>v3.2</span></div><nav style={styles.nav}>{tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} style={{...styles.navBtn, ...(activeTab === t.id ? styles.navBtnActive : styles.navBtnInactive)}}><span style={{marginRight:'6px'}}>{t.icon}</span>{t.label}</button>)}</nav></div></header>

      {showIntelModal && selectedCompetitor && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={() => setShowIntelModal(false)}>
          <div style={{...styles.card,maxWidth:'600px',width:'100%'}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'24px'}}><h2 style={{fontSize:'24px',fontWeight:'700'}}>{selectedCompetitor.name}</h2><button onClick={() => setShowIntelModal(false)} style={{background:'none',border:'none',color:'#888',fontSize:'24px',cursor:'pointer'}}>×</button></div>
            <div style={styles.metricCard}><h4 style={{color:'#6366f1',marginBottom:'12px'}}>👨‍⚕️ Providers</h4>{selectedCompetitor.intel?.providers?.map((p, i) => <div key={i} style={{padding:'8px 0'}}>{p}</div>)}</div>
          </div>
        </div>
      )}

      <main style={styles.main}>
        {activeTab === 'dashboard' && (
          <>
            <h1 style={styles.pageTitle}>Practice Intelligence Dashboard</h1>
            <p style={styles.pageSubtitle}>{practiceProfile?.name || 'Demo'} • {METRIC_PACKAGES[selectedPackage]?.name}</p>
            <div style={{...styles.card, marginBottom: '24px'}}><div style={styles.cardTitle}>📦 Select Metric Package</div><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{Object.entries(METRIC_PACKAGES).map(([k, v]) => <button key={k} onClick={() => setSelectedPackage(k)} style={{...styles.button, ...(selectedPackage === k ? styles.primaryBtn : styles.secondaryBtn)}}>{v.name}</button>)}</div></div>
            <div style={styles.grid}>{METRIC_PACKAGES[selectedPackage]?.metrics?.map(m => {
              const val = metricValues[m.key];
              const score = calculateScore(val, m.benchmark);
              return (<div key={m.key} style={styles.metricCard}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><div><span style={{fontSize:'20px',marginRight:'8px'}}>{m.icon}</span><span style={{fontWeight:'600'}}>{m.title}</span></div>{score && <span style={{...styles.badge, background: getScoreColor(score) + '22', color:getScoreColor(score)}}>{score}%</span>}</div><div style={{display:'flex',gap:'12px',alignItems:'center'}}><input type="number" placeholder="Value" value={val || ''} onChange={e => setMetricValues(p => ({...p, [m.key]: parseFloat(e.target.value) || ''}))} style={{...styles.input, flex:1}} /><div style={{textAlign:'right',minWidth:'80px'}}><div style={{fontSize:'12px',color:'#888'}}>Benchmark</div><div style={{fontWeight:'600',color:'#6366f1'}}>{formatValue(m.benchmark, m.unit)}</div></div></div></div>);
            })}</div>
          </>
        )}

        {activeTab === 'ai' && (
          <>
            <h1 style={styles.pageTitle}>🤖 AI-Powered Insights</h1>
            <div style={{...styles.card, marginBottom: '24px'}}><div style={styles.cardTitle}>🏆 Top Quartile</div><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'16px'}}>{AI_INSIGHTS.topQuartile.map((item, i) => (<div key={i} style={{textAlign:'center',padding:'20px',background:'rgba(16,185,129,0.1)',borderRadius:'12px'}}><div style={{fontSize:'32px',marginBottom:'8px'}}>{item.icon}</div><div style={{fontSize:'24px',fontWeight:'700',color:'#10b981'}}>{item.value}</div><div style={{fontSize:'13px',color:'#fff'}}>{item.metric}</div></div>))}</div></div>
            <div style={styles.card}><div style={styles.cardTitle}>💰 Revenue Opportunities</div>{AI_INSIGHTS.revenueOptimization.map(item => (<div key={item.id} style={{...styles.metricCard,marginBottom:'12px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}><h4 style={{fontWeight:'600'}}>{item.title}</h4><span style={{...styles.badge,background:'rgba(16,185,129,0.2)',color:'#10b981'}}>{item.impact}</span></div><p style={{fontSize:'12px',color:'#888'}}>{item.description}</p></div>))}</div>
          </>
        )}

        {activeTab === 'campaigns' && (
          <>
            <h1 style={styles.pageTitle}>📣 Campaign Builder</h1>
            <div style={styles.card}><div style={styles.cardTitle}>Select Platform</div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>{SOCIAL_PLATFORMS.map(p => (<div key={p.id} onClick={() => setSelectedPlatform(p.id)} style={{padding:'24px',borderRadius:'12px',textAlign:'center',cursor:'pointer',background: selectedPlatform === p.id ? p.color + '22' : 'rgba(99,102,241,0.1)',border: '2px solid ' + (selectedPlatform === p.id ? p.color : 'transparent')}}><div style={{fontSize:'40px',marginBottom:'12px'}}>{p.icon}</div><div style={{fontWeight:'600'}}>{p.name}</div><div style={{fontSize:'12px',color:'#888'}}>CPC: ${p.cpc}</div></div>))}</div></div>
          </>
        )}

        {activeTab === 'competitors' && (
          <>
            <h1 style={styles.pageTitle}>Competitive Intelligence</h1>
            <div style={{...styles.card, marginBottom: '24px'}}><div style={styles.cardTitle}>🔍 Filter</div><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{['all', 'ophthalmology', 'optometry', 'general'].map(f => <button key={f} onClick={() => setPracticeTypeFilter(f)} style={{...styles.button, ...(practiceTypeFilter === f ? styles.primaryBtn : styles.secondaryBtn)}}>{f}</button>)}</div></div>
            {compareList.length > 0 && (<div style={{...styles.card, marginBottom: '24px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}><div style={styles.cardTitle}>📊 Comparison ({compareList.length}/4)</div><button onClick={() => setCompareList([])} style={{...styles.button,...styles.secondaryBtn}}>Clear</button></div><div style={{display:'grid',gridTemplateColumns:compareGridCols,gap:'16px'}}><div style={{...styles.metricCard,background:'rgba(99,102,241,0.1)'}}><h4 style={{fontWeight:'600',marginBottom:'12px',color:'#6366f1'}}>📍 Your Practice</h4><div><span style={{color:'#888',fontSize:'12px'}}>Google</span><div style={{fontWeight:'600',color:'#f59e0b'}}>4.6</div></div></div>{compareList.map(comp => (<div key={comp.id} style={styles.metricCard}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><h4 style={{fontWeight:'600',fontSize:'14px'}}>{comp.name}</h4><button onClick={() => toggleCompare(comp)} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer'}}>×</button></div><div><span style={{color:'#888',fontSize:'12px'}}>Google</span><div style={{fontWeight:'600',color:'#f59e0b'}}>{comp.ratings.google}</div></div></div>))}</div></div>)}
            <div style={styles.grid}>{filteredCompetitors.map(comp => (<div key={comp.id} style={styles.competitorCard}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}><div><span style={{...styles.badge, background:'rgba(99,102,241,0.2)', color:'#a0a0ff', marginBottom:'8px', display:'inline-block'}}>{comp.type}</span><h3 style={{fontSize:'18px',fontWeight:'600'}}>{comp.name}</h3><p style={{color:'#888',fontSize:'12px'}}>{comp.address}</p></div><div style={{textAlign:'right'}}><div style={{fontSize:'24px',fontWeight:'700',color:'#f59e0b'}}>{comp.ratings.google}⭐</div><div style={{color:'#888',fontSize:'11px'}}>{comp.reviewCount} reviews</div></div></div><div style={{display:'flex',gap:'8px'}}><button onClick={() => toggleCompare(comp)} style={{...styles.button, ...(compareList.find(c => c.id === comp.id) ? {background:'#ef4444',color:'white'} : styles.secondaryBtn), flex:1}}>{compareList.find(c => c.id === comp.id) ? '✓ Comparing' : '+ Compare'}</button><button onClick={() => {setSelectedCompetitor(comp); setShowIntelModal(true);}} style={{...styles.button,...styles.primaryBtn,flex:1}}>🔍 Intel</button></div></div>))}</div>
          </>
        )}

        {activeTab === 'heatmap' && (
          <>
            <h1 style={styles.pageTitle}>Patient Location Heat Map</h1>
            <div style={styles.card}><div style={styles.cardTitle}>🗺️ ZIP Code Profit Map</div><div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'8px'}}>{PATIENT_HEATMAP_DATA.sort((a,b) => b.profitIndex - a.profitIndex).map(zip => (<div key={zip.zip} style={{...styles.heatmapCell, background: getProfitColor(zip.profitIndex) + '22', border: '1px solid ' + getProfitColor(zip.profitIndex)}}><div style={{fontWeight:'700',color:getProfitColor(zip.profitIndex),fontSize:'16px'}}>{zip.zip}</div><div style={{fontSize:'11px',color:'#888'}}>{zip.name}</div><div style={{display:'flex',justifyContent:'space-between',marginTop:'8px',fontSize:'11px'}}><span>👥 {zip.patients}</span><span style={{fontWeight:'600',color:getProfitColor(zip.profitIndex)}}>{zip.profitIndex}</span></div></div>))}</div></div>
          </>
        )}

        {activeTab === 'cpt' && (
          <>
            <h1 style={styles.pageTitle}>Price Transparency</h1>
            <div style={{...styles.card, marginBottom:'24px'}}><div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>{['all', ...new Set(CPT_CODES.map(c => c.category))].map(c => <button key={c} onClick={() => setCptFilter(c)} style={{...styles.button, ...(cptFilter === c ? styles.primaryBtn : styles.secondaryBtn)}}>{c === 'all' ? 'All' : c}</button>)}</div></div>
            <div style={styles.card}><table style={styles.table}><thead><tr><th style={styles.th}>CPT</th><th style={styles.th}>Description</th><th style={styles.th}>Category</th><th style={styles.th}>Medicare</th><th style={styles.th}>wRVU</th></tr></thead><tbody>{(cptFilter === 'all' ? CPT_CODES : CPT_CODES.filter(c => c.category === cptFilter)).map(c => <tr key={c.code}><td style={{...styles.td,fontFamily:'monospace',fontWeight:'600',color:'#6366f1'}}>{c.code}</td><td style={styles.td}>{c.description}</td><td style={styles.td}><span style={{...styles.badge,background:'rgba(99,102,241,0.2)',color:'#a0a0ff'}}>{c.category}</span></td><td style={{...styles.td,fontWeight:'600',color:'#10b981'}}>${c.medicareRate.toFixed(2)}</td><td style={styles.td}>{c.wRVU}</td></tr>)}</tbody></table></div>
          </>
        )}

        {activeTab === 'innovations' && (
          <>
            <h1 style={styles.pageTitle}>OnPacePlus Innovation Tracker</h1>
            <div style={{...styles.card, marginBottom:'24px'}}><div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>{['all', ...new Set(INNOVATIONS.map(i => i.category))].map(c => <button key={c} onClick={() => setInnovationFilter(c)} style={{...styles.button, ...(innovationFilter === c ? styles.primaryBtn : styles.secondaryBtn)}}>{c === 'all' ? 'All' : c}</button>)}</div></div>
            <div style={styles.grid}>{(innovationFilter === 'all' ? INNOVATIONS : INNOVATIONS.filter(i => i.category === innovationFilter)).map(i => (<div key={i.id} style={styles.card}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><span style={{...styles.badge,background:'rgba(16,185,129,0.2)',color:'#10b981'}}>{i.status}</span><span style={{color:'#888',fontSize:'12px'}}>{i.year}</span></div><h3 style={{fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>{i.name}</h3><p style={{fontSize:'13px',color:'#888',marginBottom:'16px'}}>{i.manufacturer}</p><div style={{display:'flex',justifyContent:'space-between'}}><div><div style={{fontSize:'11px',color:'#888'}}>Adoption</div><div style={{fontWeight:'600',color:'#6366f1'}}>{i.adoptionRate}%</div></div><div><div style={{fontSize:'11px',color:'#888'}}>Impact</div><div style={{fontWeight:'600',color:'#10b981'}}>{i.clinicalImpact}</div></div></div></div>))}</div>
          </>
        )}

        {activeTab === 'chat' && (
          <>
            <h1 style={styles.pageTitle}>KCN Intelligence Chat</h1>
            <div style={{...styles.card, maxWidth:'800px'}}><div style={styles.chatContainer}>{chatMessages.map((m, i) => <div key={i} style={{...styles.chatMessage, ...(m.role === 'user' ? styles.userMessage : styles.botMessage)}}>{m.content}</div>)}<div ref={chatEndRef} /></div><div style={{display:'flex',gap:'12px'}}><input type="text" style={{...styles.input, flex:1}} placeholder="Ask about metrics..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleChat()} /><button onClick={handleChat} style={{...styles.button,...styles.primaryBtn}}>Send</button></div></div>
          </>
        )}

        {activeTab === 'csv' && (
          <>
            <h1 style={styles.pageTitle}>CSV Data Hub</h1>
            <div style={{...styles.card, marginBottom: '24px'}}><div style={styles.cardTitle}>📥 Import CSV</div><input type="file" accept=".csv" onChange={handleCSVImport} ref={fileInputRef} style={{display:'none'}} /><button onClick={() => fileInputRef.current.click()} style={{...styles.button,...styles.secondaryBtn}}>📂 Upload CSV</button>{importedData && <div style={{marginTop:'16px',color:'#10b981'}}>✅ Imported {importedData.length} rows</div>}</div>
            <div style={styles.card}><div style={styles.cardTitle}>📤 Export Metrics</div><button onClick={exportMetrics} style={{...styles.button,...styles.primaryBtn}}>Download CSV</button></div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h1 style={styles.pageTitle}>Practice Profile</h1>
            <div style={{...styles.card, maxWidth:'600px'}}><div style={{fontSize:'48px',textAlign:'center',marginBottom:'16px'}}>🏥</div><h2 style={{fontSize:'24px',fontWeight:'700',textAlign:'center',marginBottom:'24px'}}>{practiceProfile?.name || 'Demo'}</h2>{practiceProfile && Object.entries(practiceProfile).filter(([k]) => k !== 'createdAt').map(([k, v]) => <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'rgba(20,20,40,0.5)',borderRadius:'8px',marginBottom:'8px'}}><span style={{color:'#888',textTransform:'capitalize'}}>{k}</span><span style={{fontWeight:'500'}}>{Array.isArray(v) ? v.join(', ') : v}</span></div>)}<button onClick={() => {setShowRegistration(true); setRegStep(0); setRegAnswers({});}} style={{...styles.button,...styles.secondaryBtn,width:'100%',marginTop:'16px'}}>Edit Profile</button><button onClick={() => {localStorage.clear(); setPracticeProfile(null); setMetricValues({}); setShowRegistration(true); setRegStep(0);}} style={{width:'100%',marginTop:'12px',background:'none',border:'none',color:'#ef4444',cursor:'pointer'}}>Reset All</button></div>
          </>
        )}
      </main>
      <footer style={{textAlign:'center',padding:'24px',color:'#666',fontSize:'12px'}}><p>MedPact v3.2.0</p></footer>
    </div>
  );
}