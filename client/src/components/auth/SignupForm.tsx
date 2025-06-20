import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Eye, EyeOff, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const passwordSchema = z.string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');

const signupSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de uso'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
  userType?: 'athlete' | 'scout';
}

export function SignupForm({ onSuccess, userType }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: false
    }
  });

  const password = watch('password');
  const acceptTerms = watch('acceptTerms');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) return { level: 'weak', color: 'bg-red-500', text: 'Fraca' };
    if (strength < 5) return { level: 'medium', color: 'bg-yellow-500', text: 'Média' };
    return { level: 'strong', color: 'bg-green-500', text: 'Forte' };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/register', {
        ...data,
        userType: userType || 'athlete'
      });
      
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Verifique seu email para ativar sua conta.',
      });
      
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast({
        title: 'Erro ao criar conta',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">Nome</Label>
          <Input
            id="firstName"
            placeholder="João"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            {...register('firstName')}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-sm text-red-400">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">Sobrenome</Label>
          <Input
            id="lastName"
            placeholder="Silva"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            {...register('lastName')}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-400">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
            {...register('password')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordStrength && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/10 rounded">
                <div 
                  className={cn(
                    "h-full rounded transition-all",
                    passwordStrength.color,
                    passwordStrength.level === 'weak' && 'w-1/3',
                    passwordStrength.level === 'medium' && 'w-2/3',
                    passwordStrength.level === 'strong' && 'w-full'
                  )}
                />
              </div>
              <span className="text-xs text-white/70">{passwordStrength.text}</span>
            </div>
          </div>
        )}
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
            className="border-white/20 data-[state=checked]:bg-verde-brasil data-[state=checked]:border-verde-brasil mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm text-white/70 cursor-pointer">
            Aceito os{' '}
            <a href="/termos" target="_blank" className="text-verde-brasil hover:underline">
              termos de uso
            </a>{' '}
            e a{' '}
            <a href="/privacidade" target="_blank" className="text-verde-brasil hover:underline">
              política de privacidade
            </a>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-400">{errors.acceptTerms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/90 hover:to-amarelo-ouro/90 text-white font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          'Criar conta'
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-white/50">Ou cadastre-se com</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-white/20 text-white hover:bg-white/10"
        onClick={() => window.location.href = '/api/login'}
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="mr-2 h-4 w-4"
        />
        Cadastrar com Google
      </Button>
    </form>
  );
}