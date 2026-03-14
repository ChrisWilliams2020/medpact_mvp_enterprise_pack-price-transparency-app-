import React, { useState, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

// ============================================================================
// DEBUG PUBLISH BUTTON - Development utility for testing event publishing
// ============================================================================

const DebugPublishButton = memo(function DebugPublishButton({ 
  jobId = 'ui-debug',
  endpoint = '/imports/debug-publish',
  className = 'px-3 py-1 bg-yellow-400 text-black rounded',
  onSuccess,
  onError
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const handleClick = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setLastResult(null)

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, status: 'queued' })
      })

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
      }

      const data = await resp.json()
      setLastResult({ success: true, data })
      
      if (onSuccess) {
        onSuccess(data)
      } else {
        alert('Published: ' + JSON.stringify(data))
      }
    } catch (error) {
      const errorMessage = error?.message || 'Unknown error'
      setLastResult({ success: false, error: errorMessage })
      
      if (onError) {
        onError(error)
      } else {
        alert('Publish failed: ' + errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [jobId, endpoint, isLoading, onSuccess, onError])

  return (
    <button 
      onClick={handleClick} 
      className={className}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Publishing test event...' : 'Publish test event'}
      style={{ 
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'wait' : 'pointer',
        transition: 'opacity 0.2s ease'
      }}
    >
      {isLoading ? '⏳ Publishing...' : '🔧 Publish test event'}
    </button>
  )
})

DebugPublishButton.displayName = 'DebugPublishButton'

DebugPublishButton.propTypes = {
  /** Job ID to send in the publish request */
  jobId: PropTypes.string,
  /** API endpoint to publish to */
  endpoint: PropTypes.string,
  /** CSS class name for button styling */
  className: PropTypes.string,
  /** Callback on successful publish (receives response data) */
  onSuccess: PropTypes.func,
  /** Callback on publish error (receives error object) */
  onError: PropTypes.func,
}

export default DebugPublishButton
