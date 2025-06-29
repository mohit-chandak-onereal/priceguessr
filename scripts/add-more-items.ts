import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface NewItem {
  name: string;
  brand: string;
  price: number;
  category_id?: string;
  images: string[];
  basic_info: {
    description: string;
    specs?: string[];
  };
  hint_1: string;
  hint_2: string;
  hint_3: string;
  hint_4: string;
  hint_5: string;
}

const newItems: NewItem[] = [
  // Tech Gadgets
  {
    name: "Quest 3 VR Headset",
    brand: "Meta",
    price: 499,
    images: ["https://m.media-amazon.com/images/I/71y5DgKNVbL._AC_SL1500_.jpg"],
    basic_info: {
      description: "Latest generation virtual reality headset",
      specs: ["512GB storage", "4K+ resolution", "Mixed reality capable"]
    },
    hint_1: "This device transports you to virtual worlds and augmented reality experiences",
    hint_2: "Made by the company formerly known as Facebook, featuring advanced pancake lenses",
    hint_3: "Released in 2023 as the successor to a popular VR gaming platform",
    hint_4: "Offers both standalone and PC VR gaming with inside-out tracking",
    hint_5: "Popular for games like Beat Saber and can display your room in passthrough mode"
  },
  {
    name: "Steam Deck OLED",
    brand: "Valve",
    price: 549,
    images: ["https://m.media-amazon.com/images/I/71T7n8iIkWL._AC_SL1500_.jpg"],
    basic_info: {
      description: "Handheld gaming PC with OLED display",
      specs: ["512GB storage", "7.4 inch OLED", "AMD APU"]
    },
    hint_1: "A portable gaming device that runs PC games on the go",
    hint_2: "Created by the company behind Half-Life and the largest PC gaming platform",
    hint_3: "Features a vibrant OLED screen upgrade from the original LCD model",
    hint_4: "Runs on a custom Linux-based operating system called SteamOS",
    hint_5: "Competes with Nintendo Switch but plays your entire PC game library"
  },

  // Sports Equipment
  {
    name: "Hyperice Hypervolt 2",
    brand: "Hyperice",
    price: 229,
    images: ["https://m.media-amazon.com/images/I/61n2YuNMmPL._AC_SL1500_.jpg"],
    basic_info: {
      description: "Professional percussion massage device",
      specs: ["3 speeds", "5 attachments", "3-hour battery"]
    },
    hint_1: "Athletes use this device for muscle recovery and pain relief",
    hint_2: "It delivers rapid percussive therapy to sore muscles",
    hint_3: "Features QuietGlide technology for near-silent operation",
    hint_4: "Endorsed by professional athletes across NBA, NFL, and MLB",
    hint_5: "Comes with multiple head attachments for different muscle groups"
  },
  {
    name: "TRX HOME2 System",
    brand: "TRX",
    price: 149,
    images: ["https://m.media-amazon.com/images/I/71AxZpV5+2L._AC_SL1500_.jpg"],
    basic_info: {
      description: "Suspension training system",
      specs: ["Full body workout", "Portable", "Door anchor included"]
    },
    hint_1: "Navy SEALs originally developed this bodyweight training system",
    hint_2: "Uses suspension straps to leverage gravity and body weight",
    hint_3: "Can be anchored to doors, trees, or ceiling mounts",
    hint_4: "Popular in gyms and home fitness for functional training",
    hint_5: "The acronym stands for Total Resistance eXercise"
  },

  // Watches
  {
    name: "Garmin Fenix 7X Solar",
    brand: "Garmin",
    price: 899,
    images: ["https://m.media-amazon.com/images/I/71Y19rD7c1L._AC_SL1500_.jpg"],
    basic_info: {
      description: "Premium GPS multisport smartwatch",
      specs: ["Solar charging", "51mm case", "32GB storage"]
    },
    hint_1: "This rugged smartwatch is built for extreme outdoor adventures",
    hint_2: "Features solar charging that extends battery life up to 37 days",
    hint_3: "Includes topographic maps and advanced training metrics",
    hint_4: "Popular among ultramarathoners, mountaineers, and military personnel",
    hint_5: "The 'X' model is the largest in the series with a 51mm case"
  },
  {
    name: "Tissot PRX Powermatic 80",
    brand: "Tissot",
    price: 650,
    images: ["https://m.media-amazon.com/images/I/71Vh5O7hZdL._AC_SL1500_.jpg"],
    basic_info: {
      description: "Swiss automatic watch with integrated bracelet",
      specs: ["80-hour power reserve", "Sapphire crystal", "100m water resistant"]
    },
    hint_1: "A Swiss-made timepiece inspired by 1970s design",
    hint_2: "Features an integrated bracelet that flows seamlessly from the case",
    hint_3: "The Powermatic 80 movement offers exceptional power reserve",
    hint_4: "Part of Swatch Group's mid-tier luxury offerings",
    hint_5: "Often compared to the Audemars Piguet Royal Oak for its design language"
  },

  // Kitchen Items
  {
    name: "Ooni Koda 16",
    brand: "Ooni",
    price: 599,
    images: ["https://m.media-amazon.com/images/I/81m0tSO7IpL._AC_SL1500_.jpg"],
    basic_info: {
      description: "Gas-powered outdoor pizza oven",
      specs: ["950°F max temp", "16-inch pizzas", "28 lbs weight"]
    },
    hint_1: "This outdoor appliance reaches temperatures of authentic Neapolitan pizza ovens",
    hint_2: "Cooks restaurant-quality pizza in just 60 seconds",
    hint_3: "Powered by propane gas with instant ignition",
    hint_4: "The '16' refers to the maximum pizza size it can accommodate",
    hint_5: "Scottish company that revolutionized home pizza making"
  },
  {
    name: "Vitamix A3500 Ascent",
    brand: "Vitamix",
    price: 649,
    images: ["https://m.media-amazon.com/images/I/71Y8N7bVO3L._AC_SL1500_.jpg"],
    basic_info: {
      description: "Professional-grade smart blender",
      specs: ["2.2 HP motor", "5 programs", "Touchscreen controls"]
    },
    hint_1: "Professional chefs rely on this brand for the smoothest blends",
    hint_2: "Features wireless connectivity and self-detect containers",
    hint_3: "Can make hot soup from cold ingredients using blade friction",
    hint_4: "The Ascent series includes a 10-year warranty",
    hint_5: "Touchscreen interface with 5 pre-programmed settings"
  },

  // Fashion Items
  {
    name: "Common Projects Achilles Low",
    brand: "Common Projects",
    price: 425,
    images: ["https://cdn-images.farfetch-contents.com/12/95/63/52/12956352_13424978_1000.jpg"],
    basic_info: {
      description: "Minimalist leather sneakers",
      specs: ["Italian leather", "Gold foil serial number", "Margom sole"]
    },
    hint_1: "These minimalist sneakers epitomize luxury simplicity",
    hint_2: "Each pair features a gold-stamped serial number on the heel",
    hint_3: "Handmade in Italy using premium Nappa leather",
    hint_4: "A favorite among fashion editors and celebrities",
    hint_5: "Named after the Greek hero, known for clean aesthetic"
  },
  {
    name: "Arc'teryx Beta AR Jacket",
    brand: "Arc'teryx",
    price: 649,
    images: ["https://m.media-amazon.com/images/I/61TKEpJqpDL._AC_SL1200_.jpg"],
    basic_info: {
      description: "Professional alpine shell jacket",
      specs: ["GORE-TEX Pro", "Helmet compatible hood", "525g weight"]
    },
    hint_1: "This technical shell is named after a prehistoric bird",
    hint_2: "Uses the most durable GORE-TEX Pro fabric available",
    hint_3: "The 'AR' stands for All Round - their most versatile model",
    hint_4: "Designed and tested in the Coast Mountains of British Columbia",
    hint_5: "Features a helmet-compatible StormHood and harness-friendly pockets"
  },

  // Home & Living
  {
    name: "Sonos Arc Soundbar",
    brand: "Sonos",
    price: 899,
    images: ["https://m.media-amazon.com/images/I/71WJKPmUGWL._AC_SL1500_.jpg"],
    basic_info: {
      description: "Premium Dolby Atmos soundbar",
      specs: ["11 drivers", "Dolby Atmos", "Voice control"]
    },
    hint_1: "This curved soundbar delivers immersive Dolby Atmos audio",
    hint_2: "Features upward-firing speakers for 3D sound effects",
    hint_3: "Can be controlled via app, voice, or TV remote",
    hint_4: "Part of a wireless multi-room audio ecosystem",
    hint_5: "The curved design matches modern TV aesthetics"
  },
  {
    name: "Herman Miller Embody Chair",
    brand: "Herman Miller",
    price: 1795,
    images: ["https://m.media-amazon.com/images/I/71GY8J3bKNL._AC_SL1500_.jpg"],
    basic_info: {
      description: "Ergonomic office chair designed with physicians",
      specs: ["Pixelated support", "Narrow backrest", "12-year warranty"]
    },
    hint_1: "Designed in collaboration with physicians and biomechanics experts",
    hint_2: "Features a pixelated support system that automatically adjusts to micro-movements",
    hint_3: "The narrow backrest allows for full arm and shoulder movement",
    hint_4: "Popular among software developers and gamers for long sitting sessions",
    hint_5: "Competes with the Aeron as the company's flagship ergonomic chair"
  }
];

