
import React from 'react';
import { DeviceType } from '../types';
import { DesktopIcon, TabletIcon, PhoneIcon, SparklesIcon } from './Icon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

const deviceOptions: { name: DeviceType; icon: React.ReactNode }[] = [
  { name: 'desktop', icon: <DesktopIcon className="w-5 h-5" /> },
  { name: 'tablet', icon: <TabletIcon className="w-5 h-5" /> },
  { name: 'phone', icon: <PhoneIcon className="w-5 h-5" /> },
];

export const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  setPrompt,
  device,
  setDevice,
  isLoading,
  onGenerate,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A serene Japanese garden with a cherry blossom tree under a full moon"
          className="w-full h-28 p-3 bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          required
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-full shadow-md">
          {deviceOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setDevice(option.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                device === option.name
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-transparent text-gray-400 hover:bg-gray-700'
              }`}
            >
              {option.icon}
              <span className="capitalize">{option.name}</span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5"/>
              Generate
            </>
          )}
        </button>
      </div>
    </form>
  );
};
