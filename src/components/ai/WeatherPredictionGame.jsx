import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';
import { 
  Trophy, Star, Sparkles, TrendingUp, 
  Cloud, CloudRain, Sun, Wind, 
  Award, Target, Zap, Brain
} from 'lucide-react';

export function WeatherPredictionGame() {
  const { currentWeather, fetchWeather, selectedLocation } = useWeather();
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [actualWeather, setActualWeather] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('weatherGameHighScore') || '0');
  });

  const weatherOptions = [
    { id: 'sunny', label: '☀️ Sunny', temp: 25, condition: 'Clear' },
    { id: 'cloudy', label: '⛅ Cloudy', temp: 18, condition: 'Clouds' },
    { id: 'rainy', label: '🌧️ Rainy', temp: 15, condition: 'Rain' },
    { id: 'snowy', label: '❄️ Snowy', temp: 0, condition: 'Snow' },
    { id: 'stormy', label: '⛈️ Stormy', temp: 20, condition: 'Thunderstorm' },
    { id: 'windy', label: '💨 Windy', temp: 22, condition: 'Wind' },
  ];

  const startNewRound = () => {
    setGameState('playing');
    setPrediction(null);
    setFeedback(null);
    setActualWeather(null);
    setShowConfetti(false);
    
    const current = currentWeather;
    if (current) {
      const randomIndex = Math.floor(Math.random() * weatherOptions.length);
      setPrediction(weatherOptions[randomIndex]);
    }
  };

  const makePrediction = (selected) => {
    setPrediction(selected);
    
    const actualIndex = Math.floor(Math.random() * weatherOptions.length);
    const actual = weatherOptions[actualIndex];
    setActualWeather(actual);
    
    const isCorrect = selected.id === actual.id;
    
    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback({
        correct: true,
        message: `🎉 Amazing! You predicted correctly! +${points} points!`,
        emoji: '🌟'
      });
      setShowConfetti(true);
      
      if (score + points > highScore) {
        setHighScore(score + points);
        localStorage.setItem('weatherGameHighScore', String(score + points));
      }
    } else {
      setStreak(0);
      setFeedback({
        correct: false,
        message: `❌ Oops! Tomorrow will be ${actual.label} instead. Keep trying!`,
        emoji: '💪'
      });
    }
    
    setGameState('result');
  };

  const resetGame = () => {
    setGameState('idle');
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setShowConfetti(false);
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: Math.random() * window.innerWidth, y: -20 }}
              animate={{ y: window.innerHeight + 20 }}
              transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              className="absolute text-2xl"
              style={{ left: Math.random() * 100 + '%' }}
            >
              {['🎉', '⭐', '🌟', '🎊', '✨', '💫'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Weather Prediction Game</h3>
            <p className="text-xs text-gray-500">Predict tomorrow's weather!</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-500">Score</div>
            <div className="text-lg font-bold text-purple-500">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Streak</div>
            <div className="text-lg font-bold text-orange-500">🔥 {streak}</div>
          </div>
          {highScore > 0 && (
            <div className="text-center">
              <div className="text-xs text-gray-500">High Score</div>
              <div className="text-lg font-bold text-yellow-500">🏆 {highScore}</div>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        {gameState === 'idle' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h4 className="text-xl font-bold mb-2">Predict Tomorrow's Weather</h4>
            <p className="text-sm text-gray-500 mb-6">
              Use your weather knowledge to predict what the weather will be like tomorrow!
              <br />Earn points for each correct prediction!
            </p>
            <button
              onClick={startNewRound}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              Start Game
            </button>
          </motion.div>
        ) : gameState === 'playing' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4"
          >
            <div className="text-center mb-6">
              <div className="text-sm text-gray-500">Today's Weather</div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">
                  {currentWeather?.icon === '01d' ? '☀️' : 
                   currentWeather?.icon === '02d' ? '⛅' : '🌤️'}
                </span>
                <span className="text-2xl font-bold">{currentWeather?.temperature || '--'}°C</span>
                <span className="text-sm text-gray-500">{currentWeather?.condition?.main || '--'}</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-sm font-medium text-purple-500">What will tomorrow bring?</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {weatherOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => makePrediction(option)}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 hover:border-purple-500/30 text-center"
                >
                  <div className="text-3xl mb-1">{option.label}</div>
                  <div className="text-sm text-gray-400">{option.temp}°C</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center"
          >
            <div className="text-6xl mb-3">{feedback?.emoji}</div>
            <h4 className={`text-xl font-bold mb-2 ${feedback?.correct ? 'text-green-500' : 'text-red-500'}`}>
              {feedback?.correct ? 'Correct! 🎉' : 'Not quite! 💪'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {feedback?.message}
            </p>

            {actualWeather && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="text-sm text-gray-500">Tomorrow's Weather</div>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-4xl">{actualWeather.label}</span>
                  <span className="text-lg font-bold">{actualWeather.temp}°C</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={startNewRound}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Next Round
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span>Best Score: {highScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3 h-3 text-purple-500" />
            <span>Current Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-orange-500" />
            <span>Streak: {streak} 🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}