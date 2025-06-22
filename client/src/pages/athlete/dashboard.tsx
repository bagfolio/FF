import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { Play, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAthleteSkills } from "@/hooks/useAthleteSkills";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useRequireUserType } from "@/hooks/useUserWithProfile";

// Import new modular components
import { HeroSection } from "@/components/features/athlete/HeroSection";
import { NextStepWidget } from "@/components/features/athlete/NextStepWidget";
import { CombineDigitalHub } from "@/components/features/athlete/CombineDigitalHub";
import { PerformanceEvolution } from "@/components/features/athlete/PerformanceEvolution";
import { TrustPyramidProgressWidget } from "@/components/features/athlete/TrustPyramidProgressWidget";
import { AchievementsGallery } from "@/components/features/athlete/AchievementsGallery";
import { ActivityFeed } from "@/components/features/athlete/ActivityFeed";
import { WelcomeNotification } from "@/components/features/athlete/WelcomeNotification";
import { AchievementUnlockNotification } from "@/components/features/athlete/AchievementUnlockNotification";
import { SocialProofNotification } from "@/components/features/athlete/SocialProofNotification";
import { SkillsTrustDisplay } from "@/components/features/athlete/SkillsTrustDisplay";
import { TrustScoreWidget } from "@/components/features/athlete/TrustScoreWidget";
import { SubscriptionBanner } from "@/components/features/subscription/SubscriptionBanner";

// Function to calculate verification level based on profile and skills
function calculateVerificationLevel(skills: any[], profileCompletion: number): "bronze" | "silver" | "gold" | "platinum" {
  if (!skills || skills.length === 0) return "bronze";
  
  // Calculate average skill score
  const totalScore = skills.reduce((sum, skill) => {
    const data = skill.data || {};
    let skillScore = 0;
    
    // Speed assessment
    if (skill.id === "speed") {
      const rating = data.selfRating === "fastest" ? 90 : data.selfRating === "above_average" ? 70 : data.selfRating === "average" ? 50 : 30;
      const slider = (data.sliderValue || 5) * 10;
      skillScore = (rating + slider) / 2;
    }
    
    // Strength assessment
    if (skill.id === "strength") {
      const comparison = data.comparison === "win_most" ? 90 : data.comparison === "fifty_fifty" ? 60 : 30;
      const slider = (data.sliderValue || 5) * 10;
      skillScore = (comparison + slider) / 2;
    }
    
    // Technique assessment
    if (skill.id === "technique") {
      const skills: Record<string, number> = data.skills || {};
      const skillValues = Object.values(skills);
      const avgSkill = skillValues.length > 0 ? skillValues.reduce((a, b) => a + b, 0) / skillValues.length : 0;
      skillScore = avgSkill * 20; // Convert 1-5 to 0-100
    }
    
    // Stamina assessment
    if (skill.id === "stamina") {
      const duration = data.duration === "90+" ? 100 : data.duration === "90" ? 80 : data.duration === "60" ? 60 : 40;
      const recovery = data.recovery === "fast" ? 90 : data.recovery === "normal" ? 60 : 30;
      skillScore = (duration + recovery) / 2;
    }
    
    return sum + skillScore;
  }, 0);
  
  const avgScore = totalScore / skills.length;
  const combinedScore = (avgScore + profileCompletion) / 2;
  
  if (combinedScore >= 85) return "platinum";
  if (combinedScore >= 70) return "gold";
  if (combinedScore >= 50) return "silver";
  return "bronze";
}

