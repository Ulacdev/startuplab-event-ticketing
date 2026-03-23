import supabase from './database/db.js';

import fs from 'fs';

const tables = [
  'events',
  'ticketTypes',
  'promoted_events',
  'attendees',
  'users',
  'organizers',
  'planFeatures',
  'event_likes',
  'reviews',
  'event_analytics',
  'orders'
];

async function checkTables() {
  let output = '--- Database Data Integrity Check ---\n';
  output += `Timestamp: ${new Date().toISOString()}\n\n`;
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      output += `❌ [${table}] Error: ${error.message}\n`;
    } else {
      output += `✅ [${table}] Verified. Records: ${count || 0}\n`;
    }
  }
  
  fs.writeFileSync('data_integrity_results.txt', output);
  console.log('Results written to data_integrity_results.txt');
}

checkTables();
