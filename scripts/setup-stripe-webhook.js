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

async function setupWebhook() {
  try {
    console.log('🚀 Setting up Stripe webhook endpoint...\n');

    // Get the app URL from environment or ask user
    const appUrl = process.env.APP_URL || 'https://your-app-domain.replit.app';
    const webhookUrl = `${appUrl}/api/stripe/webhook`;

    console.log('🌐 Webhook URL:', webhookUrl);
    
    // Check for existing webhooks
    console.log('🔍 Checking for existing webhook endpoints...');
    const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    
    let webhookEndpoint = existingWebhooks.data.find(w => w.url === webhookUrl);

    if (webhookEndpoint) {
      console.log('✅ Webhook endpoint already exists:', webhookEndpoint.id);
      console.log('   URL:', webhookEndpoint.url);
      console.log('   Status:', webhookEndpoint.status);
    } else {
      // Create new webhook endpoint
      console.log('📡 Creating new webhook endpoint...');
      webhookEndpoint = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: [
          'checkout.session.completed',
          'customer.subscription.created',
          'customer.subscription.updated',
          'customer.subscription.deleted',
          'invoice.payment_succeeded',
          'invoice.payment_failed',
        ],
        description: 'Revela platform webhook endpoint',
      });
      
      console.log('✅ Webhook endpoint created:', webhookEndpoint.id);
    }

    // Get the webhook signing secret
    const signingSecret = webhookEndpoint.secret;
    
    if (!signingSecret) {
      console.error('❌ Could not retrieve webhook signing secret');
      console.log('   You may need to get it from the Stripe Dashboard');
      return;
    }

    // Update .env.local with the webhook secret
    console.log('\n📝 Updating environment variables...');
    const envPath = resolve(__dirname, '../.env.local');
    let envContent = await fs.readFile(envPath, 'utf-8');
    
    envContent = envContent.replace(
      'STRIPE_WEBHOOK_SECRET=whsec_temp_placeholder',
      `STRIPE_WEBHOOK_SECRET=${signingSecret}`
    );
    
    await fs.writeFile(envPath, envContent);
    console.log('✅ Webhook signing secret updated');

    // Summary
    console.log('\n✨ Webhook setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Webhook ID:', webhookEndpoint.id);
    console.log('Webhook URL:', webhookEndpoint.url);
    console.log('Signing Secret:', signingSecret);
    console.log('Enabled Events:', webhookEndpoint.enabled_events.join(', '));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n⚠️  IMPORTANT:');
    console.log('1. Make sure your app is deployed and accessible at:', appUrl);
    console.log('2. The webhook endpoint must be publicly accessible');
    console.log('3. For local testing, use Stripe CLI: stripe listen --forward-to localhost:5000/api/stripe/webhook');
    
  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
    if (error.message.includes('Invalid URL')) {
      console.error('\n💡 Make sure to update APP_URL in your .env.local file with your actual domain');
    }
    process.exit(1);
  }
}

// Run the setup
setupWebhook();