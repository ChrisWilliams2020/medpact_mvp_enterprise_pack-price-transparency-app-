import { Link } from 'react-router-dom';

export default function MedTechLanding() {
  const metrics = [
    { label: 'Device Uptime', value: '99.97%', change: '+0.12%', status: 'up' },
    { label: 'Active Devices', value: '12,847', change: '+234', status: 'up' },
    { label: 'Alerts Resolved', value: '847', change: '24h', status: 'neutral' },
    { label: 'Compliance Score', value: '98.5%', change: 'FDA Ready', status: 'up' },
  ];

  const features = [
    {
      icon: '📡',
      title: 'Real-time Device Monitoring',
      description: 'Monitor thousands of medical devices across multiple facilities with sub-second latency.',
      metrics: ['< 100ms latency', '99.99% data capture', 'Edge computing ready']
    },
    {
      icon: '🤖',
      title: 'Predictive Maintenance AI',
      description: 'ML models predict device failures 14 days in advance with 94% accuracy.',
      metrics: ['14-day prediction window', '94% accuracy', '67% reduction in downtime']
    },
    {
      icon: '📋',
      title: 'FDA Compliance Tracking',
      description: 'Automated 21 CFR Part 11 compliance with complete audit trails.',
      metrics: ['21 CFR Part 11', 'ISO 13485', 'IEC 62304']
    },
    {
      icon: '🔬',
      title: 'Clinical Trial Analytics',
      description: 'Real-time monitoring and analytics for medical device clinical trials.',
      metrics: ['Real-time enrollment', 'Adverse event tracking', 'Site performance']
    },
    {
      icon: '🔐',
      title: 'Cybersecurity Suite',
      description: 'NIST-compliant security monitoring for connected medical devices.',
      metrics: ['NIST CSF aligned', 'Threat detection', 'Vulnerability scanning']
    },
    {
      icon: '📊',
      title: 'Post-Market Surveillance',
      description: 'Automated MDR/IVDR reporting and complaint trend analysis.',
      metrics: ['MDR/IVDR ready', 'Automated reporting', 'Trend analysis']
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">MedPact</span>
              <span className="text-sm text-indigo-300 ml-2">Medical Tech</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-indigo-200 hover:text-white font-medium">Features</a>
            <a href="#metrics" className="text-indigo-200 hover:text-white font-medium">Metrics</a>
            <Link to="/login" className="text-indigo-200 hover:text-white font-medium">Sign In</Link>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600">
              Request Demo
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-6 border border-indigo-500/30">
              Version 3.5 • FDA 21 CFR Part 11 Compliant
            </span>
            <h1 className="text-5xl font-bold text-white mb-6">
              Medical Device Intelligence
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Enterprise Platform
              </span>
            </h1>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-8">
              End-to-end medical device lifecycle management with AI-powered analytics, 
              predictive maintenance, and regulatory compliance automation.
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                Schedule Demo →
              </button>
              <a href="#features" className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
                Explore Features
              </a>
            </div>
          </div>

          {/* Live Metrics Dashboard Preview */}
          <div id="metrics" className="mb-20">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Live Platform Metrics</h2>
                  <p className="text-indigo-300">Real-time data from connected devices</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-indigo-300 text-sm mb-2">{metric.label}</div>
                    <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                    <div className={`text-sm ${metric.status === 'up' ? 'text-green-400' : 'text-indigo-300'}`}>
                      {metric.status === 'up' ? '↑' : ''} {metric.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Enterprise Features</h2>
              <p className="text-indigo-200 max-w-2xl mx-auto">
                Comprehensive medical device management capabilities built for scale, 
                security, and regulatory compliance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-indigo-200 text-sm mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.metrics.map((m, j) => (
                      <span key={j} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Partners */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Seamless Integrations</h2>
              <p className="text-indigo-200">Connect with your existing healthcare infrastructure</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <div className="bg-white/10 px-6 py-3 rounded-lg text-white font-medium">Epic EHR</div>
              <div className="bg-white/10 px-6 py-3 rounded-lg text-white font-medium">Cerner</div>
              <div className="bg-white/10 px-6 py-3 rounded-lg text-white font-medium">MEDITECH</div>
              <div className="bg-white/10 px-6 py-3 rounded-lg text-white font-medium">Philips</div>
              <div className="bg-white/10 px-6 py-3 rounded-lg text-white font-medium">GE Healthcare</div>
              <div className="bg-white/10 px-6 py-3 rounded-lg text-white font-medium">Siemens</div>
            </div>
          </div>

          {/* Compliance Certifications */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Enterprise Compliance</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🏥</div>
                <div className="text-white font-medium text-sm">HIPAA</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-white font-medium text-sm">FDA 21 CFR Part 11</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-white font-medium text-sm">SOC 2 Type II</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-white font-medium text-sm">ISO 13485</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🇪🇺</div>
                <div className="text-white font-medium text-sm">MDR/IVDR</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Footer */}
      <footer className="px-6 py-12 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to transform your medical device operations?</h2>
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 shadow-lg">
              Request a Demo
            </button>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-white/10">
            <div className="text-indigo-300 text-sm">© 2026 MedPact Intelligence, Inc.</div>
            <Link to="/" className="text-indigo-300 hover:text-white text-sm">← Back to MedPact Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}