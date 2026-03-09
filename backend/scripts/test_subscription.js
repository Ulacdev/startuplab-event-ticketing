import supabase from '../database/db.js';

/**
 * MANUAL SUBSCRIPTION ACTIVATOR
 * Run this to simulate a successful HitPay payment for a specific subscription.
 * Usage: node scripts/test_subscription.js <subscriptionId>
 */

const activateSubscription = async (subscriptionId) => {
    if (!subscriptionId) {
        console.log('❌ Please provide a Subscription ID');
        process.exit(1);
    }

    console.log(`🚀 Attempting to manually activate subscription: ${subscriptionId}`);

    // 1. Find subscription
    const { data: subscription, error } = await supabase
        .from('organizersubscriptions')
        .select('*')
        .eq('subscriptionId', subscriptionId)
        .single();

    if (error || !subscription) {
        console.error('❌ Subscription not found in database');
        return;
    }

    console.log(`📋 Found subscription for organizer: ${subscription.organizerId}`);

    // 2. Calculate dates
    const now = new Date();
    const endDate = subscription.billingInterval === 'yearly'
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));

    // 3. Update subscription
    const { error: subErr } = await supabase
        .from('organizersubscriptions')
        .update({
            status: 'active',
            endDate: endDate.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('subscriptionId', subscriptionId);

    if (subErr) {
        console.error('❌ Failed to update subscription:', subErr.message);
        return;
    }

    // 4. Update organizer
    const { error: orgErr } = await supabase
        .from('organizers')
        .update({
            currentPlanId: subscription.planId,
            subscriptionStatus: 'active',
            planExpiresAt: endDate.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('organizerId', subscription.organizerId);

    if (orgErr) {
        console.error('❌ Failed to update organizer record:', orgErr.message);
        return;
    }

    console.log('✅ SUCCESS! Subscription and Organizer records are now ACTIVE.');
    console.log(`📅 Plan expires on: ${endDate.toLocaleString()}`);
};

const subId = process.argv[2];
activateSubscription(subId);
