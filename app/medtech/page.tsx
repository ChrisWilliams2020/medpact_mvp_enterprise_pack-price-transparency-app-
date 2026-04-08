import { Container, Button } from "@/components/ui";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedTech & Pharma | MedPACT — Healthcare Intelligence Infrastructure™",
  description: "How MedPACT's Healthcare Intelligence Infrastructure transforms pharma, medical device, and sales innovation through price transparency and real-time payer intelligence.",
};

const impacts = [
  {
    sector: "Pharmaceutical Industry",
    icon: "💊",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    challenges: [
      "Opaque payer formulary decisions",
      "Unpredictable reimbursement landscapes",
      "Limited visibility into real-world prescription patterns",
      "340B program complexity and margin erosion",
    ],
    solutions: [
      "Real-time payer formulary intelligence across all major plans",
      "Predictive reimbursement modeling for drug launches",
      "Regional prescribing pattern analytics by payer and specialty",
      "340B optimization and channel visibility",
    ],
    outcomes: [
      { metric: "40%", label: "Faster market access decisions" },
      { metric: "25%", label: "Improved formulary positioning" },
      { metric: "3x", label: "Better launch intelligence" },
    ],
  },
  {
    sector: "Medical Device Industry",
    icon: "🔬",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    challenges: [
      "ASC vs. HOPD reimbursement disparities",
      "Prior authorization bottlenecks for implants",
      "Regional pricing inconsistencies",
      "Limited visibility into competitive contract terms",
    ],
    solutions: [
      "Site-of-service reimbursement comparison analytics",
      "Prior auth prediction and automation for device procedures",
      "Real-time price transparency data across facilities",
      "Contract benchmarking and competitive intelligence",
    ],
    outcomes: [
      { metric: "60%", label: "Reduction in PA delays" },
      { metric: "35%", label: "Improved contract negotiations" },
      { metric: "2x", label: "Faster sales cycle insights" },
    ],
  },
  {
    sector: "Sales Innovation",
    icon: "📈",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    challenges: [
      "Outdated territory intelligence",
      "No visibility into payer-specific opportunities",
      "Reactive rather than proactive selling",
      "Disconnected from practice economics",
    ],
    solutions: [
      "AI-powered territory optimization based on payer mix",
      "Real-time alerts for reimbursement changes by region",
      "Practice-level economic impact modeling",
      "Payer contract expiration and renewal intelligence",
    ],
    outcomes: [
      { metric: "50%", label: "More targeted outreach" },
      { metric: "30%", label: "Higher conversion rates" },
      { metric: "4x", label: "ROI on sales intelligence" },
    ],
  },
];

const useCases = [
  {
    title: "Drug Launch Intelligence",
    description: "Before launching a new ophthalmic therapeutic, understand exactly which payers will cover it, at what tier, and how reimbursement compares to existing alternatives—before your first sales call.",
    icon: "🚀",
  },
  {
    title: "Device Pricing Strategy",
    description: "Know the real-world reimbursement rates for your premium IOL or surgical device across every ASC and hospital in your territory. Price confidently with data, not guesswork.",
    icon: "💰",
  },
  {
    title: "Sales Rep Empowerment",
    description: "Arm your reps with practice-specific economic impact data. Show surgeons exactly how your product affects their bottom line with their specific payer mix.",
    icon: "🎯",
  },
  {
    title: "Market Access Acceleration",
    description: "Track formulary changes, prior auth requirements, and coverage decisions in real-time. React to market shifts before your competitors even know they happened.",
    icon: "⚡",
  },
  {
    title: "Competitive Intelligence",
    description: "See how competing products are being reimbursed, which practices are switching, and where market share is shifting—with actual claims data, not surveys.",
    icon: "🔍",
  },
  {
    title: "Value-Based Contract Design",
    description: "Design outcomes-based contracts with confidence using real-world evidence on procedure success rates, complication costs, and total cost of care.",
    icon: "📋",
  },
];

