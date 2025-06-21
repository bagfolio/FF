import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Dumbbell, Target, Heart, Timer, MousePointer2, Gauge } from "lucide-react";
import { ProgressJourney } from "@/components/features/auth/ProgressJourney";
import SoundController from "@/components/features/auth/SoundController";
import CulturalTooltips from "@/components/features/auth/CulturalTooltips";
import confetti from "canvas-confetti";

interface SkillGame {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  instruction: string;
  unit: string;
  minScore: number;
  maxScore: number;
}

const skillGames: SkillGame[] = [
  {
    id: "speed",
    name: "Velocidade",
    icon: <Zap className="w-8 h-8" />,
    color: "from-yellow-400 to-yellow-600",
    description: "Teste seus reflexos de craque",
    instruction: "Clique o mais rápido possível quando a bola aparecer!",
    unit: "ms",
    minScore: 150,
    maxScore: 500
  },
  {
    id: "strength",
    name: "Força",
    icon: <Dumbbell className="w-8 h-8" />,
    color: "from-red-400 to-red-600",
    description: "Mostre sua força de guerreiro",
    instruction: "Segure o botão por 5 segundos sem soltar!",
    unit: "s",
    minScore: 0,
    maxScore: 5
  },
  {
    id: "technique",
    name: "Técnica",
    icon: <Target className="w-8 h-8" />,
    color: "from-blue-400 to-blue-600",
    description: "Precisão digna de um maestro",
    instruction: "Memorize e repita a sequência de dribles!",
    unit: "pts",
    minScore: 0,
    maxScore: 10
  },
  {
    id: "stamina",
    name: "Resistência",
    icon: <Heart className="w-8 h-8" />,
    color: "from-green-400 to-green-600",
    description: "Aguenta os 90 minutos?",
    instruction: "Clique rapidamente por 10 segundos!",
    unit: "cliques",
    minScore: 0,
    maxScore: 100
  }
];

