import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// =============================================
// KCN - KNOWLEDGE & COMMUNICATION NETWORK
// Full-featured chatrooms, forums & education
// =============================================

const COLORS = {
  primary: '#059669',
  primaryLight: '#10b981',
  primaryDark: '#047857',
  secondary: '#0EA5E9',
  accent: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  background: '#F8FAFC',
  white: '#FFFFFF',
  gradientPrimary: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  gradientSecondary: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
  gradientAccent: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
};

const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// =============================================
// CHATROOM DATA
// =============================================

const CHATROOMS = [
  {
    id: 'practice-management',
    name: 'Practice Management',
    icon: '🏥',
    description: 'Discuss operational efficiency, staffing, and workflow optimization',
    members: 342,
    messages: 1847,
    color: '#059669',
    lastActivity: '2 min ago',
    pinned: true,
  },
  {
    id: 'benchmarking',
    name: 'Benchmarking',
    icon: '�',
    description: 'Compare performance metrics, KPIs, and industry standards',
    members: 389,
    messages: 2103,
    color: '#0EA5E9',
    lastActivity: '5 min ago',
    pinned: true,
  },
  {
    id: 'billing-coding',
    name: 'Billing & Coding',
    icon: '💰',
    description: 'CPT codes, reimbursement strategies, and coding best practices',
    members: 456,
    messages: 3241,
    color: '#8B5CF6',
    lastActivity: '1 min ago',
    pinned: true,
  },
  {
    id: 'payers-contracts',
    name: 'Payers & Contract Negotiation',
    icon: '�',
    description: 'Payer relations, fee schedules, and contract negotiation strategies',
    members: 298,
    messages: 1892,
    color: '#F59E0B',
    lastActivity: '8 min ago',
    pinned: true,
  },
  {
    id: 'pe-investment',
    name: 'PE & Investment',
    icon: '📈',
    description: 'Private equity, valuations, and investment strategies',
    members: 127,
    messages: 456,
    color: '#EF4444',
    lastActivity: '32 min ago',
    pinned: false,
  },
  {
    id: 'asc',
    name: 'ASC',
    icon: '🏨',
    description: 'Ambulatory Surgery Center operations, compliance, and optimization',
    members: 234,
    messages: 978,
    color: '#6366F1',
    lastActivity: '15 min ago',
    pinned: false,
  },
];

