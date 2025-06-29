import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateMockPlayers } from '@/utils/mock-players';

// Create Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const timeframe = searchParams.get('timeframe') || 'all';

    // Build query
    let query = supabase
      .from('leaderboard_entries')
      .select('*')
      .order('accuracy', { ascending: false })
      .order('attempts', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply timeframe filter
    if (timeframe !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (timeframe) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      query = query.gte('created_at', startDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Leaderboard fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    // Process the data to get unique players (best score per player)
    const uniquePlayers = new Map<string, any>();
    
    if (data && data.length > 0) {
      // Group by username and keep only the best score (highest accuracy, lowest attempts)
      data.forEach(entry => {
        const existing = uniquePlayers.get(entry.username);
        
        if (!existing || 
            entry.accuracy > existing.accuracy || 
            (entry.accuracy === existing.accuracy && entry.attempts < existing.attempts)) {
          uniquePlayers.set(entry.username, entry);
        }
      });
    }

    // Convert map to array and add score calculation
    let leaderboardData = Array.from(uniquePlayers.values()).map(entry => ({
      ...entry,
      score: 1000 - (120 * entry.attempts) // Calculate score from attempts
    }));
    
    // Sort by score (descending) then accuracy (descending) then attempts (ascending)
    leaderboardData.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.attempts - b.attempts;
    });

    // Get the lowest real player accuracy (if any)
    const lowestRealAccuracy = leaderboardData.length > 0 
      ? Math.min(...leaderboardData.map(p => p.accuracy))
      : 0;

    // Generate mock players if needed
    if (leaderboardData.length === 0) {
      // No real players - generate exactly 7 mock players
      const mockPlayers = generateMockPlayers(7, 95);
      leaderboardData = mockPlayers.map((mock, index) => ({
        id: `mock-${index}`,
        username: mock.username,
        accuracy: mock.accuracy,
        attempts: mock.attempts,
        item_name: mock.item_name,
        item_price: mock.item_price,
        score: 1000 - (120 * mock.attempts), // Calculate score from attempts
        created_at: new Date().toISOString(),
        is_mock: true
      }));
    } else if (leaderboardData.length < 18) {
      // Add mock players to fill up to 18 total
      const mockCount = 18 - leaderboardData.length;
      const mockPlayers = generateMockPlayers(mockCount, Math.max(50, lowestRealAccuracy - 5));
      
      const mockEntries = mockPlayers.map((mock, index) => ({
        id: `mock-${index}`,
        username: mock.username,
        accuracy: mock.accuracy,
        attempts: mock.attempts,
        item_name: mock.item_name,
        item_price: mock.item_price,
        score: 1000 - (120 * mock.attempts), // Calculate score from attempts
        created_at: new Date().toISOString(),
        is_mock: true
      }));
      
      leaderboardData = [...leaderboardData, ...mockEntries];
      
      // Re-sort after adding mock players
      leaderboardData.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
        return a.attempts - b.attempts;
      });
    }

    return NextResponse.json({ data: leaderboardData }, { status: 200 });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      username, 
      game_session_id,
      accuracy, 
      attempts, 
      item_name,
      item_price 
    } = body;
    
    if (!username || accuracy === undefined || !attempts || !item_name || item_price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate accuracy and attempts
    if (accuracy < 0 || accuracy > 100) {
      return NextResponse.json(
        { error: 'Invalid accuracy value' },
        { status: 400 }
      );
    }

    if (attempts < 1 || attempts > 6) {
      return NextResponse.json(
        { error: 'Invalid attempts value' },
        { status: 400 }
      );
    }

    // Create leaderboard entry
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .insert({
        username,
        game_session_id,
        accuracy,
        attempts,
        item_name,
        item_price,
      })
      .select()
      .single();

    if (error) {
      console.error('Leaderboard submission error:', error);
      return NextResponse.json(
        { error: 'Failed to submit score' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Leaderboard submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}