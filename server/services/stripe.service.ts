import Stripe from 'stripe';
import { storage } from '../storage';
import type { 
  UserSubscription, 
  PaymentMethod,
  PaymentTransaction 
} from '@shared/schema';
import { StripeErrorHandler, logStripeEvent, warnIfLiveMode } from '../utils/stripe-error-handler';
import { WebhookLogger } from '../utils/webhook-logger';

// Initialize Stripe with secret key from environment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    })
  : null;

// Warn if using live keys in development
if (stripe && process.env.NODE_ENV === 'development') {
  warnIfLiveMode();
}

export class StripeService {
  // Check if Stripe is properly configured
  isConfigured(): boolean {
    return !!stripe && !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  }

  // Create a Stripe customer for a user
  async createCustomer(userId: string, email: string, name?: string): Promise<string> {
    if (!this.isConfigured() || !stripe) {
      throw new Error('Stripe não está configurado. Verifique suas variáveis de ambiente.');
    }

    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { userId },
      });

      return customer.id;
    } catch (error) {
      throw new Error('Falha ao criar cliente no Stripe. Por favor, tente novamente.');
    }
  }

  // Create a checkout session for subscription
  async createCheckoutSession(
    userId: string,
    planId: number,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    if (!this.isConfigured() || !stripe) {
      throw new Error('Stripe não está configurado. Verifique suas variáveis de ambiente.');
    }

    try {
      logStripeEvent('checkout.session.create.start', { userId, planId });
      
      // Get subscription plan details
      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan || !plan.stripePriceId) {
        throw new Error('Plano de assinatura inválido ou não configurado corretamente.');
      }

      // Check if the price ID is a placeholder
      if (plan.stripePriceId.includes('placeholder')) {
        throw new Error('Plano ainda não configurado no Stripe. Configure os price IDs no banco de dados.');
      }

      // Get or create customer
      let customerId: string | undefined;
      const existingSubscription = await storage.getUserSubscription(userId);
      if (existingSubscription?.stripeCustomerId) {
        customerId = existingSubscription.stripeCustomerId;
      } else {
        const user = await storage.getUser(userId);
        if (user) {
          customerId = await this.createCustomer(userId, user.email, `${user.firstName} ${user.lastName}`);
        }
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          planId: planId.toString(),
        },
        subscription_data: {
          trial_period_days: 7, // 7 day free trial
          metadata: {
            userId,
            planId: planId.toString(),
          },
        },
        locale: 'pt-BR',
        // Allow promotion codes
        allow_promotion_codes: true,
      });

      if (!session.url) {
        throw new Error('Falha ao criar sessão de checkout.');
      }

      logStripeEvent('checkout.session.create.success', { 
        sessionId: session.id, 
        userId, 
        planId,
        checkoutUrl: session.url 
      });

      return session.url;
    } catch (error: any) {
      logStripeEvent('checkout.session.create.error', { 
        userId, 
        planId, 
        error: error.message 
      });
      
      // Re-throw our custom errors
      if (error.message && !error.type) {
        throw error;
      }
      
      // Use centralized error handler
      const errorDetails = StripeErrorHandler.handleError(error);
      throw new Error(errorDetails.userMessage);
    }
  }

  // Create a portal session for managing subscription
  async createPortalSession(userId: string, returnUrl: string): Promise<string> {
    if (!this.isConfigured() || !stripe) {
      throw new Error('Stripe não está configurado. Verifique suas variáveis de ambiente.');
    }

    try {
      const subscription = await storage.getUserSubscription(userId);
      if (!subscription?.stripeCustomerId) {
        throw new Error('Você não possui uma assinatura ativa. Assine um plano primeiro.');
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: returnUrl,
        locale: 'pt-BR',
      });

      return session.url;
    } catch (error: any) {
      
      // Re-throw our custom errors
      if (error.message && !error.type) {
        throw error;
      }
      
      throw new Error('Falha ao acessar portal de assinatura. Por favor, tente novamente.');
    }
  }

  // Handle webhook events from Stripe
  async handleWebhook(payload: string, signature: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Stripe não está configurado');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret não configurado');
    }

    let event: Stripe.Event;
    try {
      if (!stripe) {
        throw new Error('Stripe não está configurado');
      }
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      logStripeEvent('webhook.received', { eventType: event.type, eventId: event.id });
    } catch (err: any) {
      logStripeEvent('webhook.signature.failed', { error: err.message || 'Unknown error' });
      throw new Error('Webhook signature inválida');
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          logStripeEvent('webhook.unhandled', { eventType: event.type });
      }
      
      logStripeEvent('webhook.processed', { eventType: event.type, eventId: event.id });
    } catch (error: any) {
      logStripeEvent('webhook.processing.error', { 
        eventType: event.type, 
        eventId: event.id, 
        error: error?.message || 'Unknown error' 
      });
      throw error;
    }
  }

  // Handle successful checkout
  private async handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      logStripeEvent('checkout.complete.error', { 
        sessionId: session.id, 
        error: 'Missing metadata' 
      });
      throw new Error('Missing user or plan information in checkout session');
    }
    
    logStripeEvent('checkout.complete.start', { sessionId: session.id, userId, planId });

    if (!stripe) {
      throw new Error('Stripe não está configurado');
    }
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Create or update user subscription
    await storage.createUserSubscription({
      userId,
      planId: parseInt(planId),
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status as any,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      metadata: {
        checkoutSessionId: session.id,
      },
    });

    // Create payment transaction record
    await storage.createPaymentTransaction({
      userId,
      stripePaymentIntentId: session.payment_intent as string,
      amount: ((session.amount_total || 0) / 100).toFixed(2), // Convert from cents
      currency: session.currency || 'BRL',
      status: 'succeeded',
      type: 'subscription',
      description: 'Assinatura inicial',
    });
    
    logStripeEvent('checkout.complete.success', { 
      sessionId: session.id, 
      userId, 
      subscriptionId: subscription.id 
    });
  }

  // Handle subscription updates
  private async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    const userSubscription = await storage.getUserSubscription(userId);
    if (!userSubscription) return;

    await storage.updateUserSubscription(userSubscription.id, {
      status: subscription.status as any,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    });
  }

  // Handle subscription cancellation
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    const userSubscription = await storage.getUserSubscription(userId);
    if (!userSubscription) return;

    await storage.updateUserSubscription(userSubscription.id, {
      status: 'canceled',
      metadata: {
        ...(userSubscription.metadata as any),
        canceledAt: new Date().toISOString(),
      },
    });
  }

  // Handle successful payment
  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    if (!stripe) {
      throw new Error('Stripe não está configurado');
    }
    const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    // Record payment transaction
    await storage.createPaymentTransaction({
      userId,
      stripePaymentIntentId: (invoice as any).payment_intent as string,
      amount: ((invoice.amount_paid || 0) / 100).toFixed(2),
      currency: invoice.currency || 'BRL',
      status: 'succeeded',
      type: 'subscription',
      description: `Pagamento de assinatura - ${new Date(invoice.period_start * 1000).toLocaleDateString('pt-BR')}`,
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
      },
    });
  }

  // Handle failed payment
  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (!stripe) {
      throw new Error('Stripe não está configurado');
    }
    const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    // Record failed payment
    await storage.createPaymentTransaction({
      userId,
      stripePaymentIntentId: (invoice as any).payment_intent as string,
      amount: ((invoice.amount_due || 0) / 100).toString(),
      currency: invoice.currency || 'BRL',
      status: 'failed',
      type: 'subscription',
      description: 'Falha no pagamento da assinatura',
      failureReason: 'Pagamento recusado',
      metadata: {
        invoiceId: invoice.id,
      },
    });

    // Update subscription status if needed
    const userSubscription = await storage.getUserSubscription(userId);
    if (userSubscription) {
      await storage.updateUserSubscription(userSubscription.id, {
        status: 'past_due',
      });
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Stripe não está configurado');
    }

    const subscription = await storage.getUserSubscription(userId);
    if (!subscription?.stripeSubscriptionId) {
      throw new Error('Nenhuma assinatura ativa encontrada');
    }

    // Cancel at period end to allow user to continue using until end of billing period
    if (!stripe) {
      throw new Error('Stripe não está configurado');
    }
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update local subscription record
    await storage.updateUserSubscription(subscription.id, {
      cancelAtPeriodEnd: true,
    });
  }

  // Resume a canceled subscription
  async resumeSubscription(userId: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Stripe não está configurado');
    }

    const subscription = await storage.getUserSubscription(userId);
    if (!subscription?.stripeSubscriptionId) {
      throw new Error('Nenhuma assinatura encontrada');
    }

    // Resume subscription
    if (!stripe) {
      throw new Error('Stripe não está configurado');
    }
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update local record
    await storage.updateUserSubscription(subscription.id, {
      cancelAtPeriodEnd: false,
    });
  }

  // Get subscription details
  async getSubscriptionDetails(userId: string): Promise<any> {
    if (!this.isConfigured()) {
      return null;
    }

    const subscription = await storage.getUserSubscription(userId);
    if (!subscription?.stripeSubscriptionId) {
      return null;
    }

    try {
      if (!stripe) {
        throw new Error('Stripe não está configurado');
      }
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      return {
        ...subscription,
        stripe: {
          status: stripeSubscription.status,
          currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
        },
      };
    } catch (error) {
      return subscription;
    }
  }
}

export const stripeService = new StripeService();