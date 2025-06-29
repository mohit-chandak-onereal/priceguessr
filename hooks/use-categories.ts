'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/database';
import { Category } from '@/types/game';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}