import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Metrics({ token }: { token: string }) {
  const [metrics, setMetrics] = useState<any[]>([])
  useEffect(() => {
    const fetchMetrics = async () => {
      const base = (window as any).__BASE_URL__ || 'http://localhost:5100'
      const resp = await axios.get(`${base}/api/metrics/definitions`, { headers: { Authorization: `Bearer ${token}` } })
      setMetrics(resp.data)
    }
    if (token) fetchMetrics()
  }, [token])

  return (
    <div>
      <h2>Metrics</h2>
      <ul>
        {metrics.map((m) => (
          <li key={m.key}>{m.name} ({m.unit})</li>
        ))}
      </ul>
    </div>
  )
}
