-- Add new columns to items table for hints structure
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS basic_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hint_1 TEXT,
ADD COLUMN IF NOT EXISTS hint_2 TEXT,
ADD COLUMN IF NOT EXISTS hint_3 TEXT,
ADD COLUMN IF NOT EXISTS hint_4 TEXT,
ADD COLUMN IF NOT EXISTS hint_5 TEXT;

-- Example of what basic_info might contain:
-- For cars: {"year": 2024, "type": "Luxury sedan", "powertrain": "Electric"}
-- For watches: {"movement": "Automatic", "case_size": "41mm", "water_resistance": "100m"}
-- For houses: {"bedrooms": 4, "bathrooms": 3, "square_feet": 2500, "lot_size": "0.5 acres"}
-- For art: {"artist": "Van Gogh", "year": 1889, "medium": "Oil on canvas", "dimensions": "73.7 × 92.1 cm"}

-- Update existing items to move metadata to basic_info (if you want to migrate existing data)
UPDATE items 
SET basic_info = metadata 
WHERE metadata IS NOT NULL AND basic_info = '{}';

-- You can also update existing items with hints if needed
-- Example for a specific item:
-- UPDATE items 
-- SET 
--   hint_1 = 'This luxury vehicle is known for its minimalist interior design',
--   hint_2 = 'It was one of the first mass-produced electric vehicles to exceed 300 miles of range',
--   hint_3 = 'The company that makes it is also known for space exploration',
--   hint_4 = 'Its CEO is known for his activity on social media platform X',
--   hint_5 = 'The Plaid version can accelerate from 0-60 mph in under 2 seconds'
-- WHERE name = 'Model S' AND brand = 'Tesla';