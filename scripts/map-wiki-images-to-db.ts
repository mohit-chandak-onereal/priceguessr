import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ImageMatch {
  itemId: string;
  itemName: string;
  itemBrand: string;
  imagePath: string;
  confidence: 'exact' | 'high' | 'medium' | 'low';
}

// Helper to normalize names for comparison
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
}

// Helper to extract item name from image filename
function extractNameFromImage(filename: string): string {
  return filename
    .replace('resized_', '')
    .replace(/\.(jpg|jpeg|png|gif)$/i, '')
    .replace(/_/g, ' ');
}

async function findMatches() {
  // Get all items from database
  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, brand')
    .order('name');
  
  if (error || !items) {
    console.error('Error fetching items:', error);
    return;
  }
  
  // Get all wiki images
  const wikiImagesDir = '/Users/mohit/lab/projects/hackathon/resources/wiki-images';
  const imageFiles = fs.readdirSync(wikiImagesDir)
    .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
  
  const matches: ImageMatch[] = [];
  const unmatchedItems: typeof items = [];
  const unmatchedImages: string[] = [];
  
  // Try to match each item with an image
  for (const item of items) {
    let bestMatch: ImageMatch | null = null;
    let bestScore = 0;
    
    for (const imageFile of imageFiles) {
      const imageName = extractNameFromImage(imageFile);
      const normalizedImageName = normalizeName(imageName);
      const normalizedItemName = normalizeName(item.name);
      const normalizedBrandName = normalizeName(item.brand);
      
      // Check for exact match
      if (normalizedItemName === normalizedImageName) {
        bestMatch = {
          itemId: item.id,
          itemName: item.name,
          itemBrand: item.brand,
          imagePath: path.join(wikiImagesDir, imageFile),
          confidence: 'exact'
        };
        bestScore = 100;
        break;
      }
      
      // Check if item name contains image name or vice versa
      if (normalizedItemName.includes(normalizedImageName) || 
          normalizedImageName.includes(normalizedItemName)) {
        const score = 80;
        if (score > bestScore) {
          bestMatch = {
            itemId: item.id,
            itemName: item.name,
            itemBrand: item.brand,
            imagePath: path.join(wikiImagesDir, imageFile),
            confidence: 'high'
          };
          bestScore = score;
        }
      }
      
      // Check brand match
      if (normalizedImageName.includes(normalizedBrandName) && normalizedBrandName.length > 3) {
        const score = 60;
        if (score > bestScore) {
          bestMatch = {
            itemId: item.id,
            itemName: item.name,
            itemBrand: item.brand,
            imagePath: path.join(wikiImagesDir, imageFile),
            confidence: 'medium'
          };
          bestScore = score;
        }
      }
      
      // Check for partial word matches
      const itemWords = item.name.toLowerCase().split(/\s+/);
      const imageWords = imageName.toLowerCase().split(/\s+/);
      const commonWords = itemWords.filter(w => imageWords.includes(w) && w.length > 3);
      
      if (commonWords.length > 0) {
        const score = 40 * commonWords.length;
        if (score > bestScore) {
          bestMatch = {
            itemId: item.id,
            itemName: item.name,
            itemBrand: item.brand,
            imagePath: path.join(wikiImagesDir, imageFile),
            confidence: 'low'
          };
          bestScore = score;
        }
      }
    }
    
    if (bestMatch) {
      matches.push(bestMatch);
      // Remove matched image from list
      const imageName = path.basename(bestMatch.imagePath);
      const index = imageFiles.indexOf(imageName);
      if (index > -1) {
        imageFiles.splice(index, 1);
      }
    } else {
      unmatchedItems.push(item);
    }
  }
  
  // Remaining images are unmatched
  unmatchedImages.push(...imageFiles);
  
  // Display results
  console.log('=== WIKI IMAGE TO DATABASE ITEM MAPPING ===\n');
  console.log(`Total items in database: ${items.length}`);
  console.log(`Total wiki images: ${imageFiles.length + matches.length}`);
  console.log(`Matched items: ${matches.length}\n`);
  
  // Group matches by confidence
  const exactMatches = matches.filter(m => m.confidence === 'exact');
  const highMatches = matches.filter(m => m.confidence === 'high');
  const mediumMatches = matches.filter(m => m.confidence === 'medium');
  const lowMatches = matches.filter(m => m.confidence === 'low');
  
  if (exactMatches.length > 0) {
    console.log('\n🎯 EXACT MATCHES:');
    exactMatches.forEach(m => {
      console.log(`✅ ${m.itemName} (${m.itemBrand})`);
      console.log(`   → ${path.basename(m.imagePath)}`);
    });
  }
  
  if (highMatches.length > 0) {
    console.log('\n🔥 HIGH CONFIDENCE MATCHES:');
    highMatches.forEach(m => {
      console.log(`✅ ${m.itemName} (${m.itemBrand})`);
      console.log(`   → ${path.basename(m.imagePath)}`);
    });
  }
  
  if (mediumMatches.length > 0) {
    console.log('\n⚡ MEDIUM CONFIDENCE MATCHES:');
    mediumMatches.forEach(m => {
      console.log(`⚠️ ${m.itemName} (${m.itemBrand})`);
      console.log(`   → ${path.basename(m.imagePath)}`);
    });
  }
  
  if (lowMatches.length > 0) {
    console.log('\n💡 LOW CONFIDENCE MATCHES:');
    lowMatches.forEach(m => {
      console.log(`❓ ${m.itemName} (${m.itemBrand})`);
      console.log(`   → ${path.basename(m.imagePath)}`);
    });
  }
  
  // Save mapping to file
  const mapping = {
    summary: {
      totalItems: items.length,
      totalImages: imageFiles.length + matches.length,
      matchedItems: matches.length,
      unmatchedItems: unmatchedItems.length,
      unmatchedImages: unmatchedImages.length
    },
    matches: matches.map(m => ({
      itemId: m.itemId,
      itemName: m.itemName,
      itemBrand: m.itemBrand,
      imageName: path.basename(m.imagePath),
      confidence: m.confidence
    })),
    unmatchedItems: unmatchedItems.map(item => ({
      itemId: item.id,
      itemName: item.name,
      itemBrand: item.brand
    })),
    unmatchedImages: unmatchedImages
  };
  
  fs.writeFileSync(
    'scripts/wiki-image-item-mapping.json',
    JSON.stringify(mapping, null, 2)
  );
  
  console.log('\n\n📄 Full mapping saved to: scripts/wiki-image-item-mapping.json');
  
  // Show summary stats
  console.log('\n📊 SUMMARY:');
  console.log(`- Exact matches: ${exactMatches.length}`);
  console.log(`- High confidence: ${highMatches.length}`);
  console.log(`- Medium confidence: ${mediumMatches.length}`);
  console.log(`- Low confidence: ${lowMatches.length}`);
  console.log(`- Total matched: ${matches.length} / ${items.length} items (${Math.round(matches.length / items.length * 100)}%)`);
}

findMatches().catch(console.error);