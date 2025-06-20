import { useState, useEffect } from "react";
import { Users, TrendingUp, Award, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/services/api";
import { API_CONFIG, FEATURES } from "@/config/api";

interface SocialProofNotificationProps {
  className?: string;
}

// Icon mapping for notification types
const notificationConfig = {
  scout_view: {
    icon: Users,
    color: "text-verde-brasil",
    bg: "glass-morph-green"
  },
  athlete_achievement: {
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "glass-morph-blue"
  },
  test_completed: {
    icon: Award,
    color: "text-amarelo-ouro",
    bg: "glass-morph-yellow"
  },
  scouts_online: {
    icon: Eye,
    color: "text-purple-400",
    bg: "glass-morph-purple"
  }
};

export function SocialProofNotification({ className = "" }: SocialProofNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch real-time notifications from API
  const { data: notifications = [] } = useQuery({
    queryKey: ['social-proof-notifications'],
    queryFn: () => activityService.getSocialProofNotifications(),
    refetchInterval: API_CONFIG.POLLING.SOCIAL_PROOF,
    enabled: FEATURES.SOCIAL_PROOF_NOTIFICATIONS,
  });

  useEffect(() => {
    if (notifications.length === 0) return;
    
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
  }, [notifications.length]);

  if (notifications.length === 0) return null;

  const notification = notifications[currentIndex];
  const config = notificationConfig[notification.type as keyof typeof notificationConfig] || notificationConfig.scout_view;
  const Icon = config.icon;

  return (
    <div className={`fixed bottom-8 left-8 z-40 ${className}`}>
      <div className={`
        glass-morph backdrop-blur-xl rounded-lg shadow-lg border-2 border-white/20 p-4 flex items-center gap-3
        transform transition-all duration-500 
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}>
        <div className={`w-10 h-10 ${config.bg} rounded-full flex items-center justify-center shadow-md`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{notification.message}</p>
          <p className="text-xs text-white/60">{notification.time}</p>
        </div>
      </div>
    </div>
  );
}