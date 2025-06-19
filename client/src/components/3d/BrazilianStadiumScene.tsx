import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface BrazilianStadiumSceneProps {
  children?: React.ReactNode;
  variant?: 'entrance' | 'locker' | 'field' | 'tunnel';
  intensity?: number;
}

// Stadium lights component
function StadiumLights({ intensity = 1 }: { intensity?: number }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Subtle light animation for stadium atmosphere
      lightRef.current.intensity = intensity + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight
        ref={lightRef}
        position={[10, 20, 5]}
        angle={0.3}
        penumbra={1}
        intensity={intensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#FFD700"
      />
      <spotLight
        position={[-10, 20, 5]}
        angle={0.3}
        penumbra={1}
        intensity={intensity * 0.8}
        castShadow
        color="#00FF00"
      />
      <spotLight
        position={[0, 20, -10]}
        angle={0.5}
        penumbra={1}
        intensity={intensity * 0.6}
        color="#1E40AF"
      />
    </>
  );
}

// Animated Brazilian flag
function BrazilianFlag() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Wave animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 5, -10]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial>
          <canvasTexture
            attach="map"
            image={(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 400;
              canvas.height = 250;
              const ctx = canvas.getContext('2d')!;
              
              // Green background
              ctx.fillStyle = '#009B3A';
              ctx.fillRect(0, 0, 400, 250);
              
              // Yellow diamond
              ctx.fillStyle = '#FEDF00';
              ctx.beginPath();
              ctx.moveTo(200, 30);
              ctx.lineTo(370, 125);
              ctx.lineTo(200, 220);
              ctx.lineTo(30, 125);
              ctx.closePath();
              ctx.fill();
              
              // Blue circle
              ctx.fillStyle = '#002776';
              ctx.beginPath();
              ctx.arc(200, 125, 60, 0, Math.PI * 2);
              ctx.fill();
              
              return canvas;
            })()}
          />
        </meshStandardMaterial>
      </mesh>
    </Float>
  );
}

// Stadium ground/field
function StadiumGround({ variant }: { variant: string }) {
  const groundColor = variant === 'field' ? '#2F5E1F' : '#333333';
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={groundColor} roughness={0.8} />
    </mesh>
  );
}

// Animated particles for atmosphere
function AtmosphereParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#FFD700"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function BrazilianStadiumScene({ 
  children, 
  variant = 'entrance',
  intensity = 1 
}: BrazilianStadiumSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 60 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 15]} />
          
          {/* Lighting setup */}
          <StadiumLights intensity={intensity} />
          
          {/* Environment */}
          <Environment preset={variant === 'field' ? 'sunset' : 'night'} />
          
          {/* Stadium elements */}
          <StadiumGround variant={variant} />
          <BrazilianFlag />
          <AtmosphereParticles />
          
          {/* Stars for night scenes */}
          {variant !== 'field' && <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />}
          
          {/* Fog for atmosphere */}
          <fog attach="fog" args={['#000033', 10, 50]} />
          
          {/* Children components */}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}