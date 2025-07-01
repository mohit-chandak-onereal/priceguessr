import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createCanvas } from 'canvas';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Load the mapping data
const mappingData = JSON.parse(
  fs.readFileSync('scripts/wiki-image-item-mapping.json', 'utf-8')
);

// Category colors for mock images
const categoryStyles = {
  '1': { name: 'Houses', color: '#8B4513', icon: '🏛️' },
  '2': { name: 'Cars', color: '#FF0000', icon: '🏎️' },
  '3': { name: 'Watches', color: '#FFD700', icon: '⏱️' },
  '4': { name: 'Designer Fashion', color: '#FF1493', icon: '🎩' },
  '5': { name: 'Art', color: '#4B0082', icon: '🖼️' },
  '6': { name: 'Grocery Items', color: '#228B22', icon: '🥫' },
  '7': { name: 'Electronics', color: '#4169E1', icon: '📺' },
  '8': { name: 'Sports Equipment', color: '#FF4500', icon: '🏏' },
  '9': { name: 'Jewelry', color: '#9370DB', icon: '💎' },
  '10': { name: 'Furniture', color: '#8B4513', icon: '🪑' }
};

// Generate a mock image for a category
async function generateCategoryMockImage(categoryId: string): Promise<Buffer> {
  const style = categoryStyles[categoryId];
  if (!style) throw new Error(`Unknown category: ${categoryId}`);
  
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, style.color);
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);
  
  // Dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, 600, 400);
  
  // Category icon (emoji)
  ctx.font = '120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(style.icon, 300, 180);
  
  // Category name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(style.name.toUpperCase(), 300, 280);
  
  // Mock image label
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Category Placeholder', 300, 320);
  
  return canvas.toBuffer('image/png');
}

// Upload a wiki image to the database
async function uploadWikiImage(match: any): Promise<boolean> {
  try {
    const imagePath = path.join('/Users/mohit/lab/projects/hackathon/resources/wiki-images', match.imageName);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Get mime type from extension
    const ext = path.extname(match.imageName).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    
    // Check if image already exists
    const { data: existing } = await supabase
      .from('item_images')
      .select('id')
      .eq('item_id', match.itemId)
      .eq('is_primary', true)
      .single();
    
    if (existing) {
      console.log(`⏭️  Skipping ${match.itemName} - image already exists`);
      return true;
    }
    
    // Insert the image
    const { error } = await supabase
      .from('item_images')
      .insert({
        item_id: match.itemId,
        image_data: base64Image,
        mime_type: mimeType,
        is_primary: true,
        display_order: 0
      });
    
    if (error) {
      console.error(`❌ Failed to upload image for ${match.itemName}:`, error.message);
      return false;
    }
    
    console.log(`✅ Uploaded image for ${match.itemName} (${match.confidence} confidence)`);
    return true;
  } catch (error) {
    console.error(`❌ Error uploading ${match.itemName}:`, error);
    return false;
  }
}

// Upload category mock images
async function uploadCategoryMockImages(): Promise<void> {
  console.log('\n📷 Uploading category mock images...\n');
  
  for (const [categoryId, style] of Object.entries(categoryStyles)) {
    try {
      // Check if mock already exists
      const { data: existing } = await supabase
        .from('category_mock_images')
        .select('id')
        .eq('category_id', categoryId)
        .single();
      
      if (existing) {
        console.log(`⏭️  Skipping ${style.name} - mock already exists`);
        continue;
      }
      
      // Generate mock image
      const imageBuffer = await generateCategoryMockImage(categoryId);
      const base64Image = imageBuffer.toString('base64');
      
      // Insert mock image
      const { error } = await supabase
        .from('category_mock_images')
        .insert({
          category_id: categoryId,
          image_data: base64Image,
          mime_type: 'image/png'
        });
      
      if (error) {
        console.error(`❌ Failed to upload mock for ${style.name}:`, error.message);
      } else {
        console.log(`✅ Created mock image for ${style.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating mock for ${style.name}:`, error);
    }
  }
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Starting optimized image upload process...\n');
  
  // Upload wiki images
  console.log('📸 Uploading wiki images...\n');
  let successCount = 0;
  let skipCount = 0;
  
  for (const match of mappingData.matches) {
    const success = await uploadWikiImage(match);
    if (success) successCount++;
  }
  
  console.log(`\n✅ Wiki images: ${successCount}/${mappingData.matches.length} uploaded successfully`);
  
  // Upload category mocks
  await uploadCategoryMockImages();
  
  // Summary
  console.log('\n📊 Upload Summary:');
  console.log(`- Wiki images matched and uploaded: ${successCount}`);
  console.log(`- Category mock images created: ${Object.keys(categoryStyles).length}`);
  console.log(`- Items using category mocks: ${mappingData.unmatchedItems.length}`);
  console.log('\n✨ Image upload complete!');
}

// Check if canvas is available
try {
  require('canvas');
  uploadAllImages().catch(console.error);
} catch (error) {
  console.error('\n❌ Error: Canvas module not found.');
  console.log('Please install it first:');
  console.log('npm install canvas');
  process.exit(1);
}