import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function JobDetail(){
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  useEffect(()=>{
    axios.get(`/imports/${jobId}`).then(r=>setJob(r.data)).catch(()=>setJob(null))
  },[jobId])
  if(!job) return <div style={{padding:20}}>Job not found</div>
  return (
    <div className="container">
      <div className="header">
        <h2 className="text-2xl font-semibold">Job {job.job_id}</h2>
      </div>
      <div className="card">
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Status:</strong> <div className="text-slate-700">{job.status}</div></div>
          <div><strong>Processed rows:</strong> <div className="text-slate-700">{job.processed_rows}</div></div>
          <div className="col-span-2"><strong>Filename:</strong> <div className="text-slate-700 break-all">{job.filename}</div></div>
          <div className="col-span-2"><strong>Error:</strong>
            <pre className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">{job.error}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
