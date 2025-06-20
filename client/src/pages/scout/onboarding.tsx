import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Search, Building, Phone, Mail, Briefcase } from "lucide-react";

const scoutSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  organization: z.string().min(2, "Organização é obrigatória"),
  position: z.string().min(2, "Cargo é obrigatório"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  bio: z.string().optional(),
});

export default function ScoutOnboarding() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof scoutSchema>>({
    resolver: zodResolver(scoutSchema),
    defaultValues: {
      fullName: "",
      organization: "",
      position: "",
      phone: "",
      email: "",
      bio: "",
    },
  });

  const createScout = useMutation({
    mutationFn: async (data: z.infer<typeof scoutSchema>) => {
      const response = await apiRequest("POST", "/api/auth/register/scout", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Perfil criado com sucesso!",
        description: "Bem-vindo ao Revela!",
      });
      setLocation("/scout/dashboard");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        });
        setLocation("/api/login");
      } else {
        toast({
          title: "Erro ao criar perfil",
          description: "Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof scoutSchema>) => {
    createScout.mutate(data);
  };

  const handleNext = () => {
    if (step === 1) {
      form.trigger(["fullName", "organization", "position"]).then((isValid) => {
        if (isValid) setStep(2);
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-morph-dark">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bebas text-center text-white">
            {step === 1 ? "INFORMAÇÕES PROFISSIONAIS" : "CONTATO E DETALHES"}
          </CardTitle>
          <p className="text-center text-gray-300 mt-2">
            Passo {step} de 2
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Nome Completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="João Silva"
                              className="pl-10 glass-morph text-white placeholder:text-gray-400"
                            />
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Organização/Clube</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Ex: Flamengo, CBF, Agência XYZ"
                              className="pl-10 glass-morph text-white placeholder:text-gray-400"
                            />
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Cargo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Scout, Diretor Técnico, Agente"
                            className="glass-morph text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Telefone (opcional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="(11) 98765-4321"
                              className="pl-10 glass-morph text-white placeholder:text-gray-400"
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email Profissional (opcional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="email"
                              placeholder="scout@clube.com.br"
                              className="pl-10 glass-morph text-white placeholder:text-gray-400"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Sobre Você (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Conte um pouco sobre sua experiência no futebol..."
                            className="glass-morph text-white placeholder:text-gray-400 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="glass-morph text-white border-white/20"
                  >
                    Voltar
                  </Button>
                )}
                
                {step < 2 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createScout.isPending}
                    className="ml-auto bg-green-500 hover:bg-green-600 text-white"
                  >
                    {createScout.isPending ? "Criando..." : "Criar Perfil"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}