import { useEffect, useState } from 'react';
export default function useFetch(url, dependencyArray = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await fetch(url);
      const receivedData = await response.json();
      setLoading(false);
      setData(receivedData);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, dependencyArray);

  return [data, loading, error, fetchData];
}