// Speed Test Game Component
function SpeedTest({ onComplete }: { onComplete: (score: number) => void }) {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'clicked'>('waiting');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (gameState === 'waiting') {
      const delay = 2000 + Math.random() * 3000; // 2-5 seconds
      const timer = setTimeout(() => {
        setGameState('ready');
        startTimeRef.current = Date.now();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleClick = () => {
    if (gameState === 'ready') {
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);
      setGameState('clicked');
      
      // Convert to 0-100 scale (150ms = 100, 500ms = 0)
      const score = Math.max(0, Math.min(100, ((500 - reaction) / 350) * 100));
      onComplete(Math.round(score));
    }
  };

  return (
    <div className="h-64 flex items-center justify-center">
      {gameState === 'waiting' && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-gray-400 text-center"
        >
          <Timer className="w-16 h-16 mx-auto mb-2" />
          <p>Prepare-se...</p>
        </motion.div>
      )}
      
      {gameState === 'ready' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className="w-32 h-32 bg-gradient-to-br from-verde-brasil to-amarelo-ouro rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
        >
          <span className="text-6xl">⚽</span>
        </motion.button>
      )}
      
      {gameState === 'clicked' && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-center"
        >
          <p className="text-4xl font-bebas text-amarelo-ouro mb-2">{reactionTime}ms</p>
          <p className="text-white">
            {reactionTime < 200 ? "Reflexos de Taffarel!" : 
             reactionTime < 300 ? "Rápido como Neymar!" : 
             reactionTime < 400 ? "Bom tempo!" : 
             "Continue treinando!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Strength Test Game Component
function StrengthTest({ onComplete }: { onComplete: (score: number) => void }) {
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const handleMouseDown = () => {
    setIsHolding(true);
    setHoldTime(0);
    intervalRef.current = setInterval(() => {
      setHoldTime(prev => {
        const newTime = prev + 0.1;
        if (newTime >= 5) {
          handleComplete(5);
          return 5;
        }
        return newTime;
      });
    }, 100);
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!completed && holdTime < 5) {
      handleComplete(holdTime);
    }
    setIsHolding(false);
  };

  const handleComplete = (time: number) => {
    setCompleted(true);
    const score = (time / 5) * 100;
    onComplete(Math.round(score));
  };

  return (
    <div className="h-64 flex flex-col items-center justify-center">
      {!completed ? (
        <>
          <motion.button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all ${
              isHolding ? 'bg-gradient-to-br from-red-600 to-red-800 scale-110' : 'bg-gradient-to-br from-red-400 to-red-600'
            }`}
            animate={isHolding ? { scale: [1.1, 1.15, 1.1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Dumbbell className="w-16 h-16 text-white" />
          </motion.button>
          
          <div className="mt-6 w-64">
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-400 to-red-600"
                animate={{ width: `${(holdTime / 5) * 100}%` }}
              />
            </div>
            <p className="text-center text-white mt-2">{holdTime.toFixed(1)}s / 5s</p>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-4xl font-bebas text-red-500 mb-2">{holdTime.toFixed(1)}s</p>
          <p className="text-white">
            {holdTime >= 5 ? "Força de Hulk!" : 
             holdTime >= 4 ? "Quase lá!" : 
             holdTime >= 3 ? "Boa força!" : 
             "Continue malhando!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Technique Test Game Component
function TechniqueTest({ onComplete }: { onComplete: (score: number) => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const moves = ['⬆️', '⬇️', '⬅️', '➡️'];

  useEffect(() => {
    // Generate random sequence
    const newSequence = Array.from({ length: 5 }, () => moves[Math.floor(Math.random() * moves.length)]);
    setSequence(newSequence);
    
    // Show sequence
    const showSequence = async () => {
      for (let i = 0; i < newSequence.length; i++) {
        setCurrentIndex(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      setShowingSequence(false);
      setCurrentIndex(-1);
    };
    
    showSequence();
  }, []);

  const handleMove = (move: string) => {
    if (showingSequence || completed) return;
    
    const newUserSequence = [...userSequence, move];
    setUserSequence(newUserSequence);
    
    if (newUserSequence.length === sequence.length) {
      const correct = newUserSequence.every((m, i) => m === sequence[i]);
      const score = correct ? 100 : (newUserSequence.filter((m, i) => m === sequence[i]).length / sequence.length) * 100;
      setCompleted(true);
      onComplete(Math.round(score));
    }
  };

  return (
    <div className="h-64 flex flex-col items-center justify-center">
      {showingSequence ? (
        <div className="text-center">
          <p className="text-white mb-4">Memorize a sequência:</p>
          <div className="flex gap-2 justify-center">
            {sequence.map((move, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: currentIndex === index ? 1.5 : 1,
                  opacity: currentIndex >= index ? 1 : 0.3
                }}
                className="text-4xl"
              >
                {move}
              </motion.div>
            ))}
          </div>
        </div>
      ) : !completed ? (
        <div className="text-center">
          <p className="text-white mb-4">Repita a sequência:</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {moves.map((move) => (
              <motion.button
                key={move}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMove(move)}
                className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-2xl hover:bg-blue-600"
              >
                {move}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-1">
            {userSequence.map((move, index) => (
              <span key={index} className="text-2xl">
                {move}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-4xl font-bebas text-blue-500 mb-2">
            {userSequence.filter((m, i) => m === sequence[i]).length}/5
          </p>
          <p className="text-white">
            {userSequence.every((m, i) => m === sequence[i]) ? "Técnica perfeita!" : "Boa tentativa!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Stamina Test Game Component
function StaminaTest({ onComplete }: { onComplete: (score: number) => void }) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRunning) {
      setCompleted(true);
      setIsRunning(false);
      const score = Math.min(100, clicks);
      onComplete(score);
    }
  }, [timeLeft, isRunning, clicks, onComplete]);

  const handleClick = () => {
    if (!isRunning && !completed) {
      setIsRunning(true);
    }
    if (isRunning) {
      setClicks(clicks + 1);
    }
  };

  return (
    <div className="h-64 flex flex-col items-center justify-center">
      {!completed ? (
        <>
          <motion.button
            onClick={handleClick}
            whileTap={{ scale: 0.9 }}
            className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
            animate={isRunning ? { rotate: 360 } : {}}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-16 h-16 text-white" />
          </motion.button>
          
          <div className="mt-6 text-center">
            <p className="text-2xl font-bebas text-white">{clicks} cliques</p>
            <p className="text-gray-400">
              {!isRunning ? "Clique para começar!" : `${timeLeft}s restantes`}
            </p>
          </div>
          
          {isRunning && (
            <div className="mt-2 w-64">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600"
                  animate={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-4xl font-bebas text-green-500 mb-2">{clicks} cliques</p>
          <p className="text-white">
            {clicks >= 80 ? "Resistência de maratonista!" : 
             clicks >= 60 ? "Ótimo fôlego!" : 
             clicks >= 40 ? "Bom ritmo!" : 
             "Continue treinando!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function AuthSkillsEnhanced() {
  const [, setLocation] = useLocation();
  const [currentSkill, setCurrentSkill] = useState(0);
  const [skills, setSkills] = useState<{ [key: string]: number }>({});
  const [gameMode, setGameMode] = useState<'intro' | 'playing' | 'complete'>('intro');

  const handleSkillComplete = (skillId: string, score: number) => {
    setSkills(prev => ({ ...prev, [skillId]: score }));
    
    if (score >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    if (window.soundController) {
      window.soundController.playEffect('success');
    }
    
    // Move to next skill or complete
    if (currentSkill < skillGames.length - 1) {
      setTimeout(() => {
        setCurrentSkill(currentSkill + 1);
        setGameMode('intro');
      }, 2000);
    } else {
      setTimeout(() => {
        setGameMode('complete');
      }, 2000);
    }
  };

  const handleContinue = () => {
    localStorage.setItem("authSkills", JSON.stringify(skills));
    setLocation("/auth/complete");
  };

  const currentGame = skillGames[currentSkill];
  const overallScore = Object.values(skills).reduce((sum, score) => sum + score, 0) / Object.keys(skills).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-black relative overflow-hidden">
      {/* Stadium Training Ground Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="field" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="50" fill="#2F5E1F"/><rect y="50" width="100" height="50" fill="#3A6F2F"/></pattern></defs><rect width="100" height="100" fill="url(#field)"/></svg>')}")`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Progress Journey */}
      <ProgressJourney currentStep={1} totalSteps={4} />

      {/* Sound Controller */}
      <SoundController variant="training" />

      {/* Cultural Tooltips */}
      <CulturalTooltips page="skills" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center pt-32 pb-8"
      >
        <h1 className="font-bebas text-4xl md:text-6xl text-white mb-2">
          CAMPO DE TREINAMENTO
        </h1>
        <p className="text-gray-300 text-lg font-medium">
          Mostre suas habilidades através de mini-games interativos
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {gameMode !== 'complete' && (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white text-sm">Progresso</p>
                <p className="text-white text-sm">{currentSkill + 1}/{skillGames.length}</p>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro"
                  animate={{ width: `${((currentSkill + 1) / skillGames.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Current Skill Card */}
            <Card className="bg-black/60 backdrop-blur-md border-white/10 p-8">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`inline-flex p-4 rounded-full bg-gradient-to-br ${currentGame.color} mb-4`}
                >
                  {currentGame.icon}
                </motion.div>
                <h2 className="font-bebas text-3xl text-white mb-2">{currentGame.name}</h2>
                <p className="text-gray-400">{currentGame.description}</p>
              </div>

              <AnimatePresence mode="wait">
                {gameMode === 'intro' ? (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <p className="text-white mb-6">{currentGame.instruction}</p>
                    <Button
                      onClick={() => setGameMode('playing')}
                      className="btn-primary px-8 py-4 text-lg font-bebas tracking-wider"
                    >
                      COMEÇAR TESTE
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="game"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {currentGame.id === 'speed' && (
                      <SpeedTest onComplete={(score) => handleSkillComplete('speed', score)} />
                    )}
                    {currentGame.id === 'strength' && (
                      <StrengthTest onComplete={(score) => handleSkillComplete('strength', score)} />
                    )}
                    {currentGame.id === 'technique' && (
                      <TechniqueTest onComplete={(score) => handleSkillComplete('technique', score)} />
                    )}
                    {currentGame.id === 'stamina' && (
                      <StaminaTest onComplete={(score) => handleSkillComplete('stamina', score)} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Completed Skills */}
            {Object.keys(skills).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-4 gap-4"
              >
                {skillGames.slice(0, currentSkill + (gameMode === 'playing' ? 0 : 1)).map((skill) => (
                  <Card
                    key={skill.id}
                    className="bg-black/40 backdrop-blur-md border-white/10 p-4 text-center"
                  >
                    <div className={`text-2xl mb-1 ${skills[skill.id] >= 80 ? 'text-amarelo-ouro' : 'text-white'}`}>
                      {skill.icon}
                    </div>
                    <p className="text-xs text-gray-400">{skill.name}</p>
                    <p className="font-bebas text-lg text-white">{skills[skill.id] || 0}%</p>
                  </Card>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Complete Screen */}
        {gameMode === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-verde-brasil to-azul-celeste p-12 border-0 shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-6xl mb-6"
              >
                🏆
              </motion.div>
              
              <h2 className="font-bebas text-4xl text-white mb-4">
                AVALIAÇÃO COMPLETA!
              </h2>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-7xl font-bebas text-white mb-4"
              >
                {Math.round(overallScore)}%
              </motion.div>
              
              <p className="text-white/90 text-xl mb-8">
                {overallScore >= 80 ? "Talento de Seleção!" :
                 overallScore >= 60 ? "Futuro promissor!" :
                 overallScore >= 40 ? "Continue treinando!" :
                 "Todo craque começou assim!"}
              </p>

              {/* Skills Summary */}
              <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                {Object.entries(skills).map(([skillId, score]) => {
                  const skill = skillGames.find(s => s.id === skillId);
                  if (!skill) return null;
                  
                  return (
                    <div key={skillId} className="bg-white/10 rounded-lg p-3 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className={`font-bebas text-xl ${score >= 80 ? 'text-amarelo-ouro' : 'text-white'}`}>
                          {score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleContinue}
                className="bg-white text-azul-celeste hover:bg-gray-100 px-12 py-6 text-xl font-bebas tracking-wider rounded-full shadow-2xl"
              >
                ENTRAR NO ESTÁDIO
              </Button>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
}