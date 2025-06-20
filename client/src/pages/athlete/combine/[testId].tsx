import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Clock, Zap, CheckCircle, Upload, Play, Info } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Test definitions with units and instructions
const testDefinitions: Record<string, any> = {
  // Speed tests
  speed_10m: {
    name: "Sprint 10 metros",
    unit: "segundos",
    icon: Zap,
    instructions: "Corra 10 metros o mais rápido possível. Use cronômetro preciso.",
    inputType: "number",
    step: "0.01",
    min: "1.0",
    max: "5.0",
    placeholder: "Ex: 1.72"
  },
  speed_20m: {
    name: "Sprint 20 metros",
    unit: "segundos",
    icon: Zap,
    instructions: "Corra 20 metros em velocidade máxima. Partida parada.",
    inputType: "number",
    step: "0.01",
    min: "2.0",
    max: "6.0",
    placeholder: "Ex: 2.76"
  },
  speed_40m: {
    name: "Sprint 40 metros",
    unit: "segundos",
    icon: Zap,
    instructions: "Sprint de 40 metros. Mantenha velocidade máxima.",
    inputType: "number",
    step: "0.01",
    min: "4.0",
    max: "10.0",
    placeholder: "Ex: 5.12"
  },
  // Agility tests
  agility_5_10_5: {
    name: "Teste 5-10-5",
    unit: "segundos",
    icon: Play,
    instructions: "Corra 5m para direita, 10m para esquerda, 5m para direita.",
    inputType: "number",
    step: "0.01",
    min: "3.0",
    max: "8.0",
    placeholder: "Ex: 4.85"
  },
  agility_illinois: {
    name: "Illinois Agility Test",
    unit: "segundos",
    icon: Play,
    instructions: "Complete o percurso de agilidade Illinois.",
    inputType: "number",
    step: "0.01",
    min: "12.0",
    max: "25.0",
    placeholder: "Ex: 15.8"
  },
  // Technical tests
  technical_juggling: {
    name: "Embaixadinhas",
    unit: "toques",
    icon: Play,
    instructions: "Conte quantos toques consecutivos você consegue fazer.",
    inputType: "number",
    step: "1",
    min: "1",
    max: "500",
    placeholder: "Ex: 87"
  },
  // Strength tests
  strength_vertical: {
    name: "Salto Vertical",
    unit: "cm",
    icon: Zap,
    instructions: "Meça a altura máxima do seu salto vertical.",
    inputType: "number",
    step: "1",
    min: "20",
    max: "100",
    placeholder: "Ex: 52"
  },
  strength_horizontal: {
    name: "Salto Horizontal",
    unit: "metros",
    icon: Zap,
    instructions: "Meça a distância do seu salto horizontal.",
    inputType: "number",
    step: "0.01",
    min: "1.0",
    max: "4.0",
    placeholder: "Ex: 2.45"
  }
};

export default function TestSubmissionPage() {
  const params = useParams();
  const testId = params.testId as string;
  const [, setLocation] = useLocation();
  
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Get test definition
  const test = testDefinitions[testId];
  
  // Fetch athlete data
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: athlete } = useQuery({ 
    queryKey: ["/api/athletes/me"],
    enabled: !!user 
  });
  
  // Submit test mutation
  const submitTestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit test');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      toast.success("Teste registrado com sucesso!");
      
      // Redirect after animation
      setTimeout(() => {
        setLocation('/athlete/combine?success=true');
      }, 2000);
    },
    onError: () => {
      toast.error("Erro ao registrar teste. Tente novamente.");
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!result || !athlete) return;
    
    setIsSubmitting(true);
    
    try {
      await submitTestMutation.mutateAsync({
        testType: testId,
        result: parseFloat(result),
        unit: test.unit,
        notes
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!test) {
    return (
      <EnhancedAthleteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="glass-morph border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-white/60">Teste não encontrado</p>
              <Button 
                className="mt-4"
                onClick={() => setLocation('/athlete/combine')}
              >
                Voltar ao Combine
              </Button>
            </CardContent>
          </Card>
        </div>
      </EnhancedAthleteLayout>
    );
  }
  
  const Icon = test.icon;
  
  return (
    <EnhancedAthleteLayout>
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="/athlete/dashboard" className="hover:text-azul-celeste">
                    Dashboard
                  </a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="/athlete/combine" className="hover:text-azul-celeste">
                    Combine Digital
                  </a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{test.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/athlete/combine')}
            className="mb-6 text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          {showSuccess ? (
            // Success Animation
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="font-bebas text-4xl text-white mb-2">TESTE REGISTRADO!</h2>
              <p className="text-white/60">Redirecionando para o Combine Digital...</p>
            </motion.div>
          ) : (
            <>
              {/* Test Header */}
              <Card className="glass-morph border-white/10 mb-6">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="font-bebas text-3xl text-white">
                        {test.name}
                      </CardTitle>
                      <p className="text-white/60 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        Registre seu resultado
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              {/* Instructions */}
              <Card className="glass-morph-blue border-blue-400/20 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">Instruções</p>
                      <p className="text-white/80 text-sm">{test.instructions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <Card className="glass-morph border-white/10">
                  <CardContent className="p-6 space-y-6">
                    {/* Result Input */}
                    <div>
                      <Label htmlFor="result" className="text-white mb-2">
                        Resultado ({test.unit})
                      </Label>
                      <Input
                        id="result"
                        type={test.inputType}
                        step={test.step}
                        min={test.min}
                        max={test.max}
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        placeholder={test.placeholder}
                        required
                        className="glass-morph border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                    
                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-white mb-2">
                        Observações (opcional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Condições do teste, como se sentiu, etc..."
                        rows={3}
                        className="glass-morph border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                    
                    {/* Video Upload Placeholder */}
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-white/40 mx-auto mb-3" />
                      <p className="text-white/60 mb-2">Upload de vídeo (em breve)</p>
                      <p className="text-white/40 text-sm">
                        Você poderá adicionar vídeos para verificação
                      </p>
                    </div>
                    
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!result || isSubmitting}
                      className="w-full bg-gradient-to-r from-verde-brasil to-green-600 hover:from-green-600 hover:to-verde-brasil"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Registrando...
                        </>
                      ) : (
                        'Registrar Resultado'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </>
          )}
        </div>
      </div>
    </EnhancedAthleteLayout>
  );
}