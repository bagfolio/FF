# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

REVELA is a two-sided marketplace platform connecting young Brazilian football talent with professional scouts through AI-verified performance data. Built as a Progressive Web App (PWA) deployed on Replit, it democratizes access to professional football opportunities.

## Key Commands

### Development
```bash
npm run dev              # Runs both client (port 5173) and server (port 5000) concurrently
npm run dev:client      # Frontend only with Vite
npm run dev:server      # Backend only with tsx watch
```

### Build & Production
```bash
npm run build           # Full production build (runs prebuild, build, postbuild)
npm run start           # Production server (runs prestart for process management)
npm run validate       # Validate deployment configuration
```

### Database
```bash
npm run db:push         # Push Drizzle schema changes to database
npm run db:seed         # Seed subscription plans
```

### Stripe Integration
```bash
npm run stripe:setup-products   # Setup Stripe products
npm run stripe:test            # Test Stripe integration
```

### Testing
No test framework is currently configured. When implementing tests, check with the user for their preferred testing approach.

### Code Quality
No linting or type checking commands are currently configured in package.json. Ask the user for their preferred commands when needed.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OAuth + Passport.js sessions
- **Payments**: Stripe subscriptions
- **Media**: Cloudinary for image/video storage
- **Routing**: Wouter (client), Express (server)
- **State**: React Query for server state, Context for client state

### Directory Structure
```
client/
  src/
    components/     # Reusable UI components (shadcn/ui based)
    pages/          # Route components matching server routes
    hooks/          # Custom React hooks (useAuth, useMediaQuery, etc.)
    contexts/       # React contexts (AuthContext, etc.)
    lib/            # Utilities (api client, formatters)
    services/       # API service functions
server/
  routes/          # Express route handlers
  services/        # Business logic layer
  lib/            # Server utilities (auth, db connection)
  types/          # TypeScript type definitions
shared/
  schema.ts        # Drizzle database schema (single source of truth)
migrations/        # Database migration files
scripts/           # Build and deployment scripts
```

### Key Architectural Decisions

1. **Authentication Flow**: Multi-step onboarding after Replit OAuth
   - Initial auth → User type selection → Profile setup → Skills assessment
   - Session-based with protected routes by user type

2. **Data Flow Pattern**:
   - React Query manages all server state with caching
   - API calls through centralized client (`client/src/lib/api.ts`)
   - RESTful endpoints with consistent error handling

3. **UI Components**: 
   - Built on Shadcn/ui components with Brazilian theming
   - Dark/light mode support via next-themes
   - Mobile-first responsive design

4. **Database Schema**:
   - All models defined in `shared/schema.ts`
   - User types: athletes, scouts, admins
   - Verification levels: bronze → silver → gold → platinum
   - Subscription tiers with Stripe integration

5. **File Handling**:
   - Images uploaded to Cloudinary via server endpoints
   - Video upload planned but not yet implemented

### Important Patterns

1. **API Route Protection**:
   ```typescript
   // Always check auth and user type in routes
   if (!req.user) return res.status(401).json({ error: "Unauthorized" });
   if (req.user.userType !== 'athlete') return res.status(403).json({ error: "Forbidden" });
   ```

2. **Component Structure**:
   - Follow existing patterns in `client/src/components`
   - Use Shadcn/ui components as base
   - Apply Brazilian color scheme from Tailwind config

3. **Error Handling**:
   - Consistent error responses: `{ error: string, details?: any }`
   - Use React Query error boundaries for UI

4. **State Management**:
   - Server state: React Query only
   - Client state: React Context for auth, local state for components
   - No Redux or other state libraries

### Current Status & Missing Features

The platform is ~85% complete. Critical missing features:
- Video upload and AI analysis system
- Full payment processing (Stripe webhooks)
- Real-time notifications (WebSocket infrastructure exists but unused)
- Scout messaging system
- Advanced search filters

### Deployment Notes

- Hosted on Replit with autoscale deployment
- Environment variables managed through Replit Secrets
- Port configuration in `.replit` file
- Build validates with `scripts/validate-deployment.js`