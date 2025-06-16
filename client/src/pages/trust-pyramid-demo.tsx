import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/Navigation";
import TrustPyramid from "@/components/ui/trust-pyramid";
import VerificationBadge from "@/components/ui/verification-badge";

export default function TrustPyramidDemo() {
  const [currentLevel, setCurrentLevel] = useState<"bronze" | "silver" | "gold" | "platinum">("bronze");
  
  const levels: Array<"bronze" | "silver" | "gold" | "platinum"> = ["bronze", "silver", "gold", "platinum"];
  
  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="font-bebas text-4xl azul-celeste mb-8">DEMONSTRAÇÃO - PIRÂMIDE DA CONFIANÇA</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-2xl azul-celeste">PIRÂMIDE INTERATIVA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Nível Atual:</label>
                <div className="flex gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={currentLevel === level ? "default" : "outline"}
                      onClick={() => setCurrentLevel(level)}
                      className="capitalize"
                    >
                      {level === "silver" ? "Prata" : level === "gold" ? "Ouro" : level === "platinum" ? "Platina" : "Bronze"}
                    </Button>
                  ))}
                </div>
              </div>
              
              <TrustPyramid 
                currentLevel={currentLevel}
                showLabels={true}
                interactive={true}
              />
            </CardContent>
          </Card>
          
          {/* Badge Showcase */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-2xl azul-celeste">BADGES DE VERIFICAÇÃO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Tamanhos Disponíveis:</h3>
                  <div className="space-y-3">
                    {levels.map((level) => (
                      <div key={level} className="flex items-center gap-4">
                        <VerificationBadge level={level} size="sm" />
                        <VerificationBadge level={level} size="md" />
                        <VerificationBadge level={level} size="lg" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Sem Ícones:</h3>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <VerificationBadge key={level} level={level} showIcon={false} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Uso em Contexto:</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <span>João Silva - Atacante</span>
                      <VerificationBadge level="bronze" size="sm" />
                    </div>
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <span>Maria Santos - Meio-campo</span>
                      <VerificationBadge level="silver" size="sm" />
                    </div>
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <span>Pedro Oliveira - Lateral</span>
                      <VerificationBadge level="gold" size="sm" />
                    </div>
                    <div className="p-3 border rounded-lg flex items-center justify-between bg-gradient-to-r from-purple-50 to-transparent">
                      <span className="font-semibold">Lucas Costa - Goleiro ⭐</span>
                      <VerificationBadge level="platinum" size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Compact Version */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-bebas text-2xl azul-celeste">VERSÃO COMPACTA (SEM LABELS)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {levels.map((level) => (
                <div key={level} className="text-center">
                  <TrustPyramid 
                    currentLevel={level}
                    showLabels={false}
                    className="max-w-[200px] mx-auto"
                  />
                  <VerificationBadge level={level} className="mt-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}