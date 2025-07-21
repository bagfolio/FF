#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'net';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Validating deployment configuration...\n');

let hasErrors = false;
const warnings = [];
const results = [];

// Check if dist directory exists
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  results.push('❌ dist directory not found');
  hasErrors = true;
} else {
  results.push('✅ dist directory exists');
  
  // Check for required files
  const requiredFiles = [
    { path: 'index.js', desc: 'Server bundle' },
    { path: 'public/index.html', desc: 'Main HTML file' },
    { path: 'public/manifest.json', desc: 'PWA manifest' },
    { path: 'public/assets', desc: 'Assets directory', isDir: true }
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(distDir, file.path);
    if (!fs.existsSync(filePath)) {
      results.push(`❌ Missing required: ${file.desc} (${file.path})`);
      hasErrors = true;
    } else {
      const stats = fs.statSync(filePath);
      if (file.isDir && !stats.isDirectory()) {
        results.push(`❌ Expected directory but found file: ${file.path}`);
        hasErrors = true;
      } else if (!file.isDir && stats.size === 0) {
        results.push(`❌ File is empty: ${file.path}`);
        hasErrors = true;
      } else {
        results.push(`✅ Found: ${file.desc}`);
      }
    }
  }
  
  // Check manifest.json has correct protocol
  const manifestPath = path.join(distDir, 'public/manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      if (!manifest.protocol_handlers || !manifest.protocol_handlers[0]) {
        results.push('❌ Manifest missing protocol_handlers');
        hasErrors = true;
      } else if (manifest.protocol_handlers[0].protocol !== 'web+futebol-futuro') {
        results.push(`❌ Manifest has incorrect protocol: ${manifest.protocol_handlers[0].protocol}`);
        hasErrors = true;
      } else {
        results.push('✅ Manifest protocol is correct: web+futebol-futuro');
      }
    } catch (e) {
      results.push(`❌ Failed to parse manifest: ${e.message}`);
      hasErrors = true;
    }
  }
}

// Check .replit configuration
console.log('\n📋 Checking Configuration...');
const replitConfigPath = path.join(rootDir, '.replit');
if (fs.existsSync(replitConfigPath)) {
  const replitConfig = fs.readFileSync(replitConfigPath, 'utf8');
  
  // Check for multiple port configurations
  const portMatches = replitConfig.match(/localPort\s*=\s*(\d+)/g) || [];
  if (portMatches.length > 1) {
    warnings.push('Multiple port configurations in .replit may cause routing issues');
  }
  
  // Check deployment command
  if (!replitConfig.includes('start-production.sh')) {
    warnings.push('.replit may not be using the production startup script');
  }
  
  results.push('✅ .replit configuration found');
} else {
  results.push('❌ .replit configuration not found');
  hasErrors = true;
}

// Check startup script
const startupScriptPath = path.join(rootDir, 'scripts/start-production.sh');
if (fs.existsSync(startupScriptPath)) {
  const startupScript = fs.readFileSync(startupScriptPath, 'utf8');
  
  // Check for problematic cd commands
  if (startupScript.includes('cd dist')) {
    results.push('❌ Startup script changes directory - this will break path resolution');
    hasErrors = true;
  } else {
    results.push('✅ Startup script correctly stays in root directory');
  }
} else {
  results.push('❌ Production startup script not found');
  hasErrors = true;
}

// Check environment variables
console.log('\n🔐 Checking Environment...');
const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  warnings.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  results.push(`⚠️  Missing env vars: ${missingEnvVars.join(', ')}`);
} else {
  results.push('✅ All required environment variables are set');
}

// Check if port is available
const PORT = process.env.PORT || 5000;
const checkPort = () => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(PORT);
  });
};

console.log('\n🔌 Checking Port Availability...');
const portAvailable = await checkPort();
if (!portAvailable) {
  warnings.push(`Port ${PORT} is already in use - server may fail to start`);
  results.push(`⚠️  Port ${PORT} is already in use`);
} else {
  results.push(`✅ Port ${PORT} is available`);
}

// Check for rogue files
console.log('\n🚫 Checking for Common Issues...');
if (fs.existsSync(path.join(rootDir, 'public/manifest.json'))) {
  results.push('❌ Found rogue public/manifest.json at root - this may cause conflicts');
  hasErrors = true;
} else {
  results.push('✅ No conflicting manifest files');
}

// CRITICAL: Check for dev artifacts in production HTML
const htmlPath = path.join(distDir, 'public/index.html');
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const devArtifacts = [
    '@vite/client',
    '@react-refresh', 
    'src/main.tsx',
    'http://localhost:5173',
    'ws://localhost:5173',
    '__vite_plugin_react_preamble_installed__'
  ];
  
  const foundArtifacts = devArtifacts.filter(artifact => htmlContent.includes(artifact));
  if (foundArtifacts.length > 0) {
    results.push(`❌ CRITICAL: Production HTML contains development artifacts: ${foundArtifacts.join(', ')}`);
    hasErrors = true;
  } else {
    results.push('✅ Production HTML is clean - no dev artifacts');
  }
  
  // Check for correct production script tags
  if (htmlContent.includes('/assets/') && htmlContent.includes('.js')) {
    results.push('✅ Production HTML has bundled assets');
  } else {
    results.push('❌ Production HTML missing bundled assets');
    hasErrors = true;
  }
}

// Check vendor bundles
if (fs.existsSync(path.join(distDir, 'public/assets'))) {
  try {
    const assets = fs.readdirSync(path.join(distDir, 'public/assets'));
    const vendorFiles = assets.filter(f => f.startsWith('vendor-'));
    if (vendorFiles.length > 0) {
      results.push(`✅ Found ${vendorFiles.length} vendor bundles`);
    } else {
      warnings.push('No vendor bundles found - may impact loading performance');
    }
  } catch (e) {
    warnings.push('Could not check vendor bundles');
  }
}

// Print all results
console.log('\n📊 Validation Results:');
results.forEach(r => console.log(`   ${r}`));

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(`   - ${w}`));
}

// Summary
console.log('\n📈 Summary:');
console.log(`   Errors: ${hasErrors ? '❌ Found' : '✅ None'}`);
console.log(`   Warnings: ${warnings.length > 0 ? `⚠️  ${warnings.length}` : '✅ None'}`);

if (hasErrors) {
  console.error('\n❌ Deployment validation FAILED!\n');
  console.log('Fix the errors above before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ Deployment validation PASSED!');
  if (warnings.length > 0) {
    console.log('   (with warnings - deployment should still work)');
  }
  console.log('\n🎉 Build is ready for deployment!');
  process.exit(0);
}