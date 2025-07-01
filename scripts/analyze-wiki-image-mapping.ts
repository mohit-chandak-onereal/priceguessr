import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
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

// Wiki images directory
const WIKI_IMAGES_DIR = '/Users/mohit/lab/projects/hackathon/resources/wiki-images';

interface MappingResult {
  itemId: string;
  itemName: string;
  categoryId: string;
  matchedImage: string | null;
  confidence: 'high' | 'medium' | 'low' | 'none';
}

// Function to normalize names for comparison
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .trim();
}

// Function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeName(str1);
  const normalized2 = normalizeName(str2);
  
  // Exact match
  if (normalized1 === normalized2) return 1.0;
  
  // One contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    const longer = normalized1.length > normalized2.length ? normalized1 : normalized2;
    const shorter = normalized1.length <= normalized2.length ? normalized1 : normalized2;
    return shorter.length / longer.length;
  }
  
  // Calculate Levenshtein distance
  const matrix: number[][] = [];
  for (let i = 0; i <= normalized2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= normalized1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= normalized2.length; i++) {
    for (let j = 1; j <= normalized1.length; j++) {
      if (normalized2[i - 1] === normalized1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[normalized2.length][normalized1.length];
  const maxLength = Math.max(normalized1.length, normalized2.length);
  return 1 - (distance / maxLength);
}

async function main() {
  console.log('🔍 Analyzing Wiki Image to Database Item Mapping\n');
  
  // Get all items from database
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('id, name, category_id, brand')
    .order('name');
  
  if (itemsError || !items) {
    console.error('Error fetching items:', itemsError);
    return;
  }
  
  console.log(`📊 Total items in database: ${items.length}\n`);
  
  // Get all wiki images
  let imageFiles: string[] = [];
  try {
    imageFiles = fs.readdirSync(WIKI_IMAGES_DIR)
      .filter(file => file.startsWith('resized_') && (
        file.endsWith('.png') || 
        file.endsWith('.jpg') || 
        file.endsWith('.jpeg') || 
        file.endsWith('.JPG')
      ));
  } catch (error) {
    console.log('⚠️  Wiki images directory not found. Creating empty mapping.\n');
  }
  
  console.log(`📁 Found ${imageFiles.length} wiki images\n`);
  
  // Process each item and find best matching image
  const mappings: MappingResult[] = [];
  
  for (const item of items) {
    let bestMatch: { image: string; similarity: number } | null = null;
    
    // Try to find matching image
    for (const imageFile of imageFiles) {
      // Extract image name without prefix and extension
      const imageName = path.basename(imageFile, path.extname(imageFile))
        .replace('resized_', '')
        .replace(/_/g, ' ');
      
      // Calculate similarity with item name
      const nameSimilarity = calculateSimilarity(item.name, imageName);
      
      // Also try with brand if available
      let brandSimilarity = 0;
      if (item.brand) {
        brandSimilarity = calculateSimilarity(item.brand, imageName);
      }
      
      // Also try combining brand and name
      let combinedSimilarity = 0;
      if (item.brand) {
        const combined = `${item.brand} ${item.name}`;
        combinedSimilarity = calculateSimilarity(combined, imageName);
      }
      
      const maxSimilarity = Math.max(nameSimilarity, brandSimilarity, combinedSimilarity);
      
      if (!bestMatch || maxSimilarity > bestMatch.similarity) {
        bestMatch = { image: imageFile, similarity: maxSimilarity };
      }
    }
    
    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' | 'none' = 'none';
    let matchedImage: string | null = null;
    
    if (bestMatch) {
      if (bestMatch.similarity >= 0.9) {
        confidence = 'high';
        matchedImage = bestMatch.image;
      } else if (bestMatch.similarity >= 0.7) {
        confidence = 'medium';
        matchedImage = bestMatch.image;
      } else if (bestMatch.similarity >= 0.5) {
        confidence = 'low';
        matchedImage = bestMatch.image;
      }
    }
    
    mappings.push({
      itemId: item.id,
      itemName: item.name,
      categoryId: item.category_id,
      matchedImage,
      confidence
    });
  }
  
  // Generate report
  console.log('📋 Mapping Results:\n');
  
  const highConfidence = mappings.filter(m => m.confidence === 'high');
  const mediumConfidence = mappings.filter(m => m.confidence === 'medium');
  const lowConfidence = mappings.filter(m => m.confidence === 'low');
  const noMatch = mappings.filter(m => m.confidence === 'none');
  
  console.log(`✅ High confidence matches: ${highConfidence.length}`);
  console.log(`🟡 Medium confidence matches: ${mediumConfidence.length}`);
  console.log(`🟠 Low confidence matches: ${lowConfidence.length}`);
  console.log(`❌ No matches found: ${noMatch.length}`);
  console.log(`\n📊 Total coverage: ${((items.length - noMatch.length) / items.length * 100).toFixed(1)}%\n`);
  
  // Save detailed mapping to file
  const output = {
    summary: {
      totalItems: items.length,
      totalImages: imageFiles.length,
      highConfidenceMatches: highConfidence.length,
      mediumConfidenceMatches: mediumConfidence.length,
      lowConfidenceMatches: lowConfidence.length,
      noMatches: noMatch.length,
      coveragePercent: ((items.length - noMatch.length) / items.length * 100).toFixed(1)
    },
    mappings: mappings.sort((a, b) => {
      const confidenceOrder = { 'high': 0, 'medium': 1, 'low': 2, 'none': 3 };
      return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    })
  };
  
  fs.writeFileSync(
    join(__dirname, 'wiki-image-mapping-analysis.json'),
    JSON.stringify(output, null, 2)
  );
  
  console.log('💾 Detailed mapping saved to: scripts/wiki-image-mapping-analysis.json\n');
  
  // Show some examples
  console.log('📌 Sample High Confidence Matches:');
  highConfidence.slice(0, 5).forEach(m => {
    console.log(`  - "${m.itemName}" → "${m.matchedImage}"`);
  });
  
  if (mediumConfidence.length > 0) {
    console.log('\n📌 Sample Medium Confidence Matches:');
    mediumConfidence.slice(0, 5).forEach(m => {
      console.log(`  - "${m.itemName}" → "${m.matchedImage}"`);
    });
  }
  
  if (noMatch.length > 0) {
    console.log('\n📌 Sample Items Without Matches:');
    noMatch.slice(0, 10).forEach(m => {
      console.log(`  - "${m.itemName}" (${m.itemId})`);
    });
  }
  
  // List unmapped images
  const mappedImages = new Set(mappings.filter(m => m.matchedImage).map(m => m.matchedImage));
  const unmappedImages = imageFiles.filter(img => !mappedImages.has(img));
  
  if (unmappedImages.length > 0) {
    console.log(`\n📌 Unmapped Wiki Images (${unmappedImages.length}):`);
    unmappedImages.slice(0, 10).forEach(img => {
      console.log(`  - ${img}`);
    });
    if (unmappedImages.length > 10) {
      console.log(`  ... and ${unmappedImages.length - 10} more`);
    }
  }
}

main().catch(console.error);