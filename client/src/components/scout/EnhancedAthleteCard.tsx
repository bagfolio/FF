import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Eye, MapPin, Calendar, Users, Trophy, 
  Medal, Star, Crown, CheckCircle2, AlertCircle, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkillsDisplay } from './SkillsDisplay';
import VerificationBadge from '@/components/ui/verification-badge';
import { motion } from 'framer-motion';

type TrustLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

interface AthleteCardProps {
  athlete: {
    id: number;
    fullName: string;
    position: string;
    city: string;
    state: string;
    birthDate: string;
    currentTeam?: string;
    verificationLevel: TrustLevel;
    skillsAssessment?: any[];
    skillsVerified?: boolean;
    profilePicture?: string;
    highlightCount?: number;
    endorsementCount?: number;
  };
  viewMode: 'grid' | 'list';
  onViewProfile: (athleteId: number) => void;
}

const trustLevelBenefits: Record<TrustLevel, string[]> = {
  bronze: ["Perfil básico", "Auto-avaliação"],
  silver: ["Validado por treinador", "Maior visibilidade"],
  gold: ["Dados de liga oficial", "Estatísticas verificadas"],
  platinum: ["Combine Digital completo", "Máxima credibilidade"]
};

const trustLevelScores: Record<TrustLevel, number> = {
  bronze: 25,
  silver: 50,
  gold: 75,
  platinum: 100
};

