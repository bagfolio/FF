import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { generateActivity, achievements } from "@/lib/brazilianData";
import { Play, User } from "lucide-react";
import { motion } from "framer-motion";

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
      const skills = data.skills || {};
      const avgSkill = Object.values(skills).reduce((a: any, b: any) => a + b, 0) / Object.values(skills).length || 0;
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
  const { data: athlete, isLoading: athleteLoading } = useQuery({ queryKey: ["/api/athletes/me"] });
  const { data: tests = [], isLoading: testsLoading } = useQuery({ 
    queryKey: ["/api/tests/athlete", athlete?.id],
    enabled: !!athlete?.id
  });

  const isLoading = athleteLoading || testsLoading;

  // Get data from localStorage (from onboarding)
  const [onboardingData, setOnboardingData] = useState<{
    position: any;
    profile: any;
    skills: any[];
  }>({
    position: {},
    profile: {},
    skills: []
  });

  useEffect(() => {
    // Retrieve onboarding data from localStorage
    const position = JSON.parse(localStorage.getItem("authPosition") || "{}");
    const profile = JSON.parse(localStorage.getItem("authProfile") || "{}");
    const skills = JSON.parse(localStorage.getItem("authSkills") || "[]");
    
    setOnboardingData({ position, profile, skills });
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
      onboardingData.skills.length > 0
    ];
    
    fields.forEach(field => {
      if (field) completion += 100 / fields.length;
    });
    
    return Math.round(completion);
  };

  const profileCompletion = calculateProfileCompletion();
  const verificationLevel = calculateVerificationLevel(onboardingData.skills, profileCompletion);

  // Dynamic data
  const [activities] = useState(() => 
    Array.from({ length: 5 }, () => generateActivity())
  );
  const [scoutViews, setScoutViews] = useState(12);
  const [streakDays] = useState(7);
  const [showAchievementUnlock, setShowAchievementUnlock] = useState(false);

  // Simulate scout views
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setScoutViews(prev => prev + 1);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Simulate achievement unlock
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.5) {
        setShowAchievementUnlock(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Check if profile is complete
  if (!onboardingData.profile.fullName && !athlete) {
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

  // Combine onboarding data with athlete data
  const athleteData = {
    fullName: athlete?.fullName || onboardingData.profile.fullName || "Atleta",
    position: athlete?.position || onboardingData.position.name || "Atacante",
    currentTeam: athlete?.currentTeam || onboardingData.profile.currentTeam || "Sem clube",
    city: athlete?.city || onboardingData.profile.city || "São Paulo",
    state: athlete?.state || onboardingData.profile.state || "SP",
    verificationLevel: verificationLevel,
    percentile: Math.round(50 + (profileCompletion / 2)), // Dynamic based on completion
    profileViews: scoutViews * 3
  };

  return (
    <EnhancedAthleteLayout>
      <div className="min-h-screen">
        {/* Notifications */}
        <WelcomeNotification 
          athleteName={athleteData.fullName}
          streakDays={streakDays}
          scoutsWatching={scoutViews}
          percentileChange={2}
        />
        
        {showAchievementUnlock && (
          <AchievementUnlockNotification 
            achievementName="Velocista Iniciante"
            xpEarned={100}
            description="Você completou seu primeiro teste de velocidade!"
            onClose={() => setShowAchievementUnlock(false)}
          />
        )}
        
        <SocialProofNotification />
        
        <div className="space-y-8">
          {/* Animated background elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
              testsCompleted={tests.length || 0}
              streakDays={streakDays}
              scoutsWatching={scoutViews}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              
              <div className="lg:col-span-8 space-y-8">
                {/* Next Steps - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <NextStepWidget profileCompletion={profileCompletion} tests={tests} />
                </motion.div>

                {/* Combine Digital Hub - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <CombineDigitalHub tests={tests} />
                </motion.div>

                {/* Performance Evolution - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <PerformanceEvolution athlete={{
                    ...athleteData,
                    stats: {
                      speed: onboardingData.skills.find(s => s.id === "speed")?.data?.sliderValue || 5,
                      strength: onboardingData.skills.find(s => s.id === "strength")?.data?.sliderValue || 5,
                      technique: Object.values(onboardingData.skills.find(s => s.id === "technique")?.data?.skills || {}).reduce((a: any, b: any) => a + b, 0) / 4 || 3,
                      stamina: onboardingData.skills.find(s => s.id === "stamina")?.data?.duration === "90+" ? 9 : 6
                    }
                  }} />
                </motion.div>
              </div>
              
              <div className="lg:col-span-4 space-y-8">
                {/* Trust Pyramid - Glassmorphic style */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-morph rounded-2xl p-6"
                >
                  <TrustPyramidProgressWidget currentLevel={verificationLevel} />
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
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50"
          >
            <Button 
              size="lg"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white shadow-2xl shadow-verde-brasil/30 transform hover:scale-110 transition-all duration-300 group"
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