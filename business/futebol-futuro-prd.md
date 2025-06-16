# Futebol Futuro - Product Requirements Document (PRD)
## Plataforma Revolucionária de Descoberta de Talentos no Futebol Brasileiro

### 🚀 Visão Geral do Projeto

**Objetivo**: Construir um Progressive Web App (PWA) que democratize a descoberta de talentos no futebol juvenil brasileiro através de verificação por IA e dados objetivos.

**Stack Tecnológico Recomendado para Replit**:
- Frontend: React + Tailwind CSS (design brasileiro vibrante)
- Backend: Node.js/Express ou Python/FastAPI
- Database: PostgreSQL (Replit DB para MVP)
- Video Processing: Cloudinary ou similar
- AI Integration: TensorFlow.js para processamento client-side inicial

---

## 🎨 Design System & Branding

### Paleta de Cores (Identidade Brasileira)
```css
:root {
  --verde-brasil: #009C3B;
  --amarelo-ouro: #FFDF00;
  --azul-celeste: #002776;
  --branco-pure: #FFFFFF;
  --preto-profundo: #000000;
  
  /* Cores de Apoio */
  --cinza-claro: #F5F5F5;
  --cinza-medio: #9B9B9B;
  --vermelho-alerta: #DC2626;
  --verde-sucesso: #10B981;
  --laranja-destaque: #F97316;
}
```

### Tipografia
- Headings: "Bebas Neue" ou similar (forte, esportiva)
- Body: "Inter" ou "Roboto" (legibilidade)
- Números/Stats: "Oswald" (impacto visual)

### Elementos Visuais
- Gradientes inspirados no pôr do sol brasileiro
- Patterns geométricos sutis (referência às redes de gol)
- Ícones customizados de futebol
- Animações suaves em micro-interações
- Cards com sombras elevadas (material design brasileiro)

---

## 📱 Estrutura de Páginas & Features

### 1. Landing Page (/)
**Objetivo**: Converter visitantes em usuários

**Seções**:
- Hero com vídeo de fundo (jovens jogando futebol)
- Headline: "Seu Talento Merece Ser Visto" 
- CTA duplo: "Sou Atleta" / "Sou Scout"
- Estatísticas impactantes (números animados)
- Como funciona (3 passos visuais)
- Depoimentos de sucesso
- Parceiros (logos de ligas/escolinhas)
- Footer com links institucionais

### 2. Portal do Atleta

#### 2.1 Onboarding (/atleta/cadastro)
**Fluxo em 4 etapas**:
1. **Dados Básicos**
   - Nome completo
   - Data de nascimento
   - CPF (verificação)
   - Cidade/Estado
   - Telefone dos pais (para menores)

2. **Perfil Atlético**
   - Posição principal/secundária
   - Pé dominante
   - Altura/Peso
   - Time atual/Escolinha
   - Histórico (times anteriores)

3. **Verificação Parental** (se menor)
   - Email/WhatsApp dos pais
   - Termo de consentimento LGPD
   - Double opt-in via SMS/Email

4. **Primeira Foto/Vídeo**
   - Upload de foto de perfil
   - Vídeo de apresentação (30s)
   - Tutorial interativo

#### 2.2 Dashboard do Atleta (/atleta/dashboard)
**Componentes**:
- **Header Personalizado**
  - Foto + Nome + Posição
  - Nível da Pirâmide (Bronze/Prata/Ouro/Platina)
  - Contador de visualizações

- **Cards de Métricas**
  - Testes realizados
  - Percentil de performance
  - Próximo teste agendado
  - Conquistas desbloqueadas

- **Feed de Atividades**
  - "Seu perfil foi visto por 3 scouts"
  - "Novo teste disponível"
  - "Parabéns! Você está no top 10% de velocidade"

- **Seção Combine Digital**
  - Lista de testes disponíveis
  - Status de verificação
  - Botão "Realizar Novo Teste"

#### 2.3 Sistema Combine Digital (/atleta/combine)
**Interface de Teste**:
1. **Seleção do Teste**
   - Cards visuais para cada teste
   - Dificuldade e tempo estimado
   - Equipamentos necessários

2. **Preparação**
   - Tutorial em vídeo
   - Checklist de setup
   - Calibração com objeto de referência

3. **Gravação**
   - Interface de câmera in-app
   - Guias visuais de posicionamento
   - Contador regressivo
   - Indicadores de qualidade

4. **Resultado**
   - Loading animado durante processamento
   - Resultado com celebração (se aprovado)
   - Comparação com média da idade
   - Compartilhamento social

