import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { createCanvas } from 'canvas';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Category colors for mock images
const categoryStyles: { [key: string]: { color: string } } = {
  'houses': { color: '#8B4513' },
  'cars': { color: '#FF0000' },
  'watches': { color: '#FFD700' },
  'designer-fashion': { color: '#FF1493' },
  'art': { color: '#4B0082' },
  'grocery-items': { color: '#228B22' },
  'electronics': { color: '#4169E1' },
  'sports-equipment': { color: '#FF4500' },
  'jewelry': { color: '#9370DB' },
  'furniture': { color: '#A0522D' }
};

// Generate a mock image for a category
async function generateCategoryMockImage(categoryName: string, categoryIcon: string): Promise<Buffer> {
  const style = categoryStyles[categoryName.toLowerCase().replace(/\s+/g, '-')];
  const color = style?.color || '#666666';
  
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, color);
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
  ctx.fillText(categoryIcon, 300, 180);
  
  // Category name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(categoryName.toUpperCase(), 300, 280);
  
  // Mock image label
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Category Placeholder', 300, 320);
  
  return canvas.toBuffer('image/png');
}

async function uploadCategoryMocks() {
  console.log('📷 Uploading category mock images...\n');
  
  // Get all categories from database
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon');
  
  if (error || !categories) {
    console.error('Failed to fetch categories:', error);
    return;
  }
  
  let successCount = 0;
  
  for (const category of categories) {
    try {
      // Check if mock already exists
      const { data: existing } = await supabase
        .from('category_mock_images')
        .select('id')
        .eq('category_id', category.id)
        .single();
      
      if (existing) {
        console.log(`⏭️  Skipping ${category.name} - mock already exists`);
        continue;
      }
      
      // Generate mock image
      const imageBuffer = await generateCategoryMockImage(category.name, category.icon);
      const base64Image = imageBuffer.toString('base64');
      
      // Insert mock image
      const { error: insertError } = await supabase
        .from('category_mock_images')
        .insert({
          category_id: category.id,
          image_data: base64Image,
          mime_type: 'image/png'
        });
      
      if (insertError) {
        console.error(`❌ Failed to upload mock for ${category.name}:`, insertError.message);
      } else {
        console.log(`✅ Created mock image for ${category.name}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating mock for ${category.name}:`, error);
    }
  }
  
  console.log(`\n✨ Uploaded ${successCount} category mock images!`);
}

uploadCategoryMocks().catch(console.error);