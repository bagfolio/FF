import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ProfileCompletionRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function ProfileCompletionRing({
  percentage,
  size = 144,
  strokeWidth = 8,
  className,
  children
}: ProfileCompletionRingProps) {
  const progressRef = useRef<SVGCircleElement>(null);
  const [previousPercentage, setPreviousPercentage] = useState(percentage);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  useEffect(() => {
    if (progressRef.current) {
      const offset = circumference - (percentage / 100) * circumference;
      progressRef.current.style.strokeDashoffset = offset.toString();
      
      // Celebrate milestones
      if (percentage > previousPercentage) {
        if (percentage === 100 || percentage === 75 || percentage === 50) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#009C3B', '#FFDF00', '#002776']
          });
        }
      }
      setPreviousPercentage(percentage);
    }
  }, [percentage, circumference, previousPercentage]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          ref={progressRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Pulse effect for high completion */}
        {percentage >= 75 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            className="opacity-30 animate-pulse"
          />
        )}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#009C3B" />
            <stop offset="50%" stopColor="#FFDF00" />
            <stop offset="100%" stopColor="#002776" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}