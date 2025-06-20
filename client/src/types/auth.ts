export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  userType: 'athlete' | 'scout' | 'admin' | null;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastLoginAt: Date | string | null;
  roleData?: AthleteProfile | ScoutProfile | null;
}

export interface AthleteProfile {
  id: number;
  userId: string;
  fullName: string;
  birthDate: string;
  cpf: string | null;
  city: string;
  state: string;
  phone: string | null;
  parentPhone: string | null;
  parentEmail: string | null;
  position: string;
  secondaryPosition: string | null;
  dominantFoot: 'left' | 'right' | 'both';
  height: number | null;
  weight: number | null;
  currentTeam: string | null;
  verificationLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  profileComplete: boolean;
  parentalConsent: boolean;
  skillsAssessment: any;
  skillsUpdatedAt: Date | string | null;
  skillsVerified: boolean;
  skillsVerificationDate: Date | string | null;
  skillsVerifiedBy: string | null;
}

export interface ScoutProfile {
  id: number;
  userId: string;
  fullName: string;
  club: string;
  position: string;
  licenseNumber: string | null;
  phone: string;
  city: string;
  state: string;
  profileVerified: boolean;
}