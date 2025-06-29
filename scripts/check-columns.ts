import { createClient } from '@supabase/supabase-js';
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

async function checkColumns() {
  console.log('Checking if new columns exist in items table...\n');
  
  try {
    // Try to select the new columns
    const { data, error } = await supabase
      .from('items')
      .select('id, name, basic_info, hint_1, hint_2, hint_3, hint_4, hint_5')
      .limit(1);
    
    if (error) {
      console.log('❌ New columns NOT found. Error:', error.message);
      console.log('\nThe columns do not exist yet. You need to run this SQL in Supabase SQL Editor:');
      console.log('----------------------------------------');
      console.log(`
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS basic_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hint_1 TEXT,
ADD COLUMN IF NOT EXISTS hint_2 TEXT,
ADD COLUMN IF NOT EXISTS hint_3 TEXT,
ADD COLUMN IF NOT EXISTS hint_4 TEXT,
ADD COLUMN IF NOT EXISTS hint_5 TEXT;

-- Migrate existing metadata to basic_info
UPDATE items 
SET basic_info = metadata 
WHERE metadata IS NOT NULL AND basic_info = '{}';
      `);
      console.log('----------------------------------------');
    } else {
      console.log('✅ New columns exist in the database!');
      console.log('\nSample data:', data?.[0] ? {
        id: data[0].id,
        name: data[0].name,
        basic_info: data[0].basic_info,
        hint_1: data[0].hint_1 ? '✓ Has hint 1' : '✗ No hint 1',
        hint_2: data[0].hint_2 ? '✓ Has hint 2' : '✗ No hint 2',
        hint_3: data[0].hint_3 ? '✓ Has hint 3' : '✗ No hint 3',
        hint_4: data[0].hint_4 ? '✓ Has hint 4' : '✗ No hint 4',
        hint_5: data[0].hint_5 ? '✓ Has hint 5' : '✗ No hint 5',
      } : 'No items found');
    }
  } catch (error) {
    console.error('Error checking columns:', error);
  }
}

checkColumns();