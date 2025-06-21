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
  execSync('npm run check', { stdio: 'pipe', cwd: rootDir });
  console.log('✅ TypeScript compilation passed');
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  console.error('   Run "npm run check" to see errors');
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
    console.error('❌ .env.production file is missing');
    console.error('   Copy .env.production.example to .env.production and configure it');
    errors++;
  } else {
    console.log('✅ .env.production file exists');
  }
  
  // Check critical environment variables
  if (process.env.BYPASS_AUTH === 'true') {
    console.error('❌ CRITICAL: BYPASS_AUTH is enabled for production build!');
    errors++;
  }
}

// Set Python path for node-gyp
console.log('\n📋 Configuring Python for node-gyp...');
try {
  // Try to find Python executable
  const pythonPath = execSync('which python3', { encoding: 'utf-8', cwd: rootDir }).trim();
  if (pythonPath) {
    process.env.PYTHON = pythonPath;
    process.env.npm_config_python = pythonPath;
    process.env.PYTHON_PATH = pythonPath;
    
    // Set environment variables for node-gyp
    process.env.npm_config_target_platform = 'linux';
    process.env.npm_config_target_arch = 'x64';
    
    console.log(`✅ Python configured: ${pythonPath}`);
    console.log('✅ NPM configured for native compilation');
  } else {
    throw new Error('Python3 not found');
  }
} catch (error) {
  console.error('❌ Could not configure Python path for node-gyp');
  console.error('   This may cause native module compilation to fail during deployment');
  errors++;
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

// Check for uncommitted changes
console.log('\n📋 Checking git status...');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8', cwd: rootDir });
  if (gitStatus.trim()) {
    console.warn('⚠️  You have uncommitted changes:');
    console.warn(gitStatus.trim().split('\n').map(line => '   ' + line).join('\n'));
    warnings++;
  } else {
    console.log('✅ No uncommitted changes');
  }
} catch (error) {
  console.warn('⚠️  Could not check git status');
  warnings++;
}

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
} else {
  console.log('\n✅ Build validation passed!');
}