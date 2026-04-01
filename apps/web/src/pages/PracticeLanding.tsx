import { Link } from 'react-router-dom';

export default function PracticeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">MedPact</span>
              <span className="text-sm text-blue-600 ml-2">Practice Intelligence</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/fee-schedule" className="text-gray-600 hover:text-gray-900 font-medium">Fee Schedule</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Start Free Trial
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              Version 3.4 • HIPAA Compliant
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Practice Intelligence
              <span className="block text-blue-600">for Eye Care Professionals</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              AI-powered analytics, CMS fee schedule integration, and real-time insights 
              to optimize your practice's revenue and patient care.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                Register Your Practice →
              </Link>
              <Link to="/fee-schedule" className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                View Fee Schedule
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Analytics</h3>
              <p className="text-gray-600">Track collections, identify underpayments, and optimize your fee schedule against CMS benchmarks.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Claims Intelligence</h3>
              <p className="text-gray-600">Reduce denials with AI-powered claim analysis and automatic coding recommendations.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Insights</h3>
              <p className="text-gray-600">Get actionable recommendations to improve efficiency, reduce no-shows, and grow your practice.</p>
            </div>
          </div>

          {/* CMS Fee Schedule Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">CMS Fee Schedule 2024</h3>
                <p className="text-gray-500">Compare your fees against Medicare, Medicaid, and commercial averages</p>
              </div>
              <Link to="/fee-schedule" className="text-blue-600 hover:text-blue-700 font-medium">
                View Full Schedule →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CPT Code</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Medicare</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Commercial Avg</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">92004</td>
                    <td className="py-3 px-4 text-sm text-gray-600">Comprehensive eye exam, new patient</td>
                    <td className="py-3 px-4 text-sm text-right">$152.50</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">$195.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">92014</td>
                    <td className="py-3 px-4 text-sm text-gray-600">Comprehensive eye exam, established</td>
                    <td className="py-3 px-4 text-sm text-right">$108.25</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">$145.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-sm">92134</td>
                    <td className="py-3 px-4 text-sm text-gray-600">OCT retina</td>
                    <td className="py-3 px-4 text-sm text-right">$42.50</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">$75.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-gray-500 text-sm">© 2026 MedPact Intelligence, Inc.</div>
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">← Back to MedPact Home</Link>
        </div>
      </footer>
    </div>
  );
}