-- Normalize Database Schema Migration

-- 1. Remove redundant columns from items table
ALTER TABLE items 
DROP COLUMN IF EXISTS ai_hints,
DROP COLUMN IF EXISTS basic_info;

-- 2. Update item_images to be properly linked
-- First, let's add a constraint to ensure item_images can only have one image per item
-- (since you mentioned one item = one image)
DROP INDEX IF EXISTS unique_item_primary_image;
DROP INDEX IF EXISTS idx_item_images_display_order;

ALTER TABLE item_images
DROP COLUMN IF EXISTS is_primary,
DROP COLUMN IF EXISTS display_order,
DROP COLUMN IF EXISTS mime_type;

-- Add unique constraint to ensure one image per item
CREATE UNIQUE INDEX unique_item_image ON item_images(item_id);

-- 3. Create achievements tables
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10),
  condition_type VARCHAR(50) NOT NULL, -- 'accuracy', 'speed', 'streak', 'category', 'item_value'
  condition_value JSONB NOT NULL, -- flexible storage for conditions
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE SET NULL,
  UNIQUE(user_id, achievement_id)
);

-- 4. Create user statistics table for better performance
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_games INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  total_accuracy DECIMAL(10, 2) DEFAULT 0,
  best_accuracy DECIMAL(5, 2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  category_stats JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Update leaderboard_entries to remove redundancy
ALTER TABLE leaderboard_entries
DROP COLUMN IF EXISTS username,
DROP COLUMN IF EXISTS item_name,
DROP COLUMN IF EXISTS item_price,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- 6. Add missing indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_code ON achievements(code);
CREATE INDEX IF NOT EXISTS idx_leaderboard_category ON leaderboard_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_won ON game_sessions(won) WHERE won = true;

-- 7. Create function to update user stats after game completion
CREATE OR REPLACE FUNCTION update_user_stats_on_game_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if game is completed
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- Update or insert user stats
    INSERT INTO user_stats (
      user_id,
      total_games,
      games_won,
      total_accuracy,
      best_accuracy,
      current_streak,
      last_played_at
    )
    VALUES (
      NEW.user_id,
      1,
      CASE WHEN NEW.won THEN 1 ELSE 0 END,
      COALESCE(NEW.accuracy, 0),
      COALESCE(NEW.accuracy, 0),
      CASE WHEN NEW.won THEN 1 ELSE 0 END,
      NEW.completed_at
    )
    ON CONFLICT (user_id) DO UPDATE SET
      total_games = user_stats.total_games + 1,
      games_won = user_stats.games_won + CASE WHEN NEW.won THEN 1 ELSE 0 END,
      total_accuracy = user_stats.total_accuracy + COALESCE(NEW.accuracy, 0),
      best_accuracy = GREATEST(user_stats.best_accuracy, COALESCE(NEW.accuracy, 0)),
      current_streak = CASE 
        WHEN NEW.won THEN user_stats.current_streak + 1 
        ELSE 0 
      END,
      best_streak = GREATEST(
        user_stats.best_streak, 
        CASE WHEN NEW.won THEN user_stats.current_streak + 1 ELSE user_stats.current_streak END
      ),
      last_played_at = NEW.completed_at,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger for user stats
DROP TRIGGER IF EXISTS trigger_update_user_stats ON game_sessions;
CREATE TRIGGER trigger_update_user_stats
AFTER UPDATE ON game_sessions
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_on_game_complete();

-- 9. Insert default achievements
INSERT INTO achievements (code, name, description, icon, condition_type, condition_value, points) VALUES
('first_win', 'First Victory', 'Win your first game', '🎉', 'wins', '{"count": 1}', 10),
('perfect_guess', 'Bulls Eye', 'Guess the exact price', '🎯', 'accuracy', '{"equals": 100}', 50),
('speed_demon', 'Speed Demon', 'Win in under 30 seconds', '⚡', 'time', '{"max_seconds": 30}', 30),
('hot_streak_5', 'On Fire', 'Win 5 games in a row', '🔥', 'streak', '{"count": 5}', 25),
('hot_streak_10', 'Unstoppable', 'Win 10 games in a row', '🌟', 'streak', '{"count": 10}', 50),
('category_master', 'Category Master', 'Win 10 games in a single category', '🏆', 'category_wins', '{"count": 10}', 30),
('high_roller', 'High Roller', 'Correctly guess an item over $100,000', '💎', 'item_value', '{"min": 100000}', 40),
('bargain_hunter', 'Bargain Hunter', 'Win 5 games with items under $50', '🛍️', 'item_value_wins', '{"max": 50, "count": 5}', 20),
('quick_learner', 'Quick Learner', 'Win within 2 attempts', '🧠', 'attempts', '{"max": 2}', 20),
('persistent', 'Never Give Up', 'Win on your 6th attempt', '💪', 'attempts', '{"equals": 6}', 15)
ON CONFLICT (code) DO NOTHING;

-- 10. Enable RLS for new tables
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- 12. Add comments for documentation
COMMENT ON TABLE user_stats IS 'Aggregated statistics for each user, updated via trigger';
COMMENT ON TABLE achievements IS 'Master list of all available achievements';
COMMENT ON TABLE user_achievements IS 'Tracks which achievements each user has unlocked';
COMMENT ON COLUMN items.metadata IS 'Flexible storage for item-specific attributes (year, material, location, etc)';
COMMENT ON COLUMN items.description IS 'Full text description of the item';