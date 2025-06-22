import React from 'react';
import { 
  GlassModal, 
  GlassModalContent, 
  GlassModalHeader, 
  GlassModalTitle,
  GlassModalDescription 
} from '@/components/ui/glass-modal';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'athlete' | 'scout';
  selectedPlan?: 'basic' | 'pro' | 'elite' | null;
}

export function AuthModal({ open, onOpenChange, userType, selectedPlan }: AuthModalProps) {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    // Store selected plan in session storage for post-onboarding checkout
    if (selectedPlan && selectedPlan !== 'basic') {
      sessionStorage.setItem('selectedPlan', selectedPlan);
    }
    
    // Store user type for the onboarding flow
    if (userType) {
      sessionStorage.setItem('selectedUserType', userType);
    }
    
    // Redirect to Replit OAuth
    window.location.href = '/api/login';
  };

  return (
    <GlassModal open={open} onOpenChange={onOpenChange}>
      <GlassModalContent variant="dark" className="max-w-md">
        <GlassModalHeader>
          <GlassModalTitle className="text-2xl font-bold text-white text-center">
            Bem-vindo ao Revela
          </GlassModalTitle>
          <GlassModalDescription className="text-center text-white/70">
            A revolução do futebol brasileiro começa aqui
          </GlassModalDescription>
        </GlassModalHeader>

        <div className="mt-6 space-y-4">
          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/90 hover:to-amarelo-ouro/90 text-white font-semibold py-6 text-lg"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-8c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>
            </svg>
            Continuar com Login Seguro
          </Button>

          <p className="text-sm text-white/60 text-center mt-2">
            Use sua conta existente para acessar a plataforma
          </p>

          <p className="text-xs text-white/50 text-center">
            Ao continuar, você concorda com nossos{' '}
            <a href="/termos" className="text-verde-brasil hover:underline">
              termos de uso
            </a>{' '}
            e{' '}
            <a href="/privacidade" className="text-verde-brasil hover:underline">
              política de privacidade
            </a>
          </p>
        </div>
      </GlassModalContent>
    </GlassModal>
  );
}