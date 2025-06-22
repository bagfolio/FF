import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function StripeModeIndicator() {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if we're in development and using live keys
    const checkStripeMode = async () => {
      try {
        const response = await fetch('/api/stripe/mode');
        if (response.ok) {
          const data = await response.json();
          setIsLiveMode(data.isLive && process.env.NODE_ENV === 'development');
        }
      } catch (error) {
        console.error('Failed to check Stripe mode:', error);
      }
    };

    checkStripeMode();
  }, []);

  if (!isLiveMode || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom">
      <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="ml-2">
          <strong className="text-orange-700 dark:text-orange-300">
            ⚠️ MODO AO VIVO - Stripe
          </strong>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
            Você está usando chaves REAIS do Stripe. Qualquer pagamento será cobrado de verdade.
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs text-orange-500 hover:text-orange-700 mt-2 underline"
          >
            Entendi, ocultar aviso
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}