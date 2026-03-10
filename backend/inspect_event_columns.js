
import supabase from './database/db.js';

async function checkColumns() {
  const { data, error } = await supabase.from('events').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    // Stringify each column on its own line
    Object.keys(data[0] || {}).forEach(k => console.log('COL:', k));
  }
  process.exit(0);
}
checkColumns();
