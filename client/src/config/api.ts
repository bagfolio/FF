// API Configuration
export const API_CONFIG = {
  // Base API URL - can be overridden by environment variables
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      USER: '/auth/user',
      USER_TYPE: '/auth/user-type',
      LOGOUT: '/auth/logout',
    },
    
    // Athletes
    ATHLETES: {
      ME: '/athletes/me',
      LIST: '/athletes',
      RECENT: '/athletes/recent',
      BY_ID: (id: string) => `/athletes/${id}`,
      SKILLS: (id: string) => `/athletes/${id}/skills`,
      ACTIVITIES: (id: string) => `/athletes/${id}/activities`,
      ACHIEVEMENTS: (id: string) => `/athletes/${id}/achievements`,
      PERFORMANCE_HISTORY: (id: string) => `/athletes/${id}/performance-history`,
      PERFORMANCE_METRICS: (id: string) => `/athletes/${id}/performance-metrics`,
      STATS: (id: string) => `/athletes/${id}/stats`,
      DASHBOARD: (id: string) => `/athletes/${id}/dashboard`,
    },
    
    // Scouts
    SCOUTS: {
      ME: '/scouts/me',
      BY_ID: (id: string) => `/scouts/${id}`,
      STATS: (id: string) => `/scouts/${id}/stats`,
    },
    
    // Tests
    TESTS: {
      BY_ATHLETE: (athleteId: string) => `/tests/athlete/${athleteId}`,
      SUBMIT: '/tests/submit',
    },
    
    // Notifications
    NOTIFICATIONS: {
      SOCIAL_PROOF: '/notifications/social-proof',
      ATHLETE: (athleteId: string) => `/notifications/athlete/${athleteId}`,
    },
    
    // Daily Check-in
    CHECKIN: {
      SUBMIT: '/checkin/submit',
      HISTORY: (athleteId: string) => `/checkin/athlete/${athleteId}/history`,
    },
  },
  
  // Polling intervals (in milliseconds)
  POLLING: {
    SOCIAL_PROOF: 30000, // 30 seconds
    ACTIVITIES: 60000, // 1 minute
    STATS: 300000, // 5 minutes
  },
};

// Feature Flags
export const FEATURES = {
  // Enable/disable features
  SOCIAL_PROOF_NOTIFICATIONS: true,
  OFFLINE_MODE: true,
  DAILY_CHALLENGES: true,
  ACHIEVEMENTS_SYSTEM: true,
  SCOUT_SEARCH: true,
  
  // Development features
  DEBUG_MODE: import.meta.env.DEV,
  SHOW_TEST_PAGE: import.meta.env.DEV,
  
  // Limits
  MAX_PROFILE_VIDEOS: 10,
  MAX_ACHIEVEMENTS_DISPLAY: 9,
  ACTIVITIES_PER_PAGE: 20,
};

// Helper function to build full API URL
export function apiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}