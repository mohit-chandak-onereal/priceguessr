export interface MockPlayer {
  username: string;
  accuracy: number;
  attempts: number;
  item_name: string;
  item_price: number;
}

const firstNames = [
  'Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie',
  'Avery', 'Quinn', 'Drew', 'Blake', 'Cameron', 'Dakota', 'Emery', 'Finley',
  'Hayden', 'Jesse', 'Kai', 'Logan', 'Mason', 'Parker', 'Peyton', 'Reese',
  'Rowan', 'Sage', 'Skyler', 'Spencer', 'Sydney', 'Tatum'
];

const lastInitials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W'];

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
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let username: string;
    
    // Generate unique username
    do {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
      const number = Math.floor(Math.random() * 99) + 1;
      username = `${firstName}${lastInitial}${number}`;
    } while (usedNames.has(username));
    
    usedNames.add(username);

    // Generate game data with accuracy less than maxAccuracy
    const item = items[Math.floor(Math.random() * items.length)];
    const accuracy = Math.floor(Math.random() * (maxAccuracy - 70)) + 70; // 70% to maxAccuracy%
    const attempts = Math.min(6, Math.floor((100 - accuracy) / 15) + 1); // Better accuracy = fewer attempts

    mockPlayers.push({
      username,
      accuracy,
      attempts,
      item_name: item.name,
      item_price: item.price
    });
  }

  // Sort by accuracy (descending) then attempts (ascending)
  return mockPlayers.sort((a, b) => {
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return a.attempts - b.attempts;
  });
}