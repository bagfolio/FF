import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/layout/Navigation";
import { Search, Filter, MapPin, Medal, Star, Crown, Trophy, Grid, List, Eye } from "lucide-react";
import VerificationBadge from "@/components/ui/verification-badge";

const positions = [
  "Goleiro", "Zagueiro", "Lateral Direito", "Lateral Esquerdo", 
  "Volante", "Meio-campo", "Meia-atacante", "Ponta Direita", 
  "Ponta Esquerda", "Atacante", "Centroavante"
];

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function ScoutSearch() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    search: "",
    position: "",
    state: "",
    ageRange: [14, 18],
    verificationLevel: "",
  });

  const { data: athletes } = useQuery({ 
    queryKey: ["/api/athletes", filters],
    keepPreviousData: true,
  });


  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bebas text-3xl azul-celeste mb-2">BUSCA AVANÇADA</h1>
          <p className="text-gray-600">Encontre talentos verificados com filtros específicos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  FILTROS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Buscar</label>
                  <Input 
                    placeholder="Nome, cidade..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Posição</label>
                  <Select value={filters.position} onValueChange={(value) => setFilters({...filters, position: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as posições" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as posições</SelectItem>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Estado</label>
                  <Select value={filters.state} onValueChange={(value) => setFilters({...filters, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os estados</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Idade: {filters.ageRange[0]} - {filters.ageRange[1]} anos
                  </label>
                  <Slider
                    value={filters.ageRange}
                    onValueChange={(value) => setFilters({...filters, ageRange: value})}
                    min={8}
                    max={18}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Verification Level */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Nível de Verificação</label>
                  <Select value={filters.verificationLevel} onValueChange={(value) => setFilters({...filters, verificationLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os níveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os níveis</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Prata</SelectItem>
                      <SelectItem value="gold">Ouro</SelectItem>
                      <SelectItem value="platinum">Platina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full btn-primary">
                  <Search className="w-4 h-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bebas text-xl azul-celeste">
                  {athletes?.length || 0} ATLETAS ENCONTRADOS
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {athletes?.map((athlete: any) => (
                  <Card key={athlete.id} className="card-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-verde-brasil rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">
                            {athlete.fullName.charAt(0)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg azul-celeste">{athlete.fullName}</h3>
                        <p className="text-gray-600">{athlete.position}</p>
                        <VerificationBadge level={athlete.verificationLevel as "bronze" | "silver" | "gold" | "platinum"} size="sm" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Idade:</span>
                          <span>{new Date().getFullYear() - new Date(athlete.birthDate).getFullYear()} anos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Localização:</span>
                          <span>{athlete.city}, {athlete.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pé dominante:</span>
                          <span>{athlete.dominantFoot === "right" ? "Destro" : athlete.dominantFoot === "left" ? "Canhoto" : "Ambidestro"}</span>
                        </div>
                        {athlete.currentTeam && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Time atual:</span>
                            <span>{athlete.currentTeam}</span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full mt-4 btn-primary">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Perfil Completo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {athletes?.map((athlete: any) => (
                  <Card key={athlete.id} className="card-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-verde-brasil rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {athlete.fullName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-lg azul-celeste">{athlete.fullName}</h3>
                              <VerificationBadge level={athlete.verificationLevel as "bronze" | "silver" | "gold" | "platinum"} size="sm" />
                            </div>
                            <p className="text-gray-600">{athlete.position} • {athlete.city}, {athlete.state}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>{new Date().getFullYear() - new Date(athlete.birthDate).getFullYear()} anos</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {Math.floor(Math.random() * 100) + 50}km
                              </span>
                              {athlete.currentTeam && <span>{athlete.currentTeam}</span>}
                            </div>
                          </div>
                        </div>
                        <Button className="btn-primary">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {athletes?.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bebas text-xl azul-celeste mb-2">Nenhum atleta encontrado</h3>
                  <p className="text-gray-600">Tente ajustar os filtros para encontrar mais talentos.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
