#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Building for production...\n');

try {
  // Set production environment
  process.env.NODE_ENV = 'production';
  
  // Run Vite build
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit', cwd: rootDir });
  
  // Build server
  console.log('🔧 Building server...');
  execSync('node scripts/build-server.js', { stdio: 'inherit', cwd: rootDir });
  
  // Post-build tasks
  console.log('✨ Running post-build tasks...');
  execSync('node scripts/post-build.js', { stdio: 'inherit', cwd: rootDir });
  
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}