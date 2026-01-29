/**
 * Advanced Feature Types
 */

// Website Scraping Types
export interface ScrapedWebsiteData {
  url: string;
  practice_id: string;
  services: string[];
  physicians: PhysicianProfile[];
  specialties: string[];
  insurance_accepted: string[];
  office_hours: OfficeHours;
  scraped_at: string;
}

export interface PhysicianProfile {
  name: string;
  title: string;
  credentials: string[];
  medical_school?: string;
  residency?: string;
  board_certifications: string[];
  years_experience?: number;
  specialties: string[];
}

export interface OfficeHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

// Competitive Analysis Types
export interface CompetitiveAnalysis {
  my_practice: PracticeProfile;
  competitor: PracticeProfile;
  comparison: ComparisonMetrics;
  recommendations: string[];
  gaps: ServiceGap[];
  generated_at: string;
}

export interface PracticeProfile {
  id: string;
  name: string;
  services: string[];
  physicians: PhysicianProfile[];
  specialties: string[];
  total_physicians: number;
  avg_physician_experience: number;
  insurance_coverage: number;
}

export interface ComparisonMetrics {
  service_overlap: number; // percentage
  physician_quality_score: number;
  specialty_coverage: number;
  competitive_advantage: string[];
  areas_to_improve: string[];
}

export interface ServiceGap {
  service: string;
  competitor_offers: boolean;
  my_practice_offers: boolean;
  market_demand: 'high' | 'medium' | 'low';
  recommendation: string;
}

// Patient Demographic Search Types
export interface PatientSearchCriteria {
  age_min?: number;
  age_max?: number;
  gender?: 'male' | 'female' | 'all';
  diseases: string[];
  diagnoses: string[];
  insurance_type?: string[];
  income_range?: {
    min: number;
    max: number;
  };
  zip_codes?: string[];
  radius_miles: number;
  center_zip: string;
}

export interface PatientDemographicResult {
  location: GeographicArea;
  estimated_population: number;
  target_patient_count: number;
  demographics: DemographicBreakdown;
  disease_prevalence: DiseaseStats;
  recommendations: PatientAcquisitionStrategy[];
}

export interface GeographicArea {
  zip_code: string;
  city: string;
  state: string;
  county: string;
  lat: number;
  lng: number;
  radius_miles: number;
}

export interface DemographicBreakdown {
  total_population: number;
  age_groups: {
    [key: string]: number;
  };
  gender_split: {
    male: number;
    female: number;
  };
  median_income: number;
  insurance_coverage: {
    medicare: number;
    medicaid: number;
    private: number;
    uninsured: number;
  };
}

export interface DiseaseStats {
  disease_name: string;
  prevalence_rate: number; // percentage
  estimated_patients: number;
  age_distribution: {
    [key: string]: number;
  };
}

export interface PatientAcquisitionStrategy {
  zip_code: string;
  priority: 'high' | 'medium' | 'low';
  estimated_patients: number;
  strategy: string;
  marketing_channels: string[];
  expected_roi: string;
}

// Heat Map Types
export interface HeatMapData {
  center: { lat: number; lng: number };
  zoom: number;
  heat_points: HeatPoint[];
  legend: HeatMapLegend;
}

export interface HeatPoint {
  lat: number;
  lng: number;
  weight: number; // intensity 0-1
  patient_count: number;
  zip_code: string;
}

export interface HeatMapLegend {
  high: { color: string; label: string; min_patients: number };
  medium: { color: string; label: string; min_patients: number };
  low: { color: string; label: string; min_patients: number };
}

// Clinical Trial Recruitment Types
export interface TrialRecruitmentZone {
  trial_name: string;
  inclusion_criteria: PatientSearchCriteria;
  target_enrollment: number;
  current_enrollment: number;
  recruitment_zones: PatientDemographicResult[];
  estimated_eligible_patients: number;
  recruitment_timeline: string;
}
