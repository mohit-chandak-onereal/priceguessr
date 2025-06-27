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
      '/images/house-1-blur.jpg',
      '/images/house-1-interior.jpg',
      '/images/house-1-full.jpg',
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
  // Cars
  {
    id: 'car-1',
    category_id: '2',
    name: '911 Turbo S',
    brand: 'Porsche',
    price: 207000,
    currency: 'USD',
    images: [
      '/images/car-1-blur.jpg',
      '/images/car-1-interior.jpg',
      '/images/car-1-engine.jpg',
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
  // Watches
  {
    id: 'watch-1',
    category_id: '3',
    name: 'Submariner Date',
    brand: 'Rolex',
    price: 12500,
    currency: 'USD',
    images: [
      '/images/watch-1-blur.jpg',
      '/images/watch-1-back.jpg',
      '/images/watch-1-detail.jpg',
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
  // Designer Fashion
  {
    id: 'bag-1',
    category_id: '4',
    name: 'Classic Flap Bag Medium',
    brand: 'Chanel',
    price: 8800,
    currency: 'USD',
    images: [
      '/images/bag-1-blur.jpg',
      '/images/bag-1-detail.jpg',
      '/images/bag-1-full.jpg',
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
  // Art
  {
    id: 'art-1',
    category_id: '5',
    name: 'Untitled Abstract #42',
    brand: 'Contemporary Artist',
    price: 45000,
    currency: 'USD',
    images: [
      '/images/art-1-blur.jpg',
      '/images/art-1-detail.jpg',
      '/images/art-1-full.jpg',
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
  // Grocery Items
  {
    id: 'grocery-1',
    category_id: '6',
    name: 'Organic Avocado Toast Kit',
    brand: 'Whole Foods',
    price: 12.99,
    currency: 'USD',
    images: [
      '/images/grocery-1-blur.jpg',
      '/images/grocery-1-ingredients.jpg',
      '/images/grocery-1-full.jpg',
    ],
    metadata: {
      servings: 2,
      organic: 'true',
      ingredients: 'Artisan bread, organic avocados, everything seasoning',
    },
    ai_hints: [
      'The millennial breakfast that supposedly prevents home ownership',
      'Priced at approximately 1/230,769th of a house',
      'Instagram-ready meal that\'s actually pretty delicious',
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