// Sample messages for active chatroom
const SAMPLE_MESSAGES = {
  'billing-coding': [
    { id: 1, user: 'Dr. Sarah Chen', avatar: '👩‍⚕️', message: 'Has anyone had success appealing the recent Medicare LCD for 92133?', time: '10:23 AM', role: 'Ophthalmologist' },
    { id: 2, user: 'Mike Thompson', avatar: '👨‍💼', message: 'Yes! We won 3 appeals last month. Key is documenting the medical necessity clearly.', time: '10:25 AM', role: 'Practice Manager' },
    { id: 3, user: 'Lisa Rodriguez', avatar: '👩‍💼', message: 'Can you share the template you used? We\'re struggling with denials.', time: '10:27 AM', role: 'Consultant' },
    { id: 4, user: 'Dr. James Wilson', avatar: '👨‍⚕️', message: 'The new 2026 fee schedule changes are significant. Anyone done an impact analysis?', time: '10:30 AM', role: 'Ophthalmologist' },
    { id: 5, user: 'Mike Thompson', avatar: '👨‍💼', message: '@Lisa I\'ll DM you the template. @Dr. Wilson we\'re projecting a 3.2% revenue impact.', time: '10:32 AM', role: 'Practice Manager' },
    { id: 6, user: 'Emily Parker', avatar: '👩‍💻', message: 'Don\'t forget the modifier changes for 66984. Big compliance issue if not updated.', time: '10:35 AM', role: 'Consultant' },
  ],
  'practice-management': [
    { id: 1, user: 'Dr. Robert Kim', avatar: '👨‍⚕️', message: 'Our no-show rate dropped from 12% to 6% after implementing text reminders.', time: '9:45 AM', role: 'Ophthalmologist' },
    { id: 2, user: 'Jennifer Adams', avatar: '👩‍💼', message: 'What system are you using for the reminders?', time: '9:47 AM', role: 'Practice Manager' },
    { id: 3, user: 'Dr. Robert Kim', avatar: '👨‍⚕️', message: 'We integrated with our EHR. 48-hour and 24-hour automated texts.', time: '9:50 AM', role: 'Ophthalmologist' },
    { id: 4, user: 'Mark Stevens', avatar: '👨‍💼', message: 'Anyone have experience with scribe services? Considering virtual scribes.', time: '10:00 AM', role: 'Consultant' },
  ],
  'benchmarking': [
    { id: 1, user: 'Dr. Amanda Lee', avatar: '👩‍⚕️', message: 'What\'s everyone seeing for average cataract volume per surgeon per week?', time: '11:00 AM', role: 'Ophthalmologist' },
    { id: 2, user: 'David Park', avatar: '👨‍💼', message: 'Our top performer is at 35/week. Average across our group is 22.', time: '11:02 AM', role: 'Practice Manager' },
    { id: 3, user: 'Dr. Amanda Lee', avatar: '👩‍⚕️', message: 'That\'s helpful! We\'re at 18 avg. Looking at workflow optimization.', time: '11:05 AM', role: 'Ophthalmologist' },
    { id: 4, user: 'Sarah Mitchell', avatar: '👩‍💼', message: 'Check the PE 10 metrics in MedPact - great comparison data there.', time: '11:08 AM', role: 'Consultant' },
  ],
  'payers-contracts': [
    { id: 1, user: 'Tom Richards', avatar: '👨‍💼', message: 'Just renegotiated our Aetna contract. Got 8% increase on cataract.', time: '2:15 PM', role: 'Practice Manager' },
    { id: 2, user: 'Dr. Maria Santos', avatar: '👩‍⚕️', message: 'What leverage did you use? They stonewalled us last quarter.', time: '2:18 PM', role: 'Ophthalmologist' },
    { id: 3, user: 'Tom Richards', avatar: '👨‍💼', message: 'Volume data + patient satisfaction scores. Also threatened to go out of network.', time: '2:22 PM', role: 'Practice Manager' },
    { id: 4, user: 'Karen White', avatar: '👩‍💼', message: 'The price transparency data is a game changer for these negotiations.', time: '2:25 PM', role: 'Consultant' },
  ],
  'pe-investment': [
    { id: 1, user: 'Michael Chen', avatar: '👨‍💼', message: 'Seeing 8-10x EBITDA multiples for quality retina practices right now.', time: '3:00 PM', role: 'Consultant' },
    { id: 2, user: 'Dr. Patricia Moore', avatar: '👩‍⚕️', message: 'What about general ophthalmology without subspecialty?', time: '3:05 PM', role: 'Ophthalmologist' },
    { id: 3, user: 'Michael Chen', avatar: '👨‍💼', message: 'Typically 5-7x depending on geography and growth profile.', time: '3:08 PM', role: 'Consultant' },
  ],
  'asc': [
    { id: 1, user: 'Dr. John Harris', avatar: '👨‍⚕️', message: 'Anyone dealing with the new ASC quality reporting requirements?', time: '4:00 PM', role: 'Ophthalmologist' },
    { id: 2, user: 'Nancy Cooper', avatar: '👩‍💼', message: 'Yes, we just completed our QCDR submission. Happy to share templates.', time: '4:05 PM', role: 'Practice Manager' },
    { id: 3, user: 'Dr. John Harris', avatar: '👨‍⚕️', message: 'That would be amazing. Our case mix is 80% cataract, 15% retina, 5% glaucoma.', time: '4:08 PM', role: 'Ophthalmologist' },
    { id: 4, user: 'Bill Martinez', avatar: '👨‍💼', message: 'Check the ASC 25 metrics package - great benchmarking data for your mix.', time: '4:12 PM', role: 'Consultant' },
  ],
};

// =============================================
// EDUCATIONAL CONTENT
// =============================================

