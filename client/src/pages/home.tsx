import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import LoadingScreen from "@/components/ui/loading-screen";
import UserTypeModal from "@/components/features/UserTypeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Search, Users, Target } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<"athlete" | "scout" | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      // If user already has a type, redirect to their dashboard
      if ((user as any).userType === "athlete") {
        setLocation("/athlete/dashboard");
      } else if ((user as any).userType === "scout") {
        setLocation("/scout/dashboard");
      }
    }
  }, [user, isLoading, setLocation]);

  // Show loading screen only while auth is loading
  if (isLoading || !user) {
    return <LoadingScreen />;
  }
  
  // If user already has a type, don't show loading screen, just return null
  // The useEffect will handle the redirect
  if ((user as any).userType) {
    return null;
  }

  // User needs to select their type
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Bem-vindo ao Futebol Futuro
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Escolha seu perfil para começar sua jornada no futuro do futebol brasileiro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Athlete Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
            setSelectedType("athlete");
            setShowTypeModal(true);
          }}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-verde-brasil rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Trophy className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <CardTitle className="text-xl md:text-2xl">Atleta</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Mostre seu talento e seja descoberto por olheiros profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-verde-brasil" />
                  Crie seu perfil completo
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-verde-brasil" />
                  Registre seus testes físicos
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-verde-brasil" />
                  Seja encontrado por clubes
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Scout Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
            setSelectedType("scout");
            setShowTypeModal(true);
          }}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-azul-celeste rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Search className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <CardTitle className="text-xl md:text-2xl">Olheiro</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Descubra talentos em todo o Brasil usando nossa tecnologia
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-azul-celeste" />
                  Busque atletas por região
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-azul-celeste" />
                  Filtre por posição e idade
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-azul-celeste" />
                  Acesse dados verificados
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <UserTypeModal 
          isOpen={showTypeModal} 
          onClose={() => setShowTypeModal(false)}
          selectedType={selectedType}
        />
      </div>
    </div>
  );
}
