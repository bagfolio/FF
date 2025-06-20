# Mock Data Migration Documentation

## Overview
This document outlines the migration from hardcoded mock data to real API connections throughout the Revela application.

## Changes Made

### 1. **API Configuration**
- Created `/config/api.ts` with centralized API endpoints and feature flags
- Added polling intervals configuration
- Added feature toggles for development

### 2. **API Services**
- Created `/services/api.ts` with dedicated service modules:
  - `activityService` - Handles athlete activities and notifications
  - `achievementService` - Manages achievement data
  - `performanceService` - Performance metrics and history
  - `scoutService` - Scout statistics and athlete discovery
  - `checkinService` - Daily check-in functionality

### 3. **Component Updates**

#### Activity Feed (`/pages/athlete/activity.tsx`)
- Removed `generateDetailedActivities()` function
- Connected to `activityService.getAthleteActivities()`
- Added proper query keys and error handling

#### Achievements (`/pages/athlete/achievements.tsx`)
- Removed hardcoded achievements array
- Connected to `achievementService.getAthleteAchievements()`
- Added icon mapping system

#### Social Proof Notifications (`/components/features/athlete/SocialProofNotification.tsx`)
- Removed hardcoded notifications array
- Connected to real-time API with polling
- Added feature flag support

#### Performance Evolution (`/components/features/athlete/PerformanceEvolution.tsx`)
- Removed `mockHistoryData` array
- Connected to performance history API
- Added metrics fetching

#### Scout Dashboard (`/pages/scout/dashboard.tsx`)
- Removed `generateRealisticAthlete()` usage
- Connected to scout statistics API
- Real recent athletes data

#### Next Step Widget (`/components/features/athlete/NextStepWidget.tsx`)
- Updated countdown timer to calculate real time until midnight
- Removed hardcoded statistics
- Made content more generic

### 4. **Data Structures**
All mock data structures have been preserved in the API responses to ensure compatibility:
- Activities maintain the same type system
- Achievements use icon keys mapped to frontend icons
- Performance data follows the same format

### 5. **Feature Flags**
Added in `/config/api.ts`:
- `SOCIAL_PROOF_NOTIFICATIONS` - Enable/disable social notifications
- `OFFLINE_MODE` - Offline queue support
- `DAILY_CHALLENGES` - Daily challenge system
- `ACHIEVEMENTS_SYSTEM` - Achievement features
- `DEBUG_MODE` - Development features

## API Endpoints Required

The following endpoints need to be implemented on the backend:

### Athletes
- `GET /api/athletes/recent` - Recent athletes for scouts
- `GET /api/athletes/{id}/activities` - Athlete activity history
- `GET /api/athletes/{id}/achievements` - Athlete achievements
- `GET /api/athletes/{id}/performance-history` - Performance over time
- `GET /api/athletes/{id}/performance-metrics` - Additional metrics

### Scouts
- `GET /api/scouts/{id}/stats` - Scout statistics

### Notifications
- `GET /api/notifications/social-proof` - Real-time notifications

### Check-in
- `POST /api/checkin/submit` - Submit daily check-in
- `GET /api/checkin/athlete/{id}/history` - Check-in history

## Response Formats

### Activities Response
```json
[
  {
    "id": "string",
    "type": "view|achievement|test|update|rank|social|system",
    "title": "string",
    "message": "string",
    "time": "string",
    "date": "string",
    "metadata": {
      "club": "string",
      "achievement": "string",
      "xpEarned": 0,
      "percentile": 0
    },
    "isNew": true
  }
]
```

### Achievements Response
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "iconKey": "trophy|star|shield|flame|etc",
    "points": 0,
    "color": "from-color-400 to-color-600",
    "category": "performance|profile|engagement|social|elite",
    "unlocked": true,
    "unlockedAt": "string",
    "progress": 0,
    "rarity": "common|rare|epic|legendary",
    "requirement": "string"
  }
]
```

### Scout Stats Response
```json
{
  "athletesDiscovered": 0,
  "profilesViewed": 0,
  "newTalentsThisWeek": 0,
  "contactsMade": 0
}
```

## Migration Checklist

- [x] Remove all `Math.random()` usage for data generation
- [x] Remove hardcoded arrays and objects
- [x] Create centralized API configuration
- [x] Create service layer for API calls
- [x] Update all components to use real data
- [x] Add proper error handling
- [x] Preserve data structures for compatibility
- [x] Add feature flags for gradual rollout
- [x] Document required API endpoints

## Testing

To test the migration:

1. Ensure all API endpoints return data in the expected format
2. Check that loading states work correctly
3. Verify error handling when APIs return 404/empty data
4. Test feature flags by toggling them in config
5. Monitor network requests to ensure proper API usage

## Rollback Plan

If issues arise:

1. Feature flags can disable specific features
2. The mock data structures are preserved in `/lib/brazilianData.ts`
3. Service methods return sensible defaults on 404 errors
4. Components gracefully handle empty data states