### 3. Portal do Scout

#### 3.1 Dashboard Profissional (/scout/dashboard)
**Layout em Grid**:
- **Barra Superior**
  - Logo do clube/agência
  - Filtros salvos
  - Notificações
  - Configurações

- **Painel Principal**
  - Grid de atletas (cards compactos)
  - Visualização em lista alternativa
  - Mapa de calor geográfico

- **Barra Lateral**
  - Filtros avançados (collapsible)
  - Histórico de buscas
  - Atletas favoritados
  - Exportar relatórios

#### 3.2 Sistema de Busca Avançada (/scout/buscar)
**Filtros Disponíveis**:
```javascript
const filtros = {
  // Dados Básicos
  idade: { min: 8, max: 18 },
  posicao: ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante'],
  peDominante: ['Destro', 'Canhoto', 'Ambidestro'],
  
  // Localização
  estado: [...estadosBrasil],
  cidade: [...cidadesSelecionadas],
  distanciaMaxima: 50, // km
  
  // Métricas Verificadas
  velocidade20m: { min: 2.5, max: 4.0 }, // segundos
  agilidade: { min: 8.0, max: 12.0 }, // segundos
  
  // Dados de Liga
  golsMarcados: { min: 0, max: 50 },
  assistencias: { min: 0, max: 30 },
  jogosDisputados: { min: 5, max: 100 },
  
  // Nível de Verificação
  nivelMinimo: ['Bronze', 'Prata', 'Ouro', 'Platina']
}
```

#### 3.3 Perfil Detalhado do Atleta (/scout/atleta/:id)
**Seções**:
- **Header Visual**
  - Foto grande + vídeo highlight
  - Badges de verificação
  - Estatísticas principais

- **Gráficos de Performance**
  - Radar chart comparativo
  - Evolução temporal
  - Percentis por categoria

- **Histórico Completo**
  - Timeline de clubes
  - Estatísticas por temporada
  - Vídeos de testes Combine

- **Ações**
  - Adicionar aos favoritos
  - Solicitar contato
  - Exportar relatório PDF
  - Agendar avaliação presencial

### 4. Portal de Gestão de Ligas (/liga)

#### 4.1 Painel Administrativo
**Features**:
- Gestão de campeonatos
- Tabelas automatizadas
- Artilharia em tempo real
- Geração de súmulas
- Widget embeddable para sites

#### 4.2 Integração com Plataforma
- Sync automático de estatísticas
- Notificações para pais/jogadores
- QR codes para check-in em jogos

---

## 🔧 Componentes Técnicos Específicos

### 1. Sistema de Verificação por IA

#### Arquitetura do "Árbitro Digital"
```javascript
// Pseudo-código do fluxo de verificação
class ArbitroDigital {
  async verificarVideo(videoFile) {
    // Etapa 1: Validação de Integridade
    const integrity = await this.checkVideoIntegrity(videoFile);
    if (integrity.score < 0.7) return { approved: false, reason: 'Video suspeito' };
    
    // Etapa 2: Extração de Frames
    const frames = await this.extractKeyFrames(videoFile);
    
    // Etapa 3: Análise de Pose
    const poseData = await this.analyzePose(frames);
    
    // Etapa 4: Cálculo de Métricas
    const metrics = await this.calculateMetrics(poseData);
    
    // Etapa 5: Score de Confiança
    const confidence = await this.calculateConfidence(metrics);
    
    return {
      approved: confidence > 0.95,
      metrics: metrics,
      confidence: confidence,
      requiresReview: confidence < 0.95 && confidence > 0.7
    };
  }
}
```

### 2. Sistema de Gamificação

#### Conquistas para Atletas
```javascript
const conquistas = [
  {
    id: 'primeira_verificacao',
    nome: 'Primeiros Passos',
    descricao: 'Complete seu primeiro teste verificado',
    icone: '🏃‍♂️',
    pontos: 100
  },
  {
    id: 'top_10_velocidade',
    nome: 'Relâmpago',
    descricao: 'Entre no top 10% de velocidade da sua idade',
    icone: '⚡',
    pontos: 500
  },
  {
    id: 'perfil_completo',
    nome: 'Profissional',
    descricao: 'Complete 100% do seu perfil',
    icone: '⭐',
    pontos: 200
  }
];
```

### 3. Sistema de Notificações

#### Tipos de Notificações
- **Para Atletas**:
  - "Seu perfil foi visualizado por [Clube X]"
  - "Novo teste disponível: Agilidade 5-10-5"
  - "Você subiu para o percentil 85 em velocidade!"
  
