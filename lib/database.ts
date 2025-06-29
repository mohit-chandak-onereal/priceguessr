import { createClient } from './supabase';
import { 
  Category, 
  Item, 
  GameSession, 
  LeaderboardEntry,
  Guess 
} from '@/types/game';

const supabase = createClient();

// Category functions
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

// Item functions
export async function getItemsByCategory(categoryId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }

  return data || [];
}

export async function getItemById(id: string): Promise<Item | null> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching item:', error);
    return null;
  }

  return data;
}

export async function getRandomItem(categoryId?: string): Promise<Item | null> {
  let query = supabase.from('items').select('*');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    console.error('Error fetching random item:', error);
    return null;
  }

  // Better randomization using crypto
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

// Game session functions
export async function createGameSession(
  itemId: string,
  userId?: string
): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      item_id: itemId,
      user_id: userId,
      guesses: [],
      attempts: 0,
      won: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating game session:', error);
    return null;
  }

  return data;
}

export async function updateGameSession(
  sessionId: string,
  updates: Partial<GameSession>
): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from('game_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating game session:', error);
    return null;
  }

  return data;
}

export async function addGuessToSession(
  sessionId: string,
  guess: Guess
): Promise<GameSession | null> {
  // First, get the current session
  const { data: session, error: fetchError } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchError || !session) {
    console.error('Error fetching session:', fetchError);
    return null;
  }

  // Add the new guess
  const updatedGuesses = [...(session.guesses as Guess[]), guess];
  const attempts = updatedGuesses.length;
  const won = guess.isWithinRange;
  const accuracy = won ? guess.accuracy : null;

  // Update the session
  const { data, error } = await supabase
    .from('game_sessions')
    .update({
      guesses: updatedGuesses,
      attempts,
      won,
      accuracy,
      completed_at: won || attempts >= 6 ? new Date().toISOString() : null,
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating session with guess:', error);
    return null;
  }

  return data;
}

// Leaderboard functions
export async function getTodaysLeaderboard(): Promise<LeaderboardEntry[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .eq('date', today)
    .order('accuracy', { ascending: false })
    .order('attempts', { ascending: true })
    .limit(100);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data || [];
}

export async function addLeaderboardEntry(
  userId: string,
  accuracy: number,
  attempts: number
): Promise<LeaderboardEntry | null> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .insert({
      user_id: userId,
      date: today,
      accuracy,
      attempts,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding leaderboard entry:', error);
    return null;
  }

  return data;
}

// User stats functions
export async function getUserStats(userId: string) {
  const { data: sessions, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !sessions) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  const totalGames = sessions.length;
  const gamesWon = sessions.filter(s => s.won).length;
  const winRate = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0;
  
  const wonSessions = sessions.filter(s => s.won && s.accuracy !== null);
  const averageAccuracy = wonSessions.length > 0
    ? wonSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / wonSessions.length
    : 0;
  
  const averageAttempts = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.attempts, 0) / sessions.length
    : 0;

  return {
    total_games: totalGames,
    games_won: gamesWon,
    win_rate: winRate,
    average_accuracy: averageAccuracy,
    average_attempts: averageAttempts,
  };
}