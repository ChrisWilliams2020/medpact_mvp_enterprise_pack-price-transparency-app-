export const demoPracticeProfile = {
  name: "Vision Excellence Eye Center",
  type: "Ophthalmology",
  location: "Austin, TX",
  providers: 4,
  annualRevenue: 3200000,
  patients: 12500,
  established: 2015,
  email: "demo@visionexcellence.com",
  phone: "(512) 555-0123",
  website: "www.visionexcellence.com",
  specialties: ["Cataract Surgery", "LASIK", "Glaucoma", "Retina"],
  ehr: "Modernizing Medicine",
  pmSystem: "NextGen"
};

export const demoMetricValues = {
  // Revenue Cycle Metrics
  collectionRate: 94.2,
  denialRate: 7.8,
  daysInAR: 38,
  cleanClaimRate: 91.5,
  firstPassResolution: 88.3,
  
  // Clinical Metrics
  patientSatisfaction: 89,
  waitTime: 18,
  noShowRate: 8.5,
  patientRetention: 82,
  referralRate: 24,
  
  // Surgical Metrics
  cataractVolume: 420,
  premiumIOLRate: 28,
  lasikVolume: 180,
  surgicalYield: 78,
  
  // Financial Metrics
  revenuePerProvider: 800000,
  overheadRatio: 62,
  netCollections: 2950000,
  accountsReceivable: 485000,
  
  // Staffing Metrics
  staffToProviderRatio: 4.2,
  techsPerProvider: 1.8,
  billingFTEPerMillion: 1.2,
  staffTurnover: 18
};

export const demoBenchmarks = {
  collectionRate: { value: 98, label: "Collection Rate", unit: "percent" },
  denialRate: { value: 5, label: "Denial Rate", unit: "percent", lowerIsBetter: true },
  daysInAR: { value: 30, label: "Days in A/R", unit: "days", lowerIsBetter: true },
  cleanClaimRate: { value: 95, label: "Clean Claim Rate", unit: "percent" },
  firstPassResolution: { value: 92, label: "First Pass Resolution", unit: "percent" },
  patientSatisfaction: { value: 92, label: "Patient Satisfaction", unit: "percent" },
  waitTime: { value: 15, label: "Wait Time", unit: "minutes", lowerIsBetter: true },
  noShowRate: { value: 5, label: "No-Show Rate", unit: "percent", lowerIsBetter: true },
  patientRetention: { value: 85, label: "Patient Retention", unit: "percent" },
  referralRate: { value: 30, label: "Referral Rate", unit: "percent" },
  premiumIOLRate: { value: 35, label: "Premium IOL Rate", unit: "percent" },
  revenuePerProvider: { value: 950000, label: "Revenue/Provider", unit: "currency" },
  overheadRatio: { value: 55, label: "Overhead Ratio", unit: "percent", lowerIsBetter: true },
  staffTurnover: { value: 12, label: "Staff Turnover", unit: "percent", lowerIsBetter: true }
};

export const demoRevenueOpportunities = [
  {
    id: 1,
    title: "Premium IOL Conversion",
    currentValue: 28,
    targetValue: 35,
    potentialRevenue: 145000,
    priority: "high",
    description: "Increase premium IOL adoption from 28% to industry benchmark of 35%",
    actionItems: [
      "Implement patient education materials",
      "Train staff on premium IOL benefits",
      "Update consultation workflow"
    ]
  },
  {
    id: 2,
    title: "A/R Recovery",
    currentValue: 38,
    targetValue: 30,
    potentialRevenue: 89000,
    priority: "high",
    description: "Reduce days in A/R from 38 to 30 days",
    actionItems: [
      "Implement automated follow-up system",
      "Review denial patterns",
      "Improve claim scrubbing"
    ]
  },
  {
    id: 3,
    title: "Denial Rate Reduction",
    currentValue: 7.8,
    targetValue: 5,
    potentialRevenue: 67000,
    priority: "medium",
    description: "Reduce denial rate from 7.8% to 5%",
    actionItems: [
      "Implement pre-authorization workflow",
      "Staff training on coding updates",
      "Payer contract review"
    ]
  },
  {
    id: 4,
    title: "Patient Retention",
    currentValue: 82,
    targetValue: 85,
    potentialRevenue: 52000,
    priority: "medium",
    description: "Improve patient retention from 82% to 85%",
    actionItems: [
      "Implement recall system",
      "Patient satisfaction surveys",
      "Follow-up appointment automation"
    ]
  },
  {
    id: 5,
    title: "No-Show Reduction",
    currentValue: 8.5,
    targetValue: 5,
    potentialRevenue: 38000,
    priority: "low",
    description: "Reduce no-show rate from 8.5% to 5%",
    actionItems: [
      "SMS appointment reminders",
      "Implement waitlist system",
      "Deposit policy for procedures"
    ]
  }
];

