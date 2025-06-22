import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface BrazilianStadiumSceneProps {
  children?: React.ReactNode;
  variant?: 'entrance' | 'locker' | 'field' | 'tunnel';
  intensity?: number;
}

// Stadium lights component with error handling
function StadiumLights({ intensity = 1 }: { intensity?: number }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  
  useFrame((state) => {
    try {
      if (lightRef.current) {
        // Subtle light animation for stadium atmosphere
        lightRef.current.intensity = intensity + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    } catch (error) {
      // Silently handle WebGL context errors
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
        shadow-mapSize={[1024, 1024]}
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

// Animated Brazilian flag with error handling
function BrazilianFlag() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [flagTexture, setFlagTexture] = useState<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 250;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
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
        
        setFlagTexture(canvas);
      }
    } catch (error) {
    }
  }, []);
  
  useFrame((state) => {
    try {
      if (meshRef.current) {
        // Wave animation
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      }
    } catch (error) {
    }
  });

  if (!flagTexture) return null;

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 5, -10]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial>
          <canvasTexture attach="map" image={flagTexture} />
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

// Safer atmosphere particles with reduced complexity
function AtmosphereParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  
  useFrame((state) => {
    try {
      if (particlesRef.current) {
        particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      }
    } catch (error) {
    }
  });

  useEffect(() => {
    try {
      const particleCount = 300; // Reduced for better performance and stability
      const positionsArray = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        positionsArray[i * 3] = (Math.random() - 0.5) * 40;
        positionsArray[i * 3 + 1] = Math.random() * 15;
        positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }
      
      setPositions(positionsArray);
    } catch (error) {
    }
  }, []);

  if (!positions) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#FFD700"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Error boundary wrapper for 3D components
function Safe3DWrapper({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('WebGL') || event.message.includes('THREE')) {
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-green-800 to-yellow-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🏟️</div>
          <div className="text-xl font-bebas">ESTÁDIO BRASILEIRO</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function BrazilianStadiumScene({ 
  children, 
  variant = 'entrance',
  intensity = 1 
}: BrazilianStadiumSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Safe3DWrapper>
        <Canvas
          shadows
          camera={{ position: [0, 5, 15], fov: 60 }}
          className="w-full h-full"
          onCreated={({ gl }) => {
            // Configure WebGL for better stability
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.setClearColor('#000033');
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
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
            {variant !== 'field' && (
              <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade />
            )}
            
            {/* Fog for atmosphere */}
            <fog attach="fog" args={['#000033', 10, 50]} />
            
            {/* Children components */}
            {children}
          </Suspense>
        </Canvas>
      </Safe3DWrapper>
    </div>
  );
}