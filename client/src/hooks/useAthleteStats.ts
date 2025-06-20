import { useQuery } from "@tanstack/react-query";

interface AthleteStats {
  // Basic stats from API
  profileViews: number;
  scoutViews: number;
  testsCompleted: number;
  streakDays: number;
  percentile: number;
  profileCompletion: number;
  
  // Calculated stats
  weeklyViews: number;
  weeklyAchievements: number;
  todayViews: number;
  totalXP: number;
  currentLevel: number;
  currentLevelXP: number;
  nextLevelXP: number;
  levelProgress: number;
}

export function useAthleteStats(athleteId?: string | number) {
  return useQuery<AthleteStats>({
    queryKey: ['/api/dashboard/athlete', athleteId],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/athlete');
      if (!response.ok) {
        throw new Error('Failed to fetch athlete stats');
      }
      
      const data = await response.json();
      
      // Calculate time-based stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Weekly views
      const weeklyViews = data.recentViews?.filter((v: any) => 
        new Date(v.viewedAt) > weekAgo
      ).length || 0;
      
      // Today's views
      const todayViews = data.recentViews?.filter((v: any) => 
        new Date(v.viewedAt) >= today
      ).length || 0;
      
      // Weekly achievements
      const weeklyAchievements = data.achievements?.filter((a: any) =>
        a.unlockedAt && new Date(a.unlockedAt) > weekAgo
      ).length || 0;
      
      // Calculate XP and levels
      const totalXP = data.achievements?.reduce((sum: number, a: any) => 
        sum + (a.points || 0), 0
      ) || 0;
      
      // Level calculation: 200 XP per level
      const XP_PER_LEVEL = 200;
      const currentLevel = Math.floor(totalXP / XP_PER_LEVEL);
      const currentLevelXP = totalXP % XP_PER_LEVEL;
      const nextLevelXP = XP_PER_LEVEL;
      const levelProgress = (currentLevelXP / nextLevelXP) * 100;
      
      return {
        // Spread existing stats
        ...data.stats,
        
        // Add calculated stats
        weeklyViews,
        weeklyAchievements,
        todayViews,
        totalXP,
        currentLevel,
        currentLevelXP,
        nextLevelXP,
        levelProgress
      };
    },
    enabled: !!athleteId,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}

// Hook to get just achievements data
export function useAthleteAchievements(athleteId?: string | number) {
  return useQuery({
    queryKey: ['/api/dashboard/athlete/achievements', athleteId],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/athlete');
      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }
      
      const data = await response.json();
      return data.achievements || [];
    },
    enabled: !!athleteId,
    refetchInterval: 30000,
  });
}

// Hook to get activity stats for a specific time period
export function useActivityStats(athleteId?: string | number, timeframe: 'today' | 'week' | 'month' = 'week') {
  return useQuery({
    queryKey: ['activity-stats', athleteId, timeframe],
    queryFn: async () => {
      // Fetch dashboard data for comprehensive stats
      const dashboardResponse = await fetch('/api/dashboard/athlete');
      if (!dashboardResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const dashboard = await dashboardResponse.json();
      
      // Fetch recent activities
      const activitiesResponse = await fetch(`/api/athletes/${athleteId}/activities?limit=100`);
      let activities = [];
      if (activitiesResponse.ok) {
        activities = await activitiesResponse.json();
      }
      
      // Calculate time boundaries
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Filter activities by timeframe
      const timeframeBoundary = timeframe === 'today' ? today : 
                               timeframe === 'week' ? weekAgo : monthAgo;
      
      const filteredActivities = activities.filter((a: any) => {
        // Parse activity date from formatted string
        if (a.date === 'Hoje') return timeframe === 'today' || timeframe === 'week';
        if (a.date === 'Ontem') return timeframe === 'week' || timeframe === 'month';
        return true; // Include all for now, better date parsing needed
      });
      
      // Count by type
      const viewsCount = filteredActivities.filter((a: any) => a.type === 'view').length;
      const achievementsCount = filteredActivities.filter((a: any) => a.type === 'achievement').length;
      const testsCount = filteredActivities.filter((a: any) => a.type === 'test').length;
      
      return {
        views: viewsCount,
        achievements: achievementsCount,
        tests: testsCount,
        totalActivities: filteredActivities.length,
        // Also include totals from dashboard
        totalTests: dashboard.stats?.testsCompleted || 0,
        totalAchievements: dashboard.achievements?.length || 0
      };
    },
    enabled: !!athleteId,
    refetchInterval: 30000,
  });
}