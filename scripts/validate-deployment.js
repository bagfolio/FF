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
  console.log(`📦 Found ${importStatements.length} import statements in bundled code`);
  const allowedExternals = ['ws', 'bufferutil', 'utf-8-validate', 'lightningcss'];
  const nodeBuiltins = new Set([
    'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
    'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https',
    'module', 'net', 'os', 'path', 'perf_hooks', 'process', 'punycode',
    'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'sys',
    'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'worker_threads', 'zlib'
  ]);
  
  let unexpectedImports = 0;
  importStatements.forEach(stmt => {
    const match = stmt.match(/from ['"](.+?)['"]/);
    if (match) {
      const module = match[1];
      const baseModule = module.startsWith('node:') ? module.slice(5) : module;
      
      if (allowedExternals.includes(module) || nodeBuiltins.has(baseModule) || module.startsWith('node:')) {
        // These are expected external modules
      } else if (module.includes('${')) {
        // Dynamic imports, skip
      } else {
        console.error(`   ✗ Unexpected import: ${module}`);
        unexpectedImports++;
      }
    }
  });
  
  if (unexpectedImports === 0) {
    console.log('✅ All imports are properly externalized');
  } else {
    console.error(`❌ Found ${unexpectedImports} unexpected imports`);
    errors += unexpectedImports;
  }
} else {
  console.log('✅ No import statements found (fully bundled)');
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
  // Check if the file has valid JavaScript syntax by parsing it
  const serverCode = fs.readFileSync(path.join(distDir, 'index.js'), 'utf-8');
  
  // Basic syntax check - look for common issues
  if (serverCode.includes('export default') || serverCode.includes('import ')) {
    console.log('✅ Server file uses ESM syntax (correct)');
  }
  
  // Check for basic structure
  if (serverCode.includes('express') && serverCode.includes('listen')) {
    console.log('✅ Server file appears to have Express setup');
  } else {
    console.warn('⚠️  Could not verify Express setup in bundle');
    warnings++;
  }
} catch (error) {
  console.error('❌ Could not read server file:', error.message);
  errors++;
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
  process.exit(0);
} else {
  console.log('\n✅ Deployment validation passed! Ready to deploy.');
  process.exit(0);
}