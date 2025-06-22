#!/usr/bin/env node
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

console.log('🧪 Stripe Payment Test Helper\n');
console.log('⚠️  WARNING: You are using LIVE Stripe keys!');
console.log('   Any payments made will charge real money.\n');

console.log('📋 Test Card Numbers (for testing only):');
console.log('   ✅ Success: 4242 4242 4242 4242');
console.log('   ❌ Declined: 4000 0000 0000 0002');
console.log('   🔒 3D Secure: 4000 0025 0000 3155\n');

console.log('📝 How to test payments safely:');
console.log('1. Create a test user account in your app');
console.log('2. Go to the subscription page');
console.log('3. Select a plan (Pro or Elite)');
console.log('4. You\'ll be redirected to Stripe Checkout');
console.log('5. Use a test card number above');
console.log('6. Use any future expiry date and any 3-digit CVC\n');

console.log('🎯 Direct checkout URLs for testing:');
const baseUrl = process.env.APP_URL || 'http://localhost:5000';
console.log(`   Pro Plan: ${baseUrl}/api/subscription/create-checkout?planId=2`);
console.log(`   Elite Plan: ${baseUrl}/api/subscription/create-checkout?planId=3\n`);

console.log('🔍 Monitor webhook events:');
console.log('   Dashboard: https://dashboard.stripe.com/events');
console.log('   Look for "checkout.session.completed" events\n');

console.log('⚡ Quick API test (creates a checkout session):');
console.log('   Run: curl -X POST ' + baseUrl + '/api/subscription/create-checkout \\');
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d \'{"planId": 2}\'\n');

console.log('💡 Remember:');
console.log('   - Test with small amounts first');
console.log('   - Cancel subscriptions immediately after testing');
console.log('   - Use Stripe Dashboard to monitor all activity');
console.log('   - Consider creating TEST mode keys for development\n');

// Optional: Create a test checkout session
const args = process.argv.slice(2);
if (args[0] === '--create-session') {
  console.log('Creating test checkout session...');
  // Add session creation logic here if needed
}