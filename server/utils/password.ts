import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';

// Password validation schema - Brazilian Portuguese messages
export const passwordSchema = z.string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure token for email verification, password reset, etc.
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate numeric code for 2FA or verification
export function generateVerificationCode(length: number = 6): string {
  return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
}

// Generate remember me token
export function generateRememberMeToken(): string {
  return crypto.randomBytes(64).toString('base64url');
}

// Check password strength
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score < 3) feedback.push('Senha muito fraca');
  else if (score < 4) feedback.push('Senha fraca');
  else if (score < 5) feedback.push('Senha média');
  else if (score < 6) feedback.push('Senha forte');
  else feedback.push('Senha muito forte');

  return { score, feedback };
}