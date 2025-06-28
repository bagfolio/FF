#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import net from 'net';
import { fileURLToPath } from 'url';
import path from 'path';

const execAsync = promisify(exec);
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Strategy 1: Node-native port check
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

// Strategy 2: Find processes by specific patterns
async function findSuspectProcesses() {
  const patterns = [
    { pattern: 'tsx.*server/index.ts', desc: 'Development server' },
    { pattern: 'tsx watch', desc: 'TSX watch process' },
    { pattern: 'node.*dist/index.js', desc: 'Production server' },
    { pattern: 'vite', desc: 'Vite dev server' },
    { pattern: `node.*:${PORT}`, desc: 'Node on port' },
    { pattern: `PORT=${PORT}`, desc: 'Process with PORT env' }
  ];
  
  const suspects = [];
  
  for (const { pattern, desc } of patterns) {
    try {
      const { stdout } = await execAsync(`ps aux | grep -E "${pattern}" | grep -v grep | grep -v manage-processes`);
      const lines = stdout.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const parts = line.split(/\s+/);
        const pid = parts[1];
        const cmd = parts.slice(10).join(' ');
        
        if (pid && !isNaN(pid)) {
          suspects.push({ pid, cmd, desc });
        }
      }
    } catch (e) {
      // Pattern didn't match anything
    }
  }
  
  return suspects;
}

// Strategy 3: Find ALL Node processes (except system ones)
async function findAllNodeProcesses() {
  try {
    const { stdout } = await execAsync('ps aux | grep -E "node|tsx" | grep -v grep | grep -v manage-processes');
    const lines = stdout.split('\n').filter(line => line.trim());
    
    const processes = [];
    for (const line of lines) {
      const parts = line.split(/\s+/);
      const pid = parts[1];
      const user = parts[0];
      const startTime = parts[8];
      const cmd = parts.slice(10).join(' ');
      
      // Skip system processes
      if (cmd.includes('cursor-server') || 
          cmd.includes('code-server') || 
          cmd.includes('typescript-language-server') ||
          cmd.includes('vscode-') ||
          cmd.includes('node_modules/typescript/lib')) {
        continue;
      }
      
      if (pid && !isNaN(pid)) {
        processes.push({ pid, user, startTime, cmd });
      }
    }
    
    return processes;
  } catch (e) {
    return [];
  }
}

// Kill a process with verification
async function killProcess(pid, description = '') {
  try {
    log(`  🔪 Killing process ${pid}${description ? ` (${description})` : ''}...`, 'yellow');
    await execAsync(`kill -9 ${pid}`);
    
    // Wait a bit for process to die
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify it's dead
    try {
      await execAsync(`ps -p ${pid}`);
      log(`  ⚠️  Process ${pid} still alive!`, 'red');
      return false;
    } catch (e) {
      log(`  ✅ Process ${pid} terminated`, 'green');
      return true;
    }
  } catch (e) {
    log(`  ⚠️  Process ${pid} already dead or inaccessible`, 'yellow');
    return true;
  }
}

// Main port clearing logic
async function clearPort(port) {
  log(`\n🔍 Checking port ${port}...`, 'blue');
  
  // First check if port is actually in use
  const portBlocked = await isPortInUse(port);
  if (!portBlocked) {
    log(`✅ Port ${port} is already free!`, 'green');
    return true;
  }
  
  log(`⚠️  Port ${port} is in use. Finding culprit...`, 'yellow');
  
  // Phase 1: Try specific patterns
  log('\n📋 Phase 1: Checking known patterns...', 'blue');
  const suspects = await findSuspectProcesses();
  
  if (suspects.length > 0) {
    log(`Found ${suspects.length} suspect process(es):`, 'yellow');
    for (const suspect of suspects) {
      log(`  - PID ${suspect.pid}: ${suspect.desc} - ${suspect.cmd.substring(0, 50)}...`);
      await killProcess(suspect.pid, suspect.desc);
    }
    
    // Check if port is free now
    if (!(await isPortInUse(port))) {
      log(`\n✅ Port ${port} is now free!`, 'green');
      return true;
    }
  }
  
  // Phase 2: Nuclear option - kill all non-system Node processes
  log('\n📋 Phase 2: Nuclear option - killing all Node processes...', 'yellow');
  const allProcesses = await findAllNodeProcesses();
  
  if (allProcesses.length > 0) {
    log(`Found ${allProcesses.length} Node process(es) to terminate:`, 'yellow');
    for (const proc of allProcesses) {
      log(`  - PID ${proc.pid}: ${proc.cmd.substring(0, 60)}...`);
      await killProcess(proc.pid);
    }
    
    // Final check
    if (!(await isPortInUse(port))) {
      log(`\n✅ Port ${port} is now free!`, 'green');
      return true;
    }
  }
  
  // If we get here, we failed
  log(`\n❌ Failed to free port ${port}!`, 'red');
  log('\n📝 Manual intervention required:', 'yellow');
  log('  1. Run: ps aux | grep node');
  log('  2. Find the process using port 5000');
  log('  3. Run: kill -9 [PID]');
  
  return false;
}

// List current processes for debugging
async function listCurrentState() {
  log('\n📊 Current system state:', 'blue');
  
  const suspects = await findSuspectProcesses();
  const allNode = await findAllNodeProcesses();
  
  if (suspects.length > 0) {
    log('\n🎯 Suspect processes:', 'yellow');
    for (const s of suspects) {
      log(`  PID ${s.pid}: ${s.desc} - ${s.cmd.substring(0, 50)}...`);
    }
  }
  
  if (allNode.length > 0) {
    log('\n📋 All Node processes:', 'blue');
    for (const p of allNode) {
      log(`  PID ${p.pid}: ${p.cmd.substring(0, 60)}...`);
    }
  }
  
  if (suspects.length === 0 && allNode.length === 0) {
    log('  No Node/TSX processes found', 'green');
  }
}

// Main execution
async function main() {
  log('🚀 Advanced Process Management Starting...', 'blue');
  log(`📍 Target port: ${PORT}`, 'blue');
  
  // Show current state
  await listCurrentState();
  
  // Clear the port
  const success = await clearPort(PORT);
  
  if (success) {
    log('\n✅ Environment ready for deployment!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Failed to prepare environment!', 'red');
    process.exit(1);
  }
}

// Handle errors gracefully
main().catch(err => {
  log(`\n❌ Unexpected error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});