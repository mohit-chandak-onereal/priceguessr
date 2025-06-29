export interface MockPlayer {
  username: string;
  accuracy: number;
  attempts: number;
  item_name: string;
  item_price: number;
}

const fixedNames = ['Mohit', 'Joe', 'Bryce'];

const items = [
  { name: 'Instant Pot Duo', price: 89.99 },
  { name: 'Roomba Vacuum', price: 299.99 },
  { name: 'Dyson Hair Dryer', price: 429.99 },
  { name: 'Apple AirPods Pro', price: 249.99 },
  { name: 'Ninja Foodi Grill', price: 169.99 },
  { name: 'Samsung Galaxy Watch', price: 279.99 },
  { name: 'Bose QuietComfort', price: 349.99 },
  { name: 'KitchenAid Mixer', price: 449.99 },
  { name: 'Ring Video Doorbell', price: 199.99 },
  { name: 'Nespresso Machine', price: 159.99 },
  { name: 'Vitamix Blender', price: 599.99 },
  { name: 'PlayStation Controller', price: 69.99 },
  { name: 'Fitbit Charge', price: 149.99 },
  { name: 'Echo Show', price: 249.99 },
  { name: 'GoPro Hero', price: 399.99 }
];

export function generateMockPlayers(count: number, maxAccuracy: number = 95): MockPlayer[] {
  const mockPlayers: MockPlayer[] = [];
  const nameIndex = { Mohit: 0, Joe: 0, Bryce: 0 };

  for (let i = 0; i < count; i++) {
    // Cycle through the three names
    const baseName = fixedNames[i % 3];
    nameIndex[baseName]++;
    
    // Add number suffix if this name is used more than once
    const username = nameIndex[baseName] > 1 ? `${baseName}${nameIndex[baseName]}` : baseName;

    // Generate game data
    const item = items[Math.floor(Math.random() * items.length)];
    
    // Calculate score between 700-950 (based on game logic: 1000 - 120 per attempt)
    // Score 950 = 1 attempt (1000 - 120*1 = 880, but we want 950 max)
    // Score 700 = 3 attempts (1000 - 120*3 = 640, but we want 700 min)
    // So we'll use attempts 1-3 and adjust accuracy to always be within 5%
    
    const score = Math.floor(Math.random() * (950 - 700 + 1)) + 700;
    
    // Work backwards from score to attempts
    // Since score = 1000 - 120 * attempts, we can calculate:
    // attempts = (1000 - score) / 120
    let attempts = Math.round((1000 - score) / 120);
    attempts = Math.max(1, Math.min(3, attempts)); // Ensure 1-3 attempts
    
    // Accuracy should be high (within 5%) since they won
    const accuracy = Math.floor(Math.random() * 5) + 95; // 95-99%

    mockPlayers.push({
      username,
      accuracy,
      attempts,
      item_name: item.name,
      item_price: item.price
    });
  }

  // Sort by score (which correlates with accuracy and attempts)
  return mockPlayers.sort((a, b) => {
    const scoreA = 1000 - (120 * a.attempts);
    const scoreB = 1000 - (120 * b.attempts);
    if (scoreB !== scoreA) return scoreB - scoreA;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return a.attempts - b.attempts;
  });
}