import React, {useRef, useState} from 'react'
import Button from './Button'
import axios from 'axios'

export default function FileUpload({onUploaded}){
  const ref = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(){
    const f = ref.current.files[0]
    if(!f) return setError('Select a file')
    setError(null)
    setLoading(true)
    const fd = new FormData()
    fd.append('file', f)
    try{
      const token = window.localStorage.getItem('mp_token') || ''
      const headers = {'Content-Type': 'multipart/form-data'}
      if(token) headers['Authorization'] = `Bearer ${token}`
      const r = await axios.post('/imports/claims', fd, { headers })
      setLoading(false)
      ref.current.value = ''
      if(onUploaded) onUploaded(r.data)
    }catch(err){
      setLoading(false)
      setError(err?.response?.data || err.message)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input ref={ref} type="file" accept=".csv,text/csv" className="border rounded p-1" />
      <Button onClick={submit}>{loading ? 'Uploading...' : 'Upload CSV'}</Button>
      {error && <div className="text-sm text-red-600">{String(error)}</div>}
    </div>
  )
}
