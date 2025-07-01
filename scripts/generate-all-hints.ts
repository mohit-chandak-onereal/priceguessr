import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Comprehensive hints for all items organized by category
const itemHints: { [key: string]: any } = {
  // CARS
  "911 Carrera": {
    basic_info: {
      description: "Iconic German sports car known for its distinctive rear-engine design and timeless silhouette",
      brand_description: "Stuttgart-based manufacturer synonymous with performance and racing heritage"
    },
    hint_1: "This vehicle has been in continuous production since 1963, making it one of the longest-running sports car nameplates",
    hint_2: "Famous for its unique engineering choice of placing the engine behind the rear axle, creating distinctive handling characteristics",
    hint_3: "The number in its name originally referred to the project number assigned during development, not engine displacement",
    hint_4: "Base models start with twin-turbo flat-six engines producing around 379 horsepower, while higher trims exceed 640hp",
    hint_5: "The 2024 base model starts around $106,000, positioning it as an aspirational yet attainable supercar"
  },
  "Corvette C8": {
    basic_info: {
      description: "Revolutionary American sports car that switched to mid-engine layout after seven generations",
      brand_description: "Detroit's bowtie brand known for trucks, muscle cars, and everyday vehicles"
    },
    hint_1: "This model represents the biggest change in the nameplate's 70-year history, moving the engine from front to middle",
    hint_2: "Despite exotic car performance with 0-60 in under 3 seconds, it maintains surprising daily drivability and storage space",
    hint_3: "The naturally aspirated 6.2L V8 produces 495 horsepower, competing with European exotics at a fraction of the price",
    hint_4: "Revolutionary for offering supercar performance and looks while maintaining American muscle car character and sound",
    hint_5: "Starting price around $65,000 makes it one of the best performance bargains in the automotive world"
  },
  "LC 500": {
    basic_info: {
      description: "Stunning luxury grand tourer that showcases Japanese craftsmanship and attention to detail",
      brand_description: "Toyota's luxury division known for reliability, comfort, and exceptional build quality"
    },
    hint_1: "This flagship coupe took nearly a decade to develop, with designers obsessing over every line and surface",
    hint_2: "Features one of the last naturally aspirated V8 engines in the luxury segment, a 5.0L producing 471 horsepower",
    hint_3: "The interior showcases traditional Japanese craftsmanship including hand-pleated door panels and Alcantara headliner",
    hint_4: "Despite weighing over 4,200 pounds, it delivers engaging driving dynamics rare in the luxury GT segment",
    hint_5: "Base price starts around $93,000, competing with German rivals while offering unique Japanese luxury philosophy"
  },
  "M3": {
    basic_info: {
      description: "High-performance version of the 3 Series, representing the pinnacle of sport sedan engineering",
      brand_description: "Bavarian manufacturer known for 'Ultimate Driving Machine' philosophy and kidney grilles"
    },
    hint_1: "First introduced in 1986 with a high-revving four-cylinder, it has evolved through inline-6 and V8 configurations",
    hint_2: "The current generation features a twin-turbo inline-6 producing up to 503 horsepower in Competition trim",
    hint_3: "Available with manual transmission, a rarity in modern performance cars, appealing to driving purists",
    hint_4: "Can accelerate from 0-60 mph in just 3.8 seconds while still functioning as a practical daily driver",
    hint_5: "Starting price around $73,000, with Competition models exceeding $80,000 before options"
  },
  "Model S": {
    basic_info: {
      description: "Revolutionary electric sedan that redefined automotive performance and technology expectations",
      brand_description: "American EV manufacturer that disrupted the entire automotive industry"
    },
    hint_1: "When launched in 2012, it proved electric cars could be desirable, fast, and practical with up to 265 miles of range",
    hint_2: "The Plaid variant produces 1,020 horsepower from three motors, achieving 0-60 mph in under 2 seconds",
    hint_3: "Features the controversial yoke steering wheel and a minimalist interior dominated by a large touchscreen",
    hint_4: "Pioneered over-the-air updates that add features and improve performance after purchase, like a smartphone",
    hint_5: "Long Range model starts around $88,000, while the Plaid performance variant approaches $108,000"
  },
  "Mustang GT": {
    basic_info: {
      description: "Iconic American muscle car that defined a segment and inspired countless competitors",
      brand_description: "Dearborn-based manufacturer known for trucks, muscle cars, and pioneering mass production"
    },
    hint_1: "Introduced at the 1964 World's Fair, it created the 'pony car' segment and sold over 1 million units in 18 months",
    hint_2: "The GT variant features the legendary 5.0L 'Coyote' V8 engine producing 450 horsepower with that classic V8 rumble",
    hint_3: "Unlike many sports cars, it offers both coupe and convertible body styles with genuine rear seats",
    hint_4: "The current generation finally offered independent rear suspension, greatly improving handling dynamics",
    hint_5: "GT models start around $42,000, making V8 performance accessible to enthusiasts on a budget"
  },
  "Range Rover Sport": {
    basic_info: {
      description: "Luxury SUV that combines British refinement with genuine off-road capability",
      brand_description: "British manufacturer specializing in luxury four-wheel-drive vehicles since 1948"
    },
    hint_1: "Despite the 'Sport' name, it maintains serious off-road credentials with advanced terrain response systems",
    hint_2: "Offers everything from efficient plug-in hybrids to a 523-horsepower supercharged V8 in the SVR variant",
    hint_3: "The interior features premium materials including Windsor leather and real wood veneers throughout",
    hint_4: "Can wade through water up to 35.4 inches deep, more than most owners will ever need but reassuring nonetheless",
    hint_5: "Base models start around $84,000, with fully loaded variants easily exceeding $150,000"
  },
  "RS6 Avant": {
    basic_info: {
      description: "Ultra-high-performance wagon that combines supercar speed with family practicality",
      brand_description: "Ingolstadt-based manufacturer known for Quattro all-wheel-drive and subtle luxury"
    },
    hint_1: "This wagon can embarrass sports cars with its twin-turbo V8 producing 591 horsepower and 0-60 in 3.5 seconds",
    hint_2: "First time this model has been officially sold in America, after years of enthusiasts begging for fast wagons",
    hint_3: "Despite performance credentials, it offers 30 cubic feet of cargo space and comfortable seating for five",
    hint_4: "The subtle styling hides its capabilities - it can reach 190 mph but looks like a sensible family hauler",
    hint_5: "Starting price around $118,000 reflects its position as a niche enthusiast vehicle with no real competition"
  },
  "S-Class": {
    basic_info: {
      description: "Flagship luxury sedan that traditionally debuts new technologies for the entire industry",
      brand_description: "Stuttgart's three-pointed star, synonymous with luxury and engineering excellence"
    },
    hint_1: "Known as 'Sonderklasse' (special class) in German, it has defined luxury motoring for over 50 years",
    hint_2: "The latest generation features rear-axle steering, making this large sedan surprisingly maneuverable in tight spaces",
    hint_3: "The MBUX infotainment system includes augmented reality navigation that overlays directions on live camera feed",
    hint_4: "Available with everything from efficient inline-6 engines to a V12 in Maybach variants exceeding 600 horsepower",
    hint_5: "Base S450 starts around $115,000, while the ultra-luxury Maybach versions can exceed $230,000"
  },
  "Supra": {
    basic_info: {
      description: "Legendary Japanese sports car revived through collaboration with a German manufacturer",
      brand_description: "World's largest automaker known for reliability and hybrid technology leadership"
    },
    hint_1: "After a 17-year hiatus, it returned in 2019 sharing its platform and engine with the BMW Z4 roadster",
    hint_2: "The collaboration was controversial among purists, but resulted in excellent driving dynamics and BMW reliability",
    hint_3: "The 3.0L turbocharged inline-6 produces 382 horsepower, channeled through the rear wheels only",
    hint_4: "Its predecessor, the MK4, became a tuning icon partly due to its appearance in The Fast and the Furious",
    hint_5: "The 3.0 model starts around $44,000, making it one of the more affordable genuine sports cars available"
  },

  // WATCHES
  "Carrera": {
    basic_info: {
      description: "Iconic racing chronograph named after the dangerous Carrera Panamericana race",
      brand_description: "Swiss manufacturer with deep motorsport connections, famous for precise timing instruments"
    },
    hint_1: "Created in 1963 specifically for racing drivers, featuring high-contrast dials for quick time reading at speed",
    hint_2: "The name comes from the Carrera Panamericana, considered one of the most dangerous races in the world",
    hint_3: "Modern versions feature the in-house Calibre Heuer 02 movement with 80-hour power reserve",
    hint_4: "The distinctive case design has remained largely unchanged for 60 years, a testament to timeless design",
    hint_5: "Steel models on bracelet typically retail around $5,500, making it accessible Swiss luxury"
  },
  "Nautilus 5711": {
    basic_info: {
      description: "The most coveted luxury sports watch, designed by Gerald Genta with distinctive porthole design",
      brand_description: "Geneva manufacture representing the pinnacle of Swiss watchmaking since 1839"
    },
    hint_1: "Introduced in 1976 to compete with Audemars Piguet's Royal Oak, it defined luxury steel sports watches",
    hint_2: "Production ended in 2021, causing already inflated secondary market prices to skyrocket even further",
    hint_3: "The integrated bracelet design means the case and bracelet flow seamlessly together as one unit",
    hint_4: "Despite being 'just' stainless steel, the finishing quality exceeds many gold watches from other brands",
    hint_5: "Original retail was around $35,000, but market prices often exceeded $100,000 before discontinuation"
  },
  "Navitimer": {
    basic_info: {
      description: "The ultimate pilot's tool watch featuring a slide rule bezel for flight calculations",
      brand_description: "Swiss manufacturer specializing in aviation timepieces and chronographs since 1884"
    },
    hint_1: "Introduced in 1952, it became the official watch of the Aircraft Owners and Pilots Association",
    hint_2: "The circular slide rule bezel can calculate fuel consumption, climb rates, and distance conversions",
    hint_3: "Modern versions are COSC-certified chronometers, guaranteeing accuracy within -4/+6 seconds per day",
    hint_4: "The busy dial with multiple subdials and scales is polarizing - loved by pilots, overwhelming to others",
    hint_5: "Current models in steel start around $8,000, with precious metal versions exceeding $20,000"
  },
  "Portugieser": {
    basic_info: {
      description: "Elegant dress watch with large case inspired by marine chronometer precision",
      brand_description: "Schaffhausen manufacture known for engineering excellence and pilot's watches"
    },
    hint_1: "Created in 1939 when Portuguese merchants requested a wristwatch with pocket watch precision",
    hint_2: "The large case size (traditionally 41-42mm) was ahead of its time, now perfectly suited to modern tastes",
    hint_3: "The clean, minimalist dial design emphasizes legibility and classic proportions over complications",
    hint_4: "Higher-end models feature perpetual calendars that account for leap years through the year 2499",
    hint_5: "Entry-level automatic models start around $4,500, with complicated versions exceeding $30,000"
  },
  "Prospex Diver": {
    basic_info: {
      description: "Professional dive watch offering serious underwater capability at accessible prices",
      brand_description: "Japanese manufacturer known for innovations including the quartz watch and spring drive"
    },
    hint_1: "The company supplied dive watches to the Japanese Antarctic Research Expedition, proving extreme durability",
    hint_2: "Many models feature the unique 'turtle' case shape, beloved by collectors for its wrist presence",
    hint_3: "Uses hardlex or sapphire crystals and offers genuine 200m water resistance with screw-down crowns",
    hint_4: "The automatic movements are manufactured in-house, unusual at this price point",
    hint_5: "Most models range from $400-$600, offering professional specifications at affordable prices"
  },
  "Reverso": {
    basic_info: {
      description: "Art Deco masterpiece with reversible case originally designed for polo players",
      brand_description: "Le Sentier manufacture known for ultra-complications and elegant dress watches"
    },
    hint_1: "Created in 1931 to protect watch crystals during polo matches by flipping the case to show solid metal",
    hint_2: "The rectangular case with distinctive grooves has become an Art Deco design icon beyond watches",
    hint_3: "Modern versions use the reverse side for second time zones, moon phases, or personalized engravings",
    hint_4: "Despite the sporting origin, it's now primarily a dress watch favored by those who appreciate design history",
    hint_5: "Steel models start around $7,000, with complicated or precious metal versions exceeding $50,000"
  },
  "Royal Oak": {
    basic_info: {
      description: "Revolutionary luxury sports watch that created an entire category with its octagonal bezel",
      brand_description: "Le Brassus manufacture, one of the 'Holy Trinity' of Swiss watchmaking"
    },
    hint_1: "Designed by Gerald Genta in one night in 1972, inspired by traditional diving helmet design",
    hint_2: "First luxury watch in stainless steel, priced higher than many gold watches, shocking the industry",
    hint_3: "The integrated bracelet and case require hundreds of hand-finishing operations despite being steel",
    hint_4: "The visible screws on the bezel are actually decorative - the case is secured from behind",
    hint_5: "Current steel models retail around $33,000, if you can find one at authorized dealers"
  },
  "Speedmaster Professional": {
    basic_info: {
      description: "The 'Moonwatch' - the only watch certified by NASA for spacewalks",
      brand_description: "Biel/Bienne manufacturer famous for precision timing and space exploration"
    },
    hint_1: "Worn on all six moon landings, it famously helped time the critical engine burn that saved Apollo 13",
    hint_2: "Still uses a manual-wind movement very similar to the one that went to the moon in 1969",
    hint_3: "NASA tested numerous watches to destruction - only this model survived the extreme temperature and pressure tests",
    hint_4: "The hesalite (plastic) crystal version is more authentic to the original, though sapphire is available",
    hint_5: "Current 'Moonwatch' models retail around $6,300, remarkable for a piece of space history"
  },
  "Submariner": {
    basic_info: {
      description: "The archetypal luxury dive watch that defined the category and became a status symbol",
      brand_description: "Geneva's crown logo represents the most recognized luxury watch brand globally"
    },
    hint_1: "Introduced in 1953 as a tool for divers, it gradually became more luxury item than diving instrument",
    hint_2: "The design has evolved slowly - a 1960s model is instantly recognizable next to current versions",
    hint_3: "Features like the unidirectional bezel and Mercedes hands have been copied by countless other brands",
    hint_4: "Despite luxury status, it's genuinely capable of 300m water resistance with helium escape valve on some models",
    hint_5: "Retail prices around $9,000 for steel, but waiting lists mean most sell above retail on secondary market"
  },
  "Tangente": {
    basic_info: {
      description: "Minimalist Bauhaus-inspired timepiece representing German watchmaking excellence",
      brand_description: "Glashütte manufacturer known for exceptional value and clean design aesthetics"
    },
    hint_1: "Founded in 1990 after German reunification, reviving the Glashütte watchmaking tradition",
    hint_2: "The design philosophy follows Bauhaus principles - form follows function with no unnecessary elements",
    hint_3: "Despite the simple appearance, movements are beautifully decorated and visible through display casebacks",
    hint_4: "Uses in-house manual and automatic movements, unusual for watches at this price point",
    hint_5: "Most models range from $1,500-$3,000, offering German precision at accessible prices"
  },

  // DESIGNER FASHION
  "Baguette": {
    basic_info: {
      description: "Iconic shoulder bag that defined late 90s luxury and was revived as vintage became fashionable",
      brand_description: "Roman fashion house known for fur, leather goods, and the 'FF' logo"
    },
    hint_1: "Launched in 1997, it became a cultural phenomenon after being featured prominently on Sex and the City",
    hint_2: "Named 'baguette' because it's designed to be carried under the arm like French bread",
    hint_3: "Over 1,000 versions have been created using materials from denim to crocodile skin and crystals",
    hint_4: "The signature FF clasp has become instantly recognizable, often imitated but never duplicated",
    hint_5: "Standard leather versions start around $3,500, with exotic skins and embellished versions exceeding $30,000"
  },
  "Birkin": {
    basic_info: {
      description: "The ultimate luxury handbag, handcrafted by a single artisan and symbolizing exclusive wealth",
      brand_description: "Parisian house established in 1837, synonymous with equestrian heritage and craftsmanship"
    },
    hint_1: "Created in 1984 after the CEO met actress Jane Birkin on a flight and she complained about finding a good bag",
    hint_2: "Each bag takes 18-25 hours to create by a single craftsperson using traditional saddle-stitching techniques",
    hint_3: "The waiting list system has been replaced by 'building a relationship' with sales associates over years",
    hint_4: "Certain colors and leathers appreciate in value, with rare pieces selling for more than real estate",
    hint_5: "Retail starts around $10,000 for basic leather, but rare versions have sold for over $500,000 at auction"
  },
  "City Bag": {
    basic_info: {
      description: "Edgy motorcycle-inspired bag with distinctive studs and zippers that defined 2000s cool",
      brand_description: "Spanish luxury house known for architectural designs and controversial campaigns"
    },
    hint_1: "Introduced in 2001, it became the first 'It bag' of the new millennium, carried by every celebrity",
    hint_2: "The design was inspired by motorcycle jackets, featuring aged leather and giant zipper pulls",
    hint_3: "Despite its tough appearance, the leather is incredibly soft and lightweight lambskin",
    hint_4: "Counterfeiters struggle to replicate the specific distressing and hardware weight of authentic pieces",
    hint_5: "Medium sizes typically retail around $2,300, with limited editions and exotic skins much higher"
  },
  "Classic Flap": {
    basic_info: {
      description: "Timeless quilted bag with chain strap that revolutionized how women carried handbags",
      brand_description: "French house founded by Coco, famous for tweed suits, No. 5, and interlocked C's"
    },
    hint_1: "The original 2.55 was created in February 1955 (hence the name) to free women's hands",
    hint_2: "The quilted pattern was inspired by jockeys' jackets, the chain by soldiers' bags",
    hint_3: "Each bag requires over 180 operations to create, with the quilting perfectly aligned at every seam",
    hint_4: "Prices have increased dramatically - bags that cost $2,000 in 2005 now retail for over $10,000",
    hint_5: "Medium Classic Flaps in caviar leather currently retail around $10,200, increasing yearly"
  },
  "Galleria Tote": {
    basic_info: {
      description: "Structured saffiano leather tote representing understated luxury and practicality",
      brand_description: "Milanese house known for minimalist designs and pioneering use of nylon in luxury"
    },
    hint_1: "Named after the Galleria Vittorio Emanuele II, Milan's historic luxury shopping arcade",
    hint_2: "The saffiano leather is cross-hatched and coated, making it extremely durable and scratch-resistant",
    hint_3: "The triangular logo plaque is the only branding, appealing to those who prefer subtle luxury",
    hint_4: "Popular with professionals for its structured shape that maintains form even when heavily loaded",
    hint_5: "Medium sizes typically retail around $3,500, with exotic leather versions exceeding $10,000"
  },
  "GG Marmont Matelassé Shoulder Bag": {
    basic_info: {
      description: "Modern interpretation of archival designs featuring prominent interlocking G hardware",
      brand_description: "Florentine house known for horsebit loafers, bamboo handles, and double-G logo"
    },
    hint_1: "The matelassé technique creates a puffy, cushioned effect inspired by vintage automobile interiors",
    hint_2: "Despite looking new, the GG hardware dates back to the 1970s, revived by Alessandro Michele",
    hint_3: "The chevron pattern creates a visual illusion that makes the bag appear larger than it actually is",
    hint_4: "Available in numerous sizes and colors, making it one of the house's most versatile designs",
    hint_5: "Small shoulder bags start around $1,900, with larger sizes and exotic materials reaching $4,000+"
  },
  "Lady Dior": {
    basic_info: {
      description: "Architectural handbag with cannage stitching that became Princess Diana's signature accessory",
      brand_description: "Parisian couture house known for New Look silhouettes and exceptional craftsmanship"
    },
    hint_1: "Originally called 'Chouchou,' it was renamed after Princess Diana was photographed carrying it repeatedly",
    hint_2: "The cannage pattern references Napoleon III chairs used in the brand's first boutique",
    hint_3: "Each bag features dangling letter charms that spell out the house name and create a distinctive sound",
    hint_4: "Requires multiple artisans specializing in different techniques to complete each piece",
    hint_5: "Medium sizes in lambskin start around $5,500, with embellished versions exceeding $20,000"
  },
  "Luggage Tote": {
    basic_info: {
      description: "Distinctive face-like design that became a street style phenomenon despite its unconventional look",
      brand_description: "Parisian house known for minimalist aesthetics and Phoebe Philo's influential tenure"
    },
    hint_1: "Designed by Phoebe Philo in 2010, its 'face' appearance with 'wings' was accidentally iconic",
    hint_2: "The unusual proportions were inspired by functionality - wide opening but compact when carried",
    hint_3: "Despite the house's minimalist reputation, this bag's bold design divided fashion critics",
    hint_4: "Production has evolved but vintage Philo-era pieces are particularly sought after by collectors",
    hint_5: "Nano sizes start around $2,500, with larger sizes in exotic skins exceeding $15,000"
  },
  "Sac de Jour": {
    basic_info: {
      description: "Structured tote inspired by classic French elegance with modern proportions",
      brand_description: "Parisian house known for Le Smoking suit and pioneering ready-to-wear"
    },
    hint_1: "Named 'bag of the day,' it's designed as an everyday luxury piece for the modern woman",
    hint_2: "The accordion sides expand for practicality while maintaining the bag's structured silhouette",
    hint_3: "Often compared to Hermès Birkin for its similar shape but more accessible price and availability",
    hint_4: "The subtle logo stamping appeals to those who prefer their luxury without obvious branding",
    hint_5: "Small sizes start around $3,000, with crocodile versions exceeding $35,000"
  },
  "Speedy 30": {
    basic_info: {
      description: "Classic monogram canvas bag that evolved from a travel piece to everyday luxury staple",
      brand_description: "French malletier founded in 1854, famous for monogram canvas and travel heritage"
    },
    hint_1: "Originally created in the 1930s as a smaller version of the Keepall travel bag for everyday use",
    hint_2: "The '30' refers to its 30cm width - also available in 25, 35, and 40 cm sizes",
    hint_3: "Audrey Hepburn requested a smaller version in 1965, leading to the creation of the Speedy 25",
    hint_4: "The monogram canvas is actually coated cotton, not leather, making it surprisingly durable and waterproof",
    hint_5: "Classic monogram versions retail around $1,500, with limited editions and leather versions higher"
  },

  // FURNITURE
  "Arco Floor Lamp": {
    basic_info: {
      description: "Iconic arc lamp with marble base that brings overhead lighting without ceiling installation",
      brand_description: "Italian design brothers known for playful yet functional modernist pieces"
    },
    hint_1: "Designed in 1962 to provide overhead dining light in apartments where ceiling modifications were prohibited",
    hint_2: "The Carrara marble base weighs 65kg and has a hole for a broomstick to help position it",
    hint_3: "The arc extends over 2 meters, created from multiple steel sections for the perfect curve",
    hint_4: "Featured in countless films and considered a symbol of sophisticated modern living",
    hint_5: "Authentic pieces from the original manufacturer retail around $3,000-4,000"
  },
  "Barcelona Chair": {
    basic_info: {
      description: "Modernist chair designed for royalty that became an icon of 20th-century design",
      brand_description: "Bauhaus architect known for 'less is more' philosophy and steel-and-glass structures"
    },
    hint_1: "Created for the German Pavilion at the 1929 Barcelona International Exhibition, hence the name",
    hint_2: "Inspired by ancient folding chairs used by Roman magistrates, updated with modern materials",
    hint_3: "The frame requires skilled welding to achieve seamless joints that appear as continuous steel",
    hint_4: "Original production rights were given to Knoll by Mies himself, making them the only authorized producer",
    hint_5: "Authentic Knoll versions retail around $6,500, with many unauthorized reproductions available"
  },
  "Eames Lounge Chair": {
    basic_info: {
      description: "Luxurious plywood and leather chair that redefined comfort in modern furniture",
      brand_description: "American husband-and-wife team who revolutionized furniture with molded plywood and fiberglass"
    },
    hint_1: "Charles Eames designed it in 1956 to have the 'warm, receptive look of a well-used baseball mitt'",
    hint_2: "Uses five layers of molded plywood shells, a technique the designers pioneered during WWII",
    hint_3: "The original used Brazilian rosewood, now uses sustainable walnut or other veneers due to regulations",
    hint_4: "Each chair takes several weeks to produce, with leather pieces hand-fitted to each shell",
    hint_5: "Herman Miller originals retail around $7,000-8,000 depending on configuration"
  },
  "Egg Chair": {
    basic_info: {
      description: "Sculptural chair that cocoons the sitter, designed for Copenhagen's first design hotel",
      brand_description: "Danish architect/designer who created numerous icons of Scandinavian modernism"
    },
    hint_1: "Created in 1958 for the SAS Royal Hotel in Copenhagen, every piece of furniture was custom designed",
    hint_2: "Jacobsen sculpted the chair in clay in his garage to achieve the perfect organic form",
    hint_3: "The manufacturing process involves stretching fabric or leather over a fiberglass shell by hand",
    hint_4: "The chair's shape provides privacy in public spaces, making it popular in hotel lobbies worldwide",
    hint_5: "Fritz Hansen originals retail around $10,000-15,000 depending on upholstery"
  },
  "LC2 Petit Comfort Chair": {
    basic_info: {
      description: "Cubic modernist chair that reversed traditional furniture by putting the frame outside",
      brand_description: "Swiss-French architect who pioneered modernist architecture and furniture"
    },
    hint_1: "Designed in 1928 as part of a series that treated furniture as 'equipment for living'",
    hint_2: "The external tubular steel frame was revolutionary, making structure part of the aesthetic",
    hint_3: "Originally called 'Fauteuil Grand Confort,' it comes in petit (small) and grand (large) sizes",
    hint_4: "Part of the permanent collection at MoMA and considered essential to understanding modern design",
    hint_5: "Cassina authentic versions retail around $4,000-5,000"
  },
  "Noguchi Coffee Table": {
    basic_info: {
      description: "Sculptural glass table that balances art and function with organic curves",
      brand_description: "Japanese-American artist/designer who bridged Eastern and Western aesthetics"
    },
    hint_1: "Originally designed in 1947, it represents Noguchi's philosophy of bringing sculpture into daily life",
    hint_2: "The biomorphic base consists of two interlocking wooden pieces that support a free-form glass top",
    hint_3: "Noguchi discovered numerous unauthorized copies and fought for decades to protect his design",
    hint_4: "The glass is 19mm thick with polished edges, creating the illusion of floating above the base",
    hint_5: "Herman Miller authorized versions retail around $2,500"
  },
  "Poäng Armchair": {
    basic_info: {
      description: "Affordable cantilever chair that brings Scandinavian design to the masses",
      brand_description: "Swedish retailer known for democratic design, flat-pack furniture, and meatballs"
    },
    hint_1: "Designed in 1976 by Noboru Nakamura, it has sold over 30 million units worldwide",
    hint_2: "The bent-wood frame flexes for comfort without mechanical parts that could break",
    hint_3: "Layer-glued bent wood is stronger than solid wood and uses less material, supporting sustainability",
    hint_4: "Available in dozens of fabric options and colors, making it customizable for any interior",
    hint_5: "Currently retails for around $100-200 depending on fabric choice"
  },
  "Tolix Marais A Chair": {
    basic_info: {
      description: "Industrial metal chair that moved from factories to fashionable cafés and homes",
      brand_description: "French manufacturer specializing in galvanized steel furniture since 1927"
    },
    hint_1: "Created in 1934 by Xavier Pauchard who pioneered galvanization techniques in France",
    hint_2: "Originally designed for outdoor café use, the holes in the seat drain rainwater",
    hint_3: "The stackable design (up to 25 high) made it practical for commercial use before becoming residential",
    hint_4: "Featured in countless bistros and now trendy restaurants worldwide as industrial chic became popular",
    hint_5: "Authentic Tolix chairs retail around $500-600"
  },
  "Wassily Chair": {
    basic_info: {
      description: "Revolutionary tubular steel chair inspired by bicycle handlebars",
      brand_description: "Bauhaus designer who pioneered tubular steel furniture"
    },
    hint_1: "Created in 1925, it was the first chair to use tubular steel, inspired by Breuer's Adler bicycle",
    hint_2: "Named after painter Wassily Kandinsky who was a colleague at the Bauhaus school",
    hint_3: "The design reduces the chair to its essential elements - a continuous steel tube and leather strips",
    hint_4: "Original versions used Eisengarn (iron yarn) fabric, now typically made with leather",
    hint_5: "Knoll authorized reproductions retail around $2,500-3,000"
  },
  "Wishbone Chair": {
    basic_info: {
      description: "Elegant wooden chair combining Chinese influences with Danish craftsmanship",
      brand_description: "Danish designer known as the 'Master of the Chair' with over 500 designs"
    },
    hint_1: "Designed in 1949, inspired by portraits of Danish merchants sitting in Chinese Ming dynasty chairs",
    hint_2: "The Y-shaped back support gives it its 'wishbone' name and provides surprising comfort",
    hint_3: "The woven paper cord seat requires about 120 meters of cord and skilled hand-weaving",
    hint_4: "Each chair requires over 100 steps to produce, despite its seemingly simple appearance",
    hint_5: "Carl Hansen & Søn originals retail around $700-900"
  },

  // GROCERY ITEMS
  "Almonds (1 lb)": {
    basic_info: {
      description: "Premium raw almonds, a nutrient-dense tree nut packed with healthy fats and protein",
      brand_description: "Specialty nut company sourcing from California's Central Valley"
    },
    hint_1: "California produces 80% of the world's almonds, requiring billions of bees for pollination each spring",
    hint_2: "A one-ounce serving contains 6g protein, making them popular with fitness enthusiasts",
    hint_3: "It takes approximately 1.1 gallons of water to grow a single almond in drought-prone regions",
    hint_4: "Raw almonds sold in the US are actually pasteurized by law since 2007 due to salmonella concerns",
    hint_5: "Premium organic raw almonds typically retail for $12-15 per pound at specialty stores"
  },
  "Bananas": {
    basic_info: {
      description: "The world's most popular fruit, technically a berry from the largest herbaceous flowering plant",
      brand_description: "Major produce distributor importing from Central and South America"
    },
    hint_1: "All commercial bananas are clones of a single variety called Cavendish, making them vulnerable to disease",
    hint_2: "They're harvested green and ripened in special rooms with ethylene gas to ensure perfect timing",
    hint_3: "The previous dominant variety, Gros Michel, was wiped out by disease in the 1950s",
    hint_4: "Bananas are naturally slightly radioactive due to their high potassium-40 content",
    hint_5: "Typically priced around $0.60-0.80 per pound in US supermarkets"
  },
  "Broccoli": {
    basic_info: {
      description: "Nutrient-rich cruciferous vegetable that's actually an edible flower",
      brand_description: "Fresh produce supplier specializing in locally grown vegetables"
    },
    hint_1: "Developed from wild cabbage by Italian farmers, it wasn't widely known in the US until the 1920s",
    hint_2: "Contains more vitamin C per serving than oranges and is loaded with cancer-fighting compounds",
    hint_3: "The word comes from Italian 'broccolo' meaning 'cabbage sprout' or 'flowering crest'",
    hint_4: "California grows 90% of US broccoli, with peak season from October through April",
    hint_5: "Fresh organic crowns typically cost $2.50-4.00 per pound at grocery stores"
  },
  "Brown Rice": {
    basic_info: {
      description: "Whole grain rice with only the outer hull removed, retaining the nutritious bran layer",
      brand_description: "Premium grain company specializing in organic whole grains"
    },
    hint_1: "Takes 40-45 minutes to cook compared to white rice's 15-20 due to the intact bran layer",
    hint_2: "Contains three times more fiber and significantly more magnesium than white rice",
    hint_3: "The bran contains natural oils that reduce shelf life to about 6 months versus years for white rice",
    hint_4: "Requires about 2,500 liters of water to produce one kilogram of rice",
    hint_5: "Quality long-grain brown rice retails for $2-3 per pound"
  },
  "Chicken Breast": {
    basic_info: {
      description: "Lean white meat from the pectoral muscles, America's most popular protein source",
      brand_description: "Premium poultry supplier emphasizing free-range and organic practices"
    },
    hint_1: "Modern chickens grow so fast they reach market weight in just 6-7 weeks versus 16 weeks in 1925",
    hint_2: "Boneless, skinless breasts became popular in the 1980s as fat became demonized in diets",
    hint_3: "Contains all essential amino acids with about 31g protein per 100g serving",
    hint_4: "White meat's popularity led to chickens being bred for enormous breasts, sometimes unable to walk",
    hint_5: "Organic, free-range boneless breasts typically cost $7-10 per pound"
  },
  "Eggs (Dozen)": {
    basic_info: {
      description: "Grade A large eggs, one of nature's most complete protein sources",
      brand_description: "Local farm collective emphasizing pasture-raised hens"
    },
    hint_1: "A hen needs 24-26 hours to produce one egg and begins laying at around 18 weeks old",
    hint_2: "The color of the shell depends on the hen's breed, but nutrition is identical",
    hint_3: "Fresh eggs sink in water while old eggs float due to air cell expansion over time",
    hint_4: "The US is unique in washing eggs, removing protective coating and requiring refrigeration",
    hint_5: "Pasture-raised eggs from happy hens cost $5-7 per dozen at farmers markets"
  },
  "Greek Yogurt (32 oz)": {
    basic_info: {
      description: "Strained yogurt with double the protein and half the sugar of regular yogurt",
      brand_description: "Artisanal dairy specializing in traditional Mediterranean products"
    },
    hint_1: "Made by straining regular yogurt to remove whey, concentrating protein and creating thick texture",
    hint_2: "The straining process uses three times more milk, explaining the higher price point",
    hint_3: "Contains live probiotics that may improve digestive health and boost immunity",
    hint_4: "Authentic Greek yogurt contains only milk and live cultures - no thickeners or additives",
    hint_5: "Premium whole milk Greek yogurt costs $6-8 for a 32oz container"
  },
  "Olive Oil (1 L)": {
    basic_info: {
      description: "Extra virgin olive oil cold-pressed from Mediterranean olives",
      brand_description: "Artisanal producer importing from small family groves"
    },
    hint_1: "Must be mechanically pressed at temperatures below 27°C to qualify as 'cold-pressed' extra virgin",
    hint_2: "Like wine, flavor varies dramatically by olive variety, terroir, and harvest timing",
    hint_3: "Many supermarket oils labeled 'extra virgin' fail quality tests and may be mixed with refined oils",
    hint_4: "Should be stored in dark containers as light causes oxidation and rancidity",
    hint_5: "Authentic extra virgin olive oil costs $20-30 per liter for quality single-origin varieties"
  },
  "Whole Milk": {
    basic_info: {
      description: "Full-fat milk containing 3.25% milkfat, pasteurized for safety",
      brand_description: "Regional dairy cooperative with emphasis on sustainable farming"
    },
    hint_1: "Despite its name, whole milk is actually 87% water with the remainder being proteins, fats, and sugars",
    hint_2: "Pasteurization, heating to 161°F for 15 seconds, was revolutionary in preventing milk-borne illness",
    hint_3: "The cream naturally rises to the top unless the milk is homogenized to break up fat molecules",
    hint_4: "A cow produces an average of 6-7 gallons of milk per day, requiring 30-50 gallons of water",
    hint_5: "Organic grass-fed whole milk typically costs $5-6 per gallon"
  },
  "Whole Wheat Bread": {
    basic_info: {
      description: "100% whole grain bread with no refined flour, keeping all parts of the wheat kernel",
      brand_description: "Artisan bakery using traditional fermentation methods"
    },
    hint_1: "True whole wheat uses the entire kernel - bran, germ, and endosperm - unlike refined white flour",
    hint_2: "Many 'wheat' breads are mostly white flour with coloring - check that 'whole wheat' is first ingredient",
    hint_3: "The oils in wheat germ make whole wheat flour go rancid faster than white flour",
    hint_4: "Contains three times the fiber of white bread and significantly more B vitamins and minerals",
    hint_5: "Artisanal whole grain sourdough loaves cost $5-7 at bakeries"
  },

  // ELECTRONICS
  "A7 IV": {
    basic_info: {
      description: "Hybrid mirrorless camera balancing high-resolution stills with professional video capabilities",
      brand_description: "Japanese electronics giant pioneering sensors and professional imaging"
    },
    hint_1: "Features a 33-megapixel full-frame sensor, up from the 24MP in the previous generation",
    hint_2: "Can shoot 4K video at 60fps with 10-bit color depth, making it popular with hybrid shooters",
    hint_3: "The advanced autofocus system can track human and animal eyes even when subjects turn away",
    hint_4: "Uses the same battery as professional models, addressing the poor battery life of earlier mirrorless cameras",
    hint_5: "Body-only pricing around $2,500 makes it a sweet spot for serious enthusiasts and professionals"
  },
  "Echo (5th Gen)": {
    basic_info: {
      description: "Smart speaker with improved audio and integrated smart home hub capabilities",
      brand_description: "E-commerce giant's consumer electronics division focused on AI assistants"
    },
    hint_1: "The spherical design improves audio dispersion compared to previous cylindrical versions",
    hint_2: "Contains an AZ2 Neural Edge processor for on-device processing of common commands",
    hint_3: "Includes a built-in Zigbee hub, eliminating the need for separate smart home bridges",
    hint_4: "The adaptive sound feature uses microphones to analyze room acoustics and adjust output",
    hint_5: "Typically priced around $100, often discounted to $60-70 during sales"
  },
  "Galaxy S23 Ultra": {
    basic_info: {
      description: "Premium Android flagship with integrated S Pen and advanced camera system",
      brand_description: "Korean conglomerate's mobile division competing directly with Apple"
    },
    hint_1: "Features a 200-megapixel main camera sensor, the highest resolution in a mainstream phone",
    hint_2: "The integrated S Pen stylus has 4,096 pressure levels and near-zero latency",
    hint_3: "Uses a custom Snapdragon 8 Gen 2 chip optimized specifically for this model",
    hint_4: "The 6.8-inch display can reach 1,750 nits brightness, readable even in direct sunlight",
    hint_5: "Starting price around $1,200 for base 256GB model"
  },
  "HERO12 Black": {
    basic_info: {
      description: "Flagship action camera with improved stabilization and longer battery life",
      brand_description: "California company that created and dominates the action camera category"
    },
    hint_1: "Can capture 5.3K video at 60fps with 10-bit color for professional-grade footage",
    hint_2: "HyperSmooth 6.0 stabilization rivals gimbal-mounted cameras without extra equipment",
    hint_3: "New Enduro battery technology maintains performance in temperatures as low as -10°C",
    hint_4: "The 1/1.9\" sensor is the largest ever in this camera line, improving low-light performance",
    hint_5: "Retails for $400, with frequent bundle deals including accessories"
  },
  "iPhone 14 Pro": {
    basic_info: {
      description: "Premium smartphone introducing Dynamic Island and 48MP camera system",
      brand_description: "Cupertino company known for integrated ecosystem and premium devices"
    },
    hint_1: "The Dynamic Island replaces the notch, turning the cutout into an interactive UI element",
    hint_2: "First iPhone with a 48MP main camera, using pixel binning for better low-light performance",
    hint_3: "The A16 Bionic chip uses a 4nm process with 16 billion transistors",
    hint_4: "ProMotion display can vary from 1Hz to 120Hz, saving battery while maintaining smoothness",
    hint_5: "Started at $999 for 128GB model at launch"
  },
  "MacBook Pro 14\" M3": {
    basic_info: {
      description: "Professional laptop with Apple Silicon offering unprecedented performance per watt",
      brand_description: "Premium computer manufacturer known for creative professional tools"
    },
    hint_1: "The M3 chip uses 3nm technology, the most advanced process node in consumer electronics",
    hint_2: "Can drive multiple external displays while maintaining all-day battery life",
    hint_3: "The Liquid Retina XDR display offers 1,600 nits peak brightness for HDR content",
    hint_4: "Unified memory architecture allows CPU and GPU to share up to 128GB RAM without copying",
    hint_5: "Base model with M3 starts at $1,599"
  },
  "Switch OLED": {
    basic_info: {
      description: "Hybrid gaming console with upgraded display and enhanced audio",
      brand_description: "Japanese gaming company known for innovative hardware and beloved franchises"
    },
    hint_1: "The 7-inch OLED screen offers perfect blacks and vibrant colors compared to the LCD original",
    hint_2: "Despite the better screen, battery life remains 4.5-9 hours due to more efficient display technology",
    hint_3: "Enhanced speakers provide better sound in handheld mode, addressing a common complaint",
    hint_4: "The wider adjustable stand finally makes tabletop mode practical for multiplayer gaming",
    hint_5: "Priced at $350, a $50 premium over the standard model"
  },
  "Watch Series 9": {
    basic_info: {
      description: "Most advanced smartwatch with new double-tap gesture and brighter display",
      brand_description: "Tech giant's wearable division dominating the smartwatch market"
    },
    hint_1: "The S9 chip enables on-device Siri processing for privacy and speed without internet",
    hint_2: "Double tap gesture uses accelerometer and gyroscope to detect finger movements without touching",
    hint_3: "Display reaches 2,000 nits brightness, double the Series 6 for better outdoor visibility",
    hint_4: "New temperature sensing can help with cycle tracking and retrospective ovulation estimates",
    hint_5: "Aluminum models start at $399, with stainless steel and titanium options available"
  },
  "WH-1000XM5": {
    basic_info: {
      description: "Premium noise-canceling headphones with industry-leading ANC and comfort",
      brand_description: "Japanese audio and electronics company with decades of innovation"
    },
    hint_1: "Uses two processors and 8 microphones to create unprecedented noise cancellation",
    hint_2: "30-hour battery life with ANC on, and 3 hours of playback from just 3 minutes charging",
    hint_3: "Weighs only 250g despite the technology packed inside, 4g lighter than previous model",
    hint_4: "Speak-to-Chat automatically pauses music when you start talking, resuming after silence",
    hint_5: "Premium pricing around $400, competing with Bose and Apple's offerings"
  },
  "XPS 13": {
    basic_info: {
      description: "Ultra-portable Windows laptop with InfinityEdge display and premium build",
      brand_description: "Texas-based computer manufacturer known for customization and support"
    },
    hint_1: "The InfinityEdge display achieves a 91.5% screen-to-body ratio in a tiny footprint",
    hint_2: "Machined aluminum body and carbon fiber palm rest provide durability at minimal weight",
    hint_3: "Latest models use Intel Core Ultra processors with dedicated AI acceleration",
    hint_4: "The 13.4-inch display comes in FHD+ or 4K+ options, with touch available on both",
    hint_5: "Configurations range from $1,000 to over $2,000 depending on specs"
  },

  // ART
  "American Gothic": {
    basic_info: {
      description: "Iconic painting depicting rural American values through a farmer and his daughter",
      brand_description: "Iowa artist who became famous for Regionalist paintings of rural America"
    },
    hint_1: "Painted in 1930, the models were the artist's sister and his dentist, not a married couple as commonly believed",
    hint_2: "The house in the background actually exists in Eldon, Iowa, and is now a tourist attraction",
    hint_3: "Wood entered it in a competition at the Art Institute of Chicago, winning $300 and launching his career",
    hint_4: "Has been parodied countless times, making it perhaps the most recognized American painting",
    hint_5: "Owned by the Art Institute of Chicago, valued for insurance at $15-20 million"
  },
  "Girl with a Pearl Earring": {
    basic_info: {
      description: "Mysterious portrait known as the 'Mona Lisa of the North' for its enigmatic appeal",
      brand_description: "Dutch Baroque master known for intimate domestic scenes and brilliant use of light"
    },
    hint_1: "Painted around 1665, it's not a portrait but a 'tronie' - a character study in exotic costume",
    hint_2: "Recent analysis suggests the 'pearl' may actually be polished silver or tin due to lacking highlights",
    hint_3: "The painting was sold at auction in 1881 for only 2 guilders plus 30 cents commission",
    hint_4: "The turban and pearl were considered exotic, oriental elements in 17th century Netherlands",
    hint_5: "Housed in the Mauritshuis museum in The Hague, estimated value around $30 million"
  },

  // JEWELRY
  "Alhambra Necklace": {
    basic_info: {
      description: "Lucky clover motif necklace that became a symbol of understated luxury",
      brand_description: "Place Vendôme jeweler known for nature-inspired designs and legendary gems"
    },
    hint_1: "Created in 1968, inspired by the four-leaf clover as a symbol of luck and fortune",
    hint_2: "Each motif is meticulously crafted with millegrain edges containing tiny gold beads",
    hint_3: "Worn by everyone from Princess Grace to modern celebrities, spanning generations of style",
    hint_4: "The vintage version features 20 motifs, while modern collections include 5, 10, and 20 motif options",
    hint_5: "20-motif necklaces in gold with carnelian or onyx start around $14,000"
  },
  "Butterfly Brooch": {
    basic_info: {
      description: "Spectacular gem-set butterfly showcasing exceptional stone quality and craftsmanship",
      brand_description: "London jeweler known for acquiring the world's rarest and largest gemstones"
    },
    hint_1: "Each butterfly is unique, featuring different combinations of colored diamonds and precious stones",
    hint_2: "Can take over 1,000 hours to create, with stones individually selected for color matching",
    hint_3: "The wings often feature innovative invisible settings to maximize brilliance",
    hint_4: "Many incorporate rare fancy colored diamonds including pink, yellow, and blue varieties",
    hint_5: "Depending on stones used, prices range from $100,000 to several million dollars"
  },
  "Cluster Earrings": {
    basic_info: {
      description: "Dramatic chandelier earrings featuring cascading diamonds in platinum settings",
      brand_description: "New York jeweler known as 'Jeweler to the Stars' and 'King of Diamonds'"
    },
    hint_1: "The 'cluster' technique creates maximum brilliance by grouping stones of varying sizes",
    hint_2: "Often features a combination of round, pear, and marquise diamonds for movement and sparkle",
    hint_3: "Each earring can contain over 50 individual diamonds, all matched for color and clarity",
    hint_4: "The design allows light to enter from all angles, creating exceptional fire and scintillation",
    hint_5: "Major cluster earrings start around $150,000, with exceptional pieces exceeding $1 million"
  },
  "Happy Diamonds Ring": {
    basic_info: {
      description: "Playful ring featuring diamonds that float freely between sapphire crystals",
      brand_description: "Swiss manufacturer combining watchmaking precision with high jewelry"
    },
    hint_1: "Invented in 1976 when a designer noticed diamonds are 'happier' when they can move and dance",
    hint_2: "The floating diamonds are sealed between sapphire crystal, harder than glass but perfectly clear",
    hint_3: "Each moving diamond is precisely calibrated to float smoothly without getting stuck",
    hint_4: "Originally created for watches, the concept proved so popular it expanded to all jewelry categories",
    hint_5: "Rings start around $5,000 for small versions with single floating diamonds"
  },
  "Love Bracelet": {
    basic_info: {
      description: "Modern jewelry icon designed to be locked onto the wrist as a symbol of commitment",
      brand_description: "French maison known for panthers, Trinity rings, and royal connections"
    },
    hint_1: "Created in 1969 by Aldo Cipullo, inspired by medieval chastity belts and eternal love",
    hint_2: "Originally came with a screwdriver and could only be removed by someone else, symbolizing trust",
    hint_3: "The oval shape was designed to fit the wrist perfectly and move naturally with the arm",
    hint_4: "Now uses a new closure system for practicality while maintaining the iconic screw motif design",
    hint_5: "Classic gold versions start around $7,000, with diamond-set versions exceeding $50,000"
  },
  "Possession Necklace": {
    basic_info: {
      description: "Elegant necklace featuring rotating rings that move with the wearer",
      brand_description: "Swiss luxury house known for ultra-thin watches and exceptional jewelry"
    },
    hint_1: "The turning bands represent life's constant movement and the passage of time",
    hint_2: "Uses precision bearing technology from watchmaking to ensure smooth, continuous rotation",
    hint_3: "Often features different textures or gem settings on the rotating elements for visual interest",
    hint_4: "The movement creates a subtle kinetic element that's both meditative and eye-catching",
    hint_5: "Gold versions start around $3,500, with diamond versions from $8,000"
  },
  "Quatre Classique Ring": {
    basic_info: {
      description: "Four-band ring combining different gold colors and textures in one design",
      brand_description: "Place Vendôme house known for innovation and as jeweler to international royalty"
    },
    hint_1: "Launched in 2004, each of the four bands represents different jewelry codes from the house's archives",
    hint_2: "Combines grosgrain, diamond-pattern, smooth gold, and a row of diamonds in perfect harmony",
    hint_3: "The technical challenge involves joining different gold alloys that expand at different rates",
    hint_4: "Despite appearing as separate bands, it's crafted as one piece for durability and comfort",
    hint_5: "Classic versions in gold retail around $3,000-4,000"
  },
  "Serpenti Watch-Bracelet": {
    basic_info: {
      description: "Snake-inspired timepiece that coils around the wrist, hiding the watch face in the head",
      brand_description: "Roman jeweler famous for bold designs and colorful gemstones"
    },
    hint_1: "The snake motif dates to the 1940s, symbolizing eternal youth through shedding of skin",
    hint_2: "Uses the ancient Tubogas technique - wrapping gold strips around a core without soldering",
    hint_3: "Elizabeth Taylor owned multiple versions, helping establish it as a symbol of glamour",
    hint_4: "Modern versions incorporate everything from steel to full pavé diamonds and colored gems",
    hint_5: "Steel versions start around $15,000, with high jewelry pieces exceeding $200,000"
  },
  "Solitaire Diamond Ring": {
    basic_info: {
      description: "Classic engagement ring featuring exceptional diamonds in iconic blue boxes",
      brand_description: "New York institution famous for breakfast, diamonds, and robin's egg blue"
    },
    hint_1: "Charles Lewis Tiffany pioneered the six-prong setting in 1886, maximizing light return",
    hint_2: "The setting lifts the diamond above the band, allowing light from all angles for maximum brilliance",
    hint_3: "Each diamond is cut to exacting standards that exceed traditional 'Excellent' grades",
    hint_4: "The brand refuses to buy diamonds from certain sources, maintaining ethical standards since 2000",
    hint_5: "One-carat solitaires start around $12,000, with prices increasing exponentially with size"
  },
  "Victoria Vine Bracelet": {
    basic_info: {
      description: "Nature-inspired bracelet featuring delicate leaves and vines in precious metals",
      brand_description: "British jeweler with royal warrants and flagship store on New Bond Street"
    },
    hint_1: "Inspired by the gardens of Victorian England, each leaf is individually crafted and applied",
    hint_2: "The design allows the bracelet to move naturally, with leaves that catch light at different angles",
    hint_3: "Often incorporates colored gemstones as 'berries' or 'flowers' among the metalwork",
    hint_4: "Requires master craftsmen specializing in naturalistic jewelry to achieve lifelike movement",
    hint_5: "Gold versions start around $15,000, with gem-set versions significantly higher"
  },

  // SPORTS EQUIPMENT
  "Astrox 99 Badminton Racket": {
    basic_info: {
      description: "Professional-grade racket designed for aggressive power play and steep smash angles",
      brand_description: "Japanese sports equipment manufacturer dominating badminton and tennis"
    },
    hint_1: "Used by world #1 Kento Momota, designed for the modern attacking style of play",
    hint_2: "Features Namd graphite technology that 'snaps back' faster for increased shuttle acceleration",
    hint_3: "The rotational generator system distributes weight for better control during rapid exchanges",
    hint_4: "Built for advanced players who can generate their own power and want maximum smash speed",
    hint_5: "Professional models retail around $250-300"
  },
  "Carbon T7 Treadmill": {
    basic_info: {
      description: "Commercial-grade home treadmill with interactive training and automatic incline",
      brand_description: "Fitness equipment company known for iFit integration and connected machines"
    },
    hint_1: "Features a 7-inch smart HD touchscreen for streaming workouts and virtual runs worldwide",
    hint_2: "The 3.0 CHP motor is designed for daily use and can support runners up to 300 pounds",
    hint_3: "Automatic incline up to 10% and decline to -3% simulates real terrain for better training",
    hint_4: "FlexSelect cushioning can be adjusted between firm and soft depending on workout goals",
    hint_5: "Typically priced around $1,500-1,800"
  },
  "Championship Tennis Ball (3-pack)": {
    basic_info: {
      description: "Premium felt-covered balls meeting ITF specifications for tournament play",
      brand_description: "American sporting goods company supplying official balls to major tournaments"
    },
    hint_1: "Used at the US Open since 1979, with over 100,000 balls used during the two-week tournament",
    hint_2: "The felt is a specific wool-nylon blend that provides consistent bounce and spin response",
    hint_3: "Pressurized to 12-14 PSI, they begin losing pressure the moment the can is opened",
    hint_4: "Professional matches use new balls every 7-9 games to maintain consistent playing characteristics",
    hint_5: "A 3-pack of championship extra duty balls costs around $5-6"
  },
  "Echo Barbell": {
    basic_info: {
      description: "Olympic weightlifting barbell engineered for high-rep workouts and daily use",
      brand_description: "Ohio company that revolutionized home gym equipment and CrossFit culture"
    },
    hint_1: "Features composite bushings instead of bearings, making it ideal for high-rep Olympic lifts",
    hint_2: "The 28.5mm diameter shaft provides good whip for cleans while maintaining stiffness for pressing",
    hint_3: "Rated for 190,000 PSI tensile strength, built to withstand drops from overhead daily",
    hint_4: "The dual knurl marks accommodate both Olympic and powerlifting grip positions",
    hint_5: "Priced around $295, offering commercial quality at consumer pricing"
  },
  "Evolution Basketball": {
    basic_info: {
      description: "Microfiber composite basketball that's the choice for high school championships",
      brand_description: "Sporting goods manufacturer known for 'True to the Game' authenticity"
    },
    hint_1: "Official ball of NCAA championships and many high school state tournaments nationwide",
    hint_2: "The microfiber composite cover provides better grip than leather when first used",
    hint_3: "Features laid-in channels rather than rubber channels for better feel and control",
    hint_4: "Designed for indoor use only - outdoor surfaces will quickly degrade the cover material",
    hint_5: "Retails for around $70, positioned between rubber balls and premium leather"
  },
  "Mercurial Superfly FG": {
    basic_info: {
      description: "Elite soccer cleats designed for explosive speed on firm natural grass",
      brand_description: "Beaverton giant known for innovation and athlete endorsements"
    },
    hint_1: "Worn by Cristiano Ronaldo and Kylian Mbappé, designed for players who rely on pace",
    hint_2: "The Flyknit upper provides sock-like fit while reducing weight to under 200 grams",
    hint_3: "Chevron studs provide instant acceleration and braking for quick direction changes",
    hint_4: "The high collar design is controversial - loved by some for ankle support, disliked by traditionalists",
    hint_5: "Elite models retail around $300-350"
  },
  "NBA Official Game Basketball": {
    basic_info: {
      description: "Genuine leather basketball used in all NBA games and practices",
      brand_description: "Massachusetts company that invented basketball and makes official NBA equipment"
    },
    hint_1: "Each ball is made from full-grain Horween leather, requiring breaking in before game use",
    hint_2: "NBA teams go through about 72 balls per season, with each broken in during practices",
    hint_3: "The leather comes from the Horween Leather Company in Chicago, tanned using a secret process",
    hint_4: "Players often have strong preferences - some like new balls, others prefer well-worn ones",
    hint_5: "Authentic game balls retail for $169.99"
  },
  "Paradym Driver": {
    basic_info: {
      description: "High-tech golf driver featuring AI-designed face for maximum distance",
      brand_description: "California golf company known for innovation and Tour player usage"
    },
    hint_1: "Uses AI to design unique face thickness patterns optimizing ball speed across the entire face",
    hint_2: "The carbon chassis saves 44g of weight that's repositioned for higher launch and forgiveness",
    hint_3: "Jailbreak technology connects crown and sole for more efficient energy transfer at impact",
    hint_4: "Adjustable hosel allows loft and lie changes to optimize launch conditions for any player",
    hint_5: "Retails for around $599, competing at the premium driver segment"
  },
  "Predator Elite": {
    basic_info: {
      description: "Professional goalkeeper gloves with German Contact Latex for superior grip",
      brand_description: "German sportswear giant with three stripes known for soccer heritage"
    },
    hint_1: "URG 2.0 latex palm provides exceptional grip in both wet and dry conditions",
    hint_2: "Negative cut construction brings latex in direct contact with fingertips for ball feel",
    hint_3: "The Demonskin texture on backhand adds control for punching and throwing",
    hint_4: "Professional keepers often use 2-3 pairs per match as latex wears quickly on modern pitches",
    hint_5: "Elite level gloves cost around $150-180"
  },
  "Pro V1 Golf Ball": {
    basic_info: {
      description: "Tour-validated golf ball offering exceptional distance with consistent flight",
      brand_description: "Massachusetts company synonymous with premium golf balls and loyalty"
    },
    hint_1: "Most played ball on professional tours worldwide, chosen by over 70% of pros",
    hint_2: "The 352 tetrahedral dimple design provides penetrating trajectory and consistent flight",
    hint_3: "Multi-layer construction with urethane cover provides tour-level spin control around greens",
    hint_4: "Each ball goes through over 120 quality checks before packaging to ensure consistency",
    hint_5: "A dozen balls retail for around $55, making them a significant ongoing golf expense"
  },

  // HOUSES  
  "Casa Batlló": {
    basic_info: {
      description: "Modernist masterpiece in Barcelona featuring organic shapes and colorful mosaics",
      brand_description: "Catalan architect who defined Barcelona's architectural identity"
    },
    hint_1: "Renovated in 1904-1906, the facade represents Sant Jordi (St. George) slaying the dragon",
    hint_2: "The roof tiles resemble dragon scales, while the balconies look like skulls or carnival masks",
    hint_3: "Uses innovative ventilation systems and light wells that were ahead of their time",
    hint_4: "No straight lines exist in the entire building, following Gaudí's nature-inspired philosophy",
    hint_5: "Recent valuation estimates place it around $110 million"
  },
  "Fallingwater": {
    basic_info: {
      description: "Iconic house cantilevered over a waterfall, harmonizing architecture with nature",
      brand_description: "American architect who pioneered organic architecture and Prairie School style"
    },
    hint_1: "Built in 1935 for the Kaufmann family as a weekend retreat in rural Pennsylvania",
    hint_2: "The dramatic cantilevers required engineering reinforcement during construction against Wright's wishes",
    hint_3: "Featured on the cover of Time magazine in 1938, instantly becoming world-famous",
    hint_4: "Now a UNESCO World Heritage Site, it attracts over 180,000 visitors annually",
    hint_5: "Estimated value around $10 million, though as a museum it's essentially priceless"
  },
  "Villa Savoye": {
    basic_info: {
      description: "Modernist villa embodying the five points of architecture in pure form",
      brand_description: "Swiss-French architect who defined modernist principles"
    },
    hint_1: "Built in 1929-1931, it perfectly demonstrates his 'Five Points': pilotis, free facade, open plan, ribbon windows, roof garden",
    hint_2: "The white exterior was meant to be a 'machine for living' - pure, functional, and timeless",
    hint_3: "Nearly demolished in the 1960s, it was saved by André Malraux, the French Minister of Culture",
    hint_4: "The spiral ramp to the roof terrace creates an 'architectural promenade' through the space",
    hint_5: "As a French national monument, theoretical value estimated at $15-20 million"
  },
  "Villa Tugendhat": {
    basic_info: {
      description: "Functionalist villa in Czech Republic showcasing revolutionary use of space and materials",
      brand_description: "German-American architect who pioneered modernist design"
    },
    hint_1: "Built in 1929-1930 for Fritz and Greta Tugendhat, featuring revolutionary steel frame construction",
    hint_2: "The onyx wall and tropical wood partitions can be moved to completely transform the living space",
    hint_3: "Cost five times a typical luxury house at the time due to exotic materials and custom furniture",
    hint_4: "The family fled the Nazis in 1938; the house became a children's hospital then gymnastics facility",
    hint_5: "After extensive restoration, valued at approximately $25 million"
  },
  "Winchester Mystery House": {
    basic_info: {
      description: "Victorian mansion with bizarre architectural features built continuously for 38 years",
      brand_description: "Widow of firearms manufacturer who believed in appeasing spirits"
    },
    hint_1: "Sarah Winchester believed she was haunted by victims of Winchester rifles and built to confuse spirits",
    hint_2: "Contains stairs leading to ceilings, doors opening to walls, and windows looking into other rooms",
    hint_3: "Construction continued 24 hours a day from 1886 until her death in 1922",
    hint_4: "Originally 7 stories with over 200 rooms, reduced to 4 stories and 160 rooms after 1906 earthquake",
    hint_5: "Now a tourist attraction valued around $20 million"
  }
};

async function updateAllHints() {
  console.log('📝 Updating hints for all items...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [itemName, hints] of Object.entries(itemHints)) {
    try {
      // Find the item by name
      const { data: item, error: findError } = await supabase
        .from('items')
        .select('id')
        .eq('name', itemName)
        .single();
      
      if (findError || !item) {
        console.error(`❌ Item not found: ${itemName}`);
        errorCount++;
        continue;
      }
      
      // Update the item with new hints
      const { error: updateError } = await supabase
        .from('items')
        .update({
          basic_info: hints.basic_info,
          hint_1: hints.hint_1,
          hint_2: hints.hint_2,
          hint_3: hints.hint_3,
          hint_4: hints.hint_4,
          hint_5: hints.hint_5
        })
        .eq('id', item.id);
      
      if (updateError) {
        console.error(`❌ Failed to update ${itemName}:`, updateError.message);
        errorCount++;
      } else {
        console.log(`✅ Updated hints for: ${itemName}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${itemName}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n📊 Update Summary:');
  console.log(`✅ Successfully updated: ${successCount} items`);
  console.log(`❌ Errors: ${errorCount} items`);
  console.log(`📝 Total processed: ${Object.keys(itemHints).length} items`);
}

updateAllHints().catch(console.error);