# Stripe Integration Setup Guide

This guide will help you set up Stripe for the Revela platform to enable subscription payments.

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. Access to your Stripe Dashboard
3. The `.env` file configured with your credentials

## Step 1: Get Your API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in the top right)
3. Navigate to **Developers → API keys**
4. Copy your:
   - **Secret key** (starts with `sk_test_`)
   - **Publishable key** (starts with `pk_test_`) - optional

## Step 2: Create Products and Prices

### Create the Pro Plan:
1. Go to **Products** in your Stripe Dashboard
2. Click **"+ Add product"**
3. Fill in:
   - **Name**: Revela Pro
   - **Description**: Plano profissional para atletas
   - **Pricing**: 
     - Model: Recurring
     - Amount: R$ 29.90
     - Billing period: Monthly
4. Save and copy the **Price ID** (starts with `price_`)

### Create the Elite Plan:
1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: Revela Elite
   - **Description**: Plano elite com recursos premium
   - **Pricing**: 
     - Model: Recurring
     - Amount: R$ 79.90
     - Billing period: Monthly
3. Save and copy the **Price ID**

## Step 3: Set Up Webhooks

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **"+ Add endpoint"**
3. Fill in:
   - **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - For local testing: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) or [ngrok](https://ngrok.com)
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Save and copy the **Webhook signing secret** (starts with `whsec_`)

## Step 4: Configure Environment Variables

Update your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ELITE_PRICE_ID=price_your_elite_price_id
```

## Step 5: Seed the Database

Run the subscription plan seeder to populate your database:

```bash
npm run seed:subscriptions
# or
node server/seedSubscriptionPlans.js
```

## Step 6: Test the Integration

### Test Checkout Flow:
1. Create a test account on your platform
2. Select a paid plan from the landing page
3. Complete the signup process
4. You should be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242` (any future date, any CVC)

### Test Subscription Management:
1. Go to `/athlete/subscription` when logged in
2. Test canceling and resuming subscriptions
3. Access the Stripe Customer Portal

### Test Webhooks (Local Development):
```bash
# Install Stripe CLI
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:5000/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger payment_intent.succeeded
```

## Step 7: Production Checklist

Before going live:

- [ ] Switch to Live Mode in Stripe Dashboard
- [ ] Update all API keys to production keys (start with `sk_live_` and `pk_live_`)
- [ ] Create production products with real prices
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment methods
- [ ] Enable additional security features in Stripe Dashboard
- [ ] Set up proper error monitoring
- [ ] Configure email notifications

## Common Issues

### "No such price" error
- Make sure you've created the products and prices in Stripe
- Verify the price IDs in your `.env` match those in Stripe
- Check you're using the correct mode (test vs live)

### Webhook failures
- Verify the webhook secret is correct
- Check the endpoint URL is accessible
- Ensure your server handles the raw request body properly

### Subscription not updating
- Check webhook events are being received
- Verify database connection and permissions
- Look for errors in server logs

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For platform-specific issues:
- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure the database schema is up to date