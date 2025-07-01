import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

interface DatabaseItem {
  id: string;
  name: string;
  brand: string | null;
  category_id: string;
}

// Map of wiki image names to item names (as they appear in the database)
const wikiImageToItemName: { [key: string]: string } = {
  'Amazon_Echo_5th_Gen': 'Echo (5th Gen)',
  'Apple_Watch_Series_9': 'Watch Series 9',
  'Arne_Jacobsen_Egg_Chair': 'Egg Chair',
  'Audemars_Piguet_Royal_Oak': 'Royal Oak',
  'BMW_M3': 'M3',
  'Bananas': 'Bananas',
  'Boucheron_Quatre_Classique_Ring': 'Quatre Classique Ring',
  'Breitling_Navitimer': 'Navitimer',
  'Broccoli': 'Broccoli',
  'Brown_Rice': 'Brown Rice',
  'Buckingham_Palace': 'Buckingham Palace',
  'Casa_Batll': 'Casa Batlló',
  'Castiglioni_Brothers_Arco_Floor_Lamp': 'Arco Floor Lamp',
  'Chanel_Classic_Flap_Bag': 'Classic Flap Bag',
  'Charles__Ray_Eames_Lounge_Chair': 'Eames Lounge Chair',
  'Chevrolet_Corvette_C8': 'Corvette C8',
  'Chicken_Breast': 'Chicken Breast',
  'Eggs_Dozen': 'Eggs (Dozen)',
  'Fallingwater': 'Fallingwater',
  'Ford_Mustang_GT': 'Mustang GT',
  'Grant_Wood': 'American Gothic',
  'Greek_Yogurt_32_oz': 'Greek Yogurt (32 oz)',
  'Gucci_GG_Marmont_Matelass_Shoulder_Bag': 'GG Marmont Matelassé Shoulder Bag',
  'Gustav_Klimt': 'The Kiss',
  'Hans_Wegner_Wishbone_Chair': 'Wishbone Chair',
  'Harry_Winston_Cluster_Earrings': 'Cluster Earrings',
  'Hearst_Castle': 'Hearst Castle',
  'IWC_Portugieser': 'Portugieser',
  'Ikea_Pong_Armchair': 'Poäng Armchair',
  'Johannes_Vermeer': 'Girl with a Pearl Earring',
  'Land_Rover_Range_Rover_Sport': 'Range Rover Sport',
  'Leonardo_da_Vinci': 'Mona Lisa',
  'Louis_Vuitton_Speedy_30': 'Speedy 30',
  'Mercedes-Benz_S-Class': 'S-Class',
  'Neuschwanstein_Castle': 'Neuschwanstein Castle',
  'Nintendo_Switch_OLED': 'Switch OLED',
  'Nomos_Tangente': 'Tangente',
  'Olive_Oil_1_L': 'Olive Oil (1 L)',
  'Omega_Speedmaster_Professional': 'Speedmaster Professional',
  'Pablo_Picasso': 'Guernica',
  'Palace_of_Versailles': 'Palace of Versailles',
  'Prada_Galleria_Tote': 'Galleria Tote',
  'Rembrandt': 'The Night Watch',
  'Rolex_Submariner': 'Submariner',
  'Salvador_Dal': 'The Persistence of Memory',
  'Samsung_Galaxy_S23_Ultra': 'Galaxy S23 Ultra',
  'Sandro_Botticelli': 'The Birth of Venus',
  'Seiko_Prospex_Diver': 'Prospex Diver',
  'The_White_House': 'The White House',
  'Titleist_Pro_V1_Golf_Ball': 'Pro V1 Golf Ball',
  'Van_Cleef__Arpels_Alhambra_Necklace': 'Alhambra Necklace',
  'Villa_Savoye': 'Villa Savoye',
  'Villa_Tugendhat': 'Villa Tugendhat',
  'Winchester_Mystery_House': 'Winchester Mystery House',
};

async function main() {
  console.log('🚀 Starting final wiki image upload...\n');
  
  // Get all wiki images
  const imageFiles = fs.readdirSync(WIKI_IMAGES_DIR)
    .filter(file => file.startsWith('resized_') && (
      file.endsWith('.png') || 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg') || 
      file.endsWith('.JPG')
    ));
  
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
  
  // Process each wiki image
  let uploadCount = 0;
  let skipCount = 0;
  let notFoundCount = 0;
  
  for (const imageFile of imageFiles) {
    const imageName = path.basename(imageFile, path.extname(imageFile)).replace('resized_', '');
    const itemName = wikiImageToItemName[imageName];
    
    if (!itemName) {
      console.log(`❓ No mapping found for image: ${imageFile}`);
      notFoundCount++;
      continue;
    }
    
    // Find the item in the database
    const item = items.find(i => i.name === itemName);
    
    if (!item) {
      console.log(`❌ Item not found in database: ${itemName}`);
      notFoundCount++;
      continue;
    }
    
    // Check if image already exists
    const { data: existingImage } = await supabase
      .from('item_images')
      .select('id')
      .eq('item_id', item.id)
      .single();
    
    if (existingImage) {
      console.log(`⚠️  Image already exists for: ${item.name}`);
      skipCount++;
      continue;
    }
    
    // Read and upload the image
    try {
      const imagePath = path.join(WIKI_IMAGES_DIR, imageFile);
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const ext = path.extname(imagePath).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
      
      const { error: uploadError } = await supabase
        .from('item_images')
        .insert({
          item_id: item.id,
          image_data: base64Image,
          mime_type: mimeType,
          is_primary: true,
          display_order: 0
        });
      
      if (uploadError) {
        console.error(`❌ Error uploading image for ${item.name}:`, uploadError);
      } else {
        console.log(`✅ Uploaded image for: ${item.name}`);
        uploadCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing image ${imageFile}:`, error);
    }
  }
  
  console.log(`\n✨ Upload Complete!`);
  console.log(`✅ Successfully uploaded: ${uploadCount} images`);
  console.log(`⚠️  Skipped (already exists): ${skipCount} images`);
  console.log(`❓ Not found/unmapped: ${notFoundCount} images`);
}

main().catch(console.error);