const EDUCATIONAL_CONTENT = [
  {
    id: 'course-1',
    title: 'Turnaround Strategies',
    category: 'Practice Management',
    instructor: 'Dr. Patricia Moore',
    duration: '4.5 hours',
    modules: 12,
    rating: 4.9,
    enrolled: 1234,
    level: 'Advanced',
    icon: '�',
    color: '#059669',
    description: 'Transform underperforming practices into profitable operations.',
    topics: ['Financial Diagnostics', 'Operational Restructuring', 'Revenue Recovery', 'Staff Optimization'],
  },
  {
    id: 'course-2',
    title: 'EHR Optimization',
    category: 'Technology',
    instructor: 'Michael Chen, MHA',
    duration: '3 hours',
    modules: 8,
    rating: 4.8,
    enrolled: 967,
    level: 'Intermediate',
    icon: '�',
    color: '#0EA5E9',
    description: 'Maximize efficiency and ROI from your electronic health records system.',
    topics: ['Workflow Templates', 'Integration Best Practices', 'Reporting Optimization', 'Staff Training'],
  },
  {
    id: 'course-3',
    title: 'Compliance Fundamentals',
    category: 'Compliance',
    instructor: 'Lisa Thompson, JD',
    duration: '2.5 hours',
    modules: 6,
    rating: 4.7,
    enrolled: 892,
    level: 'Beginner',
    icon: '🔒',
    color: '#6366F1',
    description: 'Essential HIPAA, MIPS, and regulatory compliance for ophthalmology practices.',
    topics: ['HIPAA Requirements', 'MIPS Reporting', 'Documentation Standards', 'Audit Preparation'],
  },
  {
    id: 'course-4',
    title: 'Data Analytics for Practices',
    category: 'Analytics',
    instructor: 'Dr. Jennifer Walsh',
    duration: '3.5 hours',
    modules: 10,
    rating: 4.9,
    enrolled: 743,
    level: 'Intermediate',
    icon: '�',
    color: '#8B5CF6',
    description: 'Leverage data to drive better clinical and business decisions.',
    topics: ['KPI Dashboards', 'Benchmarking Analysis', 'Predictive Modeling', 'Performance Tracking'],
  },
  {
    id: 'course-5',
    title: 'Exit Planning & Valuation',
    category: 'PE & Investment',
    instructor: 'Susan Miller, CFA',
    duration: '4 hours',
    modules: 9,
    rating: 4.8,
    enrolled: 567,
    level: 'Advanced',
    icon: '�',
    color: '#EF4444',
    description: 'Prepare your practice for sale, merger, or transition.',
    topics: ['Valuation Methods', 'PE Deal Structures', 'Due Diligence Prep', 'Succession Planning'],
  },
];

// =============================================
// FORUM DISCUSSIONS
// =============================================

const FORUM_TOPICS = [
  {
    id: 1,
    title: '2026 Medicare Fee Schedule Impact Analysis',
    author: 'Dr. Michael Roberts',
    category: 'Billing & Coding',
    replies: 47,
    views: 1234,
    lastReply: '15 min ago',
    hot: true,
    pinned: true,
  },
  {
    id: 2,
    title: 'Benchmarking Your Cataract Volume: What\'s Normal?',
    author: 'Jennifer Adams',
    category: 'Benchmarking',
    replies: 32,
    views: 876,
    lastReply: '1 hr ago',
    hot: true,
    pinned: false,
  },
  {
    id: 3,
    title: 'PE Acquisition: What to Expect in 2026',
    author: 'Dr. Sarah Chen',
    category: 'PE & Investment',
    replies: 28,
    views: 654,
    lastReply: '2 hrs ago',
    hot: false,
    pinned: true,
  },
  {
    id: 4,
    title: 'Payer Contract Negotiation Success Stories',
    author: 'Mark Stevens',
    category: 'Payers & Contracts',
    replies: 56,
    views: 1567,
    lastReply: '3 hrs ago',
    hot: true,
    pinned: false,
  },
  {
    id: 5,
    title: 'ASC Profitability: Key Metrics to Track',
    author: 'Lisa Thompson',
    category: 'ASC',
    replies: 41,
    views: 932,
    lastReply: '4 hrs ago',
    hot: true,
    pinned: false,
  },
  {
    id: 6,
    title: 'Reducing Patient No-Shows: Strategies That Work',
    author: 'Karen White',
    category: 'Practice Management',
    replies: 38,
    views: 1123,
    lastReply: '5 hrs ago',
    hot: false,
    pinned: false,
  },
];

// =============================================
// SUB-COMPONENTS
// =============================================

