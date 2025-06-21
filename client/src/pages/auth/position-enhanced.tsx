import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Float, MeshWobbleMaterial } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { ProgressJourney } from "@/components/features/auth/ProgressJourney";
import SoundController from "@/components/features/auth/SoundController";
import CulturalTooltips from "@/components/features/auth/CulturalTooltips";
import * as THREE from 'three';

interface Position3D {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  number: number;
  color: string;
  legend?: string;
  attributes: {
    speed: number;
    strength: number;
    technique: number;
    vision: number;
  };
}

// 3D positions with Brazilian legends
const positions3D: Position3D[] = [
  { 
    id: "gk", name: "Goleiro", x: 0, y: 0, z: -4, number: 1, color: "#FFD700",
    legend: "Taffarel", attributes: { speed: 3, strength: 4, technique: 3, vision: 5 }
  },
  { 
    id: "lb", name: "Lateral Esquerdo", x: -3, y: 0, z: -2, number: 6, color: "#00FF00",
    legend: "Roberto Carlos", attributes: { speed: 5, strength: 4, technique: 4, vision: 4 }
  },
  { 
    id: "cb1", name: "Zagueiro", x: -1, y: 0, z: -3, number: 4, color: "#0080FF",
    legend: "Lúcio", attributes: { speed: 3, strength: 5, technique: 3, vision: 4 }
  },
  { 
    id: "cb2", name: "Zagueiro", x: 1, y: 0, z: -3, number: 3, color: "#0080FF",
    legend: "Thiago Silva", attributes: { speed: 3, strength: 5, technique: 3, vision: 4 }
  },
  { 
    id: "rb", name: "Lateral Direito", x: 3, y: 0, z: -2, number: 2, color: "#00FF00",
    legend: "Cafú", attributes: { speed: 5, strength: 4, technique: 4, vision: 4 }
  },
  { 
    id: "cdm", name: "Volante", x: 0, y: 0, z: -1, number: 5, color: "#FF8C00",
    legend: "Gilberto Silva", attributes: { speed: 3, strength: 5, technique: 3, vision: 4 }
  },
  { 
    id: "cm1", name: "Meio-campo", x: -2, y: 0, z: 0, number: 8, color: "#FFD700",
    legend: "Kaká", attributes: { speed: 4, strength: 3, technique: 5, vision: 5 }
  },
  { 
    id: "cm2", name: "Meia-atacante", x: 2, y: 0, z: 0, number: 10, color: "#FFD700",
    legend: "Pelé", attributes: { speed: 4, strength: 3, technique: 5, vision: 5 }
  },
  { 
    id: "lw", name: "Ponta Esquerda", x: -3, y: 0, z: 2, number: 11, color: "#FF0000",
    legend: "Neymar", attributes: { speed: 5, strength: 2, technique: 5, vision: 4 }
  },
  { 
    id: "st", name: "Centroavante", x: 0, y: 0, z: 3, number: 9, color: "#FF0000",
    legend: "Ronaldo", attributes: { speed: 4, strength: 4, technique: 5, vision: 4 }
  },
  { 
    id: "rw", name: "Ponta Direita", x: 3, y: 0, z: 2, number: 7, color: "#FF0000",
    legend: "Garrincha", attributes: { speed: 5, strength: 2, technique: 5, vision: 4 }
  }
];

