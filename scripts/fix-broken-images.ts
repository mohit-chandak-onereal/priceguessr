import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixBrokenImages() {
  console.log('🔧 Fixing Broken Image References\n');

  // Find items with item_image_id that don't have corresponding images
  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, item_image_id')
    .not('item_image_id', 'is', null);

  if (error) {
    console.error('Error fetching items:', error);
    return;
  }

  console.log(`Found ${items?.length || 0} items with item_image_id\n`);

  let brokenCount = 0;
  const brokenItems = [];

  for (const item of items || []) {
    // Check if the image exists
    const { data: image } = await supabase
      .from('item_images')
      .select('id')
      .eq('id', item.item_image_id)
      .single();

    if (!image) {
      brokenCount++;
      brokenItems.push(item);
      console.log(`❌ Broken: ${item.name} (${item.id})`);
      console.log(`   Missing image ID: ${item.item_image_id}`);
    }
  }

  if (brokenCount > 0) {
    console.log(`\n🚨 Found ${brokenCount} items with broken image references`);
    console.log('\n🔧 Fixing by removing invalid item_image_id references...\n');

    for (const item of brokenItems) {
      const { error: updateError } = await supabase
        .from('items')
        .update({ item_image_id: null })
        .eq('id', item.id);

      if (updateError) {
        console.error(`Failed to fix ${item.name}:`, updateError);
      } else {
        console.log(`✅ Fixed: ${item.name}`);
      }
    }
  } else {
    console.log('✅ No broken image references found!');
  }
}

fixBrokenImages().catch(console.error);