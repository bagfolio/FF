import { Check, X, Trophy, CircleDot, Goal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { Skeleton } from "@/components/ui/skeleton-loader";

const features = [
  { name: "Perfil completo de atleta", basic: true, pro: true, elite: true },
  { name: "Vídeos de highlights", basic: "2 vídeos", pro: "10 vídeos", elite: "Ilimitado" },
  { name: "Estatísticas de desempenho", basic: true, pro: true, elite: true },
  { name: "Visibilidade para scouts", basic: false, pro: true, elite: true },
  { name: "Testes físicos verificados", basic: false, pro: "3/mês", elite: "Ilimitado", icon: CircleDot },
  { name: "Selo de atleta verificado", basic: false, pro: true, elite: true, icon: Trophy },
  { name: "Análise técnica por IA", basic: false, pro: "Básica", elite: "Avançada" },
  { name: "Conexão direta com clubes", basic: false, pro: false, elite: true },
  { name: "Destaque em pesquisas", basic: false, pro: false, elite: true },
  { name: "Relatórios de evolução", basic: false, pro: "Mensal", elite: "Semanal", icon: Goal },
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
    <div className="grid gap-8 lg:grid-cols-3 overflow-visible relative" style={{ paddingTop: '2rem' }}>
      {/* Basic Plan */}
      <Card className="relative glass-morph-pricing-basic stadium-spotlight pattern-brazilian">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Revela Basic</CardTitle>
          <CardDescription className="text-gray-400">Perfeito para começar sua jornada</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">Grátis</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-2">
                {typeof feature.icon === 'function' && feature.basic === false ? (
                  <feature.icon className="h-5 w-5 icon-referee shrink-0 mt-0.5" />
                ) : feature.basic === true ? (
                  <Check className="h-5 w-5 text-verde-brasil shrink-0 mt-0.5" />
                ) : feature.basic === false ? (
                  <X className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span className={feature.basic === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                  {typeof feature.basic === 'string' && (
                    <span className="text-verde-brasil font-medium ml-2">({feature.basic})</span>
                  )}
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
      <Card className="relative glass-morph-pricing-pro stadium-spotlight pattern-brazilian overflow-visible">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50" style={{ overflow: 'visible' }}>
          <div className="badge-popular badge-championship">
            Mais Popular
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Revela Pro</CardTitle>
          <CardDescription className="text-gray-400">Para atletas sérios sobre seu futuro</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">R$ 29,90</span>
            <span className="text-gray-400">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-2">
                {typeof feature.icon === 'function' && typeof feature.pro === 'string' ? (
                  <feature.icon className="h-5 w-5 icon-soccer-ball shrink-0 mt-0.5" />
                ) : feature.pro === true ? (
                  <Check className="h-5 w-5 text-verde-brasil shrink-0 mt-0.5" />
                ) : feature.pro === false ? (
                  <X className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span className={feature.pro === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                  {typeof feature.pro === 'string' && (
                    <span className="text-verde-brasil font-medium ml-2">({feature.pro})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-verde-brasil hover:bg-verde-brasil/90 text-white shadow-lg hover:shadow-verde-brasil/50 transition-all duration-300 font-bold" 
            disabled={currentPlanId === proPlan?.id || isCreatingCheckout}
            onClick={() => proPlan && createCheckout(proPlan.id)}
          >
            {currentPlanId === proPlan?.id ? "Plano Atual" : "Assinar Pro"}
          </Button>
        </CardFooter>
      </Card>

      {/* Elite Plan */}
      <Card className="relative glass-morph-pricing-elite stadium-spotlight pattern-brazilian">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Revela Elite</CardTitle>
          <CardDescription className="text-gray-400">Máximo desempenho e visibilidade</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">R$ 79,90</span>
            <span className="text-gray-400">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-2">
                {typeof feature.icon === 'function' && typeof feature.elite === 'string' ? (
                  <feature.icon className="h-5 w-5 icon-goalpost shrink-0 mt-0.5" />
                ) : feature.elite === true ? (
                  <Check className="h-5 w-5 text-verde-brasil shrink-0 mt-0.5" />
                ) : feature.elite === false ? (
                  <X className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span className={feature.elite === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                  {typeof feature.elite === 'string' && (
                    <span className="text-amarelo-ouro font-medium ml-2">({feature.elite})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full btn-elite" 
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