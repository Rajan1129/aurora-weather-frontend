import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSpinner({ fullScreen = false, text = 'Loading...' }) {
  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-gray-600 dark:text-gray-400">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}