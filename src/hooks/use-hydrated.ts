import { useEffect, useState } from 'react';

/**
 * Custom hook to detect when the component is hydrated on the client side
 * Used to prevent hydration mismatch errors with localStorage, cookies, etc.
 */
export function useHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
