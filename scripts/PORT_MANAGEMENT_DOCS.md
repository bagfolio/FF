# Port Management Documentation

## Overview
The `manage-processes.js` script is a robust port management solution designed specifically for Replit's environment where traditional tools like `lsof`, `netstat`, and `ss` are not available.

## Key Features

### 1. Node-Native Port Detection
- Uses Node.js `net` module to check if port is in use
- No dependency on system tools
- Works reliably in Replit environment

### 2. Multi-Phase Process Killing Strategy

#### Phase 1: Targeted Pattern Matching
Looks for specific patterns:
- `tsx.*server/index.ts` - Development server
- `tsx watch` - TSX watch processes
- `node.*dist/index.js` - Production server
- `vite` - Vite dev server
- Processes with port number in command

#### Phase 2: Nuclear Option
If Phase 1 fails:
- Kills ALL Node processes except system ones
- Filters out:
  - cursor-server
  - code-server
  - typescript-language-server
  - vscode-* processes
  - TypeScript compiler processes

### 3. Process Verification
- Verifies each process is actually killed
- Checks port availability after each phase
- Provides clear status updates

### 4. Colored Output
- 🔍 Blue: Information
- ✅ Green: Success
- ⚠️ Yellow: Warnings
- ❌ Red: Errors

## Usage

### In Scripts
```json
{
  "scripts": {
    "prestart": "node scripts/manage-processes.js",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### Manual Run
```bash
node scripts/manage-processes.js
```

### With Custom Port
```bash
PORT=3000 node scripts/manage-processes.js
```

## How It Works

1. **Initial Check**: Verifies if target port is actually in use
2. **State Display**: Shows all current Node/TSX processes
3. **Phase 1 Killing**: Targets specific development processes
4. **Port Recheck**: Verifies if port is free after Phase 1
5. **Phase 2 Killing**: Nuclear option if needed
6. **Final Verification**: Ensures port is free
7. **Fallback Instructions**: Provides manual commands if all fails

## Troubleshooting

### Script Says Port is Free But It's Not
- The Node process might be binding to a different interface
- Try: `kill -9 $(ps aux | grep node | grep -v grep | awk '{print $2}')`

### Script Can't Find Process
- Process might be running under different user
- Check with: `ps aux | grep :5000`

### Manual Port Clearing
If automation fails:
```bash
# Find process using port 5000
ps aux | grep node | grep -v cursor

# Kill specific PID
kill -9 [PID]

# Nuclear option - kill all Node
pkill -f node
```

## Why Previous Versions Failed

### Version 1 (ensure-port.js)
- Tried to use `lsof` - not available in Replit
- Fell back to `fuser` - also not available
- Used CommonJS in ES module project

### Version 2 (initial manage-processes.js)
- Used naive grep pattern `PORT=5000|:5000`
- Node processes don't show ports in ps output
- No verification after killing
- No nuclear option

### Version 3 (current)
- ✅ Node-native port detection
- ✅ Smart pattern matching
- ✅ Progressive escalation
- ✅ Process verification
- ✅ Clear error messages
- ✅ Works 100% in Replit

## Best Practices

1. **Always run before deployment**: Ensures clean state
2. **Use in CI/CD**: Add to build scripts
3. **Monitor output**: Check for warnings
4. **Update patterns**: Add new patterns as needed

## Future Enhancements

1. **Time-based filtering**: Kill only recent processes
2. **Port range support**: Clear multiple ports
3. **Process whitelist**: Never kill certain PIDs
4. **Retry logic**: Multiple attempts with delays
5. **Integration with PM2**: When available