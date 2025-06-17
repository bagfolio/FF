import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/Navigation";
import { generateRealisticAthlete, generateActivity, achievements } from "@/lib/brazilianData";
import { Play } from "lucide-react";

// Import new modular components
import { HeroSection } from "@/components/features/athlete/HeroSection";
import { NextStepWidget } from "@/components/features/athlete/NextStepWidget";
import { CombineDigitalHub } from "@/components/features/athlete/CombineDigitalHub";
import { PerformanceEvolution } from "@/components/features/athlete/PerformanceEvolution";
import { TrustPyramidProgressWidget } from "@/components/features/athlete/TrustPyramidProgressWidget";
import { AchievementsGallery } from "@/components/features/athlete/AchievementsGallery";
import { ActivityFeed } from "@/components/features/athlete/ActivityFeed";

export default function AthleteDashboard() {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: athlete, isLoading: athleteLoading } = useQuery({ queryKey: ["/api/athletes/me"] });
  const { data: tests = [], isLoading: testsLoading } = useQuery({ 
    queryKey: ["/api/tests/athlete", athlete?.id],
    enabled: !!athlete?.id
  });

  const isLoading = athleteLoading || testsLoading;

  // Generate realistic data
  const [realisticStats] = useState(() => generateRealisticAthlete());
  const [activities] = useState(() => 
    Array.from({ length: 5 }, () => generateActivity())
  );
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [scoutViews, setScoutViews] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfileCompletion(Math.min(profileCompletion + 5, 100));
    }, 2000);
    return () => clearTimeout(timer);
  }, [profileCompletion]);

  // Simulate scout views
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setScoutViews(prev => prev + 1);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const verificationLevel = (athlete?.verificationLevel || realisticStats.verificationLevel) as "bronze" | "silver" | "gold" | "platinum";

  // Temporarily bypass athlete profile check for testing
  // if (!athlete) {
  //   return (
  //     <div className="min-h-screen bg-cinza-claro">
  //       <Navigation />
  //       <div className="container mx-auto px-4 pt-20">
  //         <Card className="max-w-md mx-auto shadow-xl hover:shadow-2xl transition-all duration-300">
  //           <CardContent className="pt-6 text-center">
  //             <div className="w-24 h-24 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
  //               <User className="w-12 h-12 text-white" />
  //             </div>
  //             <h2 className="font-bebas text-3xl azul-celeste mb-4">Complete Seu Perfil</h2>
  //             <p className="text-gray-600 mb-8">
  //               Para acessar o dashboard, você precisa completar seu perfil de atleta.
  //             </p>
  //             <Button 
  //               className="btn-primary px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200" 
  //               onClick={() => setLocation("/athlete/onboarding")}
  //             >
  //               Completar Perfil
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      
      <div className="space-y-8">
        <HeroSection 
          athlete={{
            fullName: athlete?.fullName || realisticStats.fullName,
            position: athlete?.position || realisticStats.position,
            team: realisticStats.team,
            currentTeam: athlete?.currentTeam,
            city: athlete?.city || realisticStats.city,
            state: athlete?.state || realisticStats.state,
            verificationLevel: verificationLevel,
            percentile: realisticStats.percentile,
            profileViews: realisticStats.profileViews
          }}
          profileCompletion={profileCompletion}
          testsCompleted={tests.length || 3}
        />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-8">
              <NextStepWidget profileCompletion={profileCompletion} tests={tests} />
              <CombineDigitalHub tests={tests} />
              <PerformanceEvolution athlete={realisticStats} />
            </div>
            
            <div className="lg:col-span-4 space-y-8">
              <TrustPyramidProgressWidget currentLevel={verificationLevel} />
              <AchievementsGallery achievements={achievements} />
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
          <Button 
            size="lg"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-verde-brasil to-green-600 hover:from-green-600 hover:to-verde-brasil text-white shadow-2xl transform hover:scale-110 transition-all duration-300 group"
            onClick={() => setLocation("/athlete/test")}
          >
            <div className="flex flex-col items-center">
              <Play className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-xs font-bold absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded hidden md:block">
                Novo Teste
              </span>
            </div>
          </Button>
          <div className="absolute -inset-1 bg-verde-brasil rounded-full opacity-30 animate-ping" />
        </div>
      </div>
    </div>
  );
}

// Add animations CSS
if (typeof document !== 'undefined' && !document.querySelector('#dashboard-animations')) {
  const style = document.createElement('style');
  style.id = 'dashboard-animations';
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes count-up {
      0% {
        opacity: 0;
        transform: scale(0.5) translateY(20px);
      }
      50% {
        transform: scale(1.1) translateY(-5px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    
    @keyframes gradient-animate {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .bg-gradient-animate {
      background: linear-gradient(-45deg, #009C3B, #FFDF00, #002776, #009C3B);
      background-size: 400% 400%;
      animation: gradient-animate 15s ease infinite;
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-float-delayed {
      animation: float 6s ease-in-out 3s infinite;
    }
    
    .animate-count-up {
      animation: count-up 0.5s ease-out;
    }
    
    .animate-pulse-slow {
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-bounce-slow {
      animation: bounce 2s infinite;
    }
    
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
    
    .fade-in {
      animation: fadeInUp 0.6s ease-out;
    }
  `;
  document.head.appendChild(style);
}