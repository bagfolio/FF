import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { PricingPlans } from "@/components/features/subscription/PricingPlans";
import { useSubscription } from "@/hooks/useSubscription";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Receipt,
  Settings
} from "lucide-react";

export default function SubscriptionPage() {
  const { 
    subscription, 
    plan, 
    isLoading,
    createPortal,
    cancelSubscription,
    resumeSubscription,
    isCreatingPortal,
    isCanceling,
    isResuming
  } = useSubscription();

  if (isLoading) {
    return (
      <EnhancedAthleteLayout>
        <div className="container max-w-7xl mx-auto py-8">
          <Skeleton className="h-96" />
        </div>
      </EnhancedAthleteLayout>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      active: { variant: "default", label: "Ativo" },
      trialing: { variant: "secondary", label: "Período de Teste" },
      past_due: { variant: "destructive", label: "Pagamento Pendente" },
      canceled: { variant: "outline", label: "Cancelado" },
      paused: { variant: "secondary", label: "Pausado" }
    };

    const config = variants[status] || { variant: "outline", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <EnhancedAthleteLayout>
      <div className="container max-w-7xl mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Assinatura</h1>
          <p className="text-muted-foreground">
            Gerencie sua assinatura e método de pagamento
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscription && plan ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Plano Atual
                  {getStatusBadge(subscription.status)}
                </CardTitle>
                <CardDescription>{plan.displayName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preço</span>
                    <span className="font-medium">
                      R$ {plan.price.toFixed(2).replace('.', ',')}/mês
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Próximo pagamento</span>
                    <span className="font-medium">
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                  {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Teste grátis até</span>
                      <span className="font-medium">
                        {formatDate(subscription.trialEnd)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => createPortal()}
                    disabled={isCreatingPortal}
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Gerenciar Assinatura
                  </Button>

                  {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      onClick={() => cancelSubscription()}
                      disabled={isCanceling}
                      className="w-full"
                    >
                      Cancelar Assinatura
                    </Button>
                  )}

                  {subscription.cancelAtPeriodEnd && (
                    <>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Assinatura será cancelada</AlertTitle>
                        <AlertDescription>
                          Sua assinatura será cancelada em {formatDate(subscription.currentPeriodEnd)}
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() => resumeSubscription()}
                        disabled={isResuming}
                        className="w-full"
                      >
                        Reativar Assinatura
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefícios do {plan.displayName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhuma assinatura ativa</AlertTitle>
            <AlertDescription>
              Você está usando o plano gratuito. Atualize para acessar recursos premium!
            </AlertDescription>
          </Alert>
        )}

        {/* Past Due Warning */}
        {subscription?.status === 'past_due' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Pagamento pendente</AlertTitle>
            <AlertDescription>
              Há um problema com seu pagamento. Por favor, atualize seu método de pagamento para continuar usando o serviço.
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => createPortal()}
                disabled={isCreatingPortal}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Atualizar Pagamento
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing Plans */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Planos Disponíveis</h2>
            <p className="text-muted-foreground">
              Escolha o plano ideal para sua jornada no futebol
            </p>
          </div>
          <PricingPlans />
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Você continuará tendo acesso até o final do período pago.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Como funciona o período de teste?</h4>
              <p className="text-sm text-muted-foreground">
                Todos os planos pagos incluem 7 dias de teste grátis. Você não será cobrado até o final do período de teste.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Posso mudar de plano?</h4>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do portal de assinatura.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Quais formas de pagamento são aceitas?</h4>
              <p className="text-sm text-muted-foreground">
                Aceitamos cartões de crédito e débito das principais bandeiras (Visa, Mastercard, Elo, American Express).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnhancedAthleteLayout>
  );
}