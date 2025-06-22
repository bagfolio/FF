#!/usr/bin/env node
import { build } from 'esbuild';
import { builtinModules } from 'module';

// Get all Node.js built-in modules
const nodeBuiltins = builtinModules.flatMap(m => [m, `node:${m}`]);

// Add other modules that should be external
const externalModules = [
  ...nodeBuiltins,
  'ws',
  'bufferutil',
  'utf-8-validate',
  'lightningcss',
  '@neondatabase/serverless',
  'drizzle-orm',
  'drizzle-zod',
  'express',
  'express-session',
  'bcryptjs',
  'passport',
  'passport-local',
  'cloudinary',
  'resend',
  'stripe',
  'dotenv',
  'multer',
  'memorystore',
  'openid-client',
  'zod',
  'zod-validation-error'
];

console.log('Building server bundle...');

try {
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist',
    external: externalModules,
    minify: false,
    sourcemap: true,
    target: 'node20',
    packages: 'external'  // External all packages by default
  });
  
  console.log('✅ Server bundle created successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}