import React, { useState, useCallback, memo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// EXPERT NARRATION SYSTEM
// Premium feature: Expert professors narrate metric outcomes and provide
// corrective guidance based on their lectures, books, and published papers
// ============================================================================

// Expert Professors Database
const EXPERT_PROFESSORS = [
  {
    id: 'dr-berwick',
    name: 'Dr. Donald Berwick',
    title: 'Former CMS Administrator',
    specialty: 'Healthcare Quality & Patient Safety',
    avatar: '👨‍⚕️',
    credentials: 'MD, MPP, FRCP',
    institution: 'Institute for Healthcare Improvement',
    expertise: ['Quality Improvement', 'Patient Safety', 'Healthcare Policy'],
    publications: [
      'Escape Fire: Designs for the Future of Health Care',
      'Curing Health Care: New Strategies for Quality Improvement',
    ],
    hourlyRate: 500,
    available: true,
    rating: 4.9,
    narrationStyle: 'analytical',
    bio: 'Pioneer in healthcare quality improvement and former Administrator of CMS. Known for the Triple Aim framework.',
  },
  {
    id: 'dr-gawande',
    name: 'Dr. Atul Gawande',
    title: 'Surgeon & Healthcare Researcher',
    specialty: 'Healthcare Systems & Surgical Quality',
    avatar: '🩺',
    credentials: 'MD, MPH',
    institution: 'Harvard Medical School',
    expertise: ['Surgical Safety', 'Healthcare Costs', 'System Design'],
    publications: [
      'The Checklist Manifesto',
      'Being Mortal',
      'Better: A Surgeon\'s Notes on Performance',
    ],
    hourlyRate: 600,
    available: true,
    rating: 4.9,
    narrationStyle: 'storytelling',
    bio: 'Award-winning author and surgeon who has revolutionized thinking about healthcare delivery and end-of-life care.',
  },
  {
    id: 'dr-porter',
    name: 'Dr. Michael Porter',
    title: 'Healthcare Strategy Expert',
    specialty: 'Value-Based Healthcare',
    avatar: '📊',
    credentials: 'PhD, MBA',
    institution: 'Harvard Business School',
    expertise: ['Value-Based Care', 'Healthcare Strategy', 'Competitive Advantage'],
    publications: [
      'Redefining Health Care',
      'The Strategy That Will Fix Health Care',
    ],
    hourlyRate: 750,
    available: true,
    rating: 4.8,
    narrationStyle: 'strategic',
    bio: 'Leading authority on competitive strategy and value-based healthcare transformation.',
  },
  {
    id: 'dr-christensen',
    name: 'Dr. Clayton Christensen',
    title: 'Innovation Scholar (Legacy)',
    specialty: 'Disruptive Innovation in Healthcare',
    avatar: '💡',
    credentials: 'DBA, MBA',
    institution: 'Harvard Business School',
    expertise: ['Disruptive Innovation', 'Business Model Innovation', 'Healthcare Transformation'],
    publications: [
      'The Innovator\'s Prescription',
      'The Innovator\'s Dilemma',
    ],
    hourlyRate: 400,
    available: true,
    rating: 4.9,
    narrationStyle: 'innovative',
    bio: 'Late professor whose theories on disruptive innovation transformed healthcare strategy thinking.',
  },
  {
    id: 'dr-makary',
    name: 'Dr. Marty Makary',
    title: 'Surgeon & Healthcare Policy Expert',
    specialty: 'Price Transparency & Medical Errors',
    avatar: '🔬',
    credentials: 'MD, MPH',
    institution: 'Johns Hopkins University',
    expertise: ['Price Transparency', 'Medical Errors', 'Healthcare Reform'],
    publications: [
      'The Price We Pay',
      'Unaccountable: What Hospitals Won\'t Tell You',
    ],
    hourlyRate: 550,
    available: true,
    rating: 4.8,
    narrationStyle: 'investigative',
    bio: 'Leading voice on healthcare price transparency and author of groundbreaking research on medical errors.',
  },
  {
    id: 'dr-topol',
    name: 'Dr. Eric Topol',
    title: 'Digital Medicine Pioneer',
    specialty: 'AI & Digital Health',
    avatar: '🤖',
    credentials: 'MD',
    institution: 'Scripps Research Translational Institute',
    expertise: ['Digital Health', 'AI in Medicine', 'Genomics'],
    publications: [
      'Deep Medicine',
      'The Patient Will See You Now',
      'The Creative Destruction of Medicine',
    ],
    hourlyRate: 650,
    available: true,
    rating: 4.9,
    narrationStyle: 'futuristic',
    bio: 'Cardiologist and digital health visionary leading the integration of AI into clinical practice.',
  },
]

// Metric-specific narration templates by expert style
const NARRATION_TEMPLATES = {
  analytical: {
    ncr: {
      good: "Your Net Collection Rate of {value}% demonstrates strong revenue cycle performance. According to IHI principles, this indicates your billing processes are well-designed. The key is maintaining this through continuous monitoring and rapid-cycle improvement.",
      warning: "At {value}%, your NCR is below the 95% benchmark. From a systems perspective, this often indicates process variation. I'd recommend mapping your collection workflow to identify bottlenecks - what we call 'failure modes' in quality improvement.",
      critical: "A {value}% NCR requires immediate attention. In my experience leading quality initiatives, this level typically indicates systemic issues. Apply the Model for Improvement: What are we trying to accomplish? How will we know change is improvement? What changes can we make?",
    },
    dar: {
      good: "Days in A/R at {value} shows excellent cash flow management. This aligns with lean principles - reducing waste in your revenue cycle.",
      warning: "At {value} days, your A/R is trending high. Consider applying PDSA cycles to test small changes in your follow-up processes.",
      critical: "With {value} days in A/R, you're experiencing significant cash flow delay. This is a 'never event' equivalent in revenue cycle terms.",
    },
  },
  storytelling: {
    ncr: {
      good: "I've seen practices transform their financial health through attention to details just like yours. A {value}% collection rate tells a story of systematic excellence.",
      warning: "In 'Better', I wrote about how small improvements compound. Your {value}% NCR has room to grow - consider what checklist items might be missing.",
      critical: "When I studied healthcare costs, practices with {value}% NCR often had fixable process gaps. The solution is usually simpler than expected.",
    },
    mips: {
      good: "Your MIPS score of {value} reflects what I call 'the heroism of incremental care' - consistent attention to quality measures.",
      warning: "At {value}, there's a story to uncover. Quality improvement, like surgery, requires systematic preparation and execution.",
      critical: "A score of {value} is a signal, not a sentence. In 'The Checklist Manifesto', I showed how simple interventions create dramatic improvements.",
    },
  },
  strategic: {
    ncr: {
      good: "Your {value}% NCR reflects strong value creation. In value-based healthcare, this translates directly to your ability to invest in patient outcomes.",
      warning: "At {value}%, you're leaving value on the table. Strategic analysis suggests examining your payer contract portfolio and denial patterns.",
      critical: "A {value}% NCR undermines your competitive position. Immediate strategic intervention is needed across your revenue cycle.",
    },
    ebitda: {
      good: "EBITDA margin of {value}% indicates sustainable competitive advantage. You're positioned to invest in differentiation.",
      warning: "At {value}%, your margin is below the strategic threshold for sustainable reinvestment in capabilities.",
      critical: "A {value}% EBITDA margin signals strategic vulnerability. Consider portfolio analysis of your service lines.",
    },
  },
  innovative: {
    ncr: {
      good: "Your {value}% NCR shows you've optimized within the current paradigm. Now consider: what disruptive opportunities exist?",
      warning: "At {value}%, incumbent processes may be limiting you. Disruptive innovators would ask: what job is the revenue cycle really doing?",
      critical: "When NCR drops to {value}%, it often signals a need for business model innovation, not just process improvement.",
    },
  },
  investigative: {
    ncr: {
      good: "In 'The Price We Pay', I emphasized transparency. Your {value}% NCR suggests you've achieved pricing clarity with payers.",
      warning: "At {value}%, hidden costs may be eroding your collections. Investigate underpayments and surprise billing patterns.",
      critical: "A {value}% NCR often hides systemic issues. In my research, this level correlates with contract ambiguity and coding gaps.",
    },
    denial_rate: {
      good: "Your {value}% denial rate reflects clean claims submission. This transparency in billing protects both practice and patients.",
      warning: "At {value}%, denials are costing you. My research shows most denials are preventable with upfront verification.",
      critical: "A {value}% denial rate is a red flag. Investigate payer behavior patterns - some may be systematically underpaying.",
    },
  },
  futuristic: {
    ncr: {
      good: "Your {value}% NCR is solid, but AI-powered revenue cycle tools could push this higher with predictive denial prevention.",
      warning: "At {value}%, machine learning models could identify collection opportunities your current systems miss.",
      critical: "A {value}% NCR in 2026 suggests your revenue cycle hasn't adopted AI-powered optimization tools yet.",
    },
    mips: {
      good: "MIPS at {value} is strong. AI-assisted clinical decision support could help maintain this while reducing documentation burden.",
      warning: "Your {value} MIPS score could benefit from digital health tools that automate quality measure capture.",
      critical: "At {value}, consider how AI could transform your quality reporting - from reactive to predictive care.",
    },
  },
}

// Generate corrective steps based on expert philosophy
const generateCorrectiveSteps = (expert, metric, severity) => {
  const steps = {
    'dr-berwick': {
      ncr: [
        'Apply the Model for Improvement to your collection process',
        'Map the patient billing journey to identify failure points',
        'Implement rapid-cycle testing with weekly PDSA cycles',
        'Create a dashboard for real-time collection monitoring',
        'Engage front-line staff in identifying improvement opportunities',
      ],
      dar: [
        'Implement daily A/R aging reviews',
        'Create standardized follow-up protocols by payer',
        'Apply Six Sigma methodology to reduce variation',
        'Establish clear escalation pathways for aged accounts',
      ],
      default: [
        'Define specific, measurable improvement aims',
        'Establish baseline measurements',
        'Test changes on a small scale first',
        'Spread successful changes systematically',
      ],
    },
    'dr-gawande': {
      ncr: [
        'Create a billing checklist for common denial reasons',
        'Implement pre-visit insurance verification protocols',
        'Conduct weekly denial review meetings',
        'Document and share collection best practices',
      ],
      mips: [
        'Develop clinical checklists for quality measures',
        'Implement team-based care protocols',
        'Create feedback loops for measure performance',
        'Focus on high-impact, high-volume measures first',
      ],
      default: [
        'Build checklists for critical processes',
        'Foster a culture of open communication',
        'Learn from failures without blame',
        'Measure what matters to outcomes',
      ],
    },
    'dr-porter': {
      ncr: [
        'Analyze collection rates by service line and payer',
        'Identify high-value, underperforming segments',
        'Renegotiate contracts based on value delivered',
        'Align incentives with collection performance',
      ],
      ebitda: [
        'Conduct service line profitability analysis',
        'Identify opportunities for scope expansion',
        'Evaluate make-vs-buy decisions for support services',
        'Develop bundled pricing strategies',
      ],
      default: [
        'Define your unique value proposition',
        'Measure outcomes that matter to patients',
        'Align your organization around value creation',
        'Invest in capabilities that differentiate',
      ],
    },
    'dr-makary': {
      ncr: [
        'Audit contracts for hidden fee schedules',
        'Implement price transparency for patients',
        'Investigate patterns in underpayments',
        'Create clear, upfront cost estimates',
      ],
      denial_rate: [
        'Analyze denial patterns by payer and code',
        'Implement prior authorization automation',
        'Create denial prevention checklists',
        'Appeal high-value denials systematically',
      ],
      default: [
        'Increase transparency in all pricing',
        'Empower patients with cost information',
        'Challenge opaque payer practices',
        'Document everything meticulously',
      ],
    },
    'dr-topol': {
      ncr: [
        'Implement AI-powered eligibility verification',
        'Use predictive analytics for denial prevention',
        'Automate claim status monitoring',
        'Deploy chatbots for patient billing inquiries',
      ],
      mips: [
        'Integrate clinical decision support tools',
        'Use voice recognition for documentation',
        'Implement automated quality measure extraction',
        'Deploy patient engagement apps for preventive care',
      ],
      default: [
        'Evaluate AI solutions for your biggest pain points',
        'Start with narrow AI applications that prove value',
        'Ensure human oversight of AI recommendations',
        'Invest in digital literacy for your team',
      ],
    },
  }

  const expertSteps = steps[expert.id] || steps['dr-berwick']
  return expertSteps[metric] || expertSteps.default || []
}

// Expert Card Component
const ExpertCard = memo(function ExpertCard({ expert, selected, onSelect, onPreview }) {
  const isAvailable = expert?.available !== false
  
  const handleSelect = useCallback(() => {
    if (onSelect && expert && isAvailable) {
      onSelect(expert)
    }
  }, [onSelect, expert, isAvailable])
  
  const handlePreview = useCallback((e) => {
    e.stopPropagation()
    if (onPreview && expert) {
      onPreview(expert)
    }
  }, [onPreview, expert])
  
  if (!expert) return null
  
  return (
    <div
      onClick={handleSelect}
      style={{
        background: selected ? 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)' : 'white',
        border: `2px solid ${selected ? '#667eea' : '#e5e7eb'}`,
        borderRadius: 16,
        padding: 20,
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.6,
        transition: 'all 0.2s',
      }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Select ${expert.name} as your expert narrator`}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          flexShrink: 0,
        }}>
          {expert.avatar}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ margin: '0 0 2px 0', color: '#1f2937', fontSize: 16 }}>
                {expert.name}
                {selected && (
                  <span style={{
                    marginLeft: 8,
                    padding: '2px 8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    SELECTED
                  </span>
                )}
              </h4>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{expert.credentials}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>
                ${expert.hourlyRate}/hr
              </div>
              <div style={{ fontSize: 11, color: '#f59e0b' }}>
                ⭐ {expert.rating}
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: 13, color: '#4b5563', marginTop: 8 }}>
            {expert.specialty}
          </div>
          
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {expert.expertise?.slice(0, 3).map(skill => (
              <span key={skill} style={{
                padding: '2px 8px',
                background: '#eff6ff',
                color: '#1e40af',
                borderRadius: 10,
                fontSize: 11,
              }}>
                {skill}
              </span>
            ))}
          </div>
          
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button
              onClick={handlePreview}
              style={{
                padding: '6px 12px',
                background: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              👁️ Preview Style
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

ExpertCard.propTypes = {
  expert: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    specialty: PropTypes.string,
    avatar: PropTypes.string,
    credentials: PropTypes.string,
    expertise: PropTypes.arrayOf(PropTypes.string),
    hourlyRate: PropTypes.number,
    available: PropTypes.bool,
    rating: PropTypes.number,
  }),
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onPreview: PropTypes.func,
}

// Narration Player Component
const NarrationPlayer = memo(function NarrationPlayer({ narration, expert, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current)
          setIsPlaying(false)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }, [])
  
  const handlePause = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])
  
  if (!narration || !expert) return null
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      borderRadius: 16,
      padding: 24,
      color: 'white',
      marginBottom: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 40 }}>{expert.avatar}</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 18 }}>{expert.name}</h4>
            <div style={{ opacity: 0.8, fontSize: 13 }}>{expert.specialty}</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 20,
              width: 32,
              height: 32,
              color: 'white',
              cursor: 'pointer',
              fontSize: 16,
            }}
            aria-label="Close narration"
          >
            ✕
          </button>
        )}
      </div>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        fontSize: 15,
        lineHeight: 1.7,
        fontStyle: 'italic',
      }}>
        "{narration}"
      </div>
      
      {/* Audio Player Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div style={{ flex: 1 }}>
          <div style={{
            width: '100%',
            height: 6,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 3,
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'white',
              borderRadius: 3,
              transition: 'width 0.1s linear',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4, opacity: 0.8 }}>
            <span>{Math.floor(progress * 0.6)}s</span>
            <span>60s</span>
          </div>
        </div>
        
        <button
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 8,
            color: 'white',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          📥 Download MP3
        </button>
      </div>
    </div>
  )
})

NarrationPlayer.propTypes = {
  narration: PropTypes.string,
  expert: PropTypes.object,
  onClose: PropTypes.func,
}

// Corrective Steps Component
const CorrectiveSteps = memo(function CorrectiveSteps({ steps, expert, metric }) {
  if (!steps?.length) return null
  
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>📋</span>
        Recommended Actions from {expert?.name || 'Expert'}
      </h4>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        Based on principles from their published works and lectures
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: 12,
              background: '#f9fafb',
              borderRadius: 8,
              borderLeft: '3px solid #667eea',
            }}
          >
            <span style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {index + 1}
            </span>
            <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
              {step}
            </span>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: 20,
        padding: 12,
        background: '#eff6ff',
        borderRadius: 8,
        fontSize: 13,
        color: '#1e40af',
      }}>
        💡 <strong>Source:</strong> Recommendations derived from {expert?.publications?.[0] || 'expert publications'} and related works
      </div>
    </div>
  )
})

CorrectiveSteps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  expert: PropTypes.object,
  metric: PropTypes.string,
}

// Main Expert Narration Component
export function ExpertNarration({ metrics = {}, onSubscribe }) {
  const [selectedExpert, setSelectedExpert] = useState(null)
  const [selectedMetric, setSelectedMetric] = useState('ncr')
  const [showPreview, setShowPreview] = useState(null)
  const [activeNarration, setActiveNarration] = useState(null)
  const [subscriptionTier, setSubscriptionTier] = useState(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  
  // Available metrics for narration
  const availableMetrics = [
    { id: 'ncr', name: 'Net Collection Rate', value: metrics.ncr || 94.2, benchmark: 95, icon: '💰' },
    { id: 'dar', name: 'Days in A/R', value: metrics.dar || 32, benchmark: 30, icon: '📅' },
    { id: 'mips', name: 'MIPS Score', value: metrics.mips || 82, benchmark: 75, icon: '⭐' },
    { id: 'denial_rate', name: 'Denial Rate', value: metrics.denial_rate || 6.5, benchmark: 5, icon: '❌' },
    { id: 'ebitda', name: 'EBITDA Margin', value: metrics.ebitda || 22, benchmark: 25, icon: '📊' },
    { id: 'patient_satisfaction', name: 'Patient Satisfaction', value: metrics.patient_satisfaction || 4.2, benchmark: 4.5, icon: '😊' },
  ]
  
  // Determine severity based on metric and value
  const getSeverity = useCallback((metric, value) => {
    const thresholds = {
      ncr: { good: 95, warning: 90 },
      dar: { good: 30, warning: 40 },
      mips: { good: 75, warning: 60 },
      denial_rate: { good: 5, warning: 8 },
      ebitda: { good: 25, warning: 20 },
      patient_satisfaction: { good: 4.5, warning: 4.0 },
    }
    
    const t = thresholds[metric] || { good: 0, warning: 0 }
    const isInverse = ['dar', 'denial_rate'].includes(metric)
    
    if (isInverse) {
      if (value <= t.good) return 'good'
      if (value <= t.warning) return 'warning'
      return 'critical'
    } else {
      if (value >= t.good) return 'good'
      if (value >= t.warning) return 'warning'
      return 'critical'
    }
  }, [])
  
  // Generate narration for selected expert and metric
  const generateNarration = useCallback((expert, metric, value) => {
    if (!expert || !metric) return null
    
    const style = expert.narrationStyle || 'analytical'
    const templates = NARRATION_TEMPLATES[style] || NARRATION_TEMPLATES.analytical
    const metricTemplates = templates[metric] || templates.ncr
    const severity = getSeverity(metric, value)
    
    const template = metricTemplates[severity] || metricTemplates.warning
    return template.replace('{value}', value?.toFixed?.(1) || value)
  }, [getSeverity])
  
  const handleSelectExpert = useCallback((expert) => {
    setSelectedExpert(expert)
    setShowPreview(null)
  }, [])
  
  const handlePreviewExpert = useCallback((expert) => {
    setShowPreview(expert)
  }, [])
  
  const handleGenerateNarration = useCallback(() => {
    if (!selectedExpert || !selectedMetric) return
    
    const metricData = availableMetrics.find(m => m.id === selectedMetric)
    const narration = generateNarration(selectedExpert, selectedMetric, metricData?.value)
    setActiveNarration(narration)
  }, [selectedExpert, selectedMetric, availableMetrics, generateNarration])
  
  const selectedMetricData = availableMetrics.find(m => m.id === selectedMetric)
  const correctiveSteps = selectedExpert ? generateCorrectiveSteps(selectedExpert, selectedMetric, getSeverity(selectedMetric, selectedMetricData?.value)) : []
  
  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: 20,
        padding: 28,
        color: 'white',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: 28 }}>🎓 Expert Narration</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: 15, maxWidth: 600 }}>
              Get personalized metric analysis and corrective guidance from leading healthcare experts, 
              based on their published works, lectures, and research.
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>PREMIUM FEATURE</div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>Starting at $99/mo</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
        {/* Left Column - Expert Selection */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Select Your Expert Narrator</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {EXPERT_PROFESSORS.map(expert => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                selected={selectedExpert?.id === expert.id}
                onSelect={handleSelectExpert}
                onPreview={handlePreviewExpert}
              />
            ))}
          </div>
        </div>
        
        {/* Right Column - Metric Selection & Narration */}
        <div>
          {/* Metric Selector */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: 20,
          }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Select Metric for Analysis</h4>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                marginBottom: 16,
              }}
              aria-label="Select metric for expert analysis"
            >
              {availableMetrics.map(metric => (
                <option key={metric.id} value={metric.id}>
                  {metric.icon} {metric.name} - Current: {metric.value}
                </option>
              ))}
            </select>
            
            {selectedMetricData && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 12,
                background: '#f9fafb',
                borderRadius: 8,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Current Value</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
                    {selectedMetricData.value}
                    {selectedMetricData.id === 'ncr' || selectedMetricData.id === 'ebitda' || selectedMetricData.id === 'denial_rate' ? '%' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Benchmark</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#059669' }}>
                    {selectedMetricData.benchmark}
                    {selectedMetricData.id === 'ncr' || selectedMetricData.id === 'ebitda' || selectedMetricData.id === 'denial_rate' ? '%' : ''}
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleGenerateNarration}
              disabled={!selectedExpert}
              style={{
                width: '100%',
                marginTop: 16,
                padding: 14,
                background: selectedExpert 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#e5e7eb',
                color: selectedExpert ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: selectedExpert ? 'pointer' : 'not-allowed',
              }}
            >
              🎙️ Generate Expert Narration
            </button>
          </div>
          
          {/* Active Narration */}
          {activeNarration && selectedExpert && (
            <NarrationPlayer
              narration={activeNarration}
              expert={selectedExpert}
              onClose={() => setActiveNarration(null)}
            />
          )}
          
          {/* Corrective Steps */}
          {activeNarration && selectedExpert && (
            <CorrectiveSteps
              steps={correctiveSteps}
              expert={selectedExpert}
              metric={selectedMetric}
            />
          )}
          
          {/* Preview Modal */}
          {showPreview && (
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginTop: 20,
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>
                Preview: {showPreview.name}'s Style
              </h4>
              <p style={{ fontSize: 14, color: '#4b5563', fontStyle: 'italic', lineHeight: 1.6 }}>
                "{generateNarration(showPreview, 'ncr', 93.5)}"
              </p>
              <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
                <strong>Publications:</strong> {showPreview.publications?.join(', ')}
              </div>
              <button
                onClick={() => setShowPreview(null)}
                style={{
                  marginTop: 12,
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ExpertNarration.propTypes = {
  metrics: PropTypes.object,
  onSubscribe: PropTypes.func,
}

export default ExpertNarration
