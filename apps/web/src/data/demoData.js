// Demo Mode Data for Sales Presentations

export const demoPracticeProfile = {
  name: "Precision Eye Associates",
  type: "Multi-Specialty Ophthalmology",
  locations: "3",
  providers: "8",
  annualRevenue: "$4.2M",
  specialty: ["Cataract", "Glaucoma", "Retina", "LASIK"],
  emr: "Modernizing Medicine",
  state: "California"
};

export const demoMetricValues = {
  collection_rate: 96.5,
  days_in_ar: 38,
  denial_rate: 6.2,
  first_pass_rate: 93,
  charge_lag: 2.5,
  ar_over_90: 14,
  patient_volume: 1450,
  revenue_per_visit: 195,
  bad_debt_rate: 2.8,
  pe_ebitda_margin: 24,
  pe_revenue_per_provider: 525000,
  kpi_wrvus: 7800,
  kpi_surgical_cases: 380,
  asc_cases_per_or: 7.5,
  asc_turnover_time: 14,
  asc_premium_iol_rate: 28
};

export const demoRevenueOpportunities = [
  { id: 1, title: "Premium IOL Conversion", description: "Current rate 28% vs benchmark 35%", potentialRevenue: 145000, priority: "high" },
  { id: 2, title: "Reduce A/R Over 90 Days", description: "Currently 14% vs benchmark 10%", potentialRevenue: 89000, priority: "high" },
  { id: 3, title: "Denial Rate Optimization", description: "6.2% denial rate vs 4% benchmark", potentialRevenue: 67000, priority: "medium" },
  { id: 4, title: "Charge Lag Reduction", description: "2.5 days vs 1.5 day benchmark", potentialRevenue: 45000, priority: "medium" },
  { id: 5, title: "Patient Retention Program", description: "Recall compliance at 78%", potentialRevenue: 52000, priority: "low" }
];

export const demoCompetitors = [
  { id: 1, name: "Bay Area Eye Institute", type: "ophthalmology", rating: 4.6, reviews: 342, distance: 2.1, strengths: ["Premium IOLs", "Modern facility", "Short wait times"], weaknesses: ["Limited parking", "Higher co-pays"] },
  { id: 2, name: "Pacific Vision Center", type: "ophthalmology", rating: 4.4, reviews: 256, distance: 3.5, strengths: ["LASIK expertise", "Evening hours", "Online booking"], weaknesses: ["Higher prices", "Insurance limitations"] },
  { id: 3, name: "Golden Gate Optometry", type: "optometry", rating: 4.8, reviews: 189, distance: 1.2, strengths: ["Convenient location", "Quick appointments", "Great reviews"], weaknesses: ["No surgical services", "Limited specialists"] },
  { id: 4, name: "Silicon Valley Retina", type: "retina", rating: 4.7, reviews: 156, distance: 8.4, strengths: ["Retina specialist", "Research trials", "Advanced imaging"], weaknesses: ["Long referral wait", "Limited hours"] }
];

export const demoChatHistory = [
  { role: "assistant", content: "Welcome to KCN Intelligence! I can help you understand your practice metrics, identify opportunities, and answer questions about benchmarks. What would you like to know?" },
  { role: "user", content: "How does our collection rate compare to benchmarks?" },
  { role: "assistant", content: "Your collection rate of 96.5% is slightly below the industry benchmark of 98%. This represents approximately $67,000 in potential annual recovery. Key areas to focus on:\n\n• Review denial patterns by payer\n• Implement automated eligibility verification\n• Follow up on claims over 45 days\n\nWould you like me to analyze your denial patterns?" }
];

export const demoAlerts = [
  { id: 1, type: "warning", title: "A/R Alert", message: "5 accounts over 90 days need attention", timestamp: new Date() },
  { id: 2, type: "success", title: "Collection Goal Met", message: "March collections exceeded target by 4%", timestamp: new Date() },
  { id: 3, type: "info", title: "Benchmark Update", message: "Q1 2026 benchmarks now available", timestamp: new Date() }
];

// Demo mode state management
const DEMO_KEY = 'medpact_demo_mode';

export function loadDemoMode() {
  localStorage.setItem(DEMO_KEY, 'true');
  localStorage.setItem('medpact_profile', JSON.stringify(demoPracticeProfile));
  localStorage.setItem('medpact_metrics', JSON.stringify(demoMetricValues));
  return {
    profile: demoPracticeProfile,
    metrics: demoMetricValues,
    opportunities: demoRevenueOpportunities,
    competitors: demoCompetitors,
    chatHistory: demoChatHistory,
    alerts: demoAlerts
  };
}

export function isDemoMode() {
  return localStorage.getItem(DEMO_KEY) === 'true';
}

export function exitDemoMode() {
  localStorage.removeItem(DEMO_KEY);
  localStorage.removeItem('medpact_profile');
  localStorage.removeItem('medpact_metrics');
}
