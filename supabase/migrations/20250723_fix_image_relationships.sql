-- Fix Image Relationships Migration

-- 1. Add item_image_id to items table for direct 1:1 relationship
ALTER TABLE items 
ADD COLUMN item_image_id UUID REFERENCES item_images(id) ON DELETE SET NULL;

-- 2. Create index for performance
CREATE INDEX idx_items_item_image_id ON items(item_image_id);

-- 3. Migrate existing relationships (if any exist)
-- This will set item_image_id for items that have images in item_images table
UPDATE items 
SET item_image_id = (
  SELECT id 
  FROM item_images 
  WHERE item_images.item_id = items.id 
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 
  FROM item_images 
  WHERE item_images.item_id = items.id
);

-- 4. Drop the redundant unique constraint
DROP INDEX IF EXISTS unique_item_image;

-- 5. Remove redundant item_id column from item_images
-- This removes the circular dependency
ALTER TABLE item_images DROP COLUMN item_id;

-- 6. Add comment for documentation
COMMENT ON COLUMN items.item_image_id IS 'Direct reference to item image in item_images table. If NULL, fallback to images[] URLs.';