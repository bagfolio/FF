import { db } from '../db';
import { users, athletes, scouts, passwordResetTokens, rememberMeTokens } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { hashPassword, verifyPassword, generateSecureToken, generateRememberMeToken } from '../utils/password';
import { isMinor } from '../utils/validation';
import { emailService } from './email.service';
import type { User, InsertAthlete, InsertScout } from '../../shared/schema';

export interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'athlete' | 'scout';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export class AuthService {
  // Register a new user
  async register(data: RegisterUserData): Promise<User> {
    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Este email já está cadastrado');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Generate email verification token
    const emailVerificationToken = generateSecureToken();
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24); // 24 hour expiry

    // Create user
    const [newUser] = await db.insert(users).values({
      id: `user_${nanoid()}`,
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      userType: data.userType,
      emailVerificationToken,
      emailVerificationExpires,
      emailVerified: false
    }).returning();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        newUser.email,
        `${newUser.firstName} ${newUser.lastName}`,
        emailVerificationToken
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
    }

    return newUser;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User; rememberMeToken?: string }> {
    // Find user by email
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, credentials.email.toLowerCase()))
      .limit(1);

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    // Check password
    if (!user.passwordHash) {
      throw new Error('Por favor, faça login com sua conta social');
    }

    const isValid = await verifyPassword(credentials.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Email ou senha incorretos');
    }

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Generate remember me token if requested
    let rememberMeToken: string | undefined;
    if (credentials.rememberMe) {
      rememberMeToken = generateRememberMeToken();
      const expires = new Date();
      expires.setDate(expires.getDate() + 30); // 30 days

      await db.insert(rememberMeTokens).values({
        userId: user.id,
        token: rememberMeToken,
        expires
      });
    }

    return { user, rememberMeToken };
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    const [user] = await db.select()
      .from(users)
      .where(and(
        eq(users.emailVerificationToken, token),
        eq(users.emailVerified, false)
      ))
      .limit(1);

    if (!user) {
      throw new Error('Token de verificação inválido');
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      throw new Error('Token de verificação expirado');
    }

    await db.update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      })
      .where(eq(users.id, user.id));
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const token = generateSecureToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expires
    });

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        token
      );
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const [resetToken] = await db.select()
      .from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false)
      ))
      .limit(1);

    if (!resetToken) {
      throw new Error('Token de redefinição inválido');
    }

    if (resetToken.expires < new Date()) {
      throw new Error('Token de redefinição expirado');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user password
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.id, resetToken.userId));

    // Mark token as used
    await db.update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id));

    // Invalidate all remember me tokens for security
    await db.delete(rememberMeTokens)
      .where(eq(rememberMeTokens.userId, resetToken.userId));
  }

  // Validate remember me token
  async validateRememberMeToken(token: string): Promise<User | null> {
    const [rememberToken] = await db.select()
      .from(rememberMeTokens)
      .where(eq(rememberMeTokens.token, token))
      .limit(1);

    if (!rememberToken || rememberToken.expires < new Date()) {
      return null;
    }

    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, rememberToken.userId))
      .limit(1);

    return user || null;
  }

  // Create athlete profile
  async createAthleteProfile(userId: string, data: InsertAthlete): Promise<void> {
    // Check if user is minor
    const isUserMinor = isMinor(data.birthDate);
    
    await db.insert(athletes).values({
      ...data,
      userId,
      parentalConsent: isUserMinor ? false : true,
      profileComplete: false
    });
  }

  // Create scout profile
  async createScoutProfile(userId: string, data: InsertScout): Promise<void> {
    await db.insert(scouts).values({
      ...data,
      userId,
      verifiedScout: false
    });
  }

  // Logout (cleanup tokens)
  async logout(userId: string): Promise<void> {
    // Remove all remember me tokens
    await db.delete(rememberMeTokens)
      .where(eq(rememberMeTokens.userId, userId));
  }
}