/**
 * Dashboard Metrics Hook
 */

import { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';
import { DashboardMetrics } from '../types';

export function useDashboardMetrics(practiceId: string) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!practiceId) return;

    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await AnalyticsService.getDashboardMetrics(practiceId);
        setMetrics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [practiceId]);

  return { metrics, loading, error };
}
