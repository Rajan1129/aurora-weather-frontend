// Get user's current location using browser Geolocation API
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

// Reverse geocode to get city name from coordinates
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          'User-Agent': 'Aurora Weather App',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get location name');
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      const city = address.city || address.town || address.village || address.municipality || 'Unknown';
      const country = address.country || '';
      const state = address.state || '';
      
      return {
        city,
        country,
        state,
        displayName: state ? `${city}, ${state}, ${country}` : `${city}, ${country}`,
        fullAddress: data.display_name || '',
      };
    }
    
    return {
      city: 'Unknown Location',
      country: '',
      state: '',
      displayName: 'Unknown Location',
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return {
      city: 'Unknown Location',
      country: '',
      state: '',
      displayName: 'Unknown Location',
    };
  }
};

// Get complete location data (coordinates + city name)
export const getCurrentLocationData = async () => {
  try {
    const coords = await getCurrentLocation();
    const locationInfo = await reverseGeocode(coords.lat, coords.lng);
    
    return {
      ...coords,
      ...locationInfo,
    };
  } catch (error) {
    console.error('Location error:', error);
    throw error;
  }
};

// Check if location is already saved in localStorage
export const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  } catch {
    return null;
  }
};

// Save location to localStorage
export const saveLocation = (location) => {
  try {
    localStorage.setItem('userLocation', JSON.stringify(location));
    return true;
  } catch {
    return false;
  }
};

// Check if we should ask for location again
export const shouldAskForLocation = () => {
  const lastAsked = localStorage.getItem('lastLocationAsk');
  if (!lastAsked) return true;
  
  const hoursSinceLastAsk = (Date.now() - parseInt(lastAsked)) / (1000 * 60 * 60);
  return hoursSinceLastAsk > 1;
};

// Mark location as asked
export const markLocationAsked = () => {
  localStorage.setItem('lastLocationAsk', String(Date.now()));
};