import { useState, useRef } from "react";
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
import { Camera, Upload, Sparkles } from "lucide-react";

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

// Brazilian clubs for selection
const brazilianClubs = [
  { name: "Flamengo", color: "from-red-600 to-black" },
  { name: "Corinthians", color: "from-black to-white" },
  { name: "Palmeiras", color: "from-green-600 to-green-800" },
  { name: "São Paulo", color: "from-red-600 to-white" },
  { name: "Santos", color: "from-white to-black" },
  { name: "Cruzeiro", color: "from-blue-600 to-white" },
  { name: "Grêmio", color: "from-blue-400 to-black" },
  { name: "Internacional", color: "from-red-600 to-white" },
  { name: "Vasco", color: "from-black to-white" },
  { name: "Botafogo", color: "from-black to-gray-400" },
];

export default function AuthProfile() {
  const [, setLocation] = useLocation();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [selectedClub, setSelectedClub] = useState(brazilianClubs[0]);
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
    localStorage.setItem("authProfile", JSON.stringify({ ...data, club: selectedClub.name }));
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Locker room atmosphere */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" opacity="0.02"><path d="M0 10h40M10 0v40M0 20h40M20 0v40M0 30h40M30 0v40"/></g></svg>')}")`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Ambient light effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center pt-8 pb-4"
      >
        <h1 className="font-bebas text-5xl md:text-7xl text-white mb-2 tracking-wider">
          CRIE SUA CAMISA
        </h1>
        <p className="text-white/80 text-xl font-medium">
          No vestiário dos campeões, personalize sua identidade
        </p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-verde-brasil rounded-full" />
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        {/* Live Card Preview - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="sticky top-8">
            <h3 className="font-bebas text-3xl text-white mb-6 text-center">
              SUA FIGURINHA AO VIVO
            </h3>
            
            {/* Football Card */}
            <motion.div
              className="mx-auto w-96 h-[520px] perspective-1000"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transformStyle: "preserve-3d",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className={`w-full h-full bg-gradient-to-br ${selectedClub.color} relative overflow-hidden shadow-2xl border-4 border-white`}>
                {/* Holographic Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-50" />
                
                {/* Moving Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />

                {/* Sparkle Effects */}
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                </div>

                <div className="p-6 h-full flex flex-col relative z-10">
                  {/* Club Badge Area */}
                  <div className="text-center mb-4">
                    <motion.div
                      key={selectedClub.name}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-block"
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/50">
                        <span className="font-bebas text-xl text-white">
                          {selectedClub.name.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Photo Section */}
                  <div className="flex-1 flex items-center justify-center mb-6">
                    {photoPreview ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                      >
                        <img
                          src={photoPreview}
                          alt="Player"
                          className="w-48 h-48 object-cover rounded-lg border-4 border-white shadow-2xl"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 to-transparent" />
                      </motion.div>
                    ) : (
                      <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-lg border-4 border-white/30 border-dashed flex items-center justify-center">
                        <Camera className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 space-y-3">
                    <motion.h3
                      key={watchedValues.fullName}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-bebas text-2xl text-black text-center tracking-wider"
                    >
                      {watchedValues.fullName || "SEU NOME"}
                    </motion.h3>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center">
                        <span className="text-gray-600 text-xs">Posição</span>
                        <p className="font-bebas text-lg text-black">
                          {savedPosition.name || "---"}
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-600 text-xs">Número</span>
                        <p className="font-bebas text-lg text-black">
                          {savedPosition.number || "--"}
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-600 text-xs">Idade</span>
                        <p className="font-bebas text-lg text-black">
                          {calculateAge(watchedValues.birthDate) || "--"}
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-600 text-xs">Cidade</span>
                        <p className="font-bebas text-lg text-black">
                          {watchedValues.city || "---"}
                        </p>
                      </div>
                    </div>

                    {/* Overall Rating */}
                    <div className="text-center pt-2 border-t border-gray-200">
                      <span className="text-gray-600 text-xs">Potencial</span>
                      <div className="flex justify-center items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-yellow-400 text-xl"
                          >
                            ⭐
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="font-bebas text-xl text-black">
                      {savedPosition.number || "0"}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Club Selector */}
            <div className="mt-6">
              <p className="text-white/80 text-center mb-3 font-medium">Escolha seu time:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {brazilianClubs.map((club) => (
                  <motion.button
                    key={club.name}
                    onClick={() => setSelectedClub(club)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedClub.name === club.name
                        ? 'bg-white text-black scale-110'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {club.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="bg-black/50 backdrop-blur-md border-white/20 shadow-2xl">
            <div className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
                  {/* Photo Upload */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 bg-white/10 border-2 border-dashed border-white/30 hover:border-verde-brasil hover:bg-white/20 transition-all text-white"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8" />
                        <span className="font-medium">
                          {photoPreview ? "Trocar Foto" : "Adicionar Sua Foto"}
                        </span>
                      </div>
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
                        <FormLabel className="text-white font-bebas text-lg">Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite seu nome completo"
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12 text-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Birth Date */}
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-bebas text-lg">Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="bg-white/10 border-white/30 text-white h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
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
                          <FormLabel className="text-white font-bebas text-lg">Cidade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/30 text-white h-12">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900 border-white/20">
                              {brazilianCities.map((city) => (
                                <SelectItem 
                                  key={city.city} 
                                  value={city.city}
                                  className="text-white hover:bg-white/10"
                                >
                                  {city.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
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
                              <SelectTrigger className="bg-white/10 border-white/30 text-white h-12">
                                <SelectValue placeholder="UF" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900 border-white/20">
                              {Array.from(new Set(brazilianCities.map(city => city.state))).map((state) => (
                                <SelectItem 
                                  key={state} 
                                  value={state}
                                  className="text-white hover:bg-white/10"
                                >
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
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
                          <FormLabel className="text-white font-bebas text-lg">Altura (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="175"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-bebas text-lg">Peso (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="70"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/80 hover:to-amarelo-ouro/80 text-white py-4 text-xl font-bebas tracking-wider rounded-full shadow-2xl hover:shadow-verde-brasil/50 transition-all duration-300 transform hover:scale-105"
                  >
                    CONTINUAR PARA O TREINO
                  </Button>
                </form>
              </Form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}