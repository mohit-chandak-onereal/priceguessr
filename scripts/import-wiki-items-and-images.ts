import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { items as realDataItems } from '../lib/real-data.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Wiki images directory
const WIKI_IMAGES_DIR = '/Users/mohit/lab/projects/hackathon/resources/wiki-images';

interface WikiImageMapping {
  imageName: string;
  itemId?: string;
  itemName?: string;
  matched: boolean;
}

// Map of wiki image names to real-data.ts item IDs
const wikiImageToItemId: { [key: string]: string } = {
  'Amazon_Echo_5th_Gen': 'electronics-amazon-echo',
  'Apple_Watch_Series_9': 'electronics-apple-watch',
  'Arne_Jacobsen_Egg_Chair': 'furniture-egg-chair',
  'BMW_M3': 'car-bmw-m3',
  'Bananas': 'grocery-bananas',
  'Boucheron_Quatre_Classique_Ring': 'jewelry-boucheron-quatre',
  'Broccoli': 'grocery-broccoli',
  'Brown_Rice': 'grocery-brown-rice',
  'Buckingham_Palace': 'house-buckingham-palace',
  'Casa_Batll': 'house-casa-batllo',
  'Castiglioni_Brothers_Arco_Floor_Lamp': 'furniture-arco-lamp',
  'Chevrolet_Corvette_C8': 'car-chevrolet-corvette-c8',
  'Chicken_Breast': 'grocery-chicken-breast',
  'Eggs_Dozen': 'grocery-eggs',
  'Fallingwater': 'house-fallingwater',
  'Ford_Mustang_GT': 'car-ford-mustang-gt',
  'Grant_Wood': 'art-american-gothic',
  'Greek_Yogurt_32_oz': 'grocery-greek-yogurt',
  'Gustav_Klimt': 'art-the-kiss',
  'Hans_Wegner_Wishbone_Chair': 'furniture-wishbone-chair',
  'Harry_Winston_Cluster_Earrings': 'jewelry-harry-winston',
  'Hearst_Castle': 'house-hearst-castle',
  'IWC_Portugieser': 'watch-iwc-portugieser',
  'Ikea_Pong_Armchair': 'furniture-ikea-poang',
  'Johannes_Vermeer': 'art-girl-pearl',
  'Land_Rover_Range_Rover_Sport': 'car-range-rover-sport',
  'Leonardo_da_Vinci': 'art-mona-lisa',
  'Louis_Vuitton_Speedy_30': 'fashion-lv-speedy',
  'Mercedes-Benz_S-Class': 'car-mercedes-s-class',
  'Neuschwanstein_Castle': 'house-neuschwanstein-castle',
  'Nintendo_Switch_OLED': 'electronics-nintendo-switch',
  'Nomos_Tangente': 'watch-nomos-tangente',
  'Olive_Oil_1_L': 'grocery-olive-oil',
  'Pablo_Picasso': 'art-guernica',
  'Palace_of_Versailles': 'house-palace-versailles',
  'Prada_Galleria_Tote': 'fashion-prada-galleria',
  'Rembrandt': 'art-night-watch',
  'Salvador_Dal': 'art-persistence-memory',
  'Samsung_Galaxy_S23_Ultra': 'electronics-samsung-s23',
  'Sandro_Botticelli': 'art-birth-venus',
  'The_White_House': 'house-white-house',
  'Titleist_Pro_V1_Golf_Ball': 'sports-titleist-pro-v1',
  'Van_Cleef__Arpels_Alhambra_Necklace': 'jewelry-van-cleef',
  'Villa_Savoye': 'house-villa-savoye',
  'Villa_Tugendhat': 'house-villa-tugendhat',
  'Winchester_Mystery_House': 'house-winchester-mystery',
  'Audemars_Piguet_Royal_Oak': 'watch-ap-royal-oak',
  'Breitling_Navitimer': 'watch-breitling-navitimer',
  'Chanel_Classic_Flap_Bag': 'fashion-chanel-flap',
  'Charles__Ray_Eames_Lounge_Chair': 'furniture-eames-lounge',
  'Gucci_GG_Marmont_Matelass_Shoulder_Bag': 'fashion-gucci-marmont',
  'Omega_Speedmaster_Professional': 'watch-omega-speedmaster',
  'Rolex_Submariner': 'watch-rolex-submariner',
  'Seiko_Prospex_Diver': 'watch-seiko-prospex',
};

