import React from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Settings</h1>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Practice settings coming soon...</p>
      </main>
    </div>
  );
}