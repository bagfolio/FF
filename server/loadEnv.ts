import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

// Load environment variables from .env.local file
const envPath = path.resolve(process.cwd(), '.env.local');

if (existsSync(envPath)) {
  const result = config({ path: envPath });
  
  if (result.error) {
    console.error('Error loading .env.local:', result.error);
  } else {
    console.log('Loaded environment variables from .env.local');
  }
} else {
  console.log('.env.local file not found, using default environment variables');
}

// Export a function to check if environment is properly loaded
export function checkEnvLoaded() {
  console.log('Environment check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- DANGEROUSLY_DISABLE_HOST_CHECK:', process.env.DANGEROUSLY_DISABLE_HOST_CHECK);
  console.log('- VITE_ALLOW_ALL_HOSTS:', process.env.VITE_ALLOW_ALL_HOSTS);
  console.log('- HOST:', process.env.HOST);
}