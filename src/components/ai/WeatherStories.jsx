import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';
import { 
  BookOpen, Sparkles, Heart, Stars, 
  Cloud, Sun, Moon, Wind, Feather,
  RefreshCw, Share2, Bookmark, Mic
} from 'lucide-react';

export function WeatherStories() {
  const { currentWeather, selectedLocation, fetchWeather } = useWeather();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedStories, setSavedStories] = useState([]);
  const [storyType, setStoryType] = useState('magical');

  const storyTypes = [
    { id: 'magical', label: '✨ Magical', icon: Stars },
    { id: 'poetic', label: '📝 Poetic', icon: Feather },
    { id: 'adventure', label: '🗺️ Adventure', icon: Compass },
    { id: 'educational', label: '📚 Educational', icon: BookOpen },
  ];

  const generateStory = async () => {
    setLoading(true);
    
    const temp = currentWeather?.temperature || 22;
    const condition = currentWeather?.condition?.main?.toLowerCase() || 'clear';
    const city = selectedLocation?.city || 'the city';
    const timeOfDay = new Date().getHours() < 18 ? 'day' : 'night';
    
    setTimeout(() => {
      const stories = {
        magical: {
          title: `The Enchanted ${timeOfDay === 'day' ? 'Sunlight' : 'Moonlight'} of ${city}`,
          content: `Once upon a time, in the magical city of ${city}, the weather held a secret power. 
            The ${condition} skies above danced with ${temp}°C of mystical energy. 
            Every ${timeOfDay === 'day' ? 'sunbeam' : 'moonbeam'} carried a whisper of ancient weather magic, 
            telling stories of faraway lands and forgotten times.`,
          moral: 'Every weather pattern tells a story of nature\'s magic.',
          emoji: '✨',
        },
        poetic: {
          title: `${condition.charAt(0).toUpperCase() + condition.slice(1)} Whispers of ${city}`,
          content: `In ${city} where the ${condition} winds blow,
            ${temp} degrees of stories flow.
            The ${timeOfDay === 'day' ? 'golden sun' : 'silver moon'} paints the sky,
            As weather patterns wander by.
            Each gust of wind, each drop of rain,
            Carries a poem in its refrain.`,
          moral: 'Weather is nature\'s poetry in motion.',
          emoji: '📝',
        },
        adventure: {
          title: `The Great ${condition.charAt(0).toUpperCase() + condition.slice(1)} Expedition of ${city}`,
          content: `Brave explorers set out on a daring adventure through ${city} at ${temp}°C.
            The ${condition} weather created the perfect backdrop for their journey.
            They discovered hidden waterfalls, ancient weather patterns, 
            and the legendary ${timeOfDay === 'day' ? 'Sunstone' : 'Moonshard'} of the ${condition} winds.`,
          moral: 'Every weather condition is an adventure waiting to be discovered.',
          emoji: '🗺️',
        },
        educational: {
          title: `Understanding the ${condition.charAt(0).toUpperCase() + condition.slice(1)} Weather of ${city}`,
          content: `Did you know that ${city} experiences ${temp}°C due to its unique geographical location?
            The ${condition} weather pattern is caused by ${timeOfDay === 'day' ? 'solar radiation' : 'lunar influence'} 
            interacting with local atmospheric conditions. This creates the fascinating 
            weather phenomena we observe today.`,
          moral: 'Weather is a fascinating science that shapes our world.',
          emoji: '📚',
        },
      };

      setStory(stories[storyType] || stories.magical);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    generateStory();
  }, [currentWeather, storyType]);

  const saveStory = () => {
    if (story && !savedStories.find(s => s.title === story.title)) {
      setSavedStories([...savedStories, story]);
    }
  };

  const shareStory = () => {
    if (story) {
      const text = `${story.emoji} ${story.title}\n\n${story.content}\n\n${story.moral}`;
      if (navigator.share) {
        navigator.share({ title: story.title, text });
      } else {
        navigator.clipboard.writeText(text);
      }
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Weather Stories</h3>
            <p className="text-xs text-gray-500">AI-generated stories inspired by the weather</p>
          </div>
        </div>
        <button
          onClick={generateStory}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {storyTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setStoryType(type.id)}
              className={`
                px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors
                ${storyType === type.id 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20'
                }
              `}
            >
              <Icon className="w-3 h-3" />
              {type.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500">Crafting your weather story...</p>
          <p className="text-xs text-gray-400 mt-1">The AI is weaving words with the weather</p>
        </div>
      ) : story ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-sm text-yellow-500">
            <Sparkles className="w-4 h-4" />
            <span>Weather Story</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{story.emoji}</span>
              <h4 className="text-lg font-bold">{story.title}</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {story.content}
            </p>
            <div className="mt-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-xs text-yellow-600 dark:text-yellow-400 italic">
                💫 {story.moral}
              </p>
            </div>
          </div>

          {currentWeather && (
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-xs text-gray-500">Temperature</div>
                <div className="font-medium">{currentWeather.temperature}°C</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-xs text-gray-500">Condition</div>
                <div className="font-medium">{currentWeather.condition?.main}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-xs text-gray-500">Location</div>
                <div className="font-medium">{selectedLocation.city}</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={saveStory}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm"
            >
              <Bookmark className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={shareStory}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {savedStories.length > 0 && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500" />
              {savedStories.length} stories saved
            </div>
          )}
        </motion.div>
      ) : null}
    </div>
  );
}

const Compass = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);