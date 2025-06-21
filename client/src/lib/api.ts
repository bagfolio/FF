import axios from 'axios';

// In development, ensure we're making requests to the correct origin
const baseURL = process.env.NODE_ENV === 'development' ? '' : '';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000,
});

// Add request interceptor to handle CSRF tokens if needed
api.interceptors.request.use((config) => {
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    // Let individual components handle 401 errors
    // to avoid redirect loops
    return Promise.reject(error);
  }
);