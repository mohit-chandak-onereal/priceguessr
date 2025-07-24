import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugImages() {
  console.log('🔍 Debugging Image Issues\n');

  // Check a few items
  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, item_image_id, images, category_id')
    .limit(5);

  if (error) {
    console.error('Error fetching items:', error);
    return;
  }

  console.log(`Found ${items?.length || 0} items\n`);

  for (const item of items || []) {
    console.log(`📦 Item: ${item.name}`);
    console.log(`   ID: ${item.id}`);
    console.log(`   item_image_id: ${item.item_image_id || 'none'}`);
    console.log(`   images array: ${item.images ? `[${item.images.length} URLs]` : 'none'}`);
    if (item.images && item.images.length > 0) {
      item.images.forEach((url: string, i: number) => {
        console.log(`     [${i}]: ${url.substring(0, 50)}...`);
      });
    }
    console.log(`   category_id: ${item.category_id}`);
    
    // Check if item has database image
    if (item.item_image_id) {
      const { data: img, error: imgErr } = await supabase
        .from('item_images')
        .select('id, image_data')
        .eq('id', item.item_image_id)
        .single();
      
      if (imgErr) {
        console.log(`   ❌ Error fetching image: ${imgErr.message}`);
      } else if (!img) {
        console.log(`   ❌ No image found with ID: ${item.item_image_id}`);
      } else {
        console.log(`   ✅ Has database image: YES`);
        console.log(`   📏 Image data size: ${img.image_data ? img.image_data.length : 0} bytes`);
      }
    }
    
    console.log('');
  }

  // Check category mock images
  const { data: mocks } = await supabase
    .from('category_mock_images')
    .select('category_id');
  
  console.log(`\n📷 Category Mock Images: ${mocks?.length || 0} categories have mock images`);
}

debugImages().catch(console.error);