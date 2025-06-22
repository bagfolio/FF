#!/usr/bin/env node
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import crypto from 'crypto';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

// Stripe webhook signature generation
function generateTestSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

async function testWebhookEndpoint() {
  console.log('🧪 Testing Webhook Endpoint\n');
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not found in environment');
    return;
  }
  
  const baseUrl = 'http://localhost:5000';
  
  // Test webhook health endpoint first
  console.log('📊 Checking webhook health...');
  try {
    const healthResponse = await axios.get(`${baseUrl}/api/stripe/webhook-health`);
    console.log('✅ Webhook health:', healthResponse.data);
  } catch (error) {
    console.log('❌ Failed to get webhook health:', error.message);
  }
  
  // Test event payload
  const testEvent = {
    id: 'evt_test_' + Date.now(),
    object: 'event',
    api_version: '2025-05-28.basil',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_123',
        object: 'checkout.session',
        metadata: {
          userId: 'test_user_123',
          planId: '2'
        }
      }
    },
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type: 'checkout.session.completed'
  };
  
  const payload = JSON.stringify(testEvent);
  const signature = generateTestSignature(payload, webhookSecret);
  
  console.log('\n📮 Sending test webhook...');
  console.log('Event type:', testEvent.type);
  console.log('Event ID:', testEvent.id);
  
  try {
    const response = await axios.post(
      `${baseUrl}/api/stripe/webhook`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature
        }
      }
    );
    
    console.log('✅ Webhook accepted:', response.data);
    
    // Check health again to see if event was processed
    setTimeout(async () => {
      console.log('\n📊 Checking webhook health after test...');
      try {
        const healthResponse = await axios.get(`${baseUrl}/api/stripe/webhook-health`);
        console.log('✅ Updated health:', healthResponse.data);
      } catch (error) {
        console.log('❌ Failed to get webhook health:', error.message);
      }
    }, 1000);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Webhook rejected:', error.response.status, error.response.data);
    } else {
      console.log('❌ Failed to send webhook:', error.message);
    }
  }
  
  console.log('\n💡 Tips:');
  console.log('- Check server logs for detailed processing information');
  console.log('- Use Stripe CLI for real webhook testing: stripe listen --forward-to localhost:5000/api/stripe/webhook');
  console.log('- Monitor webhook health at: GET /api/stripe/webhook-health');
}

testWebhookEndpoint();