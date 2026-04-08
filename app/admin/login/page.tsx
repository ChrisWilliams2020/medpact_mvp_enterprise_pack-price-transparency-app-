"use client";

import * as React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [pw, setPw] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus('Authenticating...');
    
    try {
      const res = await fetch('/api/admin/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ password: pw }) 
      });
      
      if (res.ok) {
        setStatus('Success! Redirecting...');
        window.location.href = '/admin';
      } else {
        setStatus('Invalid password');
        setLoading(false);
      }
    } catch (err) {
      setStatus('Connection error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🔐</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">MedPACT Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Team access only</p>
          </div>
          
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={pw} 
                onChange={(e) => setPw(e.target.value)} 
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                autoFocus
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading || !pw}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          {status && (
            <div className={`mt-4 text-center text-sm ${status.includes('Invalid') || status.includes('error') ? 'text-red-600' : 'text-gray-600'}`}>
              {status}
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to website
            </Link>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-4">
          Contact your administrator if you need access
        </p>
      </div>
    </div>
  );
}
