import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardMetrics {
  monthlyRevenue: number;
  patientVisits: number;
  captureRate: number;
  avgRevenuePerVisit: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    monthlyRevenue: 142500,
    patientVisits: 384,
    captureRate: 68,
    avgRevenuePerVisit: 371,
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('practice_id');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">MedPact Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/fee-schedule" className="text-gray-600 hover:text-gray-900">
              Fee Schedule
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-gray-900">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600">Here's how your practice is performing</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Monthly Revenue</div>
            <div className="text-3xl font-bold text-blue-600">
              ${metrics.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-green-500 mt-2">↑ 12% vs last month</div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Patient Visits</div>
            <div className="text-3xl font-bold text-green-600">{metrics.patientVisits}</div>
            <div className="text-xs text-green-500 mt-2">↑ 8% vs last month</div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Capture Rate</div>
            <div className="text-3xl font-bold text-purple-600">{metrics.captureRate}%</div>
            <div className="text-xs text-yellow-500 mt-2">→ Industry avg: 62%</div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Avg Revenue/Visit</div>
            <div className="text-3xl font-bold text-orange-600">${metrics.avgRevenuePerVisit}</div>
            <div className="text-xs text-green-500 mt-2">↑ 5% vs last month</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/fee-schedule"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900">Fee Schedule</h3>
            <p className="text-sm text-gray-600">View CPT codes and payment rates</p>
          </Link>
          
          <Link
            to="/metrics"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600">Deep dive into your metrics</p>
          </Link>
          
          <Link
            to="/settings"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-gray-900">Settings</h3>
            <p className="text-sm text-gray-600">Manage your practice profile</p>
          </Link>
        </div>
      </main>
    </div>
  );
}