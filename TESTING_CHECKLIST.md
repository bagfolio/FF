# Testing Checklist - Revela Platform Subscription System

This checklist ensures all subscription and payment flows work correctly before going live.

## Pre-Test Setup

- [ ] Create `.env` file from `.env.example`
- [ ] Add Stripe test API keys
- [ ] Run database migrations: `npm run db:migrate`
- [ ] Seed subscription plans: `npm run seed:subscriptions`
- [ ] Start the development server: `npm run dev`
- [ ] Have Stripe test cards ready (4242 4242 4242 4242)

## 1. Landing Page & Pricing Section

### Visual Tests
- [ ] Navigate to landing page (/)
- [ ] Verify pricing section appears between "Combine Digital" and "Pirâmide da Confiança"
- [ ] Check "Preços" link in navigation works
- [ ] Verify smooth scroll to pricing section
- [ ] Test responsive design on mobile/tablet
- [ ] Confirm glassmorphic styling and animations work

### Pricing Display
- [ ] Basic plan shows as "Grátis"
- [ ] Pro plan shows as "R$ 29,90/mês"
- [ ] Elite plan shows as "R$ 79,90/mês"
- [ ] All features are listed correctly
- [ ] "Mais Popular" badge on Pro plan
- [ ] CTA buttons are clickable

## 2. Authentication Flow with Plan Selection

### Signup with Plan
- [ ] Click "Começar Agora" on Pro plan
- [ ] Verify auth modal opens with signup tab
- [ ] Create new account
- [ ] Verify email/password validation works
- [ ] Check that selected plan is stored (check sessionStorage)

### Login Flow
- [ ] Test login with existing account
- [ ] Verify "remember me" functionality
- [ ] Test forgot password flow
- [ ] Verify email verification requirement

## 3. Onboarding & Checkout Flow

### Athlete Onboarding
- [ ] Complete athlete profile (all 3 steps)
- [ ] Verify form validation works
- [ ] Check parental consent for minors
- [ ] Submit profile successfully

### Post-Onboarding Checkout
- [ ] After onboarding with paid plan selected:
  - [ ] Automatic redirect to Stripe Checkout
  - [ ] Correct plan and price displayed
  - [ ] 7-day trial mentioned
- [ ] Without plan selected:
  - [ ] Redirect to dashboard
  - [ ] No checkout triggered

### Stripe Checkout
- [ ] Enter test card: 4242 4242 4242 4242
- [ ] Any future expiry date
- [ ] Any 3-digit CVC
- [ ] Complete payment
- [ ] Verify redirect to success URL
- [ ] Check subscription created in database

## 4. Subscription Management Page

### Access & Display
- [ ] Navigate to /athlete/subscription
- [ ] Verify current plan displayed correctly
- [ ] Check subscription status badge
- [ ] Next payment date shown
- [ ] Trial end date (if applicable)

### Plan Features
- [ ] Current plan benefits listed
- [ ] Upgrade/downgrade options visible
- [ ] Pricing for other plans displayed

### Billing Portal
- [ ] Click "Gerenciar Assinatura"
- [ ] Redirected to Stripe Customer Portal
- [ ] Can update payment method
- [ ] Can download invoices
- [ ] Can change plans

### Cancellation Flow
- [ ] Click "Cancelar Assinatura"
- [ ] Confirmation dialog appears
- [ ] Subscription marked for cancellation
- [ ] End date displayed
- [ ] "Reativar Assinatura" button appears
- [ ] Can resume before end date

## 5. Feature Access Control

### Basic Plan Limitations
- [ ] No scout visibility
- [ ] No Combine tests access
- [ ] No video uploads
- [ ] Upgrade prompts shown

### Pro Plan Access
- [ ] Scout visibility enabled
- [ ] 3 monthly Combine tests
- [ ] Video uploads work
- [ ] Verification badge available

