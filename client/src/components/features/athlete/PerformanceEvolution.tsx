import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerformanceRadar from "@/components/ui/performance-radar";
import ProgressEnhanced from "@/components/ui/progress-enhanced";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

interface PerformanceEvolutionProps {
  athlete: {
    speed: number;
    agility: number;
    technique: number;
    endurance: number;
  };
}

const mockHistoryData = [
  { month: 'Abr', time: 2.85 },
  { month: 'Mai', time: 2.81 },
  { month: 'Jun', time: 2.76 },
  { month: 'Jul', time: 2.74 },
  { month: 'Ago', time: 2.72 },
  { month: 'Set', time: 2.70 }
];

export function PerformanceEvolution({ athlete }: PerformanceEvolutionProps) {
  const performanceData = [
    { label: "Velocidade", value: athlete.speed },
    { label: "Agilidade", value: athlete.agility },
    { label: "Técnica", value: athlete.technique },
    { label: "Resistência", value: athlete.endurance },
    { label: "Força", value: Math.floor(Math.random() * 30) + 60 },
    { label: "Mental", value: Math.floor(Math.random() * 30) + 65 }
  ];

  return (
    <Card className="overflow-hidden shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
        <CardTitle className="tracking-tight font-bebas text-2xl flex items-center gap-2 text-azul-celeste font-medium">
          <BarChart3 className="w-6 h-6" />
          ANÁLISE DE DESEMPENHO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="font-semibold">Visão Geral</TabsTrigger>
            <TabsTrigger value="metrics" className="font-semibold">Métricas Detalhadas</TabsTrigger>
            <TabsTrigger value="history" className="font-semibold">Evolução no Tempo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="flex justify-center">
              <PerformanceRadar 
                data={performanceData}
                size={320}
                showLabels={true}
                animated={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6 mt-6">
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
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    style={{ fontFamily: 'Inter', fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    domain={[2.6, 2.9]}
                    ticks={[2.6, 2.7, 2.8, 2.9]}
                    style={{ fontFamily: 'Inter', fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
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
              <p className="text-sm text-gray-600">
                Evolução do tempo no sprint de 20m nos últimos 6 meses
              </p>
              <p className="text-lg font-semibold text-verde-brasil mt-2">
                Melhoria de 5.3% no período
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}