'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function QuickExports() {
  const [loading, setLoading] = useState(false);

  const handleExport = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/export/${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export.csv`;
      a.click();
      toast.success(`${type} exported successfully!`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setLoading(false);
    }
  };

  const exportOptions = [
    {
      id: 'contracts',
      title: 'Export Contracts',
      description: 'Download all contract data',
      icon: '📋',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'networks',
      title: 'Export Networks',
      description: 'Download payor network data',
      icon: '🏥',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'opportunities',
      title: 'Export Opportunities',
      description: 'Download revenue opportunities',
      icon: '💰',
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 'market',
      title: 'Export Market Data',
      description: 'Download market intelligence',
      icon: '🗺️',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {exportOptions.map((option) => (
        <div
          key={option.id}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl shadow-lg`}
            >
              {option.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {option.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {option.description}
              </p>
              <button
                onClick={() => handleExport(option.id)}
                disabled={loading}
                className={`px-4 py-2 bg-gradient-to-r ${option.color} text-white rounded-lg hover:opacity-90 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50`}
              >
                {loading ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
