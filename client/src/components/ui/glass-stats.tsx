import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface GlassStatsProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  variant?: "default" | "green" | "yellow" | "blue" | "purple" | "orange" | "pink";
  className?: string;
}

const variantStyles = {
  default: "glass-morph",
  green: "glass-morph-green",
  yellow: "glass-morph-yellow",
  blue: "glass-morph-blue",
  purple: "bg-purple-500/10 backdrop-blur-xl border-purple-500/20",
  orange: "bg-orange-500/10 backdrop-blur-xl border-orange-500/20",
  pink: "bg-pink-500/10 backdrop-blur-xl border-pink-500/20"
};

const iconColors = {
  default: "text-white/60",
  green: "text-green-400",
  yellow: "text-yellow-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  orange: "text-orange-400",
  pink: "text-pink-400"
};

export function GlassStats({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className
}: GlassStatsProps) {
  const TrendIcon = trend?.direction === "up" ? TrendingUp : trend?.direction === "down" ? TrendingDown : Minus;
  const trendColor = trend?.direction === "up" ? "text-green-400" : trend?.direction === "down" ? "text-red-400" : "text-white/40";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:border-white/20",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-white/40">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn("w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center", iconColors[variant])}>
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className={cn("flex items-center gap-1 mt-3 text-sm", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span>{trend.value > 0 ? "+" : ""}{trend.value}%</span>
        </div>
      )}
    </div>
  );
}

interface GlassStatsGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function GlassStatsGrid({ children, columns = 3, className }: GlassStatsGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}