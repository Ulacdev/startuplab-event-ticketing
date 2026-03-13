import supabase from './database/db.js';

async function inspectPlans() {
  const { data: plans, error } = await supabase.from('plans').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('--- PLANS ---');
  plans.forEach(p => {
    console.log(`Plan: ${p.name} (${p.planId})`);
    console.log(`Features: ${JSON.stringify(p.features)}`);
    console.log(`Limits: ${JSON.stringify(p.limits)}`);
    console.log(`Promotions: ${JSON.stringify(p.promotions)}`);
    console.log('---');
  });
}

inspectPlans();
