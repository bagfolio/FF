import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import { Search, Users, Eye, TrendingUp, Filter, MapPin, Medal, Star, Crown, Trophy } from "lucide-react";
import { useLocation } from "wouter";

export default function ScoutDashboard() {
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: scout } = useQuery({ queryKey: ["/api/scouts/me"] });
  const { data: athletes } = useQuery({ queryKey: ["/api/athletes"] });
  const [, setLocation] = useLocation();

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "bronze":
        return <Badge variant="outline" className="text-orange-600"><Medal className="w-3 h-3 mr-1" />Bronze</Badge>;
      case "silver":
        return <Badge variant="outline" className="text-gray-600"><Star className="w-3 h-3 mr-1" />Prata</Badge>;
      case "gold":
        return <Badge variant="outline" className="text-yellow-600"><Crown className="w-3 h-3 mr-1" />Ouro</Badge>;
      case "platinum":
        return <Badge variant="outline" className="text-purple-600"><Trophy className="w-3 h-3 mr-1" />Platina</Badge>;
      default:
        return <Badge variant="outline"><Medal className="w-3 h-3 mr-1" />Bronze</Badge>;
    }
  };

  if (!scout) {
    return (
      <div className="min-h-screen bg-cinza-claro">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="font-bebas text-2xl azul-celeste mb-4">Complete Seu Perfil de Scout</h2>
              <p className="text-gray-600 mb-6">
                Para acessar o dashboard, você precisa completar seu perfil de scout.
              </p>
              <Button className="btn-primary">Completar Perfil</Button>
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-bebas text-3xl azul-celeste mb-2">DASHBOARD SCOUT</h1>
              <p className="text-gray-600">{scout.fullName} - {scout.organization}</p>
            </div>
            <Button 
              onClick={() => setLocation("/scout/search")}
              className="btn-primary"
            >
              <Search className="w-4 h-4 mr-2" />
              Busca Avançada
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Atletas Descobertos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold azul-celeste flex items-center gap-2">
                <Users className="w-5 h-5" />
                {athletes?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Perfis Visualizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold azul-celeste flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {Math.floor(Math.random() * 500) + 200}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Novos Talentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold verde-brasil flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {Math.floor(Math.random() * 20) + 10}
              </div>
              <p className="text-xs text-gray-500">Esta semana</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Contatos Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold amarelo-ouro flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {Math.floor(Math.random() * 15) + 5}
              </div>
              <p className="text-xs text-gray-500">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-bebas text-2xl azul-celeste">BUSCA RÁPIDA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Buscar por nome, posição, cidade..." 
                  className="text-lg"
                />
              </div>
              <Button className="btn-primary px-8">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Athletes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-2xl azul-celeste">NOVOS TALENTOS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {athletes?.slice(0, 5).map((athlete: any) => (
                    <div key={athlete.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{athlete.fullName}</h4>
                            {getVerificationBadge(athlete.verificationLevel)}
                          </div>
                          <p className="text-gray-600 mb-1">{athlete.position} • {athlete.city}, {athlete.state}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {Math.floor(Math.random() * 100) + 50}km
                            </span>
                            <span>{new Date().getFullYear() - new Date(athlete.birthDate).getFullYear()} anos</span>
                            {athlete.currentTeam && <span>{athlete.currentTeam}</span>}
                          </div>
                        </div>
                        <Button size="sm" className="btn-primary">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">FILTROS SALVOS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Atacantes SP - Sub 18
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Meio-campos Verificados
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Laterais RJ/ES
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">ESTATÍSTICAS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Perfis completos</span>
                      <span className="verde-brasil">73%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-verde-brasil h-2 rounded-full" style={{ width: "73%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Com testes verificados</span>
                      <span className="amarelo-ouro">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nível Ouro/Platina</span>
                      <span className="azul-celeste">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
