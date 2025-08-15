
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { generateImage } from './services/geminiService';
import { DeviceType } from './types';
import { DEVICE_ASPECT_RATIOS } from './constants';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const aspectRatio = DEVICE_ASPECT_RATIOS[device];
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, device, isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <Header />
        <main className="mt-8">
          <PromptForm
            prompt={prompt}
            setPrompt={setPrompt}
            device={device}
            setDevice={setDevice}
            isLoading={isLoading}
            onGenerate={handleGenerate}
          />
          <ImageDisplay
            image={generatedImage}
            isLoading={isLoading}
            error={error}
            device={device}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