// 3D Player Model
function PlayerModel({ position, isSelected, onSelect }: { 
  position: Position3D; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        position={[position.x, position.y + 0.5, position.z]}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Player body (cylinder) */}
        <mesh ref={meshRef} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
          <MeshWobbleMaterial
            factor={hovered ? 0.4 : 0.1}
            speed={2}
            color={isSelected ? "#FFD700" : position.color}
            emissive={position.color}
            emissiveIntensity={hovered ? 0.4 : 0.2}
          />
        </mesh>

        {/* Player head */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FDB5A6" />
        </mesh>

        {/* Jersey number */}
        <Text
          position={[0, 0, 0.31]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bebas-neue-v9-latin-regular.woff"
        >
          {position.number}
        </Text>

        {/* Position name */}
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {position.name}
        </Text>

        {/* Legend name (on hover) */}
        {hovered && (
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.12}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            {position.legend}
          </Text>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <Sphere args={[0.8, 16, 16]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.3}
              wireframe
            />
          </Sphere>
        )}

        {/* Hover effect */}
        {hovered && !isSelected && (
          <Sphere args={[0.6, 16, 16]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color="white"
              transparent
              opacity={0.2}
              wireframe
            />
          </Sphere>
        )}
      </group>
    </Float>
  );
}

// Tactical Field
function TacticalField() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Field base */}
      <Box args={[8, 0.1, 10]} receiveShadow>
        <meshStandardMaterial color="#2F5E1F" />
      </Box>

      {/* Field lines */}
      <group position={[0, 0.06, 0]}>
        {/* Center line */}
        <Box args={[8, 0.01, 0.1]} position={[0, 0, 0]}>
          <meshBasicMaterial color="white" />
        </Box>

        {/* Center circle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.6, 32]} />
          <meshBasicMaterial color="white" />
        </mesh>

        {/* Penalty areas */}
        <group position={[0, 0, 4]}>
          <Box args={[3, 0.01, 0.1]}><meshBasicMaterial color="white" /></Box>
          <Box args={[0.1, 0.01, 1.5]} position={[-1.5, 0, -0.75]}><meshBasicMaterial color="white" /></Box>
          <Box args={[0.1, 0.01, 1.5]} position={[1.5, 0, -0.75]}><meshBasicMaterial color="white" /></Box>
        </group>

        <group position={[0, 0, -4]}>
          <Box args={[3, 0.01, 0.1]}><meshBasicMaterial color="white" /></Box>
          <Box args={[0.1, 0.01, 1.5]} position={[-1.5, 0, 0.75]}><meshBasicMaterial color="white" /></Box>
          <Box args={[0.1, 0.01, 1.5]} position={[1.5, 0, 0.75]}><meshBasicMaterial color="white" /></Box>
        </group>
      </group>

      {/* Field texture pattern */}
      <group position={[0, 0.07, 0]}>
        {[-3, -1, 1, 3].map((z, i) => (
          <Box key={i} args={[8, 0.001, 1.8]} position={[0, 0, z]}>
            <meshBasicMaterial color="#3A6F2F" transparent opacity={0.3} />
          </Box>
        ))}
      </group>
    </group>
  );
}

export default function AuthPositionEnhanced() {
  const [, setLocation] = useLocation();
  const [selectedPosition, setSelectedPosition] = useState<Position3D | null>(null);
  const [showAttributes, setShowAttributes] = useState(false);

  const handlePositionSelect = (position: Position3D) => {
    setSelectedPosition(position);
    setShowAttributes(true);
    localStorage.setItem("authPosition", JSON.stringify(position));
    
    if (window.soundController) {
      window.soundController.playEffect('click');
    }
  };

  const handleContinue = () => {
    if (selectedPosition) {
      if (window.soundController) {
        window.soundController.playEffect('success');
      }
      setLocation("/auth/profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Progress Journey */}
      <ProgressJourney currentStep={1} totalSteps={4} />

      {/* Sound Controller */}
      <SoundController variant="training" />

      {/* Cultural Tooltips */}
      <CulturalTooltips page="position" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center pt-32 pb-4"
      >
        <h1 className="font-bebas text-4xl md:text-6xl text-white mb-2">
          ESCOLHA SUA POSIÇÃO
        </h1>
        <p className="text-gray-400 text-lg font-medium">
          Clique no jogador para ver as lendas que jogaram nessa posição
        </p>
      </motion.div>

      {/* 3D Tactical Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[500px]"
      >
        <Canvas
          shadows
          camera={{ position: [0, 8, 12], fov: 50 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 20, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />

          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 6}
            maxDistance={20}
            minDistance={8}
          />

          <TacticalField />

          {positions3D.map((position) => (
            <PlayerModel
              key={position.id}
              position={position}
              isSelected={selectedPosition?.id === position.id}
              onSelect={() => handlePositionSelect(position)}
            />
          ))}
        </Canvas>
      </motion.div>

      {/* Position Details Panel */}
      <AnimatePresence>
        {showAttributes && selectedPosition && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-black/90 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-sm"
          >
            <h3 className="font-bebas text-2xl text-white mb-2">
              {selectedPosition.name} #{selectedPosition.number}
            </h3>
            <p className="text-amarelo-ouro mb-4">
              Lenda: {selectedPosition.legend}
            </p>

            {/* Attributes */}
            <div className="space-y-3 mb-6">
              {Object.entries(selectedPosition.attributes).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span className="capitalize">{key === 'vision' ? 'Visão' : key}</span>
                    <span>{value}/5</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 5) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400 italic mb-4">
              "Jogue como {selectedPosition.legend} e faça história!"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedPosition ? 1 : 0.5 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Button
          onClick={handleContinue}
          disabled={!selectedPosition}
          className="btn-primary px-12 py-6 text-xl font-bebas tracking-wider rounded-full shadow-2xl"
        >
          CONTINUAR PARA O VESTIÁRIO
        </Button>
      </motion.div>

      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
    </div>
  );
}