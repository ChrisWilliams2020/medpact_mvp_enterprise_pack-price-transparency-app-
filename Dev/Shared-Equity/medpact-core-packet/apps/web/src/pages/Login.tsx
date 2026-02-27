import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('admin@medpact.local')
  const [tenantId, setTenantId] = useState('')

  const login = async () => {
    const base = (window as any).__BASE_URL__ || 'http://localhost:5100'
    const resp = await axios.post(`${base}/api/auth/login`, { tenantId, email })
    onLogin(resp.data.token)
  }

  return (
    <div>
      <h2>Dev Login</h2>
      <div>
        <label>Tenant ID</label>
        <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button onClick={login}>Login</button>
    </div>
  )
}
