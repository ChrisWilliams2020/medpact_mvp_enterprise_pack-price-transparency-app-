import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// =============================================
// AI STAFF ASSISTANTS
// Role-specific AI automation for ophthalmology practices
// =============================================

const COLORS = {
  primary: '#059669',
  primaryLight: '#10b981',
  secondary: '#0EA5E9',
  accent: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
  gold: '#D4AF37',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
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
// AI ASSISTANT DEFINITIONS BY ROLE
// =============================================

const AI_ASSISTANTS = {
  practice_manager: {
    id: 'practice_manager',
    name: 'Practice Manager AI',
    icon: '👔',
    avatar: '🤖',
    color: '#6366F1',
    tagline: 'Strategic oversight & operational excellence',
    description: 'AI-powered practice management assistant that monitors KPIs, optimizes scheduling, manages staff, and provides strategic insights.',
    capabilities: [
      {
        id: 'kpi_monitoring',
        name: 'KPI Dashboard & Alerts',
        icon: '📊',
        description: 'Real-time monitoring of practice performance metrics',
        automations: [
          'Daily revenue tracking & forecasting',
          'Patient volume analysis',
          'No-show rate monitoring',
          'Provider productivity tracking',
          'AR aging alerts',
        ],
        status: 'active',
      },
      {
        id: 'staff_scheduling',
        name: 'Smart Staff Scheduling',
        icon: '📅',
        description: 'AI-optimized staff schedules based on patient demand',
        automations: [
          'Predict staffing needs by day/time',
          'Auto-generate optimal schedules',
          'PTO conflict detection',
          'Overtime prevention alerts',
          'Cross-training recommendations',
        ],
        status: 'active',
      },
      {
        id: 'financial_oversight',
        name: 'Financial Intelligence',
        icon: '💰',
        description: 'Automated financial analysis and recommendations',
        automations: [
          'Daily cash flow projections',
          'Expense anomaly detection',
          'Contract renewal reminders',
          'Payer mix optimization',
          'Revenue cycle bottleneck identification',
        ],
        status: 'active',
      },
      {
        id: 'compliance_monitor',
        name: 'Compliance & Quality',
        icon: '✅',
        description: 'Automated compliance tracking and quality assurance',
        automations: [
          'HIPAA compliance checks',
          'Credentialing expiration alerts',
          'Quality measure tracking',
          'Patient satisfaction analysis',
          'Audit preparation assistance',
        ],
        status: 'active',
      },
    ],
    quickActions: [
      { id: 'daily_briefing', label: '📋 Daily Briefing', action: 'Generate today\'s practice briefing' },
      { id: 'staff_report', label: '👥 Staff Performance', action: 'Review staff productivity metrics' },
      { id: 'financial_summary', label: '💵 Financial Summary', action: 'Show MTD financial summary' },
      { id: 'schedule_optimize', label: '📅 Optimize Schedule', action: 'Analyze and optimize next week\'s schedule' },
    ],
  },

  receptionist: {
    id: 'receptionist',
    name: 'Front Desk AI',
    icon: '👋',
    avatar: '🤖',
    color: '#059669',
    tagline: 'Seamless patient experience from arrival to departure',
    description: 'AI assistant that handles patient check-in, appointment management, communication, and front desk operations.',
    capabilities: [
      {
        id: 'smart_checkin',
        name: 'Smart Check-In',
        icon: '✓',
        description: 'Automated patient arrival and registration',
        automations: [
          'Digital pre-registration reminders',
          'Insurance verification pre-check',
          'Copay calculation & collection prompts',
          'Wait time estimation',
          'Patient form completion tracking',
        ],
        status: 'active',
      },
      {
        id: 'appointment_management',
        name: 'Appointment Intelligence',
        icon: '📅',
        description: 'Smart scheduling and appointment optimization',
        automations: [
          'Intelligent appointment booking',
          'Automatic appointment reminders (SMS/Email/Voice)',
          'No-show prediction & prevention',
          'Same-day cancellation filling',
          'Recall list management',
        ],
        status: 'active',
      },
      {
        id: 'patient_communication',
        name: 'Patient Communication Hub',
        icon: '💬',
        description: 'Automated multi-channel patient messaging',
        automations: [
          'Appointment confirmation messages',
          'Pre-visit instructions delivery',
          'Post-visit follow-up messages',
          'Birthday & holiday greetings',
          'Survey distribution & collection',
        ],
        status: 'active',
      },
      {
        id: 'phone_assistant',
        name: 'Phone Call Assistant',
        icon: '📞',
        description: 'AI-powered phone call support',
        automations: [
          'Call routing recommendations',
          'Common question auto-responses',
          'Callback scheduling',
          'Message transcription',
          'Peak call time prediction',
        ],
        status: 'active',
      },
    ],
    quickActions: [
      { id: 'check_arrivals', label: '👋 Today\'s Arrivals', action: 'Show expected patients today' },
      { id: 'send_reminders', label: '📱 Send Reminders', action: 'Send tomorrow\'s appointment reminders' },
      { id: 'fill_cancellation', label: '🔄 Fill Cancellation', action: 'Find patients for cancelled slots' },
      { id: 'wait_times', label: '⏱️ Wait Times', action: 'Check current wait times' },
    ],
  },

  medical_technician: {
    id: 'medical_technician',
    name: 'Clinical AI Assistant',
    icon: '👁️',
    avatar: '🤖',
    color: '#0EA5E9',
    tagline: 'Precision clinical support & diagnostic assistance',
    description: 'AI assistant for ophthalmic technicians providing clinical workflow support, diagnostic assistance, and documentation help.',
    capabilities: [
      {
        id: 'pretesting_workflow',
        name: 'Pre-Testing Workflow',
        icon: '🔬',
        description: 'Guided pre-testing protocols and checklists',
        automations: [
          'Patient-specific test recommendations',
          'Equipment calibration reminders',
          'Test result validation',
          'Critical value alerts',
          'Protocol compliance tracking',
        ],
        status: 'active',
      },
      {
        id: 'diagnostic_support',
        name: 'Diagnostic Support',
        icon: '🩺',
        description: 'AI-assisted diagnostic interpretation',
        automations: [
          'OCT scan quality assessment',
          'Visual field progression analysis',
          'IOP trend monitoring',
          'Comparison to previous visits',
          'Abnormality flagging',
        ],
        status: 'active',
      },
      {
        id: 'documentation_assist',
        name: 'Documentation Assistant',
        icon: '📝',
        description: 'Automated clinical documentation',
        automations: [
          'Voice-to-text note capture',
          'Auto-populate common findings',
          'Template suggestions',
          'Missing documentation alerts',
          'Quality documentation scoring',
        ],
        status: 'active',
      },
      {
        id: 'patient_education',
        name: 'Patient Education',
        icon: '📚',
        description: 'Personalized patient education delivery',
        automations: [
          'Condition-specific education materials',
          'Post-procedure instructions',
          'Medication teaching aids',
          'Lifestyle recommendations',
          'Video/animation delivery',
        ],
        status: 'active',
      },
    ],
    quickActions: [
      { id: 'next_patient', label: '👤 Next Patient', action: 'Prepare for next patient with history' },
      { id: 'test_protocol', label: '🔬 Test Protocol', action: 'Show recommended tests for current patient' },
      { id: 'compare_results', label: '📈 Compare Results', action: 'Compare to previous visit results' },
      { id: 'document_visit', label: '📝 Quick Document', action: 'Start documentation with templates' },
    ],
  },

  billing: {
    id: 'billing',
    name: 'Billing AI',
    icon: '💰',
    avatar: '🤖',
    color: '#F59E0B',
    tagline: 'Maximize revenue, minimize denials',
    description: 'AI-powered billing assistant that optimizes coding, reduces denials, accelerates collections, and ensures compliance.',
    capabilities: [
      {
        id: 'coding_optimization',
        name: 'Smart Coding Assistant',
        icon: '🏷️',
        description: 'AI-driven coding suggestions and optimization',
        automations: [
          'Real-time CPT/ICD-10 suggestions',
          'Modifier recommendations',
          'Bundling/unbundling alerts',
          'LCD/NCD compliance checks',
          'Documentation-to-code matching',
        ],
        status: 'active',
      },
      {
        id: 'claim_management',
        name: 'Claims Intelligence',
        icon: '📄',
        description: 'Automated claim scrubbing and submission',
        automations: [
          'Pre-submission claim scrubbing',
          'Payer-specific rule validation',
          'Clean claim rate tracking',
          'Automatic claim status updates',
          'Appeal letter generation',
        ],
        status: 'active',
      },
      {
        id: 'denial_management',
        name: 'Denial Prevention & Recovery',
        icon: '🚫',
        description: 'Proactive denial management',
        automations: [
          'Denial pattern analysis',
          'Root cause identification',
          'Auto-generated appeal templates',
          'Payer behavior prediction',
          'Denial prevention recommendations',
        ],
        status: 'active',
      },
      {
        id: 'ar_management',
        name: 'AR Optimization',
        icon: '💵',
        description: 'Accelerate collections and reduce AR days',
        automations: [
          'Aging bucket prioritization',
          'Automated follow-up scheduling',
          'Payment plan recommendations',
          'Collection likelihood scoring',
          'Write-off recommendations',
        ],
        status: 'active',
      },
    ],
    quickActions: [
      { id: 'review_claims', label: '📄 Review Claims', action: 'Show claims ready for submission' },
      { id: 'denial_queue', label: '🚫 Denial Queue', action: 'Review today\'s denials' },
      { id: 'ar_aging', label: '📊 AR Aging', action: 'Show AR aging report' },
      { id: 'coding_audit', label: '🔍 Coding Audit', action: 'Run coding compliance audit' },
    ],
  },

  checkout: {
    id: 'checkout',
    name: 'Checkout AI',
    icon: '🛒',
    avatar: '🤖',
    color: '#EC4899',
    tagline: 'Streamlined checkout & optical sales',
    description: 'AI assistant for patient checkout, optical sales, scheduling follow-ups, and payment collection.',
    capabilities: [
      {
        id: 'checkout_workflow',
        name: 'Smart Checkout',
        icon: '✅',
        description: 'Streamlined patient checkout process',
        automations: [
          'Auto-populate checkout checklist',
          'Outstanding balance alerts',
          'Prescription ready notifications',
          'Follow-up scheduling prompts',
          'Patient satisfaction quick survey',
        ],
        status: 'active',
      },
      {
        id: 'optical_sales',
        name: 'Optical Sales Assistant',
        icon: '👓',
        description: 'AI-powered optical product recommendations',
        automations: [
          'Frame recommendations based on Rx',
          'Lens upgrade suggestions',
          'Insurance benefit optimization',
          'Package deal recommendations',
          'Inventory availability check',
        ],
        status: 'active',
      },
      {
        id: 'payment_collection',
        name: 'Payment Intelligence',
        icon: '💳',
        description: 'Optimize payment collection',
        automations: [
          'Real-time eligibility verification',
          'Copay/deductible calculation',
          'Payment plan setup',
          'HSA/FSA payment processing',
          'Receipt and statement generation',
        ],
        status: 'active',
      },
      {
        id: 'followup_scheduling',
        name: 'Follow-Up Coordinator',
        icon: '📅',
        description: 'Intelligent follow-up appointment scheduling',
        automations: [
          'Recommended follow-up interval',
          'Provider availability matching',
          'Recall reminder setup',
          'Referral coordination',
          'Pre-surgery scheduling',
        ],
        status: 'active',
      },
    ],
    quickActions: [
      { id: 'checkout_patient', label: '✅ Checkout', action: 'Start checkout for current patient' },
      { id: 'optical_order', label: '👓 Optical Order', action: 'Create optical order' },
      { id: 'collect_payment', label: '💳 Collect Payment', action: 'Process patient payment' },
      { id: 'schedule_followup', label: '📅 Schedule F/U', action: 'Schedule follow-up appointment' },
    ],
  },

  insurance_verification: {
    id: 'insurance_verification',
    name: 'Insurance AI',
    icon: '🔍',
    avatar: '🤖',
    color: '#14B8A6',
    tagline: 'Real-time verification & benefits intelligence',
    description: 'AI assistant that automates insurance verification, benefits discovery, and prior authorization management.',
    capabilities: [
      {
        id: 'eligibility_verification',
        name: 'Real-Time Eligibility',
        icon: '✓',
        description: 'Instant insurance eligibility verification',
        automations: [
          'Batch eligibility verification',
          'Real-time coverage checks',
          'Policy effective date validation',
          'Coordination of benefits detection',
          'Coverage termination alerts',
        ],
        status: 'active',
      },
      {
        id: 'benefits_discovery',
        name: 'Benefits Intelligence',
        icon: '📋',
        description: 'Comprehensive benefits discovery and analysis',
        automations: [
          'Vision vs medical benefit routing',
          'Deductible/OOP tracking',
          'Copay/coinsurance calculation',
          'Frequency limitations tracking',
          'In-network provider verification',
        ],
        status: 'active',
      },
      {
        id: 'prior_auth',
        name: 'Prior Authorization Manager',
        icon: '📝',
        description: 'Automated prior authorization workflows',
        automations: [
          'Auth requirement prediction',
          'Auto-submit routine authorizations',
          'Status tracking & alerts',
          'Renewal reminders',
          'Appeal assistance',
        ],
        status: 'active',
      },
      {
        id: 'payer_intelligence',
        name: 'Payer Intelligence',
        icon: '🏢',
        description: 'Payer-specific rules and requirements',
        automations: [
          'Payer rule database',
          'Policy change alerts',
          'Fee schedule comparisons',
          'Payer performance scoring',
          'Contract term reminders',
        ],
        status: 'active',
      },
    ],
    quickActions: [
      { id: 'verify_batch', label: '🔄 Batch Verify', action: 'Verify tomorrow\'s appointments' },
      { id: 'check_auth', label: '📝 Check Auth', action: 'Review pending authorizations' },
      { id: 'benefits_lookup', label: '📋 Benefits Lookup', action: 'Look up patient benefits' },
      { id: 'payer_rules', label: '🏢 Payer Rules', action: 'View payer-specific rules' },
    ],
  },
};

// =============================================
// SIMULATED AI CHAT RESPONSES
// =============================================

const AI_RESPONSES = {
  practice_manager: {
    greeting: "Good morning! I'm your Practice Manager AI. I've analyzed overnight data and have 3 insights ready for your review. Your practice is performing 12% above regional benchmarks this month.",
    daily_briefing: `📋 **Daily Practice Briefing - ${new Date().toLocaleDateString()}**

**Today's Schedule:**
• 47 patients scheduled across 3 providers
• 2 surgical cases (Dr. Smith: cataract, Dr. Jones: laser)
• 3 new patient appointments

**Key Metrics (MTD):**
• Revenue: $342,500 (↑8% vs target)
• Collections: 96.2%
• No-show rate: 4.1% (below 5% target ✓)

**Action Items:**
1. ⚠️ Review 2 prior auth requests expiring tomorrow
2. 📞 Follow up on $12,400 in claims >60 days
3. 👥 Approve Jennifer's PTO request for next week

**Alerts:**
• Dr. Chen's schedule is 92% full for next week
• Inventory alert: OCT ribbons running low`,
  },
  receptionist: {
    greeting: "Hello! I'm your Front Desk AI assistant. I've already verified insurance for 92% of tomorrow's patients and sent appointment reminders. 3 patients confirmed via text this morning.",
    check_arrivals: `👋 **Today's Arrivals - ${new Date().toLocaleDateString()}**

**Expected Patients: 47**
• Confirmed: 41 (87%)
• Pending confirmation: 4
• High no-show risk: 2 ⚠️

**Next 3 Arrivals:**
1. **Maria Garcia** - 9:00 AM with Dr. Smith
   • New patient, forms completed online ✓
   • Copay: $40 (Vision)

2. **Robert Johnson** - 9:15 AM with Dr. Chen
   • Follow-up, diabetic retinopathy
   • Copay: $25 (Medical) + $180 deductible remaining

3. **Susan Williams** - 9:30 AM with Dr. Jones
   • Pre-op cataract eval
   • Auth verified ✓, no copay

**Cancellation Alert:**
• 2:30 PM slot opened - 3 patients on waitlist notified`,
  },
  medical_technician: {
    greeting: "Hi! I'm your Clinical AI assistant. I've reviewed today's patient charts and prepared testing protocols. 5 patients need OCT scans, 3 need visual fields, and 2 are pre-op evaluations.",
    next_patient: `👤 **Next Patient Prep - Maria Garcia**

**Visit Type:** New Patient Comprehensive Exam
**Chief Complaint:** Blurry vision, especially reading
**Provider:** Dr. Smith

**Medical History Flags:**
• Diabetes Type 2 (A1c: 7.2, 3 months ago)
• HTN - controlled
• No known drug allergies

**Recommended Testing Protocol:**
1. ✅ Autorefraction/Keratometry
2. ✅ NCT (IOP screening)
3. ✅ OCT Macula (diabetic screening)
4. ✅ Fundus photos
5. ⏳ Visual field if indicated

**Previous Records:**
• Last exam: 2 years ago (different practice)
• Records requested - pending

**AI Recommendations:**
• Dilated exam recommended given DM history
• Consider OCT RNFL given age and DM`,
  },
  billing: {
    greeting: "Good morning! I'm your Billing AI. I processed 34 claims overnight with a 97% clean claim rate. I've flagged 2 claims that need attention before submission and identified $8,200 in potential undercoding.",
    review_claims: `📄 **Claims Ready for Review**

**Clean Claims (32):** ✅ Ready to submit
**Flagged for Review (2):** ⚠️ Action needed

---

**Flagged Claim #1 - Johnson, Robert**
• Issue: Missing modifier for bilateral procedure
• Recommendation: Add -50 modifier to 92250
• Impact: +$45 expected reimbursement

**Flagged Claim #2 - Williams, Susan**
• Issue: LCD requires additional diagnosis
• Recommendation: Add H35.31 to support 92134
• Impact: Prevents likely denial

---

**Coding Optimization Alerts:**
1. Dr. Smith: 5 visits may qualify for 99215 (coded as 99214)
   💰 Potential: +$125
2. Dr. Chen: OCT interpretation not billed on 3 visits
   💰 Potential: +$180

**Today's Submission Summary:**
• Total charges: $18,450
• Expected reimbursement: $12,280
• Clean claim rate: 97%`,
  },
  checkout: {
    greeting: "Hello! I'm your Checkout AI. I'll help ensure smooth checkouts with all follow-ups scheduled and payments collected. The optical lab confirmed 4 glasses orders are ready for pickup today.",
    checkout_patient: `✅ **Checkout - Maria Garcia**

**Visit Summary:**
• Provider: Dr. Smith
• Diagnosis: Presbyopia, Diabetic without retinopathy
• New Rx issued: Progressive lenses

**Financial Summary:**
| Item | Amount |
|------|--------|
| Copay collected | $40.00 |
| Outstanding balance | $0.00 |

**Optical Recommendations:**
👓 Based on Rx and lifestyle, I recommend:
1. **Premium Progressive** - Digital free-form
2. **Blue light coating** - Computer use
3. **Photochromic option** - Outdoor activities

Estimated insurance coverage: $150 allowance
Est. patient cost: $280-$450 depending on selection

**Follow-Up Required:**
📅 Recommended: 12 months (routine)
⚠️ Diabetic recall: 6 months for dilated exam

**Ready to schedule?**`,
  },
  insurance_verification: {
    greeting: "Hi! I'm your Insurance AI. I've completed batch verification for tomorrow's schedule - 45 of 48 patients verified. 3 require manual review due to policy changes I detected.",
    verify_batch: `🔄 **Batch Verification Results**
**Tomorrow's Schedule: ${new Date(Date.now() + 86400000).toLocaleDateString()}**

**Verified: 45/48 (94%)**

✅ **Active Coverage (42)**
• Vision plans: 18
• Medical plans: 24

⚠️ **Alerts (3)**

1. **Chen, Michael** - 10:30 AM
   • Issue: Policy termed 3/1/2026
   • Action: Contact patient for updated info
   
2. **Davis, Patricia** - 1:15 PM  
   • Issue: Deductible reset (new year)
   • Patient responsibility: $500 deductible applies
   
3. **Brown, James** - 3:00 PM
   • Issue: Prior auth expired 3/10/2026
   • Action: Submit new auth request (surgery scheduled 3/25)

**Benefits Summary:**
• Avg copay: $32
• Patients with met deductible: 28 (67%)
• Prior auths verified: 8/8 ✓`,
  },
};

// =============================================
// COMPONENT: ChatMessage
// =============================================

const ChatMessage = ({ message, isAI, assistantColor }) => (
  <div style={{
    display: 'flex',
    justifyContent: isAI ? 'flex-start' : 'flex-end',
    marginBottom: '16px',
  }}>
    <div style={{
      maxWidth: '85%',
      padding: '16px',
      borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
      background: isAI ? COLORS.white : assistantColor,
      color: isAI ? COLORS.text : COLORS.white,
      boxShadow: SHADOWS.sm,
      border: isAI ? `1px solid ${COLORS.border}` : 'none',
    }}>
      <div style={{ 
        fontSize: '14px', 
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
      }} dangerouslySetInnerHTML={{ __html: message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
    </div>
  </div>
);

// =============================================
// COMPONENT: CapabilityCard
// =============================================

const CapabilityCard = ({ capability, color, onActivate }) => (
  <div style={{
    background: COLORS.white,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${COLORS.border}`,
    transition: 'all 0.2s ease',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
      }}>{capability.icon}</div>
      <div>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: COLORS.text }}>{capability.name}</h4>
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '10px',
          background: capability.status === 'active' ? '#DCFCE7' : '#FEF3C7',
          color: capability.status === 'active' ? '#16A34A' : '#D97706',
        }}>{capability.status === 'active' ? '● Active' : '○ Inactive'}</span>
      </div>
    </div>
    <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 0 12px 0' }}>{capability.description}</p>
    <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '12px' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>Automations</p>
      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: COLORS.text }}>
        {capability.automations.slice(0, 3).map((auto, idx) => (
          <li key={idx} style={{ marginBottom: '4px' }}>{auto}</li>
        ))}
        {capability.automations.length > 3 && (
          <li style={{ color: COLORS.textSecondary }}>+{capability.automations.length - 3} more...</li>
        )}
      </ul>
    </div>
  </div>
);

// =============================================
// COMPONENT: AssistantPanel
// =============================================

const AssistantPanel = ({ assistant, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    // Initial greeting
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{ text: AI_RESPONSES[assistant.id]?.greeting || `Hello! I'm your ${assistant.name}. How can I help you today?`, isAI: true }]);
      setIsTyping(false);
    }, 1000);
  }, [assistant.id, assistant.name]);

  const handleQuickAction = (action) => {
    setMessages(prev => [...prev, { text: action.label, isAI: false }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const responseKey = action.id.split('_').slice(0, 2).join('_');
      const response = AI_RESPONSES[assistant.id]?.[action.id] || 
                       AI_RESPONSES[assistant.id]?.[responseKey] ||
                       `I'm processing your request for: ${action.action}. This feature is being configured for your practice.`;
      setMessages(prev => [...prev, { text: response, isAI: true }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { text: inputValue, isAI: false }]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `I understand you're asking about "${inputValue}". Let me analyze the data and provide insights. This AI assistant is learning your practice patterns to provide increasingly personalized recommendations.`,
        isAI: true 
      }]);
      setIsTyping(false);
    }, 2000);
  };

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
        background: COLORS.white,
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: 'calc(100vh - 60px)',
        overflow: 'hidden',
        boxShadow: SHADOWS.xl,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${assistant.color} 0%, ${assistant.color}DD 100%)`,
          padding: '24px 32px',
          color: 'white',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}>{assistant.icon}</div>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{assistant.name}</h2>
                <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>{assistant.tagline}</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '24px',
            }}>×</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.background,
          flexShrink: 0,
        }}>
          {['chat', 'capabilities', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '14px 24px',
                border: 'none',
                background: activeTab === tab ? COLORS.white : 'transparent',
                borderBottom: activeTab === tab ? `3px solid ${assistant.color}` : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? assistant.color : COLORS.textSecondary,
                textTransform: 'capitalize',
              }}
            >{tab === 'chat' ? '💬 Chat' : tab === 'capabilities' ? '⚡ Capabilities' : '⚙️ Settings'}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {activeTab === 'chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Messages */}
              <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                {messages.map((msg, idx) => (
                  <ChatMessage key={idx} message={msg.text} isAI={msg.isAI} assistantColor={assistant.color} />
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.textSecondary, fontSize: '14px' }}>
                    <span style={{ animation: 'pulse 1.5s infinite' }}>●</span>
                    <span>{assistant.name} is typing...</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`, background: COLORS.background }}>
                <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Quick Actions:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {assistant.quickActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      style={{
                        padding: '8px 14px',
                        background: COLORS.white,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: COLORS.text,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = assistant.color}
                      onMouseOut={e => e.currentTarget.style.borderColor = COLORS.border}
                    >{action.label}</button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Ask ${assistant.name} anything...`}
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      padding: '14px 24px',
                      background: assistant.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >Send</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {assistant.capabilities.map(cap => (
                  <CapabilityCard key={cap.id} capability={cap} color={assistant.color} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              <div style={{ maxWidth: '600px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: COLORS.text }}>Assistant Settings</h3>
                
                {/* Automation Settings */}
                <div style={{ background: COLORS.background, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px' }}>Automation Level</h4>
                  {['Suggest Only', 'Suggest & Ask', 'Auto-Execute'].map((level, idx) => (
                    <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input type="radio" name="automation" defaultChecked={idx === 1} style={{ accentColor: assistant.color }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{level}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: COLORS.textSecondary }}>
                          {idx === 0 ? 'AI provides suggestions, you take action' : 
                           idx === 1 ? 'AI suggests and asks for confirmation' :
                           'AI executes routine tasks automatically'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Notification Preferences */}
                <div style={{ background: COLORS.background, borderRadius: '12px', padding: '20px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px' }}>Notifications</h4>
                  {['Critical alerts', 'Daily summaries', 'Task completions', 'Learning suggestions'].map((pref, idx) => (
                    <label key={pref} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={idx < 2} style={{ accentColor: assistant.color, width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '14px' }}>{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================
// MAIN COMPONENT: AIStaffAssistants
// =============================================

export default function AIStaffAssistants({ onClose }) {
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const assistantList = Object.values(AI_ASSISTANTS);
  
  const filteredAssistants = useMemo(() => {
    if (!searchQuery) return assistantList;
    const query = searchQuery.toLowerCase();
    return assistantList.filter(a => 
      a.name.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.capabilities.some(c => c.name.toLowerCase().includes(query))
    );
  }, [searchQuery, assistantList]);

  // Metrics
  const totalAutomations = assistantList.reduce((sum, a) => 
    sum + a.capabilities.reduce((s, c) => s + c.automations.length, 0), 0
  );

  if (selectedAssistant) {
    return <AssistantPanel assistant={selectedAssistant} onClose={() => setSelectedAssistant(null)} />;
  }

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
      zIndex: 9999,
      padding: '40px 20px 20px 20px',
      overflowY: 'auto',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
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
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a69bd 100%)',
          padding: '32px',
          color: 'white',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>🤖 AI Staff Assistants</h2>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}>MedPact Platinum</span>
              </div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '16px', maxWidth: '600px' }}>
                Role-specific AI assistants that automate routine tasks, provide intelligent recommendations, 
                and help your staff work more efficiently.
              </p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '24px',
            }}>×</button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '24px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>{assistantList.length}</p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '13px' }}>AI Assistants</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>{assistantList.reduce((s, a) => s + a.capabilities.length, 0)}</p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '13px' }}>Capabilities</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>{totalAutomations}</p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '13px' }}>Automations</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>24/7</p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '13px' }}>Available</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '20px 32px', borderBottom: `1px solid ${COLORS.border}` }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assistants or capabilities..."
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '12px 16px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Assistant Grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filteredAssistants.map(assistant => (
              <div
                key={assistant.id}
                onClick={() => setSelectedAssistant(assistant)}
                style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${COLORS.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: SHADOWS.sm,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = SHADOWS.lg;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = SHADOWS.sm;
                }}
              >
                {/* Card Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${assistant.color} 0%, ${assistant.color}CC 100%)`,
                  padding: '24px',
                  color: 'white',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                    }}>{assistant.icon}</div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{assistant.name}</h3>
                      <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '13px' }}>{assistant.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {assistant.description}
                  </p>

                  {/* Capabilities Preview */}
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                      Key Capabilities
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {assistant.capabilities.slice(0, 3).map(cap => (
                        <span key={cap.id} style={{
                          padding: '4px 10px',
                          background: `${assistant.color}10`,
                          color: assistant.color,
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 500,
                        }}>{cap.icon} {cap.name}</span>
                      ))}
                      {assistant.capabilities.length > 3 && (
                        <span style={{
                          padding: '4px 10px',
                          background: COLORS.background,
                          color: COLORS.textSecondary,
                          borderRadius: '20px',
                          fontSize: '11px',
                        }}>+{assistant.capabilities.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: assistant.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}>
                    💬 Chat with {assistant.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 32px',
          background: COLORS.background,
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '13px', color: COLORS.textSecondary }}>
            AI Staff Assistants • Powered by MedPact Intelligence Engine
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
          }}>Platinum Feature</span>
        </div>
      </div>
    </div>
  );
}

AIStaffAssistants.propTypes = {
  onClose: PropTypes.func.isRequired,
};
