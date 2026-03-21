// Practice Capability Scoring and Training Assessment System
// Comprehensive evaluation of practice capabilities and training effectiveness
import { Physician, TrainingRecord, Practice, ReputationMetric } from '@prisma/client';

// Core training and capability scoring functions
export function computeTrainingScore(records: TrainingRecord[]): number {
  // Very simple starter heuristic
  let score = 0;
  records.forEach((r) => {
    if (r.type === 'FELLOWSHIP') score += 40;
    if (r.type === 'RESIDENCY') score += 25;
    if (r.type === 'MED_SCHOOL') score += 20;
    if (r.type === 'CERTIFICATION') score += 15;
    if (r.type === 'CONTINUING_ED') score += 5;
  });
  return Math.min(score, 100);
}

export function computeCapabilityIndex(opts: {
  trainingScore: number;
  serviceCount: number;
  subspecialty?: string | null;
  yearsExperience?: number;
  boardCertified?: boolean;
}): number {
  const base = opts.trainingScore * 0.6 + Math.min(opts.serviceCount * 5, 40);
  const subspecialtyBonus = opts.subspecialty ? 10 : 0;
  const experienceBonus = opts.yearsExperience ? Math.min(opts.yearsExperience * 0.5, 10) : 0;
  const certificationBonus = opts.boardCertified ? 5 : 0;
  
  return Math.min(base + subspecialtyBonus + experienceBonus + certificationBonus, 100);
}

export interface CapabilityScore {
  id: string;
  practiceId: string;
  category: 'clinical' | 'operational' | 'financial' | 'technology' | 'patient-experience';
  subcategory: string;
  score: number;
  maxScore: number;
  percentile: number;
  benchmarkScore: number;
  lastAssessed: Date;
  assessmentDetails: AssessmentDetail[];
  improvementPlan?: ImprovementPlan;
}

export interface AssessmentDetail {
  criterion: string;
  score: number;
  maxScore: number;
  weight: number;
  evidence: string[];
  notes?: string;
  assessorId?: string;
}

export interface ImprovementPlan {
  id: string;
  capabilityId: string;
  targetScore: number;
  timeline: string;
  milestones: Milestone[];
  resources: Resource[];
  estimatedCost: number;
  expectedROI: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  dependencies?: string[];
}

export interface Resource {
  id: string;
  type: 'training' | 'technology' | 'personnel' | 'process' | 'external';
  name: string;
  description: string;
  provider?: string;
  cost: number;
  timeline: string;
  requirements?: string[];
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'online' | 'in-person' | 'hybrid' | 'self-paced';
  duration: string;
  cost: number;
  prerequisites?: string[];
  learningObjectives: string[];
  competenciesAddressed: string[];
  certificationOffered: boolean;
  provider: TrainingProvider;
}

export interface TrainingProvider {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'vendor' | 'association';
  rating: number;
  accreditation?: string[];
  specialties: string[];
}

export interface TrainingCompletion {
  id: string;
  participantId: string;
  programId: string;
  startDate: Date;
  completionDate?: Date;
  progress: number;
  score?: number;
  certificateEarned: boolean;
  feedback?: string;
  effectiveness?: number;
}

