import { useState, useEffect } from 'react';

export const useFeature1 = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({ feature: 1, ready: true });
      setLoading(false);
    }, 100);
  }, []);
  
  return { data, loading };
};
