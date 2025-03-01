import { useState } from 'react';

export function usePostApi<T, R>(endpoint: string) {
  const [data, setData] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const post = async (payload: T): Promise<R | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const { success, message, data } = result;

      if (!success) {
        throw new Error(message);
      }

      setData(data);
      setError(null);
      return success;
    } catch (err) {
      console.error('Error posting data:', err);
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { post, data, isLoading, error };
}
