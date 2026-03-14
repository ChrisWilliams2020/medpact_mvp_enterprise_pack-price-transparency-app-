import React, { useState, useEffect, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { LineChart, BarChart, DonutChart, GaugeChart, Sparkline } from './Charts'

// ============================================================================
// AI-POWERED INSIGHTS ENGINE
// ============================================================================

// Helper for safe number formatting
const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value)
  return isNaN(num) ? fallback : num
}

const INSIGHT_TYPES = {
  OPPORTUNITY: 'opportunity',
  WARNING: 'warning',
  TREND: 'trend',
  BENCHMARK: 'benchmark',
  RECOMMENDATION: 'recommendation',
}

const INSIGHT_ICONS = {
  opportunity: '💡',
  warning: '⚠️',
  trend: '📈',
  benchmark: '🎯',
  recommendation: '✨',
}

const INSIGHT_COLORS = {
  opportunity: { bg: '#ecfdf5', border: '#059669', text: '#065f46' },
  warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
  trend: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
  benchmark: { bg: '#f5f3ff', border: '#8b5cf6', text: '#5b21b6' },
  recommendation: { bg: '#fdf4ff', border: '#d946ef', text: '#86198f' },
}

// Generate AI insights based on metric data
export function generateInsights(metrics, benchmarks = {}) {
  const insights = []
  
  // Net Collection Rate analysis
  if (metrics.net_collection_rate !== undefined) {
    const ncr = parseFloat(metrics.net_collection_rate)
    if (ncr < 95) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        title: 'Net Collection Rate Below Target',
        description: `Your NCR of ${ncr.toFixed(1)}% is below the industry benchmark of 98%. This could indicate billing inefficiencies or claim denial issues.`,
        impact: `Potential revenue loss: $${Math.round((98 - ncr) * 1000).toLocaleString()}/month`,
        actions: [
          'Review top denial reasons',
          'Audit claim submission processes',
          'Verify insurance eligibility upfront',
        ],
        priority: 'high',
      })
    } else if (ncr >= 98) {
      insights.push({
        type: INSIGHT_TYPES.BENCHMARK,
        title: 'Excellent Collection Performance',
        description: `Your NCR of ${ncr.toFixed(1)}% exceeds industry benchmarks. Maintain current billing practices.`,
        impact: 'Top 10% performer in revenue cycle',
        priority: 'low',
      })
    }
  }
  
  // Days in AR analysis
  if (metrics.days_in_ar !== undefined) {
    const dar = parseFloat(metrics.days_in_ar)
    if (dar > 40) {
      insights.push({
        type: INSIGHT_TYPES.OPPORTUNITY,
        title: 'Reduce Days in Accounts Receivable',
        description: `Your DAR of ${dar.toFixed(0)} days exceeds the target of 32 days. Faster collections improve cash flow.`,
        impact: `Reducing DAR by ${(dar - 32).toFixed(0)} days could free up $${Math.round((dar - 32) * 2500).toLocaleString()} in working capital`,
        actions: [
          'Implement automated follow-up workflows',
          'Review aging buckets >90 days',
          'Consider early-out vendor partnership',
        ],
        priority: 'high',
      })
    }
  }
  
  // EBITDA Margin analysis
  if (metrics.ebitda_margin !== undefined) {
    const margin = parseFloat(metrics.ebitda_margin)
    if (margin < 20) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        title: 'EBITDA Margin Under Pressure',
        description: `Current margin of ${margin.toFixed(1)}% is below the PE benchmark of 25%. Evaluate cost structure.`,
        impact: 'May affect practice valuation multiple',
        actions: [
          'Review staffing ratios',
          'Analyze vendor contracts for savings',
          'Evaluate supply chain costs',
        ],
        priority: 'high',
      })
    } else if (margin >= 28) {
      insights.push({
        type: INSIGHT_TYPES.BENCHMARK,
        title: 'Strong Profitability',
        description: `EBITDA margin of ${margin.toFixed(1)}% positions you in the top quartile of ophthalmology practices.`,
        impact: 'Attractive for PE investment or expansion',
        priority: 'low',
      })
    }
  }
  
  // Revenue per Provider analysis
  if (metrics.revenue_per_provider !== undefined) {
    const rpp = parseFloat(metrics.revenue_per_provider)
    if (rpp < 550000) {
      insights.push({
        type: INSIGHT_TYPES.OPPORTUNITY,
        title: 'Provider Productivity Opportunity',
        description: `Revenue per provider of $${rpp.toLocaleString()} is below the benchmark of $625,000.`,
        impact: `Potential annual revenue increase: $${Math.round((625000 - rpp) * (metrics.provider_count || 1)).toLocaleString()}`,
        actions: [
          'Optimize provider schedules',
          'Review no-show rates and fill rates',
          'Evaluate procedure conversion rates',
        ],
        priority: 'medium',
      })
    }
  }
  
  // Procedure Conversion analysis
  if (metrics.procedure_conversion !== undefined) {
    const pc = parseFloat(metrics.procedure_conversion)
    if (pc < 30) {
      insights.push({
        type: INSIGHT_TYPES.RECOMMENDATION,
        title: 'Improve Surgical Pipeline',
        description: `Procedure conversion rate of ${pc.toFixed(1)}% is below the 35% benchmark.`,
        impact: 'Higher conversion drives surgical revenue growth',
        actions: [
          'Implement surgical coordinator role',
          'Review patient education materials',
          'Track conversion by surgeon',
        ],
        priority: 'medium',
      })
    }
  }
  
  // Denial Rate analysis
  if (metrics.denial_rate !== undefined) {
    const dr = parseFloat(metrics.denial_rate)
    if (dr > 8) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        title: 'High Claim Denial Rate',
        description: `Denial rate of ${dr.toFixed(1)}% significantly exceeds the 5% target.`,
        impact: `Estimated revenue at risk: $${Math.round(dr * 5000).toLocaleString()}/month`,
        actions: [
          'Analyze denial by payer and code',
          'Train staff on common denial reasons',
          'Implement pre-authorization workflows',
        ],
        priority: 'critical',
      })
    }
  }
  
  // Trend-based insights
  if (metrics.trend_data?.revenue) {
    const revenueData = metrics.trend_data.revenue
    const growth = ((revenueData[revenueData.length - 1] - revenueData[0]) / revenueData[0]) * 100
    if (growth > 10) {
      insights.push({
        type: INSIGHT_TYPES.TREND,
        title: 'Strong Revenue Growth Trajectory',
        description: `Revenue has grown ${growth.toFixed(1)}% over the analysis period.`,
        impact: 'Positive trend supports expansion plans',
        priority: 'low',
      })
    } else if (growth < -5) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        title: 'Declining Revenue Trend',
        description: `Revenue has decreased ${Math.abs(growth).toFixed(1)}% - investigate root causes.`,
        impact: 'May require operational adjustments',
        actions: [
          'Review patient volume trends',
          'Analyze payer mix changes',
          'Evaluate market competition',
        ],
        priority: 'critical',
      })
    }
  }
  
  return insights.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// Insight Card Component
