import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { positions } from "@/lib/brazilianData";
import { Info } from "lucide-react";

interface PositionData {
  id: string;
  name: keyof typeof positions;
  x: number;
  y: number;
  number: number;
  legend?: string;
  description?: string;
}

// 4-3-3 Formation with Brazilian legends
const fieldPositions: PositionData[] = [
  { id: "gk", name: "Goleiro", x: 50, y: 82, number: 1, legend: "Taffarel", description: "O guardião da meta" },
  { id: "lb", name: "Lateral Esquerdo", x: 25, y: 65, number: 6, legend: "Roberto Carlos", description: "Velocidade e potência" },
  { id: "cb1", name: "Zagueiro", x: 37, y: 73, number: 4, legend: "Aldair", description: "Força e liderança" },
  { id: "cb2", name: "Zagueiro", x: 63, y: 73, number: 3, legend: "Lúcio", description: "Técnica e visão" },
  { id: "rb", name: "Lateral Direito", x: 75, y: 65, number: 2, legend: "Cafú", description: "Resistência infinita" },
  { id: "cm1", name: "Volante", x: 32, y: 50, number: 5, legend: "Dunga", description: "O cérebro do time" },
  { id: "cm2", name: "Meio-campo", x: 50, y: 45, number: 8, legend: "Kaká", description: "Elegância e precisão" },
  { id: "cm3", name: "Meia-atacante", x: 68, y: 50, number: 10, legend: "Pelé", description: "O Rei do Futebol" },
  { id: "lw", name: "Ponta Esquerda", x: 25, y: 28, number: 11, legend: "Neymar", description: "Dribles e magia" },
  { id: "st", name: "Centroavante", x: 50, y: 20, number: 9, legend: "Ronaldo", description: "O Fenômeno" },
  { id: "rw", name: "Ponta Direita", x: 75, y: 28, number: 7, legend: "Garrincha", description: "Alegria do povo" },
];

