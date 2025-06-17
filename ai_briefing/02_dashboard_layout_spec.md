# SPECIFICATION: New `dashboard.tsx` Layout

**Target File:** `client/src/pages/athlete/dashboard.tsx`

**Action:** Completely refactor the returned JSX of this component to match the following structure. You will create several new sub-components to achieve this modularity.

**New JSX Structure:**

```jsx
// client/src/pages/athlete/dashboard.tsx

import { HeroSection } from '@/components/features/athlete/HeroSection';
import { NextStepWidget } from '@/components/features/athlete/NextStepWidget';
import { CombineDigitalHub } from '@/components/features/athlete/CombineDigitalHub';
import { PerformanceEvolution } from '@/components/features/athlete/PerformanceEvolution';
import { TrustPyramidProgressWidget } from '@/components/features/athlete/TrustPyramidProgressWidget';
import { AchievementsGallery } from '@/components/features/athlete/AchievementsGallery';
import { ActivityFeed } from '@/components/features/athlete/ActivityFeed';
// ... other necessary imports

export default function AthleteDashboard() {
  // ... (keep existing state and data-fetching logic)

  return (
    <div className="space-y-8">
      <HeroSection athlete={realisticStats} />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-8">
            <NextStepWidget profileCompletion={profileCompletion} tests={tests} />
            <CombineDigitalHub tests={tests} />
            <PerformanceEvolution athlete={realisticStats} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <TrustPyramidProgressWidget currentLevel={verificationLevel} />
            <AchievementsGallery achievements={achievements} />
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      {/* The Floating Action Button can remain as is */}
    </div>
  );
}