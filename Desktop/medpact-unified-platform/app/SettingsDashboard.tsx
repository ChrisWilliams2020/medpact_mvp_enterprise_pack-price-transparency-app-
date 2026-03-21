'use client';

import { useState } from 'react';
import { ApiKeysSettings } from './ApiKeysSettings';
import { NotificationSettings } from './NotificationSettings';
import { PreferencesSettings } from './PreferencesSettings';
import { AccountSettings } from './AccountSettings';

type TabType = 'api-keys' | 'notifications' | 'preferences' | 'account';

export function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('api-keys');

  const tabs = [
    { id: 'api-keys' as TabType, label: '🔑 API Keys', icon: '🔑' },
    { id: 'notifications' as TabType, label: '🔔 Notifications', icon: '🔔' },
    { id: 'preferences' as TabType, label: '⚙️ Preferences', icon: '⚙️' },
    { id: 'account' as TabType, label: '👤 Account', icon: '👤' },
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-900 mb-2">
            💡 Quick Tip
          </div>
          <div className="text-xs text-blue-700">
            {activeTab === 'api-keys' && 'Keep your API keys secure. Never commit them to version control.'}
            {activeTab === 'notifications' && 'Get alerts when competitors appear in your searches or when market trends change.'}
            {activeTab === 'preferences' && 'Customize your dashboard and default search settings.'}
            {activeTab === 'account' && 'Manage your profile and subscription details.'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === 'api-keys' && <ApiKeysSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'preferences' && <PreferencesSettings />}
        {activeTab === 'account' && <AccountSettings />}
      </div>
    </div>
  );
}