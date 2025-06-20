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
      {/* Modern Glassmorphic Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="font-bebas text-3xl bg-gradient-to-r from-verde-brasil to-amarelo-ouro bg-clip-text text-transparent">
                REVELA
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#como-funciona" className="text-gray-700 hover:text-verde-brasil transition-colors font-medium">Como Funciona</a>
              <a href="#trust-pyramid" className="text-gray-700 hover:text-verde-brasil transition-colors font-medium">Verificação</a>
              <a href="#testimonials" className="text-gray-700 hover:text-verde-brasil transition-colors font-medium">Depoimentos</a>
              <Button 
                onClick={handleLogin}
                variant="outline" 
                className="border-verde-brasil text-verde-brasil hover:bg-verde-brasil hover:text-white transition-all duration-300"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced Glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Brazilian football stadium with vibrant colors" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil/20 via-black/40 to-amarelo-ouro/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="font-bebas text-6xl md:text-8xl text-white leading-tight">
              O FUTURO DO
              <br />
              <span className="bg-gradient-to-r from-verde-brasil to-amarelo-ouro bg-clip-text text-transparent">
                FUTEBOL BRASILEIRO
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light">
              Conectamos jovens talentos aos principais scouts do país através de tecnologia avançada e verificação confiável
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                onClick={() => handleCTAClick("athlete")}
                size="lg"
                className="group bg-gradient-to-r from-verde-brasil to-green-600 hover:from-green-600 hover:to-verde-brasil text-white font-bold py-4 px-12 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                COMEÇAR MINHA JORNADA
              </Button>
              
              <Button
                onClick={() => handleCTAClick("scout")}
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-12 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <Search className="w-6 h-6 mr-3" />
                SOU SCOUT
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="glass-morph rounded-2xl p-6 text-center">
              <StatCounter target={12500} duration={2000} className="text-4xl font-bold text-white" />
              <p className="text-white/80 mt-2">Atletas Conectados</p>
            </div>
            <div className="glass-morph rounded-2xl p-6 text-center">
              <StatCounter target={450} duration={2000} className="text-4xl font-bold text-white" />
              <p className="text-white/80 mt-2">Scouts Ativos</p>
            </div>
            <div className="glass-morph rounded-2xl p-6 text-center">
              <StatCounter target={89} duration={2000} className="text-4xl font-bold text-white" />
              <p className="text-white/80 mt-2">Contratos Assinados</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section id="como-funciona" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-verde-brasil rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amarelo-ouro rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-bebas text-5xl md:text-6xl text-gray-900 mb-6">
              COMO FUNCIONA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um processo simples e transparente para conectar talentos aos scouts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="group"
            >
              <Card className="glass-morph border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil/5 to-transparent"></div>
                <CardContent className="p-8 relative">
                  <motion.div
                    className="relative mb-6 group-hover:scale-110 transition-transform duration-500"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Young Brazilian player setting up smartphone on field" 
                      className="w-full h-48 object-cover rounded-xl brightness-90 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold tracking-wider">PASSO 1</p>
                    </div>
                  </motion.div>
                  <h3 className="font-bebas text-2xl text-gray-900 mb-4">CRIE SEU PERFIL</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cadastre suas informações pessoais, posição e complete nossa avaliação de habilidades inteligente
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-verde-brasil to-amarelo-ouro rounded-full"></div>
            </div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="group"
            >
              <Card className="glass-morph border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amarelo-ouro/5 to-transparent"></div>
                <CardContent className="p-8 relative">
                  <motion.div
                    className="relative mb-6 group-hover:scale-110 transition-transform duration-500"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Athlete performing skills assessment" 
                      className="w-full h-48 object-cover rounded-xl brightness-90 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold tracking-wider">PASSO 2</p>
                    </div>
                  </motion.div>
                  <h3 className="font-bebas text-2xl text-gray-900 mb-4">VERIFICAÇÃO INTELIGENTE</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Nossa IA analisa suas habilidades e cria um perfil confiável para os scouts
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-amarelo-ouro to-verde-brasil rounded-full"></div>
            </div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="group"
            >
              <Card className="glass-morph border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil/5 to-transparent"></div>
                <CardContent className="p-8 relative">
                  <motion.div
                    className="relative mb-6 group-hover:scale-110 transition-transform duration-500"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Scout analyzing player data on tablet" 
                      className="w-full h-48 object-cover rounded-xl brightness-90 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold tracking-wider">PASSO 3</p>
                    </div>
                  </motion.div>
                  <h3 className="font-bebas text-2xl text-gray-900 mb-4">CONECTE-SE AOS SCOUTS</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Seja descoberto pelos principais scouts e clubes do futebol brasileiro
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Pyramid Section - Enhanced */}
      <section id="trust-pyramid" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Stadium at dusk" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-bebas text-5xl md:text-6xl text-white mb-6">
              PIRÂMIDE DA CONFIANÇA
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Sistema de verificação em camadas que garante a credibilidade dos perfis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Bronze */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="glass-morph rounded-2xl p-8 text-center border border-orange-400/30"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Medal className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bebas text-2xl text-white mb-4">BRONZE</h3>
              <ul className="text-white/80 space-y-2 text-sm">
                <li>✓ Perfil Completo</li>
                <li>✓ Auto-avaliação</li>
                <li>✓ Informações Básicas</li>
              </ul>
            </motion.div>

            {/* Silver */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="glass-morph rounded-2xl p-8 text-center border border-gray-400/30"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bebas text-2xl text-white mb-4">SILVER</h3>
              <ul className="text-white/80 space-y-2 text-sm">
                <li>✓ Bronze +</li>
                <li>✓ Testes Técnicos</li>
                <li>✓ Validação IA</li>
              </ul>
            </motion.div>

            {/* Gold */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="glass-morph rounded-2xl p-8 text-center border border-yellow-400/30"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bebas text-2xl text-white mb-4">GOLD</h3>
              <ul className="text-white/80 space-y-2 text-sm">
                <li>✓ Silver +</li>
                <li>✓ Múltiplos Testes</li>
                <li>✓ Métricas Avançadas</li>
              </ul>
            </motion.div>

            {/* Platinum */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="glass-morph rounded-2xl p-8 text-center border border-purple-400/30"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bebas text-2xl text-white mb-4">PLATINUM</h3>
              <ul className="text-white/80 space-y-2 text-sm">
                <li>✓ Gold +</li>
                <li>✓ Validação Scout</li>
                <li>✓ Selo Premium</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bebas text-2xl text-verde-brasil mb-4">REVELA</h3>
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
              © 2024 Revela. Todos os direitos reservados.
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