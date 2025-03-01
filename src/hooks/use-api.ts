'use client';

import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook for fetching data from the API
 */
export function useApi<T>(endpoint: string): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api${endpoint}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const { data = [], success, message } = await response.json();

        if (!success) {
          throw new Error(message);
        }

        setData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, isLoading, error };
}
