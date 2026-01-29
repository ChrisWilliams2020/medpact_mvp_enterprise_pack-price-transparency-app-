// Negotiation Strategy Generator and Payer Intelligence
// Tools for creating customized negotiation playbooks
import { prisma } from '../db';
import { computeTrainingScore, computePhysicianScore, computePracticeScore } from './scoring';

// Core negotiation playbook builder from user specification
export async function buildNegotiationPlaybook(practiceId: string) {
  const practice = await prisma.practice.findUnique({
    where: { id: practiceId },
    include: {
      physicians: {
        include: {
          physician: {
            include: {
              trainingRecords: true,
              services: { include: { service: true } },
              ratings: true,
            },
          },
        },
      },
      ratings: true,
      markets: { include: { market: true } },
    },
  });

  if (!practice) throw new Error('Practice not found');

  // Simple derived values; you can enrich this later
  const physicianCount = practice.physicians.length;
  const avgPracticeStars =
    practice.ratings.length > 0
      ? practice.ratings.reduce((s, r) => s + r.stars, 0) / practice.ratings.length
      : null;

  const subspecialties = new Set<string>();
  practice.physicians.forEach((pp) => {
    if (pp.physician.subspecialty) subspecialties.add(pp.physician.subspecialty);
  });

  const services = new Set<string>();
  practice.physicians.forEach((pp) =>
    pp.physician.services.forEach((ps) => services.add(ps.service.canonicalName))
  );

  const summary = `
${practice.name} provides ${physicianCount} physicians spanning ${
    subspecialties.size
  } subspecialties and ${services.size} key service lines${
    avgPracticeStars ? `, with an average rating of ${avgPracticeStars.toFixed(2)} stars.` : '.'
  }
This positions the practice as a high-value partner for access and capability in its local market.
`.trim();

  const details = {
    physicians: physicianCount,
    subspecialties: Array.from(subspecialties),
    services: Array.from(services),
    avgStars: avgPracticeStars,
  };

  return {
    title: `${practice.name} – Payer Negotiation Brief`,
    summary,
    detailsJson: details,
  };
}

export interface NegotiationPlaybook {
  id: string;
  payerName: string;
  contractType: string;
  currentRate: number;
  marketRate: number;
  benchmarkData: BenchmarkData;
  strategies: NegotiationStrategy[];
  timeline: NegotiationTimeline;
  riskFactors: RiskFactor[];
  successProbability: number;
  expectedOutcome: {
    bestCase: number;
    worstCase: number;
    mostLikely: number;
  };
}

export interface BenchmarkData {
  regionalAverage: number;
  topQuartile: number;
  bottomQuartile: number;
  competitorRates: Array<{
    practiceId: string;
    practiceName: string;
    rate: number;
    marketShare: number;
  }>;
  industryTrends: {
    yearOverYearChange: number;
    projectedGrowth: number;
    marketFactors: string[];
  };
}

export interface NegotiationStrategy {
  id: string;
  title: string;
  description: string;
  category: 'preparation' | 'positioning' | 'execution' | 'closing';
  effectiveness: number;
  difficulty: 'low' | 'medium' | 'high';
  requirements: string[];
  timeline: string;
  keyTalkingPoints: string[];
  supportingData: string[];
}

export interface NegotiationTimeline {
  preparation: {
    duration: string;
    milestones: string[];
    deadline: Date;
  };
  execution: {
    phases: Array<{
      name: string;
      duration: string;
      objectives: string[];
      deliverables: string[];
    }>;
  };
  followUp: {
    checkpoints: Array<{
      date: Date;
      purpose: string;
      action: string;
    }>;
  };
}

export interface RiskFactor {
  id: string;
  factor: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  mitigation: string[];
}

