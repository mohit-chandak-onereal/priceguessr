import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const itemId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const imageIndex = parseInt(searchParams.get('index') || '0');
    
    // First, try to get image from item_images table
    const { data: images, error } = await supabase
      .from('item_images')
      .select('image_data, mime_type')
      .eq('item_id', itemId)
      .order('is_primary', { ascending: false })
      .order('display_order', { ascending: true });
    
    if (!error && images && images.length > 0) {
      // Get the requested image or first one
      const image = images[Math.min(imageIndex, images.length - 1)];
      
      if (image.image_data) {
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(image.image_data, 'base64');
        
        // Return image with proper headers
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': image.mime_type || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }
    
    // Second, try to get category mock image
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('category_id, images')
      .eq('id', itemId)
      .single();
    
    if (!itemError && item && item.category_id) {
      // Check for category mock image
      const { data: categoryMock, error: mockError } = await supabase
        .from('category_mock_images')
        .select('image_data, mime_type')
        .eq('category_id', item.category_id)
        .single();
      
      if (!mockError && categoryMock && categoryMock.image_data) {
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(categoryMock.image_data, 'base64');
        
        // Return mock image with proper headers
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': categoryMock.mime_type || 'image/png',
            'Cache-Control': 'public, max-age=86400', // 24 hours for mocks
          },
        });
      }
      
      // Finally, fallback to URL if available
      if (item.images && item.images[imageIndex]) {
        // Redirect to the external URL
        return NextResponse.redirect(item.images[imageIndex]);
      }
    }
    
    // Return 404 if no image found
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}