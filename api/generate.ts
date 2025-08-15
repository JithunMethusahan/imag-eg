import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// This function is a Vercel Serverless Function
// It runs on the server, not in the browser.

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. Get the API Key from Vercel Environment Variables
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This error will be logged in your Vercel dashboard.
    console.error('API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error: API key not found.' });
  }
  
  // 2. We only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 3. Parse prompt and aspect ratio from the request body sent by the frontend
    const { prompt, aspectRatio } = req.body;
    if (!prompt || !aspectRatio) {
      return res.status(400).json({ error: 'Missing prompt or aspectRatio in request body' });
    }

    // 4. Initialize the Google GenAI client on the server
    const ai = new GoogleGenAI({ apiKey });

    // 5. Call the Gemini API to generate the image
    const fullPrompt = `A beautiful, high-resolution, ultra-detailed wallpaper of: ${prompt}`;
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    // 6. Process the response and send the image data back to the frontend
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      return res.status(200).json({ imageUrl });
    } else {
      throw new Error('Image generation failed: No images were returned from the API.');
    }
  } catch (error) {
    // 7. Handle any errors that occur during the process
    console.error('Error in Vercel function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return res.status(500).json({ error: `Server error: ${errorMessage}` });
  }
}
