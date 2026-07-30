import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Link2, Share } from 'lucide-react';
// Remove Twitter import - use custom icons instead
import { useWeather } from '../../context/WeatherContext';
import { toast } from 'react-hot-toast';

// Custom Twitter icon
const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function ShareWeather() {
  const { currentWeather, selectedLocation } = useWeather();
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getShareText = () => {
    if (!currentWeather) return 'Check out Aurora Weather!';
    return `🌤️ Current weather in ${selectedLocation.city}: ${currentWeather.temperature}°C, ${currentWeather.condition?.main}. Check out Aurora Weather!`;
  };

  const shareData = {
    title: 'Aurora Weather',
    text: getShareText(),
    url: window.location.href,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/20 transition-colors text-sm"
      >
        <Share2 className="w-4 h-4" />
        Share Weather
      </motion.button>

      {showShareMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 mt-2 glass-card p-2 min-w-[180px] z-50 shadow-2xl"
        >
          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={shareToTwitter}
            className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <TwitterIcon className="w-4 h-4 text-blue-400" />
            Twitter
          </button>
        </motion.div>
      )}
    </div>
  );
}