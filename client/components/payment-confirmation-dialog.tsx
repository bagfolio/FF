import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  planName: string;
  price: string;
  isLiveMode?: boolean;
}

export function PaymentConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  planName,
  price,
  isLiveMode = false,
}: PaymentConfirmationDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setIsConfirmed(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    setIsConfirmed(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isLiveMode ? (
              <>
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Confirmar Pagamento Real
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 text-green-600" />
                Confirmar Assinatura
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              Você está prestes a assinar o plano <strong>{planName}</strong> por{' '}
              <strong>{price}</strong>.
            </div>
            
            {isLiveMode && (
              <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-md border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                  ⚠️ ATENÇÃO: Este é um pagamento REAL!
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Seu cartão será cobrado de verdade. Esta não é uma transação de teste.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Ao continuar, você será redirecionado para o checkout seguro do Stripe.
              </p>
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="confirm"
                  checked={isConfirmed}
                  onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
                />
                <label
                  htmlFor="confirm"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Eu entendo e desejo continuar com a assinatura
                  {isLiveMode && ' (cobrança real)'}
                </label>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className={isLiveMode ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            Continuar para Pagamento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}