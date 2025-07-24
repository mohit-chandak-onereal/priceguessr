import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchemaDetailed() {
  console.log('🔍 Detailed Schema Check...\n');

  // Method 1: Try to query specific columns and catch errors
  console.log('📦 CHECKING REMOVED COLUMNS:');
  
  // Check items table
  console.log('\nItems table:');
  const itemsRemovedCols = ['ai_hints', 'basic_info'];
  for (const col of itemsRemovedCols) {
    const { data, error } = await supabase
      .from('items')
      .select(col)
      .limit(1);
    
    if (error && error.message.includes(`column "${col}" does not exist`)) {
      console.log(`  ✅ ${col} - REMOVED (good!)`);
    } else if (error) {
      console.log(`  ❓ ${col} - Error: ${error.message}`);
    } else {
      console.log(`  ❌ ${col} - STILL EXISTS`);
    }
  }

  // Check item_images table
  console.log('\nItem_images table:');
  const imageRemovedCols = ['item_id', 'is_primary', 'display_order', 'mime_type'];
  for (const col of imageRemovedCols) {
    const { data, error } = await supabase
      .from('item_images')
      .select(col)
      .limit(1);
    
    if (error && error.message.includes(`column "${col}" does not exist`)) {
      console.log(`  ✅ ${col} - REMOVED (good!)`);
    } else if (error) {
      console.log(`  ❓ ${col} - Error: ${error.message}`);
    } else {
      console.log(`  ❌ ${col} - STILL EXISTS`);
    }
  }

  // Method 2: Try to get a full record
  console.log('\n\n📋 SAMPLE RECORDS:');
  
  // Get a sample item
  const { data: sampleItem, error: itemError } = await supabase
    .from('items')
    .select('*')
    .limit(1)
    .single();
  
  if (sampleItem) {
    console.log('\nSample item columns:');
    Object.keys(sampleItem).forEach(key => {
      console.log(`  - ${key}: ${typeof sampleItem[key]}`);
    });
  }

  // Get a sample image
  const { data: sampleImage, error: imageError } = await supabase
    .from('item_images')
    .select('*')
    .limit(1)
    .single();
  
  if (sampleImage) {
    console.log('\nSample item_image columns:');
    Object.keys(sampleImage).forEach(key => {
      console.log(`  - ${key}: ${typeof sampleImage[key]}`);
    });
  }

  console.log('\n✅ Detailed check complete!');
}

checkSchemaDetailed().catch(console.error);