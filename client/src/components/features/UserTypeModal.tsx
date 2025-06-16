import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Terminal, Search, Trophy, Users, BarChart3, Eye } from "lucide-react";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: "athlete" | "scout" | null;
}

export default function UserTypeModal({ isOpen, onClose, selectedType }: UserTypeModalProps) {
  const [localSelectedType, setLocalSelectedType] = useState<"athlete" | "scout" | null>(selectedType);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setUserType = useMutation({
    mutationFn: async (userType: "athlete" | "scout") => {
      // First login to get authenticated
      window.location.href = "/api/login";
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        // Redirect to login
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleTypeSelection = (type: "athlete" | "scout") => {
    setLocalSelectedType(type);
  };

  const handleContinue = () => {
    if (localSelectedType) {
      // Store the selected type in localStorage to use after login
      localStorage.setItem("pendingUserType", localSelectedType);
      setUserType.mutate(localSelectedType);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-bebas text-3xl azul-celeste text-center">
            ESCOLHA SEU PERFIL
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Como você gostaria de usar o Futebol Futuro?
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Athlete Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              localSelectedType === "athlete" 
                ? "ring-2 ring-verde-brasil border-verde-brasil shadow-lg" 
                : "hover:shadow-md"
            }`}
            onClick={() => handleTypeSelection("athlete")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-verde-brasil rounded-full flex items-center justify-center mx-auto mb-6">
                <Terminal className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="font-bebas text-2xl azul-celeste mb-4">SOU ATLETA</h3>
              
              <p className="text-gray-600 mb-6">
                Mostre seu talento para o mundo. Crie seu perfil, faça testes verificados por IA 
                e seja descoberto por scouts profissionais.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Trophy className="w-4 h-4 verde-brasil" />
                  <span>Testes físicos verificados por IA</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="w-4 h-4 verde-brasil" />
                  <span>Estatísticas e métricas detalhadas</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Eye className="w-4 h-4 verde-brasil" />
                  <span>Visibilidade para scouts e clubes</span>
                </div>
              </div>

              {localSelectedType === "athlete" && (
                <div className="text-verde-brasil font-semibold">✓ Selecionado</div>
              )}
            </CardContent>
          </Card>

          {/* Scout Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              localSelectedType === "scout" 
                ? "ring-2 ring-azul-celeste border-azul-celeste shadow-lg" 
                : "hover:shadow-md"
            }`}
            onClick={() => handleTypeSelection("scout")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-azul-celeste rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="font-bebas text-2xl azul-celeste mb-4">SOU SCOUT</h3>
              
              <p className="text-gray-600 mb-6">
                Descubra talentos verificados com dados objetivos. Use filtros avançados 
                e analytics para encontrar os próximos craques.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Search className="w-4 h-4 azul-celeste" />
                  <span>Busca avançada com filtros específicos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 azul-celeste" />
                  <span>Acesso a perfis verificados</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="w-4 h-4 azul-celeste" />
                  <span>Relatórios e analytics detalhados</span>
                </div>
              </div>

              {localSelectedType === "scout" && (
                <div className="text-azul-celeste font-semibold">✓ Selecionado</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!localSelectedType || setUserType.isPending}
            className={`flex-1 text-white ${
              localSelectedType === "athlete" ? "btn-primary" : "bg-azul-celeste hover:bg-blue-800"
            }`}
          >
            {setUserType.isPending ? "Redirecionando..." : "Continuar"}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Você será redirecionado para fazer login e depois poderá completar seu perfil
        </p>
      </DialogContent>
    </Dialog>
  );
}
