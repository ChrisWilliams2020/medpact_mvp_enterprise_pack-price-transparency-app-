import React, {useRef, useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import axios from 'axios'

// Constants for file validation
const ALLOWED_FILE_TYPES = ['.csv', 'text/csv', 'application/vnd.ms-excel']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// Validate file before upload
function validateFile(file) {
  if (!file) return 'Please select a file'
  
  const fileName = file.name || ''
  const fileType = file.type || ''
  const fileSize = file.size || 0
  
  // Check file type
  const isValidType = ALLOWED_FILE_TYPES.some(type => 
    fileName.toLowerCase().endsWith(type) || fileType === type
  )
  if (!isValidType) {
    return 'Invalid file type. Please upload a CSV file.'
  }
  
  // Check file size
  if (fileSize > MAX_FILE_SIZE) {
    return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
  }
  
  return null // No error
}

export default function FileUpload({onUploaded, multiplePractices = false}){
  const ref = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = useCallback(async function submit(){
    const f = ref.current?.files?.[0]
    
    // Validate file
    const validationError = validateFile(f)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setError(null)
    setLoading(true)
    
    const fd = new FormData()
    fd.append('file', f)
    if(multiplePractices) {
      fd.append('multiple_practices', 'true')
    }
    
    try{
      const token = window.localStorage.getItem('mp_token') || ''
      const headers = {'Content-Type': 'multipart/form-data'}
      if(token) headers['Authorization'] = `Bearer ${token}`
      const r = await axios.post('/imports/claims', fd, { headers })
      setLoading(false)
      if (ref.current) ref.current.value = ''
      if(onUploaded) onUploaded(r.data)
    }catch(err){
      setLoading(false)
      const errorMessage = err?.response?.data?.message || err?.response?.data || err?.message || 'Upload failed'
      setError(typeof errorMessage === 'string' ? errorMessage : 'Upload failed')
    }
  }, [multiplePractices, onUploaded])

  return (
    <div className="flex items-center gap-3">
      <input 
        ref={ref} 
        type="file" 
        accept=".csv,text/csv" 
        className="border rounded p-1"
        aria-label="Select CSV file to upload"
        disabled={loading}
      />
      <Button onClick={submit} disabled={loading}>
        {loading ? 'Uploading...' : multiplePractices ? 'Upload Multi-Practice CSV' : 'Upload CSV'}
      </Button>
      {error && <div className="text-sm text-red-600" role="alert">{String(error)}</div>}
    </div>
  )
}

FileUpload.propTypes = {
  onUploaded: PropTypes.func,
  multiplePractices: PropTypes.bool,
}
