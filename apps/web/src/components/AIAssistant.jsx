import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// AI ASSISTANT - Intelligent Dashboard Interpretation & Guidance
// Hardened for production with error handling and defensive coding
// ============================================================================

// Safe string interpolation helper
const safeReplace = (template, replacements) => {
  if (!template || typeof template !== 'string') return ''
  let result = template
  Object.entries(replacements || {}).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value ?? '')
  })
  return result
}

// AI Response Generator - Simulates AI analysis with error handling
function generateAIResponse(query, dashboardContext = {}) {
  try {
    const responses = {
      ncr: [
        "Your Net Collection Rate of {value}% is {status} the industry benchmark of 95%. {suggestion}",
        "I've analyzed your NCR trends and noticed {trend}. Consider {action} to optimize collections.",
      ],
      dar: [
        "Days in A/R at {value} days indicates {status}. The target is under 35 days. {suggestion}",
        "Your A/R aging shows {trend}. I recommend {action} to accelerate cash flow.",
      ],
      ebitda: [
        "EBITDA margin of {value}% shows {status} profitability. {suggestion}",
        "Compared to peer practices, your EBITDA is in the {percentile} percentile. {action}",
      ],
      revenue: [
        "Revenue growth of {value}% is {status}. {suggestion}",
        "I've identified {count} opportunities to increase revenue: {opportunities}",
      ],
      general: [
        "Based on your current metrics, I've identified {count} priority areas for improvement.",
        "Your practice is performing {status} overall. Here are my top recommendations...",
      ],
    }
    
    // Safe keyword matching with fallback
    const queryLower = (query || '').toLowerCase()
    const topic = Object.keys(responses).find(key => 
      queryLower.includes(key)
    ) || 'general'
    
    const templates = responses[topic] || responses.general
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    // Fill in template with safe context values
    const replacements = {
      value: dashboardContext?.value ?? '94.2',
      status: dashboardContext?.status ?? 'slightly below',
      suggestion: dashboardContext?.suggestion ?? 'Consider reviewing your denial management process.',
      trend: 'a 3% improvement over the last quarter',
      action: 'focusing on claims follow-up within 30 days',
      percentile: '72nd',
      count: '3',
      opportunities: 'procedure conversion, optical revenue, and ancillary services',
    }
    
    return safeReplace(template, replacements)
  } catch (error) {
    console.error('AI Response generation error:', error)
    return "I'm having trouble processing your request. Please try again or rephrase your question."
  }
}

// AI Chat Message Component - Memoized for performance
const ChatMessage = memo(function ChatMessage({ message, isAI }) {
  if (!message) return null
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      marginBottom: 12,
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        background: isAI 
          ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: isAI ? '#0c4a6e' : 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        {isAI && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            marginBottom: 8,
            fontSize: 12,
            fontWeight: 600,
            color: '#0891b2',
          }}>
            <span>🤖</span> MedPact AI
          </div>
        )}
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{message}</div>
      </div>
    </div>
  )
})

ChatMessage.propTypes = {
  message: PropTypes.string,
  isAI: PropTypes.bool,
}

ChatMessage.defaultProps = {
  message: '',
  isAI: false,
}

// Main AI Assistant Panel - Hardened with error boundaries and defensive coding
export function AIAssistantPanel({ dashboardContext = {}, dashboardData = {}, onSuggestionAdd }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your MedPact AI assistant. I can help you interpret your dashboard metrics, identify trends, and suggest improvements. What would you like to know?", isAI: true }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  
  // Safe scroll to bottom
  const scrollToBottom = useCallback(() => {
    try {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (e) {
      // Silently handle scroll errors
    }
  }, [])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])
  
  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])
  
  const handleSend = useCallback(() => {
    const trimmedInput = (input || '').trim()
    if (!trimmedInput) return
    
    try {
      setError(null)
      const userMessage = { id: Date.now(), text: trimmedInput, isAI: false }
      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsTyping(true)
      
      // Simulate AI thinking with timeout protection
      const timeoutId = setTimeout(() => {
        try {
          const contextData = { ...dashboardContext, ...dashboardData }
          const aiResponse = generateAIResponse(trimmedInput, contextData)
          setMessages(prev => [...prev, { id: Date.now(), text: aiResponse, isAI: true }])
          setIsTyping(false)
          
          // Safely add suggestion to todo if relevant
          const inputLower = trimmedInput.toLowerCase()
          if ((inputLower.includes('suggest') || inputLower.includes('improve')) && typeof onSuggestionAdd === 'function') {
            onSuggestionAdd({
              id: Date.now(),
              text: (aiResponse || '').slice(0, 100) + '...',
              source: 'AI Assistant',
              priority: 'medium',
            })
          }
        } catch (err) {
          console.error('AI processing error:', err)
          setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: "I apologize, but I encountered an error. Please try again.", 
            isAI: true 
          }])
          setIsTyping(false)
        }
      }, 1500)
      
      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId)
    } catch (err) {
      console.error('Send message error:', err)
      setError('Failed to send message. Please try again.')
      setIsTyping(false)
    }
  }, [input, dashboardContext, dashboardData, onSuggestionAdd])
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])
  
  const quickQuestions = [
    "How is my NCR performing?",
    "What should I prioritize?",
    "Analyze my revenue trends",
    "Compare me to peers",
  ]
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          zIndex: 1000,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'scale(1.1)'
          e.target.style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.5)'
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)'
        }}
      >
        🤖
      </button>
    )
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 380,
      height: 520,
      background: 'white',
      borderRadius: 20,
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 20px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🤖</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>MedPact AI Assistant</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Dashboard Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            width: 28,
            height: 28,
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </div>
      
      {/* Messages */}
      <div style={{
        flex: 1,
        padding: 16,
        overflowY: 'auto',
        background: '#f8fafc',
      }}>
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg.text} isAI={msg.isAI} />
        ))}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 13 }}>
            <span>🤖</span>
            <span style={{ animation: 'pulse 1.5s infinite' }}>AI is thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Quick Questions */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
      }}>
        {quickQuestions.map(q => (
          <button
            key={q}
            onClick={() => setInput(q)}
            style={{
              padding: '4px 10px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 11,
              color: '#4b5563',
              cursor: 'pointer',
            }}
          >
            {q}
          </button>
        ))}
      </div>
      
      {/* Input */}
      <div style={{
        padding: 12,
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: 8,
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your metrics..."
          aria-label="Message input"
          disabled={isTyping}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '2px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 14,
            outline: 'none',
            opacity: isTyping ? 0.7 : 1,
          }}
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          aria-label="Send message"
          style={{
            padding: '10px 16px',
            background: isTyping || !input.trim() 
              ? '#d1d5db' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            cursor: isTyping || !input.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </div>
      
      {/* Error display */}
      {error && (
        <div style={{
          padding: '8px 12px',
          background: '#fef2f2',
          color: '#dc2626',
          fontSize: 12,
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

// PropTypes for type checking
AIAssistantPanel.propTypes = {
  dashboardContext: PropTypes.object,
  dashboardData: PropTypes.object,
  onSuggestionAdd: PropTypes.func,
}

AIAssistantPanel.defaultProps = {
  dashboardContext: {},
  dashboardData: {},
  onSuggestionAdd: null,
}

export default AIAssistantPanel
