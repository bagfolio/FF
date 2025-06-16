// ARQUIVO ATUALIZADO: client/src/App.tsx

import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

import { queryClient } from "./lib/queryClient";
import ProtectedRoute from "./lib/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// Páginas
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AthleteOnboarding from "@/pages/athlete/onboarding";
import AthleteDashboard from "@/pages/athlete/dashboard";
import ScoutDashboard from "@/pages/scout/dashboard";
import ScoutSearch from "@/pages/scout/search";
import NotFound from "@/pages/not-found";
import TestPage from "@/pages/test";
import TrustPyramidDemo from "@/pages/trust-pyramid-demo";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Rotas Públicas */}
          <Route path="/" component={Landing} />
          <Route path="/test" component={TestPage} />
          <Route path="/trust-pyramid-demo" component={TrustPyramidDemo} />

          {/* Rotas Protegidas dentro do AppLayout */}
          <Route path="/:rest*">
            <AppLayout>
              <Switch>
                <ProtectedRoute path="/home" component={Home} />
                <ProtectedRoute path="/athlete/onboarding" component={AthleteOnboarding} />
                <ProtectedRoute path="/athlete/dashboard" component={AthleteDashboard} />
                <ProtectedRoute path="/scout/dashboard" component={ScoutDashboard} />
                <ProtectedRoute path="/scout/search" component={ScoutSearch} />

                {/* 404 para rotas internas */}
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </AppLayout>
          </Route>

        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;