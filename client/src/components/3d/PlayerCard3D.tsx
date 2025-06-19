import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
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
  name = "JOGADOR",
  position = "ATACANTE",
  number = 10,
  city = "CIDADE",
  state = "UF",
  photo,
  isActive = false,
  onClick
}: PlayerCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      // Gentle floating animation for active card
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const cardColor = isActive ? '#00875F' : '#1a1a1a';
  const accentColor = isActive ? '#FFD700' : '#666666';

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group
        ref={groupRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
      >
        {/* Main card background */}
        <RoundedBox
          args={[3, 4, 0.1]}
          radius={0.1}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={cardColor}
            metalness={0.3}
            roughness={0.4}
            emissive={isActive ? '#00875F' : '#000000'}
            emissiveIntensity={isActive ? 0.1 : 0}
          />
        </RoundedBox>

        {/* Brazilian flag colors accent */}
        <RoundedBox
          args={[3, 0.3, 0.11]}
          radius={0.05}
          position={[0, 1.8, 0.01]}
        >
          <meshStandardMaterial color="#009B3A" />
        </RoundedBox>

        <RoundedBox
          args={[3, 0.15, 0.11]}
          radius={0.05}
          position={[0, 1.55, 0.01]}
        >
          <meshStandardMaterial color="#FEDF00" />
        </RoundedBox>

        <RoundedBox
          args={[3, 0.15, 0.11]}
          radius={0.05}
          position={[0, 1.3, 0.01]}
        >
          <meshStandardMaterial color="#002776" />
        </RoundedBox>

        {/* Player number circle */}
        <mesh position={[1, 1, 0.06]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>

        {/* Player number text */}
        <Text
          position={[1, 1, 0.1]}
          fontSize={0.5}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bebas-neue.woff"
        >
          {number.toString()}
        </Text>

        {/* Player name */}
        <Text
          position={[0, 0.5, 0.06]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bebas-neue.woff"
          maxWidth={2.5}
        >
          {name.toUpperCase()}
        </Text>

        {/* Position */}
        <Text
          position={[0, 0.1, 0.06]}
          fontSize={0.2}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/bebas-neue.woff"
        >
          {position.toUpperCase()}
        </Text>

        {/* Location */}
        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.15}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          {`${city.toUpperCase()} - ${state.toUpperCase()}`}
        </Text>

        {/* Photo placeholder */}
        {!photo && (
          <mesh position={[-0.8, 0.8, 0.06]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        )}

        {/* Active glow effect */}
        {isActive && (
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[3.5, 4.5]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Hover glow effect */}
        {hovered && !isActive && (
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[3.2, 4.2]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.1}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}