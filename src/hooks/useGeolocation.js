import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (err) => setError(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { coords, error };
};
