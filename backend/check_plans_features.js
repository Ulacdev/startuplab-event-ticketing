
import supabase from './database/db.js';

async function check() {
  const { data: plans, error: plansError } = await supabase.from('plans').select('*');
  if (plansError) {
    console.error('Error plans:', plansError);
  } else {
    console.log('Plans:', JSON.stringify(plans, null, 2));
  }

  const { data: features, error: featuresError } = await supabase.from('planFeatures').select('*');
  if (featuresError) {
    console.error('Error features:', featuresError);
  } else {
    console.log('Features:', JSON.stringify(features, null, 2));
  }
  process.exit(0);
}
check();
