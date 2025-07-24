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
  let itemId: string = '';
  
  try {
    const params = await context.params;
    itemId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const imageIndex = parseInt(searchParams.get('index') || '0');
    
    console.log(`[Image API] Fetching image for item ${itemId}, index ${imageIndex}`);
    
    // First, get the item with its image reference
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('item_image_id, images, category_id')
      .eq('id', itemId)
      .single();
    
    if (itemError || !item) {
      console.error('[Image API] Item not found:', itemId, itemError);
      return NextResponse.json(
        { error: 'Item not found', details: itemError?.message },
        { status: 404 }
      );
    }
    
    console.log(`[Image API] Item found:`, {
      item_image_id: item.item_image_id,
      has_images: !!item.images,
      images_count: item.images?.length || 0
    });
    
    // 1. If item has direct image reference, use it
    if (item.item_image_id) {
      console.log(`[Image API] Fetching from item_images table with id: ${item.item_image_id}`);
      const { data: image, error: imageError } = await supabase
        .from('item_images')
        .select('image_data')
        .eq('id', item.item_image_id)
        .single();
      
      if (!imageError && image && image.image_data) {
        console.log(`[Image API] Found image data, returning binary`);
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(image.image_data, 'base64');
        
        // Return image with proper headers
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } else {
        console.error(`[Image API] Failed to fetch image data:`, imageError);
      }
    }
    
    // 2. Fallback to URL if available
    if (item.images && Array.isArray(item.images) && item.images[imageIndex]) {
      console.log(`[Image API] Redirecting to URL: ${item.images[imageIndex]}`);
      // Redirect to the external URL
      return NextResponse.redirect(item.images[imageIndex]);
    }
    
    // 3. Try category mock image
    if (item.category_id) {
      console.log(`[Image API] Trying category mock for category: ${item.category_id}`);
      const { data: categoryMock, error: mockError } = await supabase
        .from('category_mock_images')
        .select('image_data')
        .eq('category_id', item.category_id)
        .single();
      
      if (!mockError && categoryMock && categoryMock.image_data) {
        console.log(`[Image API] Found category mock image`);
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(categoryMock.image_data, 'base64');
        
        // Return mock image with proper headers
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400', // 24 hours for mocks
          },
        });
      } else {
        console.log(`[Image API] No category mock found:`, mockError);
      }
    }
    
    // Log what happened for debugging
    console.error(`[Image API] No image found for item ${itemId}: no item_image_id, no URL at index ${imageIndex}, no category mock`);
    
    // Return 404 if no image found
    return NextResponse.json(
      { 
        error: 'Image not found',
        debug: {
          itemId,
          item_image_id: item.item_image_id,
          has_images: !!item.images,
          images_count: item.images?.length || 0,
          category_id: item.category_id
        }
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('[Image API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}