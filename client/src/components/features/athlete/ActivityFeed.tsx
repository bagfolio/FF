import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trophy, TrendingUp, Award, Play, ChevronRight, Bell, Circle } from "lucide-react";
import { useLocation } from "wouter";

interface Activity {
  id?: string;
  type: "view" | "achievement" | "test" | "update" | "rank";
  message: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [, setLocation] = useLocation();
  
  const iconConfig = {
    view: { icon: Eye, color: "text-verde-brasil", bg: "bg-green-100" },
    achievement: { icon: Trophy, color: "text-amarelo-ouro", bg: "bg-yellow-100" },
    test: { icon: Play, color: "text-azul-celeste", bg: "bg-blue-100" },
    update: { icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
    rank: { icon: Award, color: "text-orange-600", bg: "bg-orange-100" }
  };

  return (
    <Card className="shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 relative border-b-2 border-blue-200">
        <CardTitle className="font-bebas text-xl text-azul-celeste flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            ATIVIDADE
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 bg-green-500 animate-pulse" />
            <span className="text-xs font-normal text-gray-600">Ao vivo</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => {
            const config = iconConfig[activity.type] || iconConfig.update;
            const Icon = config.icon;
            
            return (
              <div 
                key={activity.id || index} 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium line-clamp-2">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-3" 
          size="sm"
          onClick={() => setLocation('/athlete/activity')}
        >
          Ver Todas
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}