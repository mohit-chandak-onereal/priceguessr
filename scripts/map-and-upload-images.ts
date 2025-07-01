import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sharp from 'sharp';

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

interface ImageMapping {
  itemId: string;
  itemName: string;
  imagePath: string | null;
  categoryId: string;
  categoryName: string;
}

interface Item {
  id: string;
  name: string;
  brand: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Helper function to normalize names for matching
function normalizeForMatching(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Try to match image filename to item name
function findImageForItem(item: Item, imageFiles: string[]): string | null {
  // Special case mappings for known mismatches
  const specialMappings: { [key: string]: string } = {
    'Model S': 'Tesla_Model_S',
    'M3': 'BMW_M3',
    'Supra': 'Toyota_Supra',
    'S-Class': 'Mercedes-Benz_S-Class',
    'Mustang GT': 'Ford_Mustang_GT',
    'RS6 Avant': 'Audi_RS6_Avant',
    '911 Carrera': 'Porsche_911',
    'LC 500': 'Lexus_LC_500',
    'Corvette C8': 'Chevrolet_Corvette_C8',
    'Range Rover Sport': 'Land_Rover_Range_Rover_Sport',
    'Palace of Versailles': 'Palace_of_Versailles',
    'The White House': 'The_White_House',
    'Buckingham Palace': 'Buckingham_Palace',
    'Fallingwater': 'Fallingwater',
    'Villa Savoye': 'Villa_Savoye',
    'Casa Batlló': 'Casa_Batll',
    'Neuschwanstein Castle': 'Neuschwanstein_Castle',
    'Hearst Castle': 'Hearst_Castle',
    'Winchester Mystery House': 'Winchester_Mystery_House',
    'Villa Tugendhat': 'Villa_Tugendhat',
    'Submariner': 'Rolex_Submariner',
    'Speedmaster Professional': 'Omega_Speedmaster_Professional',
    'Nautilus 5711': 'Patek_Nautilus',
    'Royal Oak': 'Audemars_Piguet_Royal_Oak',
    'Carrera': 'TAG_Carrera',
    'Reverso': 'JLC_Reverso',
    'Navitimer': 'Breitling_Navitimer',
    'Portugieser': 'IWC_Portugieser',
    'Prospex Diver': 'Seiko_Prospex_Diver',
    'Tangente': 'Nomos_Tangente',
    'Classic Flap Bag': 'Chanel_Classic_Flap_Bag',
    'Birkin': 'Hermes_Birkin',
    'Speedy 30': 'Louis_Vuitton_Speedy_30',
    'GG Marmont Matelassé Shoulder Bag': 'Gucci_GG_Marmont_Matelass_Shoulder_Bag',
    'Galleria Tote': 'Prada_Galleria_Tote',
    'Lady Dior': 'Dior_Lady',
    'Baguette': 'Fendi_Baguette',
    'Luggage Tote': 'Celine_Luggage',
    'City Bag': 'Balenciaga_City',
    'Sac de Jour': 'YSL_Sac',
    'Mona Lisa': 'Leonardo_da_Vinci',
    'Starry Night': 'Vincent_van_Gogh',
    'The Persistence of Memory': 'Salvador_Dal',
    'Girl with a Pearl Earring': 'Johannes_Vermeer',
    'The Scream': 'Edvard_Munch',
    'Guernica': 'Pablo_Picasso',
    'The Kiss': 'Gustav_Klimt',
    'American Gothic': 'Grant_Wood',
    'The Birth of Venus': 'Sandro_Botticelli',
    'The Night Watch': 'Rembrandt',
    'Bananas': 'Bananas',
    'Whole Milk': 'Milk',
    'Brown Rice': 'Brown_Rice',
    'Eggs (Dozen)': 'Eggs_Dozen',
    'Olive Oil (1 L)': 'Olive_Oil_1_L',
    'Broccoli': 'Broccoli',
    'Chicken Breast': 'Chicken_Breast',
    'Whole Wheat Bread': 'Wheat_Bread',
    'Greek Yogurt (32 oz)': 'Greek_Yogurt_32_oz',
    'Almonds (1 lb)': 'Almonds',
    'iPhone 14 Pro': 'iPhone_14',
    'Galaxy S23 Ultra': 'Samsung_Galaxy_S23_Ultra',
    'XPS 13': 'Dell_XPS',
    'WH‑1000XM5': 'Sony_WH1000XM5',
    'MacBook Pro 14" M3': 'MacBook_Pro',
    'HERO12 Black': 'GoPro_Hero12',
    'A7 IV': 'Sony_A7_IV',
    'Switch OLED': 'Nintendo_Switch_OLED',
    'Watch Series 9': 'Apple_Watch_Series_9',
    'Echo (5th Gen)': 'Amazon_Echo_5th_Gen',
    'Evolution Basketball': 'Wilson_Basketball',
    'Pro V1 Golf Ball': 'Titleist_Pro_V1_Golf_Ball',
    'Paradym Driver': 'Callaway_Driver',
    'Mercurial Superfly FG': 'Nike_Mercurial',
    'Predator Elite': 'Adidas_Predator',
    'Astrox 99 Badminton Racket': 'Yonex_Astrox',
    'Echo Barbell': 'Rogue_Barbell',
    'Championship Tennis Ball (3‑pack)': 'Wilson_Tennis',
    'NBA Official Game Basketball': 'Spalding_NBA',
    'Carbon T7 Treadmill': 'ProForm_Treadmill',
    'Love Bracelet': 'Cartier_Love',
    'Solitaire Diamond Ring': 'Tiffany_Solitaire',
    'Cluster Earrings': 'Harry_Winston_Cluster_Earrings',
    'Alhambra Necklace': 'Van_Cleef__Arpels_Alhambra_Necklace',
    'Serpenti Watch‑Bracelet': 'Bvlgari_Serpenti',
    'Happy Diamonds Ring': 'Chopard_Happy',
    'Victoria Vine Bracelet': 'Tiffany_Victoria',
    'Butterfly Brooch': 'Graff_Butterfly',
    'Quatre Classique Ring': 'Boucheron_Quatre_Classique_Ring',
    'Possession Necklace': 'Piaget_Possession',
    'Eames Lounge Chair': 'Charles__Ray_Eames_Lounge_Chair',
    'Barcelona Chair': 'Mies_Barcelona_Chair',
    'Noguchi Coffee Table': 'Noguchi_Table',
    'LC2 Petit Comfort Chair': 'LC2_Chair',
    'Egg Chair': 'Arne_Jacobsen_Egg_Chair',
    'Wassily Chair': 'Wassily_Chair',
    'Wishbone Chair': 'Hans_Wegner_Wishbone_Chair',
    'Tolix Marais A Chair': 'Tolix_Chair',
    'Arco Floor Lamp': 'Castiglioni_Brothers_Arco_Floor_Lamp',
    'Poäng Armchair': 'Ikea_Pong_Armchair'
  };
  
  // Check special mappings first
  if (specialMappings[item.name]) {
    const targetFile = imageFiles.find(f => 
      normalizeForMatching(path.basename(f, path.extname(f)).replace('resized_', '')) === 
      normalizeForMatching(specialMappings[item.name])
    );
    if (targetFile) {
      return path.join(WIKI_IMAGES_DIR, targetFile);
    }
  }
  
  const itemNameNormalized = normalizeForMatching(item.name);
  const brandNameNormalized = item.brand ? normalizeForMatching(item.brand) : '';
  const fullNameNormalized = normalizeForMatching(`${item.brand || ''} ${item.name}`);
  
  // Try exact matches first
  for (const imageFile of imageFiles) {
    const imageNameNormalized = normalizeForMatching(path.basename(imageFile, path.extname(imageFile)).replace('resized_', ''));
    
    // Try different matching strategies
    if (imageNameNormalized === fullNameNormalized ||
        imageNameNormalized === itemNameNormalized ||
        (brandNameNormalized && imageNameNormalized.includes(brandNameNormalized) && imageNameNormalized.includes(itemNameNormalized))) {
      return path.join(WIKI_IMAGES_DIR, imageFile);
    }
  }
  
  // Try partial matches
  for (const imageFile of imageFiles) {
    const imageNameNormalized = normalizeForMatching(path.basename(imageFile, path.extname(imageFile)).replace('resized_', ''));
    
    // Check if all significant words from item name are in image name
    const itemWords = itemNameNormalized.split('_').filter(w => w.length > 2);
    if (itemWords.length > 0 && itemWords.every(word => imageNameNormalized.includes(word))) {
      return path.join(WIKI_IMAGES_DIR, imageFile);
    }
  }
  
  return null;
}

// Helper to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate a mock image for items without real images
async function generateMockImage(item: Item, categoryName: string): Promise<Buffer> {
  const width = 600;
  const height = 400;
  
  // Category-based colors
  const categoryColors: { [key: string]: string } = {
    'Houses': '#8B4513',
    'Cars': '#FF0000',
    'Watches': '#FFD700',
    'Designer Fashion': '#FF1493',
    'Art': '#9370DB',
    'Grocery Items': '#32CD32',
    'Electronics': '#1E90FF',
    'Sports Equipment': '#FF4500',
    'Jewelry': '#FFB6C1',
    'Furniture': '#D2691E'
  };
  
  const bgColor = categoryColors[categoryName] || '#708090';
  const textColor = '#FFFFFF';
  
  // Escape text for XML
  const categoryText = escapeXml(categoryName);
  const brandText = escapeXml(item.brand || '');
  const nameText = escapeXml(item.name);
  
  // Create SVG with item info
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="${width/2}" y="${height/2 - 40}" 
            font-family="Arial, sans-serif" 
            font-size="32" 
            font-weight="bold"
            fill="${textColor}" 
            text-anchor="middle">
        ${categoryText}
      </text>
      <text x="${width/2}" y="${height/2}" 
            font-family="Arial, sans-serif" 
            font-size="24" 
            fill="${textColor}" 
            text-anchor="middle">
        ${brandText}
      </text>
      <text x="${width/2}" y="${height/2 + 40}" 
            font-family="Arial, sans-serif" 
            font-size="28" 
            font-weight="bold"
            fill="${textColor}" 
            text-anchor="middle">
        ${nameText}
      </text>
      <text x="${width/2}" y="${height - 30}" 
            font-family="Arial, sans-serif" 
            font-size="18" 
            fill="${textColor}" 
            opacity="0.7"
            text-anchor="middle">
        Mock Image
      </text>
    </svg>
  `;
  
  // Convert SVG to PNG buffer
  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();
  
  return buffer;
}

// Upload image to database
async function uploadImageToDatabase(itemId: string, imageBuffer: Buffer, mimeType: string = 'image/png'): Promise<boolean> {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    // Check if image already exists for this item
    const { data: existing } = await supabase
      .from('item_images')
      .select('id')
      .eq('item_id', itemId)
      .single();
    
    if (existing) {
      console.log(`⚠️  Image already exists for item ${itemId}, skipping...`);
      return false;
    }
    
    // Insert new image
    const { error } = await supabase
      .from('item_images')
      .insert({
        item_id: itemId,
        image_data: base64Image,
        mime_type: mimeType,
        is_primary: true,
        display_order: 0
      });
    
    if (error) {
      console.error(`❌ Error uploading image for item ${itemId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing image for item ${itemId}:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting image mapping and upload process...\n');
  
  // Get all wiki images
  const imageFiles = fs.readdirSync(WIKI_IMAGES_DIR)
    .filter(file => file.startsWith('resized_') && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.JPG')));
  
  console.log(`📁 Found ${imageFiles.length} wiki images\n`);
  
  // Get all items from database
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('id, name, brand, category_id');
  
  if (itemsError || !items) {
    console.error('Error fetching items:', itemsError);
    return;
  }
  
  console.log(`📊 Found ${items.length} items in database\n`);
  
  // Get all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug');
  
  if (categoriesError || !categories) {
    console.error('Error fetching categories:', categoriesError);
    return;
  }
  
  // Create category map
  const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
  
  // Map images to items
  const mappings: ImageMapping[] = [];
  const unmatchedImages = new Set(imageFiles);
  
  for (const item of items) {
    const category = categoryMap.get(item.category_id || '');
    const imagePath = findImageForItem(item, imageFiles);
    
    if (imagePath) {
      const imageFile = path.basename(imagePath);
      unmatchedImages.delete(imageFile);
    }
    
    mappings.push({
      itemId: item.id,
      itemName: `${item.brand ? item.brand + ' ' : ''}${item.name}`,
      imagePath: imagePath,
      categoryId: item.category_id || '',
      categoryName: category?.name || 'Unknown'
    });
  }
  
  // Print mapping summary
  console.log('📋 Mapping Summary:');
  console.log(`✅ Items with matched images: ${mappings.filter(m => m.imagePath).length}`);
  console.log(`❌ Items without images: ${mappings.filter(m => !m.imagePath).length}`);
  console.log(`🔍 Unmatched wiki images: ${unmatchedImages.size}\n`);
  
  if (unmatchedImages.size > 0) {
    console.log('Unmatched images:');
    unmatchedImages.forEach(img => console.log(`  - ${img}`));
    console.log('');
  }
  
  // Show some sample mappings
  console.log('Sample mappings:');
  mappings.filter(m => m.imagePath).slice(0, 5).forEach(m => {
    console.log(`  ✅ ${m.itemName} -> ${path.basename(m.imagePath!)}`);
  });
  console.log('');
  
  // Ask for confirmation
  console.log('📤 Ready to upload images to database');
  console.log('This will:');
  console.log(`  1. Upload ${mappings.filter(m => m.imagePath).length} real images from wiki`);
  console.log(`  2. Generate and upload ${mappings.filter(m => !m.imagePath).length} mock images`);
  console.log('\nPress Ctrl+C to cancel or wait 5 seconds to continue...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Upload images
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const mapping of mappings) {
    let imageBuffer: Buffer;
    let mimeType: string;
    
    if (mapping.imagePath) {
      // Read real image
      try {
        imageBuffer = fs.readFileSync(mapping.imagePath);
        const ext = path.extname(mapping.imagePath).toLowerCase();
        mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
        console.log(`📷 Uploading real image for: ${mapping.itemName}`);
      } catch (error) {
        console.error(`❌ Error reading image file ${mapping.imagePath}:`, error);
        errorCount++;
        continue;
      }
    } else {
      // Generate mock image
      console.log(`🎨 Generating mock image for: ${mapping.itemName}`);
      const item = items.find(i => i.id === mapping.itemId)!;
      imageBuffer = await generateMockImage(item, mapping.categoryName);
      mimeType = 'image/png';
    }
    
    // Upload to database
    const success = await uploadImageToDatabase(mapping.itemId, imageBuffer, mimeType);
    
    if (success) {
      successCount++;
      console.log(`✅ Successfully uploaded image for: ${mapping.itemName}\n`);
    } else {
      skipCount++;
    }
  }
  
  // Final summary
  console.log('\n✨ Upload Complete!');
  console.log(`✅ Successfully uploaded: ${successCount} images`);
  console.log(`⚠️  Skipped (already exists): ${skipCount} images`);
  console.log(`❌ Errors: ${errorCount} images`);
  console.log(`📊 Total processed: ${mappings.length} items`);
}

// Run the script
main().catch(console.error);