import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const missingHints = [
  {
    name: "Classic Flap Bag", // Note: "Bag" was missing
    hints: {
      basic_info: {
        description: "Timeless quilted bag with chain strap that revolutionized how women carried handbags",
        brand_description: "French house founded by Coco, famous for tweed suits, No. 5, and interlocked C's"
      },
      hint_1: "The original 2.55 was created in February 1955 (hence the name) to free women's hands",
      hint_2: "The quilted pattern was inspired by jockeys' jackets, the chain by soldiers' bags",
      hint_3: "Each bag requires over 180 operations to create, with the quilting perfectly aligned at every seam",
      hint_4: "Prices have increased dramatically - bags that cost $2,000 in 2005 now retail for over $10,000",
      hint_5: "Medium Classic Flaps in caviar leather currently retail around $10,200, increasing yearly"
    }
  },
  {
    name: "WH‑1000XM5", // Note: special hyphen character
    hints: {
      basic_info: {
        description: "Premium noise-canceling headphones with industry-leading ANC and comfort",
        brand_description: "Japanese audio and electronics company with decades of innovation"
      },
      hint_1: "Uses two processors and 8 microphones to create unprecedented noise cancellation",
      hint_2: "30-hour battery life with ANC on, and 3 hours of playback from just 3 minutes charging",
      hint_3: "Weighs only 250g despite the technology packed inside, 4g lighter than previous model",
      hint_4: "Speak-to-Chat automatically pauses music when you start talking, resuming after silence",
      hint_5: "Premium pricing around $400, competing with Bose and Apple's offerings"
    }
  },
  {
    name: "Serpenti Watch‑Bracelet", // Note: special hyphen character
    hints: {
      basic_info: {
        description: "Snake-inspired timepiece that coils around the wrist, hiding the watch face in the head",
        brand_description: "Roman jeweler famous for bold designs and colorful gemstones"
      },
      hint_1: "The snake motif dates to the 1940s, symbolizing eternal youth through shedding of skin",
      hint_2: "Uses the ancient Tubogas technique - wrapping gold strips around a core without soldering",
      hint_3: "Elizabeth Taylor owned multiple versions, helping establish it as a symbol of glamour",
      hint_4: "Modern versions incorporate everything from steel to full pavé diamonds and colored gems",
      hint_5: "Steel versions start around $15,000, with high jewelry pieces exceeding $200,000"
    }
  },
  {
    name: "Championship Tennis Ball (3‑pack)", // Note: special hyphen character
    hints: {
      basic_info: {
        description: "Premium felt-covered balls meeting ITF specifications for tournament play",
        brand_description: "American sporting goods company supplying official balls to major tournaments"
      },
      hint_1: "Used at the US Open since 1979, with over 100,000 balls used during the two-week tournament",
      hint_2: "The felt is a specific wool-nylon blend that provides consistent bounce and spin response",
      hint_3: "Pressurized to 12-14 PSI, they begin losing pressure the moment the can is opened",
      hint_4: "Professional matches use new balls every 7-9 games to maintain consistent playing characteristics",
      hint_5: "A 3-pack of championship extra duty balls costs around $5-6"
    }
  }
];

async function updateMissingHints() {
  console.log('📝 Updating missing hints...\n');
  
  // Also look for items without hints
  const { data: itemsWithoutHints } = await supabase
    .from('items')
    .select('id, name')
    .is('hint_1', null);
  
  console.log(`Found ${itemsWithoutHints?.length || 0} items still without hints\n`);
  
  for (const item of missingHints) {
    try {
      const { data: found, error: findError } = await supabase
        .from('items')
        .select('id')
        .eq('name', item.name)
        .single();
      
      if (findError || !found) {
        console.error(`❌ Item not found: ${item.name}`);
        continue;
      }
      
      const { error: updateError } = await supabase
        .from('items')
        .update({
          basic_info: item.hints.basic_info,
          hint_1: item.hints.hint_1,
          hint_2: item.hints.hint_2,
          hint_3: item.hints.hint_3,
          hint_4: item.hints.hint_4,
          hint_5: item.hints.hint_5
        })
        .eq('id', found.id);
      
      if (updateError) {
        console.error(`❌ Failed to update ${item.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated hints for: ${item.name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${item.name}:`, error);
    }
  }
  
  // Final check
  const { data: stillMissing } = await supabase
    .from('items')
    .select('name')
    .is('hint_1', null);
  
  if (stillMissing && stillMissing.length > 0) {
    console.log('\n⚠️  Items still missing hints:');
    stillMissing.forEach(item => console.log(`  - ${item.name}`));
  } else {
    console.log('\n✅ All items now have hints!');
  }
}

updateMissingHints().catch(console.error);