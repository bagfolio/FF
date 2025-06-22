import { db } from './db';
import { subscriptionPlans } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedSubscriptionPlans() {
  try {
    // Check if plans already exist
    const existingPlans = await db.select().from(subscriptionPlans);
    
    if (existingPlans.length > 0) {
      console.log('Subscription plans already exist, skipping seed');
      return;
    }
    
    console.log('Seeding subscription plans...');
    
    // Insert default plans
    await db.insert(subscriptionPlans).values([
      {
        name: 'basic',
        displayName: 'Revela Basic',
        price: '0.00',
        currency: 'BRL',
        features: [
          'Perfil básico de atleta',
          'Upload de fotos',
          'Autoavaliação de habilidades',
        ],
        maxProfiles: 1,
        verificationTests: 0,
        scoutVisibility: false,
        prioritySupport: false,
        active: true,
        // No Stripe price ID for free plan
      },
      {
        name: 'pro',
        displayName: 'Revela Pro',
        price: '29.90',
        currency: 'BRL',
        features: [
          'Perfil básico de atleta',
          'Upload de fotos',
          'Autoavaliação de habilidades',
          'Visibilidade para scouts',
          '3 testes de verificação mensais',
          'Selo de verificação',
        ],
        maxProfiles: 1,
        verificationTests: 3,
        scoutVisibility: true,
        prioritySupport: false,
        active: true,
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
      },
      {
        name: 'elite',
        displayName: 'Revela Elite',
        price: '79.90',
        currency: 'BRL',
        features: [
          'Perfil básico de atleta',
          'Upload de fotos',
          'Autoavaliação de habilidades',
          'Visibilidade para scouts',
          'Testes de verificação ilimitados',
          'Selo de verificação',
          'Análise prioritária',
          'Suporte prioritário',
          'Destaque nas buscas',
          '3 perfis adicionais',
        ],
        maxProfiles: 3,
        verificationTests: -1, // -1 means unlimited
        scoutVisibility: true,
        prioritySupport: true,
        active: true,
        stripePriceId: process.env.STRIPE_ELITE_PRICE_ID || 'price_elite_placeholder',
      },
    ]);
    
    console.log('Subscription plans seeded successfully');
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
  }
}

// Run if executed directly
import { fileURLToPath } from 'url';
import { argv } from 'process';

const isMainModule = argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  seedSubscriptionPlans()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}