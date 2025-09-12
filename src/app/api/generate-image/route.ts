import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure fal.ai client with API key
fal.config({
  credentials: process.env.FAL_KEY!,
});

/**
 * API endpoint to generate or edit images using Google's Nano Banana (Gemini 2.5 Flash) via fal.ai
 * Supports both text-to-image generation and image editing with prompts
 */
export async function POST(request: NextRequest) {
  try {
    // Extract prompt and optional image data from request body
    const { prompt, imageData } = await request.json();

    // Validate that prompt is provided
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Prepare the request payload for fal.ai
    const input: any = {
      prompt: prompt,
      num_images: 1,
      output_format: 'jpeg',
    };

    // Choose the correct endpoint based on whether we have a reference image
    const endpoint = imageData ? 'fal-ai/gemini-25-flash-image/edit' : 'fal-ai/gemini-25-flash-image';
    
    // If an existing image is provided, handle it appropriately
    if (imageData) {
      try {
        // Check if it's a base64 data URL or already a regular URL
        if (imageData.startsWith('data:')) {
          // Convert base64 data URL to blob and upload to fal.ai storage
          const base64Data = imageData.split(',')[1];
          const mimeType = imageData.split(',')[0].split(':')[1].split(';')[0];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          
          // Upload to fal.ai storage and get URL
          const imageUrl = await fal.storage.upload(blob);
          input.image_urls = [imageUrl];
        } else {
          // It's already a URL (from previous fal.ai generation), use it directly
          input.image_urls = [imageData];
        }
      } catch (uploadError) {
        console.error('Failed to process image data:', uploadError);
        throw new Error('Failed to process reference image');
      }
    }

    // Call fal.ai's Gemini 2.5 Flash Image model
    const result = await fal.subscribe(endpoint, {
      input: input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Image generation in progress...');
        }
      },
    });

    // Check if the result contains images
    if (!result.data.images || result.data.images.length === 0) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    // Get the first generated image URL
    const generatedImageUrl = result.data.images[0].url;

    // Return the generated image URL and original prompt
    return NextResponse.json({
      imageUrl: generatedImageUrl,
      prompt: prompt
    });

  } catch (error: any) {
    // Log the error for debugging purposes
    console.error('Error generating image:', error);
    
    // Return user-friendly error response
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}