# COMPONENT SPEC: `NextStepWidget.tsx`

**File Location:** `client/src/components/features/athlete/NextStepWidget.tsx`

**Purpose:** This is the **most important** new component. It must eliminate user confusion by providing a single, unmissable, and context-aware Call to Action. It guides the user on the Golden Path.

**Implementation Details:**
-   Create a new component that accepts `profileCompletion` and `tests` as props.
-   The component will render a `Card` with a highly prominent design to draw the user's eye.

**Dynamic Content Logic:**

The component's content MUST change based on the user's progress. Implement this logic:

1.  **If `profileCompletion < 100`:**
    -   **Headline:** "PRIMEIRO PASSO: COMPLETE SEU PERFIL"
    -   **Icon:** `User`
    -   **Description:** "Seu perfil está incompleto. Preencha todas as suas informações para desbloquear o Combine Digital e ser visto por scouts."
    -   **Button:** Text: "Completar Perfil Agora", Action: `setLocation('/athlete/onboarding')`.
    -   **Visual:** Use a warning/attention color scheme (e.g., `amarelo-ouro` or `laranja-destaque`).

2.  **Else if `tests.length === 0`:**
    -   **Headline:** "HORA DE BRILHAR: REALIZE SEU PRIMEIRO TESTE!"
    -   **Icon:** `Zap`
    -   **Description:** "Você está pronto! Realize o Teste de Velocidade 20m para verificar suas métricas, ativar seu ranking nacional e aparecer nas buscas dos olheiros."
    -   **Button:** Text: "Realizar Teste de Velocidade", Action: `() => {}` (placeholder for now).
    -   **Visual:** Use an energetic, primary action color scheme (`verde-brasil` or `btn-action` from your CSS).

3.  **Else (Profile complete, tests exist):**
    -   **Headline:** "DESAFIO DO DIA 🔥"
    -   **Icon:** `Flame`
    -   **Description:** Take the content from the existing "Daily Challenge" card. Example: "Complete 100 toques sem deixar cair para ganhar 200 XP e uma badge exclusiva!"
    -   **Button:** Text: "Aceitar Desafio", Action: `() => {}`.
    -   **Visual:** Use the existing vibrant orange/red gradient for the challenge.

This logic ensures the user is always presented with their most impactful next action.