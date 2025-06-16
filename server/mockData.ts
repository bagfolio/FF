// Mock data generator for development

export function generateRealisticAthlete() {
  const firstNames = [
    "Gabriel", "Lucas", "João", "Pedro", "Matheus", "Carlos", "Rafael", 
    "Bruno", "Felipe", "Thiago", "Vinícius", "Eduardo", "Guilherme",
    "Leonardo", "Henrique", "Diego", "Gustavo", "Daniel", "Rodrigo",
    "Fernando", "Arthur", "André", "José", "Paulo", "Caio", "Enzo"
  ];
  
  const lastNames = [
    "Silva", "Santos", "Oliveira", "Souza", "Lima", "Costa", "Ferreira",
    "Alves", "Pereira", "Rodrigues", "Almeida", "Nascimento", "Carvalho",
    "Araújo", "Ribeiro", "Fernandes", "Gomes", "Martins", "Barros"
  ];
  
  const cities = [
    { city: "São Paulo", state: "SP" },
    { city: "Rio de Janeiro", state: "RJ" },
    { city: "Salvador", state: "BA" },
    { city: "Brasília", state: "DF" },
    { city: "Fortaleza", state: "CE" },
    { city: "Belo Horizonte", state: "MG" },
    { city: "Curitiba", state: "PR" },
    { city: "Recife", state: "PE" },
    { city: "Porto Alegre", state: "RS" },
    { city: "Santos", state: "SP" },
    { city: "Campinas", state: "SP" },
    { city: "Guarulhos", state: "SP" }
  ];
  
  const positions = [
    "Goleiro", "Zagueiro", "Lateral Direito", "Lateral Esquerdo",
    "Volante", "Meio-campo", "Meia-atacante", "Ponta Direita",
    "Ponta Esquerda", "Atacante", "Centroavante"
  ];
  
  const teams = [
    "Flamengo Sub-17", "Santos FC Juvenil", "São Paulo FC Sub-15",
    "Palmeiras Sub-20", "Corinthians Sub-17", "Grêmio Juvenil",
    "Internacional Sub-15", "Cruzeiro Sub-17", "Atlético-MG Sub-20"
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const location = cities[Math.floor(Math.random() * cities.length)];
  const position = positions[Math.floor(Math.random() * positions.length)];
  const team = teams[Math.floor(Math.random() * teams.length)];
  const age = 14 + Math.floor(Math.random() * 6); // 14-19 years
  
  // Generate realistic metrics
  const speed20m = 2.65 + Math.random() * 0.6; // 2.65 - 3.25 seconds
  const verificationLevels = ["bronze", "bronze", "silver", "silver", "gold", "platinum"];
  const verificationLevel = verificationLevels[Math.floor(Math.random() * verificationLevels.length)];
  
  return {
    fullName: `${firstName} ${lastName}`,
    position,
    city: location.city,
    state: location.state,
    age,
    team,
    currentTeam: team,
    speed20m: parseFloat(speed20m.toFixed(2)),
    verificationLevel,
    profileViews: Math.floor(Math.random() * 500) + 50,
    percentile: Math.floor(Math.random() * 30) + 70,
    dominantFoot: ["right", "left", "both"][Math.floor(Math.random() * 3)],
    height: 160 + Math.floor(Math.random() * 30), // 160-190cm
    weight: 50 + Math.floor(Math.random() * 30), // 50-80kg
  };
}

export function generateMockAthletes(count: number = 20) {
  return Array.from({ length: count }, (_, i) => {
    const athlete = generateRealisticAthlete();
    const birthYear = new Date().getFullYear() - athlete.age;
    
    return {
      id: i + 1,
      userId: `user-${i + 1}`,
      ...athlete,
      cpf: Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join(''),
      phone: `(11) 9${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      birthDate: new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      profileComplete: true,
      parentalConsent: true,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
  });
}