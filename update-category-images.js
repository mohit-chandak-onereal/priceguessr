const fs = require('fs');

// Read the file
let content = fs.readFileSync('./lib/real-data.ts', 'utf8');

// Define category images from Unsplash (free stock photos)
const categoryImages = {
  // Cars - Generic sports car
  car: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop',
  
  // Houses - Modern house
  house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
  
  // Watches - Luxury watch  
  watch: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=400&fit=crop',
  
  // Fashion - Designer handbag
  fashion: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop',
  
  // Art - Art gallery
  art: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=400&fit=crop',
  
  // Grocery - Fresh produce
  grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
  
  // Electronics - Tech devices
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
  
  // Sports - Sports equipment
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
  
  // Jewelry - Diamond ring
  jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop',
  
  // Furniture - Modern furniture
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop'
};

// Replace all image URLs based on item IDs
Object.entries(categoryImages).forEach(([category, url]) => {
  // Create a regex to match image URLs for items starting with this category
  const regex = new RegExp(`(id: '${category}-[^']+',[\\s\\S]*?images: \\[')[^']+('\\])`, 'g');
  content = content.replace(regex, `$1${url}$2`);
});

// Write the updated content back
fs.writeFileSync('./lib/real-data.ts', content);

console.log('Category images updated successfully!');