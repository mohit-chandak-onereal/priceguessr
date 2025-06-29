import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Create Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runMigration() {
  console.log('Running database migration...\n');
  
  try {
    // First, let's check current table structure
    console.log('Checking current table structure...');
    const { data: currentColumns, error: checkError } = await supabase
      .from('items')
      .select('*')
      .limit(0);
    
    if (checkError) {
      console.error('Error checking table:', checkError);
      return;
    }

    console.log('Current columns in items table:', Object.keys(currentColumns || {}));
    
    // Unfortunately, Supabase JS client doesn't support DDL operations directly
    // We need to use the Supabase Management API or SQL Editor
    
    console.log('\n❌ IMPORTANT: Supabase JS client cannot execute DDL (ALTER TABLE) statements.');
    console.log('\nYou have two options to add the columns:\n');
    
    console.log('OPTION 1: Use Supabase Dashboard');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Paste and run this SQL:\n');
    
    const migrationSQL = `-- Add new columns to items table
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
WHERE metadata IS NOT NULL AND basic_info = '{}';`;
    
    console.log('```sql');
    console.log(migrationSQL);
    console.log('```\n');
    
    console.log('OPTION 2: Use Supabase CLI (if installed)');
    console.log('Run: npx supabase db push\n');
    
    console.log('This is a limitation of the Supabase JavaScript client - it can only perform');
    console.log('data operations (SELECT, INSERT, UPDATE, DELETE) but not schema operations');
    console.log('(CREATE TABLE, ALTER TABLE, etc.).');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

runMigration();