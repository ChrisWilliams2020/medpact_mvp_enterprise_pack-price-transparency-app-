import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface MarketSearch {
  id: string;
  user_id: string | null;
  search_location: {
    lat: number;
    lng: number;
    address?: string;
  };
  search_params: {
    radius: number;
    specialty?: string;
    includeHospitals?: boolean;
  };
  results_count: number;
  results_data: any[];
  created_at: string;
}

export interface Contract {
  id: string;
  user_id: string;
  payer_name: string;
  contract_type?: string;
  file_url?: string;
  file_name?: string;
  status: 'active' | 'expired' | 'pending';
  effective_date?: string;
  expiration_date?: string;
  extracted_data?: any;
  created_at: string;
  updated_at: string;
}