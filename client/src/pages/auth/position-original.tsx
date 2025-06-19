import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { positions } from "@/lib/brazilianData";

interface PositionData {
  id: string;
  name: keyof typeof positions;
  x: number;
  y: number;
  number: number;
}

// 4-3-3 Formation positions with realistic coordinates
const fieldPositions: PositionData[] = [
  { id: "gk", name: "Goleiro", x: 50, y: 85, number: 1 },
  { id: "lb", name: "Lateral Esquerdo", x: 15, y: 65, number: 3 },
  { id: "cb1", name: "Zagueiro", x: 35, y: 70, number: 4 },
  { id: "cb2", name: "Zagueiro", x: 65, y: 70, number: 5 },
  { id: "rb", name: "Lateral Direito", x: 85, y: 65, number: 2 },
  { id: "cm1", name: "Volante", x: 30, y: 45, number: 6 },
  { id: "cm2", name: "Meio-campo", x: 50, y: 40, number: 8 },
  { id: "cm3", name: "Meia-atacante", x: 70, y: 45, number: 10 },
  { id: "lw", name: "Ponta Esquerda", x: 20, y: 20, number: 11 },
  { id: "st", name: "Centroavante", x: 50, y: 15, number: 9 },
  { id: "rw", name: "Ponta Direita", x: 80, y: 20, number: 7 },
];

export default function AuthPosition() {
  const [, setLocation] = useLocation();
  const [selectedPosition, setSelectedPosition] = useState<PositionData | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);

  const handlePositionSelect = (position: PositionData) => {
    setSelectedPosition(position);
    // Save to localStorage for later steps
    localStorage.setItem("authPosition", JSON.stringify(position));
  };

  const handleContinue = () => {
    if (selectedPosition) {
      setLocation("/auth/profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cinza-claro to-white relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center pt-8 pb-4"
      >
        <h1 className="font-bebas text-4xl md:text-6xl azul-celeste mb-2">
          ESCOLHA SUA POSIÇÃO
        </h1>
        <p className="text-cinza-medio text-lg font-medium">
          Onde você manda bem em campo, craque?
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        </div>
      </motion.div>

      {/* Football Field */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative mx-auto max-w-4xl px-4"
      >
        <div className="relative bg-gradient-to-b from-green-400 to-green-500 rounded-lg shadow-2xl overflow-hidden"
             style={{ aspectRatio: "4/6" }}>
          
          {/* Field Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600">
            {/* Outer boundary */}
            <rect x="20" y="20" width="360" height="560" 
                  fill="none" stroke="white" strokeWidth="3" />
            
            {/* Center line */}
            <line x1="20" y1="300" x2="380" y2="300" 
                  stroke="white" strokeWidth="2" />
            
            {/* Center circle */}
            <circle cx="200" cy="300" r="50" 
                    fill="none" stroke="white" strokeWidth="2" />
            
            {/* Goal areas */}
            <rect x="20" y="20" width="360" height="80" 
                  fill="none" stroke="white" strokeWidth="2" />
            <rect x="20" y="500" width="360" height="80" 
                  fill="none" stroke="white" strokeWidth="2" />
            
            {/* Penalty areas */}
            <rect x="80" y="20" width="240" height="120" 
                  fill="none" stroke="white" strokeWidth="2" />
            <rect x="80" y="460" width="240" height="120" 
                  fill="none" stroke="white" strokeWidth="2" />
          </svg>

          {/* Grass Texture Overlay */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' opacity='0.1'%3E%3Cpath d='M0 0l1 50-1 50zM10 0l1 50-1 50zM20 0l1 50-1 50zM30 0l1 50-1 50z'/%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '20px 20px'
               }} />

          {/* Position Jerseys */}
          {fieldPositions.map((position) => {
            const isSelected = selectedPosition?.id === position.id;
            const isHovered = hoveredPosition === position.id;
            const positionColor = positions[position.name]?.color || "bg-blue-600";
            
            return (
              <motion.button
                key={position.id}
                onClick={() => handlePositionSelect(position)}
                onMouseEnter={() => setHoveredPosition(position.id)}
                onMouseLeave={() => setHoveredPosition(null)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: isSelected ? 1.3 : isHovered ? 1.2 : 1,
                  rotate: isSelected ? [0, 360] : 0,
                  y: isSelected ? [-10, 0] : 0,
                }}
                transition={{
                  scale: { duration: 0.3 },
                  rotate: { duration: 0.8, ease: "easeOut" },
                  y: { duration: 0.5, repeat: isSelected ? Infinity : 0, repeatType: "reverse" }
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Jersey */}
                <div className={`relative w-16 h-16 ${positionColor} rounded-lg shadow-lg border-2 
                                ${isSelected ? 'border-amarelo-ouro border-4' : 'border-white'} 
                                transition-all duration-300`}>
                  
                  {/* Jersey Number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bebas text-xl font-bold">
                      {position.number}
                    </span>
                  </div>

                  {/* Selection Glow */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-lg border-4 border-amarelo-ouro"
                      animate={{ boxShadow: [
                        "0 0 20px rgba(255, 215, 0, 0.6)",
                        "0 0 40px rgba(255, 215, 0, 0.8)",
                        "0 0 20px rgba(255, 215, 0, 0.6)"
                      ]}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Particle Effect for Selection */}
                  {isSelected && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-amarelo-ouro rounded-full"
                          style={{
                            left: "50%",
                            top: "50%",
                          }}
                          animate={{
                            x: [0, (Math.cos(i * 60 * Math.PI / 180) * 30)],
                            y: [0, (Math.sin(i * 60 * Math.PI / 180) * 30)],
                            opacity: [1, 0],
                            scale: [1, 0.5]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Position Label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isHovered || isSelected ? 1 : 0,
                    y: isHovered || isSelected ? 0 : 10
                  }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                           bg-black/80 text-white px-2 py-1 rounded text-xs font-medium 
                           whitespace-nowrap pointer-events-none"
                >
                  {position.name}
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Selection Display */}
      {selectedPosition && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <p className="text-xl font-medium text-azul-celeste">
            Você escolheu: <span className="font-bebas text-2xl">{selectedPosition.name} #{selectedPosition.number}</span>
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedPosition ? 1 : 0.5 }}
        className="text-center mt-8 pb-8"
      >
        <Button
          onClick={handleContinue}
          disabled={!selectedPosition}
          className="btn-primary px-8 py-3 text-lg font-bebas tracking-wider"
        >
          CONTINUAR JORNADA
        </Button>
      </motion.div>
    </div>
  );
}