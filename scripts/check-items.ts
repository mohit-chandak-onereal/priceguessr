import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkItems() {
  console.log('Checking items in database...\n');
  
  // Check total items
  const { data: allItems, error: allError } = await supabase
    .from('items')
    .select('id, name, category_id, price');
  
  if (allError) {
    console.error('Error fetching all items:', allError);
  } else {
    console.log(`Total items in database: ${allItems?.length || 0}`);
    
    if (allItems && allItems.length > 0) {
      console.log('\nSample items:');
      allItems.slice(0, 5).forEach(item => {
        console.log(`- ${item.name} (Category: ${item.category_id}, Price: $${item.price})`);
      });
    }
  }
  
  // Check items by category
  console.log('\n\nChecking items by category...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, slug');
  
  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }
  
  for (const category of categories || []) {
    const { data: categoryItems, error } = await supabase
      .from('items')
      .select('id')
      .eq('category_id', category.id);
    
    if (error) {
      console.error(`Error fetching items for ${category.name}:`, error);
    } else {
      console.log(`${category.name} (${category.id}): ${categoryItems?.length || 0} items`);
    }
  }
}

// Run the check
checkItems();