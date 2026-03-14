import React, { useState, useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// AI SUGGESTIONS TODO LIST - Actionable Improvement Steps
// Hardened for production with validation, error handling, and accessibility
// ============================================================================

// Date formatting helper
const formatDate = (dateStr) => {
  try {
    if (!dateStr) return 'No date set'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr || 'No date set'
  }
}

// Check if date is overdue
const isOverdue = (dateStr) => {
  try {
    if (!dateStr) return false
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  } catch {
    return false
  }
}

const INITIAL_SUGGESTIONS = [
  {
    id: 1,
    category: 'revenue',
    priority: 'high',
    title: 'Review undercoded E&M visits',
    description: 'Analysis shows 23% of visits may be undercoded. Review recent 99213 visits for potential upgrade to 99214.',
    impact: 'Potential $45,000 annual revenue increase',
    effort: 'medium',
    status: 'pending',
    dueDate: '2026-04-15',
    assignee: null,
    aiConfidence: 94,
  },
  {
    id: 2,
    category: 'quality',
    priority: 'high',
    title: 'Address MIPS measure gaps',
    description: 'Current MIPS performance at 72/100. Focus on Quality ID 001 (Diabetes HbA1c Control) to avoid penalty.',
    impact: 'Avoid potential 7% Medicare payment reduction',
    effort: 'high',
    status: 'in_progress',
    dueDate: '2026-04-30',
    assignee: 'Dr. Chen',
    aiConfidence: 89,
  },
  {
    id: 3,
    category: 'operations',
    priority: 'medium',
    title: 'Optimize appointment scheduling',
    description: 'No-show rate of 18% identified. Implement automated reminder system with 48-hour and 24-hour notifications.',
    impact: 'Reduce no-shows by ~40%, recover $28,000/year',
    effort: 'low',
    status: 'pending',
    dueDate: '2026-05-01',
    assignee: null,
    aiConfidence: 87,
  },
  {
    id: 4,
    category: 'denials',
    priority: 'high',
    title: 'Address authorization denials',
    description: 'Prior authorization denials up 34% this quarter. Implement verification checklist for high-denial procedures.',
    impact: 'Reduce denial write-offs by $12,000/month',
    effort: 'medium',
    status: 'pending',
    dueDate: '2026-04-20',
    assignee: null,
    aiConfidence: 91,
  },
  {
    id: 5,
    category: 'revenue',
    priority: 'medium',
    title: 'Accelerate A/R collections',
    description: 'A/R over 90 days at $156,000 (15% above benchmark). Focus on 5 largest outstanding accounts.',
    impact: 'Improve cash flow by $80,000+ in 30 days',
    effort: 'medium',
    status: 'pending',
    dueDate: '2026-04-25',
    assignee: null,
    aiConfidence: 86,
  },
  {
    id: 6,
    category: 'quality',
    priority: 'low',
    title: 'Enhance patient satisfaction surveys',
    description: 'Response rate at 12%. Implement point-of-service survey tablets to capture real-time feedback.',
    impact: 'Improve patient retention by estimated 5%',
    effort: 'low',
    status: 'completed',
    dueDate: '2026-03-10',
    assignee: 'Lisa R.',
    aiConfidence: 82,
  },
]

const CATEGORIES = {
  revenue: { label: 'Revenue', color: '#059669', icon: '💰' },
  quality: { label: 'Quality', color: '#7c3aed', icon: '⭐' },
  operations: { label: 'Operations', color: '#0891b2', icon: '⚙️' },
  denials: { label: 'Denials', color: '#dc2626', icon: '❌' },
}

const PRIORITY_COLORS = {
  high: '#dc2626',
  medium: '#f59e0b',
  low: '#059669',
}

const STATUS_STYLES = {
  pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  in_progress: { bg: '#dbeafe', color: '#1e40af', label: 'In Progress' },
  completed: { bg: '#dcfce7', color: '#166534', label: 'Completed' },
  dismissed: { bg: '#f3f4f6', color: '#6b7280', label: 'Dismissed' },
}

// Individual Suggestion Card - Memoized for performance
const SuggestionCard = memo(function SuggestionCard({ suggestion, onStatusChange, onAssign }) {
  const [expanded, setExpanded] = useState(false)
  
  // Safe access to category and status with fallbacks
  const category = CATEGORIES[suggestion?.category] || { label: 'Unknown', color: '#6b7280', icon: '📋' }
  const statusStyle = STATUS_STYLES[suggestion?.status] || STATUS_STYLES.pending
  const priorityColor = PRIORITY_COLORS[suggestion?.priority] || PRIORITY_COLORS.medium
  
  // Early return for invalid suggestion
  if (!suggestion || !suggestion.id) return null
  
  const handleStatusChange = useCallback((newStatus) => {
    if (typeof onStatusChange === 'function') {
      onStatusChange(suggestion.id, newStatus)
    }
  }, [onStatusChange, suggestion.id])
  
  const overdueStyle = isOverdue(suggestion.dueDate) && suggestion.status !== 'completed' && suggestion.status !== 'dismissed'
    ? { color: '#dc2626', fontWeight: 600 }
    : {}
  
  return (
    <div 
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderLeft: `4px solid ${priorityColor}`,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        opacity: suggestion.status === 'dismissed' ? 0.6 : 1,
      }}
      role="article"
      aria-label={`Suggestion: ${suggestion.title}`}
    >
      <div 
        style={{ padding: 16, cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20 }} aria-hidden="true">{category.icon}</span>
            <span style={{
              padding: '2px 8px',
              background: `${category.color}15`,
              color: category.color,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
            }}>
              {category.label}
            </span>
            <span style={{
              padding: '2px 8px',
              background: statusStyle.bg,
              color: statusStyle.color,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
            }}>
              {statusStyle.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              padding: '2px 8px',
              background: '#f3f4f6',
              borderRadius: 4,
              fontSize: 11,
              color: '#6b7280',
            }}>
              🤖 {suggestion.aiConfidence ?? 0}% confidence
            </span>
            <span style={{ fontSize: 16, color: '#9ca3af' }} aria-hidden="true">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>
        
        <h4 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: 15 }}>
          {suggestion.title || 'Untitled Suggestion'}
        </h4>
        
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          fontSize: 12, 
          color: '#6b7280',
          flexWrap: 'wrap',
        }}>
          <span>📅 Due: {suggestion.dueDate}</span>
          <span>💪 Effort: {suggestion.effort}</span>
          {suggestion.assignee && <span>👤 {suggestion.assignee}</span>}
        </div>
      </div>
      
      {expanded && (
        <div style={{ 
          padding: '0 16px 16px', 
          borderTop: '1px solid #f3f4f6',
          marginTop: 8,
          paddingTop: 16,
        }}>
          <p style={{ margin: '0 0 12px 0', color: '#4b5563', fontSize: 14, lineHeight: 1.5 }}>
            {suggestion.description}
          </p>
          
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>💰 Estimated Impact</div>
            <div style={{ fontSize: 14, color: '#166534' }}>{suggestion.impact}</div>
          </div>
          
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggestion.status !== 'completed' && suggestion.status !== 'dismissed' && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onStatusChange(suggestion.id, 'in_progress'); }}
                  style={{
                    padding: '8px 14px',
                    background: suggestion.status === 'in_progress' ? '#3b82f6' : '#dbeafe',
                    color: suggestion.status === 'in_progress' ? 'white' : '#1e40af',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🚀 Start Working
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onStatusChange(suggestion.id, 'completed'); }}
                  style={{
                    padding: '8px 14px',
                    background: '#dcfce7',
                    color: '#166534',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ✅ Mark Complete
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onStatusChange(suggestion.id, 'dismissed'); }}
                  style={{
                    padding: '8px 14px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Dismiss
                </button>
              </>
            )}
            {suggestion.status === 'completed' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(suggestion.id, 'pending'); }}
                style={{
                  padding: '8px 14px',
                  background: '#fef3c7',
                  color: '#92400e',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                ↩️ Reopen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

SuggestionCard.propTypes = {
  suggestion: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    priority: PropTypes.oneOf(['high', 'medium', 'low']),
    status: PropTypes.oneOf(['pending', 'in_progress', 'completed', 'dismissed']),
    dueDate: PropTypes.string,
    assignee: PropTypes.string,
    aiConfidence: PropTypes.number,
    impact: PropTypes.string,
    effort: PropTypes.string,
  }),
  onStatusChange: PropTypes.func.isRequired,
  onAssign: PropTypes.func,
}

