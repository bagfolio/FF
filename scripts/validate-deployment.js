#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Validating deployment readiness...\n');

let errors = 0;
let warnings = 0;

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check for required files in dist
console.log('📋 Checking dist directory contents...');
const requiredFiles = [
  'index.js',
  'package.json',
  'public/index.html'
];

for (const file of requiredFiles) {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} is missing`);
    errors++;
  }
}

// Check index.js for import statements (should be bundled)
console.log('\n📋 Checking bundle integrity...');
const indexJs = fs.readFileSync(path.join(distDir, 'index.js'), 'utf-8');
const importStatements = indexJs.match(/^import .+ from ['"].+['"];?$/gm) || [];

if (importStatements.length > 0) {
  console.log(`⚠️  Found ${importStatements.length} import statements in bundled code:`);
  const allowedExternals = ['ws', 'pg-native', 'bufferutil', 'utf-8-validate'];
  
  importStatements.forEach(stmt => {
    const match = stmt.match(/from ['"](.+?)['"]/);
    if (match) {
      const module = match[1];
      if (allowedExternals.includes(module)) {
        console.log(`   ✓ ${module} (allowed external)`);
      } else {
        console.error(`   ✗ ${module} (should be bundled)`);
        errors++;
      }
    }
  });
} else {
  console.log('✅ No unexpected import statements found');
}

// Check package.json in dist
console.log('\n📋 Checking dist/package.json...');
try {
  const distPackageJson = JSON.parse(fs.readFileSync(path.join(distDir, 'package.json'), 'utf-8'));
  
  if (distPackageJson.dependencies && Object.keys(distPackageJson.dependencies).length > 0) {
    console.log('✅ Production package.json has dependencies for native modules');
  }
  
  if (distPackageJson.type !== 'module') {
    console.error('❌ package.json must have "type": "module"');
    errors++;
  }
} catch (error) {
  console.error('❌ Could not read dist/package.json');
  errors++;
}

// Check file sizes
console.log('\n📋 Checking bundle sizes...');
const stats = fs.statSync(path.join(distDir, 'index.js'));
const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
console.log(`   Bundle size: ${sizeMB} MB`);

if (stats.size > 10 * 1024 * 1024) {
  console.warn('⚠️  Bundle size is larger than 10MB');
  warnings++;
}

// Check for sensitive files
console.log('\n📋 Checking for sensitive files...');
const sensitiveFiles = ['.env', '.env.local', '.env.development'];
let foundSensitive = false;

for (const file of sensitiveFiles) {
  if (fs.existsSync(path.join(distDir, file))) {
    console.error(`❌ Sensitive file ${file} found in dist!`);
    errors++;
    foundSensitive = true;
  }
}

if (!foundSensitive) {
  console.log('✅ No sensitive files in dist');
}

// Simulate server startup
console.log('\n📋 Testing server startup...');
try {
  // Just check if the file can be parsed
  require(path.join(distDir, 'index.js'));
  console.log('✅ Server file can be loaded');
} catch (error) {
  // This might fail due to missing dependencies, which is ok
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('⚠️  Server requires runtime dependencies (expected)');
  } else {
    console.error('❌ Server file has syntax errors:', error.message);
    errors++;
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('Deployment validation complete:');
console.log(`- Errors: ${errors}`);
console.log(`- Warnings: ${warnings}`);

if (errors > 0) {
  console.error('\n❌ Deployment validation failed. Do not deploy!');
  process.exit(1);
} else if (warnings > 0) {
  console.warn('\n⚠️  Deployment validation passed with warnings.');
  console.log('   Review warnings before deploying.');
} else {
  console.log('\n✅ Deployment validation passed! Ready to deploy.');
}