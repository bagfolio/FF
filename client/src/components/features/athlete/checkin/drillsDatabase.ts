export interface Drill {
  id: string;
  name: string;
  focusAreaId: string;
  xpValue: number;
}

export interface FocusArea {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const focusAreas: FocusArea[] = [
  {
    id: 'tecnica',
    name: 'Técnica',
    icon: '⚽',
    color: 'from-blue-500/20 to-blue-600/20',
    description: 'Controle, passes e finalização'
  },
  {
    id: 'velocidade',
    name: 'Velocidade',
    icon: '💨',
    color: 'from-orange-500/20 to-red-500/20',
    description: 'Explosão e agilidade'
  },
  {
    id: 'forca',
    name: 'Força',
    icon: '💪',
    color: 'from-purple-500/20 to-pink-500/20',
    description: 'Potência e resistência muscular'
  },
  {
    id: 'resistencia',
    name: 'Resistência',
    icon: '🏃',
    color: 'from-green-500/20 to-emerald-500/20',
    description: 'Condicionamento físico'
  },
  {
    id: 'tatico',
    name: 'Tático',
    icon: '🧠',
    color: 'from-yellow-500/20 to-amber-500/20',
    description: 'Inteligência de jogo'
  },
  {
    id: 'mental',
    name: 'Mental',
    icon: '🎯',
    color: 'from-indigo-500/20 to-violet-500/20',
    description: 'Foco e mentalidade'
  }
];

export const drillsByFocusArea: Record<string, Drill[]> = {
  tecnica: [
    { id: 'tc1', name: 'Controle de bola', focusAreaId: 'tecnica', xpValue: 5 },
    { id: 'tc2', name: 'Passe curto', focusAreaId: 'tecnica', xpValue: 5 },
    { id: 'tc3', name: 'Passe longo', focusAreaId: 'tecnica', xpValue: 5 },
    { id: 'tc4', name: 'Finalização', focusAreaId: 'tecnica', xpValue: 8 },
    { id: 'tc5', name: 'Domínio orientado', focusAreaId: 'tecnica', xpValue: 6 },
    { id: 'tc6', name: 'Condução em velocidade', focusAreaId: 'tecnica', xpValue: 7 },
    { id: 'tc7', name: 'Cabeceio', focusAreaId: 'tecnica', xpValue: 6 },
    { id: 'tc8', name: 'Dribles e fintas', focusAreaId: 'tecnica', xpValue: 8 },
    { id: 'tc9', name: 'Bola parada', focusAreaId: 'tecnica', xpValue: 7 },
    { id: 'tc10', name: 'Cruzamentos', focusAreaId: 'tecnica', xpValue: 6 }
  ],
  velocidade: [
    { id: 'vl1', name: 'Tiros de 10m', focusAreaId: 'velocidade', xpValue: 6 },
    { id: 'vl2', name: 'Arranques explosivos', focusAreaId: 'velocidade', xpValue: 7 },
    { id: 'vl3', name: 'Mudança de direção', focusAreaId: 'velocidade', xpValue: 7 },
    { id: 'vl4', name: 'Escada de agilidade', focusAreaId: 'velocidade', xpValue: 5 },
    { id: 'vl5', name: 'Corrida com bola', focusAreaId: 'velocidade', xpValue: 8 },
    { id: 'vl6', name: 'Sprints intervalados', focusAreaId: 'velocidade', xpValue: 7 },
    { id: 'vl7', name: 'Zigue-zague com cones', focusAreaId: 'velocidade', xpValue: 6 },
    { id: 'vl8', name: 'Aceleração e desaceleração', focusAreaId: 'velocidade', xpValue: 6 },
    { id: 'vl9', name: 'Corrida em escada', focusAreaId: 'velocidade', xpValue: 5 },
    { id: 'vl10', name: 'Reação e explosão', focusAreaId: 'velocidade', xpValue: 8 }
  ],
  forca: [
    { id: 'fr1', name: 'Saltos verticais', focusAreaId: 'forca', xpValue: 6 },
    { id: 'fr2', name: 'Disputa de bola', focusAreaId: 'forca', xpValue: 7 },
    { id: 'fr3', name: 'Core/abdominais', focusAreaId: 'forca', xpValue: 5 },
    { id: 'fr4', name: 'Exercícios com peso', focusAreaId: 'forca', xpValue: 8 },
    { id: 'fr5', name: 'Pliometria', focusAreaId: 'forca', xpValue: 7 },
    { id: 'fr6', name: 'Agachamentos', focusAreaId: 'forca', xpValue: 6 },
    { id: 'fr7', name: 'Prancha e estabilização', focusAreaId: 'forca', xpValue: 5 },
    { id: 'fr8', name: 'Flexões e barras', focusAreaId: 'forca', xpValue: 6 },
    { id: 'fr9', name: 'Medicine ball', focusAreaId: 'forca', xpValue: 7 },
    { id: 'fr10', name: 'Elásticos de resistência', focusAreaId: 'forca', xpValue: 6 }
  ],
  resistencia: [
    { id: 'rs1', name: 'Corrida contínua', focusAreaId: 'resistencia', xpValue: 5 },
    { id: 'rs2', name: 'Intervalados', focusAreaId: 'resistencia', xpValue: 7 },
    { id: 'rs3', name: 'Circuito físico', focusAreaId: 'resistencia', xpValue: 8 },
    { id: 'rs4', name: 'Recuperação ativa', focusAreaId: 'resistencia', xpValue: 4 },
    { id: 'rs5', name: 'Fartlek', focusAreaId: 'resistencia', xpValue: 6 },
    { id: 'rs6', name: 'Cooper 12 minutos', focusAreaId: 'resistencia', xpValue: 7 },
    { id: 'rs7', name: 'Yo-yo test', focusAreaId: 'resistencia', xpValue: 8 },
    { id: 'rs8', name: 'Treino em ladeira', focusAreaId: 'resistencia', xpValue: 7 },
    { id: 'rs9', name: 'Natação/bike', focusAreaId: 'resistencia', xpValue: 5 },
    { id: 'rs10', name: 'Pequenos jogos', focusAreaId: 'resistencia', xpValue: 6 }
  ],
  tatico: [
    { id: 'tt1', name: 'Posicionamento', focusAreaId: 'tatico', xpValue: 8 },
    { id: 'tt2', name: 'Jogadas ensaiadas', focusAreaId: 'tatico', xpValue: 7 },
    { id: 'tt3', name: 'Transições', focusAreaId: 'tatico', xpValue: 8 },
    { id: 'tt4', name: 'Marcação pressão', focusAreaId: 'tatico', xpValue: 7 },
    { id: 'tt5', name: 'Saída de bola', focusAreaId: 'tatico', xpValue: 6 },
    { id: 'tt6', name: 'Coletivo posicional', focusAreaId: 'tatico', xpValue: 9 },
    { id: 'tt7', name: 'Situações de jogo', focusAreaId: 'tatico', xpValue: 8 },
    { id: 'tt8', name: 'Bola parada defensiva', focusAreaId: 'tatico', xpValue: 6 },
    { id: 'tt9', name: 'Contra-ataque', focusAreaId: 'tatico', xpValue: 7 },
    { id: 'tt10', name: 'Posse de bola', focusAreaId: 'tatico', xpValue: 7 }
  ],
  mental: [
    { id: 'mt1', name: 'Visualização', focusAreaId: 'mental', xpValue: 5 },
    { id: 'mt2', name: 'Análise de vídeo', focusAreaId: 'mental', xpValue: 6 },
    { id: 'mt3', name: 'Meditação esportiva', focusAreaId: 'mental', xpValue: 5 },
    { id: 'mt4', name: 'Definição de metas', focusAreaId: 'mental', xpValue: 4 },
    { id: 'mt5', name: 'Respiração consciente', focusAreaId: 'mental', xpValue: 4 },
    { id: 'mt6', name: 'Rotina pré-jogo', focusAreaId: 'mental', xpValue: 6 },
    { id: 'mt7', name: 'Controle emocional', focusAreaId: 'mental', xpValue: 7 },
    { id: 'mt8', name: 'Foco e concentração', focusAreaId: 'mental', xpValue: 6 },
    { id: 'mt9', name: 'Autoconfiança', focusAreaId: 'mental', xpValue: 5 },
    { id: 'mt10', name: 'Recuperação mental', focusAreaId: 'mental', xpValue: 5 }
  ]
};

// Helper function to get drill suggestions based on position
export const getDrillSuggestionsByPosition = (position: string): string[] => {
  const suggestions: Record<string, string[]> = {
    atacante: ['tc4', 'tc8', 'vl2', 'vl5', 'tt9'],
    meia: ['tc2', 'tc3', 'tc5', 'tt2', 'tt10'],
    lateral: ['vl3', 'rs2', 'tc10', 'tt3', 'fr5'],
    zagueiro: ['fr2', 'tc7', 'tt1', 'tt4', 'mt7'],
    goleiro: ['vl10', 'fr1', 'mt3', 'tt8', 'tc7']
  };
  
  return suggestions[position] || [];
};

// Helper function to calculate variety bonus
export const calculateVarietyBonus = (selectedAreas: string[]): number => {
  const varietyMultiplier = selectedAreas.length;
  return varietyMultiplier * 5; // 5 XP per different area trained
};

// Helper function to get time-based intensity
export const getIntensityFromTime = (minutes: number): 'leve' | 'moderado' | 'intenso' => {
  if (minutes <= 20) return 'leve';
  if (minutes <= 40) return 'moderado';
  return 'intenso';
};