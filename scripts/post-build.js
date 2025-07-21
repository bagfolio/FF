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

// Filter out development-only dependencies from production
const productionDependencies = { ...packageJson.dependencies };
const devOnlyDeps = ['vite', '@vitejs/plugin-react', '@replit/vite-plugin-cartographer', '@replit/vite-plugin-runtime-error-modal'];
devOnlyDeps.forEach(dep => {
  delete productionDependencies[dep];
});

const productionPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: "module",
  main: "index.js",
  dependencies: productionDependencies,
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

// Verify manifest has correct protocol
const manifestPath = path.join(distDir, 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.protocol_handlers?.[0]?.protocol !== 'web+futebol-futuro') {
    console.error('❌ Manifest has wrong protocol!');
    process.exit(1);
  }
  console.log('✅ Manifest protocol verified');
}

console.log('✅ Post-build tasks completed');