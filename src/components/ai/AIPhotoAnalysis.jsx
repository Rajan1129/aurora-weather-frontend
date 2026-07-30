import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, X, ScanEye, Cloud, 
  Thermometer, Wind, Droplets, Sun,
  Sparkles, Loader
} from 'lucide-react';

export function AIPhotoAnalysis() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const analyzeWeather = (imageData) => {
    setLoading(true);
    
    setTimeout(() => {
      const mockAnalysis = {
        weather: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Foggy'][Math.floor(Math.random() * 5)],
        temperature: Math.round(15 + Math.random() * 20),
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(2 + Math.random() * 15),
        cloudCover: Math.round(Math.random() * 100),
        visibility: Math.round(5 + Math.random() * 10),
        confidence: Math.round(70 + Math.random() * 25),
        description: 'AI has analyzed the image and detected weather patterns.',
        recommendations: [
          'Wear comfortable clothing',
          'Stay hydrated',
          'Check UV index'
        ],
        timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'][Math.floor(Math.random() * 4)],
        season: ['Spring', 'Summer', 'Fall', 'Winter'][Math.floor(Math.random() * 4)],
      };
      
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        analyzeWeather(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        analyzeWeather(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    setImage(imageData);
    analyzeWeather(imageData);
    setShowCamera(false);
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const clearImage = () => {
    setImage(null);
    setAnalysis(null);
    setShowCamera(false);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
          <ScanEye className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">AI Photo Analysis</h3>
          <p className="text-xs text-gray-500">Upload a photo to analyze weather conditions</p>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {!image ? (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-colors
            ${dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300 dark:border-gray-600'}
          `}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Drop your weather photo here</p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      ) : showCamera ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-[400px] rounded-xl object-cover"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={capturePhoto}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Capture
            </button>
            <button
              onClick={() => {
                setShowCamera(false);
                const stream = videoRef.current?.srcObject;
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="relative">
            <img src={image} alt="Weather" className="w-full max-h-[400px] rounded-xl object-cover" />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">AI is analyzing the image...</p>
              </div>
            </div>
          ) : analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Sparkles className="w-4 h-4" />
                <span>AI Analysis Complete</span>
                <span className="text-xs text-gray-500">
                  Confidence: {analysis.confidence}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-gray-500">Weather</div>
                  <div className="font-medium">{analysis.weather}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-gray-500">Temperature</div>
                  <div className="font-medium">{analysis.temperature}°C</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-gray-500">Humidity</div>
                  <div className="font-medium">{analysis.humidity}%</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-gray-500">Wind Speed</div>
                  <div className="font-medium">{analysis.windSpeed} km/h</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.description}</p>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">AI Recommendations</div>
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>•</span> {rec}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 text-xs text-gray-500">
                <span>Time: {analysis.timeOfDay}</span>
                <span>Season: {analysis.season}</span>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}