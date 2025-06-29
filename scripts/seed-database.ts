import { createClient } from '@supabase/supabase-js';
import { categories, items } from '../lib/real-data';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await supabase.from('game_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('leaderboard_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert categories
    console.log('Inserting categories...');
    const categoryMap = new Map<string, string>(); // Map old IDs to new UUIDs
    
    for (const category of categories) {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
          icon: category.icon,
        })
        .select()
        .single();

      if (error) {
        console.error(`Error inserting category ${category.name}:`, error);
        continue;
      }

      categoryMap.set(category.id, data.id);
      console.log(`✓ Inserted category: ${category.name}`);
    }

    // Insert items
    console.log('\nInserting items...');
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      const newCategoryId = categoryMap.get(item.category_id);
      if (!newCategoryId) {
        console.error(`Category ID ${item.category_id} not found for item ${item.name}`);
        errorCount++;
        continue;
      }

      const { error } = await supabase
        .from('items')
        .insert({
          name: item.name,
          brand: item.brand,
          price: item.price,
          currency: item.currency,
          description: item.description || '',
          images: item.images,
          metadata: item.metadata || {},
          ai_hints: [], // We're using blur system instead
          category_id: newCategoryId,
        });

      if (error) {
        console.error(`Error inserting item ${item.name}:`, error);
        errorCount++;
      } else {
        successCount++;
        console.log(`✓ Inserted item: ${item.brand} ${item.name}`);
      }
    }

    console.log(`\nSeed completed!`);
    console.log(`Categories inserted: ${categoryMap.size}`);
    console.log(`Items inserted: ${successCount}`);
    if (errorCount > 0) {
      console.log(`Items failed: ${errorCount}`);
    }

    // Create a demo user for testing
    console.log('\nCreating demo user...');
    const { error: userError } = await supabase
      .from('users')
      .insert({
        username: 'demo',
        password_hash: '5d9b8c8f7e6d5c4b3a2918273645362718293847564738291029384756473829', // Password: "demo123"
        display_name: 'Demo User',
      });

    if (userError && userError.code !== '23505') { // Ignore if user already exists
      console.error('Error creating demo user:', userError);
    } else {
      console.log('✓ Demo user created (username: demo, password: demo123)');
    }

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

// Run the seed
seedDatabase().then(() => {
  console.log('\nDatabase seeding complete!');
  process.exit(0);
});