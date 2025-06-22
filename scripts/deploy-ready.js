#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Preparing for deployment...\n');

let warnings = 0;
let errors = 0;

// Check if build exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Build not found. Run build first.');
  process.exit(1);
}

// Check required files
const requiredFiles = ['index.js', 'package.json', 'public/index.html'];
for (const file of requiredFiles) {
  if (fs.existsSync(path.join(distDir, file))) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
    errors++;
  }
}

// Check environment configuration
console.log('\n📋 Environment configuration:');
if (process.env.NODE_ENV === 'production') {
  console.log('✅ NODE_ENV is production');
} else {
  console.warn('⚠️  NODE_ENV is not production');
  warnings++;
}

if (process.env.PORT) {
  console.log(`✅ PORT is set to ${process.env.PORT}`);
} else {
  console.log('📋 PORT will default to 5000');
}

if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL is configured');
} else {
  console.warn('⚠️  DATABASE_URL not found');
  warnings++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('Deployment readiness check:');
console.log(`- Errors: ${errors}`);
console.log(`- Warnings: ${warnings}`);

if (errors === 0) {
  console.log('\n✅ Ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Set environment variables in Replit Secrets');
  console.log('2. Configure DATABASE_URL');
  console.log('3. Set STRIPE_SECRET_KEY if using payments');
  console.log('4. Deploy using Replit Deployments');
} else {
  console.log('\n❌ Fix errors before deploying');
  process.exit(1);
}