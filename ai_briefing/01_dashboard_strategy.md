# STRATEGY: The Athlete Dashboard Redesign

**Current Problem:** The existing dashboard at `client/src/pages/athlete/dashboard.tsx` is feature-rich but experientially poor. It is a single, long column of information that creates cognitive overload. It presents everything with equal importance, failing to guide the user. It is a "buffet" of data when the user needs a "guided menu."

**Strategic Solution:** We will transform the dashboard from a passive data report into an **active, motivating, and habit-forming command center.**

**The New Organizing Principle:**
We will implement a two-column layout on desktop/tablet that stacks logically on mobile. This separates the user's experience into two distinct zones:

1.  **The Action Zone (Main Column):** This is the "DO" area. It answers the question: "What should I do right now?" It will contain components that prompt immediate user action: the `NextStepWidget`, the `CombineDigitalHub`, and detailed `PerformanceEvolution` charts.

2.  **The Motivation Zone (Sidebar Column):** This is the "FEEL" area. It answers the question: "How am I doing and why should I keep going?" It contains gamification and social proof elements that provide context and encouragement: the `TrustPyramidProgressWidget`, the `AchievementsGallery`, and the `ActivityFeed`.

This strategic separation is the key to solving the "headache" of the current dashboard. It creates a clear visual hierarchy that guides the user's eye and their actions.