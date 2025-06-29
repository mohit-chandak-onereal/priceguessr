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

async function getCategoryIds() {
  console.log('Fetching category IDs...\n');
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }
  
  console.log('Category mapping for populate-from-json.ts:\n');
  console.log('const categoryMap: Record<string, string> = {');
  
  categories?.forEach(cat => {
    console.log(`  '${cat.slug}': '${cat.id}', // ${cat.name}`);
  });
  
  console.log('};\n');
  
  console.log('Current categories in database:');
  categories?.forEach(cat => {
    console.log(`- ${cat.name} (${cat.slug}): ${cat.id}`);
  });
}

getCategoryIds();