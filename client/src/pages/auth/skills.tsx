import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Zap, Dumbbell, Target, Heart } from "lucide-react";

interface SkillRating {
  id: string;
  name: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function AuthSkills() {
  const [, setLocation] = useLocation();
  const [skills, setSkills] = useState<SkillRating[]>([
    {
      id: "speed",
      name: "Velocidade",
      value: 50,
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-400 to-yellow-600",
      description: "Quão rápido você corre em campo?"
    },
    {
      id: "strength",
      name: "Força",
      value: 50,
      icon: <Dumbbell className="w-8 h-8" />,
      color: "from-red-400 to-red-600",
      description: "Sua força física e resistência"
    },
    {
      id: "technique",
      name: "Técnica",
      value: 50,
      icon: <Target className="w-8 h-8" />,
      color: "from-blue-400 to-blue-600",
      description: "Controle de bola e precisão"
    },
    {
      id: "stamina",
      name: "Resistência",
      value: 50,
      icon: <Heart className="w-8 h-8" />,
      color: "from-green-400 to-green-600",
      description: "Aguenta jogar 90 minutos?"
    }
  ]);

  const handleSkillChange = (skillId: string, value: number[]) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, value: value[0] } : skill
    ));
  };

  const handleContinue = () => {
    // Save skills data
    localStorage.setItem("authSkills", JSON.stringify(skills));
    setLocation("/auth/complete");
  };

  const getSkillLevel = (value: number) => {
    if (value < 20) return "Iniciante";
    if (value < 40) return "Amador";
    if (value < 60) return "Intermediário";
    if (value < 80) return "Avançado";
    return "Profissional";
  };

  const getSkillEmoji = (skillId: string, value: number) => {
    const intensity = Math.floor(value / 20);
    switch (skillId) {
      case "speed":
        return ["🚶", "🏃", "🏃‍♂️", "💨", "⚡"][intensity];
      case "strength":
        return ["💪", "💪", "💪💪", "🦾", "🔥"][intensity];
      case "technique":
        return ["⚽", "🎯", "🎯⚽", "🏆", "👑"][intensity];
      case "stamina":
        return ["❤️", "💚", "💚💚", "🫀", "🔋"][intensity];
      default:
        return "⚽";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-brasil/10 via-white to-amarelo-ouro/10 relative overflow-hidden">
      {/* Brazilian Stadium Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' opacity='0.1'%3E%3Cpath d='M0 0h100v100H0z'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center pt-8 pb-8"
      >
        <h1 className="font-bebas text-4xl md:text-6xl azul-celeste mb-2">
          AVALIE SUAS HABILIDADES
        </h1>
        <p className="text-cinza-medio text-lg font-medium">
          Como você se classifica em cada aspecto do jogo?
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        </div>
      </motion.div>

      {/* Skills Grid */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${skill.color} text-white relative`}>
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {skill.icon}
                </motion.div>

                <CardTitle className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        scale: skill.value > 50 ? [1, 1.2, 1] : 1,
                        rotate: skill.value > 80 ? [0, 10, -10, 0] : 0
                      }}
                      transition={{
                        duration: 2,
                        repeat: skill.value > 50 ? Infinity : 0
                      }}
                    >
                      {skill.icon}
                    </motion.div>
                    <span className="font-bebas text-2xl">{skill.name}</span>
                  </div>
                  
                  {/* Animated Emoji */}
                  <motion.span
                    key={skill.value}
                    initial={{ scale: 0.5, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-3xl"
                  >
                    {getSkillEmoji(skill.id, skill.value)}
                  </motion.span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <p className="text-cinza-medio text-center">
                  {skill.description}
                </p>

                {/* Custom Slider */}
                <div className="space-y-4">
                  <div className="relative">
                    <Slider
                      value={[skill.value]}
                      onValueChange={(value) => handleSkillChange(skill.id, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    
                    {/* Slider Track Enhancement */}
                    <div 
                      className={`absolute top-0 left-0 h-2 bg-gradient-to-r ${skill.color} rounded-full transition-all duration-300`}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>

                  {/* Value Display */}
                  <div className="text-center space-y-2">
                    <motion.div
                      key={skill.value}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bebas azul-celeste"
                    >
                      {skill.value}%
                    </motion.div>
                    
                    <motion.div
                      key={getSkillLevel(skill.value)}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${skill.color}`}
                    >
                      {getSkillLevel(skill.value)}
                    </motion.div>
                  </div>
                </div>

                {/* Visual Feedback */}
                <div className="flex justify-center">
                  <motion.div
                    className="flex space-x-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < Math.floor(skill.value / 20) ? `bg-gradient-to-r ${skill.color}` : 'bg-gray-200'
                        }`}
                        animate={{
                          scale: i < Math.floor(skill.value / 20) ? [1, 1.3, 1] : 1
                        }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.1,
                          repeat: i < Math.floor(skill.value / 20) ? Infinity : 0,
                          repeatDelay: 2
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overall Rating */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto px-4 mt-8"
      >
        <Card className="bg-gradient-to-r from-azul-celeste to-verde-brasil text-white shadow-xl">
          <CardContent className="p-6 text-center">
            <h3 className="font-bebas text-2xl mb-4">AVALIAÇÃO GERAL</h3>
            
            <motion.div
              key={Math.round(skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length)}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bebas mb-2"
            >
              {Math.round(skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length)}%
            </motion.div>
            
            <p className="text-white/90 text-lg">
              {getSkillLevel(skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8 pb-8"
      >
        <Button
          onClick={handleContinue}
          className="btn-primary px-12 py-4 text-xl font-bebas tracking-wider shadow-lg hover:shadow-xl transition-shadow"
        >
          FINALIZAR JORNADA
        </Button>
      </motion.div>
    </div>
  );
}