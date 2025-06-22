#!/usr/bin/env node
import '../server/loadEnv.js';
import { db } from '../server/db.js';
import { subscriptionPlans } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function updateStripePrices() {
  try {
    console.log('🔄 Updating Stripe Price IDs in database...\n');

    // Update Pro plan
    const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
    if (proPriceId && !proPriceId.includes('placeholder')) {
      console.log('💵 Updating Pro plan price ID...');
      await db.update(subscriptionPlans)
        .set({ stripePriceId: proPriceId })
        .where(eq(subscriptionPlans.name, 'pro'));
      console.log('✅ Pro plan updated with Price ID:', proPriceId);
    }

    // Update Elite plan
    const elitePriceId = process.env.STRIPE_ELITE_PRICE_ID;
    if (elitePriceId && !elitePriceId.includes('placeholder')) {
      console.log('💵 Updating Elite plan price ID...');
      await db.update(subscriptionPlans)
        .set({ stripePriceId: elitePriceId })
        .where(eq(subscriptionPlans.name, 'elite'));
      console.log('✅ Elite plan updated with Price ID:', elitePriceId);
    }

    // Verify updates
    console.log('\n📋 Verifying database updates...');
    const plans = await db.select().from(subscriptionPlans);
    
    plans.forEach(plan => {
      console.log(`\n${plan.displayName}:`);
      console.log(`  Price: R$ ${plan.price}`);
      console.log(`  Stripe Price ID: ${plan.stripePriceId || 'Not set'}`);
    });

    console.log('\n✨ Database update complete!');
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
    process.exit(1);
  }
}

// Run the update
updateStripePrices();