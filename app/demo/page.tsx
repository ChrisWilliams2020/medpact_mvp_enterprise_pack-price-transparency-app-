"use client";

import { useState } from "react";
import { Container, Pill, Button } from "@/components/ui";
import Link from "next/link";

interface DemoSection {
  id: string;
  title: string;
  description: string;
  features: string[];
}

const DEMO_SECTIONS: DemoSection[] = [
  {
    id: "transparency",
    title: "Price Transparency Intelligence",
    description: "Transform fragmented CMS transparency data into actionable market intelligence.",
    features: [
      "Aggregate hospital and payer pricing data",
      "Compare rates across your market",
      "Identify pricing anomalies and opportunities",
      "Track rate changes over time",
    ],
  },
  {
    id: "payer",
    title: "Payer Behavior Analytics",
    description: "Understand payer patterns across reimbursement, denials, and contract performance.",
    features: [
      "Denial pattern detection and prediction",
      "Authorization success rate tracking",
      "Reimbursement compression analysis",
      "Payer-specific performance metrics",
    ],
  },
  {
    id: "contracts",
    title: "Contract Intelligence",
    description: "Benchmark your contracts against market reality and optimize negotiations.",
    features: [
      "CPT-level rate benchmarking",
      "Contract vs. market gap analysis",
      "Negotiation opportunity scoring",
      "Historical rate trend analysis",
    ],
  },
  {
    id: "automation",
    title: "AI Automation",
    description: "Move from dashboards to operational automation with AI-powered workflows.",
    features: [
      "Automated claim anomaly detection",
      "Smart denial appeal generation",
      "Predictive revenue analytics",
      "Natural language data queries",
    ],
  },
];

// Sample data for interactive demo
const SAMPLE_DATA = {
  transparency: {
    title: "Market Rate Comparison",
    subtitle: "Cataract Surgery (CPT 66984) - Philadelphia Metro",
    data: [
      { payer: "Aetna", yourRate: 1850, marketAvg: 2100, marketHigh: 2450, delta: -250 },
      { payer: "BCBS", yourRate: 1920, marketAvg: 2050, marketHigh: 2380, delta: -130 },
      { payer: "Cigna", yourRate: 2100, marketAvg: 2150, marketHigh: 2500, delta: -50 },
      { payer: "United", yourRate: 1780, marketAvg: 2200, marketHigh: 2600, delta: -420 },
      { payer: "Medicare", yourRate: 1650, marketAvg: 1650, marketHigh: 1650, delta: 0 },
    ],
  },
  payer: {
    title: "Denial Analytics Dashboard",
    subtitle: "Last 90 Days - All Payers",
    metrics: [
      { label: "Total Claims", value: "2,847" },
      { label: "Denial Rate", value: "8.3%", trend: "down", change: "-1.2%" },
      { label: "Appeal Success", value: "72%", trend: "up", change: "+5%" },
      { label: "Days to Payment", value: "28", trend: "down", change: "-3 days" },
    ],
    topDenials: [
      { reason: "Prior Auth Required", count: 89, rate: "38%" },
      { reason: "Medical Necessity", count: 52, rate: "22%" },
      { reason: "Timely Filing", count: 34, rate: "14%" },
      { reason: "Duplicate Claim", count: 28, rate: "12%" },
    ],
  },
  contracts: {
    title: "Contract Opportunity Analysis",
    subtitle: "Annual Revenue Impact Potential",
    opportunities: [
      { payer: "United Healthcare", gap: "$420/case", volume: 180, annualImpact: "$75,600", priority: "High" },
      { payer: "Aetna", gap: "$250/case", volume: 220, annualImpact: "$55,000", priority: "High" },
      { payer: "BCBS", gap: "$130/case", volume: 310, annualImpact: "$40,300", priority: "Medium" },
    ],
    totalOpportunity: "$170,900",
  },
  automation: {
    title: "AI Action Center",
    subtitle: "Recommended Actions Today",
    actions: [
      { type: "appeal", title: "Generate Appeal for Claim #4892", reason: "High success probability (87%)", urgent: true },
      { type: "alert", title: "Prior Auth Expiring Tomorrow", reason: "Patient: J. Smith - Cataract Surgery", urgent: true },
      { type: "insight", title: "Rate Compression Detected", reason: "Cigna rates down 3.2% vs last quarter", urgent: false },
      { type: "task", title: "Contract Renewal Due", reason: "Aetna contract expires in 45 days", urgent: false },
    ],
  },
};

