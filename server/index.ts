// CRITICAL: Force production mode in Replit deployment
// This MUST be before any other imports to ensure correct behavior
if (process.env.REPL_OWNER || process.env.REPLIT_DEPLOYMENT) {
  process.env.NODE_ENV = 'production';
  console.log('🚀 Replit deployment detected - forcing NODE_ENV=production');
}

import './loadEnv';
import { checkEnvLoaded } from './loadEnv';
import express from "express";
import { createServer } from "http";
import type { Request, Response, NextFunction } from "./types/express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
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

// Request timeout middleware - prevent hanging requests
app.use((req, res, next) => {
  // Set a 30 second timeout for all requests
  req.setTimeout(30000, () => {
    console.error(`Request timeout: ${req.method} ${req.path}`);
    res.status(408).json({ error: 'Request timeout' });
  });
  
  res.setTimeout(30000, () => {
    console.error(`Response timeout: ${req.method} ${req.path}`);
    res.status(503).json({ error: 'Response timeout' });
  });
  
  next();
});

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

// Limit request body size to prevent memory exhaustion
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

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
    

    
    // Root health check endpoint for Replit monitoring
    app.get('/__replit_health__', (req, res) => {
      // Dedicated health check endpoint
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'revela-platform',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      });
    });
    
    // Also handle root path health checks
    app.head('/', (req, res) => {
      // HEAD requests to root are often health checks
      res.status(200).end();
    });
    
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
    
    // Add static file handlers for common files BEFORE the error handler
    // This prevents 404s for favicon, robots.txt, etc.
    app.get('/favicon.ico', (req, res) => {
      res.status(204).end(); // No content for now
    });
    
    app.get('/robots.txt', (req, res) => {
      res.type('text/plain');
      res.send('User-agent: *\nAllow: /');
    });
    
    // CRITICAL: Add comprehensive request debugging for production issues
    app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      const userAgent = req.get('User-Agent') || 'unknown';
      const referer = req.get('Referer') || 'direct';
      
      console.log(`🌐 [${timestamp}] ${req.method} ${req.path}`);
      console.log(`   📍 IP: ${req.ip}, Host: ${req.get('host')}`);
      
      // Log detailed info for critical requests
      if (req.path.includes('.tsx') || req.path.includes('src/') || req.path.includes('assets/')) {
        console.log(`   🔍 ASSET REQUEST: ${req.path}`);
        console.log(`   📱 User-Agent: ${userAgent.substring(0, 100)}`);
        console.log(`   🔗 Referer: ${referer}`);
      }
      
      // Track response
      const originalSend = res.send;
      res.send = function(data) {
        if (res.statusCode >= 400) {
          console.log(`   ❌ Response: ${res.statusCode} for ${req.path}`);
        } else if (req.path.includes('.tsx') || req.path.includes('src/') || req.path.includes('assets/')) {
          console.log(`   ✅ Response: ${res.statusCode} for ${req.path}`);
        }
        return originalSend.call(this, data);
      };
      
      next();
    });

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
    const isDevelopment = process.env.NODE_ENV === "development";
    console.log(`🔧 Server mode: ${process.env.NODE_ENV || 'not set'} (isDevelopment: ${isDevelopment})`);
    
    if (isDevelopment) {
      try {
        // Dynamically import setupVite only in development
        const { setupVite } = await import('./vite');
        await setupVite(app, server);
        console.log('✅ Vite development server configured');
      } catch (error) {
        console.error('⚠️ Vite setup failed, falling back to static serving:', error);
        serveStatic(app);
      }
    } else {
      console.log('📦 Running in production mode - serving static files');
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
