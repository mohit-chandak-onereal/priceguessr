import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function clearExistingImages() {
  const { data, error } = await supabase
    .from('item_images')
    .select('item_id')
    .limit(1000);
  
  console.log('Existing images count:', data?.length || 0);
  
  // Clear all images to start fresh
  if (data && data.length > 0) {
    console.log('Clearing existing images...');
    const { error: deleteError } = await supabase
      .from('item_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error('Error clearing images:', deleteError);
    } else {
      console.log('All images cleared');
    }
  }
}

clearExistingImages().catch(console.error);