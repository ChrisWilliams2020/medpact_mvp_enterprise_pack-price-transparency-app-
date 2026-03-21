/**
 * Patient Demographics Service
 * Uses Census data + Google Maps to find target patients
 */

import { 
  PatientSearchCriteria, 
  PatientDemographicResult,
  HeatMapData,
  HeatPoint
} from '../types/advanced';

export class PatientDemographicsService {
  /**
   * Search for target patient demographics
   */
  static async searchTargetPatients(
    criteria: PatientSearchCriteria
  ): Promise<PatientDemographicResult[]> {
    try {
      const response = await fetch('/api/demographics/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });

      if (!response.ok) {
        throw new Error('Failed to search demographics');
      }

      return await response.json();
    } catch (error) {
      console.error('Demographics search error:', error);
      return this.getMockDemographicResults(criteria);
    }
  }

  /**
   * Generate heat map data
   */
  static async generateHeatMap(
    results: PatientDemographicResult[]
  ): Promise<HeatMapData> {
    const heatPoints: HeatPoint[] = results.map(result => ({
      lat: result.location.lat,
      lng: result.location.lng,
      weight: this.calculateHeatWeight(result.target_patient_count),
      patient_count: result.target_patient_count,
      zip_code: result.location.zip_code
    }));

    const centerLat = results.reduce((sum, r) => sum + r.location.lat, 0) / results.length;
    const centerLng = results.reduce((sum, r) => sum + r.location.lng, 0) / results.length;

    return {
      center: { lat: centerLat, lng: centerLng },
      zoom: 11,
      heat_points: heatPoints,
      legend: {
        high: { color: '#dc2626', label: 'High Concentration', min_patients: 1000 },
        medium: { color: '#f59e0b', label: 'Medium Concentration', min_patients: 500 },
        low: { color: '#3b82f6', label: 'Low Concentration', min_patients: 0 }
      }
    };
  }

  /**
   * Calculate heat map weight (0-1)
   */
  private static calculateHeatWeight(patientCount: number): number {
    const maxPatients = 2000;
    return Math.min(patientCount / maxPatients, 1);
  }

  /**
   * Get disease prevalence data
   */
  static async getDiseasePrevalence(
    disease: string,
    zipCode: string
  ): Promise<number> {
    // This would call CDC/Census API
    // For now, return mock data
    const prevalenceRates: { [key: string]: number } = {
      'diabetes': 10.5,
      'hypertension': 32.0,
      'heart disease': 6.2,
      'copd': 6.4,
      'asthma': 8.3,
      'cancer': 5.0,
      'arthritis': 22.7
    };

    return prevalenceRates[disease.toLowerCase()] || 5.0;
  }

  /**
   * Mock demographic results
   */
  private static getMockDemographicResults(
    criteria: PatientSearchCriteria
  ): PatientDemographicResult[] {
    const zipCodes = ['94102', '94103', '94104', '94105', '94109'];
    
    return zipCodes.map((zip, index) => ({
      location: {
        zip_code: zip,
        city: 'San Francisco',
        state: 'CA',
        county: 'San Francisco County',
        lat: 37.7749 + (index * 0.01),
        lng: -122.4194 + (index * 0.01),
        radius_miles: criteria.radius_miles
      },
      estimated_population: 25000 + (index * 2000),
      target_patient_count: 1200 + (index * 300),
      demographics: {
        total_population: 25000 + (index * 2000),
        age_groups: {
          '0-17': 15,
          '18-34': 30,
          '35-54': 28,
          '55-74': 20,
          '75+': 7
        },
        gender_split: {
          male: 48,
          female: 52
        },
        median_income: 75000 + (index * 5000),
        insurance_coverage: {
          medicare: 15,
          medicaid: 12,
          private: 68,
          uninsured: 5
        }
      },
      disease_prevalence: {
        disease_name: criteria.diseases[0] || 'diabetes',
        prevalence_rate: 10.5,
        estimated_patients: 1200 + (index * 300),
        age_distribution: {
          '35-54': 35,
          '55-74': 45,
          '75+': 20
        }
      },
      recommendations: [
        {
          zip_code: zip,
          priority: index < 2 ? 'high' : 'medium',
          estimated_patients: 1200 + (index * 300),
          strategy: 'Direct mail campaign targeting seniors',
          marketing_channels: ['Direct Mail', 'Facebook Ads', 'Community Events'],
          expected_roi: '250%'
        }
      ]
    }));
  }

  /**
   * Generate clinical trial recruitment zones
   */
  static async generateTrialRecruitmentZones(
    trialName: string,
    criteria: PatientSearchCriteria,
    targetEnrollment: number
  ) {
    const results = await this.searchTargetPatients(criteria);
    
    return {
      trial_name: trialName,
      inclusion_criteria: criteria,
      target_enrollment: targetEnrollment,
      current_enrollment: 0,
      recruitment_zones: results,
      estimated_eligible_patients: results.reduce((sum, r) => sum + r.target_patient_count, 0),
      recruitment_timeline: '12-18 months'
    };
  }
}
