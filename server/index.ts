import './loadEnv';
import { checkEnvLoaded } from './loadEnv';
import express from "express";
import { createServer } from "http";
import type { Request, Response, NextFunction } from "./types/express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./replitAuth";
import { seedSubscriptionPlans } from "./seedSubscriptionPlans";
import { validateEnv } from "./validateEnv";

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log but don't crash the server
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Exit and let the process manager restart
  process.exit(1);
});

// Check environment variables are loaded
checkEnvLoaded();

// Validate environment configuration
validateEnv();

const app = express();

// Enable CORS for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('🚀 Starting server initialization...');
    
    // Add health check route first - critical for deployment
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
    
    // Setup authentication before routes
    await setupAuth(app);
    console.log('✅ Authentication setup complete');
    
    // Seed subscription plans if needed (non-blocking)
    try {
      await seedSubscriptionPlans();
      console.log('✅ Database connection verified and seeded');
    } catch (error) {
      console.error('⚠️ Warning: Failed to seed subscription plans:', error);
      // Don't exit - continue with server startup
    }
    
    await registerRoutes(app);
    console.log('✅ Routes registered successfully');

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error('Server error:', err);
      res.status(status).json({ message });
      // Don't throw - it crashes the server!
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app);
    } else {
      serveStatic(app);
    }
    console.log('✅ Static file serving configured');

    // Create HTTP server AFTER all middleware is setup
    const server = createServer(app);
    
    // Use PORT environment variable if available, otherwise default to 5000
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    
    // Add error handling for port binding
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
      } else if (error.code === 'EACCES') {
        console.error(`❌ Port ${port} requires elevated privileges`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Listen with promise to ensure binding completes
    await new Promise<void>((resolve, reject) => {
      server.listen(port, '0.0.0.0', () => {
        log(`serving on port ${port}`);
        console.log(`✅ Server is listening on http://0.0.0.0:${port}`);
        console.log('✅ Server is ready to accept connections');
        resolve();
      });
      
      server.on('error', reject);
    });
    // Add graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
    console.log('✅ Server startup complete - ready for connections');
    
    // Keep the process alive - this is critical for deployment
    // The server will continue running and handling requests

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
})();