export default function PlatformDemoPage() {
  const [activeSection, setActiveSection] = useState<string>("transparency");
  const [showBooking, setShowBooking] = useState(false);

  const currentSection = DEMO_SECTIONS.find(s => s.id === activeSection) || DEMO_SECTIONS[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Container className="py-10 md:py-16">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <Pill>Interactive Demo</Pill>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              MedPACT Platform Demo
            </h1>
            <p className="mt-2 text-black/70 max-w-xl">
              Explore key capabilities of the MedPACT Healthcare Intelligence Infrastructure™ platform.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowBooking(true)}>Schedule Live Demo</Button>
            <Link href="/"><Button variant="ghost">← Home</Button></Link>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DEMO_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === section.id
                  ? "bg-black text-white"
                  : "bg-white border border-black/10 hover:border-black/30"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{currentSection.title}</h2>
          <p className="text-black/60 mt-1">{currentSection.description}</p>
        </div>

        {/* Demo Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Demo Area */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-black/10 bg-white shadow-lg overflow-hidden">
              {/* Demo Header */}
              <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60">MedPACT Dashboard</div>
                  <div className="font-semibold">{(SAMPLE_DATA as any)[activeSection]?.title}</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Demo Content by Section */}
              <div className="p-6">
                {activeSection === "transparency" && (
                  <div>
                    <div className="text-sm text-black/60 mb-4">{SAMPLE_DATA.transparency.subtitle}</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-black/10">
                            <th className="text-left py-3 px-2 font-semibold">Payer</th>
                            <th className="text-right py-3 px-2 font-semibold">Your Rate</th>
                            <th className="text-right py-3 px-2 font-semibold">Market Avg</th>
                            <th className="text-right py-3 px-2 font-semibold">Market High</th>
                            <th className="text-right py-3 px-2 font-semibold">Gap</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SAMPLE_DATA.transparency.data.map((row, i) => (
                            <tr key={i} className="border-b border-black/5 hover:bg-gray-50">
                              <td className="py-3 px-2 font-medium">{row.payer}</td>
                              <td className="py-3 px-2 text-right">${row.yourRate.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right">${row.marketAvg.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right text-green-600">${row.marketHigh.toLocaleString()}</td>
                              <td className={`py-3 px-2 text-right font-medium ${row.delta < 0 ? "text-red-600" : row.delta > 0 ? "text-green-600" : "text-black/50"}`}>
                                {row.delta > 0 ? "+" : ""}{row.delta === 0 ? "—" : `$${row.delta}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="text-sm font-semibold text-amber-800">💡 Insight</div>
                      <div className="text-sm text-amber-700 mt-1">
                        Your United Healthcare rate is $420 below market average. This represents a potential $75,600 annual revenue opportunity with 180 cases/year.
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "payer" && (
                  <div>
                    <div className="text-sm text-black/60 mb-4">{SAMPLE_DATA.payer.subtitle}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {SAMPLE_DATA.payer.metrics.map((metric, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4">
                          <div className="text-sm text-black/60">{metric.label}</div>
                          <div className="text-2xl font-bold mt-1">{metric.value}</div>
                          {metric.change && (
                            <div className={`text-xs mt-1 ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-green-600" : ""}`}>
                              {metric.change}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="font-semibold mb-3">Top Denial Reasons</div>
                    <div className="space-y-2">
                      {SAMPLE_DATA.payer.topDenials.map((denial, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{denial.reason}</span>
                              <span className="font-medium">{denial.count} ({denial.rate})</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-red-400 rounded-full" style={{ width: denial.rate }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "contracts" && (
                  <div>
                    <div className="text-sm text-black/60 mb-4">{SAMPLE_DATA.contracts.subtitle}</div>
                    <div className="space-y-4 mb-6">
                      {SAMPLE_DATA.contracts.opportunities.map((opp, i) => (
                        <div key={i} className="border border-black/10 rounded-xl p-4 hover:border-black/20 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{opp.payer}</div>
                              <div className="text-sm text-black/60">Gap: {opp.gap} × {opp.volume} cases</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">{opp.annualImpact}</div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                opp.priority === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {opp.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-green-800">Total Annual Opportunity</span>
                        <span className="text-2xl font-bold text-green-600">{SAMPLE_DATA.contracts.totalOpportunity}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "automation" && (
                  <div>
                    <div className="text-sm text-black/60 mb-4">{SAMPLE_DATA.automation.subtitle}</div>
                    <div className="space-y-3">
                      {SAMPLE_DATA.automation.actions.map((action, i) => (
                        <div key={i} className={`border rounded-xl p-4 ${action.urgent ? "border-red-200 bg-red-50" : "border-black/10"}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                              action.type === "appeal" ? "bg-blue-500" :
                              action.type === "alert" ? "bg-red-500" :
                              action.type === "insight" ? "bg-purple-500" : "bg-gray-500"
                            }`}>
                              {action.type === "appeal" ? "⚡" : action.type === "alert" ? "!" : action.type === "insight" ? "💡" : "📋"}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{action.title}</div>
                              <div className="text-sm text-black/60">{action.reason}</div>
                            </div>
                            <Button variant="secondary" className="text-xs px-3 py-1">
                              {action.type === "appeal" ? "Generate" : action.type === "alert" ? "View" : "Review"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Sidebar */}
          <div>
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h3 className="font-semibold mb-4">Key Capabilities</h3>
              <ul className="space-y-3">
                {currentSection.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-black/10">
                <Button onClick={() => setShowBooking(true)} className="w-full">
                  See This Live
                </Button>
                <p className="text-xs text-black/50 mt-2 text-center">
                  30-minute personalized demo
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 rounded-2xl bg-black text-white p-6">
              <h3 className="font-semibold mb-4">Platform Impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">15-25%</div>
                  <div className="text-white/60 text-sm">Average rate improvement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">40%</div>
                  <div className="text-white/60 text-sm">Reduction in denial rates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">$170K+</div>
                  <div className="text-white/60 text-sm">Average annual recovery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative">
              <button onClick={() => setShowBooking(false)} className="absolute top-4 right-4 text-black/40 hover:text-black text-2xl">×</button>
              <h2 className="text-2xl font-bold mb-2">Schedule Your Demo</h2>
              <p className="text-black/60 mb-6">Book a personalized 30-minute walkthrough of the MedPACT platform.</p>
              
              {/* Calendly Embed Placeholder */}
              <div className="bg-gray-100 rounded-2xl p-8 text-center mb-6">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-sm text-black/60 mb-4">
                  Calendar integration coming soon. For now, please contact us directly.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> demo@medpact.com</div>
                  <div><strong>Phone:</strong> (555) 123-4567</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/contact" className="flex-1">
                  <Button className="w-full">Request Briefing</Button>
                </Link>
                <Button variant="secondary" onClick={() => setShowBooking(false)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
