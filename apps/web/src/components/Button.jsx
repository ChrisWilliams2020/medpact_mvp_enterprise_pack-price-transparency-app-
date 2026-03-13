import React from 'react'

export default function Button({children, onClick, className = '', type = 'button'}){
  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none ${className}`}>
      {children}
    </button>
  )
}
