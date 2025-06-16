import { useEffect, useState } from "react";

interface StatCounterProps {
  target: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export default function StatCounter({ target, suffix = "", className = "", duration = 2000 }: StatCounterProps) {
  const [current, setCurrent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const increment = target / (duration / 16); // 60fps
    let currentValue = 0;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        currentValue = target;
        clearInterval(timer);
      }
      setCurrent(Math.floor(currentValue));
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, hasStarted]);

  useEffect(() => {
    // Use Intersection Observer to start animation when element comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`stat-counter-${target}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [target, hasStarted]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <span 
      id={`stat-counter-${target}`}
      className={className}
    >
      {formatNumber(current)}{suffix}
    </span>
  );
}
