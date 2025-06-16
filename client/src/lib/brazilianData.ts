// Realistic Brazilian data for mock content
import { Trophy, Zap, Star, Flame, Medal, Target, Award, TrendingUp, Crown } from "lucide-react";

export const brazilianNames = {
  first: [
    "Gabriel", "Lucas", "João", "Pedro", "Matheus", "Carlos", "Rafael", 
    "Bruno", "Felipe", "Thiago", "Vinícius", "Eduardo", "Guilherme",
    "Leonardo", "Henrique", "Diego", "Gustavo", "Daniel", "Rodrigo",
    "Fernando", "Arthur", "André", "José", "Paulo", "Caio", "Enzo",
    "Miguel", "Davi", "Nicolas", "Samuel", "Pietro", "Heitor"
  ],
  last: [
    "Silva", "Santos", "Oliveira", "Souza", "Lima", "Costa", "Ferreira",
    "Alves", "Pereira", "Rodrigues", "Almeida", "Nascimento", "Carvalho",
    "Araújo", "Ribeiro", "Fernandes", "Gomes", "Martins", "Barros",
    "Freitas", "Barbosa", "Rocha", "Cardoso", "Mendes", "Moreira",
    "Nunes", "Vieira", "Monteiro", "Moura", "Cavalcanti", "Dias"
  ]
};

export const brazilianCities = [
  { city: "São Paulo", state: "SP", region: "Sudeste" },
  { city: "Rio de Janeiro", state: "RJ", region: "Sudeste" },
  { city: "Salvador", state: "BA", region: "Nordeste" },
  { city: "Brasília", state: "DF", region: "Centro-Oeste" },
  { city: "Fortaleza", state: "CE", region: "Nordeste" },
  { city: "Belo Horizonte", state: "MG", region: "Sudeste" },
  { city: "Manaus", state: "AM", region: "Norte" },
  { city: "Curitiba", state: "PR", region: "Sul" },
  { city: "Recife", state: "PE", region: "Nordeste" },
  { city: "Porto Alegre", state: "RS", region: "Sul" },
  { city: "Goiânia", state: "GO", region: "Centro-Oeste" },
  { city: "Belém", state: "PA", region: "Norte" },
  { city: "Guarulhos", state: "SP", region: "Sudeste" },
  { city: "Campinas", state: "SP", region: "Sudeste" },
  { city: "São Luís", state: "MA", region: "Nordeste" },
  { city: "Maceió", state: "AL", region: "Nordeste" },
  { city: "Natal", state: "RN", region: "Nordeste" },
  { city: "Campo Grande", state: "MS", region: "Centro-Oeste" },
  { city: "Teresina", state: "PI", region: "Nordeste" },
  { city: "João Pessoa", state: "PB", region: "Nordeste" },
  { city: "Osasco", state: "SP", region: "Sudeste" },
  { city: "Santo André", state: "SP", region: "Sudeste" },
  { city: "São Bernardo", state: "SP", region: "Sudeste" },
  { city: "Ribeirão Preto", state: "SP", region: "Sudeste" },
  { city: "Niterói", state: "RJ", region: "Sudeste" },
  { city: "Florianópolis", state: "SC", region: "Sul" },
  { city: "Santos", state: "SP", region: "Sudeste" },
  { city: "Vitória", state: "ES", region: "Sudeste" },
  { city: "Londrina", state: "PR", region: "Sul" },
  { city: "Joinville", state: "SC", region: "Sul" }
];

export const youthTeams = [
  "Flamengo Sub-17", "Santos FC Juvenil", "São Paulo FC Sub-15", "Palmeiras Sub-20",
  "Corinthians Sub-17", "Grêmio Juvenil", "Internacional Sub-15", "Cruzeiro Sub-17",
  "Atlético-MG Sub-20", "Vasco Sub-17", "Botafogo Juvenil", "Fluminense Sub-15",
  "Sport Recife Sub-17", "Bahia Juvenil", "Fortaleza Sub-15", "Ceará Sub-17",
  "Athletico-PR Sub-20", "Coritiba Juvenil", "Chapecoense Sub-17", "América-MG Sub-15",
  "Escolinha Pelé - Santos", "Academia Zico", "CT do Caju", "Projeto Futuro",
  "Escolinha Barcelona SP", "Real Brasília FC", "Desportivo Brasil", "Audax Rio",
  "Red Bull Bragantino Sub-17", "Ponte Preta Juvenil", "Guarani Sub-15"
];

