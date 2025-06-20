import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Medal, Star, Crown, Trophy, CheckCircle, ArrowRight, Shield, Users, BarChart3, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustPyramidGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const levels = [
  {
    id: 'bronze',
    name: 'Bronze',
    icon: Medal,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    title: 'Auto-declarado',
    description: 'Dados inseridos pelo próprio atleta',
    requirements: [
      'Perfil básico completo',
      'Autoavaliação de habilidades',
      'Informações pessoais'
    ],
    benefits: [
      'Visibilidade básica para scouts',
      'Acesso ao painel do atleta',
      'Participação na plataforma'
    ]
  },
  {
    id: 'silver',
    name: 'Prata',
    icon: Star,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    title: 'Validado por Treinador',
    description: 'Habilidades confirmadas por treinador certificado',
    requirements: [
      'Endosso de treinador verificado',
      'Confirmação de habilidades',
      'Histórico de treinos'
    ],
    benefits: [
      'Badge de confiança',
      'Maior destaque nas buscas',
      'Credibilidade aumentada'
    ]
  },
  {
    id: 'gold',
    name: 'Ouro',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    title: 'Verificado por Liga',
    description: 'Estatísticas oficiais de competições',
    requirements: [
      'Dados de ligas parceiras',
      'Estatísticas de jogos oficiais',
      'Desempenho comprovado'
    ],
    benefits: [
      'Prioridade nos resultados',
      'Análises detalhadas',
      'Selo de verificação oficial'
    ]
  },
  {
    id: 'platinum',
    name: 'Platina',
    icon: Trophy,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    title: 'Combine Digital',
    description: 'Verificado por IA em testes padronizados',
    requirements: [
      'Todos os testes do Combine',
      'Verificação por IA',
      'Performance elite (top 10%)'
    ],
    benefits: [
      'Máxima credibilidade',
      'Acesso prioritário a scouts',
      'Relatórios premium de desempenho'
    ]
  }
];

export function TrustPyramidGuide({ open, onOpenChange }: TrustPyramidGuideProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-3xl">SISTEMA DE CONFIANÇA REVELA</DialogTitle>
          <DialogDescription className="text-base">
            Quanto maior seu nível de verificação, mais confiança os scouts terão em seus dados.
            Evolua na pirâmide completando requisitos e verificando suas habilidades.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Visual Pyramid */}
          <div className="relative h-64 flex items-end justify-center">
            <svg viewBox="0 0 400 240" className="absolute inset-0 w-full h-full">
              {/* Bronze - Base */}
              <path
                d="M 80 200 L 320 200 L 280 160 L 120 160 Z"
                className="fill-orange-100 stroke-orange-300"
                strokeWidth="2"
              />
              {/* Silver */}
              <path
                d="M 120 160 L 280 160 L 240 120 L 160 120 Z"
                className="fill-gray-100 stroke-gray-300"
                strokeWidth="2"
              />
              {/* Gold */}
              <path
                d="M 160 120 L 240 120 L 220 80 L 180 80 Z"
                className="fill-yellow-100 stroke-yellow-300"
                strokeWidth="2"
              />
              {/* Platinum */}
              <path
                d="M 180 80 L 220 80 L 200 40 Z"
                className="fill-purple-100 stroke-purple-300"
                strokeWidth="2"
              />
              
              {/* Icons */}
              <foreignObject x="185" y="170" width="30" height="30">
                <Medal className="w-6 h-6 text-orange-600" />
              </foreignObject>
              <foreignObject x="185" y="130" width="30" height="30">
                <Star className="w-6 h-6 text-gray-600" />
              </foreignObject>
              <foreignObject x="185" y="90" width="30" height="30">
                <Crown className="w-6 h-6 text-yellow-600" />
              </foreignObject>
              <foreignObject x="185" y="50" width="30" height="30">
                <Trophy className="w-6 h-6 text-purple-600" />
              </foreignObject>
            </svg>
          </div>

          {/* Level Details */}
          <div className="grid gap-4">
            {levels.map((level, index) => {
              const Icon = level.icon;
              return (
                <Card 
                  key={level.id}
                  className={cn(
                    "p-6 border-2 transition-all hover:shadow-lg",
                    level.borderColor
                  )}
                >
                  <div className="flex gap-6">
                    {/* Icon and Title */}
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center",
                        level.bgColor
                      )}>
                        <Icon className={cn("w-8 h-8", level.color)} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className={cn("font-bebas text-2xl", level.color)}>
                          {level.name.toUpperCase()} - {level.title}
                        </h3>
                        <p className="text-gray-600">{level.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Requisitos
                          </h4>
                          <ul className="space-y-1">
                            {level.requirements.map((req, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Benefícios
                          </h4>
                          <ul className="space-y-1">
                            {level.benefits.map((benefit, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* How it Works */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bebas text-xl text-blue-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              COMO EVOLUIR NA PIRÂMIDE
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-900">1</span>
                </div>
                <h4 className="font-semibold text-blue-900">Complete seu Perfil</h4>
                <p className="text-sm text-blue-700">
                  Adicione todas as informações básicas e faça a autoavaliação de habilidades
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-900">2</span>
                </div>
                <h4 className="font-semibold text-blue-900">Obtenha Validações</h4>
                <p className="text-sm text-blue-700">
                  Peça para seu treinador validar suas habilidades ou participe de ligas oficiais
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-900">3</span>
                </div>
                <h4 className="font-semibold text-blue-900">Complete o Combine</h4>
                <p className="text-sm text-blue-700">
                  Faça todos os testes do Combine Digital para máxima verificação
                </p>
              </div>
            </div>
          </Card>

          {/* Scout Trust */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bebas text-xl text-green-900 mb-2">POR QUE OS SCOUTS CONFIAM NO SISTEMA?</h3>
                <p className="text-green-700 mb-3">
                  Nosso sistema de verificação em camadas garante que os dados apresentados sejam 
                  confiáveis e verificados por múltiplas fontes, desde autoavaliações até 
                  medições precisas por IA.
                </p>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Transparência total sobre a fonte dos dados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Múltiplos níveis de verificação
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Integração com ligas e competições oficiais
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center pt-4">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-verde-brasil hover:bg-verde-brasil/90"
              size="lg"
            >
              Entendi, vamos evoluir!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}