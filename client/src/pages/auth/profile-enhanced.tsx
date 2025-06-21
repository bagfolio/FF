import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brazilianCities } from "@/lib/brazilianData";
import { Camera, Upload, Trophy, Shield, Star } from "lucide-react";
import { ProgressJourney } from "@/components/features/auth/ProgressJourney";
import SoundController from "@/components/features/auth/SoundController";
import CulturalTooltips from "@/components/features/auth/CulturalTooltips";
import PlayerCard3D from "@/components/3d/PlayerCard3D";
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';

const profileSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(150).optional(),
  photo: z.string().optional(),
  favoriteClub: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Brazilian clubs
const brazilianClubs = [
  { id: "flamengo", name: "Flamengo", colors: ["#FF0000", "#000000"] },
  { id: "corinthians", name: "Corinthians", colors: ["#000000", "#FFFFFF"] },
  { id: "palmeiras", name: "Palmeiras", colors: ["#006437", "#FFFFFF"] },
  { id: "saopaulo", name: "São Paulo", colors: ["#FF0000", "#FFFFFF", "#000000"] },
  { id: "santos", name: "Santos", colors: ["#000000", "#FFFFFF"] },
  { id: "gremio", name: "Grêmio", colors: ["#0099CC", "#000000", "#FFFFFF"] },
  { id: "internacional", name: "Internacional", colors: ["#FF0000", "#FFFFFF"] },
  { id: "cruzeiro", name: "Cruzeiro", colors: ["#0000FF", "#FFFFFF"] },
  { id: "atleticomg", name: "Atlético-MG", colors: ["#000000", "#FFFFFF"] },
  { id: "fluminense", name: "Fluminense", colors: ["#8B0000", "#006400", "#FFFFFF"] },
];

// Locker Room 3D Scene
function LockerRoomScene({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 60 }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 2, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <spotLight position={[5, 8, 5]} angle={0.3} penumbra={1} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="apartment" />
        
        {/* Fog for atmosphere */}
        <fog attach="fog" args={['#1a1a1a', 5, 20]} />
        
        {children}
      </Canvas>
    </div>
  );
}

