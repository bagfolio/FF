import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, TrendingUp, Eye } from "lucide-react";
import { generateRealisticAthlete } from "@/lib/brazilianData";

export default function ScoutDashboard() {
  const [recentSearches] = useState([
    { query: "Atacantes São Paulo", results: 23, date: "Há 2 horas" },
    { query: "Meio-campistas Rio de Janeiro", results: 18, date: "Ontem" },
    { query: "Defensores velocidade >85", results: 12, date: "Há 3 dias" }
  ]);

  const [topAthletes] = useState(() => 
    Array.from({ length: 5 }, () => generateRealisticAthlete())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header do Scout */}
      <div className="mb-8">
        <h1 className="font-bebas text-4xl azul-celeste mb-2">DASHBOARD DO SCOUT</h1>
        <p className="text-gray-600 text-lg">Descubra os próximos talentos do futebol brasileiro</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Atletas Visualizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold azul-celeste flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>47</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">+12 esta semana</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Buscas Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold verde-brasil flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span>23</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">+5 hoje</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold amarelo-ouro flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>8</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">2 novos esta semana</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Descoberta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>92%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Acima da média</p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Busca Rápida */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-2xl azul-celeste">BUSCA RÁPIDA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 bg-gradient-to-r from-green-50 to-transparent transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Atacantes Promissores</h4>
                      <p className="text-sm text-gray-600 mb-2">Jogadores ofensivos com alto potencial</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">23 RESULTADOS</Badge>
                        <span className="text-xs text-gray-500">São Paulo, Rio de Janeiro</span>
                      </div>
                    </div>
                    <Button className="btn-primary">
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 bg-gradient-to-r from-blue-50 to-transparent transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Jovens Talentos Sub-17</h4>
                      <p className="text-sm text-gray-600 mb-2">Atletas em idade de formação</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-700 text-xs">18 RESULTADOS</Badge>
                        <span className="text-xs text-gray-500">Nacional</span>
                      </div>
                    </div>
                    <Button className="btn-primary">
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          {/* Buscas Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-xl azul-celeste">BUSCAS RECENTES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-azul-celeste to-blue-600 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{search.query}</p>
                      <p className="text-xs text-gray-500">{search.results} resultados • {search.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Atletas */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-xl azul-celeste">ATLETAS EM DESTAQUE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topAthletes.slice(0, 3).map((athlete, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {athlete.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{athlete.fullName}</p>
                      <p className="text-xs text-gray-500">{athlete.position} • {athlete.city}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className="bg-green-100 text-green-700 text-xs">{athlete.percentile}%</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}