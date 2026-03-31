import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xl">M</span>
          </div>
          <span className="text-white text-xl font-semibold">MedPact</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/fee-schedule" className="text-blue-200 hover:text-white">
            Fee Schedule
          </Link>
          <Link to="/login" className="text-blue-200 hover:text-white">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Register Practice
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Practice Intelligence for{' '}
              <span className="text-blue-300">Eyecare Professionals</span>
            </h1>
            <p className="text-xl text-blue-200 mt-6">
              Transform your practice data into actionable insights. Benchmark against peers, 
              optimize revenue, and grow your practice with AI-powered analytics.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg"
              >
                Register Your Practice →
              </Link>
              <Link
                to="/fee-schedule"
                className="px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition"
              >
                View Fee Schedule
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-blue-300">Practices</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">$2.5M</div>
                <div className="text-blue-300">Revenue Recovered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15%</div>
                <div className="text-blue-300">Avg. Revenue Increase</div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Practice Dashboard</h3>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Live Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-sm text-gray-500">Monthly Revenue</div>
                <div className="text-2xl font-bold text-blue-600">$142,500</div>
                <div className="text-xs text-green-500">↑ 12% vs last month</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-sm text-gray-500">Patient Visits</div>
                <div className="text-2xl font-bold text-green-600">384</div>
                <div className="text-xs text-green-500">↑ 8% vs last month</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-sm text-gray-500">Capture Rate</div>
                <div className="text-2xl font-bold text-purple-600">68%</div>
                <div className="text-xs text-yellow-500">→ Industry avg: 62%</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="text-sm text-gray-500">Avg. Revenue/Visit</div>
                <div className="text-2xl font-bold text-orange-600">$371</div>
                <div className="text-xs text-green-500">↑ 5% vs last month</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-2">Revenue Trend</div>
              <div className="flex items-end gap-1 h-20">
                {[65, 72, 68, 80, 75, 85, 90, 88, 95, 92, 98, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-400 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Optimize Your Practice
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Real-Time Analytics',
                description: 'Track revenue, patient volume, and key metrics in real-time with intuitive dashboards.',
              },
              {
                icon: '🔍',
                title: 'Fee Schedule Analysis',
                description: 'Compare your fees against Medicare, Medicaid, and commercial rates. Never leave money on the table.',
              },
              {
                icon: '📈',
                title: 'Peer Benchmarking',
                description: 'See how your practice compares to similar practices in your area and specialty.',
              },
              {
                icon: '🔗',
                title: 'EMR Integration',
                description: 'Connect with RevolutionEHR, Eyefinity, and other major eyecare EMRs.',
              },
              {
                icon: '🔒',
                title: 'HIPAA Compliant',
                description: 'Bank-level encryption, audit logs, and BAA included. Your data is always secure.',
              },
              {
                icon: '🤖',
                title: 'AI Recommendations',
                description: 'Get personalized recommendations to improve capture rate and revenue.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of eyecare practices already using MedPact to optimize their operations.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg"
          >
            Register Your Practice — Free Trial →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-white font-semibold">MedPact</span>
              </div>
              <p className="text-sm">© 2024 MedPact Practice Intelligence. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <Link to="/fee-schedule" className="hover:text-white">Fee Schedule</Link>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/baa" className="hover:text-white">BAA</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}