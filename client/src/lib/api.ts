import axios from 'axios';

export const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle CSRF tokens if needed
api.interceptors.request.use((config) => {
  // You can add CSRF token here if needed
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);