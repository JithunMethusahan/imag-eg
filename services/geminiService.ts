
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume the key is set.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'MISSING_API_KEY' });

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    console.log(`Generating image with prompt: "${prompt}" and aspect ratio: ${aspectRatio}`);
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `A beautiful, high-resolution, ultra-detailed wallpaper of: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error('Image generation failed: No images were returned.');
    }
  } catch (error) {
    console.error('Error generating image with Gemini API:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during image generation.');
  }
};
