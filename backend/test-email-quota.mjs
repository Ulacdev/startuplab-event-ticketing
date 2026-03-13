#!/usr/bin/env node
/**
 * Email Quota Diagnostic Test
 * Verifies that the email quota system is properly set up in Supabase
 */

import supabase from './database/db.js';

async function runDiagnostics() {
  console.log('\n📊 EMAIL QUOTA SYSTEM DIAGNOSTICS\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Check if organizers table has the new columns
    console.log('\n✅ Test 1: Checking if organizers table has quota columns...');
    const { data: columns, error: colError } = await supabase
      .from('organizers')
      .select('timezone, dailyEmailQuota, emailsSentToday, lastEmailResetDate')
      .limit(1);

    if (colError && colError.message.includes('undefined column')) {
      console.log('❌ FAILED: Columns are missing!');
      console.log('   Missing columns detected. Please ensure SQL migration has been run.');
      return;
    }

    if (colError) {
      console.log('❌ FAILED: Query error:', colError.message);
      return;
    }

    console.log('✅ PASSED: All required columns exist in organizers table');

    // Test 2: Check if there are any organizers with current plans
    console.log('\n✅ Test 2: Checking for organizers with active plans...');
    const { data: organizers, error: orgError } = await supabase
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
      .limit(3);

    if (orgError) {
      console.log('❌ FAILED: Could not fetch organizers:', orgError.message);
      return;
    }

    if (!organizers || organizers.length === 0) {
      console.log('⚠️  WARNING: No organizers with active plans found');
    } else {
      console.log(`✅ PASSED: Found ${organizers.length} organizer(s) with active plans`);
      organizers.forEach((org, idx) => {
        console.log(`\n   Organizer ${idx + 1}:`);
        console.log(`   - ID: ${org.organizerId}`);
        console.log(`   - Timezone: ${org.timezone || 'NOT SET'}`);
        console.log(`   - Current Plan: ${org.plan?.name || 'NONE'}`);
        
        if (org.plan?.limits) {
          try {
            const limits = Array.isArray(org.plan.limits) ? org.plan.limits : Object.values(org.plan.limits || {});
            const emailQuota = limits.find?.((l) => (l.key || l) === 'email_quota_per_day');
            if (emailQuota) {
              const value = emailQuota.value || emailQuota;
              console.log(`   - Plan Email Quota: ${value} emails/day`);
            }
          } catch (e) {
            console.log(`   - Plan Email Quota: Unable to read`);
          }
        }
        
        console.log(`   - Emails Sent Today: ${org.emailsSentToday || 0}`);
        console.log(`   - Daily Email Limit: ${org.dailyEmailQuota || 'NOT SET'}`);
        console.log(`   - Last Reset Date: ${org.lastEmailResetDate || 'NOT SET'}`);
      });
    }

    // Test 3: Check if email_quota_tracking table exists and has data
    console.log('\n✅ Test 3: Checking email_quota_tracking table...');
    const { data: trackingData, error: trackingError } = await supabase
      .from('email_quota_tracking')
      .select('*')
      .limit(5);

    if (trackingError && trackingError.message.includes('relation')) {
      console.log('⚠️  WARNING: email_quota_tracking table may not exist yet');
      console.log('   This is optional - quota is tracked in organizers table');
    } else if (trackingError) {
      console.log('⚠️  WARNING: Could not query email_quota_tracking:', trackingError.message);
    } else {
      console.log(`✅ PASSED: email_quota_tracking table exists with ${trackingData?.length || 0} records`);
    }

    // Test 4: Check plans table for email quota limits
    console.log('\n✅ Test 4: Checking plans for email quota limits...');
    const { data: plans, error: planError } = await supabase
      .from('plans')
      .select(`
        planId,
        name,
        limits
      `)
      .limit(5);

    if (planError) {
      console.log('❌ FAILED: Could not fetch plans:', planError.message);
      return;
    }

    if (!plans || plans.length === 0) {
      console.log('❌ FAILED: No plans found');
      return;
    }

    let plansWithQuota = 0;
    plans.forEach(plan => {
      if (plan.limits && typeof plan.limits === 'string') {
        try {
          plan.limits = JSON.parse(plan.limits);
        } catch (e) {
          // Already parsed
        }
      }
      
      if (plan.limits && typeof plan.limits === 'object') {
        const emailQuotaKey = Object.keys(plan.limits).find(k => k === 'email_quota_per_day');
        if (emailQuotaKey) {
          plansWithQuota++;
          console.log(`   ✅ Plan "${plan.name}": ${plan.limits[emailQuotaKey]} emails/day`);
        }
      }
    });

    if (plansWithQuota === 0) {
      console.log('❌ FAILED: No plans have email_quota_per_day limits configured');
      console.log('   Please ensure plans.sql migration was run with email quota values');
    } else {
      console.log(`✅ PASSED: ${plansWithQuota}/${plans.length} plans have email quota configured`);
    }

  } catch (error) {
    console.log('\n❌ FATAL ERROR:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📋 SUMMARY:\n');
  console.log('If all tests passed:');
  console.log('  ✅ Email quota system is ready to use');
  console.log('  ✅ Organizers dashboard will show email quota widget');
  console.log('  ✅ Email sending will be blocked when limit reached');
  console.log('\nIf any tests failed:');
  console.log('  🔧 Run the SQL migrations in order:');
  console.log('     1. backend/database/20260312_email_quota_tracking.sql');
  console.log('     2. backend/database/plans.sql');
  console.log('  🔧 Then restart your backend server\n');
}

runDiagnostics().catch(console.error);
