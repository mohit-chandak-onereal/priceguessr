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

// Category mapping from database
const categoryMap: Record<string, string> = {
  'houses': '1c001a7e-b2a6-4c53-a2a2-9cd4d4addfbe',
  'cars': 'c4b6fc1f-ac18-4a9d-9bd3-2109831421c4',
  'watches': '8a8720ec-c87b-419e-87d5-a6acdf4abe0b',
  'designer-fashion': '9f08d7b3-6e98-4bd1-b76b-39cccf2114f9',
  'art': 'eade2985-a2a9-497b-a089-c1a480d0b053',
  'grocery-items': '393fa317-ab99-4546-b92c-7917d9972920',
  'electronics': '9889f1b2-3bdc-43a8-97a4-129a6230188a',
  'sports-equipment': 'b4faaf47-610d-4eca-a8e0-71459cbf4a54',
  'jewelry': '0cffa39a-b28d-428b-a52a-cd7a719dbc73',
  'furniture': '0525514a-7338-4ac5-aedb-6fe1b39281fd'
};

interface ItemData {
  name: string;
  brand: string;
  category_id: string;
  price: number;
  currency: string;
  images: string[];
  basic_info: Record<string, any>;
  hint_1: string;
  hint_2: string;
  hint_3: string;
  hint_4: string;
  hint_5: string;
  description: string;
}

