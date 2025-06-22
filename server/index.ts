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
try {
  checkEnvLoaded();
} catch (error) {
  console.error('Environment loading failed:', error);
}

// Validate environment configuration with fallback
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  if (process.env.NODE_ENV === 'production') {
    console.warn('Continuing in production with fallback configuration');
  } else {
    throw error;
  }
}

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
    

    
    // Add diagnostic endpoint for production debugging
    app.get('/debug/env', (req, res) => {
      if (process.env.NODE_ENV !== 'production') {
        return res.json({
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
          SESSION_SECRET: process.env.SESSION_SECRET ? 'SET' : 'NOT_SET',
          BYPASS_AUTH: process.env.BYPASS_AUTH
        });
      }
      res.status(403).json({ error: 'Debug endpoint disabled in production' });
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

      console.error('❌ Application error:', {
        message: err.message,
        stack: err.stack,
        url: _req.url,
        method: _req.method,
        timestamp: new Date().toISOString()
      });
      
      res.status(status).json({ 
        error: message,
        timestamp: new Date().toISOString()
      });
    });

    // Create HTTP server BEFORE setting up Vite
    const server = createServer(app);
    
    // Setup static file serving for production or if Vite fails
    // Only setup vite in development environment
    if (process.env.NODE_ENV === "development") {
      try {
        await setupVite(app);
      } catch (error) {
        console.error('⚠️ Vite setup failed, continuing with static serving:', error);
        serveStatic(app);
      }
    } else {
      serveStatic(app);
    }
    console.log('✅ Static file serving configured');
    
    // Use PORT environment variable if available, otherwise default to 5000
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    
    // Add error handling for port binding
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
        console.error('Please check if another instance is running or change the PORT environment variable');
        process.exit(1); // This one is critical - can't recover from port conflict
      } else if (error.code === 'EACCES') {
        console.error(`❌ Port ${port} requires elevated privileges`);
        process.exit(1); // This one is critical - can't bind to privileged port
      } else {
        console.error('❌ Server error:', error);
        // Don't exit for other errors - try to recover
        console.error('Server will attempt to continue despite error');
      }
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
    console.log('🔄 Server will stay alive and handle requests indefinitely');
    
    // CRITICAL: Keep the process alive - multiple mechanisms for reliability
    // 1. Prevent stdin from closing
    process.stdin.resume();
    
    // 2. Add heartbeat to prevent any timeout-based exits
    const heartbeatInterval = setInterval(() => {
      // This keeps the event loop active
      const uptime = Math.floor(process.uptime());
      if (uptime % 3600 === 0) { // Log every hour
        console.log(`💓 Server heartbeat - uptime: ${uptime}s`);
      }
    }, 1000);
    
    // Don't block process termination
    heartbeatInterval.unref();
    
    // 3. Handle any attempts to close stdin
    process.stdin.on('end', () => {
      console.log('⚠️  stdin end event - server staying alive');
    });
    
    // Log that we're definitely not exiting
    console.log('✅ Keep-alive mechanisms active - server will NOT exit');

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    process.exit(1);
  }
})();
