import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// =============================================
// STAFF INTELLIGENCE - AI-Powered Workforce Analytics
// Survey generation, role tracking, time allocation,
// effectiveness improvement with strategic intent alignment
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
// STAFF ROLES & DATA
// =============================================

const STAFF_ROLES = [
  { id: 'receptionist', name: 'Receptionist', icon: '👋', color: '#059669', avgSalary: 42000 },
  { id: 'ophthalmic_tech', name: 'Ophthalmic Technician', icon: '👁️', color: '#0EA5E9', avgSalary: 52000 },
  { id: 'scribe', name: 'Medical Scribe', icon: '📝', color: '#8B5CF6', avgSalary: 38000 },
  { id: 'billing_specialist', name: 'Billing Specialist', icon: '💰', color: '#F59E0B', avgSalary: 48000 },
  { id: 'optician', name: 'Optician', icon: '👓', color: '#EC4899', avgSalary: 45000 },
  { id: 'surgical_coordinator', name: 'Surgical Coordinator', icon: '📋', color: '#6366F1', avgSalary: 55000 },
  { id: 'practice_manager', name: 'Practice Manager', icon: '👔', color: '#14B8A6', avgSalary: 72000 },
  { id: 'medical_assistant', name: 'Medical Assistant', icon: '🩺', color: '#EF4444', avgSalary: 40000 },
  { id: 'call_center', name: 'Call Center Rep', icon: '📞', color: '#84CC16', avgSalary: 36000 },
  { id: 'insurance_verifier', name: 'Insurance Verifier', icon: '🔍', color: '#F97316', avgSalary: 42000 },
];

const SAMPLE_STAFF = [
  { id: 1, name: 'Emily Chen', role: 'receptionist', assignedRole: 'receptionist', hireDate: '2023-06-15', status: 'active', efficiency: 94, hoursPerWeek: 40 },
  { id: 2, name: 'Marcus Johnson', role: 'ophthalmic_tech', assignedRole: 'ophthalmic_tech', hireDate: '2022-03-20', status: 'active', efficiency: 97, hoursPerWeek: 40 },
  { id: 3, name: 'Sarah Williams', role: 'billing_specialist', assignedRole: 'billing_specialist', hireDate: '2021-11-08', status: 'active', efficiency: 91, hoursPerWeek: 40 },
  { id: 4, name: 'David Park', role: 'ophthalmic_tech', assignedRole: 'scribe', hireDate: '2024-01-10', status: 'active', efficiency: 78, hoursPerWeek: 40 },
  { id: 5, name: 'Jennifer Adams', role: 'surgical_coordinator', assignedRole: 'surgical_coordinator', hireDate: '2020-08-22', status: 'active', efficiency: 96, hoursPerWeek: 45 },
  { id: 6, name: 'Michael Torres', role: 'optician', assignedRole: 'optician', hireDate: '2023-02-14', status: 'active', efficiency: 89, hoursPerWeek: 38 },
  { id: 7, name: 'Lisa Rodriguez', role: 'practice_manager', assignedRole: 'practice_manager', hireDate: '2019-05-01', status: 'active', efficiency: 98, hoursPerWeek: 50 },
  { id: 8, name: 'Kevin Brown', role: 'medical_assistant', assignedRole: 'receptionist', hireDate: '2024-02-28', status: 'active', efficiency: 72, hoursPerWeek: 40 },
  { id: 9, name: 'Amanda Foster', role: 'call_center', assignedRole: 'call_center', hireDate: '2023-09-05', status: 'active', efficiency: 86, hoursPerWeek: 40 },
  { id: 10, name: 'Robert Kim', role: 'insurance_verifier', assignedRole: 'insurance_verifier', hireDate: '2022-07-18', status: 'active', efficiency: 93, hoursPerWeek: 40 },
];

// =============================================
// STRATEGIC INTENTS
// =============================================

const STRATEGIC_INTENTS = [
  {
    id: 'growth',
    name: 'Grow the Practice',
    icon: '📈',
    color: '#059669',
    description: 'Focus on expanding capacity, adding services, and increasing patient volume',
    metrics: ['New patient acquisition', 'Service line expansion', 'Marketing effectiveness', 'Capacity utilization'],
    surveyFocus: ['Capacity constraints', 'Growth opportunities', 'Skills gaps', 'Training needs'],
  },
  {
    id: 'efficiency',
    name: 'Improve Efficiency',
    icon: '⚡',
    color: '#0EA5E9',
    description: 'Optimize workflows, reduce waste, and improve staff productivity',
    metrics: ['Time per task', 'Workflow bottlenecks', 'Process automation', 'Error rates'],
    surveyFocus: ['Workflow pain points', 'Time allocation', 'Tool effectiveness', 'Process improvements'],
  },
  {
    id: 'cost_reduction',
    name: 'Reduce Costs',
    icon: '💵',
    color: '#F59E0B',
    description: 'Identify savings opportunities while maintaining quality of care',
    metrics: ['Labor cost per encounter', 'Overtime hours', 'Resource utilization', 'Waste reduction'],
    surveyFocus: ['Redundant tasks', 'Overtime causes', 'Resource waste', 'Automation candidates'],
  },
];