export const positions = {
  "Goleiro": { abbr: "GOL", color: "bg-yellow-500" },
  "Zagueiro": { abbr: "ZAG", color: "bg-blue-600" },
  "Lateral Direito": { abbr: "LD", color: "bg-green-600" },
  "Lateral Esquerdo": { abbr: "LE", color: "bg-green-600" },
  "Volante": { abbr: "VOL", color: "bg-purple-600" },
  "Meio-campo": { abbr: "MC", color: "bg-indigo-600" },
  "Meia-atacante": { abbr: "MEI", color: "bg-orange-600" },
  "Ponta Direita": { abbr: "PD", color: "bg-red-600" },
  "Ponta Esquerda": { abbr: "PE", color: "bg-red-600" },
  "Atacante": { abbr: "ATA", color: "bg-red-700" },
  "Centroavante": { abbr: "CA", color: "bg-red-800" }
};

// Realistic performance metrics by age group
export const performanceMetrics = {
  speed20m: {
    // Times in seconds for 20m sprint
    sub15: { excellent: 2.85, good: 3.05, average: 3.25 },
    sub17: { excellent: 2.75, good: 2.95, average: 3.15 },
    sub20: { excellent: 2.65, good: 2.85, average: 3.05 }
  },
  agility5_10_5: {
    // Times in seconds for 5-10-5 agility test
    sub15: { excellent: 4.8, good: 5.2, average: 5.6 },
    sub17: { excellent: 4.5, good: 4.9, average: 5.3 },
    sub20: { excellent: 4.2, good: 4.6, average: 5.0 }
  },
  verticalJump: {
    // Height in cm
    sub15: { excellent: 45, good: 38, average: 32 },
    sub17: { excellent: 52, good: 45, average: 38 },
    sub20: { excellent: 60, good: 52, average: 45 }
  }
};

// Recent activities for feed
export const recentActivities = [
  {
    type: "view",
    template: "Seu perfil foi visualizado por um scout do {club}",
    clubs: ["Santos FC", "Palmeiras", "São Paulo FC", "Flamengo", "Corinthians", "Cruzeiro", "Atlético-MG"]
  },
  {
    type: "achievement",
    template: "Conquista desbloqueada: {achievement}",
    achievements: ["Primeiro Teste", "Velocista", "Perfil Completo", "Destaque da Semana", "Top 10% Regional"]
  },
  {
    type: "test",
    template: "Novo teste disponível: {test}",
    tests: ["Resistência Aeróbica", "Coordenação Motora", "Flexibilidade", "Força Explosiva", "Precisão de Passes"]
  },
  {
    type: "update",
    template: "{player} da sua região atualizou suas métricas",
    players: ["João Silva", "Pedro Santos", "Lucas Oliveira", "Gabriel Ferreira"]
  },
  {
    type: "rank",
    template: "Você subiu para o {percentile}º percentil em {skill}",
    skills: ["velocidade", "agilidade", "controle de bola", "finalização", "passe longo"]
  }
];

