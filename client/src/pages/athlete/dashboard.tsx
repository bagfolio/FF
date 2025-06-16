import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import { User, Trophy, TrendingUp, Eye, Play, Medal, Star, Crown } from "lucide-react";

export default function AthleteDashboard() {
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: athlete } = useQuery({ queryKey: ["/api/athletes/me"] });
  const { data: tests } = useQuery({ 
    queryKey: ["/api/tests/athlete", athlete?.id],
    enabled: !!athlete?.id
  });

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "bronze":
        return <Badge className="bg-orange-500"><Medal className="w-3 h-3 mr-1" />Bronze</Badge>;
      case "silver":
        return <Badge className="bg-gray-400"><Star className="w-3 h-3 mr-1" />Prata</Badge>;
      case "gold":
        return <Badge className="bg-yellow-400 text-black"><Crown className="w-3 h-3 mr-1" />Ouro</Badge>;
      case "platinum":
        return <Badge className="bg-purple-500"><Trophy className="w-3 h-3 mr-1" />Platina</Badge>;
      default:
        return <Badge variant="outline"><Medal className="w-3 h-3 mr-1" />Bronze</Badge>;
    }
  };

  if (!athlete) {
    return (
      <div className="min-h-screen bg-cinza-claro">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="font-bebas text-2xl azul-celeste mb-4">Complete Seu Perfil</h2>
              <p className="text-gray-600 mb-6">
                Para acessar o dashboard, você precisa completar seu perfil de atleta.
              </p>
              <Button className="btn-primary" onClick={() => window.location.href = "/athlete/onboarding"}>
                Completar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-verde-brasil rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-bebas text-3xl azul-celeste">{athlete.fullName}</h1>
              <p className="text-gray-600">{athlete.position}</p>
              <div className="mt-2">{getVerificationBadge(athlete.verificationLevel || "bronze")}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Testes Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold azul-celeste">{tests?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Visualizações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold azul-celeste flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {Math.floor(Math.random() * 100) + 50}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Percentil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold verde-brasil flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {Math.floor(Math.random() * 30) + 70}%
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conquistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold amarelo-ouro flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {Math.floor(Math.random() * 5) + 3}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Combine Digital */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-2xl azul-celeste">COMBINE DIGITAL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Teste de Velocidade 20m</h4>
                        <p className="text-sm text-gray-600">Medição de aceleração e velocidade máxima</p>
                      </div>
                      <Button className="btn-primary">
                        <Play className="w-4 h-4 mr-2" />
                        Realizar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Teste de Agilidade 5-10-5</h4>
                        <p className="text-sm text-gray-600">Avalia mudanças de direção e coordenação</p>
                      </div>
                      <Button className="btn-primary">
                        <Play className="w-4 h-4 mr-2" />
                        Realizar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Habilidades Técnicas</h4>
                        <p className="text-sm text-gray-600">Controle de bola, chutes e passes</p>
                      </div>
                      <Button className="btn-primary">
                        <Play className="w-4 h-4 mr-2" />
                        Realizar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">ATIVIDADE RECENTE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-verde-brasil rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Seu perfil foi visualizado por um scout do Santos</p>
                      <p className="text-xs text-gray-500">2 horas atrás</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amarelo-ouro rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 azul-celeste" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Conquista desbloqueada: "Primeiro Teste"</p>
                      <p className="text-xs text-gray-500">1 dia atrás</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-azul-celeste rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Novo teste disponível: Resistência</p>
                      <p className="text-xs text-gray-500">3 dias atrás</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">COMPLETAR PERFIL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Dados básicos</span>
                    <span className="verde-brasil">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Foto de perfil</span>
                    <span className="text-gray-400">Adicionar</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Primeiro teste</span>
                    <span className="text-gray-400">Pendente</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-verde-brasil h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500">40% completo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
