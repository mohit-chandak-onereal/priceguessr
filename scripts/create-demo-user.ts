import { createUser } from '../lib/auth';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function createDemoUser() {
  try {
    console.log('Creating demo user...');
    const user = await createUser('demo', 'demo123', 'Demo User');
    console.log('✅ Demo user created successfully:', user);
  } catch (error) {
    if (error instanceof Error && error.message === 'Username already exists') {
      console.log('ℹ️ Demo user already exists');
    } else {
      console.error('❌ Error creating demo user:', error);
    }
  }
}

createDemoUser().then(() => {
  console.log('Done!');
  process.exit(0);
});