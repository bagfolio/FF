import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PerformanceRadarProps {
  data: {
    label: string;
    value: number; // 0-100
    color?: string;
  }[];
  className?: string;
  size?: number;
  showLabels?: boolean;
  animated?: boolean;
}

export default function PerformanceRadar({ 
  data, 
  className,
  size = 300,
  showLabels = true,
  animated = true
}: PerformanceRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for retina displays
    const scale = window.devicePixelRatio || 1;
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    const angleStep = (Math.PI * 2) / data.length;

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Update progress
      if (animated && progressRef.current < 1) {
        progressRef.current = Math.min(progressRef.current + 0.02, 1);
        animationRef.current = requestAnimationFrame(animate);
      }

      const progress = animated ? progressRef.current : 1;

      // Detect dark mode
      const isDarkMode = document.documentElement.classList.contains('dark') || 
                        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Theme-aware colors
      const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb';
      const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#374151';
      const labelBgColor = isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)';
      const primaryColor = '#009C3B'; // Verde Brasil
      const primaryColorAlpha = isDarkMode ? 'rgba(0, 156, 59, 0.3)' : 'rgba(0, 156, 59, 0.2)';
      
      // Draw grid circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        
        for (let j = 0; j < data.length; j++) {
          const angle = j * angleStep - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius * (i / 5);
          const y = centerY + Math.sin(angle) * radius * (i / 5);
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.stroke();
      }

      // Draw lines from center
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < data.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw data polygon
      ctx.beginPath();
      ctx.fillStyle = primaryColorAlpha;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;

      for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[i].value * progress;
        const r = radius * (value / 100);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw points
      for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[i].value * progress;
        const r = radius * (value / 100);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();
        ctx.strokeStyle = isDarkMode ? 'black' : 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw labels
      if (showLabels) {
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < data.length; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 30;
          const x = centerX + Math.cos(angle) * labelRadius;
          const y = centerY + Math.sin(angle) * labelRadius;
          
          // Background for better readability
          const metrics = ctx.measureText(data[i].label);
          const padding = 4;
          
          ctx.fillStyle = labelBgColor;
          ctx.fillRect(
            x - metrics.width / 2 - padding,
            y - 10,
            metrics.width + padding * 2,
            20
          );
          
          ctx.fillStyle = textColor;
          ctx.fillText(data[i].label, x, y);
          
          // Value
          ctx.font = '12px Oswald, sans-serif';
          ctx.fillStyle = primaryColor;
          ctx.fillText(`${Math.round(data[i].value * progress)}%`, x, y + 15);
        }
      }
    };

    // Start animation
    if (animated) {
      progressRef.current = 0;
      animate();
    } else {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, size, showLabels, animated]);

  return (
    <div className={cn("relative", className)}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ maxWidth: size, maxHeight: size }}
      />
    </div>
  );
}