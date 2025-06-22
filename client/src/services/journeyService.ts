import { API_CONFIG } from '@/config/api';

export const journeyService = {
  async getJourneyOverview(athleteId: string) {
    // For now, aggregate existing endpoints
    // In the future, this will be a dedicated endpoint
    try {
      const [athleteRes, dashboardRes, activitiesRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/athletes/${athleteId}`, { credentials: 'include' }),
        fetch(`${API_CONFIG.BASE_URL}/dashboard/athlete`, { credentials: 'include' }),
        fetch(`${API_CONFIG.BASE_URL}/athletes/${athleteId}/activities?limit=10`, { credentials: 'include' })
      ]);
      
      // Handle each response
      const athlete = athleteRes.ok ? await athleteRes.json() : null;
      const dashboard = dashboardRes.ok ? await dashboardRes.json() : null;
      const activities = activitiesRes.ok ? await activitiesRes.json() : [];
      
      return {
        athlete,
        stats: dashboard?.stats || {},
        achievements: dashboard?.achievements || [],
        recentActivities: activities
      };
    } catch (error) {
      return {
        athlete: null,
        stats: {},
        achievements: [],
        recentActivities: []
      };
    }
  },
  
  async getJourneyTimeline(athleteId: string, filters?: { 
    startDate?: string; 
    endDate?: string; 
    type?: string; 
  }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.type) params.append('type', filters.type);
    
    const url = `${API_CONFIG.BASE_URL}/athletes/${athleteId}/timeline${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url, { credentials: 'include' });
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch timeline: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async getSkillsEvolution(athleteId: string) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/athletes/${athleteId}/skills-evolution`, { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch skills evolution: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async getCareerHighlights(athleteId: string) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/athletes/${athleteId}/highlights`, { 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch career highlights: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async exportJourneyPDF(athleteId: string) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/athletes/${athleteId}/journey/export`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to export journey: ${response.statusText}`);
    }
    
    // Return blob for download
    return response.blob();
  },
  
  async shareJourney(athleteId: string, options?: {
    includeStats?: boolean;
    includeAchievements?: boolean;
    includeTests?: boolean;
  }) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/athletes/${athleteId}/journey/share`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options || {})
    });
    
    if (!response.ok) {
      throw new Error(`Failed to share journey: ${response.statusText}`);
    }
    
    // Return shareable link
    return response.json();
  }
};