export default function AuthPosition() {
  const [, setLocation] = useLocation();
  const [selectedPosition, setSelectedPosition] = useState<PositionData | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showDebugGrid, setShowDebugGrid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handlePositionSelect = (position: PositionData) => {
    setSelectedPosition(position);
    localStorage.setItem("authPosition", JSON.stringify(position));
  };

  const handleContinue = () => {
    if (selectedPosition) {
      setLocation("/auth/profile");
    }
  };

  // Toggle debug grid with Ctrl+G
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        setShowDebugGrid(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900 relative overflow-hidden">
      {/* Stadium atmosphere background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" opacity="0.03"><circle cx="50" cy="50" r="1" /></g></svg>')}")`,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center pt-8 pb-4"
      >
        <h1 className="font-bebas text-5xl md:text-7xl text-white mb-2 tracking-wider">
          ESCOLHA SUA POSIÇÃO
        </h1>
        <p className="text-white/80 text-xl font-medium">
          Onde você brilha em campo? Escolha como as lendas!
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>
      </motion.div>

      {/* 3D Perspective Football Field */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative mx-auto max-w-6xl px-4 sm:px-8 pb-4"
      >
        <div 
          className="relative mx-auto rounded-lg shadow-2xl overflow-hidden"
          style={{ 
            width: "100%",
            maxWidth: "900px",
            aspectRatio: isMobile ? "1.3" : "1.5"
          }}
        >
          {/* Field Background Container */}
          <div className="absolute inset-0">
            {/* Field with gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-green-500 via-green-600 to-green-700 rounded-lg overflow-hidden"
            >
            {/* Field texture */}
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 9px)`,
              }}
            />
            
            {/* Field lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Outer boundary */}
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
              
              {/* Center line */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.5" opacity="0.8" />
              
              {/* Center circle */}
              <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
              
              {/* Penalty areas */}
              <rect x="10" y="10" width="80" height="18" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
              <rect x="10" y="72" width="80" height="18" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
              
              {/* Goal areas */}
              <rect x="25" y="10" width="50" height="10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
              <rect x="25" y="80" width="50" height="10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
            </svg>
            
            {/* Debug Grid Overlay - Toggle with Ctrl+G */}
            {showDebugGrid && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                {/* Vertical lines at key positions */}
                {[10, 25, 35, 50, 65, 75, 90].map(x => (
                  <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="100" 
                        stroke="red" strokeWidth="0.3" opacity="0.5" strokeDasharray="2,2" />
                ))}
                {/* Horizontal lines at key positions */}
                {[10, 20, 28, 46, 48, 65, 73, 82, 90].map(y => (
                  <line key={`h-${y}`} x1="0" y1={y} x2="100" y2={y} 
                        stroke="blue" strokeWidth="0.3" opacity="0.5" strokeDasharray="2,2" />
                ))}
                {/* Center cross */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="green" strokeWidth="0.5" opacity="0.7" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="green" strokeWidth="0.5" opacity="0.7" />
              </svg>
            )}
            </motion.div>
          </div>

          {/* Position Jerseys Overlay - Not affected by 3D transform */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
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
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 touch-target"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    zIndex: isHovered || isSelected ? 50 : 10
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isSelected ? 1.2 : isHovered ? 1.1 : 1,
                    opacity: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Jersey Shadow */}
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-14 sm:h-3 bg-black/40 rounded-full blur-lg"
                    style={{ bottom: isSelected ? "-12px" : "-8px" }}
                    animate={{
                      scale: isSelected ? 1.2 : isHovered ? 1.1 : 1,
                      opacity: isSelected ? 0.6 : 0.4
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  
                  {/* Jersey */}
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 ${positionColor} rounded-xl shadow-2xl border-2 
                                  ${isSelected ? 'border-amarelo-ouro border-4' : 'border-white/80'} 
                                  transition-all duration-300 overflow-hidden touch-target`}>
                    
                    {/* Jersey stripes effect */}
                    <div className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)`
                      }}
                    />
                    
                    {/* Jersey Number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bebas text-xl sm:text-2xl font-bold drop-shadow-lg">
                        {position.number}
                      </span>
                    </div>
                    
                    {/* Position abbreviation for mobile */}
                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 sm:hidden">
                      <span className="text-xs text-white/80 font-medium bg-black/50 px-1 rounded">
                        {position.id.toUpperCase()}
                      </span>
                    </div>

                    {/* Selection Glow */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          boxShadow: "0 0 30px rgba(255, 215, 0, 0.7)"
                        }}
                      />
                    )}
                  </div>

                  {/* Position Info Tooltip */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 sm:mb-4 
                                 bg-black/90 backdrop-blur-md text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg 
                                 whitespace-nowrap pointer-events-none shadow-xl 
                                 max-w-[200px] sm:max-w-none"
                        style={{ zIndex: 100 }}
                      >
                        <div className="text-center">
                          <p className="font-bebas text-base sm:text-lg tracking-wider text-amarelo-ouro">
                            {position.name}
                          </p>
                          {position.legend && (
                            <p className="text-xs sm:text-sm text-white/80 font-medium">
                              Lenda: {position.legend}
                            </p>
                          )}
                          {position.description && (
                            <p className="text-xs text-white/60 italic mt-1 hidden sm:block">
                              "{position.description}"
                            </p>
                          )}
                        </div>
                        
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 
                                        border-l-transparent border-r-transparent border-t-black/90" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.button>
              );
            })}
          </div>

          {/* Formation info button */}
          <motion.button
            onClick={() => setShowInfo(!showInfo)}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-colors z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Info className="w-5 h-5" />
          </motion.button>

          {/* Formation info panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="absolute top-14 right-4 bg-black/80 backdrop-blur-md text-white p-4 rounded-lg max-w-xs z-50"
              >
                <h3 className="font-bebas text-xl mb-2">Formação 4-3-3</h3>
                <p className="text-sm text-white/80">
                  A formação clássica do futebol brasileiro, usada em todas as conquistas mundiais. 
                  Equilibra defesa sólida com ataque dinâmico.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Selection Display */}
      {selectedPosition && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <div className="bg-black/50 backdrop-blur-md rounded-lg px-6 py-4 inline-block">
            <p className="text-xl font-medium text-white">
              Posição escolhida: 
              <span className="font-bebas text-2xl text-amarelo-ouro ml-2">
                {selectedPosition.name} #{selectedPosition.number}
              </span>
            </p>
            {selectedPosition.legend && (
              <p className="text-sm text-white/70 mt-1">
                Como {selectedPosition.legend}, você vai fazer história!
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedPosition ? 1 : 0.5 }}
        className="text-center mt-8 pb-8"
      >
        <motion.div
          animate={selectedPosition ? {
            scale: 1.02
          } : {}}
          transition={{
            type: "spring",
            stiffness: 200
          }}
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedPosition}
            className="bg-gradient-to-r from-verde-brasil to-amarelo-ouro text-white px-12 py-6 text-2xl font-bebas tracking-wider rounded-full shadow-2xl hover:shadow-verde-brasil/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 border-2 border-white/20 relative overflow-hidden group"
          >
            <span className="relative z-10">CONTINUAR PARA O VESTIÁRIO</span>
            <div className="absolute inset-0 bg-gradient-to-r from-verde-brasil/50 to-amarelo-ouro/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}