const ChatroomCard = ({ room, onClick, isActive }) => (
  <div
    onClick={onClick}
    style={{
      background: isActive ? `${room.color}15` : COLORS.white,
      borderRadius: '12px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: isActive ? `2px solid ${room.color}` : `1px solid ${COLORS.border}`,
      position: 'relative',
    }}
    onMouseEnter={e => {
      if (!isActive) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = SHADOWS.md;
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    {room.pinned && (
      <span style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        fontSize: '12px',
      }}>📌</span>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        background: `${room.color}20`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
      }}>
        {room.icon}
      </div>
      <div>
        <div style={{ fontWeight: '600', fontSize: '15px', color: COLORS.text }}>{room.name}</div>
        <div style={{ fontSize: '12px', color: COLORS.textLight }}>{room.lastActivity}</div>
      </div>
    </div>
    <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 0 12px 0', lineHeight: 1.4 }}>
      {room.description}
    </p>
    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: COLORS.textLight }}>
      <span>👥 {room.members}</span>
      <span>💬 {room.messages}</span>
    </div>
  </div>
);

const ChatMessage = ({ message }) => (
  <div style={{
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderBottom: `1px solid ${COLORS.border}`,
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      background: COLORS.background,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      flexShrink: 0,
    }}>
      {message.avatar}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontWeight: '600', fontSize: '14px', color: COLORS.text }}>{message.user}</span>
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          background: `${COLORS.primary}15`,
          color: COLORS.primary,
          borderRadius: '10px',
        }}>{message.role}</span>
        <span style={{ fontSize: '12px', color: COLORS.textLight, marginLeft: 'auto' }}>{message.time}</span>
      </div>
      <p style={{ margin: 0, fontSize: '14px', color: COLORS.text, lineHeight: 1.5 }}>{message.message}</p>
    </div>
  </div>
);

const CourseCard = ({ course, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: COLORS.white,
      borderRadius: '16px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: `1px solid ${COLORS.border}`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = SHADOWS.lg;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{
      background: course.color,
      padding: '24px',
      color: COLORS.white,
    }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>{course.icon}</div>
      <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>{course.category}</div>
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{course.title}</h3>
    </div>
    <div style={{ padding: '16px' }}>
      <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 0 12px 0', lineHeight: 1.5 }}>
        {course.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: COLORS.text }}>👨‍🏫 {course.instructor}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: COLORS.textLight }}>
        <span>⏱️ {course.duration}</span>
        <span>📚 {course.modules} modules</span>
        <span>⭐ {course.rating}</span>
      </div>
      <div style={{
        marginTop: '12px',
        padding: '8px 12px',
        background: `${course.color}10`,
        borderRadius: '8px',
        fontSize: '12px',
        color: course.color,
        textAlign: 'center',
        fontWeight: '500',
      }}>
        {course.enrolled.toLocaleString()} enrolled • {course.level}
      </div>
    </div>
  </div>
);

const ForumRow = ({ topic }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  }}
    onMouseEnter={e => e.currentTarget.style.background = COLORS.background}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        {topic.pinned && <span style={{ fontSize: '12px' }}>📌</span>}
        {topic.hot && <span style={{
          fontSize: '10px',
          padding: '2px 6px',
          background: '#EF444420',
          color: '#EF4444',
          borderRadius: '4px',
          fontWeight: '600',
        }}>🔥 HOT</span>}
        <span style={{ fontWeight: '600', fontSize: '14px', color: COLORS.text }}>{topic.title}</span>
      </div>
      <div style={{ fontSize: '12px', color: COLORS.textLight }}>
        by {topic.author} in <span style={{ color: COLORS.primary }}>{topic.category}</span>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: COLORS.textSecondary }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '600' }}>{topic.replies}</div>
        <div style={{ fontSize: '11px', color: COLORS.textLight }}>replies</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '600' }}>{topic.views}</div>
        <div style={{ fontSize: '11px', color: COLORS.textLight }}>views</div>
      </div>
      <div style={{ width: '80px', textAlign: 'right', fontSize: '12px', color: COLORS.textLight }}>
        {topic.lastReply}
      </div>
    </div>
  </div>
);

// =============================================
// MAIN COMPONENT
// =============================================

