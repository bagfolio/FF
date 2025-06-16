import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  type: "no-athletes" | "no-tests" | "no-activity" | "no-results" | "no-achievements" | "generic";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const illustrations = {
  "no-athletes": (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto mb-6">
      <defs>
        <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009C3B" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFDF00" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Football field */}
      <rect x="20" y="40" width="160" height="120" rx="8" fill="url(#fieldGradient)" stroke="#009C3B" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="100" y1="40" x2="100" y2="160" stroke="#009C3B" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="20" fill="none" stroke="#009C3B" strokeWidth="1" opacity="0.5" />
      {/* Football */}
      <circle cx="100" cy="100" r="12" fill="#FFDF00" opacity="0.8" className="animate-pulse" />
      {/* Search icon */}
      <circle cx="150" cy="150" r="20" fill="white" stroke="#002776" strokeWidth="2" />
      <circle cx="150" cy="150" r="12" fill="none" stroke="#002776" strokeWidth="2" />
      <line x1="160" y1="160" x2="170" y2="170" stroke="#002776" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  
  "no-tests": (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto mb-6">
      <defs>
        <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFDF00" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>
      {/* Trophy silhouette */}
      <path d="M100 40 L120 60 L120 90 Q120 110 100 120 Q80 110 80 90 L80 60 Z" 
            fill="url(#trophyGradient)" opacity="0.3" className="animate-pulse" />
      <rect x="90" y="120" width="20" height="30" fill="#FFDF00" opacity="0.3" />
      <rect x="70" y="150" width="60" height="10" rx="2" fill="#FFDF00" opacity="0.3" />
      {/* Stars */}
      <path d="M60 50 L62 56 L68 56 L63 60 L65 66 L60 62 L55 66 L57 60 L52 56 L58 56 Z" 
            fill="#009C3B" opacity="0.6" className="animate-twinkle" />
      <path d="M140 50 L142 56 L148 56 L143 60 L145 66 L140 62 L135 66 L137 60 L132 56 L138 56 Z" 
            fill="#002776" opacity="0.6" className="animate-twinkle animation-delay-500" />
    </svg>
  ),
  
  "no-activity": (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto mb-6">
      <defs>
        <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009C3B" />
          <stop offset="100%" stopColor="#FFDF00" />
        </linearGradient>
      </defs>
      {/* Bouncing ball animation */}
      <circle cx="100" cy="100" r="20" fill="url(#ballGradient)" className="animate-bounce-slow">
        <animate attributeName="cy" values="100;140;100" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Motion lines */}
      <path d="M80 90 Q70 95 60 90" stroke="#009C3B" strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M120 90 Q130 95 140 90" stroke="#FFDF00" strokeWidth="2" fill="none" opacity="0.3" />
      {/* Ground line */}
      <line x1="40" y1="160" x2="160" y2="160" stroke="#002776" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
    </svg>
  ),
  
  "no-results": (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto mb-6">
      <defs>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#002776" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#009C3B" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Magnifying glass */}
      <circle cx="85" cy="85" r="35" fill="url(#searchGradient)" stroke="#002776" strokeWidth="3" />
      <line x1="110" y1="110" x2="130" y2="130" stroke="#002776" strokeWidth="4" strokeLinecap="round" />
      {/* Question mark */}
      <text x="85" y="95" fontSize="30" fontWeight="bold" fill="#002776" textAnchor="middle" opacity="0.5">?</text>
      {/* Filter icons */}
      <rect x="150" y="50" width="30" height="5" rx="2" fill="#009C3B" opacity="0.5" />
      <rect x="150" y="60" width="25" height="5" rx="2" fill="#FFDF00" opacity="0.5" />
      <rect x="150" y="70" width="20" height="5" rx="2" fill="#002776" opacity="0.5" />
    </svg>
  ),
  
  "no-achievements": (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto mb-6">
      <defs>
        <linearGradient id="medalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFDF00" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      {/* Medal shapes */}
      <circle cx="60" cy="80" r="25" fill="#CD7F32" opacity="0.3" /> {/* Bronze */}
      <circle cx="100" cy="70" r="30" fill="#C0C0C0" opacity="0.3" /> {/* Silver */}
      <circle cx="140" cy="80" r="25" fill="url(#medalGradient)" opacity="0.3" /> {/* Gold */}
      {/* Ribbons */}
      <rect x="55" y="40" width="10" height="30" fill="#CD7F32" opacity="0.2" />
      <rect x="95" y="30" width="10" height="30" fill="#C0C0C0" opacity="0.2" />
      <rect x="135" y="40" width="10" height="30" fill="#FFDF00" opacity="0.2" />
      {/* Lock icon */}
      <rect x="85" y="120" width="30" height="25" rx="3" fill="#002776" opacity="0.5" />
      <path d="M90 120 Q90 110 100 110 Q110 110 110 120" fill="none" stroke="#002776" strokeWidth="3" opacity="0.5" />
    </svg>
  ),
  
  "generic": (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto mb-6">
      <defs>
        <linearGradient id="genericGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009C3B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#002776" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="50" y="50" width="100" height="100" rx="10" fill="url(#genericGradient)" />
      <circle cx="100" cy="100" r="30" fill="#FFDF00" opacity="0.3" className="animate-pulse" />
    </svg>
  )
};

const defaultContent = {
  "no-athletes": {
    title: "Descubra novos talentos aqui",
    description: "Use os filtros avançados para encontrar atletas verificados que correspondem ao seu perfil ideal."
  },
  "no-tests": {
    title: "Comece sua jornada",
    description: "Realize seu primeiro teste verificado e mostre seu talento para scouts de todo o Brasil."
  },
  "no-activity": {
    title: "Em breve, novidades!",
    description: "Suas atividades e notificações aparecerão aqui quando você começar a usar a plataforma."
  },
  "no-results": {
    title: "Nenhum resultado encontrado",
    description: "Tente ajustar seus filtros ou ampliar sua busca para encontrar mais atletas."
  },
  "no-achievements": {
    title: "Suas conquistas virão",
    description: "Complete testes e melhore seu perfil para desbloquear conquistas e subir de nível."
  },
  "generic": {
    title: "Nada aqui ainda",
    description: "Este conteúdo estará disponível em breve."
  }
};

export default function EmptyState({ type, title, description, action, className }: EmptyStateProps) {
  const content = defaultContent[type];
  
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="max-w-md mx-auto">
        {illustrations[type]}
        <h3 className="font-bebas text-2xl text-gray-800 mb-2">
          {title || content.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {description || content.description}
        </p>
        {action && (
          <Button onClick={action.onClick} className="btn-primary">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Add CSS animations
const styles = `
@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.background-animate {
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}