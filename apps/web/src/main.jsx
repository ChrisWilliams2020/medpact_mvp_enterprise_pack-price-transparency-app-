import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import JobsList from './pages/JobsList'
import JobDetail from './pages/JobDetail'
import Todos from './pages/Todos'
import Benchmarks from './pages/Benchmarks'
import './index.css'
import Toasts from './components/Toast'

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
    <Route path='/' element={<JobsList/>} />
    <Route path='/jobs/:jobId' element={<JobDetail/>} />
    <Route path='/todos' element={<Todos/>} />
    <Route path='/benchmarks' element={<Benchmarks/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
// mount toasts
const t = document.createElement('div')
document.body.appendChild(t)
createRoot(t).render(<Toasts />)
