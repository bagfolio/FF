import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brazilianCities } from "@/lib/brazilianData";
import { Camera, Upload } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(150).optional(),
  photo: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AuthProfile() {
  const [, setLocation] = useLocation();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      city: "",
      state: "",
      photo: "",
    },
  });

  const watchedValues = form.watch();
  const savedPosition = JSON.parse(localStorage.getItem("authPosition") || "{}");

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        form.setValue("photo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setCardTilt({
      x: (y - centerY) / 10,
      y: (centerX - x) / 10,
    });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const handleContinue = (data: ProfileFormData) => {
    // Save profile data
    localStorage.setItem("authProfile", JSON.stringify(data));
    setLocation("/auth/skills");
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro via-white to-cinza-claro relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-hexagon opacity-30" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center pt-8 pb-4"
      >
        <h1 className="font-bebas text-4xl md:text-6xl azul-celeste mb-2">
          CRIE SUA FIGURINHA
        </h1>
        <p className="text-cinza-medio text-lg font-medium">
          Monte seu cartão de jogador profissional
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-verde-brasil" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
        {/* Live Card Preview */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="order-2 lg:order-1"
        >
          <div className="sticky top-8">
            <h3 className="font-bebas text-2xl azul-celeste mb-4 text-center">
              PREVIEW DA FIGURINHA
            </h3>
            
            {/* Football Card */}
            <motion.div
              className="mx-auto w-80 h-96 perspective-1000"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transformStyle: "preserve-3d",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="w-full h-full bg-gradient-to-br from-azul-celeste via-verde-brasil to-amarelo-ouro relative overflow-hidden shadow-2xl">
                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-60" />
                
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />

                <CardContent className="p-4 h-full flex flex-col relative z-10">
                  {/* Photo Section */}
                  <div className="flex-1 flex items-center justify-center mb-4">
                    {photoPreview ? (
                      <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={photoPreview}
                        alt="Player"
                        className="w-40 h-40 object-cover rounded-lg border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-white/20 rounded-lg border-4 border-white border-dashed flex items-center justify-center">
                        <Camera className="w-12 h-12 text-white/60" />
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="bg-white/90 rounded-lg p-3 backdrop-blur-sm">
                    <motion.h3
                      key={watchedValues.fullName}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-bebas text-xl text-azul-celeste text-center mb-2 tracking-wider"
                    >
                      {watchedValues.fullName || "SEU NOME"}
                    </motion.h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-cinza-medio">Posição:</span>
                        <p className="font-bebas text-azul-celeste">
                          {savedPosition.name || "---"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-cinza-medio">Idade:</span>
                        <p className="font-bebas text-azul-celeste">
                          {calculateAge(watchedValues.birthDate) || "--"} anos
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-cinza-medio">Cidade:</span>
                        <p className="font-bebas text-azul-celeste text-xs">
                          {watchedValues.city || "---"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-cinza-medio">Estado:</span>
                        <p className="font-bebas text-azul-celeste">
                          {watchedValues.state || "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="absolute top-4 right-4 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="font-bebas text-sm text-azul-celeste">
                      {savedPosition.number || "0"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="order-1 lg:order-2"
        >
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
                  {/* Photo Upload */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-16 border-dashed border-2 hover:border-verde-brasil transition-colors"
                    >
                      <Upload className="w-6 h-6 mr-2" />
                      {photoPreview ? "Trocar Foto" : "Adicionar Sua Foto"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bebas text-lg">Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite seu nome completo"
                            className="text-lg font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Birth Date */}
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bebas text-lg">Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bebas text-lg">Cidade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brazilianCities.map((city) => (
                                <SelectItem key={city.city} value={city.city}>
                                  {city.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bebas text-lg">Estado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="UF" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from(new Set(brazilianCities.map(city => city.state))).map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Physical Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bebas text-lg">Altura (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="175"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bebas text-lg">Peso (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="70"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary py-3 text-lg font-bebas tracking-wider"
                  >
                    CONTINUAR JORNADA
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}