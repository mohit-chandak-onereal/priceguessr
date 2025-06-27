const fs = require('fs');

// Read the file
let content = fs.readFileSync('./lib/real-data.ts', 'utf8');

// Define actual images for each item
const itemImages = {
  // Cars
  'car-tesla-model-s': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop', // Tesla Model S
  'car-bmw-m3': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop', // BMW M3
  'car-porsche-911': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop', // Porsche 911
  'car-ferrari-488': 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&h=400&fit=crop', // Ferrari
  'car-lamborghini-huracan': 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&h=400&fit=crop', // Lamborghini
  'car-audi-r8': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop', // Audi R8
  'car-mercedes-amg-gt': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop', // Mercedes AMG
  'car-mclaren-720s': 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=400&fit=crop', // McLaren
  'car-bentley-continental': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop', // Bentley
  'car-rolls-royce-ghost': 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&h=400&fit=crop', // Rolls Royce

  // Houses
  'house-beverly-hills': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop', // Modern mansion
  'house-malibu-beach': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop', // Beach house
  'house-manhattan-penthouse': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop', // Luxury penthouse
  'house-aspen-chalet': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop', // Mountain chalet
  'house-miami-villa': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop', // Miami villa
  'house-hamptons-estate': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop', // Hamptons mansion
  'house-napa-vineyard': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', // Vineyard estate
  'house-lake-tahoe': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&h=400&fit=crop', // Lake house
  'house-scottsdale-adobe': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop', // Desert home
  'house-charleston-historic': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600&h=400&fit=crop', // Historic mansion

  // Watches
  'watch-rolex-submariner': 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=400&fit=crop', // Rolex
  'watch-patek-philippe': 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600&h=400&fit=crop', // Luxury watch
  'watch-audemars-piguet': 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=400&fit=crop', // AP watch
  'watch-richard-mille': 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=400&fit=crop', // Luxury sports watch
  'watch-omega-speedmaster': 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&h=400&fit=crop', // Omega
  'watch-cartier-santos': 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=400&fit=crop', // Cartier
  'watch-iwc-portugieser': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&h=400&fit=crop', // IWC
  'watch-jaeger-lecoultre': 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=400&fit=crop', // JLC
  'watch-vacheron-constantin': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=400&fit=crop', // Vacheron
  'watch-hublot-big-bang': 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&h=400&fit=crop', // Hublot

  // Designer Fashion
  'fashion-hermes-birkin': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop', // Hermes bag
  'fashion-chanel-flap': 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=400&fit=crop', // Chanel bag
  'fashion-louis-vuitton': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop', // LV bag
  'fashion-gucci-dionysus': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=400&fit=crop', // Designer handbag
  'fashion-prada-galleria': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=400&fit=crop', // Prada bag
  'fashion-dior-saddle': 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=400&fit=crop', // Dior bag
  'fashion-balenciaga-city': 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&h=400&fit=crop', // Designer bag
  'fashion-saint-laurent': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop', // YSL bag
  'fashion-bottega-veneta': 'https://images.unsplash.com/photo-1569388330688-afb5e97b8e38?w=600&h=400&fit=crop', // BV bag
  'fashion-celine-luggage': 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=400&fit=crop', // Celine bag

  // Art
  'art-basquiat-untitled': 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=400&fit=crop', // Abstract art
  'art-hockney-pool': 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=400&fit=crop', // Modern art
  'art-kusama-pumpkin': 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=400&fit=crop', // Contemporary art
  'art-banksy-girl-balloon': 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&h=400&fit=crop', // Street art
  'art-warhol-marilyn': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop', // Pop art
  'art-monet-water-lilies': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', // Impressionist
  'art-van-gogh-sunflowers': 'https://images.unsplash.com/photo-1562619398-71836960dca6?w=600&h=400&fit=crop', // Classic painting
  'art-picasso-guernica': 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=600&h=400&fit=crop', // Cubist art
  'art-rothko-orange-red': 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&h=400&fit=crop', // Abstract expressionism
  'art-hirst-shark': 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=600&h=400&fit=crop', // Contemporary installation

  // Grocery Items
  'grocery-wagyu-beef': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop', // Wagyu steak
  'grocery-alba-truffle': 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=600&h=400&fit=crop', // Truffles
  'grocery-beluga-caviar': 'https://images.unsplash.com/photo-1567167851332-f02e76c0998d?w=600&h=400&fit=crop', // Caviar
  'grocery-yubari-melon': 'https://images.unsplash.com/photo-1587486936739-78d7d2414f93?w=600&h=400&fit=crop', // Luxury melon
  'grocery-saffron': 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=400&fit=crop', // Saffron spice
  'grocery-matsutake': 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600&h=400&fit=crop', // Mushrooms
  'grocery-kopi-luwak': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop', // Coffee beans
  'grocery-densuke-watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784486?w=600&h=400&fit=crop', // Watermelon
  'grocery-bluefin-tuna': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop', // Tuna sashimi
  'grocery-iberico-ham': 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=400&fit=crop', // Spanish ham

  // Electronics
  'electronics-macbook-pro': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop', // MacBook Pro
  'electronics-iphone-pro': 'https://images.unsplash.com/photo-1632633173522-47456de71b76?w=600&h=400&fit=crop', // iPhone
  'electronics-sony-a1': 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=600&h=400&fit=crop', // Professional camera
  'electronics-lg-oled': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=400&fit=crop', // OLED TV
  'electronics-bose-700': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop', // Headphones
  'electronics-dyson-v15': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', // Dyson vacuum
  'electronics-sony-ps5': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop', // PS5
  'electronics-apple-watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=400&fit=crop', // Apple Watch
  'electronics-dji-mavic': 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&h=400&fit=crop', // Drone
  'electronics-samsung-fold': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop', // Folding phone

  // Sports Equipment
  'sports-titleist-driver': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop', // Golf driver
  'sports-peloton-bike': 'https://images.unsplash.com/photo-1520877435060-66d10b1adecb?w=600&h=400&fit=crop', // Exercise bike
  'sports-yeti-cooler': 'https://images.unsplash.com/photo-1565647952915-9644fcd446a9?w=600&h=400&fit=crop', // Premium cooler
  'sports-burton-snowboard': 'https://images.unsplash.com/photo-1478700485868-972b69dc3fc4?w=600&h=400&fit=crop', // Snowboard
  'sports-wilson-racquet': 'https://images.unsplash.com/photo-1622279457486-62dbd3a9ad31?w=600&h=400&fit=crop', // Tennis racquet
  'sports-bowflex-home-gym': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop', // Home gym
  'sports-garmin-fenix': 'https://images.unsplash.com/photo-1523475496153-3d6cc0f0bf19?w=600&h=400&fit=crop', // Sports watch
  'sports-specialized-bike': 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&h=400&fit=crop', // Road bike
  'sports-nordictrack-treadmill': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&h=400&fit=crop', // Treadmill
  'sports-callaway-golf-set': 'https://images.unsplash.com/photo-1592919505780-303950717480?w=600&h=400&fit=crop', // Golf clubs

  // Jewelry
  'jewelry-tiffany-ring': 'https://images.unsplash.com/photo-1515555585025-54136276b6e2?w=600&h=400&fit=crop', // Diamond ring
  'jewelry-cartier-necklace': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop', // Diamond necklace
  'jewelry-harry-winston': 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=400&fit=crop', // Luxury earrings
  'jewelry-graff-bracelet': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=400&fit=crop', // Diamond bracelet
  'jewelry-van-cleef': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop', // Luxury jewelry
  'jewelry-chopard-watch': 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&h=400&fit=crop', // Jewelry watch
  'jewelry-bulgari-serpenti': 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&h=400&fit=crop', // Serpenti jewelry
  'jewelry-piaget-rose': 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&h=400&fit=crop', // Rose gold jewelry
  'jewelry-boucheron-ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=400&fit=crop', // Luxury ring
  'jewelry-mikimoto-pearls': 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=400&fit=crop', // Pearl necklace

  // Furniture
  'furniture-eames-lounge': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=400&fit=crop', // Eames chair
  'furniture-herman-miller': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop', // Modern sofa
  'furniture-b&b-italia': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop', // Italian furniture
  'furniture-fendi-casa': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop', // Luxury living room
  'furniture-restoration-hardware': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', // Classic furniture
  'furniture-minotti-sofa': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&h=400&fit=crop', // Modern sectional
  'furniture-poliform-kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', // Luxury kitchen
  'furniture-cassina-dining': 'https://images.unsplash.com/photo-1549497538-303791108f95?w=600&h=400&fit=crop', // Dining table
  'furniture-knoll-office': 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=600&h=400&fit=crop', // Office desk
  'furniture-roche-bobois': 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=600&h=400&fit=crop', // Luxury bedroom
};

// Replace all image URLs
Object.entries(itemImages).forEach(([itemId, imageUrl]) => {
  const regex = new RegExp(`(id: '${itemId}',[\\s\\S]*?images: \\[')[^']+('\\])`, 'g');
  content = content.replace(regex, `$1${imageUrl}$2`);
});

// Write the updated content back
fs.writeFileSync('./lib/real-data.ts', content);

console.log('Updated all items with actual images!');