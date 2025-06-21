import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AthleteDashboard from "@/pages/athlete/dashboard";
import AthleteCombine from "@/pages/athlete/combine";
import AthleteAchievements from "@/pages/athlete/achievements";
import AthleteActivity from "@/pages/athlete/activity";
import DailyCheckIn from "@/pages/athlete/daily-checkin";
import AthleteSubscription from "@/pages/athlete/subscription";
import ScoutDashboard from "@/pages/scout/dashboard";
import ScoutSearch from "@/pages/scout/search";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/components/ui/loading-screen";
import TestPage from "@/pages/test";
import TrustPyramidDemo from "@/pages/trust-pyramid-demo";
import StyleGuide from "@/pages/style-guide";
// New Brazilian Football Auth Flow
import AuthWelcome from "@/pages/auth/welcome";
import AuthPosition from "@/pages/auth/position";
import AuthProfile from "@/pages/auth/profile";
import AuthSkills from "@/pages/auth/skills";
import AuthComplete from "@/pages/auth/complete";
import VerifyEmail from "@/pages/auth/verify-email";
import ResetPassword from "@/pages/auth/reset-password";
import ForgotPassword from "@/pages/auth/forgot-password";
// Development tools
import { DevQuickLogin } from "@/components/dev/DevQuickLogin";

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
      <Route path="/auth/verify-email" component={VerifyEmail} />
      <Route path="/auth/reset-password" component={ResetPassword} />
      <Route path="/auth/forgot-password" component={ForgotPassword} />
      
      {/* Protected routes */}
      <Route path="/home">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      
      {/* Athlete routes - require athlete user type */}
      <Route path="/athlete/dashboard">
        <ProtectedRoute requireUserType="athlete">
          <AthleteDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/athlete/combine">
        <ProtectedRoute requireUserType="athlete">
          <AthleteCombine />
        </ProtectedRoute>
      </Route>
      <Route path="/athlete/achievements">
        <ProtectedRoute requireUserType="athlete">
          <AthleteAchievements />
        </ProtectedRoute>
      </Route>
      <Route path="/athlete/activity">
        <ProtectedRoute requireUserType="athlete">
          <AthleteActivity />
        </ProtectedRoute>
      </Route>
      <Route path="/athlete/daily-checkin">
        <ProtectedRoute requireUserType="athlete">
          <DailyCheckIn />
        </ProtectedRoute>
      </Route>
      <Route path="/athlete/subscription">
        <ProtectedRoute requireUserType="athlete">
          <AthleteSubscription />
        </ProtectedRoute>
      </Route>
      
      {/* Scout routes - require scout user type */}
      <Route path="/scout/dashboard">
        <ProtectedRoute requireUserType="scout">
          <ScoutDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/scout/search">
        <ProtectedRoute requireUserType="scout">
          <ScoutSearch />
        </ProtectedRoute>
      </Route>
      
      {/* Development test page */}
      <Route path="/test" component={TestPage} />
      <Route path="/trust-pyramid-demo" component={TrustPyramidDemo} />
      <Route path="/style-guide" component={StyleGuide} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            {/* Development Quick Login Panel */}
            <DevQuickLogin />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
