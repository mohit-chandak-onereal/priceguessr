import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HintQualityReport {
  itemId: string;
  itemName: string;
  category: string;
  price: number;
  basicInfoQuality: string;
  hintQuality: number[];
  overallScore: number;
  issues: string[];
}

// Check hint quality metrics
function analyzeHint(hint: string | null, hintNumber: number): { score: number; issues: string[] } {
  if (!hint) return { score: 0, issues: ['Missing hint'] };
  
  const issues: string[] = [];
  let score = 0;
  
  // Length check
  if (hint.length < 30) issues.push('Too short');
  else if (hint.length > 200) issues.push('Too long');
  else score += 2;
  
  // Check for generic phrases
  const genericPhrases = [
    'this item',
    'this product',
    'it has',
    'it is',
    'very popular',
    'high quality',
    'well known',
    'famous for'
  ];
  
  const lowerHint = hint.toLowerCase();
  const hasGeneric = genericPhrases.some(phrase => lowerHint.includes(phrase));
  if (hasGeneric) {
    issues.push('Contains generic phrases');
  } else {
    score += 2;
  }
  
  // Check for specific details
  const hasNumbers = /\d/.test(hint);
  const hasYear = /\b(19|20)\d{2}\b/.test(hint);
  const hasSpecificDetails = hasNumbers || hasYear;
  
  if (hasSpecificDetails) score += 2;
  else if (hintNumber > 2) issues.push('Lacks specific details');
  
  // Check progression (later hints should be more specific)
  if (hintNumber >= 4 && !hasSpecificDetails) {
    issues.push('Should have more specific details for later hints');
  }
  
  // Educational value
  const educationalKeywords = ['invented', 'founded', 'created', 'designed', 'developed', 'originated', 'introduced', 'launched'];
  const hasEducational = educationalKeywords.some(word => lowerHint.includes(word));
  if (hasEducational) score += 1;
  
  // Engagement check (questions, interesting facts)
  const hasQuestion = hint.includes('?');
  const hasExclamation = hint.includes('!');
  if (hasQuestion || hasExclamation) score += 1;
  
  return { score: Math.min(score, 8), issues };
}

async function analyzeAllHints() {
  console.log('🔍 Analyzing hint quality for all items...\n');
  
  // Get all items with their hints
  const { data: items, error } = await supabase
    .from('items')
    .select(`
      id,
      name,
      price,
      category_id,
      basic_info,
      hint_1,
      hint_2,
      hint_3,
      hint_4,
      hint_5,
      categories (
        name
      )
    `)
    .order('category_id')
    .order('name');
  
  if (error || !items) {
    console.error('Failed to fetch items:', error);
    return;
  }
  
  const reports: HintQualityReport[] = [];
  const categoryScores: { [key: string]: number[] } = {};
  
  for (const item of items) {
    const basicInfo = item.basic_info as any;
    const categoryName = (item.categories as any)?.name || 'Unknown';
    
    // Analyze basic_info
    let basicInfoQuality = 'Good';
    const basicInfoIssues: string[] = [];
    
    if (!basicInfo || Object.keys(basicInfo).length === 0) {
      basicInfoQuality = 'Missing';
      basicInfoIssues.push('No basic info');
    } else if (!basicInfo.description || basicInfo.description.length < 20) {
      basicInfoQuality = 'Poor';
      basicInfoIssues.push('Description too short');
    }
    
    // Analyze each hint
    const hintScores: number[] = [];
    const allIssues: string[] = [...basicInfoIssues];
    
    for (let i = 1; i <= 5; i++) {
      const hint = item[`hint_${i}` as keyof typeof item] as string;
      const { score, issues } = analyzeHint(hint, i);
      hintScores.push(score);
      if (issues.length > 0) {
        allIssues.push(`Hint ${i}: ${issues.join(', ')}`);
      }
    }
    
    // Calculate overall score (out of 10)
    const avgHintScore = hintScores.reduce((a, b) => a + b, 0) / hintScores.length;
    const basicScore = basicInfoQuality === 'Good' ? 2 : basicInfoQuality === 'Poor' ? 1 : 0;
    const overallScore = Math.round((avgHintScore + basicScore) / 1.0); // Normalized to 10
    
    // Track category scores
    if (!categoryScores[categoryName]) categoryScores[categoryName] = [];
    categoryScores[categoryName].push(overallScore);
    
    reports.push({
      itemId: item.id,
      itemName: item.name,
      category: categoryName,
      price: item.price,
      basicInfoQuality,
      hintQuality: hintScores,
      overallScore,
      issues: allIssues
    });
  }
  
  // Sort by score (worst first)
  reports.sort((a, b) => a.overallScore - b.overallScore);
  
  // Display worst items
  console.log('❌ Items with POOR hint quality (score < 5):\n');
  const poorItems = reports.filter(r => r.overallScore < 5);
  poorItems.forEach(item => {
    console.log(`${item.itemName} (${item.category}) - Score: ${item.overallScore}/10`);
    console.log(`  Issues: ${item.issues.join('; ')}`);
    console.log('');
  });
  
  // Display items needing improvement
  console.log('\n⚠️  Items needing improvement (score 5-7):\n');
  const mediumItems = reports.filter(r => r.overallScore >= 5 && r.overallScore <= 7);
  console.log(`Found ${mediumItems.length} items that could be improved`);
  
  // Category summary
  console.log('\n📊 Category Summary:\n');
  for (const [category, scores] of Object.entries(categoryScores)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    console.log(`${category}: ${avg.toFixed(1)}/10 (${scores.length} items)`);
  }
  
  // Save detailed report
  const detailedReport = {
    summary: {
      totalItems: reports.length,
      poorQuality: poorItems.length,
      needsImprovement: mediumItems.length,
      goodQuality: reports.filter(r => r.overallScore > 7).length
    },
    categoryAverages: Object.entries(categoryScores).map(([cat, scores]) => ({
      category: cat,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      itemCount: scores.length
    })),
    itemsNeedingWork: reports.filter(r => r.overallScore <= 7).map(r => ({
      id: r.itemId,
      name: r.itemName,
      category: r.category,
      score: r.overallScore,
      issues: r.issues
    }))
  };
  
  fs.writeFileSync('scripts/hint-quality-report.json', JSON.stringify(detailedReport, null, 2));
  console.log('\n📄 Detailed report saved to: scripts/hint-quality-report.json');
}

analyzeAllHints().catch(console.error);