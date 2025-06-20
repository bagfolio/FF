import React, { useState } from 'react';
import { 
  GlassModal, 
  GlassModalContent, 
  GlassModalHeader, 
  GlassModalTitle,
  GlassModalDescription 
} from '@/components/ui/glass-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'athlete' | 'scout';
  selectedPlan?: 'basic' | 'pro' | 'elite' | null;
}

export function AuthModal({ open, onOpenChange, defaultTab = 'login', userType, selectedPlan }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();

  const handleSuccess = async () => {
    await refetch();
    onOpenChange(false);
    
    // Store selected plan in session storage for post-onboarding checkout
    if (selectedPlan && selectedPlan !== 'basic') {
      sessionStorage.setItem('selectedPlan', selectedPlan);
    }
    
    // Redirect based on user type
    if (userType === 'athlete') {
      setLocation('/athlete/onboarding');
    } else if (userType === 'scout') {
      setLocation('/scout/onboarding');
    } else {
      setLocation('/auth/welcome');
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab('login');
  };

  return (
    <GlassModal open={open} onOpenChange={onOpenChange}>
      <GlassModalContent variant="dark" className="max-w-md">
        <GlassModalHeader>
          <GlassModalTitle className="text-2xl font-bold text-white text-center">
            {showForgotPassword 
              ? 'Recuperar Senha' 
              : activeTab === 'login' 
                ? 'Bem-vindo de volta!' 
                : 'Crie sua conta'}
          </GlassModalTitle>
          <GlassModalDescription className="text-center text-white/70">
            {showForgotPassword
              ? 'Digite seu email para receber instruções'
              : activeTab === 'login'
                ? 'Entre para acessar sua conta'
                : 'Junte-se à revolução do futebol brasileiro'}
          </GlassModalDescription>
        </GlassModalHeader>

        {showForgotPassword ? (
          <ForgotPasswordForm 
            onSuccess={handleBackToLogin}
            onCancel={handleBackToLogin}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-verde-brasil data-[state=active]:text-white"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-verde-brasil data-[state=active]:text-white"
              >
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <LoginForm 
                onSuccess={handleSuccess}
                onForgotPassword={handleForgotPassword}
              />
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <SignupForm 
                onSuccess={handleSuccess}
                userType={userType}
              />
            </TabsContent>
          </Tabs>
        )}
      </GlassModalContent>
    </GlassModal>
  );
}