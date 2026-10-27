import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any fast-changing value (e.g. search input).
 * Prevents redundant API requests and avoids TMDB rate limiting.
 *
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 400ms)
 * @returns {any} debouncedValue - Value after the delay has elapsed without new changes
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