export const negotiationStrategies = {
  // Generate custom playbook for specific payer and contract
  async generatePlaybook(
    payerName: string,
    contractType: string,
    currentRate: number,
    practiceData: {
      revenue: number;
      patientVolume: number;
      qualityMetrics: any;
      competitiveRating: number;
    }
  ): Promise<NegotiationPlaybook> {
    const marketRate = await this.getMarketRate(contractType);
    const benchmarkData = await this.getBenchmarkData(contractType);
    const strategies = await this.getRecommendedStrategies(payerName, contractType, currentRate, marketRate);
    const timeline = this.generateTimeline(payerName);
    const riskFactors = this.assessRiskFactors(payerName, contractType);
    const successProbability = this.calculateSuccessProbability(currentRate, marketRate, practiceData);

    return {
      id: `playbook-${Date.now()}`,
      payerName,
      contractType,
      currentRate,
      marketRate,
      benchmarkData,
      strategies,
      timeline,
      riskFactors,
      successProbability,
      expectedOutcome: {
        bestCase: marketRate * 1.05,
        worstCase: currentRate * 1.02,
        mostLikely: currentRate + (marketRate - currentRate) * 0.7
      }
    };
  },

  // Get market rate for specific contract type
  async getMarketRate(contractType: string): Promise<number> {
    const rateMap: Record<string, number> = {
      'Vision Care': 142.00,
      'Comprehensive Eye Exam': 95.50,
      'Specialty Procedures': 285.00,
      'Diagnostic Testing': 165.75,
      'Surgical Procedures': 425.00
    };

    return rateMap[contractType] || 100.00;
  },

  // Get benchmark data for contract type
  async getBenchmarkData(contractType: string): Promise<BenchmarkData> {
    // Simulated benchmark data
    const baseRate = await this.getMarketRate(contractType);
    
    return {
      regionalAverage: baseRate,
      topQuartile: baseRate * 1.15,
      bottomQuartile: baseRate * 0.85,
      competitorRates: [
        { practiceId: '1', practiceName: 'Elite Vision', rate: baseRate * 1.1, marketShare: 0.25 },
        { practiceId: '2', practiceName: 'City Eye Care', rate: baseRate * 0.95, marketShare: 0.18 },
        { practiceId: '3', practiceName: 'Premier Ophthalmology', rate: baseRate * 1.05, marketShare: 0.22 }
      ],
      industryTrends: {
        yearOverYearChange: 0.034,
        projectedGrowth: 0.028,
        marketFactors: [
          'Increased demand for preventive care',
          'Technology adoption driving efficiency',
          'Value-based care initiatives'
        ]
      }
    };
  },

  // Get recommended strategies based on payer and contract
  async getRecommendedStrategies(
    payerName: string,
    contractType: string,
    currentRate: number,
    marketRate: number
  ): Promise<NegotiationStrategy[]> {
    const gapPercentage = ((marketRate - currentRate) / currentRate) * 100;

    const strategies: NegotiationStrategy[] = [
      {
        id: 'market-analysis',
        title: 'Market Rate Analysis',
        description: 'Present comprehensive market rate analysis with regional benchmarks',
        category: 'preparation',
        effectiveness: 85,
        difficulty: 'medium',
        requirements: [
          'Regional rate survey data',
          'Competitor contract information',
          'Industry trend analysis'
        ],
        timeline: '2-3 weeks before negotiation',
        keyTalkingPoints: [
          `Current rate is ${gapPercentage.toFixed(1)}% below market average`,
          'Regional competitors receiving higher rates for similar services',
          'Industry trends supporting rate increases'
        ],
        supportingData: [
          'Market rate survey results',
          'Competitor rate comparisons',
          'Industry growth projections'
        ]
      },
      {
        id: 'value-proposition',
        title: 'Quality & Value Demonstration',
        description: 'Highlight practice quality metrics and patient outcomes',
        category: 'positioning',
        effectiveness: 78,
        difficulty: 'medium',
        requirements: [
          'Patient satisfaction scores',
          'Quality metrics data',
          'Outcome measurements'
        ],
        timeline: '1-2 weeks preparation',
        keyTalkingPoints: [
          'Superior patient satisfaction scores',
          'Better than average clinical outcomes',
          'Cost-effective care delivery'
        ],
        supportingData: [
          'CAHPS scores',
          'Clinical outcome data',
          'Cost per episode metrics'
        ]
      }
    ];

    if (gapPercentage > 10) {
      strategies.push({
        id: 'competitive-leverage',
        title: 'Competitive Leverage Strategy',
        description: 'Use alternative payer offers to strengthen position',
        category: 'execution',
        effectiveness: 92,
        difficulty: 'high',
        requirements: [
          'Alternative payer contracts',
          'Legal review of exclusivity clauses',
          'Risk assessment'
        ],
        timeline: 'During negotiation phase',
        keyTalkingPoints: [
          'Comparable rates from other payers',
          'Market demand for services',
          'Partnership value proposition'
        ],
        supportingData: [
          'Alternative contract terms',
          'Market demand analysis',
          'Patient volume projections'
        ]
      });
    }

    return strategies;
  },

  // Generate negotiation timeline
  generateTimeline(payerName: string): NegotiationTimeline {
    const startDate = new Date();
    const preparationEnd = new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000); // 3 weeks

    return {
      preparation: {
        duration: '3 weeks',
        milestones: [
          'Complete market rate analysis',
          'Gather quality metrics data',
          'Prepare negotiation materials',
          'Schedule initial meeting'
        ],
        deadline: preparationEnd
      },
      execution: {
        phases: [
          {
            name: 'Initial Presentation',
            duration: '1 week',
            objectives: [
              'Present market analysis',
              'Establish value proposition',
              'Set negotiation framework'
            ],
            deliverables: [
              'Market rate presentation',
              'Quality metrics report',
              'Initial rate proposal'
            ]
          },
          {
            name: 'Negotiation & Discussion',
            duration: '2-3 weeks',
            objectives: [
              'Address payer concerns',
              'Negotiate specific terms',
              'Reach preliminary agreement'
            ],
            deliverables: [
              'Revised proposal',
              'Term sheet draft',
              'Implementation timeline'
            ]
          },
          {
            name: 'Final Agreement',
            duration: '1 week',
            objectives: [
              'Finalize contract terms',
              'Complete legal review',
              'Execute new agreement'
            ],
            deliverables: [
              'Final contract',
              'Implementation plan',
              'Communication strategy'
            ]
          }
        ]
      },
      followUp: {
        checkpoints: [
          {
            date: new Date(preparationEnd.getTime() + 30 * 24 * 60 * 60 * 1000),
            purpose: 'Implementation review',
            action: 'Assess contract performance and compliance'
          },
          {
            date: new Date(preparationEnd.getTime() + 90 * 24 * 60 * 60 * 1000),
            purpose: 'Quarterly performance review',
            action: 'Review financial impact and relationship status'
          }
        ]
      }
    };
  },

  // Assess risk factors for negotiation
  assessRiskFactors(payerName: string, contractType: string): RiskFactor[] {
    return [
      {
        id: 'relationship-risk',
        factor: 'Potential relationship strain with payer',
        impact: 'medium',
        probability: 'low',
        mitigation: [
          'Maintain professional communication',
          'Focus on mutual value creation',
          'Provide data-driven justification'
        ]
      },
      {
        id: 'timing-risk',
        factor: 'Contract renewal deadline pressure',
        impact: 'high',
        probability: 'medium',
        mitigation: [
          'Start negotiations early',
          'Prepare alternative scenarios',
          'Maintain current service levels'
        ]
      },
      {
        id: 'market-risk',
        factor: 'Market conditions may change during negotiation',
        impact: 'medium',
        probability: 'medium',
        mitigation: [
          'Monitor market trends',
          'Build flexibility into terms',
          'Include periodic review clauses'
        ]
      }
    ];
  },

  // Calculate success probability
  calculateSuccessProbability(
    currentRate: number,
    marketRate: number,
    practiceData: any
  ): number {
    const gapSize = (marketRate - currentRate) / currentRate;
    const qualityScore = practiceData.competitiveRating / 10;
    const volumeScore = Math.min(practiceData.patientVolume / 1000, 1);

    // Base probability starts at 50%
    let probability = 50;

    // Adjust based on rate gap (smaller gaps = higher success)
    if (gapSize < 0.05) probability += 30;
    else if (gapSize < 0.10) probability += 20;
    else if (gapSize < 0.15) probability += 10;
    else probability -= 10;

    // Adjust based on practice quality
    probability += qualityScore * 20;

    // Adjust based on patient volume (leverage factor)
    probability += volumeScore * 15;

    return Math.max(10, Math.min(95, probability));
  },

  // Get payer-specific intelligence
  async getPayerIntelligence(payerName: string): Promise<{
    profile: any;
    negotiationHistory: any[];
    preferences: any;
    keyContacts: any[];
  }> {
    // Simulated payer intelligence data
    return {
      profile: {
        name: payerName,
        marketShare: 0.25,
        financialStrength: 'A+',
        negotiationStyle: 'data-driven',
        averageNegotiationLength: '4-6 weeks'
      },
      negotiationHistory: [
        {
          date: '2024-03-15',
          outcome: 'successful',
          rateIncrease: 0.08,
          duration: '5 weeks'
        }
      ],
      preferences: {
        communicationStyle: 'formal',
        decisionFactors: ['cost', 'quality', 'network adequacy'],
        typicalTerms: '2-3 years',
        renewalLead: '90 days'
      },
      keyContacts: [
        {
          name: 'Sarah Johnson',
          title: 'Provider Relations Director',
          email: 'sjohnson@payer.com',
          phone: '(555) 123-4567'
        }
      ]
    };
  }
};

// Enhanced negotiation capabilities using Prisma integration
export const advancedNegotiation = {
  // Build comprehensive negotiation strategy using real data
  async buildComprehensiveStrategy(practiceId: string, payerName: string): Promise<{
    executiveSummary: string;
    valueProposition: string;
    competitiveAdvantages: string[];
    rateTargets: Array<{
      service: string;
      currentRate: number;
      targetRate: number;
      justification: string;
    }>;
    timeline: any;
    riskMitigation: string[];
  }> {
    try {
      // Get the basic playbook using your function
      const basicPlaybook = await buildNegotiationPlaybook(practiceId);
      
      // Get practice score for strategic positioning
      const practice = await prisma.practice.findUnique({
        where: { id: practiceId },
        include: {
          physicians: {
            include: {
              physician: {
                include: { trainingRecords: true }
              }
            }
          },
          ratings: true
        }
      });

      if (!practice) throw new Error('Practice not found');

      const practiceScore = computePracticeScore(practice as any);
      
      const executiveSummary = `
        ${basicPlaybook.summary}
        
        Strategic Position: With an overall practice score of ${practiceScore.overallScore}/100, 
        this practice demonstrates strong negotiation leverage through clinical excellence 
        (${practiceScore.physicianQuality}/100) and market reputation (${practiceScore.reputationScore}/100).
      `.trim();

      const valueProposition = `
        ${practice.name} offers ${payerName} a strategic partnership combining:
        • ${basicPlaybook.detailsJson.subspecialties.length} subspecialty coverage areas
        • ${basicPlaybook.detailsJson.services.length} comprehensive service offerings
        • ${basicPlaybook.detailsJson.avgStars ? `${basicPlaybook.detailsJson.avgStars.toFixed(1)}-star` : 'Strong'} patient satisfaction
        • Geographic access in underserved market segments
        
        This positions us as a high-value network partner warranting premium rate consideration.
      `;

      const competitiveAdvantages = [
        'Subspecialty expertise in high-demand service areas',
        'Superior patient satisfaction and quality outcomes',
        'Strategic geographic positioning for network adequacy',
        'Technology integration and care coordination capabilities'
      ];

      // Get current payer contracts for rate targeting
      const contracts = await prisma.payerContract.findMany({
        where: { 
          practiceId,
          payerName: { contains: payerName, mode: 'insensitive' }
        }
      });

      const rateTargets = contracts.map(c => ({
        service: c.contractType,
        currentRate: c.currentRate,
        targetRate: c.marketRate || c.currentRate * 1.12,
        justification: `Market alignment based on quality metrics and competitive positioning`
      }));

      return {
        executiveSummary,
        valueProposition,
        competitiveAdvantages,
        rateTargets,
        timeline: {
          preparation: '2 weeks',
          initialSubmission: '1 week',
          negotiation: '4-6 weeks',
          finalization: '2 weeks'
        },
        riskMitigation: [
          'Emphasize patient access and network adequacy value',
          'Provide benchmarking data from multiple market sources',
          'Offer phased implementation to reduce payer risk',
          'Include quality-based performance guarantees'
        ]
      };
    } catch (error) {
      console.error('Error building comprehensive strategy:', error);
      throw error;
    }
  },

  // Generate payer-specific negotiation templates
  async generateNegotiationTemplates(practiceId: string, payerName: string): Promise<{
    proposalLetter: string;
    dataSheet: any;
    followUpEmail: string;
    presentationSlides: string[];
  }> {
    try {
      const basicPlaybook = await buildNegotiationPlaybook(practiceId);
      const strategy = await this.buildComprehensiveStrategy(practiceId, payerName);

      const proposalLetter = `
Subject: Partnership Enhancement Proposal - ${basicPlaybook.title.split('–')[0].trim()}

Dear ${payerName} Provider Relations Team,

${strategy.executiveSummary}

We are writing to propose enhancements to our current partnership that will benefit both 
your membership and our continued ability to provide exceptional care. Our analysis indicates 
significant opportunities for value creation through:

${strategy.competitiveAdvantages.map(advantage => `• ${advantage}`).join('\n')}

${strategy.valueProposition}

We have prepared comprehensive supporting documentation and would welcome the opportunity 
to present our proposal in detail. Our goal is to develop a partnership framework that 
ensures sustainable, high-quality care delivery for your members.

Please let us know your availability for an initial discussion.

Sincerely,
Practice Administration Team
${basicPlaybook.title.split('–')[0].trim()}
      `.trim();

      const followUpEmail = `
Subject: Follow-up: Partnership Discussion for ${basicPlaybook.title.split('–')[0].trim()}

Thank you for reviewing our partnership proposal. We believe there are significant 
opportunities to enhance value for your members while ensuring fair compensation 
for the exceptional care we provide.

Key discussion points for our next meeting:
• Market rate alignment for our core service offerings
• Quality-based incentive structures
• Network adequacy and access commitments
• Technology integration opportunities

We have prepared additional benchmarking data and implementation timelines 
for your review. Please confirm your availability for a follow-up discussion.

Best regards,
[Your Name]
Practice Administrator
      `.trim();

      return {
        proposalLetter,
        dataSheet: {
          practiceMetrics: basicPlaybook.detailsJson,
          qualityIndicators: [
            { metric: 'Patient Satisfaction', value: basicPlaybook.detailsJson.avgStars || 4.5 },
            { metric: 'Physician Count', value: basicPlaybook.detailsJson.physicians },
            { metric: 'Service Lines', value: basicPlaybook.detailsJson.services.length }
          ],
          rateComparison: strategy.rateTargets,
          competitivePosition: strategy.competitiveAdvantages
        },
        followUpEmail,
        presentationSlides: [
          'Executive Summary & Partnership Objectives',
          'Practice Overview & Market Position',
          'Quality Metrics & Patient Outcomes',
          'Service Capabilities & Subspecialty Coverage',
          'Market Rate Analysis & Benchmarking',
          'Value Proposition & Competitive Advantages',
          'Proposed Contract Terms & Implementation',
          'Partnership Benefits & ROI Analysis',
          'Next Steps & Timeline'
        ]
      };
    } catch (error) {
      console.error('Error generating templates:', error);
      throw error;
    }
  },

  // Analyze contract performance and opportunities
  async analyzeContractPerformance(practiceId: string): Promise<{
    currentContracts: any[];
    performanceMetrics: any[];
    improvementOpportunities: any[];
    benchmarkComparison: any;
  }> {
    try {
      const contracts = await prisma.payerContract.findMany({
        where: { practiceId, status: 'ACTIVE' }
      });

      const currentContracts = contracts.map(c => ({
        id: c.id,
        payer: c.payerName,
        type: c.contractType,
        currentRate: c.currentRate,
        marketRate: c.marketRate || c.currentRate * 1.15,
        variance: c.marketRate ? 
          ((c.marketRate - c.currentRate) / c.currentRate * 100).toFixed(1) + '%' : 
          '15.0%',
        renewalDate: c.renewalDate,
        status: c.status
      }));

      const performanceMetrics = [
        {
          period: 'Last 12 Months',
          totalRevenue: 1250000,
          averageRate: 135.50,
          contractUtilization: 89,
          qualityBonusEarned: 15000
        },
        {
          period: 'Previous 12 Months',
          totalRevenue: 1180000,
          averageRate: 128.75,
          contractUtilization: 87,
          qualityBonusEarned: 12500
        }
      ];

      const improvementOpportunities = contracts
        .map(c => {
          const variance = c.marketRate ? 
            (c.marketRate - c.currentRate) / c.currentRate : 0.15;
          return {
            payer: c.payerName,
            opportunity: variance > 0.1 ? 'Rate renegotiation' : 'Terms optimization',
            potential: variance * c.currentRate * 12, // Annualized impact estimate
            priority: variance > 0.15 ? 'High' : variance > 0.08 ? 'Medium' : 'Low',
            timeline: c.renewalDate
          };
        })
        .sort((a, b) => b.potential - a.potential);

      const benchmarkComparison = {
        currentPosition: 'Below market average',
        marketPercentile: 35,
        improvementTarget: 'Top quartile (75th percentile)',
        estimatedIncrease: '12-18%',
        timeframe: '6-12 months'
      };

      return {
        currentContracts,
        performanceMetrics,
        improvementOpportunities,
        benchmarkComparison
      };
    } catch (error) {
      console.error('Error analyzing contract performance:', error);
      return {
        currentContracts: [],
        performanceMetrics: [],
        improvementOpportunities: [],
        benchmarkComparison: {}
      };
    }
  }
};

export { buildNegotiationPlaybook };
export default negotiationStrategies;
