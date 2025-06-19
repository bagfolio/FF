import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Dumbbell, Target, Heart, ChevronRight, ChevronLeft } from "lucide-react";

interface SkillAssessment {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  data: {
    selfRating?: string;
    specificMetric?: number;
    sliderValue?: number;
    comparison?: string;
    skills?: Record<string, number>;
    preferredFoot?: string;
    duration?: string;
    recovery?: string;
  };
}

// Speed Assessment Component
function SpeedAssessment({ onComplete }: { onComplete: (data: any) => void }) {
  const [selfRating, setSelfRating] = useState<string>("");
  const [time50m, setTime50m] = useState<string>("");
  const [speedSlider, setSpeedSlider] = useState<number>(5);

  const handleComplete = () => {
    onComplete({
      selfRating,
      specificMetric: time50m ? parseFloat(time50m) : undefined,
      sliderValue: speedSlider
    });
  };

  const isComplete = selfRating !== "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="assessment-card bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bebas text-3xl text-white">Como você avalia sua velocidade?</h3>
            <p className="text-white/60">Seja honesto - isso ajuda a encontrar as melhores oportunidades</p>
          </div>
        </div>
        
        {/* Self Rating */}
        <div className="rating-section mb-8">
          <p className="text-white mb-4">Comparado com jogadores da sua idade:</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "slower", label: "Mais lento", icon: "🐢" },
              { value: "average", label: "Na média", icon: "🏃" },
              { value: "above_average", label: "Acima da média", icon: "⚡" },
              { value: "fastest", label: "Um dos mais rápidos", icon: "🚀" }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setSelfRating(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selfRating === option.value
                    ? 'border-amarelo-ouro bg-amarelo-ouro/20 shadow-lg shadow-amarelo-ouro/30'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <span className="text-white font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Specific Metrics */}
        <div className="metric-inputs mb-8">
          <label className="text-white mb-2 block">Seu tempo nos 50m (se souber):</label>
          <input
            type="number"
            step="0.1"
            placeholder="Ex: 7.2 segundos"
            value={time50m}
            onChange={(e) => setTime50m(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-amarelo-ouro focus:outline-none transition-colors"
          />
        </div>
        
        {/* Visual Slider */}
        <div className="speed-slider mb-8">
          <label className="text-white mb-4 block">Arraste para indicar sua velocidade:</label>
          <div className="relative">
            <input 
              type="range" 
              min="1" 
              max="10"
              value={speedSlider}
              onChange={(e) => setSpeedSlider(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between mt-2">
              <span className="text-white/60 text-sm">🐢 Lento</span>
              <span className="text-white/60 text-sm">⚡ Rápido</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-2xl font-bebas text-amarelo-ouro">{speedSlider}/10</span>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={!isComplete}
          className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/80 hover:to-amarelo-ouro/80 text-white font-bebas text-xl py-4 rounded-full transition-all duration-300 disabled:opacity-50"
        >
          PRÓXIMA AVALIAÇÃO
        </Button>
      </div>
    </motion.div>
  );
}

// Strength Assessment Component
function StrengthAssessment({ onComplete }: { onComplete: (data: any) => void }) {
  const [ballDisputes, setBallDisputes] = useState<string>("");
  const [teamComparison, setTeamComparison] = useState<number>(5);

  const handleComplete = () => {
    onComplete({
      comparison: ballDisputes,
      sliderValue: teamComparison
    });
  };

  const isComplete = ballDisputes !== "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="assessment-card bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bebas text-3xl text-white">Avalie sua força física</h3>
            <p className="text-white/60">Força é importante para proteger a bola e disputas</p>
          </div>
        </div>
        
        {/* Multiple Choice Questions */}
        <div className="question mb-8">
          <p className="text-white mb-4">Em disputas de bola:</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: "win_most", icon: "💪", label: "Ganho a maioria", desc: "Consigo proteger bem a bola" },
              { value: "fifty_fifty", icon: "🤝", label: "50/50", desc: "Depende do adversário" },
              { value: "avoid", icon: "🏃", label: "Prefiro evitar", desc: "Uso velocidade e técnica" }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setBallDisputes(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  ballDisputes === option.value
                    ? 'border-amarelo-ouro bg-amarelo-ouro/20 shadow-lg shadow-amarelo-ouro/30'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-3xl">{option.icon}</span>
                <div className="text-left">
                  <span className="text-white font-medium block">{option.label}</span>
                  <span className="text-white/60 text-sm">{option.desc}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Comparison Slider */}
        <div className="comparison mb-8">
          <p className="text-white mb-4">Comparado com seu time atual:</p>
          <div className="relative">
            <div className="flex justify-between mb-2 text-white/60 text-sm">
              <span>Mais fraco</span>
              <span>Igual</span>
              <span>Mais forte</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10"
              value={teamComparison}
              onChange={(e) => setTeamComparison(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full appearance-none cursor-pointer slider-thumb"
            />
            <div className="text-center mt-4">
              <span className="text-2xl font-bebas text-amarelo-ouro">{teamComparison}/10</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={!isComplete}
          className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/80 hover:to-amarelo-ouro/80 text-white font-bebas text-xl py-4 rounded-full transition-all duration-300 disabled:opacity-50"
        >
          PRÓXIMA AVALIAÇÃO
        </Button>
      </div>
    </motion.div>
  );
}

// Technique Assessment Component
function TechniqueAssessment({ onComplete }: { onComplete: (data: any) => void }) {
  const [skills, setSkills] = useState<Record<string, number>>({
    shortPass: 0,
    longPass: 0,
    control: 0,
    finishing: 0
  });
  const [preferredFoot, setPreferredFoot] = useState<string>("");

  const handleSkillRating = (skill: string, rating: number) => {
    setSkills(prev => ({ ...prev, [skill]: rating }));
  };

  const handleComplete = () => {
    onComplete({
      skills,
      preferredFoot
    });
  };

  const isComplete = Object.values(skills).every(v => v > 0) && preferredFoot !== "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="assessment-card bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bebas text-3xl text-white">Suas habilidades técnicas</h3>
            <p className="text-white/60">Clique nos números para avaliar cada habilidade de 1 a 5</p>
          </div>
        </div>
        
        {/* Skill Matrix */}
        <div className="skill-grid mb-8 space-y-4">
          {[
            { id: "shortPass", label: "Passe curto", desc: "Passes de até 15m" },
            { id: "longPass", label: "Passe longo", desc: "Lançamentos e mudanças de jogo" },
            { id: "control", label: "Domínio", desc: "Controle e primeiro toque" },
            { id: "finishing", label: "Finalização", desc: "Chutes ao gol" }
          ].map((skill) => (
            <div key={skill.id} className="skill-item">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-white font-medium">{skill.label}</span>
                  <p className="text-white/60 text-sm">{skill.desc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => handleSkillRating(skill.id, star)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      skills[skill.id] >= star 
                        ? 'bg-amarelo-ouro border-amarelo-ouro text-white' 
                        : 'bg-transparent border-white/30 text-white/30 hover:border-white/60'
                    }`}
                  >
                    <span className="text-lg font-bold">{star}</span>
                  </motion.button>
                ))}
                <span className="text-white/60 text-sm ml-2 self-center">
                  {skills[skill.id] > 0 ? `${skills[skill.id]}/5` : 'Clique para avaliar'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Preferred Foot */}
        <div className="foot-preference mb-8">
          <p className="text-white mb-4">Pé dominante:</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "right", label: "Direito", icon: "🦶" },
              { value: "left", label: "Esquerdo", icon: "🦶" },
              { value: "both", label: "Ambidestro", icon: "👟" }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setPreferredFoot(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  preferredFoot === option.value
                    ? 'border-amarelo-ouro bg-amarelo-ouro/20 shadow-lg shadow-amarelo-ouro/30'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <span className="text-white font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={!isComplete}
          className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/80 hover:to-amarelo-ouro/80 text-white font-bebas text-xl py-4 rounded-full transition-all duration-300 disabled:opacity-50"
        >
          PRÓXIMA AVALIAÇÃO
        </Button>
      </div>
    </motion.div>
  );
}

// Stamina Assessment Component
function StaminaAssessment({ onComplete }: { onComplete: (data: any) => void }) {
  const [duration, setDuration] = useState<string>("");
  const [recovery, setRecovery] = useState<string>("");

  const handleComplete = () => {
    onComplete({
      duration,
      recovery
    });
  };

  const isComplete = duration !== "" && recovery !== "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="assessment-card bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bebas text-3xl text-white">Sua resistência em campo</h3>
            <p className="text-white/60">Quanto tempo você aguenta jogar intensamente?</p>
          </div>
        </div>
        
        {/* Duration Selector */}
        <div className="stamina-scale mb-8">
          <p className="text-white mb-4">Consigo manter alto ritmo por:</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "45", label: "45 min", desc: "Um tempo" },
              { value: "60", label: "60 min", desc: "Boa parte do jogo" },
              { value: "90", label: "90 min", desc: "Jogo completo" },
              { value: "90+", label: "90+ min", desc: "Jogo completo + prorrogação" }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setDuration(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  duration === option.value
                    ? 'border-amarelo-ouro bg-amarelo-ouro/20 shadow-lg shadow-amarelo-ouro/30'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-white font-medium block text-lg">{option.label}</span>
                <span className="text-white/60 text-sm">{option.desc}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Recovery Rate */}
        <div className="recovery mb-8">
          <p className="text-white mb-4">Após um sprint, você se recupera:</p>
          <div className="space-y-3">
            {[
              { value: "fast", icon: "🟢", label: "Rapidamente", desc: "Menos de 30 segundos" },
              { value: "normal", icon: "🟡", label: "Normal", desc: "Entre 30-60 segundos" },
              { value: "slow", icon: "🔴", label: "Preciso melhorar", desc: "Mais de 60 segundos" }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setRecovery(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  recovery === option.value
                    ? 'border-amarelo-ouro bg-amarelo-ouro/20 shadow-lg shadow-amarelo-ouro/30'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <div className="text-left">
                  <span className="text-white font-medium block">{option.label}</span>
                  <span className="text-white/60 text-sm">{option.desc}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={!isComplete}
          className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/80 hover:to-amarelo-ouro/80 text-white font-bebas text-xl py-4 rounded-full transition-all duration-300 disabled:opacity-50"
        >
          FINALIZAR AVALIAÇÃO
        </Button>
      </div>
    </motion.div>
  );
}

export default function AuthSkills() {
  const [, setLocation] = useLocation();
  const [currentAssessment, setCurrentAssessment] = useState(0);
  const [assessments, setAssessments] = useState<SkillAssessment[]>([
    {
      id: "speed",
      name: "Velocidade",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-400 to-yellow-600",
      data: {}
    },
    {
      id: "strength",
      name: "Força",
      icon: <Dumbbell className="w-8 h-8" />,
      color: "from-red-400 to-red-600",
      data: {}
    },
    {
      id: "technique",
      name: "Técnica",
      icon: <Target className="w-8 h-8" />,
      color: "from-blue-400 to-blue-600",
      data: {}
    },
    {
      id: "stamina",
      name: "Resistência",
      icon: <Heart className="w-8 h-8" />,
      color: "from-green-400 to-green-600",
      data: {}
    }
  ]);

  const handleAssessmentComplete = (data: any) => {
    const updatedAssessments = [...assessments];
    updatedAssessments[currentAssessment].data = data;
    setAssessments(updatedAssessments);

    if (currentAssessment < assessments.length - 1) {
      setCurrentAssessment(currentAssessment + 1);
    } else {
      // All assessments complete - save only the data, not React components
      const dataToSave = updatedAssessments.map(assessment => ({
        id: assessment.id,
        name: assessment.name,
        data: assessment.data
      }));
      localStorage.setItem("authSkills", JSON.stringify(dataToSave));
      setLocation("/auth/complete");
    }
  };

  const handlePrevious = () => {
    if (currentAssessment > 0) {
      setCurrentAssessment(currentAssessment - 1);
    }
  };

  const renderAssessment = () => {
    switch (assessments[currentAssessment].id) {
      case "speed":
        return <SpeedAssessment onComplete={handleAssessmentComplete} />;
      case "strength":
        return <StrengthAssessment onComplete={handleAssessmentComplete} />;
      case "technique":
        return <TechniqueAssessment onComplete={handleAssessmentComplete} />;
      case "stamina":
        return <StaminaAssessment onComplete={handleAssessmentComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Training Ground atmosphere */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        
        {/* Animated training lights */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
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
        <h1 className="font-bebas text-5xl md:text-7xl text-white mb-2 tracking-wider">
          AVALIAÇÃO DE HABILIDADES
        </h1>
        <p className="text-white/80 text-xl font-medium">
          Seja honesto - isso ajuda a encontrar as melhores oportunidades
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`w-12 h-1 rounded-full transition-colors duration-300 ${
                index <= currentAssessment + 2 ? 'bg-verde-brasil' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Assessment Progress */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-8">
        <div className="flex justify-center items-center gap-4">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              className={`flex items-center ${index < assessments.length - 1 ? 'flex-1' : ''}`}
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index < currentAssessment
                    ? 'bg-verde-brasil text-white'
                    : index === currentAssessment
                    ? `bg-gradient-to-r ${assessment.color} text-white`
                    : 'bg-gray-700 text-gray-400'
                }`}
                animate={{
                  scale: index === currentAssessment ? 1.2 : 1,
                }}
              >
                {index < currentAssessment ? "✓" : index + 1}
              </motion.div>
              {index < assessments.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors duration-300 ${
                    index < currentAssessment ? 'bg-verde-brasil' : 'bg-gray-700'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <p className="text-white/80 font-medium">
            {currentAssessment + 1} de {assessments.length} - {assessments[currentAssessment].name}
          </p>
        </div>
      </div>

      {/* Assessment Content */}
      <div className="relative z-10 px-4 pb-8">
        <AnimatePresence mode="wait">
          {renderAssessment()}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          {currentAssessment > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

