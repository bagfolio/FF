# COMPONENT SPEC: `PerformanceEvolution.tsx`

**File Location:** `client/src/components/features/athlete/PerformanceEvolution.tsx`

**Purpose:** To consolidate all complex data visualizations into a single, organized component, preventing clutter on the main dashboard.

**Implementation Details:**
-   This component should be a single large `Card`.
-   The `CardHeader` should be styled distinctively (e.g., `bg-gradient-to-r from-blue-800 to-blue-900 text-white`) with the title "ANÁLISE DE DESEMPENHO".
-   The `CardContent` will contain a `Tabs` component.

**Tabs Configuration:**

1.  **Tab 1 - "Visão Geral" (`value="overview"`)**
    -   **Content:** Your existing `PerformanceRadar` component. Ensure it's centered and has adequate padding.

2.  **Tab 2 - "Métricas Detalhadas" (`value="metrics"`)**
    -   **Content:** A list of your `ProgressEnhanced` components, one for each key metric (Velocidade, Agilidade, etc.). This section already exists in your code; simply move it here.

3.  **Tab 3 - "Evolução no Tempo" (`value="history"`)**
    -   **Content:** Implement a line chart using `recharts`.
    -   **Data:** Use mock data for now: `[{ month: 'Abr', time: 2.85 }, { month: 'Mai', time: 2.81 }, { month: 'Jun', time: 2.76 }]`.
    -   **Styling:** Use the Brazilian theme colors. The line should be `verde-brasil`, with `amarelo-ouro` dots for data points.

This tabbed interface allows the user to explore their data in depth without being overwhelmed on the initial view.