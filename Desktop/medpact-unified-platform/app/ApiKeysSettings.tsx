'use client';

import { useState, useEffect } from 'react';

interface ApiKey {
  name: string;
  key: string;
  masked: string;
  status: 'active' | 'inactive';
}

export function ApiKeysSettings() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);

  useEffect(() => {
    // Load from environment
    const loadedKeys: ApiKey[] = [];

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      loadedKeys.push({
        name: 'Supabase URL',
        key: process.env.NEXT_PUBLIC_SUPABASE_URL,
        masked: maskKey(process.env.NEXT_PUBLIC_SUPABASE_URL),
        status: 'active',
      });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      loadedKeys.push({
        name: 'Supabase Anon Key',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        masked: maskKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        status: 'active',
      });
    }

    if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      loadedKeys.push({
        name: 'Google Maps API',
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        masked: maskKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
        status: 'active',
      });
    }

    setKeys(loadedKeys);
  }, []);

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.slice(0, 4) + '••••••••' + key.slice(-4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🔑 API Keys
        </h2>
        <p className="text-sm text-gray-600">
          Manage your API keys and integrations
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {keys.map((apiKey) => (
            <div
              key={apiKey.name}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      apiKey.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {apiKey.status}
                  </span>
                </div>
                <div className="font-mono text-sm text-gray-600">
                  {showKey === apiKey.name ? apiKey.key : apiKey.masked}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setShowKey(showKey === apiKey.name ? null : apiKey.name)
                  }
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {showKey === apiKey.name ? '👁️ Hide' : '👁️ Show'}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey.key)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        {keys.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔑</div>
            <div className="text-gray-500 mb-4">No API keys configured</div>
            <div className="text-sm text-gray-400">
              Add API keys to your .env.local file to see them here
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="font-medium text-yellow-900 mb-1">
                Security Notice
              </div>
              <div className="text-sm text-yellow-700">
                API keys are loaded from environment variables. Never expose them in client-side code or commit them to version control.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}