export default function AuthProfileEnhanced() {
  const [, setLocation] = useLocation();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showJersey, setShowJersey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      city: "",
      state: "",
      photo: "",
      favoriteClub: "",
    },
  });

  const watchedValues = form.watch();
  const savedPosition = JSON.parse(localStorage.getItem("authPosition") || "{}");

  useEffect(() => {
    // Show jersey after form starts being filled
    if (watchedValues.fullName || watchedValues.city) {
      setShowJersey(true);
    }
  }, [watchedValues]);

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

  const handleContinue = (data: ProfileFormData) => {
    localStorage.setItem("authProfile", JSON.stringify(data));
    if (window.soundController) {
      window.soundController.playEffect('success');
    }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Locker Room Background */}
      <LockerRoomScene />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Progress Journey */}
      <div className="relative z-20">
        <ProgressJourney currentStep={1} totalSteps={4} />
      </div>

      {/* Sound Controller */}
      <SoundController variant="ambient" />

      {/* Cultural Tooltips */}
      <CulturalTooltips page="profile" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 text-center pt-32 pb-4"
      >
        <h1 className="font-bebas text-4xl md:text-6xl text-white mb-2">
          VESTIÁRIO DOS CAMPEÕES
        </h1>
        <p className="text-gray-300 text-lg font-medium">
          Prepare sua camisa para entrar em campo
        </p>
      </motion.div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
        {/* Jersey Preview - 3D */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: showJersey ? 1 : 0, x: showJersey ? 0 : -50 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1 sticky top-32"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h3 className="font-bebas text-2xl text-white mb-6 text-center">
              SUA CAMISA PERSONALIZADA
            </h3>
            
            {/* 3D Jersey Display */}
            <div className="h-96 rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-black">
              <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <PlayerCard3D
                  name={watchedValues.fullName || "SEU NOME"}
                  position={savedPosition.name}
                  number={savedPosition.number}
                  city={watchedValues.city || "CIDADE"}
                  state={watchedValues.state || "UF"}
                  photo={photoPreview || undefined}
                  isActive={true}
                />
              </Canvas>
            </div>

            {/* Club badges */}
            {watchedValues.favoriteClub && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className="text-gray-400 text-sm mb-2">Torcedor</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      background: `linear-gradient(45deg, ${
                        brazilianClubs.find(c => c.id === watchedValues.favoriteClub)?.colors[0] || '#000'
                      } 50%, ${
                        brazilianClubs.find(c => c.id === watchedValues.favoriteClub)?.colors[1] || '#fff'
                      } 50%)`
                    }}
                  />
                  <span className="text-white font-medium">
                    {brazilianClubs.find(c => c.id === watchedValues.favoriteClub)?.name}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Stats preview */}
            {watchedValues.fullName && watchedValues.birthDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid grid-cols-3 gap-4 text-center"
              >
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-3xl font-bebas text-amarelo-ouro">
                    {calculateAge(watchedValues.birthDate)}
                  </p>
                  <p className="text-xs text-gray-400">Anos</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-3xl font-bebas text-verde-brasil">
                    {watchedValues.height || "--"}
                  </p>
                  <p className="text-xs text-gray-400">cm</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-3xl font-bebas text-azul-celeste">
                    {watchedValues.weight || "--"}
                  </p>
                  <p className="text-xs text-gray-400">kg</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="order-1 lg:order-2"
        >
          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <div className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
                  {/* Photo Upload with preview */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-32 h-32 mx-auto mb-4 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-full border-4 border-amarelo-ouro"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 rounded-full border-4 border-dashed border-gray-500 flex items-center justify-center hover:border-amarelo-ouro transition-colors">
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-amarelo-ouro rounded-full p-2">
                          <Upload className="w-4 h-4 text-black" />
                        </div>
                      </motion.div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-400">Clique para adicionar sua foto</p>
                  </div>

                  {/* Name with animation */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-bebas text-lg">
                          Nome Completo
                        </FormLabel>
                        <FormControl>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input 
                              {...field} 
                              placeholder="Digite seu nome de craque"
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-lg font-medium"
                            />
                          </motion.div>
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
                        <FormLabel className="text-white font-bebas text-lg">
                          Data de Nascimento
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location with Brazilian style */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-bebas text-lg">Cidade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                          <FormLabel className="text-white font-bebas text-lg">Estado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
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

                  {/* Physical Stats with visual indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-bebas text-lg">
                            Altura (cm)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="175"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <motion.div
                                  animate={{ scale: field.value ? [1, 1.2, 1] : 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  📏
                                </motion.div>
                              </div>
                            </div>
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
                          <FormLabel className="text-white font-bebas text-lg">
                            Peso (kg)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="70"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <motion.div
                                  animate={{ scale: field.value ? [1, 1.2, 1] : 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  ⚖️
                                </motion.div>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Favorite Club */}
                  <FormField
                    control={form.control}
                    name="favoriteClub"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-bebas text-lg">
                          Time do Coração (Opcional)
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Escolha seu clube" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brazilianClubs.map((club) => (
                              <SelectItem key={club.id} value={club.id}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{
                                      background: `linear-gradient(45deg, ${club.colors[0]} 50%, ${club.colors[1]} 50%)`
                                    }}
                                  />
                                  {club.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full btn-primary py-6 text-xl font-bebas tracking-wider rounded-full shadow-2xl"
                  >
                    CONTINUAR PARA O CAMPO DE TREINO
                  </Button>
                </form>
              </Form>
            </div>
          </Card>

          {/* Motivational badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-center gap-4"
          >
            {[
              { icon: Trophy, text: "Futuro Craque" },
              { icon: Shield, text: "Talento Brasileiro" },
              { icon: Star, text: "Próxima Geração" }
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10"
              >
                <badge.icon className="w-4 h-4 text-amarelo-ouro" />
                <span className="text-xs text-white font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}