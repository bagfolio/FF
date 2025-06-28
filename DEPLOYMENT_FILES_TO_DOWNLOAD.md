# Deployment Debug Files List

## Additional Debugging Information

### Process Manager Status
- **PM2**: Not installed
- **Active Node Processes**: Development server (tsx) is running on PID 192
  - Command: `/bin/node --require tsx/dist/preflight.cjs --import tsx/dist/loader.mjs server/index.ts`
  - This is blocking port 5000

### Manifest Modification Investigation
- **No scripts found** that directly modify manifest.json
- **Two manifest files exist**:
  - `client/public/manifest.json` - protocol: "web+futebol-futuro"
  - `public/manifest.json` - protocol: "web+futebol" (root level, created Jun 22 05:17)
  
### React Bundle Verification
- **useState count in vendor bundle**: 7 occurrences
- React IS properly bundled with hooks included

## Files to Download for Review

### Core Configuration Files
1. `/home/runner/workspace/package.json`
2. `/home/runner/workspace/.replit`
3. `/home/runner/workspace/vite.config.ts`
4. `/home/runner/workspace/tsconfig.json`

### Build Scripts (10 files)
5. `/home/runner/workspace/scripts/build-server.js`
6. `/home/runner/workspace/scripts/build-server-simple.js`
7. `/home/runner/workspace/scripts/build-deploy.js`
8. `/home/runner/workspace/scripts/post-build.js`
9. `/home/runner/workspace/scripts/pre-build.js`
10. `/home/runner/workspace/scripts/pre-build-bypass.js`
11. `/home/runner/workspace/scripts/validate-deployment.js`
12. `/home/runner/workspace/scripts/deploy-ready.js`
13. `/home/runner/workspace/scripts/quick-build.js`
14. `/home/runner/workspace/scripts/simple-build.js`

### Server Files
15. `/home/runner/workspace/server/index.ts`
16. `/home/runner/workspace/server/vite.ts`
17. `/home/runner/workspace/server/loadEnv.ts`
18. `/home/runner/workspace/server/validateEnv.ts`

### Client Entry Points
19. `/home/runner/workspace/client/index.html`
20. `/home/runner/workspace/client/src/main.tsx`
21. `/home/runner/workspace/client/src/App.tsx`

### Manifest Files (Conflict!)
22. `/home/runner/workspace/client/public/manifest.json`
23. `/home/runner/workspace/public/manifest.json`
24. `/home/runner/workspace/dist/public/manifest.json`

### Built Files (For Analysis)
25. `/home/runner/workspace/dist/index.js`
26. `/home/runner/workspace/dist/package.json`
27. `/home/runner/workspace/dist/public/index.html`
28. `/home/runner/workspace/dist/public/assets/vendor-react-c0q1gNxY.js`

### Environment Files (if they exist)
29. `/home/runner/workspace/.env` (if exists)
30. `/home/runner/workspace/.env.production` (if exists)
31. `/home/runner/workspace/server/.env` (if exists)
32. `/home/runner/workspace/server/.env.production` (if exists)

### Analysis Report
33. `/home/runner/workspace/DEPLOYMENT_ANALYSIS.md`

## Key Findings Summary

1. **Development server is still running** - PID 192 using tsx
2. **Three manifest.json files exist** with different protocols
3. **React useState IS in the bundle** (7 occurrences)
4. **Root-level public/manifest.json** was created on Jun 22 - this is suspicious

## Recommended Download Priority
1. All build scripts (items 5-14)
2. Configuration files (items 1-4)
3. Manifest files (items 22-24)
4. Server files (items 15-18)
5. Built vendor bundle (item 28)

## Quick Download Command
```bash
# Create a zip of all deployment-related files
zip -r deployment-debug.zip \
  package.json .replit vite.config.ts tsconfig.json \
  scripts/*.js \
  server/index.ts server/vite.ts server/loadEnv.ts server/validateEnv.ts \
  client/index.html client/src/main.tsx client/src/App.tsx \
  client/public/manifest.json public/manifest.json dist/public/manifest.json \
  dist/index.js dist/package.json dist/public/index.html \
  dist/public/assets/vendor-react-*.js \
  DEPLOYMENT_ANALYSIS.md
```