import React, { useState, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// CONSULTANT ENGAGEMENT - Add Consultant, Groups, and AI Avatars
// ============================================================================

// Helper function for safe string operations
const safeStr = (value, fallback = '') => {
  if (value == null) return fallback
  return String(value)
}

const CONSULTANT_TYPES = [
  { id: 'individual', label: 'Individual Consultant', icon: '👤', description: 'Engage a single expert consultant' },
  { id: 'group', label: 'Consulting Group', icon: '👥', description: 'Engage a full consulting team' },
  { id: 'avatar', label: 'AI Consulting Avatar', icon: '🤖', description: 'Engage an AI-powered advisor' },
]

const AI_AVATARS = [
  {
    id: 'revenue-expert',
    name: 'Revenue Max',
    specialty: 'Revenue Cycle Optimization',
    avatar: '💰',
    description: 'Expert in billing, coding, and revenue cycle management',
    skills: ['Coding Optimization', 'Denial Management', 'A/R Acceleration'],
    rating: 4.9,
    consultations: 1250,
  },
  {
    id: 'quality-advisor',
    name: 'Quality Quinn',
    specialty: 'Quality & Compliance',
    avatar: '⭐',
    description: 'Specialized in MIPS, HEDIS, and quality improvement',
    skills: ['MIPS Optimization', 'Quality Reporting', 'Compliance Audits'],
    rating: 4.8,
    consultations: 980,
  },
  {
    id: 'ops-optimizer',
    name: 'Ops Olivia',
    specialty: 'Operations Excellence',
    avatar: '⚙️',
    description: 'Expert in workflow optimization and efficiency',
    skills: ['Workflow Design', 'Staff Productivity', 'Patient Flow'],
    rating: 4.7,
    consultations: 856,
  },
  {
    id: 'strategic-sam',
    name: 'Strategic Sam',
    specialty: 'Growth Strategy',
    avatar: '📈',
    description: 'Specialized in practice growth and market positioning',
    skills: ['Market Analysis', 'Growth Planning', 'Service Line Expansion'],
    rating: 4.9,
    consultations: 742,
  },
]

const SAMPLE_CONSULTANTS = [
  {
    id: 'c1',
    name: 'Dr. Rebecca Martinez',
    type: 'individual',
    specialty: 'Healthcare Revenue Cycle',
    company: 'Martinez Healthcare Consulting',
    avatar: null,
    rating: 4.8,
    reviews: 127,
    hourlyRate: 350,
    available: true,
  },
  {
    id: 'c2',
    name: 'Healthcare Performance Partners',
    type: 'group',
    specialty: 'Full Practice Transformation',
    company: null,
    avatar: null,
    rating: 4.9,
    reviews: 89,
    projectRate: '15,000 - 45,000',
    available: true,
  },
  {
    id: 'c3',
    name: 'James Chen, CPA',
    type: 'individual',
    specialty: 'Medical Practice Finance',
    company: 'Chen & Associates',
    avatar: null,
    rating: 4.7,
    reviews: 156,
    hourlyRate: 275,
    available: false,
  },
]

// Consultant Card Component
const ConsultantCard = memo(function ConsultantCard({ consultant, onEngage }) {
  const isAIAvatar = consultant?.avatar && typeof consultant.avatar === 'string'
  const name = safeStr(consultant?.name, 'Unknown Consultant')
  const specialty = safeStr(consultant?.specialty, '')
  const company = safeStr(consultant?.company, '')
  const description = safeStr(consultant?.description, '')
  const rating = consultant?.rating ?? 0
  const reviews = consultant?.reviews ?? consultant?.consultations ?? 0
  const hourlyRate = consultant?.hourlyRate
  const projectRate = consultant?.projectRate
  const isAvailable = consultant?.available !== false
  const skills = consultant?.skills || []
  
  const handleEngage = useCallback(() => {
    if (onEngage && consultant) {
      onEngage(consultant)
    }
  }, [onEngage, consultant])
  
  return (
    <div 
      style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          background: isAIAvatar 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isAIAvatar ? 32 : 24,
          flexShrink: 0,
        }}>
          {isAIAvatar ? consultant.avatar : (consultant.type === 'group' ? '👥' : '👤')}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#1f2937', fontSize: 16 }}>
                {consultant.name}
                {isAIAvatar && (
                  <span style={{
                    marginLeft: 8,
                    padding: '2px 8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    verticalAlign: 'middle',
                  }}>
                    AI AVATAR
                  </span>
                )}
              </h4>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                {consultant.specialty}
                {consultant.company && ` • ${consultant.company}`}
              </div>
            </div>
            
            {consultant.available !== false ? (
              <span style={{
                padding: '4px 10px',
                background: '#dcfce7',
                color: '#166534',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
              }}>
                ✓ Available
              </span>
            ) : (
              <span style={{
                padding: '4px 10px',
                background: '#fef3c7',
                color: '#92400e',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
              }}>
                Busy until Jan 20
              </span>
            )}
          </div>
          
          {consultant.description && (
            <p style={{ margin: '0 0 12px 0', color: '#4b5563', fontSize: 13, lineHeight: 1.5 }}>
              {consultant.description}
            </p>
          )}
          
          {consultant.skills && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {consultant.skills.map(skill => (
                <span key={skill} style={{
                  padding: '3px 10px',
                  background: '#eff6ff',
                  color: '#1e40af',
                  borderRadius: 12,
                  fontSize: 11,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
              <span style={{ color: '#f59e0b' }}>
                ⭐ {consultant.rating} ({consultant.reviews || consultant.consultations} reviews)
              </span>
              {consultant.hourlyRate && (
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  ${consultant.hourlyRate}/hr
                </span>
              )}
              {consultant.projectRate && (
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  ${consultant.projectRate}/project
                </span>
              )}
              {isAIAvatar && (
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  Free with subscription
                </span>
              )}
            </div>
            
            <button
              onClick={() => onEngage(consultant)}
              disabled={consultant.available === false}
              style={{
                padding: '8px 20px',
                background: consultant.available === false 
                  ? '#e5e7eb' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: consultant.available === false ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: consultant.available === false ? 'not-allowed' : 'pointer',
              }}
            >
              {isAIAvatar ? '🚀 Start Session' : '📅 Schedule Consult'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

ConsultantCard.propTypes = {
  consultant: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    specialty: PropTypes.string,
    company: PropTypes.string,
    description: PropTypes.string,
    avatar: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    consultations: PropTypes.number,
    hourlyRate: PropTypes.number,
    projectRate: PropTypes.string,
    available: PropTypes.bool,
    skills: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.oneOf(['individual', 'group']),
  }),
  onEngage: PropTypes.func.isRequired,
}

// Engagement Modal
const EngagementModal = memo(function EngagementModal({ consultant, onClose, onConfirm }) {
  const [selectedPackage, setSelectedPackage] = useState('standard')
  const [notes, setNotes] = useState('')
  const isAIAvatar = consultant?.avatar && typeof consultant.avatar === 'string'
  const name = safeStr(consultant?.name, 'Consultant')
  const specialty = safeStr(consultant?.specialty, '')
  
  const packages = isAIAvatar ? [
    { id: 'quick', name: 'Quick Chat', duration: '15 min', price: 'Free' },
    { id: 'standard', name: 'Deep Dive', duration: '45 min', price: 'Free' },
    { id: 'comprehensive', name: 'Full Analysis', duration: '2 hours', price: 'Free' },
  ] : [
    { id: 'quick', name: 'Quick Consult', duration: '30 min', price: consultant.hourlyRate ? `$${Math.round(consultant.hourlyRate * 0.5)}` : 'Contact' },
    { id: 'standard', name: 'Standard Session', duration: '1 hour', price: consultant.hourlyRate ? `$${consultant.hourlyRate}` : 'Contact' },
    { id: 'comprehensive', name: 'Deep Dive', duration: '2 hours', price: consultant.hourlyRate ? `$${consultant.hourlyRate * 2}` : 'Contact' },
  ]
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: 0,
        width: '100%',
        maxWidth: 560,
        maxHeight: '90vh',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          padding: 24,
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}>
              {isAIAvatar ? consultant.avatar : '👤'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 20 }}>{consultant.name}</h3>
              <div style={{ opacity: 0.9, fontSize: 14 }}>{consultant.specialty}</div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div style={{ padding: 24, maxHeight: 400, overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>
            {isAIAvatar ? 'Select Session Type' : 'Select Consultation Package'}
          </h4>
          
          <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
            {packages.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                style={{
                  border: `2px solid ${selectedPackage === pkg.id ? '#667eea' : '#e5e7eb'}`,
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  background: selectedPackage === pkg.id ? '#f5f3ff' : 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1f2937' }}>{pkg.name}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{pkg.duration}</div>
                  </div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: pkg.price === 'Free' ? '#059669' : '#1e3c72',
                  }}>
                    {pkg.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1f2937' }}>
              {isAIAvatar ? 'What would you like to discuss?' : 'Notes for Consultant'}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={isAIAvatar 
                ? "Describe the areas you'd like the AI advisor to analyze..."
                : "Describe your practice challenges and what you hope to achieve..."
              }
              style={{
                width: '100%',
                minHeight: 100,
                padding: 12,
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </div>
          
          {isAIAvatar && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: 8,
              padding: 12,
              fontSize: 13,
              color: '#166534',
            }}>
              💡 AI Avatars have access to your dashboard data and can provide instant, personalized insights
            </div>
          )}
          
          {!isAIAvatar && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: 8,
              padding: 12,
              fontSize: 13,
              color: '#92400e',
            }}>
              📋 The consultant will receive read-only access to your selected dashboards for the consultation period
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          padding: 20,
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(consultant, selectedPackage, notes)}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isAIAvatar ? '🚀 Start Session' : '📅 Request Consultation'}
          </button>
        </div>
      </div>
    </div>
  )
})

EngagementModal.propTypes = {
  consultant: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    specialty: PropTypes.string,
    avatar: PropTypes.string,
    hourlyRate: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

// Main Consultant Engagement Component
export function ConsultantEngagement({ onClose }) {
  const [activeTab, setActiveTab] = useState('avatar')
  const [selectedConsultant, setSelectedConsultant] = useState(null)
  const [engagementSuccess, setEngagementSuccess] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleEngage = useCallback((consultant) => {
    setSelectedConsultant(consultant)
  }, [])
  
  const handleConfirmEngagement = useCallback((consultant, packageType, notes) => {
    setSelectedConsultant(null)
    setEngagementSuccess(consultant)
    setTimeout(() => {
      setEngagementSuccess(null)
    }, 4000)
  }, [])
  
  const getConsultantsList = () => {
    switch (activeTab) {
      case 'avatar':
        return AI_AVATARS.map(a => ({ ...a, reviews: a.consultations }))
      case 'individual':
        return SAMPLE_CONSULTANTS.filter(c => c.type === 'individual')
      case 'group':
        return SAMPLE_CONSULTANTS.filter(c => c.type === 'group')
      default:
        return []
    }
  }
  
  const consultants = getConsultantsList().filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    }}>
      <div style={{
        background: '#f9fafb',
        borderRadius: 24,
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          padding: 24,
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 24 }}>🤝 Add Consultant</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Engage experts to help optimize your practice performance
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Success Banner */}
        {engagementSuccess && (
          <div style={{
            background: '#059669',
            color: 'white',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <span>
              {engagementSuccess.avatar 
                ? `AI session with ${engagementSuccess.name} is starting...`
                : `Consultation request sent to ${engagementSuccess.name}!`
              }
            </span>
          </div>
        )}
        
        {/* Tabs */}
        <div style={{ padding: '16px 24px 0', background: 'white' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {CONSULTANT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                style={{
                  padding: '12px 20px',
                  background: activeTab === type.id 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#f3f4f6',
                  color: activeTab === type.id ? 'white' : '#4b5563',
                  border: 'none',
                  borderRadius: '10px 10px 0 0',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span style={{ marginRight: 6 }}>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search */}
        <div style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or specialty..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 14,
            }}
          />
          <p style={{ margin: '12px 0 0', fontSize: 13, color: '#6b7280' }}>
            {CONSULTANT_TYPES.find(t => t.id === activeTab)?.description}
          </p>
        </div>
        
        {/* Consultants List */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {consultants.length > 0 ? (
            consultants.map(consultant => (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                onEngage={handleEngage}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>No consultants found</div>
              <div style={{ fontSize: 14 }}>Try adjusting your search criteria</div>
            </div>
          )}
        </div>
        
        {selectedConsultant && (
          <EngagementModal
            consultant={selectedConsultant}
            onClose={() => setSelectedConsultant(null)}
            onConfirm={handleConfirmEngagement}
          />
        )}
      </div>
    </div>
  )
}

ConsultantEngagement.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default ConsultantEngagement
