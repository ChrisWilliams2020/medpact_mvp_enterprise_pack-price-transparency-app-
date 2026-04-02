import { Link } from 'react-router-dom';

export default function PracticeIntelligence() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KCN Practice Intelligence</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Start Free Trial</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <span>🏥</span> For Ophthalmology Practices
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Practice Intelligence
            <span className="block text-blue-600 mt-2">Powered by Data</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive analytics, benchmarking, and AI-powered insights to optimize your 
            ophthalmology practice performance and maximize revenue.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
              Start Free Trial
            </Link>
            <Link to="/login" className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need to Optimize Your Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Practice Metrics Dashboard', desc: '9 key metrics for private practice, 10+ for PE practices' },
              { icon: '💲', title: 'Price Transparency', desc: 'CPT code analysis with regional benchmarks and payer comparisons' },
              { icon: '🗺️', title: 'Patient Heat Maps', desc: 'Geographic visualization of your patient base' },
              { icon: '📈', title: 'Revenue Forecasting', desc: 'AI-powered predictions based on historical trends' },
              { icon: '🏆', title: 'Competitor Analysis', desc: 'Benchmark against local practices' },
              { icon: '💬', title: 'KCN AI Assistant', desc: 'Get instant answers about coding, billing, and benchmarks' },
              { icon: '📋', title: 'Patient Surveys', desc: 'Track satisfaction and NPS scores' },
              { icon: '📣', title: 'Marketing Tools', desc: 'Email campaigns, recall management, and referral tracking' },
              { icon: '✅', title: 'Quality Metrics', desc: 'MIPS tracking and improvement recommendations' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Industry-Standard Benchmarks</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Track the metrics that matter most, sourced from industry leaders like OSN, OOSS, and ASRS
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Private Practice', metrics: '9 Key Metrics', source: 'Linstrom/Pinto' },
              { label: 'PE Practice', metrics: '10 Core + 25 KPIs', source: 'PE Standards' },
              { label: 'ASC Metrics', metrics: '8 Efficiency KPIs', source: 'OOSS' },
              { label: 'Retina Practice', metrics: '12 Specialty Metrics', source: 'ASRS' },
            ].map((item) => (
              <div key={item.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{item.metrics}</div>
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">Source: {item.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-blue-100 mb-8 text-lg">Start your free 14-day trial. No credit card required.</p>
          <Link to="/login" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 shadow-lg">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center text-sm">
        <p>© 2026 KCN Practice Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
}