- **Para Scouts**:
  - "3 novos atletas correspondem aos seus filtros"
  - "Atleta favoritado atualizou métricas"
  - "Relatório semanal disponível"

- **Para Pais**:
  - "João completou novo teste - veja os resultados"
  - "Lembrete: Renovar assinatura Pro"
  - "Conquista desbloqueada!"

---

## 🚀 Roadmap de Implementação para MVP

### Fase 1: Base (Semanas 1-2)
- [ ] Setup do projeto no Replit
- [ ] Estrutura de rotas e navegação
- [ ] Design system e componentes base
- [ ] Autenticação e perfis básicos
- [ ] Landing page responsiva

### Fase 2: Core Features (Semanas 3-4)
- [ ] Dashboard do atleta
- [ ] Upload de vídeos
- [ ] Sistema de busca básico para scouts
- [ ] Integração com Cloudinary

### Fase 3: Diferenciação (Semanas 5-6)
- [ ] Combine Digital (1 teste inicial)
- [ ] Verificação manual (admin panel)
- [ ] Pirâmide da Confiança visual
- [ ] Filtros avançados

### Fase 4: Polish (Semanas 7-8)
- [ ] Animations e micro-interações
- [ ] PWA configuration
- [ ] Performance optimization
- [ ] Beta testing com usuários reais

---

## 📊 Métricas de Sucesso do MVP

### KPIs Principais
1. **Ativação**: % de usuários que completam perfil
2. **Engajamento**: Testes Combine por usuário/mês
3. **Conversão**: Free → Pro conversion rate
4. **Retenção**: MAU/DAU ratio
5. **Satisfação**: NPS score > 50

### Analytics Essenciais
- Mixpanel/Amplitude para eventos
- Hotjar para heatmaps
- Google Analytics para tráfego
- Sentry para error tracking

---

## 🔐 Considerações de Segurança & LGPD

### Requisitos Críticos
1. **Consentimento Parental**
   - Double opt-in obrigatório
   - Termos claros e acessíveis
   - Direito ao esquecimento

2. **Proteção de Dados**
   - Criptografia em trânsito e repouso
   - Acesso baseado em roles
   - Logs de auditoria

3. **Segurança de Vídeos**
   - Watermark automático
   - Prevenção de download
   - Detecção de manipulação

---

## 💬 Copy & Messaging

### Tom de Voz
- **Para Atletas**: Inspirador, próximo, motivacional
- **Para Scouts**: Profissional, objetivo, eficiente
- **Para Pais**: Confiável, transparente, cuidadoso

### Headlines Principais
- "Seu Talento Merece Ser Visto"
- "Do Gramado ao Profissional"
- "Tecnologia a Favor do Futebol"
- "Métricas Reais, Oportunidades Reais"

### CTAs
- Atletas: "Comece Sua Jornada"
- Scouts: "Descubra Talentos Verificados"
- Pais: "Dê Visibilidade ao Seu Filho"

---

## 🎯 Diferenciais Competitivos do MVP

1. **Verificação por IA** (único no Brasil)
2. **Pirâmide da Confiança** (transparência total)
3. **Combine Digital** (democratização dos testes)
4. **Foco Brasileiro** (culturalmente relevante)
5. **Modelo Freemium** (acessível)

---

## 📝 Próximos Passos para Replit

1. **Setup Inicial**:
```bash
# Estrutura de pastas sugerida
/futebol-futuro
  /client (React PWA)
    /components
    /pages
    /hooks
    /utils
    /styles
  /server (Node.js/Express)
    /routes
    /models
    /services
    /middleware
  /shared
    /types
    /constants
```

2. **Dependências Essenciais**:
```json
{
  "dependencies": {
    "react": "^18.x",
    "tailwindcss": "^3.x",
    "framer-motion": "^10.x",
    "react-hook-form": "^7.x",
    "axios": "^1.x",
    "react-query": "^3.x",
    "react-router-dom": "^6.x"
  }
}
```

3. **Configuração PWA**:
- Service Worker para offline
- Manifest.json com ícones brasileiros
- Push notifications setup

---

## 🌟 Visão Final

O Futebol Futuro não é apenas uma plataforma tecnológica - é uma ferramenta de transformação social que usa o poder do futebol e da tecnologia para criar oportunidades justas para jovens talentos brasileiros, independentemente de sua origem socioeconômica ou localização geográfica.

**Vamos construir o futuro do futebol brasileiro, um talento verificado por vez! 🇧🇷⚽**