import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReflectionInputProps {
  value: string;
  onChange: (text: string) => void;
}

const prompts = [
  "Um momento marcante do treino hoje foi...",
  "O que aprendi sobre mim mesmo foi...",
  "Me senti mais forte quando...",
  "Meu próximo objetivo é...",
  "Hoje eu superei...",
  "Algo que quero melhorar é...",
  "Estou orgulhoso de...",
  "O que me motivou hoje foi..."
];

export function ReflectionInput({ value, onChange }: ReflectionInputProps) {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const maxLength = 200;
  const charactersLeft = maxLength - value.length;

  // Rotate through prompts
  useEffect(() => {
    if (!isTyping && value.length === 0) {
      const interval = setInterval(() => {
        setCurrentPrompt((prev) => (prev + 1) % prompts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isTyping, value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bebas text-white mb-2">
          Reflexão do Dia
        </h2>
        <p className="text-white/60 text-lg">
          Compartilhe um pensamento sobre seu treino (opcional)
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Glass morphic container */}
        <div className="glass-morph rounded-2xl p-8 border border-white/10 backdrop-blur-md">
          {/* Animated prompt */}
          <AnimatePresence mode="wait">
            {value.length === 0 && !isTyping && (
              <motion.div
                key={currentPrompt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute top-8 left-8 right-8 pointer-events-none"
              >
                <p className="text-white/40 text-lg italic">
                  {prompts[currentPrompt]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <textarea
            value={value}
            onChange={handleChange}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            className={cn(
              "w-full h-40 bg-transparent text-white",
              "placeholder-white/40 border-0 outline-none resize-none",
              "text-lg leading-relaxed"
            )}
            placeholder={isTyping ? "Escreva seus pensamentos..." : ""}
          />

          {/* Bottom section */}
          <div className="mt-6 space-y-4">
            {/* Character count visualization */}
            <div className="relative">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full transition-colors",
                    charactersLeft > 50 
                      ? "bg-gradient-to-r from-verde-brasil to-amarelo-ouro"
                      : charactersLeft > 20
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-orange-500 to-red-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${(value.length / maxLength) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              
              {/* Character count */}
              <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <PenLine className="w-4 h-4" />
                  <span>Reflexão pessoal</span>
                </div>
                <span className={cn(
                  "text-sm transition-colors",
                  charactersLeft > 50 ? "text-white/40" : 
                  charactersLeft > 20 ? "text-yellow-400" : "text-red-400"
                )}>
                  {charactersLeft} caracteres
                </span>
              </div>
            </div>

            {/* Writing encouragement */}
            {value.length > 0 && value.length < 30 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-white/40 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Continue escrevendo, cada palavra importa...</span>
              </motion.div>
            )}

            {value.length >= 30 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-verde-brasil text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ótima reflexão! Isso ajudará em sua jornada.</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Skip option */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-white/40 text-sm"
        >
          Você pode pular esta etapa se preferir
        </motion.p>
      </motion.div>
    </div>
  );
}