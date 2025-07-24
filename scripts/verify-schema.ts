import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifySchema() {
  console.log('🔍 Verifying Database Schema...\n');

  try {
    // Query to get all tables and their columns using raw SQL
    const { data: tables, error: tablesError } = await supabase.rpc('get_schema_info', {});

    if (tablesError) {
      console.error('Error fetching schema:', tablesError);
      return;
    }

    // Group columns by table
    const tableSchema: Record<string, any[]> = {};
    tables?.forEach((col) => {
      if (!tableSchema[col.table_name]) {
        tableSchema[col.table_name] = [];
      }
      tableSchema[col.table_name].push({
        column: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === 'YES',
        default: col.column_default
      });
    });

    // Expected schema after all migrations
    const expectedSchema = {
      users: ['id', 'username', 'password_hash', 'display_name', 'created_at', 'updated_at'],
      categories: ['id', 'name', 'slug', 'icon', 'created_at'],
      items: ['id', 'category_id', 'name', 'brand', 'price', 'currency', 'description', 'images', 'item_image_id', 'metadata', 'hint_1', 'hint_2', 'hint_3', 'hint_4', 'hint_5', 'created_at'],
      item_images: ['id', 'image_data', 'created_at'], // Should NOT have item_id anymore
      game_sessions: ['id', 'user_id', 'item_id', 'guesses', 'attempts', 'won', 'accuracy', 'completed_at', 'created_at'],
      leaderboard_entries: ['id', 'user_id', 'game_session_id', 'category_id', 'accuracy', 'attempts', 'points', 'created_at'],
      achievements: ['id', 'code', 'name', 'description', 'icon', 'condition_type', 'condition_value', 'points', 'created_at'],
      user_achievements: ['id', 'user_id', 'achievement_id', 'unlocked_at', 'game_session_id'],
      user_stats: ['user_id', 'total_games', 'games_won', 'total_points', 'total_accuracy', 'best_accuracy', 'current_streak', 'best_streak', 'last_played_at', 'category_stats', 'updated_at']
    };

    // Check each expected table
    console.log('📋 EXPECTED TABLES AND COLUMNS:\n');
    
    for (const [tableName, expectedColumns] of Object.entries(expectedSchema)) {
      console.log(`\n📦 Table: ${tableName}`);
      
      if (!tableSchema[tableName]) {
        console.log('   ❌ TABLE MISSING!');
        continue;
      }

      const actualColumns = tableSchema[tableName].map(c => c.column);
      
      // Check for expected columns
      expectedColumns.forEach(col => {
        if (actualColumns.includes(col)) {
          console.log(`   ✅ ${col}`);
        } else {
          console.log(`   ❌ ${col} - MISSING!`);
        }
      });

      // Check for unexpected columns (that should have been removed)
      const removedColumns = {
        items: ['ai_hints', 'basic_info'],
        item_images: ['item_id', 'is_primary', 'display_order', 'mime_type'],
        leaderboard_entries: ['username', 'item_name', 'item_price', 'date']
      };

      if (removedColumns[tableName as keyof typeof removedColumns]) {
        console.log('\n   Checking for removed columns:');
        removedColumns[tableName as keyof typeof removedColumns].forEach(col => {
          if (actualColumns.includes(col)) {
            console.log(`   ❌ ${col} - SHOULD BE REMOVED!`);
          } else {
            console.log(`   ✅ ${col} - correctly removed`);
          }
        });
      }
    }

    // Check for foreign key relationships
    console.log('\n\n🔗 FOREIGN KEY RELATIONSHIPS:\n');
    
    const { data: fks, error: fkError } = await supabase.rpc('get_foreign_keys', {});
    
    if (!fkError && fks) {
      const importantFKs = [
        { table: 'items', column: 'item_image_id', ref_table: 'item_images' },
        { table: 'game_sessions', column: 'user_id', ref_table: 'users' },
        { table: 'leaderboard_entries', column: 'game_session_id', ref_table: 'game_sessions' },
        { table: 'user_achievements', column: 'user_id', ref_table: 'users' },
        { table: 'user_achievements', column: 'achievement_id', ref_table: 'achievements' }
      ];

      importantFKs.forEach(fk => {
        const found = fks.find((f: any) => 
          f.table_name === fk.table && 
          f.column_name === fk.column && 
          f.foreign_table_name === fk.ref_table
        );
        
        if (found) {
          console.log(`✅ ${fk.table}.${fk.column} → ${fk.ref_table}`);
        } else {
          console.log(`❌ ${fk.table}.${fk.column} → ${fk.ref_table} - MISSING!`);
        }
      });
    }

    // Summary
    console.log('\n\n📊 MIGRATION STATUS:\n');
    
    const checks = [
      { name: 'items.item_image_id column exists', check: tableSchema.items?.some(c => c.column === 'item_image_id') },
      { name: 'item_images.item_id removed', check: !tableSchema.item_images?.some(c => c.column === 'item_id') },
      { name: 'items.ai_hints removed', check: !tableSchema.items?.some(c => c.column === 'ai_hints') },
      { name: 'items.basic_info removed', check: !tableSchema.items?.some(c => c.column === 'basic_info') },
      { name: 'achievements table exists', check: !!tableSchema.achievements },
      { name: 'user_stats table exists', check: !!tableSchema.user_stats },
      { name: 'leaderboard normalized', check: !tableSchema.leaderboard_entries?.some(c => ['username', 'item_name', 'item_price'].includes(c.column)) }
    ];

    checks.forEach(check => {
      console.log(`${check.check ? '✅' : '❌'} ${check.name}`);
    });

    const allPassed = checks.every(c => c.check);
    console.log(`\n${allPassed ? '✅ All migrations have been applied!' : '❌ Some migrations are missing!'}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Create the RPC functions if they don't exist
async function createHelperFunctions() {
  // Function to get schema info
  const schemaInfoSQL = `
CREATE OR REPLACE FUNCTION get_schema_info()
RETURNS TABLE(
  table_name text,
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
  ORDER BY c.table_name, c.ordinal_position;
END;
$$ LANGUAGE plpgsql;
  `;

  // Function to get foreign keys
  const functionSQL = `
CREATE OR REPLACE FUNCTION get_foreign_keys()
RETURNS TABLE(
  table_name text,
  column_name text,
  foreign_table_name text,
  foreign_column_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.table_name::text,
    kcu.column_name::text,
    ccu.table_name::text AS foreign_table_name,
    ccu.column_name::text AS foreign_column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';
END;
$$ LANGUAGE plpgsql;
  `;

  try {
    await supabase.rpc('exec_sql', { sql: functionSQL });
  } catch (e) {
    // Function might already exist or exec_sql might not be available
  }
}

// Run verification
createHelperFunctions().then(() => verifySchema());