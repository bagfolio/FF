import axios from 'axios';

// Determine base URL based on environment
const getBaseURL = () => {
  // In development, Vite proxy handles /api routes
  if (process.env.NODE_ENV === 'development') {
    return '';
  }
  
  // In production, use relative URLs
  // This ensures it works regardless of the domain
  return window.location.origin;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000,
});

// Add request interceptor for debugging and CSRF tokens
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  (error: any) => {
    // Log errors for debugging
    if (error.response) {
      console.error(`[API] Error ${error.response.status} from ${error.config?.url}:`, error.response.data);
    } else if (error.request) {
      console.error('[API] No response received:', error.request);
    } else {
      console.error('[API] Request setup error:', error.message);
    }
    
    // Let individual components handle errors
    // to avoid redirect loops
    return Promise.reject(error);
  }
);