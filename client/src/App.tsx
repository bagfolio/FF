import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AthleteOnboarding from "@/pages/athlete/onboarding";
import AthleteDashboard from "@/pages/athlete/dashboard";
import AthleteCombine from "@/pages/athlete/combine";
import AthleteAchievements from "@/pages/athlete/achievements";
import AthleteActivity from "@/pages/athlete/activity";
import DailyCheckIn from "@/pages/athlete/daily-checkin";
import ScoutDashboard from "@/pages/scout/dashboard";
import ScoutSearch from "@/pages/scout/search";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/components/ui/loading-screen";
import TestPage from "@/pages/test";
import TrustPyramidDemo from "@/pages/trust-pyramid-demo";
// New Brazilian Football Auth Flow
import AuthWelcome from "@/pages/auth/welcome";
import AuthPosition from "@/pages/auth/position";
import AuthProfile from "@/pages/auth/profile";
import AuthSkills from "@/pages/auth/skills";
import AuthComplete from "@/pages/auth/complete";

function Router() {
  // Remove loading screen check since we have cached data
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      
      {/* Brazilian Football Authentication Flow */}
      <Route path="/auth/welcome" component={AuthWelcome} />
      <Route path="/auth/position" component={AuthPosition} />
      <Route path="/auth/profile" component={AuthProfile} />
      <Route path="/auth/skills" component={AuthSkills} />
      <Route path="/auth/complete" component={AuthComplete} />
      
      {/* Protected routes - in dev mode, always accessible */}
      <Route path="/home" component={Home} />
      <Route path="/athlete/onboarding" component={AthleteOnboarding} />
      <Route path="/athlete/dashboard" component={AthleteDashboard} />
      <Route path="/athlete/combine" component={AthleteCombine} />
      <Route path="/athlete/achievements" component={AthleteAchievements} />
      <Route path="/athlete/activity" component={AthleteActivity} />
      <Route path="/athlete/daily-checkin" component={DailyCheckIn} />
      <Route path="/scout/dashboard" component={ScoutDashboard} />
      <Route path="/scout/search" component={ScoutSearch} />
      
      {/* Development test page */}
      <Route path="/test" component={TestPage} />
      <Route path="/trust-pyramid-demo" component={TrustPyramidDemo} />
      
      {/* 404 */}
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
