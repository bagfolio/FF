import { Users, Eye, Star, Clock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SocialProofCounterProps {
  count: number;
  label: string;
  icon?: "users" | "eye" | "star" | "clock";
  variant?: "default" | "urgent" | "success";
}

export function SocialProofCounter({ count, label, icon = "users", variant = "default" }: SocialProofCounterProps) {
  const IconComponent = {
    users: Users,
    eye: Eye, 
    star: Star,
    clock: Clock
  }[icon];

  const variants = {
    default: "social-proof-counter",
    urgent: "urgency-indicator",
    success: "bg-success-validation text-white"
  };

  return (
    <div className={variants[variant]}>
      <IconComponent className="w-3 h-3" />
      <span className="font-semibold">{count}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

interface VerificationBadgeProps {
  level: "verified" | "elite" | "trusted";
  showIcon?: boolean;
}

export function VerificationBadge({ level, showIcon = true }: VerificationBadgeProps) {
  const labels = {
    verified: "Verificado",
    elite: "Elite",
    trusted: "Confiável"
  };

  return (
    <div className="verified-badge">
      {showIcon && <Shield className="w-3 h-3" />}
      <span>{labels[level]}</span>
    </div>
  );
}

interface AchievementBadgeProps {
  name: string;
  icon?: React.ReactNode;
  earned?: boolean;
}

export function AchievementBadge({ name, icon, earned = true }: AchievementBadgeProps) {
  return (
    <div className={`achievement-badge ${!earned ? 'opacity-50 grayscale' : ''}`}>
      {icon && <span className="mr-1">{icon}</span>}
      <span>{name}</span>
    </div>
  );
}

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label: string;
  showPercentage?: boolean;
}

export function ProgressIndicator({ current, total, label, showPercentage = true }: ProgressIndicatorProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-neutral">{label}</span>
        {showPercentage && (
          <span className="text-sm font-bold trust-primary">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-secondary">
        <span>{current} de {total}</span>
        <span>{total - current} restantes</span>
      </div>
    </div>
  );
}

interface RealTimeActivityProps {
  count: number;
  action: string;
  timeframe: string;
}

export function RealTimeActivity({ count, action, timeframe }: RealTimeActivityProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-surface-elevated border border-trust-primary rounded-lg">
      <div className="w-2 h-2 bg-success-validation rounded-full animate-pulse" />
      <span className="text-sm text-neutral">
        <span className="font-semibold trust-primary">{count} pessoas</span> {action} {timeframe}
      </span>
    </div>
  );
}

interface TrustScoreProps {
  score: number;
  reviews: number;
  successRate: number;
}

export function TrustScore({ score, reviews, successRate }: TrustScoreProps) {
  return (
    <div className="bg-surface-elevated p-4 rounded-xl border border-trust-primary/20 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral">Índice de Confiança</span>
        <VerificationBadge level="verified" />
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold trust-primary">{score.toFixed(1)}</div>
        <div className="flex items-center justify-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(score) ? 'text-gamification-gold fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center pt-3 border-t border-border-subtle">
        <div>
          <div className="text-lg font-bold social-proof">{reviews}</div>
          <div className="text-xs text-secondary">Avaliações</div>
        </div>
        <div>
          <div className="text-lg font-bold social-proof">{successRate}%</div>
          <div className="text-xs text-secondary">Taxa Sucesso</div>
        </div>
      </div>
    </div>
  );
}