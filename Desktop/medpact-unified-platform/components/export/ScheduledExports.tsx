'use client';

import { useState } from 'react';

interface ScheduledExport {
  id: string;
  name: string;
  type: string;
  format: string;
  frequency: string;
  recipients: string[];
  nextRun: string;
  status: 'active' | 'paused';
}

export function ScheduledExports() {
  const [schedules, setSchedules] = useState<ScheduledExport[]>([
    {
      id: '1',
      name: 'Weekly Analytics Report',
      type: 'analytics',
      format: 'pdf',
      frequency: 'weekly',
      recipients: ['chris@medpact.com'],
      nextRun: '2026-01-12',
      status: 'active',
    },
  ]);

  const [showNewSchedule, setShowNewSchedule] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Scheduled Exports
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Automate your data exports and reports
          </p>
        </div>
        <button
          onClick={() => setShowNewSchedule(!showNewSchedule)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          ➕ New Schedule
        </button>
      </div>

      {showNewSchedule && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Schedule (Coming Soon)
          </h3>
          <button
            onClick={() => setShowNewSchedule(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      )}

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {schedule.name}
            </h3>
            <div className="text-sm text-gray-600">
              Next run: {new Date(schedule.nextRun).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
