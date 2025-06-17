# COMPONENT SPEC: `CombineDigitalHub.tsx`

**File Location:** `client/src/components/features/athlete/CombineDigitalHub.tsx`

**Purpose:** To serve as an exciting, game-like menu of all available physical tests, encouraging repeated engagement.

**Implementation Details:**
-   Encapsulate the existing "Combine Digital" section into this new component.
-   It should be wrapped in a `Card` with the header "COMBINE DIGITAL".
-   The layout should be a `grid grid-cols-1 md:grid-cols-2 gap-6`.

**Refinements for each Test Card:**

-   **Visual Style:** Keep the existing video-preview style with the play button overlay. It's visually engaging.
-   **Status Indicator:**
    -   If a test has a verified result, display a green `VerificationBadge` with "VERIFICADO".
    -   If a test is new, add a pulsating red `Badge` with "NOVO!".
-   **Progress Indication:** For tests that are part of a series, use a small progress ring or bar to show completion (e.g., "Técnica 2/5").
-   **Best Score:** Prominently display the athlete's best score on that test (e.g., "Seu melhor: 2.76s").
-   **AI Recommendation:** Below the grid of tests, include the existing "Recomendação da IA" section, highlighting the test the AI suggests next.