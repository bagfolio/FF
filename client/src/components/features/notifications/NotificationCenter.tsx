import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Eye,
  Trophy,
  TestTube,
  CreditCard,
  Info,
  Users,
  Check,
  CheckCheck,
  X,
} from "lucide-react";

const notificationIcons = {
  scout_view: Eye,
  achievement: Trophy,
  test_result: TestTube,
  subscription: CreditCard,
  system: Info,
  parental_consent: Users,
};

const notificationColors = {
  scout_view: "text-blue-600",
  achievement: "text-yellow-600",
  test_result: "text-green-600",
  subscription: "text-purple-600",
  system: "text-gray-600",
  parental_consent: "text-orange-600",
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const {
    notifications,
    unreadNotifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead([notification.id]);
    }
    if (notification.actionUrl) {
      setLocation(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const renderNotification = (notification: any) => {
    const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Info;
    const colorClass = notificationColors[notification.type as keyof typeof notificationColors] || "text-gray-600";
    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
      addSuffix: true,
      locale: ptBR,
    });

    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${
          !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
        }`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex gap-3">
          <div
            className={`mt-0.5 p-2 rounded-full bg-background border ${colorClass}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium leading-tight">
                {notification.title}
              </h4>
              {!notification.read && (
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full p-0 text-[10px] font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                className="text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="all" className="flex-1">
              Todas
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 relative">
              Não lidas
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 min-w-[20px] rounded-full p-0 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="m-0">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Carregando notificações...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Nenhuma notificação</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map(renderNotification)}
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              {unreadNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Check className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    Todas as notificações foram lidas
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {unreadNotifications.map(renderNotification)}
                </AnimatePresence>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => {
              setLocation("/notifications");
              setIsOpen(false);
            }}
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}