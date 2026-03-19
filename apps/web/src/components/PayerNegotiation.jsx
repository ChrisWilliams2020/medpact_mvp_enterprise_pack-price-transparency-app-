import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// =============================================
// 5-STAGE PAYER NEGOTIATION PROCESS
// Contract Intelligence Feature
// =============================================

const COLORS = {
  primary: '#059669',
  primaryLight: '#10b981',
  secondary: '#0EA5E9',
  accent: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
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
// STAGE DATA CONFIGURATION
// =============================================

const STAGE_DATA = [
  {
    id: 1,
    name: 'Real-Time Contract Analysis',
    icon: '📋',
    description: 'AI-powered analysis of payer contracts, identifying optimization opportunities and pricing gaps in real-time across all service lines.',
    duration: 3000,
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    steps: [
      'Scanning payer contracts...',
      'Identifying pricing gaps...',
      'Analyzing reimbursement rates...',
      'Generating optimization report...',
    ],
    results: {
      contractsAnalyzed: 24,
      pricingGaps: 12,
      optimizationOpportunities: 8,
      potentialRevenue: '$342,500',
    },
  },
  {
    id: 2,
    name: 'Market Benchmarking',
    icon: '📊',
    description: 'Federal Reserve economic data integration with regional market analysis to establish competitive pricing strategies and reimbursement targets.',
    duration: 2500,
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    steps: [
      'Connecting to Federal Reserve...',
      'Downloading market data...',
      'Analyzing regional trends...',
      'Calculating benchmarks...',
    ],
    results: {
      regionsAnalyzed: 10,
      dataPoints: '2.4M',
      percentileRanking: '72nd',
      marketPosition: 'Above Average',
    },
  },
  {
    id: 3,
    name: 'Automated Payer Negotiations',
    icon: '🤝',
    description: 'Intelligent negotiation algorithms that automatically engage with payers using data-driven proposals and real-time market intelligence.',
    duration: 4000,
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    steps: [
      'Preparing negotiation proposals...',
      'Engaging with payer systems...',
      'Processing counteroffers...',
      'Finalizing agreements...',
    ],
    results: {
      proposalsSent: 6,
      counteroffersReceived: 4,
      agreementsReached: 3,
      avgRateIncrease: '+8.2%',
    },
  },
  {
    id: 4,
    name: 'Revenue Maximization',
    icon: '💰',
    description: 'Dynamic pricing optimization with predictive analytics to maximize revenue while maintaining competitive positioning and patient access.',
    duration: 3500,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    steps: [
      'Optimizing pricing models...',
      'Running predictive analytics...',
      'Calculating revenue impact...',
      'Implementing changes...',
    ],
    results: {
      pricingModelsOptimized: 15,
      revenueIncrease: '+$487,000',
      marginImprovement: '+3.2%',
      implementationTime: '< 30 days',
    },
  },
  {
    id: 5,
    name: 'Continuous Optimization',
    icon: '🔄',
    description: 'Machine learning algorithms continuously monitor performance, adjust strategies, and identify new optimization opportunities across the revenue cycle.',
    duration: 2000,
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    steps: [
      'Monitoring performance metrics...',
      'Adjusting optimization strategies...',
      'Identifying new opportunities...',
      'Updating recommendations...',
    ],
    results: {
      metricsMonitored: 47,
      strategiesAdjusted: 12,
      newOpportunities: 5,
      nextReview: '7 days',
    },
  },
];

// =============================================
// SAMPLE CONTRACT DATA
// =============================================

const SAMPLE_CONTRACTS = [
  { id: 1, payer: 'Aetna', type: 'Commercial', status: 'Active', expiry: '2026-12-31', rate: '112%', trend: '+3.2%' },
  { id: 2, payer: 'UnitedHealthcare', type: 'Commercial', status: 'Active', expiry: '2026-08-15', rate: '108%', trend: '+1.8%' },
  { id: 3, payer: 'Blue Cross Blue Shield', type: 'Commercial', status: 'Renegotiating', expiry: '2026-06-30', rate: '105%', trend: '+4.1%' },
  { id: 4, payer: 'Cigna', type: 'Commercial', status: 'Active', expiry: '2027-03-01', rate: '110%', trend: '+2.5%' },
  { id: 5, payer: 'Medicare', type: 'Government', status: 'Active', expiry: 'N/A', rate: '100%', trend: '-2.3%' },
  { id: 6, payer: 'Medicaid', type: 'Government', status: 'Active', expiry: 'N/A', rate: '78%', trend: '+0.5%' },
];

// =============================================
// NOTIFICATION COMPONENT
// =============================================

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#0EA5E9';

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      padding: '16px 24px',
      background: bgColor,
      color: 'white',
      borderRadius: '12px',
      boxShadow: SHADOWS.lg,
      zIndex: 10001,
      animation: 'slideIn 0.3s ease',
      maxWidth: '400px',
      fontSize: '14px',
      fontWeight: 500,
    }}>
      {message}
    </div>
  );
};

