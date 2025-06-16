import { cn } from "@/lib/utils";

interface ProgressEnhancedProps {
  value: number;
  label: string;
  comparison?: {
    value: number;
    label: string;
  };
  average?: number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
}

export default function ProgressEnhanced({
  value,
  label,
  comparison,
  average,
  trend,
  className
}: ProgressEnhancedProps) {
  // Determine color based on value
  const getGradientClass = (val: number) => {
    if (val >= 85) return "from-green-500 to-green-600";
    if (val >= 70) return "from-yellow-500 to-green-500";
    if (val >= 50) return "from-yellow-400 to-yellow-500";
    return "from-orange-400 to-yellow-400";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{value}%</span>
          {trend && (
            <span className={cn(
              "text-xs font-medium flex items-center gap-0.5",
              trend.direction === "up" ? "text-green-600" : "text-red-600"
            )}>
              {trend.direction === "up" ? "↑" : "↓"}
              {trend.value}%
            </span>
          )}
        </div>
      </div>
      
      <div className="relative">
        {/* Background */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          {/* Average marker */}
          {average && (
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-gray-600 z-10"
              style={{ left: `${average}%` }}
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                Média
              </div>
            </div>
          )}
          
          {/* Main progress bar */}
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out relative overflow-hidden",
              getGradientClass(value)
            )}
            style={{ width: `${value}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            
            {/* Value label inside bar */}
            {value > 20 && (
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white">
                {value}%
              </span>
            )}
          </div>
        </div>
        
        {/* Comparison bar */}
        {comparison && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 bottom-0 w-1 bg-gray-400 opacity-50"
              style={{ left: `${comparison.value}%` }}
            >
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                {comparison.label}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Additional info */}
      {(comparison || trend) && (
        <div className="flex justify-between text-xs text-gray-600">
          {comparison && (
            <span>
              vs {comparison.label}: {comparison.value > value ? "-" : "+"}{Math.abs(comparison.value - value)}%
            </span>
          )}
          {trend && (
            <span className={cn(
              "ml-auto",
              trend.direction === "up" ? "text-green-600" : "text-red-600"
            )}>
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}% vs mês passado
            </span>
          )}
        </div>
      )}
    </div>
  );
}