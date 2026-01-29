'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalSearches: number;
  avgRadius: number;
  topSpecialty: string;
  recentSearches: Array<{
    timestamp: string;
    location: string;
    resultsCount: number;
    specialty: string;
  }>;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/market-search');
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading analytics...</div>;
  }

  return (
    <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>
        📊 Market Search Analytics
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total Searches</div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#3B82F6' }}>
            {analytics?.totalSearches || 0}
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Avg Radius</div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#10B981' }}>
            {analytics?.avgRadius?.toFixed(1) || 0} mi
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Top Specialty</div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#8B5CF6' }}>
            {analytics?.topSpecialty || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}