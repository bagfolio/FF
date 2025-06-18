import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import ProfileCompletionRing from "@/components/ui/profile-completion-ring";
import VerificationBadge from "@/components/ui/verification-badge";
import StatCounter from "@/components/features/StatCounter";
import { User, Camera, Play, Share2, MapPin, Eye, Flame, Users, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  athlete: {
    fullName: string;
    position: string;
    team?: string;
    currentTeam?: string;
    city: string;
    state: string;
    verificationLevel: "bronze" | "silver" | "gold" | "platinum";
    percentile: number;
    profileViews: number;
  };
  profileCompletion?: number;
  testsCompleted?: number;
  streakDays?: number;
  scoutsWatching?: number;
}

export function HeroSection({ athlete, profileCompletion = 65, testsCompleted = 3, streakDays = 7, scoutsWatching = 3 }: HeroSectionProps) {
  const [localProfileCompletion, setLocalProfileCompletion] = useState(profileCompletion);
  const [showScoutNotification, setShowScoutNotification] = useState(false);
  const [animateStreak, setAnimateStreak] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalProfileCompletion(Math.min(localProfileCompletion + 5, 100));
    }, 2000);
    return () => clearTimeout(timer);
  }, [localProfileCompletion]);

  // Show scout notification after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScoutNotification(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Animate streak counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStreak(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-animate opacity-20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
        }} />
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-8 h-8 bg-white/10 rounded-full" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="w-6 h-6 bg-amarelo-ouro/20 rounded-full" />
        </div>
        <div className="absolute bottom-20 left-1/3 animate-float">
          <div className="w-10 h-10 bg-white/10 rounded-full" />
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side - Profile Info */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center relative">
              <ProfileCompletionRing percentage={localProfileCompletion} size={180} strokeWidth={8}>
                <Avatar className="w-36 h-36 bg-white shadow-2xl">
                  <User className="w-20 h-20 text-verde-brasil" />
                </Avatar>
                <button className="absolute bottom-0 right-0 w-11 h-11 bg-amarelo-ouro rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-gray-800" />
                </button>
              </ProfileCompletionRing>
              <div className="text-center mt-3">
                <span className="text-3xl font-oswald font-bold text-white">{localProfileCompletion}%</span>
                <p className="text-sm text-white/80">perfil completo</p>
              </div>
              
              {/* Streak Badge */}
              {streakDays > 0 && (
                <div className={`absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-3 py-1 shadow-lg transform ${animateStreak ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-500`}>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-white font-bold text-sm">{streakDays} dias</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="font-bebas text-5xl mb-2">{athlete.fullName}</h1>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xl opacity-90">{athlete.position}</span>
                <span className="text-xl opacity-90">•</span>
                <span className="text-xl opacity-90">{athlete.currentTeam || athlete.team}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <VerificationBadge level={athlete.verificationLevel} size="lg" />
                  <div className="absolute -inset-1 bg-white/20 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <MapPin className="w-4 h-4" />
                  {athlete.city}, {athlete.state}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 text-gray-900 font-semibold shadow-xl transform hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 mr-2" />
            Realizar Novo Teste
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar Perfil
          </Button>
        </div>
      </div>

      {/* Wave Shape at Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-12 fill-cinza-claro">
          <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,64 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
}