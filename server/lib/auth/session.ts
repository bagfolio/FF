import type { Request, Response } from 'express';
import { storage } from '../../storage';

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Consolidated authentication utilities for consistent auth handling
 * across all API routes in the Revela platform
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  userType?: 'athlete' | 'scout' | 'admin';
  emailVerified?: boolean;
}

export interface UserWithProfile {
  user: AuthenticatedUser;
  athlete?: any;
  scout?: any;
  profileType: 'athlete' | 'scout' | null;
}

/**
 * Get authenticated user ID from request
 * Handles both OAuth and development bypass auth
 */
export async function getAuthenticatedUserId(req: any): Promise<string> {
  // Check if we're in development mode with bypass auth
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // Use the simulated user from the auth middleware
    if (req.user?.claims?.sub) {
      // Ensure the dev user exists in the database
      let user = await storage.getUser(req.user.claims.sub);
      if (!user) {
        // Create the dev user if it doesn't exist
        user = await storage.createUser({
          id: req.user.claims.sub,
          email: req.user.claims.email || "dev@futebol-futuro.com",
          firstName: req.user.claims.first_name || "Dev",
          lastName: req.user.claims.last_name || "User",
          profileImageUrl: req.user.claims.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          userType: null,
          emailVerified: true
        });
      }
      return user.id;
    }
    
    // Fallback: get or create a dev user
    const users = await storage.getAllUsers();
    if (users.length > 0) {
      return users[0].id;
    }
    
    // Create a development user if none exists
    const devUser = await storage.createUser({
      id: "dev-user-" + Date.now(),
      email: "dev@futebol-futuro.com",
      firstName: "Dev",
      lastName: "User",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      userType: null,
      emailVerified: true
    });
    
    return devUser.id;
  }
  
  // Check session-based auth (email/password)
  if (req.session?.userId) {
    return req.session.userId;
  }
  
  // Production: get user ID from authenticated session
  if (!req.user?.claims?.sub) {
    throw new Error("User not authenticated");
  }
  
  return req.user.claims.sub;
}

/**
 * Require authenticated user for API route
 * Throws 401 if not authenticated
 */
export async function requireAuth(req: Request): Promise<AuthenticatedUser> {
  try {
    const userId = await getAuthenticatedUserId(req);
    const user = await storage.getUser(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
      userType: user.userType || undefined,
      emailVerified: user.emailVerified || false,
    };
  } catch (error) {
    throw new AuthError('Unauthorized', 401);
  }
}

/**
 * Require authenticated user with profile (athlete or scout)
 * Throws 403 with redirect info if profile not found
 */
export async function requireProfile(req: Request): Promise<UserWithProfile> {
  const user = await requireAuth(req);
  
  // Check for athlete profile
  const athlete = await storage.getAthleteByUserId(user.id);
  
  // Check for scout profile
  const scout = await storage.getScoutByUserId(user.id);
  
  if (!athlete && !scout) {
    throw new AuthError('Profile required', 403, {
      error: 'PROFILE_REQUIRED',
      message: 'Complete your profile to continue',
      redirectTo: '/auth/welcome'
    });
  }
  
  return {
    user,
    athlete: athlete || undefined,
    scout: scout || undefined,
    profileType: athlete ? 'athlete' : scout ? 'scout' : null
  };
}

/**
 * Require specific user type (athlete or scout)
 * Throws 403 if user doesn't have the required profile type
 */
export async function requireUserType(req: Request, userType: 'athlete' | 'scout'): Promise<UserWithProfile> {
  const profile = await requireProfile(req);
  
  if (profile.profileType !== userType) {
    throw new AuthError('Wrong user type', 403, {
      error: 'WRONG_USER_TYPE',
      message: `This action requires ${userType} access`,
      currentType: profile.profileType,
      redirectTo: profile.profileType ? `/${profile.profileType}/dashboard` : '/auth/welcome'
    });
  }
  
  return profile;
}

/**
 * Check if user has active subscription
 * Returns subscription info or null
 */
export async function checkSubscription(userId: string) {
  const subscription = await storage.getUserSubscription(userId);
  
  if (!subscription) {
    return null;
  }
  
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';
  const plan = await storage.getSubscriptionPlan(subscription.planId);
  
  return {
    subscription,
    plan,
    isActive,
    isPro: isActive && plan?.name !== 'basic',
    isElite: isActive && plan?.name === 'elite',
    canAccessScouts: isActive && (plan?.scoutVisibility || false),
    remainingTests: plan?.verificationTests || 0,
  };
}

/**
 * Middleware to handle auth errors consistently
 */
export function handleAuthError(error: any, req: Request, res: Response) {
  if (error instanceof AuthError) {
    // Custom auth errors with specific status and data
    if (error.data) {
      res.status(error.status).json(error.data);
    } else {
      res.status(error.status).json({ message: error.message });
    }
  } else if (error.message === 'Unauthorized' || error.message === 'User not authenticated') {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    // Log error for debugging but don't expose details
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}