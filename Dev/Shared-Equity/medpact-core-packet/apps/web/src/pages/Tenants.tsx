import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Tenants({ token }: { token: string }) {
  const [tenants, setTenants] = useState<any[]>([])
  useEffect(() => {
    const fetchTenants = async () => {
      const base = (window as any).__BASE_URL__ || 'http://localhost:5100'
      const resp = await axios.get(`${base}/api/tenants`)
      setTenants(resp.data)
    }
    fetchTenants()
  }, [])

  return (
    <div>
      <h2>Tenants</h2>
      <ul>
        {tenants.map((t) => (
          <li key={t.id}>{t.name} ({t.slug})</li>
        ))}
      </ul>
    </div>
  )
}
