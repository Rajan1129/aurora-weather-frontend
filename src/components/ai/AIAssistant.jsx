import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Sparkles, Mic, Camera, Gamepad2, BookOpen,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { WeatherPredictionGame } from '../../components/ai/WeatherPredictionGame';
import { AIPhotoAnalysis } from '../../components/ai/AIPhotoAnalysis';
import { VoiceWeatherAssistant } from '../../components/ai/VoiceWeatherAssistant';
import { WeatherStories } from '../../components/ai/WeatherStories';

const features = [
  { id: 'voice', icon: Mic, label: 'Voice Assistant', color: 'from-purple-500 to-pink-500', component: VoiceWeatherAssistant },
  { id: 'game', icon: Gamepad2, label: 'Prediction Game', color: 'from-green-500 to-emerald-500', component: WeatherPredictionGame },
  { id: 'photo', icon: Camera, label: 'Photo Analysis', color: 'from-blue-500 to-cyan-500', component: AIPhotoAnalysis },
  { id: 'stories', icon: BookOpen, label: 'Weather Stories', color: 'from-yellow-500 to-orange-500', component: WeatherStories },
];

export default function AIAssistant() {
  const [activeFeature, setActiveFeature] = useState('voice');

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component || VoiceWeatherAssistant;
  const activeFeatureData = features.find(f => f.id === activeFeature);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Weather Assistant</h1>
          <p className="text-sm text-gray-500">
            {features.find(f => f.id === activeFeature)?.label || 'Voice Assistant'}
          </p>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="glass-card p-2 flex flex-wrap gap-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl transition-all flex-1 min-w-[120px] justify-center
                ${isActive 
                  ? `bg-gradient-to-r ${feature.color} text-white shadow-lg` 
                  : 'bg-white/5 hover:bg-white/10 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{feature.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Component */}
      <motion.div
        key={activeFeature}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ActiveComponent />
      </motion.div>
    </div>
  );
}