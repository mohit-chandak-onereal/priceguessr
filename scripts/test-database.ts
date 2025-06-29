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
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testDatabase() {
  console.log('🧪 Testing database connection and data...\n');

  try {
    // Test 1: Fetch categories
    console.log('1. Testing categories:');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (catError) throw catError;
    console.log(`✅ Found ${categories?.length} categories`);
    categories?.forEach(cat => console.log(`   - ${cat.icon} ${cat.name}`));

    // Test 2: Fetch items for each category
    console.log('\n2. Testing items per category:');
    for (const category of categories || []) {
      const { data: items, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('category_id', category.id);
      
      if (itemError) throw itemError;
      console.log(`   ${category.name}: ${items?.length} items`);
    }

    // Test 3: Test random item selection
    console.log('\n3. Testing random item selection:');
    const { data: allItems } = await supabase
      .from('items')
      .select('*');
    
    if (allItems && allItems.length > 0) {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
      console.log(`✅ Random item: ${randomItem.brand} ${randomItem.name} - $${randomItem.price}`);
    }

    // Test 4: Test user authentication
    console.log('\n4. Testing demo user:');
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'demo')
      .single();
    
    if (user) {
      console.log(`✅ Demo user found: ${user.username} (${user.display_name})`);
    }

    // Test 5: Test leaderboard
    console.log('\n5. Testing leaderboard:');
    const { data: leaderboard, error: lbError } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .order('accuracy', { ascending: false })
      .limit(5);
    
    if (lbError) throw lbError;
    console.log(`✅ Leaderboard has ${leaderboard?.length || 0} entries`);

    console.log('\n✅ All database tests passed!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

// Run tests
testDatabase().then(() => {
  console.log('\n🎉 Database is ready for use!');
  process.exit(0);
});