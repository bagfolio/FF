import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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

  const handleDirectAccess = () => {
    // Direct access to application
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
              <Button onClick={handleDirectAccess} className="bg-azul-celeste hover:bg-blue-800">
                Acessar Plataforma
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
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              onClick={() => setLocation("/home")}
              className="btn-primary text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[240px] h-auto rounded-2xl shadow-2xl hover:shadow-verde-brasil/50 transition-all duration-300 transform hover:scale-105"
            >
              <Terminal className="w-6 h-6" />
              SOU ATLETA
            </Button>
            <Button 
              onClick={() => setLocation("/home")}
              className="btn-secondary text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[240px] h-auto rounded-2xl shadow-2xl hover:shadow-azul-celeste/50 transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-6 h-6" />
              SOU SCOUT
            </Button>
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
      <section id="como-funciona" className="py-20 bg-cinza-claro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-4xl md:text-6xl azul-celeste mb-4">COMO FUNCIONA</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Três passos simples para transformar seu talento em oportunidades reais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center fade-in card-hover">
              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-verde-brasil rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-bebas text-2xl azul-celeste mb-4">1. GRAVE SEU TESTE</h3>
                  <p className="text-gray-600 mb-6">
                    Use nosso Combine Digital para realizar testes físicos verificados por IA. 
                    Velocidade, agilidade e habilidades técnicas.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Player recording speed test" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center fade-in card-hover">
              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-amarelo-ouro rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bot className="azul-celeste w-8 h-8" />
                  </div>
                  <h3 className="font-bebas text-2xl azul-celeste mb-4">2. IA VERIFICA</h3>
                  <p className="text-gray-600 mb-6">
                    Nosso "Árbitro Digital" analisa cada movimento com precisão científica. 
                    100% objetivo, sem favorecimento.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="AI analysis technology" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center fade-in card-hover">
              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-azul-celeste rounded-full flex items-center justify-center mx-auto mb-6">
                    <Handshake className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-bebas text-2xl azul-celeste mb-4">3. SCOUTS ENCONTRAM</h3>
                  <p className="text-gray-600 mb-6">
                    Clubes e agentes descobrem seu talento através de dados verificados. 
                    Sua performance fala por você.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Scout reviewing player profiles" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Combine Digital Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h2 className="font-bebas text-4xl md:text-5xl azul-celeste mb-6">
                COMBINE DIGITAL
                <span className="verde-brasil block">REVOLUCIONÁRIO</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                O primeiro sistema do mundo que permite realizar testes físicos profissionais 
                usando apenas seu smartphone, com verificação por inteligência artificial.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-verde-brasil rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold azul-celeste text-lg">Teste de Velocidade 20m</h4>
                    <p className="text-gray-600">Medição precisa de aceleração e velocidade máxima</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-verde-brasil rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold azul-celeste text-lg">Teste de Agilidade 5-10-5</h4>
                    <p className="text-gray-600">Avalia mudanças de direção e coordenação</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-verde-brasil rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold azul-celeste text-lg">Habilidades Técnicas</h4>
                    <p className="text-gray-600">Controle de bola, chutes e passes com precisão</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleCTAClick("athlete")}
                className="btn-primary text-white px-8 py-4 text-lg flex items-center gap-3 rounded-xl h-auto"
              >
                <Play className="w-5 h-5" />
                FAZER MEU PRIMEIRO TESTE
              </Button>
            </div>
            
            <div className="fade-in">
              <img 
                src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Athlete performing agility test" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pirâmide da Confiança */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h2 className="font-bebas text-4xl md:text-6xl mb-6">PIRÂMIDE DA CONFIANÇA</h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto">
              Sistema transparente de verificação que garante credibilidade total aos seus dados
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <Card className="card-hover bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Medal className="text-white w-6 h-6" />
                  </div>
                  <h3 className="font-bebas text-xl amarelo-ouro mb-2">BRONZE</h3>
                  <p className="text-sm">Perfil básico verificado</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-white w-6 h-6" />
                  </div>
                  <h3 className="font-bebas text-xl amarelo-ouro mb-2">PRATA</h3>
                  <p className="text-sm">1+ teste verificado por IA</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="azul-celeste w-6 h-6" />
                  </div>
                  <h3 className="font-bebas text-xl amarelo-ouro mb-2">OURO</h3>
                  <p className="text-sm">3+ testes + dados de liga</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover bg-white/10 backdrop-blur-sm border-white/20 p-6 pulse-animation">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-white w-6 h-6" />
                  </div>
                  <h3 className="font-bebas text-xl amarelo-ouro mb-2">PLATINA</h3>
                  <p className="text-sm">Perfil completo + scout validação</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-brasil-gradient text-white relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h2 className="font-bebas text-4xl md:text-6xl mb-6">
              PRONTO PARA MOSTRAR<br />
              <span className="text-black">SEU TALENTO?</span>
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Junte-se a milhares de jovens talentos que já transformaram seus sonhos em realidade
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={() => setLocation("/home")}
                className="bg-white azul-celeste px-8 py-4 text-lg flex items-center gap-3 hover:bg-gray-100 min-w-[200px] h-auto rounded-xl"
              >
                <Terminal className="w-5 h-5" />
                COMEÇAR AGORA
              </Button>
              <Button 
                onClick={() => setLocation("/home")}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 text-lg flex items-center gap-3 hover:bg-white hover:text-blue-900 min-w-[200px] h-auto rounded-xl"
              >
                <Play className="w-5 h-5" />
                VER DEMONSTRAÇÃO
              </Button>
            </div>
            
            <p className="text-sm opacity-80">Gratuito para começar • Sem compromisso • Resultados garantidos</p>
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
