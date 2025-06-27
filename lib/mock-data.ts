import { Category, Item } from '@/types/game';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Houses',
    slug: 'houses',
    icon: '🏠',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Cars',
    slug: 'cars',
    icon: '🚗',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Watches',
    slug: 'watches',
    icon: '⌚',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Designer Fashion',
    slug: 'designer-fashion',
    icon: '👜',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Art',
    slug: 'art',
    icon: '🎨',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Grocery Items',
    slug: 'grocery-items',
    icon: '🛒',
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Electronics',
    slug: 'electronics',
    icon: '💻',
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Sports Equipment',
    slug: 'sports-equipment',
    icon: '⚽',
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Jewelry',
    slug: 'jewelry',
    icon: '💎',
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Furniture',
    slug: 'furniture',
    icon: '🛋️',
    created_at: new Date().toISOString(),
  },
];

export const mockItems: Item[] = [
  // Houses
  {
    id: 'house-1',
    category_id: '1',
    name: 'Modern Beach House',
    brand: 'Coastal Properties',
    price: 2850000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', // Modern house exterior
    ],
    metadata: {
      year: 2019,
      location: 'Malibu, CA',
      size: '4,200 sq ft',
      bedrooms: 4,
      bathrooms: 3,
    },
    ai_hints: [
      'This property offers stunning ocean views and is perfect for those who love the sound of waves',
      'Built by a renowned architect known for sustainable coastal designs',
      'Located in one of California\'s most exclusive beachfront communities',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'house-2',
    category_id: '1',
    name: 'Victorian Mansion',
    brand: 'Heritage Estates',
    price: 4250000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80', // Victorian house
    ],
    metadata: {
      year: 1895,
      location: 'San Francisco, CA',
      size: '6,800 sq ft',
      bedrooms: 6,
      bathrooms: 5,
    },
    ai_hints: [
      'This historical gem has been lovingly restored to its original grandeur',
      'Features original stained glass windows and hand-carved woodwork',
      'Once owned by a famous railroad baron',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'house-3',
    category_id: '1',
    name: 'Mountain Cabin Retreat',
    brand: 'Alpine Properties',
    price: 875000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80', // Mountain cabin
    ],
    metadata: {
      year: 2022,
      location: 'Aspen, CO',
      size: '2,400 sq ft',
      bedrooms: 3,
      bathrooms: 2,
    },
    ai_hints: [
      'Wake up to breathtaking mountain views and crisp alpine air',
      'Features a stone fireplace perfect for après-ski gatherings',
      'Located just minutes from world-class ski slopes',
    ],
    created_at: new Date().toISOString(),
  },
  // Cars
  {
    id: 'car-1',
    category_id: '2',
    name: '911 Turbo S',
    brand: 'Porsche',
    price: 207000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', // Porsche 911
    ],
    metadata: {
      year: 2024,
      model: '911 Turbo S',
      horsepower: 640,
      topSpeed: '205 mph',
      zeroToSixty: '2.6 seconds',
    },
    ai_hints: [
      'This German engineering marvel can go from 0 to 60 faster than you can say "autobahn"',
      'The price might make your wallet cry, but the performance will make your heart sing',
      'Often spotted at country clubs and race tracks alike',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'car-2',
    category_id: '2',
    name: 'Model S Plaid',
    brand: 'Tesla',
    price: 108990,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', // Tesla Model S
    ],
    metadata: {
      year: 2024,
      model: 'Model S Plaid',
      horsepower: 1020,
      topSpeed: '200 mph',
      zeroToSixty: '1.99 seconds',
      range: '396 miles',
    },
    ai_hints: [
      'The future of automotive technology wrapped in a sleek sedan',
      'Accelerates faster than gravity in a controlled environment',
      'Silent but deadly - your neighbors won\'t hear you coming',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'car-3',
    category_id: '2',
    name: 'Civic Type R',
    brand: 'Honda',
    price: 44995,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80', // Honda Civic Type R
    ],
    metadata: {
      year: 2024,
      model: 'Civic Type R',
      horsepower: 315,
      topSpeed: '169 mph',
      zeroToSixty: '5.0 seconds',
    },
    ai_hints: [
      'The hot hatch that grew up but didn\'t forget how to have fun',
      'Track-ready performance at a price that won\'t require a second mortgage',
      'Red badges and aggressive styling say "race me" in every language',
    ],
    created_at: new Date().toISOString(),
  },
  // Watches
  {
    id: 'watch-1',
    category_id: '3',
    name: 'Submariner Date',
    brand: 'Rolex',
    price: 12500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80', // Rolex watch
    ],
    metadata: {
      year: 2023,
      material: 'Stainless Steel',
      movement: 'Automatic',
      waterResistance: '300m',
      caseDiameter: '41mm',
    },
    ai_hints: [
      'A timepiece that\'s equally at home in boardrooms and ocean depths',
      'Swiss precision meets adventure-ready durability',
      'The crown logo says it all - this is watch royalty',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'watch-2',
    category_id: '3',
    name: 'Royal Oak',
    brand: 'Audemars Piguet',
    price: 32500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80', // AP Royal Oak
    ],
    metadata: {
      year: 2024,
      material: 'Stainless Steel',
      movement: 'Automatic',
      waterResistance: '50m',
      caseDiameter: '41mm',
    },
    ai_hints: [
      'The watch that revolutionized luxury sports watches in 1972',
      'Designed by the legendary Gérald Genta',
      'That octagonal bezel is more recognizable than most celebrity faces',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'watch-3',
    category_id: '3',
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    price: 799,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80', // Apple Watch
    ],
    metadata: {
      year: 2024,
      material: 'Titanium',
      waterResistance: '100m',
      battery: '36 hours',
      features: 'GPS, Cellular, Depth gauge',
    },
    ai_hints: [
      'The smartwatch that thinks it\'s a dive computer',
      'More sensors than a NASA spacecraft',
      'Tells time and your heart rate - multitasking at its finest',
    ],
    created_at: new Date().toISOString(),
  },
  // Designer Fashion
  {
    id: 'bag-1',
    category_id: '4',
    name: 'Classic Flap Bag Medium',
    brand: 'Chanel',
    price: 8800,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80', // Designer handbag
    ],
    metadata: {
      year: 2024,
      material: 'Lambskin',
      color: 'Black',
      hardware: 'Gold',
      size: 'Medium',
    },
    ai_hints: [
      'This iconic piece has been a symbol of luxury since Coco herself',
      'The quilted pattern is as recognizable as the double C logo',
      'An investment piece that appreciates faster than most stocks',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'bag-2',
    category_id: '4',
    name: 'Birkin 35',
    brand: 'Hermès',
    price: 25000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80', // Hermès Birkin
    ],
    metadata: {
      year: 2024,
      material: 'Togo Leather',
      color: 'Noir',
      hardware: 'Palladium',
      size: '35cm',
    },
    ai_hints: [
      'The handbag with a waiting list longer than medical school',
      'Named after Jane Birkin, who probably couldn\'t afford one today',
      'An investment that outperforms the S&P 500',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'shoes-1',
    category_id: '4',
    name: 'Red Bottom Heels',
    brand: 'Christian Louboutin',
    price: 795,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', // Red bottom heels
    ],
    metadata: {
      year: 2024,
      style: 'So Kate 120',
      color: 'Black',
      heelHeight: '120mm',
      material: 'Patent Leather',
    },
    ai_hints: [
      'The shoes that announce your arrival before you do',
      'Those red soles have their own Instagram following',
      'Warning: May cause sudden urges to strut',
    ],
    created_at: new Date().toISOString(),
  },
  // Art
  {
    id: 'art-1',
    category_id: '5',
    name: 'Untitled Abstract #42',
    brand: 'Contemporary Artist',
    price: 45000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80', // Abstract art
    ],
    metadata: {
      year: 2023,
      medium: 'Oil on Canvas',
      dimensions: '48" x 60"',
      artist: 'Emerging Talent',
      exhibition: 'Solo Show 2023',
    },
    ai_hints: [
      'This piece was featured in a major gallery\'s "Artists to Watch" exhibition',
      'The bold use of color reflects the artist\'s Caribbean heritage',
      'Critics have compared the technique to early Basquiat works',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'art-2',
    category_id: '5',
    name: 'Blue Period Sketch',
    brand: 'Estate Collection',
    price: 125000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80', // Classical art
    ],
    metadata: {
      year: 1902,
      medium: 'Charcoal on Paper',
      dimensions: '24" x 18"',
      artist: 'Anonymous',
      provenance: 'Private European Collection',
    },
    ai_hints: [
      'Discovered in a Parisian attic after 100 years',
      'The melancholic style suggests influence from a famous Spanish artist',
      'Authentication pending, but the gallery is "very confident"',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'art-3',
    category_id: '5',
    name: 'Digital Dreams #001',
    brand: 'NFT Collection',
    price: 8500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80', // Digital art
    ],
    metadata: {
      year: 2024,
      medium: 'Digital/NFT',
      edition: '1 of 100',
      blockchain: 'Ethereum',
      artist: 'CryptoArtist_42',
    },
    ai_hints: [
      'Part of the collection that "broke the internet" last month',
      'The artist remains anonymous but drives a very visible Lamborghini',
      'Includes exclusive access to virtual gallery events',
    ],
    created_at: new Date().toISOString(),
  },
  // Grocery Items
  {
    id: 'grocery-1',
    category_id: '6',
    name: 'Organic Avocado Toast Kit',
    brand: 'Whole Foods',
    price: 12.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80', // Avocado toast
    ],
    metadata: {
      servings: 2,
      organic: true,
      ingredients: 'Artisan bread, organic avocados, everything seasoning',
    },
    ai_hints: [
      'The millennial breakfast that supposedly prevents home ownership',
      'Priced at approximately 1/230,769th of a house',
      'Instagram-ready meal that\'s actually pretty delicious',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'grocery-2',
    category_id: '6',
    name: 'Wagyu Beef Steak',
    brand: 'Whole Foods',
    price: 149.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80', // Wagyu steak
    ],
    metadata: {
      weight: '16 oz',
      grade: 'A5',
      origin: 'Japan',
    },
    ai_hints: [
      'The Rolls-Royce of beef, with a price tag to match',
      'So marbled it looks like edible abstract art',
      'Each cow probably has its own personal masseuse',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'grocery-3',
    category_id: '6',
    name: 'Artisan Cheese Selection',
    brand: 'Trader Joe\'s',
    price: 24.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=80', // Cheese board
    ],
    metadata: {
      varieties: 5,
      weight: '1.5 lbs total',
      origin: 'Various European regions',
    },
    ai_hints: [
      'Cheese so fancy it requires its own pronunciation guide',
      'Pairs well with wine and pretentious conversations',
      'The crackers cost extra, naturally',
    ],
    created_at: new Date().toISOString(),
  },
  // Electronics
  {
    id: 'electronics-1',
    category_id: '7',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    price: 3999,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', // MacBook Pro
    ],
    metadata: {
      year: 2024,
      processor: 'M3 Max',
      ram: '64GB',
      storage: '2TB SSD',
      display: '16.2" Liquid Retina XDR',
    },
    ai_hints: [
      'More processing power than the computers that sent humans to the moon',
      'The laptop of choice for people who open 200 Chrome tabs',
      'Costs more than some used cars, but at least it\'s portable',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'electronics-2',
    category_id: '7',
    name: 'OLED TV 77"',
    brand: 'LG',
    price: 2499,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80', // OLED TV
    ],
    metadata: {
      year: 2024,
      size: '77 inches',
      resolution: '4K',
      technology: 'OLED evo',
      smartFeatures: 'webOS',
    },
    ai_hints: [
      'So thin it might disappear if you look at it sideways',
      'Blacks so deep they make space jealous',
      'Your electric bill will notice the new addition',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'electronics-3',
    category_id: '7',
    name: 'PlayStation 5 Pro',
    brand: 'Sony',
    price: 699,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80', // PlayStation 5
    ],
    metadata: {
      year: 2024,
      storage: '2TB SSD',
      performance: '8K capable',
      features: 'Ray tracing, 120fps',
    },
    ai_hints: [
      'The console that\'s harder to find than a parking spot in Manhattan',
      'Promises to make your games look better than real life',
      'Shaped like a futuristic sandwich, for some reason',
    ],
    created_at: new Date().toISOString(),
  },
  // Sports Equipment
  {
    id: 'sports-1',
    category_id: '8',
    name: 'Carbon Fiber Road Bike',
    brand: 'Specialized',
    price: 12000,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Road bike
    ],
    metadata: {
      year: 2024,
      model: 'S-Works Tarmac SL8',
      weight: '6.8 kg',
      material: 'Carbon Fiber',
      groupset: 'Shimano Dura-Ace Di2',
    },
    ai_hints: [
      'Weighs less than your grocery bag but costs more than your car',
      'The bike that makes middle-aged men in lycra feel fast',
      'Carbon fiber so advanced it\'s basically from the future',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sports-2',
    category_id: '8',
    name: 'Golf Driver',
    brand: 'Titleist',
    price: 649,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80', // Golf driver
    ],
    metadata: {
      year: 2024,
      model: 'TSR3',
      loft: '9.0°',
      shaft: 'Premium Graphite',
      headSize: '460cc',
    },
    ai_hints: [
      'Guaranteed to add 20 yards to your drive (results not guaranteed)',
      'The club that gets blamed for your slice',
      'More adjustable than your office chair',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sports-3',
    category_id: '8',
    name: 'Yoga Mat Premium',
    brand: 'Lululemon',
    price: 148,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', // Yoga mat
    ],
    metadata: {
      thickness: '5mm',
      material: 'Natural rubber',
      length: '71 inches',
      features: 'Antimicrobial, moisture-wicking',
    },
    ai_hints: [
      'The mat that costs more than a month of gym membership',
      'Namaste doesn\'t come cheap these days',
      'Alignment lines included, inner peace sold separately',
    ],
    created_at: new Date().toISOString(),
  },
  // Jewelry
  {
    id: 'jewelry-1',
    category_id: '9',
    name: 'Diamond Engagement Ring',
    brand: 'Tiffany & Co.',
    price: 18500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', // Diamond ring
    ],
    metadata: {
      carat: '2.0',
      cut: 'Excellent',
      clarity: 'VVS1',
      color: 'F',
      setting: 'Platinum',
    },
    ai_hints: [
      'The ring that launched a thousand \"yes\" responses',
      'Comes in a blue box that\'s almost as famous as the contents',
      'Two months\' salary? In this economy, try six',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'jewelry-2',
    category_id: '9',
    name: 'Pearl Necklace',
    brand: 'Mikimoto',
    price: 7500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80', // Pearl necklace
    ],
    metadata: {
      pearlSize: '8-8.5mm',
      pearlType: 'Akoya',
      length: '18 inches',
      clasp: '18k White Gold',
      luster: 'AAA',
    },
    ai_hints: [
      'Classic elegance that never goes out of style',
      'Each pearl spent years perfecting its glow',
      'The necklace that makes every outfit \"dressy\"',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'jewelry-3',
    category_id: '9',
    name: 'Gold Cuban Link Chain',
    brand: 'Custom Jeweler',
    price: 3200,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80', // Gold chain
    ],
    metadata: {
      weight: '85 grams',
      purity: '14k Gold',
      length: '24 inches',
      width: '10mm',
      clasp: 'Box lock',
    },
    ai_hints: [
      'The chain that says \"I\'ve made it\" without saying a word',
      'Heavy enough to double as a workout accessory',
      'Pairs well with confidence and designer sunglasses',
    ],
    created_at: new Date().toISOString(),
  },
  // Furniture
  {
    id: 'furniture-1',
    category_id: '10',
    name: 'Eames Lounge Chair',
    brand: 'Herman Miller',
    price: 6995,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80', // Eames chair
    ],
    metadata: {
      year: 2024,
      material: 'Walnut veneer, leather',
      designer: 'Charles & Ray Eames',
      warranty: '12 years',
    },
    ai_hints: [
      'The chair that\'s been in every design magazine since 1956',
      'More comfortable than it has any right to be',
      'A design icon that doubles as a very expensive nap spot',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'furniture-2',
    category_id: '10',
    name: 'Italian Leather Sofa',
    brand: 'Natuzzi',
    price: 4299,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', // Leather sofa
    ],
    metadata: {
      seats: 3,
      material: 'Top-grain Italian leather',
      color: 'Cognac',
      dimensions: '90"W x 38"D x 34"H',
    },
    ai_hints: [
      'Softer than a cloud and more expensive than your first car',
      'The leather smells so good you\'ll want to bottle it',
      'Requires its own insurance policy',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'furniture-3',
    category_id: '10',
    name: 'Standing Desk',
    brand: 'Uplift Desk',
    price: 899,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80', // Standing desk
    ],
    metadata: {
      surface: 'Bamboo 72"x30"',
      heightRange: '25.5" - 51.1"',
      memory: '4 positions',
      capacity: '355 lbs',
    },
    ai_hints: [
      'The desk that guilts you into better posture',
      'Converts between sitting and standing faster than your motivation',
      'Productivity not included but strongly implied',
    ],
    created_at: new Date().toISOString(),
  },
];

// Helper function to get items by category
export function getMockItemsByCategory(categoryId: string): Item[] {
  return mockItems.filter(item => item.category_id === categoryId);
}

// Helper function to get a random mock item
export function getRandomMockItem(categoryId?: string): Item | null {
  const items = categoryId 
    ? getMockItemsByCategory(categoryId)
    : mockItems;
  
  if (items.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}