import type { Request, Response, NextFunction } from "express";
import { checkUserProfile } from "./profile";

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ProfileError extends Error {
  constructor(message: string, public statusCode: number = 403) {
    super(message);
    this.name = 'ProfileError';
  }
}

export function requireAuth(handler: (req: any, res: Response) => Promise<void>) {
  return async (req: any, res: Response) => {
    try {
      if (!req.user?.claims?.sub) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await handler(req, res);
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function requireProfile(handler: (req: any, res: Response) => Promise<void>) {
  return async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const { hasProfile } = await checkUserProfile(userId);
      if (!hasProfile) {
        return res.status(403).json({ error: 'Profile required' });
      }
      
      await handler(req, res);
    } catch (error) {
      if (error instanceof ProfileError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}