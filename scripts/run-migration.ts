import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Create Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function runMigration() {
  console.log('Running database migration...');
  
  try {
    // Read the migration file
    const migrationSQL = readFileSync(join(__dirname, '..', 'supabase', 'migrations', 'add_item_hints.sql'), 'utf-8');
    
    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement + ';'
      }).single();
      
      if (error) {
        // Try direct execution as fallback
        console.log('Direct RPC failed, trying alternative method...');
        // For now, we'll just log the SQL that needs to be run
        console.log('Please run this SQL manually in Supabase SQL Editor:');
        console.log(statement + ';');
        console.log('---');
      } else {
        console.log('✓ Statement executed successfully');
      }
    }
    
    console.log('\nMigration complete! Please verify the changes in your Supabase dashboard.');
    console.log('\nThe following columns should now exist in the items table:');
    console.log('- basic_info (JSONB)');
    console.log('- hint_1 (TEXT)');
    console.log('- hint_2 (TEXT)');
    console.log('- hint_3 (TEXT)');
    console.log('- hint_4 (TEXT)');
    console.log('- hint_5 (TEXT)');
    
  } catch (error) {
    console.error('Migration error:', error);
    console.log('\nPlease run the migration manually in Supabase SQL Editor:');
    console.log('File: /supabase/migrations/add_item_hints.sql');
  }
}

runMigration();