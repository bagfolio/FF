#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Quick build for deployment...\n');

try {
  // Skip TypeScript check for now to speed up build
  console.log('⚡ Skipping TypeScript validation for quick deployment...');
  
  // Run Vite build directly
  console.log('🔨 Building frontend...');
  execSync('vite build --mode production', { 
    stdio: 'inherit', 
    cwd: rootDir,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Build server
  console.log('🔧 Building server...');
  execSync('node scripts/build-server.js', { stdio: 'inherit', cwd: rootDir });
  
  // Post-build setup
  console.log('📦 Finalizing build...');
  execSync('node scripts/post-build.js', { stdio: 'inherit', cwd: rootDir });
  
  console.log('\n✅ Quick build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Quick build failed:', error.message);
  process.exit(1);
}