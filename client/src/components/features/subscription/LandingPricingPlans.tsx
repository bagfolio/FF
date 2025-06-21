import { Check, X, Trophy, CircleDot, Goal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface LandingPricingPlansProps {
  onSelectPlan: (planName: 'basic' | 'pro' | 'elite') => void;
}

const features = [
  { name: "Perfil completo de atleta", basic: true, pro: true, elite: true },
  { name: "Vídeos de highlights", basic: "2 vídeos", pro: "10 vídeos", elite: "Ilimitado" },
  { name: "Estatísticas de desempenho", basic: true, pro: true, elite: true },
  { name: "Visibilidade para scouts", basic: false, pro: true, elite: true },
  { name: "Testes físicos verificados", basic: false, pro: "3/mês", elite: "Ilimitado", icon: CircleDot },
  { name: "Selo de atleta verificado", basic: false, pro: true, elite: true, icon: Trophy },
  { name: "Análise técnica por IA", basic: false, pro: "Básica", elite: "Avançada" },
  { name: "Conexão direta com clubes", basic: false, pro: false, elite: true },
  { name: "Destaque em pesquisas", basic: false, pro: false, elite: true },
  { name: "Relatórios de evolução", basic: false, pro: "Mensal", elite: "Semanal", icon: Goal },
];

export function LandingPricingPlans({ onSelectPlan }: LandingPricingPlansProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="grid gap-8 lg:grid-cols-3 overflow-visible"
    >
      {/* Basic Plan */}
      <motion.div variants={cardVariants} whileHover={{ y: -8 }}>
        <Card className="relative glass-morph-pricing-basic stadium-spotlight pattern-brazilian h-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Revela Basic</CardTitle>
          <CardDescription className="text-gray-400">Perfeito para começar sua jornada</CardDescription>
          <motion.div 
            className="mt-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-4xl font-bold text-white">Grátis</span>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li 
                key={feature.name} 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                {typeof feature.icon === 'function' && feature.basic === false ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <feature.icon className="h-5 w-5 icon-referee shrink-0 mt-0.5" />
                  </motion.div>
                ) : feature.basic === true ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <Check className="h-5 w-5 text-verde-brasil shrink-0 mt-0.5" />
                  </motion.div>
                ) : feature.basic === false ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    <X className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                  </motion.div>
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span className={feature.basic === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                  {typeof feature.basic === 'string' && (
                    <motion.span 
                      className="text-verde-brasil font-medium ml-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      ({feature.basic})
                    </motion.span>
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
        <CardFooter>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button 
              className="w-full glass-morph-green text-white hover:shadow-verde-brasil/30 transition-all duration-300 font-bold"
              onClick={() => onSelectPlan('basic')}
            >
              Começar Grátis
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
      </motion.div>

      {/* Pro Plan */}
      <motion.div 
        variants={cardVariants} 
        whileHover={{ y: -12, scale: 1.02 }}
        className="relative"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 0 0 rgba(0, 156, 59, 0)",
              "0 0 0 8px rgba(0, 156, 59, 0.1)",
              "0 0 0 0 rgba(0, 156, 59, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl"
        />
        <Card className="relative glass-morph-pricing-pro stadium-spotlight pattern-brazilian h-full">
          <motion.div 
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <div className="badge-popular badge-championship">
              Mais Popular
            </div>
          </motion.div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Revela Pro</CardTitle>
          <CardDescription className="text-gray-400">Para atletas sérios sobre seu futuro</CardDescription>
          <motion.div 
            className="mt-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="text-4xl font-bold text-white inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(0, 156, 59, 0)",
                  "0 0 20px rgba(0, 156, 59, 0.5)",
                  "0 0 20px rgba(0, 156, 59, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              R$ 29,90
            </motion.span>
            <span className="text-gray-400">/mês</span>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li 
                key={feature.name} 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                {typeof feature.icon === 'function' && typeof feature.pro === 'string' ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <feature.icon className="h-5 w-5 icon-soccer-ball shrink-0 mt-0.5" />
                  </motion.div>
                ) : feature.pro === true ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <Check className="h-5 w-5 text-verde-brasil shrink-0 mt-0.5" />
                  </motion.div>
                ) : feature.pro === false ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    <X className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                  </motion.div>
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span className={feature.pro === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                  {typeof feature.pro === 'string' && (
                    <motion.span 
                      className="text-verde-brasil font-medium ml-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      ({feature.pro})
                    </motion.span>
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
        <CardFooter>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button 
              className="w-full bg-verde-brasil hover:bg-verde-brasil/90 text-white shadow-lg hover:shadow-verde-brasil/50 transition-all duration-300 font-bold"
              onClick={() => onSelectPlan('pro')}
            >
              Assinar Pro
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
      </motion.div>

      {/* Elite Plan */}
      <motion.div variants={cardVariants} whileHover={{ y: -8 }}>
        <Card className="relative glass-morph-pricing-elite stadium-spotlight pattern-brazilian h-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Revela Elite</CardTitle>
          <CardDescription className="text-gray-400">Máximo desempenho e visibilidade</CardDescription>
          <motion.div 
            className="mt-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-4xl font-bold text-white">R$ 79,90</span>
            <span className="text-gray-400">/mês</span>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li 
                key={feature.name} 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                {typeof feature.icon === 'function' && typeof feature.elite === 'string' ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <feature.icon className="h-5 w-5 icon-goalpost shrink-0 mt-0.5" />
                  </motion.div>
                ) : feature.elite === true ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <Check className="h-5 w-5 text-verde-brasil shrink-0 mt-0.5" />
                  </motion.div>
                ) : feature.elite === false ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    <X className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                  </motion.div>
                ) : (
                  <span className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span className={feature.elite === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                  {typeof feature.elite === 'string' && (
                    <motion.span 
                      className="text-amarelo-ouro font-medium ml-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      ({feature.elite})
                    </motion.span>
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
        <CardFooter>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button 
              className="w-full btn-elite"
              onClick={() => onSelectPlan('elite')}
            >
              Assinar Elite
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
      </motion.div>
    </motion.div>
  );
}