export default function MedTechPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <Container className="relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-6">
              <span>💊</span>
              <span>🔬</span>
              <span>📈</span>
              <span className="ml-2">MedPACT for MedTech</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              The Future of Pharma &<br />
              <span className="bg-gradient-to-r from-medpact-green to-medpact-blue bg-clip-text text-transparent">
                Device Intelligence
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Price transparency data isn't just for providers. It's the most powerful market intelligence 
              tool the pharmaceutical and medical device industry has ever had access to.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="px-8 py-4 text-lg">Schedule Industry Briefing</Button>
              </Link>
              <Link href="/demo">
                <button className="px-8 py-4 text-lg text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                  See Platform Demo
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Value Proposition */}
      <section className="bg-white border-b border-black/10">
        <Container className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs uppercase tracking-widest text-black/50 mb-4">The Opportunity</div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              $4 Trillion in Healthcare Spend.<br />
              Finally Visible.
            </h2>
            <p className="mt-4 text-lg text-black/70">
              For the first time in history, price transparency mandates are exposing the real economics 
              of healthcare. MedPACT transforms this raw data into actionable intelligence for 
              pharmaceutical, device, and life sciences companies.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gray-50 scroll-animate">
              <div className="text-4xl font-bold text-medpact-blue">850M+</div>
              <div className="mt-2 text-sm text-black/70">Negotiated rates now public</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 scroll-animate scroll-delay-1">
              <div className="text-4xl font-bold text-medpact-green">Real-Time</div>
              <div className="mt-2 text-sm text-black/70">Payer contract intelligence</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 scroll-animate scroll-delay-2">
              <div className="text-4xl font-bold text-purple-600">Predictive</div>
              <div className="mt-2 text-sm text-black/70">AI-powered market insights</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Industry Impacts */}
      <section className="bg-gray-50">
        <Container className="py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-black/50 mb-4">Industry Impact</div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Transforming Three Industries
            </h2>
          </div>

          <div className="space-y-12">
            {impacts.map((impact, index) => (
              <div 
                key={impact.sector} 
                className={`rounded-3xl border ${impact.borderColor} ${impact.bgColor} p-8 md:p-10 scroll-animate`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{impact.icon}</span>
                  <h3 className="text-2xl font-bold">{impact.sector}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Challenges */}
                  <div>
                    <div className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-3">Current Challenges</div>
                    <ul className="space-y-2">
                      {impact.challenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                          <span className="text-red-500 mt-0.5">✗</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <div className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-3">MedPACT Solutions</div>
                    <ul className="space-y-2">
                      {impact.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Outcomes */}
                <div className="mt-8 pt-6 border-t border-black/10 grid grid-cols-3 gap-4">
                  {impact.outcomes.map((outcome, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${impact.color} bg-clip-text text-transparent`}>
                        {outcome.metric}
                      </div>
                      <div className="text-xs text-black/60 mt-1">{outcome.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Use Cases Grid */}
      <section className="bg-white">
        <Container className="py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-black/50 mb-4">Use Cases</div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Intelligence in Action
            </h2>
            <p className="mt-4 text-lg text-black/70 max-w-2xl mx-auto">
              See how leading pharma and device companies are leveraging price transparency data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div 
                key={useCase.title}
                className="p-6 rounded-2xl border border-black/10 bg-white hover:shadow-lg transition-shadow scroll-animate"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="text-3xl">{useCase.icon}</span>
                <h3 className="mt-4 text-lg font-bold">{useCase.title}</h3>
                <p className="mt-2 text-sm text-black/70">{useCase.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Sales Rep Value to Practices - NEW SECTION */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-y border-black/10">
        <Container className="py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm mb-6">
              <span>🎯</span>
              <span className="font-semibold">Sales Rep Transformation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Prove Your Value to Every Practice
            </h2>
            <p className="mt-4 text-lg text-black/70 max-w-2xl mx-auto">
              Stop selling features. Start selling economic impact. MedPACT gives your reps 
              practice-specific payer intelligence to demonstrate real ROI.
            </p>
          </div>

          {/* The Value Shift */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="p-8 rounded-2xl bg-red-50 border border-red-200 scroll-animate">
                <div className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4">❌ Traditional Sales Approach</div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-red-400">•</span>
                    Generic product features and clinical data
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-red-400">•</span>
                    "Our product is better" without economic proof
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-red-400">•</span>
                    No understanding of practice's payer mix
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-red-400">•</span>
                    Vague promises of "improved outcomes"
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-red-400">•</span>
                    Reps seen as cost, not value partner
                  </li>
                </ul>
              </div>

              {/* After */}
              <div className="p-8 rounded-2xl bg-green-50 border border-green-200 scroll-animate scroll-delay-1">
                <div className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4">✓ MedPACT-Enabled Sales</div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-green-500">✓</span>
                    Practice-specific reimbursement analysis
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-green-500">✓</span>
                    "Here's exactly how much more you'll earn"
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-green-500">✓</span>
                    Know their top payers and reimbursement rates
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-green-500">✓</span>
                    ROI projections based on actual payer data
                  </li>
                  <li className="flex items-start gap-3 text-sm text-black/70">
                    <span className="text-green-500">✓</span>
                    Reps become strategic business advisors
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rep Value Scenarios */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-center mb-8">How Your Reps Become Invaluable</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Scenario 1 */}
              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm scroll-animate">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl mb-4">💊</div>
                <h4 className="font-bold text-lg mb-2">Pharma Rep Value</h4>
                <p className="text-sm text-black/60 mb-4">
                  Walk into a practice knowing exactly which payers cover your drug, at what tier, 
                  and the reimbursement delta vs. alternatives.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 text-sm">
                  <span className="font-semibold">"Dr. Smith, with your 40% Aetna patients, 
                  switching to our therapy would add $23,000 annually to your practice."</span>
                </div>
              </div>

              {/* Scenario 2 */}
              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm scroll-animate scroll-delay-1">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl mb-4">🔬</div>
                <h4 className="font-bold text-lg mb-2">Device Rep Value</h4>
                <p className="text-sm text-black/60 mb-4">
                  Show surgeons the exact reimbursement they'll receive for your device at their 
                  specific facility with their specific payer contracts.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 text-sm">
                  <span className="font-semibold">"Your ASC gets $2,400 for premium IOLs from BCBS. 
                  Here's how that breaks down per procedure..."</span>
                </div>
              </div>

              {/* Scenario 3 */}
              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm scroll-animate scroll-delay-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-4">📈</div>
                <h4 className="font-bold text-lg mb-2">Product Adoption</h4>
                <p className="text-sm text-black/60 mb-4">
                  Accelerate adoption by removing economic uncertainty. Practices adopt faster 
                  when they understand exactly how it impacts revenue.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 text-sm">
                  <span className="font-semibold">"Based on your procedure volume and payer mix, 
                  ROI is 90 days. Here's the model."</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 scroll-animate">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">73%</div>
                <div className="text-xs text-black/60 mt-1">Higher close rates with payer-specific data</div>
              </div>
              <div className="p-4 scroll-animate scroll-delay-1">
                <div className="text-3xl md:text-4xl font-bold text-purple-600">2.4x</div>
                <div className="text-xs text-black/60 mt-1">Faster product adoption cycles</div>
              </div>
              <div className="p-4 scroll-animate scroll-delay-2">
                <div className="text-3xl md:text-4xl font-bold text-green-600">89%</div>
                <div className="text-xs text-black/60 mt-1">Of practices want economic data from reps</div>
              </div>
              <div className="p-4 scroll-animate scroll-delay-3">
                <div className="text-3xl md:text-4xl font-bold text-orange-600">$47K</div>
                <div className="text-xs text-black/60 mt-1">Average practice value unlocked per product</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link href="/contact">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                Empower Your Sales Team →
              </button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Partnership CTA */}
      <section className="bg-gradient-to-br from-gray-900 to-black text-white">
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-4">Partnership</div>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Ready to Transform Your<br />Market Intelligence?
            </h2>
            <p className="mt-4 text-lg text-white/70">
              We work with select pharmaceutical, medical device, and life sciences partners 
              who are ready to leverage the price transparency revolution.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🏢</div>
                <div className="font-semibold">Enterprise</div>
                <div className="text-sm text-white/60 mt-1">Full platform access, dedicated support, custom integrations</div>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🤝</div>
                <div className="font-semibold">Strategic</div>
                <div className="text-sm text-white/60 mt-1">Co-development opportunities, data partnerships</div>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🔌</div>
                <div className="font-semibold">API Access</div>
                <div className="text-sm text-white/60 mt-1">Integrate intelligence into your existing platforms</div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <button className="px-8 py-4 bg-medpact-green text-white rounded-full font-semibold hover:bg-green-600 transition-colors">
                  Request Industry Briefing →
                </button>
              </Link>
              <Link href="/team">
                <button className="px-8 py-4 text-white/80 hover:text-white transition-colors">
                  Meet Our Team
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white border-t border-black/10">
        <Container className="py-12">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <span className="text-green-600">🔒</span>
              <span className="text-xs font-medium text-green-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
              <span className="text-blue-600">✓</span>
              <span className="text-xs font-medium text-blue-700">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200">
              <span className="text-purple-600">🛡️</span>
              <span className="text-xs font-medium text-purple-700">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
              <span className="text-orange-600">📊</span>
              <span className="text-xs font-medium text-orange-700">Real-Time Data</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
