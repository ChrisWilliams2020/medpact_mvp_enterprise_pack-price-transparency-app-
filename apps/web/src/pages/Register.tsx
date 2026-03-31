import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationForm {
  // Practice Info
  practiceName: string;
  practiceType: 'optometry' | 'ophthalmology' | 'optical' | 'multi-specialty';
  npi: string;
  taxId: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  
  // Admin User
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  adminPasswordConfirm: string;
  
  // Billing
  billingPlan: 'starter' | 'professional' | 'enterprise';
  
  // Agreements
  acceptTerms: boolean;
  acceptBAA: boolean; // HIPAA Business Associate Agreement
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 199,
    features: ['1 Location', 'Basic Metrics', 'CSV Import', 'Email Support'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 499,
    features: ['3 Locations', 'EMR Integration', 'Benchmarking', 'Priority Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    features: ['Unlimited Locations', 'API Access', 'White-label', 'Dedicated Support'],
  },
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<RegistrationForm>({
    practiceName: '',
    practiceType: 'optometry',
    npi: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',
    billingPlan: 'professional',
    acceptTerms: false,
    acceptBAA: false,
  });

  const updateForm = (field: keyof RegistrationForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!form.practiceName || !form.npi || !form.taxId) {
          setError('Please fill in all required fields');
          return false;
        }
        if (form.npi.length !== 10) {
          setError('NPI must be 10 digits');
          return false;
        }
        return true;
      case 2:
        if (!form.address || !form.city || !form.state || !form.zip || !form.phone) {
          setError('Please fill in all address fields');
          return false;
        }
        return true;
      case 3:
        if (!form.adminFirstName || !form.adminLastName || !form.adminEmail || !form.adminPassword) {
          setError('Please fill in all admin user fields');
          return false;
        }
        if (form.adminPassword !== form.adminPasswordConfirm) {
          setError('Passwords do not match');
          return false;
        }
        if (form.adminPassword.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        return true;
      case 4:
        if (!form.acceptTerms || !form.acceptBAA) {
          setError('You must accept the Terms of Service and BAA');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/practices/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Store token and redirect to dashboard
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('practice_id', data.practice_id);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Register Your Practice</h1>
          <p className="text-gray-600 mt-2">Join MedPact Practice Intelligence in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['Practice Info', 'Address', 'Admin User', 'Plan & Terms', 'Complete'].map((label, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step > idx + 1 ? 'bg-green-500 text-white' : 
                      step === idx + 1 ? 'bg-blue-600 text-white' : 
                      'bg-gray-200 text-gray-500'}`}
                >
                  {step > idx + 1 ? '✓' : idx + 1}
                </div>
                {idx < 4 && (
                  <div className={`w-12 h-1 mx-2 ${step > idx + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Practice Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Practice Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Practice Name *
                </label>
                <input
                  type="text"
                  value={form.practiceName}
                  onChange={(e) => updateForm('practiceName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Vision Care Associates"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Practice Type *
                </label>
                <select
                  value={form.practiceType}
                  onChange={(e) => updateForm('practiceType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="optometry">Optometry</option>
                  <option value="ophthalmology">Ophthalmology</option>
                  <option value="optical">Optical Shop</option>
                  <option value="multi-specialty">Multi-Specialty</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NPI Number *
                  </label>
                  <input
                    type="text"
                    value={form.npi}
                    onChange={(e) => updateForm('npi', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit NPI"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID (EIN) *
                  </label>
                  <input
                    type="text"
                    value={form.taxId}
                    onChange={(e) => updateForm('taxId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="XX-XXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Practice Address</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street, Suite 100"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => updateForm('state', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {US_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP *</label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => updateForm('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    maxLength={5}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          )}

          {/* Step 3: Admin User */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Administrator Account</h2>
              <p className="text-gray-600 text-sm">This will be the primary administrator for your practice.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={form.adminFirstName}
                    onChange={(e) => updateForm('adminFirstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={form.adminLastName}
                    onChange={(e) => updateForm('adminLastName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => updateForm('adminEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@yourpractice.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={form.adminPassword}
                    onChange={(e) => updateForm('adminPassword', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Min 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={form.adminPasswordConfirm}
                    onChange={(e) => updateForm('adminPasswordConfirm', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Plan & Terms */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Select Your Plan</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {PLANS.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => updateForm('billingPlan', plan.id)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all
                      ${form.billingPlan === plan.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-3xl font-bold text-blue-600 my-2">
                      ${plan.price}<span className="text-sm text-gray-500">/mo</span>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i}>✓ {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => updateForm('acceptTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    I accept the <a href="/terms" className="text-blue-600 underline">Terms of Service</a> and{' '}
                    <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptBAA}
                    onChange={(e) => updateForm('acceptBAA', e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    I accept the <a href="/baa" className="text-blue-600 underline">HIPAA Business Associate Agreement</a> (required for healthcare data)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to MedPact!</h2>
              <p className="text-gray-600 mt-2">Your practice has been registered successfully.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-2 rounded-lg font-medium
                  ${step === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Back
              </button>
              
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-500 hover:text-gray-700">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}