// =============================================
// AI SURVEY TEMPLATES
// =============================================

const AI_SURVEY_TEMPLATES = {
  role_alignment: {
    title: 'Role Alignment Assessment',
    description: 'Evaluate if actual work matches assigned job responsibilities',
    questions: [
      { id: 'ra1', text: 'What percentage of your time do you spend on tasks within your job description?', type: 'slider', min: 0, max: 100 },
      { id: 'ra2', text: 'List the top 3 tasks you perform most frequently', type: 'multi_text', count: 3 },
      { id: 'ra3', text: 'Are there tasks you perform that should be assigned to a different role?', type: 'yes_no_explain' },
      { id: 'ra4', text: 'Do you have skills that are underutilized in your current role?', type: 'yes_no_explain' },
      { id: 'ra5', text: 'Rate your satisfaction with your current role alignment', type: 'rating', scale: 5 },
    ],
  },
  time_allocation: {
    title: 'Time Allocation Analysis',
    description: 'Understand how staff spend their time throughout the workday',
    questions: [
      { id: 'ta1', text: 'Estimate time spent on direct patient care (hours/day)', type: 'number', unit: 'hours' },
      { id: 'ta2', text: 'Estimate time spent on administrative tasks (hours/day)', type: 'number', unit: 'hours' },
      { id: 'ta3', text: 'Estimate time spent waiting/idle (hours/day)', type: 'number', unit: 'hours' },
      { id: 'ta4', text: 'What is your biggest time waster?', type: 'text' },
      { id: 'ta5', text: 'If you had one extra hour per day, how would you use it?', type: 'text' },
    ],
  },
  effectiveness: {
    title: 'Effectiveness Improvement',
    description: 'Gather ideas for improving individual and team effectiveness',
    questions: [
      { id: 'ef1', text: 'What tools or resources would help you be more effective?', type: 'text' },
      { id: 'ef2', text: 'What training would benefit you most?', type: 'multi_select', options: ['Clinical skills', 'Technology', 'Customer service', 'Leadership', 'Billing/Coding', 'Communication'] },
      { id: 'ef3', text: 'Rate the effectiveness of current workflows', type: 'rating', scale: 5 },
      { id: 'ef4', text: 'What process causes you the most frustration?', type: 'text' },
      { id: 'ef5', text: 'Share one idea to improve team productivity', type: 'text' },
    ],
  },
  growth_focused: {
    title: 'Growth Readiness Survey',
    description: 'Assess capacity and readiness for practice growth',
    questions: [
      { id: 'gf1', text: 'Could you handle 20% more patients with current resources?', type: 'yes_no_explain' },
      { id: 'gf2', text: 'What bottleneck limits our ability to grow?', type: 'text' },
      { id: 'gf3', text: 'What new services could we offer with current staff?', type: 'text' },
      { id: 'gf4', text: 'Are you interested in expanding your responsibilities?', type: 'yes_no_explain' },
      { id: 'gf5', text: 'Rate your workload capacity', type: 'slider', min: 0, max: 100, labels: ['Underutilized', 'Optimal', 'Overloaded'] },
    ],
  },
  cost_reduction: {
    title: 'Cost Optimization Survey',
    description: 'Identify opportunities to reduce costs and eliminate waste',
    questions: [
      { id: 'cr1', text: 'What tasks do you perform that could be automated?', type: 'text' },
      { id: 'cr2', text: 'Do you see resources being wasted? Describe.', type: 'text' },
      { id: 'cr3', text: 'What causes overtime in your department?', type: 'text' },
      { id: 'cr4', text: 'Are there duplicate tasks across team members?', type: 'yes_no_explain' },
      { id: 'cr5', text: 'What vendor/supply costs seem excessive?', type: 'text' },
    ],
  },
};

// =============================================
// AI GENERATED INSIGHTS (Simulated)
// =============================================

const AI_INSIGHTS = [
  {
    id: 1,
    type: 'misalignment',
    severity: 'high',
    title: 'Role Misalignment Detected',
    description: 'David Park (Ophthalmic Tech) is spending 60% of time on scribe duties. Consider formal role transition or training.',
    impact: '$8,400/year in productivity loss',
    recommendation: 'Reassign scribe duties or promote to dual-role position',
    icon: '⚠️',
  },
  {
    id: 2,
    type: 'efficiency',
    severity: 'medium',
    title: 'Scheduling Bottleneck Identified',
    description: 'Receptionists spend average 45 min/day on phone scheduling. Online booking could reduce this by 70%.',
    impact: '15 hours/week recovered',
    recommendation: 'Implement patient self-scheduling portal',
    icon: '⏱️',
  },
  {
    id: 3,
    type: 'training',
    severity: 'low',
    title: 'Training Opportunity',
    description: '3 staff members expressed interest in cross-training for surgical coordination.',
    impact: 'Improved coverage and flexibility',
    recommendation: 'Create cross-training program for interested staff',
    icon: '📚',
  },
  {
    id: 4,
    type: 'cost',
    severity: 'high',
    title: 'Overtime Pattern Detected',
    description: 'Billing department averaging 8 hours overtime/week during month-end close.',
    impact: '$12,480/year in overtime costs',
    recommendation: 'Redistribute workload or add part-time support',
    icon: '💰',
  },
  {
    id: 5,
    type: 'growth',
    severity: 'medium',
    title: 'Capacity Available',
    description: 'Survey results show 40% of staff report capacity for additional patients.',
    impact: 'Potential for 15% volume increase',
    recommendation: 'Target marketing to increase patient acquisition',
    icon: '📈',
  },
];

