import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateMockPlayers } from '../utils/mock-players';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedLeaderboard() {
  console.log('Seeding leaderboard with mock players...');
  
  try {
    // Generate 10 mock players
    const mockPlayers = generateMockPlayers(10);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const player of mockPlayers) {
      const leaderboardEntry = {
        username: player.username,
        accuracy: player.accuracy,
        attempts: player.attempts,
        item_name: player.item_name,
        item_price: player.item_price,
      };
      
      const { error } = await supabase
        .from('leaderboard_entries')
        .insert(leaderboardEntry);
      
      if (error) {
        console.error(`Error inserting ${player.username}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Added: ${player.username} - Score: ${1000 - (120 * player.attempts)} (${player.attempts} attempts)`);
        successCount++;
      }
    }
    
    console.log(`\nLeaderboard seeding complete!`);
    console.log(`✓ Successfully added: ${successCount} entries`);
    console.log(`✗ Errors: ${errorCount} entries`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the seeding
seedLeaderboard();