export function EnhancedAthleteCard({ athlete, viewMode, onViewProfile }: AthleteCardProps) {
  const age = new Date().getFullYear() - new Date(athlete.birthDate).getFullYear();
  const initials = athlete.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Avatar */}
              <div className="relative">
                {athlete.profilePicture ? (
                  <img 
                    src={athlete.profilePicture} 
                    alt={athlete.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-verde-brasil to-verde-brasil/80 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{initials}</span>
                  </div>
                )}
                {/* Trust level indicator on avatar */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white",
                  athlete.verificationLevel === 'platinum' ? 'bg-purple-500' :
                  athlete.verificationLevel === 'gold' ? 'bg-yellow-500' :
                  athlete.verificationLevel === 'silver' ? 'bg-gray-400' :
                  'bg-orange-500'
                )}>
                  {athlete.verificationLevel === 'platinum' ? <Trophy className="w-3 h-3 text-white" /> :
                   athlete.verificationLevel === 'gold' ? <Crown className="w-3 h-3 text-white" /> :
                   athlete.verificationLevel === 'silver' ? <Star className="w-3 h-3 text-white" /> :
                   <Medal className="w-3 h-3 text-white" />}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-verde-brasil transition-colors">
                    {athlete.fullName}
                  </h3>
                  <VerificationBadge level={athlete.verificationLevel} size="sm" />
                  
                  {/* Trust Score Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
                      athlete.verificationLevel === 'platinum' ? 'bg-purple-100 text-purple-700' :
                      athlete.verificationLevel === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                      athlete.verificationLevel === 'silver' ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700 animate-pulse'
                    )}
                  >
                    <Shield className="w-3 h-3" />
                    <span>{trustLevelScores[athlete.verificationLevel]}% Confiável</span>
                  </motion.div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="font-medium">{athlete.position}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {athlete.city}, {athlete.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {age} anos
                  </span>
                  {athlete.currentTeam && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {athlete.currentTeam}
                    </span>
                  )}
                </div>

                {/* Skills preview */}
                <SkillsDisplay 
                  skills={athlete.skillsAssessment} 
                  verified={athlete.skillsVerified || false}
                  trustLevel={athlete.verificationLevel}
                  compact={true}
                  highlightBest={false}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 items-end">
              <Button 
                onClick={() => onViewProfile(athlete.id)}
                className="bg-verde-brasil hover:bg-verde-brasil/90"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Perfil
              </Button>
              
              {/* Quick stats */}
              <div className="flex gap-3 text-xs text-gray-500">
                {athlete.highlightCount && athlete.highlightCount > 0 && (
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {athlete.highlightCount}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{athlete.highlightCount} vídeos de destaque</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {athlete.endorsementCount && athlete.endorsementCount > 0 && (
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {athlete.endorsementCount}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{athlete.endorsementCount} recomendações</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      {/* Trust level gradient border effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        athlete.verificationLevel === 'platinum' ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20' :
        athlete.verificationLevel === 'gold' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20' :
        athlete.verificationLevel === 'silver' ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/20' :
        'bg-gradient-to-br from-orange-500/20 to-orange-600/20'
      )} />
      
      {/* Unverified data warning overlay */}
      {athlete.verificationLevel === 'bronze' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 z-10"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-medium">Dados não verificados</p>
              <p className="text-xs text-gray-600">Informações auto-declaradas pelo atleta</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
      
      <CardContent className="relative p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="relative inline-block mb-3">
            {athlete.profilePicture ? (
              <img 
                src={athlete.profilePicture} 
                alt={athlete.fullName}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-verde-brasil to-verde-brasil/80 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">{initials}</span>
              </div>
            )}
            {/* Trust level badge */}
            <div className={cn(
              "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg",
              athlete.verificationLevel === 'platinum' ? 'bg-purple-500' :
              athlete.verificationLevel === 'gold' ? 'bg-yellow-500' :
              athlete.verificationLevel === 'silver' ? 'bg-gray-400' :
              'bg-orange-500'
            )}>
              {athlete.verificationLevel === 'platinum' ? <Trophy className="w-4 h-4 text-white" /> :
               athlete.verificationLevel === 'gold' ? <Crown className="w-4 h-4 text-white" /> :
               athlete.verificationLevel === 'silver' ? <Star className="w-4 h-4 text-white" /> :
               <Medal className="w-4 h-4 text-white" />}
            </div>
          </div>

          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-verde-brasil transition-colors">
            {athlete.fullName}
          </h3>
          <p className="text-gray-600">{athlete.position}</p>
          
          <div className="mt-2 space-y-2">
            <VerificationBadge level={athlete.verificationLevel} size="sm" />
            
            {/* Prominent Trust Score */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
                athlete.verificationLevel === 'platinum' ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                athlete.verificationLevel === 'gold' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                athlete.verificationLevel === 'silver' ? 'bg-gray-100 text-gray-700 border border-gray-300' :
                'bg-orange-100 text-orange-700 border border-orange-300'
              )}
            >
              <Shield className="w-4 h-4" />
              <span>{trustLevelScores[athlete.verificationLevel]}%</span>
              <span className="font-normal text-xs">Confiável</span>
            </motion.div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Idade:</span>
            <span className="font-medium">{age} anos</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Local:</span>
            <span className="font-medium">{athlete.city}, {athlete.state}</span>
          </div>
          {athlete.currentTeam && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Time:</span>
              <span className="font-medium truncate ml-2">{athlete.currentTeam}</span>
            </div>
          )}
        </div>

        {/* Trust Benefits */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mb-4 p-2 rounded-lg bg-gray-50 border border-gray-200 cursor-help">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <AlertCircle className="w-3 h-3" />
                <span className="font-medium">Benefícios do nível {athlete.verificationLevel === 'bronze' ? 'Bronze' : athlete.verificationLevel === 'silver' ? 'Prata' : athlete.verificationLevel === 'gold' ? 'Ouro' : 'Platina'}</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <ul className="text-sm space-y-1">
              {trustLevelBenefits[athlete.verificationLevel].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>

        {/* Skills Display */}
        <div className="border-t pt-4">
          <SkillsDisplay 
            skills={athlete.skillsAssessment} 
            verified={athlete.skillsVerified || false}
            trustLevel={athlete.verificationLevel}
            compact={true}
            highlightBest={true}
          />
        </div>

        {/* Action Button */}
        <Button 
          className="w-full mt-4 bg-verde-brasil hover:bg-verde-brasil/90 group-hover:shadow-lg transition-all"
          onClick={() => onViewProfile(athlete.id)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Perfil Completo
        </Button>
      </CardContent>
    </Card>
  );
}