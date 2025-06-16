import { cn } from "@/lib/utils";
import { Medal, Star, Crown, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VerificationBadgeProps {
  level: "bronze" | "silver" | "gold" | "platinum";
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const levelConfig = {
  bronze: {
    label: "Bronze",
    icon: Medal,
    className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0",
  },
  silver: {
    label: "Prata",
    icon: Star,
    className: "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0",
  },
  gold: {
    label: "Ouro",
    icon: Crown,
    className: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0",
  },
  platinum: {
    label: "Platina",
    icon: Trophy,
    className: "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0",
  },
};

export default function VerificationBadge({ 
  level, 
  className,
  showIcon = true,
  size = "md"
}: VerificationBadgeProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <Badge 
      variant="default"
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(iconSizes[size])} />}
      {config.label}
    </Badge>
  );
}