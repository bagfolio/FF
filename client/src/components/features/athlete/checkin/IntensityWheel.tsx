import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface IntensityWheelProps {
  value: number;
  onChange: (minutes: number) => void;
}

export function IntensityWheel({ value, onChange }: IntensityWheelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState((value / 120) * 360); // Convert minutes to angle
  const wheelRef = useRef<SVGSVGElement>(null);
  const centerX = 100;
  const centerY = 100;
  
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Calculate offset for the arc (starts at top, goes clockwise)
  const strokeDashoffset = circumference - (angle / 360) * circumference;
  const minutes = Math.round((angle / 360) * 120); // 0-120 minutes range

  useEffect(() => {
    onChange(minutes);
  }, [minutes, onChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateAngle(e);
    // Capture pointer for smooth dragging
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !wheelRef.current) return;
    e.preventDefault();
    updateAngle(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    // Release pointer capture
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const updateAngle = (e: React.PointerEvent) => {
    if (!wheelRef.current) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const svgCenterX = rect.left + rect.width / 2;
    const svgCenterY = rect.top + rect.height / 2;
    
    const x = e.clientX - svgCenterX;
    const y = e.clientY - svgCenterY;
    
    // Calculate angle from top (12 o'clock position)
    let newAngle = Math.atan2(x, -y) * (180 / Math.PI);
    if (newAngle < 0) newAngle += 360;
    
    // Constrain to 0-360 degrees
    setAngle(Math.max(0, Math.min(360, newAngle)));
  };

  // Quick preset buttons
  const presets = [15, 30, 60, 90];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bebas text-white mb-2">
          Quanto tempo você treinou?
        </h2>
        <p className="text-white/60 text-lg">
          Arraste o círculo ou use os botões rápidos
        </p>
      </motion.div>

      <div className="flex flex-col items-center">
        {/* Intensity Wheel */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <svg
            ref={wheelRef}
            className="w-80 h-80 cursor-pointer select-none touch-none"
            viewBox="0 0 200 200"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none' }}
          >
            <defs>
              <linearGradient id="intensityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#009C3B" />
                <stop offset="50%" stopColor="#FFDF00" />
                <stop offset="100%" stopColor="#009C3B" />
              </linearGradient>
            </defs>

            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="20"
            />
            
            {/* Invisible larger hit area for easier interaction */}
            <circle
              cx="100"
              cy="100"
              r={radius + 10}
              fill="none"
              stroke="transparent"
              strokeWidth="40"
              className="cursor-pointer"
            />

            {/* Progress arc */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="url(#intensityGradient)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 100 100)"
              className="drop-shadow-glow"
              animate={{
                strokeDashoffset,
              }}
              transition={{ type: "spring", stiffness: 100 }}
            />

            {/* Draggable handle - position at the end of the arc */}
            <motion.circle
              cx={centerX + radius * Math.sin(angle * Math.PI / 180)}
              cy={centerY - radius * Math.cos(angle * Math.PI / 180)}
              r="12"
              fill="white"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              className="drop-shadow-lg cursor-pointer"
              whileHover={{ scale: 1.2 }}
              animate={{
                scale: isDragging ? 1.3 : 1,
              }}
            />
            
            {/* Add a subtle guide circle at low opacity */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          </svg>

          {/* Center display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <motion.div
                key={minutes}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl font-bold text-white mb-2"
              >
                {minutes}
              </motion.div>
              <div className="text-white/60 text-lg flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                minutos
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick presets */}
        <div className="flex gap-3">
          {presets.map((preset) => (
            <motion.button
              key={preset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAngle((preset / 120) * 360)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${minutes === preset 
                  ? 'bg-gradient-to-r from-verde-brasil to-amarelo-ouro text-white' 
                  : 'glass-morph text-white/60 hover:text-white border border-white/10 hover:border-white/20'
                }
              `}
            >
              {preset}min
            </motion.button>
          ))}
        </div>

        {/* Visual feedback for percentage and time */}
        <div className="mt-6 space-y-2">
          {minutes > 0 && (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/40 text-sm text-center"
              >
                {Math.round((angle / 360) * 100)}% do treino máximo
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/60 text-center"
              >
                {minutes < 30 && "Cada minuto conta! 💪"}
                {minutes >= 30 && minutes < 60 && "Ótimo treino! Continue assim! 🔥"}
                {minutes >= 60 && minutes < 90 && "Impressionante dedicação! 🌟"}
                {minutes >= 90 && "Você é uma máquina! Lembre-se de descansar também! 🏆"}
              </motion.p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}