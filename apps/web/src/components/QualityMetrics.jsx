import React, { useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { GaugeChart, BarChart } from './Charts'

// ============================================================================
// QUALITY METRICS - MIPS, HEDIS, PATIENT SATISFACTION
// ============================================================================

// Safe number helper
const safeNumber = (val, fallback = 0) => {
  const num = parseFloat(val)
  return isNaN(num) ? fallback : num
}

// MIPS Quality Measures for Ophthalmology
const MIPS_MEASURES = {
  quality: [
    { id: 'Q012', name: 'Primary Open-Angle Glaucoma: Optic Nerve Evaluation', target: 80, weight: 6 },
    { id: 'Q014', name: 'Age-Related Macular Degeneration: Dilated Macular Exam', target: 80, weight: 6 },
    { id: 'Q019', name: 'Diabetic Retinopathy: Communication with Physician', target: 80, weight: 6 },
    { id: 'Q117', name: 'Diabetes: Eye Exam', target: 60, weight: 6 },
    { id: 'Q140', name: 'Age-Related Macular Degeneration: Counseling on AMD', target: 80, weight: 6 },
    { id: 'Q141', name: 'Primary Open-Angle Glaucoma: Reduction of IOP by 15%', target: 70, weight: 6 },
  ],
  cost: [
    { id: 'TPCC', name: 'Total Per Capita Cost', benchmark: 1000, weight: 15 },
    { id: 'MSPB', name: 'Medicare Spending Per Beneficiary', benchmark: 950, weight: 15 },
  ],
  improvement: [
    { id: 'IA_BE_4', name: 'Engagement of Patients Through Technology', points: 20 },
    { id: 'IA_EPA_1', name: 'Provide 24/7 Access to Clinicians', points: 20 },
    { id: 'IA_PM_13', name: 'Chronic Care Management', points: 20 },
    { id: 'IA_CC_8', name: 'Implementation of Documentation Improvements', points: 10 },
  ],
  pi: [
    { id: 'PI_PPHI_1', name: 'Security Risk Analysis', required: true, points: 0 },
    { id: 'PI_EP_1', name: 'e-Prescribing', target: 70, points: 10 },
    { id: 'PI_HIE_1', name: 'Support Electronic Referral Loops', target: 30, points: 20 },
    { id: 'PI_CEHRT_1', name: 'Provide Patients Electronic Access', target: 80, points: 40 },
  ],
}

// HEDIS Measures relevant to ophthalmology
const HEDIS_MEASURES = [
  { id: 'CDC', name: 'Comprehensive Diabetes Care - Eye Exam', target: 58, current: 0 },
  { id: 'COL', name: 'Colorectal Cancer Screening (referral)', target: 52, current: 0 },
  { id: 'BCS', name: 'Breast Cancer Screening (referral)', target: 74, current: 0 },
]

// Calculate MIPS Score
export function calculateMIPSScore(qualityData, costData, improvementActivities, piData) {
  let totalScore = 0
  
  // Quality (40% of total)
  if (qualityData && qualityData.length > 0) {
    const qualityScore = qualityData.reduce((sum, q) => {
      const measure = MIPS_MEASURES.quality.find(m => m.id === q.id)
      if (!measure) return sum
      const achievement = Math.min((q.value / measure.target) * 10, 10)
      return sum + (achievement * measure.weight / 6)
    }, 0)
    totalScore += Math.min(qualityScore, 40)
  }
  
  // Cost (20% of total)
  if (costData && costData.length > 0) {
    const costScore = costData.reduce((sum, c) => {
      const measure = MIPS_MEASURES.cost.find(m => m.id === c.id)
      if (!measure) return sum
      const achievement = c.value <= measure.benchmark ? 10 : Math.max(0, 10 - (c.value - measure.benchmark) / 50)
      return sum + (achievement * measure.weight / 15)
    }, 0)
    totalScore += Math.min(costScore, 20)
  }
  
  // Improvement Activities (15% of total)
  if (improvementActivities && improvementActivities.length > 0) {
    const iaPoints = improvementActivities.reduce((sum, ia) => {
      const measure = MIPS_MEASURES.improvement.find(m => m.id === ia.id)
      return sum + (measure ? measure.points : 0)
    }, 0)
    totalScore += Math.min(iaPoints / 40 * 15, 15)
  }
  
  // Promoting Interoperability (25% of total)
  if (piData) {
    const hasSecurityRisk = piData.some(p => p.id === 'PI_PPHI_1' && p.completed)
    if (hasSecurityRisk) {
      const piScore = piData.reduce((sum, p) => {
        const measure = MIPS_MEASURES.pi.find(m => m.id === p.id)
        if (!measure || measure.required) return sum
        const achievement = Math.min((p.value / measure.target) * measure.points, measure.points)
        return sum + achievement
      }, 0)
      totalScore += Math.min(piScore / 70 * 25, 25)
    }
  }
  
  return Math.round(totalScore)
}

// MIPS Dashboard Component
export function MIPSDashboard({ qualityData = [], costData = [], improvementActivities = [], piData = [] }) {
  const mipsScore = useMemo(() => 
    calculateMIPSScore(qualityData, costData, improvementActivities, piData),
    [qualityData, costData, improvementActivities, piData]
  )
  
  const getScoreColor = (score) => {
    if (score >= 89) return '#059669'
    if (score >= 75) return '#0891b2'
    if (score >= 60) return '#f59e0b'
    return '#dc2626'
  }
  
  const getScoreLabel = (score) => {
    if (score >= 89) return 'Exceptional'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Neutral'
    return 'Penalty'
  }
  
  const paymentAdjustment = useMemo(() => {
    if (mipsScore >= 89) return '+9%'
    if (mipsScore >= 75) return '+4%'
    if (mipsScore >= 60) return '0%'
    if (mipsScore >= 45) return '-3%'
    return '-9%'
  }, [mipsScore])
  
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: 24 }}>
          ⭐ MIPS Quality Dashboard
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Merit-based Incentive Payment System tracking and optimization
        </p>
      </div>
      
      {/* Overall Score Card */}
      <div style={{
        background: `linear-gradient(135deg, ${getScoreColor(mipsScore)} 0%, ${getScoreColor(mipsScore)}dd 100%)`,
        borderRadius: 20,
        padding: 32,
        color: 'white',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 18, opacity: 0.9 }}>Composite MIPS Score</h3>
          <div style={{ fontSize: 64, fontWeight: 'bold', lineHeight: 1 }}>{mipsScore}</div>
          <div style={{ fontSize: 16, marginTop: 8 }}>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '4px 12px', 
              borderRadius: 20 
            }}>
              {getScoreLabel(mipsScore)}
            </span>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Payment Adjustment</div>
          <div style={{ 
            fontSize: 36, 
            fontWeight: 'bold',
            background: 'rgba(255,255,255,0.2)',
            padding: '12px 24px',
            borderRadius: 12,
          }}>
            {paymentAdjustment}
          </div>
          <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>
            Estimated annual impact: ${(parseFloat(paymentAdjustment) * 15000).toLocaleString()}
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { label: 'Quality', weight: 40, score: Math.min(qualityData.length * 6, 40) },
            { label: 'Cost', weight: 20, score: Math.min(costData.length * 10, 20) },
            { label: 'Improvement', weight: 15, score: Math.min(improvementActivities.length * 5, 15) },
            { label: 'Promoting Int.', weight: 25, score: Math.min(piData.filter(p => !p.required).length * 8, 25) },
          ].map(cat => (
            <div key={cat.label} style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: 12, 
              borderRadius: 8,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{cat.label} ({cat.weight}%)</div>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>{cat.score}/{cat.weight}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quality Measures */}
      <div style={{ 
        background: 'white', 
        borderRadius: 16, 
        padding: 24, 
        marginBottom: 24,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1e3c72', fontSize: 18 }}>
          📋 Quality Measures (40 points)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {MIPS_MEASURES.quality.map(measure => {
            const data = qualityData.find(q => q.id === measure.id)
            const value = data?.value || 0
            const percentage = Math.min((value / measure.target) * 100, 100)
            
            return (
              <div key={measure.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 12, 
                padding: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{measure.id}</span>
                  <span style={{ 
                    fontSize: 12, 
                    color: percentage >= 100 ? '#059669' : '#f59e0b',
                    fontWeight: 600,
                  }}>
                    {value}% / {measure.target}% target
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>{measure.name}</div>
                <div style={{ 
                  width: '100%', 
                  height: 8, 
                  background: '#e5e7eb', 
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <div style={{ 
                    width: `${percentage}%`, 
                    height: '100%', 
                    background: percentage >= 100 ? '#059669' : percentage >= 80 ? '#0891b2' : '#f59e0b',
                    borderRadius: 4,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Improvement Activities */}
      <div style={{ 
        background: 'white', 
        borderRadius: 16, 
        padding: 24,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1e3c72', fontSize: 18 }}>
          🚀 Improvement Activities (15 points)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {MIPS_MEASURES.improvement.map(activity => {
            const isCompleted = improvementActivities.some(ia => ia.id === activity.id)
            
            return (
              <div key={activity.id} style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                border: `2px solid ${isCompleted ? '#059669' : '#e5e7eb'}`,
                borderRadius: 10,
                background: isCompleted ? '#f0fdf4' : 'white',
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isCompleted ? '#059669' : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 14,
                }}>
                  {isCompleted ? '✓' : ''}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{activity.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{activity.points} points</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Patient Satisfaction Dashboard
export function PatientSatisfactionDashboard({ satisfactionData }) {
  const defaultData = {
    overallRating: 4.2,
    nps: 42,
    waitTime: 3.8,
    communication: 4.5,
    easeOfScheduling: 4.1,
    staffFriendliness: 4.6,
    facilityClean: 4.7,
    wouldRecommend: 87,
    responses: 1247,
    responseRate: 23,
  }
  
  const data = { ...defaultData, ...satisfactionData }
  
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 24px 0', color: '#1e3c72', fontSize: 24 }}>
        😊 Patient Satisfaction
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* Overall Rating */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: 16, 
          padding: 24, 
          color: 'white',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Overall Rating</div>
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>{data.overallRating}</div>
          <div style={{ fontSize: 24 }}>{'★'.repeat(Math.round(data.overallRating))}{'☆'.repeat(5 - Math.round(data.overallRating))}</div>
        </div>
        
        {/* NPS */}
        <div style={{ 
          background: data.nps >= 50 ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 
                      data.nps >= 0 ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' :
                      'linear-gradient(135deg, #dc2626 0%, #f87171 100%)', 
          borderRadius: 16, 
          padding: 24, 
          color: 'white',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Net Promoter Score</div>
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>{data.nps}</div>
          <div style={{ fontSize: 14 }}>
            {data.nps >= 50 ? 'Excellent' : data.nps >= 0 ? 'Good' : 'Needs Work'}
          </div>
        </div>
        
        {/* Would Recommend */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', 
          borderRadius: 16, 
          padding: 24, 
          color: 'white',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Would Recommend</div>
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>{data.wouldRecommend}%</div>
          <div style={{ fontSize: 14 }}>{data.responses} responses</div>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1e3c72' }}>Satisfaction by Category</h3>
        
        {[
          { label: 'Staff Friendliness', value: data.staffFriendliness, icon: '😊' },
          { label: 'Facility Cleanliness', value: data.facilityClean, icon: '✨' },
          { label: 'Communication', value: data.communication, icon: '💬' },
          { label: 'Ease of Scheduling', value: data.easeOfScheduling, icon: '📅' },
          { label: 'Wait Time Satisfaction', value: data.waitTime, icon: '⏱️' },
        ].map(metric => (
          <div key={metric.label} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: '#374151' }}>
                {metric.icon} {metric.label}
              </span>
              <span style={{ fontWeight: 600, color: metric.value >= 4.5 ? '#059669' : metric.value >= 4 ? '#0891b2' : '#f59e0b' }}>
                {metric.value.toFixed(1)} / 5.0
              </span>
            </div>
            <div style={{ width: '100%', height: 10, background: '#e5e7eb', borderRadius: 5 }}>
              <div style={{ 
                width: `${(metric.value / 5) * 100}%`, 
                height: '100%', 
                background: metric.value >= 4.5 ? '#059669' : metric.value >= 4 ? '#0891b2' : '#f59e0b',
                borderRadius: 5,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

MIPSDashboard.propTypes = {
  practiceScores: PropTypes.object,
}

PatientSatisfactionDashboard.propTypes = {
  satisfactionData: PropTypes.object,
}

export default { MIPSDashboard, PatientSatisfactionDashboard, calculateMIPSScore }
