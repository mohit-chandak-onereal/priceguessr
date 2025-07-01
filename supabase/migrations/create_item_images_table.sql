-- Create item_images table for storing actual image data
CREATE TABLE IF NOT EXISTS public.item_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  image_data BYTEA NOT NULL,
  mime_type VARCHAR(50) DEFAULT 'image/jpeg',
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partial unique index to ensure only one primary image per item
CREATE UNIQUE INDEX unique_item_primary_image ON public.item_images(item_id) WHERE is_primary = true;

-- Create index for faster lookups
CREATE INDEX idx_item_images_item_id ON public.item_images(item_id);
CREATE INDEX idx_item_images_display_order ON public.item_images(item_id, display_order);

-- Enable Row Level Security
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to item images" ON public.item_images
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update (for admin)
CREATE POLICY "Allow authenticated users to manage item images" ON public.item_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Add comment
COMMENT ON TABLE public.item_images IS 'Stores actual image data for items with fallback to URLs in items table';