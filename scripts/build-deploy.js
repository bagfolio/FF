#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting deployment build process...\n');

try {
  // Run the bypass pre-build validation
  console.log('1. Running pre-build validation (bypass mode)...');
  execSync('node scripts/pre-build-bypass.js', { stdio: 'inherit', cwd: rootDir });
  
  // Run the actual build
  console.log('\n2. Running production build...');
  execSync('vite build', { stdio: 'inherit', cwd: rootDir });
  
  // Build server
  console.log('\n3. Building server...');
  execSync('node scripts/build-server.js', { stdio: 'inherit', cwd: rootDir });
  
  // Post-build setup
  console.log('\n4. Running post-build setup...');
  execSync('node scripts/post-build.js', { stdio: 'inherit', cwd: rootDir });
  
  console.log('\n✅ Deployment build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Deployment build failed:', error.message);
  process.exit(1);
}