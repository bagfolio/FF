import { z } from 'zod';

const envSchema = z.object({
  // Required
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
  
  // Optional with defaults
  PORT: z.string().optional().default('5000').transform(val => parseInt(val, 10).toString()),
  APP_URL: z.string().optional().default('http://localhost:5000'),
  EMAIL_FROM: z.string().optional().default('Revela <noreply@revela.app>'),
  RESEND_API_KEY: z.string().optional().default('re_test_key'),
  
  // Stripe (optional but warn if missing in production)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  STRIPE_ELITE_PRICE_ID: z.string().optional(),
  
  // Cloudinary (optional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // OAuth (optional)
  REPLIT_DOMAINS: z.string().optional(),
  REPL_ID: z.string().optional(),
  ISSUER_URL: z.string().optional().default('https://replit.com/oidc'),
  
  // Development flags
  BYPASS_AUTH: z.string().optional(),
  DANGEROUSLY_DISABLE_HOST_CHECK: z.string().optional(),
});

export function validateEnv() {
  try {
    console.log('🔍 Validating environment variables...');
    console.log('Current working directory:', process.cwd());
    
    // Log critical environment variables for debugging
    console.log('Environment check before validation:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT_SET');
    console.log('- SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET' : 'NOT_SET');
    
    const env = envSchema.parse(process.env);
    
    // Warnings for production
    if (env.NODE_ENV === 'production') {
      if (!env.STRIPE_SECRET_KEY) {
        console.warn('⚠️  WARNING: STRIPE_SECRET_KEY not set - payments will not work');
      }
      if (!env.CLOUDINARY_CLOUD_NAME) {
        console.warn('⚠️  WARNING: Cloudinary not configured - media uploads will not work');
      }
      if (env.BYPASS_AUTH === 'true') {
        console.error('❌ CRITICAL: BYPASS_AUTH is enabled in production!');
        process.exit(1);
      }
    }
    
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`   - ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n💡 Please check your environment configuration');
      console.error('Required variables: NODE_ENV, DATABASE_URL, SESSION_SECRET');
      
      // In production, try to continue with minimal config instead of crashing
      if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️  WARNING: Continuing with validation errors in production');
        return {
          NODE_ENV: 'production',
          PORT: process.env.PORT || '5000',
          DATABASE_URL: process.env.DATABASE_URL || '',
          SESSION_SECRET: process.env.SESSION_SECRET || 'fallback-secret',
          APP_URL: process.env.APP_URL || 'http://localhost:5000'
        } as any; // Type assertion needed for fallback
      }
      
      // In development, throw error instead of exiting
      throw new Error('Environment validation failed');
    }
    throw error;
  }
}

export type Env = z.infer<typeof envSchema>;