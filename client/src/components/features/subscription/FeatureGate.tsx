import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useFeatureAccess } from "@/hooks/useSubscription";

interface FeatureGateProps {
  feature: 'videos' | 'combine' | 'scout_visibility' | 'priority_support';
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const access = useFeatureAccess();
  const [, setLocation] = useLocation();

  const hasAccess = {
    videos: access.canUploadVideos,
    combine: access.canAccessCombineTests,
    scout_visibility: access.canBeSeenByScouts,
    priority_support: access.canAccessPrioritySupport,
  }[feature];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const featureNames = {
    videos: 'Upload de Vídeos',
    combine: 'Testes do Combine Digital',
    scout_visibility: 'Visibilidade para Scouts',
    priority_support: 'Suporte Prioritário',
  };

  const featureDescriptions = {
    videos: 'Faça upload de vídeos dos seus melhores momentos para impressionar os scouts.',
    combine: 'Acesse testes de verificação para validar suas habilidades com IA.',
    scout_visibility: 'Seja descoberto por scouts de clubes profissionais de todo o Brasil.',
    priority_support: 'Receba suporte prioritário da nossa equipe especializada.',
  };

  return (
    <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
      <Lock className="h-4 w-4 text-orange-600" />
      <AlertTitle>Recurso Premium</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          <strong>{featureNames[feature]}</strong> é um recurso exclusivo para assinantes.
        </p>
        <p className="text-sm">
          {featureDescriptions[feature]}
        </p>
        <Button 
          size="sm"
          onClick={() => setLocation('/athlete/subscription')}
        >
          Ver Planos Premium
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Wrapper component for conditional rendering based on subscription
interface SubscriptionFeatureProps {
  requiredPlan?: 'pro' | 'elite';
  children: ReactNode;
  fallback?: ReactNode;
}

export function SubscriptionFeature({ requiredPlan, children, fallback }: SubscriptionFeatureProps) {
  const access = useFeatureAccess();
  const [, setLocation] = useLocation();

  // If no specific plan required, just check if user has any subscription
  if (!requiredPlan && access.canUploadVideos) {
    return <>{children}</>;
  }

  // Check specific plan requirements
  const hasPlan = requiredPlan === 'pro' 
    ? access.canBeSeenByScouts // Pro or Elite
    : requiredPlan === 'elite' 
    ? access.canAccessPrioritySupport // Elite only
    : true;

  if (hasPlan) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const planNames = {
    pro: 'Revela Pro',
    elite: 'Revela Elite',
  };

  return (
    <Alert className="border-primary/50 bg-primary/5">
      <Lock className="h-4 w-4 text-primary" />
      <AlertTitle>Upgrade Necessário</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          Este recurso requer o plano <strong>{planNames[requiredPlan!]}</strong> ou superior.
        </p>
        <Button 
          size="sm"
          onClick={() => setLocation('/athlete/subscription')}
        >
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  );
}