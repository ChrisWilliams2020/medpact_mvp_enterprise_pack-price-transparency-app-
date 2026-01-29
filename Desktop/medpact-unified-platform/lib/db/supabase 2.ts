import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface User {
  id: string;
  email: string;
  full_name: string;
  organization_id: string;
  role: 'admin' | 'manager' | 'user';
  biometric_enabled: boolean;
  created_at: string;
}

export interface Practice {
  id: string;
  name: string;
  specialty: string;
  npi: string;
  website: string;
  phone: string;
  email: string;
  locations: Location[];
  ratings: Ratings;
  created_by: string;
  organization_id: string;
}

export interface Contract {
  id: string;
  practice_id: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  value: number;
  status: 'active' | 'pending' | 'expired';
  terms: any;
  created_by: string;
  organization_id: string;
}

export interface ReferralNetwork {
  id: string;
  from_practice_id: string;
  to_practice_id: string;
  specialty: string;
  referral_count: number;
  success_rate: number;
  created_at: string;
}

export interface PaymentSubscription {
  id: string;
  organization_id: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_end: string;
}