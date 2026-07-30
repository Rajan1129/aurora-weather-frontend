import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  variant = 'glass',
  padding = 'p-4',
  onClick = null,
  animate = true,
  ...props 
}) => {
  const baseStyles = 'rounded-xl transition-all duration-300';
  
  const variants = {
    glass: 'backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-xl',
    glassDark: 'backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl',
    solid: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
    outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
  };

  const cardClasses = `${baseStyles} ${variants[variant] || variants.glass} ${padding} ${className}`;

  const content = (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full text-left"
      >
        {content}
      </motion.button>
    );
  }

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;