// =============================================
// STAGE CARD COMPONENT
// =============================================

const StageCard = ({ stage, isActive, isCompleted, isPending, progress, onActivate }) => (
  <div
    onClick={onActivate}
    style={{
      background: isCompleted ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : stage.gradient,
      color: 'white',
      padding: '24px',
      borderRadius: '16px',
      cursor: isPending ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      opacity: isPending ? 0.6 : 1,
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isActive ? `0 0 30px ${stage.color}80` : SHADOWS.md,
    }}
  >
    {/* Stage Number */}
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      fontSize: '48px',
      fontWeight: 'bold',
      opacity: 0.2,
    }}>{stage.id}</div>

    {/* Icon and Title */}
    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stage.icon}</div>
    <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600, paddingRight: '40px' }}>
      {stage.name}
    </h3>
    <p style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.9, marginBottom: '16px' }}>
      {stage.description}
    </p>

    {/* Status Badge */}
    <div style={{ marginBottom: '12px' }}>
      <span style={{
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        background: isCompleted ? 'rgba(255,255,255,0.3)' : isActive ? '#F59E0B' : isPending ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
        color: isActive ? '#000' : 'white',
        animation: isActive ? 'pulse 1.5s infinite' : 'none',
      }}>
        {isCompleted ? '✅ Completed' : isActive ? '⏳ Processing...' : isPending ? `Pending Stage ${stage.id - 1}` : '▶️ Ready'}
      </span>
    </div>

    {/* Progress Bar */}
    <div style={{
      width: '100%',
      height: '8px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #fff 0%, #ffd700 100%)',
        borderRadius: '4px',
        transition: 'width 0.3s ease',
      }} />
    </div>

    {/* Results (if completed) */}
    {isCompleted && (
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Results:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {Object.entries(stage.results).map(([key, value]) => (
            <div key={key} style={{ fontSize: '11px' }}>
              <span style={{ opacity: 0.8 }}>{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// =============================================
// MAIN COMPONENT
// =============================================

export default function PayerNegotiation({ onClose }) {
  const [activeTab, setActiveTab] = useState('process'); // 'process', 'contracts', 'analytics'
  const [processState, setProcessState] = useState({
    currentStage: 0,
    completedStages: [],
    isRunning: false,
    isPaused: false,
  });
  const [stageProgress, setStageProgress] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [currentStep, setCurrentStep] = useState('');

  // Show notification
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Run individual stage
  const runStage = useCallback(async (stageNum) => {
    const stage = STAGE_DATA.find(s => s.id === stageNum);
    if (!stage) return;

    setProcessState(prev => ({
      ...prev,
      isRunning: true,
      currentStage: stageNum,
    }));

    showNotification(`🚀 Starting ${stage.name}...`, 'info');

    const stepDuration = stage.duration / stage.steps.length;

    for (let i = 0; i < stage.steps.length; i++) {
      setCurrentStep(stage.steps[i]);
      
      // Animate progress
      const progress = ((i + 1) / stage.steps.length) * 100;
      setStageProgress(prev => ({ ...prev, [stageNum]: progress }));

      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }

    // Mark completed
    setProcessState(prev => ({
      ...prev,
      completedStages: [...prev.completedStages, stageNum],
      isRunning: false,
      currentStage: 0,
    }));

    setCurrentStep('');
    showNotification(`✅ ${stage.name} completed successfully!`, 'success');
  }, [showNotification]);

  // Activate stage (click handler)
  const activateStage = useCallback((stageNum) => {
    if (processState.isRunning) {
      showNotification('⚠️ Process already running. Please wait or reset.', 'warning');
      return;
    }

    if (stageNum > 1 && !processState.completedStages.includes(stageNum - 1)) {
      showNotification(`❌ Please complete Stage ${stageNum - 1} first.`, 'error');
      return;
    }

    if (processState.completedStages.includes(stageNum)) {
      showNotification(`✅ Stage ${stageNum} already completed.`, 'info');
      return;
    }

    runStage(stageNum);
  }, [processState, runStage, showNotification]);

  // Start full process
  const startFullProcess = useCallback(async () => {
    if (processState.isRunning) {
      showNotification('⚠️ Process already running!', 'warning');
      return;
    }

    showNotification('🚀 Starting Full Revenue Optimization Process...', 'info');

    for (let stage = 1; stage <= 5; stage++) {
      if (!processState.completedStages.includes(stage)) {
        await runStage(stage);
      }
    }

    showNotification('🎉 All 5 stages completed! Revenue optimization process finished.', 'success');
  }, [processState, runStage, showNotification]);

  // Reset process
  const resetProcess = useCallback(() => {
    setProcessState({
      currentStage: 0,
      completedStages: [],
      isRunning: false,
      isPaused: false,
    });
    setStageProgress({});
    setCurrentStep('');
    showNotification('🔄 Process reset. Ready to start.', 'info');
  }, [showNotification]);

  // Calculate overall progress
  const overallProgress = (processState.completedStages.length / 5) * 100;

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
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Notifications */}
      {notifications.map(n => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      <div style={{
        background: COLORS.white,
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1400px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: SHADOWS.xl,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
          padding: '24px 32px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
              📝 Contract Intelligence
            </h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
              5-Stage Payer Negotiation & Revenue Optimization Process
            </p>
          </div>
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

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.background,
        }}>
          {[
            { id: 'process', label: '🚀 Optimization Process', icon: '🚀' },
            { id: 'contracts', label: '📄 Active Contracts', icon: '📄' },
            { id: 'analytics', label: '📊 Performance Analytics', icon: '📊' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 24px',
                border: 'none',
                background: activeTab === tab.id ? COLORS.white : 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #ec4899' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#ec4899' : COLORS.textSecondary,
                transition: 'all 0.2s ease',
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
          {/* Process Tab */}
          {activeTab === 'process' && (
            <>
              {/* Control Panel */}
              <div style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '24px',
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: COLORS.text, fontSize: '18px' }}>
                  Revenue Optimization Control Center
                </h3>
                
                {/* Current Step Display */}
                {currentStep && (
                  <div style={{
                    background: COLORS.white,
                    padding: '12px 20px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <span style={{ 
                      width: '10px', 
                      height: '10px', 
                      background: '#10b981', 
                      borderRadius: '50%',
                      animation: 'pulse 1s infinite',
                    }} />
                    <span style={{ color: COLORS.text, fontWeight: 500 }}>{currentStep}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <button
                    onClick={startFullProcess}
                    disabled={processState.isRunning}
                    style={{
                      padding: '12px 28px',
                      background: processState.isRunning ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: processState.isRunning ? 'not-allowed' : 'pointer',
                      fontSize: '15px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      boxShadow: SHADOWS.sm,
                    }}
                  >🚀 Start Full Process</button>
                  <button
                    onClick={resetProcess}
                    style={{
                      padding: '12px 28px',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                    }}
                  >🔄 Reset</button>
                </div>

                {/* Overall Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text }}>Overall Progress</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ec4899' }}>{Math.round(overallProgress)}% Complete</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: COLORS.border,
                    borderRadius: '6px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${overallProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)',
                      borderRadius: '6px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              </div>

              {/* Stage Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {STAGE_DATA.map(stage => (
                  <StageCard
                    key={stage.id}
                    stage={stage}
                    isActive={processState.currentStage === stage.id}
                    isCompleted={processState.completedStages.includes(stage.id)}
                    isPending={stage.id > 1 && !processState.completedStages.includes(stage.id - 1) && !processState.completedStages.includes(stage.id)}
                    progress={stageProgress[stage.id] || (processState.completedStages.includes(stage.id) ? 100 : 0)}
                    onActivate={() => activateStage(stage.id)}
                  />
                ))}
              </div>

              {/* Summary Stats */}
              {processState.completedStages.length > 0 && (
                <div style={{
                  marginTop: '24px',
                  padding: '24px',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  borderRadius: '16px',
                  color: 'white',
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>📈 Optimization Summary</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700 }}>$829,500</div>
                      <div style={{ fontSize: '13px', opacity: 0.9 }}>Potential Revenue Increase</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700 }}>+8.2%</div>
                      <div style={{ fontSize: '13px', opacity: 0.9 }}>Average Rate Improvement</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700 }}>3</div>
                      <div style={{ fontSize: '13px', opacity: 0.9 }}>Contracts Renegotiated</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700 }}>72nd</div>
                      <div style={{ fontSize: '13px', opacity: 0.9 }}>Market Percentile</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Contracts Tab */}
          {activeTab === 'contracts' && (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}>
                <h3 style={{ margin: 0, color: COLORS.text, fontSize: '20px' }}>Active Payer Contracts</h3>
                <button
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >+ Add Contract</button>
              </div>

              <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${COLORS.border}`,
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.background }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Payer</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Type</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Status</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Expiration</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Rate (% of Medicare)</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_CONTRACTS.map(contract => (
                      <tr key={contract.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '16px', fontWeight: 500, color: COLORS.text }}>{contract.payer}</td>
                        <td style={{ padding: '16px', color: COLORS.textSecondary }}>{contract.type}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            background: contract.status === 'Active' ? '#dcfce7' : '#fef3c7',
                            color: contract.status === 'Active' ? '#16a34a' : '#d97706',
                          }}>{contract.status}</span>
                        </td>
                        <td style={{ padding: '16px', color: COLORS.textSecondary }}>{contract.expiry}</td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: COLORS.text }}>{contract.rate}</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{
                            color: contract.trend.startsWith('+') ? '#16a34a' : '#dc2626',
                            fontWeight: 500,
                          }}>{contract.trend}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Contract Insights */}
              <div style={{
                marginTop: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Contracts Expiring Soon</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>2</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Within 6 months</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Average Rate</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>102.2%</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Of Medicare allowable</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Negotiation Opportunities</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>4</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Below market rate</div>
                </div>
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <>
              <h3 style={{ margin: '0 0 20px 0', color: COLORS.text, fontSize: '20px' }}>Performance Analytics</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {/* Revenue by Payer */}
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <h4 style={{ margin: '0 0 20px 0', color: COLORS.text, fontSize: '16px' }}>Revenue by Payer Type</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Commercial', percentage: 52, amount: '$1.61M', color: '#3B82F6' },
                      { name: 'Medicare', percentage: 31, amount: '$961K', color: '#10b981' },
                      { name: 'Medicaid', percentage: 12, amount: '$372K', color: '#8B5CF6' },
                      { name: 'Self-Pay', percentage: 5, amount: '$155K', color: '#F59E0B' },
                    ].map(item => (
                      <div key={item.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '14px', color: COLORS.text }}>{item.name}</span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{item.amount}</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: COLORS.border,
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${item.percentage}%`,
                            height: '100%',
                            background: item.color,
                            borderRadius: '4px',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reimbursement Trends */}
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <h4 style={{ margin: '0 0 20px 0', color: COLORS.text, fontSize: '16px' }}>Reimbursement Trends (YoY)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { name: 'Cataract Surgery', trend: '+4.2%', color: '#10b981' },
                      { name: 'Retina Procedures', trend: '+2.8%', color: '#10b981' },
                      { name: 'Glaucoma Treatment', trend: '+1.5%', color: '#10b981' },
                      { name: 'Office Visits', trend: '-1.2%', color: '#EF4444' },
                      { name: 'Diagnostics', trend: '+3.1%', color: '#10b981' },
                    ].map(item => (
                      <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: COLORS.text }}>{item.name}</span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: item.color,
                          padding: '4px 12px',
                          background: item.color === '#10b981' ? '#dcfce7' : '#fee2e2',
                          borderRadius: '20px',
                        }}>{item.trend}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: 'white',
                }}>
                  <h4 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Key Performance Metrics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 700 }}>$3.1M</div>
                      <div style={{ fontSize: '13px', opacity: 0.9 }}>Total Annual Revenue</div>
                    </div>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>24</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Active Contracts</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>$127.50</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Avg Reimbursement</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>94.2%</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Collection Rate</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>18 days</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Avg Days to Pay</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

PayerNegotiation.propTypes = {
  onClose: PropTypes.func.isRequired,
};
