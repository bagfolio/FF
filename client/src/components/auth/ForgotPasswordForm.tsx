import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ForgotPasswordForm({ onSuccess, onCancel }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await api.post('/api/auth/forgot-password', data);
      
      setIsSuccess(true);
      toast({
        title: 'Email enviado!',
        description: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar email',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-verde-brasil/20 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-verde-brasil" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Email enviado!</h3>
          <p className="text-sm text-white/70">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
        </div>

        <Button
          onClick={onSuccess}
          className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/90 hover:to-amarelo-ouro/90 text-white font-semibold"
        >
          Voltar ao login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao login
      </button>

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

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro hover:from-verde-brasil/90 hover:to-amarelo-ouro/90 text-white font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar instruções'
        )}
      </Button>
    </form>
  );
}