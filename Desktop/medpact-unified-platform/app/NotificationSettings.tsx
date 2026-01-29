'use client';

import { useState } from 'react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    newCompetitor: true,
    ratingChange: true,
    weeklyReport: true,
    marketTrends: false,
    emailDigest: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settings = [
    {
      key: 'newCompetitor' as const,
      title: 'New Competitor Alert',
      description: 'Get notified when a new practice appears in your search area',
      icon: '🆕',
    },
    {
      key: 'ratingChange' as const,
      title: 'Rating Changes',
      description: 'Alert when competitor ratings increase or decrease',
      icon: '⭐',
    },
    {
      key: 'weeklyReport' as const,
      title: 'Weekly Analytics Report',
      description: 'Receive a summary of your market intelligence activity',
      icon: '📊',
    },
    {
      key: 'marketTrends' as const,
      title: 'Market Trend Alerts',
      description: 'Get insights about changing market dynamics',
      icon: '📈',
    },
    {
      key: 'emailDigest' as const,
      title: 'Daily Email Digest',
      description: 'Daily summary of important updates',
      icon: '📧',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🔔 Notifications
        </h2>
        <p className="text-sm text-gray-600">
          Configure how and when you receive alerts
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl">{setting.icon}</div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    {setting.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {setting.description}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggle(setting.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  notifications[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notifications[setting.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            💾 Save Notification Preferences
          </button>
        </div>
      </div>
    </div>
  );
}