async function addMoreItems() {
  console.log('Adding more items to database...');
  
  // Get categories first
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name');
    
  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }
  
  console.log('Categories found:', categories.map(c => `${c.name} (${c.id})`));
  
  const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
  
  // Assign categories to items
  const itemsWithCategories = newItems.map(item => {
    let categoryId: string | undefined;
    
    if (item.name.includes('VR') || item.name.includes('Deck')) {
      categoryId = categoryMap.get('electronics');
    } else if (item.name.includes('Hypervolt') || item.name.includes('TRX')) {
      categoryId = categoryMap.get('sports equipment');
    } else if (item.name.includes('Garmin') || item.name.includes('Tissot')) {
      categoryId = categoryMap.get('watches');
    } else if (item.name.includes('Ooni') || item.name.includes('Vitamix')) {
      categoryId = categoryMap.get('grocery items'); // Kitchen items go here
    } else if (item.name.includes('Projects') || item.name.includes('Arc\'teryx')) {
      categoryId = categoryMap.get('designer fashion');
    } else if (item.name.includes('Sonos') || item.name.includes('Herman Miller')) {
      categoryId = categoryMap.get('furniture');
    } else {
      categoryId = categoryMap.get('electronics'); // Default fallback
    }
    
    if (!categoryId) {
      console.error(`No category found for item: ${item.name}`);
      return null;
    }
    
    return { ...item, category_id: categoryId };
  }).filter(item => item !== null);
  
  // Insert items
  const { data, error } = await supabase
    .from('items')
    .insert(itemsWithCategories)
    .select();
    
  if (error) {
    console.error('Error inserting items:', error);
  } else {
    console.log(`Successfully added ${data.length} items!`);
    data.forEach(item => {
      console.log(`- ${item.name} (${item.brand}) - $${item.price}`);
    });
  }
}

addMoreItems().catch(console.error);