export const capabilityScoring = {
  // Assess practice capabilities across all categories
  async assessPracticeCapabilities(practiceId: string): Promise<CapabilityScore[]> {
    const capabilities: CapabilityScore[] = [
      // Clinical Excellence
      {
        id: 'clinical-1',
        practiceId,
        category: 'clinical',
        subcategory: 'Patient Care Quality',
        score: 85,
        maxScore: 100,
        percentile: 78,
        benchmarkScore: 82,
        lastAssessed: new Date(),
        assessmentDetails: [
          {
            criterion: 'Patient Satisfaction Scores',
            score: 90,
            maxScore: 100,
            weight: 0.3,
            evidence: ['CAHPS scores', 'Internal surveys', 'Online reviews']
          },
          {
            criterion: 'Clinical Outcomes',
            score: 85,
            maxScore: 100,
            weight: 0.4,
            evidence: ['Complication rates', 'Treatment success rates', 'Follow-up compliance']
          },
          {
            criterion: 'Evidence-Based Practices',
            score: 80,
            maxScore: 100,
            weight: 0.3,
            evidence: ['Protocol adherence', 'Continuing education', 'Research participation']
          }
        ]
      },
      // Operational Efficiency
      {
        id: 'operational-1',
        practiceId,
        category: 'operational',
        subcategory: 'Workflow Optimization',
        score: 72,
        maxScore: 100,
        percentile: 65,
        benchmarkScore: 75,
        lastAssessed: new Date(),
        assessmentDetails: [
          {
            criterion: 'Appointment Scheduling',
            score: 75,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Wait times', 'Utilization rates', 'No-show rates']
          },
          {
            criterion: 'Patient Flow',
            score: 70,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Throughput metrics', 'Bottleneck analysis', 'Staff efficiency']
          },
          {
            criterion: 'Resource Utilization',
            score: 68,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Equipment usage', 'Staff productivity', 'Space optimization']
          },
          {
            criterion: 'Process Standardization',
            score: 75,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Protocol compliance', 'Quality control', 'Error rates']
          }
        ]
      },
      // Financial Performance
      {
        id: 'financial-1',
        practiceId,
        category: 'financial',
        subcategory: 'Revenue Optimization',
        score: 68,
        maxScore: 100,
        percentile: 55,
        benchmarkScore: 73,
        lastAssessed: new Date(),
        assessmentDetails: [
          {
            criterion: 'Billing Accuracy',
            score: 72,
            maxScore: 100,
            weight: 0.3,
            evidence: ['Clean claim rates', 'Denial rates', 'Appeals success']
          },
          {
            criterion: 'Collection Efficiency',
            score: 65,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Collection rates', 'Days in AR', 'Bad debt percentage']
          },
          {
            criterion: 'Payer Contract Management',
            score: 60,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Contract rates vs market', 'Negotiation success', 'Network participation']
          },
          {
            criterion: 'Cost Management',
            score: 75,
            maxScore: 100,
            weight: 0.2,
            evidence: ['Cost per procedure', 'Overhead ratios', 'Vendor management']
          }
        ]
      },
      // Technology Integration
      {
        id: 'technology-1',
        practiceId,
        category: 'technology',
        subcategory: 'Digital Health',
        score: 91,
        maxScore: 100,
        percentile: 85,
        benchmarkScore: 78,
        lastAssessed: new Date(),
        assessmentDetails: [
          {
            criterion: 'EHR Optimization',
            score: 95,
            maxScore: 100,
            weight: 0.3,
            evidence: ['System utilization', 'Meaningful use compliance', 'Interoperability']
          },
          {
            criterion: 'Patient Portal Usage',
            score: 88,
            maxScore: 100,
            weight: 0.2,
            evidence: ['Adoption rates', 'Feature utilization', 'Patient engagement']
          },
          {
            criterion: 'Telehealth Capabilities',
            score: 92,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Platform functionality', 'Usage rates', 'Patient satisfaction']
          },
          {
            criterion: 'Data Analytics',
            score: 90,
            maxScore: 100,
            weight: 0.25,
            evidence: ['Reporting capabilities', 'Performance monitoring', 'Predictive analytics']
          }
        ]
      }
    ];

    // Add improvement plans for capabilities below benchmark
    capabilities.forEach(capability => {
      if (capability.score < capability.benchmarkScore) {
        capability.improvementPlan = this.generateImprovementPlan(capability);
      }
    });

    return capabilities;
  },

  // Generate improvement plan for underperforming capability
  generateImprovementPlan(capability: CapabilityScore): ImprovementPlan {
    const gap = capability.benchmarkScore - capability.score;
    const targetScore = Math.min(capability.maxScore, capability.benchmarkScore + 5);

    const milestones: Milestone[] = [];
    const resources: Resource[] = [];

    // Generate category-specific improvement recommendations
    switch (capability.category) {
      case 'operational':
        milestones.push(
          {
            id: 'op-1',
            title: 'Workflow Assessment',
            description: 'Complete comprehensive workflow analysis',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'not-started'
          },
          {
            id: 'op-2',
            title: 'Process Optimization',
            description: 'Implement identified workflow improvements',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'not-started'
          }
        );
        resources.push(
          {
            id: 'op-res-1',
            type: 'training',
            name: 'Lean Healthcare Methodology Training',
            description: 'Staff training on process improvement techniques',
            cost: 5000,
            timeline: '2 weeks'
          },
          {
            id: 'op-res-2',
            type: 'external',
            name: 'Workflow Consultant',
            description: 'Expert consultation on operational optimization',
            cost: 15000,
            timeline: '6 weeks'
          }
        );
        break;

      case 'financial':
        milestones.push(
          {
            id: 'fin-1',
            title: 'Billing System Audit',
            description: 'Comprehensive review of billing processes',
            targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            status: 'not-started'
          },
          {
            id: 'fin-2',
            title: 'Staff Training Implementation',
            description: 'Deploy billing accuracy training program',
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'not-started'
          }
        );
        resources.push(
          {
            id: 'fin-res-1',
            type: 'training',
            name: 'Medical Billing Certification',
            description: 'Advanced billing and coding training for staff',
            cost: 3000,
            timeline: '4 weeks'
          }
        );
        break;

      default:
        milestones.push(
          {
            id: 'gen-1',
            title: 'Performance Review',
            description: 'Detailed analysis of current performance',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'not-started'
          }
        );
    }

    const estimatedCost = resources.reduce((total, resource) => total + resource.cost, 0);
    const expectedROI = this.calculateROI(capability, gap, estimatedCost);

    return {
      id: `improvement-${capability.id}`,
      capabilityId: capability.id,
      targetScore,
      timeline: '3-6 months',
      milestones,
      resources,
      estimatedCost,
      expectedROI
    };
  },

  // Calculate ROI for improvement plan
  calculateROI(capability: CapabilityScore, gap: number, cost: number): number {
    // ROI calculation based on capability category
    const impactMultipliers = {
      clinical: 2.5,    // Patient satisfaction, outcomes
      operational: 3.0, // Efficiency gains
      financial: 4.0,   // Direct revenue impact
      technology: 2.0,  // Long-term efficiency
      'patient-experience': 2.2
    };

    const multiplier = impactMultipliers[capability.category] || 2.0;
    const potentialGain = gap * multiplier * 1000; // Estimated annual benefit per point
    
    return cost > 0 ? (potentialGain / cost) * 100 : 0;
  },

  // Get training programs for specific capability gaps
  async getTrainingPrograms(capabilityCategory: string): Promise<TrainingProgram[]> {
    const programs: Record<string, TrainingProgram[]> = {
      clinical: [
        {
          id: 'clinical-1',
          title: 'Patient-Centered Care Excellence',
          description: 'Comprehensive training on patient engagement and satisfaction',
          category: 'Clinical Excellence',
          level: 'intermediate',
          format: 'hybrid',
          duration: '16 hours',
          cost: 2500,
          learningObjectives: [
            'Improve patient communication skills',
            'Enhance care coordination',
            'Implement patient feedback systems'
          ],
          competenciesAddressed: ['communication', 'empathy', 'care coordination'],
          certificationOffered: true,
          provider: {
            id: 'provider-1',
            name: 'Healthcare Quality Institute',
            type: 'external',
            rating: 4.8,
            specialties: ['patient experience', 'quality improvement']
          }
        }
      ],
      operational: [
        {
          id: 'operational-1',
          title: 'Lean Healthcare Implementation',
          description: 'Process improvement methodologies for healthcare practices',
          category: 'Operations',
          level: 'intermediate',
          format: 'in-person',
          duration: '24 hours',
          cost: 3500,
          learningObjectives: [
            'Identify process inefficiencies',
            'Implement lean methodologies',
            'Measure improvement outcomes'
          ],
          competenciesAddressed: ['process improvement', 'workflow analysis', 'change management'],
          certificationOffered: true,
          provider: {
            id: 'provider-2',
            name: 'Operational Excellence Partners',
            type: 'external',
            rating: 4.6,
            specialties: ['lean healthcare', 'process optimization']
          }
        }
      ],
      financial: [
        {
          id: 'financial-1',
          title: 'Advanced Revenue Cycle Management',
          description: 'Optimize billing, collections, and financial performance',
          category: 'Financial Management',
          level: 'advanced',
          format: 'online',
          duration: '20 hours',
          cost: 1800,
          learningObjectives: [
            'Improve billing accuracy',
            'Reduce claim denials',
            'Optimize collection processes'
          ],
          competenciesAddressed: ['billing', 'coding', 'financial analysis'],
          certificationOffered: true,
          provider: {
            id: 'provider-3',
            name: 'Medical Financial Institute',
            type: 'external',
            rating: 4.9,
            specialties: ['revenue cycle', 'medical billing']
          }
        }
      ]
    };

    return programs[capabilityCategory] || [];
  },

  // Track training effectiveness
  async assessTrainingEffectiveness(
    trainingId: string,
    practiceId: string,
    preTrainingScore: number,
    postTrainingScore: number
  ): Promise<{
    effectiveness: number;
    improvement: number;
    roi: number;
    recommendations: string[];
  }> {
    const improvement = postTrainingScore - preTrainingScore;
    const effectiveness = Math.min(100, (improvement / 20) * 100); // Max 20 point improvement expected
    
    // Calculate ROI based on score improvement
    const annualValuePerPoint = 1500; // Estimated annual value per capability point
    const trainingCost = 2500; // Average training cost
    const roi = (improvement * annualValuePerPoint / trainingCost) * 100;

    let recommendations: string[] = [];
    
    if (effectiveness < 50) {
      recommendations.push('Consider additional reinforcement training');
      recommendations.push('Review training materials and methodology');
      recommendations.push('Provide more hands-on practice opportunities');
    } else if (effectiveness < 75) {
      recommendations.push('Implement peer mentoring program');
      recommendations.push('Schedule follow-up refresher sessions');
    } else {
      recommendations.push('Maintain current training approach');
      recommendations.push('Consider staff as internal trainers');
    }

    return {
      effectiveness,
      improvement,
      roi,
      recommendations
    };
  },

  // Generate capability benchmarks
  async generateCapabilityBenchmarks(specialty: string, region: string): Promise<{
    [category: string]: {
      average: number;
      topQuartile: number;
      topDecile: number;
      sampleSize: number;
    }
  }> {
    // Simulated benchmark data
    return {
      clinical: {
        average: 82,
        topQuartile: 88,
        topDecile: 93,
        sampleSize: 245
      },
      operational: {
        average: 75,
        topQuartile: 82,
        topDecile: 89,
        sampleSize: 245
      },
      financial: {
        average: 73,
        topQuartile: 80,
        topDecile: 87,
        sampleSize: 245
      },
      technology: {
        average: 78,
        topQuartile: 85,
        topDecile: 91,
        sampleSize: 245
      }
    };
  }
};

