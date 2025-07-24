import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyCurrentSchema() {
  console.log('🔍 Checking Current Schema Status...\n');

  // Check items table columns
  console.log('📦 ITEMS TABLE:');
  try {
    // Try to select each column individually
    const columnsToCheck = [
      'id', 'name', 'item_image_id', 'images', 'ai_hints', 'basic_info', 
      'metadata', 'description', 'hint_1', 'hint_2', 'hint_3', 'hint_4', 'hint_5'
    ];

    for (const col of columnsToCheck) {
      try {
        await supabase.from('items').select(col).limit(1);
        console.log(`  ✅ ${col} exists`);
      } catch (e) {
        console.log(`  ❌ ${col} does not exist`);
      }
    }
  } catch (e) {
    console.log('  Error checking items table');
  }

  // Check item_images table columns
  console.log('\n📦 ITEM_IMAGES TABLE:');
  try {
    const imageColumns = ['id', 'item_id', 'image_data', 'is_primary', 'display_order', 'mime_type', 'created_at'];
    
    for (const col of imageColumns) {
      try {
        await supabase.from('item_images').select(col).limit(1);
        console.log(`  ✅ ${col} exists`);
      } catch (e) {
        console.log(`  ❌ ${col} does not exist`);
      }
    }
  } catch (e) {
    console.log('  Error checking item_images table');
  }

  // Check for sample data
  console.log('\n📊 SAMPLE DATA:');
  
  // Check if any items have item_image_id set
  const { data: itemsWithImages, count } = await supabase
    .from('items')
    .select('id', { count: 'exact' })
    .not('item_image_id', 'is', null);
  
  console.log(`  Items with item_image_id set: ${count || 0}`);

  // Check total items
  const { count: totalItems } = await supabase
    .from('items')
    .select('id', { count: 'exact' });
  
  console.log(`  Total items: ${totalItems || 0}`);

  // Check item_images table
  const { count: totalImages } = await supabase
    .from('item_images')
    .select('id', { count: 'exact' });
  
  console.log(`  Total item_images: ${totalImages || 0}`);

  console.log('\n✅ Schema check complete!');
}

verifyCurrentSchema().catch(console.error);