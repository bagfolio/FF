import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerCard3DProps {
  name?: string;
  position?: string;
  number?: number;
  city?: string;
  state?: string;
  photo?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function PlayerCard3D({
  name = "SEU NOME",
  position = "POSIÇÃO",
  number = 10,
  city = "CIDADE",
  state = "UF",
  photo,
  isActive = false,
  onClick
}: PlayerCard3DProps) {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (cardRef.current) {
      // Gentle floating animation
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Rotation on hover
      if (hovered) {
        cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
      } else {
        cardRef.current.rotation.y *= 0.9; // Smooth return to center
      }
    }
  });

  const cardWidth = 3;
  const cardHeight = 4;
  const cardDepth = 0.2;

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group 
        ref={cardRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Card base with gradient effect */}
        <RoundedBox
          args={[cardWidth, cardHeight, cardDepth]}
          radius={0.1}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1}
            reflectivity={1}
          />
        </RoundedBox>

        {/* Brazilian flag pattern overlay */}
        <mesh position={[0, 0, cardDepth / 2 + 0.01]}>
          <planeGeometry args={[cardWidth * 0.95, cardHeight * 0.95]} />
          <meshStandardMaterial transparent opacity={0.3}>
            <canvasTexture
              attach="map"
              image={(() => {
                const canvas = document.createElement('canvas');
                canvas.width = 300;
                canvas.height = 400;
                const ctx = canvas.getContext('2d')!;
                
                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, 300, 400);
                gradient.addColorStop(0, '#009B3A');
                gradient.addColorStop(0.5, '#FEDF00');
                gradient.addColorStop(1, '#002776');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 300, 400);
                
                return canvas;
              })()}
            />
          </meshStandardMaterial>
        </mesh>

        {/* Player photo placeholder */}
        <RoundedBox
          args={[cardWidth * 0.6, cardWidth * 0.6, 0.05]}
          position={[0, cardHeight * 0.2, cardDepth / 2 + 0.02]}
          radius={0.05}
        >
          <meshStandardMaterial 
            color={photo ? "#FFFFFF" : "#333333"}
            metalness={0.1}
            roughness={0.8}
          />
        </RoundedBox>

        {/* Player name */}
        <Text
          position={[0, -cardHeight * 0.1, cardDepth / 2 + 0.03]}
          fontSize={0.25}
          color="#002776"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bebas-neue-v9-latin-regular.woff"
        >
          {name}
        </Text>

        {/* Position and number */}
        <Text
          position={[-cardWidth * 0.3, -cardHeight * 0.25, cardDepth / 2 + 0.03]}
          fontSize={0.15}
          color="#009B3A"
          anchorX="center"
          anchorY="middle"
        >
          {position}
        </Text>

        <Text
          position={[cardWidth * 0.3, -cardHeight * 0.25, cardDepth / 2 + 0.03]}
          fontSize={0.3}
          color="#FEDF00"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bebas-neue-v9-latin-regular.woff"
        >
          #{number}
        </Text>

        {/* City and State */}
        <Text
          position={[0, -cardHeight * 0.35, cardDepth / 2 + 0.03]}
          fontSize={0.12}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          {city}, {state}
        </Text>

        {/* Sparkle effect when active */}
        {isActive && (
          <Sparkles
            count={30}
            scale={[4, 5, 0.5]}
            size={2}
            speed={0.5}
            color="#FFD700"
          />
        )}

        {/* Holographic shine effect */}
        <mesh position={[0, 0, cardDepth / 2 + 0.04]}>
          <planeGeometry args={[cardWidth, cardHeight]} />
          <meshBasicMaterial
            transparent
            opacity={0.1}
            color="#FFFFFF"
            blending={THREE.AdditiveBlending}
          >
            <shaderMaterial
              attach="material"
              transparent
              uniforms={{
                time: { value: 0 }
              }}
              vertexShader={`
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                uniform float time;
                varying vec2 vUv;
                void main() {
                  float shine = sin(vUv.y * 10.0 + time * 3.0) * 0.5 + 0.5;
                  gl_FragColor = vec4(1.0, 1.0, 1.0, shine * 0.2);
                }
              `}
            />
          </meshBasicMaterial>
        </mesh>
      </group>
    </Float>
  );
}