// client/src/components/EnvToggle.jsx
import React, { useState } from 'react';
import { IS_PRODUCTION_MODE } from '../config';
import { RefreshCw } from 'lucide-react';

export const EnvToggle = () => {
  const [isProduction, setIsProduction] = useState(IS_PRODUCTION_MODE);

  const toggleEnv = () => {
    // Only works in development
    if (import.meta.env.DEV) {
      const newValue = !isProduction;
      localStorage.setItem('forceProduction', String(newValue));
      setIsProduction(newValue);
      window.location.reload();
    }
  };

  // Only show in development
  if (!import.meta.env.DEV) return null;

  return (
    <button
      onClick={toggleEnv}
      className="fixed bottom-20 left-4 z-50 px-3 py-2 bg-gray-800/90 hover:bg-gray-700 text-white rounded-lg text-xs shadow-lg transition-colors flex items-center gap-2"
    >
      <RefreshCw className="w-3 h-3" />
      {isProduction ? 'Switch to Dev' : 'Switch to Prod'}
    </button>
  );
};