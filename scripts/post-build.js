#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Run build first.');
  process.exit(1);
}

// Create package.json for production with all dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const productionPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: "module",
  main: "index.js",
  dependencies: packageJson.dependencies,
  optionalDependencies: packageJson.optionalDependencies
};

// Write production package.json
fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(productionPackageJson, null, 2)
);

console.log('✅ Created production package.json in dist/');

// Create minimal package-lock.json for production dependencies
const packageLock = {
  "name": packageJson.name,
  "version": packageJson.version,
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": packageJson.name,
      "version": packageJson.version,
      "dependencies": productionPackageJson.dependencies,
      "optionalDependencies": productionPackageJson.optionalDependencies
    }
  }
};

fs.writeFileSync(
  path.join(distDir, 'package-lock.json'),
  JSON.stringify(packageLock, null, 2)
);

console.log('✅ Created minimal package-lock.json in dist/');

// Copy production environment file if it exists
const prodEnvPath = path.join(rootDir, '.env.production');
if (fs.existsSync(prodEnvPath)) {
  fs.copyFileSync(prodEnvPath, path.join(distDir, '.env.production'));
  console.log('✅ Copied .env.production to dist/');
} else {
  console.log('📋 No .env.production file found, using deployment environment variables');
}

console.log('✅ Post-build tasks completed');