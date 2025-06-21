import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Users, Target } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/auth";

export default function AuthComplete() {
  const [, setLocation] = useLocation();
  const [showDashboard, setShowDashboard] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user } = useQuery<User>({ queryKey: ["/api/auth/user"] });

  useEffect(() => {
    // Ensure profile is created before proceeding
    const createProfileIfNeeded = async () => {
      if (!user?.roleData?.id) {
        const authProfile = JSON.parse(localStorage.getItem("authProfile") || "{}");
        const authPosition = JSON.parse(localStorage.getItem("authPosition") || "{}");
        const userType = user?.userType || sessionStorage.getItem('selectedUserType');
        
        if (authProfile.fullName) {
          try {
            if (userType === 'athlete') {
              // Create athlete profile
              const response = await fetch('/api/athletes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fullName: authProfile.fullName,
                  birthDate: authProfile.birthDate,
                  cpf: authProfile.cpf || "",
                  city: authProfile.city,
                  state: authProfile.state,
                  phone: authProfile.phone || "",
                  position: authPosition.name || "Atacante",
                  dominantFoot: "right",
                  height: authProfile.height,
                  weight: authProfile.weight,
                  currentTeam: authProfile.club || ""
                })
              });
              
              if (response.ok) {
                // Invalidate user query to get updated data
                queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
                
                // Try to sync skills if they exist in localStorage
                const authSkills = localStorage.getItem('authSkills');
                if (authSkills && authSkills !== '[]') {
                  try {
                    const athlete = await response.json();
                    await fetch(`/api/athletes/${athlete.id}/skills`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: authSkills
                    });
                  } catch (error) {
                    console.error('Error syncing skills:', error);
                  }
                }
              }
            } else if (userType === 'scout') {
              // Create scout profile
              const response = await fetch('/api/scouts', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fullName: authProfile.fullName,
                  organization: authProfile.club || "Independente",
                  position: "Scout",
                  phone: authProfile.phone || "",
                  email: user?.email || ""
                })
              });
              
              if (response.ok) {
                // Invalidate user query to get updated data
                queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
              }
            }
          } catch (error) {
            console.error('Error creating profile:', error);
          }
        }
      }
    };
    
    createProfileIfNeeded();
    
    // Stadium entrance sequence
    const timer1 = setTimeout(() => {
      setShowDashboard(true);
    }, 2000);

    // Confetti celebration
    const timer2 = setTimeout(() => {
      triggerConfetti();
    }, 2500);

    // Brazilian celebration confetti
    const timer3 = setTimeout(() => {
      triggerBrazilianConfetti();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [user, queryClient]);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const triggerBrazilianConfetti = () => {
    // Brazilian flag colors confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#009B3A', '#FEDF00', '#002776']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#009B3A', '#FEDF00']
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#002776', '#FEDF00']
      });
    }, 400);
  };

  const playCrowdSound = () => {
    // Create a simple crowd cheer simulation using Web Audio API
    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    }
  };

  const handleEnterDashboard = () => {
    triggerConfetti();
    const userType = user?.userType || sessionStorage.getItem('selectedUserType');
    
    setTimeout(() => {
      if (userType === 'scout') {
        setLocation("/scout/dashboard");
      } else {
        setLocation("/athlete/dashboard");
      }
    }, 1000);
  };

  const savedData = {
    position: JSON.parse(localStorage.getItem("authPosition") || "{}"),
    profile: JSON.parse(localStorage.getItem("authProfile") || "{}"),
    skills: JSON.parse(localStorage.getItem("authSkills") || "[]")
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stadium Tunnel Background */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-gray-700"
        style={{
          backgroundImage: `linear-gradient(180deg, 
            rgba(0,0,0,0.9) 0%, 
            rgba(0,0,0,0.7) 30%, 
            rgba(0,0,0,0.5) 60%, 
            rgba(255,255,255,0.2) 100%)`
        }}
      />

      {/* Tunnel Perspective Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="tunnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>
        </defs>
        {/* Tunnel lines */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${10 + i * 10}%`}
            y1="0%"
            x2="50%"
            y2="100%"
            stroke="url(#tunnelGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`r${i}`}
            x1={`${90 - i * 10}%`}
            y1="0%"
            x2="50%"
            y2="100%"
            stroke="url(#tunnelGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
          />
        ))}
      </svg>

      {/* Stadium Light at End */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-b from-amarelo-ouro to-white rounded-full blur-sm opacity-60"
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.8 }}
        transition={{ duration: 3, delay: 1 }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-amarelo-ouro/50 to-white/50 rounded-full blur-lg"
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Stadium Entrance Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-center mb-8"
        >
          <motion.h1
            animate={{ 
              textShadow: [
                "0 0 10px rgba(255, 215, 0, 0.5)",
                "0 0 20px rgba(255, 215, 0, 0.8)",
                "0 0 10px rgba(255, 215, 0, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-bebas text-6xl md:text-8xl text-white mb-4 tracking-wider"
          >
            BEM-VINDO
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="font-bebas text-3xl md:text-5xl text-amarelo-ouro tracking-wider"
          >
            AO REVELA
          </motion.h2>
        </motion.div>

        {/* Achievement Summary */}
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl w-full grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {/* Profile Complete */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-verde-brasil mb-2"
                >
                  <Users className="w-8 h-8 mx-auto" />
                </motion.div>
                <h3 className="font-bebas text-lg">PERFIL CRIADO</h3>
                <p className="text-sm text-white/80">
                  {savedData.profile.fullName || "Atleta"}
                </p>
              </CardContent>
            </Card>

            {/* Position Selected */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-azul-celeste mb-2"
                >
                  <Target className="w-8 h-8 mx-auto" />
                </motion.div>
                <h3 className="font-bebas text-lg">POSIÇÃO</h3>
                <p className="text-sm text-white/80">
                  {savedData.position.name || "Definida"}
                </p>
              </CardContent>
            </Card>

            {/* Skills Assessed */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <motion.div
                  animate={{ 
                    rotateY: [0, 180, 360],
                    color: ["#F59E0B", "#10B981", "#3B82F6", "#F59E0B"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-2"
                >
                  <Star className="w-8 h-8 mx-auto" />
                </motion.div>
                <h3 className="font-bebas text-lg">HABILIDADES</h3>
                <p className="text-sm text-white/80">Avaliadas</p>
              </CardContent>
            </Card>

            {/* Journey Complete */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    rotateZ: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-amarelo-ouro mb-2"
                >
                  <Trophy className="w-8 h-8 mx-auto" />
                </motion.div>
                <h3 className="font-bebas text-lg">JORNADA</h3>
                <p className="text-sm text-white/80">Completa</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Enter Stadium Button */}
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(255, 215, 0, 0.3)",
                  "0 0 40px rgba(255, 215, 0, 0.6)",
                  "0 0 20px rgba(255, 215, 0, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block rounded-full"
            >
              <Button
                onClick={handleEnterDashboard}
                className="relative px-12 py-6 text-xl font-bebas tracking-wider bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/80 hover:to-amarelo-ouro/80 text-white border-4 border-white/30 rounded-full shadow-2xl overflow-hidden"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                
                <div className="relative z-10 flex items-center gap-3">
                  <span>ENTRAR NO ESTÁDIO</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⚽
                  </motion.div>
                </div>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/80 mt-4 text-lg"
            >
              Sua aventura rumo ao estrelato brasileiro começa agora, campeão!
            </motion.p>
          </motion.div>
        )}

        {/* Crowd Sound Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 3 }}
          onClick={() => {
            if (!audioContext) {
              setAudioContext(new AudioContext());
            }
            playCrowdSound();
          }}
          className="absolute bottom-8 left-8 text-white/60 hover:text-white/80 transition-colors"
        >
          🔊 Som da torcida
        </motion.button>
      </div>

      {/* Crowd Noise Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-verde-brasil via-amarelo-ouro to-azul-celeste opacity-30"
      />
    </div>
  );
}