import React, { useState } from 'react'
import Login from './pages/Login'
import Tenants from './pages/Tenants'
import Metrics from './pages/Metrics'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <div className="app">
      <header>
        <h1>MedPact Core - MVP</h1>
      </header>
      <main>
        {!token ? (
          <Login onLogin={(t) => setToken(t)} />
        ) : (
          <>
            <Tenants token={token} />
            <Metrics token={token} />
          </>
        )}
      </main>
    </div>
  )
}
