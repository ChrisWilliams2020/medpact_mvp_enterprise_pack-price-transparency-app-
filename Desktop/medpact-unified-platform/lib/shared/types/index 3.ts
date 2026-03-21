/**
 * Shared TypeScript Types
 * Used across all MedPact features
 */

export interface Practice {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  specialty: string;
  googleRating: number;
  yelpRating: number;
  healthgradesRating: number;
  totalReviews: number;
  distance?: number;
  website?: string;
  lat: number;
  lng: number;
  created_at?: string;
}

export interface Contract {
  id: string;
  practice_id: string;
  file_name: string;
  file_url: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  payment_terms?: any;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  practice_id: string;
  revenue: number;
  patient_count: number;
  avg_reimbursement: number;
  payor_mix: {
    medicare: number;
    medicaid: number;
    commercial: number;
  };
  month: string;
  created_at: string;
}

export interface DashboardMetrics {
  revenue: number;
  contracts: number;
  patients: number;
  avgReimbursement: number;
  payorMix: {
    medicare: number;
    medicaid: number;
    commercial: number;
  };
}

export interface SearchParams {
  zipCode: string;
  specialty?: string;
  radius?: number;
}
