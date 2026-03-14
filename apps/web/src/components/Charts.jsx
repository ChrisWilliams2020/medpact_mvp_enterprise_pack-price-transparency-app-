import React, { useState, useEffect, useRef, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// TREND VISUALIZATION CHARTS
// ============================================================================

// Helper function - moved to top for use in components
function formatNumber(num) {
  if (num == null || isNaN(num)) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  if (num % 1 !== 0) return num.toFixed(2)
  return num.toString()
}

// Simple Line Chart Component (no external dependencies)
export const LineChart = memo(function LineChart({ data = [], labels = [], title, color = '#667eea', height = 200 }) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    if (!canvasRef.current || !data?.length) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const h = canvas.height
    
    // Clear canvas
    ctx.clearRect(0, 0, width, h)
    
    // Calculate bounds
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = h - padding * 2
    const maxVal = Math.max(...data) * 1.1
    const minVal = Math.min(...data) * 0.9
    const range = maxVal - minVal || 1
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight * i) / 4
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      
      // Y-axis labels
      const value = maxVal - (range * i) / 4
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(formatNumber(value), padding - 8, y + 4)
    }
    
    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    
    data.forEach((val, i) => {
      const x = padding + (chartWidth * i) / (data.length - 1 || 1)
      const y = padding + chartHeight - ((val - minVal) / range) * chartHeight
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, h - padding)
    gradient.addColorStop(0, color + '40')
    gradient.addColorStop(1, color + '05')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    data.forEach((val, i) => {
      const x = padding + (chartWidth * i) / (data.length - 1 || 1)
      const y = padding + chartHeight - ((val - minVal) / range) * chartHeight
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineTo(width - padding, h - padding)
    ctx.lineTo(padding, h - padding)
    ctx.closePath()
    ctx.fill()
    
    // Draw data points
    ctx.fillStyle = color
    data.forEach((val, i) => {
      const x = padding + (chartWidth * i) / (data.length - 1 || 1)
      const y = padding + chartHeight - ((val - minVal) / range) * chartHeight
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // X-axis labels
    if (labels) {
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      labels.forEach((label, i) => {
        const x = padding + (chartWidth * i) / (labels.length - 1 || 1)
        ctx.fillText(label, x, h - 10)
      })
    }
    
  }, [data, labels, color])
  
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16 }}>
      {title && <h4 style={{ margin: '0 0 12px 0', color: '#1e3c72', fontSize: 16 }}>{title}</h4>}
      <canvas ref={canvasRef} width={500} height={height} style={{ width: '100%', height }} />
    </div>
  )
})

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.number,
}

// Bar Chart Component
export const BarChart = memo(function BarChart({ data = [], labels = [], title, colors = ['#667eea'], height = 200 }) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    if (!canvasRef.current || !data?.length) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const h = canvas.height
    
    ctx.clearRect(0, 0, width, h)
    
    const padding = 50
    const chartWidth = width - padding * 2
    const chartHeight = h - padding * 2
    const maxVal = Math.max(...data) * 1.1
    const barWidth = (chartWidth / data.length) * 0.7
    const gap = (chartWidth / data.length) * 0.3
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight * i) / 4
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      
      const value = maxVal - (maxVal * i) / 4
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(formatNumber(value), padding - 8, y + 4)
    }
    
    // Draw bars
    data.forEach((val, i) => {
      const x = padding + (chartWidth * i) / data.length + gap / 2
      const barHeight = (val / maxVal) * chartHeight
      const y = padding + chartHeight - barHeight
      
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
      const color = colors[i % colors.length]
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, color + 'cc')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
      ctx.fill()
      
      // Value on top
      ctx.fillStyle = '#374151'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(formatNumber(val), x + barWidth / 2, y - 8)
    })
    
    // X-axis labels
    if (labels) {
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      labels.forEach((label, i) => {
        const x = padding + (chartWidth * i) / data.length + gap / 2 + barWidth / 2
        ctx.fillText(label.substring(0, 8), x, h - 10)
      })
    }
    
  }, [data, labels, colors])
  
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16 }}>
      {title && <h4 style={{ margin: '0 0 12px 0', color: '#1e3c72', fontSize: 16 }}>{title}</h4>}
      <canvas ref={canvasRef} width={500} height={height} style={{ width: '100%', height }} />
    </div>
  )
})

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
}

// Donut Chart Component
export const DonutChart = memo(function DonutChart({ data = [], labels = [], title, colors, size = 180 }) {
  const canvasRef = useRef(null)
  const defaultColors = ['#667eea', '#f5576c', '#11998e', '#FF6600', '#8b5cf6', '#0891b2']
  const chartColors = colors || defaultColors
  
  useEffect(() => {
    if (!canvasRef.current || !data?.length) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4
    const innerRadius = size * 0.25
    
    ctx.clearRect(0, 0, size, size)
    
    const total = data.reduce((a, b) => a + b, 0)
    let startAngle = -Math.PI / 2
    
    data.forEach((val, i) => {
      const sliceAngle = (val / total) * Math.PI * 2
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true)
      ctx.closePath()
      ctx.fillStyle = chartColors[i % chartColors.length]
      ctx.fill()
      
      startAngle += sliceAngle
    })
    
    // Center text
    ctx.fillStyle = '#1e3c72'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(formatNumber(total), centerX, centerY - 8)
    ctx.font = '11px sans-serif'
    ctx.fillStyle = '#6b7280'
    ctx.fillText('Total', centerX, centerY + 12)
    
  }, [data, chartColors, size])
  
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {title && <h4 style={{ margin: '0 0 12px 0', color: '#1e3c72', fontSize: 16, textAlign: 'center' }}>{title}</h4>}
      <canvas ref={canvasRef} width={size} height={size} />
      {labels && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, justifyContent: 'center' }}>
          {labels.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: chartColors[i % chartColors.length] }} />
              <span style={{ color: '#6b7280' }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

DonutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number,
}

// Gauge Chart for percentages
export const GaugeChart = memo(function GaugeChart({ value = 0, max = 100, title, color = '#667eea', size = 150 }) {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0
  const safeMax = typeof max === 'number' && max > 0 ? max : 100
  const percentage = Math.min((safeValue / safeMax) * 100, 100)
  const angle = (percentage / 100) * 180
  
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, textAlign: 'center' }}>
      {title && <h4 style={{ margin: '0 0 12px 0', color: '#1e3c72', fontSize: 14 }}>{title}</h4>}
      <svg width={size} height={size * 0.6} viewBox="0 0 200 120" aria-label={`${title || 'Gauge'}: ${safeValue.toFixed(1)}%`}>
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 251.2} 251.2`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        {/* Center value */}
        <text x="100" y="95" textAnchor="middle" fill="#1e3c72" fontSize="28" fontWeight="bold">
          {safeValue.toFixed(1)}%
        </text>
      </svg>
    </div>
  )
})

GaugeChart.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  title: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
}

// Sparkline for inline trends
export const Sparkline = memo(function Sparkline({ data = [], width = 100, height = 30, color = '#667eea' }) {
  if (!data?.length) return null
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1 || 1)) * width
    const y = height - ((val - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  
  const trend = data[data.length - 1] >= data[0] ? '#059669' : '#dc2626'
  
  return (
    <svg width={width} height={height} aria-label="Trend indicator">
      <polyline
        points={points}
        fill="none"
        stroke={trend}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
})

Sparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
}

export default { LineChart, BarChart, DonutChart, GaugeChart, Sparkline }