// Advanced scoring functions for market intelligence
export function computePhysicianScore(physician: Physician & {
  trainingRecords: TrainingRecord[];
  practice?: Practice | null;
}): number {
  const trainingScore = computeTrainingScore(physician.trainingRecords);
  
  // Calculate years of experience
  const yearsExperience = physician.graduationYear 
    ? new Date().getFullYear() - physician.graduationYear 
    : 0;

  // Service count approximation (replace with actual service data when available)
  const estimatedServiceCount = physician.subspecialty ? 8 : 5;

  return computeCapabilityIndex({
    trainingScore,
    serviceCount: estimatedServiceCount,
    subspecialty: physician.subspecialty,
    yearsExperience,
    boardCertified: physician.boardCertified
  });
}

// Practice-level scoring algorithms
export interface PracticeScoreComponents {
  physicianQuality: number;
  reputationScore: number;
  operationalEfficiency: number;
  marketPosition: number;
  overallScore: number;
}

export function computePracticeScore(practice: Practice & {
  physicians: Array<{
    physician: Physician & { trainingRecords: TrainingRecord[] };
  }>;
  reputationMetrics?: ReputationMetric[];
}): PracticeScoreComponents {
  // Physician Quality Score (40% weight)
  const physicianScores = practice.physicians.map(pp => 
    computePhysicianScore(pp.physician)
  );
  const physicianQuality = physicianScores.length > 0 
    ? physicianScores.reduce((sum, score) => sum + score, 0) / physicianScores.length 
    : 50;

  // Reputation Score (30% weight)
  const reputationScore = computeReputationScore(practice.reputationMetrics || []);

  // Operational Efficiency Score (20% weight) - based on practice metrics
  const operationalEfficiency = computeOperationalScore(practice);

  // Market Position Score (10% weight) - based on geographic and competitive factors
  const marketPosition = computeMarketPositionScore(practice);

  // Weighted overall score
  const overallScore = (
    physicianQuality * 0.4 +
    reputationScore * 0.3 +
    operationalEfficiency * 0.2 +
    marketPosition * 0.1
  );

  return {
    physicianQuality: Math.round(physicianQuality),
    reputationScore: Math.round(reputationScore),
    operationalEfficiency: Math.round(operationalEfficiency),
    marketPosition: Math.round(marketPosition),
    overallScore: Math.round(overallScore)
  };
}

