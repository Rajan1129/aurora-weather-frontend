import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';
import { 
  Mic, MicOff, Volume2, VolumeX, 
  Play, Pause, Sparkles, Brain,
  MessageCircle, Send
} from 'lucide-react';

export function VoiceWeatherAssistant() {
  const { currentWeather, selectedLocation, fetchWeather } = useWeather();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
        
        if (event.results[0].isFinal) {
          handleVoiceCommand(transcript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
        setTranscript('Listening...');
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const handleVoiceCommand = async (command) => {
    setIsLoading(true);
    const lowerCommand = command.toLowerCase();
    let reply = '';

    setConversation(prev => [...prev, { role: 'user', content: command }]);

    if (lowerCommand.includes('weather') || lowerCommand.includes('temperature')) {
      const temp = currentWeather?.temperature || 'unknown';
      const condition = currentWeather?.condition?.main || 'clear';
      reply = `The current weather in ${selectedLocation.city} is ${temp}°C with ${condition}. ${getWeatherAdvice(temp)}`;
    } else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      reply = `Hello! I'm your weather assistant. How can I help you today?`;
    } else if (lowerCommand.includes('forecast')) {
      reply = `The forecast for today shows ${currentWeather?.condition?.main || 'clear'} conditions with a high of ${currentWeather?.temperature || 'unknown'}°C.`;
    } else if (lowerCommand.includes('humidity')) {
      reply = `The humidity is currently ${currentWeather?.humidity || 'unknown'}%.`;
    } else if (lowerCommand.includes('wind')) {
      reply = `Wind speed is ${currentWeather?.windSpeed || 'unknown'} kilometers per hour.`;
    } else if (lowerCommand.includes('rain') || lowerCommand.includes('umbrella')) {
      const rainChance = currentWeather?.rainProbability || 0;
      if (rainChance > 50) {
        reply = `There's a ${Math.round(rainChance)}% chance of rain. Don't forget your umbrella!`;
      } else {
        reply = `No rain expected today. You won't need an umbrella!`;
      }
    } else if (lowerCommand.includes('thanks') || lowerCommand.includes('thank')) {
      reply = `You're welcome! Is there anything else I can help you with?`;
    } else if (lowerCommand.includes('help')) {
      reply = `You can ask me about the weather, temperature, humidity, wind, rain, or just say hello!`;
    } else {
      reply = `I'm not sure about that. I can tell you about the weather, temperature, humidity, wind, or rain. How can I help?`;
    }

    setResponse(reply);
    setConversation(prev => [...prev, { role: 'assistant', content: reply }]);
    speak(reply);
    setTranscript('');
    setIsLoading(false);
  };

  const getWeatherAdvice = (temp) => {
    if (temp > 30) return 'It\'s quite hot today. Stay hydrated and wear sunscreen!';
    if (temp > 25) return 'It\'s warm today. Perfect weather for outdoor activities!';
    if (temp > 15) return 'The weather is pleasant. Enjoy your day!';
    if (temp > 5) return 'It\'s a bit cool. You might want to wear a jacket.';
    return 'It\'s cold today. Bundle up and stay warm!';
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse('');
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Voice Weather Assistant</h3>
            <p className="text-xs text-gray-500">
              {isListening ? '🎤 Listening...' : 'Click the mic to speak'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`
              p-3 rounded-full transition-all
              ${isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
              }
            `}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => speak(response)}
            disabled={!response}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            {isSpeaking ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {transcript && (
        <div className="mb-4 p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-500">🎤</span>
            <span>{transcript}</span>
          </div>
        </div>
      )}

      <div className="max-h-[300px] overflow-y-auto space-y-3 mb-4">
        {conversation.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎙️</div>
            <p className="text-sm text-gray-500">Click the mic and ask me about the weather!</p>
            <p className="text-xs text-gray-400 mt-2">
              Try saying: "What's the weather today?" or "Do I need an umbrella?"
            </p>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {['Weather', 'Temperature', 'Humidity', 'Wind', 'Rain', 'Help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleVoiceCommand(cmd.toLowerCase())}
            className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {cmd}
          </button>
        ))}
        <button
          onClick={clearConversation}
          className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}