export const demoCompetitors = [
  {
    id: 1,
    name: "Austin Eye Associates",
    type: "ophthalmology",
    distance: 2.3,
    rating: 4.6,
    reviews: 342,
    services: ["Cataract", "LASIK", "Glaucoma", "Oculoplastics"],
    providers: 6,
    acceptingNew: true,
    insurances: ["Medicare", "BlueCross", "Aetna", "United"],
    strengths: ["Large practice", "Multiple locations", "Strong Google presence"],
    weaknesses: ["Long wait times reported", "Difficulty scheduling"]
  },
  {
    id: 2,
    name: "Hill Country Vision",
    type: "ophthalmology",
    distance: 4.1,
    rating: 4.8,
    reviews: 189,
    services: ["Cataract", "Retina", "Cornea"],
    providers: 3,
    acceptingNew: true,
    insurances: ["Medicare", "BlueCross", "Cigna"],
    strengths: ["High patient satisfaction", "Retina specialist"],
    weaknesses: ["Limited services", "Single location"]
  },
  {
    id: 3,
    name: "Capital City Eye Care",
    type: "optometry",
    distance: 1.8,
    rating: 4.4,
    reviews: 567,
    services: ["Comprehensive Exams", "Contact Lenses", "Optical"],
    providers: 4,
    acceptingNew: true,
    insurances: ["Most major insurances"],
    strengths: ["Convenient location", "Walk-ins welcome", "Large optical"],
    weaknesses: ["No surgical services", "High staff turnover"]
  },
  {
    id: 4,
    name: "Southwest Retina Specialists",
    type: "retina",
    distance: 5.2,
    rating: 4.9,
    reviews: 124,
    services: ["Medical Retina", "Surgical Retina", "Uveitis"],
    providers: 2,
    acceptingNew: false,
    insurances: ["Medicare", "BlueCross", "Aetna"],
    strengths: ["Highly specialized", "Excellent outcomes"],
    weaknesses: ["Not accepting new patients", "Long referral wait"]
  }
];

export const demoChatHistory = [
  {
    role: "assistant",
    content: "Welcome to KCN Intelligence! I'm here to help you understand your practice metrics and identify opportunities for improvement. What would you like to know?"
  },
  {
    role: "user",
    content: "What are my biggest revenue opportunities?"
  },
  {
    role: "assistant", 
    content: "Based on your practice data, I've identified **$391,000 in potential annual revenue** opportunities:\n\n1. **Premium IOL Conversion (+$145K)** - Your current rate of 28% is below the 35% benchmark. Implementing patient education and staff training could capture this.\n\n2. **A/R Recovery (+$89K)** - Reducing days in A/R from 38 to 30 days would improve cash flow significantly.\n\n3. **Denial Rate Reduction (+$67K)** - Your 7.8% denial rate exceeds the 5% benchmark. Focus on pre-authorization workflows.\n\nWould you like me to create an action plan for any of these?"
  },
  {
    role: "user",
    content: "How do we compare to competitors?"
  },
  {
    role: "assistant",
    content: "Here's your competitive positioning in the Austin market:\n\n**Strengths:**\n- Your 4.7 Google rating is competitive (market avg: 4.5)\n- Strong LASIK program differentiates you\n- Good insurance coverage\n\n**Areas to Watch:**\n- Austin Eye Associates has 6 providers vs your 4\n- Hill Country Vision has higher patient satisfaction (4.8 vs 4.7)\n- Capital City Eye Care is closer to downtown\n\n**Recommendations:**\n- Increase Google review collection\n- Consider expanding premium lens marketing\n- Monitor Southwest Retina for referral opportunities"
  }
];

