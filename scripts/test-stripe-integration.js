#!/usr/bin/env node
import Stripe from 'stripe';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

async function testStripeIntegration() {
  console.log('🧪 Testing Stripe Integration...\n');

  try {
    // Test 1: API Key validity
    console.log('1️⃣ Testing API key...');
    const account = await stripe.accounts.retrieve();
    console.log('✅ API key is valid');
    console.log('   Account ID:', account.id);
    console.log('   Mode:', process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST');
    
    // Test 2: Check products
    console.log('\n2️⃣ Checking products...');
    const products = await stripe.products.list({ limit: 10 });
    const revelaProducts = products.data.filter(p => p.name.includes('Revela'));
    
    if (revelaProducts.length > 0) {
      console.log('✅ Found Revela products:');
      revelaProducts.forEach(p => {
        console.log(`   - ${p.name} (${p.id})`);
      });
    } else {
      console.log('❌ No Revela products found');
      console.log('   Run: node scripts/setup-stripe-products.js');
    }
    
    // Test 3: Check prices
    console.log('\n3️⃣ Checking prices...');
    if (process.env.STRIPE_PRO_PRICE_ID && process.env.STRIPE_ELITE_PRICE_ID) {
      try {
        const proPrice = await stripe.prices.retrieve(process.env.STRIPE_PRO_PRICE_ID);
        const elitePrice = await stripe.prices.retrieve(process.env.STRIPE_ELITE_PRICE_ID);
        
        console.log('✅ Price IDs are valid:');
        console.log(`   - Pro: ${proPrice.id} (R$ ${proPrice.unit_amount / 100}/month)`);
        console.log(`   - Elite: ${elitePrice.id} (R$ ${elitePrice.unit_amount / 100}/month)`);
      } catch (error) {
        console.log('❌ Price IDs are invalid or not found');
      }
    } else {
      console.log('❌ Price IDs not configured in environment');
    }
    
    // Test 4: Check webhook endpoints
    console.log('\n4️⃣ Checking webhook endpoints...');
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    
    if (webhooks.data.length > 0) {
      console.log('✅ Found webhook endpoints:');
      webhooks.data.forEach(w => {
        console.log(`   - ${w.url} (${w.status})`);
      });
    } else {
      console.log('❌ No webhook endpoints found');
      console.log('   Run: node scripts/setup-stripe-webhook.js');
    }
    
    // Test 5: Create a test checkout session
    console.log('\n5️⃣ Testing checkout session creation...');
    if (process.env.STRIPE_PRO_PRICE_ID) {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price: process.env.STRIPE_PRO_PRICE_ID,
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
          metadata: {
            test: 'true',
            userId: 'test_user_123',
            planId: '2',
          },
        });
        
        console.log('✅ Checkout session created successfully');
        console.log('   Session ID:', session.id);
        console.log('   URL:', session.url);
        console.log('\n   ⚠️  This is a REAL checkout URL. Do not complete payment unless testing!');
      } catch (error) {
        console.log('❌ Failed to create checkout session:', error.message);
      }
    }
    
    // Summary
    console.log('\n📊 Integration Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('API Key:', process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Missing');
    console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('placeholder') ? '✅ Configured' : '❌ Missing');
    console.log('Pro Price ID:', process.env.STRIPE_PRO_PRICE_ID && !process.env.STRIPE_PRO_PRICE_ID.includes('placeholder') ? '✅ Configured' : '❌ Missing');
    console.log('Elite Price ID:', process.env.STRIPE_ELITE_PRICE_ID && !process.env.STRIPE_ELITE_PRICE_ID.includes('placeholder') ? '✅ Configured' : '❌ Missing');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error testing integration:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Your API key might be invalid. Check your .env.local file.');
    }
  }
}

// Run the test
testStripeIntegration();