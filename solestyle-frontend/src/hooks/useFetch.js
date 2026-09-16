import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

/**
 * Small data-fetching hook: returns { data, loading, error }.
 */
export const useFetch = (endpoint, params) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axiosInstance
      .get(endpoint, { params })
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
};