export const demoHeatMapData = [
  { zip: "78701", patients: 450, lat: 30.2672, lng: -97.7431, revenue: 285000 },
  { zip: "78702", patients: 380, lat: 30.2621, lng: -97.7195, revenue: 242000 },
  { zip: "78703", patients: 520, lat: 30.2950, lng: -97.7632, revenue: 412000 },
  { zip: "78704", patients: 290, lat: 30.2437, lng: -97.7660, revenue: 178000 },
  { zip: "78705", patients: 185, lat: 30.2920, lng: -97.7417, revenue: 95000 },
  { zip: "78731", patients: 680, lat: 30.3521, lng: -97.7642, revenue: 520000 },
  { zip: "78746", patients: 890, lat: 30.2977, lng: -97.8156, revenue: 685000 },
  { zip: "78750", patients: 445, lat: 30.4177, lng: -97.7925, revenue: 298000 },
  { zip: "78759", patients: 560, lat: 30.3977, lng: -97.7525, revenue: 385000 }
];

export const demoCPTAnalysis = [
  { code: "66984", description: "Cataract surgery", volume: 420, avgReimbursement: 1850, totalRevenue: 777000, benchmark: 1920, variance: -3.6 },
  { code: "92014", description: "Comprehensive eye exam", volume: 3200, avgReimbursement: 125, totalRevenue: 400000, benchmark: 118, variance: 5.9 },
  { code: "67028", description: "Intravitreal injection", volume: 890, avgReimbursement: 285, totalRevenue: 253650, benchmark: 295, variance: -3.4 },
  { code: "92083", description: "Visual field exam", volume: 1450, avgReimbursement: 65, totalRevenue: 94250, benchmark: 62, variance: 4.8 },
  { code: "92134", description: "OCT scan", volume: 2100, avgReimbursement: 48, totalRevenue: 100800, benchmark: 45, variance: 6.7 },
  { code: "65855", description: "Laser trabeculoplasty", volume: 180, avgReimbursement: 425, totalRevenue: 76500, benchmark: 450, variance: -5.6 }
];

export const demoAlerts = [
  { id: 1, type: "warning", title: "Denial Rate Trending Up", message: "Denial rate increased 0.5% this month. Review recent Medicare claims.", date: "2026-03-22" },
  { id: 2, type: "success", title: "Premium IOL Goal Met", message: "Premium IOL conversion reached 30% this week!", date: "2026-03-21" },
  { id: 3, type: "info", title: "New Competitor Alert", message: "New optometry practice opening in 78746 zip code next month.", date: "2026-03-20" },
  { id: 4, type: "warning", title: "Staff Turnover", message: "2 technicians gave notice. Review staffing plan.", date: "2026-03-19" }
];

// Function to load demo mode
export const loadDemoMode = () => {
  localStorage.setItem('medpact_profile', JSON.stringify(demoPracticeProfile));
  localStorage.setItem('medpact_metrics', JSON.stringify(demoMetricValues));
  localStorage.setItem('medpact_demo_mode', 'true');
  return {
    profile: demoPracticeProfile,
    metrics: demoMetricValues,
    opportunities: demoRevenueOpportunities,
    competitors: demoCompetitors,
    chatHistory: demoChatHistory,
    heatMap: demoHeatMapData,
    cptAnalysis: demoCPTAnalysis,
    alerts: demoAlerts
  };
};

// Function to check if in demo mode
export const isDemoMode = () => {
  return localStorage.getItem('medpact_demo_mode') === 'true';
};

// Function to exit demo mode
export const exitDemoMode = () => {
  localStorage.removeItem('medpact_demo_mode');
  localStorage.removeItem('medpact_profile');
  localStorage.removeItem('medpact_metrics');
};