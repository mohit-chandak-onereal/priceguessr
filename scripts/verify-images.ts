import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyImages() {
  console.log('🔍 Verifying image setup...\n');
  
  // Check items with wiki images
  const { data: itemsWithImages, error: error1 } = await supabase
    .from('item_images')
    .select('item_id, items(name)')
    .limit(5);
  
  console.log('✅ Items with wiki images:');
  itemsWithImages?.forEach(item => {
    console.log(`   - ${(item as any).items.name}`);
  });
  
  // Check category mocks
  const { data: categoryMocks, error: error2 } = await supabase
    .from('category_mock_images')
    .select('category_id, categories(name)')
    .limit(5);
  
  console.log('\n📷 Categories with mock images:');
  categoryMocks?.forEach(mock => {
    console.log(`   - ${(mock as any).categories.name}`);
  });
  
  // Check an item without image (should use category mock)
  const { data: itemsWithoutImages } = await supabase
    .from('items')
    .select('id, name, category_id')
    .limit(50);
  
  // Find items without specific images
  const itemIds = itemsWithImages?.map(i => i.item_id) || [];
  const itemsUsingMocks = itemsWithoutImages?.filter(item => !itemIds.includes(item.id)) || [];
  
  console.log(`\n🎨 Items using category mocks: ${itemsUsingMocks.length}`);
  console.log('   Examples:');
  itemsUsingMocks.slice(0, 5).forEach(item => {
    console.log(`   - ${item.name}`);
  });
  
  // Test the API endpoint
  if (itemsWithImages && itemsWithImages.length > 0) {
    const testItemId = itemsWithImages[0].item_id;
    console.log(`\n🌐 Test API endpoint for item with wiki image:`);
    console.log(`   ${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/items/${testItemId}/images`);
  }
  
  if (itemsUsingMocks.length > 0) {
    const testMockItemId = itemsUsingMocks[0].id;
    console.log(`\n🌐 Test API endpoint for item with category mock:`);
    console.log(`   ${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/items/${testMockItemId}/images`);
  }
}

verifyImages().catch(console.error);