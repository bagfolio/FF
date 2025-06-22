# Payment Flow Test Checklist - Revela Platform

## Overview
This document outlines the complete payment flow for the Revela platform and provides a comprehensive test checklist to verify all integration points.

## Payment System Architecture

### 1. **Stripe Integration Components**
- **Initialization**: `server/services/stripe.service.ts`
  - ✅ Server-side key properly loaded from environment
  - ✅ Live mode detection and warnings implemented
  - ✅ All required Stripe API methods wrapped

### 2. **Database Schema**
All payment-related tables exist and are properly structured:
- ✅ `subscriptionPlans` - Stores available plans (basic, pro, elite)
- ✅ `userSubscriptions` - Tracks user subscription status
- ✅ `paymentMethods` - Stores user payment methods
- ✅ `paymentTransactions` - Records all payment transactions

### 3. **API Endpoints**
- `GET /api/subscription/plans` - Fetch available plans
- `GET /api/subscription/current` - Get user's current subscription
- `POST /api/subscription/create-checkout` - Create Stripe checkout session
- `POST /api/subscription/create-portal` - Create customer portal session
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/subscription/resume` - Resume cancelled subscription
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### 4. **Webhook Events Handled**
- ✅ `checkout.session.completed` - Creates user subscription
- ✅ `customer.subscription.updated` - Updates subscription status
- ✅ `customer.subscription.deleted` - Marks subscription as cancelled
- ✅ `invoice.payment_succeeded` - Records successful payment
- ✅ `invoice.payment_failed` - Records failed payment & updates status

## Payment Flow

### User Journey
1. **User clicks upgrade** → Shows pricing plans
2. **Selects plan** → Creates checkout session with metadata
3. **Redirects to Stripe** → User completes payment
4. **Returns to success URL** → Shows success message
5. **Webhook processes** → Updates subscription in database
6. **Features unlocked** → Pro features become available

### Technical Flow
```
Client                    Server                      Stripe
  |                         |                           |
  |--Select Plan----------->|                           |
  |                         |--Create Session---------->|
  |<--Checkout URL----------|                           |
  |--Redirect to Stripe---->|-------------------------->|
  |                         |                           |
  |<--Complete Payment------|<--Redirect to Success----|
  |                         |                           |
  |                         |<--Webhook: completed------|
  |                         |--Update Subscription----->|
  |<--Pro Features Active---|                           |
```

## Test Checklist

### Prerequisites
- [ ] Ensure test Stripe keys are set in environment
- [ ] Have Stripe CLI installed for webhook testing
- [ ] Database migrations completed

### Test Execution

#### 1. **Plan Selection & Checkout**
- [ ] Navigate to `/athlete/dashboard`
- [ ] Click "Ver Planos Premium" in subscription banner
- [ ] Verify all 3 plans display with correct pricing:
  - Basic: Free
  - Pro: R$ 29,90/mês
  - Elite: R$ 99,90/mês
- [ ] Click "Assinar Pro"
- [ ] Verify redirect to Stripe Checkout
- [ ] Confirm price matches selected plan
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete payment

#### 2. **Webhook Processing**
```bash
# In terminal, forward webhooks to local server
stripe listen --forward-to localhost:5000/api/stripe/webhook

# Watch for these events:
- checkout.session.completed
- customer.subscription.created
- invoice.payment_succeeded
```

- [ ] Verify webhook received (check terminal output)
- [ ] Check database for new subscription record
- [ ] Confirm subscription status is 'active'

#### 3. **Post-Payment Verification**
- [ ] Return to dashboard after payment
- [ ] Verify subscription banner no longer shows
- [ ] Check `/api/subscription/current` returns active subscription
- [ ] Confirm pro features are accessible:
  - [ ] Scout visibility enabled
  - [ ] Verification tests available
  - [ ] Priority support badge visible

#### 4. **Customer Portal**
- [ ] Click "Gerenciar Assinatura"
- [ ] Verify redirect to Stripe Customer Portal
- [ ] Test actions:
  - [ ] Update payment method
  - [ ] Download invoice
  - [ ] Cancel subscription

#### 5. **Subscription Cancellation**
- [ ] Cancel subscription in portal
- [ ] Verify webhook processes cancellation
- [ ] Check `cancelAtPeriodEnd` is true in database
- [ ] Confirm access continues until period end
- [ ] Verify downgrade banner appears

#### 6. **Failed Payment Handling**
- [ ] Use declining test card: `4000 0000 0000 0002`
- [ ] Verify payment fails gracefully
- [ ] Check error message displays
- [ ] Confirm no subscription created
- [ ] Verify failed transaction logged

#### 7. **Edge Cases**
- [ ] Test with no Stripe keys configured
- [ ] Test webhook with invalid signature
- [ ] Test duplicate webhook delivery
- [ ] Test network timeout during checkout
- [ ] Test user with existing subscription

## Security Verification

### Critical Checks
- [ ] ✅ Stripe secret key NOT exposed to client
- [ ] ✅ Webhook signature verification enabled
- [ ] ✅ User ID attached to all Stripe metadata
- [ ] ✅ Price IDs match database configuration
- [ ] ✅ SSL/HTTPS required for webhooks

### Database Integrity
- [ ] User can only have one active subscription
- [ ] Transaction amounts stored correctly (BRL)
- [ ] Subscription dates properly tracked
- [ ] No orphaned payment records

## Monitoring & Debugging

### Check Webhook Health
```bash
curl http://localhost:5000/api/stripe/webhook-health
```

### View Stripe Mode
```bash
curl http://localhost:5000/api/stripe/mode
```

### Common Issues & Solutions

1. **Webhook signature error**
   - Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
   - Check raw body parsing is enabled

2. **Subscription not updating**
   - Verify user ID in checkout metadata
   - Check webhook logs for processing errors

3. **Features not unlocking**
   - Confirm subscription status is 'active'
   - Check plan features in database

## Production Checklist

Before going live:
- [ ] Rotate all Stripe keys (especially after exposure)
- [ ] Configure production webhook endpoint in Stripe
- [ ] Set up webhook failure alerts
- [ ] Enable Stripe fraud protection
- [ ] Configure subscription email notifications
- [ ] Test with real payment method (can refund)
- [ ] Set up monitoring for payment failures

## Support Contacts

- **Stripe Support**: https://support.stripe.com
- **Webhook Logs**: https://dashboard.stripe.com/webhooks
- **Test Cards**: https://stripe.com/docs/testing