import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ItemData {
  name: string;
  category: string;
  basic_info: {
    brand: string;
    year: number;
    type: string;
    [key: string]: any;
  };
  hints: string[];
}

// Price mapping for items (you can adjust these)
const priceMap: Record<string, number> = {
  // Watches
  "Rolex Submariner": 9100,
  "Omega Speedmaster": 6350,
  "Audemars Piguet Royal Oak": 32000,
  "Patek Philippe Nautilus": 88000,
  "Tag Heuer Carrera": 5500,
  "Cartier Tank": 8200,
  "IWC Big Pilot": 13000,
  "Breitling Navitimer": 8600,
  "Hublot Big Bang": 19000,
  "Panerai Luminor": 8900,
  
  // Cars (if any in the data)
  "Tesla Model S": 88000,
  "BMW M3": 76000,
  "Mercedes S-Class": 112000,
  
  // Default price for unknown items
  default: 5000
};

// Category mapping from database
const categoryMap: Record<string, string> = {
  'houses': '1c001a7e-b2a6-4c53-a2a2-9cd4d4addfbe',
  'cars': 'c4b6fc1f-ac18-4a9d-9bd3-2109831421c4',
  'watches': '8a8720ec-c87b-419e-87d5-a6acdf4abe0b',
  'designer-fashion': '9f08d7b3-6e98-4bd1-b76b-39cccf2114f9',
  'designer fashion': '9f08d7b3-6e98-4bd1-b76b-39cccf2114f9', // Alternative naming
  'art': 'eade2985-a2a9-497b-a089-c1a480d0b053',
  'grocery-items': '393fa317-ab99-4546-b92c-7917d9972920',
  'electronics': '9889f1b2-3bdc-43a8-97a4-129a6230188a',
  'sports-equipment': 'b4faaf47-610d-4eca-a8e0-71459cbf4a54',
  'jewelry': '0cffa39a-b28d-428b-a52a-cd7a719dbc73',
  'furniture': '0525514a-7338-4ac5-aedb-6fe1b39281fd'
};

async function populateFromJson() {
  console.log('Reading JSON file...');
  
  try {
    // Read the JSON file
    const jsonPath = join(__dirname, '..', '..', 'resources', 'price_guessing_game_data.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8')) as ItemData[];
    
    console.log(`Found ${jsonData.length} items in JSON file`);
    
    // Clear existing items (optional - comment out if you want to keep existing)
    console.log('Clearing existing items...');
    await supabase.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each item
    for (const item of jsonData) {
      const categoryId = categoryMap[item.category] || categoryMap['electronics']; // Default to electronics
      const price = priceMap[item.name] || priceMap.default;
      
      // Prepare item data
      const itemData = {
        name: item.name,
        brand: item.basic_info.brand,
        category_id: categoryId,
        price: price,
        currency: 'USD',
        images: [`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop`], // Default image
        metadata: item.basic_info, // Keep original structure
        basic_info: item.basic_info,
        hint_1: item.hints[0] || null,
        hint_2: item.hints[1] || null,
        hint_3: item.hints[2] || null,
        hint_4: item.hints[3] || null,
        hint_5: item.hints[4] || null,
        ai_hints: item.hints,
        description: `${item.basic_info.type} by ${item.basic_info.brand}, released in ${item.basic_info.year}.`
      };
      
      const { error } = await supabase
        .from('items')
        .insert(itemData);
      
      if (error) {
        console.error(`Error inserting ${item.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Inserted: ${item.name}`);
        successCount++;
      }
    }
    
    console.log(`\nPopulation complete!`);
    console.log(`✓ Successfully inserted: ${successCount} items`);
    console.log(`✗ Errors: ${errorCount} items`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the population
populateFromJson();