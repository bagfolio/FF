import { API_CONFIG } from '@/config/api';
import { apiRequest } from '@/lib/queryClient';

// Activity Service
export const activityService = {
  async getAthleteActivities(athleteId: string, filters?: { type?: string; date?: string }) {
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters?.date && filters.date !== 'all') params.append('date', filters.date);
    
    const url = `${API_CONFIG.ENDPOINTS.ATHLETES.ACTIVITIES(athleteId)}${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url, { credentials: 'include' });
    
    if (!response.ok) {
      // Return empty array if no activities found
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async getSocialProofNotifications() {
    const response = await fetch(API_CONFIG.ENDPOINTS.NOTIFICATIONS.SOCIAL_PROOF, { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      // Return empty array if no notifications
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Achievement Service
export const achievementService = {
  async getAthleteAchievements(athleteId: string) {
    const response = await fetch(API_CONFIG.ENDPOINTS.ATHLETES.ACHIEVEMENTS(athleteId), { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      // Return empty array if no achievements found
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch achievements: ${response.statusText}`);
    }
    
    const achievements = await response.json();
    
    // Map iconKey to actual icon names for the frontend
    return achievements.map((achievement: any) => ({
      ...achievement,
      iconKey: achievement.icon || 'trophy', // Default to trophy if no icon specified
    }));
  },
};

// Performance Service
export const performanceService = {
  async getPerformanceHistory(athleteId: string) {
    const response = await fetch(API_CONFIG.ENDPOINTS.ATHLETES.PERFORMANCE_HISTORY(athleteId), { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      // Return empty array if no history found
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch performance history: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async getPerformanceMetrics(athleteId: string) {
    const response = await fetch(API_CONFIG.ENDPOINTS.ATHLETES.PERFORMANCE_METRICS(athleteId), { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      // Return default metrics if not found
      if (response.status === 404) {
        return {
          strength: 0,
          mental: 0,
        };
      }
      throw new Error(`Failed to fetch performance metrics: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Scout Service
export const scoutService = {
  async getScoutStats(scoutId: string) {
    const response = await fetch(API_CONFIG.ENDPOINTS.SCOUTS.STATS(scoutId), { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      // Return default stats if not found
      if (response.status === 404) {
        return {
          athletesDiscovered: 0,
          profilesViewed: 0,
          newTalentsThisWeek: 0,
          contactsMade: 0,
        };
      }
      throw new Error(`Failed to fetch scout stats: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async getRecentAthletes() {
    const response = await fetch(API_CONFIG.ENDPOINTS.ATHLETES.RECENT, { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      // Return empty array if no recent athletes
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch recent athletes: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Daily Check-in Service
export const checkinService = {
  async submitCheckin(data: any) {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.CHECKIN.SUBMIT, data);
  },
  
  async getCheckinHistory(athleteId: string) {
    const response = await fetch(API_CONFIG.ENDPOINTS.CHECKIN.HISTORY(athleteId), { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      // Return empty array if no history
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch checkin history: ${response.statusText}`);
    }
    
    return response.json();
  },
};