// Sample items for each category
const allCategoryItems: ItemData[] = [
  // Houses
  {
    name: "Modern Beach House",
    brand: "Coastal Living Properties",
    category_id: categoryMap['houses'],
    price: 2850000,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop'],
    basic_info: { type: 'Beach House', location: 'Malibu, CA', year: 2022, bedrooms: 5, sqft: 4500 },
    hint_1: "This property features floor-to-ceiling windows overlooking the Pacific Ocean and was completed just two years ago",
    hint_2: "Located in a famous California beach town known for celebrity homes and featured in countless movies",
    hint_3: "The 4,500 sq ft home includes 5 bedrooms, a chef's kitchen, and direct beach access via private stairs",
    hint_4: "Similar properties in this exclusive neighborhood have sold for between $2.5M and $3.2M in the past year",
    hint_5: "The monthly property tax alone is approximately $2,375, and HOA fees add another $800 per month",
    description: "Modern beach house in Malibu with ocean views"
  },
  {
    name: "Victorian Mansion",
    brand: "Heritage Estates",
    category_id: categoryMap['houses'],
    price: 1450000,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&h=400&fit=crop'],
    basic_info: { type: 'Victorian Mansion', location: 'San Francisco, CA', year: 1885, bedrooms: 6, sqft: 5200 },
    hint_1: "Built in 1885, this historic home survived the great earthquake and features original hardwood floors",
    hint_2: "Located in San Francisco's famous Painted Ladies neighborhood, often photographed by tourists",
    hint_3: "The 5,200 sq ft mansion has 6 bedrooms, servant quarters, and a carriage house converted to garage",
    hint_4: "Recent renovations preserved historical details while adding modern amenities, costing over $400,000",
    hint_5: "Similar Victorian homes in this district range from $1.2M to $1.8M depending on condition",
    description: "Historic Victorian mansion in San Francisco"
  },

  // Cars
  {
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    category_id: categoryMap['cars'],
    price: 108490,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop'],
    basic_info: { type: 'Electric Sedan', year: 2023, horsepower: 1020, range: 405 },
    hint_1: "This electric vehicle can accelerate from 0-60 mph in under 2 seconds, making it one of the fastest production cars",
    hint_2: "With 1,020 horsepower from three motors, it competed with the Bugatti Chiron at a fraction of the price",
    hint_3: "The tri-motor setup provides all-wheel drive and a top speed of 200 mph with the optional track package",
    hint_4: "EPA-estimated range is 405 miles, and it can charge from 10-80% in just 27 minutes at a Supercharger",
    hint_5: "The base price before options starts just over $108,000, competing with Porsche Taycan Turbo S",
    description: "Tesla Model S Plaid - Ultra high-performance electric sedan"
  },
  {
    name: "Porsche 911 Turbo S",
    brand: "Porsche",
    category_id: categoryMap['cars'],
    price: 230400,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=400&fit=crop'],
    basic_info: { type: 'Sports Car', year: 2023, horsepower: 640, engine: '3.8L Twin-Turbo' },
    hint_1: "This German sports car icon features a 3.8L twin-turbo flat-six engine producing 640 horsepower",
    hint_2: "It can sprint from 0-60 mph in just 2.6 seconds with launch control engaged",
    hint_3: "The all-wheel-drive system and active aerodynamics help it achieve a top speed of 205 mph",
    hint_4: "Standard features include carbon-ceramic brakes, sport exhaust, and adaptive suspension",
    hint_5: "With a starting price over $230,000, it competes with McLaren and Ferrari in the supercar segment",
    description: "Porsche 911 Turbo S - Flagship sports car"
  },

  // Electronics
  {
    name: "MacBook Pro 16\" M3 Max",
    brand: "Apple",
    category_id: categoryMap['electronics'],
    price: 3999,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop'],
    basic_info: { type: 'Laptop', year: 2023, processor: 'M3 Max', ram: '48GB', storage: '1TB' },
    hint_1: "This laptop features Apple's most powerful chip with up to 16 CPU cores and 40 GPU cores",
    hint_2: "The 16-inch Liquid Retina XDR display offers 1600 nits peak brightness and ProMotion technology",
    hint_3: "Configured with 48GB unified memory and 1TB SSD, it's aimed at professional video editors",
    hint_4: "Battery life reaches up to 22 hours, the longest ever in a Mac laptop",
    hint_5: "This high-end configuration with M3 Max chip starts at $3,999 before additional upgrades",
    description: "MacBook Pro 16-inch with M3 Max chip"
  },
  {
    name: "Sony A7R V",
    brand: "Sony",
    category_id: categoryMap['electronics'],
    price: 3898,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=600&h=400&fit=crop'],
    basic_info: { type: 'Mirrorless Camera', year: 2023, megapixels: 61, sensor: 'Full Frame' },
    hint_1: "This mirrorless camera features a 61-megapixel full-frame sensor with 8-stop image stabilization",
    hint_2: "The AI-powered autofocus system can track humans, animals, birds, vehicles, and even insects",
    hint_3: "It can shoot 8K video at 24fps or 4K at up to 60fps with full pixel readout",
    hint_4: "The 9.44 million dot EVF is the highest resolution viewfinder in any mirrorless camera",
    hint_5: "Body-only price is $3,898, positioning it as Sony's flagship high-resolution camera",
    description: "Sony A7R V - 61MP professional mirrorless camera"
  },

  // Grocery Items
  {
    name: "Wagyu Beef Ribeye",
    brand: "Kobe Beef Distributors",
    category_id: categoryMap['grocery-items'],
    price: 299,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop'],
    basic_info: { type: 'Premium Beef', grade: 'A5', weight: '16oz', origin: 'Japan' },
    hint_1: "This A5-grade beef from Japan has marbling so intricate it looks like edible marble",
    hint_2: "The cattle are massaged daily and fed a special diet including beer to enhance meat quality",
    hint_3: "At 16 ounces, this single steak could feed 2-3 people when prepared traditionally",
    hint_4: "Authentic certificates trace each cut back to the specific cow and farm in Japan",
    hint_5: "Premium steakhouses charge $50-75 per ounce for this grade, making a 16oz steak worth about $299",
    description: "A5 Wagyu Ribeye from Japan - 16oz"
  },
  {
    name: "Beluga Caviar",
    brand: "Caspian Pearl",
    category_id: categoryMap['grocery-items'],
    price: 850,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop'],
    basic_info: { type: 'Caviar', variety: 'Beluga', weight: '30g', origin: 'Caspian Sea' },
    hint_1: "This delicacy comes from sturgeon that can take up to 20 years to mature in the Caspian Sea",
    hint_2: "The pearls are the largest of all caviar varieties, with a distinctive light gray color",
    hint_3: "Traditionally served on mother-of-pearl spoons to avoid altering the delicate flavor",
    hint_4: "A 30-gram tin is considered a luxury serving for 2-4 people at high-end events",
    hint_5: "Retail price for authentic Beluga caviar runs $25-30 per gram, making this tin worth $850",
    description: "Beluga Caviar from Caspian Sea - 30g"
  },

  // Art
  {
    name: "Banksy Print - Girl With Balloon",
    brand: "Pest Control",
    category_id: categoryMap['art'],
    price: 25000,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1551913902-c92207136625?w=600&h=400&fit=crop'],
    basic_info: { type: 'Screen Print', artist: 'Banksy', year: 2004, edition: 'Signed, 150' },
    hint_1: "This iconic image became famous when a framed version self-destructed at auction in 2018",
    hint_2: "Created by the mysterious British street artist known for political and social commentary",
    hint_3: "This signed screen print is from a limited edition of 150, authenticated by Pest Control",
    hint_4: "The image shows a young girl reaching for a heart-shaped balloon, symbolizing lost innocence",
    hint_5: "Signed editions from 2004 now trade for $20,000-30,000, unsigned versions for much less",
    description: "Banksy - Girl With Balloon, signed screen print"
  },
  {
    name: "KAWS Companion Figure",
    brand: "KAWS",
    category_id: categoryMap['art'],
    price: 15000,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1563207153-f403a6b9b2e9?w=600&h=400&fit=crop'],
    basic_info: { type: 'Sculpture', artist: 'KAWS', material: 'Vinyl', size: '11 inches', edition: 500 },
    hint_1: "This cartoon-like figure with X's for eyes has become a symbol of contemporary pop art",
    hint_2: "The artist Brian Donnelly started as a graffiti artist before becoming a gallery sensation",
    hint_3: "This 11-inch vinyl figure is from a limited edition of 500, each numbered and authenticated",
    hint_4: "Collaborations with brands like Dior and Uniqlo have made these figures highly collectible",
    hint_5: "Original retail was $200, but limited editions now resell for $10,000-20,000 at auction",
    description: "KAWS Companion Figure - Limited Edition Vinyl"
  },

  // Sports Equipment
  {
    name: "Peloton Bike+",
    brand: "Peloton",
    category_id: categoryMap['sports-equipment'],
    price: 2495,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=400&fit=crop'],
    basic_info: { type: 'Exercise Bike', features: 'Rotating screen, Auto-resistance', year: 2023 },
    hint_1: "This premium exercise bike features a 23.8-inch rotating HD touchscreen for off-bike workouts",
    hint_2: "Auto-resistance technology automatically adjusts to match instructor callouts during classes",
    hint_3: "The 4-channel audio system includes front and rear-facing speakers for immersive sound",
    hint_4: "Monthly membership ($44) gives access to thousands of live and on-demand classes",
    hint_5: "The Bike+ model retails for $2,495, while the original Bike costs $1,445",
    description: "Peloton Bike+ with rotating screen"
  },
  {
    name: "TaylorMade Stealth 2 Driver",
    brand: "TaylorMade",
    category_id: categoryMap['sports-equipment'],
    price: 599,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop'],
    basic_info: { type: 'Golf Club', material: 'Carbon Face', year: 2023, loft: '10.5°' },
    hint_1: "This driver features 60X Carbon Twist Face, a departure from traditional titanium faces",
    hint_2: "The carbon face is 44% lighter than titanium, allowing for more weight in optimal positions",
    hint_3: "Advanced inverted cone technology expands the sweet spot for more forgiveness on off-center hits",
    hint_4: "Tour players using this driver have won multiple majors in 2023",
    hint_5: "Retail price is $599, competing directly with Callaway Paradym and Titleist TSR drivers",
    description: "TaylorMade Stealth 2 Carbon Driver"
  },

  // Jewelry
  {
    name: "Tiffany Setting Engagement Ring",
    brand: "Tiffany & Co.",
    category_id: categoryMap['jewelry'],
    price: 17500,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop'],
    basic_info: { type: 'Engagement Ring', carat: '1.5', clarity: 'VVS1', color: 'F', metal: 'Platinum' },
    hint_1: "Charles Lewis Tiffany introduced this six-prong setting in 1886, revolutionizing engagement rings",
    hint_2: "The 1.5-carat center stone is graded F color (colorless) and VVS1 clarity (very slight inclusions)",
    hint_3: "The platinum band and setting add both durability and prestige to this iconic design",
    hint_4: "Each diamond comes with a Tiffany Certificate and is laser-inscribed with a serial number",
    hint_5: "A 1.5-carat F/VVS1 in the Tiffany Setting typically ranges from $15,000 to $20,000",
    description: "Tiffany Setting 1.5ct Diamond Engagement Ring"
  },
  {
    name: "Cartier Love Bracelet",
    brand: "Cartier",
    category_id: categoryMap['jewelry'],
    price: 7350,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop'],
    basic_info: { type: 'Bracelet', material: '18K Yellow Gold', size: '17cm', year: 2023 },
    hint_1: "Created in 1969, this bracelet requires a special screwdriver to put on and remove",
    hint_2: "The design symbolizes eternal love, as it's meant to be worn continuously",
    hint_3: "Made from 18K yellow gold with the iconic screw motifs around the circumference",
    hint_4: "Celebrities often stack multiple Love bracelets, creating a distinctive luxury look",
    hint_5: "The classic yellow gold version in size 17 retails for $7,350 at Cartier boutiques",
    description: "Cartier Love Bracelet in 18K Yellow Gold"
  },

  // Furniture
  {
    name: "Eames Lounge Chair",
    brand: "Herman Miller",
    category_id: categoryMap['furniture'],
    price: 6495,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop'],
    basic_info: { type: 'Lounge Chair', designer: 'Charles & Ray Eames', material: 'Walnut/Leather', year: 1956 },
    hint_1: "Designed in 1956 by Charles and Ray Eames, it's been in continuous production ever since",
    hint_2: "The molded plywood shell cradles premium leather cushions filled with individually wrapped coils",
    hint_3: "Each chair takes 10 weeks to craft, with wood veneers from the same tree for matching grain",
    hint_4: "Featured in the MoMA permanent collection and countless luxury hotels worldwide",
    hint_5: "Authentic Herman Miller versions start at $6,495, while replicas sell for under $1,000",
    description: "Eames Lounge Chair and Ottoman by Herman Miller"
  },
  {
    name: "B&B Italia Tufty-Time Sofa",
    brand: "B&B Italia",
    category_id: categoryMap['furniture'],
    price: 12800,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop'],
    basic_info: { type: 'Modular Sofa', designer: 'Patricia Urquiola', width: '108 inches', year: 2005 },
    hint_1: "Designed by Patricia Urquiola in 2005, this modular system redefined contemporary seating",
    hint_2: "The deep tufted squares can be arranged in countless configurations for any space",
    hint_3: "Each module is filled with variable-density polyurethane and goose down for ultimate comfort",
    hint_4: "The 108-inch configuration shown uses 4 modules upholstered in premium Italian leather",
    hint_5: "This size configuration in leather typically retails for $12,000-14,000 at B&B Italia",
    description: "B&B Italia Tufty-Time Modular Sofa System"
  }
];

async function populateAllCategories() {
  console.log('Populating all categories with items...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const item of allCategoryItems) {
    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('items')
        .select('id')
        .eq('name', item.name)
        .single();
      
      if (existing) {
        console.log(`⚠️  Skipping ${item.name} - already exists`);
        continue;
      }
      
      // Insert new item
      const { error } = await supabase
        .from('items')
        .insert({
          ...item,
          metadata: item.basic_info,
          ai_hints: [item.hint_1, item.hint_2, item.hint_3, item.hint_4, item.hint_5]
        });
      
      if (error) {
        console.error(`❌ Error inserting ${item.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Inserted: ${item.name}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${item.name}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\nPopulation complete!`);
  console.log(`✅ Successfully inserted: ${successCount} items`);
  console.log(`❌ Errors: ${errorCount} items`);
  
  // Show category summary
  console.log('\nFinal category counts:');
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name');
  
  for (const category of categories || []) {
    const { count } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id);
    
    console.log(`${category.name}: ${count || 0} items`);
  }
}

// Run the population
populateAllCategories();