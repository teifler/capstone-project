import { useCallback, useEffect, useState } from 'react';
const defaultArray = [];
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url);
      const receivedData = await response.json();
      setLoading(false);
      setData(receivedData);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  return [data, loading, error, fetchData];
}
