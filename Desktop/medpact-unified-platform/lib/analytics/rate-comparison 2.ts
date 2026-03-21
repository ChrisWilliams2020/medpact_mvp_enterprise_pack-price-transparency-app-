// Rate Comparison and Benchmarking Engine
export interface RateData {
  procedureCode: string;
  procedureName: string;
  rate: number;
  payorName: string;
  effectiveDate: string;
  region: string;
}

export interface BenchmarkData {
  procedureCode: string;
  procedureName: string;
  averageRate: number;
  medianRate: number;
  percentile25: number;
  percentile75: number;
  sampleSize: number;
}

export async function compareRates(
  yourRate: number,
  procedureCode: string,
  region: string
): Promise<{
  benchmark: BenchmarkData;
  variance: number;
  percentile: number;
  recommendation: string;
}> {
  // In production, this would query a real database
  const benchmark = await getBenchmarkData(procedureCode, region);
  
  const variance = ((yourRate - benchmark.averageRate) / benchmark.averageRate) * 100;
  const percentile = calculatePercentile(yourRate, benchmark);
  
  let recommendation = '';
  if (variance < -15) {
    recommendation = 'Your rate is significantly below market average. Strong negotiation opportunity.';
  } else if (variance < -5) {
    recommendation = 'Your rate is below market average. Consider requesting an increase.';
  } else if (variance > 15) {
    recommendation = 'Your rate is significantly above market average. Well negotiated.';
  } else {
    recommendation = 'Your rate is competitive with market average.';
  }
  
  return {
    benchmark,
    variance,
    percentile,
    recommendation
  };
}

async function getBenchmarkData(procedureCode: string, region: string): Promise<BenchmarkData> {
  // Mock benchmark data - in production, query real database
  const baseMockData: { [key: string]: Partial<BenchmarkData> } = {
    '92004': { // Comprehensive eye exam
      procedureName: 'Comprehensive Eye Exam',
      averageRate: 125,
      medianRate: 120,
      percentile25: 100,
      percentile75: 145,
    },
    '92014': { // Recheck exam
      procedureName: 'Recheck Eye Exam',
      averageRate: 75,
      medianRate: 70,
      percentile25: 60,
      percentile75: 85,
    },
    '92015': { // Refraction
      procedureName: 'Refraction',
      averageRate: 45,
      medianRate: 40,
      percentile25: 35,
      percentile75: 50,
    },
  };
  
  const data = baseMockData[procedureCode] || {
    procedureName: 'Unknown Procedure',
    averageRate: 100,
    medianRate: 95,
    percentile25: 80,
    percentile75: 120,
  };
  
  return {
    procedureCode,
    procedureName: data.procedureName!,
    averageRate: data.averageRate!,
    medianRate: data.medianRate!,
    percentile25: data.percentile25!,
    percentile75: data.percentile75!,
    sampleSize: 150,
  };
}

function calculatePercentile(value: number, benchmark: BenchmarkData): number {
  if (value <= benchmark.percentile25) return 25;
  if (value <= benchmark.medianRate) return 50;
  if (value <= benchmark.percentile75) return 75;
  return 90;
}

export async function calculateFairMarketValue(params: {
  procedureCode: string;
  region: string;
  specialty: string;
  volume: number;
}): Promise<number> {
  const benchmark = await getBenchmarkData(params.procedureCode, params.region);
  
  // Adjust for specialty
  let specialtyMultiplier = 1.0;
  if (params.specialty.toLowerCase().includes('retina')) {
    specialtyMultiplier = 1.15;
  } else if (params.specialty.toLowerCase().includes('glaucoma')) {
    specialtyMultiplier = 1.10;
  }
  
  // Volume discount/premium
  let volumeAdjustment = 1.0;
  if (params.volume > 1000) {
    volumeAdjustment = 0.95; // High volume = lower per-unit rate
  } else if (params.volume < 100) {
    volumeAdjustment = 1.05; // Low volume = premium rate
  }
  
  return benchmark.medianRate * specialtyMultiplier * volumeAdjustment;
}

export function generateNegotiationStrategy(currentRate: number, targetRate: number, benchmark: BenchmarkData) {
  const increase = ((targetRate - currentRate) / currentRate) * 100;
  
  return {
    proposedIncrease: increase,
    targetRate,
    justification: [
      `Current rate is ${((currentRate - benchmark.averageRate) / benchmark.averageRate * 100).toFixed(1)}% ${currentRate < benchmark.averageRate ? 'below' : 'above'} market average`,
      `Market median rate is $${benchmark.medianRate.toFixed(2)}`,
      `75th percentile rate is $${benchmark.percentile75.toFixed(2)}`,
      `Request aligns with market data from ${benchmark.sampleSize} contracts`,
    ],
    talkingPoints: [
      'Reference market data and benchmarks',
      'Highlight quality metrics and outcomes',
      'Emphasize patient satisfaction scores',
      'Discuss network adequacy and access',
    ],
    fallbackPositions: [
      `Minimum acceptable: $${(currentRate * 1.03).toFixed(2)} (3% increase)`,
      `Compromise position: $${((currentRate + targetRate) / 2).toFixed(2)}`,
      `Alternative: Performance-based incentives`,
    ]
  };
}
