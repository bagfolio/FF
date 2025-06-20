import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface LandingPricingPlansProps {
  onSelectPlan: (planName: 'basic' | 'pro' | 'elite') => void;
}

const features = [
  { name: "Perfil básico de atleta", basic: true, pro: true, elite: true },
  { name: "Upload de fotos", basic: true, pro: true, elite: true },
  { name: "Autoavaliação de habilidades", basic: true, pro: true, elite: true },
  { name: "Visibilidade para scouts", basic: false, pro: true, elite: true },
  { name: "Testes de verificação mensais", basic: "0", pro: "3", elite: "Ilimitados" },
  { name: "Selo de verificação", basic: false, pro: true, elite: true },
  { name: "Análise prioritária", basic: false, pro: false, elite: true },
  { name: "Suporte prioritário", basic: false, pro: false, elite: true },
  { name: "Destaque nas buscas", basic: false, pro: false, elite: true },
  { name: "Perfis adicionais", basic: "1", pro: "1", elite: "3" },
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
      className="grid gap-8 lg:grid-cols-3"
    >
      {/* Basic Plan */}
      <motion.div variants={cardVariants} whileHover={{ y: -8 }}>
        <Card className="relative glass-morph-dark border-white/10 hover:border-white/20 transition-all duration-300 h-full">
        <CardHeader>
          <CardTitle className="text-white">Revela Basic</CardTitle>
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
                {feature.basic === true ? (
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
                  <motion.span 
                    className="w-5 h-5 shrink-0 mt-0.5 text-center text-sm font-medium text-white"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    {feature.basic}
                  </motion.span>
                )}
                <span className={feature.basic === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
        <CardFooter>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button 
              className="w-full glass-morph-green text-white hover:shadow-verde-brasil/30 transition-all duration-300"
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
        whileHover={{ y: -12, scale: 1.05 }}
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
        <Card className="relative glass-morph-dark border-verde-brasil/50 hover:border-verde-brasil transition-all duration-300 h-full">
          <motion.div 
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Badge className="bg-verde-brasil text-white border-0">Mais Popular</Badge>
          </motion.div>
        <CardHeader>
          <CardTitle className="text-white">Revela Pro</CardTitle>
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
                {feature.pro === true ? (
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
                  <motion.span 
                    className="w-5 h-5 shrink-0 mt-0.5 text-center text-sm font-medium text-white"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    {feature.pro}
                  </motion.span>
                )}
                <span className={feature.pro === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
        <CardFooter>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button 
              className="w-full bg-verde-brasil hover:bg-verde-brasil/90 text-white shadow-lg hover:shadow-verde-brasil/50 transition-all duration-300"
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
        <Card className="relative glass-morph-dark border-amarelo-ouro/30 hover:border-amarelo-ouro/50 transition-all duration-300 h-full">
        <CardHeader>
          <CardTitle className="text-white">Revela Elite</CardTitle>
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
                {feature.elite === true ? (
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
                  <motion.span 
                    className="w-5 h-5 shrink-0 mt-0.5 text-center text-sm font-medium text-white"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    {feature.elite}
                  </motion.span>
                )}
                <span className={feature.elite === false ? "text-gray-600" : "text-gray-300"}>
                  {feature.name}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
        <CardFooter>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button 
              className="w-full glass-morph-yellow text-black hover:shadow-amarelo-ouro/30 transition-all duration-300"
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