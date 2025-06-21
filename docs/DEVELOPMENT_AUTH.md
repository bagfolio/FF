# Development Authentication Guide

This guide explains how authentication works in the Futebol Futuro application during development.

## Overview

The application supports multiple authentication methods:
1. **Replit OAuth** - Primary authentication in production
2. **Email/Password** - Available in all environments
3. **Development Bypass** - Simplified auth for development
4. **Quick Login** - Pre-configured test accounts

## Development Authentication Methods

### 1. BYPASS_AUTH Mode

When `BYPASS_AUTH=true` is set in `.env.local`, the authentication middleware automatically creates a simulated user session without requiring actual login.

**Configuration:**
```env
NODE_ENV=development
BYPASS_AUTH=true
```

**How it works:**
- Any API request that requires authentication will automatically get a dev user
- The dev user has the following properties:
  - Email: `dev@futebol-futuro.com`
  - Name: `Dev User`
  - ID: `dev-user-[timestamp]`

### 2. Quick Login (Recommended for Testing)

The application provides pre-configured test accounts that can be accessed via the Dev Quick Login component.

**Available Test Profiles:**

#### Athletes:
- **João Silva** (`athlete-1`)
  - 16 years old, Atacante, Flamengo Sub-17
  - Email: `joao.silva@test.com`
  - Password: `Test123!@#`

- **Carlos Santos** (`athlete-2`)
  - 19 years old, Meio-Campo, Santos FC
  - Email: `carlos.santos@test.com`
  - Password: `Test123!@#`

- **Pedro Oliveira** (`athlete-3`)
  - 18 years old, Zagueiro, Corinthians Sub-20
  - Email: `pedro.oliveira@test.com`
  - Password: `Test123!@#`

- **Rafael Costa** (`athlete-4`)
  - 17 years old, Goleiro, Palmeiras Sub-17
  - Email: `rafael.costa@test.com`
  - Password: `Test123!@#`

#### Scouts:
- **Roberto Mendes** (`scout-1`)
  - Scout Principal, Flamengo
  - Email: `roberto.mendes@test.com`
  - Password: `Test123!@#`

- **Ana Paula Silva** (`scout-2`)
  - Scout Regional, Agência Elite Sports
  - Email: `ana.silva@test.com`
  - Password: `Test123!@#`

- **Fernando Lima** (`scout-3`)
  - Coordenador de Base, Santos FC
  - Email: `fernando.lima@test.com`
  - Password: `Test123!@#`

### 3. Email/Password Registration

You can also create new accounts using the standard registration flow:
1. Navigate to `/` (landing page)
2. Click "Começar Agora" or "Login"
3. Choose "Criar conta"
4. Fill in the registration form

## Development API Endpoints

### Quick Login
```
POST /api/dev/quick-login
Body: { "profileId": "athlete-1" }
```

### Seed Test Data
```
POST /api/dev/seed-test-data
```
Creates all test profiles in the database.

### Clear Test Data
```
POST /api/dev/clear-test-data
```
Removes all test profiles from the database.

## Cookie Configuration

In development mode, cookies are configured with:
- `secure: false` - Allows cookies over HTTP
- `httpOnly: true` - Prevents JavaScript access
- `sameSite: 'lax'` - CSRF protection

## Troubleshooting

### "User not authenticated" Error
1. Check if `BYPASS_AUTH=true` is set in `.env.local`
2. Clear browser cookies and localStorage
3. Restart the development server

### Session Not Persisting
1. Ensure cookies are enabled in your browser
2. Check that you're accessing the app via the correct URL
3. Verify the session secret is set in environment variables

### Quick Login Not Working
1. Run seed test data: `POST /api/dev/seed-test-data`
2. Check browser console for errors
3. Ensure you're in development mode

## Security Notes

⚠️ **Important**: These development authentication methods should NEVER be used in production:
- `BYPASS_AUTH` is only active when `NODE_ENV=development`
- Dev routes are only registered in non-production environments
- Test accounts use weak passwords and should not be deployed

## Best Practices

1. **Use Quick Login** for rapid testing of different user types
2. **Create real accounts** when testing the full authentication flow
3. **Clear test data** periodically to avoid database clutter
4. **Test both authenticated and unauthenticated states** during development