// Reputation scoring based on online reviews and ratings
export function computeReputationScore(metrics: ReputationMetric[]): number {
  if (metrics.length === 0) return 75; // Default neutral score

  // Group metrics by source and get latest for each
  const latestMetrics = new Map<string, ReputationMetric>();
  metrics.forEach(metric => {
    const existing = latestMetrics.get(metric.source);
    if (!existing || metric.capturedAt > existing.capturedAt) {
      latestMetrics.set(metric.source, metric);
    }
  });

  // Weight different sources
  const sourceWeights: Record<string, number> = {
    'Google Reviews': 0.4,
    'Healthgrades': 0.3,
    'Yelp': 0.2,
    'Vitals': 0.1
  };

  let weightedScore = 0;
  let totalWeight = 0;

  latestMetrics.forEach((metric, source) => {
    const weight = sourceWeights[source] || 0.1;
    const normalizedScore = (metric.value / 5) * 100; // Normalize to 0-100 scale
    
    // Apply review count bonus
    const reviewBonus = Math.min((metric.reviewCount || 0) / 100, 0.1);
    const adjustedScore = normalizedScore + (reviewBonus * 10);
    
    weightedScore += adjustedScore * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.min(weightedScore / totalWeight, 100) : 75;
}

// Operational efficiency scoring
function computeOperationalScore(practice: Practice): number {
  let score = 70; // Base operational score

  // Location factors
  if (practice.lat && practice.lng) score += 5; // Has proper location data
  
  // Practice size indicators
  if (practice.phone) score += 3;
  if (practice.website) score += 5;
  
  // Geographic market factors (mock - replace with real data)
  const isUrbanMarket = practice.city && ['New York', 'Los Angeles', 'Chicago', 'Houston'].includes(practice.city);
  if (isUrbanMarket) score += 7;

  return Math.min(score, 100);
}

// Market position scoring
function computeMarketPositionScore(practice: Practice): number {
  let score = 60; // Base market position

  // State-level market factors
  const strongMarkets = ['CA', 'NY', 'TX', 'FL', 'IL'];
  if (strongMarkets.includes(practice.state)) score += 15;

  // Urban vs rural positioning
  const majorCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  if (practice.city && majorCities.includes(practice.city)) {
    score += 10; // Urban market advantage
  }

  // ZIP code analysis (basic implementation)
  if (practice.zip) {
    const zipNum = parseInt(practice.zip);
    // Affluent area ZIP patterns (very simplified)
    if (zipNum >= 90210 && zipNum <= 90299) score += 10; // Beverly Hills area example
    if (zipNum >= 10001 && zipNum <= 10099) score += 10; // Manhattan area example
  }

  return Math.min(score, 100);
}

// Competitive analysis scoring
export interface CompetitiveAnalysis {
  marketShare: number;
  competitiveStrength: number;
  threats: string[];
  opportunities: string[];
  strategicPosition: 'dominant' | 'strong' | 'average' | 'weak' | 'struggling';
}

export function computeCompetitiveAnalysis(
  targetPractice: Practice,
  competitors: Practice[],
  targetScore: PracticeScoreComponents
): CompetitiveAnalysis {
  // Calculate market share approximation
  const totalCompetitors = competitors.length + 1; // Include target practice
  const marketShare = Math.max(5, Math.min(35, 100 / totalCompetitors + (targetScore.overallScore - 70) * 0.3));

  // Competitive strength relative to market
  const avgCompetitorScore = competitors.length > 0 ? 70 : 70; // Mock competitor average
  const competitiveStrength = Math.max(0, Math.min(100, 
    50 + (targetScore.overallScore - avgCompetitorScore) * 2
  ));

  // Determine strategic position
  let strategicPosition: CompetitiveAnalysis['strategicPosition'];
  if (competitiveStrength >= 85) strategicPosition = 'dominant';
  else if (competitiveStrength >= 70) strategicPosition = 'strong';
  else if (competitiveStrength >= 50) strategicPosition = 'average';
  else if (competitiveStrength >= 30) strategicPosition = 'weak';
  else strategicPosition = 'struggling';

  // Generate insights based on scores
  const threats: string[] = [];
  const opportunities: string[] = [];

  if (targetScore.reputationScore < 80) {
    threats.push('Below-average online reputation scores');
    opportunities.push('Implement patient experience improvement program');
  }

  if (targetScore.physicianQuality < 75) {
    threats.push('Physician capability gap vs. market leaders');
    opportunities.push('Recruit subspecialty-trained physicians');
  }

  if (targetScore.operationalEfficiency < 70) {
    threats.push('Operational inefficiencies affecting patient care');
    opportunities.push('Invest in practice management technology');
  }

  if (marketShare < 15) {
    opportunities.push('Significant market share growth potential');
  }

  if (competitiveStrength > 70) {
    opportunities.push('Leverage competitive advantages for expansion');
  }

  return {
    marketShare: Math.round(marketShare),
    competitiveStrength: Math.round(competitiveStrength),
    threats,
    opportunities,
    strategicPosition
  };
}

export default capabilityScoring;
