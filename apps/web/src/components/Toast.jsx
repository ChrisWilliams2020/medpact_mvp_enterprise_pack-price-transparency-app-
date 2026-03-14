import React, {useState, useEffect, useCallback, memo} from 'react'
import PropTypes from 'prop-types'

// Toast Item Component
const ToastItem = memo(function ToastItem({ toast, index, onDismiss }) {
  const type = toast?.type || 'info'
  const message = toast?.message || ''
  
  const bgColor = type === 'error' ? 'bg-red-600' : 
                  type === 'warning' ? 'bg-yellow-500' : 
                  type === 'success' ? 'bg-green-600' : 'bg-blue-600'
  
  return (
    <div 
      className={`px-4 py-3 rounded-lg shadow-lg ${bgColor} text-white flex items-center gap-3`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={() => onDismiss(index)}
          className="text-white/80 hover:text-white"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  )
})

ToastItem.propTypes = {
  toast: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  }),
  index: PropTypes.number,
  onDismiss: PropTypes.func,
}

// Main Toasts Component
const Toasts = memo(function Toasts() {
  const [toasts, setToasts] = useState([])
  
  useEffect(() => {
    const handler = (e) => {
      const { message, type } = e.detail || {}
      if (message) {
        setToasts(prev => [...prev, { message, type: type || 'info' }])
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setToasts(prev => prev.slice(1))
        }, 5000)
      }
    }
    window.addEventListener('app:toast', handler)
    return () => window.removeEventListener('app:toast', handler)
  }, [])
  
  // Read toasts from window._toasts if present
  useEffect(() => {
    const t = window._toasts || []
    if (Array.isArray(t) && t.length > 0) {
      setToasts(t)
    }
  }, [])
  
  const handleDismiss = useCallback((index) => {
    setToasts(prev => prev.filter((_, i) => i !== index))
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed right-4 top-4 space-y-2 z-50" aria-label="Notifications">
      {toasts.map((t, i) => (
        <ToastItem 
          key={`toast-${i}`} 
          toast={t} 
          index={i}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  )
})

export default Toasts
