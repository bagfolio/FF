#!/usr/bin/env node
import { build } from 'esbuild';
import { builtinModules } from 'module';

// Get all Node.js built-in modules
const nodeBuiltins = builtinModules.flatMap(m => [m, `node:${m}`]);

// Add other modules that should be external
const externalModules = [
  ...nodeBuiltins,
  'ws',
  'bufferutil',
  'utf-8-validate',
  'lightningcss'
];

console.log('Building server bundle...');

try {
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist',
    external: externalModules,
    minify: false, // Keep readable for debugging
    sourcemap: true,
    target: 'node20',
    banner: {
      js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
      `.trim()
    }
  });
  
  console.log('✅ Server bundle created successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}