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
  
  // Always throw error instead of exiting
  // Let the main process handle the error appropriately
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with limits to prevent exhaustion
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Connection pool configuration
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Timeout new connections after 5 seconds
  // Add keepalive to detect broken connections
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
  // Don't exit - let the app continue running
});

export const db = drizzle({ client: pool, schema });