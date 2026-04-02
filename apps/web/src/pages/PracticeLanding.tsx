import { Link } from 'react-router-dom';

export default function PracticeLanding() {
  const metrics = [
    { label: 'Avg Revenue Increase', value: '+23%', description: 'First 90 days' },
    { label: 'Claims Denial Reduction', value: '67%', description: 'AI-powered coding' },
    { label: 'Time Saved Weekly', value: '12hrs', description: 'Per provider' },
    { label: 'ROI', value: '340%', description: 'Average return' },
  ];

  const features = [
    {
      icon: '💰',
      title: 'Revenue Cycle Analytics',
      description: 'Track collections, identify underpayments, and optimize your billing workflow.',
      capabilities: ['Real-time collections tracking', 'Payer performance analysis', 'Underpayment detection', 'A/R aging dashboard']
    },
    {
      icon: '📋',
      title: 'Claims Intelligence',
      description: 'AI-powered claim scrubbing and denial prevention before submission.',
      capabilities: ['Pre-submission validation', 'Denial prediction', 'Auto-coding suggestions', 'Appeal letter generation']
    },
    {
      icon: '📊',
      title: 'CMS Fee Schedule Integration',
      description: 'Always up-to-date Medicare rates with commercial payer comparisons.',
      capabilities: ['2024 CMS rates', 'MAC-specific pricing', 'Commercial benchmarks', 'Fee optimization alerts']
    },
    {
      icon: '🧠',
      title: 'AI Practice Insights',
      description: 'Machine learning powered recommendations to grow your practice.',
      capabilities: ['Patient flow optimization', 'No-show prediction', 'Capacity planning', 'Revenue forecasting']
    },
    {
      icon: '👁️',
      title: 'Eye Care Specific',
      description: 'Built exclusively for optometry and ophthalmology practices.',
      capabilities: ['Vision vs Medical billing', 'Optical inventory analytics', 'Exam mix optimization', 'Specialty procedure tracking']
    },
    {
      icon: '🔒',
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security with full regulatory compliance.',
      capabilities: ['SOC 2 Type II certified', 'AES-256 encryption', 'BAA included', 'Audit logging']
    },
  ];

  const testimonials = [
    {
      quote: "MedPact helped us identify $47,000 in underpayments in the first month alone.",
      author: "Dr. Sarah Chen",
      practice: "Vision Care Associates, Austin TX",
      metric: "+32% revenue"
    },
    {
      quote: "Our denial rate dropped from 18% to 6% after implementing the AI coding suggestions.",
      author: "Dr. Michael Roberts",
      practice: "Family Eye Care, Denver CO",
      metric: "67% fewer denials"
    },
    {
      quote: "The fee schedule comparison tool paid for itself in the first week.",
      author: "Jennifer Walsh, Practice Manager",
      practice: "Precision Eye Group, Phoenix AZ",
      metric: "340% ROI"
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$299',
      period: '/month',
      description: 'For solo practitioners',
      features: ['1 provider', 'Basic analytics', 'CMS fee schedule', 'Email support'],
      cta: 'Start Free Trial',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$599',
      period: '/month',
      description: 'For growing practices',
      features: ['Up to 5 providers', 'Full analytics suite', 'AI insights', 'Claims intelligence', 'Priority support'],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For multi-location groups',
      features: ['Unlimited providers', 'Custom integrations', 'Dedicated success manager', 'On-site training', 'SLA guarantee'],
      cta: 'Contact Sales',
      highlighted: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            <Link to="/fee-schedule" className="text-gray-600 hover:text-gray-900 font-medium">Fee Schedule</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Start Free Trial
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              Version 3.4 • Trusted by 500+ Eye Care Practices
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Practice Intelligence
              <span className="block text-blue-600">for Eye Care Professionals</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              AI-powered analytics, CMS fee schedule integration, and real-time insights 
              to optimize your practice's revenue and patient care.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                Start 14-Day Free Trial →
              </Link>
              <a href="#demo" className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                Watch Demo
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • HIPAA compliant • Setup in 5 minutes</p>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {metrics.map((metric, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{metric.value}</div>
                <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="demo" className="px-6 py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">See Your Practice at a Glance</h2>
            <p className="text-gray-400">Real-time analytics dashboard with actionable insights</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
            {/* Mock Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-80 mb-1">Today's Collections</div>
                <div className="text-3xl font-bold">$12,847</div>
                <div className="text-sm mt-2">↑ 18% vs last Tuesday</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-80 mb-1">Pending Claims</div>
                <div className="text-3xl font-bold">47</div>
                <div className="text-sm mt-2">$34,250 expected</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-80 mb-1">This Month</div>
                <div className="text-3xl font-bold">$187,432</div>
                <div className="text-sm mt-2">92% of target</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Chart Placeholder */}
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="text-white font-medium mb-4">Revenue Trend</div>
                <div className="h-40 flex items-end gap-2">
                  {[65, 72, 68, 85, 92, 78, 95, 88, 102, 98, 110, 105].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Jan</span><span>Jun</span><span>Dec</span>
                </div>
              </div>

              {/* Payer Mix */}
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="text-white font-medium mb-4">Payer Mix</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-300">Medicare</div>
                    <div className="flex-1 bg-gray-600 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: '35%' }} />
                    </div>
                    <div className="text-sm text-gray-300">35%</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-300">VSP</div>
                    <div className="flex-1 bg-gray-600 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '28%' }} />
                    </div>
                    <div className="text-sm text-gray-300">28%</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-300">EyeMed</div>
                    <div className="flex-1 bg-gray-600 rounded-full h-3">
                      <div className="bg-purple-500 h-3 rounded-full" style={{ width: '22%' }} />
                    </div>
                    <div className="text-sm text-gray-300">22%</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-300">Commercial</div>
                    <div className="flex-1 bg-gray-600 rounded-full h-3">
                      <div className="bg-amber-500 h-3 rounded-full" style={{ width: '15%' }} />
                    </div>
                    <div className="text-sm text-gray-300">15%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Bar */}
            <div className="mt-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <div className="text-amber-200 font-medium">AI Insight</div>
                  <div className="text-amber-100 text-sm">Your 92134 (OCT) reimbursement is 12% below regional average. Consider renegotiating with VSP and EyeMed.</div>
                </div>
                <button className="ml-auto px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
                  View Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Optimize Your Practice</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive analytics and intelligence tools built specifically for eye care professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.capabilities.map((cap, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CMS Fee Schedule Preview */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2024 CMS Fee Schedule Built-In</h2>
              <p className="text-gray-600 mb-6">
                Always up-to-date Medicare reimbursement rates with MAC-specific pricing and commercial payer comparisons.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">All Eye Care CPT Codes</div>
                    <div className="text-sm text-gray-500">92002-92499, surgical, and specialty codes</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">MAC-Specific Rates</div>
                    <div className="text-sm text-gray-500">Pricing for your specific Medicare region</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Commercial Benchmarks</div>
                    <div className="text-sm text-gray-500">Compare VSP, EyeMed, and private payers</div>
                  </div>
                </li>
              </ul>
              <Link to="/fee-schedule" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                Explore Fee Schedule →
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="font-medium text-gray-900">Eye Care Fee Schedule 2024</div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Medicare</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Comm. Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">92004</td>
                    <td className="py-3 px-4 text-sm text-gray-600">Comp eye exam, new</td>
                    <td className="py-3 px-4 text-sm text-right">$152.50</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">$195.00</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">92014</td>
                    <td className="py-3 px-4 text-sm text-gray-600">Comp eye exam, est</td>
                    <td className="py-3 px-4 text-sm text-right">$108.25</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">$145.00</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">92134</td>
                    <td className="py-3 px-4 text-sm text-gray-600">OCT retina</td>
                    <td className="py-3 px-4 text-sm text-right">$42.50</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">$75.00</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">92083</td>
                    <td className="py-3 px-4 text-sm text-gray-600">Visual field exam</td>
                    <td className="py-3 px-4 text-sm text-right">$58.75</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">$85.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Eye Care Professionals</h2>
            <p className="text-gray-600">See what practices are saying about MedPact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-blue-600 font-bold text-2xl mb-4">{t.metric}</div>
                <p className="text-gray-600 mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-medium text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.practice}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Start free for 14 days. No credit card required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`rounded-2xl p-8 ${tier.highlighted ? 'bg-blue-600 ring-4 ring-blue-400' : 'bg-gray-800'}`}>
                <div className={`text-lg font-medium mb-2 ${tier.highlighted ? 'text-blue-100' : 'text-gray-400'}`}>{tier.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className={tier.highlighted ? 'text-blue-200' : 'text-gray-500'}>{tier.period}</span>
                </div>
                <p className={`mb-6 ${tier.highlighted ? 'text-blue-100' : 'text-gray-400'}`}>{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-white">
                      <svg className={`w-5 h-5 ${tier.highlighted ? 'text-blue-200' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                  tier.highlighted 
                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-gray-600 mb-8">Join 500+ eye care practices using MedPact to optimize revenue and patient care.</p>
          <Link to="/register" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg">
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="font-bold text-gray-900">MedPact</span>
              </div>
              <p className="text-sm text-gray-500">Practice intelligence for eye care professionals.</p>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-4">Product</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><Link to="/fee-schedule" className="hover:text-gray-900">Fee Schedule</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-4">Company</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-4">Legal</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">BAA</a></li>
                <li><a href="#" className="hover:text-gray-900">HIPAA</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200">
            <div className="text-gray-500 text-sm">© 2026 MedPact Intelligence, Inc. All rights reserved.</div>
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm mt-4 md:mt-0">← Back to MedPact Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}