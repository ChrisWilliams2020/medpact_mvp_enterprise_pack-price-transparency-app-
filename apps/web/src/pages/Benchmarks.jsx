import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

function Field({ field, value, onChange, error }) {
  const { key, label, type = 'text', placeholder } = field
  const id = `field-${key}`
  function handle(e) {
    const v = e.target.value
    onChange(key, v === '' ? null : v)
  }
  return (
    <div style={{marginBottom:8}}>
      <label htmlFor={id} style={{display:'block',fontSize:12}}>{label ?? key}</label>
      <input
        id={id}
        aria-label={label ?? key}
        type={type === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        placeholder={placeholder || ''}
        onChange={handle}
      />
      {error ? <div style={{color:'crimson',fontSize:12}}>{error}</div> : null}
    </div>
  )
}

export default function Benchmarks() {
  const [profile, setProfile] = useState('practice')
  const [catalog, setCatalog] = useState([])
  const [selected, setSelected] = useState(null)
  const [inputs, setInputs] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const practiceId = 'demo'
  const headers = { 'X-Practice-Id': practiceId }

  useEffect(() => {
    axios.get('/metrics/catalog', { headers })
      .then(r => setCatalog(Object.entries(r.data).map(([key,v]) => ({ key, ...v }))))
      .catch(() => setCatalog([]))
  }, [])

  const [entries, setEntries] = useState([])
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10
  async function loadEntries() {
    try {
      const res = await axios.get('/metrics/entries', { params: { practice_id: practiceId }, headers })
      setEntries(res.data || [])
    } catch (e) {
      setEntries([])
    }
  }
  useEffect(() => { loadEntries() }, [])

  // SSE status badge and recent job events
  const [lastJob, setLastJob] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  useEffect(() => {
    const es = new EventSource('/metrics/events/')
    es.onmessage = (ev) => {
      try {
        const d = JSON.parse(ev.data)
        setLastJob(d)
        setRecentJobs(r => [d].concat(r).slice(0,10))
        if (d.status === 'done' || d.status === 'failed') loadEntries()
      } catch (e) {}
    }
    es.onerror = () => es.close()
    return () => es.close()
  }, [])

  useEffect(() => {
    if (selected) {
      const init = {}
      const schema = selected.inputs || [{ key: 'allowed_amount', label: 'Allowed Amount', type: 'number' }, { key: 'paid_amount', label: 'Paid Amount', type: 'number' }]
      schema.forEach(f => { init[f.key] = f.default != null ? String(f.default) : null })
      setInputs(init)
      setErrors({})
      setResult(null)
    }
  }, [selected])

  function handleInputChange(k, v) {
    setInputs(s => ({ ...s, [k]: v }))
    setErrors(e => ({ ...e, [k]: null }))
  }

  const validation = useMemo(() => {
    if (!selected) return { valid: false, errors: {} }
    const schema = selected.inputs || []
    const errs = {}
    schema.forEach(f => {
      const v = inputs[f.key]
      if (f.required && (v === null || v === undefined || v === '')) errs[f.key] = 'Required'
      if (f.type === 'number' && v != null && v !== '') {
        const n = Number(v)
        if (!Number.isFinite(n)) errs[f.key] = 'Must be a number'
        if (f.min != null && n < f.min) errs[f.key] = `Min ${f.min}`
        if (f.max != null && n > f.max) errs[f.key] = `Max ${f.max}`
      }
    })
    return { valid: Object.keys(errs).length === 0, errors: errs }
  }, [selected, inputs])

  async function onCalculate() {
    if (!selected) return
    if (!validation.valid) { setErrors(validation.errors); return }
    setLoading(true); setResult(null)
    try {
      const payload = { practice_id: practiceId }
      Object.entries(inputs).forEach(([k, v]) => {
        if (v === '' || v === null || v === undefined) return
        const n = Number(v)
        payload[k] = Number.isFinite(n) ? n : v
      })
      const res = await axios.post(`/metrics/calculate/${selected.key}`, payload, { headers })
      setResult(res.data)
      await loadEntries()
    } catch (err) {
      setResult({ error: err.response?.data || err.message })
    } finally { setLoading(false) }
  }

  async function onSchedule() {
    if (!selected) return
    try {
      const payload = { practice_id: practiceId, ...inputs }
      await axios.post(`/metrics/schedule/${selected.key}`, payload, { headers })
    } catch (e) {
      // no-op
    }
  }

  async function deleteEntry(id) {
    try {
      await axios.delete(`/metrics/entries/${id}`, { headers })
      loadEntries()
    } catch (e) {}
  }

  async function exportCSV() {
    try {
      const res = await axios.get('/metrics/entries.csv', { params: { practice_id: practiceId }, headers, responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `metrics_entries_${practiceId}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (e) {}
  }

  return (
    <div>
      <h1>Benchmarks</h1>

      <section style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <label>Profile </label>
          <select value={profile} onChange={e => setProfile(e.target.value)}>
            <option value="practice">Private Practice</option>
            <option value="pe">Private Equity</option>
          </select>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <strong>Worker:</strong>
          {lastJob ? (
            <>
              <span>{`${lastJob.metric || ''} ${lastJob.status}`}</span>
              {lastJob.status === 'running' ? <span style={{width:12,height:12,display:'inline-block',borderRadius:6,background:'#0b74de',animation:'blink 1s infinite'}} /> : null}
            </>
          ) : 'idle'}
        </div>
      </section>

      <section>
        <h2>Metrics</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {catalog.map(m => (
            <button key={m.key} onClick={() => setSelected(m)} style={{textAlign:'left'}}>
              <strong>{m.title}</strong>
              <div style={{fontSize:12}}>{m.description}</div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <section>
          <h3>{selected.title}</h3>
          {(selected.inputs || []).map(f => (
            <Field key={f.key} field={f} value={inputs[f.key]} onChange={handleInputChange} error={errors[f.key] || validation.errors[f.key]} />
          ))}

          <div style={{marginTop:8}}>
            <button onClick={onCalculate} disabled={loading || !validation.valid}>{loading ? 'Calculating…' : 'Calculate'}</button>
            <button onClick={onSchedule} style={{marginLeft:12}}>Schedule</button>
          </div>

          {result && (
            <div style={{marginTop:12}}>
              {result.error ? <pre>{JSON.stringify(result.error)}</pre> :
                <>
                  <div><strong>Value:</strong> {String(result.value)}</div>
                  <div><strong>Suggestion:</strong> {result.suggestion}</div>
                  <pre>{JSON.stringify(result.entry, null, 2)}</pre>
                </>
              }
            </div>
          )}
        </section>
      )}

      <section style={{marginTop:24}}>
        <h3 style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span>Recent entries</span>
          <span>
            <button onClick={exportCSV}>Export CSV</button>
          </span>
        </h3>
        {entries.length === 0 ? <div>No recent entries</div> : (
          <>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Created</th>
                <th>Payload</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE).map(e => (
                <tr key={e.id} style={{borderTop:'1px solid #ccc'}}>
                  <td style={{padding:6}}>{e.metric_key}</td>
                  <td style={{padding:6}}>{new Date(e.created_at).toLocaleString()}</td>
                  <td style={{padding:6,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:420}}><pre style={{margin:0}}>{JSON.stringify(e.payload)}</pre></td>
                  <td style={{padding:6}}><button onClick={() => deleteEntry(e.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:8}}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p+1)} disabled={entries.length <= page*PAGE_SIZE}>Next</button>
          </div>
          </>
        )}
      </section>
    </div>
  )
}

// small keyframes injection for the spinner (keeps everything self-contained)
const style = document.createElement('style')
style.innerHTML = `@keyframes blink { 0% { opacity: 1 } 50% { opacity: 0.25 } 100% { opacity: 1 } }`
document.head.appendChild(style)