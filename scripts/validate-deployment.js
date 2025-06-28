#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Validating deployment...\n');

const checks = [
  // Structure checks
  { path: 'dist/index.js', type: 'file', critical: true, desc: 'Server bundle' },
  { path: 'dist/public', type: 'directory', critical: true, desc: 'Client build directory' },
  { path: 'dist/public/index.html', type: 'file', critical: true, desc: 'Main HTML file' },
  { path: 'dist/public/manifest.json', type: 'file', critical: true, desc: 'PWA manifest' },
  { path: 'dist/package.json', type: 'file', critical: true, desc: 'Production package.json' },
  
  // Asset checks
  { path: 'dist/public/assets', type: 'directory', critical: true, desc: 'Assets directory' },
];

let failed = false;
const results = [];

// Check file structure
for (const check of checks) {
  const fullPath = path.resolve(check.path);
  const exists = fs.existsSync(fullPath);
  const isCorrectType = exists && (
    (check.type === 'file' && fs.statSync(fullPath).isFile()) ||
    (check.type === 'directory' && fs.statSync(fullPath).isDirectory())
  );
  
  if (!isCorrectType) {
    results.push(`❌ Missing ${check.type}: ${check.desc} (${check.path})`);
    if (check.critical) failed = true;
  } else {
    results.push(`✅ Found: ${check.desc}`);
  }
}

// Validate manifest protocol
console.log('\n📋 Checking Manifest...');
try {
  const manifest = JSON.parse(fs.readFileSync('dist/public/manifest.json', 'utf8'));
  const protocol = manifest.protocol_handlers?.[0]?.protocol;
  
  if (protocol === 'web+futebol-futuro') {
    results.push('✅ Manifest protocol is correct: web+futebol-futuro');
  } else {
    results.push(`❌ Manifest protocol is wrong: ${protocol || 'undefined'}`);
    failed = true;
  }
  
  if (manifest.name === 'Revela - Plataforma de Descoberta de Talentos') {
    results.push('✅ Manifest name is correct');
  } else {
    results.push('❌ Manifest name is wrong');
    failed = true;
  }
} catch (e) {
  results.push(`❌ Failed to parse manifest: ${e.message}`);
  failed = true;
}

// Check for vendor bundles
console.log('\n📦 Checking Vendor Bundles...');
try {
  const assets = fs.readdirSync('dist/public/assets');
  const vendorReact = assets.find(f => f.startsWith('vendor-react-'));
  const vendorMain = assets.find(f => f.startsWith('vendor-') && !f.includes('react') && !f.includes('ui'));
  
  if (vendorReact) {
    results.push(`✅ React vendor bundle found: ${vendorReact}`);
  } else {
    results.push('❌ React vendor bundle missing!');
    failed = true;
  }
  
  if (vendorMain) {
    results.push(`✅ Main vendor bundle found: ${vendorMain}`);
  }
} catch (e) {
  results.push('❌ Failed to check vendor bundles');
  failed = true;
}

// Check for rogue files
console.log('\n🚫 Checking for Rogue Files...');
if (fs.existsSync('public/manifest.json')) {
  results.push('❌ Found rogue public/manifest.json at root - DELETE IT!');
  failed = true;
} else {
  results.push('✅ No rogue manifest at root');
}

// Print all results
console.log('\n📊 Validation Results:');
results.forEach(r => console.log(`   ${r}`));

// Final verdict
if (failed) {
  console.error('\n❌ Deployment validation FAILED!\n');
  process.exit(1);
} else {
  console.log('\n✅ Deployment validation PASSED!\n');
  console.log('🎉 Build is ready for deployment!');
}