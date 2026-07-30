import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, X, Maximize2, Minimize2, Settings } from 'lucide-react';

export function WidgetContainer({ 
  children, 
  title, 
  icon, 
  onRemove,
  onSettings,
  defaultSize = 'medium',
  className = ''
}) {
  const [size, setSize] = useState(defaultSize);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-3',
    full: 'col-span-full',
  };

  const handleSizeToggle = () => {
    const sizes = ['small', 'medium', 'large', 'full'];
    const currentIndex = sizes.indexOf(size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setSize(sizes[nextIndex]);
  };

  return (
    <motion.div
      layout
      className={`${sizeClasses[size]} ${className}`}
    >
      <div className="glass-card p-4 relative group">
        {/* Widget Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {icon && <div className="text-blue-500">{icon}</div>}
            <h4 className="font-medium text-sm">{title}</h4>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onSettings && (
              <button
                onClick={onSettings}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
            <button
              onClick={handleSizeToggle}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-red-400" />
              </button>
            )}
          </div>
        </div>

        {/* Widget Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </motion.div>
  );
}