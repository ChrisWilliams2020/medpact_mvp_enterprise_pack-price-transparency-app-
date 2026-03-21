import { supabase } from '@/lib/db/supabase';

export interface PredictionResult {
  contractRenewalProbability: number;
  predictedRevenue: number;
  riskFactors: string[];
  recommendations: string[];
  confidenceScore: number;
}

export class PredictionEngine {
  static async predictContractRenewal(contractId: string): Promise<PredictionResult> {
    // Fetch historical data
    const { data: contract } = await supabase
      .from('contracts')
      .select('*, practice:practices(*)')
      .eq('id', contractId)
      .single();

    if (!contract) throw new Error('Contract not found');

    // Simulate ML model predictions (in production, call actual ML API)
    const features = {
      contractDuration: this.calculateDuration(contract.start_date, contract.end_date),
      practiceRating: contract.practice.ratings?.average || 0,
      referralVolume: await this.getReferralVolume(contract.practice_id),
      paymentHistory: await this.getPaymentHistory(contract.organization_id),
      marketTrends: await this.getMarketTrends(contract.practice.specialty),
    };

    // ML Model scoring (simplified)
    let score = 0;
    score += features.practiceRating * 0.15;
    score += (features.referralVolume / 100) * 0.25;
    score += features.paymentHistory * 0.20;
    score += features.marketTrends * 0.40;

    const renewalProbability = Math.min(Math.max(score, 0), 1);

    // Generate risk factors and recommendations
    const riskFactors = [];
    const recommendations = [];

    if (features.practiceRating < 4.0) {
      riskFactors.push('Practice rating below industry average');
      recommendations.push('Consider practice improvement initiatives');
    }

    if (features.referralVolume < 50) {
      riskFactors.push('Low referral network engagement');
      recommendations.push('Expand referral partnerships');
    }

    if (renewalProbability < 0.7) {
      recommendations.push('Schedule early renewal discussion');
      recommendations.push('Review and enhance contract terms');
    }

    // Revenue prediction based on historical trends
    const predictedRevenue = contract.value * (1 + (renewalProbability * 0.15));

    return {
      contractRenewalProbability: renewalProbability,
      predictedRevenue,
      riskFactors,
      recommendations,
      confidenceScore: 0.85
    };
  }

  private static calculateDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  }

  private static async getReferralVolume(practiceId: string): Promise<number> {
    const { data } = await supabase
      .from('referral_network')
      .select('referral_count')
      .or(`from_practice_id.eq.${practiceId},to_practice_id.eq.${practiceId}`);

    return data?.reduce((sum, r) => sum + r.referral_count, 0) || 0;
  }

  private static async getPaymentHistory(orgId: string): Promise<number> {
    const { data } = await supabase
      .from('payment_subscriptions')
      .select('status')
      .eq('organization_id', orgId)
      .single();

    return data?.status === 'active' ? 1 : 0.5;
  }

  private static async getMarketTrends(specialty: string): Promise<number> {
    // Simulate market trend analysis
    const trends: Record<string, number> = {
      'Ophthalmology': 0.85,
      'Optometry': 0.75,
      'Cardiology': 0.90,
      'Dermatology': 0.80,
    };

    return trends[specialty] || 0.70;
  }

  static async predictPatientVolume(practiceId: string, months: number = 6): Promise<number[]> {
    // Time series prediction using historical data
    const { data: historical } = await supabase
      .from('practice_analytics')
      .select('patient_count, month')
      .eq('practice_id', practiceId)
      .order('month', { ascending: false })
      .limit(12);

    if (!historical || historical.length === 0) {
      return Array(months).fill(0);
    }

    // Simple linear regression prediction
    const values = historical.map(h => h.patient_count);
    const trend = (values[0] - values[values.length - 1]) / values.length;

    const predictions = [];
    let lastValue = values[0];
    for (let i = 0; i < months; i++) {
      lastValue += trend;
      predictions.push(Math.max(0, Math.round(lastValue)));
    }

    return predictions;
  }
}