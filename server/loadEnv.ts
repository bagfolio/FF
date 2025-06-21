import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

// Determine which env file to load based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFiles = [];

// Priority order: .env.{NODE_ENV}.local, .env.{NODE_ENV}, .env.local, .env
if (nodeEnv === 'production') {
  // In production, only load production-specific files
  envFiles.push('.env.production.local', '.env.production');
} else if (nodeEnv === 'test') {
  // In test, load test-specific files
  envFiles.push('.env.test.local', '.env.test');
} else {
  // In development, load development files and .env.local
  envFiles.push('.env.development.local', '.env.development', '.env.local');
}

// Always load .env as fallback
envFiles.push('.env');

// Load environment variables from the first file that exists
let loaded = false;
for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), envFile);
  
  if (existsSync(envPath)) {
    const result = config({ path: envPath });
    
    if (result.error) {
      console.error(`Error loading ${envFile}:`, result.error);
    } else {
      console.log(`Loaded environment variables from ${envFile}`);
      loaded = true;
      break; // Stop after loading the first valid file
    }
  }
}

if (!loaded) {
  console.log('No environment file found, using system environment variables');
}

// Export a function to check if environment is properly loaded
export function checkEnvLoaded() {
  console.log('Environment check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', process.env.PORT || '5000 (default)');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Not set');
  console.log('- SESSION_SECRET:', process.env.SESSION_SECRET ? '✓ Set' : '✗ Not set');
  
  // Security check - NEVER log BYPASS_AUTH in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('- BYPASS_AUTH:', process.env.BYPASS_AUTH || 'false');
  }
}