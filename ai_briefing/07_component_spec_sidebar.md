# COMPONENT SPEC: Sidebar Components

**Purpose:** To organize the motivational and contextual elements of the dashboard into a dedicated sidebar.

**Implementation Details:**
-   You will create three new components and place them within the `lg:col-span-4` div in `dashboard.tsx`.

1.  **`TrustPyramidProgressWidget.tsx`**
    -   **Action:** Create this new component file.
    -   **Content:** Move the entire implementation from the existing `trust-pyramid-progress.tsx` into this new, better-named file. It is already perfectly designed for this purpose. It visually communicates the primary goal of the platform.

2.  **`AchievementsGallery.tsx`**
    -   **Action:** Create this new component file.
    -   **Content:** Move the "Achievements" grid logic here.
    -   **Refinement:** The `CardHeader` must include the title "MINHAS CONQUISTAS" and a `Badge` for total XP (`🏆 1,250 XP`). Implement the rarity borders and shadows described in `ATHLETE_DASHBOARD_ENHANCEMENTS.md` to make it feel more rewarding.

3.  **`ActivityFeed.tsx`**
    -   **Action:** Create this new component file.
    -   **Content:** Move the "Activity Feed" logic here.
    -   **Refinement:** Ensure each item has a unique, color-coded icon (`Eye`, `Trophy`, `TrendingUp`) to make the feed scannable and visually interesting.