import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'

const Button = memo(function Button({
  children, 
  onClick, 
  className = '', 
  type = 'button',
  disabled = false,
  ariaLabel,
}) {
  const handleClick = useCallback((e) => {
    if (onClick && !disabled) {
      onClick(e)
    }
  }, [onClick, disabled])

  return (
    <button 
      type={type} 
      onClick={handleClick} 
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
})

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
}

export default Button
