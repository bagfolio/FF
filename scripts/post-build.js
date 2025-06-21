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

// Create minimal package.json for production
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const productionPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: "module",
  main: "index.js",
  dependencies: {
    // Only include native/binary dependencies that can't be bundled
    "ws": packageJson.dependencies.ws,
    "pg-native": packageJson.dependencies["pg-native"] || "^3.0.1",
    "bufferutil": packageJson.optionalDependencies?.bufferutil,
    "utf-8-validate": packageJson.optionalDependencies?.["utf-8-validate"]
  }
};

// Write production package.json
fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(productionPackageJson, null, 2)
);

console.log('✅ Created production package.json in dist/');

// Copy production environment file if it exists
const prodEnvPath = path.join(rootDir, '.env.production');
if (fs.existsSync(prodEnvPath)) {
  fs.copyFileSync(prodEnvPath, path.join(distDir, '.env.production'));
  console.log('✅ Copied .env.production to dist/');
}

console.log('✅ Post-build tasks completed');