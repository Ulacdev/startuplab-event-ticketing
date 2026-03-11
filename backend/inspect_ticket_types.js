
import supabase from './database/db.js';

async function checkTicketTypeColumn() {
  const { data, error } = await supabase.from('ticketTypes').select('ticketTypeId, quantitySold').limit(5);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('TicketTypes Sample:', data);
  }
  process.exit(0);
}
checkTicketTypeColumn();
