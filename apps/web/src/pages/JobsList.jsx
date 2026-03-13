import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import FileUpload from '../components/FileUpload'

export default function JobsList(){
  const [jobs, setJobs] = useState([])
  const esRef = useRef(null)
  useEffect(()=>{
    axios.get('/imports').then(r=>setJobs(r.data)).catch(()=>setJobs([]))

    // setup SSE
    const es = new EventSource('/imports/events')
    es.addEventListener('job', (ev)=>{
      try{
        const d = JSON.parse(ev.data)
        setJobs(prev => {
          // replace existing row or add to top
          const idx = prev.findIndex(x=>x.job_id === d.job_id)
          if(idx !== -1){
            const copy = [...prev]
            copy[idx] = {...copy[idx], ...d}
            return copy
          }
          return [d, ...prev]
        })
        // show toast on completion or failure
        if(d.status === 'done' || d.status === 'failed'){
          window._toasts = window._toasts || []
          window._toasts.unshift({message: `Job ${d.job_id} ${d.status}`, type: d.status==='done' ? 'success' : 'error'})
          // keep only 5
          window._toasts = window._toasts.slice(0,5)
          window.dispatchEvent(new Event('app:toast'))
        }
      }catch(e){ }
    })
    esRef.current = es
    return ()=>{ es.close() }
  },[])
  return (
    <div className="container">
      <div className="header">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Import Jobs</h2>
          <div>
            <a href="/todos" className="text-sm text-indigo-600 hover:underline mr-4">Local TODOs</a>
            <a href="/benchmarks" className="text-sm text-indigo-600 hover:underline mr-4">Benchmarks</a>
            <FileUpload onUploaded={(d)=>{ setJobs(prev => [d, ...prev]) }} />
          </div>
        </div>
      
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Job ID</th>
                <th className="px-3 py-2">Filename</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Processed</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j=> (
                <tr key={j.id} className="border-t">
                  <td className="px-3 py-2 text-slate-600">{j.id}</td>
                  <td className="px-3 py-2"><Link className="text-indigo-600 hover:underline" to={`/jobs/${j.job_id}`}>{j.job_id}</Link></td>
                  <td className="px-3 py-2 text-slate-700">{j.filename}</td>
                  <td className="px-3 py-2"><span className="text-sm text-slate-600">{j.status}</span></td>
                  <td className="px-3 py-2">{j.processed_rows}</td>
                  <td className="px-3 py-2 text-slate-500">{j.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