// Achievements
export const achievements = [
  {
    id: "first_test",
    name: "Primeiros Passos",
    description: "Complete seu primeiro teste verificado",
    icon: Target,
    points: 100,
    color: "from-green-400 to-green-600"
  },
  {
    id: "speed_demon",
    name: "Relâmpago",
    description: "Entre no top 10% de velocidade da sua idade",
    icon: Zap,
    points: 500,
    color: "from-yellow-400 to-orange-500"
  },
  {
    id: "complete_profile",
    name: "Profissional",
    description: "Complete 100% do seu perfil",
    icon: Star,
    points: 200,
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "week_streak",
    name: "Dedicação",
    description: "Treine por 7 dias consecutivos",
    icon: Flame,
    points: 300,
    color: "from-red-400 to-red-600"
  },
  {
    id: "verified_gold",
    name: "Ouro Olímpico",
    description: "Alcance o nível Ouro de verificação",
    icon: Crown,
    points: 1000,
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: "team_player",
    name: "Trabalho em Equipe",
    description: "Receba 5 endossos de treinadores",
    icon: Award,
    points: 400,
    color: "from-purple-400 to-purple-600"
  },
  {
    id: "rising_star",
    name: "Estrela em Ascensão",
    description: "Seja visualizado por 10 olheiros",
    icon: TrendingUp,
    points: 600,
    color: "from-pink-400 to-pink-600"
  },
  {
    id: "champion",
    name: "Campeão",
    description: "Alcance o top 5% nacional",
    icon: Trophy,
    points: 1500,
    color: "from-indigo-400 to-indigo-600"
  },
  {
    id: "verified_athlete",
    name: "Atleta Verificado",
    description: "Complete todos os testes do Combine Digital",
    icon: Medal,
    points: 800,
    color: "from-teal-400 to-teal-600"
  }
];

// Utility functions
export function generateRealisticAthlete() {
  const firstName = brazilianNames.first[Math.floor(Math.random() * brazilianNames.first.length)];
  const lastName = brazilianNames.last[Math.floor(Math.random() * brazilianNames.last.length)];
  const location = brazilianCities[Math.floor(Math.random() * brazilianCities.length)];
  const position = Object.keys(positions)[Math.floor(Math.random() * Object.keys(positions).length)];
  const team = youthTeams[Math.floor(Math.random() * youthTeams.length)];
  const age = 14 + Math.floor(Math.random() * 6); // 14-19 years
  
  // Generate realistic metrics based on age
  const ageGroup = age < 15 ? "sub15" : age < 17 ? "sub17" : "sub20";
  const metrics = performanceMetrics.speed20m[ageGroup];
  const speed = (metrics.excellent + (Math.random() * (metrics.average - metrics.excellent))).toFixed(2);
  
  const verificationLevels = ["bronze", "bronze", "silver", "silver", "gold", "platinum"];
  const verificationLevel = verificationLevels[Math.floor(Math.random() * verificationLevels.length)];
  
  return {
    fullName: `${firstName} ${lastName}`,
    position,
    city: location.city,
    state: location.state,
    age,
    team,
    speed20m: parseFloat(speed),
    verificationLevel,
    profileViews: Math.floor(Math.random() * 500) + 50,
    percentile: Math.floor(Math.random() * 30) + 70,
    // Additional performance metrics
    speed: Math.floor(Math.random() * 30) + 70,
    agility: Math.floor(Math.random() * 30) + 65,
    technique: Math.floor(Math.random() * 30) + 60,
    endurance: Math.floor(Math.random() * 30) + 65
  };
}

export function generateActivity() {
  const activityType = recentActivities[Math.floor(Math.random() * recentActivities.length)];
  let message = activityType.template;
  
  switch (activityType.type) {
    case "view":
      const club = activityType.clubs![Math.floor(Math.random() * activityType.clubs!.length)];
      message = message.replace("{club}", club);
      break;
    case "achievement":
      const achievement = activityType.achievements![Math.floor(Math.random() * activityType.achievements!.length)];
      message = message.replace("{achievement}", achievement);
      break;
    case "test":
      const test = activityType.tests![Math.floor(Math.random() * activityType.tests!.length)];
      message = message.replace("{test}", test);
      break;
    case "update":
      const player = activityType.players![Math.floor(Math.random() * activityType.players!.length)];
      message = message.replace("{player}", player);
      break;
    case "rank":
      const percentile = 70 + Math.floor(Math.random() * 29);
      const skill = activityType.skills![Math.floor(Math.random() * activityType.skills!.length)];
      message = message.replace("{percentile}", percentile.toString()).replace("{skill}", skill);
      break;
  }
  
  const timeAgo = [
    "2 minutos atrás",
    "15 minutos atrás",
    "1 hora atrás",
    "3 horas atrás",
    "ontem",
    "2 dias atrás",
    "3 dias atrás"
  ];
  
  return {
    message,
    time: timeAgo[Math.floor(Math.random() * timeAgo.length)],
    type: activityType.type
  };
}