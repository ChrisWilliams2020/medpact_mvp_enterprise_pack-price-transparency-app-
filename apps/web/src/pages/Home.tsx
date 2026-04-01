import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">MedPact</span>
              <span className="ml-2 text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full">v3.5</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-blue-200 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium backdrop-blur-sm transition-all">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Healthcare Intelligence
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
              Two powerful platforms. One mission: Transform healthcare operations with 
              AI-driven insights, real-time analytics, and seamless compliance.
            </p>
          </div>

          {/* Two Product Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Practice Intelligence Card */}
            <div className="group relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3">Practice Intelligence</h2>
                <p className="text-blue-200 mb-6">
                  Complete practice management analytics for optometry and ophthalmology clinics.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Revenue & Claims Analytics
                  </li>
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    CMS Fee Schedule Integration
                  </li>
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI-Powered Insights
                  </li>
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    HIPAA Compliant Dashboard
                  </li>
                </ul>

                {/* CTA Button */}
                <Link 
                  to="/practice"
                  className="block w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Enter Practice Platform →
                </Link>

                {/* Tag */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                    For Optometry & Ophthalmology Practices
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Tech Card */}
            <div className="group relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3">Medical Tech</h2>
                <p className="text-blue-200 mb-6">
                  Enterprise-grade medical device analytics and IoT health monitoring platform.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time Device Monitoring
                  </li>
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Predictive Maintenance AI
                  </li>
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    FDA Compliance Tracking
                  </li>
                  <li className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Clinical Trial Analytics
                  </li>
                </ul>

                {/* CTA Button */}
                <Link 
                  to="/medtech"
                  className="block w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Enter MedTech Platform →
                </Link>

                {/* Tag */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full">
                    For Medical Device & Health Tech Companies
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-300 text-sm">Practices Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">$2.4M</div>
              <div className="text-blue-300 text-sm">Revenue Recovered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-300 text-sm">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">HIPAA</div>
              <div className="text-blue-300 text-sm">Fully Compliant</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-blue-300 text-sm mb-6">Trusted by leading healthcare organizations</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-white font-semibold">SOC 2 Type II</div>
              <div className="text-white">•</div>
              <div className="text-white font-semibold">HIPAA Certified</div>
              <div className="text-white">•</div>
              <div className="text-white font-semibold">FDA 21 CFR Part 11</div>
              <div className="text-white">•</div>
              <div className="text-white font-semibold">HITRUST CSF</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-blue-300 text-sm">
            © 2026 MedPact Intelligence, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-blue-300 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors">BAA</a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}