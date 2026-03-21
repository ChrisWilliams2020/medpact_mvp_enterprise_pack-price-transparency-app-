// lib/analytics-service.ts
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit: string;
  category: 'market' | 'performance' | 'competitive' | 'financial';
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface MarketSegmentData {
  segment: string;
  value: number;
  percentage: number;
  growth: number;
  color: string;
}

export interface CompetitiveAnalysis {
  practice: string;
  marketShare: number;
  physicianCount: number;
  patientVolume: number;
  averageRating: number;
  growthRate: number;
  threat_level: 'Low' | 'Medium' | 'High';
}

export interface PredictiveInsight {
  id: string;
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: 'Low' | 'Medium' | 'High';
  category: string;
  recommendations: string[];
}

export class HealthcareAnalyticsService {
  private baseMetrics: AnalyticsMetric[] = [
    {
      id: 'total_market_size',
      name: 'Total Market Size',
      value: 125000000,
      previousValue: 118000000,
      change: 5.9,
      changeType: 'increase',
      unit: '$',
      category: 'market'
    },
    {
      id: 'practice_density',
      name: 'Practice Density',
      value: 2.8,
      previousValue: 2.6,
      change: 7.7,
      changeType: 'increase',
      unit: 'per 1k population',
      category: 'market'
    },
    {
      id: 'avg_physician_utilization',
      name: 'Physician Utilization',
      value: 87.4,
      previousValue: 84.2,
      change: 3.8,
      changeType: 'increase',
      unit: '%',
      category: 'performance'
    },
    {
      id: 'patient_satisfaction',
      name: 'Patient Satisfaction',
      value: 4.6,
      previousValue: 4.4,
      change: 4.5,
      changeType: 'increase',
      unit: '★',
      category: 'performance'
    },
    {
      id: 'market_concentration',
      name: 'Market Concentration',
      value: 68.2,
      previousValue: 71.8,
      change: -5.0,
      changeType: 'decrease',
      unit: '%',
      category: 'competitive'
    },
    {
      id: 'revenue_per_physician',
      name: 'Revenue per Physician',
      value: 750000,
      previousValue: 720000,
      change: 4.2,
      changeType: 'increase',
      unit: '$',
      category: 'financial'
    }
  ];

  async getKeyMetrics(): Promise<AnalyticsMetric[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.baseMetrics;
  }

