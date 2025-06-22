import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComingSoonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  className?: string;
}

export function ComingSoonCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = "text-amarelo-ouro",
  className 
}: ComingSoonCardProps) {
  return (
    <div className={cn("glass-morph-dark rounded-2xl p-8 text-center", className)}>
      <Icon className={cn("w-16 h-16 mx-auto mb-4", iconColor)} />
      <h3 className="text-2xl font-bebas mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  );
}