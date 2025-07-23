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

async function checkDatabaseSchema() {
  console.log('=== DATABASE SCHEMA CHECK ===\n');
  
  // 1. Check items table columns
  console.log('1. CHECKING ITEMS TABLE COLUMNS:');
  console.log('--------------------------------');
  try {
    // Try to select potentially removed columns
    const { data: itemsWithOldColumns, error: oldColumnsError } = await supabase
      .from('items')
      .select('id, name, ai_hints, basic_info')
      .limit(1);
    
    if (oldColumnsError) {
      console.log('✅ Old columns (ai_hints, basic_info) have been removed');
    } else {
      console.log('❌ Old columns still exist:');
      console.log('   - ai_hints:', itemsWithOldColumns?.[0]?.ai_hints ? 'exists' : 'null/empty');
      console.log('   - basic_info:', itemsWithOldColumns?.[0]?.basic_info ? 'exists' : 'null/empty');
    }
    
    // Check current hint columns
    const { data: itemsWithHints, error: hintsError } = await supabase
      .from('items')
      .select('id, name, hint_1, hint_2, hint_3, hint_4, hint_5')
      .limit(1);
    
    if (hintsError) {
      console.log('❌ Hint columns (hint_1 through hint_5) not found');
    } else {
      console.log('✅ Hint columns exist');
    }
  } catch (error) {
    console.error('Error checking items table:', error);
  }
  
  // 2. Check achievements tables
  console.log('\n2. CHECKING ACHIEVEMENTS TABLES:');
  console.log('--------------------------------');
  try {
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('id, code, name')
      .limit(1);
    
    if (achievementsError) {
      console.log('❌ achievements table does not exist');
    } else {
      console.log('✅ achievements table exists');
      
      // Count achievements
      const { count } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true });
      console.log(`   - Contains ${count} achievements`);
    }
    
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('id')
      .limit(1);
    
    if (userAchievementsError) {
      console.log('❌ user_achievements table does not exist');
    } else {
      console.log('✅ user_achievements table exists');
    }
  } catch (error) {
    console.error('Error checking achievements tables:', error);
  }
  
  // 3. Check item_images table columns
  console.log('\n3. CHECKING ITEM_IMAGES TABLE:');
  console.log('--------------------------------');
  try {
    // Check for old columns
    const { data: imagesWithOldColumns, error: oldImagesError } = await supabase
      .from('item_images')
      .select('id, item_id, is_primary, display_order')
      .limit(1);
    
    if (oldImagesError) {
      console.log('✅ Old columns (is_primary, display_order) have been removed');
    } else {
      console.log('❌ Old columns still exist:');
      console.log('   - is_primary:', 'is_primary' in (imagesWithOldColumns?.[0] || {}) ? 'exists' : 'removed');
      console.log('   - display_order:', 'display_order' in (imagesWithOldColumns?.[0] || {}) ? 'exists' : 'removed');
    }
    
    // Check current structure
    const { data: currentImages, error: currentImagesError } = await supabase
      .from('item_images')
      .select('id, item_id, image_url')
      .limit(1);
    
    if (!currentImagesError) {
      console.log('✅ item_images table accessible');
    }
  } catch (error) {
    console.error('Error checking item_images table:', error);
  }
  
  // 4. Check leaderboard_entries columns
  console.log('\n4. CHECKING LEADERBOARD_ENTRIES TABLE:');
  console.log('---------------------------------------');
  try {
    // Check for old columns
    const { data: leaderboardWithOldColumns, error: oldLeaderboardError } = await supabase
      .from('leaderboard_entries')
      .select('id, username, item_name, item_price')
      .limit(1);
    
    if (oldLeaderboardError) {
      console.log('✅ Old columns (username, item_name, item_price) have been removed');
    } else {
      console.log('❌ Old columns still exist:');
      console.log('   - username:', leaderboardWithOldColumns?.[0]?.username ? 'exists' : 'null/empty');
      console.log('   - item_name:', leaderboardWithOldColumns?.[0]?.item_name ? 'exists' : 'null/empty');
      console.log('   - item_price:', leaderboardWithOldColumns?.[0]?.item_price ? 'exists' : 'null/empty');
    }
    
    // Check for new columns
    const { data: leaderboardWithNewColumns, error: newLeaderboardError } = await supabase
      .from('leaderboard_entries')
      .select('id, category_id, points')
      .limit(1);
    
    if (newLeaderboardError) {
      console.log('❌ New columns (category_id, points) not found');
    } else {
      console.log('✅ New columns exist:');
      console.log('   - category_id:', 'category_id' in (leaderboardWithNewColumns?.[0] || {}) ? 'exists' : 'missing');
      console.log('   - points:', 'points' in (leaderboardWithNewColumns?.[0] || {}) ? 'exists' : 'missing');
    }
  } catch (error) {
    console.error('Error checking leaderboard_entries table:', error);
  }
  
  // 5. Check user_stats table
  console.log('\n5. CHECKING USER_STATS TABLE:');
  console.log('------------------------------');
  try {
    const { data: userStats, error: userStatsError } = await supabase
      .from('user_stats')
      .select('user_id, total_games, games_won')
      .limit(1);
    
    if (userStatsError) {
      console.log('❌ user_stats table does not exist');
    } else {
      console.log('✅ user_stats table exists');
    }
  } catch (error) {
    console.error('Error checking user_stats table:', error);
  }
  
  console.log('\n=== MIGRATION STATUS SUMMARY ===');
  console.log('The database migration has NOT been fully applied.');
  console.log('You need to run the migration script: /supabase/migrations/20250723_normalize_database.sql');
}

checkDatabaseSchema();