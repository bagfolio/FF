import express from "express";
import type { Express } from "./types/express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server?: Server) {
  // Only import Vite dependencies when actually needed
  const { createServer: createViteServer, createLogger } = await import('vite');
  const { nanoid } = await import('nanoid');
  const viteLogger = createLogger();
  
  log(`Setting up Vite in development mode`);
  log(`Environment: NODE_ENV=${process.env.NODE_ENV}`);
  
  // Log incoming requests for debugging
  app.use((req, res, next) => {
    if (req.headers.host && req.headers.host.includes('replit.dev')) {
      log(`Handling request from Replit host: ${req.headers.host}`);
    }
    next();
  });
  
  // Set environment variable to disable host check
  process.env.DANGEROUSLY_DISABLE_HOST_CHECK = 'true';
  
  const vite = await createViteServer({
    // Load the vite.config.ts file to get proper configuration
    configFile: path.resolve(import.meta.dirname, "..", "vite.config.ts"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit - let the server continue
        console.error('Vite error occurred but server will continue');
      },
    },
    server: {
      middlewareMode: true,
      // Ensure these settings override any config file settings
      host: "0.0.0.0",
      cors: true,
      strictPort: false,
      // Force allowedHosts to 'all' for Replit compatibility
      hmr: server ? {
        server,
        host: process.env.REPL_SLUG && process.env.REPL_OWNER 
          ? `${process.env.REPL_SLUG}--${process.env.REPL_OWNER}.replit.dev`
          : undefined,
        clientPort: 443,
        protocol: "wss"
      } : {
        host: process.env.REPL_SLUG && process.env.REPL_OWNER 
          ? `${process.env.REPL_SLUG}--${process.env.REPL_OWNER}.replit.dev`
          : undefined,
        clientPort: 443,
        protocol: "wss"
      }
    },
    // Force the server config to merge properly
    mode: process.env.NODE_ENV || "development",
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // FIXED: Always resolve paths from the root directory
  // The production startup script now keeps us in the root directory
  
  let distPath: string;
  const cwd = process.cwd();
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'not set'} (isProduction: ${isProduction})`);
  console.log(`📍 Current working directory: ${cwd}`);
  console.log(`📁 Script location: ${import.meta.dirname}`);
  
  // Always resolve from root directory since we no longer cd into dist
  distPath = path.resolve(cwd, "dist/public");
  
  console.log(`📁 Attempting to serve static files from: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`❌ CRITICAL: Static files directory not found: ${distPath}`);
    console.error('📂 Current directory contents:', fs.readdirSync(cwd));
    
    // Try alternate paths with detailed logging
    const alternatePaths = [
      path.resolve(cwd, "public"),
      path.resolve(cwd, "dist/public"),
      path.resolve(cwd, "../dist/public"),
      path.resolve(import.meta.dirname, "public"),
      path.resolve(import.meta.dirname, "../public"),
    ];
    
    console.error('🔍 Trying alternate paths:');
    alternatePaths.forEach(altPath => {
      const exists = fs.existsSync(altPath);
      console.error(`  ${exists ? '✅' : '❌'} ${altPath}`);
    });
    
    for (const altPath of alternatePaths) {
      if (fs.existsSync(altPath)) {
        console.log(`✅ RECOVERED: Found static files at alternate path: ${altPath}`);
        distPath = altPath; // Update the path to use the found one
        break;
      }
    }
    
    // If still no valid path found, serve maintenance page
    if (!fs.existsSync(distPath)) {
      console.error(`❌ FATAL: Could not find any static files directory.`);
      app.use("*", (_req, res) => {
        res.status(503).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Revela - Maintenance</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>🚧 Application is being deployed</h1>
              <p>The build process is still running. Please refresh in a few moments.</p>
              <p style="color: #666; margin-top: 20px;">Expected static files at: ${distPath}</p>
            </body>
          </html>
        `);
      });
      return;
    }
  }

  // SUCCESS: We have a valid static files directory
  console.log(`✅ SERVING static files from: ${distPath}`);
  
  // Set up static file serving with proper headers
  app.use(express.static(distPath, {
    // Add caching headers for assets
    setHeaders: (res, path) => {
      if (path.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for hashed assets
      } else {
        res.setHeader('Cache-Control', 'public, max-age=0'); // No cache for HTML
      }
    }
  }));

  // Handle specific API 404s before the catch-all
  app.use("/api/*", (_req, res) => {
    console.log(`❌ API 404: ${_req.path}`);
    res.status(404).json({ error: "API endpoint not found" });
  });

  // CRITICAL: Fall through to index.html for client-side routing
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    console.log(`📄 Serving HTML for ${_req.path} from: ${indexPath}`);
    
    if (fs.existsSync(indexPath)) {
      // CRITICAL: Verify we're serving production HTML
      const htmlContent = fs.readFileSync(indexPath, 'utf-8');
      
      // Check for development artifacts that should NEVER be in production
      const devArtifacts = [
        '@vite/client',
        '@react-refresh',
        'src/main.tsx',
        'http://localhost:5173',
        'ws://localhost:5173'
      ];
      
      const foundArtifacts = devArtifacts.filter(artifact => htmlContent.includes(artifact));
      if (foundArtifacts.length > 0) {
        console.error('❌ CRITICAL ERROR: Production HTML contains development artifacts!');
        console.error('❌ Found:', foundArtifacts.join(', '));
        console.error('❌ This indicates a broken build or wrong file being served');
        console.error('❌ Path:', indexPath);
        
        // Return error page instead of broken HTML
        return res.status(500).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Revela - Build Error</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>❌ Critical Build Error</h1>
              <p>The application build contains development artifacts.</p>
              <p>Please rebuild the application with: npm run build</p>
              <details style="margin-top: 20px;">
                <summary>Technical Details</summary>
                <p>Found: ${foundArtifacts.join(', ')}</p>
                <p>In file: ${indexPath}</p>
              </details>
            </body>
          </html>
        `);
      }
      
      // Log what we're actually serving
      const scriptMatch = htmlContent.match(/<script[^>]*src="([^"]*)"[^>]*>/);
      if (scriptMatch) {
        console.log(`✅ Serving production HTML with script: ${scriptMatch[1]}`);
      }
      
      res.sendFile(indexPath);
    } else {
      console.error(`❌ CRITICAL: index.html not found at ${indexPath}`);
      res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Revela - Error</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>❌ Application Error</h1>
            <p>index.html not found at: ${indexPath}</p>
          </body>
        </html>
      `);
    }
  });
}
