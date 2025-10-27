// API Configuration for Todo App
// This file manages API endpoints for different environments

// Define environment modes
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

// Current environment - change this to switch between local and production
// Set to 'production' to use deployed API, 'development' for localhost
const CURRENT_ENV = ENV.PRODUCTION;

// API endpoint configurations for each environment
const API_CONFIG = {
  [ENV.DEVELOPMENT]: {
    API_URL: 'http://localhost:3000/todos',
    SOCKET_URL: 'http://localhost:3000',
    name: 'Local Development',
  },
  [ENV.PRODUCTION]: {
    API_URL: 'https://todolist.220fii1j0spm.us-south.codeengine.appdomain.cloud/todos',
    SOCKET_URL: 'https://todolist.220fii1j0spm.us-south.codeengine.appdomain.cloud',
    name: 'Production (IBM Code Engine)',
  },
};

// Export current environment configuration
export const API_URL = API_CONFIG[CURRENT_ENV].API_URL;
export const SOCKET_URL = API_CONFIG[CURRENT_ENV].SOCKET_URL;
export const ENVIRONMENT_NAME = API_CONFIG[CURRENT_ENV].name;

// Export utility to check current environment
export const isDevelopment = () => CURRENT_ENV === ENV.DEVELOPMENT;
export const isProduction = () => CURRENT_ENV === ENV.PRODUCTION;
