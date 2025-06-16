// ARQUIVO ATUALIZADO: client/src/components/ui/profile-completion-ring.tsx

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile'; // Usaremos um hook para detectar mobile

interface ProfileCompletionRingProps {
  percentage: number;
  size?: number; // Tamanho para desktop
  mdSize?: number; // Tamanho para telas maiores, opcional (usará 'size' se não fornecido)
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function ProfileCompletionRing({
  percentage,
  size = 100,
  mdSize,
  strokeWidth = 8,
  className,
  children
}: ProfileCompletionRingProps) {
  const isMobile = useIsMobile();
  const currentSize = isMobile ? size : (mdSize || size);

  const progressRef = useRef<SVGCircleElement>(null);
  const radius = (currentSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    if (progressRef.current) {
      const offset = circumference - (percentage / 100) * circumference;
      progressRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [percentage, circumference]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: currentSize, height: currentSize }}>
      <svg
        width={currentSize}
        height={currentSize}
        className="transform -rotate-90"
      >
        <circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/20"
        />
        <circle
          ref={progressRef}
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#009C3B" />
            <stop offset="50%" stopColor="#FFDF00" />
            <stop offset="100%" stopColor="#002776" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}