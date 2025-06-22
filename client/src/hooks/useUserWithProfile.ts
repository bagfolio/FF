import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';
import type { User } from '@/types/auth';

interface UserProfile {
  user: User | null;
  profile: any | null;
  loading: boolean;
  hasProfile: boolean;
  isAthlete: boolean;
  isScout: boolean;
  profileType: 'athlete' | 'scout' | null;
}

/**
 * Hook that combines user authentication with profile data
 * Handles race conditions and provides unified loading state
 */
export function useUserWithProfile(): UserProfile {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch profile data when user is authenticated
  const { data: profileData, isLoading: queryLoading } = useQuery({
    queryKey: ['/api/user/profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // The /api/auth/user endpoint already returns roleData
      // which contains the profile information
      return user.roleData || null;
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (!authLoading) {
      if (user && user.roleData !== undefined) {
        // User data includes profile information
        setProfile(user.roleData);
        setProfileLoading(false);
      } else if (!user) {
        // No user, no profile
        setProfile(null);
        setProfileLoading(false);
      } else if (user && !queryLoading) {
        // User exists but profile data from separate query
        setProfile(profileData || null);
        setProfileLoading(false);
      }
    }
  }, [user, authLoading, profileData, queryLoading]);

  // Determine profile type
  const profileType = user?.userType || null;
  const hasProfile = !!profile && !!profileType;
  const isAthlete = profileType === 'athlete' && !!profile;
  const isScout = profileType === 'scout' && !!profile;

  return {
    user: user || null,
    profile,
    loading: authLoading || profileLoading,
    hasProfile,
    isAthlete,
    isScout,
    profileType,
  };
}

/**
 * Hook that requires a specific user type
 * Useful for pages that should only be accessed by athletes or scouts
 */
export function useRequireUserType(requiredType: 'athlete' | 'scout') {
  const { user, profile, loading, profileType } = useUserWithProfile();
  
  const hasAccess = profileType === requiredType;
  const isWrongType = !loading && profileType && profileType !== requiredType;
  const needsProfile = !loading && user && !profileType;
  
  return {
    user,
    profile,
    loading,
    hasAccess,
    isWrongType,
    needsProfile,
    redirectTo: isWrongType ? `/${profileType}/dashboard` : needsProfile ? '/auth/welcome' : null,
  };
}