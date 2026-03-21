// Financial Projection and Revenue Forecasting
export interface RevenueProjection {
  month: string;
  projectedRevenue: number;
  conservativeRevenue: number;
  aggressiveRevenue: number;
  patientVolume: number;
}

export interface PayorMixAnalysis {
  payorName: string;
  percentage: number;
  averageReimbursement: number;
  patientCount: number;
  annualRevenue: number;
}

export async function projectRevenue(params: {
  currentMonthlyRevenue: number;
  growthRate: number;
  months: number;
  seasonalityFactors?: number[];
}): Promise<RevenueProjection[]> {
  const projections: RevenueProjection[] = [];
  const baseRevenue = params.currentMonthlyRevenue;
  const monthlyGrowth = params.growthRate / 12;
  
  for (let i = 0; i < params.months; i++) {
    const growthFactor = Math.pow(1 + monthlyGrowth, i);
    const seasonality = params.seasonalityFactors?.[i % 12] || 1.0;
    
    const baseProjected = baseRevenue * growthFactor * seasonality;
    
    projections.push({
      month: getMonthName(i),
      projectedRevenue: baseProjected,
      conservativeRevenue: baseProjected * 0.85,
      aggressiveRevenue: baseProjected * 1.15,
      patientVolume: Math.floor(baseProjected / 150), // Assume $150 avg per visit
    });
  }
  
  return projections;
}

export async function analyzePayorMix(params: {
  totalPatients: number;
  payorDistribution: { [payor: string]: number };
  averageReimbursements: { [payor: string]: number };
}): Promise<PayorMixAnalysis[]> {
  const analysis: PayorMixAnalysis[] = [];
  
  for (const [payor, percentage] of Object.entries(params.payorDistribution)) {
    const patientCount = Math.floor(params.totalPatients * (percentage / 100));
    const avgReimbursement = params.averageReimbursements[payor] || 100;
    const annualRevenue = patientCount * avgReimbursement * 2.5; // Assume 2.5 visits/year
    
    analysis.push({
      payorName: payor,
      percentage,
      averageReimbursement: avgReimbursement,
      patientCount,
      annualRevenue,
    });
  }
  
  return analysis.sort((a, b) => b.annualRevenue - a.annualRevenue);
}

export function calculateRVUProjections(params: {
  monthlyVisits: number;
  averageRVUPerVisit: number;
  conversionFactor: number;
  months: number;
}): {
  month: string;
  visits: number;
  totalRVUs: number;
  projectedRevenue: number;
}[] {
  const projections = [];
  
  for (let i = 0; i < params.months; i++) {
    const totalRVUs = params.monthlyVisits * params.averageRVUPerVisit;
    const revenue = totalRVUs * params.conversionFactor;
    
    projections.push({
      month: getMonthName(i),
      visits: params.monthlyVisits,
      totalRVUs,
      projectedRevenue: revenue,
    });
  }
  
  return projections;
}

export function benchmarkOverhead(params: {
  totalRevenue: number;
  staffCosts: number;
  facilityRent: number;
  supplies: number;
  other: number;
}): {
  category: string;
  amount: number;
  percentage: number;
  benchmark: number;
  variance: number;
}[] {
  const benchmarks = {
    staffCosts: 0.40, // 40% of revenue
    facilityRent: 0.08, // 8% of revenue
    supplies: 0.05, // 5% of revenue
    other: 0.12, // 12% of revenue
  };
  
  const results = [];
  
  for (const [category, amount] of Object.entries(params)) {
    if (category === 'totalRevenue') continue;
    
    const percentage = (amount / params.totalRevenue) * 100;
    const benchmark = benchmarks[category as keyof typeof benchmarks] * 100;
    const variance = percentage - benchmark;
    
    results.push({
      category,
      amount,
      percentage,
      benchmark,
      variance,
    });
  }
  
  return results;
}

function getMonthName(offset: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const now = new Date();
  const monthIndex = (now.getMonth() + offset) % 12;
  const year = now.getFullYear() + Math.floor((now.getMonth() + offset) / 12);
  return `${months[monthIndex]} ${year}`;
}
