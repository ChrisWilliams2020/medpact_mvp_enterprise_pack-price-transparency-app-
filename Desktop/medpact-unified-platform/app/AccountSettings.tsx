'use client';

import { useState } from 'react';

export function AccountSettings() {
  const [profile, setProfile] = useState({
    name: 'Dr. Christopher Williams',
    email: 'chris@medpact.com',
    practice: 'Williams Eye Care',
    phone: '(215) 555-0123',
    timezone: 'America/New_York',
  });

  const handleChange = (key: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            👤 Profile Information
          </h2>
          <p className="text-sm text-gray-600">
            Update your personal and practice details
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Practice Name
            </label>
            <input
              type="text"
              value={profile.practice}
              onChange={(e) => handleChange('practice', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Timezone
            </label>
            <select
              value={profile.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>

          <button className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            💾 Update Profile
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            💳 Subscription
          </h2>
          <p className="text-sm text-gray-600">
            Manage your MedPact subscription
          </p>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  Professional Plan
                </div>
                <div className="text-gray-600">$99/month</div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Active
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                Unlimited market searches
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                Advanced analytics & reports
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                Email notifications
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                API access
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                Manage Billing
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200">
        <div className="p-6 border-b border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            ⚠️ Danger Zone
          </h2>
          <p className="text-sm text-red-700">
            Irreversible and destructive actions
          </p>
        </div>

        <div className="p-6 space-y-4">
          <button className="w-full px-4 py-3 bg-white border-2 border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition">
            🗑️ Delete All Search History
          </button>
          <button className="w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition">
            ❌ Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}