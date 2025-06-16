import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/loading-screen";
import UserTypeModal from "@/components/features/UserTypeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Search, Users, Target } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<"athlete" | "scout" | null>(null);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoadingScreen />;
  }

  // If user already has a type, redirect to their dashboard
  if ((user as any).userType === "athlete") {
    window.location.href = "/athlete/dashboard";
    return <LoadingScreen />;
  }
  
  if ((user as any).userType === "scout") {
    window.location.href = "/scout/dashboard";
    return <LoadingScreen />;
  }

  // User needs to select their type
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Futebol Futuro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha seu perfil para começar sua jornada no futuro do futebol brasileiro
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Athlete Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
            setSelectedType("athlete");
            setShowTypeModal(true);
          }}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-verde-brasil rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Atleta</CardTitle>
              <CardDescription>
                Mostre seu talento e seja descoberto por olheiros profissionais
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-azul-celeste rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Olheiro</CardTitle>
              <CardDescription>
                Descubra talentos em todo o Brasil usando nossa tecnologia
              </CardDescription>
            </CardHeader>
            <CardContent>
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