  async getMarketTrends(period: '7d' | '30d' | '90d' | '1y'): Promise<TimeSeriesData[]> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const data: TimeSeriesData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic healthcare market data
      const baseValue = 100;
      const trend = (days - i) / days * 15; // 15% growth over period
      const noise = Math.random() * 10 - 5; // ±5% random variation
      const seasonal = Math.sin((days - i) / 30 * Math.PI) * 3; // Seasonal variation
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round((baseValue + trend + noise + seasonal) * 100) / 100
      });
    }
    
    return data;
  }

  async getMarketSegmentation(): Promise<MarketSegmentData[]> {
    return [
      {
        segment: 'Independent Practices',
        value: 42,
        percentage: 42,
        growth: 2.3,
        color: '#3B82F6'
      },
      {
        segment: 'Hospital-Owned',
        value: 35,
        percentage: 35,
        growth: 8.1,
        color: '#10B981'
      },
      {
        segment: 'Private Equity',
        value: 18,
        percentage: 18,
        growth: 15.7,
        color: '#F59E0B'
      },
      {
        segment: 'Academic Medical Centers',
        value: 5,
        percentage: 5,
        growth: -1.2,
        color: '#EF4444'
      }
    ];
  }

  async getCompetitiveAnalysis(): Promise<CompetitiveAnalysis[]> {
    return [
      {
        practice: 'Silicon Valley Ophthalmology',
        marketShare: 28.5,
        physicianCount: 22,
        patientVolume: 15420,
        averageRating: 4.9,
        growthRate: 12.4,
        threat_level: 'High'
      },
      {
        practice: 'Bay Area Vision Partners',
        marketShare: 22.8,
        physicianCount: 18,
        patientVolume: 12800,
        averageRating: 4.6,
        growthRate: 8.7,
        threat_level: 'High'
      },
      {
        practice: 'Central Valley Eye Institute',
        marketShare: 15.2,
        physicianCount: 12,
        patientVolume: 9650,
        averageRating: 4.8,
        growthRate: 5.3,
        threat_level: 'Medium'
      },
      {
        practice: 'Sacramento Eye Specialists',
        marketShare: 12.3,
        physicianCount: 8,
        patientVolume: 7890,
        averageRating: 4.5,
        growthRate: 3.1,
        threat_level: 'Medium'
      },
      {
        practice: 'Modesto Regional Eye Care',
        marketShare: 8.1,
        physicianCount: 6,
        patientVolume: 5200,
        averageRating: 4.4,
        growthRate: 1.8,
        threat_level: 'Low'
      }
    ];
  }

  async getPredictiveInsights(): Promise<PredictiveInsight[]> {
    return [
      {
        id: 'market_consolidation',
        title: 'Market Consolidation Acceleration',
        prediction: 'Private equity acquisitions will increase by 35% in the next 18 months',
        confidence: 87,
        timeframe: '18 months',
        impact: 'High',
        category: 'Market Dynamics',
        recommendations: [
          'Monitor PE acquisition targets',
          'Strengthen competitive positioning',
          'Consider strategic partnerships'
        ]
      },
      {
        id: 'physician_shortage',
        title: 'Specialized Physician Shortage',
        prediction: 'Retina specialist shortage will reach critical levels by Q4 2024',
        confidence: 92,
        timeframe: '12 months',
        impact: 'High',
        category: 'Workforce',
        recommendations: [
          'Accelerate recruitment efforts',
          'Implement retention programs',
          'Explore telemedicine solutions'
        ]
      },
      {
        id: 'patient_volume',
        title: 'Patient Volume Growth',
        prediction: 'Cataract surgery demand will grow 15% annually due to aging population',
        confidence: 94,
        timeframe: '5 years',
        impact: 'Medium',
        category: 'Demographics',
        recommendations: [
          'Expand surgical capacity',
          'Invest in advanced technology',
          'Develop age-focused marketing'
        ]
      },
      {
        id: 'reimbursement_changes',
        title: 'Reimbursement Model Shift',
        prediction: 'Value-based care contracts will represent 60% of revenue by 2026',
        confidence: 78,
        timeframe: '24 months',
        impact: 'High',
        category: 'Financial',
        recommendations: [
          'Implement quality metrics tracking',
          'Negotiate value-based contracts',
          'Invest in care coordination'
        ]
      }
    ];
  }

  async getPhysicianPerformanceMetrics(): Promise<any[]> {
    return [
      {
        name: 'Dr. Sarah Chen',
        specialty: 'Retina',
        patientVolume: 1250,
        surgicalCases: 420,
        patientSatisfaction: 4.9,
        revenue: 980000,
        efficiency: 94
      },
      {
        name: 'Dr. Michael Rodriguez',
        specialty: 'Cornea',
        patientVolume: 1100,
        surgicalCases: 380,
        patientSatisfaction: 4.7,
        revenue: 850000,
        efficiency: 91
      },
      {
        name: 'Dr. Emily Johnson',
        specialty: 'Glaucoma',
        patientVolume: 980,
        surgicalCases: 180,
        patientSatisfaction: 4.8,
        revenue: 720000,
        efficiency: 89
      }
    ];
  }

  async getPatientFlowAnalytics(): Promise<any> {
    return {
      averageWaitTime: 12.5,
      appointmentUtilization: 87.3,
      noShowRate: 8.2,
      patientThroughput: 45.7,
      bottlenecks: [
        'Pre-surgical consultation scheduling',
        'Insurance authorization delays',
        'Diagnostic equipment availability'
      ]
    };
  }

  async getFinancialMetrics(): Promise<any> {
    return {
      totalRevenue: 15800000,
      operatingMargin: 24.5,
      collectionRate: 96.2,
      averageReimbursement: 1250,
      payerMix: [
        { payer: 'Commercial Insurance', percentage: 45, reimbursement: 1450 },
        { payer: 'Medicare', percentage: 35, reimbursement: 980 },
        { payer: 'Medicaid', percentage: 12, reimbursement: 750 },
        { payer: 'Self Pay', percentage: 8, reimbursement: 1800 }
      ]
    };
  }
}

export const analyticsService = new HealthcareAnalyticsService();