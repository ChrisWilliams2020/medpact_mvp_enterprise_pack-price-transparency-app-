import { Link } from 'react-router-dom';

export default function MedTech() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KCN MedTech Intelligence</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
            <Link to="/login" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Request Demo</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <span>💊</span> For Medical Device Companies
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MedTech Sales Intelligence
            <span className="block text-purple-600 mt-2">Win More Deals</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered sales intelligence platform for ophthalmology medical device and pharmaceutical 
            companies. Target the right physicians, optimize territories, and outsell the competition.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25">
              Request Demo
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Complete Sales Intelligence Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Sales Dashboard', desc: 'Real-time revenue, pipeline, and performance metrics' },
              { icon: '🗺️', title: 'Territory Management', desc: 'Optimize sales geography and account distribution' },
              { icon: '👥', title: 'Sales Team Analytics', desc: 'Track rep performance, quotas, and activity' },
              { icon: '🎯', title: 'Physician Targeting', desc: 'AI-scored HCP lists with case volume and opportunity data' },
              { icon: '💲', title: 'Pricing Intelligence', desc: 'Contract pricing, competitive analysis, and margin optimization' },
              { icon: '🔍', title: 'Competitor Intelligence', desc: 'Market share analysis and competitive positioning' },
              { icon: '📈', title: 'Sales Forecasting', desc: 'AI-powered revenue predictions with 84%+ accuracy' },
              { icon: '🤖', title: 'Sales AI Assistant', desc: 'Get instant insights on accounts, competitors, and strategy' },
              { icon: '📋', title: 'HCP Surveys', desc: 'Track physician satisfaction and product feedback' },
              { icon: '📣', title: 'Product Marketing', desc: 'Campaign management and ROI tracking' },
              { icon: '📊', title: 'Rep Performance', desc: 'Activity tracking, win rates, and coaching insights' },
              { icon: '🏢', title: 'Company Profile', desc: 'Manage product portfolio and sales organization' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { value: '2,847+', label: 'HCPs in Database' },
              { value: '84%', label: 'Forecast Accuracy' },
              { value: '62%', label: 'Avg Win Rate Increase' },
              { value: '3.2x', label: 'ROI for Customers' },
            ].map((stat) => (
              <div key={stat.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Accelerate Your Sales?</h2>
          <p className="text-purple-100 mb-8 text-lg">See how top MedTech companies use KCN to win more deals.</p>
          <Link to="/login" className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl text-lg font-semibold hover:bg-purple-50 shadow-lg">
            Request Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center text-sm">
        <p>© 2026 KCN MedTech Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
}