// =============================================
// SURVEY SCHEDULE DATA
// =============================================

const SURVEY_SCHEDULES = [
  { id: 1, name: 'Monthly Role Check-in', frequency: 'monthly', template: 'role_alignment', nextRun: '2026-04-01', status: 'active', recipients: 10, lastCompletion: 85 },
  { id: 2, name: 'Quarterly Time Study', frequency: 'quarterly', template: 'time_allocation', nextRun: '2026-04-15', status: 'active', recipients: 10, lastCompletion: 92 },
  { id: 3, name: 'Annual Effectiveness Review', frequency: 'annual', template: 'effectiveness', nextRun: '2026-12-01', status: 'active', recipients: 10, lastCompletion: 78 },
  { id: 4, name: 'Growth Readiness Check', frequency: 'quarterly', template: 'growth_focused', nextRun: '2026-04-15', status: 'paused', recipients: 10, lastCompletion: 0 },
];

// =============================================
// COMPONENT: MetricCard
// =============================================

const MetricCard = ({ label, value, change, icon, color }) => (
  <div style={{
    background: COLORS.white,
    borderRadius: '16px',
    padding: '20px',
    boxShadow: SHADOWS.md,
    border: `1px solid ${COLORS.border}`,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '8px' }}>{label}</p>
        <p style={{ fontSize: '28px', fontWeight: 700, color: COLORS.text }}>{value}</p>
        {change && (
          <p style={{ 
            fontSize: '13px', 
            color: change.startsWith('+') ? COLORS.primary : COLORS.danger,
            marginTop: '4px',
          }}>{change}</p>
        )}
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        background: `${color}15`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
      }}>{icon}</div>
    </div>
  </div>
);

// =============================================
// COMPONENT: StaffRow
// =============================================

