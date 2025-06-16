import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";

// Public pages
import Landing from "@/pages/landing";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

// Protected pages
import Home from "@/pages/home";
import AthleteOnboarding from "@/pages/athlete/onboarding";
import AthleteDashboard from "@/pages/athlete/dashboard";
import ScoutDashboard from "@/pages/scout/dashboard";
import ScoutSearch from "@/pages/scout/search";

// Development/test pages
import TestPage from "@/pages/test";
import TrustPyramidDemo from "@/pages/trust-pyramid-demo";

function AuthenticatedApp() {
  return (
    <AppLayout>
      <Switch>
        {/* Dashboard routes */}
        <Route path="/athlete/dashboard" component={AthleteDashboard} />
        <Route path="/scout/dashboard" component={ScoutDashboard} />
        
        {/* Athlete routes */}
        <Route path="/athlete/onboarding" component={AthleteOnboarding} />
        <Route path="/athlete/profile">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Perfil do Atleta</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        <Route path="/athlete/tests">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Testes Digitais</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        <Route path="/athlete/stats">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Estatísticas</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        <Route path="/athlete/achievements">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Conquistas</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        
        {/* Scout routes */}
        <Route path="/scout/search" component={ScoutSearch} />
        <Route path="/scout/favorites">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Atletas Favoritos</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        <Route path="/scout/reports">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        
        {/* Common routes */}
        <Route path="/messages">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mensagens</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        <Route path="/settings">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Configurações</h1>
            <p>Página em desenvolvimento...</p>
          </div>
        </Route>
        
        {/* Legacy home route */}
        <Route path="/home" component={Home} />
        
        {/* Default redirect for authenticated users */}
        <Route path="/" component={Home} />
        
        {/* 404 for authenticated users */}
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cinza-claro">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-verde-brasil"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={LoginPage} />
      
      {/* Development test pages */}
      <Route path="/test" component={TestPage} />
      <Route path="/trust-pyramid-demo" component={TrustPyramidDemo} />
      
      {/* 404 for public users */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;