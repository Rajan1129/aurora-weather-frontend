// client/src/components/EnvironmentBadge.jsx
import React, { useState } from 'react';
import { IS_PRODUCTION_MODE, API_URL, config } from '../config';
import { Cloud, Server, RefreshCw } from 'lucide-react';

export const EnvironmentBadge = () => {
  const [showDetails, setShowDetails] = useState(false);

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div 
        className={`px-4 py-2 rounded-lg shadow-lg cursor-pointer transition-all duration-300 ${
          IS_PRODUCTION_MODE 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-yellow-500 hover:bg-yellow-600'
        } text-white`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          {IS_PRODUCTION_MODE ? (
            <Cloud className="w-4 h-4" />
          ) : (
            <Server className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {IS_PRODUCTION_MODE ? '🚀 PRODUCTION' : '🛠️ DEVELOPMENT'}
          </span>
        </div>
        
        {showDetails && (
          <div className="mt-2 pt-2 border-t border-white/20 text-xs">
            <p>API: {API_URL}</p>
            <p>Env: {config.env}</p>
            <p className="mt-1 text-white/70">
              Click to toggle details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};