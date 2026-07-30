// client/src/config.js
// ==================== ENVIRONMENT CONFIGURATION ====================

// 🔄 CHANGE THIS TO SWITCH BETWEEN LOCAL AND PRODUCTION
// Set to true for Production, false for Local Development
const IS_PRODUCTION = true; // 👈 Change this to true when deploying

// ==================== URL CONFIGURATION ====================
const URLS = {
  production: {
    api: 'https://your-render-app.onrender.com', // Your Render backend URL
    frontend: 'https://your-vercel-app.vercel.app', // Your Vercel frontend URL
  },
  development: {
    api: 'http://localhost:5000',
    frontend: 'http://localhost:3000',
  }
};

// Get the current environment URLs
const currentEnv = IS_PRODUCTION ? 'production' : 'development';

export const API_URL = URLS[currentEnv].api;
export const FRONTEND_URL = URLS[currentEnv].frontend;
export const IS_PRODUCTION_MODE = IS_PRODUCTION;

// Export all config
export const config = {
  apiUrl: API_URL,
  frontendUrl: FRONTEND_URL,
  isProduction: IS_PRODUCTION_MODE,
  env: currentEnv,
};

export default config;