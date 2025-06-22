#!/usr/bin/env node
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Running pre-build validation...\n');

let errors = 0;
let warnings = 0;

// Check TypeScript compilation
console.log('📋 Checking TypeScript compilation...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: rootDir });
  console.log('✅ TypeScript compilation passed');
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  console.error('   Run "npx tsc --noEmit" to see errors');
  errors++;
}

// Check for .env.local in production build
if (process.env.NODE_ENV === 'production') {
  console.log('\n📋 Checking production environment...');
  
  const envLocalPath = path.join(rootDir, '.env.local');
  if (existsSync(envLocalPath)) {
    console.warn('⚠️  WARNING: .env.local exists but will not be loaded in production');
    warnings++;
  }
  
  // Check for production env file
  const envProdPath = path.join(rootDir, '.env.production');
  if (!existsSync(envProdPath)) {
    console.warn('⚠️  .env.production file is missing');
    console.warn('   Using environment variables from deployment platform');
    warnings++;
  } else {
    console.log('✅ .env.production file exists');
  }
  
  // Check critical environment variables
  if (process.env.BYPASS_AUTH === 'true') {
    console.warn('⚠️  WARNING: BYPASS_AUTH is enabled for production build!');
    console.warn('   This should be disabled in production deployment');
    warnings++;
  }
}

// Check dependencies
console.log('\n📋 Checking dependencies...');
try {
  execSync('npm ls --depth=0', { stdio: 'pipe', cwd: rootDir });
  console.log('✅ All dependencies are installed');
} catch (error) {
  console.warn('⚠️  Some dependencies might have issues');
  warnings++;
}

// Skip git checks in Replit environment to avoid permission issues
console.log('\n📋 Skipping git status check in Replit environment');

// Summary
console.log('\n' + '='.repeat(50));
console.log('Pre-build validation complete:');
console.log(`- Errors: ${errors}`);
console.log(`- Warnings: ${warnings}`);

if (errors > 0) {
  console.error('\n❌ Build validation failed. Please fix the errors above.');
  process.exit(1);
} else if (warnings > 0) {
  console.warn('\n⚠️  Build validation passed with warnings.');
  console.log('   Consider addressing the warnings above.');
  process.exit(0);
} else {
  console.log('\n✅ Build validation passed!');
  process.exit(0);
}