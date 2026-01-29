/**
 * Practice Search Hook
 */

import { useState, useEffect } from 'react';
import { PracticeService } from '../services/practiceService';
import { Practice, SearchParams } from '../types';

export function usePracticeSearch(params: SearchParams) {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.zipCode) {
      setPractices([]);
      return;
    }

    const searchPractices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const results = await PracticeService.searchPractices(params);
        setPractices(results);
      } catch (err: any) {
        setError(err.message || 'Failed to search practices');
        setPractices([]);
      } finally {
        setLoading(false);
      }
    };

    searchPractices();
  }, [params.zipCode, params.specialty, params.radius]);

  return { practices, loading, error };
}
