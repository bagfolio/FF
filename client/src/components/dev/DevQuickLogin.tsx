import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { 
  Loader2, 
  Zap, 
  X, 
  User, 
  Trophy,
  Search,
  Calendar,
  MapPin,
  Building,
  Star
} from 'lucide-react';

interface TestProfile {
  id: string;
  name: string;
  email: string;
  type: 'athlete' | 'scout';
  details: {
    age?: number;
    position?: string;
    team?: string;
    city?: string;
    rating?: number;
    organization?: string;
    role?: string;
    region?: string;
  };
}

const testProfiles: TestProfile[] = [
  // Athletes
  {
    id: 'athlete-1',
    name: 'João Silva',
    email: 'joao.silva@test.com',
    type: 'athlete',
    details: {
      age: 16,
      position: 'Atacante',
      team: 'Flamengo Sub-17',
      city: 'Rio de Janeiro',
      rating: 4.5
    }
  },
  {
    id: 'athlete-2',
    name: 'Carlos Santos',
    email: 'carlos.santos@test.com',
    type: 'athlete',
    details: {
      age: 19,
      position: 'Meio-Campo',
      team: 'Santos FC',
      city: 'Santos',
      rating: 4.8
    }
  },
  {
    id: 'athlete-3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@test.com',
    type: 'athlete',
    details: {
      age: 18,
      position: 'Zagueiro',
      team: 'Corinthians Sub-20',
      city: 'São Paulo',
      rating: 4.2
    }
  },
  {
    id: 'athlete-4',
    name: 'Rafael Costa',
    email: 'rafael.costa@test.com',
    type: 'athlete',
    details: {
      age: 17,
      position: 'Goleiro',
      team: 'Palmeiras Sub-17',
      city: 'São Paulo',
      rating: 4.6
    }
  },
  // Scouts
  {
    id: 'scout-1',
    name: 'Roberto Mendes',
    email: 'roberto.mendes@test.com',
    type: 'scout',
    details: {
      organization: 'Flamengo',
      role: 'Scout Principal',
      region: 'Rio de Janeiro'
    }
  },
  {
    id: 'scout-2',
    name: 'Ana Paula Silva',
    email: 'ana.silva@test.com',
    type: 'scout',
    details: {
      organization: 'Agência Elite Sports',
      role: 'Scout Regional',
      region: 'São Paulo'
    }
  },
  {
    id: 'scout-3',
    name: 'Fernando Lima',
    email: 'fernando.lima@test.com',
    type: 'scout',
    details: {
      organization: 'Santos FC',
      role: 'Coordenador de Base',
      region: 'Santos'
    }
  }
];

export function DevQuickLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Don't render in production
  if (import.meta.env.PROD) {
    return null;
  }

  const handleQuickLogin = async (profile: TestProfile) => {
    try {
      setIsLoading(true);
      setLoadingProfile(profile.id);

      const response = await api.post('/api/dev/quick-login', {
        profileId: profile.id
      });

      // Invalidate user query to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Small delay to ensure query cache is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      toast({
        title: 'Login realizado!',
        description: `Conectado como ${profile.name}`,
      });

      // Navigate using router instead of full page refresh
      setLocation(profile.type === 'athlete' 
        ? '/athlete/dashboard' 
        : '/scout/dashboard');
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: 'Verifique se o servidor está em modo desenvolvimento',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setLoadingProfile(null);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Zap className="w-6 h-6" />
      </motion.button>

      {/* Dev panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-black/90 backdrop-blur-xl border-l border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Dev Quick Login</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-white/70 text-sm mb-6">
                  Selecione um perfil de teste para login instantâneo. 
                  Disponível apenas em desenvolvimento.
                </p>

                <Tabs defaultValue="athlete" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger 
                      value="athlete"
                      className="data-[state=active]:bg-verde-brasil data-[state=active]:text-white"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Atletas
                    </TabsTrigger>
                    <TabsTrigger 
                      value="scout"
                      className="data-[state=active]:bg-azul-celeste data-[state=active]:text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Scouts
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="athlete" className="mt-6 space-y-3">
                    {testProfiles
                      .filter(p => p.type === 'athlete')
                      .map(profile => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          isLoading={isLoading && loadingProfile === profile.id}
                          onSelect={() => handleQuickLogin(profile)}
                        />
                      ))}
                  </TabsContent>

                  <TabsContent value="scout" className="mt-6 space-y-3">
                    {testProfiles
                      .filter(p => p.type === 'scout')
                      .map(profile => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          isLoading={isLoading && loadingProfile === profile.id}
                          onSelect={() => handleQuickLogin(profile)}
                        />
                      ))}
                  </TabsContent>
                </Tabs>

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-500 text-xs">
                    <strong>⚠️ Atenção:</strong> Este painel só funciona em ambiente de desenvolvimento. 
                    Certifique-se que NODE_ENV=development está configurado.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ProfileCardProps {
  profile: TestProfile;
  isLoading: boolean;
  onSelect: () => void;
}

function ProfileCard({ profile, isLoading, onSelect }: ProfileCardProps) {
  return (
    <Card 
      className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              profile.type === 'athlete' 
                ? 'bg-gradient-to-br from-verde-brasil to-amarelo-ouro' 
                : 'bg-gradient-to-br from-azul-celeste to-blue-600'
            }`}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold">{profile.name}</h4>
              <p className="text-white/50 text-sm">{profile.email}</p>
            </div>
          </div>
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Zap className="w-5 h-5 text-white/30" />
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {profile.type === 'athlete' && profile.details.age && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70">
              <Calendar className="w-3 h-3" />
              {profile.details.age} anos
            </span>
          )}
          {profile.details.position && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70">
              <Trophy className="w-3 h-3" />
              {profile.details.position}
            </span>
          )}
          {profile.details.team && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70">
              <Building className="w-3 h-3" />
              {profile.details.team}
            </span>
          )}
          {profile.details.organization && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70">
              <Building className="w-3 h-3" />
              {profile.details.organization}
            </span>
          )}
          {profile.details.city && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70">
              <MapPin className="w-3 h-3" />
              {profile.details.city}
            </span>
          )}
          {profile.details.rating && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70">
              <Star className="w-3 h-3" />
              {profile.details.rating}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}