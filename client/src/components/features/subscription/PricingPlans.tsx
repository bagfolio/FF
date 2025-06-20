import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { Skeleton } from "@/components/ui/skeleton-loader";

const features = [
  { name: "Perfil básico de atleta", basic: true, pro: true, elite: true },
  { name: "Upload de fotos", basic: true, pro: true, elite: true },
  { name: "Autoavaliação de habilidades", basic: true, pro: true, elite: true },
  { name: "Visibilidade para scouts", basic: false, pro: true, elite: true },
  { name: "Testes de verificação mensais", basic: "0", pro: "3", elite: "Ilimitados" },
  { name: "Selo de verificação", basic: false, pro: true, elite: true },
  { name: "Análise prioritária", basic: false, pro: false, elite: true },
  { name: "Suporte prioritário", basic: false, pro: false, elite: true },
  { name: "Destaque nas buscas", basic: false, pro: false, elite: true },
  { name: "Perfis adicionais", basic: "1", pro: "1", elite: "3" },
];

export function PricingPlans() {
  const { plans, subscription, createCheckout, isCreatingCheckout } = useSubscription();

  if (!plans || plans.length === 0) {
    return <Skeleton className="h-96" />;
  }

  const basicPlan = plans.find(p => p.name === 'basic');
  const proPlan = plans.find(p => p.name === 'pro');
  const elitePlan = plans.find(p => p.name === 'elite');

  const currentPlanId = subscription?.planId;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Basic Plan */}
      <Card className="relative">
        <CardHeader>
          <CardTitle>Revela Basic</CardTitle>
          <CardDescription>Perfeito para começar sua jornada</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">Grátis</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-2">
                {feature.basic === true ? (
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                ) : feature.basic === false ? (
                  <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5 text-center text-sm font-medium">
                    {feature.basic}
                  </span>
                )}
                <span className={feature.basic === false ? "text-gray-400" : ""}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant={currentPlanId === basicPlan?.id ? "secondary" : "outline"}
            disabled={currentPlanId === basicPlan?.id}
          >
            {currentPlanId === basicPlan?.id ? "Plano Atual" : "Começar Grátis"}
          </Button>
        </CardFooter>
      </Card>

      {/* Pro Plan */}
      <Card className="relative border-primary">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
        </div>
        <CardHeader>
          <CardTitle>Revela Pro</CardTitle>
          <CardDescription>Para atletas sérios sobre seu futuro</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">R$ 29,90</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-2">
                {feature.pro === true ? (
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                ) : feature.pro === false ? (
                  <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5 text-center text-sm font-medium">
                    {feature.pro}
                  </span>
                )}
                <span className={feature.pro === false ? "text-gray-400" : ""}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant={currentPlanId === proPlan?.id ? "secondary" : "default"}
            disabled={currentPlanId === proPlan?.id || isCreatingCheckout}
            onClick={() => proPlan && createCheckout(proPlan.id)}
          >
            {currentPlanId === proPlan?.id ? "Plano Atual" : "Assinar Pro"}
          </Button>
        </CardFooter>
      </Card>

      {/* Elite Plan */}
      <Card className="relative">
        <CardHeader>
          <CardTitle>Revela Elite</CardTitle>
          <CardDescription>Máximo desempenho e visibilidade</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">R$ 79,90</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-2">
                {feature.elite === true ? (
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                ) : feature.elite === false ? (
                  <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5 text-center text-sm font-medium">
                    {feature.elite}
                  </span>
                )}
                <span className={feature.elite === false ? "text-gray-400" : ""}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant={currentPlanId === elitePlan?.id ? "secondary" : "outline"}
            disabled={currentPlanId === elitePlan?.id || isCreatingCheckout}
            onClick={() => elitePlan && createCheckout(elitePlan.id)}
          >
            {currentPlanId === elitePlan?.id ? "Plano Atual" : "Assinar Elite"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}