#!/usr/bin/env node
import Stripe from 'stripe';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

async function setupStripeProducts() {
  try {
    console.log('🚀 Setting up Stripe products...\n');

    // Check if we're using live keys
    if (process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      console.log('⚠️  WARNING: Using LIVE Stripe keys!');
      console.log('   Real money will be charged. Proceed with caution.\n');
    }

    // Create or find existing products
    let proProduct, eliteProduct;

    // Search for existing products first
    console.log('🔍 Checking for existing products...');
    const existingProducts = await stripe.products.list({ limit: 100 });
    
    proProduct = existingProducts.data.find(p => p.name === 'Revela Pro');
    eliteProduct = existingProducts.data.find(p => p.name === 'Revela Elite');

    // Create Pro product if it doesn't exist
    if (!proProduct) {
      console.log('📦 Creating Revela Pro product...');
      proProduct = await stripe.products.create({
        name: 'Revela Pro',
        description: 'Plano profissional para atletas com verificação e visibilidade para scouts',
        metadata: {
          plan_type: 'pro',
          features: JSON.stringify([
            'Perfil básico de atleta',
            'Upload de fotos',
            'Autoavaliação de habilidades',
            'Visibilidade para scouts',
            '3 testes de verificação mensais',
            'Selo de verificação',
          ])
        }
      });
      console.log('✅ Pro product created:', proProduct.id);
    } else {
      console.log('✅ Pro product already exists:', proProduct.id);
    }

    // Create Elite product if it doesn't exist
    if (!eliteProduct) {
      console.log('📦 Creating Revela Elite product...');
      eliteProduct = await stripe.products.create({
        name: 'Revela Elite',
        description: 'Plano elite com recursos premium e suporte prioritário',
        metadata: {
          plan_type: 'elite',
          features: JSON.stringify([
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
          ])
        }
      });
      console.log('✅ Elite product created:', eliteProduct.id);
    } else {
      console.log('✅ Elite product already exists:', eliteProduct.id);
    }

    // Create or find prices
    console.log('\n💰 Setting up prices...');
    
    // Check for existing prices
    const proPrices = await stripe.prices.list({ 
      product: proProduct.id,
      active: true,
      limit: 100 
    });
    
    const elitePrices = await stripe.prices.list({ 
      product: eliteProduct.id,
      active: true,
      limit: 100 
    });

    let proPrice = proPrices.data.find(p => 
      p.recurring?.interval === 'month' && 
      p.unit_amount === 2990 && 
      p.currency === 'brl'
    );

    let elitePrice = elitePrices.data.find(p => 
      p.recurring?.interval === 'month' && 
      p.unit_amount === 7990 && 
      p.currency === 'brl'
    );

    // Create Pro price if it doesn't exist
    if (!proPrice) {
      console.log('💵 Creating Pro price (R$ 29.90/month)...');
      proPrice = await stripe.prices.create({
        product: proProduct.id,
        unit_amount: 2990, // R$ 29.90 in cents
        currency: 'brl',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        metadata: {
          plan_name: 'pro'
        }
      });
      console.log('✅ Pro price created:', proPrice.id);
    } else {
      console.log('✅ Pro price already exists:', proPrice.id);
    }

    // Create Elite price if it doesn't exist
    if (!elitePrice) {
      console.log('💵 Creating Elite price (R$ 79.90/month)...');
      elitePrice = await stripe.prices.create({
        product: eliteProduct.id,
        unit_amount: 7990, // R$ 79.90 in cents
        currency: 'brl',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        metadata: {
          plan_name: 'elite'
        }
      });
      console.log('✅ Elite price created:', elitePrice.id);
    } else {
      console.log('✅ Elite price already exists:', elitePrice.id);
    }

    // Update .env.local with the price IDs
    console.log('\n📝 Updating environment variables...');
    const envPath = resolve(__dirname, '../.env.local');
    let envContent = await fs.readFile(envPath, 'utf-8');
    
    envContent = envContent.replace(
      'STRIPE_PRO_PRICE_ID=price_temp_pro_placeholder',
      `STRIPE_PRO_PRICE_ID=${proPrice.id}`
    );
    
    envContent = envContent.replace(
      'STRIPE_ELITE_PRICE_ID=price_temp_elite_placeholder',
      `STRIPE_ELITE_PRICE_ID=${elitePrice.id}`
    );
    
    await fs.writeFile(envPath, envContent);
    console.log('✅ Environment variables updated');

    // Summary
    console.log('\n✨ Stripe products setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Pro Product ID:', proProduct.id);
    console.log('Pro Price ID:', proPrice.id);
    console.log('Elite Product ID:', eliteProduct.id);
    console.log('Elite Price ID:', elitePrice.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📋 Next steps:');
    console.log('1. Run "npm run db:seed" to update the database');
    console.log('2. Set up webhooks using "npm run stripe:webhook-setup"');
    
  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupStripeProducts();