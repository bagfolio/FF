// Type definitions for the Journey page

export interface AthleteProfile {
  id: number;
  userId: string;
  fullName: string;
  birthDate: string;
  position: string;
  city: string;
  state: string;
  height?: number;
  weight?: number;
  currentTeam?: string;
  verificationLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  skillsAssessment?: SkillsAssessment;
  createdAt: string;
  updatedAt: string;
}

export interface SkillsAssessment {
  speed?: SkillData;
  strength?: SkillData;
  technique?: SkillData;
  stamina?: SkillData;
}

export interface SkillData {
  id: string;
  name: string;
  data: {
    sliderValue?: number;
    selfRating?: string;
    comparison?: string;
    skills?: Record<string, number>;
    duration?: string;
    recovery?: string;
  };
}

export interface AthleteStats {
  profileViews: number;
  scoutViews: number;
  testsCompleted: number;
  streakDays: number;
  percentile: number;
  profileCompletion: number;
  achievements?: number;
}

export interface DashboardData {
  athlete?: AthleteProfile;
  stats?: AthleteStats;
  achievements?: Achievement[];
  activities?: Activity[];
  recentViews?: any[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  points: number;
  unlockedAt: string;
  type: string;
}

export interface Activity {
  id: string;
  type: 'view' | 'achievement' | 'test' | 'update' | 'rank' | 'social' | 'system';
  title: string;
  message: string;
  time: string;
  date: string;
  createdAt: string;
  metadata?: {
    xpEarned?: number;
    viewCount?: number;
    percentile?: number;
  };
}

export interface JourneyMilestone {
  id: string;
  type: 'achievement' | 'test' | 'rank';
  title: string;
  description: string;
  date: string;
  icon: string;
  color: 'amarelo' | 'verde' | 'azul';
}

export interface SkillProgress {
  name: string;
  current: number;
  previous: number;
  improvement: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: 'verde' | 'amarelo' | 'azul';
}