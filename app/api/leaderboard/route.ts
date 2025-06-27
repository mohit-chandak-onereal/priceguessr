import { NextRequest, NextResponse } from 'next/server';

// For now, we'll use a mock implementation until Supabase is set up
// This will store data in memory (resets on server restart)

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  accuracy: number;
  attempts: number;
  category_name: string;
  item_name: string;
  created_at: string;
}

let mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    player_name: 'PriceNinja',
    score: 9850,
    accuracy: 99.2,
    attempts: 1,
    category_name: 'Watches',
    item_name: 'Rolex Submariner',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    player_name: 'GuessGuru',
    score: 8720,
    accuracy: 96.5,
    attempts: 2,
    category_name: 'Cars',
    item_name: '911 Turbo S',
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    // const timeframe = searchParams.get('timeframe'); // TODO: implement timeframe filtering

    // Filter by category if provided
    let results = [...mockLeaderboard];
    if (category) {
      results = results.filter(entry => entry.category_name === category);
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Limit results
    results = results.slice(0, limit);

    return NextResponse.json({ data: results }, { status: 200 });
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
    const { player_name, score, accuracy, attempts, category_name, item_name } = body;
    
    if (!player_name || score === undefined || !category_name || !item_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new leaderboard entry
    const newEntry = {
      id: Date.now().toString(),
      player_name,
      score,
      accuracy,
      attempts,
      category_name,
      item_name,
      created_at: new Date().toISOString(),
    };

    // Add to mock leaderboard
    mockLeaderboard.push(newEntry);

    // Keep only top 1000 entries
    mockLeaderboard.sort((a, b) => b.score - a.score);
    mockLeaderboard = mockLeaderboard.slice(0, 1000);

    return NextResponse.json({ data: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Leaderboard submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}