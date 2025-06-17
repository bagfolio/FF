
#### **File: `/ai_briefing/03_COMPONENT_SPEC_HERO.md`**

```markdown
# COMPONENT SPEC: `HeroSection.tsx`

**File Location:** `client/src/components/features/athlete/HeroSection.tsx`

**Purpose:** To provide a stunning, high-impact, and personalized welcome that immediately communicates the athlete's top-level status.

**Implementation Details:**
- This component will encapsulate the existing full-width, animated gradient hero section from the current `dashboard.tsx`.
- It should accept an `athlete` prop to display dynamic data.

**Key Visual Elements (Refer to existing `dashboard.tsx` for these):**
1.  **Background:** The `bg-gradient-to-br from-gray-900 via-green-900 to-gray-900` with the animated pattern and floating elements should be the container's background.
2.  **Profile Info (Left Side):**
    -   Use the `ProfileCompletionRing` component. Pass it the athlete's completion percentage.
    -   Inside the ring, render the athlete's avatar (or the `User` icon placeholder). Use an `<Avatar>` component.
    -   To the right of the ring, display the athlete's `fullName` in a large `h1` tag with `font-bebas`.
    -   Below the name, display their `position` and `team`.
    -   Finally, display the `VerificationBadge` and location (`MapPin` icon) as is currently done.
3.  **Key Stats (Right Side):**
    -   Create a `grid grid-cols-3` to display the three most important "vanity metrics":
        -   **Percentil Nacional:** Use the `StatCounter` component.
        -   **Visualizações:** Use the `StatCounter` component with an `Eye` icon.
        -   **Testes Verificados:** Display the count of completed tests.
4.  **Action Buttons:** Include the "Realizar Novo Teste" and "Compartilhar Perfil" buttons. They should be large and prominent.