export default function AthleteDashboard() {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: dashboardData, isLoading } = useQuery<{
    athlete: any;
    stats: {
      profileViews: number;
      scoutViews: number;
      testsCompleted: number;
      streakDays: number;
      percentile: number;
      profileCompletion: number;
    };
    recentViews: any[];
    achievements: any[];
    activities: any[];
  }>({ 
    queryKey: ["/api/dashboard/athlete"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Use centralized skills hook - only pass ID if athlete exists in database
  const athleteId = dashboardData?.athlete?.id;
  const { skills, hasLocalData, isSyncing, syncLocalToDatabase } = useAthleteSkills(athleteId);

  // Get data from localStorage (from onboarding)
  const [onboardingData, setOnboardingData] = useState<{
    position: any;
    profile: any;
  }>({
    position: {},
    profile: {}
  });

  useEffect(() => {
    // Retrieve onboarding data from localStorage
    const position = JSON.parse(localStorage.getItem("authPosition") || "{}");
    const profile = JSON.parse(localStorage.getItem("authProfile") || "{}");
    
    setOnboardingData({ position, profile });
  }, []);

  // Calculate profile completion based on actual data
  const calculateProfileCompletion = () => {
    let completion = 0;
    const fields = [
      onboardingData.profile.fullName,
      onboardingData.profile.birthDate,
      onboardingData.profile.city,
      onboardingData.profile.state,
      onboardingData.profile.phone,
      onboardingData.position.name,
      skills && skills.length > 0
    ];
    
    fields.forEach(field => {
      if (field) completion += 100 / fields.length;
    });
    
    return Math.round(completion);
  };

  // Use data from API - remove localStorage fallback for Trust Pyramid integration
  const profileCompletion = dashboardData?.stats?.profileCompletion || 0;
  const verificationLevel = dashboardData?.athlete?.verificationLevel || 'bronze';
  
  // Get data from API response
  const activities = dashboardData?.activities || [];
  const scoutViews = dashboardData?.stats?.scoutViews || 0;
  const streakDays = dashboardData?.stats?.streakDays || 0;
  const achievements = dashboardData?.achievements || [];
  const tests = dashboardData?.athlete ? [] : []; // Tests are counted in stats now
  
  // Check for new achievements
  const [previousAchievementCount, setPreviousAchievementCount] = useState(0);
  const [showAchievementUnlock, setShowAchievementUnlock] = useState(false);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  
  useEffect(() => {
    if (achievements.length > previousAchievementCount && previousAchievementCount > 0) {
      // New achievement unlocked
      const latestAchievement = achievements[0]; // Assuming sorted by date
      setNewAchievement(latestAchievement);
      setShowAchievementUnlock(true);
    }
    setPreviousAchievementCount(achievements.length);
  }, [achievements.length]);

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <EnhancedAthleteLayout>
        <div className="min-h-screen p-6">
          <div className="animate-pulse">
            <div className="h-64 bg-white/5 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="h-48 bg-white/5 rounded-lg"></div>
                <div className="h-64 bg-white/5 rounded-lg"></div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="h-96 bg-white/5 rounded-lg"></div>
                <div className="h-48 bg-white/5 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </EnhancedAthleteLayout>
    );
  }

  // Check if profile is complete
  if (!onboardingData.profile.fullName && !dashboardData?.athlete) {
    return (
      <EnhancedAthleteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full mx-4"
          >
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardContent className="pt-6 text-center">
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-24 h-24 bg-gradient-to-br from-verde-brasil to-amarelo-ouro rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <User className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="font-bebas text-3xl text-white mb-4">Complete Seu Perfil</h2>
                <p className="text-white/60 mb-8">
                  Para acessar o dashboard, você precisa completar seu perfil de atleta.
                </p>
                <Button 
                  className="bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white px-8 py-3 text-lg shadow-lg shadow-verde-brasil/20 transform hover:scale-105 transition-all duration-200" 
                  onClick={() => setLocation("/auth/welcome")}
                >
                  Completar Perfil
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </EnhancedAthleteLayout>
    );
  }

  // Combine API data with onboarding data as fallback
  const athleteData = {
    fullName: dashboardData?.athlete?.fullName || onboardingData.profile.fullName || "Atleta",
    position: dashboardData?.athlete?.position || onboardingData.position.name || "Atacante",
    currentTeam: dashboardData?.athlete?.currentTeam || onboardingData.profile.currentTeam || "Sem clube",
    city: dashboardData?.athlete?.city || onboardingData.profile.city || "São Paulo",
    state: dashboardData?.athlete?.state || onboardingData.profile.state || "SP",
    verificationLevel: verificationLevel,
    percentile: dashboardData?.stats?.percentile || Math.round(50 + (profileCompletion / 2)),
    profileViews: dashboardData?.stats?.profileViews || scoutViews * 3
  };

  return (
    <ErrorBoundary>
      <EnhancedAthleteLayout>
        <div className="min-h-screen">
        {/* Notifications */}
        <WelcomeNotification 
          athleteName={athleteData.fullName}
          streakDays={streakDays}
          scoutsWatching={scoutViews}
          percentileChange={2}
        />
        
        {showAchievementUnlock && newAchievement && (
          <AchievementUnlockNotification 
            achievementName={newAchievement.title}
            xpEarned={newAchievement.points || 100}
            description={newAchievement.description || "Nova conquista desbloqueada!"}
            onClose={() => setShowAchievementUnlock(false)}
          />
        )}
        
        <SocialProofNotification />
        
        {/* Skills sync notification */}
        {hasLocalData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 right-4 z-50 bg-black/90 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            {isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-verde-brasil border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Sincronizando suas habilidades...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-amarelo-ouro rounded-full animate-pulse" />
                <span className="text-sm">Habilidades pendentes de sincronização</span>
              </>
            )}
          </motion.div>
        )}
        
        <div className="space-y-8">
          {/* Animated background elements - disabled on mobile for performance */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block">
            <motion.div 
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-10 w-64 h-64 bg-verde-brasil rounded-full blur-3xl"
            />
            <motion.div 
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
              className="absolute bottom-1/4 right-10 w-96 h-96 bg-amarelo-ouro rounded-full blur-3xl"
            />
          </div>
          
          {/* Hero Section with glassmorphic overlay */}
          <div className="relative">
            <HeroSection 
              athlete={athleteData}
              profileCompletion={profileCompletion}
              testsCompleted={dashboardData?.stats?.testsCompleted || 0}
              streakDays={streakDays}
              scoutsWatching={scoutViews}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Subscription Banner */}
            <SubscriptionBanner />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              
              <div className="lg:col-span-8 space-y-8">
                {/* Next Steps - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <NextStepWidget profileCompletion={profileCompletion} tests={dashboardData?.athlete ? [] : []} />
                </motion.div>

                {/* Combine Digital Hub - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <CombineDigitalHub tests={dashboardData?.athlete ? [] : []} />
                </motion.div>

                {/* Performance Evolution - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <PerformanceEvolution athlete={{
                    speed: skills?.find(s => s.id === "speed")?.data?.sliderValue || 5,
                    agility: skills?.find(s => s.id === "strength")?.data?.sliderValue || 5,
                    technique: skills?.find(s => s.id === "technique")?.data?.sliderValue || 5,
                    endurance: skills?.find(s => s.id === "stamina")?.data?.duration === "90+" ? 9 : 6
                  }} />
                </motion.div>

                {/* Skills Trust Display - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <SkillsTrustDisplay 
                    skills={skills}
                    currentTrustLevel={verificationLevel}
                    onVerifySkill={(skillId) => {
                      // Navigate to appropriate verification page
                      setLocation("/athlete/combine");
                    }}
                  />
                </motion.div>
              </div>
              
              <div className="lg:col-span-4 space-y-8">
                {/* Trust Score Widget - NEW PROMINENT DISPLAY */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <TrustScoreWidget 
                    currentLevel={verificationLevel}
                    skills={skills || []}
                    profileCompletion={profileCompletion}
                  />
                </motion.div>
                
                {/* Trust Pyramid - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <TrustPyramidProgressWidget 
                    athlete={dashboardData?.athlete}
                    skills={skills || []}
                    tests={tests}
                    currentLevel={verificationLevel}
                  />
                </motion.div>

                {/* Achievements Gallery - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <AchievementsGallery achievements={achievements} />
                </motion.div>

                {/* Activity Feed - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <ActivityFeed activities={activities} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Floating Action Button */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-floating"
          >
            <Button 
              size="lg"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white shadow-2xl shadow-verde-brasil/30 transform hover:scale-110 transition-all duration-300 group touch-target"
              onClick={() => setLocation("/athlete/combine")}
            >
              <div className="flex flex-col items-center">
                <Play className="w-6 h-6 md:w-7 md:h-7" />
                <span className="text-xs font-bold absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/90 backdrop-blur-md text-white px-2 py-1 rounded hidden md:block">
                  Novo Teste
                </span>
              </div>
            </Button>
            <motion.div 
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-1 bg-verde-brasil rounded-full"
            />
          </motion.div>
        </div>
      </div>
      </EnhancedAthleteLayout>
    </ErrorBoundary>
  );
}

// Add custom glassmorphic styles
if (typeof document !== 'undefined' && !document.querySelector('#dashboard-glassmorphic')) {
  const style = document.createElement('style');
  style.id = 'dashboard-glassmorphic';
  style.textContent = `
    .glass-morph {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .glass-morph:hover {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-float-delayed {
      animation: float 6s ease-in-out 3s infinite;
    }
  `;
  document.head.appendChild(style);
}