-- Add new columns to items table for hints structure
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS basic_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hint_1 TEXT,
ADD COLUMN IF NOT EXISTS hint_2 TEXT,
ADD COLUMN IF NOT EXISTS hint_3 TEXT,
ADD COLUMN IF NOT EXISTS hint_4 TEXT,
ADD COLUMN IF NOT EXISTS hint_5 TEXT;

-- Migrate existing metadata to basic_info
UPDATE items 
SET basic_info = metadata 
WHERE metadata IS NOT NULL AND basic_info = '{}';

-- Add comments for documentation
COMMENT ON COLUMN items.basic_info IS 'Flexible JSON storage for item-specific metadata (e.g., year, size, material)';
COMMENT ON COLUMN items.hint_1 IS 'First hint revealed after initial guess';
COMMENT ON COLUMN items.hint_2 IS 'Second hint revealed after second guess';
COMMENT ON COLUMN items.hint_3 IS 'Third hint revealed after third guess';
COMMENT ON COLUMN items.hint_4 IS 'Fourth hint revealed after fourth guess';
COMMENT ON COLUMN items.hint_5 IS 'Final hint revealed after fifth guess';