import { useLocalStorage } from './useLocalStorage';

const defaultPreferences = {
  units: 'metric',
  theme: 'auto',
  language: 'en',
  notifications: {
    weatherAlerts: true,
    dailySummary: true,
    aiRecommendations: true,
    marketing: false,
  },
  dashboard: {
    showAlerts: true,
    showForecast: true,
    showAI: true,
    showWidgets: true,
  },
  savedLocations: [],
  lastViewed: null,
};

export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage('aurora-preferences', defaultPreferences);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedPreference = (parent, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreference,
    updateNestedPreference,
    resetPreferences,
  };
}