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
        console.log(`[Image API] Found image data, size: ${image.image_data.length}`);
        
        try {
          // The image_data might already be base64 or it might be a hex string
          let imageBuffer: Buffer;
          
          // Check if it starts with typical base64 image prefix
          if (image.image_data.startsWith('data:image')) {
            // Extract base64 data from data URL
            const base64Data = image.image_data.split(',')[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
          } else if (image.image_data.startsWith('/9j/') || image.image_data.startsWith('iVBORw0')) {
            // Raw base64 data
            imageBuffer = Buffer.from(image.image_data, 'base64');
          } else if (image.image_data.startsWith('\\x')) {
            // PostgreSQL bytea hex format
            const hexString = image.image_data.slice(2);
            imageBuffer = Buffer.from(hexString, 'hex');
          } else {
            // Try base64 by default
            imageBuffer = Buffer.from(image.image_data, 'base64');
          }
          
          // Detect image type from buffer
          let contentType = 'image/jpeg';
          if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
            contentType = 'image/png';
          } else if (imageBuffer[0] === 0x47 && imageBuffer[1] === 0x49) {
            contentType = 'image/gif';
          } else if (imageBuffer[0] === 0x52 && imageBuffer[1] === 0x49) {
            contentType = 'image/webp';
          }
          
          console.log(`[Image API] Returning image, type: ${contentType}, size: ${imageBuffer.length}`);
          
          // Return image with proper headers
          return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Length': imageBuffer.length.toString(),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        } catch (bufferError) {
          console.error(`[Image API] Error processing image buffer:`, bufferError);
          // Fall through to URL fallback
        }
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
        try {
          // Process mock image data
          let imageBuffer: Buffer;
          
          if (categoryMock.image_data.startsWith('data:image')) {
            const base64Data = categoryMock.image_data.split(',')[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
          } else if (categoryMock.image_data.startsWith('\\x')) {
            const hexString = categoryMock.image_data.slice(2);
            imageBuffer = Buffer.from(hexString, 'hex');
          } else {
            imageBuffer = Buffer.from(categoryMock.image_data, 'base64');
          }
          
          // Return mock image with proper headers
          return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/png',
              'Content-Length': imageBuffer.length.toString(),
              'Cache-Control': 'public, max-age=86400', // 24 hours for mocks
            },
          });
        } catch (bufferError) {
          console.error(`[Image API] Error processing mock image:`, bufferError);
        }
      } else {
        console.log(`[Image API] No category mock found:`, mockError);
      }
    }
    
    // Log what happened for debugging
    console.error(`[Image API] No image found for item ${itemId}: no item_image_id, no URL at index ${imageIndex}, no category mock`);
    
    // Return a 1x1 transparent PNG as fallback
    const transparentPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return new NextResponse(transparentPng, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[Image API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}