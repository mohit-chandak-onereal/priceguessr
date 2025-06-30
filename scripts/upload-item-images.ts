import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ImageUpload {
  itemId: string;
  imagePath: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

async function uploadImage(upload: ImageUpload) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(upload.imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Get mime type from file extension
    const ext = path.extname(upload.imagePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    
    // Insert into database
    const { data, error } = await supabase
      .from('item_images')
      .insert({
        item_id: upload.itemId,
        image_data: base64Image,
        mime_type: mimeType,
        is_primary: upload.isPrimary || false,
        display_order: upload.displayOrder || 0,
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error uploading image for item ${upload.itemId}:`, error);
      return false;
    }
    
    console.log(`✅ Uploaded image for item ${upload.itemId}`);
    return true;
  } catch (error) {
    console.error(`Error reading/uploading image:`, error);
    return false;
  }
}

async function uploadItemImages() {
  console.log('Starting image upload process...\n');
  
  // Example: Define your images to upload
  // Replace these with your actual item IDs and image paths
  const imagesToUpload: ImageUpload[] = [
    // Example format:
    // {
    //   itemId: 'your-item-uuid-here',
    //   imagePath: '/path/to/your/image.jpg',
    //   isPrimary: true,
    //   displayOrder: 0
    // },
  ];
  
  if (imagesToUpload.length === 0) {
    console.log('No images to upload. Please add images to the imagesToUpload array.');
    console.log('\nExample format:');
    console.log(`{
  itemId: 'item-uuid-from-database',
  imagePath: './images/item-name.jpg',
  isPrimary: true,
  displayOrder: 0
}`);
    return;
  }
  
  let successCount = 0;
  
  for (const upload of imagesToUpload) {
    const success = await uploadImage(upload);
    if (success) successCount++;
  }
  
  console.log(`\n✨ Upload complete! ${successCount}/${imagesToUpload.length} images uploaded successfully.`);
}

// Helper function to get item ID by name
async function getItemIdByName(itemName: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('items')
    .select('id, name')
    .ilike('name', `%${itemName}%`)
    .single();
  
  if (error || !data) {
    console.error(`Item not found: ${itemName}`);
    return null;
  }
  
  console.log(`Found item: ${data.name} (${data.id})`);
  return data.id;
}

// Export for use in other scripts
export { uploadImage, getItemIdByName };

// Run if called directly
if (require.main === module) {
  uploadItemImages().catch(console.error);
}