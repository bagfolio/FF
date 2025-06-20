import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal, Search, Trophy, Users, BarChart3, Eye } from "lucide-react";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: "athlete" | "scout" | null;
}

export default function UserTypeModal({ isOpen, onClose, selectedType }: UserTypeModalProps) {
  const [localSelectedType, setLocalSelectedType] = useState<"athlete" | "scout" | null>(selectedType);
  const [, setLocation] = useLocation();

  const handleTypeSelection = (type: "athlete" | "scout") => {
    setLocalSelectedType(type);
  };

  const handleContinue = () => {
    if (localSelectedType) {
      // Store the selected type in sessionStorage for the onboarding flow
      sessionStorage.setItem('selectedUserType', localSelectedType);
      
      // Redirect to appropriate onboarding
      if (localSelectedType === "athlete") {
        setLocation("/athlete/onboarding");
      } else {
        setLocation("/scout/onboarding");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl md:text-3xl text-blue-600 text-center">
            ESCOLHA SEU PERFIL
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2 text-sm md:text-base">
            Como você gostaria de usar o Revela?
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          {/* Athlete Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              localSelectedType === "athlete" 
                ? "ring-2 ring-green-500 border-green-500 shadow-lg" 
                : "hover:shadow-md"
            }`}
            onClick={() => handleTypeSelection("athlete")}
          >
            <CardContent className="p-4 md:p-8 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Terminal className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              <h3 className="font-bold text-xl md:text-2xl text-blue-600 mb-3 md:mb-4">SOU ATLETA</h3>
              
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Mostre seu talento para o mundo. Crie seu perfil, faça testes verificados por IA 
                e seja descoberto por scouts profissionais.
              </p>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Trophy className="w-4 h-4 text-green-500" />
                  <span>Testes físicos verificados por IA</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span>Estatísticas e métricas detalhadas</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span>Visibilidade para scouts e clubes</span>
                </div>
              </div>

              {localSelectedType === "athlete" && (
                <div className="text-green-500 font-semibold">✓ Selecionado</div>
              )}
            </CardContent>
          </Card>

          {/* Scout Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              localSelectedType === "scout" 
                ? "ring-2 ring-blue-500 border-blue-500 shadow-lg" 
                : "hover:shadow-md"
            }`}
            onClick={() => handleTypeSelection("scout")}
          >
            <CardContent className="p-4 md:p-8 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              <h3 className="font-bold text-xl md:text-2xl text-blue-600 mb-3 md:mb-4">SOU SCOUT</h3>
              
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Descubra talentos verificados com dados objetivos. Use filtros avançados 
                e analytics para encontrar os próximos craques.
              </p>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span>Busca avançada com filtros específicos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Acesso a perfis verificados</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span>Relatórios e analytics detalhados</span>
                </div>
              </div>

              {localSelectedType === "scout" && (
                <div className="text-blue-500 font-semibold">✓ Selecionado</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 py-3"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!localSelectedType}
            className={`flex-1 text-white py-3 ${
              localSelectedType === "athlete" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Continuar
          </Button>
        </div>

        <p className="text-xs md:text-sm text-gray-500 text-center mt-3 md:mt-4 px-2">
          Você será redirecionado para completar seu perfil após a seleção
        </p>
      </DialogContent>
    </Dialog>
  );
}
