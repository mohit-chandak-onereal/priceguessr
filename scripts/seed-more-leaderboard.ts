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

const fixedNames = ['Mohit', 'Joe', 'Bryce'];
const items = [
  'Rolex Submariner', 'Omega Speedmaster', 'iPhone 14 Pro', 'MacBook Pro',
  'Tesla Model S', 'BMW M3', 'Chanel Classic Flap', 'Louis Vuitton Neverfull',
  'Instant Pot Duo', 'Roomba Vacuum', 'Dyson Hair Dryer', 'Apple AirPods Pro'
];

async function seedMoreLeaderboard() {
  console.log('Adding more varied leaderboard entries...');
  
  try {
    // Add 5 more entries with different score ranges
    const entries = [
      { name: 'Mohit', suffix: Math.floor(Math.random() * 9000) + 1000, score: 950, attempts: 1, accuracy: 98.5 },
      { name: 'Joe', suffix: Math.floor(Math.random() * 9000) + 1000, score: 880, attempts: 1, accuracy: 97.2 },
      { name: 'Bryce', suffix: Math.floor(Math.random() * 9000) + 1000, score: 820, attempts: 2, accuracy: 96.8 },
      { name: 'Mohit', suffix: Math.floor(Math.random() * 9000) + 1000, score: 760, attempts: 2, accuracy: 95.5 },
      { name: 'Joe', suffix: Math.floor(Math.random() * 9000) + 1000, score: 700, attempts: 3, accuracy: 95.1 },
    ];
    
    let successCount = 0;
    
    for (const entry of entries) {
      const username = `${entry.name}_${entry.suffix}`;
      const item = items[Math.floor(Math.random() * items.length)];
      const price = Math.floor(Math.random() * 50000) + 5000;
      
      const leaderboardEntry = {
        username: username,
        accuracy: entry.accuracy,
        attempts: entry.attempts,
        item_name: item,
        item_price: price,
      };
      
      const { error } = await supabase
        .from('leaderboard_entries')
        .insert(leaderboardEntry);
      
      if (error) {
        console.error(`Error inserting ${username}:`, error.message);
      } else {
        console.log(`✓ Added: ${username} - Score: ${entry.score} (${entry.attempts} attempts, ${entry.accuracy}% accuracy)`);
        successCount++;
      }
    }
    
    console.log(`\nAdded ${successCount} more entries to leaderboard!`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the seeding
seedMoreLeaderboard();