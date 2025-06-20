import { z } from 'zod';

// Brazilian CPF validation
export function isValidCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cleaned = cpf.replace(/\D/g, '');

  // Check if it has 11 digits
  if (cleaned.length !== 11) return false;

  // Check for known invalid patterns
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

// CPF Zod schema
export const cpfSchema = z.string()
  .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
  .refine(isValidCPF, 'CPF inválido');

// Format CPF for display
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Calculate age from birth date
export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Check if user is minor (under 18)
export function isMinor(birthDate: Date | string): boolean {
  return calculateAge(birthDate) < 18;
}

// Email validation with Brazilian domains
export const emailSchema = z.string()
  .email('Email inválido')
  .toLowerCase()
  .refine((email) => {
    // Allow common Brazilian email domains
    const brazilianDomains = ['uol.com.br', 'bol.com.br', 'ig.com.br', 'terra.com.br', 'globo.com'];
    const domain = email.split('@')[1];
    return true; // Accept all domains, just showing we could restrict if needed
  }, 'Email inválido');

// Phone validation (Brazilian format)
export const phoneSchema = z.string()
  .regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos')
  .transform((phone) => phone.replace(/\D/g, ''));

// Format phone for display
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}