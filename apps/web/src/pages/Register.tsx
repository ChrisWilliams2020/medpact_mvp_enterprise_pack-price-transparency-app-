import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const US_STATES = [
  { code: '', name: 'Select State' },
  { code: 'TX', name: 'Texas' }, { code: 'CA', name: 'California' }, { code: 'FL', name: 'Florida' },
  { code: 'NY', name: 'New York' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'IL', name: 'Illinois' },
  { code: 'OH', name: 'Ohio' }, { code: 'GA', name: 'Georgia' }, { code: 'NC', name: 'North Carolina' },
  { code: 'MI', name: 'Michigan' }, { code: 'NJ', name: 'New Jersey' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'AZ', name: 'Arizona' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'TN', name: 'Tennessee' }, { code: 'IN', name: 'Indiana' }, { code: 'MO', name: 'Missouri' },
  { code: 'MD', name: 'Maryland' }, { code: 'WI', name: 'Wisconsin' }, { code: 'CO', name: 'Colorado' },
  { code: 'MN', name: 'Minnesota' }, { code: 'SC', name: 'South Carolina' }, { code: 'AL', name: 'Alabama' },
  { code: 'LA', name: 'Louisiana' }, { code: 'KY', name: 'Kentucky' }, { code: 'OR', name: 'Oregon' },
  { code: 'OK', name: 'Oklahoma' }, { code: 'CT', name: 'Connecticut' }, { code: 'UT', name: 'Utah' },
  { code: 'IA', name: 'Iowa' }, { code: 'NV', name: 'Nevada' }, { code: 'AR', name: 'Arkansas' },
  { code: 'MS', name: 'Mississippi' }, { code: 'KS', name: 'Kansas' }, { code: 'NM', name: 'New Mexico' },
  { code: 'NE', name: 'Nebraska' }, { code: 'ID', name: 'Idaho' }, { code: 'WV', name: 'West Virginia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'NH', name: 'New Hampshire' }, { code: 'ME', name: 'Maine' },
  { code: 'MT', name: 'Montana' }, { code: 'RI', name: 'Rhode Island' }, { code: 'DE', name: 'Delaware' },
  { code: 'SD', name: 'South Dakota' }, { code: 'ND', name: 'North Dakota' }, { code: 'AK', name: 'Alaska' },
  { code: 'VT', name: 'Vermont' }, { code: 'WY', name: 'Wyoming' }
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    practice_name: '',
    practice_type: 'optometry',
    npi: '',
    tax_id: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
    contact_name: '',
    password: '',
    confirm_password: '',
    emr_system: '',
    accept_baa: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!formData.practice_name.trim()) { setError('Practice name is required'); return false; }
      if (!formData.npi || formData.npi.length !== 10) { setError('Valid 10-digit NPI is required'); return false; }
    }
    if (s === 2) {
      if (!formData.address.trim()) { setError('Street address is required'); return false; }
      if (!formData.city.trim()) { setError('City is required'); return false; }
      if (!formData.state) { setError('State is required'); return false; }
      if (!formData.zip_code || formData.zip_code.length !== 5) { setError('Valid 5-digit ZIP is required'); return false; }
    }
    if (s === 3) {
      if (!formData.contact_name.trim()) { setError('Contact name is required'); return false; }
      if (!formData.email || !formData.email.includes('@')) { setError('Valid email is required'); return false; }
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) { setError('Valid phone is required'); return false; }
    }
    if (s === 4) {
      if (!formData.password || formData.password.length < 8) { setError('Password must be 8+ characters'); return false; }
      if (formData.password !== formData.confirm_password) { setError('Passwords do not match'); return false; }
    }
    if (s === 5) {
      if (!formData.accept_baa) { setError('You must accept the BAA to continue'); return false; }
    }
    return true;
  };

  const nextStep = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 5)); };
  const prevStep = () => { setStep(s => Math.max(s - 1, 1)); setError(''); };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/practices/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/\D/g, ''),
          tax_id: formData.tax_id || null,
          emr_system: formData.emr_system || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('practice_id', data.id);
      localStorage.setItem('practice_name', data.practice_name);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const titles = ['Practice Information', 'Practice Address', 'Contact Details', 'Create Account', 'HIPAA Agreement'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">MedPact</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Practice</h1>
          <p className="text-gray-600">Step {step} of 5: {titles[step - 1]}</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s < step ? 'bg-green-500' : s === step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name *</label>
                <input type="text" value={formData.practice_name} onChange={(e) => updateField('practice_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Vision Care Associates" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Practice Type *</label>
                <select value={formData.practice_type} onChange={(e) => updateField('practice_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option value="optometry">Optometry</option>
                  <option value="ophthalmology">Ophthalmology</option>
                  <option value="optical">Optical Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NPI Number *</label>
                <input type="text" value={formData.npi} onChange={(e) => updateField('npi', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono" placeholder="1234567890" maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID (Optional)</label>
                <input type="text" value={formData.tax_id} onChange={(e) => updateField('tax_id', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="12-3456789" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Address</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="123 Main Street" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input type="text" value={formData.city} onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Austin" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <select value={formData.state} onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                    {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input type="text" value={formData.zip_code} onChange={(e) => updateField('zip_code', e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono" placeholder="78701" maxLength={5} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                <input type="text" value={formData.contact_name} onChange={(e) => updateField('contact_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Dr. Jane Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="admin@practice.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', formatPhone(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="(512) 555-1234" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EMR System (Optional)</label>
                <select value={formData.emr_system} onChange={(e) => updateField('emr_system', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                  <option value="">Select EMR</option>
                  <option value="revolutionehr">RevolutionEHR</option>
                  <option value="eyefinity">Eyefinity</option>
                  <option value="compulink">Compulink</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Account</h2>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800"><strong>Email:</strong> {formData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="••••••••" />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input type="password" value={formData.confirm_password} onChange={(e) => updateField('confirm_password', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl ${formData.confirm_password && formData.password === formData.confirm_password ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                  placeholder="••••••••" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">HIPAA Business Associate Agreement</h2>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800"><strong>Required:</strong> You must accept the BAA to use MedPact.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl max-h-64 overflow-y-auto text-sm text-gray-600 border">
                <h3 className="font-bold mb-2">HIPAA BUSINESS ASSOCIATE AGREEMENT</h3>
                <p className="mb-3">This BAA is between <strong>{formData.practice_name}</strong> and <strong>MedPact Practice Intelligence, Inc.</strong></p>
                <p className="mb-2"><strong>Business Associate agrees to:</strong></p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  <li>Not use or disclose PHI except as permitted</li>
                  <li>Use appropriate safeguards to prevent unauthorized disclosure</li>
                  <li>Report any unauthorized use within 72 hours</li>
                  <li>Ensure subcontractors agree to same restrictions</li>
                </ul>
                <p><strong>Security:</strong> AES-256 encryption, SOC 2 certified, 24/7 monitoring</p>
              </div>
              <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50">
                <input type="checkbox" checked={formData.accept_baa} onChange={(e) => updateField('accept_baa', e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">
                  I, <strong>{formData.contact_name || 'authorized representative'}</strong>, accept the Business Associate Agreement.
                </span>
              </label>
              {formData.accept_baa && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="font-medium text-green-800">✓ Ready to complete registration!</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button onClick={prevStep} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">← Back</button>
            ) : (
              <Link to="/" className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</Link>
            )}

            {step < 5 ? (
              <button onClick={nextStep} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg">
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !formData.accept_baa}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 shadow-lg">
                {loading ? 'Creating...' : 'Complete Registration ✓'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}