import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to get all items with their names for reference
async function listAllItems() {
  const { data, error } = await supabase
    .from('items')
    .select('id, name, brand')
    .order('name');
  
  if (error) {
    console.error('Error fetching items:', error);
    return;
  }
  
  console.log('\n📋 Available items in database:\n');
  data?.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} (${item.brand})`);
    console.log(`   ID: ${item.id}\n`);
  });
}

// Example upload configuration
async function uploadExampleImages() {
  // First, list all items so you can see their IDs
  await listAllItems();
  
  console.log('\n🎯 Ready to upload images!\n');
  console.log('Add your images to the imagesToUpload array in upload-item-images.ts');
  console.log('Example format:');
  console.log(`
  const imagesToUpload = [
    {
      itemId: 'copy-uuid-from-above',
      imagePath: './images/your-image.jpg',
      isPrimary: true,
      displayOrder: 0
    }
  ];
  `);
}

// Run the example
uploadExampleImages().catch(console.error);