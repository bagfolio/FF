import { useState, useEffect } from "react";
import { Users, TrendingUp, Award, Eye } from "lucide-react";

interface SocialProofNotificationProps {
  className?: string;
}

const notifications = [
  {
    icon: Users,
    color: "text-verde-brasil",
    bg: "bg-green-100",
    message: "Scout do Flamengo visualizou seu perfil",
    time: "há 2 min"
  },
  {
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-100",
    message: "João Silva subiu para o Top 10% nacional",
    time: "há 5 min"
  },
  {
    icon: Award,
    color: "text-amarelo-ouro",
    bg: "bg-yellow-100",
    message: "Maria completou o Teste de Agilidade",
    time: "há 8 min"
  },
  {
    icon: Eye,
    color: "text-purple-600",
    bg: "bg-purple-100",
    message: "3 scouts estão online agora",
    time: "agora"
  }
];

export function SocialProofNotification({ className = "" }: SocialProofNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 3000);
    
    const rotateTimer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(rotateTimer);
    };
  }, []);

  const notification = notifications[currentIndex];
  const Icon = notification.icon;

  return (
    <div className={`fixed bottom-8 left-8 z-40 ${className}`}>
      <div className={`
        bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-lg border-2 border-gray-200 p-4 flex items-center gap-3
        transform transition-all duration-500 
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}>
        <div className={`w-10 h-10 ${notification.bg} rounded-full flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${notification.color}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{notification.message}</p>
          <p className="text-xs text-gray-500">{notification.time}</p>
        </div>
      </div>
    </div>
  );
}