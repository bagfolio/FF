import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/layout/Navigation";
import { Search, Filter, MapPin, Medal, Star, Crown, Trophy, Grid, List, Eye } from "lucide-react";
import VerificationBadge from "@/components/ui/verification-badge";
import { SkillsDisplay } from "@/components/scout/SkillsDisplay";
import { EnhancedAthleteCard } from "@/components/scout/EnhancedAthleteCard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TrustWarningBanner } from "@/components/ui/trust-warning-banner";

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
  
  // Skill-based filters
  const [skillFilters, setSkillFilters] = useState({
    minSpeed: 0,
    minStrength: 0,
    minTechnique: 0,
    minStamina: 0,
    verifiedOnly: false,
    minTrustLevel: "" as "" | "bronze" | "silver" | "gold" | "platinum"
  });

  const { data: athletes = [] } = useQuery<any[]>({ 
    queryKey: ["/api/athletes", filters],
    placeholderData: (previousData) => previousData,
  });
  
  // Helper function to get skill value from assessment data
  const getSkillValue = (skills: any[], skillType: string): number => {
    if (!skills || !Array.isArray(skills)) return 0;
    
    const skill = skills.find(s => s.id === skillType);
    if (!skill) return 0;
    
    switch(skillType) {
      case 'speed':
      case 'strength':
        return skill.data?.sliderValue || 0;
      
      case 'technique':
        const techSkills = skill.data?.skills || {};
        const values = Object.values(techSkills).filter(v => typeof v === 'number') as number[];
        return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 2) : 0;
      
      case 'stamina':
        const duration = skill.data?.duration;
        return duration === '90+' ? 10 : duration === '90' ? 8 : duration === '60' ? 6 : duration === '45' ? 4 : 0;
      
      default:
        return 0;
    }
  };

  // Apply skill filters to athletes
  const filteredAthletes = athletes?.filter((athlete: any) => {
    // Apply existing filters first
    if (filters.search && !athlete.fullName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Apply skill filters
    if (skillFilters.verifiedOnly && !athlete.skillsVerified) {
      return false;
    }
    
    // Apply trust level filter
    if (skillFilters.minTrustLevel) {
      const trustLevels = ['bronze', 'silver', 'gold', 'platinum'];
      const athleteLevel = athlete.verificationLevel || 'bronze';
      const minLevelIndex = trustLevels.indexOf(skillFilters.minTrustLevel);
      const athleteLevelIndex = trustLevels.indexOf(athleteLevel);
      
      if (athleteLevelIndex < minLevelIndex) {
        return false;
      }
    }
    
    if (!athlete.skillsAssessment) {
      return skillFilters.minSpeed === 0 && 
             skillFilters.minStrength === 0 && 
             skillFilters.minTechnique === 0 && 
             skillFilters.minStamina === 0;
    }
    
    const speedValue = getSkillValue(athlete.skillsAssessment, 'speed');
    const strengthValue = getSkillValue(athlete.skillsAssessment, 'strength');
    const techniqueValue = getSkillValue(athlete.skillsAssessment, 'technique');
    const staminaValue = getSkillValue(athlete.skillsAssessment, 'stamina');
    
    if (skillFilters.minSpeed > 0 && speedValue < skillFilters.minSpeed) return false;
    if (skillFilters.minStrength > 0 && strengthValue < skillFilters.minStrength) return false;
    if (skillFilters.minTechnique > 0 && techniqueValue < skillFilters.minTechnique) return false;
    if (skillFilters.minStamina > 0 && staminaValue < skillFilters.minStamina) return false;
    
    return true;
  }) || [];
  
  // Calculate unverified data statistics
  const unverifiedCount = filteredAthletes.filter((athlete: any) => 
    athlete.verificationLevel === 'bronze' || !athlete.verificationLevel
  ).length;

  return (
    <TooltipProvider>
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
                      <SelectItem value="bronze">Bronze - Auto-declarado</SelectItem>
                      <SelectItem value="silver">Prata - Validado por Treinador</SelectItem>
                      <SelectItem value="gold">Ouro - Verificado por Liga</SelectItem>
                      <SelectItem value="platinum">Platina - Combine Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Skills Filters Section */}
                <div className="border-t pt-6">
                  <h3 className="font-bebas text-lg azul-celeste mb-4">FILTRAR POR HABILIDADES</h3>
                  
                  {/* Trust Level Filter for Skills */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Nível mínimo de confiança</label>
                    <Select 
                      value={skillFilters.minTrustLevel} 
                      onValueChange={(value) => setSkillFilters({...skillFilters, minTrustLevel: value as any})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Qualquer nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer nível</SelectItem>
                        <SelectItem value="silver">Prata ou superior</SelectItem>
                        <SelectItem value="gold">Ouro ou superior</SelectItem>
                        <SelectItem value="platinum">Apenas Platina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Legacy Verified Only Checkbox */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      id="verifiedOnly"
                      checked={skillFilters.verifiedOnly}
                      onCheckedChange={(checked) => 
                        setSkillFilters({...skillFilters, verifiedOnly: checked as boolean})
                      }
                    />
                    <label 
                      htmlFor="verifiedOnly" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Apenas habilidades verificadas (Prata+)
                    </label>
                  </div>

                  {/* Skill Sliders */}
                  <div className="space-y-4">
                    {[
                      { key: 'minSpeed', label: 'Velocidade mínima', icon: '⚡' },
                      { key: 'minStrength', label: 'Força mínima', icon: '💪' },
                      { key: 'minTechnique', label: 'Técnica mínima', icon: '⚽' },
                      { key: 'minStamina', label: 'Resistência mínima', icon: '🏃' }
                    ].map((skill) => (
                      <div key={skill.key}>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <span>{skill.icon}</span>
                          <span>{skill.label}: {(skillFilters as any)[skill.key]}/10</span>
                        </label>
                        <Slider
                          value={[(skillFilters as any)[skill.key]]}
                          onValueChange={(value) => 
                            setSkillFilters({...skillFilters, [skill.key]: value[0]})
                          }
                          min={0}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Reset Filters */}
                  {(skillFilters.minSpeed > 0 || 
                    skillFilters.minStrength > 0 || 
                    skillFilters.minTechnique > 0 || 
                    skillFilters.minStamina > 0 || 
                    skillFilters.verifiedOnly ||
                    skillFilters.minTrustLevel) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setSkillFilters({
                        minSpeed: 0,
                        minStrength: 0,
                        minTechnique: 0,
                        minStamina: 0,
                        verifiedOnly: false,
                        minTrustLevel: ""
                      })}
                    >
                      Limpar filtros de habilidades
                    </Button>
                  )}
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
            {/* Trust Warning Banner */}
            {filteredAthletes.length > 0 && (
              <TrustWarningBanner
                trustLevel="bronze"
                totalUnverified={unverifiedCount}
                totalItems={filteredAthletes.length}
                context="scout"
                onAction={() => setSkillFilters({...skillFilters, minTrustLevel: "silver"})}
                className="mb-6"
              />
            )}
            
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bebas text-xl azul-celeste">
                  {filteredAthletes.length} ATLETAS ENCONTRADOS
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {filteredAthletes.length !== athletes?.length && (
                    <p className="text-sm text-gray-600">
                      Filtrados de {athletes?.length || 0} atletas totais
                    </p>
                  )}
                  {filteredAthletes.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-gray-600">{filteredAthletes.length - unverifiedCount} verificados</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-gray-600">{unverifiedCount} não verificados</span>
                      </div>
                    </div>
                  )}
                </div>
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
                {filteredAthletes.map((athlete: any) => (
                  <EnhancedAthleteCard
                    key={athlete.id}
                    athlete={athlete}
                    viewMode="grid"
                    onViewProfile={(id) => {
                      // Navigate to athlete profile
                      window.location.href = `/scout/athlete/${id}`;
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAthletes.map((athlete: any) => (
                  <EnhancedAthleteCard
                    key={athlete.id}
                    athlete={athlete}
                    viewMode="list"
                    onViewProfile={(id) => {
                      // Navigate to athlete profile
                      window.location.href = `/scout/athlete/${id}`;
                    }}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredAthletes.length === 0 && (
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
    </TooltipProvider>
  );
}
