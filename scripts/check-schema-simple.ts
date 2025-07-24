import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
  console.log('🔍 Checking Database Schema...\n');

  const tablesToCheck = [
    'users',
    'categories', 
    'items',
    'item_images',
    'game_sessions',
    'leaderboard_entries',
    'achievements',
    'user_achievements',
    'user_stats'
  ];

  for (const table of tablesToCheck) {
    console.log(`\n📦 Checking table: ${table}`);
    
    try {
      // Try to query the table with limit 0 to just check structure
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      if (error) {
        console.log(`   ❌ Table does not exist or error: ${error.message}`);
      } else {
        console.log(`   ✅ Table exists`);
        
        // For items table, check specific columns
        if (table === 'items') {
          const { data: item, error: itemError } = await supabase
            .from('items')
            .select('id, item_image_id, images')
            .limit(1)
            .single();
          
          if (!itemError || itemError.code === 'PGRST116') { // PGRST116 = no rows
            console.log('   ✅ item_image_id column exists');
            console.log('   ✅ images column exists');
          }
        }
        
        // For item_images, check if item_id is removed
        if (table === 'item_images') {
          try {
            const { data: img, error: imgError } = await supabase
              .from('item_images')
              .select('item_id')
              .limit(1);
            
            if (imgError && imgError.message.includes('column "item_id" does not exist')) {
              console.log('   ✅ item_id column correctly removed');
            } else {
              console.log('   ❌ item_id column still exists!');
            }
          } catch (e) {
            console.log('   ✅ item_id column correctly removed');
          }
        }
      }
    } catch (e) {
      console.log(`   ❌ Error checking table: ${e}`);
    }
  }

  // Check for removed columns in items
  console.log('\n\n🔍 Checking removed columns in items table:');
  
  try {
    const { error: aiHintsError } = await supabase
      .from('items')
      .select('ai_hints')
      .limit(1);
    
    if (aiHintsError && aiHintsError.message.includes('column "ai_hints" does not exist')) {
      console.log('✅ ai_hints column correctly removed');
    } else {
      console.log('❌ ai_hints column still exists!');
    }
  } catch (e) {
    console.log('✅ ai_hints column correctly removed');
  }

  try {
    const { error: basicInfoError } = await supabase
      .from('items')
      .select('basic_info')
      .limit(1);
    
    if (basicInfoError && basicInfoError.message.includes('column "basic_info" does not exist')) {
      console.log('✅ basic_info column correctly removed');
    } else {
      console.log('❌ basic_info column still exists!');
    }
  } catch (e) {
    console.log('✅ basic_info column correctly removed');
  }

  // Check a sample item to see its structure
  console.log('\n\n📋 Sample item structure:');
  const { data: sampleItem, error: sampleError } = await supabase
    .from('items')
    .select('id, name, item_image_id, images')
    .limit(1)
    .single();

  if (sampleItem) {
    console.log('Sample item:');
    console.log(`  - id: ${sampleItem.id}`);
    console.log(`  - name: ${sampleItem.name}`);
    console.log(`  - item_image_id: ${sampleItem.item_image_id || 'null'}`);
    console.log(`  - images array length: ${sampleItem.images?.length || 0}`);
  }

  console.log('\n✅ Schema check complete!');
}

checkSchema().catch(console.error);