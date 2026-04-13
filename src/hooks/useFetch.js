/**
 * useFetch.js
 * Generic data fetching hook with loading, error, and refetch support.
 * Used by page-level components to fetch from services.
 *
 * @param {function} fetchFn   - async function that returns data
 * @param {Array}    deps      - dependency array (like useEffect)
 * @param {object}   options   - { immediate?: bool, initialData?: any }
 */

import { useState, useEffect, useCallback, useRef } from "react";

const useFetch = (fetchFn, deps = [], { immediate = true, initialData = null } = {}) => {
  const [data,      setData     ] = useState(initialData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error,     setError    ] = useState(null);

  // Prevent state updates on unmounted component
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      if (isMounted.current) {
        setData(result);
        setIsLoading(false);
      }
      return result;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      }
      throw err;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute();
  }, [execute]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error, refetch: execute };
};

export default useFetch;