export const KCNCommunity = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('chatrooms');
  const [activeChatroom, setActiveChatroom] = useState(CHATROOMS[2]); // Billing & Coding
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(SAMPLE_MESSAGES['billing-coding']);
  const messagesEndRef = useRef(null);

  const tabs = [
    { id: 'chatrooms', label: 'Chatrooms', icon: '💬', count: CHATROOMS.length },
    { id: 'education', label: 'Education', icon: '📚', count: EDUCATIONAL_CONTENT.length },
    { id: 'forums', label: 'Forums', icon: '🗣️', count: FORUM_TOPICS.length },
  ];

  useEffect(() => {
    if (activeChatroom) {
      setMessages(SAMPLE_MESSAGES[activeChatroom.id] || []);
    }
  }, [activeChatroom]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        user: 'You',
        avatar: '👤',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        role: 'Member',
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

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
          height: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Hero Header */}
        <div style={{
          background: COLORS.gradientPrimary,
          padding: '24px 32px',
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
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '20px',
              color: COLORS.white,
            }}
          >
            ✕
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}>
              💬
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>KCN Community</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                Knowledge & Communication Network • Connect, Learn, Grow
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '32px',
            marginTop: '20px',
          }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>2,847</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Members Online</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>15,432</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Messages Today</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>89</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Active Discussions</div>
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
              <span style={{
                background: activeTab === tab.id ? `${COLORS.primary}20` : COLORS.background,
                color: activeTab === tab.id ? COLORS.primary : COLORS.textLight,
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px',
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {/* Chatrooms Tab */}
          {activeTab === 'chatrooms' && (
            <div style={{ display: 'flex', height: '100%' }}>
              {/* Chatroom List */}
              <div style={{
                width: '320px',
                borderRight: `1px solid ${COLORS.border}`,
                overflow: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Search chatrooms..."
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.border}`,
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                {CHATROOMS.map(room => (
                  <ChatroomCard
                    key={room.id}
                    room={room}
                    isActive={activeChatroom?.id === room.id}
                    onClick={() => setActiveChatroom(room)}
                  />
                ))}
              </div>

              {/* Chat Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <div style={{
                  padding: '16px 24px',
                  borderBottom: `1px solid ${COLORS.border}`,
                  background: COLORS.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `${activeChatroom?.color}20`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}>
                      {activeChatroom?.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: COLORS.text }}>
                        {activeChatroom?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textLight }}>
                        {activeChatroom?.members} members • {activeChatroom?.messages} messages
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '8px 16px',
                      background: COLORS.background,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}>📌 Pinned</button>
                    <button style={{
                      padding: '8px 16px',
                      background: COLORS.background,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}>👥 Members</button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '16px 24px',
                  background: COLORS.white,
                }}>
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div style={{
                  padding: '16px 24px',
                  borderTop: `1px solid ${COLORS.border}`,
                  background: COLORS.white,
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${COLORS.border}`,
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      style={{
                        padding: '12px 24px',
                        background: COLORS.gradientPrimary,
                        border: 'none',
                        borderRadius: '12px',
                        color: COLORS.white,
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      Send 📤
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div style={{ padding: '24px', overflow: 'auto', height: '100%' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                  Educational Courses
                </h2>
                <p style={{ margin: 0, color: COLORS.textSecondary }}>
                  Expert-led courses on practice management, billing, compliance, and more
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {EDUCATIONAL_CONTENT.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* Forums Tab */}
          {activeTab === 'forums' && (
            <div style={{ height: '100%', overflow: 'auto' }}>
              <div style={{ padding: '24px 24px 0 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: COLORS.text }}>
                      Discussion Forums
                    </h2>
                    <p style={{ margin: 0, color: COLORS.textSecondary }}>
                      Join conversations with your peers across the ophthalmology community
                    </p>
                  </div>
                  <button style={{
                    padding: '10px 20px',
                    background: COLORS.gradientPrimary,
                    border: 'none',
                    borderRadius: '10px',
                    color: COLORS.white,
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}>
                    + New Topic
                  </button>
                </div>
              </div>

              <div style={{
                background: COLORS.white,
                margin: '0 24px 24px 24px',
                borderRadius: '12px',
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden',
              }}>
                {FORUM_TOPICS.map(topic => (
                  <ForumRow key={topic.id} topic={topic} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: `1px solid ${COLORS.border}`,
          background: COLORS.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '12px', color: COLORS.textLight }}>
            KCN Community • Knowledge & Communication Network • Powered by MedPact
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <a href="#" style={{ color: COLORS.primary, textDecoration: 'none' }}>Community Guidelines</a>
            <a href="#" style={{ color: COLORS.primary, textDecoration: 'none' }}>Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};

KCNCommunity.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default KCNCommunity;
