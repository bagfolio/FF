import express from "express";
import type { Express } from "./types/express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express) {
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
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      // Ensure these settings override any config file settings
      host: "0.0.0.0",
      cors: true,
      strictPort: false,
      // Force allowedHosts to 'all' for Replit compatibility
      hmr: {
        server,
        host: "localhost",
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
  // In production, files are in dist/public relative to cwd
  const distPath = process.env.NODE_ENV === 'production' 
    ? path.resolve(process.cwd(), "public")
    : path.resolve(import.meta.dirname, "../dist/public");

  console.log(`📁 Serving static files from: ${distPath}`);
  console.log(`📍 Current directory: ${process.cwd()}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`❌ Static files directory not found: ${distPath}`);
    console.error('📂 Files in current directory:', fs.readdirSync(process.cwd()));
    
    // Try alternate paths
    const alternatePaths = [
      path.resolve(process.cwd(), "dist/public"),
      path.resolve(process.cwd(), "../dist/public"),
      path.resolve(import.meta.dirname, "public"),
    ];
    
    for (const altPath of alternatePaths) {
      if (fs.existsSync(altPath)) {
        console.log(`✅ Found static files at alternate path: ${altPath}`);
        app.use(express.static(altPath));
        app.use("*", (_req, res) => {
          res.sendFile(path.resolve(altPath, "index.html"));
        });
        return;
      }
    }
    
    throw new Error(
      `Could not find the build directory. Tried: ${distPath} and alternates`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