const StaffRow = ({ staff, roles, onViewDetails }) => {
  const role = roles.find(r => r.id === staff.role);
  const assignedRole = roles.find(r => r.id === staff.assignedRole);
  const isMisaligned = staff.role !== staff.assignedRole;
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 150px 150px 100px 100px 120px',
      gap: '16px',
      padding: '16px',
      borderBottom: `1px solid ${COLORS.border}`,
      alignItems: 'center',
      background: isMisaligned ? '#FEF3C7' : 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: `${role?.color || COLORS.primary}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
        }}>{role?.icon || '👤'}</div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '14px', color: COLORS.text }}>{staff.name}</p>
          <p style={{ fontSize: '12px', color: COLORS.textSecondary }}>{role?.name}</p>
        </div>
      </div>
      <div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          background: `${assignedRole?.color || COLORS.primary}20`,
          color: assignedRole?.color || COLORS.primary,
        }}>{assignedRole?.name}</span>
      </div>
      <div>
        {isMisaligned && (
          <span style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            background: '#FEE2E2',
            color: '#DC2626',
            fontWeight: 600,
          }}>⚠️ Misaligned</span>
        )}
        {!isMisaligned && (
          <span style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            background: '#DCFCE7',
            color: '#16A34A',
          }}>✓ Aligned</span>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: staff.efficiency >= 90 ? COLORS.primary : staff.efficiency >= 75 ? COLORS.warning : COLORS.danger,
        }}>{staff.efficiency}%</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: '14px', color: COLORS.text }}>
        {staff.hoursPerWeek}h
      </div>
      <button
        onClick={() => onViewDetails(staff)}
        style={{
          padding: '6px 12px',
          background: COLORS.primary,
          color: COLORS.white,
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >View Details</button>
    </div>
  );
};

// =============================================
// COMPONENT: SurveyBuilder
// =============================================

const SurveyBuilder = ({ template, intent, onClose, onGenerate }) => {
  const [surveyName, setSurveyName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [frequency, setFrequency] = useState('monthly');
  const [generating, setGenerating] = useState(false);
  
  const templateData = AI_SURVEY_TEMPLATES[template] || AI_SURVEY_TEMPLATES.role_alignment;
  
  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      onGenerate({
        name: surveyName || `${templateData.title} - ${new Date().toLocaleDateString()}`,
        template,
        frequency,
        questions: selectedQuestions.length > 0 ? selectedQuestions : templateData.questions.map(q => q.id),
        intent,
      });
      setGenerating(false);
    }, 2000);
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: COLORS.white,
        borderRadius: '20px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: SHADOWS.xl,
      }}>
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>🤖 AI Survey Builder</h3>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Generate intelligent surveys based on your strategic intent</p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '18px',
            }}>×</button>
          </div>
        </div>
        
        <div style={{ padding: '24px', maxHeight: '50vh', overflow: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Survey Name</label>
            <input
              type="text"
              value={surveyName}
              onChange={(e) => setSurveyName(e.target.value)}
              placeholder={templateData.title}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Frequency</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['weekly', 'monthly', 'quarterly', 'annual'].map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  style={{
                    padding: '8px 16px',
                    border: `2px solid ${frequency === f ? COLORS.accent : COLORS.border}`,
                    borderRadius: '8px',
                    background: frequency === f ? `${COLORS.accent}10` : 'transparent',
                    color: frequency === f ? COLORS.accent : COLORS.text,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: frequency === f ? 600 : 400,
                  }}
                >{f}</button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
              AI-Generated Questions ({templateData.questions.length} questions)
            </label>
            {templateData.questions.map((q, idx) => (
              <div key={q.id} style={{
                padding: '12px',
                background: COLORS.background,
                borderRadius: '8px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedQuestions(prev => [...prev, q.id]);
                    } else {
                      setSelectedQuestions(prev => prev.filter(id => id !== q.id));
                    }
                  }}
                  style={{ width: '18px', height: '18px' }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: COLORS.text }}>{q.text}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: COLORS.textSecondary }}>
                    Type: {q.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          <button onClick={onClose} style={{
            padding: '10px 20px',
            background: 'transparent',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleGenerate} disabled={generating} style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: generating ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {generating ? '⏳ Generating...' : '🤖 Generate Survey'}
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================
// COMPONENT: InsightCard
// =============================================

const InsightCard = ({ insight }) => {
  const severityColors = {
    high: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
    medium: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    low: { bg: '#DCFCE7', text: '#16A34A', border: '#BBF7D0' },
  };
  const colors = severityColors[insight.severity];
  
  return (
    <div style={{
      background: COLORS.white,
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${COLORS.border}`,
      borderLeft: `4px solid ${colors.text}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{insight.icon}</span>
          <h4 style={{ margin: 0, fontSize: '15px', color: COLORS.text }}>{insight.title}</h4>
        </div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 600,
          background: colors.bg,
          color: colors.text,
          textTransform: 'uppercase',
        }}>{insight.severity}</span>
      </div>
      <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: '0 0 12px 0', lineHeight: 1.5 }}>
        {insight.description}
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: COLORS.background,
        borderRadius: '8px',
      }}>
        <div>
          <p style={{ fontSize: '11px', color: COLORS.textSecondary, margin: 0 }}>IMPACT</p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text, margin: '4px 0 0 0' }}>{insight.impact}</p>
        </div>
        <button style={{
          padding: '8px 16px',
          background: COLORS.primary,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          cursor: 'pointer',
        }}>Take Action</button>
      </div>
    </div>
  );
};

// =============================================
// COMPONENT: AddStaffModal
// =============================================

const AddStaffModal = ({ onClose, onAddStaff, roles }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    assignedRole: '',
    sendMethod: 'email',
    sendSurvey: true,
    surveyType: 'role_alignment',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.role) {
      alert('Please fill in required fields');
      return;
    }
    
    setSending(true);
    
    // Simulate sending invitation
    setTimeout(() => {
      const newStaff = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        assignedRole: formData.assignedRole || formData.role,
        hireDate: new Date().toISOString().split('T')[0],
        status: 'pending_survey',
        efficiency: 0,
        hoursPerWeek: 40,
        surveyStatus: formData.sendSurvey ? 'sent' : 'not_sent',
        surveySentDate: formData.sendSurvey ? new Date().toISOString() : null,
        surveySentVia: formData.sendMethod,
      };
      
      onAddStaff(newStaff);
      setSending(false);
      setSent(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10002,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: COLORS.white,
        borderRadius: '20px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: SHADOWS.xl,
      }}>
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>➕ Add Staff Member</h3>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Add a new team member and send onboarding survey</p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '18px',
            }}>×</button>
          </div>
        </div>
        
        {sent ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ margin: '0 0 8px 0', color: COLORS.text }}>Staff Member Added!</h3>
            <p style={{ color: COLORS.textSecondary, margin: 0 }}>
              {formData.sendSurvey ? (
                <>Survey invitation sent via {formData.sendMethod === 'both' ? 'email and SMS' : formData.sendMethod}</>
              ) : (
                <>Staff member added to roster</>
              )}
            </p>
          </div>
        ) : (
          <>
            <div style={{ padding: '24px', maxHeight: '60vh', overflow: 'auto' }}>
              {/* Basic Info */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: COLORS.text }}>📋 Basic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: COLORS.text }}>
                      Full Name <span style={{ color: COLORS.danger }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Smith"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: COLORS.text }}>
                      Role <span style={{ color: COLORS.danger }}>*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value, assignedRole: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: COLORS.white,
                      }}
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.icon} {role.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: COLORS.text }}>📧 Contact Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: COLORS.text }}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@practice.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: COLORS.text }}>Phone (SMS)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Survey Options */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: COLORS.text }}>📋 Onboarding Survey</h4>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.sendSurvey}
                    onChange={(e) => setFormData({ ...formData, sendSurvey: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: COLORS.primary }}
                  />
                  <span style={{ fontSize: '14px', color: COLORS.text }}>Send onboarding survey immediately</span>
                </label>

                {formData.sendSurvey && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: COLORS.text }}>Delivery Method</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                          { id: 'email', label: '📧 Email', icon: '📧' },
                          { id: 'sms', label: '📱 SMS', icon: '📱' },
                          { id: 'both', label: '📧📱 Both', icon: '📧📱' },
                        ].map(method => (
                          <button
                            key={method.id}
                            onClick={() => setFormData({ ...formData, sendMethod: method.id })}
                            style={{
                              flex: 1,
                              padding: '12px',
                              border: `2px solid ${formData.sendMethod === method.id ? COLORS.primary : COLORS.border}`,
                              borderRadius: '8px',
                              background: formData.sendMethod === method.id ? `${COLORS.primary}10` : 'transparent',
                              cursor: 'pointer',
                              fontWeight: formData.sendMethod === method.id ? 600 : 400,
                              color: formData.sendMethod === method.id ? COLORS.primary : COLORS.text,
                            }}
                          >{method.label}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: COLORS.text }}>Survey Type</label>
                      <select
                        value={formData.surveyType}
                        onChange={(e) => setFormData({ ...formData, surveyType: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: COLORS.white,
                        }}
                      >
                        <option value="role_alignment">Role Alignment Assessment</option>
                        <option value="time_allocation">Time Allocation Analysis</option>
                        <option value="effectiveness">Effectiveness Improvement</option>
                        <option value="onboarding">New Employee Onboarding</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Preview Message */}
              {formData.sendSurvey && formData.name && (
                <div style={{
                  background: COLORS.background,
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textSecondary, margin: '0 0 8px 0' }}>MESSAGE PREVIEW</p>
                  <p style={{ fontSize: '13px', color: COLORS.text, margin: 0, lineHeight: 1.6 }}>
                    Hi {formData.name.split(' ')[0]},<br/><br/>
                    Welcome to our team! Please complete your onboarding survey to help us understand your role and set you up for success.<br/><br/>
                    <span style={{ color: COLORS.primary }}>🔗 Click here to complete your survey</span><br/><br/>
                    Thank you!<br/>
                    - Practice Management Team
                  </p>
                </div>
              )}
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${COLORS.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}>
              <button onClick={onClose} style={{
                padding: '10px 20px',
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={sending} style={{
                padding: '10px 24px',
                background: sending ? COLORS.textSecondary : COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: sending ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {sending ? '⏳ Sending...' : formData.sendSurvey ? '📤 Add & Send Survey' : '➕ Add Staff'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// =============================================
// COMPONENT: SurveyResponseTracker
// =============================================

const SurveyResponseTracker = ({ responses, onClose, onResend }) => {
  const [filter, setFilter] = useState('all');
  
  const stats = useMemo(() => {
    const total = responses.length;
    const completed = responses.filter(r => r.status === 'completed').length;
    const pending = responses.filter(r => r.status === 'pending').length;
    const overdue = responses.filter(r => r.status === 'overdue').length;
    return { total, completed, pending, overdue, completionRate: Math.round((completed / total) * 100) };
  }, [responses]);

  const filteredResponses = filter === 'all' 
    ? responses 
    : responses.filter(r => r.status === filter);

  const getStatusBadge = (status) => {
    const styles = {
      completed: { bg: '#DCFCE7', color: '#16A34A', icon: '✅' },
      pending: { bg: '#FEF3C7', color: '#D97706', icon: '⏳' },
      overdue: { bg: '#FEE2E2', color: '#DC2626', icon: '⚠️' },
    };
    const s = styles[status] || styles.pending;
    return (
      <span style={{
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}>{s.icon} {status}</span>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10002,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: COLORS.white,
        borderRadius: '20px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '85vh',
        overflow: 'hidden',
        boxShadow: SHADOWS.xl,
      }}>
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>📊 Survey Response Tracker</h3>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Track survey completion status and send reminders</p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '18px',
            }}>×</button>
          </div>
          
          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{stats.completionRate}%</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Completion Rate</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{stats.completed}</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Completed</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{stats.pending}</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Pending</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: stats.overdue > 0 ? '#FEE2E2' : 'white' }}>{stats.overdue}</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Overdue</p>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '20px 24px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'completed', label: '✅ Completed', count: stats.completed },
              { id: 'pending', label: '⏳ Pending', count: stats.pending },
              { id: 'overdue', label: '⚠️ Overdue', count: stats.overdue },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${filter === f.id ? COLORS.secondary : COLORS.border}`,
                  borderRadius: '20px',
                  background: filter === f.id ? `${COLORS.secondary}15` : 'transparent',
                  color: filter === f.id ? COLORS.secondary : COLORS.text,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: filter === f.id ? 600 : 400,
                }}
              >{f.label} ({f.count})</button>
            ))}
          </div>

          {/* Response Table */}
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>STAFF MEMBER</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>SURVEY</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>SENT VIA</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>SENT DATE</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>STATUS</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>RESPONSE TIME</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map(response => (
                  <tr key={response.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '12px' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: COLORS.text }}>{response.staffName}</p>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: COLORS.textSecondary }}>{response.surveyName}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '16px' }}>
                        {response.sentVia === 'email' && '📧'}
                        {response.sentVia === 'sms' && '📱'}
                        {response.sentVia === 'both' && '📧📱'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: COLORS.textSecondary }}>{response.sentDate}</td>
                    <td style={{ padding: '12px' }}>{getStatusBadge(response.status)}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: response.responseTime ? COLORS.text : COLORS.textLight }}>
                      {response.responseTime || '—'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {response.status !== 'completed' && (
                        <button
                          onClick={() => onResend(response)}
                          style={{
                            padding: '6px 12px',
                            background: COLORS.warning,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >🔄 Resend</button>
                      )}
                      {response.status === 'completed' && (
                        <button
                          style={{
                            padding: '6px 12px',
                            background: COLORS.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >👁️ View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={() => {
              const pendingResponses = responses.filter(r => r.status !== 'completed');
              alert(`Sending reminders to ${pendingResponses.length} staff members...`);
            }}
            style={{
              padding: '10px 20px',
              background: COLORS.warning,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >📤 Send Reminders to All Pending</button>
          <button onClick={onClose} style={{
            padding: '10px 20px',
            background: 'transparent',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
          }}>Close</button>
        </div>
      </div>
    </div>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

export default function StaffIntelligence({ onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [showSurveyBuilder, setShowSurveyBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('role_alignment');
  const [staff, setStaff] = useState(SAMPLE_STAFF);
  const [surveys] = useState(SURVEY_SCHEDULES);
  const [insights] = useState(AI_INSIGHTS);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showResponseTracker, setShowResponseTracker] = useState(false);
  
  // Survey response tracking data
  const [surveyResponses, setSurveyResponses] = useState([
    { id: 1, staffId: 1, staffName: 'Emily Chen', surveyName: 'Monthly Role Check-in', sentDate: '2026-03-10', sentVia: 'email', status: 'completed', completedDate: '2026-03-12', responseTime: '2 days' },
    { id: 2, staffId: 2, staffName: 'Marcus Johnson', surveyName: 'Monthly Role Check-in', sentDate: '2026-03-10', sentVia: 'sms', status: 'completed', completedDate: '2026-03-11', responseTime: '1 day' },
    { id: 3, staffId: 3, staffName: 'Sarah Williams', surveyName: 'Monthly Role Check-in', sentDate: '2026-03-10', sentVia: 'email', status: 'pending', completedDate: null, responseTime: null },
    { id: 4, staffId: 4, staffName: 'David Park', surveyName: 'Monthly Role Check-in', sentDate: '2026-03-10', sentVia: 'sms', status: 'completed', completedDate: '2026-03-14', responseTime: '4 days' },
    { id: 5, staffId: 5, staffName: 'Jennifer Adams', surveyName: 'Quarterly Time Study', sentDate: '2026-03-01', sentVia: 'email', status: 'completed', completedDate: '2026-03-03', responseTime: '2 days' },
    { id: 6, staffId: 6, staffName: 'Michael Torres', surveyName: 'Quarterly Time Study', sentDate: '2026-03-01', sentVia: 'both', status: 'overdue', completedDate: null, responseTime: null },
    { id: 7, staffId: 7, staffName: 'Lisa Rodriguez', surveyName: 'Monthly Role Check-in', sentDate: '2026-03-10', sentVia: 'email', status: 'completed', completedDate: '2026-03-10', responseTime: 'Same day' },
    { id: 8, staffId: 8, staffName: 'Kevin Brown', surveyName: 'Monthly Role Check-in', sentDate: '2026-03-10', sentVia: 'sms', status: 'pending', completedDate: null, responseTime: null },
  ]);
  
  // Calculated metrics
  const metrics = useMemo(() => {
    const totalStaff = staff.length;
    const misalignedCount = staff.filter(s => s.role !== s.assignedRole).length;
    const avgEfficiency = Math.round(staff.reduce((sum, s) => sum + s.efficiency, 0) / totalStaff);
    const totalHours = staff.reduce((sum, s) => sum + s.hoursPerWeek, 0);
    const activeSurveys = surveys.filter(s => s.status === 'active').length;
    
    return {
      totalStaff,
      misalignedCount,
      avgEfficiency,
      totalHours,
      activeSurveys,
      alignmentRate: Math.round(((totalStaff - misalignedCount) / totalStaff) * 100),
    };
  }, [staff, surveys]);

  const handleGenerateSurvey = (surveyConfig) => {
    console.log('Generated Survey:', surveyConfig);
    setShowSurveyBuilder(false);
    // In production, this would save to database
  };
  
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
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
          padding: '24px 32px',
          color: 'white',
          flexShrink: 0,
          minHeight: '100px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
                  👥 Staff Intelligence
                </h2>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>AI-Powered</span>
              </div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
                Workforce analytics, survey automation & strategic alignment
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
              }}
            >×</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.background,
          flexShrink: 0,
        }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'staff', label: '👥 Staff Roster' },
            { id: 'surveys', label: '📋 Surveys' },
            { id: 'insights', label: '💡 AI Insights' },
            { id: 'intent', label: '🎯 Strategic Intent' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: '1 0 auto',
                padding: '16px 24px',
                border: 'none',
                background: activeTab === tab.id ? COLORS.white : 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #8B5CF6' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#8B5CF6' : COLORS.textSecondary,
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Strategic Intent Selection */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: COLORS.text }}>
                  🎯 Select Your Strategic Intent
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {STRATEGIC_INTENTS.map(intent => (
                    <div
                      key={intent.id}
                      onClick={() => setSelectedIntent(intent.id)}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        border: `2px solid ${selectedIntent === intent.id ? intent.color : COLORS.border}`,
                        background: selectedIntent === intent.id ? `${intent.color}10` : COLORS.white,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '28px' }}>{intent.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '16px', color: COLORS.text }}>{intent.name}</h4>
                      </div>
                      <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }}>
                        {intent.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <MetricCard label="Total Staff" value={metrics.totalStaff} icon="👥" color={COLORS.primary} />
                <MetricCard label="Role Alignment" value={`${metrics.alignmentRate}%`} change={metrics.misalignedCount > 0 ? `${metrics.misalignedCount} misaligned` : 'All aligned'} icon="✓" color={metrics.alignmentRate >= 90 ? COLORS.primary : COLORS.warning} />
                <MetricCard label="Avg Efficiency" value={`${metrics.avgEfficiency}%`} change="+3% vs last month" icon="⚡" color={COLORS.secondary} />
                <MetricCard label="Weekly Hours" value={metrics.totalHours} icon="⏰" color={COLORS.accent} />
                <MetricCard label="Active Surveys" value={metrics.activeSurveys} icon="📋" color={COLORS.gold} />
              </div>

              {/* AI Insights Preview */}
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: COLORS.text }}>
                💡 Top AI Insights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {insights.slice(0, 4).map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </>
          )}

          {/* Staff Roster Tab */}
          {activeTab === 'staff' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: COLORS.text }}>Staff Roster & Role Alignment</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Search staff..."
                    style={{
                      padding: '10px 16px',
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      width: '200px',
                    }}
                  />
                  <button 
                    onClick={() => setShowResponseTracker(true)}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>📊 Response Tracker</button>
                  <button 
                    onClick={() => setShowAddStaffModal(true)}
                    style={{
                      padding: '10px 20px',
                      background: COLORS.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>➕ Add Staff</button>
                </div>
              </div>
              
              <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 150px 150px 100px 100px 120px',
                  gap: '16px',
                  padding: '16px',
                  background: COLORS.background,
                  fontWeight: 600,
                  fontSize: '12px',
                  color: COLORS.textSecondary,
                  textTransform: 'uppercase',
                }}>
                  <span>Staff Member</span>
                  <span>Assigned Role</span>
                  <span>Alignment</span>
                  <span style={{ textAlign: 'center' }}>Efficiency</span>
                  <span style={{ textAlign: 'center' }}>Hours/Week</span>
                  <span>Actions</span>
                </div>
                {/* Rows */}
                {staff.map(member => (
                  <StaffRow 
                    key={member.id} 
                    staff={member} 
                    roles={STAFF_ROLES}
                    onViewDetails={(s) => console.log('View details:', s)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Surveys Tab */}
          {activeTab === 'surveys' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: COLORS.text }}>AI-Powered Survey Management</h3>
                <button 
                  onClick={() => setShowSurveyBuilder(true)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                  🤖 Create AI Survey
                </button>
              </div>

              {/* Survey Templates */}
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: COLORS.text }}>Survey Templates</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {Object.entries(AI_SURVEY_TEMPLATES).map(([key, template]) => (
                  <div key={key} style={{
                    background: COLORS.white,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${COLORS.border}`,
                    cursor: 'pointer',
                  }} onClick={() => { setSelectedTemplate(key); setShowSurveyBuilder(true); }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '15px', color: COLORS.text }}>{template.title}</h5>
                    <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 0 12px 0' }}>{template.description}</p>
                    <span style={{
                      padding: '4px 10px',
                      background: COLORS.background,
                      borderRadius: '20px',
                      fontSize: '12px',
                      color: COLORS.textSecondary,
                    }}>{template.questions.length} questions</span>
                  </div>
                ))}
              </div>

              {/* Active Surveys */}
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: COLORS.text }}>Scheduled Surveys</h4>
              <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden',
              }}>
                {surveys.map(survey => (
                  <div key={survey.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    <div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: COLORS.text }}>{survey.name}</h5>
                      <p style={{ margin: 0, fontSize: '12px', color: COLORS.textSecondary }}>
                        {survey.frequency} • Next: {survey.nextRun} • {survey.recipients} recipients
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: COLORS.text }}>{survey.lastCompletion}%</p>
                        <p style={{ margin: 0, fontSize: '11px', color: COLORS.textSecondary }}>Last completion</p>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: survey.status === 'active' ? '#DCFCE7' : '#FEF3C7',
                        color: survey.status === 'active' ? '#16A34A' : '#D97706',
                      }}>{survey.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* AI Insights Tab */}
          {activeTab === 'insights' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: COLORS.text }}>AI-Generated Workforce Insights</h3>
                <button style={{
                  padding: '10px 20px',
                  background: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  🔄 Refresh Insights
                </button>
              </div>

              {/* Filter by type */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['all', 'misalignment', 'efficiency', 'training', 'cost', 'growth'].map(filter => (
                  <button key={filter} style={{
                    padding: '8px 16px',
                    background: filter === 'all' ? COLORS.primary : COLORS.background,
                    color: filter === 'all' ? 'white' : COLORS.text,
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textTransform: 'capitalize',
                  }}>{filter}</button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {insights.map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </>
          )}

          {/* Strategic Intent Tab */}
          {activeTab === 'intent' && (
            <>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: COLORS.text }}>
                Configure Strategic Intent for Workforce Optimization
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {STRATEGIC_INTENTS.map(intent => (
                  <div key={intent.id} style={{
                    background: COLORS.white,
                    borderRadius: '16px',
                    border: `2px solid ${selectedIntent === intent.id ? intent.color : COLORS.border}`,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '24px',
                      background: selectedIntent === intent.id ? `${intent.color}10` : 'transparent',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '36px' }}>{intent.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '18px', color: COLORS.text }}>{intent.name}</h4>
                      </div>
                      <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: '0 0 20px 0', lineHeight: 1.5 }}>
                        {intent.description}
                      </p>
                      
                      <h5 style={{ margin: '0 0 12px 0', fontSize: '13px', color: COLORS.text, fontWeight: 600 }}>Key Metrics</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        {intent.metrics.map((metric, idx) => (
                          <span key={idx} style={{
                            padding: '4px 10px',
                            background: COLORS.background,
                            borderRadius: '20px',
                            fontSize: '11px',
                            color: COLORS.textSecondary,
                          }}>{metric}</span>
                        ))}
                      </div>
                      
                      <h5 style={{ margin: '0 0 12px 0', fontSize: '13px', color: COLORS.text, fontWeight: 600 }}>Survey Focus Areas</h5>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: COLORS.textSecondary }}>
                        {intent.surveyFocus.map((focus, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{focus}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div style={{ padding: '16px 24px', borderTop: `1px solid ${COLORS.border}` }}>
                      <button
                        onClick={() => setSelectedIntent(intent.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: selectedIntent === intent.id ? intent.color : COLORS.background,
                          color: selectedIntent === intent.id ? 'white' : COLORS.text,
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >{selectedIntent === intent.id ? '✓ Selected' : 'Select Intent'}</button>
                    </div>
                  </div>
                ))}
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
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '13px', color: COLORS.textSecondary }}>
            Staff Intelligence • AI-powered workforce optimization
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
          }}>MedPact Platinum</span>
        </div>
      </div>

      {/* Survey Builder Modal */}
      {showSurveyBuilder && (
        <SurveyBuilder
          template={selectedTemplate}
          intent={selectedIntent}
          onClose={() => setShowSurveyBuilder(false)}
          onGenerate={handleGenerateSurvey}
        />
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <AddStaffModal
          roles={STAFF_ROLES}
          onClose={() => setShowAddStaffModal(false)}
          onAddStaff={(newStaff) => {
            setStaff([...staff, newStaff]);
            // Add to survey responses if survey was sent
            if (newStaff.surveyStatus === 'sent') {
              setSurveyResponses([...surveyResponses, {
                id: Date.now(),
                staffId: newStaff.id,
                staffName: newStaff.name,
                surveyName: 'New Employee Onboarding',
                sentDate: new Date().toISOString().split('T')[0],
                sentVia: newStaff.surveySentVia,
                status: 'pending',
                completedDate: null,
                responseTime: null,
              }]);
            }
          }}
        />
      )}

      {/* Survey Response Tracker Modal */}
      {showResponseTracker && (
        <SurveyResponseTracker
          responses={surveyResponses}
          onClose={() => setShowResponseTracker(false)}
          onResend={(response) => {
            alert(`Resending survey to ${response.staffName} via ${response.sentVia}...`);
          }}
        />
      )}
    </div>
  );
}

StaffIntelligence.propTypes = {
  onClose: PropTypes.func.isRequired,
};
