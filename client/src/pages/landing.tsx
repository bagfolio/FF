import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatCounter from "@/components/features/StatCounter";
import UserTypeModal from "@/components/features/UserTypeModal";
import { Play, Search, Terminal, Video, Bot, Handshake, Check, Medal, Star, Crown, Trophy } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<"athlete" | "scout" | null>(null);

  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleCTAClick = (userType: "athlete" | "scout") => {
    setSelectedUserType(userType);
    setShowUserTypeModal(true);
  };

  const handleLogin = () => {
    // In development mode, go directly to home page
    setLocation("/home");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="font-bebas text-2xl verde-brasil">FUTEBOL FUTURO</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#como-funciona" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Como Funciona
              </a>
              <a href="#depoimentos" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Histórias de Sucesso
              </a>
              <a href="#parceiros" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Parceiros
              </a>
              <Button onClick={handleLogin} className="bg-azul-celeste hover:bg-blue-800">
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Young Brazilian football players training" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-video-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h1 className="font-bebas text-6xl md:text-8xl lg:text-9xl leading-none mb-8 tracking-wider">
            SEU TALENTO<br />
            <span className="amarelo-ouro drop-shadow-lg">MERECE SER VISTO</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-10 font-light max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            A primeira plataforma brasileira que usa IA para verificar talentos do futebol.<br />
            <span className="font-medium">Democratizando oportunidades do Amazonas a São Paulo.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              onClick={() => handleCTAClick("athlete")}
              className="btn-primary text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[240px] h-auto rounded-2xl shadow-2xl hover:shadow-verde-brasil/50 transition-all duration-300 transform hover:scale-105"
            >
              <Terminal className="w-6 h-6" />
              SOU ATLETA
            </Button>
            <Button 
              onClick={() => handleCTAClick("scout")}
              className="btn-secondary text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[240px] h-auto rounded-2xl shadow-2xl hover:shadow-azul-celeste/50 transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-6 h-6" />
              SOU SCOUT
            </Button>
          </div>
          
          {/* Revolutionary Brazilian Auth Experience */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-6"
            >
              <p className="text-2xl text-amarelo-ouro font-bold drop-shadow-md mb-2">
                🏆 EXPERIÊNCIA 3D IMERSIVA 🏆
              </p>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
                Entre em um estádio virtual, escolha sua posição com lendas brasileiras,
                crie sua camisa no vestiário e teste suas habilidades em mini-games!
              </p>
            </motion.div>
            <Button 
              onClick={() => setLocation("/auth/welcome")}
              className="bg-gradient-to-r from-verde-brasil via-amarelo-ouro to-azul-celeste text-white px-16 py-8 text-2xl font-bebas tracking-wider flex items-center gap-4 mx-auto rounded-full shadow-2xl hover:shadow-amarelo-ouro/50 transition-all duration-500 transform hover:scale-110 border-4 border-white/30 animate-pulse-slow relative overflow-hidden"
            >
              <Trophy className="w-10 h-10" />
              COMEÇAR JORNADA 3D
              <Star className="w-10 h-10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </Button>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bebas text-amarelo-ouro">5</p>
                <p className="text-xs text-white/70">Etapas Interativas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bebas text-verde-brasil">3D</p>
                <p className="text-xs text-white/70">Experiência Imersiva</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bebas text-azul-celeste">100%</p>
                <p className="text-xs text-white/70">Cultura Brasileira</p>
              </div>
            </div>
          </div>
          
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center fade-in">
              <StatCounter target={1247} suffix="+" className="text-4xl md:text-5xl font-bold amarelo-ouro font-oswald drop-shadow-lg" />
              <div className="text-base md:text-lg uppercase tracking-wider font-medium mt-2 drop-shadow-sm">Atletas Cadastrados</div>
            </div>
            <div className="text-center fade-in">
              <StatCounter target={3856} suffix="+" className="text-4xl md:text-5xl font-bold amarelo-ouro font-oswald drop-shadow-lg" />
              <div className="text-base md:text-lg uppercase tracking-wider font-medium mt-2 drop-shadow-sm">Testes Realizados</div>
            </div>
            <div className="text-center fade-in">
              <StatCounter target={127} suffix="+" className="text-4xl md:text-5xl font-bold amarelo-ouro font-oswald drop-shadow-lg" />
              <div className="text-base md:text-lg uppercase tracking-wider font-medium mt-2 drop-shadow-sm">Scouts Ativos</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="text-2xl">⌄</div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-pattern-hexagon opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-bebas text-5xl md:text-7xl azul-celeste mb-6 drop-shadow-sm">COMO FUNCIONA</h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Três passos simples para transformar seu talento em oportunidades reais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center fade-in card-hover relative">
              <Card className="p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-verde-brasil"></div>
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-verde-brasil rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-bebas text-3xl azul-celeste mb-4 tracking-wider">1. GRAVE SEU TESTE</h3>
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">
                    Use nosso Combine Digital para realizar testes físicos verificados por IA. 
                    Velocidade, agilidade e habilidades técnicas.
                  </p>
                  <div className="relative overflow-hidden rounded-xl group">
                    <img 
                      src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Young Brazilian player setting up smartphone on field" 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold tracking-wider">PASSO 1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="hidden md:block progress-arrow"></div>
            </div>
            
            <div className="text-center fade-in card-hover relative">
              <Card className="p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amarelo-ouro"></div>
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-amarelo-ouro rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bot className="azul-celeste w-8 h-8" />
                  </div>
                  <h3 className="font-bebas text-3xl azul-celeste mb-4 tracking-wider">2. IA VERIFICA</h3>
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">
                    Nosso "Árbitro Digital" analisa cada movimento com precisão científica. 
                    100% objetivo, sem favorecimento.
                  </p>
                  <div className="relative overflow-hidden rounded-xl group">
                    <img 
                      src="https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="AI overlay analyzing player movements" 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-verde-brasil rounded-full animate-pulse opacity-60"></div>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold tracking-wider">PASSO 2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="hidden md:block progress-arrow"></div>
            </div>
            
            <div className="text-center fade-in card-hover relative">
              <Card className="p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-azul-celeste"></div>
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-azul-celeste rounded-full flex items-center justify-center mx-auto mb-6">
                    <Handshake className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-bebas text-3xl azul-celeste mb-4 tracking-wider">3. SCOUTS ENCONTRAM</h3>
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">
                    Clubes e agentes descobrem seu talento através de dados verificados. 
                    Sua performance fala por você.
                  </p>
                  <div className="relative overflow-hidden rounded-xl group">
                    <img 
                      src="https://images.unsplash.com/photo-1559305616-3f99cd43e353?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Scout reviewing player data on tablet with stadium in background" 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold tracking-wider">PASSO 3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Combine Digital Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-50 via-white to-green-50 opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in">
              <h2 className="font-bebas text-5xl md:text-7xl azul-celeste mb-8 drop-shadow-sm">
                COMBINE DIGITAL
                <span className="verde-brasil block">REVOLUCIONÁRIO</span>
              </h2>
              <p className="text-2xl text-gray-700 mb-10 leading-relaxed font-light">
                O primeiro sistema do mundo que permite realizar testes físicos profissionais 
                usando apenas seu smartphone, com verificação por inteligência artificial.
              </p>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-6 group cursor-pointer tooltip-container p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-verde-brasil rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <Check className="text-white w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bebas text-2xl azul-celeste mb-2 group-hover:text-verde-brasil transition-colors tracking-wide">Teste de Velocidade 20m</h4>
                    <p className="text-gray-700 text-base leading-relaxed">Medição precisa de aceleração e velocidade máxima</p>
                    <span className="tooltip">Mede sua aceleração explosiva, essencial para atacantes e laterais</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group cursor-pointer tooltip-container p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-verde-brasil rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <Check className="text-white w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bebas text-2xl azul-celeste mb-2 group-hover:text-verde-brasil transition-colors tracking-wide">Teste de Agilidade 5-10-5</h4>
                    <p className="text-gray-700 text-base leading-relaxed">Avalia mudanças de direção e coordenação</p>
                    <span className="tooltip">Testa sua capacidade de mudar direção rapidamente, crucial para defensores</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group cursor-pointer tooltip-container p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-verde-brasil rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <Check className="text-white w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bebas text-2xl azul-celeste mb-2 group-hover:text-verde-brasil transition-colors tracking-wide">Habilidades Técnicas</h4>
                    <p className="text-gray-700 text-base leading-relaxed">Controle de bola, chutes e passes com precisão</p>
                    <span className="tooltip">Demonstre sua técnica apurada com exercícios específicos por posição</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleCTAClick("athlete")}
                className="btn-primary text-white px-10 py-6 text-xl font-semibold flex items-center gap-4 rounded-2xl h-auto shadow-2xl hover:shadow-verde-brasil/30 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-6 h-6" />
                FAZER MEU PRIMEIRO TESTE
              </Button>
              <p className="text-base text-gray-600 mt-4 font-medium">Verificação por IA gratuita no seu primeiro teste</p>
            </div>
            
            <div className="fade-in relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Young athletes performing speed and agility tests" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-verde-brasil/20 via-transparent to-amarelo-ouro/20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex gap-4 text-white">
                    <div className="text-center">
                      <p className="font-bebas text-3xl">20m</p>
                      <p className="text-xs uppercase tracking-wider">Velocidade</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bebas text-3xl">5-10-5</p>
                      <p className="text-xs uppercase tracking-wider">Agilidade</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bebas text-3xl">100%</p>
                      <p className="text-xs uppercase tracking-wider">Precisão IA</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-verde-brasil rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-amarelo-ouro rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pirâmide da Confiança */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Stadium at dusk" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h2 className="font-bebas text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">PIRÂMIDE DA CONFIANÇA</h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-md">
              Sistema transparente de verificação que garante credibilidade total aos seus dados
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12">
              <Card className="card-hover texture-bronze border-0 p-6 glow-bronze">
                <CardContent className="p-0 text-center text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <Medal className="text-white w-8 h-8 drop-shadow-lg" />
                  </div>
                  <h3 className="font-bebas text-2xl text-white mb-2 drop-shadow-lg">BRONZE</h3>
                  <p className="text-sm text-white/90">Perfil básico verificado</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover texture-silver border-0 p-6 glow-silver">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-black/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-white w-8 h-8 drop-shadow-lg" />
                  </div>
                  <h3 className="font-bebas text-2xl text-gray-800 mb-2 drop-shadow-lg">PRATA</h3>
                  <p className="text-sm text-gray-700">1+ teste verificado por IA</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover texture-gold border-0 p-6 glow-gold">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-black/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="text-white w-8 h-8 drop-shadow-lg" />
                  </div>
                  <h3 className="font-bebas text-2xl text-yellow-900 mb-2 drop-shadow-lg">OURO</h3>
                  <p className="text-sm text-yellow-800">3+ testes + dados de liga</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover texture-platinum border-0 p-6 glow-platinum pulse-animation">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-white w-8 h-8 drop-shadow-lg" />
                  </div>
                  <h3 className="font-bebas text-2xl text-purple-900 mb-2 drop-shadow-lg">PLATINA</h3>
                  <p className="text-sm text-purple-800">Perfil completo + scout validação</p>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-white/90 text-lg font-medium drop-shadow-md">
              Cada nível desbloqueia mais visibilidade e acesso a scouts de elite. 
              <span className="block mt-2 text-amarelo-ouro font-semibold">Onde sua jornada vai te levar?</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-texture-grass relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h2 className="font-bebas text-5xl md:text-7xl text-white mb-8 drop-shadow-lg">
              SEU FUTURO<br />
              <span className="amarelo-ouro drop-shadow-lg">COMEÇA AGORA</span>
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-md">
              Junte-se a milhares de jovens talentos que já transformaram seus sonhos em realidade
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                onClick={() => handleCTAClick("athlete")}
                className="btn-primary text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[280px] h-auto rounded-2xl shadow-2xl hover:shadow-verde-brasil/50"
              >
                <Terminal className="w-6 h-6" />
                COMECE SUA JORNADA (ATLETA)
              </Button>
              <Button 
                onClick={() => handleCTAClick("scout")}
                variant="outline"
                className="border-2 border-white text-white bg-transparent px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[280px] h-auto rounded-2xl shadow-2xl hover:bg-white hover:text-azul-celeste transition-all duration-300"
              >
                <Search className="w-6 h-6" />
                DESCOBRIR TALENTOS (SCOUT)
              </Button>
            </div>
            
            {/* Social Proof Section */}
            <div className="mt-20 pt-12 border-t border-white/20">
              <h3 className="font-bebas text-2xl text-white/80 mb-8">CLUBES QUE CONFIAM NA FUTEBOL FUTURO</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                <div className="w-32 h-16 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">São Paulo FC</span>
                </div>
                <div className="w-32 h-16 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">Corinthians</span>
                </div>
                <div className="w-32 h-16 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">Flamengo</span>
                </div>
                <div className="w-32 h-16 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">Santos FC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bebas text-2xl verde-brasil mb-4">FUTEBOL FUTURO</h3>
              <p className="text-gray-400 mb-4">
                Democratizando o acesso ao futebol profissional através da tecnologia.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Para Atletas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Criar Perfil</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Combine Digital</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Minhas Estatísticas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conquistas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Para Scouts</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Busca Avançada</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Relatórios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Futebol Futuro. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Desenvolvido com 💚 no Brasil
            </p>
          </div>
        </div>
      </footer>

      <UserTypeModal 
        isOpen={showUserTypeModal}
        onClose={() => setShowUserTypeModal(false)}
        selectedType={selectedUserType}
      />
    </div>
  );
}
