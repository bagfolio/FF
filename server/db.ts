import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set!');
  console.error('Please configure DATABASE_URL in Replit Secrets:');
  console.error('1. Go to the Secrets tab in Replit');
  console.error('2. Add a new secret named DATABASE_URL');
  console.error('3. Set it to your Neon database connection string');
  
  // In production, exit immediately
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
  
  // In development, throw error
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });