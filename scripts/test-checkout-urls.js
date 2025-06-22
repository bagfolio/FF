#!/usr/bin/env node
import axios from 'axios';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

async function testCheckoutUrls() {
  console.log('🔍 Testing Checkout URL Generation\n');
  
  const baseUrl = process.env.APP_URL || 'http://localhost:5000';
  console.log('🌐 Base URL:', baseUrl);
  console.log('✅ This should be your Replit URL, not localhost!\n');
  
  try {
    // Test creating a checkout session
    console.log('📝 Creating test checkout session...');
    const response = await axios.post(
      `${baseUrl}/api/subscription/create-checkout`,
      { planId: 2 }, // Pro plan
      {
        headers: {
          'Content-Type': 'application/json',
          // Add a test header to identify this as a test
          'X-Test-Request': 'true'
        },
        // Don't follow redirects
        maxRedirects: 0,
        validateStatus: (status) => status < 500
      }
    );
    
    if (response.status === 302 || response.status === 303) {
      const checkoutUrl = response.headers.location;
      console.log('✅ Checkout redirect received!');
      console.log('🔗 Checkout URL:', checkoutUrl);
      
      // Parse the Stripe checkout URL to extract session ID
      const sessionMatch = checkoutUrl.match(/cs_[a-zA-Z0-9]+/);
      if (sessionMatch) {
        console.log('📋 Session ID:', sessionMatch[0]);
        console.log('\n✨ Success! The checkout URL is properly generated.');
        console.log('   You should now be able to access this URL without localhost errors.');
      }
    } else if (response.data && response.data.url) {
      console.log('✅ Checkout URL received:', response.data.url);
    } else {
      console.log('❌ Unexpected response:', response.status);
      console.log('Response:', response.data);
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Server responded with error:', error.response.status);
      console.log('Error data:', error.response.data);
      
      // Check if it's an auth error
      if (error.response.status === 401) {
        console.log('\n💡 Tip: The endpoint requires authentication.');
        console.log('   Since BYPASS_AUTH=true, this might be a different issue.');
      }
    } else if (error.request) {
      console.log('❌ No response received. Is the server running?');
      console.log('   Make sure the dev server is running on port 5000');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testCheckoutUrls();