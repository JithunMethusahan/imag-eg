
import React from 'react';
import { DeviceType } from '../types';
import { ImageIcon, DownloadIcon } from './Icon';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
  device: DeviceType;
}

const aspectRatios: Record<DeviceType, string> = {
  desktop: 'aspect-w-16 aspect-h-9',
  tablet: 'aspect-w-4 aspect-h-3',
  phone: 'aspect-w-9 aspect-h-16',
};

const LoadingSkeleton: React.FC<{ device: DeviceType }> = ({ device }) => (
  <div className={`w-full max-w-xl mx-auto ${aspectRatios[device]}`}>
    <div className="w-full h-full bg-gray-700 rounded-lg animate-pulse"></div>
  </div>
);

const InitialPlaceholder: React.FC<{ device: DeviceType }> = ({ device }) => (
  <div className={`w-full max-w-xl mx-auto ${aspectRatios[device]}`}>
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg text-gray-500">
      <ImageIcon className="w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold">Your wallpaper will appear here</h3>
      <p className="mt-1 text-sm">Enter a prompt above and click generate!</p>
    </div>
  </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, error, device }) => {
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'ai-wallpaper.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="mt-8 py-8">
      {isLoading && <LoadingSkeleton device={device} />}
      
      {error && !isLoading && (
        <div className="w-full max-w-xl mx-auto p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
          <p className="font-semibold">Generation Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!isLoading && !error && !image && <InitialPlaceholder device={device} />}

      {image && !isLoading && !error && (
        <div className="relative group w-full max-w-xl mx-auto">
           <div className={`${aspectRatios[device]}`}>
            <img 
              src={image} 
              alt="Generated AI wallpaper" 
              className="w-full h-full object-cover rounded-lg shadow-2xl transition-all duration-500"
            />
          </div>
          <button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
          >
            <DownloadIcon className="w-5 h-5" />
            Download
          </button>
        </div>
      )}
    </div>
  );
};
