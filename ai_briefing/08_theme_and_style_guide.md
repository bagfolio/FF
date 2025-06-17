# STYLE GUIDE: The Futebol Futuro Vibe

**Purpose:** To ensure a consistent, vibrant, and emotionally resonant design language across the platform.

**Core Principles:**
-   **Energy & Passion:** The UI must feel alive. Use gradients, subtle animations, and strong colors.
-   **Clarity & Trust:** While energetic, the design must also feel professional and trustworthy. Use clean fonts (`Inter` for body, `Bebas Neue` for headers), ample whitespace, and clear visual hierarchy.
-   **Brazilian Soul:** This is non-negotiable. The color palette of green, yellow, and blue is our foundation. Use it boldly in gradients, accents, and key components.

**Color Usage:**
-   **Primary Action (Green):** Use `--verde-brasil` for primary "Go" buttons like "Realizar Teste."
-   **Secondary/Attention (Yellow/Orange):** Use `--amarelo-ouro` and `--laranja-destaque` for secondary actions, warnings, or to highlight new features.
-   **Trust/Professionalism (Blue):** Use `--azul-celeste` for headers, scout-facing elements, and areas that need to convey authority and stability.
-   **Gradients:** Use them liberally but tastefully for backgrounds, buttons, and chart fills to create visual depth and energy. Refer to the existing `index.css` for classes like `bg-brasil-gradient`.

**Micro-interactions:**
-   **Hover States:** Cards should lift (`transform: translateY(-8px)`) and gain a subtle shadow (`box-shadow`). Buttons should have a slight scale effect (`transform: scale(1.05)`).
-   **Loading:** Use your existing `Skeleton` components. For stats, use the `StatCounter` to animate numbers counting up.
-   **Celebrations:** When an achievement is unlocked or a test is passed, trigger a celebratory animation (e.g., confetti, a scaling trophy icon). This is a future enhancement, but keep it in mind.

**Typography:**
-   **Headlines (`font-bebas`):** Bold, uppercase, and impactful. Use for page titles and major section headers.
-   **Body (`font-inter`):** Clean, legible, and professional. Use for all descriptive text.
-   **Stats (`font-oswald`):** Strong and clear. Use for numerical data to give it visual weight.

Your task is to ensure every new and refactored component adheres strictly to this guide, creating a cohesive and inspiring user experience.