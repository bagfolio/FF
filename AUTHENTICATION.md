# Revela Authentication System

## Overview

The Revela platform now supports a complete production-ready authentication system with both email/password and OAuth (Google) authentication methods.

## Features

### 1. Email/Password Authentication
- User registration with email and password
- Secure password hashing with bcrypt (10 rounds)
- Email verification system
- Password reset functionality
- Remember me tokens for persistent sessions
- Password strength validation

### 2. OAuth Authentication
- Google OAuth integration via Replit Auth
- Automatic user creation on first login
- Session management with PostgreSQL

### 3. Security Features
- CSRF protection (to be implemented)
- Rate limiting (to be implemented)
- Secure session cookies (httpOnly, secure, sameSite)
- Password requirements enforcement
- Email enumeration prevention

## API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userType: "athlete" | "scout"
}
```

#### Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string,
  rememberMe?: boolean
}
```

#### Logout
```
POST /api/auth/logout
```

#### Forgot Password
```
POST /api/auth/forgot-password
Body: {
  email: string
}
```

#### Reset Password
```
POST /api/auth/reset-password
Body: {
  token: string,
  password: string
}
```

#### Verify Email
```
GET /api/auth/verify-email?token=xxx
```

### Combined Registration Endpoints

#### Register Athlete
```
POST /api/auth/register/athlete
Body: {
  // Basic user info is taken from session
  fullName: string,
  birthDate: string,
  cpf: string,
  city: string,
  state: string,
  position: string,
  dominantFoot: "left" | "right" | "both",
  // ... other athlete fields
}
```

#### Register Scout
```
POST /api/auth/register/scout
Body: {
  // Basic user info is taken from session
  fullName: string,
  organization: string,
  position: string,
  phone?: string
}
```

## Frontend Components

### AuthModal
The main authentication modal with tabs for login/signup:
```tsx
<AuthModal
  open={showAuthModal}
  onOpenChange={setShowAuthModal}
  defaultTab="login" // or "signup"
  userType="athlete" // or "scout" or undefined
/>
```

### LoginForm
Handles user login with email/password

### SignupForm
Handles new user registration with validation

### ForgotPasswordForm
Handles password reset requests

## Authentication Flow

### New User Registration
1. User clicks "COMEÇAR MINHA JORNADA" or "SOU SCOUT"
2. AuthModal opens in signup mode
3. User fills registration form
4. Account is created (email verification sent)
5. User is redirected to appropriate onboarding flow

### Existing User Login
1. User clicks "Entrar" button
2. AuthModal opens in login mode
3. User enters credentials
4. On success, redirected to dashboard

### Password Reset
1. User clicks "Esqueci minha senha" in login form
2. Enters email address
3. Receives reset link via email
4. Clicks link to reset password

## Development Mode

For local development, you can bypass authentication:

```env
NODE_ENV=development
BYPASS_AUTH=true
```

This creates a simulated user session without requiring actual authentication.

## Database Schema

### Users Table
- id: User unique identifier
- email: User email (unique)
- passwordHash: Hashed password
- firstName/lastName: User name
- userType: athlete/scout/admin
- emailVerified: Email verification status
- lastLoginAt: Last login timestamp

### Password Reset Tokens
- userId: Reference to user
- token: Unique reset token
- expires: Token expiration
- used: Whether token was used

### Remember Me Tokens
- userId: Reference to user
- token: Remember me token
- expires: Token expiration

## Security Best Practices

1. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **Session Management**
   - Sessions stored in PostgreSQL
   - 7-day session expiration
   - Secure cookies in production

3. **Data Protection**
   - All passwords hashed with bcrypt
   - No passwords stored in plain text
   - Email verification required

## Troubleshooting

### Common Issues

1. **"Email já está cadastrado"**
   - User already exists with this email
   - Use forgot password to recover account

2. **"Email ou senha incorretos"**
   - Invalid credentials
   - Check email and password

3. **401 Unauthorized**
   - Session expired
   - User needs to login again

### Testing Authentication

1. Create a test account:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!@#",
       "firstName": "Test",
       "lastName": "User",
       "userType": "athlete"
     }'
   ```

2. Login:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!@#"
     }'
   ```

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Social login (Facebook, Twitter)
- [ ] Biometric authentication
- [ ] Magic link authentication
- [ ] Session activity monitoring
- [ ] Account security settings