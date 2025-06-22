import type { Response } from '../types/express';

export enum StripeErrorType {
  API_KEY_INVALID = 'API_KEY_INVALID',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND',
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  WEBHOOK_SIGNATURE_INVALID = 'WEBHOOK_SIGNATURE_INVALID',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface StripeErrorDetails {
  type: StripeErrorType;
  message: string;
  userMessage: string;
  statusCode: number;
  originalError?: any;
}

export class StripeErrorHandler {
  static handleError(error: any): StripeErrorDetails {
    console.error('[Stripe Error]', error);

    // Check if it's a Stripe error
    if (error.type && error.type.includes('Stripe')) {
      return this.handleStripeError(error);
    }

    // Configuration errors
    if (error.message?.includes('não está configurado') || 
        error.message?.includes('not configured')) {
      return {
        type: StripeErrorType.CONFIGURATION_ERROR,
        message: error.message,
        userMessage: 'O sistema de pagamento não está configurado corretamente. Por favor, contate o suporte.',
        statusCode: 500
      };
    }

    // Network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return {
        type: StripeErrorType.NETWORK_ERROR,
        message: 'Network error connecting to Stripe',
        userMessage: 'Erro de conexão com o sistema de pagamento. Por favor, tente novamente.',
        statusCode: 503
      };
    }

    // Default error
    return {
      type: StripeErrorType.UNKNOWN_ERROR,
      message: error.message || 'Unknown error occurred',
      userMessage: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
      statusCode: 500,
      originalError: error
    };
  }

  private static handleStripeError(error: any): StripeErrorDetails {
    switch (error.type) {
      case 'StripeAuthenticationError':
        return {
          type: StripeErrorType.API_KEY_INVALID,
          message: 'Invalid API key',
          userMessage: 'Erro de configuração do sistema. Por favor, contate o suporte.',
          statusCode: 500
        };

      case 'StripeCardError':
        return {
          type: StripeErrorType.PAYMENT_FAILED,
          message: error.message,
          userMessage: this.getCardErrorMessage(error.code),
          statusCode: 402
        };

      case 'StripeInvalidRequestError':
        if (error.param === 'customer') {
          return {
            type: StripeErrorType.CUSTOMER_NOT_FOUND,
            message: 'Customer not found',
            userMessage: 'Cliente não encontrado. Por favor, faça login novamente.',
            statusCode: 404
          };
        }
        return {
          type: StripeErrorType.UNKNOWN_ERROR,
          message: error.message,
          userMessage: 'Requisição inválida. Por favor, verifique os dados e tente novamente.',
          statusCode: 400
        };

      case 'StripeRateLimitError':
        return {
          type: StripeErrorType.NETWORK_ERROR,
          message: 'Too many requests',
          userMessage: 'Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.',
          statusCode: 429
        };

      default:
        return {
          type: StripeErrorType.UNKNOWN_ERROR,
          message: error.message,
          userMessage: 'Erro no processamento do pagamento. Por favor, tente novamente.',
          statusCode: 500
        };
    }
  }

  private static getCardErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      'card_declined': 'Cartão recusado. Por favor, verifique os dados ou use outro cartão.',
      'incorrect_cvc': 'CVC incorreto. Por favor, verifique o código de segurança.',
      'expired_card': 'Cartão expirado. Por favor, use um cartão válido.',
      'processing_error': 'Erro no processamento. Por favor, tente novamente.',
      'incorrect_number': 'Número do cartão inválido. Por favor, verifique.',
      'insufficient_funds': 'Fundos insuficientes. Por favor, use outro método de pagamento.'
    };

    return errorMessages[code] || 'Erro no pagamento. Por favor, verifique os dados do cartão.';
  }

  static sendErrorResponse(res: Response, error: any): void {
    const errorDetails = this.handleError(error);
    
    res.status(errorDetails.statusCode).json({
      success: false,
      error: {
        type: errorDetails.type,
        message: errorDetails.userMessage
      }
    });
  }
}

// Helper function to log Stripe events
export function logStripeEvent(eventType: string, data: any): void {
  const timestamp = new Date().toISOString();
  console.log(`[Stripe Event] ${timestamp} - ${eventType}`, {
    ...data,
    isLiveMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')
  });
}

// Helper to check if using live keys
export function isUsingLiveKeys(): boolean {
  return process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') || false;
}

// Development mode warning
export function warnIfLiveMode(): void {
  if (isUsingLiveKeys() && process.env.NODE_ENV === 'development') {
    console.warn('\n⚠️  WARNING: Using LIVE Stripe keys in development mode! ⚠️');
    console.warn('Any payments will charge real money.\n');
  }
}