async function main() {
  console.log('🚀 Starting wiki items and images import...\n');
  
  // Get all wiki images
  const imageFiles = fs.readdirSync(WIKI_IMAGES_DIR)
    .filter(file => file.startsWith('resized_') && (
      file.endsWith('.png') || 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg') || 
      file.endsWith('.JPG')
    ));
  
  console.log(`📁 Found ${imageFiles.length} wiki images\n`);
  
  // Get current categories from database
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, slug');
  
  if (catError || !categories) {
    console.error('Error fetching categories:', catError);
    return;
  }
  
  const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));
  
  // Process each wiki image
  const itemsToImport = [];
  const imageMappings: WikiImageMapping[] = [];
  
  for (const imageFile of imageFiles) {
    const imageName = path.basename(imageFile, path.extname(imageFile)).replace('resized_', '');
    const itemId = wikiImageToItemId[imageName];
    
    if (itemId) {
      // Find the item in real-data.ts
      const item = realDataItems.find(i => i.id === itemId);
      if (item) {
        itemsToImport.push(item);
        imageMappings.push({
          imageName: imageFile,
          itemId: item.id,
          itemName: item.name,
          matched: true
        });
      } else {
        imageMappings.push({
          imageName: imageFile,
          matched: false
        });
      }
    } else {
      imageMappings.push({
        imageName: imageFile,
        matched: false
      });
    }
  }
  
  console.log(`📋 Mapping Summary:`);
  console.log(`✅ Matched images: ${imageMappings.filter(m => m.matched).length}`);
  console.log(`❌ Unmatched images: ${imageMappings.filter(m => !m.matched).length}\n`);
  
  if (imageMappings.filter(m => !m.matched).length > 0) {
    console.log('Unmatched images:');
    imageMappings.filter(m => !m.matched).forEach(m => {
      console.log(`  - ${m.imageName}`);
    });
    console.log('');
  }
  
  // Import items that have wiki images
  console.log(`📥 Ready to import ${itemsToImport.length} items with wiki images\n`);
  
  let importedCount = 0;
  let skippedCount = 0;
  
  for (const item of itemsToImport) {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('items')
      .select('id')
      .eq('id', item.id)
      .single();
    
    if (existing) {
      console.log(`⚠️  Item already exists: ${item.name}`);
      skippedCount++;
      continue;
    }
    
    // Get category ID
    const categoryName = categories.find(c => c.id === item.category_id)?.name || 
                        getCategoryNameFromId(item.category_id);
    const categoryId = categoryMap.get(categoryName);
    
    if (!categoryId) {
      console.error(`❌ Category not found for item ${item.name}: ${categoryName}`);
      continue;
    }
    
    // Import the item
    const { error: insertError } = await supabase
      .from('items')
      .insert({
        ...item,
        category_id: categoryId,
        ai_hints: item.ai_hints || [],
        basic_info: item.basic_info || {},
        metadata: item.metadata || {}
      });
    
    if (insertError) {
      console.error(`❌ Error importing ${item.name}:`, insertError);
    } else {
      console.log(`✅ Imported: ${item.name}`);
      importedCount++;
    }
  }
  
  console.log(`\n📊 Import Summary:`);
  console.log(`✅ Imported: ${importedCount} items`);
  console.log(`⚠️  Skipped (already exists): ${skippedCount} items\n`);
  
  // Now upload the images for these items
  console.log('📷 Uploading images for imported items...\n');
  
  let imageUploadCount = 0;
  
  for (const mapping of imageMappings.filter(m => m.matched)) {
    const imagePath = path.join(WIKI_IMAGES_DIR, mapping.imageName);
    
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const ext = path.extname(imagePath).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
      
      // Check if image already exists
      const { data: existingImage } = await supabase
        .from('item_images')
        .select('id')
        .eq('item_id', mapping.itemId!)
        .single();
      
      if (existingImage) {
        console.log(`⚠️  Image already exists for: ${mapping.itemName}`);
        continue;
      }
      
      // Upload image
      const { error: uploadError } = await supabase
        .from('item_images')
        .insert({
          item_id: mapping.itemId!,
          image_data: base64Image,
          mime_type: mimeType,
          is_primary: true,
          display_order: 0
        });
      
      if (uploadError) {
        console.error(`❌ Error uploading image for ${mapping.itemName}:`, uploadError);
      } else {
        console.log(`✅ Uploaded image for: ${mapping.itemName}`);
        imageUploadCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing image ${mapping.imageName}:`, error);
    }
  }
  
  console.log(`\n✨ Complete!`);
  console.log(`📊 Uploaded ${imageUploadCount} images`);
}

function getCategoryNameFromId(categoryId: string): string {
  const categoryNames: { [key: string]: string } = {
    '1': 'Houses',
    '2': 'Cars',
    '3': 'Watches',
    '4': 'Designer Fashion',
    '5': 'Art',
    '6': 'Grocery Items',
    '7': 'Electronics',
    '8': 'Sports Equipment',
    '9': 'Jewelry',
    '10': 'Furniture'
  };
  return categoryNames[categoryId] || '';
}

main().catch(console.error);