import React from 'react';
import { motion } from 'framer-motion';
import { Dog, Cat, Thermometer, AlertCircle, Heart } from 'lucide-react';

export function PetAdvisorCard({ weatherData }) {
  const [petType, setPetType] = React.useState('dog');
  const [loading, setLoading] = React.useState(false);
  const [advice, setAdvice] = React.useState(null);

  const getPetAdvice = async () => {
    setLoading(true);
    // In production, call AI API
    // For now, use mock data
    setTimeout(() => {
      const temp = weatherData?.temperature || 25;
      const adviceData = {
        dog: {
          walkSafety: temp < 30 && temp > 5 ? 'Safe' : 'Caution',
          heatstrokeRisk: temp > 28 ? 'High' : temp > 20 ? 'Moderate' : 'Low',
          pawTemperature: temp > 30 ? 'Hot' : 'Normal',
          recommendations: [
            temp > 30 ? 'Walk early morning or late evening' : 'Perfect time for a walk',
            'Keep water available',
            'Check paw pads after walking',
          ],
        },
        cat: {
          walkSafety: 'Not applicable',
          heatstrokeRisk: temp > 30 ? 'High' : 'Low',
          pawTemperature: 'Normal',
          recommendations: [
            'Provide fresh water',
            'Keep indoors during peak heat',
            'Provide cool surfaces',
          ],
        },
      };
      setAdvice(adviceData[petType]);
      setLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    getPetAdvice();
  }, [petType, weatherData]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500">
          {petType === 'dog' ? <Dog className="w-5 h-5 text-white" /> : <Cat className="w-5 h-5 text-white" />}
        </div>
        <h3 className="text-lg font-semibold">Pet Weather Advisor</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPetType('dog')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            petType === 'dog' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          🐕 Dog
        </button>
        <button
          onClick={() => setPetType('cat')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            petType === 'cat' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          🐈 Cat
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      ) : advice ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-xs text-gray-500">Walk Safety</div>
              <div className={`font-semibold ${
                advice.walkSafety === 'Safe' ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {advice.walkSafety}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-xs text-gray-500">Heatstroke Risk</div>
              <div className={`font-semibold ${
                advice.heatstrokeRisk === 'Low' ? 'text-green-500' : 
                advice.heatstrokeRisk === 'Moderate' ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {advice.heatstrokeRisk}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {advice.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Heart className="w-3 h-3 text-orange-500" />
                {rec}
              </div>
            ))}
          </div>

          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              Based on current weather conditions
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}