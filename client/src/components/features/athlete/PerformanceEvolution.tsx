import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassTabs, GlassTabsContent, GlassTabsList, GlassTabsTrigger } from "@/components/ui/glass-tabs";
import PerformanceRadar from "@/components/ui/performance-radar";
import ProgressEnhanced from "@/components/ui/progress-enhanced";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { performanceService } from "@/services/api";

interface PerformanceEvolutionProps {
  athlete: {
    id?: string;
    speed: number;
    agility: number;
    technique: number;
    endurance: number;
  };
}

export function PerformanceEvolution({ athlete }: PerformanceEvolutionProps) {
  // Fetch historical performance data from API
  const { data: historyData = [] } = useQuery({
    queryKey: ['performance-history', athlete.id],
    queryFn: () => performanceService.getPerformanceHistory(athlete.id!),
    enabled: !!athlete.id,
  });

  // Fetch additional performance metrics
  const { data: performanceMetrics } = useQuery({
    queryKey: ['performance-metrics', athlete.id],
    queryFn: () => performanceService.getPerformanceMetrics(athlete.id!),
    enabled: !!athlete.id,
  });

  const performanceData = [
    { label: "Velocidade", value: athlete.speed },
    { label: "Agilidade", value: athlete.agility },
    { label: "Técnica", value: athlete.technique },
    { label: "Resistência", value: athlete.endurance },
    { label: "Força", value: performanceMetrics?.strength || 0 },
    { label: "Mental", value: performanceMetrics?.mental || 0 }
  ];

  return (
    <Card className="overflow-hidden glass-morph border-white/10 hover:border-white/20 transition-all duration-300">
      <CardHeader className="glass-morph-blue border-b border-white/10">
        <CardTitle className="tracking-tight font-bebas text-2xl flex items-center gap-2 text-white font-medium">
          <BarChart3 className="w-6 h-6" />
          ANÁLISE DE DESEMPENHO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <GlassTabs defaultValue="overview" className="w-full">
          <GlassTabsList className="grid w-full grid-cols-3 mb-6">
            <GlassTabsTrigger value="overview" className="font-semibold">Visão Geral</GlassTabsTrigger>
            <GlassTabsTrigger value="metrics" className="font-semibold">Métricas Detalhadas</GlassTabsTrigger>
            <GlassTabsTrigger value="history" className="font-semibold">Evolução no Tempo</GlassTabsTrigger>
          </GlassTabsList>

          <GlassTabsContent value="overview" className="mt-6">
            <div className="flex justify-center">
              <PerformanceRadar 
                data={performanceData}
                size={320}
                showLabels={true}
                animated={true}
              />
            </div>
          </GlassTabsContent>

          <GlassTabsContent value="metrics" className="space-y-6 mt-6">
            <ProgressEnhanced
              value={athlete.speed}
              label="Velocidade"
              average={72}
              trend={{ value: 5, direction: "up" }}
              comparison={{ value: 68, label: "Mês passado" }}
            />
            <ProgressEnhanced
              value={athlete.agility}
              label="Agilidade"
              average={70}
              trend={{ value: 8, direction: "up" }}
              comparison={{ value: athlete.agility - 8, label: "Mês passado" }}
            />
            <ProgressEnhanced
              value={athlete.technique}
              label="Técnica"
              average={65}
              trend={{ value: 3, direction: "up" }}
            />
            <ProgressEnhanced
              value={athlete.endurance}
              label="Resistência"
              average={68}
              trend={{ value: 2, direction: "down" }}
              comparison={{ value: athlete.endurance + 2, label: "Mês passado" }}
            />
          </GlassTabsContent>

          <GlassTabsContent value="history" className="mt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData.length > 0 ? historyData : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255, 255, 255, 0.6)"
                    style={{ fontFamily: 'Inter', fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.6)"
                    domain={[2.6, 2.9]}
                    ticks={[2.6, 2.7, 2.8, 2.9]}
                    style={{ fontFamily: 'Inter', fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px',
                      backdropFilter: 'blur(8px)'
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: 'white' }}
                    formatter={(value: any) => [`${value}s`, 'Tempo']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#009C3B" 
                    strokeWidth={3}
                    dot={{ fill: '#FFDF00', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Evolução do tempo no sprint de 20m nos últimos 6 meses
              </p>
              <p className="text-lg font-semibold text-green-400 mt-2">
                Melhoria de 5.3% no período
              </p>
            </div>
          </GlassTabsContent>
        </GlassTabs>
      </CardContent>
    </Card>
  );
}