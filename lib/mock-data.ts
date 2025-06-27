import { categories, items } from './real-data';

export const mockCategories = categories;
export const mockItems = items;

// Helper function to get a random item
export function getRandomMockItem(categoryId?: string) {
  const filteredItems = categoryId
    ? mockItems.filter(item => item.category_id === categoryId)
    : mockItems;
  
  if (filteredItems.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * filteredItems.length);
  return filteredItems[randomIndex];
}