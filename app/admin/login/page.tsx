"use client";

import * as React from 'react';

export default function LoginPage() {
  const [pw, setPw] = React.useState('');
  const [status, setStatus] = React.useState('');

  async function login() {
    setStatus('Logging in...');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (res.ok) {
      setStatus('Logged in');
      window.location.href = '/admin';
    } else setStatus('Login failed');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <input className="mt-4" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="password" />
      <div className="mt-2"><button onClick={login} className="px-3 py-1 bg-blue-600 text-white rounded">Login</button></div>
      <div className="mt-2 text-sm text-black/60">{status}</div>
    </div>
  );
}
