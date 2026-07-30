import { useEffect, useState } from 'react';
import { weatherApi } from '../api/weather.api';

export const useWeather = (lat, lon) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat == null || lon == null) return;

    let cancelled = false;
    setIsLoading(true);

    weatherApi
      .getCurrent(lat, lon)
      .then(({ data }) => {
        if (!cancelled) setWeather(data.weather);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return { weather, isLoading, error };
};