export const InsightCard = memo(function InsightCard({ insight, onDismiss, onAction }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const insightType = insight?.type || 'recommendation'
  const colors = INSIGHT_COLORS[insightType] || INSIGHT_COLORS.recommendation
  const icon = INSIGHT_ICONS[insightType] || '✨'
  const title = insight?.title || 'Insight'
  const description = insight?.description || ''
  const impact = insight?.impact || ''
  const actions = insight?.actions || []
  const priority = insight?.priority || 'medium'
  
  const handleDismiss = useCallback(() => {
    if (onDismiss) onDismiss()
  }, [onDismiss])
  
  const handleAction = useCallback((action) => {
    if (onAction) onAction(action)
  }, [onAction])
  
  return (
    <div 
      style={{
        background: colors.bg,
        borderRadius: 12,
        padding: 20,
        borderLeft: `4px solid ${colors.border}`,
        marginBottom: 16,
        transition: 'all 0.3s ease',
      }}
      role="article"
      aria-label={`${insightType} insight: ${title}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <h4 style={{ margin: 0, color: colors.text, fontSize: 16 }}>{title}</h4>
            {priority === 'critical' && (
              <span style={{
                background: '#dc2626',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
              }}>CRITICAL</span>
            )}
          </div>
          <p style={{ color: '#4b5563', fontSize: 14, margin: '0 0 8px 0', lineHeight: 1.5 }}>
            {insight.description}
          </p>
          {insight.impact && (
            <div style={{ 
              background: 'rgba(255,255,255,0.5)', 
              padding: '8px 12px', 
              borderRadius: 6, 
              fontSize: 13,
              color: colors.text,
              fontWeight: 500,
              display: 'inline-block',
              marginBottom: 12,
            }}>
              💰 {insight.impact}
            </div>
          )}
        </div>
        {onDismiss && (
          <button 
            onClick={() => onDismiss(insight)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#9ca3af',
              fontSize: 18,
            }}
          >×</button>
        )}
      </div>
      
      {insight.actions && insight.actions.length > 0 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: colors.border,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {isExpanded ? '▼' : '▶'} Recommended Actions ({insight.actions.length})
          </button>
          
          {isExpanded && (
            <ul style={{ 
              margin: '12px 0 0 0', 
              padding: '0 0 0 20px',
              color: '#4b5563',
              fontSize: 14,
            }}>
              {insight.actions.map((action, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  {action}
                  {onAction && (
                    <button
                      onClick={() => onAction(action)}
                      style={{
                        marginLeft: 8,
                        background: colors.border,
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >Take Action</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
})

InsightCard.propTypes = {
  insight: PropTypes.shape({
    type: PropTypes.oneOf(['opportunity', 'warning', 'trend', 'benchmark', 'recommendation']),
    title: PropTypes.string,
    description: PropTypes.string,
    impact: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.string),
    priority: PropTypes.oneOf(['critical', 'high', 'medium', 'low']),
  }),
  onDismiss: PropTypes.func,
  onAction: PropTypes.func,
}

// Insights Panel Component
export const InsightsPanel = memo(function InsightsPanel({ metrics = {}, onClose }) {
  const insights = useMemo(() => generateInsights(metrics), [metrics])
  const [dismissedIds, setDismissedIds] = useState([])
  
  const visibleInsights = insights.filter((_, i) => !dismissedIds.includes(i))
  
  const criticalCount = visibleInsights.filter(i => i.priority === 'critical').length
  const highCount = visibleInsights.filter(i => i.priority === 'high').length
  
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
      maxHeight: '80vh',
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', color: '#1e3c72', fontSize: 22 }}>
            🤖 AI-Powered Insights
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            {visibleInsights.length} actionable insights • {criticalCount} critical • {highCount} high priority
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >Close</button>
        )}
      </div>
      
      {visibleInsights.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e3c72' }}>All Clear!</h3>
          <p>No critical insights at this time. Keep up the great work!</p>
        </div>
      ) : (
        visibleInsights.map((insight, i) => (
          <InsightCard 
            key={i} 
            insight={insight} 
            onDismiss={() => setDismissedIds([...dismissedIds, i])}
          />
        ))
      )}
    </div>
  )
})

InsightsPanel.propTypes = {
  metrics: PropTypes.object,
  onClose: PropTypes.func,
}

export default { generateInsights, InsightCard, InsightsPanel }
