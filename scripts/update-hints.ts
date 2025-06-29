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

interface ItemHints {
  name: string;
  hints: string[];
}

const improvedHints: ItemHints[] = [
  {
    name: "Rolex Submariner",
    hints: [
      "This watch failed the US Navy's combat test in 1958 due to water resistance issues, but later became the world's most famous dive watch",
      "Sean Connery wore the Ref. 6538 version as James Bond in Dr. No (1962), launching its journey from tool to luxury icon",
      "In the 1950s it cost just $150, but a 1956 model with 'explorer dial' sold for $1,068,500 at auction in 2018",
      "Uses 904L stainless steel (not standard 316L) with higher chromium content, making it exceptionally corrosion-resistant in saltwater",
      "Jacques Cousteau wore one in his 1954 award-winning documentary 'Le Monde du Silence', introducing audiences to ocean depths"
    ]
  },
  {
    name: "Omega Speedmaster",
    hints: [
      "Originally designed for race car drivers in 1957, it became the first watch with a tachymeter scale on the bezel",
      "Survived NASA's brutal 1965 tests that destroyed all other submitted watches, including extreme temperatures and vacuum conditions",
      "During Apollo 13's crisis, astronauts used it to time the critical 14-second engine burn needed for safe return to Earth",
      "Buzz Aldrin wore it on the moon's surface while Neil Armstrong left his in the Lunar Module as backup timing device",
      "Gene Cernan wore one during Apollo 17, making it both the first AND last watch worn on the moon"
    ]
  },
  {
    name: "Audemars Piguet Royal Oak",
    hints: [
      "Designed overnight by Gérald Genta in 1972, inspired by a diver's helmet with its octagonal bezel and exposed screws",
      "First luxury sports watch made of steel, priced higher than gold watches at launch, causing industry controversy",
      "Named after British Royal Navy ships that used oak to disguise themselves in battle",
      "The bracelet alone requires 20 hours of hand-finishing, with each link individually polished and brushed",
      "Limited to 2,000 pieces annually despite huge demand, maintaining exclusivity through controlled production"
    ]
  },
  {
    name: "Patek Philippe Nautilus",
    hints: [
      "Also designed by Gérald Genta in 1976, inspired by a ship's porthole while eating at a restaurant",
      "Takes over a year to manufacture due to complex case construction with over 50 individual operations",
      "The blue dial requires 45 steps and multiple layers to achieve its signature gradient effect",
      "Retail around $35,000 but trades for $100,000+ on secondary market due to 8-10 year waiting lists",
      "Features a unique hinge construction that Patek Philippe still hand-assembles after 45+ years"
    ]
  },
  {
    name: "Tag Heuer Carrera",
    hints: [
      "Named after the dangerous Carrera Panamericana Mexican road race where drivers relied on precise timing",
      "Jack Heuer designed it in 1963 with the first-ever chronograph without a tachymeter on the dial for clean legibility",
      "Steve McQueen wore one in the 1971 film 'Le Mans', cementing its motorsport credentials",
      "The original featured tension-ring construction allowing for a slimmer profile than competitors",
      "Modern versions use an in-house Heuer 02 movement with 80-hour power reserve, developed over 5 years"
    ]
  },
  {
    name: "Cartier Tank",
    hints: [
      "Louis Cartier designed it in 1917 inspired by Renault tanks he saw on the Western Front in WWI",
      "The elongated case sides represent tank treads while the dial is the cockpit",
      "Jackie Kennedy wore hers so often it became known as the 'Jackie O Tank' and sold for $379,500 in 2017",
      "Andy Warhol famously never wound his, saying 'I don't wear a Tank watch to tell the time'",
      "Muhammad Ali, Princess Diana, and Yves Saint Laurent all had personalized versions"
    ]
  },
  {
    name: "IWC Big Pilot",
    hints: [
      "Original 1940 model had a 55mm case to fit over flight suits and gloves in unheated cockpits",
      "Features a distinctive triangle with two dots at 12 o'clock, allowing pilots to align watches in darkness",
      "The crown is deliberately oversized so pilots could operate it wearing thick leather gloves",
      "Contains a soft iron inner case creating a Faraday cage to protect against magnetic fields up to 80,000 A/m",
      "Modern versions have 7-day power reserve, visible through the power reserve indicator inspired by fuel gauges"
    ]
  },
  {
    name: "Breitling Navitimer",
    hints: [
      "Introduced in 1952 with a circular slide rule that could calculate fuel consumption, climb rates, and distances",
      "The Aircraft Owners and Pilots Association made it their official timepiece in 1954",
      "Astronaut Scott Carpenter wore a 24-hour version in space during the 1962 Aurora 7 mission",
      "The name combines 'Navigation' and 'Timer', reflecting its aviation calculation capabilities",
      "Modern versions still feature the same slide rule bezel, though few pilots still know how to use it"
    ]
  },
  {
    name: "Seiko Prospex",
    hints: [
      "The 1965 62MAS was Japan's first dive watch, created for the Japanese Antarctic Research Expedition",
      "Seiko invented the titanium case in 1970 specifically for their professional dive watches",
      "The 'Tuna Can' models have an outer protective shroud inspired by tuna fish cans",
      "Used by Japanese saturation divers at depths exceeding 300m, proving Japanese watchmaking prowess",
      "Features Seiko's proprietary Diashield coating, 100 times harder than standard steel"
    ]
  },
  {
    name: "Casio G-Shock",
    hints: [
      "Engineer Kikuo Ibe dropped over 200 prototypes from third-floor windows to achieve the 10-meter drop resistance",
      "The name means 'Gravitational Shock', reflecting its ability to withstand extreme forces",
      "Used by Navy SEALs, Arctic explorers, and NASA astronauts despite costing under $100",
      "The hollow case structure was inspired by a rubber ball bouncing, protecting the module inside",
      "Survived being run over by a 20-ton truck in promotional demonstrations"
    ]
  },
  {
    name: "Louis Vuitton Neverfull",
    hints: [
      "Named 'Neverfull' because it can expand and seemingly never fills up, with adjustable side laces",
      "Each bag requires 30 separate pieces and over 40 steps to construct by hand",
      "The Monogram canvas is actually coated cotton, not leather, making it more durable and water-resistant",
      "Features a secret date code hidden inside that authenticators use to verify genuineness",
      "Most counterfeited luxury bag in the world, with LV spending millions annually fighting fakes"
    ]
  },
  {
    name: "Chanel Classic Flap",
    hints: [
      "Coco Chanel created it in 1955 tired of holding clutches, adding a shoulder chain inspired by soldiers' bags",
      "The chain is interwoven with leather to prevent it from scratching clothes or cutting into shoulders",
      "The burgundy lining represents the color of Coco's convent uniform from her orphanage childhood",
      "Karl Lagerfeld added the interlocking CC turn lock in the 1980s, now its most iconic feature",
      "Increases in value 10-15% annually, outperforming many traditional investments"
    ]
  },
  {
    name: "Gucci GG Marmont",
    hints: [
      "The Double G hardware is inspired by a belt buckle from the 1970s Gucci archives",
      "Features chevron pattern with a heart shape on the back, created by precise V-shaped stitching",
      "The antique gold-toned hardware is deliberately oxidized to give it a vintage appearance",
      "Each bag goes through 7 quality control checks and takes 13 hours to produce",
      "Named after Marmont Street in Los Angeles, reflecting Gucci's Hollywood connections"
    ]
  },
  {
    name: "Hermès Birkin",
    hints: [
      "Created after Jane Birkin complained to Hermès CEO on a flight about not finding a suitable weekend bag",
      "Each bag is made by a single craftsman who signs it, taking 18-25 hours of hand-stitching",
      "The waiting list was officially discontinued but getting one still requires 'establishing a relationship' with the brand",
      "A Himalayan crocodile version with diamonds sold for $379,261 at auction in 2017",
      "More valuable than gold as an investment, appreciating 14% annually over the past 35 years"
    ]
  },
  {
    name: "Prada Re-Edition",
    hints: [
      "Re-release of Prada's 2000 nylon mini-bag, originally designed when nylon was considered revolutionary for luxury",
      "The original became famous when worn by Carrie Bradshaw in Sex and the City",
      "Features a removable keychain pouch that started the mini-bag-on-bag trend",
      "Made from recycled ocean plastic as part of Prada's Re-Nylon sustainability project",
      "Sold out globally within hours of each restock, creating a secondary market at 3x retail"
    ]
  },
  {
    name: "Balenciaga Hourglass",
    hints: [
      "Designed by Demna Gvasalia with an extreme curved shape inspired by 1950s jacket silhouettes",
      "The structured shape requires a metal frame inside, making it heavier than it appears",
      "Takes 8 hours to assemble due to the complex curved construction that defies traditional bag-making",
      "The B hardware was redesigned 47 times to achieve the perfect proportions",
      "Popularized the 'architectural bag' trend, inspiring copies across all price points"
    ]
  },
  {
    name: "Fendi Baguette",
    hints: [
      "Designed in 1997 to be carried under the arm like French bread, hence the name",
      "Carrie Bradshaw's 'It's not a bag, it's a Baguette' line in SATC made it the first 'It Bag'",
      "Over 1,000 versions have been created, including one with 8,000 hand-sewn sequins",
      "Sarah Jessica Parker designed a limited edition version benefiting arts education",
      "Relaunched in 2019 with the same dimensions but updated hardware, selling out immediately"
    ]
  },
  {
    name: "Dior Saddle Bag",
    hints: [
      "John Galliano designed it in 1999 inspired by equestrian saddles, with an asymmetric shape",
      "The distinctive curve requires 18 pattern pieces, more than double a regular bag",
      "Beyoncé's 2018 Instagram post wearing a vintage one caused searches to spike 900%",
      "Each embroidered version requires 7 artisans and over 1,500 hours to complete",
      "The magnetic 'CD' closure was revolutionary, hidden under the flap for clean lines"
    ]
  },
  {
    name: "Saint Laurent Lou Camera",
    hints: [
      "Named after Lou Reed and inspired by 1970s camera bags worn by rock photographers",
      "The chevron quilting requires mathematical precision to align perfectly at every seam",
      "Features a tassel made from the same leather, hand-cut into 30 individual strands",
      "The chain strap can be worn three ways: crossbody, shoulder, or doubled as a clutch",
      "Each metal YSL logo is hand-polished for 20 minutes to achieve the perfect shine"
    ]
  },
  {
    name: "Bottega Veneta Pouch",
    hints: [
      "Daniel Lee created 'The Pouch' in 2019, becoming the brand's first viral hit without visible logos",
      "The gathered leather requires 40% more material than the finished size suggests",
      "Made using the intrecciato weaving technique that takes new artisans 3 years to master",
      "The soft construction means no two bags have exactly the same slouch or drape",
      "Sparked the 'quiet luxury' movement, proving desirability without visible branding"
    ]
  }
];

async function updateHints() {
  console.log('Updating hints for all items...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const item of improvedHints) {
    try {
      const { error } = await supabase
        .from('items')
        .update({
          hint_1: item.hints[0],
          hint_2: item.hints[1],
          hint_3: item.hints[2],
          hint_4: item.hints[3],
          hint_5: item.hints[4]
        })
        .eq('name', item.name);
      
      if (error) {
        console.error(`❌ Error updating ${item.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Updated hints for: ${item.name}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${item.name}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\nUpdate complete!`);
  console.log(`✅ Successfully updated: ${successCount} items`);
  console.log(`❌ Errors: ${errorCount} items`);
}

// Run the update
updateHints();