'use client';

import { useState } from 'react';

export function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    defaultRadius: '10',
    defaultSpecialty: 'all',
    mapStyle: 'standard',
    theme: 'light',
    autoSave: true,
  });

  const handleChange = (key: keyof typeof preferences, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          ⚙️ Preferences
        </h2>
        <p className="text-sm text-gray-600">
          Customize your default settings and user experience
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            🎯 Default Search Radius
          </label>
          <select
            value={preferences.defaultRadius}
            onChange={(e) => handleChange('defaultRadius', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="15">15 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Default radius for market landscape searches
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            👁️ Default Specialty Filter
          </label>
          <select
            value={preferences.defaultSpecialty}
            onChange={(e) => handleChange('defaultSpecialty', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Practices</option>
            <option value="ophthalmology">Ophthalmology Only</option>
            <option value="optometry">Optometry Only</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Default specialty filter for searches
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            🗺️ Map Style
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['standard', 'satellite', 'terrain'].map((style) => (
              <button
                key={style}
                onClick={() => handleChange('mapStyle', style)}
                className={`px-4 py-3 rounded-lg border-2 transition capitalize ${
                  preferences.mapStyle === style
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Choose your preferred map display style
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            🎨 Theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChange('theme', 'light')}
              className={`px-4 py-3 rounded-lg border-2 transition ${
                preferences.theme === 'light'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => handleChange('theme', 'dark')}
              className={`px-4 py-3 rounded-lg border-2 transition ${
                preferences.theme === 'dark'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              🌙 Dark
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Coming soon: Dark mode support
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <div className="font-medium text-gray-900 mb-1">
              💾 Auto-save Search Results
            </div>
            <div className="text-sm text-gray-600">
              Automatically save all searches to your history
            </div>
          </div>
          <button
            onClick={() => handleChange('autoSave', !preferences.autoSave)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              preferences.autoSave ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            💾 Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
