import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testImageDisplay() {
  console.log('🧪 Testing Image Display System\n');

  // Get one item from each scenario
  const scenarios = [
    { name: 'Item with database image', hasImageId: true },
    { name: 'Item with URL only', hasImageId: false },
  ];

  for (const scenario of scenarios) {
    console.log(`\n📋 Testing: ${scenario.name}`);
    console.log('─'.repeat(50));

    const query = supabase
      .from('items')
      .select('id, name, item_image_id, images, category_id')
      .limit(1);

    if (scenario.hasImageId) {
      query.not('item_image_id', 'is', null);
    } else {
      query.is('item_image_id', null).not('images', 'is', null);
    }

    const { data: items, error } = await query;

    if (error || !items || items.length === 0) {
      console.log('❌ No items found for this scenario');
      continue;
    }

    const item = items[0];
    console.log(`\n🎯 Testing item: ${item.name}`);
    console.log(`   ID: ${item.id}`);
    console.log(`   item_image_id: ${item.item_image_id || 'none'}`);
    console.log(`   images array: ${item.images ? `[${item.images.length} URLs]` : 'none'}`);

    // Test what the API would return
    console.log('\n📡 API Route Logic Test:');
    
    if (item.item_image_id) {
      const { data: img } = await supabase
        .from('item_images')
        .select('image_data')
        .eq('id', item.item_image_id)
        .single();
      
      if (img && img.image_data) {
        console.log('   ✅ Would serve database image');
        console.log(`   📏 Size: ${img.image_data.length} bytes`);
      } else {
        console.log('   ❌ Database image not found, would fallback to URL');
      }
    } else if (item.images && item.images[0]) {
      console.log('   ✅ Would redirect to URL:', item.images[0].substring(0, 50) + '...');
    } else {
      console.log('   ❌ No image available, would try category mock');
    }

    // Check the actual API URL that would be used
    console.log('\n🔗 Frontend would request:');
    console.log(`   /api/items/${item.id}/images?index=0`);
  }

  // Check for items with multiple images in the array
  console.log('\n\n📊 Items with Multiple Images in Array:');
  console.log('─'.repeat(50));
  
  const { data: multiImageItems } = await supabase
    .from('items')
    .select('id, name, images');

  let multiCount = 0;
  for (const item of multiImageItems || []) {
    if (item.images && Array.isArray(item.images) && item.images.length > 1) {
      multiCount++;
      console.log(`\n🖼️  ${item.name}`);
      console.log(`   Has ${item.images.length} images in array`);
      item.images.forEach((url: string, i: number) => {
        console.log(`   [${i}]: ${url.substring(0, 40)}...`);
      });
    }
  }

  if (multiCount === 0) {
    console.log('\n✅ No items have multiple images in their array');
  } else {
    console.log(`\n⚠️  Found ${multiCount} items with multiple images`);
    console.log('This might trigger image viewer extensions to show "1 of X"');
  }
}

testImageDisplay().catch(console.error);