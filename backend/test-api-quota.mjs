#!/usr/bin/env node
/**
 * Test Email Quota API Endpoint
 * Simulates frontend API call to test email quota endpoint
 */

import supabase from './database/db.js';
import { emailQuotaManager } from './utils/emailQuotaManager.js';

async function testEmailQuotaAPI() {
  console.log('\n📧 TESTING EMAIL QUOTA API ENDPOINT\n');
  console.log('=' .repeat(60));

  try {
    // Get first organizer with an active plan
    const { data: organizer, error: orgError } = await supabase
      .from('organizers')
      .select(`
        organizerId,
        timezone,
        currentPlanId,
        emailsSentToday,
        dailyEmailQuota,
        lastEmailResetDate,
        plan:plans!currentPlanId(planId, name, limits)
      `)
      .not('currentPlanId', 'is', null)
      .limit(1)
      .single();

    if (orgError) {
      console.log('❌ ERROR: Could not fetch organizer:', orgError.message);
      return;
    }

    if (!organizer) {
      console.log('❌ ERROR: No organizers found with active plan');
      return;
    }

    console.log(`\n✅ Testing with Organizer: ${organizer.organizerId}`);
    console.log(`   Current Plan: ${organizer.plan?.name}`);
    console.log(`   Timezone: ${organizer.timezone}`);

    console.log('\n🔍 Calling emailQuotaManager.getQuotaStatus()...');

    try {
      const quotaStatus = await emailQuotaManager.getQuotaStatus(organizer.organizerId);
      
      console.log('\n📊 RESPONSE:');
      console.log(JSON.stringify(quotaStatus, null, 2));

      // Verify the structure matches frontend expectation
      console.log('\n✅ Response Structure Check:');
      console.log(`   ✓ remaining: ${quotaStatus.remaining} (type: ${typeof quotaStatus.remaining})`);
      console.log(`   ✓ limit: ${quotaStatus.limit} (type: ${typeof quotaStatus.limit})`);
      console.log(`   ✓ sent: ${quotaStatus.sent} (type: ${typeof quotaStatus.sent})`);
      console.log(`   ✓ canSend: ${quotaStatus.canSend} (type: ${typeof quotaStatus.canSend})`);
      console.log(`   ✓ quotaStatus: "${quotaStatus.quotaStatus}" (type: ${typeof quotaStatus.quotaStatus})`);

      const isValid = 
        typeof quotaStatus.remaining === 'number' &&
        typeof quotaStatus.limit === 'number' &&
        typeof quotaStatus.sent === 'number' &&
        typeof quotaStatus.canSend === 'boolean' &&
        typeof quotaStatus.quotaStatus === 'string';

      if (isValid) {
        console.log('\n✅ PASSED: Response structure is correct for frontend');
        console.log('\nThe widget should render with:');
        console.log(`   - Remaining: ${quotaStatus.remaining} emails`);
        console.log(`   - Used: ${quotaStatus.sent}/${quotaStatus.limit}`);
        console.log(`   - Can Send: ${quotaStatus.canSend ? 'YES' : 'NO (should show upgrade button)'}`);
        if (quotaStatus.noPlan) {
          console.log(`   - Status: NO ACTIVE PLAN (0 emails allowed)`);
        }
      } else {
        console.log('\n❌ FAILED: Response structure is invalid');
      }

    } catch (quotaErr) {
      console.log('❌ ERROR calling emailQuotaManager:', quotaErr.message);
      console.log(quotaErr.stack);
    }

  } catch (error) {
    console.log('\n❌ FATAL ERROR:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

testEmailQuotaAPI().catch(console.error);