// Main AI Suggestions Todo Component
export function AISuggestionsTodo() {
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleStatusChange = useCallback((id, status) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }, [])
  
  const handleAssign = useCallback((id, assignee) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, assignee } : s))
  }, [])
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      // Could add new suggestions here
    }, 2000)
  }
  
  const filteredSuggestions = suggestions.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
    return true
  })
  
  const stats = {
    total: suggestions.length,
    pending: suggestions.filter(s => s.status === 'pending').length,
    inProgress: suggestions.filter(s => s.status === 'in_progress').length,
    completed: suggestions.filter(s => s.status === 'completed').length,
    highPriority: suggestions.filter(s => s.priority === 'high' && s.status !== 'completed').length,
  }
  
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
            🤖 AI Improvement Suggestions
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Actionable recommendations to optimize your practice performance
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isRefreshing ? '🔄 Analyzing...' : '🔄 Refresh Analysis'}
        </button>
      </div>
      
      {/* Stats Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: 12, 
        marginBottom: 24 
      }}>
        {[
          { label: 'Total', value: stats.total, icon: '📋', color: '#6b7280' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: '#f59e0b' },
          { label: 'In Progress', value: stats.inProgress, icon: '🚀', color: '#3b82f6' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: '#059669' },
          { label: 'High Priority', value: stats.highPriority, icon: '🔥', color: '#dc2626' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white',
            borderRadius: 10,
            padding: 14,
            textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: 20 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 12px',
                background: filter === f.id ? '#1e3c72' : '#f3f4f6',
                color: filter === f.id ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 12, display: 'flex', gap: 4 }}>
          <button
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '6px 12px',
              background: categoryFilter === 'all' ? '#1e3c72' : '#f3f4f6',
              color: categoryFilter === 'all' ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            All Categories
          </button>
          {Object.entries(CATEGORIES).map(([id, cat]) => (
            <button
              key={id}
              onClick={() => setCategoryFilter(id)}
              style={{
                padding: '6px 12px',
                background: categoryFilter === id ? cat.color : '#f3f4f6',
                color: categoryFilter === id ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Suggestions List */}
      <div>
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onStatusChange={handleStatusChange}
              onAssign={handleAssign}
            />
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 60, 
            background: '#f9fafb', 
            borderRadius: 12,
            color: '#6b7280',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>All caught up!</div>
            <div style={{ fontSize: 14 }}>No suggestions match your current filters</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISuggestionsTodo
