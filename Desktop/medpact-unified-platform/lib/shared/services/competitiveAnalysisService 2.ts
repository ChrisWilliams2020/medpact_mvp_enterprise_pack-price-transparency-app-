/**
 * Competitive Analysis Service
 * Compares your practice to competitors
 */

import { CompetitiveAnalysis, PracticeProfile, ServiceGap } from '../types/advanced';
import { ScrapedWebsiteData } from '../types/advanced';

export class CompetitiveAnalysisService {
  /**
   * Generate competitive analysis report
   */
  static async generateAnalysis(
    myPracticeId: string,
    competitorData: ScrapedWebsiteData
  ): Promise<CompetitiveAnalysis> {
    try {
      const response = await fetch('/api/analysis/competitive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          my_practice_id: myPracticeId,
          competitor_data: competitorData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      return await response.json();
    } catch (error) {
      console.error('Analysis error:', error);
      return this.getMockAnalysis(competitorData);
    }
  }

  /**
   * Calculate service overlap
   */
  static calculateServiceOverlap(
    myServices: string[],
    competitorServices: string[]
  ): number {
    const commonServices = myServices.filter(s => 
      competitorServices.includes(s)
    );
    return (commonServices.length / competitorServices.length) * 100;
  }

  /**
   * Identify service gaps
   */
  static identifyServiceGaps(
    myServices: string[],
    competitorServices: string[]
  ): ServiceGap[] {
    const gaps: ServiceGap[] = [];

    competitorServices.forEach(service => {
      if (!myServices.includes(service)) {
        gaps.push({
          service,
          competitor_offers: true,
          my_practice_offers: false,
          market_demand: 'high',
          recommendation: `Consider adding ${service} to stay competitive`
        });
      }
    });

    return gaps;
  }

  /**
   * Mock analysis for development
   */
  private static getMockAnalysis(competitorData: ScrapedWebsiteData): CompetitiveAnalysis {
    return {
      my_practice: {
        id: 'my-practice-1',
        name: 'My Medical Practice',
        services: ['Primary Care', 'Internal Medicine', 'Preventive Care'],
        physicians: [],
        specialties: ['Internal Medicine', 'Family Medicine'],
        total_physicians: 3,
        avg_physician_experience: 10,
        insurance_coverage: 85
      },
      competitor: {
        id: competitorData.practice_id,
        name: 'Competitor Practice',
        services: competitorData.services,
        physicians: competitorData.physicians,
        specialties: competitorData.specialties,
        total_physicians: competitorData.physicians.length,
        avg_physician_experience: 
          competitorData.physicians.reduce((sum, p) => sum + (p.years_experience || 0), 0) / 
          competitorData.physicians.length,
        insurance_coverage: 95
      },
      comparison: {
        service_overlap: 60,
        physician_quality_score: 85,
        specialty_coverage: 75,
        competitive_advantage: [
          'Lower wait times',
          'Personalized care approach',
          'Strong community presence'
        ],
        areas_to_improve: [
          'Expand service offerings',
          'Add more board-certified specialists',
          'Increase insurance network coverage'
        ]
      },
      recommendations: [
        '✅ Add Cardiology services to match competitor',
        '✅ Recruit board-certified specialists',
        '✅ Implement telemedicine platform',
        '✅ Expand Saturday hours',
        '✅ Join additional insurance networks'
      ],
      gaps: this.identifyServiceGaps(
        ['Primary Care', 'Internal Medicine', 'Preventive Care'],
        competitorData.services
      ),
      generated_at: new Date().toISOString()
    };
  }
}
