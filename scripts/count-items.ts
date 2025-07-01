import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function countItems() {
  const { count, error } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Total items in database:', count);
  }
  
  // Also get a sample of items
  const { data: sampleItems } = await supabase
    .from('items')
    .select('name, category_id')
    .limit(5);
    
  console.log('\nSample items:');
  sampleItems?.forEach(item => console.log(`- ${item.name}`));
}

countItems();