### Elite Plan Access
- [ ] Priority scout visibility
- [ ] Unlimited Combine tests
- [ ] HD video uploads
- [ ] Multiple profiles (3)
- [ ] Priority support badge

## 6. Webhook Testing

### Subscription Events
- [ ] checkout.session.completed
  - [ ] Subscription created in database
  - [ ] Welcome email sent
- [ ] customer.subscription.updated
  - [ ] Plan changes reflected
  - [ ] Status updates work
- [ ] customer.subscription.deleted
  - [ ] Access revoked
  - [ ] Cancellation email sent
- [ ] invoice.payment_failed
  - [ ] Warning email sent
  - [ ] Grace period active

### Local Webhook Testing
```bash
# In one terminal
stripe listen --forward-to localhost:5000/api/stripe/webhook

# In another terminal
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## 7. Email Notifications

### Transactional Emails
- [ ] Account verification email
- [ ] Welcome email after signup
- [ ] Subscription confirmation
- [ ] Payment failed notification
- [ ] Subscription cancelled confirmation
- [ ] Password reset email

### Email Content
- [ ] Correct Portuguese text
- [ ] Links work properly
- [ ] Responsive design
- [ ] Unsubscribe link (if applicable)

## 8. Error Handling

### Missing Configuration
- [ ] No Stripe keys: Graceful error message
- [ ] Invalid price IDs: Clear error
- [ ] Missing webhook secret: Proper warning

### Payment Failures
- [ ] Declined card: User-friendly error
- [ ] Insufficient funds: Clear message
- [ ] Invalid card: Validation feedback

### System Errors
- [ ] Database connection issues handled
- [ ] API timeouts show loading states
- [ ] Network errors have retry options

## 9. Data Integrity

### Database Checks
- [ ] User subscriptions table populated
- [ ] Payment transactions recorded
- [ ] Subscription plans seeded correctly
- [ ] Customer IDs stored

### Session Management
- [ ] Selected plan persists through signup
- [ ] Cleared after successful checkout
- [ ] No orphaned data

## 10. Performance & UX

### Loading States
- [ ] Skeleton loaders during data fetch
- [ ] Button disabled states
- [ ] Progress indicators

### Mobile Experience
- [ ] Touch-friendly buttons
- [ ] Readable text sizes
- [ ] Proper viewport handling
- [ ] Smooth animations

## 11. Security Checks

### API Security
- [ ] Authenticated endpoints protected
- [ ] User can only access own subscription
- [ ] Webhook signature verification
- [ ] No sensitive data in responses

### Frontend Security
- [ ] No API keys exposed
- [ ] Secure redirect URLs
- [ ] CSRF protection
- [ ] XSS prevention

## 12. Production Readiness

### Environment Variables
- [ ] All required vars documented
- [ ] Production values ready
- [ ] Secrets properly managed

### Monitoring
- [ ] Error logging configured
- [ ] Payment tracking setup
- [ ] User analytics ready

### Documentation
- [ ] Setup guide complete
- [ ] API documentation
- [ ] User help docs
- [ ] Support contact info

## Test Payment Methods

### Successful Payments
- `4242 4242 4242 4242` - Standard success
- `4000 0027 6000 3184` - 3D Secure required

### Failed Payments
- `4000 0000 0000 9995` - Declined
- `4000 0000 0000 0002` - Declined (generic)
- `4000 0000 0000 9987` - Failed after authentication

## Final Checklist

- [ ] All test cases pass
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Portuguese translations correct
- [ ] Loading times acceptable
- [ ] Error messages helpful
- [ ] Success flows smooth
- [ ] Data persists correctly
- [ ] Emails delivered
- [ ] Security measures in place

## Sign-off

- [ ] Developer testing complete
- [ ] QA testing complete  
- [ ] Business approval
- [ ] Ready for production

---

**Note**: Run through this entire checklist at least twice - once in development and once in a staging environment that mirrors production.