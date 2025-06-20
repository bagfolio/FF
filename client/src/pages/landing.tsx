import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import StatCounter from "@/components/features/StatCounter";
import UserTypeModal from "@/components/features/UserTypeModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { Play, Search, Terminal, Video, Bot, Handshake, Check, Medal, Star, Crown, Trophy } from "lucide-react";
import { LandingPricingPlans } from "@/components/features/subscription/LandingPricingPlans";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<"athlete" | "scout" | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'elite' | null>(null);

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

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId) {
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      });
    });

    return () => observer.disconnect();
  }, []);

  const handleCTAClick = (userType: "athlete" | "scout") => {
    setSelectedUserType(userType);
    setAuthModalTab("signup");
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthModalTab("login");
    setShowAuthModal(true);
  };

  const handleStartJourney = () => {
    setSelectedUserType("athlete");
    setAuthModalTab("signup");
    setShowAuthModal(true);
  };

  const handlePlanSelection = (planName: 'basic' | 'pro' | 'elite') => {
    setSelectedPlan(planName);
    setSelectedUserType("athlete");
    setAuthModalTab("signup");
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full glass-morph-dark backdrop-blur-xl border-b border-white/10 shadow-2xl z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="font-bebas text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                REVELA
                <motion.span 
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(0,156,59,0.8)",
                      "0 0 20px rgba(0,156,59,1)",
                      "0 0 10px rgba(0,156,59,0.8)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2 inline-block w-2 h-2 bg-verde-brasil rounded-full"
                />
              </motion.h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#como-funciona" className="text-gray-300 hover:text-verde-brasil px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/5">
                Como Funciona
              </a>
              <a href="#precos" className="text-gray-300 hover:text-verde-brasil px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/5">
                Preços
              </a>
              <a href="#depoimentos" className="text-gray-300 hover:text-verde-brasil px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/5">
                Histórias de Sucesso
              </a>
              <a href="#parceiros" className="text-gray-300 hover:text-verde-brasil px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/5">
                Parceiros
              </a>
              <ThemeToggle variant="glass" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleLogin} 
                  className="glass-morph-blue text-white hover:shadow-azul-celeste/30 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Entrar</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-azul-celeste/0 via-azul-celeste/20 to-azul-celeste/0"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>
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
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-bebas text-6xl md:text-8xl lg:text-9xl leading-none mb-8 tracking-wider"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-block"
            >
              SEU TALENTO
            </motion.span>
            <br />
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="amarelo-ouro drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-shadow-strong font-light inline-block"
            >
              MERECE SER VISTO
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl mb-10 font-light max-w-4xl mx-auto leading-relaxed drop-shadow-md"
          >
            A primeira plataforma brasileira que usa IA para verificar talentos do futebol.<br />
            <span className="font-medium">Democratizando oportunidades do Amazonas a São Paulo.</span>
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleStartJourney}
                className="glass-morph-green text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[280px] h-auto rounded-2xl shadow-2xl hover:shadow-verde-brasil/50 transition-all duration-300 relative overflow-hidden group"
              >
                <Trophy className="w-6 h-6 relative z-10" />
                <span className="relative z-10">COMEÇAR MINHA JORNADA</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-verde-brasil to-verde-brasil/80 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ 
                    background: [
                      "linear-gradient(to right, #009C3B, rgba(0, 156, 59, 0.8))",
                      "linear-gradient(to right, rgba(0, 156, 59, 0.8), #009C3B)",
                      "linear-gradient(to right, #009C3B, rgba(0, 156, 59, 0.8))"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => handleCTAClick("scout")}
                className="glass-morph-blue text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[240px] h-auto rounded-2xl shadow-2xl hover:shadow-azul-celeste/50 transition-all duration-300 relative overflow-hidden group"
              >
                <Search className="w-6 h-6 relative z-10" />
                <span className="relative z-10">SOU SCOUT</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-azul-celeste to-azul-celeste/80 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ 
                    background: [
                      "linear-gradient(to right, #002776, rgba(0, 39, 118, 0.8))",
                      "linear-gradient(to right, rgba(0, 39, 118, 0.8), #002776)",
                      "linear-gradient(to right, #002776, rgba(0, 39, 118, 0.8))"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Stats row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <StatCounter target={1247} suffix="+" className="text-4xl md:text-5xl font-bold amarelo-ouro font-oswald drop-shadow-lg" />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-base md:text-lg uppercase tracking-wider font-medium mt-2 drop-shadow-sm"
              >
                Atletas Cadastrados
              </motion.div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <StatCounter target={3856} suffix="+" className="text-4xl md:text-5xl font-bold amarelo-ouro font-oswald drop-shadow-lg" />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                className="text-base md:text-lg uppercase tracking-wider font-medium mt-2 drop-shadow-sm"
              >
                Testes Realizados
              </motion.div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <StatCounter target={127} suffix="+" className="text-4xl md:text-5xl font-bold amarelo-ouro font-oswald drop-shadow-lg" />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9 }}
                className="text-base md:text-lg uppercase tracking-wider font-medium mt-2 drop-shadow-sm"
              >
                Scouts Ativos
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="text-2xl">⌄</div>
        </div>
        {/* Gradient transition to dark sections */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black"></div>
      </section>
      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black"></div>
        <div className="absolute inset-0 bg-pattern-hexagon opacity-5"></div>
        {/* Subtle animated orbs */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-verde-brasil rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-20 left-1/4 w-96 h-96 bg-azul-celeste rounded-full blur-3xl"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 drop-shadow-2xl">COMO FUNCIONA</h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-medium">
              Três passos simples para transformar seu talento em oportunidades reais
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              <Card className="p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 glass-morph-dark relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-verde-brasil to-verde-brasil/50"></div>
                <CardContent className="p-0">
                  <motion.div 
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0, 156, 59, 0.3), 0 0 40px rgba(0, 156, 59, 0.2)",
                        "0 0 30px rgba(0, 156, 59, 0.5), 0 0 60px rgba(0, 156, 59, 0.3)",
                        "0 0 20px rgba(0, 156, 59, 0.3), 0 0 40px rgba(0, 156, 59, 0.2)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-20 h-20 glass-morph-green rounded-full flex items-center justify-center mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil to-verde-brasil/50 rounded-full"></div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Video className="text-white w-8 h-8 relative z-10" />
                    </motion.div>
                  </motion.div>
                  <h3 className="font-bebas text-3xl text-white mb-4 tracking-wider">1. GRAVE SEU TESTE</h3>
                  <p className="text-white/80 mb-6 text-base leading-relaxed">
                    Use nosso Combine Digital para realizar testes físicos verificados por IA. 
                    Velocidade, agilidade e habilidades técnicas.
                  </p>
                  <motion.div 
                    className="relative overflow-hidden rounded-xl group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Young Brazilian player training with cones" 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <motion.div 
                      className="absolute bottom-3 left-3 text-white"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-xs font-semibold tracking-wider">PASSO 1</p>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
              <div className="hidden md:block progress-arrow"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              <Card className="p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 glass-morph-dark relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amarelo-ouro to-amarelo-ouro/50"></div>
                <CardContent className="p-0">
                  <motion.div 
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(255, 223, 0, 0.3), 0 0 40px rgba(255, 223, 0, 0.2)",
                        "0 0 30px rgba(255, 223, 0, 0.5), 0 0 60px rgba(255, 223, 0, 0.3)",
                        "0 0 20px rgba(255, 223, 0, 0.3), 0 0 40px rgba(255, 223, 0, 0.2)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="w-20 h-20 glass-morph-yellow rounded-full flex items-center justify-center mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amarelo-ouro to-amarelo-ouro/50 rounded-full"></div>
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Bot className="text-white w-8 h-8 relative z-10" />
                    </motion.div>
                  </motion.div>
                  <h3 className="font-bebas text-3xl text-white mb-4 tracking-wider">2. IA VERIFICA</h3>
                  <p className="text-white/80 mb-6 text-base leading-relaxed">
                    Nosso "Árbitro Digital" analisa cada movimento com precisão científica. 
                    100% objetivo, sem favorecimento.
                  </p>
                  <motion.div 
                    className="relative overflow-hidden rounded-xl group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Digital analysis of soccer player movements" 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-32 h-32 border-2 border-verde-brasil rounded-full opacity-60"></div>
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-3 left-3 text-white"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-xs font-semibold tracking-wider">PASSO 2</p>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
              <div className="hidden md:block progress-arrow"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              <Card className="p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 glass-morph-dark relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-azul-celeste to-azul-celeste/50"></div>
                <CardContent className="p-0">
                  <motion.div 
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0, 39, 118, 0.3), 0 0 40px rgba(0, 39, 118, 0.2)",
                        "0 0 30px rgba(0, 39, 118, 0.5), 0 0 60px rgba(0, 39, 118, 0.3)",
                        "0 0 20px rgba(0, 39, 118, 0.3), 0 0 40px rgba(0, 39, 118, 0.2)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="w-20 h-20 glass-morph-blue rounded-full flex items-center justify-center mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-azul-celeste to-azul-celeste/50 rounded-full"></div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Handshake className="text-white w-8 h-8 relative z-10" />
                    </motion.div>
                  </motion.div>
                  <h3 className="font-bebas text-3xl text-white mb-4 tracking-wider">3. SCOUTS ENCONTRAM</h3>
                  <p className="text-white/80 mb-6 text-base leading-relaxed">
                    Clubes e agentes descobrem seu talento através de dados verificados. 
                    Sua performance fala por você.
                  </p>
                  <motion.div 
                    className="relative overflow-hidden rounded-xl group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Professional scout analyzing player performance" 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <motion.div 
                      className="absolute bottom-3 left-3 text-white"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-xs font-semibold tracking-wider">PASSO 3</p>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Combine Digital Section */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-verde-brasil/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in">
              <h2 className="font-bebas text-5xl md:text-7xl text-white mb-8 drop-shadow-2xl">
                COMBINE DIGITAL
                <span className="text-verde-brasil block drop-shadow-[0_0_20px_rgba(0,156,59,0.5)]">REVOLUCIONÁRIO</span>
              </h2>
              <p className="text-2xl text-gray-300 mb-10 leading-relaxed font-light">
                O primeiro sistema do mundo que permite realizar testes físicos profissionais 
                usando apenas seu smartphone, com verificação por inteligência artificial.
              </p>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-6 group cursor-pointer tooltip-container p-6 rounded-xl glass-morph-dark border border-white/10 hover:border-verde-brasil/30 transition-all duration-300">
                  <div className="w-12 h-12 glass-morph-green rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-verde-brasil/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil to-verde-brasil/50 rounded-full"></div>
                    <Check className="text-white w-6 h-6 relative z-10" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bebas text-2xl text-white mb-2 group-hover:text-verde-brasil transition-colors tracking-wide">Teste de Velocidade 20m</h4>
                    <p className="text-gray-400 text-base leading-relaxed">Medição precisa de aceleração e velocidade máxima</p>
                    <span className="tooltip">Mede sua aceleração explosiva, essencial para atacantes e laterais</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group cursor-pointer tooltip-container p-6 rounded-xl glass-morph-dark border border-white/10 hover:border-verde-brasil/30 transition-all duration-300">
                  <div className="w-12 h-12 glass-morph-green rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-verde-brasil/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil to-verde-brasil/50 rounded-full"></div>
                    <Check className="text-white w-6 h-6 relative z-10" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bebas text-2xl text-white mb-2 group-hover:text-verde-brasil transition-colors tracking-wide">Teste de Agilidade 5-10-5</h4>
                    <p className="text-gray-400 text-base leading-relaxed">Avalia mudanças de direção e coordenação</p>
                    <span className="tooltip">Testa sua capacidade de mudar direção rapidamente, crucial para defensores</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group cursor-pointer tooltip-container p-6 rounded-xl glass-morph-dark border border-white/10 hover:border-verde-brasil/30 transition-all duration-300">
                  <div className="w-12 h-12 glass-morph-green rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-verde-brasil/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil to-verde-brasil/50 rounded-full"></div>
                    <Check className="text-white w-6 h-6 relative z-10" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bebas text-2xl text-white mb-2 group-hover:text-verde-brasil transition-colors tracking-wide">Habilidades Técnicas</h4>
                    <p className="text-gray-400 text-base leading-relaxed">Controle de bola, chutes e passes com precisão</p>
                    <span className="tooltip">Demonstre sua técnica apurada com exercícios específicos por posição</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleCTAClick("athlete")}
                className="glass-morph-green text-white px-10 py-6 text-xl font-semibold flex items-center gap-4 rounded-2xl h-auto shadow-2xl hover:shadow-verde-brasil/50 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
              >
                <Play className="w-6 h-6 relative z-10" />
                <span className="relative z-10">FAZER MEU PRIMEIRO TESTE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-verde-brasil to-verde-brasil/80 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <p className="text-base text-gray-400 mt-4 font-medium">Verificação por IA gratuita no seu primeiro teste</p>
            </div>
            
            <div className="fade-in relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Professional soccer training with cones and equipment" 
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-verde-brasil/30 via-transparent to-amarelo-ouro/30"></div>
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
      {/* Pricing Section */}
      <section id="precos" className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black"></div>
        <div className="absolute inset-0 bg-pattern-diagonal opacity-5"></div>
        
        {/* Animated gradient orbs */}
        <motion.div 
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-verde-brasil/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amarelo-ouro/10 rounded-full blur-3xl"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 drop-shadow-2xl">
              PLANOS QUE CRESCEM
              <span className="text-verde-brasil block drop-shadow-[0_0_20px_rgba(0,156,59,0.5)]">COM SEU TALENTO</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Escolha o plano ideal para sua jornada. Comece grátis e evolua conforme sua carreira decola.
            </p>
          </div>
          
          <div className="fade-in">
            <LandingPricingPlans onSelectPlan={handlePlanSelection} />
          </div>
          
          <div className="mt-16 text-center fade-in">
            <p className="text-lg text-gray-400 mb-8">
              <span className="text-verde-brasil font-semibold">Mais de 1.200 atletas</span> já transformaram suas carreiras com a Revela
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-5 h-5 text-verde-brasil" />
                <span className="text-sm">Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-5 h-5 text-verde-brasil" />
                <span className="text-sm">Cancele a Qualquer Momento</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-5 h-5 text-verde-brasil" />
                <span className="text-sm">7 Dias de Teste Grátis</span>
              </div>
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
                className="glass-morph-green text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[280px] h-auto rounded-2xl shadow-2xl hover:shadow-verde-brasil/50 relative overflow-hidden group"
              >
                <Terminal className="w-6 h-6 relative z-10" />
                <span className="relative z-10">COMECE SUA JORNADA (ATLETA)</span>
                <div className="absolute inset-0 bg-gradient-to-r from-verde-brasil to-verde-brasil/80 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                onClick={() => handleCTAClick("scout")}
                className="glass-morph text-white px-10 py-5 text-xl font-semibold flex items-center gap-3 min-w-[280px] h-auto rounded-2xl shadow-2xl hover:shadow-white/30 relative overflow-hidden group border border-white/20"
              >
                <Search className="w-6 h-6 relative z-10" />
                <span className="relative z-10">DESCOBRIR TALENTOS (SCOUT)</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
            
            {/* Social Proof Section */}
            <div className="mt-20 pt-12 border-t border-white/20">
              <h3 className="font-bebas text-2xl text-white/80 mb-8">CLUBES QUE CONFIAM NA REVELA</h3>
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
              <h3 className="font-bebas text-2xl verde-brasil mb-4">REVELA</h3>
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
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab={authModalTab}
        userType={selectedUserType || undefined}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
