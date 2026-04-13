/**
 * useDebounce.js
 * Delays updating a value until after a specified wait time.
 * Used for search inputs to avoid API calls on every keystroke.
 *
 * @param {any}    value - value to debounce
 * @param {number} delay - delay in milliseconds (default 400ms)
 */

import { useState, useEffect } from "react";

const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;