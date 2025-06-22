import { storage } from "../../storage";

export async function checkUserProfile(userId: string) {
  const athlete = await storage.getAthleteByUserId(userId);
  const scout = await storage.getScoutByUserId(userId);
  
  return {
    hasProfile: !!(athlete || scout),
    userType: athlete ? 'athlete' as const : scout ? 'scout' as const : null,
    profileData: athlete || scout || null,
    profileId: athlete?.id || scout?.id || null
  };
}

export async function requireProfile(userId: string) {
  const { hasProfile, userType, profileData } = await checkUserProfile(userId);
  
  if (!hasProfile) {
    throw new Error('Profile required');
  }
  
  return { userType, profileData };
}