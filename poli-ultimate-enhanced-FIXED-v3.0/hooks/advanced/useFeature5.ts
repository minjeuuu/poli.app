import { useState, useEffect } from 'react';

export const useFeature5 = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({ feature: 5, ready: true });
      setLoading(false);
    }, 100);
  }, []);
  
  return { data, loading };
};
