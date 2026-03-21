'use client';

import { useState } from 'react';

interface SearchControlsProps {
  onSearch: (location: string, radius: number) => void;
  loading: boolean;
}

export function SearchControls({ onSearch, loading }: SearchControlsProps) {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location, radius);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city, zip, or address..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radius (miles)
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value={1}>1 mile</option>
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !location.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
}
