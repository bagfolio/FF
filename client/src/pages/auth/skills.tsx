import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Dumbbell, Target, Heart, Play, RotateCcw, Trophy, Timer } from "lucide-react";

// Speed Game - Reaction time test
function SpeedGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; active: boolean }[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      // Calculate score based on clicks (max 20 clicks in 10 seconds)
      const score = Math.min(100, Math.round((clickCount / 20) * 100));
      onComplete(score);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted, clickCount, onComplete]);

  useEffect(() => {
    if (gameStarted) {
      intervalRef.current = setInterval(() => {
        const newTarget = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          active: true
        };
        setTargets(prev => [...prev.filter(t => t.active).slice(-2), newTarget]);
      }, 800);
    }
    return () => clearInterval(intervalRef.current);
  }, [gameStarted]);

  const handleTargetClick = (id: number) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, active: false } : t));
    setClickCount(prev => prev + 1);
  };

  const startGame = () => {
    setGameStarted(true);
    setClickCount(0);
    setTimeLeft(10);
  };

  return (
    <div className="w-full h-full min-h-[400px] relative">
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Zap className="w-16 h-16 text-yellow-400 mb-4" />
          <h3 className="font-bebas text-3xl text-white mb-4">TESTE DE VELOCIDADE</h3>
          <p className="text-white/80 mb-6 text-center">Clique nos cones o mais rápido possível!</p>
          <Button
            onClick={startGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bebas text-xl px-8 py-3"
          >
            INICIAR
          </Button>
        </div>
      ) : (
        <>
          {/* Game HUD */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-black/50 rounded-t-lg">
            <div className="text-white">
              <Timer className="inline w-5 h-5 mr-2" />
              <span className="font-bebas text-xl">{timeLeft}s</span>
            </div>
            <div className="text-white font-bebas text-xl">
              CLIQUES: {clickCount}
            </div>
          </div>

          {/* Game Area */}
          <div className="relative w-full h-full pt-16">
            {targets.map(target => (
              target.active && (
                <motion.div
                  key={target.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{ 
                    position: 'absolute', 
                    left: `${target.x}%`, 
                    top: `${target.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleTargetClick(target.id)}
                  className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg flex items-center justify-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full" />
                </motion.div>
              )
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Strength Game - Hold button challenge
function StrengthGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [isHolding, setIsHolding] = useState(false);
  const [power, setPower] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isHolding && !gameEnded) {
      intervalRef.current = setInterval(() => {
        setPower(prev => {
          const newPower = Math.min(100, prev + 2);
          if (newPower === 100) {
            setGameEnded(true);
            setIsHolding(false);
            onComplete(100);
          }
          return newPower;
        });
      }, 50);
    } else {
      clearInterval(intervalRef.current);
      if (gameStarted && !isHolding && power > 0 && !gameEnded) {
        // Penalize for releasing early
        setPower(prev => Math.max(0, prev - 5));
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isHolding, gameStarted, gameEnded, power, onComplete]);

  const handleMouseDown = () => {
    if (!gameEnded) {
      setIsHolding(true);
      if (!gameStarted) setGameStarted(true);
    }
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    if (gameStarted && !gameEnded && power > 10) {
      setGameEnded(true);
      onComplete(power);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <Dumbbell className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="font-bebas text-3xl text-white mb-4">TESTE DE FORÇA</h3>
      
      {!gameStarted && (
        <p className="text-white/80 mb-6 text-center">Segure o botão sem soltar até encher a barra!</p>
      )}

      {/* Power Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-8 bg-gray-700 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-red-400 to-red-600"
            animate={{ width: `${power}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bebas text-white text-xl">{Math.round(power)}%</span>
          </div>
        </div>
      </div>

      {/* Hold Button */}
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        disabled={gameEnded}
        className={`w-32 h-32 rounded-full transition-all duration-200 ${
          isHolding 
            ? 'scale-95 bg-gradient-to-br from-red-600 to-red-800 shadow-inner' 
            : 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg'
        } ${gameEnded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="text-white text-center">
          <Dumbbell className="w-12 h-12 mx-auto mb-2" />
          <span className="font-bebas text-lg">
            {!gameStarted ? 'SEGURE' : isHolding ? 'SEGURANDO!' : 'SEGURE!'}
          </span>
        </div>
      </button>

      {gameEnded && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-verde-brasil font-bebas text-2xl mt-4"
        >
          {power === 100 ? 'FORÇA MÁXIMA!' : 'BOM ESFORÇO!'}
        </motion.p>
      )}
    </div>
  );
}

// Technique Game - Ball control sequence
function TechniqueGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const buttons = [
    { id: 'up', icon: '⬆️', color: 'from-blue-500 to-blue-600' },
    { id: 'right', icon: '➡️', color: 'from-green-500 to-green-600' },
    { id: 'down', icon: '⬇️', color: 'from-yellow-500 to-yellow-600' },
    { id: 'left', icon: '⬅️', color: 'from-red-500 to-red-600' }
  ];

  const generateSequence = (length: number) => {
    const newSequence = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(buttons[Math.floor(Math.random() * buttons.length)].id);
    }
    return newSequence;
  };

  const showSequence = async () => {
    setShowingSequence(true);
    setPlayerSequence([]);
    
    for (let i = 0; i < sequence.length; i++) {
      setCurrentIndex(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setCurrentIndex(-1);
    setShowingSequence(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setMistakes(0);
    const newSeq = generateSequence(3);
    setSequence(newSeq);
    setTimeout(() => showSequence(), 500);
  };

  useEffect(() => {
    if (gameStarted && sequence.length > 0 && !showingSequence) {
      showSequence();
    }
  }, [sequence]);

  const handleButtonClick = (buttonId: string) => {
    if (showingSequence || !gameStarted) return;

    const newPlayerSeq = [...playerSequence, buttonId];
    setPlayerSequence(newPlayerSeq);

    // Check if correct
    if (sequence[newPlayerSeq.length - 1] !== buttonId) {
      setMistakes(mistakes + 1);
      if (mistakes >= 2) {
        // Game over
        const score = Math.max(0, Math.round(((level - 1) * 20) - (mistakes * 10)));
        onComplete(score);
      } else {
        // Try again
        setTimeout(() => {
          setPlayerSequence([]);
          showSequence();
        }, 1000);
      }
    } else if (newPlayerSeq.length === sequence.length) {
      // Level complete
      setLevel(level + 1);
      if (level >= 5) {
        // Game complete
        onComplete(Math.max(0, 100 - (mistakes * 20)));
      } else {
        setTimeout(() => {
          setSequence(generateSequence(3 + level));
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <Target className="w-16 h-16 text-blue-500 mb-4" />
      <h3 className="font-bebas text-3xl text-white mb-4">TESTE DE TÉCNICA</h3>
      
      {!gameStarted ? (
        <>
          <p className="text-white/80 mb-6 text-center">Memorize e repita a sequência de toques!</p>
          <Button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bebas text-xl px-8 py-3"
          >
            INICIAR
          </Button>
        </>
      ) : (
        <>
          <div className="text-white mb-4">
            <span className="font-bebas text-xl">NÍVEL {level} | ERROS: {mistakes}/3</span>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {buttons.map((button, index) => (
              <motion.button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                disabled={showingSequence}
                className={`w-24 h-24 rounded-xl bg-gradient-to-br ${button.color} 
                  flex items-center justify-center text-4xl shadow-lg
                  ${showingSequence && currentIndex === sequence.findIndex(s => s === button.id) ? 'ring-4 ring-white' : ''}
                  ${!showingSequence ? 'hover:scale-105 active:scale-95' : ''}
                  transition-all duration-200`}
                animate={{
                  scale: showingSequence && sequence[currentIndex] === button.id ? 1.2 : 1,
                  opacity: showingSequence && sequence[currentIndex] === button.id ? 1 : showingSequence ? 0.5 : 1
                }}
              >
                {button.icon}
              </motion.button>
            ))}
          </div>

          {showingSequence && (
            <p className="text-amarelo-ouro font-bebas text-xl">OBSERVE...</p>
          )}
        </>
      )}
    </div>
  );
}

// Stamina Game - Rapid tap test
function StaminaGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [energy, setEnergy] = useState(100);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Decrease energy over time
        setEnergy(prev => Math.max(0, prev - 2));
      }, 1000);
    } else if (timeLeft === 0 || energy === 0) {
      // Calculate score based on taps and remaining energy
      const score = Math.min(100, Math.round((taps / 150) * 100 * (energy / 100)));
      onComplete(score);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted, energy, taps, onComplete]);

  const handleTap = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    setTaps(prev => prev + 1);
    // Small energy boost for tapping
    setEnergy(prev => Math.min(100, prev + 1));
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <Heart className="w-16 h-16 text-green-500 mb-4" />
      <h3 className="font-bebas text-3xl text-white mb-4">TESTE DE RESISTÊNCIA</h3>

      {!gameStarted && (
        <p className="text-white/80 mb-6 text-center">Toque rapidamente e mantenha sua energia!</p>
      )}

      {gameStarted && (
        <>
          {/* Stats */}
          <div className="flex gap-8 mb-6">
            <div className="text-white text-center">
              <Timer className="w-6 h-6 mx-auto mb-1" />
              <span className="font-bebas text-2xl">{timeLeft}s</span>
            </div>
            <div className="text-white text-center">
              <span className="text-2xl mb-1">⚡</span>
              <span className="font-bebas text-2xl">{taps}</span>
            </div>
          </div>

          {/* Energy Bar */}
          <div className="w-full max-w-md mb-6">
            <div className="h-6 bg-gray-700 rounded-full overflow-hidden relative">
              <motion.div
                className={`h-full bg-gradient-to-r ${
                  energy > 50 ? 'from-green-400 to-green-600' : 
                  energy > 25 ? 'from-yellow-400 to-yellow-600' : 
                  'from-red-400 to-red-600'
                }`}
                animate={{ width: `${energy}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bebas text-white text-sm">ENERGIA: {Math.round(energy)}%</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tap Button */}
      <motion.button
        onClick={handleTap}
        whileTap={{ scale: 0.95 }}
        className="w-40 h-40 rounded-full bg-gradient-to-br from-green-500 to-green-700 
          hover:from-green-600 hover:to-green-800 shadow-2xl cursor-pointer
          flex items-center justify-center transition-all duration-100"
      >
        <div className="text-white text-center">
          <Heart className="w-16 h-16 mx-auto mb-2" />
          <span className="font-bebas text-2xl">
            {!gameStarted ? 'COMEÇAR' : 'TOQUE!'}
          </span>
        </div>
      </motion.button>

      {gameStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-white/60 text-sm"
        >
          Velocidade: {(taps / Math.max(1, 15 - timeLeft)).toFixed(1)} toques/seg
        </motion.div>
      )}
    </div>
  );
}

interface SkillRating {
  id: string;
  name: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  gameDescription: string;
  completed: boolean;
}

type GameState = 'idle' | 'playing' | 'finished';

export default function AuthSkills() {
  const [, setLocation] = useLocation();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillRating[]>([
    {
      id: "speed",
      name: "Velocidade",
      value: 0,
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-400 to-yellow-600",
      description: "Teste seus reflexos de raio",
      gameDescription: "Clique nos cones o mais rápido possível!",
      completed: false
    },
    {
      id: "strength",
      name: "Força",
      value: 0,
      icon: <Dumbbell className="w-8 h-8" />,
      color: "from-red-400 to-red-600",
      description: "Mostre sua força física",
      gameDescription: "Segure o botão sem soltar!",
      completed: false
    },
    {
      id: "technique",
      name: "Técnica",
      value: 0,
      icon: <Target className="w-8 h-8" />,
      color: "from-blue-400 to-blue-600",
      description: "Domínio e controle de bola",
      gameDescription: "Siga a sequência de toques!",
      completed: false
    },
    {
      id: "stamina",
      name: "Resistência",
      value: 0,
      icon: <Heart className="w-8 h-8" />,
      color: "from-green-400 to-green-600",
      description: "Aguenta o jogo todo?",
      gameDescription: "Toque rapidamente sem parar!",
      completed: false
    }
  ]);

  const handleSkillComplete = (skillId: string, score: number) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, value: score, completed: true } : skill
    ));
    setActiveGame(null);
  };

  const handleContinue = () => {
    // Save skills data
    localStorage.setItem("authSkills", JSON.stringify(skills));
    setLocation("/auth/complete");
  };

  const allGamesCompleted = skills.every(skill => skill.completed);

  const getSkillLevel = (value: number) => {
    if (value < 20) return "Iniciante";
    if (value < 40) return "Amador";
    if (value < 60) return "Intermediário";
    if (value < 80) return "Avançado";
    return "Profissional";
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
          TESTE SUAS HABILIDADES
        </h1>
        <p className="text-white/80 text-xl font-medium">
          Complete os desafios e prove seu talento!
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>
      </motion.div>

      {/* Skills Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className={`h-full ${skill.completed ? 'bg-black/50' : 'bg-black/30'} backdrop-blur-md border-white/20 shadow-2xl hover:shadow-verde-brasil/30 transition-all duration-300 transform hover:scale-105`}>
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center shadow-lg`}>
                      {skill.icon}
                    </div>
                    <div>
                      <h3 className="font-bebas text-3xl text-white tracking-wider">
                        {skill.name}
                      </h3>
                      <p className="text-white/70">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                  
                  {skill.completed && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-verde-brasil"
                    >
                      <Trophy className="w-8 h-8" />
                    </motion.div>
                  )}
                </div>

                {/* Game Area */}
                <div className="relative h-48 mb-6">
                  {skill.completed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center bg-white/5 rounded-xl border-2 border-verde-brasil/50"
                    >
                      <Trophy className="w-16 h-16 text-amarelo-ouro mb-4" />
                      <div className="text-5xl font-bebas text-white mb-2">
                        {skill.value}%
                      </div>
                      <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${skill.color} text-white font-medium`}>
                        {getSkillLevel(skill.value)}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="h-full flex flex-col items-center justify-center bg-white/5 rounded-xl border-2 border-dashed border-white/30 cursor-pointer hover:border-verde-brasil hover:bg-white/10 transition-all"
                      onClick={() => setActiveGame(skill.id)}
                    >
                      <Play className="w-12 h-12 text-white/80 mb-4" />
                      <p className="text-white/80 text-lg font-medium">
                        {skill.gameDescription}
                      </p>
                      <p className="text-white/60 mt-2">
                        Clique para começar
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Stars Progress */}
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: skill.completed && i < Math.ceil(skill.value / 20) ? 1 : 0.8,
                        opacity: skill.completed && i < Math.ceil(skill.value / 20) ? 1 : 0.3
                      }}
                      transition={{ delay: skill.completed ? i * 0.1 : 0 }}
                      className="text-2xl"
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overall Rating - Only show when games completed */}
      <AnimatePresence>
        {allGamesCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-2xl mx-auto px-4 mt-8"
          >
            <Card className="bg-gradient-to-r from-verde-brasil to-amarelo-ouro text-white shadow-2xl border-0">
              <CardContent className="p-8 text-center">
                <h3 className="font-bebas text-3xl mb-6 tracking-wider">
                  AVALIAÇÃO GERAL DO ATLETA
                </h3>
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-6xl font-bebas mb-4"
                >
                  {Math.round(skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length)}%
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/90 text-xl font-medium"
                >
                  Nível: {getSkillLevel(skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length)}
                </motion.p>

                {/* Animated stars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center gap-2 mt-6"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="text-3xl"
                    >
                      {i < Math.ceil((skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length) / 20) ? "⭐" : "☆"}
                    </motion.span>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: allGamesCompleted ? 1 : 0.5 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 pb-8 relative z-10"
      >
        <Button
          onClick={handleContinue}
          disabled={!allGamesCompleted}
          className="bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/80 hover:to-amarelo-ouro/80 text-white px-12 py-4 text-xl font-bebas tracking-wider rounded-full shadow-2xl hover:shadow-verde-brasil/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {allGamesCompleted ? "FINALIZAR JORNADA" : "COMPLETE TODOS OS TESTES"}
        </Button>
      </motion.div>

      {/* Mini-Games Modals */}
      <AnimatePresence>
        {activeGame && (
          <MiniGameModal
            skill={skills.find(s => s.id === activeGame)!}
            onClose={() => setActiveGame(null)}
            onComplete={handleSkillComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini-Game Modal Component
function MiniGameModal({ 
  skill, 
  onClose, 
  onComplete 
}: { 
  skill: SkillRating; 
  onClose: () => void; 
  onComplete: (skillId: string, score: number) => void;
}) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);

  const handleGameComplete = (finalScore: number) => {
    setGameState('finished');
    setScore(finalScore);
    setTimeout(() => {
      onComplete(skill.id, finalScore);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={gameState === 'idle' ? onClose : undefined}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {gameState === 'idle' && (
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center`}>
              {skill.icon}
            </div>
            <h2 className="font-bebas text-4xl text-white mb-4">
              TESTE DE {skill.name.toUpperCase()}
            </h2>
            <p className="text-white/80 text-lg mb-8">
              {skill.gameDescription}
            </p>
            <Button
              onClick={() => setGameState('playing')}
              className="bg-gradient-to-r from-verde-brasil to-amarelo-ouro text-white px-10 py-4 text-xl font-bebas rounded-full hover:scale-105 transition-transform"
            >
              <Play className="w-6 h-6 mr-2" />
              COMEÇAR DESAFIO
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="min-h-[400px] flex items-center justify-center">
            {skill.id === 'speed' && <SpeedGame onComplete={handleGameComplete} />}
            {skill.id === 'strength' && <StrengthGame onComplete={handleGameComplete} />}
            {skill.id === 'technique' && <TechniqueGame onComplete={handleGameComplete} />}
            {skill.id === 'stamina' && <StaminaGame onComplete={handleGameComplete} />}
          </div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Trophy className="w-20 h-20 text-amarelo-ouro mx-auto mb-6" />
            <h3 className="font-bebas text-4xl text-white mb-4">DESAFIO COMPLETO!</h3>
            <div className="text-6xl font-bebas text-verde-brasil mb-4">{score}%</div>
            <p className="text-white/80 text-lg">
              Nível alcançado: {getSkillLevel(score)}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}