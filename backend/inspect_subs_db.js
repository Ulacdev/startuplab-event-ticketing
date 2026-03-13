import supabase from './database/db.js';

async function checkActiveSubscriptions() {
  const { data: subs, error } = await supabase
    .from('organizersubscriptions')
    .select(`
      *,
      plan:plans(planId, name, promotions)
    `)
    .eq('status', 'active');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('--- ACTIVE SUBSCRIPTIONS ---');
  subs.forEach(s => {
    console.log(`SubID: ${s.subscriptionId}`);
    console.log(`Organizer: ${s.organizerId}`);
    console.log(`Plan Name: ${s.plan?.name}`);
    console.log(`Promotions in Sub Object: ${JSON.stringify(s.plan?.promotions)}`);
    console.log('---');
  });
}

checkActiveSubscriptions();
