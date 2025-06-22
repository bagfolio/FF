# Revela - Brazilian Football Talent Discovery Platform

## Overview

Revela is a comprehensive web application designed to democratize football talent discovery across Brazil. The platform connects young athletes with professional scouts using AI-powered verification systems, creating opportunities from the Amazon to São Paulo. Built as a full-stack web application with modern technologies, it provides separate interfaces for athletes and scouts while maintaining a unified backend system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom Brazilian color scheme
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **State Management**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful APIs with role-based access control
- **Middleware**: Custom logging, error handling, and authentication middleware

### Database Layer
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless with WebSocket support

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Role-based system supporting athletes, scouts, and admins
- **Security**: Secure cookies, CSRF protection, and session validation

### User Role System
- **Athletes**: Complete profile creation with personal data, positions, and physical attributes
- **Scouts**: Professional verification and search capabilities
- **Admins**: Platform management and oversight functionality
- **Role Data**: Separate tables for role-specific information linked to base user accounts

### Verification System
- **AI-Powered**: Planned integration for talent verification using machine learning
- **Tiered Levels**: Bronze, Silver, Gold, and Platinum verification badges
- **Performance Tracking**: Test results and achievement recording
- **Analytics**: View tracking and performance metrics

### Search and Discovery
- **Advanced Filtering**: Position, location, age, and verification level filters
- **Geographic Coverage**: Support for all Brazilian states and cities
- **Real-time Search**: Efficient database queries with pagination
- **Scout Analytics**: Search history and athlete engagement tracking

## Data Flow

1. **User Registration**: Users authenticate via Replit Auth and select their role (athlete/scout)
2. **Profile Creation**: Role-specific onboarding flows collect necessary information
3. **Verification Process**: Athletes submit data for AI-powered verification (future feature)
4. **Discovery**: Scouts search and filter athletes based on criteria
5. **Engagement**: View tracking and analytics for platform insights
6. **Performance**: Athletes upload test results and achievements for enhanced profiles

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation

### Authentication
- **openid-client**: OpenID Connect integration for Replit Auth
- **passport**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session storage

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety and development experience

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL with environment-based configuration
- **Session Storage**: PostgreSQL sessions with development-friendly settings

### Production Deployment
- **Platform**: Replit autoscale deployment
- **Build Process**: Vite production build + esbuild server bundling
- **Static Assets**: Served from dist/public directory
- **Environment**: Production-optimized settings with secure session configuration

### Database Management
- **Migrations**: Drizzle Kit for schema versioning
- **Environment Variables**: DATABASE_URL for connection management
- **Connection Pooling**: Neon serverless with automatic scaling

### Progressive Web App
- **Manifest**: Complete PWA configuration with Brazilian-themed icons
- **Offline Support**: Service worker integration (future enhancement)
- **Mobile Optimization**: Responsive design with mobile-first approach

## Changelog

- June 16, 2025: Initial setup and MVP deployment
- June 16, 2025: Completely removed Replit Auth system to eliminate development friction
- June 16, 2025: Fixed font consistency - loading screen now uses clean Inter fonts
- June 16, 2025: Resolved infinite loading issue by fixing home page redirect loop
- June 16, 2025: Implemented mock authentication system for development ease
- June 19, 2025: Fixed all SVG data URL syntax errors and WebGL context issues
- June 19, 2025: Created missing 3D components (BrazilianStadiumScene, PlayerCard3D)
- June 19, 2025: Updated "COMEÇAR MINHA JORNADA" button styling to match modern aesthetic
- June 19, 2025: Complete rebrand from "Futebol Futuro" to "Revela"
- June 22, 2025: Fixed critical deployment issues for production readiness
- June 22, 2025: Added root route handler responding with 200 status for health checks
- June 22, 2025: Prevented server premature exit to keep process alive for requests
- June 22, 2025: Validated deployment configuration passes all readiness checks

## User Preferences

Preferred communication style: Simple, everyday language.