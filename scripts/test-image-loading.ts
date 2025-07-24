import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testImageLoading() {
  console.log('🔍 Testing Image Loading...\n');

  // Get the specific item from the URL you provided
  const categoryId = '504d211f-eedc-451b-9f6e-11413831ac8b';
  
  // Get some items from this category
  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, item_image_id, images')
    .eq('category_id', categoryId)
    .limit(5);

  if (error || !items) {
    console.error('Error fetching items:', error);
    return;
  }

  console.log(`Found ${items.length} items in category:\n`);

  for (const item of items) {
    console.log(`\n📦 Item: ${item.name}`);
    console.log(`   ID: ${item.id}`);
    console.log(`   item_image_id: ${item.item_image_id || 'null'}`);
    console.log(`   images array: ${JSON.stringify(item.images)}`);
    console.log(`   images count: ${item.images?.length || 0}`);
    
    // Check if this item should load from database or URL
    if (item.item_image_id) {
      console.log(`   ✅ Should load from item_images table`);
      
      // Check if the image exists
      const { data: img, error: imgError } = await supabase
        .from('item_images')
        .select('id')
        .eq('id', item.item_image_id)
        .single();
      
      if (img) {
        console.log(`   ✅ Image exists in database`);
      } else {
        console.log(`   ❌ Image NOT found in database!`);
      }
    } else if (item.images && item.images.length > 0) {
      console.log(`   ✅ Should load from URL: ${item.images[0]}`);
    } else {
      console.log(`   ❌ No image source available!`);
    }
  }

  // Check the API endpoint
  console.log('\n\n🌐 API Endpoint Test:');
  if (items.length > 0) {
    const testItem = items[0];
    const apiUrl = `/api/items/${testItem.id}/images?index=0`;
    console.log(`Test URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}${apiUrl}`);
    console.log('\nThis URL should return an image when accessed from your app.');
  }

  console.log('\n✅ Test complete!');
}

testImageLoading().catch(console.error);