import { AlertCircle, CreditCard, Trophy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useLocation } from "wouter";

export function SubscriptionBanner() {
  const { subscription, plan, createPortal, isCreatingPortal } = useSubscription();
  const [, setLocation] = useLocation();

  // Don't show banner if user has active pro/elite subscription
  if (subscription?.status === 'active' && plan?.name !== 'basic') {
    return null;
  }

  // Show trial ending soon banner
  if (subscription?.status === 'trialing' && subscription.trialEnd) {
    const daysLeft = Math.ceil((new Date(subscription.trialEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 3) {
      return (
        <Alert className="mb-6 border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle>Seu período de teste termina em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}</AlertTitle>
          <AlertDescription className="mt-2">
            <p>Aproveite todos os benefícios do plano {plan?.displayName} assinando agora.</p>
            <Button 
              size="sm" 
              className="mt-3"
              onClick={() => createPortal()}
              disabled={isCreatingPortal}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Gerenciar Assinatura
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
  }

  // Show past due banner
  if (subscription?.status === 'past_due') {
    return (
      <Alert className="mb-6 border-red-500/50 bg-red-50 dark:bg-red-950/20">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle>Pagamento pendente</AlertTitle>
        <AlertDescription className="mt-2">
          <p>Há um problema com seu pagamento. Atualize seu método de pagamento para continuar usando o {plan?.displayName}.</p>
          <Button 
            size="sm" 
            className="mt-3" 
            variant="destructive"
            onClick={() => createPortal()}
            disabled={isCreatingPortal}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Atualizar Pagamento
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show upgrade banner for basic users
  if (!subscription || plan?.name === 'basic') {
    return (
      <Alert className="mb-6 border-primary/50 bg-primary/5">
        <Trophy className="h-4 w-4 text-primary" />
        <AlertTitle>Destaque-se para os scouts!</AlertTitle>
        <AlertDescription className="mt-2">
          <p>Atualize para o Revela Pro e seja descoberto por scouts de todo o Brasil. Inclui verificação de habilidades e muito mais!</p>
          <Button 
            size="sm" 
            className="mt-3"
            onClick={() => setLocation('/athlete/dashboard?tab=subscription')}
          >
            Ver Planos Premium
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}