import React, {useState, useEffect} from 'react'

export default function Toasts(){
  const [toasts, setToasts] = useState([])
  useEffect(()=>{
    const handler = (e) => {
      // This component expects global custom event 'app:toast' with {message,type}
    }
    window.addEventListener('app:toast', handler)
    return ()=> window.removeEventListener('app:toast', handler)
  },[])
  // Lightweight: read toasts from window._toasts if present
  useEffect(()=>{
    const t = window._toasts || []
    setToasts(t)
  },[])

  return (
    <div className="fixed right-4 top-4 space-y-2 z-50">
      {toasts.map((t,i)=> (
        <div key={i} className={`px-3 py-2 rounded shadow ${t.type==='error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
