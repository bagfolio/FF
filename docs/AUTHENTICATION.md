# Revela Authentication System

## Overview

The Revela platform uses Replit Auth for user authentication, providing a secure and seamless login experience. The system supports two user types: Athletes and Scouts, each with their own registration flow and dashboard.

## Authentication Flow

### 1. Initial Login
- User clicks "COMEÇAR MINHA JORNADA" on the landing page
- Redirected to `/api/login` which triggers Replit OAuth
- After successful OAuth, user is created in the database
- User is redirected to `/home` for user type selection

### 2. User Type Selection
- New users must choose between Athlete or Scout
- Selection is made through the UserTypeModal component
- User is redirected to appropriate onboarding flow

### 3. Profile Registration
- **Athletes**: Complete multi-step onboarding with personal info, position, physical data
- **Scouts**: Provide organization details and professional information
- Registration creates both user type and profile in a single transaction

### 4. Protected Routes
- All authenticated routes use the `ProtectedRoute` component
- Routes can require specific user types (athlete/scout)
- Unauthorized access redirects to login or appropriate dashboard

## Development Mode

For local development, you can bypass Replit Auth:

```env
NODE_ENV=development
BYPASS_AUTH=true
```

This creates a simulated user session without requiring actual OAuth.

## API Endpoints

### Authentication
- `GET /api/login` - Initiates Replit OAuth flow
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - Logs out user and clears session
- `GET /api/auth/user` - Returns current authenticated user

### Registration
- `POST /api/auth/register/athlete` - Combined user type + athlete profile creation
- `POST /api/auth/register/scout` - Combined user type + scout profile creation

### Legacy Endpoints (for existing profiles)
- `POST /api/auth/user-type` - Sets user type only
- `POST /api/athletes` - Creates athlete profile
- `POST /api/scouts` - Creates scout profile

## Frontend Components

### useAuth Hook
```typescript
const { user, isLoading, isAuthenticated, refetch } = useAuth();
```
- Manages authentication state
- Handles 401 errors automatically
- Redirects to login when needed

### ProtectedRoute Component
```typescript
<ProtectedRoute requireUserType="athlete">
  <AthleteDashboard />
</ProtectedRoute>
```
- Wraps routes that require authentication
- Optional `requireUserType` prop for role-based access
- Shows loading state during auth check

## Security Considerations

1. **Session Management**
   - Sessions stored in PostgreSQL
   - 7-day expiration with automatic refresh
   - Secure, httpOnly cookies

2. **CSRF Protection**
   - Built into Replit Auth
   - Additional measures can be added as needed

3. **Input Validation**
   - Zod schemas for all user inputs
   - Server-side validation on all endpoints
   - Parameterized queries prevent SQL injection

## Database Schema

### Users Table
- `id`: Unique identifier from Replit Auth
- `email`: User's email address
- `firstName`, `lastName`: User's name
- `profileImageUrl`: Avatar URL
- `userType`: 'athlete' | 'scout' | 'admin'
- `createdAt`, `updatedAt`: Timestamps

### Athletes Table
- Links to users via `userId`
- Stores athlete-specific data (position, physical stats, etc.)

### Scouts Table
- Links to users via `userId`
- Stores scout-specific data (organization, position, etc.)

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**
   - Check if `BYPASS_AUTH` is set correctly
   - Ensure session hasn't expired
   - Verify Replit Auth environment variables

2. **Redirect loops**
   - Clear browser cookies
   - Check user type is set properly
   - Verify route protection logic

3. **Registration failures**
   - Check validation errors in network tab
   - Ensure all required fields are provided
   - Verify database constraints

## Future Enhancements

1. **Social Login**
   - Google OAuth integration
   - Facebook login for wider reach

2. **Two-Factor Authentication**
   - SMS verification for scouts
   - Email verification for all users

3. **Password Recovery**
   - Email-based reset flow
   - Security questions for minors

4. **Parental Controls**
   - Special flow for athletes under 18
   - Parent email verification
   - Limited data sharing options